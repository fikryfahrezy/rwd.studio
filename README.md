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

## Docker

With Docker Engine and Docker Compose running (Docker Desktop or OrbStack on macOS):

```sh
docker compose up --build -d
```

Open http://localhost:3000. The image builds the site with Node 24.22.1 (pinned by version and image digest) and pnpm 12.14.0 using the frozen lockfile, then serves `dist/client` with Nginx. This matches the static deployment above; server-side handlers are not included. No local Node installation or environment file is required.

To use a different host port:

```sh
PORT=8080 docker compose up --build -d
```

Check status and logs, or stop the service:

```sh
docker compose ps
docker compose logs -f web
docker compose down
```

Run `docker compose up --build -d` again after source changes. This runs the production build; use `pnpm dev` for local hot reload. Local dependencies, build output, Git metadata, and environment files are excluded from the Docker build context.

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
