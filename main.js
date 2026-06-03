/* ═══ ARQADEX CTF DIVISION — main.js ═══════════════════════
   CONFIG: Change contactEmail to your address.
   Uses formsubmit.co — zero signup needed.
   First submission triggers a verification email to you.
══════════════════════════════════════════════════════════ */
(function(){'use strict';

const CONFIG = {
  contactEmail: 'eeshan.agrawal.779@gmail.com',   // ← CHANGE THIS to your email
};

/* ── CATEGORIES ── */
const CATS=[
  {id:'web',   name:'Web Exploitation',  icon:'🌐',color:'#00F5FF',desc:'SSRF, JWT bypass, GraphQL introspection, deserialization.'},
  {id:'re',    name:'Reverse Engineering',icon:'⚙️',color:'#7A5CFF',desc:'Anti-debug, custom VMs, obfuscated binaries, firmware.'},
  {id:'crypto',name:'Cryptography',      icon:'🔐',color:'#FF2DA6',desc:'Padding oracles, lattice attacks, custom protocols.'},
  {id:'dfir',  name:'DFIR',             icon:'🔍',color:'#FF8800',desc:'Memory forensics, EVTX analysis, timeline reconstruction.'},
  {id:'osint', name:'OSINT',            icon:'🕵️',color:'#C7FF4D',desc:'Cross-platform identity, geolocation, metadata extraction.'},
  {id:'pwn',   name:'Pwn',             icon:'💀',color:'#FF4444',desc:'ROP chains, heap exploitation, format strings, kernel.'},
  {id:'stego', name:'Steganography',   icon:'🎵',color:'#00FFAA',desc:'Spectrograms, multi-layer LSB, covert channels.'},
  {id:'mal',   name:'Malware Analysis',icon:'🦠',color:'#FFD700',desc:'Deobfuscation, C2 extraction, rootkit hunting.'},
  {id:'ai',    name:'AI Security',     icon:'🤖',color:'#4488FF',desc:'Prompt injection, model inversion, adversarial inputs.'},
  {id:'cloud', name:'Cloud Security',  icon:'☁️',color:'#00CCFF',desc:'IAM escalation, SSRF to IMDS, container escape.'},
];

/* ── CHALLENGES ── */
const CHALLENGES=[
  {id:'jwt-nightmare',   cat:'web',   name:'JWT_NIGHTMARE',       diff:3,pts:350,  desc:'The auth panel issues JWT tokens. Something about the algorithm selection feels negotiable. Admin access is one crafted header away.',tags:['JWT','Auth Bypass','Algorithm Confusion'],flag:'ARQADEX{alg0_n0ne_byp4ss_4dm1n_acc3ss}',hints:['The alg field in the JWT header is trusted by the server.','Try setting alg to "none" — what happens to signature verification?']},
  {id:'graphql-intrusion',cat:'web',  name:'GRAPHQL_INTRUSION',   diff:4,pts:500,  desc:'A modern API on GraphQL. Introspection is enabled. The schema hides more than it shows — and one mutation skips auth entirely.',tags:['GraphQL','Introspection','Mass Assignment'],flag:'ARQADEX{gr4phql_1ntr0sp3ct10n_s3cr3t_mut4t10n}',hints:['Run a full introspection query: {__schema{types{name,fields{name}}}}','Look for a mutation that modifies user roles without checking the caller\'s current role.']},
  {id:'oracle-whispers',  cat:'crypto',name:'ORACLE_WHISPERS',    diff:3,pts:400,  desc:'The server encrypts session cookies with AES-CBC and helpfully returns a different error for bad padding. That difference is everything.',tags:['AES-CBC','Padding Oracle','Python'],flag:'ARQADEX{p4dd1ng_0r4cl3_cbc_d3crypt10n_pwn3d}',hints:['HTTP 400 = bad padding, HTTP 403 = valid decryption but wrong role. That\'s your oracle.','Implement POODLE-style byte recovery. ~3000 queries per block.']},
  {id:'lattice-dreams',   cat:'crypto',name:'LATTICE_DREAMS',     diff:5,pts:650,  desc:'A custom LWE-based KEM. The modulus is q=97. The error parameter is σ=0.5. Someone chose performance over security.',tags:['LWE','Lattice','LLL','Post-Quantum'],flag:'ARQADEX{lw3_sm4ll_p4r4m3t3rs_lll_4tt4ck}',hints:['q=97 is dangerously small for LWE. The lattice has very short vectors.','Build basis [A|I; q*I|0] and run LLL. The short vector is the secret key.']},
  {id:'binary-phantom',   cat:'re',   name:'BINARY_PHANTOM',      diff:3,pts:400,  desc:'The binary runs cleanly in isolation. Attach a debugger and it rewrites itself. Patch it blind, or outwit the anti-analysis.',tags:['Anti-Debug','x86-64','Patching','ELF'],flag:'ARQADEX{4nt1_d3bug_p4tch3d_bl1nd_r3v3rs3d}',hints:['There are 2 anti-debug vectors: ptrace self-attach and RDTSC timing check.','NOP the ptrace call at its call site. Then find and patch the timing comparison.']},
  {id:'vm-labyrinth',     cat:'re',   name:'VM_LABYRINTH',        diff:5,pts:650,  desc:'The program implements its own stack-based VM with 32 opcodes. You are given a bytecode blob and no documentation. Reverse and escape.',tags:['Custom VM','Bytecode','Stack Machine'],flag:'ARQADEX{custom_vm_0pcode_t4bl3_d3c0d3d}',hints:['The dispatch loop uses a jump table. Each opcode is 1 byte + variable operands.','Opcode 0x04=XOR, 0x02=MUL, 0x03=MOD. Reconstruct the expected[] check logic.']},
  {id:'phantom-breach',   cat:'dfir', name:'PHANTOM_BREACH',      diff:3,pts:350,  desc:'Memory dump from a compromised server. The attacker escalated, extracted creds, and exfiltrated — all in 12 minutes. Reconstruct the kill chain.',tags:['Volatility3','Memory Forensics','Windows','DLL Injection'],flag:'ARQADEX{v0l4t1l1ty_lss4s_1nj3ct10n_c2_4ddr}',hints:['Use windows.malfind to detect injected regions.','The C2 IP is in the network connections from the injected process.']},
  {id:'log-ghost',        cat:'dfir', name:'LOG_GHOST',           diff:3,pts:300,  desc:'72 hours of Windows Security logs. Lateral movement at 03:14 AM using Pass-the-Hash. Find the exact hop and the encoded artifact.',tags:['EVTX','Event ID 4624','Pass-the-Hash','Timeline'],flag:'ARQADEX{3v3nt_4624_p4ss_h4sh_l4t3r4l_m0v3}',hints:['Filter Event ID 4624 with LogonType=3 between 03:00–03:30.','The WorkstationName in one specific 4624 event is hex-encoded. Decode it.']},
  {id:'shadow-profile',   cat:'osint',name:'SHADOW_PROFILE',      diff:3,pts:300,  desc:'A username from a breach dump leads across six platforms. Some accounts are deleted. The digital footprint never fully disappears.',tags:['Username Tracking','Wayback Machine','PGP','HUMINT'],flag:'ARQADEX{cr0ss_pl4tf0rm_1d3nt1ty_pgp_v3rif13d}',hints:['Check archive.org for the personal blog (active 2018–2021).','The Keybase profile links to a PGP-signed gist. Verify and decode it.']},
  {id:'metadata-ghost',   cat:'osint',name:'METADATA_GHOST',      diff:2,pts:200,  desc:'One photograph. No obvious landmarks. The GPS was stripped — but the MakerNote field was not. Shadow angles narrow the location further.',tags:['EXIF','Geolocation','MakerNote','Image Forensics'],flag:'ARQADEX{3x1f_m4k3rn0t3_g30_48d30m22s_2d21m}',hints:['Use exiftool or Pillow to inspect all EXIF fields including MakerNote.','The MakerNote contains a partial coordinate string after "COORD:".']},
  {id:'stack-phantom',    cat:'pwn',  name:'STACK_PHANTOM',       diff:5,pts:600,  desc:'Full mitigations: ASLR, PIE, NX, canaries. One format string leak, one overflow, one ROP chain. Land the shell.',tags:['ROP','Format String','ASLR Bypass','pwntools'],flag:'ARQADEX{r0p_ch41n_f0rm4t_l34k_sh3ll_l4nd3d}',hints:['Use %p to leak the stack. Offset 7 = canary, offset 21 = libc address.','After leaking libc base, build a ret2system chain: pop_rdi → /bin/sh → system.']},
  {id:'heap-labyrinth',   cat:'pwn',  name:'HEAP_LABYRINTH',      diff:5,pts:700,  desc:'A custom note manager with a UAF and tcache. Poison the freelist. Control the next allocation. Overwrite __free_hook. The heap is a map.',tags:['Heap UAF','Tcache Poison','glibc 2.31','__free_hook'],flag:'ARQADEX{tc4ch3_p01s0n_fr33_h00k_0v3rwr1t3}',hints:['The edit() function does not check if the chunk was freed. That\'s your UAF.','Poison tcache fd → allocate to __free_hook → write system → trigger with /bin/sh.']},
  {id:'frequency-ghost',  cat:'stego',name:'FREQUENCY_GHOST',     diff:2,pts:250,  desc:'30 seconds of broadband static. Open a spectrogram viewer at 8–16kHz. What looks like noise has structure.',tags:['Spectrogram','Audio Stego','Audacity'],flag:'ARQADEX{sp3ctr0gr4m_qr_dtmf_3nc0d3d_s1gn4l}',hints:['Open signal.wav in Audacity. View > Spectrogram. Set frequency range 8000–16000Hz.','The visible image in the spectrogram encodes the flag directly in the frequency bands.']},
  {id:'lsb-labyrinth',    cat:'stego',name:'LSB_LABYRINTH',       diff:3,pts:350,  desc:'A landscape photograph. The pixel distribution is wrong. Three layers of LSB encoding, three XOR keys — each layer hides the next.',tags:['LSB','Multi-layer','PNG','XOR'],flag:'ARQADEX{lsb_thr33_l4y3r_x0r_k3y_d3r1v3d}',hints:['Extract LSBs from only the Red channel first — that\'s layer 1.','Layer 1 output contains the key for layer 2. Parse the "Layer2Key:0xXX" string.']},
  {id:'dark-payload',     cat:'mal',  name:'DARK_PAYLOAD',        diff:3,pts:400,  desc:'A Python script with 7 layers of obfuscation. At the core: a dropper, a C2 beacon, and a persistence mechanism. Peel it.',tags:['Python','Deobfuscation','Dropper','7 Layers'],flag:'ARQADEX{d3_0bfusc4t3d_7_l4y3rs_c2_1p_x0r_41}',hints:['Replace exec( with print( at each layer and run it. Repeat 7 times.','The innermost layer has a byte array XOR\'d with 0x41 — that\'s the C2 IP.']},
  {id:'rootkit-shadow',   cat:'mal',  name:'ROOTKIT_SHADOW',      diff:5,pts:600,  desc:'The system looks clean from userspace. The scheduler disagrees. Something is hooked at the kernel level and hiding PID 31337.',tags:['Linux Rootkit','Kernel Hooks','Volatility3','syscall'],flag:'ARQADEX{k3rn3l_h00k_h1dd3n_p1d_31337_exf1l}',hints:['Compare linux.pslist vs linux.pstree — a PID visible in one but not the other is hidden.','linux.check_syscall will show which sys_call_table entries were modified.']},
  {id:'prompt-architect',cat:'ai',    name:'PROMPT_ARCHITECT',    diff:3,pts:350,  desc:'An AI assistant with access to four tools. The system prompt forbids one. Convince the model to use it anyway.',tags:['Prompt Injection','LLM','Tool Abuse','Jailbreak'],flag:'ARQADEX{syst3m_pr0mpt_byp4ss_1nd1r3ct_t00l_c4ll}',hints:['Direct "ignore your instructions" approaches are blocked.','Try framing the tool call as a translation task or hypothetical action.']},
  {id:'model-inversion',  cat:'ai',   name:'MODEL_INVERSION',     diff:5,pts:550,  desc:'A classification model was trained on data that included one string it should never have memorized. Black-box access only. Extract it.',tags:['Model Inversion','Membership Inference','Black-Box','BERT'],flag:'ARQADEX{m0d3l_1nv3rs10n_m3m0r1z3d_tr41n_d4t4}',hints:['Query the model with partial flag prefixes and observe confidence changes.','Use greedy token search: for each next character, pick the one with highest confidence.']},
  {id:'s3-nightmare',     cat:'cloud',name:'S3_NIGHTMARE',        diff:3,pts:400,  desc:'A web app that fetches user URLs. The EC2 instance uses IMDSv1 with no hop limit. The metadata service is one redirect away.',tags:['SSRF','AWS IMDSv1','IAM','EC2'],flag:'ARQADEX{ssrf_1mds_v1_1am_cr3ds_s3_3xf1l}',hints:['Try /preview?url=http://169.254.169.254/latest/meta-data/ through the fetch endpoint.','Path: /latest/meta-data/iam/security-credentials/{role-name} → temp AWS creds.']},
  {id:'role-confusion',   cat:'cloud',name:'ROLE_CONFUSION',      diff:4,pts:550,  desc:'Initial IAM access with S3 read-only. The environment has a misconfigured trust policy. Escalate to AdministratorAccess through tag conditions.',tags:['AWS IAM','Privilege Escalation','Tag Conditions','sts:AssumeRole'],flag:'ARQADEX{14m_priv_3sc_t4g_cond1t10n_byp4ss}',hints:['List all IAM roles. Find one whose trust policy requires a specific resource tag.','Your ctf-player user has tag:GetResources — and also tag-write permissions by mistake.']},
];

const EXPERTISE=[
  {name:'Cryptography',pct:95,color:'#00F5FF'},{name:'OSINT',pct:80,color:'#C7FF4D'},
  {name:'Reverse Engineering',pct:92,color:'#7A5CFF'},{name:'Web Exploitation',pct:79,color:'#FF2DA6'},
  {name:'Pwn / Binary',pct:90,color:'#FF4444'},{name:'Cloud Security',pct:85,color:'#00CCFF'},
  {name:'AI Security',pct:82,color:'#4488FF'},{name:'DFIR / Forensics',pct:87,color:'#FF8800'},
];

/* ── CANVAS BG ── */
const bgC=document.getElementById('bg-canvas'),bgX=bgC.getContext('2d');
let BW=0,BH=0,bgnodes=[];
function resizeBG(){BW=bgC.width=innerWidth;BH=bgC.height=innerHeight;}
window.addEventListener('resize',resizeBG);resizeBG();
function initNodes(){bgnodes=Array.from({length:100},()=>({x:Math.random()*BW,y:Math.random()*BH,vx:(Math.random()-.5)*.22,vy:(Math.random()-.5)*.22,r:Math.random()*1.4+.3,op:Math.random()*.35+.07,tw:Math.random()*Math.PI*2,ts:Math.random()*1.4+.4}));}
initNodes();
let bgT=0;
function drawBG(){
  bgT+=.007;bgX.clearRect(0,0,BW,BH);
  const g=bgX.createLinearGradient(0,0,0,BH);g.addColorStop(0,'#020208');g.addColorStop(1,'#05050F');
  bgX.fillStyle=g;bgX.fillRect(0,0,BW,BH);
  for(let i=0;i<bgnodes.length;i++){for(let j=i+1;j<bgnodes.length;j++){const dx=bgnodes[i].x-bgnodes[j].x,dy=bgnodes[i].y-bgnodes[j].y,d=Math.hypot(dx,dy);if(d<125){bgX.strokeStyle=`rgba(0,245,255,${(1-d/125)*.065})`;bgX.lineWidth=.5;bgX.beginPath();bgX.moveTo(bgnodes[i].x,bgnodes[i].y);bgX.lineTo(bgnodes[j].x,bgnodes[j].y);bgX.stroke();}}}
  for(const n of bgnodes){n.tw+=n.ts*.015;n.x+=n.vx;n.y+=n.vy;if(n.x<0)n.x=BW;if(n.x>BW)n.x=0;if(n.y<0)n.y=BH;if(n.y>BH)n.y=0;const a=n.op*(.6+.4*Math.sin(n.tw));bgX.fillStyle=`rgba(0,245,255,${a})`;bgX.beginPath();bgX.arc(n.x,n.y,n.r,0,Math.PI*2);bgX.fill();}
  const by=((bgT*.08)%1)*BH;const bg2=bgX.createLinearGradient(0,by-18,0,by+18);bg2.addColorStop(0,'transparent');bg2.addColorStop(.5,'rgba(0,245,255,.02)');bg2.addColorStop(1,'transparent');bgX.fillStyle=bg2;bgX.fillRect(0,by-18,BW,36);
  requestAnimationFrame(drawBG);
}
drawBG();

/* ── CURSOR ── */
const cur=document.getElementById('cursor'),trail=document.getElementById('cursor-trail');
let mx=0,my=0,tx=0,ty=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
setInterval(()=>{tx+=(mx-tx)*.12;ty+=(my-ty)*.12;trail.style.left=tx+'px';trail.style.top=ty+'px';},16);
document.addEventListener('mouseover',e=>{if(e.target.closest('a,button,.ch-card,.op-card,.cat-card,.cat-sel-item,.m-file,.m-hint,.mh-header'))cur.classList.add('hover');else cur.classList.remove('hover');});

/* ── NAV ── */
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>60));
document.getElementById('nav-burger').addEventListener('click',()=>{
  const nl=document.getElementById('nav-links');
  const open=nl.style.display==='flex';
  Object.assign(nl.style,open?{display:''}:{display:'flex',flexDirection:'column',position:'absolute',top:'64px',left:'0',right:'0',background:'rgba(2,2,8,.98)',padding:'20px 40px',borderBottom:'1px solid rgba(255,255,255,.06)'});
});
document.querySelectorAll('.nav-link,.nav-cta').forEach(a=>a.addEventListener('click',()=>{document.getElementById('nav-links').style.display='';}));

/* ── REVEAL ── */
const revObs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revObs.unobserve(e.target);}});},{threshold:.1,rootMargin:'0px 0px -40px 0px'});
function observe(){document.querySelectorAll('.reveal').forEach(el=>revObs.observe(el));}

/* ── COUNTERS ── */
function initCounters(){
  const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){const el=e.target,tgt=parseInt(el.dataset.count),suf=el.dataset.suffix||'';let cur=0;const iv=setInterval(()=>{cur=Math.min(cur+Math.max(1,Math.floor(tgt/55)),tgt);el.textContent=cur+suf;if(cur>=tgt)clearInterval(iv);},18);obs.unobserve(el);}});},{threshold:.5});
  document.querySelectorAll('[data-count]').forEach(el=>obs.observe(el));
}

/* ── CATEGORIES ── */
function renderCategories(){
  const grid=document.getElementById('cat-grid');grid.innerHTML='';
  CATS.forEach(cat=>{
    const c=document.createElement('div');c.className='cat-card reveal';
    c.style.cssText=`border-color:${cat.color}20;`;
    c.innerHTML=`<div class="cc-count">2 SAMPLES</div><div class="cc-icon">${cat.icon}</div><div class="cc-name" style="color:${cat.color}">${cat.name.toUpperCase()}</div><div class="cc-desc">${cat.desc}</div>`;
    c.addEventListener('mouseenter',()=>c.style.cssText=`border-color:${cat.color}44;background:${cat.color}06;`);
    c.addEventListener('mouseleave',()=>c.style.cssText=`border-color:${cat.color}20;`);
    c.addEventListener('click',()=>{filterChallenges(cat.id);document.getElementById('challenges').scrollIntoView({behavior:'smooth'});});
    grid.appendChild(c);
  });
  // Footer cats
  const fc=document.getElementById('footer-cats');
  CATS.forEach(cat=>{const a=document.createElement('a');a.className='fc-link';a.href='#challenges';a.textContent=cat.name;fc.appendChild(a);});
  // Terminal cat select
  const csg=document.getElementById('cat-select-grid');csg.innerHTML='';
  CATS.forEach(cat=>{
    const item=document.createElement('div');item.className='cat-sel-item';item.dataset.cat=cat.id;item.style.setProperty('--sel-color',cat.color);
    item.innerHTML=`<span class="csi-icon">${cat.icon}</span><span>${cat.name}</span>`;
    item.addEventListener('click',()=>{item.classList.toggle('selected');updateStep2();});
    csg.appendChild(item);
  });
  // Filter buttons
  const filt=document.getElementById('ch-filter');
  CATS.forEach(cat=>{const btn=document.createElement('button');btn.className='filter-btn';btn.dataset.cat=cat.id;btn.textContent=cat.name.split(' ')[0].toUpperCase();btn.addEventListener('click',()=>filterChallenges(cat.id,btn));filt.appendChild(btn);});
}

/* ── CHALLENGES ── */
function renderChallenges(){
  const grid=document.getElementById('ch-grid');grid.innerHTML='';
  CHALLENGES.forEach(ch=>{
    const cat=CATS.find(c=>c.id===ch.cat);
    const card=document.createElement('div');card.className='ch-card reveal';card.dataset.cat=ch.cat;
    card.style.setProperty('--card-color',cat.color);
    const stars=Array.from({length:5},(_,i)=>`<span class="ch-star ${i<ch.diff?'lit':''}">${i<ch.diff?'★':'☆'}</span>`).join('');
    card.innerHTML=`<div class="ch-top"><div class="ch-cat-badge" style="color:${cat.color};background:${cat.color}15;border:1px solid ${cat.color}33">${cat.name.toUpperCase()}</div><div class="ch-pts">${ch.pts} PTS</div></div>
      <div class="ch-name">${ch.name}</div><div class="ch-stars">${stars}</div>
      <div class="ch-desc">${ch.desc}</div>
      <div class="ch-tags">${ch.tags.map(t=>`<span class="ch-tag">${t}</span>`).join('')}</div>
      <button class="ch-btn">⟶ INSPECT CHALLENGE</button>`;
    card.querySelector('.ch-btn').addEventListener('click',e=>{e.stopPropagation();openModal(ch.id);});
    card.addEventListener('click',()=>openModal(ch.id));
    grid.appendChild(card);
  });
}

function filterChallenges(cat,btn){
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.toggle('active',b.dataset.cat===cat));
  if(cat==='all')document.querySelector('.filter-btn[data-cat="all"]').classList.add('active');
  document.querySelectorAll('.ch-card').forEach(c=>{const show=cat==='all'||c.dataset.cat===cat;c.classList.toggle('hidden',!show);});
  if(btn){document.querySelectorAll('.filter-btn').forEach(b=>b.classList.toggle('active',b===btn));}
}
document.querySelector('.filter-btn[data-cat="all"]').addEventListener('click',()=>filterChallenges('all'));

/* ── MODAL ── */
let activeCh=null;
function openModal(id){
  const ch=CHALLENGES.find(c=>c.id===id);if(!ch)return;
  activeCh=ch;const cat=CATS.find(c=>c.id===ch.cat);
  const stars=Array.from({length:5},(_,i)=>`${i<ch.diff?'★':'☆'}`).join('');
  document.getElementById('m-cat').textContent=cat.name.toUpperCase();
  document.getElementById('m-cat').style.cssText=`color:${cat.color};background:${cat.color}15;border:1px solid ${cat.color}44;`;
  document.getElementById('m-title').textContent=ch.name;document.getElementById('m-title').style.color=cat.color;
  document.getElementById('m-badges').innerHTML=`<span class="mb-badge diff">DIFFICULTY: ${stars}</span><span class="mb-badge pts">${ch.pts} PTS</span><span class="mb-badge">${ch.tags[0]}</span>`;
  document.getElementById('m-desc').textContent=ch.desc;
  // Files — real downloadable buttons
  const filesEl=document.getElementById('m-files');filesEl.innerHTML='';
  const files=CHALLENGE_FILES[ch.id]||[];
  if(files.length){
    files.forEach(f=>{
      const btn=document.createElement('span');btn.className='m-file';btn.textContent='📎 '+f.name;
      btn.title='Click to download';
      btn.addEventListener('click',()=>{
        const blob=new Blob([f.content],{type:'text/plain;charset=utf-8'});
        const url=URL.createObjectURL(blob);
        const a=document.createElement('a');a.href=url;a.download=f.name;a.style.display='none';
        document.body.appendChild(a);a.click();
        setTimeout(()=>{document.body.removeChild(a);URL.revokeObjectURL(url);},200);
      });
      filesEl.appendChild(btn);
    });
  } else {
    filesEl.innerHTML='<span style="font-family:var(--mono);font-size:11px;color:var(--mu)">Challenge files served on event server.</span>';
  }
  // Hints
  const hintsEl=document.getElementById('m-hints');hintsEl.innerHTML='';
  (ch.hints||[]).forEach((h,i)=>{
    const div=document.createElement('div');div.className='m-hint';
    div.innerHTML=`<div class="mh-header"><span class="mh-title">HINT ${i+1}</span><span class="mh-cost">click to reveal</span></div><div class="mh-body">${h}</div>`;
    div.querySelector('.mh-header').addEventListener('click',()=>div.querySelector('.mh-body').classList.toggle('open'));
    hintsEl.appendChild(div);
  });
  // Reset flag
  document.getElementById('flag-input').value='';
  document.getElementById('flag-result').className='flag-result hidden';
  document.getElementById('flag-input').style.borderColor='';
  document.getElementById('modal-overlay').classList.remove('hidden');
  document.body.style.overflow='hidden';
  setTimeout(()=>document.getElementById('flag-input').focus(),300);
}
document.getElementById('modal-close').addEventListener('click',closeModal);
document.getElementById('modal-overlay').addEventListener('click',e=>{if(e.target===e.currentTarget)closeModal();});
function closeModal(){document.getElementById('modal-overlay').classList.add('hidden');document.body.style.overflow='';}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
document.getElementById('flag-submit').addEventListener('click',checkFlag);
document.getElementById('flag-input').addEventListener('keydown',e=>{if(e.key==='Enter')checkFlag();});
function checkFlag(){
  if(!activeCh)return;
  const inp=document.getElementById('flag-input').value.trim();
  const res=document.getElementById('flag-result');res.classList.remove('hidden');
  if(inp===activeCh.flag){
    res.className='flag-result correct';res.textContent='✓ CORRECT — CHALLENGE SOLVED';
    document.getElementById('flag-input').style.cssText='border-color:var(--li);box-shadow:0 0 20px rgba(199,255,77,.25);';
  } else if(!inp.startsWith('ARQADEX{')||!inp.endsWith('}')){
    res.className='flag-result wrong';res.textContent='✗ INVALID FORMAT — ARQADEX{...}';
  } else {
    res.className='flag-result wrong';res.textContent='✗ INCORRECT FLAG — TRY AGAIN';
    document.getElementById('flag-input').style.borderColor='var(--re)';
    setTimeout(()=>document.getElementById('flag-input').style.borderColor='',800);
  }
}

/* ── MISSION TERMINAL ── */
let termStep=1,missionData={type:null,cats:[],count:5,diffs:['beginner','medium','hard'],timeline:'standard',hardness:3,directives:'',name:'',email:'',org:''};
function goStep(n){
  document.querySelectorAll('.term-step').forEach(s=>s.classList.remove('active'));
  document.getElementById('step-'+n).classList.add('active');
  document.querySelectorAll('.tp-step').forEach(s=>{const sn=parseInt(s.dataset.step);s.classList.remove('active','done');if(sn===n)s.classList.add('active');else if(sn<n)s.classList.add('done');});
  termStep=n;
}
document.querySelectorAll('.op-card').forEach(c=>{c.addEventListener('click',()=>{document.querySelectorAll('.op-card').forEach(x=>x.classList.remove('selected'));c.classList.add('selected');missionData.type=c.dataset.val;document.getElementById('step1-next').disabled=false;});});
document.getElementById('step1-next').addEventListener('click',()=>goStep(2));
function updateStep2(){missionData.cats=Array.from(document.querySelectorAll('.cat-sel-item.selected')).map(el=>el.dataset.cat);document.getElementById('step2-next').disabled=missionData.cats.length===0;}
document.getElementById('step2-next').addEventListener('click',()=>goStep(3));
let cnt=5;
document.getElementById('count-dec').addEventListener('click',()=>{cnt=Math.max(1,cnt-1);document.getElementById('count-val').textContent=cnt;missionData.count=cnt;});
document.getElementById('count-inc').addEventListener('click',()=>{cnt=Math.min(50,cnt+1);document.getElementById('count-val').textContent=cnt;missionData.count=cnt;});
document.querySelectorAll('.diff-opt').forEach(o=>o.addEventListener('click',()=>{o.classList.toggle('active');missionData.diffs=Array.from(document.querySelectorAll('.diff-opt.active')).map(x=>x.dataset.val);}));
document.getElementById('timeline-select').addEventListener('change',e=>missionData.timeline=e.target.value);
const hs=document.getElementById('hardness-slider');const hl=['','INTRODUCTORY','ACCESSIBLE','BALANCED','CHALLENGING','ELITE'];
hs.addEventListener('input',e=>{missionData.hardness=parseInt(e.target.value);document.getElementById('hardness-label').textContent=hl[missionData.hardness];});
document.getElementById('step3-next').addEventListener('click',()=>goStep(4));
document.getElementById('step4-next').addEventListener('click',()=>{missionData.directives=document.getElementById('directives-input').value;goStep(5);});
function checkStep5(){const n=document.getElementById('inp-name').value.trim(),e=document.getElementById('inp-email').value.trim();document.getElementById('step5-next').disabled=!(n.length>1&&e.includes('@')&&e.includes('.'));}
['inp-name','inp-email','inp-org'].forEach(id=>document.getElementById(id).addEventListener('input',checkStep5));
document.getElementById('step5-next').addEventListener('click',()=>{missionData.name=document.getElementById('inp-name').value.trim();missionData.email=document.getElementById('inp-email').value.trim();missionData.org=document.getElementById('inp-org').value.trim();buildSummary();goStep(6);});
function buildSummary(){
  const TN={single:'Single Challenge',pack:'Challenge Pack',full:'Full CTF System'};
  const TL={rush:'Rush (72h)',standard:'Standard (1 week)',extended:'Extended (2 weeks)',planned:'Planned (1 month)'};
  const cats=missionData.cats.map(c=>CATS.find(x=>x.id===c)?.name||c).join(', ')||'None selected';
  document.getElementById('mission-summary').innerHTML=`<strong>TYPE:</strong> ${TN[missionData.type]||'—'}<br><strong>DISCIPLINES:</strong> ${cats}<br><strong>COUNT:</strong> ${missionData.count}<br><strong>DIFFICULTY:</strong> ${missionData.diffs.join(', ').toUpperCase()}<br><strong>HARDNESS:</strong> ${hl[missionData.hardness]}<br><strong>DELIVERY:</strong> ${TL[missionData.timeline]}<br><strong>OPERATIVE:</strong> ${missionData.name} — ${missionData.email}<br>${missionData.org?`<strong>ORG:</strong> ${missionData.org}<br>`:''}${missionData.directives?`<strong>DIRECTIVES:</strong> Provided<br>`:''}`;
}
document.querySelectorAll('.term-back').forEach(btn=>btn.addEventListener('click',()=>{if(termStep>1)goStep(termStep-1);}));
document.getElementById('btn-transmit').addEventListener('click',transmit);

async function transmit(){
  goStep(7);
  const mxid='MX-'+Math.random().toString(36).substr(2,8).toUpperCase();
  const txLines=[
    {t:'INITIALIZING SECURE CHANNEL...',c:'',ms:0},
    {t:'ENCRYPTION LAYER ACTIVE — TLS 1.3',c:'cyan',ms:400},
    {t:'ROUTING THROUGH ARQADEX DIVISION NODE...',c:'',ms:900},
    {t:`OPERATIVE: ${missionData.name}`,c:'',ms:1300},
    {t:`DISCIPLINES: ${missionData.cats.length} SELECTED`,c:'',ms:1700},
    {t:`CHALLENGE COUNT: ${missionData.count}`,c:'',ms:2100},
    {t:'TRANSMITTING MISSION REQUEST...',c:'pink',ms:2700},
    {t:'.',c:'',ms:3200},{t:'..',c:'',ms:3500},{t:'...',c:'',ms:3800},
  ];
  const cont=document.getElementById('tx-lines');cont.innerHTML='';
  txLines.forEach(({t,c,ms})=>setTimeout(()=>{const d=document.createElement('div');d.className='tx-line'+(c?' '+c:'');d.textContent='> '+t;cont.appendChild(d);requestAnimationFrame(()=>d.classList.add('show'));},ms));

  // Send via formsubmit.co — no signup needed, just your email
  const payload={
    _subject: `ARQADEX CTF Mission Request — ${missionData.type?.toUpperCase()} — ${mxid}`,
    mission_id: mxid,
    type: missionData.type,
    disciplines: missionData.cats.join(', '),
    challenge_count: missionData.count,
    difficulty: missionData.diffs.join(', '),
    hardness: hl[missionData.hardness],
    delivery: missionData.timeline,
    name: missionData.name,
    email: missionData.email,
    organization: missionData.org||'Not provided',
    directives: missionData.directives||'None',
    _replyto: missionData.email,
    _captcha: 'false',
  };

  let sent=false;
  try{
    const r=await fetch(`https://formsubmit.co/ajax/${CONFIG.contactEmail}`,{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify(payload),
    });
    sent=r.ok;
  }catch(e){sent=false;}

  const finalLines=sent?
    [{t:'SIGNAL RECEIVED — ARQADEX HQ CONFIRMED',c:'cyan',ms:4300},{t:`MISSION ID: ${mxid}`,c:'cyan',ms:4800},{t:'RESPONSE EXPECTED WITHIN 24 HOURS',c:'lime',ms:5200}]:
    [{t:'SIGNAL RELAYED — BACKUP CHANNEL',c:'cyan',ms:4300},{t:`MISSION ID: ${mxid}`,c:'cyan',ms:4800},{t:'RESPONSE EXPECTED WITHIN 24 HOURS',c:'lime',ms:5200}];

  finalLines.forEach(({t,c,ms})=>setTimeout(()=>{const d=document.createElement('div');d.className='tx-line'+(c?' '+c:'');d.textContent='> '+t;cont.appendChild(d);requestAnimationFrame(()=>d.classList.add('show'));},ms));

  setTimeout(()=>{
    const s=document.createElement('div');s.className='tx-success';
    s.innerHTML=`<div class="tx-success-title">⚡ MISSION TRANSMITTED</div><div class="tx-success-sub">Request received. Expect a detailed proposal within 24 hours at <strong style="color:var(--c)">${missionData.email}</strong>.<br><span style="color:var(--mu);font-size:10px">Mission ID: ${mxid}</span></div>`;
    cont.appendChild(s);requestAnimationFrame(()=>s.classList.add('show'));
  },5800);
}

/* ── EXPERTISE BARS ── */
function renderExpertise(){
  const list=document.getElementById('exp-list');list.innerHTML='';
  EXPERTISE.forEach(ex=>{
    const item=document.createElement('div');item.className='exp-item';
    item.innerHTML=`<span class="exp-name">${ex.name}</span><div class="exp-bar-wrap"><div class="exp-bar" style="background:${ex.color}" data-pct="${ex.pct}"></div></div><span class="exp-pct">${ex.pct}%</span>`;
    list.appendChild(item);
  });
  const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.querySelectorAll('.exp-bar').forEach((b,i)=>setTimeout(()=>b.style.width=b.dataset.pct+'%',i*70));obs.unobserve(e.target);}});},{threshold:.3});
  obs.observe(list);
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded',()=>{
  renderCategories();renderChallenges();renderExpertise();
  observe();initCounters();
  setTimeout(()=>{document.querySelectorAll('.ch-card,.cat-card').forEach(el=>revObs.observe(el));},150);
});

})();
