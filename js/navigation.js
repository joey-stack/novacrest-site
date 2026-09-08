/**
 * Shared Navigation & Global Behaviors for NOVACREST Homes Ltd
 * Works across all standalone multi-page HTML documents
 */

import { getCurrency, setCurrency } from './currency.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initActiveNavLink();
  initMobileMenu();
  initGlobalCurrencyToggle();
  initConsultationTriggers();
  initFaqAccordion();
  initScrollHighlight();
});

function initNavbarScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

function initActiveNavLink() {
  const currentPath = window.location.pathname.toLowerCase();
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href').toLowerCase();
    
    // Check match
    const isHome = (href === 'index.html' || href === './' || href === '/') && (currentPath.endsWith('/') || currentPath.endsWith('index.html'));
    const isExact = href.length > 2 && currentPath.includes(href.replace('./', '').replace('/', ''));

    if (isHome || isExact) {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}

function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (toggleBtn && navMenu) {
    // Check if footer actions already added
    if (!navMenu.querySelector('.nav-menu-footer')) {
      const footerWrap = document.createElement('div');
      footerWrap.className = 'nav-menu-footer';
      footerWrap.innerHTML = `
        <a href="https://wa.me/2348166800142?text=Hello%20Novacrest%20Homes%20Ltd,%20I%20would%20like%20to%20speak%20with%20an%20advisor." target="_blank" rel="noopener" class="nav-mobile-cta">
          <span>Talk to an Advisor (WhatsApp)</span>
          <span>→</span>
        </a>
        <div class="nav-mobile-info">
          <span>Abuja, Nigeria</span>
          <a href="tel:+2348166800142">+234 816 680 0142</a>
        </div>
      `;
      navMenu.appendChild(footerWrap);
    }

    toggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      toggleBtn.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    document.querySelectorAll('.nav-link').forEach(l => {
      l.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggleBtn.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
}

function initGlobalCurrencyToggle() {
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

function initConsultationTriggers() {
  const triggers = document.querySelectorAll('.trigger-consultation-modal');
  const modal = document.getElementById('consultationModal');
  const closeBtn = document.getElementById('closeConsultationModalBtn');

  if (modal && closeBtn) {
    triggers.forEach(t => {
      t.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

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

    // Handle form submit
    const form = document.getElementById('modalConsultationForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputs = form.querySelectorAll('input, select');
        let details = [];
        inputs.forEach(inp => {
          if (inp.value) details.push(inp.value);
        });
        const waMsg = encodeURIComponent(`Hello Novacrest Homes Ltd, I submitted a consultation request: ${details.join(' | ')}`);
        
        modal.innerHTML = `
          <div class="modal-container" style="max-width: 520px; padding: 3rem 2rem; text-align: center;">
            <div style="font-size: 3rem; color: #10B981; margin-bottom: 1rem;">✓</div>
            <h3 style="font-size: 1.6rem; color: #FFFFFF; margin-bottom: 0.5rem;">Request Received</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1.75rem;">
              Thank you. Our Abuja director will connect with you shortly. You can also message our executive desk directly on WhatsApp.
            </p>
            <a href="https://wa.me/2348166800142?text=${waMsg}" target="_blank" rel="noopener" class="btn btn-whatsapp" style="width:100%;">
              Open Direct WhatsApp Chat
            </a>
          </div>
        `;
      });
    }
  } else {
    // If on a page without the modal, redirect to contact.html
    triggers.forEach(t => {
      t.addEventListener('click', () => {
        window.location.href = 'contact.html';
      });
    });
  }
}

function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      if (!item) return;
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(other => {
        if (other !== item) other.classList.remove('active');
      });
      item.classList.toggle('active', !isActive);
    });
  });
}

/**
 * On-scroll Progressive Text Highlight Effect (Framer-style)
 * Breaks sentences into individual words with blur/opacity transition
 * driven by viewport scroll progression.
 */
function initScrollHighlight() {
  const targets = document.querySelectorAll('.scroll-highlight-lead');
  if (!targets.length) return;

  targets.forEach(target => {
    // Check if already processed to avoid re-splitting
    if (target.dataset.scrollHighlightReady) return;

    // Accent words to give special brand color emphasis when highlighted
    const accentWords = new Set(['property', 'partner,', 'partner', 'dreams', 'reality.', 'reality']);

    const rawText = target.textContent.trim();
    // Split text into tokens (preserving words and whitespace structure)
    const words = rawText.split(/\s+/).filter(Boolean);

    // Build the wrapped word elements
    target.innerHTML = '';
    const wordSpans = [];

    words.forEach((w, idx) => {
      const span = document.createElement('span');
      span.className = 'scroll-highlight-word';
      const cleanWord = w.toLowerCase().replace(/[^a-z]/g, '');
      if (['property', 'partner', 'dreams', 'reality'].includes(cleanWord)) {
        span.classList.add('is-accent');
      }
      span.textContent = w;

      target.appendChild(span);
      wordSpans.push(span);

      // Add trailing space between words
      if (idx < words.length - 1) {
        target.appendChild(document.createTextNode(' '));
      }
    });

    target.dataset.scrollHighlightReady = 'true';

    // Scroll calculation handler
    let isTicking = false;

    function updateHighlight() {
      const rect = target.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      // Start highlighting when top of the element enters bottom 35% of the viewport
      // Complete highlight when element reaches upper-middle of viewport
      const startTrigger = viewportHeight * 0.88;
      const endTrigger = viewportHeight * 0.28;

      const totalDistance = startTrigger - endTrigger;
      const currentProgress = (startTrigger - rect.top) / totalDistance;
      const progress = Math.max(0, Math.min(1, currentProgress));

      const totalWords = wordSpans.length;
      // Fractional index for smooth sequential transition
      const activeWordCount = Math.floor(progress * (totalWords + 1));

      wordSpans.forEach((span, index) => {
        if (index < activeWordCount) {
          span.classList.add('is-active');
        } else {
          span.classList.remove('is-active');
        }
      });

      isTicking = false;
    }

    function onScroll() {
      if (!isTicking) {
        window.requestAnimationFrame(updateHighlight);
        isTicking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    // Run immediately once on mount
    updateHighlight();
  });
}


