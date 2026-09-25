import"./hoisted.DfGtgCpL.js";const f="http://localhost:3000",p=document.getElementById("estimate-form"),x=document.getElementById("estimate-btn"),n=document.getElementById("estimate-result"),m=document.getElementById("estimate-loading"),l=document.getElementById("estimate-error");function g(s){return s?s>=1e6?`${(s/1e6).toFixed(2)} مليون جنيه`:s>=1e3?`${s.toLocaleString("ar-EG")} جنيه`:`${s} جنيه`:"—"}p?.addEventListener("submit",async s=>{s.preventDefault(),n.classList.add("hidden"),l.classList.add("hidden"),m.classList.remove("hidden"),x.disabled=!0;const t=new FormData(p),r={category:t.get("category"),listing_type:t.get("listing_type"),area_id:parseInt(t.get("area_id")),area_sqm:parseFloat(t.get("area_sqm"))};t.get("bedrooms")&&(r.bedrooms=parseInt(t.get("bedrooms"))),t.get("bathrooms")&&(r.bathrooms=parseInt(t.get("bathrooms"))),t.get("floor_number")!==""&&(r.floor_number=parseInt(t.get("floor_number"))),t.get("finishing_type")&&(r.finishing_type=t.get("finishing_type"));try{const o=await(await fetch(`${f}/api/estimate/ai`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)})).json();if(!o.success)throw new Error(o.error||"فشل التقدير");const{estimate:e,market_stats:b,similar_count:u,area_info:y}=o.data,i=Math.round((e.confidence||0)*100),a=i>=75?"green":i>=60?"yellow":"orange",h=a==="green"?"bg-green-50 border-green-200":a==="yellow"?"bg-yellow-50 border-yellow-200":"bg-orange-50 border-orange-200",_=a==="green"?"text-green-700":a==="yellow"?"text-yellow-700":"text-orange-700",v=r.listing_type==="إيجار"?"/شهر":"";n.innerHTML=`
        <div class="bg-gradient-to-br from-blue-50 via-white to-blue-50 border-2 border-blue-200 rounded-2xl shadow-lg overflow-hidden">

          <!-- Header -->
          <div class="bg-gradient-to-l from-blue-600 to-blue-700 px-5 py-3 text-white">
            <div class="flex items-center gap-2 text-sm font-bold">
              <span>🎯</span>
              <span>النتيجة</span>
            </div>
          </div>

          <!-- السعر الرئيسي -->
          <div class="p-6 text-center border-b border-gray-100">
            <div class="text-xs text-gray-500 mb-2">💰 السعر المُقدّر</div>
            <div class="text-3xl md:text-4xl font-extrabold text-blue-700 mb-2">
              ${g(e.estimated_price||0)}${v}
            </div>
            ${e.min_price&&e.max_price?`
              <div class="text-xs text-gray-600">
                النطاق المتوقع: <span class="font-bold text-gray-800">${g(e.min_price)}</span> - <span class="font-bold text-gray-800">${g(e.max_price)}</span>
              </div>
            `:""}
          </div>

          <!-- الإحصائيات -->
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3 p-5 bg-gray-50">
            ${e.price_per_sqm?`
              <div class="text-center bg-white rounded-lg p-3 border border-gray-100">
                <div class="text-xs text-gray-500 mb-1">📐 سعر المتر</div>
                <div class="text-sm font-bold text-gray-800">${(e.price_per_sqm||0).toLocaleString("ar-EG")} ج</div>
              </div>
            `:""}
            <div class="text-center bg-white rounded-lg p-3 border border-gray-100">
              <div class="text-xs text-gray-500 mb-1">🎯 الثقة</div>
              <div class="text-sm font-bold text-gray-800">${i}%</div>
            </div>
            ${b?.count?`
              <div class="text-center bg-white rounded-lg p-3 border border-gray-100">
                <div class="text-xs text-gray-500 mb-1">📊 المقارنات</div>
                <div class="text-sm font-bold text-gray-800">${b?.count||0} عقار</div>
              </div>
            `:""}
          </div>

          <!-- الشريط |
          <div class="px-5 py-3 bg-white border-t border-gray-100">
            <div class="flex items-center gap-2 text-xs">
              <span class="font-bold text-gray-600">📈 اتجاه السوق:</span>
              ${e.market_trend==="up"?'<span class="text-green-600 font-bold">↗ صاعد</span>':""}
              ${e.market_trend==="stable"?'<span class="text-blue-600 font-bold">→ مستقر</span>':""}
              ${e.market_trend==="down"?'<span class="text-red-600 font-bold">↘ منخفض</span>':""}
            </div>
          </div>

          <!-- التحليل -->
          ${e.reasoning?`
            <div class="p-5 bg-blue-50 border-t border-blue-100">
              <div class="flex items-start gap-2 mb-2">
                <span class="text-lg">🤖</span>
                <div class="font-bold text-sm text-blue-900">تحليل AI:</div>
              </div>
              <p class="text-xs text-blue-800 leading-6">${e.reasoning}</p>
            </div>
          `:""}

          <!-- العوامل -->
          ${e.factors?.positive?.length||e.factors?.negative?.length?`
            <div class="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border-t border-gray-100">
              ${e.factors?.positive?.length?`
                <div class="bg-green-50 rounded-lg p-3 border border-green-100">
                  <div class="text-xs font-bold text-green-800 mb-2">✅ عوامل رفعت السعر:</div>
                  <ul class="space-y-1">
                    ${e.factors.positive.map(d=>`<li class="text-[11px] text-green-700 flex items-start gap-1"><span>•</span><span>${d}</span></li>`).join("")}
                  </ul>
                </div>
              `:""}
              ${e.factors?.negative?.length?`
                <div class="bg-orange-50 rounded-lg p-3 border border-orange-100">
                  <div class="text-xs font-bold text-orange-800 mb-2">⚠️ عوامل خفضت السعر:</div>
                  <ul class="space-y-1">
                    ${e.factors.negative.map(d=>`<li class="text-[11px] text-orange-700 flex items-start gap-1"><span>•</span><span>${d}</span></li>`).join("")}
                  </ul>
                </div>
              `:""}
            </div>
          `:""}

          <!-- CTA -->
          <div class="p-5 bg-gradient-to-l from-blue-600 to-blue-700 text-white text-center">
            <div class="text-xs mb-2 opacity-90">هل تريد بيع أو تأجير عقارك؟</div>
            <div class="flex flex-wrap justify-center gap-2">
              <a href="https://wa.me/201281441854?text=مرحباً، أريد عرض عقاري للبيع" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 bg-white text-green-700 px-4 py-2 rounded-lg font-bold text-xs hover:bg-green-50 transition">
                💬 تواصل معنا
              </a>
              <a href="/aqar-zain/contact/" class="inline-flex items-center gap-1.5 bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-blue-800 transition border border-blue-500">
                📞 اتصل بنا
              </a>
            </div>
          </div>

        </div>
      `,n.classList.remove("hidden"),setTimeout(()=>{n.scrollIntoView({behavior:"smooth",block:"start"})},100)}catch(c){l.innerHTML=`❌ ${c.message}`,l.classList.remove("hidden")}finally{m.classList.add("hidden"),x.disabled=!1}});
