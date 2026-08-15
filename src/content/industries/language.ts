export function withIndefiniteArticle(value: string) {
  const article = /^[aeiou]/i.test(value.trim()) ? 'an' : 'a';
  return `${article} ${value}`;
}

export function listWithIndefiniteArticles(values: string[]) {
  const items = values.map(withIndefiniteArticle);
  if (items.length <= 1) return items[0] ?? '';
  if (items.length === 2) return `${items[0]} or ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, or ${items.at(-1)}`;
}
