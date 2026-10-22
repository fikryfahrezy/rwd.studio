import { useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

// The document and WebGL scene share Lenis's interpolated position. Keeping the
// document timeline independent means the whole site also works without WebGL.
export const studioScroll = { y: 0, velocity: 0, phase: 0, reduced: false };
const colors = [
	"#ece9df",
	"#ffc5ab",
	"#4444e8",
	"#c6b6ef",
	"#dbea66",
	"#f1e9de",
];
const linear = (v: number) =>
	v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
const srgb = (v: number) =>
	v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055;
const palette = colors.map((color) =>
	[1, 3, 5].map((i) => linear(parseInt(color.slice(i, i + 2), 16) / 255)),
);

export function useStudioMotion(
	locked: boolean,
	motion: boolean,
	onChapter: (chapter: number) => void,
) {
	const instance = useRef<Lenis | null>(null);
	const current = useRef({ locked, motion, onChapter });
	current.current = { locked, motion, onChapter };
	useEffect(() => {
		const lenis = new Lenis({
			autoRaf: false,
			lerp: 0.09,
			smoothWheel: true,
			syncTouch: false,
			anchors: true,
			respectReducedMotion: true,
			prevent: (node) => node.hasAttribute("data-lenis-prevent"),
		});
		instance.current = lenis;
		studioScroll.y = window.scrollY;
		lenis.on("scroll", (event) => {
			studioScroll.y = event.animatedScroll;
			studioScroll.velocity = event.velocity;
		});
		const journey = document.getElementById("journey")!;
		const world = document.getElementById("world")!;
		const panels = Array.from(
			document.querySelectorAll<HTMLElement>("[data-chapter-copy]"),
		);
		const preference = matchMedia("(prefers-reduced-motion: reduce)");
		let frame = 0,
			lastChapter = -1;
		function tick(time: number) {
			lenis.raf(time);
			if (!current.current.locked) {
				const travel = Math.max(1, journey.offsetHeight - innerHeight);
				const raw = Math.max(
					0,
					Math.min(5, ((studioScroll.y - journey.offsetTop) / travel) * 5),
				);
				const reduced = preference.matches || !current.current.motion;
				const p = reduced ? Math.round(raw) : raw;
				studioScroll.phase = p;
				studioScroll.reduced = reduced;
				const chapter = Math.min(5, Math.floor(raw + 0.5));
				if (chapter !== lastChapter) {
					lastChapter = chapter;
					current.current.onChapter(chapter);
				}
				const a = Math.min(4, Math.floor(p)),
					f = p - a,
					smooth = f * f * (3 - 2 * f);
				const rgb = palette[a].map((v, i) =>
					Math.round(srgb(v + (palette[a + 1][i] - v) * smooth) * 255),
				);
				const background = `rgb(${rgb.join(",")})`;
				world.style.backgroundColor = background;
				world.style.setProperty("--journey-progress", String(raw / 5));
				panels.forEach((panel, i) => {
					const distance = p - i;
					panel.style.opacity = String(Math.max(0, 1 - Math.abs(distance) * 2));
					panel.style.transform = reduced
						? "none"
						: `translate3d(${distance * -45}px,${distance * -50}px,0) rotate(${distance * -2}deg)`;
					panel.style.visibility =
						Math.abs(distance) < 0.65 ? "visible" : "hidden";
				});
			}
			frame = requestAnimationFrame(tick);
		}
		frame = requestAnimationFrame(tick);
		return () => {
			cancelAnimationFrame(frame);
			lenis.destroy();
			instance.current = null;
		};
	}, []);
	useEffect(() => {
		if (locked) instance.current?.stop();
		else instance.current?.start();
	}, [locked]);
	return instance;
}
