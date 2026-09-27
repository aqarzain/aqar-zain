import"./hoisted.B6xXjB6v.js";const d=document.getElementById("match-page"),p=JSON.parse(d.dataset.props||"[]"),c="http://localhost:3000";let l=[];const o={};async function m(){try{const a=await(await fetch(`${c}/api/media/available`)).json();if(!a.success)throw new Error(a.error);l=a.data.available;const t=a.data.stats;if(document.getElementById("stat-total").textContent=t.total,document.getElementById("stat-linked").textContent=t.linked,document.getElementById("stat-available").textContent=t.available,document.getElementById("loading")?.classList.add("hidden"),l.length===0){document.getElementById("empty-state")?.classList.remove("hidden");return}g()}catch(s){document.getElementById("loading").innerHTML=`
        <div class="bg-rust/10 border border-rust/30 rounded-brand p-4 text-sm text-rust text-center">
          ❌ فشل التحميل: ${s.message}
        </div>
      `}}function g(){const s=document.getElementById("images-grid");s.innerHTML=l.map(a=>{const t=o[a];return`
        <div class="image-card bg-white rounded-brand border border-line overflow-hidden" data-filename="${a}">
          <!-- Image Preview -->
          <div class="aspect-video bg-cream/50 flex items-center justify-center overflow-hidden">
            <img
              src="/aqar-zain/images/properties/${a}"
              alt="${a}"
              loading="lazy"
              class="w-full h-full object-cover"
              onerror="this.parentElement.innerHTML='<div class=\\'text-4xl\\'>🖼️</div>'"
            />
          </div>

          <!-- Filename -->
          <div class="px-3 py-2 bg-cream/30 border-t border-line flex items-center justify-between">
            <span class="text-[10px] font-heading font-bold text-navy/60 truncate">${a}</span>
            ${t?'<span class="text-[10px] text-teal font-heading font-bold">✓ مُعيَّن</span>':""}
          </div>

          <!-- Property Selector -->
          <div class="p-3 space-y-2">
            <select class="property-select w-full px-2 py-2 text-xs border border-line rounded-brand focus:border-teal outline-none bg-white">
              <option value="">— اختر العقار —</option>
              ${p.map(n=>`
                <option value="${n.id}" ${t?.property_id===n.id?"selected":""}>
                  [${n.id}] ${n.title.slice(0,40)} ${n.category?`(${n.category})`:""}
                </option>
              `).join("")}
            </select>

            <label class="flex items-center gap-2 text-[11px] text-navy/70">
              <input
                type="checkbox"
                class="primary-checkbox w-4 h-4"
                ${t?.is_primary?"checked":""}
              />
              <span>صورة رئيسية</span>
            </label>
          </div>
        </div>
      `}).join(""),document.querySelectorAll(".property-select").forEach(a=>{a.addEventListener("change",t=>{const n=t.target.closest(".image-card"),e=n.dataset.filename,r=t.target.value;r?o[e]={property_id:parseInt(r),is_primary:o[e]?.is_primary||!1}:delete o[e],y(n,e)})}),document.querySelectorAll(".primary-checkbox").forEach(a=>{a.addEventListener("change",t=>{const e=t.target.closest(".image-card").dataset.filename,r=t.target.checked;o[e]&&(o[e].is_primary=r)})})}function y(s,a){const t=!!o[a];t?s.classList.add("ring-2","ring-teal"):s.classList.remove("ring-2","ring-teal");const n=s.querySelector(".px-3.py-2");if(n){const e=n.querySelector(".assigned-badge");if(t&&!e){const r=document.createElement("span");r.className="assigned-badge text-[10px] text-teal font-heading font-bold",r.textContent="✓ مُعيَّن",n.appendChild(r)}else!t&&e&&e.remove()}}document.getElementById("save-all-btn")?.addEventListener("click",async()=>{const s=Object.entries(o).map(([t,n])=>({property_id:n.property_id,filename:t,is_primary:n.is_primary}));if(s.length===0){i("⚠️ لم تحدّد أي صورة","info");return}const a=document.getElementById("save-all-btn");a.disabled=!0,a.textContent="⏳ جاري الحفظ...";try{const n=await(await fetch(`${c}/api/media/link-bulk`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({links:s})})).json();if(n.success){const e=n.data.filter(r=>r.success).length;i(`✅ تم حفظ ${e} صورة`,"success"),setTimeout(()=>window.location.reload(),1500)}else throw new Error(n.error)}catch(t){i(`❌ ${t.message}`,"error"),a.disabled=!1,a.textContent="💾 حفظ الكل"}});function i(s,a="info"){const t=document.getElementById("toast-container"),n={success:"bg-teal",error:"bg-rust",info:"bg-navy"},e=document.createElement("div");e.className=`${n[a]} text-cream px-4 py-2.5 rounded-pill shadow-lg text-sm font-heading font-bold pointer-events-auto transition-all`,e.style.minWidth="220px",e.style.textAlign="center",e.textContent=s,e.style.opacity="0",e.style.transform="translateY(-10px)",t.appendChild(e),setTimeout(()=>{e.style.opacity="1",e.style.transform="translateY(0)"},50),setTimeout(()=>{e.style.opacity="0",e.style.transform="translateY(-10px)",setTimeout(()=>e.remove(),300)},3e3)}m();
