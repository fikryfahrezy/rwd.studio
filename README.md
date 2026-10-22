# RWD Studio

A bilingual studio profile built with React 19, TanStack Start, TypeScript, and Rsbuild. It introduces RWD Studio’s software, design, film, photography, animation, illustration, and 3D services.

## Development

```sh
pnpm install
pnpm dev
```

## Production

```sh
pnpm build
pnpm exec tsc --noEmit
```

TanStack prerenders the homepage to `dist/client/index.html`; deploy `dist/client` to a static host. The interactive application hydrates in the browser. Sites deployment configuration is in `.openai/hosting.json`.

## Content and branding

- `src/content.ts`: English and Bahasa Indonesia copy.
- `src/routes/index.tsx`: page sections, concept artwork, and project enquiry dialog.
- `src/components/PlaySculpture.tsx`: original pointer-responsive canvas sculpture. Respects reduced motion and provides a pause control.
- `src/styles.css`: responsive layout and initial visual identity. Ivory `#f3f2e9`, electric blue `#263de5`, acid green `#d9f36b`. DM Sans and Instrument Serif load from Google Fonts with local fallbacks.
- `public/favicon.svg`: initial studio favicon.

The EN/ID switch stores the preference locally and updates `?lang=en` / `?lang=id` for shareable links. The three showcase pieces are clearly labeled studio concepts, not completed client projects. Replace these with real case studies when available.

## Enquiries

The project form validates the name, email, and brief, then opens the visitor’s email app with an addressed, prefilled message to `fahrezyfikry@gmail.com`. The visitor reviews and sends it. No backend stores submissions or sends email automatically. A direct email link is also available.

## Initial version

Includes responsive navigation, concept detail dialogs, accessible service accordions, process overview, bilingual enquiry form, keyboard focus styles, native dialog focus management, reduced-motion support, and production metadata. The content is prerendered in English; language preferences are applied after hydration.
