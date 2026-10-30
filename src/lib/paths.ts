// Prefix a public file path with the site's base path (e.g. /Portfolio on GitHub Pages).
// next/link adds it automatically; plain <a href> links to files in /public need this.
export function withBase(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${path}`;
}
