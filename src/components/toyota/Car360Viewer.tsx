import React, { useRef, useState, useEffect, useMemo } from 'react';

type Car360ViewerProps = {
  modelId: 'camry' | 'rav4' | 'highlander' | 'tacoma';
  isActive?: boolean;
  className?: string;
  frameCount?: number;        // default 36
  startFrame?: number;        // default 10
  pixelsPerFrame?: number;    // drag sensitivity, default 8
  preloadRadius?: number;     // how many neighbor frames to preload, default 2
  /** Optional: supply a custom URL template if you have per-model 360 sets */
  srcTemplate?: (frame: number, modelId: string) => string;
};

/** Default Toyota CDN template.
 * Update the per-model path segments once you know the exact trim/color folders.
 * The sample below uses XLE/6305/089 placeholders matching your snippet style.
 */
const DEFAULT_PATHS: Record<string, string> = {
  camry:       '2026/camry/xle/6305/089',
  rav4:        '2026/rav4/xle/6305/089',
  highlander:  '2026/highlander/xle/6305/089',
  tacoma:      '2026/tacoma/xle/6305/089',
};

const toyotaCdnUrl = (modelId: string, frame: number) =>
  `https://tmna.aemassets.toyota.com/is/image/toyota/toyota/jellies/max/${DEFAULT_PATHS[modelId]}/36/${frame}.png?fmt=webp-alpha&wid=930&hei=328&qlt=90`;

const clampWrap = (f: number, max: number) => {
  if (f < 1) return max - ((1 - f) % max);
  if (f > max) return ((f - 1) % max) + 1;
  return f;
};

export default function Car360Viewer({
  modelId,
  isActive = true,
  className = '',
  frameCount = 36,
  startFrame = 10,
  pixelsPerFrame = 8,
  preloadRadius = 2,
  srcTemplate,
}: Car360ViewerProps) {
  const [frame, setFrame] = useState(() => clampWrap(startFrame, frameCount));
  const [dragging, setDragging] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const dragStartFrame = useRef<number>(frame);
  const [imgReady, setImgReady] = useState(false);

  const urlFor = useMemo(() => {
    if (srcTemplate) return (f: number) => srcTemplate(f, modelId);
    return (f: number) => toyotaCdnUrl(modelId, f);
  }, [modelId, srcTemplate]);

  // Preload neighbor frames for smoother scrubbing
  useEffect(() => {
    if (!isActive) return;
    const neighbors: number[] = [0];
    for (let i = 1; i <= preloadRadius; i++) {
      neighbors.push(i, -i);
    }
    neighbors.forEach((d) => {
      const f = clampWrap(frame + d, frameCount);
      const img = new Image();
      img.src = urlFor(f);
    });
  }, [frame, frameCount, isActive, preloadRadius, urlFor]);

  // Optional: gentle autorotate when active & not dragging
  useEffect(() => {
    if (!isActive || dragging) return;
    const id = setInterval(() => {
      setFrame((prev) => (prev >= frameCount ? 1 : prev + 1));
    }, 120);
    return () => clearInterval(id);
  }, [isActive, dragging, frameCount]);

  // Unified pointer handlers (mouse + touch)
  const onPointerDown = (e: React.PointerEvent) => {
    if (!isActive) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragStartX.current = e.clientX;
    dragStartFrame.current = frame;
    setDragging(true);
    setImgReady(true); // we’ll fade in first loaded image
    e.stopPropagation(); // don’t trigger parent card click on grab
    e.preventDefault();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isActive || !dragging || dragStartX.current == null) return;
    const dx = e.clientX - dragStartX.current;
    const deltaFrames = Math.trunc(dx / pixelsPerFrame);
    if (deltaFrames !== 0) {
      setFrame(clampWrap(dragStartFrame.current - deltaFrames, frameCount));
    }
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!dragging) return;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    setDragging(false);
    dragStartX.current = null;
  };

  const currentSrc = useMemo(() => urlFor(frame), [frame, urlFor]);

  return (
    <div
      className={`threesixty-media spacing-med-3-d relative w-full h-full ${className}`}
      style={{ touchAction: 'none', cursor: dragging ? 'grabbing' : 'grab' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
    >
      {/* Overlay like Toyota’s—captures drag without blocking layout */}
      <button
        className="threesixty-media__overlay absolute inset-0 z-10 bg-transparent border-none"
        aria-label="DRAG TO ROTATE"
        data-aa-skip="true"
        onClick={(e) => e.preventDefault()}
      />

      <picture className="threesixty-media__picture w-full h-full flex items-center justify-center">
        {/* If you later get true alternate encodes, add <source> tags here */}
        <img
          src={currentSrc}
          className={`threesixty-media__image w-full h-full object-contain transition-opacity duration-200 ${
            imgReady ? 'opacity-100' : 'opacity-0'
          }`}
          alt={`${modelId} 360-degree view`}
          onLoad={() => setImgReady(true)}
          draggable={false}
        />
      </picture>

      {!imgReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/40">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
