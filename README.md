# CodeKaBabu - NLP Practicals Personalizer & ZIP Generator

> **Apna Code, Apna Style!**  
> A lightweight, client-side web application built for SPPU AI&DS / Computer Engineering students to automatically personalize all NLP practical notebooks (`.ipynb` & `.py`) with their Name, Roll Number, Batch, and accurate Batch Performance Dates in a single ZIP download.

---

## 🌟 Key Features

- **100% Client-Side Execution:** No server, no backend, zero hosting costs, and 100% student privacy (no data is stored or logged).
- **Batch Date Automation:**
  - **Batch B1:** Friday Lab Schedule (`17/07/2026`, `31/07/2026`, `14/08/2026`, ...)
  - **Batch B2:** Wednesday Lab Schedule (`15/07/2026`, `22/07/2026`, `29/07/2026`, ...)
  - **Batch B3:** Monday Lab Schedule (`13/07/2026`, `27/07/2026`, `03/08/2026`, ...)
- **Output Preservation:** Injected directly into the Jupyter Notebook cell structure without clearing pre-computed outputs or execution streams.
- **Dual Format Support:** Download as Jupyter Notebooks (`.ipynb`), Python Scripts (`.py`), or Both (`.ipynb` + `.py`).
- **Offline Capable:** Includes an embedded offline bundle (`js/practicals-data.js`) and local JSZip so it works even when opening `index.html` directly from disk without internet.

---

## 📂 Project Hierarchy

```text
nlpCode/
├── index.html                  # Responsive Single-Page Application (SPA)
├── css/
│   └── style.css               # CodeKaBabu brand styles, responsive grid, animations
├── js/
│   ├── app.js                  # Frontend controller & dynamic DOM event binder
│   ├── header-injector.js      # Language & format-aware comment injection engine
│   ├── zip-service.js          # In-memory JSZip packaging & blob delivery
│   ├── practicals-data.js      # Pre-bundled offline cache of practicals
│   └── vendor/
│       └── jszip.min.js        # Bundled JSZip v3.10.1 library
├── assets/                     # CodeKaBabu mascot, frog icon, and hero art
│   ├── frog_icon.png
│   ├── hero_illustration.png
│   ├── frog_mascot.png
│   └── code_paper.png
├── practicals/                 # Original unchanged template notebooks (1 to 10)
│   ├── manifest.json           # Experiments metadata, syllabus titles, & batch schedules
│   ├── Program 01.ipynb
│   ├── ...
│   └── Program 10.ipynb
└── README.md
```

---

## 🚀 How to Run Locally

### Option 1: Live Server (Recommended)
You can serve the static site using any local development server:

```powershell
# Using Python
python -m http.server 5500

# Using Node.js npx
npx serve .
```

Open `http://localhost:5500` in your browser.

### Option 2: Direct Double-Click
You can double-click [`index.html`](file:///D:/nlpCode/index.html) directly! Thanks to the embedded `js/practicals-data.js`, the generator works completely offline even on `file:///` protocols without CORS blocks.

---

## 🌐 Deploy to GitHub Pages (Free Hosting)

1. Initialize git and push to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial release of CodeKaBabu Practical Generator"
   git branch -M main
   git remote add origin https://github.com/<your-username>/codekababu.git
   git push -u origin main
   ```
2. In your GitHub repository:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment** > **Branch**, select `main` and `/ (root)`.
   - Click **Save**.
3. Your website will be live in 1-2 minutes at:  
   `https://<your-username>.github.io/codekababu/`
