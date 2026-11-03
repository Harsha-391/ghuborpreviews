"use client";

import { RefObject, useEffect, useRef } from "react";

interface DragScrollOptions {
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

/**
 * Lets a mouse drag a horizontal scroll container. Touch and pen are left alone
 * so the browser's native swipe (with momentum, and with vertical swipes passed
 * through to the page) keeps working. Nothing here listens to scroll or wheel.
 * A drag that moved more than a few pixels swallows the click that follows it,
 * so dragging across a product never opens it by accident.
 */
export function useDragScroll(ref: RefObject<HTMLElement | null>, options: DragScrollOptions = {}) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let pointerId = -1;
    let startX = 0;
    let startLeft = 0;
    let pressed = false;
    let moved = false;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      pressed = true;
      moved = false;
      pointerId = e.pointerId;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };

    const onMove = (e: PointerEvent) => {
      if (!pressed) return;
      const dx = e.clientX - startX;
      if (!moved) {
        if (Math.abs(dx) < 5) return;
        moved = true;
        el.setPointerCapture(pointerId);
        el.dataset.dragging = "true";
        optionsRef.current.onDragStart?.();
      }
      el.scrollLeft = startLeft - dx;
    };

    const onUp = () => {
      if (!pressed) return;
      pressed = false;
      if (!moved) return;
      if (el.hasPointerCapture(pointerId)) el.releasePointerCapture(pointerId);
      delete el.dataset.dragging;
      optionsRef.current.onDragEnd?.();
    };

    const onClick = (e: MouseEvent) => {
      if (!moved) return;
      e.preventDefault();
      e.stopPropagation();
      moved = false;
    };

    // Stop the browser's native image/link drag ghost from hijacking the gesture.
    const onDragStartNative = (e: DragEvent) => e.preventDefault();

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("click", onClick, true);
    el.addEventListener("dragstart", onDragStartNative);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("click", onClick, true);
      el.removeEventListener("dragstart", onDragStartNative);
    };
  }, [ref]);
}
