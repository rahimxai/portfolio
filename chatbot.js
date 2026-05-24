/* === chatbot.js === Rahim's visual AI assistant ===
   Robust intent matcher over a curated, CV-grounded knowledge base.
   Each intent has weighted triggers. Multi-word phrases beat generic words.
   Tie-breaks by priority.
*/

(function () {

  /* ===================== KNOWLEDGE BASE ===================== */
  const intents = [

    /* ---------- Greetings ---------- */
    {
      id: 'greet',
      priority: 1,
      triggers: ['hi', 'hello', 'hey', 'salam', 'assalam', 'greetings', 'good morning', 'good evening'],
      answer: `Hi there! 👋 I'm Rahim's AI assistant. Ask me about his current work at CareCloud, his projects, skills, education, or how to reach him.`
    },
    {
      id: 'thanks',
      priority: 1,
      triggers: ['thanks', 'thank you', 'thx', 'appreciate'],
      answer: `You're welcome! Anything else you'd like to know about Rahim's work or projects?`
    },

    /* ---------- Who / About ---------- */
    {
      id: 'about',
      priority: 5,
      triggers: ['who is', 'who are you', 'about him', 'about rahim', 'about abdul', 'tell me about him', 'tell me about rahim', 'introduce', 'summary', 'professional summary'],
      answer: `**Abdul Rahim** is an AI Engineer with a Computer Science background, specializing in **LLMs, RAG and multi-agent systems**. He's proficient in Python and experienced architecting and fine-tuning models for domain-specific tasks · focused on production-ready, scalable AI.

He works as **Junior AI Engineer at CareCloud, Islamabad**, and leads engineering on the Medical Coding Automation product (an internal RCM module).`
    },

    /* ---------- Medical Coding (main project) ---------- */
    {
      id: 'medical_coding',
      priority: 10,
      triggers: ['medical coding', 'medical coding automation', 'current project', 'current work', 'main project', 'spotlight', 'carecloud project', 'rcm', 'revenue cycle', 'cpt', 'icd', 'modifier', 'modifiers', 'ncci', 'lcd', 'ncd', 'mips', 'main work', 'work at carecloud'],
      answer: `**Medical Coding Automation** · Rahim's main work at CareCloud (internal product, not public yet).

It's a **multi-agent LLM system** automating medical coding inside the Revenue Cycle Management pipeline. Each module · **CPT, ICD, Modifier, NCCI Edits, LCD/NCD, and MIPS** · has its own dedicated agent with prompt strategy and retrieval flow.

**Architecture:** LangChain + LangGraph multi-agent graph.
**Retrieval:** CPT & ICD codes + descriptions embedded in a **Vector DB** (Pinecone / Qdrant), with PostgreSQL for structured lookup. LCD/NCD articles, NCCI edits and MIPS measures sit as retrievable knowledge sources.
**Fine-tuning:** LLaMA 3.3 fine-tuned with **LoRA** for extraction and diagnosis prediction.

**Accuracy:** CPT **88%**, Modifier **86%**, MIPS **100%** (measure-based), ICD **70%** · actively improving ICD.
**Impact:** Reduced manual data processing time by **40%**.
**Role:** Joined as developer, now acting **Team Lead**.`
    },
    {
      id: 'accuracy',
      priority: 8,
      triggers: ['accuracy', 'numbers', 'metrics', 'percent', 'how accurate', 'how good is', 'results medical', 'medical results', 'percentage'],
      answer: `Medical Coding Automation accuracy (per CV):
• **CPT · 88%**
• **Modifier · 86%**
• **MIPS · 100%** (measure-based)
• **ICD · 70%** (lower; actively optimizing)

Work continues on retrieval quality, prompt tuning, and LoRA fine-tuning of LLaMA 3.3 for better domain coverage.`
    },
    {
      id: 'agents_arch',
      priority: 7,
      triggers: ['multi-agent', 'multi agent', 'multiagent', 'langchain', 'langgraph', 'agent architecture', 'how it works', 'how does it work', 'agents'],
      answer: `The Medical Coding Automation product is a **multi-agent system** built with **LangChain + LangGraph**. Each module (CPT, ICD, Modifier, NCCI, LCD/NCD, MIPS) is a separate agent with its own tuned prompts and retrieval flow. LLM API calls are orchestrated through the graph, with semantic search over a Vector DB plus PostgreSQL for structured code lookup.`
    },
    {
      id: 'rag',
      priority: 6,
      triggers: ['rag', 'retrieval augmented', 'vector db', 'vector database', 'embedding', 'embeddings', 'semantic search', 'pinecone', 'qdrant'],
      answer: `Yes · RAG sits at the core. CPT and ICD codes (with their descriptions) are embedded and stored in a **Vector DB** (Pinecone / Qdrant) for semantic search, alongside PostgreSQL for structured lookups. LCD/NCD articles, NCCI edits, and MIPS measures are all retrievable knowledge sources the agents consult.`
    },
    {
      id: 'finetune',
      priority: 6,
      triggers: ['lora', 'fine-tune', 'fine tune', 'finetune', 'fine tuning', 'local llm', 'llama', 'llama 3', 'llama 3.3', 'fine-tuning'],
      answer: `Rahim fine-tunes local LLMs with **LoRA** for domain-specific accuracy. Specifically, he fine-tuned **LLaMA 3.3** for medical data extraction and diagnosis prediction inside the Medical Coding Automation product.`
    },

    /* ---------- FYP / ZenBuild ---------- */
    {
      id: 'fyp',
      priority: 10,
      triggers: ['fyp', 'final year project', 'zenbuild', 'zen build', 'architectural design', 'architecture project', 'floor plan', 'floorplan', 'floorplan generator'],
      answer: `**ZenBuild · AI-Powered Architectural Design** is Rahim's Final Year Project (BS CS, IST, July 2025), co-authored with Muhammad Zaryab under Ms. Ammara Yaseen.

It's an end-to-end AI platform for **automated 2D floorplan generation**, built on an enhanced **DeepLayout** framework (Wu et al., 2019) trained on the **RPLAN** dataset. The system has a **four-module sequential neural pipeline**: Living → Continue → Wall → Location, followed by a vectorization engine that converts pixel outputs into professional vector floorplans.

**Results:** up to **99.5%** validation accuracy across modules. Generates a floorplan in **~8 seconds** vs ~45 min of manual MATLAB drafting (**300× faster**). In a user study, **8 out of 10 architects** said they'd use the output as a starting point.

**Scope:** single-story residential, 60–120 m². Supports 2/3/4-room layouts with multiple variants.

**Tech:** Python, PyTorch, CNN, Deep Learning, Computer Vision, Image Segmentation, DeepLayout, ResNet-34, RPLAN dataset, Vectorization, NumPy, Flask.
**Code:** https://github.com/rahimxai/AI-Powered-Architectural-Design`
    },
    {
      id: 'zenbuild_pipeline',
      priority: 8,
      triggers: ['rplan', 'deeplayout', 'four module', 'four-module', '4 modules', 'living continue wall', 'living module', 'continue module', 'wall module', 'location module', 'vectorization'],
      answer: `ZenBuild's pipeline: user-supplied boundary → multi-channel tensor → **four specialized CNN modules** (Living regression → Continue → Wall generator → Location) → vectorization engine → color-coded vector floorplan → texture overlay & interior rendering. Trained on the **RPLAN** dataset with **ResNet-34** backbones inside the DeepLayout modules.`
    },

    /* ---------- Bone Fracture ---------- */
    {
      id: 'bone',
      priority: 10,
      triggers: ['bone', 'fracture', 'x-ray', 'xray', 'x ray', 'bone fracture', 'mura'],
      answer: `**Bone Fracture Detection** · a two-stage Computer Vision pipeline.

• **Stage 1:** ResNet-50 body-part router → Hand / Shoulder / Elbow.
• **Stage 2:** part-specialist ResNet-50 (one per part) → fractured / normal.
• Dataset: **MURA** (Stanford ML Group) · 20,335 musculoskeletal radiographs.
• Split: 72% train / 18% val / 10% test. Augmentation: horizontal flips.
• Trained with **Adam** (lr 1e-4) + early stopping.
• Ships as a CustomTkinter desktop GUI plus an optional Flask web demo.

**Accuracy:** **100%** body-part classification, **87.9%** fracture detection.
**Tech:** Python, TensorFlow, Keras, CNN, ResNet-50, Image Classification, Computer Vision, Transfer Learning, NumPy, Pandas.
**Code:** https://github.com/rahimxai/Bone-Fracture-Detection---AI`
    },

    /* ---------- Bird ---------- */
    {
      id: 'bird',
      priority: 10,
      triggers: ['bird', 'birds', 'cub', 'cub-200', 'fine-grained', 'fine grained classification', 'bird classification'],
      answer: `**Fine-Grained Bird Classification** on the **CUB-200-2011** dataset (200 species, stratified 70/15/15 split, fixed seed). Four experiments benchmarked:

• Exp 1 · ResNet-50 baseline → **82.18%** Val Top-1 / **95.93%** Top-5.
• Exp 2 · + bbox crop → 79.92% Val Top-1.
• Exp 3 · + MixUp / CutMix → **96.55%** Test Top-5 (best ResNet).
• Exp 4 · EfficientNet-B4 with warm-up + full fine-tune + label smoothing → strongest backbone overall.

**Grad-CAM** confirms the model attends to bird body, head and wing regions (not background).

**Tech:** Python, PyTorch, CNN, Image Classification, Computer Vision, Transfer Learning, ResNet-50, EfficientNet-B4, MixUp, CutMix, Label Smoothing, Grad-CAM.
**Code:** https://github.com/rahimxai/Bird-Classification`
    },

    /* ---------- Other / early academic projects ---------- */
    {
      id: 'other_projects',
      priority: 7,
      triggers: ['other project', 'other projects', 'early project', 'early work', 'academic project', 'academic projects', 'academic work', 'previous projects', 'older projects', 'more project', 'side project', 'university project', 'university projects', 'college project', 'student project', 'other and early', 'tell me about your other', 'tell me about your early'],
      answer: `These are Rahim's **early work & academic projects** built during his BS CS at IST · each in its own GitHub repo:

• **Student Management System** · Python + MySQL. Authentication, CRUD operations, search, and CSV export for student records. *Stack:* Python, MySQL, Tkinter.

• **Weather Forecast App** · Cross-platform mobile app showing real-time weather, multi-city support, and forecasts via a public weather API. *Stack:* React Native, JavaScript, REST APIs.

• **Crypto Analyzer** · Live cryptocurrency tracking with historical price charts and market-cap-based sorting. *Stack:* Python, REST APIs, Pandas, Matplotlib.

• **Pharmacy Management System** · OOP-based desktop app for billing, inventory tracking and stock alerts. *Stack:* Python (OOP), Tkinter, file-based storage.

• **University Management System** · Custom **doubly-linked-list** data structure with full CRUD for students, courses and faculty. *Stack:* C++ / Python, DSA.

• **Tourism Website** · Responsive multi-page site with semantic markup and modern layout. *Stack:* HTML5, CSS3, JavaScript.

• **Attendance Management System** · GUI app for marking and exporting class attendance. *Stack:* Python, Tkinter.

• **General Store Billing System** · Console billing with inventory and receipts. *Stack:* C++ / Python.

• **Software Testing · Test Cases Suite** · Academic black-box & white-box test-case design with documentation. *Stack:* Manual + automated test design.

All repos: https://github.com/rahimxai?tab=repositories`
    },

    /* ---------- Skills ---------- */
    {
      id: 'skills',
      priority: 6,
      triggers: ['skill', 'skills', 'tech stack', 'tech', 'technology', 'technologies', 'what do you use', 'what tools', 'expertise', 'know how', 'languages you', 'frameworks'],
      answer: `Rahim's technical skills:

• **Generative AI:** LLMs, RAG, Fine Tuning, LoRA, Prompt Engineering, LangChain, LangGraph, Multi-Agent Systems.
• **ML / DL:** PyTorch, TensorFlow, CNNs, Neural Networks.
• **Computer Vision:** Image Classification, Image Segmentation, Feature Extraction.
• **Programming:** Python.
• **Databases:** PostgreSQL, MySQL, Vector DBs (Pinecone, Qdrant).
• **Deployment / APIs:** FastAPI, Flask, Docker.
• **Web & Tools:** HTML, CSS, Git, GitHub.`
    },

    /* ---------- Experience ---------- */
    {
      id: 'experience',
      priority: 6,
      triggers: ['experience', 'work history', 'work experience', 'years of experience', 'how long', 'how many years', 'background', 'career', 'job history', 'previous job', 'current job', 'jobs'],
      answer: `Rahim's professional experience:

• **Junior AI Engineer @ CareCloud** (Aug 2025 – Present) · leading the Medical Coding Automation multi-agent system. Automated healthcare pipeline progressing from LLMs to RAG-based multi-agent systems; fine-tuned LLaMA 3.3 with LoRA; designed agent-specific prompts; reduced manual data processing time by **40%**.

• **IT Intern @ CareCloud** (Jun 2025 – Aug 2025) · contributed to an AI-powered X-ray analysis system; data preprocessing and automation research.

About **1 year** of industry experience in total.`
    },
    {
      id: 'role_lead',
      priority: 5,
      triggers: ['team lead', 'lead', 'role', 'position', 'manager', 'manage'],
      answer: `Rahim started as a developer on the Medical Coding Automation project and now acts as **Team Lead** · owning architecture decisions, agent testing, and the accuracy roadmap across CPT, ICD, Modifier, NCCI, LCD/NCD and MIPS modules.`
    },

    /* ---------- Education ---------- */
    {
      id: 'education',
      priority: 6,
      triggers: ['education', 'degree', 'university', 'college', 'study', 'studied', 'graduated', 'graduation', 'bs ', 'bachelor', 'computer science', 'ist'],
      answer: `**BS Computer Science** at the **Institute of Space Technology (IST), Islamabad** (Nov 2021 – Aug 2025). Final Year Project: **ZenBuild · AI-Powered Architectural Design**.`
    },

    /* ---------- Location ---------- */
    {
      id: 'location',
      priority: 6,
      triggers: ['where', 'location', 'based in', 'live in', 'city', 'country', 'islamabad', 'pakistan', 'isb', 'rawalpindi', 'rwp'],
      answer: `Rahim is based in **Islamabad, Pakistan**. He's open to on-site roles across **Islamabad / Rawalpindi (ISB / RWP)** and **remote** roles anywhere.`
    },

    /* ---------- Open to (roles) ---------- */
    {
      id: 'open_to',
      priority: 7,
      triggers: ['open to', 'looking for', 'what role', 'what roles', 'roles open', 'job preference', 'preferred role', 'preferred roles', 'available for', 'open for', 'remote', 'on-site', 'onsite', 'on site', 'hybrid', 'computer vision role', 'cv role'],
      answer: `Rahim is open to:

• **Roles:** AI Engineer, ML Engineer, LLM Engineer, **Computer Vision Engineer**, Generative AI Engineer.
• **Mode:** on-site in **Islamabad / Rawalpindi (ISB / RWP)** or **remote** roles globally.`
    },

    /* ---------- Joining / notice period ---------- */
    {
      id: 'notice',
      priority: 9,
      triggers: ['notice period', 'notice', 'how soon', 'when can you join', 'when can you start', 'how soon can you join', 'joining', 'start date', 'availability', 'how quickly'],
      answer: `Rahim's notice period is **30 days**, so he can **join within 30 days** of an offer.`
    },

    /* ---------- Languages (programming) ---------- */
    {
      id: 'languages',
      priority: 6,
      triggers: ['language', 'languages', 'programming language', 'proficient in', 'coding language', 'main language', 'what do you code', 'python proficient'],
      answer: `Rahim is **proficient in Python** · his primary language for AI/ML, backend (FastAPI / Flask) and data work. He also works comfortably with HTML, CSS, SQL (PostgreSQL, MySQL), JavaScript (for side projects), and Git/GitHub for version control.`
    },

    /* ---------- Technical interests ---------- */
    {
      id: 'interests',
      priority: 7,
      triggers: ['interest', 'interests', 'passion', 'passions', 'focus area', 'focus areas', 'computer vision interest', 'technical interest'],
      answer: `**Technical interests:** **Computer Vision**, AI automation, LLM-based systems & knowledge assistants, and scalable AI architecture · building production AI that actually moves the needle.`
    },

    /* ---------- Certificates ---------- */
    {
      id: 'certificates',
      priority: 5,
      triggers: ['certificate', 'certification', 'certificates', 'credential', 'credentials', 'internship certificate'],
      answer: `Rahim has internship certificates from **CareCloud** and **FPCDL** · both are in the Certificates section of this portfolio and open inline as PDFs.`
    },

    /* ---------- Contact ---------- */
    {
      id: 'contact',
      priority: 8,
      triggers: ['contact', 'reach', 'reach out', 'how can i contact', 'how to contact', 'get in touch', 'hire', 'email', 'phone', 'mobile', 'number'],
      answer: `You can reach Rahim directly:

• **Email:** rahimxofficial@gmail.com
• **Phone:** +92 316 7955682
• **LinkedIn:** https://www.linkedin.com/in/abdul-rahim-2a12b8302
• **GitHub:** https://github.com/rahimxai
• **Location:** Islamabad, Pakistan

He's open to **AI / ML / LLM / Computer Vision Engineer** roles · **on-site in Islamabad / Rawalpindi**, **hybrid**, or **remote**.`
    },
    {
      id: 'linkedin',
      priority: 6,
      triggers: ['linkedin'],
      answer: `LinkedIn: https://www.linkedin.com/in/abdul-rahim-2a12b8302`
    },
    {
      id: 'github',
      priority: 6,
      triggers: ['github', 'repo', 'repos', 'repositories', 'source code', 'code link'],
      answer: `GitHub: https://github.com/rahimxai · all public repos live there, including the flagship projects and older academic work.`
    },
    {
      id: 'cv',
      priority: 5,
      triggers: ['cv', 'resume', 'download cv', 'download resume', 'pdf cv'],
      answer: `Open the CV from the "View CV" button in the top navbar · it opens inline as a PDF. Direct link: assets/docs/Abdul-Rahim-CV.pdf.`
    },

    /* ---------- Demos ---------- */
    {
      id: 'demos',
      priority: 5,
      triggers: ['demo', 'video', 'watch demo', 'show me'],
      answer: `Each flagship project has a **Watch Demo** button · click it to play the demo video. The four demos are: Medical Coding Automation (Spotlight), ZenBuild (FYP), Bone Fracture Detection, and Bird Classification.`
    }
  ];

  const FALLBACK = `I'm not sure about that one specifically. I can tell you about Rahim's **Medical Coding Automation** project, his **FYP (ZenBuild)**, **Bone Fracture Detection**, **Bird Classification**, his **early academic projects**, **experience**, **skills**, **education**, **location**, **notice period (30 days)**, or **how to contact** him. Try one of those!`;

  /* ===================== INTENT MATCHER ===================== */
  function normalize(s) {
    return ' ' + s.toLowerCase()
      .replace(/[^a-z0-9 .+/-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() + ' ';
  }
  function phraseMatch(haystack, needle) {
    // Word-boundary-ish match: needs spaces / start / end around the phrase.
    const n = ' ' + needle.toLowerCase().trim() + ' ';
    return haystack.includes(n);
  }
  function scoreIntent(q, intent) {
    let s = 0, hits = 0;
    for (const t of intent.triggers) {
      if (phraseMatch(q, t)) {
        const words = t.trim().split(/\s+/).length;
        // Weight by length + heavy bonus for multi-word phrases
        s += t.length + (words > 1 ? words * 8 : 0);
        hits++;
      }
    }
    if (hits === 0) return 0;
    return s + intent.priority + hits * 2;
  }
  function findAnswer(query) {
    const q = normalize(query);
    let best = null, bestScore = 0;
    for (const intent of intents) {
      const s = scoreIntent(q, intent);
      if (s > bestScore) { bestScore = s; best = intent; }
    }
    return best ? best.answer : FALLBACK;
  }

  /* ===================== SPEECH + AVATAR ===================== */
  const synth = window.speechSynthesis;
  let muted = false;
  let mouthInterval = null;

  const avatarSVG = document.getElementById('avatar-svg');
  const mouth = document.getElementById('mouth');
  const caption = document.getElementById('avatar-caption');
  const statusEl = document.getElementById('assistant-status');

  const MOUTH_CLOSED = 'M82 122 Q100 126 118 122';
  const MOUTH_SHAPES = [
    MOUTH_CLOSED,
    'M82 120 Q100 132 118 120',
    'M82 118 Q100 138 118 118',
    'M80 116 Q100 146 120 116'
  ];

  function startMouthAnim() {
    avatarSVG.classList.add('speaking');
    if (statusEl) statusEl.textContent = 'Speaking…';
    mouthInterval = setInterval(() => {
      const next = MOUTH_SHAPES[Math.floor(Math.random() * MOUTH_SHAPES.length)];
      mouth.setAttribute('d', next);
    }, 120);
  }
  function stopMouthAnim() {
    avatarSVG.classList.remove('speaking');
    if (statusEl) statusEl.textContent = 'Online · Ask me anything about Abdul';
    if (mouthInterval) { clearInterval(mouthInterval); mouthInterval = null; }
    mouth.setAttribute('d', MOUTH_CLOSED);
  }

  function speak(text) {
    if (muted || !synth) return;
    const plain = text
      .replace(/```[\s\S]*?```/g, '')
      .replace(/[*_`#>]/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/https?:\/\/\S+/g, '');
    try { synth.cancel(); } catch (_) {}
    const u = new SpeechSynthesisUtterance(plain);
    u.rate = 1.02; u.pitch = 1.0; u.volume = 1.0;
    const voices = synth.getVoices();
    const v = voices.find(v => /en[-_]/i.test(v.lang) && /female|zira|samantha|google/i.test(v.name)) ||
              voices.find(v => /en[-_]/i.test(v.lang)) || voices[0];
    if (v) u.voice = v;
    u.onstart = () => { startMouthAnim(); caption.textContent = '🎙️ Speaking…'; };
    u.onend   = () => { stopMouthAnim();  caption.textContent = 'Ask me anything else.'; };
    u.onerror = () => { stopMouthAnim(); };
    synth.speak(u);
  }
  function stopSpeaking() { try { synth.cancel(); } catch(_) {} stopMouthAnim(); }
  if (synth && synth.onvoiceschanged !== undefined) { synth.onvoiceschanged = () => {}; }

  /* ===================== CHAT UI ===================== */
  const chat = document.getElementById('chat');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-text');

  function md(text) {
    const esc = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return esc
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(https?:\/\/[^\s)]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
      .replace(/\n/g, '<br/>');
  }

  function addMessage(role, html) {
    const div = document.createElement('div');
    div.className = 'msg ' + role;
    div.innerHTML = `<p>${html}</p>`;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
    return div;
  }
  function addTyping() {
    const div = document.createElement('div');
    div.className = 'msg bot';
    div.innerHTML = '<span class="typing"><span></span><span></span><span></span></span>';
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
    return div;
  }

  async function ask(rawQuery) {
    const q = (rawQuery || '').trim();
    if (!q) return;
    addMessage('user', md(q));
    input.value = '';
    const typing = addTyping();
    await new Promise(r => setTimeout(r, 300 + Math.random() * 350));
    const answer = findAnswer(q);
    typing.remove();
    addMessage('bot', md(answer));
    caption.textContent = q.length > 50 ? q.slice(0, 50) + '…' : q;
    speak(answer);
  }

  form.addEventListener('submit', e => { e.preventDefault(); ask(input.value); });
  chat.addEventListener('click', e => {
    if (e.target.classList.contains('qr')) ask(e.target.textContent);
  });

  function toggleMute() {
    muted = !muted;
    if (muted) stopSpeaking();
    return muted;
  }

  window.AssistantAPI = { ask, stopSpeaking, toggleMute };
})();
