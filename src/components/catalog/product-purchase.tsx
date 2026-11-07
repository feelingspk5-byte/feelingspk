"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import {
  DEFAULT_DRESS_SHIRT_SIZES,
  DEFAULT_SHALWAR_KAMEEZ_SIZES,
  PRODUCT_CATEGORY_LABELS,
  type Product,
} from "@/lib/types";

function categoryHint(product: Product) {
  switch (product.category) {
    case "unstitched_fabric":
      return "Unstitched fabric — stitching is arranged separately unless included in the listing.";
    case "stitched_shalwar_kameez":
      return "Stitched shalwar kameez — select your size before adding to cart.";
    case "dress_shirt":
      return "Dress shirt — select collar / shirt size before adding to cart.";
    default:
      return "Elite Men's Collection";
  }
}

export function ProductPurchase({ product }: { product: Product }) {
  const { addLine } = useCart();
  const router = useRouter();
  const colours = product.colourVariants ?? [];
  const cuts = product.cutOptions ?? [];
  const isGarment =
    product.category === "stitched_shalwar_kameez" ||
    product.category === "dress_shirt";
  const sizes =
    product.sizeOptions && product.sizeOptions.length > 0
      ? product.sizeOptions
      : product.category === "stitched_shalwar_kameez"
        ? DEFAULT_SHALWAR_KAMEEZ_SIZES
        : product.category === "dress_shirt"
          ? DEFAULT_DRESS_SHIRT_SIZES
          : [];

  const [colourId, setColourId] = useState(colours[0]?.id);
  const [cutId, setCutId] = useState(cuts[0]?.id);
  const [sizeId, setSizeId] = useState(sizes[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);

  const selectedColour = colours.find((c) => c.id === colourId);
  const selectedCut = cuts.find((c) => c.id === cutId);
  const selectedSize = sizes.find((s) => s.id === sizeId);

  const unitPrice = useMemo(() => {
    if (selectedCut?.price !== undefined) return selectedCut.price;
    return product.price;
  }, [product.price, selectedCut]);

  const canPurchase =
    product.availability !== "out_of_stock" &&
    (colours.length === 0 || Boolean(colourId)) &&
    (!isGarment || Boolean(sizeId)) &&
    (product.category !== "unstitched_fabric" ||
      cuts.length === 0 ||
      product.sellingMethod === "unconfirmed" ||
      Boolean(cutId));

  function addToCart(goCheckout = false) {
    if (!canPurchase) {
      setMessage("Select the available options before adding to cart.");
      return;
    }
    if (isGarment && !selectedSize) {
      setMessage("Please select a size.");
      return;
    }

    addLine({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      category: product.category,
      colourVariantId: selectedColour?.id,
      colourName: selectedColour?.name,
      cutOptionId: selectedCut?.id,
      cutLabel: selectedCut?.label,
      sizeOptionId: selectedSize?.id,
      sizeLabel: selectedSize?.label,
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
        <p className="text-[11px] uppercase tracking-[0.16em] text-wine">
          {PRODUCT_CATEGORY_LABELS[product.category]}
        </p>
        <p className="mt-2 text-2xl text-ink">
          {formatPrice(unitPrice, product.currency)}
        </p>
        <p className="mt-1 text-sm text-ink/60">{categoryHint(product)}</p>
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

      {isGarment ? (
        <fieldset>
          <legend className="mb-2 text-[11px] uppercase tracking-[0.16em] text-ink/60">
            Size
          </legend>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size.id}
                type="button"
                disabled={size.available === false}
                onClick={() => setSizeId(size.id)}
                className={cn(
                  "min-w-12 rounded-sm border px-3 py-2 text-sm",
                  sizeId === size.id
                    ? "border-wine bg-wine text-ivory"
                    : "border-ink/20 bg-ivory text-ink",
                  size.available === false && "opacity-40",
                )}
              >
                {size.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-ink/50">
            Size chart details will appear when FEELINGS supplies measurements.
          </p>
        </fieldset>
      ) : null}

      {product.category === "unstitched_fabric" &&
      product.sellingMethod === "unconfirmed" &&
      cuts.length === 0 ? (
        <p className="rounded-sm border border-dashed border-ink/20 bg-ivory px-3 py-2 text-sm text-ink/65">
          Cut length / quantity rules are pending owner confirmation (fixed suit
          cut, per metre, or another method).
        </p>
      ) : null}

      {product.category === "unstitched_fabric" && cuts.length > 0 ? (
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
