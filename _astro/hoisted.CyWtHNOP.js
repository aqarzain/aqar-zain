import"./hoisted.B6xXjB6v.js";const _="http://localhost:3000",x=document.getElementById("estimate-form"),m=document.getElementById("estimate-btn"),s=document.getElementById("estimate-result"),h=document.getElementById("estimate-loading"),r=document.getElementById("estimate-error");function l(a){return a?a>=1e6?`${(a/1e6).toFixed(2)} مليون جنيه`:a>=1e3?`${a.toLocaleString("ar-EG")} جنيه`:`${a} جنيه`:"—"}x?.addEventListener("submit",async a=>{a.preventDefault(),s.classList.add("hidden"),r.classList.add("hidden"),h.classList.remove("hidden"),m.disabled=!0;const e=new FormData(x),n={category:e.get("category"),listing_type:e.get("listing_type"),area_id:parseInt(e.get("area_id")),area_sqm:parseFloat(e.get("area_sqm"))};e.get("bedrooms")&&(n.bedrooms=parseInt(e.get("bedrooms"))),e.get("bathrooms")&&(n.bathrooms=parseInt(e.get("bathrooms"))),e.get("floor_number")!==""&&(n.floor_number=parseInt(e.get("floor_number"))),e.get("finishing_type")&&(n.finishing_type=e.get("finishing_type"));try{const i=await(await fetch(`${_}/api/estimate/ai`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)})).json();if(!i.success)throw new Error(i.error||"فشل التقدير");const{estimate:t,market_stats:g,similar_count:w}=i.data,d=Math.round((t.confidence||0)*100),y=d>=75?"teal":d>=60?"sand":"rust",u=n.listing_type==="إيجار"?"/شهر":"",$=t.estimated_price||0,p=t.price_per_sqm||0,v=t.market_trend==="up",b=t.market_trend==="stable",f=t.market_trend==="down";s.innerHTML=`
        <div class="bg-gradient-to-br from-teal/5 via-white to-sand/5 border-2 border-teal/30 rounded-brand shadow-lg overflow-hidden">

          <!-- Header -->
          <div class="bg-gradient-to-l from-teal to-navy px-5 py-3 text-cream">
            <div class="flex items-center gap-2 text-sm font-heading font-bold">
              <span>🎯</span>
              <span>النتيجة</span>
            </div>
          </div>

          <!-- السعر الرئيسي -->
          <div class="p-6 text-center border-b border-line">
            <div class="text-xs text-navy/60 mb-2 font-heading font-bold">💰 السعر المُقدّر</div>
            <div class="text-3xl md:text-4xl font-heading font-black text-teal mb-2">
              ${l($)}${u}
            </div>
            ${t.min_price&&t.max_price?`
              <div class="text-xs text-navy/70">
                النطاق المتوقع: <span class="font-heading font-bold text-navy">${l(t.min_price)}</span> - <span class="font-heading font-bold text-navy">${l(t.max_price)}</span>
              </div>
            `:""}
          </div>

          <!-- الإحصائيات -->
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3 p-5 bg-cream/50">
            ${p?`
              <div class="text-center bg-white rounded-brand p-3 border border-line">
                <div class="text-[10px] text-navy/60 mb-1 font-heading font-bold">📐 سعر المتر</div>
                <div class="text-sm font-heading font-black text-navy">${p.toLocaleString("en-US")} ج</div>
              </div>
            `:""}
            <div class="text-center bg-white rounded-brand p-3 border border-line">
              <div class="text-[10px] text-navy/60 mb-1 font-heading font-bold">🎯 الثقة</div>
              <div class="text-sm font-heading font-black text-${y}">${d}%</div>
            </div>
            ${g?.count?`
              <div class="text-center bg-white rounded-brand p-3 border border-line">
                <div class="text-[10px] text-navy/60 mb-1 font-heading font-bold">📊 المقارنات</div>
                <div class="text-sm font-heading font-black text-navy">${g.count} عقار</div>
              </div>
            `:""}
          </div>

          <!-- اتجاه السوق -->
          <div class="px-5 py-3 bg-white border-t border-line">
            <div class="flex items-center gap-2 text-xs">
              <span class="font-heading font-bold text-navy/70">📈 اتجاه السوق:</span>
              ${v?'<span class="text-teal font-heading font-black">↗ صاعد</span>':""}
              ${b?'<span class="text-sand font-heading font-black">→ مستقر</span>':""}
              ${f?'<span class="text-rust font-heading font-black">↘ منخفض</span>':""}
              ${!v&&!b&&!f?'<span class="text-navy/50">— غير محدد</span>':""}
            </div>
          </div>

          <!-- التحليل -->
          ${t.reasoning?`
            <div class="p-5 bg-sand/10 border-t border-line">
              <div class="flex items-start gap-2 mb-2">
                <span class="text-lg">🤖</span>
                <div class="font-heading font-bold text-sm text-navy">تحليل AI:</div>
              </div>
              <p class="text-xs text-navy/80 leading-6">${t.reasoning}</p>
            </div>
          `:""}

          <!-- العوامل -->
          ${t.factors?.positive?.length||t.factors?.negative?.length?`
            <div class="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border-t border-line">
              ${t.factors?.positive?.length?`
                <div class="bg-teal/5 rounded-brand p-3 border border-teal/20">
                  <div class="text-xs font-heading font-bold text-teal mb-2">✅ عوامل رفعت السعر:</div>
                  <ul class="space-y-1">
                    ${t.factors.positive.map(o=>`<li class="text-[11px] text-navy/80 flex items-start gap-1"><span class="text-teal">•</span><span>${o}</span></li>`).join("")}
                  </ul>
                </div>
              `:""}
              ${t.factors?.negative?.length?`
                <div class="bg-rust/5 rounded-brand p-3 border border-rust/20">
                  <div class="text-xs font-heading font-bold text-rust mb-2">⚠️ عوامل خفضت السعر:</div>
                  <ul class="space-y-1">
                    ${t.factors.negative.map(o=>`<li class="text-[11px] text-navy/80 flex items-start gap-1"><span class="text-rust">•</span><span>${o}</span></li>`).join("")}
                  </ul>
                </div>
              `:""}
            </div>
          `:""}

          <!-- CTA -->
          <div class="p-5 bg-gradient-to-l from-teal to-navy text-cream text-center">
            <div class="text-xs mb-2 text-cream/90">هل تريد بيع أو تأجير عقارك؟</div>
            <div class="flex flex-wrap justify-center gap-2">
              <a href="https://wa.me/201281441854?text=مرحباً، أريد عرض عقاري للبيع" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 bg-cream text-navy px-4 py-2 rounded-pill font-heading font-bold text-xs hover:bg-white transition">
                💬 تواصل معنا
              </a>
              <a href="/aqar-zain/contact/" class="inline-flex items-center gap-1.5 bg-sand text-navy px-4 py-2 rounded-pill font-heading font-bold text-xs hover:bg-sand-dark transition">
                📞 اتصل بنا
              </a>
            </div>
          </div>

        </div>
      `,s.classList.remove("hidden"),setTimeout(()=>s.scrollIntoView({behavior:"smooth",block:"start"}),100)}catch(c){r.innerHTML=`❌ ${c.message}`,r.classList.remove("hidden")}finally{h.classList.add("hidden"),m.disabled=!1}});
