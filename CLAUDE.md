# Claude instructions for the DCMUN delegate site

## What this is

The public delegate guide for **DCMUN XVIII** (Doha College Model United Nations, 5 to 7 November 2026): the
theme, the 19 committees with their chairs, rooms and research reports, the schedule, the executive team,
campus maps and venue directions. Delegates, most of them school students on phones, use it to find out
where to be and what to read.

It is public and it names real students. Accuracy and privacy come before everything else: every name,
room, time and issue title comes from the organisers' documents, and nothing is added that they did not
supply.

Live: <https://zhrsidd.github.io/dcmun_delegates_site/>. The canonical link, Open Graph tags, `robots.txt`
and `sitemap.xml` name `https://delegates.pages.dev/`.

## How it is built

**There is no build.** No framework, no bundler, no `package.json`, no dependencies, no tests. The site is
four hand-written files in `dist/`, and `dist/` is the source, not an output. Do not delete or regenerate it.

| File | Role |
| --- | --- |
| `dist/content.js` | All conference content as one object, `window.DCMUN`: edition, theme, theme message, welcome, map, committees, schedule, executives. This is the file organisers edit |
| `dist/index.html` | Page structure, fixed copy, metadata, the tutorial video and Google Maps embeds |
| `dist/app.js` | Renders `window.DCMUN` into the page: committee list and search, schedule, the SVG campus plans and room highlighting, the executive carousel |
| `dist/styles.css` | All styling. Colours are CSS variables on `:root` at the top |

`content.js` loads before `app.js`, both with `defer`. Fonts (Manrope, DM Sans), the logo, headshots and
map images are local files under `dist/assets/`.

**Deployment.** `.github/workflows/pages.yml` publishes the `dist/` directory to GitHub Pages on every push
to `main` (and on manual run). A push to `main` is a publish: there is no preview or staging step.

## Folder map

| Path | Contents |
| --- | --- |
| `dist/` | The site (see above), plus `robots.txt` and `sitemap.xml` |
| `dist/assets/` | `dcmun-logo.jpg`, `fonts/`, `maps/` (campus overview, committee allocations), `execHeadshots/` |
| `dist/content.js.bak`, `dist/content.js.before-cleanup.bak` | Old backups. They are published with the site. Never load, edit or copy from them |
| `source-reference.txt` | The organisers' committee and issue list as transcribed; the reference for issue titles |
| `source-assets/` | The original campus overview image |
| `generate.py` | The one-time import that first created `content.js`. **Do not run it**: it overwrites `content.js` and every later edit |
| `docs/superpowers/` | The design spec and plan for the committee map |
| `.playwright-mcp/` | Old browser-session logs; not part of the site |
| `README.md` | The organisers' editing guide and the record of where each fact came from |

## Commands

```sh
python3 -m http.server 8080 --directory dist    # preview at http://localhost:8080
node --check dist/content.js && node --check dist/app.js    # catches a syntax error before it blanks the page
```

That is all there is. Verification is done by loading the page: there is no test suite, so a change is
checked in a browser at 320 px and at desktop width with the console open.

Publishing, only when the owner asks for it:

```sh
git add dist && git commit -m "Update conference content" && git push origin main
```

## Content rules

1. **Change only what was asked, with the exact text supplied.** Do not correct a person's name, reword an
   issue title, or tidy a message. Spelling of names follows the organisers, not a guess.
2. **Never invent content.** No placeholder chair, room, time or message that could be read as real. A
   missing value stays empty; the site already shows "To be announced." or "Not yet available".
3. **Keep `content.js` valid.** It is JavaScript, written as JSON-style data: double quotes, commas between
   entries, no trailing text. One missing comma blanks the whole page. Run `node --check` after every edit.
4. **Field shapes.** A committee has `code`, `name`, `headChair`, `deputyChairs` (an array; `[]` when
   none), `room`, and `issues` (each with `title`, `chair`, `pdf`). The Crisis Committee also has `guides`
   (each with `title`, `pdf`). An executive has `name`, `role`, `message`, optional `photo`. A schedule day
   has `events` (each with `time`, `title`, `venue`). Use `\n\n` for a paragraph break inside a message.
5. **Rooms drive the map.** The `room` value is matched against the room codes drawn in `app.js`
   (`mapPlans`, buildings S2, S3, S4). A room that is not in the plan will not highlight; check it after
   changing one.
6. **Links.** `pdf` is an `https://` link or a relative path inside `dist/` (for example
   `assets/reports/ga1-issue-1.pdf`). The site cannot change Google Drive permissions; a link must already
   be public.
7. **Times are Qatar local time, 24-hour.** Do not convert them.
8. **Privacy.** Publish only what the organisers supplied for publication: names, roles, messages and the
   headshots provided. No email addresses, phone numbers, year groups, internal student records or report
   tracker data. Headshots are of students; do not add, swap or reuse one without being asked.
9. **Record the source** in the README's "Source grounding" section when new facts are added.

## Coding rules

1. **No build step, framework, package manager or dependency.** Plain HTML, CSS and one script. If a task
   seems to need tooling, it probably does not; ask first.
2. **Build DOM with the helpers, not HTML strings.** `app.js` creates nodes with `el()` and sets text with
   `textContent`, and passes every URL through `safeUrl()` before using it. Content comes from a file
   organisers edit, so never put a content value into `innerHTML`.
3. **External links** go through `link()`: new tab with `rel="noopener noreferrer"`.
4. **No third-party scripts, trackers, analytics or remote fonts.** The only external content is the three
   Google Drive tutorial videos and the Google Maps embed already in `index.html`.
5. **Match the existing style.** `app.js` and `styles.css` are written compactly, many statements or rules
   per line, with a comment heading each feature block. Edit in place; do not reformat or run a formatter.
6. **`styles.css` is layered by history.** Later blocks deliberately override earlier ones. Add a new
   commented block near the related one and check that it wins; do not reorder or "deduplicate" the file.
7. **Relative paths only** (`assets/...`, `styles.css`). The site is served from a subdirectory on GitHub
   Pages; a path starting with `/` breaks there.
8. **Keep it working with the browser features it relies on:** `<details>` for committees, schedule days
   and map tabs, so the page is usable even before the script finishes.

## Design rules

The design reference is the MUNOS brand guide (`zhrsidd/MUNOS`, `docs/BRAND.md`): the official palette,
Manrope headings, DM Sans body, hairline sections and minimal decoration.

- **Use the variables.** `--paper`, `--surface`, `--sunken`, `--ink`, `--muted`, `--line`, `--control`,
  `--action`, `--focus`. The navy title band is `#142f50`. Do not add new accent colours.
- **Building colours come from the campus map:** S2 green `#237257`, S3 brown `#78563f`, S4 blue
  `#256e87`, each with its tint. They identify buildings and are used for nothing else.
- **Calm and plain.** Hairlines and headings, 6 px radius on controls, no shadows for decoration, no
  gradients, no new animation.
- **Phones first.** At 800 px and below, building plans stack vertically in S2 → S3 → S4 order and
  two-column layouts collapse. No sideways scrolling at 320 px. Controls are at least 44 px.
- **Floor plans are diagrams, not buttons.** Rooms are not clickable; search highlights a room and its
  directory entry.
- **The executive carousel** advances every five seconds, pauses on hover, focus and in a hidden tab, has
  a Play/Pause button and arrow keys, and does not auto-rotate under `prefers-reduced-motion`. Keep all of
  that if you touch it.
- **Accessibility.** Real headings and landmarks, labelled controls, a visible focus ring, alt text on
  images, `title` on every iframe, status text for search results.
- **Print** hides the carousel controls and keeps cards unbroken; keep the `@media print` rules working.
- The logo is the official DCMUN logo as supplied; do not redraw or recolour it.

## Mistakes a weaker model makes here, and how to avoid each

| Mistake | Why it is wrong here | Do this instead |
| --- | --- | --- |
| Running `generate.py` to "rebuild the content" | It regenerates `content.js` from the first import and wipes every chair, room, schedule and executive entry | Never run it; edit `content.js` by hand |
| Treating `dist/` as build output: deleting it, adding it to `.gitignore`, or creating a `src/` | `dist/` is the hand-edited source and the deployed site | Edit the files in `dist/` directly |
| Adding npm, a bundler, a framework or TypeScript | The README promises organisers a site with no install and no build | Plain HTML, CSS and JavaScript |
| Pushing to `main` to save work | It publishes to delegates immediately | Use a branch; push `main` only when asked |
| Fixing the spelling of a name, or filling a blank chair with a likely one | These are real students and real roles | Use the supplied text exactly; leave blanks blank |
| Rewording or "correcting" an issue title | Titles are the committees' official wording | Copy from `source-reference.txt` or the organisers |
| A trailing comma, a stray quote or a smart quote used as a delimiter in `content.js` | The script fails and the page is empty | `node --check dist/content.js`, then load the page |
| Rendering content with `innerHTML` or a template string | Injects whatever an editor typed | `el()` with `textContent`; URLs through `safeUrl()` |
| Editing or restoring from a `.bak` file | They are stale and hold superseded content | Use git history if an older version is needed |
| Changing a `room` without checking the map | The room no longer highlights | Search for the committee on the map afterwards |
| Reformatting `app.js` or `styles.css` | Turns a two-line change into an unreviewable diff | Edit in place |
| Removing "duplicate" CSS rules | Later blocks are intentional overrides | Add a block; leave earlier ones |
| Using `/assets/...` paths | Breaks under `/dcmun_delegates_site/` | Relative paths |
| Changing the canonical URL, sitemap or `robots.txt` on a guess | The README and the metadata name different hosts; which one is canonical is the owner's call | Ask before changing them |
| Adding analytics, a font CDN or an embed | No third-party requests beyond the existing embeds | Do not add them |
| Adding personal details (email, phone, year group) to an entry | Public site, school students | Names, roles and supplied messages only |
| Saying "tested" | There are no tests | Say what was loaded, at which widths, and what the console showed |

## How to work here

1. Start with `git status` and read the part of `README.md` that covers the thing being changed.
2. For a content change, edit `dist/content.js` only, with the supplied text exactly.
3. For a behaviour or style change, find the existing block in `app.js` or `styles.css` and extend it.
4. Check the result in a browser, not by reading the diff.
5. Report what changed and how it was checked. Do not push to `main` unless the owner asked for the
   update to go live.

## Before saying a task is done

- [ ] `git status` shows only the files this task should touch.
- [ ] `node --check dist/content.js` and `node --check dist/app.js` pass.
- [ ] The page was loaded from `python3 -m http.server 8080 --directory dist` with no console errors.
- [ ] Checked at 320 px and at desktop width: no sideways scrolling, all 19 committees listed, and the
      changed section looks right.
- [ ] Content changed: text matches what was supplied character for character; nothing invented; blanks
      left blank; no personal details beyond name, role and message.
- [ ] A room or committee changed: map search highlights the right room in the right building.
- [ ] A link or PDF was added: it opens, and is public.
- [ ] Schedule changed: times are Qatar local, 24-hour, in order.
- [ ] Interaction changed: works by keyboard, focus is visible, reduced motion respected, print still sensible.
- [ ] No new dependency, build step, third-party request or reformatting.
- [ ] `README.md` updated if the editing instructions or the source of a fact changed.
- [ ] The report says whether the change is live (pushed to `main`) or waiting on a branch.
