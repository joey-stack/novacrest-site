/**
 * NOVACREST HOMES LIMITED - Blog & Article Reader Controller
 * Powers blog.html (archive, search, filters) and article.html (reader, related posts)
 */

import { getBlogPosts, BLOG_CATEGORIES } from './blog-data.js';
import { PROPERTIES } from './properties-data.js';

let BLOG_POSTS = getBlogPosts();

document.addEventListener('DOMContentLoaded', () => {
  const isBlogArchive = !!document.getElementById('blogGridContainer');
  const isArticleReader = !!document.getElementById('articleContentRoot');

  if (isBlogArchive) {
    initBlogArchive();
  }

  if (isArticleReader) {
    initArticleReader();
  }
});

/* ==========================================================================
   Blog Archive Controller (blog.html)
   ========================================================================== */
function initBlogArchive() {
  const gridContainer = document.getElementById('blogGridContainer');
  const featuredContainer = document.getElementById('blogFeaturedContainer');
  const tabsContainer = document.getElementById('blogFilterTabs');
  const searchInput = document.getElementById('blogSearchInput');
  const countDisplay = document.getElementById('blogArticlesCount');

  let activeCategory = 'all';
  let searchQuery = '';

  // Render category tabs
  if (tabsContainer) {
    tabsContainer.innerHTML = BLOG_CATEGORIES.map(cat => `
      <button class="filter-tab-btn ${cat.slug === activeCategory ? 'active' : ''}" data-category="${cat.slug}">
        ${cat.name}
      </button>
    `).join('');

    tabsContainer.querySelectorAll('.filter-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        tabsContainer.querySelectorAll('.filter-tab-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        activeCategory = e.currentTarget.dataset.category;
        renderArchive();
      });
    });
  }

  // Search input listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderArchive();
    });
  }

  function renderArchive() {
    BLOG_POSTS = getBlogPosts();
    let filtered = BLOG_POSTS.filter(post => {
      const matchesCat = activeCategory === 'all' || post.categorySlug === activeCategory;
      const matchesSearch = !searchQuery || 
        post.title.toLowerCase().includes(searchQuery) ||
        post.snippet.toLowerCase().includes(searchQuery) ||
        post.category.toLowerCase().includes(searchQuery);
      return matchesCat && matchesSearch;
    });

    if (countDisplay) {
      countDisplay.textContent = `Showing ${filtered.length} article${filtered.length === 1 ? '' : 's'}`;
    }

    // Render Featured Post Spotlight (only when on 'all' and no search)
    if (featuredContainer) {
      if (activeCategory === 'all' && !searchQuery) {
        const featuredPost = BLOG_POSTS.find(p => p.featured) || BLOG_POSTS[0];
        featuredContainer.style.display = 'block';
        featuredContainer.innerHTML = `
          <div class="blog-featured-card">
            <div class="featured-media">
              <img src="${featuredPost.coverImage}" alt="${featuredPost.title}" loading="lazy">
              <span class="status-badge" style="position: absolute; top: 16px; left: 16px; z-index: 2;">Spotlight Intelligence</span>
            </div>
            <div class="featured-content">
              <div class="insight-meta">
                <span class="insight-badge">${featuredPost.category}</span>
                <span class="insight-time">${featuredPost.readTime} • ${featuredPost.date}</span>
              </div>
              <h2 class="featured-title">
                <a href="article.html?id=${featuredPost.id}">${featuredPost.title}</a>
              </h2>
              <p class="featured-snippet">${featuredPost.snippet}</p>
              
              <div class="featured-takeaway">
                <strong>Executive Takeaway:</strong> ${featuredPost.keyTakeaway}
              </div>

              <div class="featured-footer">
                <div class="author-mini">
                  <div class="author-name">${featuredPost.author.name}</div>
                  <div class="author-role">${featuredPost.author.role}</div>
                </div>
                <a href="article.html?id=${featuredPost.id}" class="btn btn-primary btn-sm">
                  <span>Read Full Dossier</span>
                  <span class="btn-arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        `;
      } else {
        featuredContainer.style.display = 'none';
      }
    }

    // Render Grid
    if (gridContainer) {
      if (filtered.length === 0) {
        gridContainer.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; background: var(--color-white); border: 1px solid var(--color-slate-200); border-radius: var(--radius-card);">
            <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem; color: var(--color-ink-900);">No articles found matching your criteria</h3>
            <p style="color: var(--color-slate-500); margin-bottom: 1.5rem;">Try adjusting your search terms or selecting 'All Articles'.</p>
            <button class="btn btn-secondary btn-sm" id="resetBlogFiltersBtn">
              <span>View All Articles</span>
            </button>
          </div>
        `;
        document.getElementById('resetBlogFiltersBtn')?.addEventListener('click', () => {
          activeCategory = 'all';
          searchQuery = '';
          if (searchInput) searchInput.value = '';
          tabsContainer?.querySelectorAll('.filter-tab-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.category === 'all');
          });
          renderArchive();
        });
        return;
      }

      // Filter out featured post if on 'all' view to avoid visual duplicate
      const displayPosts = (activeCategory === 'all' && !searchQuery) 
        ? filtered.filter(p => !p.featured) 
        : filtered;

      gridContainer.innerHTML = displayPosts.map(post => `
        <article class="blog-card">
          <a href="article.html?id=${post.id}" class="blog-card-media-link" aria-label="${post.title}">
            <div class="blog-card-media">
              <img src="${post.coverImage}" alt="${post.title}" loading="lazy">
              <span class="property-chip">${post.category}</span>
            </div>
          </a>
          <div class="blog-card-body">
            <div class="insight-meta">
              <span class="insight-time">${post.readTime} • ${post.date}</span>
            </div>
            <h3 class="blog-card-title">
              <a href="article.html?id=${post.id}">${post.title}</a>
            </h3>
            <p class="blog-card-snippet">${post.snippet}</p>
            
            <div class="blog-card-footer">
              <span class="blog-author-byline">By ${post.author.name}</span>
              <a href="article.html?id=${post.id}" class="blog-read-btn">
                <span>Read</span>
                <span class="btn-arrow">→</span>
              </a>
            </div>
          </div>
        </article>
      `).join('');
    }
  }

  renderArchive();
}

/* ==========================================================================
   Article Reader Controller (article.html)
   ========================================================================== */
function initArticleReader() {
  BLOG_POSTS = getBlogPosts();
  const params = new URLSearchParams(window.location.search);
  const postId = params.get('id') || params.get('slug') || BLOG_POSTS[0].id;

  const post = BLOG_POSTS.find(p => p.id === postId || p.slug === postId) || BLOG_POSTS[0];

  // Update Page Meta
  document.title = `${post.title} | Novacrest Homes Ltd Market Intelligence`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', post.snippet);

  // Update Breadcrumb
  const breadcrumbCurrent = document.getElementById('articleBreadcrumbCurrent');
  if (breadcrumbCurrent) breadcrumbCurrent.textContent = post.title;

  // Header Elements
  const catEl = document.getElementById('articleCategoryBadge');
  const titleEl = document.getElementById('articleTitle');
  const subtitleEl = document.getElementById('articleSubtitle');
  const metaEl = document.getElementById('articleMetaDetails');
  const coverImg = document.getElementById('articleCoverImage');
  const bodyRoot = document.getElementById('articleBodyRoot');

  if (catEl) catEl.textContent = post.category;
  if (titleEl) titleEl.textContent = post.title;
  if (subtitleEl) subtitleEl.textContent = post.subtitle;
  if (metaEl) {
    metaEl.innerHTML = `
      <div class="article-author-pill">
        <div class="author-avatar-circle">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        </div>
        <div>
          <strong style="color:var(--color-ink-950); display:block;">${post.author.name}</strong>
          <span style="font-size:12px; color:var(--color-slate-500);">${post.author.role}</span>
        </div>
      </div>
      <div class="article-date-read">
        <span>Published ${post.date}</span>
        <span>•</span>
        <span>${post.readTime}</span>
      </div>
    `;
  }

  if (coverImg) {
    coverImg.src = post.coverImage;
    coverImg.alt = post.title;
  }

  // Render Full Content Sections
  if (bodyRoot) {
    let sectionsHtml = '';

    if (post.keyTakeaway) {
      sectionsHtml += `
        <div class="article-takeaway-banner">
          <div class="takeaway-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
          </div>
          <div>
            <div class="takeaway-label">EXECUTIVE ADVISORY SUMMARY</div>
            <p class="takeaway-text">${post.keyTakeaway}</p>
          </div>
        </div>
      `;
    }

    post.sections.forEach(sec => {
      sectionsHtml += `
        <section class="article-section-block">
          <h3 class="article-section-heading">${sec.heading}</h3>
          <div class="article-section-text">${sec.content}</div>
        </section>
      `;
    });

    bodyRoot.innerHTML = sectionsHtml;
  }

  // Render Related Property in Sidebar
  const relatedPropContainer = document.getElementById('articleRelatedPropertyContainer');
  if (relatedPropContainer && post.relatedPropertyId) {
    const prop = PROPERTIES.find(p => p.id === post.relatedPropertyId);
    if (prop) {
      relatedPropContainer.innerHTML = `
        <div class="article-property-spotlight">
          <span class="spotlight-badge">Featured Property in This Report</span>
          <img src="${prop.image}" alt="${prop.name}" class="spotlight-thumb" loading="lazy">
          <h4 class="spotlight-name">${prop.name}</h4>
          <p class="spotlight-loc">${prop.district} • ${prop.type}</p>
          <div class="spotlight-price">${prop.monthlyPayment || 'Verified FCDA Title'}</div>
          <a href="property.html?id=${prop.id}" class="btn btn-primary btn-sm" style="width:100%; margin-top:0.75rem;">
            <span>View Development</span>
            <span class="btn-arrow">→</span>
          </a>
        </div>
      `;
    }
  }

  // Pre-fill WhatsApp Advisory Link
  const waAdvisoryBtn = document.getElementById('articleWaAdvisoryBtn');
  if (waAdvisoryBtn) {
    const waText = encodeURIComponent(`Hello Novacrest Homes Ltd, I read your article "${post.title}" and would like to speak with an advisor about property acquisition in Abuja.`);
    waAdvisoryBtn.href = `https://wa.me/2348166800142?text=${waText}`;
  }

  // Render Related Articles (Bottom)
  const relatedGrid = document.getElementById('articleRelatedGrid');
  if (relatedGrid) {
    const otherPosts = BLOG_POSTS.filter(p => p.id !== post.id).slice(0, 3);
    relatedGrid.innerHTML = otherPosts.map(op => `
      <article class="blog-card">
        <a href="article.html?id=${op.id}" class="blog-card-media-link">
          <div class="blog-card-media">
            <img src="${op.coverImage}" alt="${op.title}" loading="lazy">
            <span class="property-chip">${op.category}</span>
          </div>
        </a>
        <div class="blog-card-body">
          <div class="insight-meta">
            <span class="insight-time">${op.readTime} • ${op.date}</span>
          </div>
          <h4 class="blog-card-title" style="font-size:1.1rem;">
            <a href="article.html?id=${op.id}">${op.title}</a>
          </h4>
          <p class="blog-card-snippet" style="font-size:0.85rem;">${op.snippet}</p>
          <div class="blog-card-footer" style="margin-top:auto;">
            <span class="blog-author-byline">${op.category}</span>
            <a href="article.html?id=${op.id}" class="blog-read-btn">
              <span>Read</span>
              <span class="btn-arrow">→</span>
            </a>
          </div>
        </div>
      </article>
    `).join('');
  }

  // Share Actions
  initSocialShares(post);
}

function initSocialShares(post) {
  const currentUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(post.title);

  const waShare = document.getElementById('shareWhatsAppBtn');
  const liShare = document.getElementById('shareLinkedInBtn');
  const twShare = document.getElementById('shareTwitterBtn');
  const copyBtn = document.getElementById('copyArticleLinkBtn');

  if (waShare) {
    waShare.href = `https://wa.me/?text=${shareTitle}%20${currentUrl}`;
  }
  if (liShare) {
    liShare.href = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`;
  }
  if (twShare) {
    twShare.href = `https://twitter.com/intent/tweet?text=${shareTitle}&url=${currentUrl}`;
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(window.location.href).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `<span>✓ Copied</span>`;
        copyBtn.style.color = '#10b981';
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
          copyBtn.style.color = '';
        }, 2000);
      });
    });
  }
}
