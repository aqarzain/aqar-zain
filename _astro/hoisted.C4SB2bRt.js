import"./hoisted.DfGtgCpL.js";const d=document.querySelector(".smart-search-container");if(!d)throw new Error("No container");const p=d.dataset.api||"http://localhost:3000",i=document.getElementById("smart-search-input"),n=document.getElementById("smart-search-btn"),a=document.getElementById("smart-search-status"),o=document.getElementById("smart-search-results");document.querySelectorAll(".smart-search-example").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.query||"";i.value=t,i.focus()})});function m(e){if(!e)return"السعر عند الطلب";const t=typeof e=="string"?parseFloat(e):e;return isNaN(t)?"السعر عند الطلب":t>=1e6?`${(t/1e6).toFixed(2)} مليون`:t>=1e3?`${Math.round(t/1e3)} ألف`:`${t} جنيه`}function x(e){return{شقة:"🏢",محل:"🏪",فيلا:"🏡",منزل:"🏠",أرض:"🌍",مكتب:"💼",مستودع:"📦"}[e||""]||"🏢"}function f(e){const t=[];return e.category&&t.push(`النوع: ${e.category}`),e.listing_type&&t.push(`العرض: ${e.listing_type}`),e.area_name&&t.push(`المنطقة: ${e.area_name}`),e.bedrooms&&t.push(`${e.bedrooms} غرف`),e.max_price&&t.push(`بحد أقصى ${(e.max_price/1e6).toFixed(1)} مليون`),e.min_price&&t.push(`بحد أدنى ${(e.min_price/1e6).toFixed(1)} مليون`),t.map(s=>`<span class="text-[11px] px-2.5 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 rounded-full border border-blue-200 font-medium">${s}</span>`).join("")}async function c(){const e=i.value.trim();if(!e||e.length<3){alert("الرجاء إدخال نص بحث (3 أحرف على الأقل)");return}a.classList.remove("hidden"),a.innerHTML=`
      <div class="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <svg class="w-5 h-5 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-sm text-blue-700 font-medium">🤖 جاري البحث بالذكاء الاصطناعي...</span>
      </div>
    `,o.classList.add("hidden"),n.disabled=!0,n.style.opacity="0.6";try{const s=await(await fetch(`${p}/api/smart-search`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:e})})).json();if(!s.success){a.innerHTML=`<div class="text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-sm">❌ ${s.error||"حدث خطأ"}</div>`;return}const{entities:u,results:b,count:l}=s.data;a.innerHTML=`
        <div class="bg-gradient-to-l from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-base">🤖</span>
            <span class="text-xs font-bold text-blue-900">فهمت من طلبك:</span>
          </div>
          <div class="flex flex-wrap gap-1.5">${f(u)}</div>
        </div>
      `,l===0?o.innerHTML=`
          <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
            <div class="text-3xl mb-2">🔍</div>
            <div class="text-sm font-bold text-yellow-900 mb-1">لا توجد نتائج مطابقة</div>
            <div class="text-xs text-yellow-800 mb-3">جرب تقليل الفلاتر أو البحث بكلمات أخرى</div>
            <a href="/aqar-zain/properties/" class="inline-block text-xs px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold">
              تصفح كل العقارات →
            </a>
          </div>
        `:o.innerHTML=`
          <div class="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
            <div class="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
              <div class="flex items-center gap-2">
                <span class="text-sm">✅</span>
                <span class="text-sm font-bold text-gray-800">وجدت <span class="text-blue-600">${l}</span> عقار</span>
              </div>
              ${l>6?'<a href="/aqar-zain/properties/" class="text-xs text-blue-600 hover:text-blue-700 font-bold">عرض الكل ←</a>':""}
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[500px] overflow-y-auto">
              ${b.slice(0,6).map(r=>`
                <a href="/aqar-zain/properties/${r.id}/" class="group flex items-start gap-3 bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-300 rounded-lg p-3 transition shadow-sm">
                  <div class="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-2xl">
                    ${x(r.category)}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-xs font-bold text-gray-800 group-hover:text-blue-700 mb-1 line-clamp-1">${r.title||"عقار "+r.id}</div>
                    <div class="flex items-center gap-1 text-[10px] text-gray-500 mb-1.5">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      </svg>
                      <span class="line-clamp-1">${r.area_name||""}${r.city?" - "+r.city:""}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-extrabold text-blue-600">${m(r.price)}</span>
                      ${r.area_sqm?`<span class="text-[10px] text-gray-400 bg-white px-1.5 py-0.5 rounded">${r.area_sqm}م²</span>`:""}
                    </div>
                  </div>
                </a>
              `).join("")}
            </div>
          </div>
        `,o.classList.remove("hidden")}catch(t){a.innerHTML=`<div class="text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-sm">❌ خطأ في الاتصال: ${t.message}</div>`}finally{n.disabled=!1,n.style.opacity="1"}}n.addEventListener("click",c);i.addEventListener("keydown",e=>{e.key==="Enter"&&(e.preventDefault(),c())});
