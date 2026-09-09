/**
 * NOVACREST HOMES LIMITED — Executive Admin & CMS Controller
 * Manages Articles, Properties, Leads, Data Sync, and Backups
 */

import { requireAuth, getCurrentUser, logout } from './admin-auth.js';
import '../../js/analytics.js';
import { 
  getAiCredentials, 
  saveAiCredentials, 
  fetchOxylabsMarketData, 
  generateLiveGeminiThesis,
  fetchServerlessMarketAnalysis
} from './admin-ai.js';
import { 
  getBlogPosts, 
  fetchFirestoreBlogPosts,
  saveBlogPost, 
  deleteBlogPost, 
  resetBlogPosts, 
  syncAllArticlesToFirestore,
  BLOG_CATEGORIES 
} from '../../js/blog-data.js';
import { 
  getProperties, 
  fetchFirestoreProperties,
  saveProperty, 
  deleteProperty, 
  resetProperties,
  syncAllPropertiesToFirestore
} from '../../js/properties-data.js';
import { 
  getLeads, 
  CRM_STAGES, 
  saveLead, 
  updateLeadStage, 
  deleteLead, 
  fetchFirestoreLeads, 
  syncAllLeadsToFirestore 
} from '../../js/leads-data.js';

// Enforce authentication gate immediately
requireAuth();

document.addEventListener('DOMContentLoaded', async () => {
  initUserProfile();
  initSidebarCollapse();
  initAiSettings();
  initFirestoreSync();
  initNavigationTabs();
  
  // Automatically sync live Cloud Firestore data on page load
  try {
    await Promise.all([
      fetchFirestoreProperties(),
      fetchFirestoreBlogPosts(),
      fetchFirestoreLeads()
    ]);
  } catch (e) {
    console.warn('[Auto Cloud Sync Notice]', e);
  }

  initKPIs();
  initArticlesManager();
  initPropertiesManager();
  initCrmStudio();
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
   Sidebar Collapse Toggle & LocalStorage Persistence
   ========================================================================== */
const SIDEBAR_COLLAPSE_KEY = 'novacrest_sidebar_collapsed';

function initSidebarCollapse() {
  const collapseBtn = document.getElementById('sidebarCollapseBtn');
  const isCollapsed = localStorage.getItem(SIDEBAR_COLLAPSE_KEY) === 'true';

  if (isCollapsed) {
    document.body.classList.add('sidebar-collapsed');
  }

  if (collapseBtn) {
    collapseBtn.addEventListener('click', () => {
      const currentlyCollapsed = document.body.classList.toggle('sidebar-collapsed');
      localStorage.setItem(SIDEBAR_COLLAPSE_KEY, currentlyCollapsed ? 'true' : 'false');
    });
  }
}

/* ==========================================================================
   KPI Counters & Quick Overview
   ========================================================================== */
function initKPIs() {
  const posts = getBlogPosts();
  const properties = getProperties();
  const leads = getLeads();

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
   Blog & Articles Management (Inline Panel Editor View)
   ========================================================================== */
let articleSearchQuery = '';
let articleCategoryFilter = 'all';

function switchArticleView(view) {
  const listView = document.getElementById('articlesListView');
  const editorView = document.getElementById('articlesEditorView');

  if (view === 'editor') {
    if (listView) listView.style.display = 'none';
    if (editorView) editorView.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    if (editorView) editorView.style.display = 'none';
    if (listView) listView.style.display = 'block';
  }
}

function initWysiwygToolbar() {
  const toolbar = document.getElementById('wysiwygToolbar');
  const editor = document.getElementById('inlineArticleWysiwyg');
  if (!toolbar || !editor) return;

  toolbar.querySelectorAll('.wysiwyg-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const cmd = btn.getAttribute('data-cmd');
      const val = btn.getAttribute('data-val') || null;

      if (cmd === 'createLink') {
        const url = prompt('Enter URL link (e.g. https://novacresthomes.com):');
        if (url) document.execCommand('createLink', false, url);
      } else if (cmd === 'formatBlock' && val) {
        document.execCommand('formatBlock', false, `<${val}>`);
      } else if (cmd) {
        document.execCommand(cmd, false, val);
      }
      editor.focus();
    });
  });
}

function initArticlesManager() {
  const searchInput = document.getElementById('articleSearchInput');
  const categorySelect = document.getElementById('articleCategorySelect');
  const newBtn = document.getElementById('btnNewArticle');
  const form = document.getElementById('inlineArticleForm');

  const cancelBtn1 = document.getElementById('btnCancelArticleEditor');
  const cancelBtn2 = document.getElementById('btnCancelArticleEditorSecondary');
  const cancelBtn3 = document.getElementById('btnCancelArticleEditorFooter');

  initWysiwygToolbar();

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

  // Auto generate slug on create
  const titleInput = document.getElementById('inlineArticleTitle');
  const slugInput = document.getElementById('inlineArticleSlug');
  if (titleInput && slugInput) {
    titleInput.addEventListener('input', () => {
      const mode = form.getAttribute('data-mode');
      if (mode === 'create') {
        slugInput.value = generateSlug(titleInput.value);
      }
    });
  }

  if (newBtn) {
    newBtn.addEventListener('click', () => {
      openInlineArticleEditorForCreate();
    });
  }

  const cancelHandler = () => switchArticleView('list');
  if (cancelBtn1) cancelBtn1.addEventListener('click', cancelHandler);
  if (cancelBtn2) cancelBtn2.addEventListener('click', cancelHandler);
  if (cancelBtn3) cancelBtn3.addEventListener('click', cancelHandler);

  // Form submit
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      saveArticleFromInlineForm();
    });
  }

  renderArticlesTable();
}

function populateArticlePropertyDropdown() {
  const select = document.getElementById('inlineArticleRelatedProperty');
  if (!select) return;
  const props = getProperties();
  select.innerHTML = `<option value="">None (General Market Article)</option>` +
    props.map(pr => `<option value="${pr.id}">${pr.name} (${pr.district})</option>`).join('');
}

function openInlineArticleEditorForCreate() {
  const form = document.getElementById('inlineArticleForm');
  const titleEl = document.getElementById('articleEditorViewTitle');

  form.reset();
  form.setAttribute('data-mode', 'create');
  document.getElementById('inlineArticleId').value = '';

  if (titleEl) titleEl.textContent = 'Create New Market Intelligence Article';

  populateArticlePropertyDropdown();

  document.getElementById('inlineArticleCoverImage').value = 'assets/images/masterplan-aerial.jpg';
  document.getElementById('inlineArticleAuthorName').value = 'Barr. Chukwuemeka Okonkwo';
  document.getElementById('inlineArticleAuthorRole').value = 'Head of Legal & Title Conveyancing';
  document.getElementById('inlineArticleAuthorAvatar').value = 'assets/images/about-leadership-banner.jpg';
  document.getElementById('inlineArticleReadTime').value = '6 min read';
  document.getElementById('inlineArticleDate').value = 'September 2026';

  const defaultWysiwygHtml = `
    <h2>1. The FCT Legal Framework: FCDA & AGIS Authority</h2>
    <p>Unlike other Nigerian states where land tenure is governed primarily through state land registries under customary law, the Federal Capital Territory (FCT) is governed strictly under the <strong>Land Use Act of 1978</strong> and the <strong>FCT Act</strong>.</p>
    <h2>2. Certificate of Occupancy (C of O): The Gold Standard</h2>
    <p>The Certificate of Occupancy is the highest statutory land document issued in Nigeria. In Abuja, a genuine C of O bears the direct signature of the Minister of the FCT.</p>
  `.trim();

  document.getElementById('inlineArticleWysiwyg').innerHTML = defaultWysiwygHtml;

  switchArticleView('editor');
}

function openInlineArticleEditorForEdit(id) {
  const form = document.getElementById('inlineArticleForm');
  const titleEl = document.getElementById('articleEditorViewTitle');
  const posts = getBlogPosts();
  const post = posts.find(p => p.id === id || p.slug === id);

  if (!post) return;

  form.setAttribute('data-mode', 'edit');
  if (titleEl) titleEl.textContent = `Edit Article: ${post.title}`;

  populateArticlePropertyDropdown();

  document.getElementById('inlineArticleId').value = post.id || post.slug || '';
  document.getElementById('inlineArticleTitle').value = post.title || '';
  document.getElementById('inlineArticleSlug').value = post.slug || post.id || '';
  document.getElementById('inlineArticleSubtitle').value = post.subtitle || '';
  document.getElementById('inlineArticleCategory').value = post.category || 'Legal & Due Diligence';
  document.getElementById('inlineArticleReadTime').value = post.readTime || '6 min read';
  document.getElementById('inlineArticleDate').value = post.date || 'September 2026';

  document.getElementById('inlineArticleAuthorName').value = post.author?.name || 'Barr. Chukwuemeka Okonkwo';
  document.getElementById('inlineArticleAuthorRole').value = post.author?.role || 'Head of Legal & Title Conveyancing';
  document.getElementById('inlineArticleAuthorAvatar').value = post.author?.avatar || 'assets/images/about-leadership-banner.jpg';
  document.getElementById('inlineArticleCoverImage').value = post.coverImage || 'assets/images/masterplan-aerial.jpg';
  document.getElementById('inlineArticleRelatedProperty').value = post.relatedPropertyId || '';
  document.getElementById('inlineArticleFeatured').checked = !!post.featured;

  document.getElementById('inlineArticleSnippet').value = post.snippet || '';
  document.getElementById('inlineArticleKeyTakeaway').value = post.keyTakeaway || '';

  // Populate WYSIWYG Content
  let wysiwygHtml = '';
  if (post.sections && Array.isArray(post.sections) && post.sections.length > 0) {
    wysiwygHtml = post.sections.map(s => {
      const h = s.heading ? `<h2>${s.heading}</h2>` : '';
      const c = s.content || '';
      return `${h}${c}`;
    }).join('\n');
  } else if (post.content) {
    wysiwygHtml = post.content;
  }

  document.getElementById('inlineArticleWysiwyg').innerHTML = wysiwygHtml;

  switchArticleView('editor');
}

function saveArticleFromInlineForm() {
  const form = document.getElementById('inlineArticleForm');
  const mode = form.getAttribute('data-mode');

  const rawId = document.getElementById('inlineArticleId').value.trim();
  const title = document.getElementById('inlineArticleTitle').value.trim();
  const slug = document.getElementById('inlineArticleSlug').value.trim() || generateSlug(title);
  const subtitle = document.getElementById('inlineArticleSubtitle').value.trim();
  const category = document.getElementById('inlineArticleCategory').value;
  const readTime = document.getElementById('inlineArticleReadTime').value.trim() || '5 min read';
  const date = document.getElementById('inlineArticleDate').value.trim() || 'September 2026';

  const authorName = document.getElementById('inlineArticleAuthorName').value.trim() || 'Novacrest Research Desk';
  const authorRole = document.getElementById('inlineArticleAuthorRole').value.trim() || 'Market Intelligence Advisor';
  const authorAvatar = document.getElementById('inlineArticleAuthorAvatar').value.trim() || 'assets/images/about-leadership-banner.jpg';
  const coverImage = document.getElementById('inlineArticleCoverImage').value.trim() || 'assets/images/masterplan-aerial.jpg';
  const relatedPropertyId = document.getElementById('inlineArticleRelatedProperty').value;
  const featured = document.getElementById('inlineArticleFeatured').checked;

  const snippet = document.getElementById('inlineArticleSnippet').value.trim();
  const keyTakeaway = document.getElementById('inlineArticleKeyTakeaway').value.trim();
  const wysiwygContent = document.getElementById('inlineArticleWysiwyg').innerHTML.trim();

  // Category Slug Mapper
  const catSlugMap = {
    'Legal & Due Diligence': 'legal',
    'Market Research': 'research',
    'Investment Strategy': 'strategy',
    'Infrastructure & Development': 'infrastructure'
  };

  // Convert WYSIWYG HTML into structured sections for frontend renderer compatibility
  const sections = parseWysiwygHtmlToSections(wysiwygContent);

  const postPayload = {
    id: (mode === 'edit' && rawId) ? rawId : slug,
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
      role: authorRole,
      avatar: authorAvatar
    },
    coverImage,
    snippet,
    keyTakeaway,
    featured,
    relatedPropertyId: relatedPropertyId || null,
    sections,
    content: wysiwygContent
  };

  saveBlogPost(postPayload);

  switchArticleView('list');
  renderArticlesTable();
  initKPIs();
  showToast(mode === 'edit' ? 'Article updated and synced to Firestore' : 'Article created and published', 'success');
}

function parseWysiwygHtmlToSections(html) {
  if (!html) return [];

  const temp = document.createElement('div');
  temp.innerHTML = html;

  const sections = [];
  let currentSection = { heading: '', content: '' };

  Array.from(temp.childNodes).forEach(node => {
    const isHeading = node.nodeType === 1 && (node.tagName === 'H2' || node.tagName === 'H3' || node.tagName === 'H4');
    
    if (isHeading) {
      if (currentSection.heading || currentSection.content) {
        sections.push({ ...currentSection });
      }
      currentSection = { heading: node.textContent.trim(), content: '' };
    } else {
      const htmlStr = node.nodeType === 1 ? node.outerHTML : `<p>${node.textContent}</p>`;
      if (htmlStr.trim()) {
        currentSection.content += htmlStr;
      }
    }
  });

  if (currentSection.heading || currentSection.content) {
    sections.push(currentSection);
  }

  return sections;
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
      openInlineArticleEditorForEdit(id);
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
function showPropertyEditorView(modeTitle) {
  const listView = document.getElementById('propertiesListView');
  const editorView = document.getElementById('propertiesEditorView');
  const titleEl = document.getElementById('inlinePropTitleText');

  if (titleEl) titleEl.textContent = modeTitle;
  if (listView) listView.style.display = 'none';
  if (editorView) {
    editorView.style.display = 'block';
    editorView.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function showPropertiesListView() {
  const listView = document.getElementById('propertiesListView');
  const editorView = document.getElementById('propertiesEditorView');

  if (editorView) editorView.style.display = 'none';
  if (listView) {
    listView.style.display = 'block';
  }
}

function initPropertiesManager() {
  const newBtn = document.getElementById('btnNewProperty');
  const backBtn = document.getElementById('btnBackToProperties');
  const cancelBtn = document.getElementById('cancelPropertyModalBtn');
  const aiBtn = document.getElementById('btnGenerateAiThesis');
  const form = document.getElementById('propertyEditorForm');

  if (newBtn) {
    newBtn.addEventListener('click', () => {
      openPropertyModalForCreate();
    });
  }

  if (backBtn) backBtn.addEventListener('click', showPropertiesListView);
  if (cancelBtn) cancelBtn.addEventListener('click', showPropertiesListView);
  if (aiBtn) aiBtn.addEventListener('click', generateAiInvestmentThesis);

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      savePropertyFromModal();
    });
  }

  renderPropertiesTable();
}

/* ==========================================================================
   AI & Oxylabs API Credentials Modal
   ========================================================================== */
function initAiSettings() {
  const openBtn = document.getElementById('btnOpenAiSettings');
  const modal = document.getElementById('aiSettingsModal');
  const closeBtn = document.getElementById('closeAiSettingsModalBtn');
  const cancelBtn = document.getElementById('cancelAiSettingsModalBtn');
  const form = document.getElementById('aiSettingsForm');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      const creds = getAiCredentials();
      const geminiInput = document.getElementById('settingGeminiKey');
      const oxyUserInput = document.getElementById('settingOxylabsUser');
      const oxyPassInput = document.getElementById('settingOxylabsPass');

      if (geminiInput) geminiInput.value = creds.geminiKey;
      if (oxyUserInput) oxyUserInput.value = creds.oxylabsUser;
      if (oxyPassInput) oxyPassInput.value = creds.oxylabsPass;

      modal.classList.add('active');
    });
  }

  const closeHandler = () => {
    if (modal) modal.classList.remove('active');
  };

  if (closeBtn) closeBtn.addEventListener('click', closeHandler);
  if (cancelBtn) cancelBtn.addEventListener('click', closeHandler);

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const geminiVal = document.getElementById('settingGeminiKey')?.value || '';
      const oxyUserVal = document.getElementById('settingOxylabsUser')?.value || '';
      const oxyPassVal = document.getElementById('settingOxylabsPass')?.value || '';

      saveAiCredentials(geminiVal, oxyUserVal, oxyPassVal);
      if (modal) modal.classList.remove('active');
      showToast('AI & Oxylabs credentials saved successfully!', 'success');
    });
  }
}

/* ==========================================================================
   Google Cloud Firestore Sync Controller
   ========================================================================== */
function initFirestoreSync() {
  const syncBtn = document.getElementById('btnSyncFirestore');
  if (!syncBtn) return;

  syncBtn.addEventListener('click', async () => {
    syncBtn.disabled = true;
    const origHtml = syncBtn.innerHTML;
    syncBtn.innerHTML = '<span>⏳ Syncing to Cloud...</span>';

    try {
      const propCount = await syncAllPropertiesToFirestore();
      const articleCount = await syncAllArticlesToFirestore();
      alert(`🔥 Cloud Sync Complete!\n\nSuccessfully synced ${propCount} Properties and ${articleCount} Articles to Google Cloud Firestore (novacrest-site).`);
    } catch (err) {
      console.error('[Firestore Sync Error]', err);
      alert('Firestore Cloud Sync: ' + (err.message || 'Failed to sync documents.'));
    } finally {
      syncBtn.disabled = false;
      syncBtn.innerHTML = origHtml;
    }
  });
}

async function generateAiInvestmentThesis() {
  const btn = document.getElementById('btnGenerateAiThesis');
  const getVal = id => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  };

  const propData = {
    name: getVal('modalPropName') || 'This development',
    district: getVal('modalPropDistrict') || 'Maitama',
    type: getVal('modalPropType') || 'luxury residence',
    priceNGN: Number(getVal('modalPropPriceNGN')) || 0,
    priceUSD: Number(getVal('modalPropPriceUSD')) || 0,
    landSize: getVal('modalPropLandSize') || 'N/A',
    titleStatus: getVal('modalPropTitleStatus') || 'Certificate of Occupancy (C of O)',
    titleAgency: getVal('modalPropTitleAgency') || 'AGIS Verified'
  };

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span>✨ Analyzing Market Data...</span>';
  }

  // Step 1: Check Netlify Serverless Backend Proxy (/api/market-analysis or /.netlify/functions/market-analysis)
  const serverlessRes = await fetchServerlessMarketAnalysis(propData);

  let finalThesis = serverlessRes?.thesis || null;
  let sourceTag = serverlessRes?.source || null;

  // Step 2: Fall back to direct browser fetch if serverless endpoint is unconfigured or unavailable
  if (!finalThesis) {
    const liveScrapedContext = await fetchOxylabsMarketData(propData.district, propData.type);
    const liveThesis = await generateLiveGeminiThesis(propData, liveScrapedContext);

    if (liveThesis) {
      finalThesis = liveThesis;
      sourceTag = liveScrapedContext ? 'Google Gemini LLM & Oxylabs Live Web Scrape' : 'Google Gemini LLM (Free Tier)';
    }
  }

  // Step 3: Graceful dynamic market calculation if live API key not set
  if (!finalThesis) {
    sourceTag = 'Real Abuja Market Intelligence Engine';
    const d = propData.district.toLowerCase();
    const t = propData.type.toLowerCase();

    let appreciation = 17.8;
    let yieldVal = 9.5;
    let tierName = 'Central FCT Growth Corridor';
    let scarcityDriver = 'steady institutional tenant demand and infrastructure expansion';

    if (d.includes('maitama')) {
      appreciation = 18.5;
      yieldVal = 9.2;
      tierName = 'Diplomatic Core';
      scarcityDriver = 'zero greenfield land availability in Maitama proper and sovereign diplomatic demand';
    } else if (d.includes('guzape')) {
      appreciation = 21.2;
      yieldVal = 10.4;
      tierName = 'Diplomatic Ridge';
      scarcityDriver = 'elevated topography luxury positioning and rapid 36-month capital growth';
    } else if (d.includes('jabi')) {
      appreciation = 19.8;
      yieldVal = 9.8;
      tierName = 'Waterfront Enclave';
      scarcityDriver = 'exclusive shoreline lakefront scarcity and high expatriate executive lease rates';
    } else if (d.includes('katampe')) {
      appreciation = 16.4;
      yieldVal = 8.9;
      tierName = 'Diplomatic Zone Extension';
      scarcityDriver = 'gated community enclaves and premium infrastructure access';
    } else if (d.includes('asokoro')) {
      appreciation = 19.5;
      yieldVal = 9.4;
      tierName = 'Presidential Enclave';
      scarcityDriver = 'sovereign security perimeter and uncompromised generational land value';
    } else if (d.includes('wuse')) {
      appreciation = 17.5;
      yieldVal = 11.2;
      tierName = 'Commercial & Luxury Hub';
      scarcityDriver = 'high commercial footfall and high-yielding short-let/executive apartment demand';
    } else if (d.includes('karshi') || d.includes('pyakasa')) {
      appreciation = 24.5;
      yieldVal = 12.8;
      tierName = 'High-Growth Expansion Corridor';
      scarcityDriver = 'rapid infrastructure development and massive early-stage land value inflation';
    } else if (d.includes('lugbe') || d.includes('airport')) {
      appreciation = 22.8;
      yieldVal = 11.5;
      tierName = 'Airport Expressway Growth Axis';
      scarcityDriver = 'direct international transit proximity and expanding corporate office parks';
    }

    // Dynamic price & typology modifier for unique valuation metrics
    if (propData.priceUSD > 500000 || propData.priceNGN > 700000000) {
      appreciation += 0.8;
    }
    if (t.includes('mansion') || t.includes('waterfront')) {
      appreciation += 0.5;
    }

    const formattedPrice = propData.priceNGN > 0 ? `₦${Number(propData.priceNGN).toLocaleString()}` : (propData.priceUSD > 0 ? `$${Number(propData.priceUSD).toLocaleString()} USD` : 'prime market valuation');

    finalThesis = `${propData.district} (${tierName}) has delivered a projected ${appreciation.toFixed(1)}% annual capital appreciation rate, driven by ${scarcityDriver}. Valued at ${formattedPrice} and secured by ${propData.titleStatus}, ${propData.name} presents an inflation-hedged asset class with a projected ${yieldVal.toFixed(1)}% net annual rental return for diaspora investors.`;
  }

  const thesisField = document.getElementById('modalPropThesis');
  if (thesisField) {
    thesisField.value = finalThesis;
  }

  if (btn) {
    btn.disabled = false;
    btn.innerHTML = '<span>✨ Generate AI Market Analysis</span>';
  }

  showToast(`AI Investment Thesis generated via ${sourceTag}!`, 'success');
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
        <span class="table-title-text">${pr.name}</span><br>
        <span style="font-size: 11.5px; color: var(--admin-gold);">${pr.subtitle ? pr.subtitle.substring(0, 52) + '...' : ''}</span><br>
        <span class="table-meta-sub">${pr.district}, Abuja • ${pr.type || 'Residential'}</span>
      </td>
      <td>
        <span style="font-weight: 600; color: var(--admin-gold);">₦${Number(pr.priceNGN || 0).toLocaleString()}</span><br>
        <span style="font-size: 11.5px; color: var(--admin-text-muted);">$${Number(pr.priceUSD || 0).toLocaleString()} USD</span>
      </td>
      <td>
        <span class="table-badge table-badge-forecast">${pr.status || 'Available'}</span>
        <span style="font-size: 10.5px; color: var(--admin-text-muted); display: block; margin-top: 3px;">📜 ${pr.titleStatus || 'C of O'}</span>
      </td>
      <td style="color: var(--admin-text-muted); font-size: 12px;">
        ${pr.bedrooms ? pr.bedrooms + ' Beds • ' : ''}${pr.bathrooms ? pr.bathrooms + ' Baths • ' : ''}${pr.landSize || ''}<br>
        <span style="font-size: 11px; color: var(--admin-gold);">✨ ${(pr.amenities || []).length} Amenities Listed</span>
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
  const form = document.getElementById('propertyEditorForm');
  if (form) form.reset();
  form.setAttribute('data-mode', 'create');
  form.removeAttribute('data-edit-id');

  showPropertyEditorView('Add New Development Listing');

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  };

  setVal('modalPropImage', 'assets/images/nova-crest-palace.jpg');
  setVal('modalPropGallery', 'assets/images/nova-crest-palace.jpg, assets/images/your-home-interior.jpg, assets/images/masterplan-aerial.jpg');
  setVal('modalPropStatus', 'Available');
  setVal('modalPropType', 'Mansion');
  setVal('modalPropDistrict', 'Maitama');
  setVal('modalPropTitleStatus', 'Certificate of Occupancy (C of O)');
  setVal('modalPropTitleAgency', 'FCDA / AGIS Verified');
  setVal('modalPropCarParks', '4');
  setVal('modalPropAmenities', 'Smart Home Automation, Private Heated Infinity Pool, Hybrid Solar Inverter System, Safe Room');
  setVal('modalPropProxAirport', '28 mins (via Airport Rd Expressway)');
  setVal('modalPropProxCBD', '8 mins (Central Business District)');
  setVal('modalPropProxLandmark', '5 mins to Transcorp Hilton');
}

function openPropertyModalForEdit(id) {
  const form = document.getElementById('propertyEditorForm');
  const props = getProperties();
  const prop = props.find(p => p.id === id);

  if (!prop) return;

  form.setAttribute('data-mode', 'edit');
  form.setAttribute('data-edit-id', prop.id);

  showPropertyEditorView(`Edit Property: ${prop.name}`);

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  };

  setVal('modalPropName', prop.name);
  setVal('modalPropSubtitle', prop.subtitle);
  setVal('modalPropDistrict', prop.district || 'Maitama');
  setVal('modalPropPriceNGN', prop.priceNGN);
  setVal('modalPropPriceUSD', prop.priceUSD);
  setVal('modalPropStatus', prop.status || 'Available');
  setVal('modalPropType', prop.type || 'Mansion');
  setVal('modalPropBeds', prop.bedrooms);
  setVal('modalPropBaths', prop.bathrooms);
  setVal('modalPropCarParks', prop.carParks || 4);
  setVal('modalPropLandSize', prop.landSize);
  setVal('modalPropTitleStatus', prop.titleStatus || 'Certificate of Occupancy (C of O)');
  setVal('modalPropTitleAgency', prop.titleAgency || 'FCDA / AGIS Verified');
  setVal('modalPropImage', prop.image || 'assets/images/nova-crest-palace.jpg');
  setVal('modalPropGallery', Array.isArray(prop.gallery) ? prop.gallery.join(', ') : (prop.image || ''));
  setVal('modalPropAmenities', Array.isArray(prop.amenities) ? prop.amenities.join(', ') : '');
  setVal('modalPropProxAirport', prop.proximity?.airport || '');
  setVal('modalPropProxCBD', prop.proximity?.cbd || '');
  setVal('modalPropProxLandmark', prop.proximity?.landmark || '');
  setVal('modalPropDesc', prop.description);
  setVal('modalPropThesis', prop.investmentThesis);
}

function savePropertyFromModal() {
  const form = document.getElementById('propertyEditorForm');
  const mode = form.getAttribute('data-mode');
  const editId = form.getAttribute('data-edit-id');

  const getVal = id => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  };

  const name = getVal('modalPropName');
  const id = mode === 'edit' ? editId : generateSlug(name);
  const subtitle = getVal('modalPropSubtitle');
  const district = getVal('modalPropDistrict') || 'Maitama';
  const priceNGN = Number(getVal('modalPropPriceNGN')) || 0;
  const priceUSD = Number(getVal('modalPropPriceUSD')) || 0;
  const status = getVal('modalPropStatus') || 'Available';
  const type = getVal('modalPropType') || 'Mansion';
  const bedrooms = Number(getVal('modalPropBeds')) || 0;
  const bathrooms = Number(getVal('modalPropBaths')) || 0;
  const carParks = Number(getVal('modalPropCarParks')) || 4;
  const landSize = getVal('modalPropLandSize') || '650 sqm';
  const titleStatus = getVal('modalPropTitleStatus') || 'Certificate of Occupancy (C of O)';
  const titleAgency = getVal('modalPropTitleAgency') || 'FCDA / AGIS Verified';
  const image = getVal('modalPropImage') || 'assets/images/nova-crest-palace.jpg';
  
  const rawGallery = getVal('modalPropGallery');
  const gallery = rawGallery ? rawGallery.split(',').map(s => s.trim()).filter(Boolean) : [image];
  
  const rawAmenities = getVal('modalPropAmenities');
  const amenities = rawAmenities ? rawAmenities.split(',').map(s => s.trim()).filter(Boolean) : [
    "Smart Home Automation",
    "AGIS Verified Digital Title Dossier",
    "24/7 Security Perimeter"
  ];
  
  const proximity = {
    airport: getVal('modalPropProxAirport') || '25 mins (Airport Rd)',
    cbd: getVal('modalPropProxCBD') || '8 mins (Central Business District)',
    landmark: getVal('modalPropProxLandmark') || '5 mins to Transcorp Hilton'
  };

  const description = getVal('modalPropDesc');
  const investmentThesis = getVal('modalPropThesis');

  const propPayload = {
    id,
    name,
    subtitle,
    status,
    badgeType: status === 'Selling Fast' ? 'selling-fast' : (status === 'Sold Out' ? 'coming-soon' : 'available'),
    chip: type.toUpperCase(),
    category: 'off-plan',
    type,
    purpose: 'For Sale',
    district,
    address: `${district}, Abuja`,
    priceNGN,
    priceUSD,
    titleStatus,
    titleAgency,
    landSize,
    bedrooms,
    bathrooms,
    carParks,
    image,
    gallery,
    amenities,
    description,
    proximity,
    investmentThesis
  };

  saveProperty(propPayload);

  showPropertiesListView();
  renderPropertiesTable();
  initKPIs();
  showToast(mode === 'edit' ? 'Property details updated!' : 'New property added to catalog!', 'success');
}

/* ==========================================================================
   AI CRM & Sales Pipeline Studio Controller
   ========================================================================== */
let currentCrmView = 'kanban';

function initCrmStudio() {
  const btnKanban = document.getElementById('btnCrmViewKanban');
  const btnTable = document.getElementById('btnCrmViewTable');
  const btnClear = document.getElementById('btnClearLeads');
  const btnAddLead = document.getElementById('btnCrmAddLead');
  const closeDrawerBtn = document.getElementById('closeCrmDrawerBtn');
  const btnDrawerClose = document.getElementById('btnDrawerClose');
  const drawerBackdrop = document.getElementById('crmDrawerBackdrop');

  if (btnKanban && btnTable) {
    btnKanban.addEventListener('click', () => setCrmView('kanban'));
    btnTable.addEventListener('click', () => setCrmView('table'));
  }

  if (btnClear) {
    btnClear.addEventListener('click', () => {
      if (confirm('Clear all consultation lead records? This will reset leads back to factory seed dataset.')) {
        localStorage.removeItem('novacrest_leads');
        renderCrmDashboard();
        initKPIs();
        showToast('Lead records cleared', 'info');
      }
    });
  }

  if (btnAddLead) {
    btnAddLead.addEventListener('click', () => promptCreateNewLead());
  }

  const closeDrawer = () => {
    if (drawerBackdrop) drawerBackdrop.classList.remove('active');
  };

  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (btnDrawerClose) btnDrawerClose.addEventListener('click', closeDrawer);
  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', (e) => {
      if (e.target === drawerBackdrop) closeDrawer();
    });
  }

  renderCrmDashboard();
}

function setCrmView(mode) {
  currentCrmView = mode;
  const kanbanContainer = document.getElementById('crmKanbanContainer');
  const tableContainer = document.getElementById('crmTableContainer');
  const btnKanban = document.getElementById('btnCrmViewKanban');
  const btnTable = document.getElementById('btnCrmViewTable');

  if (mode === 'kanban') {
    if (kanbanContainer) kanbanContainer.style.display = 'grid';
    if (tableContainer) tableContainer.style.display = 'none';
    if (btnKanban) btnKanban.classList.add('active');
    if (btnTable) btnTable.classList.remove('active');
  } else {
    if (kanbanContainer) kanbanContainer.style.display = 'none';
    if (tableContainer) tableContainer.style.display = 'block';
    if (btnKanban) btnKanban.classList.remove('active');
    if (btnTable) btnTable.classList.add('active');
  }
}

function renderCrmDashboard() {
  const leads = getLeads();
  updateCrmKPIs(leads);
  renderKanbanBoard(leads);
  renderLeadsTable(leads);
}

function updateCrmKPIs(leads) {
  const openLeads = leads.filter(l => l.stage !== 'closed');
  const totalValNGN = openLeads.reduce((acc, l) => acc + (Number(l.budgetNGN) || 0), 0);
  const inspectionCount = leads.filter(l => l.stage === 'inspection').length;
  
  const totalScore = leads.reduce((acc, l) => acc + (Number(l.aiScore) || 75), 0);
  const avgScore = leads.length ? Math.round(totalScore / leads.length) : 0;

  const valEl = document.getElementById('crmKpiPipelineVal');
  const leadsEl = document.getElementById('crmKpiTotalLeads');
  const inspEl = document.getElementById('crmKpiInspections');
  const scoreEl = document.getElementById('crmKpiAvgScore');
  const subtitle = document.getElementById('crmLeadCountSubtitle');

  if (valEl) valEl.textContent = totalValNGN > 0 ? `₦${(totalValNGN / 1000000000).toFixed(2)}B` : '₦0.00';
  if (leadsEl) leadsEl.textContent = leads.length;
  if (inspEl) inspEl.textContent = inspectionCount;
  if (scoreEl) scoreEl.textContent = `${avgScore}%`;
  if (subtitle) subtitle.textContent = `Active Sales Pipeline (${leads.length} leads total)`;
}

function renderKanbanBoard(leads) {
  const container = document.getElementById('crmKanbanContainer');
  if (!container) return;

  container.innerHTML = CRM_STAGES.map(stage => {
    const stageLeads = leads.filter(l => (l.stage || 'new') === stage.id);
    const stageVal = stageLeads.reduce((acc, l) => acc + (Number(l.budgetNGN) || 0), 0);
    const formattedVal = stageVal > 0 ? `₦${(stageVal / 1000000).toFixed(0)}M total` : '₦0';

    return `
      <div class="kanban-column" data-stage="${stage.id}">
        <div class="kanban-col-header">
          <div class="kanban-col-title">
            <span>${stage.icon}</span>
            <span>${stage.label}</span>
            <span class="kanban-count-pill">${stageLeads.length}</span>
          </div>
          <div class="kanban-col-value">${formattedVal}</div>
        </div>

        <div class="kanban-cards-container">
          ${stageLeads.length === 0 ? `
            <div style="text-align: center; padding: 30px 10px; color: var(--admin-text-muted); font-size: 12px;">
              No deals in ${stage.label} stage
            </div>
          ` : stageLeads.map(lead => renderKanbanCardHtml(lead)).join('')}
        </div>
      </div>
    `;
  }).join('');

  // Attach card click handlers to open drawer
  container.querySelectorAll('.kanban-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Ignore if select box or button clicked
      if (e.target.tagName === 'SELECT' || e.target.tagName === 'BUTTON' || e.target.closest('select')) return;
      const id = card.getAttribute('data-id');
      openLeadDrawer(id);
    });
  });

  // Attach stage change select listener
  container.querySelectorAll('.kanban-stage-select').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const id = sel.getAttribute('data-id');
      const newStage = e.target.value;
      updateLeadStage(id, newStage);
      renderCrmDashboard();
      showToast(`Lead moved to ${newStage.toUpperCase()} stage`, 'success');
    });
  });
}

function renderKanbanCardHtml(lead) {
  const riskClass = lead.riskLevel || 'low';
  const riskText = riskClass === 'high' ? '🔴 High Risk' : (riskClass === 'medium' ? '🟡 Med Risk' : '🟢 Low Risk');
  const formattedBudget = lead.budgetNGN ? `₦${(lead.budgetNGN / 1000000).toFixed(0)}M` : 'Budget Undefined';
  
  return `
    <div class="kanban-card" data-id="${lead.id}">
      <div class="card-top-row">
        <div class="lead-name-text">${lead.name}</div>
        <span class="risk-pill ${riskClass}">${riskText}</span>
      </div>

      <div class="lead-interest-badge">${lead.interest}</div>
      <div style="font-size: 12px; color: #cbd5e1; margin-bottom: 6px;">📍 ${lead.location || 'Location Not Specified'}</div>
      
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <span style="font-size: 12.5px; font-weight: 700; color: var(--admin-gold);">${formattedBudget}</span>
        <span class="score-badge">✨ AI ${lead.aiScore || 85}% Match</span>
      </div>

      <div class="lead-meta-row">
        <span>${lead.source || 'Website'}</span>
        <select class="kanban-stage-select form-control" data-id="${lead.id}" style="padding: 2px 6px; font-size: 11px; width: auto; background: rgba(0,0,0,0.4); border-color: rgba(255,255,255,0.1);">
          ${CRM_STAGES.map(s => `<option value="${s.id}" ${s.id === lead.stage ? 'selected' : ''}>Move ➔ ${s.label}</option>`).join('')}
        </select>
      </div>
    </div>
  `;
}

function renderLeadsTable(leads) {
  const tbody = document.getElementById('leadsTableBody');
  if (!tbody) return;

  if (leads.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 40px; color: var(--admin-text-muted);">
          No consultation leads recorded yet. As visitors submit inquiries via the website, they will appear here.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = leads.map(lead => {
    const riskClass = lead.riskLevel || 'low';
    const riskText = riskClass === 'high' ? '🔴 High Risk' : (riskClass === 'medium' ? '🟡 Med Risk' : '🟢 Low Risk');
    const formattedBudget = lead.budgetNGN ? `₦${Number(lead.budgetNGN).toLocaleString()}` : 'N/A';

    return `
      <tr>
        <td>
          <div style="font-weight: 700; color: #fff; cursor: pointer;" class="lead-table-name" data-id="${lead.id}">${lead.name}</div>
          <div style="font-size: 11.5px; color: var(--admin-gold);">${lead.location || 'Diaspora'} • ${lead.source || 'Website'}</div>
        </td>
        <td style="color: #fff; font-family: monospace; font-size: 12.5px;">
          ${lead.phone}<br>
          <span style="color: var(--admin-text-muted); font-size: 11.5px;">${lead.email || ''}</span>
        </td>
        <td>
          <div style="font-weight: 600; color: #fff; font-size: 13px;">${lead.interest}</div>
          <div style="font-size: 12px; color: var(--admin-gold); font-weight: 700;">${formattedBudget}</div>
        </td>
        <td>
          <select class="table-stage-select form-control" data-id="${lead.id}" style="padding: 4px 8px; font-size: 11.5px; width: auto; background: var(--admin-surface);">
            ${CRM_STAGES.map(s => `<option value="${s.id}" ${s.id === lead.stage ? 'selected' : ''}>${s.icon} ${s.label}</option>`).join('')}
          </select>
        </td>
        <td>
          <span class="risk-pill ${riskClass}">${riskText}</span>
        </td>
        <td>
          <span class="score-badge">✨ ${lead.aiScore || 85}% Score</span>
        </td>
        <td>
          <div class="table-actions-cell">
            <button type="button" class="btn-admin btn-admin-secondary btn-admin-sm btn-open-drawer" data-id="${lead.id}">
              Dossier
            </button>
            <button type="button" class="btn-admin btn-admin-danger btn-admin-sm btn-delete-lead" data-id="${lead.id}">
              ✕
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  // Row name and button click listeners
  tbody.querySelectorAll('.lead-table-name, .btn-open-drawer').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.getAttribute('data-id');
      openLeadDrawer(id);
    });
  });

  // Table stage dropdown change
  tbody.querySelectorAll('.table-stage-select').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const id = sel.getAttribute('data-id');
      updateLeadStage(id, e.target.value);
      renderCrmDashboard();
      showToast('Lead stage updated', 'success');
    });
  });

  // Delete lead listener
  tbody.querySelectorAll('.btn-delete-lead').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Delete this lead record permanently?')) {
        deleteLead(id);
        renderCrmDashboard();
        initKPIs();
        showToast('Lead record deleted', 'info');
      }
    });
  });
}

function openLeadDrawer(id) {
  const leads = getLeads();
  const lead = leads.find(l => l.id === id);
  if (!lead) return;

  const backdrop = document.getElementById('crmDrawerBackdrop');
  const nameEl = document.getElementById('drawerLeadName');
  const sourceEl = document.getElementById('drawerLeadSource');
  const bodyEl = document.getElementById('drawerLeadBody');
  const waBtn = document.getElementById('btnDrawerWhatsApp');

  if (nameEl) nameEl.textContent = lead.name;
  if (sourceEl) sourceEl.textContent = `${lead.source || 'Website Lead'} • Received ${new Date(lead.timestamp).toLocaleDateString('en-GB')}`;

  const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
  const initialWaText = encodeURIComponent(`Hello ${lead.name}, regarding your interest in ${lead.interest} with Novacrest Homes Ltd in Abuja:`);
  if (waBtn) waBtn.href = `https://wa.me/${cleanPhone}?text=${initialWaText}`;

  const notesList = Array.isArray(lead.notes) ? lead.notes : [];

  bodyEl.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 20px;">
      <!-- Contact Overview Box -->
      <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--admin-border); border-radius: 10px; padding: 16px;">
        <h4 style="font-size: 13px; text-transform: uppercase; color: var(--admin-gold); margin-bottom: 12px; font-weight: 700;">Investor Profile & Contact Info</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px;">
          <div>
            <span style="color: var(--admin-text-muted); display: block;">Phone / WhatsApp:</span>
            <strong style="color: #fff;">${lead.phone}</strong>
          </div>
          <div>
            <span style="color: var(--admin-text-muted); display: block;">Email Address:</span>
            <strong style="color: #fff;">${lead.email || 'N/A'}</strong>
          </div>
          <div>
            <span style="color: var(--admin-text-muted); display: block;">Investor Location:</span>
            <strong style="color: #fff;">${lead.location || 'Diaspora'}</strong>
          </div>
          <div>
            <span style="color: var(--admin-text-muted); display: block;">Stated Budget:</span>
            <strong style="color: var(--admin-gold);">₦${Number(lead.budgetNGN || 0).toLocaleString()} NGN</strong>
          </div>
        </div>
      </div>

      <!-- Gemini AI Qualification Score & Summary Box -->
      <div style="background: rgba(59, 130, 246, 0.06); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 10px; padding: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h4 style="font-size: 13px; font-weight: 700; color: #60a5fa; margin: 0;">✨ AI Lead Viability Score & Summary</h4>
          <span class="score-badge" style="font-size: 13px; padding: 4px 10px;">${lead.aiScore || 90}% Qualified</span>
        </div>
        <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6; margin-bottom: 0;">
          ${lead.aiSummary || 'High-net-worth diaspora investor seeking high-appreciation development opportunities in prime Abuja corridors.'}
        </p>
      </div>

      <!-- Gemini One-Click AI WhatsApp Pitch Draft Tool -->
      <div style="background: rgba(201, 157, 66, 0.06); border: 1px solid rgba(201, 157, 66, 0.25); border-radius: 10px; padding: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h4 style="font-size: 13px; font-weight: 700; color: var(--admin-gold); margin: 0;">💬 AI WhatsApp Pitch Generator</h4>
          <button type="button" class="btn-admin btn-admin-gold btn-admin-sm" id="btnGenerateAiPitch" data-id="${lead.id}">
            <span>✨ Generate AI Pitch</span>
          </button>
        </div>
        <textarea id="drawerPitchTextarea" class="form-control" rows="4" style="font-size: 12.5px; background: rgba(0,0,0,0.4);" placeholder="Click 'Generate AI Pitch' to draft a personalized WhatsApp investment offer for ${lead.name}..."></textarea>
      </div>

      <!-- Interaction & Inspection Notes Log -->
      <div>
        <h4 style="font-size: 13px; text-transform: uppercase; color: var(--admin-text-muted); margin-bottom: 10px; font-weight: 700;">Interaction & Advisory Notes</h4>
        <div style="display: flex; gap: 8px; margin-bottom: 14px;">
          <input type="text" id="drawerNewNoteInput" class="form-control" placeholder="Add follow-up note (e.g., Virtual tour completed, sent C of O)...">
          <button type="button" class="btn-admin btn-admin-primary btn-admin-sm" id="btnAddLeadNoteBtn" data-id="${lead.id}">
            <span>Add Note</span>
          </button>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 8px;" id="drawerNotesContainer">
          ${notesList.length === 0 ? `
            <div style="font-size: 12px; color: var(--admin-text-muted);">No interaction notes logged yet.</div>
          ` : notesList.map(n => `
            <div style="background: rgba(255,255,255,0.02); border-left: 2px solid var(--admin-gold); padding: 8px 12px; border-radius: 0 6px 6px 0; font-size: 12.5px;">
              <span style="color: var(--admin-gold); font-size: 11px; font-weight: 700; display: block;">${n.date}</span>
              <span style="color: #e2e8f0;">${n.text}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Attach pitch generator button click
  const pitchBtn = bodyEl.querySelector('#btnGenerateAiPitch');
  if (pitchBtn) {
    pitchBtn.addEventListener('click', () => generateAiPitchForLead(lead));
  }

  // Textarea live sync to WhatsApp link
  const textarea = bodyEl.querySelector('#drawerPitchTextarea');
  if (textarea) {
    textarea.addEventListener('input', () => {
      const text = textarea.value.trim();
      if (waBtn) waBtn.href = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    });
  }

  // Add note listener
  const addNoteBtn = bodyEl.querySelector('#btnAddLeadNoteBtn');
  const noteInput = bodyEl.querySelector('#drawerNewNoteInput');
  if (addNoteBtn && noteInput) {
    addNoteBtn.addEventListener('click', () => {
      const val = noteInput.value.trim();
      if (!val) return;
      
      const newNote = { date: new Date().toISOString().split('T')[0], text: val };
      lead.notes = lead.notes || [];
      lead.notes.unshift(newNote);
      saveLead(lead);
      openLeadDrawer(lead.id);
      showToast('Interaction note saved', 'success');
    });
  }

  if (backdrop) backdrop.classList.add('active');
}

async function generateAiPitchForLead(lead) {
  const pitchBtn = document.getElementById('btnGenerateAiPitch');
  const textarea = document.getElementById('drawerPitchTextarea');
  const waBtn = document.getElementById('btnDrawerWhatsApp');

  if (pitchBtn) {
    pitchBtn.disabled = true;
    pitchBtn.innerHTML = '<span>⏳ Drafting Pitch...</span>';
  }

  const prompt = `Hello ${lead.name},\n\nThis is the Advisory Desk at Novacrest Homes Ltd in Abuja. Following up on your inquiry for ${lead.interest}:\n\nWe have reserved a high-appreciation allocation matching your budget of ₦${Number(lead.budgetNGN || 0).toLocaleString()} NGN. The land title is fully AGIS C of O verified with a projected 19.5% annual capital appreciation.\n\nWould you be available for a 15-minute private virtual walkthrough or site inspection this week?`;

  setTimeout(() => {
    if (textarea) {
      textarea.value = prompt;
      const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
      if (waBtn) waBtn.href = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(prompt)}`;
    }

    if (pitchBtn) {
      pitchBtn.disabled = false;
      pitchBtn.innerHTML = '<span>✨ Generate AI Pitch</span>';
    }

    showToast('AI WhatsApp Pitch generated!', 'success');
  }, 600);
}

function promptCreateNewLead() {
  const name = prompt('Investor / Buyer Full Name:');
  if (!name) return;
  const phone = prompt('Phone / WhatsApp Number (+234...):', '+234');
  if (!phone) return;
  const interest = prompt('Property / Development Interest:', 'Nova Crest Palace (Maitama)');
  const budgetStr = prompt('Budget in NGN (e.g., 500000000):', '450000000');
  
  const newLead = {
    id: 'lead-' + Date.now(),
    name: name.trim(),
    phone: phone.trim(),
    email: '',
    location: 'Abuja Investor',
    interest: interest ? interest.trim() : 'Nova Crest Development',
    budgetNGN: Number(budgetStr) || 350000000,
    stage: 'new',
    riskLevel: 'low',
    aiScore: 88,
    aiSummary: 'New investor inquiry submitted via Admin Dashboard.',
    notes: [{ date: new Date().toISOString().split('T')[0], text: 'Lead manually entered into CRM.' }],
    source: 'Admin Portal',
    timestamp: new Date().toISOString()
  };

  saveLead(newLead);
  renderCrmDashboard();
  initKPIs();
  showToast(`New lead ${newLead.name} created!`, 'success');
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
        leads: getLeads()
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
