// ImageKit URL transform helper.
// If a URL points at ik.imagekit.io, we append ?tr= transforms for adaptive
// sizing. Local /public paths (our seeded images) pass through untouched.
export function buildImageKitUrl(
  baseUrl: string,
  opts: { width?: number; height?: number; quality?: number } = {},
): string {
  if (!baseUrl.includes("ik.imagekit.io")) return baseUrl;
  const parts: string[] = [];
  if (opts.width) parts.push(`w-${opts.width}`);
  if (opts.height) parts.push(`h-${opts.height}`);
  parts.push(`q-${opts.quality ?? 80}`);
  const sep = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${sep}tr=${parts.join(",")}`;
}
