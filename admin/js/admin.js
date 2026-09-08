/**
 * NOVACREST HOMES LIMITED — Executive Admin & CMS Controller
 * Manages Articles, Properties, Leads, Data Sync, and Backups
 */

import { requireAuth, getCurrentUser, logout } from './admin-auth.js';
import { 
  getBlogPosts, 
  saveBlogPost, 
  deleteBlogPost, 
  resetBlogPosts, 
  BLOG_CATEGORIES 
} from '../../js/blog-data.js';
import { 
  getProperties, 
  saveProperty, 
  deleteProperty, 
  resetProperties 
} from '../../js/properties-data.js';

// Enforce authentication gate immediately
requireAuth();

document.addEventListener('DOMContentLoaded', () => {
  initUserProfile();
  initNavigationTabs();
  initKPIs();
  initArticlesManager();
  initPropertiesManager();
  initLeadsViewer();
  initDataBackupManager();
});

/* ==========================================================================
   User Profile & Logout
   ========================================================================== */
function initUserProfile() {
  const user = getCurrentUser();
  const nameEl = document.getElementById('adminUserName');
  const roleEl = document.getElementById('adminUserRole');
  const avatarEl = document.getElementById('adminUserAvatar');
  const logoutBtn = document.getElementById('adminLogoutBtn');

  if (user) {
    if (nameEl) nameEl.textContent = user.name;
    if (roleEl) roleEl.textContent = user.role;
    if (avatarEl) {
      const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      avatarEl.textContent = initials;
    }
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Are you sure you wish to log out of the Novacrest Management Portal?')) {
        logout();
      }
    });
  }
}

/* ==========================================================================
   Tab Navigation Routing
   ========================================================================== */
function initNavigationTabs() {
  const navItems = document.querySelectorAll('.admin-nav-item');
  const panels = document.querySelectorAll('.admin-tab-panel');
  const pageTitle = document.getElementById('topbarPageTitle');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const sidebar = document.getElementById('adminSidebar');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = item.getAttribute('data-tab');

      navItems.forEach(n => n.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      item.classList.add('active');
      const targetPanel = document.getElementById(`tab-${targetTab}`);
      if (targetPanel) targetPanel.classList.add('active');

      if (pageTitle) {
        const titleMap = {
          overview: 'Executive Dashboard Overview',
          articles: 'Market Intelligence & Blog Manager',
          properties: 'Portfolio & Developments Catalog',
          leads: 'Investor Consultations & Leads',
          backup: 'System Sync & Data Export'
        };
        pageTitle.textContent = titleMap[targetTab] || 'Novacrest Portal';
      }

      if (sidebar && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
      }

      // Refresh corresponding data when switched
      if (targetTab === 'overview') initKPIs();
      if (targetTab === 'articles') renderArticlesTable();
      if (targetTab === 'properties') renderPropertiesTable();
      if (targetTab === 'leads') renderLeadsTable();
    });
  });

  if (mobileBtn && sidebar) {
    mobileBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
}

/* ==========================================================================
   KPI Counters & Quick Overview
   ========================================================================== */
function initKPIs() {
  const posts = getBlogPosts();
  const properties = getProperties();
  const leads = getStoredLeads();

  const totalArticlesEl = document.getElementById('kpiTotalArticles');
  const totalPropertiesEl = document.getElementById('kpiTotalProperties');
  const totalLeadsEl = document.getElementById('kpiTotalLeads');
  const featuredArticlesEl = document.getElementById('kpiFeaturedArticles');

  if (totalArticlesEl) totalArticlesEl.textContent = posts.length;
  if (totalPropertiesEl) totalPropertiesEl.textContent = properties.length;
  if (totalLeadsEl) totalLeadsEl.textContent = leads.length;
  if (featuredArticlesEl) featuredArticlesEl.textContent = posts.filter(p => p.featured).length;

  // Render recent updates list
  const recentListEl = document.getElementById('recentActivityList');
  if (recentListEl) {
    const recentPosts = posts.slice(0, 3);
    recentListEl.innerHTML = recentPosts.map(p => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--admin-border);">
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="../${p.coverImage}" alt="" style="width: 42px; height: 32px; object-fit: cover; border-radius: 4px;">
          <div>
            <div style="font-weight: 600; color: #fff; font-size: 13.5px;">${p.title}</div>
            <div style="font-size: 11.5px; color: var(--admin-text-muted);">${p.category} • ${p.date}</div>
          </div>
        </div>
        <a href="../article.html?id=${p.slug || p.id}" target="_blank" class="btn-admin btn-admin-secondary btn-admin-sm">
          <span>Preview ↗</span>
        </a>
      </div>
    `).join('');
  }
}

/* ==========================================================================
   Blog & Articles Management
   ========================================================================== */
let articleSearchQuery = '';
let articleCategoryFilter = 'all';

function initArticlesManager() {
  const searchInput = document.getElementById('articleSearchInput');
  const categorySelect = document.getElementById('articleCategorySelect');
  const newBtn = document.getElementById('btnNewArticle');
  const modal = document.getElementById('articleEditorModal');
  const closeModalBtn = document.getElementById('closeArticleModalBtn');
  const cancelModalBtn = document.getElementById('cancelArticleModalBtn');
  const form = document.getElementById('articleEditorForm');
  const titleInput = document.getElementById('modalArticleTitle');
  const slugInput = document.getElementById('modalArticleSlug');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      articleSearchQuery = e.target.value.toLowerCase().trim();
      renderArticlesTable();
    });
  }

  if (categorySelect) {
    categorySelect.innerHTML = `<option value="all">All Categories</option>` +
      BLOG_CATEGORIES.filter(c => c.slug !== 'all').map(c => `<option value="${c.slug}">${c.name}</option>`).join('');
    
    categorySelect.addEventListener('change', (e) => {
      articleCategoryFilter = e.target.value;
      renderArticlesTable();
    });
  }

  // Populate category in modal form
  const modalCatSelect = document.getElementById('modalArticleCategory');
  if (modalCatSelect) {
    modalCatSelect.innerHTML = BLOG_CATEGORIES.filter(c => c.slug !== 'all').map(c => `
      <option value="${c.name}" data-slug="${c.slug}">${c.name}</option>
    `).join('');
  }

  // Populate property link in modal form
  const modalPropSelect = document.getElementById('modalArticleProperty');
  if (modalPropSelect) {
    const props = getProperties();
    modalPropSelect.innerHTML = `<option value="">None (General Market Article)</option>` + 
      props.map(pr => `<option value="${pr.id}">${pr.name} (${pr.district})</option>`).join('');
  }

  // Auto generate slug
  if (titleInput && slugInput) {
    titleInput.addEventListener('input', () => {
      const mode = form.getAttribute('data-mode');
      if (mode === 'create') {
        slugInput.value = generateSlug(titleInput.value);
      }
    });
  }

  if (newBtn && modal) {
    newBtn.addEventListener('click', () => {
      openArticleModalForCreate();
    });
  }

  const closeHandler = () => {
    if (modal) modal.classList.remove('active');
  };
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeHandler);
  if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeHandler);

  // Form submit
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      saveArticleFromModal();
    });
  }

  renderArticlesTable();
}

function renderArticlesTable() {
  const tbody = document.getElementById('articlesTableBody');
  if (!tbody) return;

  const posts = getBlogPosts();
  const filtered = posts.filter(p => {
    const matchesCat = articleCategoryFilter === 'all' || p.categorySlug === articleCategoryFilter;
    const matchesSearch = !articleSearchQuery || 
      p.title.toLowerCase().includes(articleSearchQuery) ||
      p.snippet.toLowerCase().includes(articleSearchQuery) ||
      p.category.toLowerCase().includes(articleSearchQuery);
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 40px; color: var(--admin-text-muted);">
          No articles found matching criteria. Click "+ New Article" to draft one.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(p => `
    <tr>
      <td>
        <img src="../${p.coverImage}" alt="" class="table-thumb" onerror="this.src='../assets/images/masterplan-aerial.jpg'">
      </td>
      <td>
        <span class="table-title-text">${p.title}</span>
        <span class="table-meta-sub">${p.slug || p.id} • By ${p.author?.name || 'Novacrest'}</span>
      </td>
      <td>
        <span class="table-badge table-badge-${p.categorySlug || 'legal'}">${p.category}</span>
      </td>
      <td style="color: var(--admin-text-muted); font-size: 12.5px;">
        ${p.date || 'Recent'}<br>
        <span style="font-size: 11px;">${p.readTime || '5 min'}</span>
      </td>
      <td>
        ${p.featured ? '<span style="color: var(--admin-gold); font-weight: 600; font-size: 12px;">★ Spotlight</span>' : '<span style="color: var(--admin-text-muted); font-size: 12px;">Standard</span>'}
      </td>
      <td>
        <div class="table-actions-cell">
          <button type="button" class="btn-admin btn-admin-secondary btn-admin-sm btn-edit-article" data-id="${p.id}">
            Edit
          </button>
          <a href="../article.html?id=${p.slug || p.id}" target="_blank" class="btn-admin btn-admin-secondary btn-admin-sm">
            View ↗
          </a>
          <button type="button" class="btn-admin btn-admin-danger btn-admin-sm btn-delete-article" data-id="${p.id}" title="Delete">
            ✕
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  // Wire up Edit buttons
  tbody.querySelectorAll('.btn-edit-article').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      openArticleModalForEdit(id);
    });
  });

  // Wire up Delete buttons
  tbody.querySelectorAll('.btn-delete-article').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Are you sure you want to permanently delete this article?')) {
        deleteBlogPost(id);
        renderArticlesTable();
        initKPIs();
        showToast('Article deleted successfully', 'success');
      }
    });
  });
}

function openArticleModalForCreate() {
  const modal = document.getElementById('articleEditorModal');
  const form = document.getElementById('articleEditorForm');
  const titleEl = document.getElementById('modalTitleText');

  form.reset();
  form.setAttribute('data-mode', 'create');
  form.removeAttribute('data-edit-id');
  if (titleEl) titleEl.textContent = 'Create New Market Article';

  document.getElementById('modalArticleCover').value = 'assets/images/masterplan-aerial.jpg';
  document.getElementById('modalArticleAuthor').value = 'Novacrest Research Desk';
  document.getElementById('modalArticleReadTime').value = '6 min read';
  document.getElementById('modalArticleDate').value = 'September 2026';
  document.getElementById('modalArticleSections').value = `### 1. Market Background & Key Highlights\nDetail the latest regulatory or development changes happening in Abuja.\n\n### 2. Cadastral & Legal Considerations\nOutline AGIS compliance, ministerial approvals, and deed perfection.\n\n### 3. Investor Action Plan\nProvide clear recommendations for diaspora and institutional buyers.`;

  modal.classList.add('active');
}

function openArticleModalForEdit(id) {
  const modal = document.getElementById('articleEditorModal');
  const form = document.getElementById('articleEditorForm');
  const titleEl = document.getElementById('modalTitleText');
  const posts = getBlogPosts();
  const post = posts.find(p => p.id === id || p.slug === id);

  if (!post) return;

  form.setAttribute('data-mode', 'edit');
  form.setAttribute('data-edit-id', post.id);
  if (titleEl) titleEl.textContent = `Edit Article: ${post.title}`;

  document.getElementById('modalArticleTitle').value = post.title || '';
  document.getElementById('modalArticleSlug').value = post.slug || post.id || '';
  document.getElementById('modalArticleSubtitle').value = post.subtitle || '';
  document.getElementById('modalArticleCategory').value = post.category || 'Legal & Due Diligence';
  document.getElementById('modalArticleCover').value = post.coverImage || 'assets/images/masterplan-aerial.jpg';
  document.getElementById('modalArticleAuthor').value = post.author?.name || 'Novacrest Research Desk';
  document.getElementById('modalArticleReadTime').value = post.readTime || '6 min read';
  document.getElementById('modalArticleDate').value = post.date || 'September 2026';
  document.getElementById('modalArticleSnippet').value = post.snippet || '';
  document.getElementById('modalArticleTakeaway').value = post.keyTakeaway || '';
  document.getElementById('modalArticleFeatured').checked = !!post.featured;
  document.getElementById('modalArticleProperty').value = post.relatedPropertyId || '';

  // Serialize sections to editable text
  if (post.sections && Array.isArray(post.sections)) {
    const textBlocks = post.sections.map(s => {
      const cleanHeading = s.heading ? `### ${s.heading}\n` : '';
      const cleanContent = (s.content || '').replace(/<p>/g, '').replace(/<\/p>/g, '\n\n').trim();
      return `${cleanHeading}${cleanContent}`;
    }).join('\n\n---\n\n');
    document.getElementById('modalArticleSections').value = textBlocks;
  } else {
    document.getElementById('modalArticleSections').value = '';
  }

  modal.classList.add('active');
}

function saveArticleFromModal() {
  const form = document.getElementById('articleEditorForm');
  const mode = form.getAttribute('data-mode');
  const editId = form.getAttribute('data-edit-id');

  const title = document.getElementById('modalArticleTitle').value.trim();
  const slug = document.getElementById('modalArticleSlug').value.trim() || generateSlug(title);
  const subtitle = document.getElementById('modalArticleSubtitle').value.trim();
  const category = document.getElementById('modalArticleCategory').value;
  const coverImage = document.getElementById('modalArticleCover').value.trim() || 'assets/images/masterplan-aerial.jpg';
  const authorName = document.getElementById('modalArticleAuthor').value.trim() || 'Novacrest Research Desk';
  const readTime = document.getElementById('modalArticleReadTime').value.trim() || '5 min read';
  const date = document.getElementById('modalArticleDate').value.trim() || 'September 2026';
  const snippet = document.getElementById('modalArticleSnippet').value.trim();
  const keyTakeaway = document.getElementById('modalArticleTakeaway').value.trim();
  const featured = document.getElementById('modalArticleFeatured').checked;
  const relatedPropertyId = document.getElementById('modalArticleProperty').value;
  const rawSectionsText = document.getElementById('modalArticleSections').value;

  // Category slug mapper
  const catSlugMap = {
    'Legal & Due Diligence': 'legal',
    'Market Forecast': 'forecast',
    'Diaspora Concierge': 'diaspora',
    'Investment Guide': 'investment'
  };

  // Convert raw text into structured sections
  const sections = parseSectionsFromText(rawSectionsText);

  const postPayload = {
    id: mode === 'edit' ? editId : slug,
    slug,
    title,
    subtitle,
    category,
    categorySlug: catSlugMap[category] || 'legal',
    readTime,
    date,
    isoDate: new Date().toISOString().split('T')[0],
    author: {
      name: authorName,
      role: 'Market Intelligence Advisor',
      avatar: 'assets/images/about-leadership-banner.jpg'
    },
    coverImage,
    snippet,
    keyTakeaway,
    featured,
    relatedPropertyId: relatedPropertyId || null,
    sections
  };

  saveBlogPost(postPayload);

  document.getElementById('articleEditorModal').classList.remove('active');
  renderArticlesTable();
  initKPIs();
  showToast(mode === 'edit' ? 'Article updated successfully!' : 'New article published successfully!', 'success');
}

function parseSectionsFromText(text) {
  if (!text) return [];
  const parts = text.split(/\n\s*---\s*\n/);
  return parts.map(part => {
    const lines = part.trim().split('\n');
    let heading = '';
    let bodyLines = [];

    lines.forEach(line => {
      if (line.startsWith('### ')) {
        heading = line.replace('### ', '').trim();
      } else if (line.startsWith('## ')) {
        heading = line.replace('## ', '').trim();
      } else {
        bodyLines.push(line);
      }
    });

    const bodyHtml = bodyLines.join('\n').trim()
      .split(/\n\n+/)
      .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
      .join('');

    return {
      heading: heading || 'Analysis & Insights',
      content: bodyHtml
    };
  });
}

function generateSlug(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/* ==========================================================================
   Property Management
   ========================================================================== */
function initPropertiesManager() {
  const newBtn = document.getElementById('btnNewProperty');
  const modal = document.getElementById('propertyEditorModal');
  const closeModalBtn = document.getElementById('closePropertyModalBtn');
  const cancelModalBtn = document.getElementById('cancelPropertyModalBtn');
  const form = document.getElementById('propertyEditorForm');

  if (newBtn && modal) {
    newBtn.addEventListener('click', () => {
      openPropertyModalForCreate();
    });
  }

  const closeHandler = () => {
    if (modal) modal.classList.remove('active');
  };
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeHandler);
  if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeHandler);

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      savePropertyFromModal();
    });
  }

  renderPropertiesTable();
}

function renderPropertiesTable() {
  const tbody = document.getElementById('propertiesTableBody');
  if (!tbody) return;

  const props = getProperties();
  tbody.innerHTML = props.map(pr => `
    <tr>
      <td>
        <img src="../${pr.image}" alt="" class="table-thumb" onerror="this.src='../assets/images/nova-crest-palace.jpg'">
      </td>
      <td>
        <span class="table-title-text">${pr.name}</span>
        <span class="table-meta-sub">${pr.district}, Abuja • ${pr.type || 'Residential'}</span>
      </td>
      <td>
        <span style="font-weight: 600; color: var(--admin-gold);">₦${Number(pr.priceNGN || 0).toLocaleString()}</span><br>
        <span style="font-size: 11.5px; color: var(--admin-text-muted);">$${Number(pr.priceUSD || 0).toLocaleString()} USD</span>
      </td>
      <td>
        <span class="table-badge table-badge-forecast">${pr.status || 'Available'}</span>
      </td>
      <td style="color: var(--admin-text-muted); font-size: 12px;">
        ${pr.bedrooms ? pr.bedrooms + ' Beds • ' : ''}${pr.landSize || ''}
      </td>
      <td>
        <div class="table-actions-cell">
          <button type="button" class="btn-admin btn-admin-secondary btn-admin-sm btn-edit-prop" data-id="${pr.id}">
            Edit
          </button>
          <a href="../property.html?id=${pr.id}" target="_blank" class="btn-admin btn-admin-secondary btn-admin-sm">
            View ↗
          </a>
          <button type="button" class="btn-admin btn-admin-danger btn-admin-sm btn-delete-prop" data-id="${pr.id}" title="Delete">
            ✕
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  // Edit listeners
  tbody.querySelectorAll('.btn-edit-prop').forEach(btn => {
    btn.addEventListener('click', () => {
      openPropertyModalForEdit(btn.getAttribute('data-id'));
    });
  });

  // Delete listeners
  tbody.querySelectorAll('.btn-delete-prop').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Are you sure you want to remove this property listing?')) {
        deleteProperty(id);
        renderPropertiesTable();
        initKPIs();
        showToast('Property listing removed', 'success');
      }
    });
  });
}

function openPropertyModalForCreate() {
  const modal = document.getElementById('propertyEditorModal');
  const form = document.getElementById('propertyEditorForm');
  const titleEl = document.getElementById('modalPropTitleText');

  form.reset();
  form.setAttribute('data-mode', 'create');
  form.removeAttribute('data-edit-id');
  if (titleEl) titleEl.textContent = 'Add New Development Listing';

  document.getElementById('modalPropImage').value = 'assets/images/nova-crest-palace.jpg';
  document.getElementById('modalPropStatus').value = 'Available';
  document.getElementById('modalPropType').value = 'Duplex';
  document.getElementById('modalPropDistrict').value = 'Guzape';

  modal.classList.add('active');
}

function openPropertyModalForEdit(id) {
  const modal = document.getElementById('propertyEditorModal');
  const form = document.getElementById('propertyEditorForm');
  const titleEl = document.getElementById('modalPropTitleText');
  const props = getProperties();
  const prop = props.find(p => p.id === id);

  if (!prop) return;

  form.setAttribute('data-mode', 'edit');
  form.setAttribute('data-edit-id', prop.id);
  if (titleEl) titleEl.textContent = `Edit Property: ${prop.name}`;

  document.getElementById('modalPropName').value = prop.name || '';
  document.getElementById('modalPropSubtitle').value = prop.subtitle || '';
  document.getElementById('modalPropDistrict').value = prop.district || 'Maitama';
  document.getElementById('modalPropPriceNGN').value = prop.priceNGN || '';
  document.getElementById('modalPropPriceUSD').value = prop.priceUSD || '';
  document.getElementById('modalPropStatus').value = prop.status || 'Available';
  document.getElementById('modalPropType').value = prop.type || 'Mansion';
  document.getElementById('modalPropBeds').value = prop.bedrooms || '';
  document.getElementById('modalPropBaths').value = prop.bathrooms || '';
  document.getElementById('modalPropLandSize').value = prop.landSize || '';
  document.getElementById('modalPropImage').value = prop.image || 'assets/images/nova-crest-palace.jpg';
  document.getElementById('modalPropDesc').value = prop.description || '';

  modal.classList.add('active');
}

function savePropertyFromModal() {
  const form = document.getElementById('propertyEditorForm');
  const mode = form.getAttribute('data-mode');
  const editId = form.getAttribute('data-edit-id');

  const name = document.getElementById('modalPropName').value.trim();
  const id = mode === 'edit' ? editId : generateSlug(name);
  const subtitle = document.getElementById('modalPropSubtitle').value.trim();
  const district = document.getElementById('modalPropDistrict').value.trim();
  const priceNGN = Number(document.getElementById('modalPropPriceNGN').value) || 0;
  const priceUSD = Number(document.getElementById('modalPropPriceUSD').value) || 0;
  const status = document.getElementById('modalPropStatus').value;
  const type = document.getElementById('modalPropType').value;
  const bedrooms = Number(document.getElementById('modalPropBeds').value) || 4;
  const bathrooms = Number(document.getElementById('modalPropBaths').value) || 4;
  const landSize = document.getElementById('modalPropLandSize').value.trim() || '650 sqm';
  const image = document.getElementById('modalPropImage').value.trim() || 'assets/images/nova-crest-palace.jpg';
  const description = document.getElementById('modalPropDesc').value.trim();

  const propPayload = {
    id,
    name,
    subtitle,
    district,
    priceNGN,
    priceUSD,
    status,
    type,
    bedrooms,
    bathrooms,
    landSize,
    image,
    gallery: [image, "assets/images/your-home-interior.jpg", "assets/images/masterplan-aerial.jpg"],
    description,
    titleStatus: "Certificate of Occupancy (C of O)",
    titleAgency: "FCDA / AGIS Verified"
  };

  saveProperty(propPayload);

  document.getElementById('propertyEditorModal').classList.remove('active');
  renderPropertiesTable();
  initKPIs();
  showToast(mode === 'edit' ? 'Property details updated!' : 'New property added to catalog!', 'success');
}

/* ==========================================================================
   Consultation Inquiries & Leads Viewer
   ========================================================================== */
function getStoredLeads() {
  try {
    const raw = localStorage.getItem('novacrest_leads');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(e);
  }
  return [
    {
      id: 'lead-default-1',
      name: 'Dr. Kelechi Nwosu',
      phone: '+44 7700 900123',
      interest: 'Nova Crest Palace (Maitama)',
      message: 'Looking to purchase a 7-bedroom estate for family relocation from London.',
      source: 'Website Consultation Form',
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: 'lead-default-2',
      name: 'Mrs. Amina Bello',
      phone: '+1 713 555 0192',
      interest: 'Karshi Horizon Plots (Land Banking)',
      message: 'Inquiring about 1,000 sqm parcel coordinates and milestone payment structure from Houston.',
      source: 'WhatsApp Advisory Button',
      timestamp: new Date(Date.now() - 3600000 * 18).toISOString()
    }
  ];
}

function initLeadsViewer() {
  const clearBtn = document.getElementById('btnClearLeads');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Clear all consultation lead records? This cannot be undone.')) {
        localStorage.removeItem('novacrest_leads');
        renderLeadsTable();
        initKPIs();
        showToast('Lead records cleared', 'info');
      }
    });
  }
  renderLeadsTable();
}

function renderLeadsTable() {
  const tbody = document.getElementById('leadsTableBody');
  if (!tbody) return;

  const leads = getStoredLeads();
  if (leads.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 40px; color: var(--admin-text-muted);">
          No consultation leads recorded yet. As visitors submit inquiries via the website, they will appear here.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = leads.map(lead => {
    const waText = encodeURIComponent(`Hello ${lead.name}, regarding your inquiry for ${lead.interest} with Novacrest Homes Ltd:`);
    const waLink = `https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${waText}`;
    const formattedDate = new Date(lead.timestamp).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return `
      <tr>
        <td>
          <div style="font-weight: 600; color: #fff;">${lead.name}</div>
          <div style="font-size: 11.5px; color: var(--admin-gold);">${lead.source || 'Website Lead'}</div>
        </td>
        <td style="color: #fff; font-family: monospace;">
          ${lead.phone}
        </td>
        <td>
          <div style="font-weight: 500; color: #fff; font-size: 13px;">${lead.interest}</div>
          <div style="font-size: 12px; color: var(--admin-text-muted); max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${lead.message || ''}</div>
        </td>
        <td style="color: var(--admin-text-muted); font-size: 12px;">
          ${formattedDate}
        </td>
        <td>
          <a href="${waLink}" target="_blank" rel="noopener" class="btn-admin btn-admin-gold btn-admin-sm">
            <span>WhatsApp Client ↗</span>
          </a>
        </td>
      </tr>
    `;
  }).join('');
}

/* ==========================================================================
   Data Backup & Sync
   ========================================================================== */
function initDataBackupManager() {
  const exportJsonBtn = document.getElementById('btnExportJson');
  const exportJsBtn = document.getElementById('btnExportJs');
  const resetBtn = document.getElementById('btnResetFactory');

  if (exportJsonBtn) {
    exportJsonBtn.addEventListener('click', () => {
      const data = {
        exportedAt: new Date().toISOString(),
        blogPosts: getBlogPosts(),
        properties: getProperties(),
        leads: getStoredLeads()
      };
      downloadFile(JSON.stringify(data, null, 2), `novacrest-data-backup-${Date.now()}.json`, 'application/json');
      showToast('Data exported successfully!', 'success');
    });
  }

  if (exportJsBtn) {
    exportJsBtn.addEventListener('click', () => {
      const posts = getBlogPosts();
      const fileContent = `/**\n * NOVACREST HOMES LIMITED - Blog & Market Intelligence Dataset\n * Generated via Executive Admin CMS at ${new Date().toISOString()}\n */\n\nexport const BLOG_POSTS = ${JSON.stringify(posts, null, 2)};\n`;
      downloadFile(fileContent, 'blog-data.js', 'text/javascript');
      showToast('blog-data.js generated and downloaded!', 'success');
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all articles and property modifications back to factory seed data?')) {
        resetBlogPosts();
        resetProperties();
        initKPIs();
        renderArticlesTable();
        renderPropertiesTable();
        showToast('Reset to factory defaults completed', 'info');
      }
    });
  }
}

function downloadFile(content, fileName, contentType) {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}

/* ==========================================================================
   Toast Notification Engine
   ========================================================================== */
function showToast(message, type = 'gold') {
  let container = document.getElementById('adminToastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'adminToastContainer';
    container.className = 'admin-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `admin-toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
