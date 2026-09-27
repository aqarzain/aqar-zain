import"./hoisted.B6xXjB6v.js";const l=document.querySelector(".smart-search-container");if(!l)throw new Error("No container");const m=l.dataset.api||"http://localhost:3000",i=document.getElementById("smart-search-input"),n=document.getElementById("smart-search-btn"),r=document.getElementById("smart-search-status"),o=document.getElementById("smart-search-results");document.querySelectorAll(".smart-search-example").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.query||"";i.value=t,i.focus()})});function u(e){if(!e)return"السعر عند الطلب";const t=typeof e=="string"?parseFloat(e):e;return isNaN(t)?"السعر عند الطلب":t>=1e6?`${(t/1e6).toFixed(2)} مليون`:t>=1e3?`${Math.round(t/1e3)} ألف`:`${t} جنيه`}function b(e){return{شقة:"🏢",محل:"🏪",فيلا:"🏡",منزل:"🏠",أرض:"🌍",مكتب:"💼",مستودع:"📦"}[e||""]||"🏢"}function f(e){const t=[];return e.category&&t.push(`النوع: ${e.category}`),e.listing_type&&t.push(`العرض: ${e.listing_type}`),e.area_name&&t.push(`المنطقة: ${e.area_name}`),e.bedrooms&&t.push(`${e.bedrooms} غرف`),e.max_price&&t.push(`بحد أقصى ${(e.max_price/1e6).toFixed(1)} مليون`),e.min_price&&t.push(`بحد أدنى ${(e.min_price/1e6).toFixed(1)} مليون`),t.map(s=>`<span class="text-[11px] px-2.5 py-1 bg-teal/10 text-teal rounded-pill border border-teal/20 font-heading font-bold">${s}</span>`).join("")}async function c(){const e=i.value.trim();if(!e||e.length<3){alert("الرجاء إدخال نص بحث (3 أحرف على الأقل)");return}r.classList.remove("hidden"),r.innerHTML=`
      <div class="flex items-center gap-2 bg-teal/5 border border-teal/20 rounded-brand p-3">
        <svg class="w-5 h-5 text-teal animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-sm text-teal font-heading font-bold">جاري البحث بالذكاء الاصطناعي...</span>
      </div>
    `,o.classList.add("hidden"),n.disabled=!0,n.style.opacity="0.6";try{const s=await(await fetch(`${m}/api/smart-search`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:e})})).json();if(!s.success){r.innerHTML=`<div class="text-rust bg-rust/5 border border-rust/20 rounded-brand p-3 text-sm">${s.error||"حدث خطأ"}</div>`;return}const{entities:p,results:x,count:d}=s.data;r.innerHTML=`
        <div class="bg-teal/5 border border-teal/20 rounded-brand p-3">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-base">🤖</span>
            <span class="text-xs font-heading font-bold text-navy">فهمت من طلبك:</span>
          </div>
          <div class="flex flex-wrap gap-1.5">${f(p)}</div>
        </div>
      `,d===0?o.innerHTML=`
          <div class="bg-sand/20 border border-sand/40 rounded-brand p-4 text-center">
            <div class="text-3xl mb-2">🔍</div>
            <div class="text-sm font-heading font-bold text-navy mb-1">لا توجد نتائج مطابقة</div>
            <div class="text-xs text-navy/70 mb-3">جرب تقليل الفلاتر أو البحث بكلمات أخرى</div>
            <a href="/aqar-zain/properties/" class="inline-block text-xs px-4 py-2 bg-teal text-white rounded-pill hover:bg-teal-dark transition font-heading font-bold">
              تصفح كل العقارات
            </a>
          </div>
        `:o.innerHTML=`
          <div class="bg-white border border-line rounded-brand p-3 shadow-sm">
            <div class="flex items-center justify-between mb-3 pb-3 border-b border-line">
              <div class="flex items-center gap-2">
                <span class="text-sm">✅</span>
                <span class="text-sm font-heading font-bold text-navy">وجدت <span class="text-teal">${d}</span> عقار</span>
              </div>
              ${d>6?'<a href="/aqar-zain/properties/" class="text-xs text-teal hover:text-teal-dark font-heading font-bold">عرض الكل ←</a>':""}
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[500px] overflow-y-auto">
              ${x.slice(0,6).map(a=>`
                <a href="/aqar-zain/properties/${a.id}/" class="group flex items-start gap-3 bg-cream/50 hover:bg-teal/5 border border-line hover:border-teal rounded-brand p-3 transition">
                  <div class="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-teal to-navy rounded-brand flex items-center justify-center text-2xl">
                    ${b(a.category)}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-xs font-heading font-bold text-navy group-hover:text-teal mb-1 line-clamp-1">${a.title||"عقار "+a.id}</div>
                    <div class="flex items-center gap-1 text-[10px] text-navy/60 mb-1.5">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      </svg>
                      <span class="line-clamp-1">${a.area_name||""}${a.city?" - "+a.city:""}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-heading font-black text-navy">${u(a.price)}</span>
                      ${a.area_sqm?`<span class="text-[10px] text-navy/50 bg-white px-1.5 py-0.5 rounded">${a.area_sqm}م²</span>`:""}
                    </div>
                  </div>
                </a>
              `).join("")}
            </div>
          </div>
        `,o.classList.remove("hidden")}catch(t){r.innerHTML=`<div class="text-rust bg-rust/5 border border-rust/20 rounded-brand p-3 text-sm">خطأ في الاتصال: ${t.message}</div>`}finally{n.disabled=!1,n.style.opacity="1"}}n.addEventListener("click",c);i.addEventListener("keydown",e=>{e.key==="Enter"&&(e.preventDefault(),c())});
