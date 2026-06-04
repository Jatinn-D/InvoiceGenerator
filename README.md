# Suvarna Invoice Generator

A small, self-contained web app for generating beautiful, professional **PDF invoices** for Suvarna clients. Built to match the Suvarna brand (navy + cream, DM Serif Display + DM Sans, "S" monogram logo) so every invoice you send out feels like part of the same product.

Designed for the common Indian software-services billing flow: itemize **Software License / AMC / Annual Renewal / Setup**, apply a **discount**, optionally add **GST (CGST+SGST or IGST)**, show the **amount in words** (Indian numbering — lakhs/crores), and download a one-click **PDF**.

---

## ✨ Features

- **Live side-by-side preview** — form on the left, real A4-sized invoice on the right, updating as you type
- **One-click PDF download** — pixel-perfect snapshot of the preview at 2× resolution
- **Auto-numbering** — `INV-YYYY-####`, advances after every download (editable per invoice if you need to override)
- **Quick-add chips** — drop in `Suvarna Software License`, `Annual Maintenance Contract (AMC)`, `Annual Renewal Charges`, or `Setup & Configuration` in one click
- **Discount** — flat (₹) or percentage, auto-clamped to the subtotal
- **GST** — None / Intra-state (CGST+SGST) / Inter-state (IGST), configurable rate
- **Amount in words** — Indian numbering, e.g. *"Rupees Seventy-Four Thousand Three Hundred Forty Only"*
- **Saved clients** — repeat clients show up in a dropdown; no re-typing names, addresses, GSTINs
- **Saved seller details** — enter your business name/address/GSTIN/PAN once via the Settings drawer, they auto-fill every invoice
- **Print fallback** — `Ctrl+P` prints just the invoice (form is hidden via `@media print`)
- **100% local** — everything lives in `localStorage`; no backend, no accounts, no data leaves your machine

---

## 📋 Prerequisites

| Tool | Version | Why |
|---|---|---|
| **Node.js** | 18.x or newer | Required by Vite 5 |
| **npm** | 9.x or newer | Bundled with Node |

Verify with:

```bash
node --version    # should print v18.x.x or higher
npm --version     # should print 9.x.x or higher
```

Don't have Node? Grab it from <https://nodejs.org> (the LTS download is fine).

---

## 🚀 Setup

From this folder (`C:\Users\CICT\Desktop\InvoiceGenerator`):

```bash
npm install
```

That pulls down React, Vite, Tailwind, html2canvas, jsPDF, to-words, and lucide-react. First install takes ~1–3 minutes on Windows.

---

## 🖥 Running locally

```bash
npm run dev
```

Vite will start the dev server and open <http://localhost:5173> in your browser automatically. The page hot-reloads on every save, so any edit to the source shows up instantly.

To stop the server: `Ctrl+C` in the terminal.

---

## 📦 Building for production

```bash
npm run build
```

This type-checks the TypeScript and outputs a static bundle to the `dist/` folder. You can preview the production build locally with:

```bash
npm run preview
```

---

## 🌐 Deploying to Cloudflare Pages

Since your main app lives on Cloudflare Pages, the easiest path is the same:

1. Push this folder to a GitHub repo
2. In Cloudflare Pages → **Create project** → **Connect to Git** → pick the repo
3. Build settings:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Deploy

You'll get a `*.pages.dev` URL. Done.

Alternatively, drag the `dist/` folder into Cloudflare Pages → **Direct upload** for a one-off deploy.

---

## 🧭 How to use the app

### 1. First-time setup — enter your business details

Top-right → **Business details** → fill in:
- Business name (defaults to "Suvarna")
- Tagline ("Pledge Management System")
- Address, email, phone
- GSTIN, PAN (optional)
- Logo URL (defaults to `/logo.png`)

Hit **Save** — these persist in `localStorage` and auto-fill every invoice.

### 2. Create an invoice

Working top-to-bottom in the form on the left:

1. **Invoice meta** — number, issue date (today), due date (today + 30 days) are pre-filled. Tweak if needed.
2. **Bill to** — pick a saved client from the dropdown, or type a fresh one. Click **Save client** to remember them for next time.
3. **Items** — use the quick-add chips, or **+ Add item**, then fill description / period (e.g. "1 year") / qty / rate.
4. **Discount** — flat ₹ or %.
5. **GST** — None / Intra-state / Inter-state, plus rate (default 18%).
6. **Notes & terms** — pre-filled with sensible defaults; edit per invoice.

The preview on the right updates live.

### 3. Download the PDF

Top-right → **Download PDF**. File is saved as `Invoice-INV-2026-0001.pdf` (or whatever the current invoice number is). The auto-counter advances after every download.

Prefer the browser's print-to-PDF? Use the **Print** button — the form pane disappears, leaving just the A4 invoice.

---

## 💾 Where is my data stored?

Everything lives in **`localStorage`** on your browser, under three keys:

| Key | Contents |
|---|---|
| `suvarna.invoice.seller` | Your business details |
| `suvarna.invoice.clients` | Array of saved client records |
| `suvarna.invoice.counter` | `{ year, seq }` for auto-numbering |

To wipe everything: DevTools → **Application** → **Local Storage** → delete those keys. Or run `localStorage.clear()` in the console.

⚠️ Because it's `localStorage`, your data is **per-browser-per-machine**. Use the same browser to keep client history. If you want sync across devices, that's a future feature (would need a backend).

---

## 🧰 Tech stack

- **[Vite 5](https://vitejs.dev/)** — dev server + build
- **React 18** + **TypeScript** — UI
- **[Tailwind CSS 3](https://tailwindcss.com/)** — styling, with a custom Suvarna palette
- **[html2canvas](https://html2canvas.hertzen.com/)** — snapshots the preview DOM
- **[jsPDF](https://github.com/parallax/jsPDF)** — wraps that snapshot into an A4 PDF
- **[to-words](https://github.com/mrcoles/to-words)** — number → "Rupees ... Only" with Indian numbering
- **[lucide-react](https://lucide.dev/)** — icons (download, settings, plus, trash)

---

## 🗂 Project structure

```
InvoiceGenerator/
├── index.html                  Loads DM Sans + DM Serif Display
├── package.json
├── vite.config.ts
├── tailwind.config.js          Suvarna palette + fonts
├── postcss.config.js
├── tsconfig.json
├── tsconfig.node.json
├── public/
│   └── logo.png                Suvarna "S" monogram
└── src/
    ├── main.tsx                React entry
    ├── App.tsx                 Two-pane layout, owns invoice state
    ├── index.css               Tailwind + print styles + .a4-sheet
    ├── types/
    │   └── invoice.ts          Invoice, LineItem, Client, Seller, Gst...
    ├── data/
    │   └── suvarnaDefaults.ts  Brand defaults + quick-add items
    ├── lib/
    │   ├── storage.ts          localStorage get/set
    │   ├── invoiceNumber.ts    INV-YYYY-#### auto-numbering
    │   ├── calculations.ts     subtotal/discount/GST/total + INR formatter
    │   ├── numberToWords.ts    Wraps to-words for INR/en-IN
    │   └── pdf.ts              html2canvas + jsPDF → download
    └── components/
        ├── InvoiceForm.tsx     Left pane — all inputs
        ├── InvoicePreview.tsx  Right pane — A4-sized invoice (snapshot target)
        ├── LineItemRow.tsx     One row of the items editor
        ├── ClientPicker.tsx    Saved-clients dropdown + delete
        ├── SellerSettingsDrawer.tsx  Edit business details
        └── ui/
            ├── Button.tsx
            ├── Input.tsx
            ├── Label.tsx
            ├── Select.tsx
            └── Textarea.tsx
```

---

## 🎨 Customising

### Change the brand colors

Edit `tailwind.config.js`:

```js
colors: {
  navy: '#2F3A55',     // Primary
  cream: '#F5F6F3',    // Background
  warmgray: '#6E6F73', // Secondary text
  linen: '#E7E2DE',    // Subtle dividers
  // ...
}
```

The palette is used throughout the form and preview — change here and it propagates everywhere.

### Change the default seller details

Edit `src/data/suvarnaDefaults.ts`. The values there are the fallback used the **first** time the app loads (before you've saved anything via the Settings drawer). After you save once, the saved values take over.

### Change the quick-add items

Same file — edit `QUICK_ADD_ITEMS`:

```ts
export const QUICK_ADD_ITEMS = [
  { description: 'Suvarna Software License', period: '1 year', rate: 50000 },
  { description: 'Annual Maintenance Contract (AMC)', period: '1 year', rate: 12000 },
  // ...add your own
]
```

### Change the invoice number format

Edit `src/lib/invoiceNumber.ts`. The current format is `INV-YYYY-####`; change the template string and `pad()` width as you like.

### Replace the logo

Drop a new `logo.png` into `public/` (keep the filename, or update the **Logo URL** in the Settings drawer to point to a different file).

---

## 🐛 Troubleshooting

**"Could not generate PDF. See console for details."**
- Open DevTools (F12) → Console for the actual error.
- If it's a CORS/font issue, hard-refresh once (`Ctrl+Shift+R`) to ensure Google Fonts are cached.

**Fonts look wrong in the PDF**
- The PDF generator waits for `document.fonts.ready` before capturing. If you still see a fallback font, your network may have blocked Google Fonts — host the fonts locally or check `index.html`.

**Auto-numbering jumped or reset**
- The counter resets on January 1 (new year → seq starts at 1). To manually reset: DevTools → Application → Local Storage → delete `suvarna.invoice.counter`.
- Or override per invoice by editing the **Invoice number** field directly; the counter still advances on download.

**"Add at least one line item before downloading"**
- The download button refuses to fire on an empty invoice. Add a row via the quick-add chips or **+ Add item**.

**The preview overflows on a small screen**
- The A4 sheet is fixed at 210mm wide. Below ~1280px viewport, scroll horizontally in the right pane. PDFs always render at A4 regardless of screen size.

**Build fails with TypeScript errors**
- Make sure you're on Node 18+ and ran `npm install`. Then `npm run build`.

---

## 📜 License

Private project for personal use. Not published.
