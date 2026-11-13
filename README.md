# 🎓 Grade Classification Calculator

This is a web-based application that helps students at the Informatics Institute of Technology (IIT) predict their final degree classification for **Computer Science (CS)** and **Software Engineering (SE)** undergraduate programs.

Built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui** for a modern, responsive interface.

---

## 🔢 Features

- 🎯 Calculate degree classification (First Class, Second Upper, etc.)
- 📊 Weighted calculation using Level 5 and Level 6 module results
- 🔄 Uses the best 220 credits across Levels 5 and 6
- 📌 Compares both credit-drop options under the Westminster 2026–27 rules
- 🔢 Preserves decimal marks and rounds the final result with exact arithmetic
- 📚 Supports recognised Level 5 credit with no Level 5 marks
- 🏷️ Current module names with visible previous names for earlier cohorts
- 📎 SE & CS pathways supported
- 📱 Mobile-responsive UI
- 🌈 Clean, colorful UI with intuitive design

---

## Saved marks

Each calculator automatically saves its marks, selected optional modules, and
custom modules in this browser's local storage. CS and SE keep separate drafts.
Refreshing the page or returning in the same browser restores the saved setup;
no account or additional backend is required. The status below the calculator
introduction confirms whether saving is available.

Use **Reset**, then **Reset marks**, to clear the current course's form and saved
draft. The other course is unaffected. Invalid or outdated drafts are discarded
safely; calculation still works when browser storage is blocked or full, but
marks cannot be saved. Clearing site data also removes saved marks, and private
browsing usually removes them when the private session ends. Drafts are tied to
the browser and website address and do not sync between devices.

Drafts carry a storage version; bump `CALCULATOR_STORAGE_VERSION` in
`src/features/grade-calculator/draft-storage.ts` when a major schema or regulation
change makes earlier drafts incompatible. Transient custom-module form text and
calculated results are not persisted; results are recalculated from the restored
marks and current course configuration. Version 2 preserves version 1 numeric
marks, stores new marks as decimal strings, and saves the recognised-credit
choice. Existing marks are recalculated using the 2026–27 rules. A future
incompatible schema change must also review the explicit version 1 migration.

Module labels use the supplied 2026–27 CS and SE lists. Renamed modules show
the current title first and the previous title on a smaller line underneath,
including on phones. Both names remain visible without opening a tooltip.
The previous-name line on an optional module also selects that module.
Information Technology Security remains available for earlier CS cohorts and
is labelled accordingly. XR and Advanced Interactive Media Development each
appear once; Professional Development, placement, and the not-offered
Networked Games and Security module are excluded.

Displayed built-in module codes use the IIT `C` convention. Saved drafts migrate
the corrected Sensors & Signals, Game AI, Internet of Things and former SE
suffix codes automatically. The duplicate media-module code maps to
`6MMCS008C`, so it cannot count twice. If old duplicate entries disagree, only
that mark is cleared for re-entry; other marks survive. A review message and
the incomplete form indicate which choices still need attention. A normal
code/name migration keeps the marks and existing course separation.

---

## Public usage counts

The home-page banner shows CS, SE, and combined completed-calculation totals.
One use is recorded the first time user changes produce a complete calculation
during a calculator visit. Automatically restoring a complete draft does not
count; editing it can count once. Further edits, resetting, or making the form
incomplete and complete again do not add another count during that visit.
Opening a calculator without completing it does not count. These are usage
totals, not unique-student counts.

The counter only sends the course (`cs` or `se`) and a random event ID. It does
not send marks, module choices, names, emails, or student IDs. Redis stores two
totals and temporary event IDs that expire after 24 hours, allowing retries to
be deduplicated. The counter itself does not store IP addresses; normal hosting
and storage-provider logs are separate.

### Enable counts on Vercel

1. Create an [Upstash Redis database](https://upstash.com/docs/redis/overall/getstarted),
   either directly or through the Vercel Marketplace, and connect it to this
   Vercel project.
2. In the project's environment variables, set `UPSTASH_REDIS_REST_URL` and
   `UPSTASH_REDIS_REST_TOKEN` from the database's REST connection details. The
   integration's `KV_REST_API_URL` and `KV_REST_API_TOKEN` names also work. Keep
   these variables server-only; do not use a `NEXT_PUBLIC_` prefix.
3. Redeploy. The counters start at zero and persist across deployments. Earlier
   usage cannot be recovered from this counter.

For local development, copy `.env.example` to `.env.local`, fill in the two
credentials, and restart the development server. The default counter namespace
separates `production`, `preview`, and `development`; set
`USAGE_COUNTER_NAMESPACE` only if you intentionally want to share totals or
start a fresh set. Keep the same database and production namespace to retain
live totals. Configure the database so the permanent totals are not evicted.

Reads and increments go through `/api/usage`; Redis credentials never reach the
browser. Concurrent increments and duplicate event IDs are handled atomically
using the [Upstash Redis REST API](https://upstash.com/docs/redis/features/restapi).
If storage is unconfigured or unavailable, the banner displays an unavailable
message and calculators continue working. Failed writes are retried once with
the same event ID; activity during a prolonged outage may not be counted.
Same-origin checks and duplicate suppression prevent accidental inflation, but
this public, anonymous counter is not a verified or abuse-proof audit metric.

---

## 📘 Calculation Method

```

Indicator Score = (1/3 × Level 5 Average) + (2/3 × Level 6 Average)

```

- This release implements the **Westminster 2026–27 Honours Degree Scheme**;
  there is no year selector. The source is [Section 17, §§4.4 and 7.3](https://www.westminster.ac.uk/sites/default/public-files/general-documents/academic-regulations-2026-27-section-17-framework-for-ug-taught-courses.pdf).
- Standard calculation requires 120 numeric-mark credits at Level 5 and 120 at
  Level 6. Calculate two provisional indicators: remove the lowest 20 credits
  from Level 5, and separately remove the lowest 20 credits from Level 6.
  **Use the higher indicator before rounding**, retaining 220 credits.
- A module larger than 20 credits loses only 20 credits. For example, a
  40-credit project still contributes its other 20 credits when selected.
- When both provisional indicators are exactly equal, choosing Level 6 for the
  displayed breakdown is a deterministic convention; it does not change the score.
- Module marks and level averages are not rounded. Decimal strings and BigInt
  fractions preserve exact comparison and final nearest-integer rounding, with
  exact halves rounding upwards. Thus an exact 69.5 produces 70, while
  69.499999999999999999999999 produces 69.
- Summary level averages show up to two decimal places; `≈` identifies a
  rounded display. The breakdown shows up to six decimal digits followed by an
  ellipsis if further digits remain. Display formatting never determines the class. Numeric
  summary fields returned by the library are approximate; selection, pass
  checks, displayed strings, and the rounded result use exact arithmetic.
- A mark such as 70.66 or 70.666 is preserved through entry and storage. The
  defensive input-length limit is 1,024 characters; excessive or malformed
  input produces a visible error and withholds the result instead of silently
  reusing the previous mark. Use final recorded module marks, including any
  referral/retake caps or qualifying-component adjustments.
- The recognised-credit checkbox applies only when there are **no Level 5
  marks** because those credits were transferred or recognised. All 120 Level 6
  credits then count at 100%, and none are disregarded. Other entered Level 5
  marks are retained for switching back but excluded while this option is enabled.
- Original Level 5/6 marks below 40 block an Honours classification even when
  their credits are disregarded. Zero is an entered failing mark; a blank is
  missing. Other award requirements must also be met.
- The library rejects invalid credits, unsupported totals/levels, duplicate IDs,
  non-finite or out-of-range marks. It accepts positive multiples of 20 credits
  up to 120 per module. Both forms use the configured CS/SE structures and
  20-credit custom optional replacements only.

This worksheet assumes the necessary Level 4 or recognised credits have been
achieved. It does not verify grade-only modules, partial credit transfers,
qualifying assessments, course/partner exceptions, or other award schemes.
Additional placement/study-abroad credits must be excluded. Use a modern browser
with BigInt support. Recheck the official regulations before updating the
declared academic year; the app does not change schemes automatically.

### Verification

```powershell
npm test
npm run lint
npm run build

# Optional extended independent arithmetic check (reproducible seed 20261113):
$env:CLASSIFICATION_CHECK_CASES = '200000'
node node_modules/tsx/dist/cli.mjs --test tests/classification-accuracy.test.ts
```

The default test suite includes 20,000 generated records checked against an
independent reference that expands modules into 20-credit units and enumerates
all possible removals. It also covers both course configurations, exact class
boundaries, decimals beyond Number precision, invalid credit data, original
failed marks, saved-draft migration, and recognised-credit calculations.

---

## 📦 Tech Stack

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)

---

## 🚀 Getting Started

```bash
git clone https://github.com/anjaya02/grade-calculator.git
cd grade-calculator
npm install
npm run dev
````

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
my-grade-app/
├── public/
├── src/
│   ├── app/
│   │   ├── cs-calculator/
│   │   │   └── page.tsx
│   │   ├── se-calculator/
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   └── Footer.tsx
│   ├── features/
│   │   └── grade-calculator/
│   │       ├── components/
│   │       ├── data/
│   │       │   ├── computer-science.ts
│   │       │   └── software-engineering.ts
│   │       ├── hooks/
│   │       │   └── use-grade-calculator.ts
│   │       ├── classification.ts
│   │       ├── theme.ts
│   │       └── types.ts
│   └── lib/
│       └── degree-classification.ts
├── .gitignore
├── components.json
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tailwind.config.ts

```

---

## 🙋 Author

**Anjaya Induwara**
CS Undergraduate | Informatics Institute of Technology
📧 [anjaya.20234069@iit.ac.lk](mailto:anjaya.20234069@iit.ac.lk)
🔗 [LinkedIn](https://www.linkedin.com/in/anjaya02)
💻 [GitHub](https://github.com/anjaya02)

---

## 📝 Disclaimer

This tool is not officially affiliated with IIT. Calculations are approximate and provided for guidance purposes only. Always consult your academic advisor for official results.

---

## 📄 License

MIT © 2025 Anjaya Induwara

