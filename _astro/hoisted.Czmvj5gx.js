import"./hoisted.B6xXjB6v.js";const l="http://localhost:3000";let p=[],b="all",y="";function S(t){const e=typeof t=="string"?parseFloat(t):t;return!e||isNaN(e)?"السعر عند الطلب":e>=1e6?`${(e/1e6).toFixed(2)} مليون`:e>=1e3?`${Math.round(e/1e3)} ألف`:`${e} جنيه`}function i(t){if(!t)return"";const e=document.createElement("div");return e.textContent=t,e.innerHTML}async function E(){try{const e=await(await fetch(`${l}/api/properties/admin/list`)).json();if(!e.success)throw new Error(e.error);p=e.data||[];const n=p.length,a=p.filter(c=>c.needs_description).length,s=n-a,m=n>0?Math.round(s/n*100):0;document.getElementById("stat-total").textContent=String(n),document.getElementById("stat-needs").textContent=String(a),document.getElementById("stat-has").textContent=String(s),document.getElementById("stat-coverage").textContent=`${m}%`,v()}catch(t){document.getElementById("properties-list").innerHTML=`
        <div class="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          ❌ خطأ في التحميل: ${i(t.message)}
        </div>
      `}}function v(){let t=p;if(b==="needs"?t=t.filter(e=>e.needs_description):b==="has"&&(t=t.filter(e=>!e.needs_description)),y){const e=y.toLowerCase();t=t.filter(n=>(n.title||"").toLowerCase().includes(e)||(n.area_name||"").toLowerCase().includes(e)||String(n.id).includes(e))}if(t.length===0){document.getElementById("properties-list").innerHTML=`
        <div class="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <div class="text-3xl mb-2">🔍</div>
          <div class="text-sm text-gray-500">لا توجد نتائج</div>
        </div>
      `;return}document.getElementById("properties-list").innerHTML=t.map(e=>`
      <div class="property-card bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" data-id="${e.id}">

        <!-- Header -->
        <div class="p-4 flex items-start gap-3 border-b border-gray-100">
          <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
            ${e.category==="شقة"?"🏢":e.category==="محل"?"🏪":e.category==="منزل"?"🏠":"🏡"}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-[10px] font-bold text-gray-400">[${e.id}]</span>
              <span class="text-[10px] px-2 py-0.5 rounded-full font-bold ${e.listing_type==="إيجار"?"bg-green-100 text-green-700":"bg-sand/20 text-teal-dark"}">
                ${e.listing_type}
              </span>
              <span class="text-[10px] font-bold ${e.needs_description?"text-navy":"text-teal"}">
                ${e.needs_description?"⚠️ يحتاج وصف":"✅ له وصف"}
              </span>
            </div>
            <h3 class="text-sm font-bold text-gray-800 line-clamp-1 mb-1">${i(e.title||"")}</h3>
            <div class="flex items-center gap-2 text-[11px] text-gray-500">
              <span>📍 ${i(e.area_name||"غير محدد")}</span>
              ${e.area_sqm?`<span>· 📐 ${Math.round(parseFloat(e.area_sqm))}م²</span>`:""}
              <span>· 💰 ${S(e.price)}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="p-4 bg-gray-50 flex flex-wrap gap-2">
          <button
            type="button"
            class="generate-btn flex-1 md:flex-none px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-lg shadow transition flex items-center justify-center gap-1.5"
            data-id="${e.id}"
          >
            <span>✍️</span>
            <span>توليد وصف</span>
          </button>

          ${e.needs_description?"":`
            <button
              type="button"
              class="improve-btn flex-1 md:flex-none px-4 py-2 bg-white border border-sand/40 hover:bg-sand/20 text-navy text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5"
              data-id="${e.id}"
            >
              <span>✨</span>
              <span>تحسين الوصف</span>
            </button>
          `}

          <button
            type="button"
            class="view-btn px-4 py-2 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-lg transition"
            data-id="${e.id}"
          >
            👁 عرض
          </button>
        </div>

        <!-- Result (مخفي) -->
        <div class="result hidden p-4 border-t border-gray-100 bg-sand/20"></div>

      </div>
    `).join(""),document.querySelectorAll(".generate-btn").forEach(e=>{e.addEventListener("click",()=>f(e.dataset.id,"generate"))}),document.querySelectorAll(".improve-btn").forEach(e=>{e.addEventListener("click",()=>f(e.dataset.id,"improve"))}),document.querySelectorAll(".view-btn").forEach(e=>{e.addEventListener("click",()=>{const n=e.dataset.id;window.open(`/aqar-zain/properties/${n}/`,"_blank")})})}async function f(t,e){const n=document.querySelector(`.property-card[data-id="${t}"]`);if(!n)return;const a=n.querySelector(".result");a.classList.remove("hidden"),a.innerHTML=`
      <div class="flex items-center gap-2 text-navy">
        <div class="inline-block w-4 h-4 border-2 border-sand/40 border-t-purple-600 rounded-full animate-spin"></div>
        <span class="text-xs font-medium">🤖 جاري ${e==="generate"?"التوليد":"التحسين"}...</span>
      </div>
    `;try{const s=e==="generate"?`${l}/api/properties/${t}/generate-description`:`${l}/api/properties/${t}/improve-description`,c=await(await fetch(s,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({save:!1})})).json();if(!c.success)throw new Error(c.error);const u=c.data.new_description||"";a.innerHTML=`
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-green-700 text-xs font-bold">
              <span>✅</span>
              <span>تم ${e==="generate"?"التوليد":"التحسين"} بنجاح</span>
            </div>
            <span class="text-[10px] text-gray-400">${u.length} حرف</span>
          </div>

          <div class="bg-white rounded-lg p-3 border border-sand/40">
            <p class="text-xs text-gray-800 leading-6" id="desc-${t}">${i(u)}</p>
          </div>

          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              class="copy-btn px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-[11px] font-bold rounded-lg transition"
              data-target="desc-${t}"
            >
              📋 نسخ
            </button>
            <button
              type="button"
              class="save-btn px-3 py-1.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-[11px] font-bold rounded-lg shadow transition"
              data-id="${t}"
              data-desc="${i(u)}"
              data-mode="${e}"
            >
              💾 حفظ في قاعدة البيانات
            </button>
            <button
              type="button"
              class="retry-btn px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-[11px] font-bold rounded-lg transition"
              data-id="${t}"
              data-mode="${e}"
            >
              🔄 إعادة
            </button>
          </div>
        </div>
      `,a.querySelector(".copy-btn")?.addEventListener("click",o=>{const r=o.currentTarget.dataset.target,d=document.getElementById(r);if(d){navigator.clipboard.writeText(d.textContent||"");const g=o.currentTarget,x=g.textContent;g.textContent="✅ تم النسخ",setTimeout(()=>{g.textContent=x},1500)}}),a.querySelector(".save-btn")?.addEventListener("click",async o=>{const r=o.currentTarget,d=r.dataset.id,g=r.dataset.desc,x=r.dataset.mode||"generate";r.textContent="⏳ جاري الحفظ...",r.setAttribute("disabled","true");try{const h=x==="generate"?`${l}/api/properties/${d}/generate-description`:`${l}/api/properties/${d}/improve-description`,$=await(await fetch(h,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({save:!0})})).json();if($.success){r.textContent="✅ تم الحفظ",r.classList.add("opacity-60");const w=p.find(L=>String(L.id)===d);w&&(w.needs_description=!1),setTimeout(()=>E(),1500)}else throw new Error($.error)}catch{r.textContent="❌ فشل",setTimeout(()=>{r.textContent="💾 حفظ",r.removeAttribute("disabled")},2e3)}}),a.querySelector(".retry-btn")?.addEventListener("click",o=>{const r=o.currentTarget;f(r.dataset.id,r.dataset.mode||"generate")})}catch(s){a.innerHTML=`
        <div class="text-red-600 text-xs font-medium bg-red-50 border border-red-200 rounded-lg p-3">
          ❌ ${i(s.message)}
        </div>
      `}}document.querySelectorAll(".filter-btn").forEach(t=>{t.addEventListener("click",()=>{document.querySelectorAll(".filter-btn").forEach(e=>{e.classList.remove("bg-teal","text-white"),e.classList.add("bg-gray-100","text-gray-700")}),t.classList.remove("bg-gray-100","text-gray-700"),t.classList.add("bg-teal","text-white"),b=t.dataset.filter||"all",v()})});document.getElementById("search")?.addEventListener("input",t=>{y=t.target.value,v()});E();
