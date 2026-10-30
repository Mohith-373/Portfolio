# Mohith Thuraiyur Kirubanandham — Portfolio

Personal portfolio for an MSc Data Science student at the University of Surrey, built for UK placement applications.

Live site: https://mohith-tk.pages.dev

- **Stack:** Next.js 16 (static export), React 19, TypeScript, Tailwind CSS 4, Lucide icons, Geist font
- **Hosting:** Cloudflare Pages (`mohith-tk.pages.dev`), which builds and deploys on every push to `main`
- **Runtime dependencies:** five (`next`, `react`, `react-dom`, `lucide-react`, `geist`). No analytics, trackers or external scripts.

## Folder structure

```
.github/workflows/deploy.yml   Builds the site and publishes it to GitHub Pages
public/
  cv/Mohith-Thuraiyur-Kirubanandham-CV.pdf   The CV behind every "Download CV" button
src/
  app/
    layout.tsx         Page shell, SEO metadata, theme script
    page.tsx           Section order and structured data (JSON-LD)
    globals.css        Colour tokens (light and dark), base styles, hero animation
    icon.svg           Favicon
    opengraph-image.png, twitter-image.png   Link preview image (1200 × 630)
    robots.ts, sitemap.ts
  components/          One file per section, plus Nav, Section frame and form
  content/             ALL editable text lives here
    site.ts            Name, headline, email, links, CV path, form endpoint, SEO text
    projects.ts        Project case studies
    skills.ts          Skill areas and the projects that use them
    profile.ts         About, research interests, education, MSc modules, coursework
                       write-ups, current learning, certifications, experience, interests
  lib/paths.ts         Adds the /Portfolio base path to file links
```

## Run it locally

You need Node.js 20 or newer.

```bash
npm install
npm run dev          # http://localhost:3000
```

To check the production build:

```bash
npm run build        # static site written to ./out
npm run typecheck
```

## Deploy to Cloudflare Pages (one-time setup)

1. Sign in at https://dash.cloudflare.com (the free plan is enough).
2. Go to **Workers & Pages → Create application → Pages → Connect to Git**, authorise GitHub and pick the `Portfolio` repository.
3. Set **Project name** to `mohith-tk`. This gives the address `mohith-tk.pages.dev`.
4. Build settings:
   - Production branch: `main`
   - Framework preset: **Next.js (Static HTML Export)**
   - Build command: `npm run build`
   - Build output directory: `out`
   - Environment variable: `NODE_VERSION` = `22` (the repo's `.nvmrc` says the same)
5. Select **Save and Deploy**. After the first build, every push to `main` redeploys in about two minutes.

To use your own domain later (for example `mohithtk.co.uk`), add it under the project's **Custom domains** tab, then change `url` in `src/content/site.ts`.

The old GitHub Pages address (`mohith-373.github.io/Portfolio`) is kept only as a redirect to the Cloudflare address, so links already shared keep working.

## Updating content

Everything you'd normally change is in `src/content/`. Edit, commit, push, and the site redeploys.

### Projects (`projects.ts`)
Each project has a summary, problem, objective, contribution, approach and key decisions. `challenges`, `results` and `demo` are optional and stay hidden until you fill them in. Only add results you can back up with your own run, screenshot or write-up. Set `featured: true` to show a project as a wide case study at the top. List order is display order.

### Coursework write-ups (`profile.ts` → `academicProjects`)
There is a commented example. Each entry can include the problem statement, dataset, methodology, techniques, results, critical evaluation and a repository link. Empty fields are not shown.

### Certifications (`profile.ts` → `certifications`)
Add an entry with `title`, `issuer`, `date` and, optionally, `credentialId` and `verifyUrl`. Until there is at least one, the section shows a "No certifications listed yet" message. External courses in progress go in `coursesInProgress`.

### Skills (`skills.ts`)
Add items to an area, or add a new area. Put project slugs in `appliedIn` to link the projects where that area is used. Skills have no ratings or percentages, by design.

### Current learning (`profile.ts` → `currentlyExploring`)
Edit the list, then update `lastUpdated` in `site.ts`.

### Replacing your CV
Export the new CV as a PDF and save it over `public/cv/Mohith-Thuraiyur-Kirubanandham-CV.pdf`, keeping the same file name. If you use a different file name, update `cvPath` in `site.ts`.

### Email and contact form
`email` in `site.ts` is used for the contact links and the form. If you don't set a form endpoint, the form opens the visitor's email app with their message filled in, and the button says exactly that. To have the form send messages directly:

1. Create a free form at https://formspree.io and copy its endpoint (for example `https://formspree.io/f/abcdwxyz`).
2. Paste it into `contactFormEndpoint` in `site.ts`.

The button then changes to **Send message** and shows success or error feedback.

## The hero games

The hero has a slider with three games, each with Play and How it works tabs (`src/components/HeroGames.tsx`, `GameTabs.tsx`). Live clustering (`HeroPlayground.tsx`) is k-means written from scratch on a canvas; it pauses when it is not the visible slide.

"Do you like to work with someone like me?" (`HeroWorkWithMe.tsx`) is the last slide: three questions about what visitors value in a teammate, each answered with a short reply from me, ending on the mindset behind this portfolio. The questions, replies and closing text live in `src/lib/workWithMe.ts`. Answers are kept in memory only and never stored.

The Draw a digit game is a small convolutional neural network (about 52,000 weights) trained on MNIST, running in the browser with no ML library.

- Model weights: `public/models/digits.json` (about 280 KB, loaded after the page)
- Browser inference and MNIST-style preprocessing: `src/lib/digitModel.ts`
- Game UI with Play and How it works tabs: `src/components/HeroDigitGame.tsx`
- Training script: `scripts/train_digits.py`. It downloads MNIST, trains with data augmentation (rotation, scaling, shifting and stroke thickness) so it copes with mouse and finger drawings, and writes the weights file. Run `pip install "jax[cpu]" numpy`, then `python scripts/train_digits.py`. It takes about 3 minutes on a laptop CPU.

Last training run: 99.0% accuracy on the 10,000 MNIST test digits and 98.1% on distorted versions of them.

## SEO configuration

- **Title and description:** `site.seo` in `site.ts`
- **Canonical URL, Open Graph and Twitter tags:** generated in `layout.tsx` from `site.url`
- **Link preview image:** `src/app/opengraph-image.png` (replace with any 1200 × 630 PNG)
- **Structured data:** a schema.org `Person` record in `page.tsx`, linking GitHub and LinkedIn
- **Sitemap and robots.txt:** `sitemap.ts` and `robots.ts`

If you move to a custom domain, update `url` in `site.ts`. GitHub Pages then serves the site from `/`, and the workflow passes the correct base path automatically.

## Quality checks (last run October 2026)

These checks were run in Chromium against the production build, served under `/Portfolio/` exactly as GitHub Pages serves it:

- No horizontal overflow at 1440, 820 and 390 px wide, in light and dark themes
- No console errors or warnings and no failed requests, and the CV PDF downloads
- Every in-page link and nav item resolves to a section
- The active section is highlighted in the nav while scrolling
- The theme follows the device setting, the toggle switches it, and the choice survives a reload
- Project category filters work, and skill links clear the filter and jump to the right project
- Case studies expand
- External links open in a new tab with `rel="noopener noreferrer"`
- Contact form: field errors show, focus moves to the first invalid field, and a valid message opens the email app with subject and body filled in
- Keyboard: "Skip to content" is the first tab stop, focus outlines are visible, and the mobile menu closes with Escape; picking a section in the mobile menu closes it and scrolls to that section
- Game slider: arrows and labels switch games, the hidden game can't be focused, and clustering pauses while hidden
- Draw-a-digit game: drawn digits are recognised in the browser, the Example and Clear buttons work, and the How it works tab opens and closes
- Live clustering: animates, responds to the pointer, adds dots on click, changes the number of groups, and has its own How it works tab
