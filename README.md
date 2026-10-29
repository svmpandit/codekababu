# CodeKaBabu - NLP Practicals Personalizer & ZIP Generator

> **Apna Code, Apna Style!**  
> A lightweight, client-side web application built for SPPU AI&DS / Computer Engineering students to automatically personalize all 9 NLP practical notebooks (`.ipynb` & `.py`) with their Name, Roll Number, Batch, and accurate Batch Performance Dates in a single ZIP download.

---

## Key Features

- **100% Client-Side Execution:** No server, no backend, zero hosting costs, and 100% student privacy (no data is stored or logged).
- **Batch Date Automation (Experiments 1 to 9):**
  - **Batch B1:** Friday Lab Schedule (`17/07/2026`, `31/07/2026`, `14/08/2026`, ...)
  - **Batch B2:** Wednesday Lab Schedule (`15/07/2026`, `22/07/2026`, `29/07/2026`, ...)
  - **Batch B3:** Monday Lab Schedule (`13/07/2026`, `27/07/2026`, `03/08/2026`, ...)
- **Output Preservation:** Injected directly into the Jupyter Notebook cell structure without clearing pre-computed outputs or execution streams.
- **Dual Format Support:** Automatically packages both Jupyter Notebooks (`.ipynb`) and Python Scripts (`.py`) inside the generated ZIP.
- **Offline Capable:** Includes an embedded offline bundle (`js/practicals-data.js`) and local JSZip so it works even when opening `index.html` directly from disk without internet.

---

## Included Practicals (9 Experiments):
1. **NLP Pipeline and Linguistic Analysis**
2. **Regular Expressions and Finite Automata**
3. **Edit Distance and Spelling Correction**
4. **Text Preprocessing and OOV Handling**
5. **Feature Extraction and Text Representation**
6. **Text Classification using Naïve Bayes and Logistic Regression**
7. **POS Tagging using Hidden Markov Model (HMM)**
8. **Named Entity Recognition (NER) and Evaluation**
9. **Dependency Parsing and Sentence Analysis**

*(Note: Experiment 10 is reserved for each student's unique individual mini-project and is intentionally excluded from the shared batch download).*

---

## Project Hierarchy

```text
nlpCode/
├── index.html                  # Responsive Single-Page Application (SPA)
├── css/
│   └── style.css               # CodeKaBabu brand styles, responsive grid, animations
├── js/
│   ├── app.js                  # Frontend controller & dynamic DOM event binder
│   ├── header-injector.js      # Language & format-aware comment injection engine
│   ├── zip-service.js          # In-memory JSZip packaging & blob delivery
│   ├── practicals-data.js      # Pre-bundled offline cache of practicals (1 to 9)
│   └── vendor/
│       └── jszip.min.js        # Bundled JSZip v3.10.1 library
├── assets/                     # CodeKaBabu mascot, frog icon, and hero art
│   ├── frog_icon.png
│   ├── hero_illustration.png
│   ├── frog_mascot.png
│   └── code_paper.png
├── practicals/                 # Original unchanged template notebooks (1 to 9)
│   ├── manifest.json           # Experiments metadata, syllabus titles, & batch schedules
│   ├── Program 01.ipynb
│   ├── ...
│   └── Program 09.ipynb
└── README.md
```

---

## How to Run Locally

### Option 1: Live Server (Recommended)
```powershell
# Using Python
python -m http.server 5500

# Using Node.js npx
npx serve .
```

Open `http://localhost:5500` in your browser.

### Option 2: Direct Double-Click
Double-click [`index.html`](file:///D:/nlpCode/index.html) directly! The embedded `js/practicals-data.js` allows it to work offline even on `file:///` protocols without CORS blocks.

---

## Deploy to GitHub Pages (Free Hosting)

Push to GitHub:
```bash
git add .
git commit -m "chore: remove 10th practical, finalize 9 core experiments"
git push
```
