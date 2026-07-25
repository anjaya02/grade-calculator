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

