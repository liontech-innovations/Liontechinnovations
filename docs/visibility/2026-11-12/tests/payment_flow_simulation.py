"""Local payment-fulfilment model, not a Stripe integration.

No API keys, network calls or customer data. Run with Python 3.10+.
Payment status is an assumed trusted server-side input. This model DOES NOT
verify webhook signatures, charge cards, send emails or prove exactly-once
external delivery. It demonstrates transactional intent and deduplication.
"""
from __future__ import annotations
import json
import sqlite3
import tempfile
from contextlib import closing
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass
from pathlib import Path

@dataclass(frozen=True)
class Event:
    event_id: str
    session_id: str
    status: str  # Simplified simulated provider state: unpaid, paid or failed.

def initialise(path: Path) -> None:
    with closing(sqlite3.connect(path)) as db:
        db.executescript('''
        CREATE TABLE events (id TEXT PRIMARY KEY);
        CREATE TABLE orders (session_id TEXT PRIMARY KEY, state TEXT NOT NULL);
        CREATE TABLE outbox (session_id TEXT PRIMARY KEY, action TEXT NOT NULL);
        ''')

def receive(path: Path, event: Event, fail_before_commit: bool = False) -> str:
    if not event.event_id or not event.session_id or event.status not in {'unpaid','paid','failed'}:
        raise ValueError('Unsupported simulated event')
    db = sqlite3.connect(path, timeout=10, isolation_level=None)
    try:
        db.execute('BEGIN IMMEDIATE')
        if db.execute('SELECT 1 FROM events WHERE id=?', (event.event_id,)).fetchone():
            db.commit()
            return 'duplicate_event'
        db.execute('INSERT INTO events VALUES (?)', (event.event_id,))
        existing = db.execute('SELECT state FROM orders WHERE session_id=?', (event.session_id,)).fetchone()
        state = 'paid' if event.status == 'paid' or (existing and existing[0] == 'paid') else event.status
        db.execute('INSERT INTO orders VALUES (?,?) ON CONFLICT(session_id) DO UPDATE SET state=excluded.state',
                   (event.session_id, state))
        if state == 'paid':
            db.execute('INSERT OR IGNORE INTO outbox VALUES (?,?)', (event.session_id, 'grant_access'))
        if fail_before_commit:
            raise RuntimeError('Injected failure before transaction commit')
        db.commit()
        return 'committed'
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

def snapshot(path: Path) -> dict:
    with closing(sqlite3.connect(path)) as db:
        return {
            'processed_events': db.execute('SELECT COUNT(*) FROM events').fetchone()[0],
            'fulfilment_intents': db.execute('SELECT COUNT(*) FROM outbox').fetchone()[0],
            'orders': dict(db.execute('SELECT session_id,state FROM orders').fetchall()),
        }

def run_tests() -> dict:
    results = []
    with tempfile.TemporaryDirectory() as folder:
        def case(name: str):
            path = Path(folder) / (str(len(results)) + '.sqlite')
            initialise(path)
            return path
        def record(name: str, path: Path, condition: bool):
            if not condition:
                raise AssertionError(name + ': ' + str(snapshot(path)))
            results.append({'case': name, 'result': 'PASS', **snapshot(path)})
        name = 'Paid server event without a browser return'; p=case(name)
        receive(p, Event('e1','s1','paid'))
        record(name,p,snapshot(p)['fulfilment_intents']==1)
        name = 'Same event delivered twice'; p=case(name)
        receive(p,Event('e1','s1','paid')); receive(p,Event('e1','s1','paid'))
        record(name,p,snapshot(p)['processed_events']==1 and snapshot(p)['fulfilment_intents']==1)
        name = 'Different paid events for the same session'; p=case(name)
        receive(p,Event('e1','s1','paid')); receive(p,Event('e2','s1','paid'))
        record(name,p,snapshot(p)['processed_events']==2 and snapshot(p)['fulfilment_intents']==1)
        name = 'Delayed payment: unpaid then paid'; p=case(name)
        receive(p,Event('e1','s1','unpaid')); assert snapshot(p)['fulfilment_intents']==0
        receive(p,Event('e2','s1','paid'))
        record(name,p,snapshot(p)['fulfilment_intents']==1)
        name = 'Unpaid completion alone does not fulfil'; p=case(name)
        receive(p,Event('e1','s1','unpaid'))
        record(name,p,snapshot(p)['fulfilment_intents']==0)
        name = 'Late failed event does not undo a paid state'; p=case(name)
        receive(p,Event('e1','s1','paid')); receive(p,Event('e2','s1','failed'))
        record(name,p,snapshot(p)['orders']['s1']=='paid' and snapshot(p)['fulfilment_intents']==1)
        name = 'Failure before commit then retry'; p=case(name)
        try: receive(p,Event('e1','s1','paid'),fail_before_commit=True)
        except RuntimeError: pass
        assert snapshot(p)['processed_events']==0 and snapshot(p)['fulfilment_intents']==0
        receive(p,Event('e1','s1','paid'))
        record(name,p,snapshot(p)['processed_events']==1 and snapshot(p)['fulfilment_intents']==1)
        name = 'Eight concurrent deliveries for one session'; p=case(name)
        with ThreadPoolExecutor(max_workers=8) as pool:
            list(pool.map(lambda i: receive(p,Event(f'e{i}','s1','paid')),range(8)))
        record(name,p,snapshot(p)['processed_events']==8 and snapshot(p)['fulfilment_intents']==1)
    return {
        'scope': 'Local Python/SQLite simulation; no Stripe API or production integration tested',
        'pass_count': len(results), 'fail_count': 0, 'cases': results,
        'limits': ['No cryptographic verification tested','No live network, database service or payment tested',
                   'Unique outbox intent is not a guarantee of exactly-once external delivery',
                   'Refunds, disputes, subscriptions and separate payment attempts are outside this model']
    }
if __name__ == '__main__':
    print(json.dumps(run_tests(), indent=2))
