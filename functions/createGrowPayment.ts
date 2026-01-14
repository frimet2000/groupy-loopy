import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

serve(async (req) => {
  // הגדרת כותרות CORS - קריטי כדי שהדפדפן לא יחסום את הבקשה מהאפליקציה
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  // טיפול בבקשת OPTIONS (Preflight) של הדפדפן
  if (req.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  try {
    // קבלת הנתונים מהצד של המשתמש (ה-Frontend)
    const { amount, description, travelerName, travelerPhone } = await req.json();

    // בדיקה בסיסית שהסכום תקין
    if (!amount || amount <= 0) {
      return new Response(JSON.stringify({ error: "Missing or invalid amount" }), { 
        status: 400, 
        headers 
      });
    }

    // הקריאה ל-API של משולם (Grow)
    // הערה: השתמשתי ב-Endpoint המעודכן שלהם ליצירת דף תשלום
    const growResponse = await fetch('https://api.meshulam.co.il/api/light/createPaymentPage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: "5c04d711acb29250", // ה-userId שסיפקת
        pageCode: "30f1b9975952",   // ה-pageCode שסיפקת
        sum: Math.round(amount),
        description: description || "הצטרפות לקבוצת טיול",
        paymentNum: 1, // מספר תשלומים מקסימלי
        
        // פרטי המטייל (אופציונלי - עוזר לך לעשות סדר במערכת של משולם)
        fullName: travelerName || "",
        phone: travelerPhone || "",
        
        // לאן המשתמש יחזור אחרי התשלום (מומלץ לשנות לכתובת האפליקציה שלך)
        successUrl: "https://your-app-domain.com/payment-success",
        cancelUrl: "https://your-app-domain.com/payment-cancel",
      })
    });

    const data = await growResponse.json();

    // בדיקה אם קיבלנו URL לתשלום
    if (data.status === 1 && data.data?.url) {
      console.log('Payment URL created successfully:', data.data.url);
      return new Response(JSON.stringify({ url: data.data.url }), { 
        status: 200, 
        headers 
      });
    } else {
      console.error('Grow API Error:', data);
      return new Response(JSON.stringify({ 
        error: data.err?.message || 'Failed to create payment page',
        details: data 
      }), { 
        status: 400, 
        headers 
      });
    }

  } catch (error) {
    console.error('Server Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers 
    });
  }
});