/**
 * Property Filter and Rendering Engine for NOVACREST Homes Ltd
 */

import { PROPERTIES } from './properties-data.js';
import { getDualPriceTag } from './currency.js';

let activeCategory = 'all';
let selectedDistrict = 'all';
let selectedPurpose = 'all';
let searchQuery = '';

export function initFilterEngine(onSelectPropertyCallback) {
  // Hero search form elements
  const heroDistrictSelect = document.getElementById('heroDistrictSelect');
  const heroPurposeSelect = document.getElementById('heroPurposeSelect');
  const heroSearchInput = document.getElementById('heroSearchInput');
  const heroSearchBtn = document.getElementById('heroSearchBtn');

  // Parse URL query parameters if present
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('district')) {
    const distParam = urlParams.get('district');
    if (distParam) {
      selectedDistrict = distParam;
      if (heroDistrictSelect) heroDistrictSelect.value = distParam;
    }
  }

  if (urlParams.has('type') || urlParams.has('purpose')) {
    const typeParam = urlParams.get('type') || urlParams.get('purpose');
    if (typeParam) {
      selectedPurpose = typeParam;
      if (heroPurposeSelect) heroPurposeSelect.value = typeParam;
    }
  }

  if (urlParams.has('q')) {
    const qParam = urlParams.get('q');
    if (qParam) {
      searchQuery = qParam.toLowerCase().trim();
      if (heroSearchInput) heroSearchInput.value = qParam;
    }
  }

  renderProperties(onSelectPropertyCallback);

  // Tab listeners
  const tabs = document.querySelectorAll('.filter-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      tabs.forEach(t => t.classList.remove('active'));
      e.currentTarget.classList.add('active');
      activeCategory = e.currentTarget.dataset.category;
      renderProperties(onSelectPropertyCallback);
    });
  });

  if (heroSearchBtn) {
    heroSearchBtn.addEventListener('click', () => {
      if (heroDistrictSelect) selectedDistrict = heroDistrictSelect.value;
      if (heroPurposeSelect) selectedPurpose = heroPurposeSelect.value;
      if (heroSearchInput) searchQuery = heroSearchInput.value.toLowerCase().trim();

      // Scroll to properties section
      const target = document.getElementById('properties');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }

      renderProperties(onSelectPropertyCallback);
    });
  }

  // Listen for currency toggle change
  window.addEventListener('currencyChange', () => {
    renderProperties(onSelectPropertyCallback);
  });
}

export function filterProperties() {
  return PROPERTIES.filter(p => {
    // Category match
    const matchesCategory = activeCategory === 'all' 
      || (activeCategory === 'coming-soon' && p.status === 'Coming Soon')
      || (activeCategory === 'off-plan' && p.category === 'off-plan')
      || (activeCategory === 'land' && p.category === 'land')
      || (activeCategory === 'sale' && p.purpose === 'For Sale')
      || (activeCategory === 'rent' && p.purpose === 'For Rent');

    // District match
    const matchesDistrict = selectedDistrict === 'all' || p.district.toLowerCase() === selectedDistrict.toLowerCase();

    // Purpose match
    const matchesPurpose = selectedPurpose === 'all' 
      || (selectedPurpose === 'sale' && p.purpose === 'For Sale')
      || (selectedPurpose === 'rent' && p.purpose === 'For Rent')
      || (selectedPurpose === 'land' && p.category === 'land')
      || (selectedPurpose === 'off-plan' && p.category === 'off-plan');

    // Search query match
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery) ||
      p.subtitle.toLowerCase().includes(searchQuery) ||
      p.district.toLowerCase().includes(searchQuery) ||
      p.titleStatus.toLowerCase().includes(searchQuery);

    return matchesCategory && matchesDistrict && matchesPurpose && matchesSearch;
  });
}

export function renderProperties(onSelectPropertyCallback) {
  const container = document.getElementById('propertiesGridContainer');
  if (!container) return;

  const filtered = filterProperties();

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
        <div style="font-size: 1.5rem; margin-bottom: 0.75rem;">🏛️</div>
        <h3 style="font-size: 1.25rem; font-weight: 600; color: var(--color-ink-900); margin-bottom: 0.5rem;">No properties found</h3>
        <p style="color: var(--color-slate-500); max-width: 480px; margin: 0 auto 1.5rem; font-size: 0.95rem;">
          Try adjusting your filter criteria or explore our upcoming developments in Maitama, Jabi, and Asokoro.
        </p>
        <button class="btn btn-secondary btn-sm" id="resetFiltersBtn">Reset All Filters</button>
      </div>
    `;

    const resetBtn = document.getElementById('resetFiltersBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        activeCategory = 'all';
        selectedDistrict = 'all';
        selectedPurpose = 'all';
        searchQuery = '';
        document.querySelectorAll('.filter-tab-btn').forEach((t, i) => {
          t.classList.toggle('active', i === 0);
        });
        renderProperties(onSelectPropertyCallback);
      });
    }
    return;
  }

  container.innerHTML = filtered.map(item => {
    const prices = getDualPriceTag(item.priceNGN, item.priceUSD, item.period);
    
    // Status Badge & Chip
    const statusType = item.badgeType || 'available';
    const statusLabel = item.status || 'Available';
    const propertyChip = item.chip || (item.type || 'RESIDENTIAL').toUpperCase();

    // Specs formatting (horizontal with subtle divider)
    const specsHtml = item.bedrooms > 0 ? `
      <div class="spec-item"><span class="spec-val">${item.bedrooms}</span> <span class="spec-lbl">Beds</span></div>
      <span class="spec-divider">•</span>
      <div class="spec-item"><span class="spec-val">${item.bathrooms}</span> <span class="spec-lbl">Baths</span></div>
      <span class="spec-divider">•</span>
      <div class="spec-item"><span class="spec-val">${item.landSize}</span></div>
    ` : `
      <div class="spec-item"><span class="spec-lbl">Plots:</span> <span class="spec-val">${item.landSize}</span></div>
      <span class="spec-divider">•</span>
      <div class="spec-item"><span class="spec-val">Instant Allocation</span></div>
    `;

    // Ownership Availability Gauge
    const avail = item.availability || { available: 60, reserved: 25, sold: 15 };
    const monthlyText = item.monthlyPayment || 'From ₦4.8M/month';

    // WhatsApp Pre-filled link
    const waText = encodeURIComponent(`Hello Novacrest Homes Ltd, I am interested in inquiring about ${item.name} (${item.district}, Abuja) listed for ${prices.primary}. Please share the investment brochure and title verification.`);
    const waLink = `https://wa.me/2348166800142?text=${waText}`;

    return `
      <article class="property-card" data-id="${item.id}">
        <div class="card-media">
          <img src="${item.image}" alt="${item.name} in ${item.district}, Abuja" loading="lazy">
          <span class="status-badge status-${statusType}">${statusLabel}</span>
          <span class="property-chip">${propertyChip}</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">${item.name}</h3>
          <div class="card-location">
            <svg class="location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${item.district} District, Abuja</span>
          </div>
          
          <div class="card-specs">
            ${specsHtml}
          </div>

          <!-- Novacrest Ownership Gauge (Section 22 & Spec Sheet Panel 06) -->
          <div class="ownership-gauge">
            <div class="gauge-header">
              <span class="gauge-label">AVAILABILITY</span>
              <span class="gauge-status-val">${avail.available}% AVAILABLE</span>
            </div>
            <div class="gauge-bar">
              <div class="gauge-seg seg-available" style="width: ${avail.available}%"></div>
              <div class="gauge-seg seg-reserved" style="width: ${avail.reserved}%"></div>
              <div class="gauge-seg seg-sold" style="width: ${avail.sold}%"></div>
            </div>
            <div class="gauge-legend">
              <span>Available ${avail.available}%</span>
              <span>·</span>
              <span>Reserved ${avail.reserved}%</span>
              <span>·</span>
              <span>Sold ${avail.sold}%</span>
            </div>
          </div>

          <div class="card-footer-row">
            <div class="card-price-group">
              <div class="price-primary">${prices.primary}</div>
              <div class="price-installment">${monthlyText}</div>
            </div>
            <div class="card-actions">
              <button class="btn btn-primary btn-sm btn-view-details" data-id="${item.id}">
                <span>View Details</span>
                <span class="btn-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Attach view details listeners
  container.querySelectorAll('.btn-view-details').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const property = PROPERTIES.find(p => p.id === id);
      if (property && onSelectPropertyCallback) {
        onSelectPropertyCallback(property);
      }
    });
  });
}
