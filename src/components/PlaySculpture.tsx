import { useEffect, useRef } from "react";

// A lightweight, original parametric sculpture. No WebGL dependency or asset download.
export default function PlaySculpture({ paused }: { paused: boolean }) {
	const ref = useRef<HTMLCanvasElement>(null);
	const pointer = useRef({ x: 0, y: 0 });
	useEffect(() => {
		const canvas = ref.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		let frame = 0,
			angle = 0.45,
			visible = true;
		const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
		let width = 0,
			height = 0;
		const resize = () => {
			const box = canvas.getBoundingClientRect();
			width = box.width;
			height = box.height;
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = width * dpr;
			canvas.height = height * dpr;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			draw();
		};
		function draw() {
			if (!ctx) return;
			ctx.clearRect(0, 0, width, height);
			const scale = Math.min(width, height) * 0.235;
			const ax = 0.58 + pointer.current.y * 0.3;
			const ay = angle + pointer.current.x * 0.45;
			const points: { x: number; y: number; z: number; radius: number }[] = [];
			for (let i = 0; i < 110; i++) {
				const u = (i / 110) * Math.PI * 2;
				const radial = 1.18 + 0.27 * Math.cos(3 * u);
				for (let j = 0; j < 29; j++) {
					const v = (j / 29) * Math.PI * 2;
					const r = radial + 0.43 * Math.cos(v);
					const x = r * Math.cos(2 * u),
						y = r * Math.sin(2 * u),
						z = 0.6 * Math.sin(3 * u) + 0.43 * Math.sin(v);
					const x1 = x * Math.cos(ay) + z * Math.sin(ay);
					const z1 = -x * Math.sin(ay) + z * Math.cos(ay);
					points.push({
						x: x1,
						y: y * Math.cos(ax) - z1 * Math.sin(ax),
						z: y * Math.sin(ax) + z1 * Math.cos(ax),
						radius: 0.031,
					});
				}
			}
			points.sort((a, b) => a.z - b.z);
			for (const p of points) {
				const perspective = 5 / (5 - p.z);
				const light = 28 + (p.z + 1.8) * 12;
				ctx.beginPath();
				ctx.arc(
					width / 2 + p.x * scale * perspective,
					height / 2 + p.y * scale * perspective,
					p.radius * scale * perspective,
					0,
					Math.PI * 2,
				);
				ctx.fillStyle = `hsl(236 95% ${light}%)`;
				ctx.fill();
			}
		}
		let previous = 0;
		function loop(now: number) {
			if (visible && !paused && !motion.matches && now - previous > 32) {
				angle += 0.003;
				draw();
				previous = now;
			}
			frame = requestAnimationFrame(loop);
		}
		const observer = new ResizeObserver(resize);
		observer.observe(canvas);
		const visibility = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
		});
		visibility.observe(canvas);
		const move = (e: PointerEvent) => {
			if (paused || motion.matches) return;
			const rect = canvas.getBoundingClientRect();
			pointer.current = {
				x: (e.clientX - rect.left) / rect.width - 0.5,
				y: (e.clientY - rect.top) / rect.height - 0.5,
			};
			draw();
		};
		canvas.addEventListener("pointermove", move);
		frame = requestAnimationFrame(loop);
		return () => {
			observer.disconnect();
			visibility.disconnect();
			cancelAnimationFrame(frame);
			canvas.removeEventListener("pointermove", move);
		};
	}, [paused]);
	return <canvas ref={ref} className="sculpture" aria-hidden="true" />;
}
