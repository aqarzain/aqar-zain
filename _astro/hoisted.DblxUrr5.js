import"./hoisted.DfGtgCpL.js";const u="http://localhost:3000";let d=[],a=null;async function g(){try{const e=new URL(window.location.href).searchParams.get("updated")||Date.now(),r=await(await fetch(`${u}/api/properties?limit=1000&_t=${e}`)).json();if(!r.success)throw new Error(r.error);d=r.data||[],document.getElementById("list-loading").classList.add("hidden"),l()}catch(e){document.getElementById("list-loading").innerHTML=`
        <div class="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          ❌ ${e.message}
        </div>
      `}}function l(){const e=document.getElementById("search-input").value.toLowerCase(),n=document.getElementById("filter-category").value,r=document.getElementById("filter-listing").value;let o=d.filter(t=>!(e&&!((t.title||"").toLowerCase().includes(e)||String(t.id).includes(e)||(t.area_name||"").toLowerCase().includes(e))||n&&t.category!==n||r&&t.listing_type!==r));document.getElementById("results-count").textContent=`عرض ${o.length} من ${d.length} عقار`;const s=document.getElementById("properties-list"),c=document.getElementById("empty-state");if(o.length===0){s.classList.add("hidden"),c.classList.remove("hidden");return}c.classList.add("hidden"),s.classList.remove("hidden"),s.innerHTML=o.map(t=>`
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:border-blue-200 transition">
        <div class="p-4 flex flex-col md:flex-row md:items-center gap-3">

          <!-- Icon -->
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white text-2xl flex-shrink-0">
            ${t.category==="شقة"?"🏢":t.category==="محل"?"🏪":t.category==="منزل"?"🏠":t.category==="فيلا"?"🏡":"🌍"}
          </div>

          <!-- Details -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-[10px] font-bold text-gray-400">[${t.id}]</span>
              <span class="text-[10px] px-2 py-0.5 rounded-full font-bold ${t.listing_type==="إيجار"?"bg-green-100 text-green-700":"bg-blue-100 text-blue-700"}">
                ${t.listing_type}
              </span>
              <span class="text-[10px] text-gray-500">${t.category}</span>
            </div>
            <h3 class="text-sm font-bold text-gray-800 line-clamp-1 mb-1">
              ${t.title||`عقار #${t.id}`}
            </h3>
            <div class="flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
              <span>📍 ${t.area_name||"غير محدد"}</span>
              ${t.area_sqm?`<span>📐 ${Math.round(parseFloat(t.area_sqm))}م²</span>`:""}
              <span class="font-bold text-blue-600">💰 ${y(t.price)}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-1.5 flex-shrink-0">
            <a
              href="/aqar-zain/properties/${t.id}/"
              target="_blank"
              class="w-9 h-9 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center transition"
              title="عرض في الموقع"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            </a>
            <a
              href="/aqar-zain/admin/properties/${t.id}/edit/"
              class="w-9 h-9 bg-amber-500 hover:bg-amber-600 text-white rounded-lg flex items-center justify-center transition shadow-sm"
              title="تعديل"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </a>
            <button
              type="button"
              class="delete-btn w-9 h-9 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition shadow-sm"
              data-id="${t.id}"
              data-title="${t.title||""}"
              title="حذف"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `).join(""),document.querySelectorAll(".delete-btn").forEach(t=>{t.addEventListener("click",i=>{const f=parseInt(i.currentTarget.dataset.id||"0"),h=i.currentTarget.dataset.title||"";x(f,h)})})}function y(e){const n=typeof e=="string"?parseFloat(e):e;return!n||isNaN(n)?"السعر عند الطلب":n>=1e6?`${(n/1e6).toFixed(2)} مليون`:n>=1e3?`${Math.round(n/1e3)} ألف`:`${n} جنيه`}function x(e,n){a=e,document.getElementById("delete-title").textContent=`"${n}"`;const r=document.getElementById("delete-modal");r.classList.remove("hidden"),r.classList.add("flex")}document.getElementById("cancel-delete")?.addEventListener("click",()=>{const e=document.getElementById("delete-modal");e.classList.add("hidden"),e.classList.remove("flex"),a=null});document.getElementById("delete-modal")?.addEventListener("click",e=>{if(e.target===e.currentTarget){const n=document.getElementById("delete-modal");n.classList.add("hidden"),n.classList.remove("flex"),a=null}});document.getElementById("confirm-delete")?.addEventListener("click",async()=>{if(!a)return;const e=document.getElementById("confirm-delete");e.textContent="⏳ جاري الحذف...",e.disabled=!0;try{const r=await(await fetch(`${u}/api/properties/${a}`,{method:"DELETE"})).json();if(r.success)m("✅ تم الحذف بنجاح","success"),document.getElementById("delete-modal").classList.add("hidden"),document.getElementById("delete-modal").classList.remove("flex"),setTimeout(()=>g(),500);else throw new Error(r.error||"فشل الحذف")}catch(n){m(`❌ ${n.message}`,"error")}finally{e.textContent="🗑️ نعم، احذف",e.disabled=!1,a=null}});document.getElementById("search-input")?.addEventListener("input",l);document.getElementById("filter-category")?.addEventListener("change",l);document.getElementById("filter-listing")?.addEventListener("change",l);function m(e,n="info"){const r=document.getElementById("toast-container");if(!r)return;const o={success:"bg-green-600",error:"bg-red-600",info:"bg-blue-600"},s=document.createElement("div");s.className=`${o[n]} text-white px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium pointer-events-auto transition-all`,s.style.minWidth="220px",s.style.textAlign="center",s.textContent=e,s.style.opacity="0",s.style.transform="translateY(-10px)",r.appendChild(s),setTimeout(()=>{s.style.opacity="1",s.style.transform="translateY(0)"},50),setTimeout(()=>{s.style.opacity="0",s.style.transform="translateY(-10px)",setTimeout(()=>s.remove(),300)},3e3)}g();
