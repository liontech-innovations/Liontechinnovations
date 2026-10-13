import type { TenderPage } from './types';
export function csvCell(value: string) {
  const safe = /^[\s]*[=+@-]/.test(value) ? `'${value}` : value;
  return `"${safe.replaceAll('"', '""')}"`;
}
export function tenderCsv(page: TenderPage) {
  return `${page.utility.fields.map(csvCell).join(',')}\r\n${Array.from({ length: 6 }, () => page.utility.fields.map(() => '""').join(',')).join('\r\n')}\r\n`;
}
export function tenderWorksheet(page: TenderPage) {
  return `# ${page.utility.name}\n\nBlank working template. Use the actual tender pack; no legal or award assurance.\n\nOpportunity: ____________________\nOwner: ____________________\nTender version: ____________________\n\n${page.utility.fields.map((field, i) => `## ${field}\n${page.fieldHelp[i]}\n\nEntry: ____________________\n`).join('\n')}\n## Decisions and unresolved points\nOwner / action / due date / approval evidence: ____________________\n\n## Fictional teaching example (not a real bid or client result)\n${page.example}\n\nDo not submit the teaching example as your evidence.\n`;
}
