import"./hoisted.BhuKDzX2.js";const e=document.getElementById("contact-form"),n=document.getElementById("form-status");e?.addEventListener("submit",s=>{s.preventDefault();const t=new FormData(e),o=t.get("name"),m=t.get("phone"),a=t.get("email")||"غير محدد",c=t.get("subject"),d=t.get("message"),r=encodeURIComponent(`مرحباً،

📝 طلب جديد من موقع عقار زين:

الاسم: ${o}
الهاتف: ${m}
البريد: ${a}
الموضوع: ${c}

الرسالة:
${d}`);window.open(`https://wa.me/201281441854?text=${r}`,"_blank"),n.textContent="✅ سيتم تحويلك إلى واتساب لإتمام الإرسال",n.className="text-xs text-center text-green-600 font-medium block mt-2",e.reset(),setTimeout(()=>{n.className="text-xs text-center hidden"},5e3)});
