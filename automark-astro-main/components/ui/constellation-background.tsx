'use client';

import React, { useEffect, useRef } from 'react';

interface Node {
    x: number;
    y: number;
    vx: number;
    vy: number;
    baseX: number;
    baseY: number;
    radius: number;
    label: string;
    pulse: number;
}

export interface ConstellationBackgroundProps {
    children?: React.ReactNode;
    className?: string;
    /** Accent color for hovered rings and coordinates (e.g. LapCircuit brand #2E90FF) */
    accentColor?: string;
    /** RGB color tuple for nodes and lines (default: '46, 144, 255' for LapCircuit electric blue) */
    nodeColor?: string;
    /** Background color of canvas. 'transparent' preserves underlying gradients */
    backgroundColor?: string;
    /** Spacing between grid nodes in px (default: 55) */
    spacing?: number;
    /** Interaction radius around mouse in px (default: 200) */
    interactiveRadius?: number;
    /** Line connection max distance in px (default: 80) */
    maxConnectionDistance?: number;
    /** Max line opacity (default: 0.35) */
    lineOpacity?: number;
    /** Base opacity of nodes when idle (default: 0.45) */
    baseNodeOpacity?: number;
    /** Show radar ping rings on nearby nodes (default: true) */
    showRadarRings?: boolean;
    /** Show hex coordinate badges (default: true) */
    showCoordinates?: boolean;
}

export default function ConstellationBackground({
    children,
    className = 'absolute inset-0',
    accentColor = '#2E90FF',
    nodeColor = '46, 144, 255',
    backgroundColor = 'transparent',
    spacing = 55,
    interactiveRadius = 200,
    maxConnectionDistance = 80,
    lineOpacity = 0.35,
    baseNodeOpacity = 0.45,
    showRadarRings = true,
    showCoordinates = true,
}: ConstellationBackgroundProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        const isTransparent = backgroundColor === 'transparent';
        const ctx = canvas.getContext('2d', { alpha: isTransparent });
        if (!ctx) return;

        let animationFrameId: number;
        let width = 0;
        let height = 0;
        let cols = 0;
        let rows = 0;

        const mouse = {
            x: -2000,
            y: -2000,
            prevX: -2000,
            prevY: -2000,
            vx: 0,
            vy: 0,
            radius: interactiveRadius,
        };

        let nodes: Node[] = [];

        const initNodes = (w: number, h: number) => {
            nodes = [];
            cols = Math.ceil(w / spacing) + 1;
            rows = Math.ceil(h / spacing) + 1;

            // Cap grid size for maximum performance safety
            cols = Math.min(cols, 80);
            rows = Math.min(rows, 60);

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * spacing;
                    const y = j * spacing;
                    nodes.push({
                        x,
                        y,
                        vx: 0,
                        vy: 0,
                        baseX: x,
                        baseY: y,
                        radius: Math.random() * 0.8 + 1.4,
                        label: `${(i * 7).toString(16).toUpperCase()}:${(j * 11).toString(16).toUpperCase()}`,
                        pulse: Math.random() * Math.PI * 2,
                    });
                }
            }
        };

        const handleResize = () => {
            if (!container || !canvas) return;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const parent = container.parentElement;
            const rect = container.getBoundingClientRect();

            width = rect.width || parent?.clientWidth || window.innerWidth;
            height = rect.height || parent?.clientHeight || window.innerHeight;

            // Safety limit to guarantee 60fps even in ultra-tall sections
            height = Math.min(height, 2200);

            if (width <= 0 || height <= 0) return;

            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            if (ctx.resetTransform) {
                ctx.resetTransform();
            } else {
                ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
            ctx.scale(dpr, dpr);
            initNodes(width, height);
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!container) return;
            const rect = container.getBoundingClientRect();

            // Check if cursor is near this container
            if (
                e.clientX >= rect.left - 100 &&
                e.clientX <= rect.right + 100 &&
                e.clientY >= rect.top - 100 &&
                e.clientY <= rect.bottom + 100
            ) {
                mouse.x = e.clientX - rect.left;
                mouse.y = e.clientY - rect.top;
            } else {
                mouse.x = -2000;
                mouse.y = -2000;
            }
        };

        const handleMouseLeave = () => {
            mouse.x = -2000;
            mouse.y = -2000;
        };

        handleResize();
        const resizeObserver = new ResizeObserver(() => handleResize());
        resizeObserver.observe(container);

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('mouseleave', handleMouseLeave);

        let lastTime = performance.now();
        const MAX_CONN_DIST_SQ = maxConnectionDistance * maxConnectionDistance;
        const SPRING_K = 18;
        const DAMPING = 0.82;

        const render = (now: number) => {
            const dt = Math.min((now - lastTime) / 1000, 0.05);
            lastTime = now;

            // Mouse velocity
            mouse.vx = (mouse.x - mouse.prevX) / (dt * 1000 || 1);
            mouse.vy = (mouse.y - mouse.prevY) / (dt * 1000 || 1);
            mouse.prevX = mouse.x;
            mouse.prevY = mouse.y;

            const speed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);

            if (isTransparent) {
                ctx.clearRect(0, 0, width, height);
            } else {
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(0, 0, width, height);
            }

            // 1. Update Physics (O(N))
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                n.pulse += dt * 3;

                if (mouse.x > -1000) {
                    const dx = mouse.x - n.x;
                    const dy = mouse.y - n.y;
                    if (Math.abs(dx) < mouse.radius && Math.abs(dy) < mouse.radius) {
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < mouse.radius && dist > 0) {
                            const power = 1 - dist / mouse.radius;
                            const force = power * (1600 + speed * 150);
                            const angle = Math.atan2(dy, dx);
                            n.vx -= Math.cos(angle) * force * dt;
                            n.vy -= Math.sin(angle) * force * dt;
                        }
                    }
                }

                const homeDx = n.baseX - n.x;
                const homeDy = n.baseY - n.y;
                n.vx += homeDx * SPRING_K * dt;
                n.vy += homeDy * SPRING_K * dt;

                n.vx *= DAMPING;
                n.vy *= DAMPING;

                n.x += n.vx * dt * 60;
                n.y += n.vy * dt * 60;
            }

            // 2. Draw Connections - High-Performance O(N) Grid Neighbour Search
            // Only checks adjacent grid nodes (right, bottom, bottom-right, bottom-left)
            for (let c = 0; c < cols; c++) {
                for (let r = 0; r < rows; r++) {
                    const idx = c * rows + r;
                    const n = nodes[idx];
                    if (!n) continue;

                    // 4 neighbour candidates
                    const neighbors = [
                        c + 1 < cols ? nodes[(c + 1) * rows + r] : null,
                        r + 1 < rows ? nodes[c * rows + (r + 1)] : null,
                        c + 1 < cols && r + 1 < rows ? nodes[(c + 1) * rows + (r + 1)] : null,
                        c - 1 >= 0 && r + 1 < rows ? nodes[(c - 1) * rows + (r + 1)] : null,
                    ];

                    for (let k = 0; k < neighbors.length; k++) {
                        const n2 = neighbors[k];
                        if (!n2) continue;

                        const ndx = n.x - n2.x;
                        const ndy = n.y - n2.y;
                        const distSq = ndx * ndx + ndy * ndy;

                        if (distSq < MAX_CONN_DIST_SQ) {
                            const nDist = Math.sqrt(distSq);
                            const alpha = (1 - nDist / maxConnectionDistance) * lineOpacity;
                            ctx.strokeStyle = `rgba(${nodeColor}, ${alpha})`;
                            ctx.lineWidth = 0.8;
                            ctx.beginPath();
                            ctx.moveTo(n.x, n.y);
                            ctx.lineTo(n2.x, n2.y);
                            ctx.stroke();
                        }
                    }
                }
            }

            // 3. Render Nodes & Interactive Accents (O(N))
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                let isNear = false;
                let dist = 9999;

                if (mouse.x > -1000) {
                    const dx = mouse.x - n.x;
                    const dy = mouse.y - n.y;
                    if (Math.abs(dx) < mouse.radius && Math.abs(dy) < mouse.radius) {
                        dist = Math.sqrt(dx * dx + dy * dy);
                        isNear = dist < mouse.radius;
                    }
                }

                const baseAlpha = isNear ? 1 : baseNodeOpacity + Math.sin(n.pulse) * 0.15;
                ctx.fillStyle = isNear ? accentColor : `rgba(${nodeColor}, ${baseAlpha})`;

                const currentRadius = isNear ? n.radius * 2.2 : n.radius + Math.sin(n.pulse) * 0.25;
                ctx.beginPath();
                ctx.arc(n.x, n.y, Math.max(0.8, currentRadius), 0, Math.PI * 2);
                ctx.fill();

                if (showRadarRings && isNear && dist < 95) {
                    const pulseRing = ((n.pulse * 20) % 30) + 4;
                    const ringAlpha = (1 - pulseRing / 34) * 0.55;
                    ctx.strokeStyle = `rgba(46, 144, 255, ${ringAlpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(n.x, n.y, pulseRing, 0, Math.PI * 2);
                    ctx.stroke();

                    if (showCoordinates) {
                        ctx.font = '9px ui-monospace, SFMono-Regular, Consolas, monospace';
                        ctx.fillStyle = accentColor;
                        ctx.fillText(n.label, n.x + 10, n.y - 10);
                    }
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [
        accentColor,
        nodeColor,
        backgroundColor,
        spacing,
        interactiveRadius,
        maxConnectionDistance,
        lineOpacity,
        baseNodeOpacity,
        showRadarRings,
        showCoordinates,
    ]);

    return (
        <div
            ref={containerRef}
            className={`pointer-events-none select-none overflow-hidden ${className}`}
            style={{ minHeight: '100%' }}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full block pointer-events-none z-0"
            />
            {children && (
                <div className="relative z-10 w-full h-full pointer-events-auto">
                    {children}
                </div>
            )}
        </div>
    );
}
