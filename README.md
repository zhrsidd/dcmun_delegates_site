# DCMUN XVIII delegate website

Buildless HTML, CSS and JavaScript. Deploy the `dist` directory to any static host. No install, accounts, database or build command required.

## Hosting

Live site: https://zhrsidd.github.io/dcmun_delegates_site/

GitHub Pages publishes the `dist` directory through `.github/workflows/pages.yml`. Push changes to `main` to update the live site; progress is visible in the repository’s Actions tab. You can also run the workflow manually.

## Editing

- `dist/content.js`: welcome, theme, all committees, head/deputy chair names, executive messages, rooms, reports, schedule and map.
- `dist/index.html`: page structure and fixed copy.
- `dist/styles.css`: visual styling. Colours are CSS variables at the top.
- `dist/assets/dcmun-logo.jpg`: official logo from DCMUN Central Folder.

For each committee, fill in `headChair` and add any number of names to `deputyChairs`:

```js
"headChair": "Head chair name",
"deputyChairs": ["First deputy name", "Second deputy name"],
```

Use `deputyChairs: []` when no deputies have been added. Blank names are ignored. The site labels the roles separately, uses “Deputy Chair” for one deputy and “Deputy Chairs” for multiple, and includes chair names in committee search.

Each issue has `title`, `chair` and `pdf`. Set `pdf` to an HTTPS link or a relative file path such as `assets/reports/ga1-issue-1.pdf`, and place the PDF there. Empty links render a non-clickable “Not yet available” label. Use public PDF links if hosting elsewhere; the website does not change Drive permissions. Add committees by copying an existing object.

The Crisis Committee uses a `guides` array instead of issue research reports. It contains the Background Guide and Direction Guide, each with a `title` and `pdf`. Both guides are credited to all Crisis Committee chairs. Add their PDF links in `guides`; the crisis scenario stays in `issues`.

### Secretary-General theme message

Directly beneath `theme` in `dist/content.js`, fill in:

```js
"themeMessage": {
  "name": "Secretary-General name",
  "message": "Your short message about the conference theme."
},
```

The message appears beneath the theme. Until a message is supplied, a coming-soon note fills this space. The name is optional. Use `\n\n` inside the message string to separate paragraphs.

### Meet the executives

Near the end of `dist/content.js`, fill in the blank entry in `executives`. Copy the object for each additional person, separated by commas:

```js
"executives": [
  {
    "name": "Full name",
    "role": "Secretary-General",
    "message": "Your short welcome message to delegates."
  },
  {
    "name": "Another full name",
    "role": "Executive role",
    "message": "Another short message."
  }
],
```

Entries appear in the order listed. Entries without a name stay hidden. Until names are added, the section shows a short coming-soon message. Visitors can swipe or scroll through the cards, use the arrow buttons, or focus the cards and press the left/right arrow keys. There is no automatic rotation.

### Map and schedule

Set `map.image` to the official map image path and `map.pdf` to a PDF path. Empty fields show an explicitly labeled placeholder, not a fictional school map. Set `theme` when confirmed. The About paragraph summarizes confirmed conference dates and venues.

To add session details, add objects with `time`, `title`, and `venue` to the relevant day’s `events` array. Times are Qatar local time. The current data contains only the conference windows supplied in the official PDF.

To preview: `python -m http.server 8080 --directory dist`, then open http://localhost:8080. To edit locally you can also open `dist/index.html` directly.

## Source grounding

Conference dates, venues and all 48 issues across 19 committees: “Conference Schedule + Committee Issues”, DCMUN Central Folder → 2026/2027 → DCMUN XVIII (Drive ID `174Mu4cyyh-IWj06ykGx0ws7hbkVsufyJ`). Retrieved 25 October 2026. Source transcript retained in `source-reference.txt`. Logo: Central Folder “DCMUN logo.jpg” (`1kyU4u_DJDJCubRL2id8CeeK6jisNTBS6`).

Theme, campus map, session allocations and confirmed chair-to-committee assignments were not established, so remain labeled placeholders. Internal student records and report progress tracker data are not included in the public site. Design reference: https://github.com/zhrsidd/MUNOS/blob/main/docs/BRAND.md — official palette, Manrope headings, DM Sans body, hairline sections and minimal decoration.

`generate.py` records the one-time import; do not re-run it after editing content.js because it regenerates that file.

Mondrian Doha has a separate Google Maps embed in `dist/index.html`, alongside a direct Maps link. Update its query there if the venue changes.

## Pushing updates

From this project folder, after saving your changes:

```sh
git add .
git commit -m "Update conference content"
git push origin main
```

GitHub Pages automatically publishes the update once the deployment workflow completes.
