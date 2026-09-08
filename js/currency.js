/**
 * Currency Switcher Module for NOVACREST Homes Ltd
 * Handles live toggling between NGN (₦) and USD ($)
 */

let currentCurrency = localStorage.getItem("novacrest_currency") || "NGN";

export function getCurrency() {
  return currentCurrency;
}

export function setCurrency(curr) {
  currentCurrency = curr === "USD" ? "USD" : "NGN";
  localStorage.setItem("novacrest_currency", currentCurrency);
  
  // Dispatch custom event for reactive UI updates
  window.dispatchEvent(new CustomEvent("currencyChange", { detail: { currency: currentCurrency } }));
}

export function formatPrice(priceNGN, priceUSD, period = null) {
  const isUSD = currentCurrency === "USD";
  let formatted = "";

  if (isUSD) {
    if (priceUSD >= 1000000) {
      formatted = `$${(priceUSD / 1000000).toFixed(2)}M`;
    } else if (priceUSD >= 1000) {
      formatted = `$${priceUSD.toLocaleString("en-US")}`;
    } else {
      formatted = `$${priceUSD}`;
    }
  } else {
    if (priceNGN >= 1000000000) {
      formatted = `₦${(priceNGN / 1000000000).toFixed(2)}B`;
    } else if (priceNGN >= 1000000) {
      formatted = `₦${(priceNGN / 1000000).toFixed(1)}M`;
    } else {
      formatted = `₦${priceNGN.toLocaleString("en-NG")}`;
    }
  }

  return period ? `${formatted} <span class="price-period">${period}</span>` : formatted;
}

export function getDualPriceTag(priceNGN, priceUSD, period = null) {
  const primary = currentCurrency === "USD" 
    ? `$${priceUSD.toLocaleString("en-US")}` 
    : `₦${(priceNGN >= 1000000000 ? (priceNGN / 1000000000).toFixed(2) + 'B' : (priceNGN / 1000000).toFixed(1) + 'M')}`;
    
  const secondary = currentCurrency === "USD"
    ? `≈ ₦${(priceNGN >= 1000000000 ? (priceNGN / 1000000000).toFixed(2) + 'B' : (priceNGN / 1000000).toFixed(1) + 'M')}`
    : `≈ $${priceUSD.toLocaleString("en-US")}`;

  const periodStr = period ? ` ${period}` : "";
  return { primary: `${primary}${periodStr}`, secondary: `${secondary}${periodStr}` };
}
