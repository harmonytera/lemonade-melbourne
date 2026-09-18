# Lemonade Brows — Melbourne popup

Static site for the 5–7 November 2026 Melbourne visit. Plain HTML and CSS, no build step.

```
index.html        Landing page
pricing.html      What $1,100 includes, payment and cancellation terms
aftercare.html    Healing timeline (wound care instructions still to add)
styles.css        All styling
images/           WebP, already optimised (~1.2 MB total)
```

---

## Before you take it live

**1. The gallery captions.** The fourteen client quotes I wrote are invented — I made them
up to show the format. They're attached to photos of real, identifiable women, so they are
commented out in `index.html` rather than live. Find them by searching for
`PLACEHOLDER CAPTION`. Replace each quote with what that client actually asked for, delete
the two comment lines above it and the ` -->` at the end, and they'll appear.

The gallery looks fine without them, so this doesn't block launch.

**2. Connect the three forms.** Create three forms at [formspree.io](https://formspree.io)
(the free tier covers 50 submissions a month) and paste each endpoint into the matching
`action=""` in `index.html`:

| Placeholder | Which form |
| --- | --- |
| `YOUR_FORM_ID` | Main enquiry |
| `YOUR_STANDBY_FORM_ID` | November standby list |
| `YOUR_NEXTVISIT_FORM_ID` | Next Melbourne visit list |

Three separate endpoints so the three kinds of enquiry land in separate inboxes.

**Until this is done the forms silently fail** — someone fills one in, clicks send, and
nothing reaches you. This one does block launch.

**3. Add the aftercare instructions.** `aftercare.html` has the healing timeline written,
but the wound care section is deliberately empty. It needs your real instructions.

**4. Add the Lemonade logo.** The wordmark is currently typeset (`<a class="wordmark">` in
the header and footer). Drop your logo file into `images/brand/` and swap it in.

**5. Check the deposit wording** with your insurer or an ABIC contact before it's public.

---

## Putting it on GitHub

Git history is already set up in this folder, so you only need to connect it to a repo.

1. Create a new **empty** repository at [github.com/new](https://github.com/new) — no
   README, no .gitignore, no licence. Call it `lemonade-melbourne`.
2. In Terminal, `cd` into this folder and run the two lines GitHub shows you:

```bash
git remote add origin https://github.com/YOUR-USERNAME/lemonade-melbourne.git
git push -u origin main
```

## Putting it on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
2. Framework preset: **Other**. No build command. Output directory: leave blank.
3. Deploy.

After that, every `git push` redeploys automatically.

To use `melbourne.lemonadebrows.au`, add it under the project's **Domains** settings and
follow the DNS records Vercel gives you.

---

## Updating the appointment count

One line near the top of all three HTML files:

```html
<span class="sep">·</span> <b>11 of 12 appointments open</b>
```

Also update the sticky mobile bar at the bottom of each file (`11 of 12 left`) and the
"Remaining" line in the enquiry section of `index.html`.

When it sells out, change the banner to:

```html
<span class="sep">·</span> <b>Fully booked</b> — join the standby list
```

---

## Notes for whoever edits this next

- Fonts load from Google Fonts (Cormorant Garamond, Montserrat, Raleway).
- All text meets WCAG AA contrast. The brand brown `#97836A` only reaches 3.3:1 on these
  light backgrounds, so small text uses a deeper tint (`--primary-ink: #6E5D4A`) and dark
  sections use a lifted one (`--primary-lift: #CBB79C`). The original brown stays for
  borders and decoration. Keep that three-way split if you change the palette.
- Images are WebP at 900px wide. Re-export at that size if you swap any in.
- The site is deliberately single-theme; it does not follow the visitor's dark mode.
