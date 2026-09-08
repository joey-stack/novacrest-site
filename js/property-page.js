/**
 * Dynamic Property Details Page Controller
 * Reads ?id= from URL and renders full property showcase
 */

import { PROPERTIES } from './properties-data.js';
import { getDualPriceTag } from './currency.js';

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || 'nova-crest-palace';
  
  const property = PROPERTIES.find(p => p.id === id) || PROPERTIES[0];
  renderPropertyPage(property);

  window.addEventListener('currencyChange', () => {
    renderPropertyPage(property);
  });
});

function renderPropertyPage(prop) {
  const prices = getDualPriceTag(prop.priceNGN, prop.priceUSD, prop.period);

  // Update Page Title
  document.title = `${prop.name} — ${prop.district}, Abuja | NOVACREST HOMES LIMITED`;

  // Breadcrumbs
  const breadcrumbName = document.getElementById('propBreadcrumbName');
  if (breadcrumbName) breadcrumbName.textContent = prop.name;

  // Header Elements
  const titleEl = document.getElementById('propTitle');
  if (titleEl) titleEl.textContent = prop.name;

  const subtitleEl = document.getElementById('propSubtitle');
  if (subtitleEl) subtitleEl.textContent = prop.subtitle;

  const locationEl = document.getElementById('propLocation');
  if (locationEl) {
    locationEl.innerHTML = `
      <svg class="location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
      <span>${prop.district}, Abuja — ${prop.address}</span>
    `;
  }

  const statusBadge = document.getElementById('propStatusBadge');
  if (statusBadge) {
    statusBadge.textContent = prop.status;
    statusBadge.className = `card-badge-status ${prop.badgeType === 'active' ? 'badge-active' : (prop.badgeType === 'ready' ? 'badge-ready' : 'badge-coming-soon')}`;
  }

  const titleStatusEl = document.getElementById('propTitleStatus');
  if (titleStatusEl) titleStatusEl.textContent = `${prop.titleStatus} (${prop.titleAgency})`;

  // Prices
  const pricePrimary = document.getElementById('propPricePrimary');
  if (pricePrimary) pricePrimary.textContent = prices.primary;

  const priceSecondary = document.getElementById('propPriceSecondary');
  if (priceSecondary) priceSecondary.textContent = prices.secondary;

  // Images Gallery
  const mainImg = document.getElementById('propMainImg');
  if (mainImg) mainImg.src = prop.image;

  const subImg1 = document.getElementById('propSubImg1');
  if (subImg1 && prop.gallery && prop.gallery[1]) subImg1.src = prop.gallery[1];

  const subImg2 = document.getElementById('propSubImg2');
  if (subImg2 && prop.gallery && prop.gallery[2]) subImg2.src = prop.gallery[2];

  // Specs
  const specsContainer = document.getElementById('propSpecsGrid');
  if (specsContainer) {
    if (prop.bedrooms > 0) {
      specsContainer.innerHTML = `
        <div class="stat-item" style="background:var(--color-white); border:1px solid var(--color-slate-200); padding:1rem; border-radius:var(--radius-card, 5px);">
          <div class="stat-number" style="font-size:1.8rem;">${prop.bedrooms}</div>
          <div class="stat-label">Bedrooms</div>
        </div>
        <div class="stat-item" style="background:var(--color-white); border:1px solid var(--color-slate-200); padding:1rem; border-radius:var(--radius-card, 5px);">
          <div class="stat-number" style="font-size:1.8rem;">${prop.bathrooms}</div>
          <div class="stat-label">Bathrooms</div>
        </div>
        <div class="stat-item" style="background:var(--color-white); border:1px solid var(--color-slate-200); padding:1rem; border-radius:var(--radius-card, 5px);">
          <div class="stat-number" style="font-size:1.8rem;">${prop.landSize}</div>
          <div class="stat-label">Land Size</div>
        </div>
        <div class="stat-item" style="background:var(--color-white); border:1px solid var(--color-slate-200); padding:1rem; border-radius:var(--radius-card, 5px);">
          <div class="stat-number" style="font-size:1.8rem;">${prop.carParks || 4}</div>
          <div class="stat-label">Car Parks</div>
        </div>
      `;
    } else {
      specsContainer.innerHTML = `
        <div class="stat-item" style="background:var(--color-white); border:1px solid var(--color-slate-200); padding:1rem; border-radius:var(--radius-card, 5px); grid-column:span 2;">
          <div class="stat-number" style="font-size:1.8rem;">${prop.landSize}</div>
          <div class="stat-label">Available Plot Dimensions</div>
        </div>
        <div class="stat-item" style="background:var(--color-white); border:1px solid var(--color-slate-200); padding:1rem; border-radius:var(--radius-card, 5px); grid-column:span 2;">
          <div class="stat-number" style="font-size:1.8rem; color:#10B981;">100%</div>
          <div class="stat-label">Instant Cadastral Allocation</div>
        </div>
      `;
    }
  }

  // Description & Thesis
  const descEl = document.getElementById('propDescription');
  if (descEl) descEl.textContent = prop.description;

  const thesisEl = document.getElementById('propThesis');
  if (thesisEl) thesisEl.textContent = prop.investmentThesis;

  // Amenities
  const amenitiesList = document.getElementById('propAmenitiesList');
  if (amenitiesList) {
    amenitiesList.innerHTML = prop.amenities.map(a => `
      <div class="modal-amenity-item" style="padding:0.5rem 0;">
        <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
        <span style="font-weight:500;">${a}</span>
      </div>
    `).join('');
  }

  // Proximity Table
  const proxAirport = document.getElementById('propProxAirport');
  if (proxAirport) proxAirport.textContent = prop.proximity.airport;

  const proxCBD = document.getElementById('propProxCBD');
  if (proxCBD) proxCBD.textContent = prop.proximity.cbd;

  const proxLandmark = document.getElementById('propProxLandmark');
  if (proxLandmark) proxLandmark.textContent = prop.proximity.landmark;

  // WhatsApp Link
  const waBtn = document.getElementById('propWhatsAppBtn');
  if (waBtn) {
    const waText = encodeURIComponent(`Hello Novacrest Homes Ltd, I am interested in ${prop.name} (${prop.district}, Abuja) listed at ${prices.primary}. Please send me the comprehensive investor dossier and title verification.`);
    waBtn.href = `https://wa.me/2348166800142?text=${waText}`;
  }

  // Related Properties
  const relatedContainer = document.getElementById('relatedPropertiesContainer');
  if (relatedContainer) {
    const others = PROPERTIES.filter(p => p.id !== prop.id).slice(0, 3);
    relatedContainer.innerHTML = others.map(item => {
      const pPrices = getDualPriceTag(item.priceNGN, item.priceUSD, item.period);
      const statusType = item.badgeType || 'available';
      const statusLabel = item.status || 'Available';
      const propertyChip = item.chip || (item.type || 'RESIDENTIAL').toUpperCase();
      const avail = item.availability || { available: 60, reserved: 25, sold: 15 };

      return `
        <article class="property-card" data-id="${item.id}">
          <div class="card-media">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <span class="status-badge status-${statusType}">${statusLabel}</span>
            <span class="property-chip">${propertyChip}</span>
          </div>
          <div class="card-body">
            <h4 class="card-title" style="font-size:18px;">${item.name}</h4>
            <div class="card-location">
              <svg class="location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>${item.district} District, Abuja</span>
            </div>

            <!-- Ownership Gauge -->
            <div class="ownership-gauge" style="margin-bottom:12px; padding:8px 10px;">
              <div class="gauge-header" style="font-size:10px;">
                <span class="gauge-label">AVAILABILITY</span>
                <span class="gauge-status-val">${avail.available}% AVAILABLE</span>
              </div>
              <div class="gauge-bar" style="height:5px;">
                <div class="gauge-seg seg-available" style="width: ${avail.available}%"></div>
                <div class="gauge-seg seg-reserved" style="width: ${avail.reserved}%"></div>
                <div class="gauge-seg seg-sold" style="width: ${avail.sold}%"></div>
              </div>
            </div>

            <div class="card-footer-row">
              <div class="card-price-group">
                <div class="price-primary" style="font-size:18px;">${pPrices.primary}</div>
                <div class="price-installment">${item.monthlyPayment || 'From ₦4.8M/month'}</div>
              </div>
              <div class="card-actions">
                <a href="property.html?id=${item.id}" class="btn btn-primary btn-sm">
                  <span>View Details</span>
                  <span class="btn-arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }
}
