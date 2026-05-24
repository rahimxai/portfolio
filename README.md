# Abdul Rahim — AI Engineer · Portfolio

A modern, single-page portfolio for **Abdul Rahim**, AI Engineer at CareCloud.
Pure HTML / CSS / vanilla JavaScript — no build step, no dependencies.

## ✨ Highlights

- **Hero + animated background** with profile photo, stats, and quick CTAs.
- **About, Experience, Skills, Certificates, Contact** sections.
- **Projects** section with one **Spotlight** (Medical Coding Automation) and three featured cards
  (ZenBuild FYP, Bone Fracture Detection, Bird Classification). Each plays its demo video in
  a full-screen modal and links to the GitHub profile for source code.
- **Visual AI Assistant** — floating chatbot with an animated SVG avatar that lip-syncs while
  speaking (Web Speech API). Curated knowledge base covers Rahim's role, projects, accuracy
  numbers, tech stack, and contact info.
- All demo videos and documents are bundled under `assets/` — ready to host as a static site.

## 📁 Structure

```
Portfolio/
├─ index.html
├─ styles.css
├─ script.js          # interactions, video modal, scroll reveals
├─ chatbot.js         # KB + animated avatar + speech
├─ README.md
└─ assets/
   ├─ img/
   │  └─ profile.jpeg
   ├─ videos/
   │  ├─ medical-coding.mp4   # ⭐ Spotlight demo
   │  ├─ zenbuild.mp4         # FYP demo
   │  ├─ bone.mp4             # Bone Fracture Detection
   │  └─ bird.mp4             # Bird Classification
   └─ docs/
      ├─ Abdul-Rahim-CV.pdf
      ├─ Abdul-Rahim-Cover-Letter.docx
      ├─ CareCloud-Certificate.pdf
      ├─ FPCDL-Certificate.pdf
      ├─ ZenBuild-Final-Presentation.pptx
      ├─ ZenBuild-Thesis.pdf
      ├─ ZenBuild-Research-Paper.pdf
      └─ ZenBuild-Poster.pdf
```

## 🚀 Run locally

Just open `index.html` in a modern browser. For video autoplay to work reliably,
serve over HTTP (any static server is fine):

```powershell
# Python (already in your stack)
cd d:\Projects\Portfolio
python -m http.server 8080
# → open http://localhost:8080
```

## 🌐 Deploy / Host

The whole `Portfolio/` folder is a static site. Pick any of these:

### Option A — GitHub Pages (free, recommended)

```powershell
cd d:\Projects\Portfolio
git init
git add .
git commit -m "Portfolio v1"
git branch -M main
git remote add origin https://github.com/rahimxai/portfolio.git   # create empty repo first
git push -u origin main
```

Then on GitHub → **Settings → Pages → Source: `main` / root** → Save.
Your site goes live at `https://rahimxai.github.io/portfolio/`.

> 💡 The demo videos total ~175 MB. That's under GitHub's 1 GB repo soft limit,
> but for cleaner hosting consider **Git LFS** for `assets/videos/*.mp4`:
> ```
> git lfs install
> git lfs track "assets/videos/*.mp4"
> git add .gitattributes
> ```

### Option B — Netlify (drag & drop)

1. Go to https://app.netlify.com/drop
2. Drag the entire `Portfolio` folder.
3. Done — instant URL, can attach a custom domain.

### Option C — Vercel

```powershell
npm i -g vercel
cd d:\Projects\Portfolio
vercel
```

### Option D — Cloudflare Pages

Works the same way: connect the GitHub repo, no build command, output dir = `/`.

## 🎤 About the AI Assistant

- Click the **Ask AI** floating button (bottom-right) or **Talk to my AI Assistant** in the hero.
- The avatar **animates and speaks** the answer using the browser's built-in speech synthesis.
  Toggle the speaker icon (🔊 / 🔇) to mute.
- The knowledge base lives in `chatbot.js` → `KB`. Add more `{ tags, a }` objects to teach it
  about new topics. Tag-matching is keyword-based and scored by tag length.

## 🛠 Editing content

- **Hero text & stats** → top of `index.html`.
- **Project cards** → `<section id="projects">`. Each card uses `data-video` + `data-title`.
- **Chatbot answers** → `chatbot.js`, `KB` array.
- **Color theme** → CSS variables at the top of `styles.css` (`--brand`, `--brand-2`, `--accent`).

## 📬 Contact

- GitHub: https://github.com/rahimxai
- LinkedIn, phone, email — see the CV (`assets/docs/Abdul-Rahim-CV.pdf`).
