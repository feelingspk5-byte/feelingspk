/** Parse a product / cut price from form or API input. Rejects NaN. */
export function parsePrice(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * Resolve the next product price on update.
 * - `null` / explicit empty → clear price
 * - number → set price
 * - omitted (`undefined`) → keep existing
 */
export function resolvePriceUpdate(
  incoming: unknown,
  existing: number | undefined,
  priceKeyPresent: boolean,
): number | undefined {
  if (!priceKeyPresent) return existing;
  if (incoming === null || incoming === "") return undefined;
  return parsePrice(incoming);
}
