"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SalePrice } from "@/components/catalog/sale-price";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/cn";
import { resolveListPrice } from "@/lib/format";
import {
  applyCatalogueDiscount,
  type CatalogueDiscount,
} from "@/lib/store/sale-pricing";
import {
  DEFAULT_DRESS_SHIRT_SIZES,
  DEFAULT_SHALWAR_KAMEEZ_SIZES,
  PRODUCT_CATEGORY_LABELS,
  type Product,
} from "@/lib/types";

function categoryHint(product: Product) {
  switch (product.category) {
    case "unstitched_fabric":
      return "Select a shade to continue. Length is chosen below once you are ready.";
    case "stitched_shalwar_kameez":
      return "Select your size, then add to cart.";
    case "dress_shirt":
      return "Select your shirt size, then add to cart.";
    default:
      return "Elite Men's Collection";
  }
}

export function ProductPurchase({
  product,
  colourId,
  onColourChange,
  catalogueDiscount = null,
  showPrice = true,
}: {
  product: Product;
  colourId?: string;
  onColourChange?: (id: string) => void;
  catalogueDiscount?: CatalogueDiscount | null;
  showPrice?: boolean;
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

  const listPrice = useMemo(
    () => resolveListPrice(product, selectedCut),
    [product, selectedCut],
  );

  const sale = useMemo(
    () => applyCatalogueDiscount(listPrice, catalogueDiscount),
    [listPrice, catalogueDiscount],
  );

  const unitPrice = sale?.sale ?? listPrice;

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
        {showPrice ? (
          <div className="mt-2">
            <SalePrice
              price={listPrice}
              currency={product.currency}
              sale={sale}
              size="lg"
            />
          </div>
        ) : null}
        <p className="mt-1 text-sm text-ink/60">{categoryHint(product)}</p>
      </div>

      {colours.length > 0 ? (
        <fieldset>
          <legend className="mb-3 text-[11px] uppercase tracking-[0.16em] text-ink/60">
            Colour
          </legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
            {colours.map((colour) => (
              <button
                key={colour.id}
                type="button"
                disabled={colour.available === false}
                onClick={() => setColour(colour.id)}
                className={cn(
                  "group overflow-hidden rounded-sm border text-left transition-colors",
                  activeColourId === colour.id
                    ? "border-wine ring-1 ring-wine"
                    : "border-ink/15 bg-ivory hover:border-ink/35",
                  colour.available === false && "opacity-40",
                )}
              >
                <span
                  className="block h-14 w-full border-b border-ink/10 sm:h-16"
                  style={{ backgroundColor: colour.hex ?? "#d8d1c6" }}
                  aria-hidden
                />
                <span className="block px-3 py-2.5 text-sm leading-snug text-ink">
                  {colour.name}
                </span>
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
          <p className="mt-3 text-sm leading-relaxed text-ink/70">
            If your desired fabric length is not listed in the options above
            (e.g., 5 meters, 5.5 meters, or even 1 meter, 2 meters, or any custom
            length), please feel free to contact us on WhatsApp at{" "}
            <a
              href="https://wa.me/923155551507"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-wine underline-offset-2 hover:underline"
            >
              +92 3155551507
            </a>{" "}
            for assistance.
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
