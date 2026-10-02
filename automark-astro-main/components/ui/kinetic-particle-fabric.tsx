"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Vector3 {
    x: number;
    y: number;
    z: number;
}

interface PhysicsNode {
    curr: Vector3;
    prev: Vector3;
    base: Vector3;
    proj: { x: number; y: number; scale: number; alpha: number };
    pinned: boolean;
    excitation: number;
}

interface StructuralConstraint {
    p1: number;
    p2: number;
    length: number;
}

export interface KineticFabricProps {
    headline?: string;
    tagline?: string;
    className?: string;
    showControls?: boolean;
    /** Override the primary accent colour used for excited nodes/links (CSS colour string). */
    accentColor?: string;
    /** Override the background colour (CSS colour string). */
    bgColor?: string;
    /** Override the default stroke colour expressed as an R, G, B triplet string, e.g. "255, 255, 255". */
    strokeRGB?: string;
}

export function KineticFabric({
    headline = "TOPOLOGY",
    tagline = "TENSOR",
    className = "",
    showControls = true,
    accentColor = "#2E90FF",
    bgColor = "#05070A",
    strokeRGB = "255, 255, 255",
}: KineticFabricProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [isRunning, setIsRunning] = useState(true);

    const pointerRef = useRef({
        x: -2000,
        y: -2000,
        prevX: -2000,
        prevY: -2000,
        vx: 0,
        vy: 0,
        targetAngleX: 0.15,
        targetAngleY: 0.0,
        angleX: 0.15,
        angleY: 0.0,
        radius: 190,
        isDown: false,
        shockwaves: [] as { x: number; y: number; radius: number; maxRadius: number; strength: number }[],
    });

    const nodesRef = useRef<PhysicsNode[]>([]);
    const linksRef = useRef<StructuralConstraint[]>([]);
    const dimensionsRef = useRef({ width: 0, height: 0 });

    const buildMesh = useCallback(() => {
        const { width, height } = dimensionsRef.current;
        if (width === 0 || height === 0) return;

        // Adaptive mesh density for mobile vs desktop to maintain 60 FPS
        const isMobile = width < 640;
        const spacing = isMobile ? 44 : 38;
        const cols = Math.ceil((width * 1.2) / spacing) + 1;
        const rows = Math.ceil((height * 1.2) / spacing) + 1;

        const nodes: PhysicsNode[] = [];
        const links: StructuralConstraint[] = [];
        const grid: number[][] = [];

        const startX = -(cols * spacing) / 2;
        const startY = -(rows * spacing) / 2;

        let index = 0;
        for (let j = 0; j < rows; j++) {
            grid[j] = [];
            for (let i = 0; i < cols; i++) {
                const bx = startX + i * spacing;
                const by = startY + j * spacing;
                const bz = 0;

                const isPinned = i === 0 || i === cols - 1 || j === 0 || j === rows - 1;

                nodes.push({
                    curr: { x: bx, y: by, z: bz },
                    prev: { x: bx, y: by, z: bz },
                    base: { x: bx, y: by, z: bz },
                    proj: { x: 0, y: 0, scale: 1, alpha: 1 },
                    pinned: isPinned,
                    excitation: 0,
                });

                grid[j][i] = index++;
            }
        }

        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
                const currIdx = grid[j][i];

                if (i < cols - 1) {
                    links.push({ p1: currIdx, p2: grid[j][i + 1], length: spacing });
                }
                if (j < rows - 1) {
                    links.push({ p1: currIdx, p2: grid[j + 1][i], length: spacing });
                }
                if (i < cols - 1 && j < rows - 1) {
                    links.push({ p1: currIdx, p2: grid[j + 1][i + 1], length: Math.SQRT2 * spacing });
                }
            }
        }

        nodesRef.current = nodes;
        linksRef.current = links;
    }, []);

    // Setup viewport & resize observer
    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        const updateCanvasSize = (w: number, h: number) => {
            if (w <= 0 || h <= 0) return;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            dimensionsRef.current = { width: w, height: h };
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
            buildMesh();
        };

        // Initial sync on mount
        const initialRect = container.getBoundingClientRect();
        if (initialRect.width > 0 && initialRect.height > 0) {
            updateCanvasSize(initialRect.width, initialRect.height);
        }

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const rect = entry.contentRect;
                if (rect.width > 0 && rect.height > 0) {
                    updateCanvasSize(rect.width, rect.height);
                }
            }
        });

        resizeObserver.observe(container);
        return () => resizeObserver.disconnect();
    }, [buildMesh]);

    // Main animation loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        let animId = 0;
        let time = 0;

        const loop = () => {
            if (!isRunning) {
                animId = requestAnimationFrame(loop);
                return;
            }

            time += 0.016;
            const { width, height } = dimensionsRef.current;
            if (width === 0 || height === 0) {
                animId = requestAnimationFrame(loop);
                return;
            }

            const nodes = nodesRef.current;
            const links = linksRef.current;
            const pointer = pointerRef.current;

            const hasActivePointer = pointer.x > -1000 && pointer.y > -1000;

            if (hasActivePointer) {
                pointer.vx = (pointer.x - pointer.prevX) * 0.4;
                pointer.vy = (pointer.y - pointer.prevY) * 0.4;
                pointer.prevX = pointer.x;
                pointer.prevY = pointer.y;

                pointer.angleX += (pointer.targetAngleX - pointer.angleX) * 0.05;
                pointer.angleY += (pointer.targetAngleY - pointer.angleY) * 0.05;
            } else {
                // Autonomous mobile idle animation: gentle Lissajous sway when no finger/cursor
                const idleAngleY = Math.sin(time * 0.5) * 0.12;
                const idleAngleX = Math.cos(time * 0.4) * 0.06 + 0.15;
                pointer.angleX += (idleAngleX - pointer.angleX) * 0.04;
                pointer.angleY += (idleAngleY - pointer.angleY) * 0.04;
                pointer.vx = 0;
                pointer.vy = 0;
            }

            const pointerSpeed = Math.min(Math.sqrt(pointer.vx * pointer.vx + pointer.vy * pointer.vy), 40);

            const cosX = Math.cos(pointer.angleX);
            const sinX = Math.sin(pointer.angleX);
            const cosY = Math.cos(pointer.angleY);
            const sinY = Math.sin(pointer.angleY);

            // Use the configurable background and stroke colours
            const bg = bgColor;
            const stroke = strokeRGB;

            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, width, height);

            // Update shockwaves
            for (let s = pointer.shockwaves.length - 1; s >= 0; s--) {
                const sw = pointer.shockwaves[s];
                sw.radius += 12;
                sw.strength *= 0.94;
                if (sw.radius > sw.maxRadius || sw.strength < 0.01) {
                    pointer.shockwaves.splice(s, 1);
                }
            }

            // Autonomous roving energy wave when idle on mobile
            const autoWaveX = Math.sin(time * 0.7) * (width * 0.35);
            const autoWaveY = Math.cos(time * 0.5) * (height * 0.25);
            const autoRadius = 140;

            // Physics integration
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                if (n.pinned) continue;

                const vx = (n.curr.x - n.prev.x) * 0.955;
                const vy = (n.curr.y - n.prev.y) * 0.955;
                const vz = (n.curr.z - n.prev.z) * 0.955;

                n.prev.x = n.curr.x;
                n.prev.y = n.curr.y;
                n.prev.z = n.curr.z;

                n.curr.x += vx;
                n.curr.y += vy;
                n.curr.z += vz;

                const fluidZ =
                    Math.sin(n.base.x * 0.009 + time) * 16 +
                    Math.cos(n.base.y * 0.011 + time * 1.2) * 12;

                n.curr.x += (n.base.x - n.curr.x) * 0.038;
                n.curr.y += (n.base.y - n.curr.y) * 0.038;
                n.curr.z += (n.base.z + fluidZ - n.curr.z) * 0.038;

                n.excitation *= 0.92;

                // Gentle idle wave glow on mobile
                if (!hasActivePointer) {
                    const adx = n.base.x - autoWaveX;
                    const ady = n.base.y - autoWaveY;
                    const aDist = Math.sqrt(adx * adx + ady * ady);
                    if (aDist < autoRadius) {
                        const ar = 1 - aDist / autoRadius;
                        n.excitation = Math.max(n.excitation, ar * 0.45);
                    }
                }
            }

            const fov = 620;
            const cx = width / 2;
            const cy = height / 2;

            // 3D Projection & Pointer / Shockwave collision
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];

                const rx1 = n.curr.x * cosY + n.curr.z * sinY;
                const ry1 = n.curr.y;
                const rz1 = -n.curr.x * sinY + n.curr.z * cosY;

                const rx2 = rx1;
                const ry2 = ry1 * cosX - rz1 * sinX;
                const rz2 = ry1 * sinX + rz1 * cosX + 460;

                const scale = fov / Math.max(1, rz2);
                n.proj.x = cx + rx2 * scale;
                n.proj.y = cy + ry2 * scale;
                n.proj.scale = scale;
                n.proj.alpha = Math.min(1, Math.max(0.08, (scale - 0.45) * 1.4));

                if (!n.pinned) {
                    // Interaction with finger/mouse pointer
                    if (hasActivePointer) {
                        const dx = n.proj.x - pointer.x;
                        const dy = n.proj.y - pointer.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < pointer.radius && dist > 0) {
                            const ratio = 1 - dist / pointer.radius;
                            const force = ratio * (pointer.isDown ? 42 : 22) + pointerSpeed * 0.4;
                            const angle = Math.atan2(dy, dx);

                            n.curr.x += (Math.cos(angle) * force * 0.8) / n.proj.scale;
                            n.curr.y += (Math.sin(angle) * force * 0.8) / n.proj.scale;
                            n.curr.z -= (force * 2.8) / n.proj.scale;
                            n.excitation = Math.max(n.excitation, ratio);
                        }
                    }

                    // Shockwave interactions
                    for (let s = 0; s < pointer.shockwaves.length; s++) {
                        const sw = pointer.shockwaves[s];
                        const swDx = n.proj.x - sw.x;
                        const swDy = n.proj.y - sw.y;
                        const swDist = Math.sqrt(swDx * swDx + swDy * swDy);
                        const ringDelta = Math.abs(swDist - sw.radius);

                        if (ringDelta < 45) {
                            const impulse = (1 - ringDelta / 45) * sw.strength * 28;
                            n.curr.z += impulse / n.proj.scale;
                            n.excitation = Math.max(n.excitation, 0.8);
                        }
                    }
                }
            }

            // Structural constraint relaxation
            const relaxationPasses = 3;
            for (let p = 0; p < relaxationPasses; p++) {
                for (let i = 0; i < links.length; i++) {
                    const link = links[i];
                    const na = nodes[link.p1];
                    const nb = nodes[link.p2];

                    const dx = nb.curr.x - na.curr.x;
                    const dy = nb.curr.y - na.curr.y;
                    const dz = nb.curr.z - na.curr.z;
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                    const diff = (dist - link.length) / (dist || 1);

                    if (!na.pinned) {
                        na.curr.x += dx * 0.5 * diff;
                        na.curr.y += dy * 0.5 * diff;
                        na.curr.z += dz * 0.5 * diff;
                    }
                    if (!nb.pinned) {
                        nb.curr.x -= dx * 0.5 * diff;
                        nb.curr.y -= dy * 0.5 * diff;
                        nb.curr.z -= dz * 0.5 * diff;
                    }
                }
            }

            // High Performance Canvas Rendering:
            // 1) Batch render unexcited links in a single draw call (Huge mobile FPS gain)
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${stroke}, 0.12)`;
            ctx.lineWidth = 0.75;
            for (let i = 0; i < links.length; i++) {
                const link = links[i];
                const na = nodes[link.p1];
                const nb = nodes[link.p2];
                if (na.excitation <= 0.1 && nb.excitation <= 0.1) {
                    ctx.moveTo(na.proj.x, na.proj.y);
                    ctx.lineTo(nb.proj.x, nb.proj.y);
                }
            }
            ctx.stroke();

            // 2) Render excited links with dynamic blue glow
            for (let i = 0; i < links.length; i++) {
                const link = links[i];
                const na = nodes[link.p1];
                const nb = nodes[link.p2];
                if (na.excitation > 0.1 || nb.excitation > 0.1) {
                    const glow = Math.max(na.excitation, nb.excitation);
                    const avgScale = (na.proj.scale + nb.proj.scale) / 2;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(46, 144, 255, ${Math.min(1, 0.35 + glow * 0.65)})`;
                    ctx.lineWidth = (0.8 + glow * 1.4) * avgScale;
                    ctx.moveTo(na.proj.x, na.proj.y);
                    ctx.lineTo(nb.proj.x, nb.proj.y);
                    ctx.stroke();
                }
            }

            // 3) Batch render excited node dots
            ctx.fillStyle = accentColor;
            ctx.beginPath();
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                if (n.excitation > 0.25) {
                    const r = Math.min(2.8, 1.2 + n.excitation * 2) * n.proj.scale;
                    ctx.moveTo(n.proj.x + r, n.proj.y);
                    ctx.arc(n.proj.x, n.proj.y, r, 0, Math.PI * 2);
                }
            }
            ctx.fill();

            animId = requestAnimationFrame(loop);
        };

        animId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animId);
    }, [isRunning, bgColor, strokeRGB, accentColor]);

    // Pointer & Mouse interactions
    const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        pointerRef.current.x = x;
        pointerRef.current.y = y;

        const normX = (x / rect.width - 0.5) * 2;
        const normY = (y / rect.height - 0.5) * 2;
        pointerRef.current.targetAngleY = normX * 0.38;
        pointerRef.current.targetAngleX = -normY * 0.28 + 0.15;
    };

    const handlePointerDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const container = containerRef.current;
        if (!container) return;

        pointerRef.current.isDown = true;
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        pointerRef.current.shockwaves.push({
            x,
            y,
            radius: 10,
            maxRadius: Math.min(rect.width, rect.height) * 0.85,
            strength: 1.0,
        });
    };

    const handlePointerUp = () => {
        pointerRef.current.isDown = false;
    };

    const handlePointerLeave = () => {
        pointerRef.current.x = -2000;
        pointerRef.current.y = -2000;
        pointerRef.current.isDown = false;
        pointerRef.current.targetAngleX = 0.15;
        pointerRef.current.targetAngleY = 0;
    };

    // Full Mobile Touch Interactions
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (e.touches.length === 0) return;
        const touch = e.touches[0];
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        pointerRef.current.isDown = true;
        pointerRef.current.x = x;
        pointerRef.current.y = y;
        pointerRef.current.prevX = x;
        pointerRef.current.prevY = y;

        const normX = (x / rect.width - 0.5) * 2;
        const normY = (y / rect.height - 0.5) * 2;
        pointerRef.current.targetAngleY = normX * 0.38;
        pointerRef.current.targetAngleX = -normY * 0.28 + 0.15;

        // Trigger dynamic ripple shockwave on mobile touch
        pointerRef.current.shockwaves.push({
            x,
            y,
            radius: 10,
            maxRadius: Math.min(rect.width, rect.height) * 0.85,
            strength: 1.2,
        });
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (e.touches.length === 0) return;
        const touch = e.touches[0];
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        pointerRef.current.x = x;
        pointerRef.current.y = y;

        const normX = (x / rect.width - 0.5) * 2;
        const normY = (y / rect.height - 0.5) * 2;
        pointerRef.current.targetAngleY = normX * 0.38;
        pointerRef.current.targetAngleX = -normY * 0.28 + 0.15;
    };

    const handleTouchEnd = () => {
        pointerRef.current.isDown = false;
        pointerRef.current.x = -2000;
        pointerRef.current.y = -2000;
    };

    // Global pointer listeners for smooth drags & window cancels
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const onWindowPointerMove = (e: PointerEvent) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Only track if cursor is reasonably near or inside container
            if (x >= -80 && x <= rect.width + 80 && y >= -80 && y <= rect.height + 80) {
                pointerRef.current.x = x;
                pointerRef.current.y = y;

                const normX = (x / rect.width - 0.5) * 2;
                const normY = (y / rect.height - 0.5) * 2;
                pointerRef.current.targetAngleY = normX * 0.38;
                pointerRef.current.targetAngleX = -normY * 0.28 + 0.15;
            }
        };

        const onWindowPointerDown = (e: PointerEvent) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                pointerRef.current.isDown = true;
                pointerRef.current.shockwaves.push({
                    x,
                    y,
                    radius: 10,
                    maxRadius: Math.min(rect.width, rect.height) * 0.85,
                    strength: 1.0,
                });
            }
        };

        const onWindowPointerUp = () => {
            pointerRef.current.isDown = false;
        };

        const onWindowPointerCancel = () => {
            pointerRef.current.isDown = false;
            pointerRef.current.x = -2000;
            pointerRef.current.y = -2000;
        };

        window.addEventListener("pointermove", onWindowPointerMove, { passive: true });
        window.addEventListener("pointerdown", onWindowPointerDown, { passive: true });
        window.addEventListener("pointerup", onWindowPointerUp, { passive: true });
        window.addEventListener("pointercancel", onWindowPointerCancel, { passive: true });

        return () => {
            window.removeEventListener("pointermove", onWindowPointerMove);
            window.removeEventListener("pointerdown", onWindowPointerDown);
            window.removeEventListener("pointerup", onWindowPointerUp);
            window.removeEventListener("pointercancel", onWindowPointerCancel);
        };
    }, []);

    const triggerImpulse = () => {
        const { width, height } = dimensionsRef.current;
        pointerRef.current.shockwaves.push({
            x: width / 2,
            y: height / 2,
            radius: 10,
            maxRadius: Math.max(width, height) * 0.8,
            strength: 1.2,
        });
    };

    const hasForeground = showControls || Boolean(headline);

    return (
        <div
            ref={containerRef}
            onMouseMove={handlePointerMove}
            onMouseDown={handlePointerDown}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            className={cn(
                "group relative flex h-full w-full select-none flex-col justify-between overflow-hidden touch-none",
                className
            )}
        >
            {/* 3D Canvas Viewport */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 block h-full w-full cursor-crosshair touch-none"
            />

            {/* Inner Content */}
            {hasForeground && (
                <div className="relative z-20 flex h-full w-full flex-col justify-between p-4 sm:p-6 md:p-8 pointer-events-none">
                    {/* Top bar with controls */}
                    {showControls && (
                        <header className="flex w-full items-center justify-between font-mono text-[11px] gap-2 pointer-events-auto">
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                <span className="relative flex size-2 shrink-0">
                                    <span
                                        className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                                        style={{ backgroundColor: accentColor }}
                                    />
                                    <span
                                        className="relative inline-flex size-2 rounded-full"
                                        style={{ backgroundColor: accentColor }}
                                    />
                                </span>
                                {tagline && (
                                    <span
                                        className="font-semibold tracking-wider uppercase truncate text-[10px] sm:text-[11px]"
                                        style={{ color: "rgba(255,255,255,0.7)" }}
                                    >
                                        {tagline}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                                <button
                                    onClick={triggerImpulse}
                                    type="button"
                                    className="flex items-center gap-1 rounded-lg border px-2.5 py-1.5 backdrop-blur-md transition-all active:scale-95 touch-manipulation cursor-pointer"
                                    style={{
                                        borderColor: "rgba(255,255,255,0.12)",
                                        backgroundColor: "rgba(255,255,255,0.06)",
                                        color: "rgba(255,255,255,0.7)",
                                    }}
                                    title="Trigger Shockwave"
                                >
                                    <Sparkles className="size-3" style={{ color: accentColor }} />
                                    <span className="font-mono text-[10px]">PULSE</span>
                                </button>

                                <button
                                    onClick={() => setIsRunning((prev) => !prev)}
                                    type="button"
                                    className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 backdrop-blur-md transition-all active:scale-95 touch-manipulation cursor-pointer"
                                    style={{
                                        borderColor: "rgba(255,255,255,0.12)",
                                        backgroundColor: "rgba(255,255,255,0.06)",
                                        color: "rgba(255,255,255,0.7)",
                                    }}
                                >
                                    {isRunning ? <Pause className="size-3" /> : <Play className="size-3" />}
                                    <span className="font-mono text-[10px]">{isRunning ? "FREEZE" : "RUN"}</span>
                                </button>
                            </div>
                        </header>
                    )}

                    {/* Center Headline with Responsive Typography */}
                    {headline && (
                        <main className="pointer-events-none flex flex-col items-center justify-center text-center my-auto px-2">
                            <h1
                                className="font-mono text-3xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tight sm:tracking-tighter uppercase select-none max-w-full break-words leading-none"
                                style={{ color: "white" }}
                            >
                                {headline}
                            </h1>
                        </main>
                    )}

                    {/* Bottom spacer */}
                    <div className="h-2" />
                </div>
            )}
        </div>
    );
}

export default KineticFabric;
