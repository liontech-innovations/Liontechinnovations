# A successful checkout is not a fulfilled order: eight tests worth running

Freejoy Chimbizi, Founder, Lion Tech Innovations Ltd

Published and reviewed: 12 November 2026

Eight reproducible local tests for duplicate events, delayed payment and transactional fulfilment, with clear limits and links to Stripe’s guidance.

These results describe a local Python/SQLite simulation using synthetic records. They do not certify a live Stripe integration or establish exactly-once external delivery.

A customer can pay successfully while the application fails to grant access, record the order or start delivery. The payment screen is one part of the journey. We built a small, reproducible model to examine the hand-off between a server event and a fulfilment instruction. It uses synthetic records, not customer transactions.

## Do not make the customer’s browser the only trigger

Stripe’s integration guidance recommends handling payment events on the server rather than relying only on a customer returning to a landing page. It also distinguishes completed Checkout sessions from delayed payment success and failure events. [1]

For a business owner, the practical question is straightforward: what happens after payment if the browser closes? A confirmation page can explain the outcome to the customer, but the application still needs a reliable way to establish the payment state and perform the agreed next action.


## Define the claim before writing the test

Our experiment models a single purchase associated with one checkout session. It records three things in SQLite: processed event identifiers, the order state and an outbox instruction to grant access. The outbox is a durable record of intended work; it does not send an email or activate a real account.

The core rule is that one paid session can produce no more than one fulfilment instruction. We use a unique key on the session and a database transaction covering the event record, state change and instruction. A failed transaction rolls all three back together.

This is deliberately narrower than a production payment integration. It assumes that payment status has already been obtained from a trusted server-side source. It does not verify signatures, contact Stripe, charge a card or prove delivery by an external system.


## The eight scenarios and observed results

We ran the included Python test programme on 12 November 2026. All eight assertions passed in the local model. The output includes each scenario’s processed-event count, final order state and fulfilment-instruction count. These are results from this particular implementation, not industry performance statistics.

- A paid server event with no browser return produced one fulfilment instruction.
- The same event delivered twice produced one processed-event record and one instruction.
- Two different paid events for the same session produced two event records but only one instruction.
- An unpaid completion followed by a paid confirmation produced no instruction before payment and one afterwards.
- An unpaid completion without a later payment produced no fulfilment instruction.
- A late failed event did not overwrite an already paid state or create another instruction.
- An injected failure before commit left no partial records; retrying produced one complete result.
- Eight concurrent deliveries for the same session produced eight event records and one instruction.

## Why duplicate-event checks are not the whole design

Stripe documents possible duplicate deliveries and does not guarantee event ordering. Its guidance also covers verifying webhook signatures and responding promptly to accepted deliveries. Those are production integration requirements, not features established by our simulation. [2]

In our model, deduplicating only the event identifier would not protect the business action when two distinct events refer to the same purchase. That is why the third scenario checks the session-level rule separately. The seventh checks whether a crash can leave an event marked as handled without the intended work being recorded.

The concurrent scenario adds another useful distinction. A sequential test can pass even when simultaneous workers would both create an instruction. Our test uses separate database connections and transaction serialisation. It demonstrates the behaviour of this local SQLite model, not the scaling characteristics of a hosted database.


## One instruction is not the same as guaranteed delivery

A worker can read an outbox instruction, call an email service and crash before recording success. Retrying that instruction may repeat the external action unless the receiving system or application also provides suitable idempotency. The unique outbox row is therefore not a claim of exactly-once delivery.

Our paid-state rule is similarly limited. It prevents a stale failure from undoing payment in the model. It does not define refund, dispute, cancellation or subscription behaviour. Those need separate events, state transitions and tests. A later refund must not be silently ignored because a simplified model once marked the order paid.

The right production design also needs reconciliation: an authorised process that compares payment-provider records with application orders and unresolved fulfilment work. Alerts should lead to a named owner and a recoverable action, not just accumulate in a log.


## Use the model as a review aid, then test the real integration

Stripe’s automated-testing guidance recognises simulated responses as a way to test application behaviour and error recovery. Our downloadable programme follows that limited approach and needs only Python’s standard library. It makes no network calls. [3]

Before release, run the relevant scenarios against the actual integration in its test environment. Verify the real signature path, configured endpoints, trusted payment checks, database constraints, retry handling and delivery worker. Keep test and live credentials separate and avoid placing customer data in public evidence.

For a business buying software, the useful acceptance question is not simply “does checkout work?” It is “can you show what happens when the same event arrives twice, payment is delayed, or the application fails halfway through?” A small evidence pack can make that conversation considerably more precise.


## Sources

1. [Stripe: Payments for existing customers, post-payment events](https://docs.stripe.com/payments/existing-customers?platform=web&ui=stripe-hosted)
2. [Stripe: Receive events in your webhook endpoint](https://docs.stripe.com/webhooks)
3. [Stripe: Automated testing](https://docs.stripe.com/automated-testing)

## Evidence

- [Runnable Python simulation](https://liontechinnovations.co.uk/research/evidence/payment_flow_simulation.py)
- [Recorded test results (JSON)](https://liontechinnovations.co.uk/research/evidence/payment_simulation_results.json)
