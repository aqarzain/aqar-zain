import"./hoisted.B6xXjB6v.js";const y=document.getElementById("match-page"),p=JSON.parse(y.dataset.props||"[]"),g="http://localhost:3000";let i=[],m="all";const o={};function f(n){if(!n)return"السعر عند الطلب";const t=typeof n=="string"?parseFloat(n):n;return isNaN(t)?"السعر عند الطلب":t>=1e6?`${(t/1e6).toFixed(2)} مليون`:t>=1e3?`${Math.round(t/1e3)} ألف`:`${t} جنيه`}function v(n){return{شقة:"🏢",محل:"🏪",فيلا:"🏡",منزل:"🏠",أرض:"🌍",مكتب:"💼",مستودع:"📦"}[n]||"🏢"}async function x(){try{const t=await(await fetch(`${g}/api/media/available`)).json();if(!t.success)throw new Error(t.error);i=t.data.available;const a=t.data.stats;if(document.getElementById("stat-total").textContent=a.total,document.getElementById("stat-linked").textContent=a.linked,document.getElementById("stat-available").textContent=a.available,document.getElementById("loading")?.classList.add("hidden"),i.length===0){document.getElementById("empty-state")?.classList.remove("hidden");return}d()}catch(n){document.getElementById("loading").innerHTML=`
        <div class="bg-rust/10 border border-rust/30 rounded-brand p-4 text-sm text-rust text-center">
          ❌ فشل التحميل: ${n.message}
        </div>
      `}}function d(){const n=document.getElementById("images-grid");let t=i;if(m==="unassigned"?t=i.filter(a=>!o[a]):m==="assigned"&&(t=i.filter(a=>!!o[a])),t.length===0){n.innerHTML=`
        <div class="col-span-full text-center py-12">
          <div class="text-5xl mb-3">🔍</div>
          <div class="text-sm font-heading font-bold text-navy mb-1">لا توجد صور في هذا الفلتر</div>
          <div class="text-xs text-navy/60">جرب فلتر آخر</div>
        </div>
      `;return}n.innerHTML=t.map(a=>{const s=o[a],e=s?p.find(r=>r.id===s.property_id):null;return`
        <div class="image-card bg-white rounded-brand border-2 ${s?"border-teal":"border-line"} overflow-hidden transition-all hover:shadow-md" data-filename="${a}">
          
          <!-- Image Preview -->
          <div class="aspect-video bg-cream/50 flex items-center justify-center overflow-hidden relative">
            <img
              src="/aqar-zain/images/properties/${a}"
              alt="${a}"
              loading="lazy"
              class="w-full h-full object-cover"
              onerror="this.parentElement.innerHTML='<div class=\\'text-4xl\\'>🖼️</div>'"
            />
            
            <!-- Assigned Badge -->
            ${s?`
              <div class="absolute top-2 right-2 bg-teal text-cream text-[10px] font-heading font-bold px-2 py-1 rounded-pill shadow-lg">
                ✓ ${e?`[${e.id}]`:"مُعيَّن"}
              </div>
            `:""}
          </div>

          <!-- Filename -->
          <div class="px-3 py-2 bg-cream/30 border-t border-line flex items-center justify-between">
            <span class="text-[10px] font-heading font-bold text-navy/60 truncate">${a}</span>
          </div>

          <!-- Details (في حالة التعيين) -->
          ${e?`
            <div class="px-3 py-2 bg-teal/5 border-t border-teal/20 space-y-1">
              <div class="text-[11px] font-heading font-bold text-teal line-clamp-1">
                ${v(e.category)} ${e.category||"عقار"}
              </div>
              <div class="text-[10px] text-navy/80 line-clamp-1">
                ${e.title.slice(0,50)}
              </div>
              <div class="flex items-center gap-2 text-[9px] text-navy/60">
                <span>📍 ${e.area||"غير محدد"}</span>
                ${e.area_sqm?`<span>· 📐 ${Math.round(parseFloat(e.area_sqm))}م²</span>`:""}
              </div>
              <div class="text-[10px] font-heading font-black text-teal">
                💰 ${f(e.price)}
              </div>
            </div>
          `:""}

          <!-- Property Selector -->
          <div class="p-3 space-y-2 border-t border-line">
            <select class="property-select w-full px-2 py-2 text-xs border border-line rounded-brand focus:border-teal outline-none bg-white font-body">
              <option value="">— اختر العقار —</option>
              ${p.map(r=>`
                <option value="${r.id}" ${s?.property_id===r.id?"selected":""}>
                  [${r.id}] ${r.title.slice(0,35)} ${r.category?`(${r.category})`:""}
                </option>
              `).join("")}
            </select>

            <div class="flex items-center justify-between">
              <label class="flex items-center gap-2 text-[11px] text-navy/70">
                <input
                  type="checkbox"
                  class="primary-checkbox w-4 h-4"
                  ${s?.is_primary?"checked":""}
                />
                <span>صورة رئيسية</span>
              </label>

              ${s?`
                <button
                  type="button"
                  class="clear-btn text-[10px] text-rust hover:text-rust/70 font-heading font-bold"
                  data-filename="${a}"
                >
                  ❌ إلغاء
                </button>
              `:""}
            </div>
          </div>
        </div>
      `}).join(""),document.querySelectorAll(".property-select").forEach(a=>{a.addEventListener("change",s=>{const r=s.target.closest(".image-card").dataset.filename,l=s.target.value;l?o[r]={property_id:parseInt(l),is_primary:o[r]?.is_primary||!1}:delete o[r],u(),d()})}),document.querySelectorAll(".primary-checkbox").forEach(a=>{a.addEventListener("change",s=>{const r=s.target.closest(".image-card").dataset.filename,l=s.target.checked;o[r]&&(o[r].is_primary=l)})}),document.querySelectorAll(".clear-btn").forEach(a=>{a.addEventListener("click",s=>{const e=s.target.dataset.filename;delete o[e],u(),d()})})}function u(){const n=Object.keys(o).length;document.getElementById("stat-pending").textContent=String(n)}document.querySelectorAll(".filter-btn").forEach(n=>{n.addEventListener("click",()=>{document.querySelectorAll(".filter-btn").forEach(t=>{t.classList.remove("bg-teal","text-cream"),t.classList.add("bg-cream","text-navy/70")}),n.classList.remove("bg-cream","text-navy/70"),n.classList.add("bg-teal","text-cream"),m=n.dataset.filter||"all",d()})});document.getElementById("save-all-btn")?.addEventListener("click",async()=>{const n=Object.entries(o).map(([a,s])=>({property_id:s.property_id,filename:a,is_primary:s.is_primary}));if(n.length===0){c("⚠️ لم تحدّد أي صورة","info");return}const t=document.getElementById("save-all-btn");t.disabled=!0,t.textContent=`⏳ جاري حفظ ${n.length} صورة...`;try{const s=await(await fetch(`${g}/api/media/link-bulk`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({links:n})})).json();if(s.success){const e=s.data.filter(r=>r.success).length;c(`✅ تم حفظ ${e} صورة`,"success"),setTimeout(()=>window.location.reload(),1500)}else throw new Error(s.error)}catch(a){c(`❌ ${a.message}`,"error"),t.disabled=!1,t.textContent="💾 حفظ الكل"}});function c(n,t="info"){const a=document.getElementById("toast-container"),s={success:"bg-teal",error:"bg-rust",info:"bg-navy"},e=document.createElement("div");e.className=`${s[t]} text-cream px-4 py-2.5 rounded-pill shadow-lg text-sm font-heading font-bold pointer-events-auto transition-all`,e.style.minWidth="220px",e.style.textAlign="center",e.textContent=n,e.style.opacity="0",e.style.transform="translateY(-10px)",a.appendChild(e),setTimeout(()=>{e.style.opacity="1",e.style.transform="translateY(0)"},50),setTimeout(()=>{e.style.opacity="0",e.style.transform="translateY(-10px)",setTimeout(()=>e.remove(),300)},3e3)}x();
