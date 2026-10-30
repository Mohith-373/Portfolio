# Mohith Thuraiyur Kirubanandham — Portfolio

Personal portfolio for an MSc Data Science student at the University of Surrey, built for UK placement applications.

Live site: https://mohith-373.github.io/Portfolio/

- **Stack:** Next.js 16 (static export), React 19, TypeScript, Tailwind CSS 4, Lucide icons, Geist font
- **Hosting:** GitHub Pages, deployed by GitHub Actions on every push to `main`
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

## Deploy to GitHub Pages (one-time setup)

1. Replace the old `index.html` in the `Portfolio` repository with the contents of this folder. The old version stays in the Git history.
2. On GitHub, open the repository's **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main`. The **Deploy portfolio to GitHub Pages** workflow builds and publishes the site in about two minutes. Progress shows in the **Actions** tab.

After that, every push to `main` redeploys automatically.

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
- Hero clustering animation: runs live, responds to the pointer, adds points on click, changes k, and stays still (but interactive) when the device asks for reduced motion; it pauses when scrolled out of view
