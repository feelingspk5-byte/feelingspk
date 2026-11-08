"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
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
      return "Unstitched fabric — select a colour and length, then add to cart.";
    case "stitched_shalwar_kameez":
      return "Stitched shalwar kameez — select your size before adding to cart.";
    case "dress_shirt":
      return "Dress shirt — select collar / shirt size before adding to cart.";
    default:
      return "Elite Men's Collection";
  }
}

export function ProductPurchase({
  product,
  colourId,
  onColourChange,
}: {
  product: Product;
  colourId?: string;
  onColourChange?: (id: string) => void;
}) {
  const { addLine } = useCart();
  const { user } = useAuth();
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

  const [internalColourId, setInternalColourId] = useState(colours[0]?.id);
  const activeColourId = colourId ?? internalColourId;
  const setColour = (id: string) => {
    onColourChange?.(id);
    setInternalColourId(id);
  };

  const [cutId, setCutId] = useState(cuts[0]?.id);
  const [sizeId, setSizeId] = useState(sizes[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);

  const selectedColour = colours.find((c) => c.id === activeColourId);
  const selectedCut = cuts.find((c) => c.id === cutId);
  const selectedSize = sizes.find((s) => s.id === sizeId);

  const unitPrice = useMemo(() => {
    if (selectedCut?.price !== undefined) return selectedCut.price;
    return product.price;
  }, [product.price, selectedCut]);

  const colourImage =
    selectedColour?.imageIds
      ?.map((id) => product.images.find((img) => img.id === id)?.src)
      .find(Boolean) ?? product.images[0]?.src;

  const canPurchase =
    product.availability !== "out_of_stock" &&
    (colours.length === 0 || Boolean(activeColourId)) &&
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
    if (goCheckout && !user) {
      router.push(
        `/sign-in?next=${encodeURIComponent("/checkout")}&notice=checkout`,
      );
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
      imageSrc: colourImage,
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
          <legend className="mb-3 text-[11px] uppercase tracking-[0.16em] text-ink/60">
            Colour
          </legend>
          <div className="flex flex-wrap gap-3">
            {colours.map((colour) => (
              <button
                key={colour.id}
                type="button"
                disabled={colour.available === false}
                onClick={() => setColour(colour.id)}
                className={cn(
                  "group flex min-w-[7.5rem] flex-col items-start gap-2 rounded-sm border px-3 py-3 text-left transition-colors",
                  activeColourId === colour.id
                    ? "border-wine bg-wine/5"
                    : "border-ink/15 bg-ivory hover:border-ink/35",
                  colour.available === false && "opacity-40",
                )}
              >
                <span
                  className={cn(
                    "h-8 w-8 rounded-sm border border-ink/10",
                    activeColourId === colour.id && "ring-1 ring-wine",
                  )}
                  style={{ backgroundColor: colour.hex ?? "#d8d1c6" }}
                  aria-hidden
                />
                <span className="text-sm leading-snug text-ink">{colour.name}</span>
              </button>
            ))}
          </div>
          {selectedColour ? (
            <p className="mt-3 text-sm text-ink/65">
              Selected: <span className="text-ink">{selectedColour.name}</span>
            </p>
          ) : null}
        </fieldset>
      ) : null}

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
        </fieldset>
      ) : null}

      {product.category === "unstitched_fabric" && cuts.length > 0 ? (
        <fieldset>
          <legend className="mb-2 text-[11px] uppercase tracking-[0.16em] text-ink/60">
            Length
          </legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {cuts.map((cut) => (
              <button
                key={cut.id}
                type="button"
                onClick={() => setCutId(cut.id)}
                className={cn(
                  "rounded-sm border px-3 py-3 text-sm",
                  cutId === cut.id
                    ? "border-wine bg-wine text-ivory"
                    : "border-ink/15 bg-ivory text-ink hover:border-ink/35",
                )}
              >
                {cut.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-ink/50">
            Choose how many metres you need. Price appears once FEELINGS
            confirms rates.
          </p>
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

      {!user ? (
        <p className="text-sm text-ink/55">
          Sign in before checkout so we can save your order details.{" "}
          <button
            type="button"
            className="text-wine underline-offset-2 hover:underline"
            onClick={() =>
              router.push(`/sign-in?next=${encodeURIComponent("/checkout")}`)
            }
          >
            Sign in
          </button>
        </p>
      ) : null}

      {message ? <p className="text-sm text-wine">{message}</p> : null}
    </div>
  );
}
