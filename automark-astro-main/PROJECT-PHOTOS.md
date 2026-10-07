# How to add project photos

Put your screenshots in **this folder**. Use these exact file names so the
website picks them up automatically.

## UJ Stores (Eravur)

```
uj-stores-1.jpg
uj-stores-2.jpg
uj-stores-3.jpg
```

## MBRK Rice Distribution

```
mbrk-1.jpg
mbrk-2.jpg
mbrk-3.jpg
```

## Red Zone POS

```
redzone-1.jpg
redzone-2.jpg
redzone-3.jpg
```

You do not need all three per project. One good screenshot is enough to start.

**Use the real extension.** A phone photo is almost always a `.jpg`, even if
you rename it `.png`. Renaming does not change the file, and a mislabelled
image cannot be compressed — it gets served at full size and slows the page.
If you are unsure, send it as-is and say so; the format is easy to check.

---

## Client logos

The site shows each client by its own logo, in a carousel of small rounded
tiles. Logos go in `public/images/clients/`, one per client, and are set as
`logo:` on that client's entry under `projects.items` in
`src/content/homepage/-index.md`. A client needs only a `name` and a `logo`
to appear.

The photographs described in the rest of this guide are not shown at present
(the page used to have a card per client). The guide is kept for when they
are.

- Use the client's own logo, with their permission to show it.
- A roughly square image, at least 400 pixels wide (the others are 400 by
  424), with a little empty margin around the artwork on a plain ground. The
  site crops it to a rounded tile, so anything touching the edge of the file
  gets clipped.
- Take the place name from the client's own sign or logo.
- **No logo yet?** The eight files in
  `public/images/clients/placeholder-logos/` are stand-ins the owner asked
  for: each was drawn for this page from the business's name and trade, and
  is not the logo that business uses. Replace a stand-in with the real logo
  as soon as the client sends it, ask the client whether they are content to
  be shown this way until then, and check the spelling of the name against
  the client's own sign.

---

## Before you upload — please check each screenshot

1. **Hide real customer names.** Blur or edit out any real person's name,
   phone number, address or NIC.
2. **Real prices are fine.** Product names and LKR amounts are good — they make
   the screenshot believable.
3. **Full window, not a phone photo of the screen.** Use the Windows
   screenshot key (`Win + Shift + S`) rather than photographing the monitor.
4. **Any size is fine.** The site resizes and compresses them automatically.

## What makes the best proof, in order

1. The **main sales / billing screen** being used
2. A **dashboard or report** screen
3. **Stock / inventory** list
4. A **photo of the real counter** with the system running (very strong proof)

---

## Also send these details for each project

Written into `src/content/homepage/-index.md`, under `projects:`

- **What the business does** — e.g. "wholesale and retail grocery"
- **What the system handles** — e.g. "sales, stock, suppliers, credit customers"
- **Which setup** — offline desktop / desktop application / cloud + mobile
- **Is the business name allowed on the website?** If not, we describe the
  project without naming them.

Do **not** send: revenue figures, "% improvement", customer counts, or review
scores unless they are genuinely measured. The site does not make claims we
cannot stand behind.
