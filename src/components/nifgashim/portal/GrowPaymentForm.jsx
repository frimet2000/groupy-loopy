// @ts-nocheck
import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function GrowPaymentForm({ authCode, language }) {
  useEffect(() => {
    if (!authCode) return;

    // Load Grow SDK
    const script = document.createElement('script');
    script.src = 'https://cdn.meshulam.co.il/sdk/gs.min.js';
    script.async = true;
    script.onload = () => {
      configureGrowSdk();
    };
    document.body.appendChild(script);

    const configureGrowSdk = () => {
      if (!window.growPayment) return;

      const config = {
        environment: 'DEV',
        version: 1,
        events: {
          onSuccess: (response) => {
            console.log('Payment success:', response);
            window.location.href = `${window.location.origin}${window.location.pathname}?payment_success=true`;
          },
          onFailure: (response) => {
            console.error('Payment failure:', response);
            alert(language === 'he' ? 'התשלום נכשל, אנא נסה שוב' : 'Payment failed, please try again');
          },
          onError: (response) => {
            console.error('Payment error:', response);
            alert(language === 'he' ? 'שגיאה בתהליך התשלום' : 'Payment error');
          }
        }
      };

      window.growPayment.init(config);
      window.growPayment.renderPaymentOptions(authCode);
    };

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, [authCode, language]);

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <p className="text-blue-700 font-medium">
            {language === 'he' ? 'טוען דף התשלום...' : 'Loading payment form...'}
          </p>
        </div>
      </div>
      <div id="grow-payment-container" className="w-full min-h-[400px]" />
    </div>
  );
}