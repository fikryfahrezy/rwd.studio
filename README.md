# RWD Studio — Ideas in play

A bilingual, scroll-directed studio playground built with React, TanStack Start, Rsbuild, Lenis, and Three.js.

## Local development

```sh
bun install
bun run dev
```

For a static preview, run `bun run build` and serve `dist/client`.

## Current design direction

The entire site is a six-chapter, full-screen 3D journey. Lenis's animated scroll position drives the camera, object arrangements, background colors, typography, and navigation progress. Visitors can jump to chapters using the bottom navigation. Clicking the browser, film camera, sculptural knot, or pencil leads to the associated discipline; selecting it again opens the capability details. Enquiries open a bilingual email brief addressed to `fahrezyfikry@gmail.com`.

The visual direction has been accepted. Production build and TypeScript checks pass. Browser checks cover all six chapters, service dialogs, the email brief, persisted language selection, layouts at 320/390/768px, reduced motion, and navigation without WebGL. No browser runtime errors or failed asset requests were observed.

- `src/components/StudioScene.tsx`: modelled creative tools, lighting, raycast interaction, and scroll choreography.
- `src/hooks/useStudioMotion.ts`: Lenis, document choreography, and the shared scroll signal; navigation and copy remain usable without WebGL.
- `src/routes/index.tsx`: chapter composition, navigation, service details, and enquiry form.
- `src/experience.ts`: bilingual journey copy.
- `src/content.ts`: service information and enquiry labels.
- `src/styles.css`: art direction, editorial placement, stickers, and responsive composition.

English is prerendered; the language switch persists the preference and updates `?lang=en` or `?lang=id`. The scene respects reduced-motion preferences, with a manual motion toggle. Three.js loads dynamically. No enquiries are sent automatically.

## Saved history

- `438f9fc`: reconstructed original project setup.
- `5742bac`: the first bilingual website.

The accepted playground redesign follows these two commits. The original working files were preserved when reconstructing the initial setup in Git’s index.
