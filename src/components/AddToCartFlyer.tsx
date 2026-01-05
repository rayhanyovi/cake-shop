"use client";

import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { createPortal } from "react-dom";
import { useCartAnchor } from "@/src/context/CartAnchorContext";

type AddToCartFlyerProps = {
  trigger: number;
  startRef: RefObject<HTMLElement | null>;
  onArrive?: () => void;
};

type Point = { x: number; y: number };

const DOT_SIZE = 20;
const FLY_DURATION_MS = 700;
const START_OFFSET = 6;

export default function AddToCartFlyer({
  trigger,
  startRef,
  onArrive,
}: AddToCartFlyerProps) {
  const { anchorEl } = useCartAnchor();
  const dotRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [start, setStart] = useState<Point | null>(null);
  const [end, setEnd] = useState<Point | null>(null);

  useEffect(() => {
    if (!trigger) return;

    const startEl = startRef.current;
    if (!startEl) {
      console.error(
        "[AddToCartFlyer] Missing start element. Ensure the Add to cart button ref is attached."
      );
      onArrive?.();
      return;
    }

    const startRect = startEl.getBoundingClientRect();
    if (startRect.width === 0 || startRect.height === 0) {
      console.error(
        "[AddToCartFlyer] Start element has zero size. The Add to cart button may be hidden.",
        startRect
      );
      onArrive?.();
      return;
    }

    const startPoint = {
      x: startRect.left + startRect.width / 2,
      y: startRect.top - DOT_SIZE / 2 - START_OFFSET,
    };

    let endPoint = startPoint;
    if (!anchorEl) {
      console.error(
        "[AddToCartFlyer] Cart anchor is missing. Ensure the Cart button registers with CartAnchorProvider."
      );
    } else {
      const endRect = anchorEl.getBoundingClientRect();
      if (endRect.width === 0 || endRect.height === 0) {
        console.error(
          "[AddToCartFlyer] Cart anchor has zero size. The Cart button may be hidden.",
          endRect
        );
      } else {
        endPoint = {
          x: endRect.left + endRect.width / 2,
          y: endRect.top + endRect.height / 2,
        };
      }
    }

    setStart(startPoint);
    setEnd(endPoint);
    setVisible(true);
  }, [trigger, startRef, anchorEl, onArrive]);

  useEffect(() => {
    if (!visible || !start || !end || !dotRef.current) return;

    const dot = dotRef.current;
    const startX = start.x - DOT_SIZE / 2;
    const startY = start.y - DOT_SIZE / 2;
    const endX = end.x - DOT_SIZE / 2;
    const endY = end.y - DOT_SIZE / 2;
    const arcHeight = Math.min(
      120,
      Math.max(60, Math.abs(endX - startX) * 0.25)
    );
    const controlX = (startX + endX) / 2;
    const controlY = Math.min(startY, endY) - arcHeight;

    const easeInOut = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / FLY_DURATION_MS);
      const eased = easeInOut(t);

      const inv = 1 - eased;
      const x =
        inv * inv * startX + 2 * inv * eased * controlX + eased * eased * endX;
      const y =
        inv * inv * startY + 2 * inv * eased * controlY + eased * eased * endY;

      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setVisible(false);
        onArrive?.();
      }
    };

    dot.style.transform = `translate3d(${startX}px, ${startY}px, 0)`;
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [visible, start, end, onArrive]);

  const portalHost = typeof document === "undefined" ? null : document.body;
  if (!portalHost || !visible) return null;

  return createPortal(
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full bg-price"
      style={{ width: DOT_SIZE, height: DOT_SIZE }}
    />,
    portalHost
  );
}
