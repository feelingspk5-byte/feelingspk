"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import type { FabricProduct } from "@/lib/types";

export function ProductPurchase({ product }: { product: FabricProduct }) {
  const { addLine } = useCart();
  const router = useRouter();
  const colours = product.colourVariants ?? [];
  const cuts = product.cutOptions ?? [];

  const [colourId, setColourId] = useState(colours[0]?.id);
  const [cutId, setCutId] = useState(cuts[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);

  const selectedColour = colours.find((c) => c.id === colourId);
  const selectedCut = cuts.find((c) => c.id === cutId);

  const unitPrice = useMemo(() => {
    if (selectedCut?.price !== undefined) return selectedCut.price;
    return product.price;
  }, [product.price, selectedCut]);

  const canPurchase =
    product.availability !== "out_of_stock" &&
    (colours.length === 0 || Boolean(colourId)) &&
    (cuts.length === 0 ||
      product.sellingMethod === "unconfirmed" ||
      Boolean(cutId));

  function addToCart(goCheckout = false) {
    if (!canPurchase) {
      setMessage("Select the available options before adding to cart.");
      return;
    }

    addLine({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      colourVariantId: selectedColour?.id,
      colourName: selectedColour?.name,
      cutOptionId: selectedCut?.id,
      cutLabel: selectedCut?.label,
      quantity,
      unitLabel: selectedCut?.unit,
      unitPrice,
      currency: product.currency,
      imageSrc: product.images[0]?.src,
    });

    setMessage("Added to cart.");
    if (goCheckout) router.push("/checkout");
    else router.push("/cart");
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-2xl text-ink">
          {formatPrice(unitPrice, product.currency)}
        </p>
        <p className="mt-1 text-sm text-ink/60">
          Unstitched fabric — stitching is not included.
        </p>
      </div>

      {colours.length > 0 ? (
        <fieldset>
          <legend className="mb-2 text-[11px] uppercase tracking-[0.16em] text-ink/60">
            Colour
          </legend>
          <div className="flex flex-wrap gap-2">
            {colours.map((colour) => (
              <button
                key={colour.id}
                type="button"
                disabled={colour.available === false}
                onClick={() => setColourId(colour.id)}
                className={cn(
                  "rounded-sm border px-3 py-2 text-sm",
                  colourId === colour.id
                    ? "border-wine bg-wine text-ivory"
                    : "border-ink/20 bg-ivory text-ink",
                  colour.available === false && "opacity-40",
                )}
              >
                {colour.name}
              </button>
            ))}
          </div>
        </fieldset>
      ) : (
        <p className="rounded-sm border border-dashed border-ink/20 bg-ivory px-3 py-2 text-sm text-ink/65">
          Colour options will appear when FEELINGS supplies confirmed variants.
        </p>
      )}

      {product.sellingMethod === "unconfirmed" && cuts.length === 0 ? (
        <p className="rounded-sm border border-dashed border-ink/20 bg-ivory px-3 py-2 text-sm text-ink/65">
          Cut length / quantity rules are pending owner confirmation (fixed
          suit cut, per metre, or another method).
        </p>
      ) : null}

      {cuts.length > 0 ? (
        <fieldset>
          <legend className="mb-2 text-[11px] uppercase tracking-[0.16em] text-ink/60">
            Cut / quantity option
          </legend>
          <div className="space-y-2">
            {cuts.map((cut) => (
              <label
                key={cut.id}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-3 rounded-sm border px-3 py-3 text-sm",
                  cutId === cut.id
                    ? "border-wine bg-ivory"
                    : "border-ink/15 bg-ivory/70",
                )}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="cut"
                    checked={cutId === cut.id}
                    onChange={() => setCutId(cut.id)}
                  />
                  {cut.label}
                </span>
                {cut.price !== undefined ? (
                  <span>{formatPrice(cut.price, product.currency)}</span>
                ) : null}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      <div>
        <label
          htmlFor="qty"
          className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-ink/60"
        >
          Quantity
        </label>
        <input
          id="qty"
          type="number"
          min={1}
          value={quantity}
          onChange={(e) =>
            setQuantity(Math.max(1, Number(e.target.value) || 1))
          }
          className="h-11 w-28 rounded-sm border border-ink/20 bg-ivory px-3 text-sm"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          className="flex-1"
          disabled={!canPurchase || product.availability === "out_of_stock"}
          onClick={() => addToCart(false)}
        >
          Add to cart
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          disabled={!canPurchase || product.availability === "out_of_stock"}
          onClick={() => addToCart(true)}
        >
          Buy now
        </Button>
      </div>

      {message ? <p className="text-sm text-wine">{message}</p> : null}
    </div>
  );
}
