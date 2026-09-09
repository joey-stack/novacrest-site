/**
 * NOVACREST HOMES LIMITED - Blog & Market Intelligence Dataset
 * Prepared for dynamic rendering and future CMS / Admin Dashboard syncing
 */

import { db, collection, doc, getDocs, setDoc, deleteDoc } from './firebase-config.js';

const DEFAULT_BLOG_POSTS = [
  {
    id: "land-title-types-abuja",
    slug: "land-title-types-abuja",
    title: "Land Title Types in Abuja Explained: C of O vs. R of O vs. Excision",
    subtitle: "A definitive legal primer to protect diaspora capital before issuing bank transfers to the FCT.",
    category: "Legal & Due Diligence",
    categorySlug: "legal",
    readTime: "6 min read",
    date: "September 2026",
    isoDate: "2026-09-02",
    author: {
      name: "Barr. Chukwuemeka Okonkwo",
      role: "Head of Legal & Title Conveyancing",
      avatar: "assets/images/about-leadership-banner.jpg"
    },
    coverImage: "assets/images/masterplan-aerial.jpg",
    snippet: "Before sending money from London, Toronto, or Dallas, learn the vital differences between an FCDA Certificate of Occupancy, Right of Occupancy, and Area Council allocations.",
    keyTakeaway: "Never execute a real estate transaction in the FCT based solely on an offer letter or surveyor sketch. Always verify the Cadastral Cadastre file number directly with AGIS.",
    featured: true,
    relatedPropertyId: "nova-crest-palace",
    sections: [
      {
        heading: "1. The FCT Legal Framework: FCDA & AGIS Authority",
        content: `
          <p>Unlike other Nigerian states where land tenure is governed primarily through state land registries under customary law, the Federal Capital Territory (FCT) is governed strictly under the <strong>Land Use Act of 1978</strong> and the <strong>FCT Act</strong>. All land within the 8,000 square kilometers of the capital is vested in the President of Nigeria and administered through the Minister of the Federal Capital Territory.</p>
          <p>Every legitimate title record is centralized in the <strong>Abuja Geographic Information Systems (AGIS)</strong>. If a land parcel cannot be located, mapped, and verified in AGIS databases, it represents critical financial exposure.</p>
        `
      },
      {
        heading: "2. Certificate of Occupancy (C of O): The Gold Standard",
        content: `
          <p>The Certificate of Occupancy is the highest statutory land document issued in Nigeria. In Abuja, a genuine C of O bears the direct signature or delegated authority of the Minister of the FCT. It grants the holder a statutory <strong>99-year leasehold</strong> with unassailable priority over subsequent claims.</p>
          <div class="article-callout-box">
            <h4>Key Characteristics of a Valid Abuja C of O:</h4>
            <ul>
              <li><strong>Unique File Number:</strong> Tied to a specific cadastral zone (e.g., Cadastral Zone A04 Maitama).</li>
              <li><strong>Coordinates:</strong> Geodetic boundary pillars verified by FCDA Master Planners.</li>
              <li><strong>Collateral Acceptance:</strong> Accepted without discount by all commercial banks and international financial institutions.</li>
            </ul>
          </div>
        `
      },
      {
        heading: "3. Right of Occupancy (R of O): An Offer, Not Final Title",
        content: `
          <p>Many sellers and unvetted agents market land with an 'R of O'. It is essential to realize that a Right of Occupancy is essentially an official letter conveying the government's offer of allocation, specifying terms, ground rents, and fees that must be satisfied.</p>
          <p>While legitimate, an R of O is an intermediate stage. It can be revoked if terms are unfulfilled, or if competing allocations overlap. At Novacrest Homes Ltd, our policy mandates that <em>every parcel in our development portfolio is processed and recertified to full C of O tenure</em> before customer reservation.</p>
        `
      },
      {
        heading: "4. Excision, Gazette, and Area Council Allocations",
        content: `
          <p>In outward growth corridors such as Karshi, Kuje, and Airport Road, you will encounter lands historically assigned by Area Council chairmen. Since the 2005 FCT land reforms, Area Council titles must be regularized and integrated into the AGIS database to prevent dual allocations.</p>
          <p>Purchasing unregularized Area Council papers without an FCDA ministerial confirmation is the #1 cause of demolition and title litigation in Abuja. When investing through Novacrest, all cadastral files are already verified and secured against government right-of-way reservations.</p>
        `
      }
    ]
  },
  {
    id: "is-karshi-the-next-big-investment-zone",
    slug: "is-karshi-the-next-big-investment-zone",
    title: "Is Karshi the Next Big Investment Zone? Abuja's High-Yield Corridor",
    subtitle: "Why institutional funds and diaspora syndicates are quietly assembling acreage ahead of arterial connectivity.",
    category: "Market Forecast",
    categorySlug: "forecast",
    readTime: "5 min read",
    date: "August 2026",
    isoDate: "2026-08-14",
    author: {
      name: "Engr. Yusuf Al-Hassan",
      role: "Infrastructure & Urban Growth Director",
      avatar: "assets/images/about-leadership-banner.jpg"
    },
    coverImage: "assets/images/masterplan-aerial.jpg",
    snippet: "Discover how the Apo-Karshi bypass corridor is replicating the explosive capital growth seen in Guzape and Lokogoma a decade ago.",
    keyTakeaway: "Infrastructure precedes capital appreciation. The historic opening of transit links consistently turns ₦15M entry plots into ₦90M prime holdings within 5-7 years.",
    featured: false,
    relatedPropertyId: "your-home",
    sections: [
      {
        heading: "1. The Anatomy of Abuja Infrastructure Corridors",
        content: `
          <p>To understand Karshi's investment appeal, one must examine Abuja's historic growth patterns. In 2004, Guzape was viewed as rugged, rocky, and detached. Early buyers purchased plots under ₦8 million. Today, a 1,000sqm residential plot in Guzape commands over ₦250 million, and completed duplexes sell upwards of ₦500 million.</p>
          <p>The catalytic factor is always <strong>arterial access</strong>. When major bypasses connect an underdeveloped satellite corridor directly to administrative hubs, property values experience an immediate upward re-rating.</p>
        `
      },
      {
        heading: "2. The Apo-Karshi Link Road Catalyst",
        content: `
          <p>Currently, commuters traveling from Karshi and surrounding growth belts commute via Nyanya and Mararaba—a traffic corridor known for severe morning congestion taking 75 to 90 minutes.</p>
          <p>The ongoing Apo-Karshi bypass eliminates this detour entirely, creating a direct 20-minute connection into the Apo District and Central Business District. This reduction in commute time immediately unlocks Karshi as a prime commuter suburb for high-earning professionals and civil executives.</p>
        `
      },
      {
        heading: "3. Land Banking Metrics & Projection for 2026–2030",
        content: `
          <div class="article-callout-box">
            <h4>Novacrest Research Forecast for Karshi:</h4>
            <ul>
              <li><strong>Current Entry Point:</strong> ₦18.5M – ₦30M ($12,500 – $20,000 USD) for 500sqm serviced plots.</li>
              <li><strong>Projected 3-Year Appreciation:</strong> +180% to +240% upon full bypass commissioning.</li>
              <li><strong>Target Demographics:</strong> Young professionals, middle-tier diplomatic staff, and diaspora families banking secure generational land.</li>
            </ul>
          </div>
          <p>Nova Crest Horizon plots in Karshi are laid out with perimeter fencing, arterial storm drainage, dedicated solar mini-grid corridors, and instant AGIS title perfection.</p>
        `
      }
    ]
  },
  {
    id: "diaspora-guide-buying-land-abuja",
    slug: "diaspora-guide-buying-land-abuja",
    title: "The Diaspora Guide to Buying Real Estate in Abuja Without Getting Burned",
    subtitle: "An institutional blueprint to bypass informal middlemen, fake survey beacons, and family entitlement traps.",
    category: "Diaspora Concierge",
    categorySlug: "diaspora",
    readTime: "7 min read",
    date: "July 2026",
    isoDate: "2026-07-28",
    author: {
      name: "Victoria Adeleke",
      role: "Head of Diaspora Investor Concierge",
      avatar: "assets/images/about-leadership-banner.jpg"
    },
    coverImage: "assets/images/hero-luxury-estate.jpg",
    snippet: "The step-by-step institutional playbook: independent AGIS searches, milestone-certified escrow, 4K drone surveillance, and DHL courier delivery of perfected deeds.",
    keyTakeaway: "Never transact through informal WhatsApp accounts or unverified third-party family members. Always insist on corporate contract escrow and lawyer-verified digital AGIS searches.",
    featured: false,
    relatedPropertyId: "nova-crest-villa",
    sections: [
      {
        heading: "1. The Four Costliest Mistakes Diaspora Buyers Make",
        content: `
          <p>For Nigerians in the UK, United States, Canada, and the UAE, investing in homeland real estate is both an emotional milestone and a strategic wealth hedge. Unfortunately, traditional acquisition channels are plagued by recurring pitfalls:</p>
          <ul>
            <li><strong>The Relative Trap:</strong> Entrusting funds to relatives or family acquaintances who inflate procurement bills, divert funds to personal projects, or purchase unallocated greenfield land.</li>
            <li><strong>Unverified Cadastral Coordinates:</strong> Relying on photocopied survey plans without verifying coordinates on the FCDA master plan.</li>
            <li><strong>Off-Plan Overpromises:</strong> Paying full lump sums upfront to uncapitalized developers who stall construction at foundation stage.</li>
            <li><strong>Currency Conversion Slippage:</strong> Losing 8–12% on informal FX remittance channels rather than bank-secured custodial accounts.</li>
          </ul>
        `
      },
      {
        heading: "2. The Novacrest Institutional Shield",
        content: `
          <p>To permanently solve these challenges, Novacrest Homes Ltd established an institutional protocol specifically designed for offshore buyers:</p>
          <div class="article-callout-box">
            <h4>Our 5-Point Diaspora Protection Architecture:</h4>
            <ol>
              <li><strong>Independent AGIS Verification:</strong> You receive an official digital search report bearing official AGIS timestamps before committing any reservation fee.</li>
              <li><strong>Milestone-Based Escrow:</strong> Construction payments are unlocked strictly upon independent structural engineering stage certifications (Foundation → DPC → Lintel → Roof → Finishing).</li>
              <li><strong>4K Live Drone Telemetry:</strong> Every month, you receive unedited 4K aerial drone footage and engineer walk-throughs of your specific plot or building.</li>
              <li><strong>Dual Currency Invoicing:</strong> Fixed USD/GBP lock-in contracts that eliminate Naira volatility risk throughout your construction lifecycle.</li>
              <li><strong>Courier Deed Dispatch:</strong> Perfected deeds of assignment and Governor's Consent documents dispatched directly to your overseas address via tracked DHL Express.</li>
            </ol>
          </div>
        `
      },
      {
        heading: "3. What to Do Next",
        content: `
          <p>Whether your objective is building a luxury retirement residence in Maitama or securing high-yield serviced plots in Karshi, schedule a confidential virtual consultation with our executive diaspora team.</p>
        `
      }
    ]
  },
  {
    id: "maitama-vs-guzape-vs-jabi-comparison",
    slug: "maitama-vs-guzape-vs-jabi-comparison",
    title: "Maitama vs. Guzape vs. Jabi: Capital Appreciation & Rental Yield Comparison",
    subtitle: "A data-driven breakdown of Abuja's top three luxury property markets for 2026 and beyond.",
    category: "Investment Guide",
    categorySlug: "investment",
    readTime: "8 min read",
    date: "June 2026",
    isoDate: "2026-06-19",
    author: {
      name: "Barr. Chukwuemeka Okonkwo",
      role: "Head of Legal & Title Conveyancing",
      avatar: "assets/images/about-leadership-banner.jpg"
    },
    coverImage: "assets/images/nova-crest-palace.jpg",
    snippet: "Comparing tenancy demand from diplomatic missions, capital growth trajectories, and net USD rental yields across Abuja's premier residential enclaves.",
    keyTakeaway: "Maitama offers unmatched capital preservation and sovereign prestige; Jabi maximizes foreign-currency rental yields; Guzape leads in modern architectural capital growth.",
    featured: false,
    relatedPropertyId: "nova-crest-garden",
    sections: [
      {
        heading: "1. The Luxury Real Estate Matrix",
        content: `
          <p>Investors frequently ask whether their capital is best positioned in the established aristocracy of Maitama, the contemporary hillside exclusivity of Guzape, or the tranquil waterfront lifestyle of Jabi Lake. Each market serves a distinct investment thesis:</p>
          <div class="article-callout-box">
            <h4>Quick Comparative Summary:</h4>
            <ul>
              <li><strong>Maitama:</strong> Zero greenfield plots remaining. Land values are non-negotiable. Prime tenant base: Ambassadors, cabinet ministers, multinational CEOs. <em>Average Annual Appreciation: 18.5%</em>.</li>
              <li><strong>Jabi Waterfront:</strong> High demand for serviced short-stay and diplomatic leases. Waterfront premium yields <em>9.8% net annual USD return</em>.</li>
              <li><strong>Guzape:</strong> The modern architectural frontier. Favored by diaspora tech executives and young captains of industry. <em>Capital growth: +28% YoY</em>.</li>
            </ul>
          </div>
        `
      },
      {
        heading: "2. Diplomatic Lease Demand in Maitama",
        content: `
          <p>Maitama commands the highest baseline rents in Sub-Saharan Africa for secure standalone villas. Diplomatic missions pay 2 to 3 years of upfront rent in US Dollars for properties meeting UNDSS (United Nations Department of Safety and Security) residential security standards.</p>
          <p>At <strong>Nova Crest Palace</strong>, our architecture is engineered specifically to meet these diplomatic covenants: reinforced outer perimeters, safe rooms, dual Master suites, and isolated staff quarters.</p>
        `
      }
    ]
  },
  {
    id: "agis-digital-land-search-checklist",
    slug: "agis-digital-land-search-checklist",
    title: "AGIS Digital Land Search Checklist: How to Verify Cadastral Boundaries in Abuja",
    subtitle: "The non-negotiable 6-step diligence procedure before buying any commercial or residential land in Abuja.",
    category: "Legal & Due Diligence",
    categorySlug: "legal",
    readTime: "5 min read",
    date: "May 2026",
    isoDate: "2026-05-10",
    author: {
      name: "Victoria Adeleke",
      role: "Head of Diaspora Investor Concierge",
      avatar: "assets/images/about-leadership-banner.jpg"
    },
    coverImage: "assets/images/nova-crest-villa.jpg",
    snippet: "Learn the exact documentation required by AGIS officials to conduct a comprehensive legal search and uncover hidden encumbrances, court lis pendens, or zoning violations.",
    keyTakeaway: "An AGIS search must always be matched against the physical ground survey using differential GPS beacons to ensure the document corresponds to the actual physical parcel.",
    featured: false,
    relatedPropertyId: "nova-crest-experience",
    sections: [
      {
        heading: "1. The 6 Steps to Complete AGIS Verification",
        content: `
          <p>Executing an Abuja Geographic Information Systems search requires strict protocol:</p>
          <ol>
            <li><strong>Letter of Authority:</strong> Signed authorization from the registered titleholder or verified Power of Attorney.</li>
            <li><strong>Official Application & Cadastral Fee:</strong> Lodged at the AGIS Customer Service Center, Peace Drive, Central Area, Abuja.</li>
            <li><strong>File Examination:</strong> Checking the original physical and digital archive folder for uncancelled mortgages, bank liens, or disputes.</li>
            <li><strong>Zoning & Land Use Verification:</strong> Ensuring residential zoning has not been altered or targeted for road dualization.</li>
            <li><strong>Ground Survey Beacon Confirmation:</strong> A licensed surveyor matching beacons with FCDA geodetic network pillars.</li>
            <li><strong>Certified Search Report:</strong> Official legal confirmation signed by the Director of Cadastre and Registrar of Deeds.</li>
          </ol>
        `
      }
    ]
  }
];

export const BLOG_CATEGORIES = [
  { name: "All Articles", slug: "all" },
  { name: "Legal & Due Diligence", slug: "legal" },
  { name: "Market Forecast", slug: "forecast" },
  { name: "Diaspora Concierge", slug: "diaspora" },
  { name: "Investment Guide", slug: "investment" }
];

export function getBlogPosts() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('novacrest_blog_posts');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    }
  } catch (err) {
    console.warn('Error reading stored blog posts:', err);
  }
  return DEFAULT_BLOG_POSTS;
}

/**
 * Fetch live blog article documents from Google Cloud Firestore
 */
export async function fetchFirestoreBlogPosts() {
  try {
    if (!db) return getBlogPosts();
    const querySnapshot = await getDocs(collection(db, "articles"));
    const firestorePosts = [];
    querySnapshot.forEach((docSnap) => {
      firestorePosts.push(docSnap.data());
    });

    if (firestorePosts.length > 0) {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('novacrest_blog_posts', JSON.stringify(firestorePosts));
      }
      return firestorePosts;
    }
  } catch (err) {
    console.warn('[Firestore] Falling back to local articles dataset:', err);
  }
  return getBlogPosts();
}

/**
 * Save article to both local cache and Google Cloud Firestore
 */
export function saveBlogPost(postData) {
  const posts = getBlogPosts().slice();
  const existingIdx = posts.findIndex(p => p.id === postData.id || (postData.slug && p.slug === postData.slug));
  if (existingIdx >= 0) {
    posts[existingIdx] = { ...posts[existingIdx], ...postData };
  } else {
    posts.unshift(postData);
  }
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('novacrest_blog_posts', JSON.stringify(posts));
  }

  // Cloud Firestore Sync
  const articleId = postData.id || postData.slug;
  if (db && articleId) {
    setDoc(doc(db, "articles", articleId), postData, { merge: true })
      .then(() => console.log(`[Firestore] Article '${postData.title}' saved to cloud.`))
      .catch(err => console.error('[Firestore Error]', err));
  }

  return posts;
}

/**
 * Delete article from both local cache and Google Cloud Firestore
 */
export function deleteBlogPost(id) {
  const posts = getBlogPosts().filter(p => p.id !== id && p.slug !== id);
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('novacrest_blog_posts', JSON.stringify(posts));
  }

  // Cloud Firestore Delete
  if (db && id) {
    deleteDoc(doc(db, "articles", id))
      .then(() => console.log(`[Firestore] Article '${id}' deleted from cloud.`))
      .catch(err => console.error('[Firestore Error]', err));
  }

  return posts;
}

/**
 * One-Click Bulk Cloud Sync: Uploads all blog posts to Google Cloud Firestore
 */
export async function syncAllArticlesToFirestore() {
  if (!db) throw new Error('Firestore not initialized');
  const posts = getBlogPosts();
  let count = 0;
  for (const post of posts) {
    const postKey = post.id || post.slug;
    await setDoc(doc(db, "articles", postKey), post, { merge: true });
    count++;
  }
  return count;
}

export function resetBlogPosts() {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('novacrest_blog_posts');
  }
  return DEFAULT_BLOG_POSTS;
}

export const BLOG_POSTS = getBlogPosts();

if (typeof window !== 'undefined') {
  window.NovacrestBlogStore = {
    getBlogPosts,
    fetchFirestoreBlogPosts,
    saveBlogPost,
    deleteBlogPost,
    syncAllArticlesToFirestore,
    resetBlogPosts,
    DEFAULT_BLOG_POSTS
  };
}

