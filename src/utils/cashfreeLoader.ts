/**
 * Utility to ensure Cashfree SDK is loaded
 */

export const ensureCashfreeLoaded = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    // If Cashfree is already loaded, resolve immediately
    if (typeof window.Cashfree !== 'undefined') {
      console.log('Cashfree SDK already loaded');
      resolve(window.Cashfree);
      return;
    }

    console.log('Waiting for Cashfree SDK to load...');
    
    // Check if the script is already in the document
    const existingScript = document.querySelector('script[src*="cashfree.js"]');
    
    if (!existingScript) {
      // If not, create and append the script
      const script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
      script.async = true;
      
      script.onload = () => {
        console.log('Cashfree SDK loaded successfully');
        if (typeof window.Cashfree !== 'undefined') {
          resolve(window.Cashfree);
        } else {
          reject(new Error('Cashfree SDK loaded but not available in window'));
        }
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Cashfree SDK'));
      };
      
      document.head.appendChild(script);
    } else {
      // If script exists but Cashfree not loaded yet, poll for it
      let attempts = 0;
      const maxAttempts = 20;
      const interval = setInterval(() => {
        attempts++;
        if (typeof window.Cashfree !== 'undefined') {
          clearInterval(interval);
          console.log('Cashfree SDK detected after polling');
          resolve(window.Cashfree);
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          reject(new Error('Timed out waiting for Cashfree SDK to load'));
        }
      }, 300);
    }
  });
};

// Add type definition for window.Cashfree
declare global {
  interface Window {
    Cashfree: any;
  }
}
