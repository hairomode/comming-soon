export function route(pageContext: { urlPathname: string }) {
  const match = pageContext.urlPathname.match(/^\/v\/([^\/]+)\/?$/);
  if (!match) return false;
  return { routeParams: { id: match[1] } };
}
