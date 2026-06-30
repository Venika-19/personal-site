export const POSTS_PER_PAGE = 6;

export function paginate<T>(items: T[], page: number, perPage = POSTS_PER_PAGE) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  const pageItems = items.slice(start, start + perPage);

  return { pageItems, totalPages, page: safePage };
}
