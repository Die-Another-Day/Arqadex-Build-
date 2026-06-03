# ⚡ ARQADEX CTF DIVISION — ctf.arqadex.site

> Premium challenge engineering for offensive-security simulations.

## 🚀 Deploy (zero dependencies)
```bash
open index.html          # local preview
python3 -m http.server   # local server
```
For production: push to GitHub Pages / Netlify / Vercel — static files only.

---

## ✅ Two Issues Fixed

### 1. Challenge Files — Now Actually Downloadable
`challenge-files.js` contains real source code for all 20 challenges:
- Python Flask apps (JWT, GraphQL, Oracle, SSRF)
- C source files (Pwn, RE binaries)
- Solve script templates (pwntools, lattice, padding oracle)
- Analysis guides (DFIR, rootkit hunting)
- Generator scripts (stego, LWE crypto)

Click any file badge in the challenge modal → downloads instantly via Blob API.

### 2. Form Submissions — Now Delivered to Your Email
Uses **formsubmit.co** — no account needed.

**Setup (30 seconds):**
1. Open `main.js`
2. Line 8: change `contactEmail: 'ctf@arqadex.site'` to your email
3. Deploy the site
4. Submit the form once → you'll get a verification email from formsubmit.co
5. Click verify → all future submissions arrive in your inbox

Each submission email contains: mission type, categories, count, difficulty,
delivery timeline, hardness profile, special directives, and contact details.

---

## 📁 Files

| File | Lines | Purpose |
|---|---|---|
| `index.html` | 274 | Complete HTML — all sections + modal |
| `style.css` | 131 | Full cyberpunk design system |
| `challenge-files.js` | 645 | Real file content for 20 challenges + download function |
| `main.js` | 335 | All interactivity + formsubmit.co form handling |

---

## 🏆 20 Sample Challenges

| # | Name | Category | Difficulty | Points |
|---|---|---|---|---|
| 1 | JWT_NIGHTMARE | Web | ★★★ | 350 |
| 2 | GRAPHQL_INTRUSION | Web | ★★★★ | 500 |
| 3 | ORACLE_WHISPERS | Crypto | ★★★ | 400 |
| 4 | LATTICE_DREAMS | Crypto | ★★★★★ | 650 |
| 5 | BINARY_PHANTOM | RE | ★★★ | 400 |
| 6 | VM_LABYRINTH | RE | ★★★★★ | 650 |
| 7 | PHANTOM_BREACH | DFIR | ★★★ | 350 |
| 8 | LOG_GHOST | DFIR | ★★★ | 300 |
| 9 | SHADOW_PROFILE | OSINT | ★★★ | 300 |
| 10 | METADATA_GHOST | OSINT | ★★ | 200 |
| 11 | STACK_PHANTOM | Pwn | ★★★★★ | 600 |
| 12 | HEAP_LABYRINTH | Pwn | ★★★★★ | 700 |
| 13 | FREQUENCY_GHOST | Stego | ★★ | 250 |
| 14 | LSB_LABYRINTH | Stego | ★★★ | 350 |
| 15 | DARK_PAYLOAD | Malware | ★★★ | 400 |
| 16 | ROOTKIT_SHADOW | Malware | ★★★★★ | 600 |
| 17 | PROMPT_ARCHITECT | AI | ★★★ | 350 |
| 18 | MODEL_INVERSION | AI | ★★★★★ | 550 |
| 19 | S3_NIGHTMARE | Cloud | ★★★ | 400 |
| 20 | ROLE_CONFUSION | Cloud | ★★★★ | 550 |

---

## 🌐 Subdomain Setup

**Netlify** (easiest):
1. Drag folder to netlify.com/drop
2. Site Settings → Domain → Add: `ctf.arqadex.site`
3. DNS: add CNAME `ctf` → `your-site.netlify.app`

**GitHub Pages**:
```bash
echo "ctf.arqadex.site" > CNAME
git add . && git commit -m "ctf platform" && git push
# Repo Settings → Pages → main branch → /root
# DNS: CNAME ctf → username.github.io
```

---

*ARQADEX CTF DIVISION — Built for chaos. © 2025*
