import"./hoisted.DfGtgCpL.js";const n="http://localhost:3000";async function p(){try{const a=document.getElementById("dashboard-loading"),e=document.getElementById("dashboard-content"),x=document.getElementById("dashboard-error"),[i,c,l]=await Promise.all([fetch(`${n}/api/properties/stats`),fetch(`${n}/api/areas`),fetch(`${n}/api/properties?limit=100`)]),g=await i.json(),m=await c.json(),h=await l.json(),s=g.data||{},y=m.data||[],o=h.data||[];document.getElementById("stat-total").textContent=s.total||o.length,document.getElementById("stat-sale").textContent=s.for_sale||0,document.getElementById("stat-rent").textContent=s.for_rent||0,document.getElementById("stat-areas").textContent=y.length;const r=o.slice(0,5),d=document.getElementById("recent-properties");r.length===0?d.innerHTML='<p class="text-xs text-gray-500 text-center py-4">لا توجد عقارات</p>':d.innerHTML=r.map(t=>`
          <a
            href="/aqar-zain/admin/properties/${t.id}/edit/"
            class="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition border border-gray-100"
          >
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white text-lg flex-shrink-0">
              ${t.category==="شقة"?"🏢":t.category==="محل"?"🏪":t.category==="منزل"?"🏠":"🏡"}
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-xs font-bold text-gray-800 line-clamp-1">${t.title||`عقار #${t.id}`}</div>
              <div class="text-[10px] text-gray-500">
                ${t.area_name||"غير محدد"} · ${t.listing_type||""} · ${t.price?`${(t.price/1e6).toFixed(2)} مليون`:"السعر عند الطلب"}
              </div>
            </div>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </a>
        `).join(""),a.classList.add("hidden"),e.classList.remove("hidden")}catch(a){const e=document.getElementById("dashboard-error");e.innerHTML=`❌ فشل التحميل: ${a.message}`,e.classList.remove("hidden"),document.getElementById("dashboard-loading").classList.add("hidden")}}p();
