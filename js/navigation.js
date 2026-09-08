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
  initCounterAnimation();
  initSectionReveals();
  initFilterPillGliders();
  initCardStaggerObserver();
});

function initNavbarScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
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

/**
 * Understated Stat Counters: Smoothly increment numbers when scrolled into view
 */
export function initCounterAnimation() {
  const counterEls = document.querySelectorAll('.about-stat-quad-number, .stat-number');
  if (!counterEls.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      obs.unobserve(el);

      const rawText = el.textContent.trim();
      const match = rawText.match(/^([^\d]*)([\d,.]+)(.*)$/);
      if (!match) return;

      const prefix = match[1] || '';
      const numStr = match[2].replace(/,/g, '');
      const suffix = match[3] || '';
      const targetVal = parseFloat(numStr);
      if (isNaN(targetVal)) return;

      const isFloat = numStr.includes('.');
      const decimals = isFloat ? numStr.split('.')[1].length : 0;
      const duration = 1200;
      const startTime = performance.now();

      function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentVal = targetVal * eased;

        el.textContent = `${prefix}${currentVal.toFixed(decimals)}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = rawText;
        }
      }

      requestAnimationFrame(step);
    });
  }, { threshold: 0.15 });

  counterEls.forEach(el => observer.observe(el));
}

/**
 * Calm Section Entrance Reveals
 */
export function initSectionReveals() {
  const targets = document.querySelectorAll('.site-footer, .section-reveal, .about-merged-section, .values-grid');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(target => observer.observe(target));
}

/**
 * Gliding Filter Pill (Keri Signature): Slides indicator between active selections
 */
export function updateGlider(tabsContainer, activeBtn) {
  if (!tabsContainer || !activeBtn) return;

  let indicator = tabsContainer.querySelector('.filter-tab-indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.className = 'filter-tab-indicator';
    tabsContainer.prepend(indicator);
  }
  tabsContainer.classList.add('has-glider');

  const left = activeBtn.offsetLeft;
  const width = activeBtn.offsetWidth;

  if (width > 0) {
    indicator.style.transform = `translateX(${left}px)`;
    indicator.style.width = `${width}px`;
    indicator.classList.add('is-visible');
  }
}

export function initFilterPillGliders() {
  const tabsContainers = document.querySelectorAll('.filter-tabs');
  tabsContainers.forEach(container => {
    // Avoid double attaching if already initialized
    if (container.dataset.gliderReady) return;
    container.dataset.gliderReady = 'true';

    const activeBtn = container.querySelector('.filter-tab-btn.active') || container.querySelector('.filter-tab-btn');
    if (activeBtn) {
      setTimeout(() => updateGlider(container, activeBtn), 50);
    }

    container.querySelectorAll('.filter-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.filter-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateGlider(container, btn);
      });
    });
  });

  window.addEventListener('resize', () => {
    tabsContainers.forEach(container => {
      const activeBtn = container.querySelector('.filter-tab-btn.active');
      if (activeBtn) {
        updateGlider(container, activeBtn);
      }
    });
  }, { passive: true });
}

/**
 * Card Stagger Viewport Observer & Gauge Width Trigger
 */
export function initCardStaggerObserver() {
  const cards = document.querySelectorAll('.property-card:not(.observer-attached)');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    let index = 0;
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        obs.unobserve(card);
        setTimeout(() => {
          card.classList.add('is-revealed');
          animateCardGauge(card);
        }, index * 60);
        index++;
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  cards.forEach(card => {
    card.classList.add('observer-attached');
    observer.observe(card);
  });
}

export function animateCardGauge(card) {
  const segs = card.querySelectorAll('.gauge-seg');
  segs.forEach(seg => {
    const targetWidth = seg.dataset.targetWidth || seg.style.width;
    if (targetWidth) {
      seg.dataset.targetWidth = targetWidth;
      seg.style.width = '0%';
      requestAnimationFrame(() => {
        setTimeout(() => {
          seg.style.width = targetWidth;
        }, 80);
      });
    }
  });
}



