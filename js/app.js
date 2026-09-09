/**
 * NOVACREST HOMES LIMITED - Main Application Script
 * Orchestrates navigation, modals, currency, and interactions
 */

import { PROPERTIES, ABUJA_DISTRICTS, BLOG_POSTS, TESTIMONIALS } from './properties-data.js';
import { getCurrency, setCurrency, getDualPriceTag } from './currency.js';
import { initFilterEngine } from './filter.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCurrencyControls();
  initPropertyModal();
  initConsultationModal();
  initNewsletter();
  initDistrictsGuide();
  initBlogModals();

  // Initialize property cards & filter engine
  initFilterEngine((property) => {
    openPropertyModal(property);
  });
});

/* ==========================================================================
   Navigation
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Scroll listener for glass navbar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      toggleBtn.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggleBtn.classList.remove('active');
      });
    });
  }
}

/* ==========================================================================
   Currency Controls
   ========================================================================== */
function initCurrencyControls() {
  const currencyBtns = document.querySelectorAll('.currency-btn');
  const current = getCurrency();

  currencyBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.curr === current);
    btn.addEventListener('click', (e) => {
      const selected = e.currentTarget.dataset.curr;
      setCurrency(selected);
      currencyBtns.forEach(b => b.classList.toggle('active', b.dataset.curr === selected));
    });
  });
}

/* ==========================================================================
   Property Detail Modal
   ========================================================================== */
let activePropertyForModal = null;

function initPropertyModal() {
  const modal = document.getElementById('propertyDetailModal');
  const closeBtn = document.getElementById('closePropertyModalBtn');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Schedule inspection inside property modal
  const scheduleBtn = document.getElementById('modalScheduleInspectionBtn');
  if (scheduleBtn) {
    scheduleBtn.addEventListener('click', () => {
      if (activePropertyForModal) {
        modal.classList.remove('active');
        openConsultationModal(`Schedule Inspection for ${activePropertyForModal.name}`);
      }
    });
  }
}

export function openPropertyModal(property) {
  activePropertyForModal = property;
  const modal = document.getElementById('propertyDetailModal');
  if (!modal) return;

  const prices = getDualPriceTag(property.priceNGN, property.priceUSD, property.period);

  document.getElementById('modalPropertyImage').src = property.image;
  document.getElementById('modalPropertyTitle').textContent = property.name;
  document.getElementById('modalPropertyLocation').textContent = `${property.district}, Abuja — ${property.address}`;
  document.getElementById('modalPropertySubtitle').textContent = property.subtitle;
  document.getElementById('modalPropertyPricePrimary').textContent = prices.primary;
  document.getElementById('modalPropertyPriceSecondary').textContent = prices.secondary;
  document.getElementById('modalPropertyDescription').textContent = property.description;
  document.getElementById('modalPropertyThesis').textContent = property.investmentThesis;
  document.getElementById('modalPropertyTitleStatus').textContent = `${property.titleStatus} (${property.titleAgency})`;
  
  // Proximity info
  document.getElementById('modalProximityAirport').textContent = property.proximity.airport;
  document.getElementById('modalProximityCBD').textContent = property.proximity.cbd;
  document.getElementById('modalProximityLandmark').textContent = property.proximity.landmark;

  // Amenities
  const amenitiesContainer = document.getElementById('modalAmenitiesList');
  if (amenitiesContainer) {
    amenitiesContainer.innerHTML = property.amenities.map(a => `
      <div class="modal-amenity-item">
        <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
        <span>${a}</span>
      </div>
    `).join('');
  }

  // WhatsApp Button
  const waText = encodeURIComponent(`Hello Novacrest Homes Ltd, I would like to schedule a private inspection and receive the full legal verification dossier for ${property.name} (${property.district}, Abuja).`);
  const waBtn = document.getElementById('modalWhatsAppBtn');
  if (waBtn) {
    waBtn.href = `https://wa.me/2348166800142?text=${waText}`;
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/* ==========================================================================
   Consultation Booking Modal
   ========================================================================== */
function initConsultationModal() {
  const modal = document.getElementById('consultationModal');
  const closeBtn = document.getElementById('closeConsultationModalBtn');
  const triggers = document.querySelectorAll('.trigger-consultation-modal');

  triggers.forEach(t => {
    t.addEventListener('click', (e) => {
      e.preventDefault();
      openConsultationModal();
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Form submission handling
  const form = document.getElementById('consultationBookingForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('consultName').value;
      const phone = document.getElementById('consultPhone').value;
      const interest = document.getElementById('consultInterest').value;
      const message = document.getElementById('consultMessage').value;

      // Construct WhatsApp direct message as fallback
      const waSummary = encodeURIComponent(`*New Consultation Request*\nName: ${name}\nPhone: ${phone}\nInterest: ${interest}\nNotes: ${message}`);
      
      // Save lead to local storage for Admin Dashboard CRM
      try {
        const existingLeads = JSON.parse(localStorage.getItem('novacrest_leads') || '[]');
        existingLeads.unshift({
          id: 'lead-' + Date.now(),
          name,
          phone,
          interest: interest || 'Consultation Request',
          location: 'Website Visitor',
          budgetNGN: 350000000,
          stage: 'new',
          riskLevel: 'low',
          aiScore: 92,
          aiSummary: `Submitted web consultation request for ${interest || 'General Portfolio'}. Notes: ${message || 'None provided.'}`,
          notes: [{ date: new Date().toISOString().split('T')[0], text: `Web inquiry: ${message || 'Consultation requested.'}` }],
          source: 'Website Form',
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('novacrest_leads', JSON.stringify(existingLeads));
      } catch (err) {
        console.warn('Lead local save error:', err);
      }

      const successBox = document.getElementById('consultSuccessBox');
      form.style.display = 'none';
      if (successBox) {
        successBox.innerHTML = `
          <div style="text-align: center; padding: 2rem 1rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem; color: #10B981;">✓</div>
            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: #FFFFFF;">Consultation Scheduled</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">
              Thank you, ${name}. Our dedicated diaspora advisory director in Abuja will contact you via WhatsApp and email within 2 hours.
            </p>
            <a href="https://wa.me/2348166800142?text=${waSummary}" target="_blank" rel="noopener" class="btn btn-whatsapp">
              Connect Directly on WhatsApp Now
            </a>
          </div>
        `;
      }
    });
  }
}

export function openConsultationModal(customSubject = null) {
  const modal = document.getElementById('consultationModal');
  if (!modal) return;

  const notesField = document.getElementById('consultMessage');
  if (notesField && customSubject) {
    notesField.value = `Inquiry regarding: ${customSubject}`;
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/* ==========================================================================
   Newsletter & Lead Capture
   ========================================================================== */
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  const messageBox = document.getElementById('newsletterFeedback');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletterEmail').value;
      
      if (messageBox) {
        messageBox.innerHTML = `
          <div style="color: var(--gold-light); margin-top: 0.75rem; font-weight: 600;">
            ✓ Subscribed! You will receive off-market Abuja listings before public release.
          </div>
        `;
      }
      form.reset();
    });
  }
}

/* ==========================================================================
   Districts Guide & Blog Modals
   ========================================================================== */
function initDistrictsGuide() {
  const container = document.getElementById('locationsGridContainer');
  if (!container) return;

  container.innerHTML = ABUJA_DISTRICTS.map(dist => `
    <div class="location-card" data-district="${dist.id}">
      <span class="location-badge-tier">${dist.tier}</span>
      <h3 class="location-name">${dist.name}</h3>
      <p class="location-headline">${dist.headline}</p>
      
      <div class="location-metrics">
        <div class="metric-row">
          <span class="metric-label">To Airport:</span>
          <span class="metric-value">${dist.distanceAirport}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">To CBD:</span>
          <span class="metric-value">${dist.distanceCBD}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Capital Growth:</span>
          <span class="metric-value" style="color: #10B981">${dist.growthIndex}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Price Range:</span>
          <span class="metric-value text-gold" style="font-size:0.75rem">${dist.priceRange}</span>
        </div>
      </div>

      <p style="font-size:0.83rem; color:var(--text-muted); margin-bottom: 1.25rem; line-height: 1.5;">
        ${dist.character}
      </p>

      <button class="btn btn-outline-gold btn-sm btn-filter-by-district" data-district="${dist.name}" style="margin-top:auto;">
        View Properties in ${dist.name}
      </button>
    </div>
  `).join('');

  container.querySelectorAll('.btn-filter-by-district').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const distName = e.currentTarget.dataset.district;
      const heroDistrictSelect = document.getElementById('heroDistrictSelect');
      if (heroDistrictSelect) {
        heroDistrictSelect.value = distName.toLowerCase();
      }
      const target = document.getElementById('properties');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

function initBlogModals() {
  const container = document.getElementById('insightsGridContainer');
  if (!container) return;

  // If container already has pre-rendered semantic HTML cards, wire modal triggers
  if (container.children.length > 0) {
    container.querySelectorAll('.trigger-consultation-modal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const subject = btn.getAttribute('data-subject') || 'Abuja Market Insights Dossier';
        openConsultationModal(subject);
      });
    });
    return;
  }

  // Dynamic injection fallback
  container.innerHTML = BLOG_POSTS.map(post => `
    <article class="insight-card">
      <div class="insight-meta">
        <span class="insight-badge">${post.category}</span>
        <span class="insight-time">${post.readTime}</span>
      </div>
      <h3 class="insight-title"><a href="article.html?id=${post.id}">${post.title}</a></h3>
      <p class="insight-snippet">${post.snippet}</p>
      <div class="insight-footer">
        <a href="article.html?id=${post.id}" class="insight-readmore">
          <span>Read Analysis</span>
          <span class="btn-arrow">→</span>
        </a>
        <button type="button" class="insight-action-btn trigger-consultation-modal" data-subject="${post.title}">
          <span>Download Brief</span>
        </button>
      </div>
    </article>
  `).join('');

  container.querySelectorAll('.trigger-consultation-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const subject = btn.getAttribute('data-subject') || 'Abuja Market Insights Dossier';
      openConsultationModal(subject);
    });
  });
}
