# 🎓 Grade Classification Calculator

This is a web-based application that helps students at the Informatics Institute of Technology (IIT) predict their final degree classification for **Computer Science (CS)** and **Software Engineering (SE)** undergraduate programs.

Built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui** for a modern, responsive interface.

---

## 🔢 Features

- 🎯 Calculate degree classification (First Class, Second Upper, etc.)
- 📊 Weighted calculation using Level 5 and Level 6 module results
- 🔄 Automatically excludes the lowest optional module
- 📌 FYP and SDGP are mandatory and cannot be dropped
- 📎 SE & CS pathways supported
- 📱 Mobile-responsive UI
- 🌈 Clean, colorful UI with intuitive design

---

## 📘 Calculation Method

```

Final Grade = (1/3 × Level 5 Average) + (2/3 × Level 6 Average)

````

- Only Level 5 and Level 6 credits are used
- Optional module with the lowest mark is excluded
- Exactly 2 optional modules per level should be selected
- FYP and SDGP are mandatory

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
src/
├── app/
│   ├── cs-calculator/
│   ├── se-calculator/
│   └── results/
├── components/
├── lib/
├── styles/
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

