# 🎓 Grade Classification Calculator

This is a web-based application that helps students at the Informatics Institute of Technology (IIT) predict their final degree classification for **Computer Science (CS)** and **Software Engineering (SE)** undergraduate programs.

Built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui** for a modern, responsive interface.

---

## 🔢 Features

- 🎯 Calculate degree classification (First Class, Second Upper, etc.)
- 📊 Weighted calculation using Level 5 and Level 6 module results
- 🔄 Uses the best 220 credits across Levels 5 and 6
- 📌 Correctly handles 40-credit modules and cross-level ties
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
marks and current course configuration.

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

````

- Only Level 5 and Level 6 credits are used
- The lowest-mark module is disregarded from the best 220 credits
- A module worth more than 20 credits has only 20 credits disregarded
- A tied lowest mark across both levels is resolved by disregarding the Level 6 module
- The indicator score is rounded to the nearest integer before classification
- Disregarding credits does not award credit for a failed module; award requirements must still be met

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

