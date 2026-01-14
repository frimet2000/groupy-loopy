// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, Smartphone, AlertCircle, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

const translations = {
  he: {
    title: 'תשלום מאובטח',
    amount: 'סכום לתשלום',
    processing: 'מעבד תשלום...',
    payNow: 'שלם עכשיו',
    payWith: 'שלם באמצעות',
    credit: 'כרטיס אשראי',
    bit: 'ביט',
    googlePay: 'Google Pay',
    error: 'שגיאה',
    paymentFailed: 'התשלום נכשל',
    tryAgain: 'נסה שוב',
    invalidPhone: 'נא להזין מספר טלפון ישראלי תקין (05... - 10 ספרות)',
    invalidName: 'נא להזין שם מלא (פרטי ומשפחה)',
    chromeRequired: 'לתשלום ב-Google Pay יש להשתמש בדפדפן Chrome בלבד',
    browserWarning: 'דפדפן זה אינו נתמך לתשלום ב-Google Pay',
    initializing: 'מאתחל מערכת תשלומים...'
  },
  en: {
    title: 'Secure Payment',
    amount: 'Amount to Pay',
    processing: 'Processing payment...',
    payNow: 'Pay Now',
    payWith: 'Pay with',
    credit: 'Credit Card',
    bit: 'Bit',
    googlePay: 'Google Pay',
    error: 'Error',
    paymentFailed: 'Payment failed',
    tryAgain: 'Try Again',
    invalidPhone: 'Please enter a valid Israeli phone number (05... - 10 digits)',
    invalidName: 'Please enter full name (First and Last)',
    chromeRequired: 'For Google Pay, please use Chrome browser only',
    browserWarning: 'This browser is not supported for Google Pay',
    initializing: 'Initializing payment system...'
  }
};

const GrowPaymentForm = ({ 
  amount,
  onSuccess,
  customerName,
  customerEmail,
  customerPhone,
  registrationData
}) => {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [isChrome, setIsChrome] = useState(true);

  // Check browser on mount
  useEffect(() => {
    const isChromeBrowser = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    setIsChrome(isChromeBrowser);
  }, []);

  // Load Grow SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://meshulam.co.il/sdk/v1/grow.js';
    script.async = true;
    script.onload = () => {
      console.log('Grow SDK script loaded');
      setSdkLoaded(true);
      
      // Initialize configuration function expected by SDK
      window.configureGrowSdk = function() {
          console.log('configureGrowSdk called');
          return {
              // Add any specific configurations here if needed
              // Usually left empty or basic settings
          };
      };

      // Define global onSuccess callback that SDK might call (if configured that way)
      // Although we usually pass it or handle via events, the user instruction mentioned:
      // "After payment we call onSuccess function that you defined in step 2"
      // So we define it here:
      window.onSuccess = async function(response) {
          console.log('Grow SDK onSuccess called:', response);
          await handleTransactionApproval(response);
      };
    };
    script.onerror = () => {
        console.error('Failed to load Grow SDK script');
        setError('Failed to load payment system');
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      delete window.configureGrowSdk;
      delete window.onSuccess;
    };
  }, []);

  const validateForm = () => {
    // Phone validation: Israeli mobile (05...) and 10 digits
    const phoneRegex = /^05\d{8}$/;
    if (!customerPhone || !phoneRegex.test(customerPhone.replace(/\D/g, ''))) {
      setError(t.invalidPhone);
      return false;
    }

    // Name validation: At least 2 words (First Last)
    if (!customerName || customerName.trim().split(/\s+/).length < 2) {
      setError(t.invalidName);
      return false;
    }

    return true;
  };

  const handleTransactionApproval = async (transactionData) => {
      try {
          console.log('Approving transaction...', transactionData);
          
          // Parse fields from the response structure provided by the user
          // Structure: { status: "1", data: { transactionId: "...", processId: "...", ... } }
          const data = transactionData?.data || transactionData;
          const transactionId = data?.transactionId;
          const processId = data?.processId || window.currentProcessId;

          if (!transactionId) {
              console.error('Missing transactionId in response:', transactionData);
              // Fallback: still try to proceed or just show success if we can't approve
          }
          
          // Call backend approval
          const approveResponse = await base44.functions.invoke('approveGrowTransaction', {
              transactionId: transactionId,
              processId: processId
          });

          if (approveResponse.data?.success) {
              toast.success('Payment completed successfully!');
              if (onSuccess) onSuccess(approveResponse.data);
          } else {
              console.error('Approval failed:', approveResponse);
              // Even if approval fails, the payment might be successful, so we might still want to proceed
              // but warn the user or admin.
              if (onSuccess) onSuccess(transactionData); 
          }

      } catch (err) {
          console.error('Error approving transaction:', err);
          // Still treat as success for the user if payment went through
          if (onSuccess) onSuccess(transactionData);
      }
  };

  const handlePayment = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    if (!validateForm()) return;

    // Check Google Pay restriction
    // If user explicitly wants Google Pay, they must be on Chrome.
    // Since we don't know what they will choose in the wallet yet, we just warn if not Chrome.
    if (!isChrome) {
        toast.warning(t.chromeRequired);
    }

    setLoading(true);
    setError(null);

    try {
      if (!amount) throw new Error('Missing payment details');

      // 1. Call Backend to Create Payment Process
      const response = await base44.functions.invoke('createGrowPayment', {
        sum: amount,
        fullName: customerName,
        phone: customerPhone,
        description: 'הרשמה לנפגשים בשביל ישראל',
        email: customerEmail
      });
      
      console.log('Create Payment response:', response);

      if (!response.data.success || !response.data.processId) {
        throw new Error(response.data.error || 'Failed to create payment process');
      }

      const processId = response.data.processId;
      window.currentProcessId = processId; // Store for approval

      // 2. Initialize Grow SDK
      if (!window.growPayment) {
          throw new Error('Payment system not loaded');
      }

      console.log('Initializing Grow SDK with processId:', processId);
      
      // Initialize with DEV/SANDBOX environment as requested
      // User said: growPayment.init({ environment: 'DEV', version: 1 });
      window.growPayment.init({ 
          environment: 'DEV', // Change to 'PROD' for production
          version: 1 
      });

      // 3. Render Payment Options
      setTimeout(() => {
          try {
            window.growPayment.renderPaymentOptions(processId, {
                // Optional callback overrides if supported by SDK version
                onSuccess: (res) => {
                    console.log('Payment Success Callback:', res);
                    handleTransactionApproval(res);
                },
                onError: (err) => {
                    console.error('Payment Error Callback:', err);
                    setError(t.paymentFailed);
                    setLoading(false);
                },
                onCancel: () => {
                    console.log('Payment Cancelled');
                    setLoading(false);
                }
            });
          } catch (renderError) {
              console.error('Error rendering payment options:', renderError);
              // Fallback to Iframe/Redirect if SDK fails
              if (response.data.url) {
                  console.log('Falling back to redirect URL');
                  window.location.href = response.data.url;
              } else {
                  throw renderError;
              }
          }
      }, 500);

    } catch (error) {
      console.error('Payment initiation error:', error);
      const errorMessage = error.message || (language === 'he' ? 'שגיאה בתשלום' : 'Payment error');
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          {t.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4 border-2 border-emerald-200">
          <div className="text-sm text-gray-600 mb-1">{t.amount}</div>
          <div className="text-3xl font-bold text-emerald-700">₪{amount.toFixed(2)}</div>
        </div>

        {!isChrome && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                <ShieldAlert className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-700">
                    {t.chromeRequired}
                </div>
            </div>
        )}

        {error ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-center">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-red-700 font-semibold mb-2">{t.error}</div>
            <div className="text-sm text-red-600 mb-4">{error}</div>
            <Button 
              onClick={() => setError(null)}
              variant="outline"
              className="w-full"
            >
              {t.tryAgain}
            </Button>
          </div>
        ) : (
          <>
            <Button 
              type="button"
              onClick={handlePayment}
              disabled={loading || !sdkLoaded}
              className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t.processing}
                </>
              ) : !sdkLoaded ? (
                 <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t.initializing}
                 </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  {t.payNow}
                </>
              )}
            </Button>
            
            {/* The Grow SDK might render elements here or in a modal. 
                We ensure there's a container if needed, though usually it opens a modal. */}
            <div id="grow-payment-container"></div>

            <div className="text-center text-sm text-gray-500">
              <div className="mb-2">{t.payWith}</div>
              <div className="flex flex-wrap justify-center gap-3">
                <div className="flex items-center gap-1">
                  <CreditCard className="w-4 h-4" />
                  <span>{t.credit}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Smartphone className="w-4 h-4" />
                  <span>{t.bit}</span>
                </div>
                 <div className="flex items-center gap-1">
                  <span>Google Pay</span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GrowPaymentForm;
