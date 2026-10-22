import { useEffect, useRef, useState } from "react";
import type { BufferGeometry, Material, Group } from "three";
import type { Locale } from "../content";
import { experience } from "../experience";
import { studioScroll } from "../hooks/useStudioMotion";

// Screen-relative anchors keep the tools in the open space around the copy.
// Each pose is [viewport x, viewport y, depth, size]. Lenis still interpolates
// between every pose; portrait layouts have their own composition.
const frames = [
	[
		[0.13, 0.41, 0, 0.8],
		[0.87, 0.48, 0.4, 0.85],
		[0.56, 0.76, 1, 0.8],
		[0.31, 0.77, 1, 0.65],
	],
	[
		[0.13, 0.58, -1, 0.65],
		[0.88, 0.56, -0.5, 0.75],
		[0.24, 0.69, 1, 0.6],
		[0.83, 0.75, 0.5, 0.65],
	],
	[
		[0.73, 0.47, 1, 1.45],
		[0.92, 0.74, -3, 0.45],
		[0.92, 0.34, -3, 0.4],
		[0.57, 0.18, -2, 0.38],
	],
	[
		[0.59, 0.18, -3, 0.42],
		[0.73, 0.45, 1, 1.45],
		[0.92, 0.75, -1, 0.42],
		[0.93, 0.45, -2, 0.5],
	],
	[
		[0.59, 0.18, -2, 0.4],
		[0.51, 0.77, -3, 0.45],
		[0.69, 0.43, 1, 1.35],
		[0.88, 0.35, 2, 0.75],
	],
	[
		[0.14, 0.35, -1, 0.65],
		[0.86, 0.32, -1, 0.7],
		[0.17, 0.7, 0, 0.65],
		[0.87, 0.68, 1, 0.65],
	],
];
const portraitFrames = [
	[
		[0.26, 0.55, 0, 1.15],
		[0.65, 0.64, 0.4, 1],
		[0.24, 0.65, 1, 0.8],
		[0.53, 0.55, 1, 0.65],
	],
	[
		[0.23, 0.52, -1, 0.8],
		[0.76, 0.54, -0.5, 0.85],
		[0.11, 0.7, 1, 0.5],
		[0.49, 0.56, 0.5, 0.5],
	],
	[
		[0.58, 0.51, 1, 1.4],
		[0.13, 0.57, -3, 0.45],
		[0.85, 0.62, -3, 0.45],
		[0.2, 0.43, -2, 0.4],
	],
	[
		[0.22, 0.44, -3, 0.5],
		[0.6, 0.54, 1, 1.4],
		[0.15, 0.6, -1, 0.45],
		[0.87, 0.58, -2, 0.45],
	],
	[
		[0.17, 0.5, -2, 0.45],
		[0.16, 0.61, -3, 0.5],
		[0.62, 0.56, 1, 1.2],
		[0.89, 0.52, 2, 0.6],
	],
	[
		[0.18, 0.55, -1, 0.65],
		[0.81, 0.55, -1, 0.65],
		[0.12, 0.28, 0, 0.4],
		[0.89, 0.29, 1, 0.4],
	],
];
export default function StudioScene({
	locale,
	suspended,
	motion,
	onSelect,
}: {
	locale: Locale;
	suspended: boolean;
	motion: boolean;
	onSelect: (n: number) => void;
}) {
	const host = useRef<HTMLDivElement>(null);
	const current = useRef({ locale, suspended, motion, onSelect });
	current.current = { locale, suspended, motion, onSelect };
	const [ready, setReady] = useState(false);
	const [hover, setHover] = useState(-1);
	useEffect(() => {
		let cancelled = false,
			dispose: (() => void) | undefined;
		const element = host.current;
		if (!element) return;
		async function setup() {
			const THREE = await import("three");
			const { RoomEnvironment } = await import(
				"three/addons/environments/RoomEnvironment.js"
			);
			const { RoundedBoxGeometry } = await import(
				"three/addons/geometries/RoundedBoxGeometry.js"
			);
			if (cancelled || !element) return;
			const renderer = new THREE.WebGLRenderer({
				alpha: true,
				antialias: true,
				preserveDrawingBuffer: true,
				powerPreference: "low-power",
			});
			renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
			renderer.setClearColor(0, 0);
			renderer.toneMapping = THREE.ACESFilmicToneMapping;
			renderer.toneMappingExposure = 1.2;
			element.appendChild(renderer.domElement);
			const scene = new THREE.Scene(),
				camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
			camera.position.z = 13;
			const generator = new THREE.PMREMGenerator(renderer),
				room = new RoomEnvironment(),
				environment = generator.fromScene(room, 0.04);
			scene.environment = environment.texture;
			room.dispose();
			generator.dispose();
			scene.add(new THREE.AmbientLight(0xffffff, 1));
			const light = new THREE.DirectionalLight(0xffffff, 3);
			light.position.set(-3, 5, 5);
			scene.add(light);
			const mats = {
				blue: new THREE.MeshPhysicalMaterial({
					color: 0x292bcf,
					roughness: 0.24,
					metalness: 0.18,
					clearcoat: 1,
				}),
				pink: new THREE.MeshPhysicalMaterial({
					color: 0xff95cd,
					roughness: 0.28,
					clearcoat: 1,
				}),
				orange: new THREE.MeshPhysicalMaterial({
					color: 0xff6138,
					roughness: 0.3,
					clearcoat: 1,
				}),
				cream: new THREE.MeshStandardMaterial({
					color: 0xf8ebd8,
					roughness: 0.5,
				}),
				lime: new THREE.MeshPhysicalMaterial({
					color: 0xd9f23e,
					roughness: 0.3,
					clearcoat: 1,
				}),
				black: new THREE.MeshPhysicalMaterial({
					color: 0x1b1a22,
					roughness: 0.2,
					metalness: 0.25,
				}),
				silver: new THREE.MeshPhysicalMaterial({
					color: 0xffffff,
					metalness: 1,
					roughness: 0.18,
				}),
				purple: new THREE.MeshPhysicalMaterial({
					color: 0xb7a0ef,
					roughness: 0.25,
					clearcoat: 1,
				}),
				glass: new THREE.MeshPhysicalMaterial({
					color: 0x4846c0,
					metalness: 0.8,
					roughness: 0.1,
					clearcoat: 1,
				}),
			};
			const geometries: BufferGeometry[] = [];
			function part(
				group: Group,
				geometry: BufferGeometry,
				material: Material,
				x = 0,
				y = 0,
				z = 0,
			) {
				geometries.push(geometry);
				const mesh = new THREE.Mesh(geometry, material);
				mesh.position.set(x, y, z);
				group.add(mesh);
				return mesh;
			}
			const box = (x: number, y: number, z: number, r = 0.1) =>
				new RoundedBoxGeometry(x, y, z, 3, r);
			const items = [
				new THREE.Group(),
				new THREE.Group(),
				new THREE.Group(),
				new THREE.Group(),
			];
			// A complete miniature interface, modelled as layers in 3D.
			const browser = items[0];
			part(browser, box(2.8, 1.95, 0.22), mats.purple);
			part(browser, box(2.58, 1.55, 0.07, 0.04), mats.cream, 0, -0.08, 0.14);
			for (let i = 0; i < 3; i++)
				part(
					browser,
					new THREE.SphereGeometry(0.055, 12, 10),
					[mats.orange, mats.lime, mats.blue][i],
					-1.16 + i * 0.18,
					0.8,
					0.15,
				);
			part(browser, box(1.05, 0.14, 0.03, 0.035), mats.black, -0.56, 0.41, 0.2);
			part(
				browser,
				box(0.75, 0.08, 0.03, 0.025),
				mats.purple,
				-0.71,
				0.15,
				0.2,
			);
			part(
				browser,
				box(0.9, 0.08, 0.03, 0.025),
				mats.purple,
				-0.63,
				-0.02,
				0.2,
			);
			part(
				browser,
				box(0.65, 0.28, 0.08, 0.08),
				mats.orange,
				-0.75,
				-0.48,
				0.22,
			);
			const screenOrb = part(
				browser,
				new THREE.TorusGeometry(0.43, 0.12, 18, 48),
				mats.blue,
				0.65,
				-0.03,
				0.4,
			);
			screenOrb.rotation.set(0.4, 0.6, 0);
			const pointerShape = new THREE.Shape();
			pointerShape.moveTo(0, 0);
			pointerShape.lineTo(0, -0.65);
			pointerShape.lineTo(0.18, -0.49);
			pointerShape.lineTo(0.33, -0.76);
			pointerShape.lineTo(0.47, -0.68);
			pointerShape.lineTo(0.32, -0.42);
			pointerShape.lineTo(0.55, -0.39);
			pointerShape.closePath();
			part(
				browser,
				new THREE.ExtrudeGeometry(pointerShape, {
					depth: 0.08,
					bevelEnabled: true,
					bevelThickness: 0.025,
					bevelSize: 0.025,
					bevelSegments: 2,
					steps: 1,
				}),
				mats.lime,
				0.65,
				-0.4,
				0.65,
			);
			// The film camera is also an entrance to the film chapter.
			const film = items[1];
			part(film, box(1.9, 1.25, 0.8, 0.17), mats.orange);
			const lens = part(
				film,
				new THREE.CylinderGeometry(0.47, 0.52, 0.65, 40),
				mats.black,
				0.1,
				0,
				0.67,
			);
			lens.rotation.x = Math.PI / 2;
			const rim = part(
				film,
				new THREE.TorusGeometry(0.43, 0.07, 16, 40),
				mats.silver,
				0.1,
				0,
				1.02,
			);
			part(film, new THREE.CircleGeometry(0.37, 40), mats.glass, 0.1, 0, 1.04);
			for (const x of [-0.52, 0.52]) {
				const reel = part(
					film,
					new THREE.CylinderGeometry(0.45, 0.45, 0.22, 32),
					mats.black,
					x,
					0.91,
					0,
				);
				reel.rotation.x = Math.PI / 2;
				part(
					film,
					new THREE.CircleGeometry(0.37, 32),
					mats.purple,
					x,
					0.91,
					0.12,
				);
				for (let n = 0; n < 5; n++) {
					const a = (n / 5) * Math.PI * 2;
					part(
						film,
						new THREE.CircleGeometry(0.075, 12),
						mats.black,
						x + Math.cos(a) * 0.23,
						0.91 + Math.sin(a) * 0.23,
						0.125,
					);
				}
			}
			part(film, box(0.38, 0.25, 0.5, 0.06), mats.black, -0.75, 0.13, -0.6);
			part(film, box(0.45, 0.18, 0.45, 0.04), mats.black, 0, -0.7, 0);
			// A sculptural knot and a full-sized pencil share the motion/illustration chapter.
			part(
				items[2],
				new THREE.TorusKnotGeometry(0.7, 0.23, 100, 20, 2, 3),
				mats.blue,
			);
			const pencil = items[3];
			part(pencil, new THREE.CylinderGeometry(0.17, 0.17, 2.5, 6), mats.lime);
			part(
				pencil,
				new THREE.CylinderGeometry(0.18, 0.18, 0.22, 20),
				mats.silver,
				0,
				1.3,
				0,
			);
			part(
				pencil,
				new THREE.CapsuleGeometry(0.17, 0.22, 4, 16),
				mats.pink,
				0,
				1.55,
				0,
			);
			const wood = part(
				pencil,
				new THREE.ConeGeometry(0.17, 0.5, 6),
				mats.cream,
				0,
				-1.5,
				0,
			);
			wood.rotation.z = Math.PI;
			const lead = part(
				pencil,
				new THREE.ConeGeometry(0.065, 0.19, 6),
				mats.black,
				0,
				-1.76,
				0,
			);
			lead.rotation.z = Math.PI;
			items.forEach((group, i) => {
				group.userData.item = i;
				scene.add(group);
			});
			const extras: Group[] = [];
			for (let i = 0; i < 7; i++) {
				const group = new THREE.Group();
				const geo =
					i % 3 === 0
						? new THREE.TorusGeometry(0.22, 0.1, 12, 24)
						: i % 3 === 1
							? new THREE.SphereGeometry(0.18, 20, 12)
							: new THREE.OctahedronGeometry(0.26);
				part(
					group,
					geo,
					[mats.orange, mats.purple, mats.lime, mats.silver][i % 4],
				);
				scene.add(group);
				extras.push(group);
			}
			const raycaster = new THREE.Raycaster(),
				pointer = new THREE.Vector2(-9, -9);
			let width = 1,
				height = 1,
				active = true,
				hovered = -1,
				hasRendered = false,
				burst = 0;
			const resize = () => {
				const rect = element.getBoundingClientRect();
				width = rect.width;
				height = rect.height;
				if (!width || !height) return;
				renderer.setSize(width, height);
				camera.aspect = width / height;
				camera.updateProjectionMatrix();
			};
			const observer = new ResizeObserver(resize);
			observer.observe(element);
			const visibility = new IntersectionObserver(([entry]) => {
				active = entry.isIntersecting;
			});
			visibility.observe(element);
			const move = (event: PointerEvent) => {
				if ((event.target as Element).closest(".readable-copy")) {
					pointer.set(-9, -9);
					return;
				}
				const rect = element.getBoundingClientRect();
				pointer.set(
					((event.clientX - rect.left) / width) * 2 - 1,
					(-(event.clientY - rect.top) / height) * 2 + 1,
				);
			};
			const leave = () => {
				pointer.set(-9, -9);
				setHover(-1);
				hovered = -1;
			};
			const click = (event: MouseEvent) => {
				if (
					(event.target as Element).closest(
						"button,a,input,textarea,.readable-copy",
					)
				)
					return;
				const rect = element.getBoundingClientRect();
				pointer.set(
					((event.clientX - rect.left) / width) * 2 - 1,
					(-(event.clientY - rect.top) / height) * 2 + 1,
				);
				raycaster.setFromCamera(pointer, camera);
				const hit = raycaster.intersectObjects(items, true)[0];
				if (hit) {
					let object = hit.object;
					while (object.parent && object.userData.item === undefined)
						object = object.parent;
					if (object.userData.item !== undefined) {
						burst = studioScroll.reduced ? 0 : 1;
						current.current.onSelect(object.userData.item);
					}
				}
			};
			const eventSurface = element.parentElement!;
			eventSurface.addEventListener("pointermove", move);
			eventSurface.addEventListener("pointerleave", leave);
			eventSurface.addEventListener("click", click);
			const lost = (event: Event) => {
				event.preventDefault();
				renderer.setAnimationLoop(null);
				setReady(false);
			};
			renderer.domElement.addEventListener("webglcontextlost", lost);
			const target = new THREE.Vector3();
			renderer.setAnimationLoop((time) => {
				if (!active || document.hidden || current.current.suspended) return;
				const p = studioScroll.phase;
				const reduced = studioScroll.reduced;
				const a = Math.min(4, Math.floor(p)),
					b = a + 1,
					f = p - a,
					s = f * f * (3 - 2 * f);
				const portrait = width <= 700 || width < height;
				const viewportScale = Math.min(1, width / height, portrait ? 0.55 : 1);
				const poses = portrait ? portraitFrames : frames;
				camera.position.z = portrait ? 14.8 : 13 - Math.sin(p * Math.PI) * 0.7;
				camera.position.x = reduced ? 0 : Math.sin(p * Math.PI) * 0.22;
				camera.lookAt(0, 0, 0);
				raycaster.setFromCamera(pointer, camera);
				const hits = raycaster.intersectObjects(items, true);
				let next = -1;
				if (hits.length) {
					let obj = hits[0].object;
					while (obj.parent && obj.userData.item === undefined)
						obj = obj.parent;
					next = obj.userData.item ?? -1;
				}
				if (next !== hovered) {
					hovered = next;
					setHover(next);
					eventSurface.style.cursor = next >= 0 ? "pointer" : "auto";
				}
				items.forEach((group, i) => {
					const from = poses[a][i],
						to = poses[b][i];
					const x = THREE.MathUtils.lerp(from[0], to[0], s),
						y = THREE.MathUtils.lerp(from[1], to[1], s),
						z = THREE.MathUtils.lerp(from[2], to[2], s);
					const bob = reduced ? 0 : Math.sin(time * 0.001 + i * 1.8) * 0.025;
					const viewHeight =
						2 *
						Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) *
						(camera.position.z - z);
					const size = (viewHeight / 10) * viewportScale;
					target.set(
						(x - 0.5) * viewHeight * camera.aspect,
						(0.5 - y) * viewHeight + bob,
						z,
					);
					if (!reduced && hovered === i) target.z += 0.45;
					group.position.lerp(target, reduced ? 1 : 0.14);
					const scale =
						THREE.MathUtils.lerp(from[3], to[3], s) *
						size *
						(hovered === i && !reduced ? 1.08 : 1);
					group.scale.lerp(
						new THREE.Vector3(scale, scale, scale),
						reduced ? 1 : 0.16,
					);
					const rotation = p * Math.PI * 0.7 + i * 0.3;
					group.rotation.set(
						reduced ? 0.12 : Math.sin(rotation) * 0.22,
						reduced ? -0.25 : Math.sin(rotation * 0.75) * 0.55,
						(i === 3 ? -0.5 : 0) + (reduced ? 0 : Math.sin(rotation) * 0.16),
					);
				});
				burst *= 0.92;
				extras.forEach((group, i) => {
					const angle = (i / 7) * Math.PI * 2 + p * 0.8;
					const discipline = Math.max(0, Math.min(1, p - 1, 5 - p));
					const viewHeight =
						2 *
						Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) *
						(camera.position.z + 1);
					const cx = portrait ? 0.5 : 0.5 + discipline * 0.24;
					const cy = portrait ? 0.55 : 0.5 - discipline * 0.06;
					const rx = portrait ? 0.4 : 0.44 - discipline * 0.24;
					const ry = portrait ? 0.1 : 0.34 - discipline * 0.16;
					group.position.set(
						(cx + Math.cos(angle) * rx - 0.5) * viewHeight * camera.aspect,
						(0.5 - cy + Math.sin(angle) * ry) * viewHeight,
						-1,
					);
					group.rotation.set(p + i, angle, p * 0.5);
					group.scale.setScalar(
						(viewHeight / 10) * viewportScale * (0.65 + burst * 0.2),
					);
				});
				screenOrb.rotation.z = p * 2;
				rim.rotation.z = p;
				renderer.render(scene, camera);
				if (!hasRendered) {
					hasRendered = true;
					setReady(true);
				}
			});
			resize();
			dispose = () => {
				renderer.setAnimationLoop(null);
				observer.disconnect();
				visibility.disconnect();
				eventSurface.removeEventListener("pointermove", move);
				eventSurface.removeEventListener("pointerleave", leave);
				eventSurface.removeEventListener("click", click);
				renderer.domElement.removeEventListener("webglcontextlost", lost);
				geometries.forEach((g) => g.dispose());
				Object.values(mats).forEach((m) => m.dispose());
				environment.dispose();
				renderer.dispose();
				renderer.forceContextLoss();
				renderer.domElement.remove();
			};
		}
		setup().catch(() => {
			if (!cancelled) setReady(false);
		});
		return () => {
			cancelled = true;
			dispose?.();
		};
	}, []);
	return (
		<>
			<div ref={host} className="play-world-canvas" aria-hidden="true" />
			{!ready && (
				<div className="world-fallback" aria-hidden="true">
					<span>✳</span>
					<span>↗</span>
					<span>◎</span>
				</div>
			)}
			{hover >= 0 && (
				<span className="object-tooltip">
					{experience[locale].labels[hover]} ↗
				</span>
			)}
		</>
	);
}
