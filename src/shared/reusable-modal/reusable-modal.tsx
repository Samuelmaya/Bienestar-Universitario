import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

export type ClosePosition = "left" | "right";
export type Direction = "right" | "left" | "up" | "down";
export type ModalTrigger = HTMLElement | null | undefined;
type Quadrant =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "center-top"
  | "center-bottom"
  | "center-left"
  | "center-right";

type DrawerPosition = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

type Props = {
  triggerElement?: ModalTrigger;
  closePosition?: ClosePosition;
  expand?: boolean;
  drawer?: boolean;
  maxWidth?: string;
  minWidth?: string;
  direction?: Direction;
  backgroundColor?: string;
  whitespace?: boolean;
  centerOnDesktop?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
};

function darkenHexColor(hex: string, amount = 0.12): string {
  let c = hex.replace("#", "");
  if (c.length === 3) {
    c = `${c[0]}${c[0]}${c[1]}${c[1]}${c[2]}${c[2]}`;
  }
  const num = Number.parseInt(c, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - amount))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - amount))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - amount))));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function ReusableModal({
  triggerElement,
  closePosition = "left",
  expand = false,
  drawer = false,
  maxWidth,
  minWidth,
  direction,
  backgroundColor = "#fdf6f0",
  whitespace = false,
  centerOnDesktop = true,
  onClose,
  children,
}: Props) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const triggerRect = useRef<DOMRect | null>(null);
  const drawerPosition = useRef<DrawerPosition | null>(null);
  const quadrant = useRef<Quadrant | null>(null);

  const dragState = useRef({
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    initialModalX: 0,
    initialModalY: 0,
  });

  const closePos = useMemo(() => (closePosition === "left" ? "left" : "right"), [closePosition]);
  const expandPos = useMemo(() => (closePosition === "left" ? "right" : "left"), [closePosition]);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!modalRef.current || !scrollRef.current || !overlayRef.current) return;

    applyBaseStyles();
    applyBackgroundColor();
    applyScrollbarTheme();
    runOpenAnimation();
  }, []);

  useEffect(() => {
    if (!modalRef.current) return;
    modalRef.current.style.backgroundColor = backgroundColor;
  }, [backgroundColor]);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (!dragState.current.isDragging || !modalRef.current || !overlayRef.current) return;

      const deltaX = event.clientX - dragState.current.dragStartX;
      const deltaY = event.clientY - dragState.current.dragStartY;

      const currentX = dragState.current.initialModalX + deltaX;
      const currentY = dragState.current.initialModalY + deltaY;

      const maxDragDistance = window.innerHeight / 1.5;
      const scaleProgress = Math.max(0, Math.min(1, Math.abs(deltaY) / maxDragDistance));
      const currentScale = 1 - scaleProgress * 0.15;

      const opacityProgress = Math.max(
        0,
        Math.min(1, Math.max(Math.abs(deltaX), Math.abs(deltaY)) / 300),
      );
      const currentOpacity = 0.5 - opacityProgress * 0.5;

      const dragDistance = Math.max(Math.abs(deltaX), Math.abs(deltaY));
      const currentBorderRadius = isMobile ? `${Math.min(32, dragDistance)}px` : "32px";

      gsap.set(modalRef.current, {
        x: currentX,
        y: currentY,
        scale: currentScale,
        borderRadius: currentBorderRadius,
      });

      gsap.set(overlayRef.current, {
        backgroundColor: `rgba(0, 0, 0, ${Math.max(0, currentOpacity)})`,
      });
    };

    const onUp = (event: PointerEvent) => {
      if (!dragState.current.isDragging || !modalRef.current || !overlayRef.current) return;
      dragState.current.isDragging = false;

      if (event.target && (event.target as HTMLElement).hasPointerCapture?.(event.pointerId)) {
        (event.target as HTMLElement).releasePointerCapture(event.pointerId);
      }

      const deltaX = event.clientX - dragState.current.dragStartX;
      const deltaY = event.clientY - dragState.current.dragStartY;
      const threshold = 120;

      if (Math.abs(deltaY) > threshold || Math.abs(deltaX) > threshold) {
        void closeModal();
      } else {
        gsap.to(modalRef.current, {
          x: dragState.current.initialModalX,
          y: dragState.current.initialModalY,
          scale: 1,
          borderRadius: isMobile ? 0 : 32,
          duration: 0.4,
          ease: "back.out(1.5)",
        });
        gsap.to(overlayRef.current, {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          duration: 0.4,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [isMobile]);

  const applyBaseStyles = () => {
    if (!modalRef.current || !scrollRef.current) return;
    const modal = modalRef.current;
    const scrollEl = scrollRef.current;

    if (isMobile) {
      Object.assign(modal.style, {
        width: "100vw",
        height: "100dvh",
        maxWidth: "100%",
        maxHeight: "100%",
        minWidth: "",
        borderRadius: "0px",
        position: "fixed",
        top: "0",
        left: "0",
        overflow: "hidden",
      });
      Object.assign(scrollEl.style, {
        height: "100%",
        maxHeight: "100dvh",
        margin: "0",
      });
    } else {
      const maxW = maxWidth ?? "640px";
      Object.assign(modal.style, {
        position: "relative",
        width: "100%",
        height: "auto",
        maxWidth: maxW,
        minWidth: minWidth ?? "",
        maxHeight: "85vh",
        borderRadius: "32px",
        overflow: "hidden",
      });
      Object.assign(scrollEl.style, {
        height: "auto",
        maxHeight: "80vh",
        margin: "0",
      });
    }

    setTimeout(() => {
      const closeBtn = modal.querySelector("button[aria-label='Cerrar modal']") as HTMLElement;
      const expandBtn = modal.querySelector(
        "button[aria-label='Expandir'],button[aria-label='Contraer']",
      ) as HTMLElement;
      if (closeBtn) {
        closeBtn.style.backgroundColor = "transparent";
        closeBtn.style.transition = "background 0.2s, opacity 0.2s, transform 0.1s";
      }
      if (expandBtn) {
        expandBtn.style.backgroundColor = "transparent";
        expandBtn.style.transition = "background 0.2s, opacity 0.2s, transform 0.1s";
      }
      const hoverColor = darkenHexColor(backgroundColor, 0.12);
      const styleSheet = document.createElement("style");
      styleSheet.innerHTML = `
        .app-modal-btn:hover {
          background: ${hoverColor} !important;
        }
      `;
      document.head.appendChild(styleSheet);
      if (closeBtn) closeBtn.classList.add("app-modal-btn");
      if (expandBtn) expandBtn.classList.add("app-modal-btn");
    }, 0);
  };

  const applyBackgroundColor = () => {
    if (!modalRef.current) return;
    modalRef.current.style.backgroundColor = backgroundColor;
  };

  const applyScrollbarTheme = () => {
    if (!scrollRef.current) return;
    const scrollEl = scrollRef.current;
    const baseColor = darkenHexColor(backgroundColor, 0.12);
    const hoverColor = darkenHexColor(backgroundColor, 0.22);

    scrollEl.classList.add("custom-scrollbar-modal");

    const styleId = "modal-scrollbar-style";
    let styleSheet = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleSheet) {
      styleSheet = document.createElement("style");
      styleSheet.id = styleId;
      document.head.appendChild(styleSheet);
    }
    styleSheet.innerHTML = `
      .custom-scrollbar-modal {
        scrollbar-width: thin;
        scrollbar-color: ${hoverColor} transparent;
      }
      .custom-scrollbar-modal::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar-modal::-webkit-scrollbar-track {
        background: transparent;
        margin-top: 16px;
        margin-bottom: 16px;
      }
      .custom-scrollbar-modal::-webkit-scrollbar-thumb {
        background-color: #c0c0c0;
        border-radius: 0px;
        border: none;
      }
      .custom-scrollbar-modal::-webkit-scrollbar-thumb:hover {
        background-color: #a0a0a0;
      }
      .custom-scrollbar-modal::-webkit-scrollbar-button {
        display: none;
        height: 0;
        width: 0;
      }
    `;
  };

  const calcDrawerPosition = (rect: DOMRect): DrawerPosition => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const gap = 12;

    const centerThresholdW = vw * 0.2;
    const centerThresholdH = vh * 0.2;
    const centerX = vw / 2;
    const centerY = vh / 2;

    const pos: DrawerPosition = {};

    if (direction) {
      switch (direction) {
        case "right":
          pos.left = rect.right + gap;
          pos.top = cy - 240;
          break;
        case "left":
          pos.right = vw - rect.left + gap;
          pos.top = cy - 240;
          break;
        case "up":
          pos.left = cx - 320;
          pos.bottom = vh - rect.top + gap;
          break;
        case "down":
          pos.left = cx - 320;
          pos.top = rect.bottom + gap;
          break;
      }
      if (pos.left !== undefined) {
        pos.left = Math.max(0, Math.min(pos.left, vw - 640));
      }
      if (pos.top !== undefined) {
        pos.top = Math.max(0, Math.min(pos.top, vh - 480));
      }
      return pos;
    }

    if (Math.abs(cx - centerX) < centerThresholdW && cy < centerThresholdH) {
      quadrant.current = "center-top";
      pos.top = rect.bottom + gap;
      pos.left = cx - 320;
    } else if (Math.abs(cx - centerX) < centerThresholdW && cy > vh - centerThresholdH) {
      quadrant.current = "center-bottom";
      pos.bottom = vh - rect.top + gap;
      pos.left = cx - 320;
    } else if (Math.abs(cy - centerY) < centerThresholdH && cx < centerThresholdW) {
      quadrant.current = "center-left";
      pos.left = rect.right + gap;
      pos.top = cy - 240;
    } else if (Math.abs(cy - centerY) < centerThresholdH && cx > vw - centerThresholdW) {
      quadrant.current = "center-right";
      pos.right = vw - rect.left + gap;
      pos.top = cy - 240;
    } else {
      const isLeft = cx < vw / 2;
      const isTop = cy < vh / 2;
      quadrant.current = `${isTop ? "top" : "bottom"}-${isLeft ? "left" : "right"}` as Quadrant;
      if (isTop) {
        pos.top = rect.bottom + gap;
      } else {
        pos.bottom = vh - rect.top + gap;
      }
      if (isLeft) {
        pos.left = rect.left;
      } else {
        pos.right = vw - rect.right;
      }
    }

    if (pos.left !== undefined) {
      pos.left = Math.max(0, Math.min(pos.left, vw - 640));
    }
    if (pos.top !== undefined) {
      pos.top = Math.max(0, Math.min(pos.top, vh - 480));
    }

    return pos;
  };

  const applyDrawerPosition = (modal: HTMLElement, pos: DrawerPosition) => {
    Object.assign(modal.style, {
      position: "fixed",
      top: pos.top !== undefined ? `${pos.top}px` : "",
      bottom: pos.bottom !== undefined ? `${pos.bottom}px` : "",
      left: pos.left !== undefined ? `${pos.left}px` : "",
      right: pos.right !== undefined ? `${pos.right}px` : "",
      transform: "none",
    });
  };

  const runOpenAnimation = () => {
    if (!modalRef.current || !overlayRef.current) return;
    const modal = modalRef.current;
    const overlay = overlayRef.current;
    const trigger = triggerElement ?? null;

    if (trigger) {
      triggerRect.current = trigger.getBoundingClientRect();
    }

    if (drawer && !isMobile && trigger && !centerOnDesktop) {
      const rect = triggerRect.current as DOMRect;
      drawerPosition.current = calcDrawerPosition(rect);
      applyDrawerPosition(modal, drawerPosition.current);
      const modalRect = modal.getBoundingClientRect();
      const originX = rect.left + rect.width / 2 - (modalRect.left + modalRect.width / 2);
      const originY = rect.top + rect.height / 2 - (modalRect.top + modalRect.height / 2);
      gsap.set(modal, {
        x: originX,
        y: originY,
        scale: 0,
        opacity: 0,
        filter: "blur(10px)",
        transformOrigin: "center center",
      });
      gsap.to(modal, {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.4,
        ease: "back.out(1.7)",
      });
    } else {
      const originRect =
        triggerRect.current ??
        ({
          left: window.innerWidth / 2,
          top: window.innerHeight / 2,
          width: 0,
          height: 0,
        } as DOMRect);
      gsap.set(modal, {
        x: originRect.left + originRect.width / 2 - window.innerWidth / 2,
        y: originRect.top + originRect.height / 2 - window.innerHeight / 2,
        scale: 0,
        opacity: 0,
        filter: "blur(10px)",
        transformOrigin: "center center",
      });
      const toX = centerOnDesktop
        ? 0
        : originRect.left + originRect.width / 2 - window.innerWidth / 2;
      const toY = centerOnDesktop
        ? 0
        : originRect.top + originRect.height / 2 - window.innerHeight / 2;
      gsap.to(modal, {
        x: toX,
        y: toY,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.4,
        ease: "back.out(1.7)",
      });
    }
    gsap.to(overlay, {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const runCloseAnimation = () => {
    if (!modalRef.current || !overlayRef.current) return Promise.resolve();
    const modal = modalRef.current;
    const overlay = overlayRef.current;
    const targetRect =
      triggerRect.current ??
      ({
        left: window.innerWidth / 2,
        top: window.innerHeight / 2,
        width: 0,
        height: 0,
      } as DOMRect);

    return new Promise<void>((resolve) => {
      if (drawer && !isMobile && drawerPosition.current) {
        if (isExpanded) {
          Object.assign(modal.style, { top: "0", left: "0", right: "", bottom: "" });
        }
        const modalRect = modal.getBoundingClientRect();
        const toX = targetRect.left + targetRect.width / 2 - (modalRect.left + modalRect.width / 2);
        const toY = targetRect.top + targetRect.height / 2 - (modalRect.top + modalRect.height / 2);
        gsap.to(modal, {
          x: toX,
          y: toY,
          scale: 0,
          opacity: 0,
          filter: "blur(5px)",
          borderRadius: 48,
          duration: 0.3,
          ease: "power2.in",
          onComplete: resolve,
        });
      } else {
        gsap.to(modal, {
          x: targetRect.left + targetRect.width / 2 - window.innerWidth / 2,
          y: targetRect.top + targetRect.height / 2 - window.innerHeight / 2,
          scale: 0,
          opacity: 0,
          filter: "blur(5px)",
          borderRadius: 48,
          duration: 0.3,
          ease: "power2.in",
          onComplete: resolve,
        });
      }
      gsap.to(overlay, {
        backgroundColor: "rgba(0, 0, 0, 0)",
        duration: 0.3,
      });
    });
  };

  const closeModal = async () => {
    setIsClosing(true);
    await runCloseAnimation();
    onClose?.();
  };

  const onDragStart = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isExpanded || isClosing || !modalRef.current) return;

    dragState.current.isDragging = true;
    dragState.current.dragStartX = event.clientX;
    dragState.current.dragStartY = event.clientY;

    dragState.current.initialModalX = (gsap.getProperty(modalRef.current, "x") as number) || 0;
    dragState.current.initialModalY = (gsap.getProperty(modalRef.current, "y") as number) || 0;

    (event.target as HTMLElement).setPointerCapture(event.pointerId);
  };

  const toggleExpand = () => {
    if (isMobile || !modalRef.current || !scrollRef.current) return;
    const modal = modalRef.current;
    const scrollEl = scrollRef.current;
    const expanding = !isExpanded;

    setIsExpanded(expanding);

    if (expanding) {
      const rect = modal.getBoundingClientRect();
      const scrollRect = scrollEl.getBoundingClientRect();
      const startW = rect.width;
      const startH = rect.height;
      const startScrollH = scrollRect.height;

      let startX = 0;
      let startY = 0;
      if (drawer) {
        startX = rect.left;
        startY = rect.top;
        Object.assign(modal.style, {
          position: "fixed",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
        });
      } else {
        startX = (gsap.getProperty(modal, "x") as number) || 0;
        startY = (gsap.getProperty(modal, "y") as number) || 0;
      }

      modal.style.maxWidth = "100%";
      modal.style.maxHeight = "100%";
      scrollEl.style.maxHeight = "100vh";

      gsap.fromTo(
        modal,
        { width: startW, height: startH, x: startX, y: startY, borderRadius: 48 },
        {
          width: window.innerWidth,
          height: window.innerHeight,
          x: 0,
          y: 0,
          borderRadius: 0,
          duration: 0.35,
          ease: "power2.inOut",
        },
      );
      gsap.fromTo(
        scrollEl,
        { height: startScrollH },
        {
          height: window.innerHeight,
          duration: 0.35,
          ease: "power2.inOut",
        },
      );
    } else {
      let naturalModalW = 0;
      let naturalModalH = 0;
      let naturalScrollH = 0;
      let toX = 0;
      let toY = 0;

      if (drawer && drawerPosition.current) {
        const prevStyle = {
          width: modal.style.width,
          height: modal.style.height,
          maxWidth: modal.style.maxWidth,
          maxHeight: modal.style.maxHeight,
          position: modal.style.position,
          top: modal.style.top,
          left: modal.style.left,
          right: modal.style.right,
          bottom: modal.style.bottom,
        };
        const prevScrollStyle = {
          height: scrollEl.style.height,
          maxHeight: scrollEl.style.maxHeight,
        };

        applyDrawerPosition(modal, drawerPosition.current);
        modal.style.width = "";
        modal.style.height = "";
        modal.style.maxWidth = maxWidth ?? "640px";
        modal.style.maxHeight = "85vh";
        scrollEl.style.height = "";
        scrollEl.style.maxHeight = "80vh";

        naturalModalW = modal.offsetWidth;
        naturalModalH = modal.offsetHeight;
        naturalScrollH = scrollEl.offsetHeight;

        if (drawerPosition.current.left !== undefined) {
          toX = drawerPosition.current.left;
        } else if (drawerPosition.current.right !== undefined) {
          toX = window.innerWidth - drawerPosition.current.right - naturalModalW;
        }
        if (drawerPosition.current.top !== undefined) {
          toY = drawerPosition.current.top;
        } else if (drawerPosition.current.bottom !== undefined) {
          toY = window.innerHeight - drawerPosition.current.bottom - naturalModalH;
        }

        Object.assign(modal.style, prevStyle);
        Object.assign(scrollEl.style, prevScrollStyle);
      } else {
        modal.style.width = "";
        modal.style.height = "";
        modal.style.maxWidth = maxWidth ?? "640px";
        modal.style.maxHeight = "85vh";
        scrollEl.style.height = "";
        scrollEl.style.maxHeight = "80vh";
        naturalModalW = modal.offsetWidth;
        naturalModalH = modal.offsetHeight;
        naturalScrollH = scrollEl.offsetHeight;
      }

      modal.style.maxWidth = "100%";
      modal.style.maxHeight = "100%";
      scrollEl.style.maxHeight = "100vh";
      gsap.set(modal, { width: window.innerWidth, height: window.innerHeight, x: 0, y: 0 });
      gsap.set(scrollEl, { height: window.innerHeight });

      gsap.to(modal, {
        width: naturalModalW,
        height: naturalModalH,
        borderRadius: 48,
        x: toX,
        y: toY,
        duration: 0.35,
        ease: "power2.inOut",
        onComplete: () => {
          modal.style.width = "";
          modal.style.height = "";
          modal.style.maxWidth = maxWidth ?? "640px";
          modal.style.maxHeight = "85vh";

          if (drawer && drawerPosition.current) {
            applyDrawerPosition(modal, drawerPosition.current);
            gsap.set(modal, { x: 0, y: 0 });
          }
        },
      });
      gsap.to(scrollEl, {
        height: naturalScrollH,
        duration: 0.35,
        ease: "power2.inOut",
        onComplete: () => {
          scrollEl.style.height = "";
          scrollEl.style.maxHeight = "80vh";
        },
      });
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
    >
      <div
        ref={modalRef}
        className="relative shadow-2xl"
        style={{ backgroundColor, boxSizing: "border-box", overflow: "hidden" }}
      >
        {!isExpanded && (
          <div
            className="absolute top-0 left-0 right-0 h-10 flex items-start justify-center pt-3 z-30 cursor-grab active:cursor-grabbing"
            style={{ touchAction: "none" }}
            onPointerDown={onDragStart}
          >
            <div
              className="w-12 h-1.5 rounded-full"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.15)" }}
            />
          </div>
        )}

        <button
          type="button"
          onClick={closeModal}
          className={cn(
            "absolute top-5 flex items-center justify-center rounded-full z-40 transition-opacity hover:opacity-70 active:scale-95",
            closePos === "left" ? "left-2" : "right-2",
          )}
          style={{ width: 36, height: 36, background: "transparent", border: "none" }}
          aria-label="Cerrar modal"
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: 18,
              color: "#7a7a7a",
              fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
              lineHeight: 1,
              display: "block",
            }}
          >
            close
          </span>
        </button>

        {!isMobile && expand && (
          <button
            type="button"
            onClick={toggleExpand}
            className={cn(
              "absolute top-5 flex items-center justify-center rounded-full z-40 transition-opacity hover:opacity-70 active:scale-95",
              expandPos === "left" ? "left-2" : "right-2",
            )}
            aria-label={isExpanded ? "Contraer" : "Expandir"}
            style={{ width: 36, height: 36, background: "transparent", border: "none" }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: 18,
                color: "#7a7a7a",
                fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
                lineHeight: 1,
                display: "block",
              }}
            >
              {isExpanded ? "collapse_content" : "open_in_full"}
            </span>
          </button>
        )}

        <div
          ref={scrollRef}
          className="overflow-y-auto"
          style={{
            margin: 0,
            boxSizing: "border-box",
            position: "relative",
            borderRadius: "inherit",
          }}
        >
          <div
            style={{
              padding: whitespace ? "64px 100px 100px 100px" : "64px 28px 28px 28px",
              boxSizing: "border-box",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
