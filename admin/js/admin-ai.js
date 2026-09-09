/**
 * NOVACREST HOMES LIMITED — Real-Time AI & Web Scraper Controller
 * Oxylabs Free Tier + Google Gemini API (Free Tier) Integration
 */

const GEMINI_KEY_STORAGE = 'novacrest_gemini_api_key';
const OXYLABS_USER_STORAGE = 'novacrest_oxylabs_user';
const OXYLABS_PASS_STORAGE = 'novacrest_oxylabs_pass';

// Pre-configured codebase credentials (placeholders; uses local engine to prevent secret exposure)
const DEFAULT_GEMINI_KEY = '';
const DEFAULT_OXYLABS_USER = '';
const DEFAULT_OXYLABS_PASS = '';

export function getAiCredentials() {
  return {
    geminiKey: localStorage.getItem(GEMINI_KEY_STORAGE) || DEFAULT_GEMINI_KEY,
    oxylabsUser: localStorage.getItem(OXYLABS_USER_STORAGE) || DEFAULT_OXYLABS_USER,
    oxylabsPass: localStorage.getItem(OXYLABS_PASS_STORAGE) || DEFAULT_OXYLABS_PASS
  };
}

export function saveAiCredentials(geminiKey, oxylabsUser, oxylabsPass) {
  if (geminiKey !== undefined) localStorage.setItem(GEMINI_KEY_STORAGE, geminiKey.trim());
  if (oxylabsUser !== undefined) localStorage.setItem(OXYLABS_USER_STORAGE, oxylabsUser.trim());
  if (oxylabsPass !== undefined) localStorage.setItem(OXYLABS_PASS_STORAGE, oxylabsPass.trim());
}

/**
 * Fetch live market data via Oxylabs Web Scraper API (Free Tier / Proxy)
 */
export async function fetchOxylabsMarketData(district, typology) {
  const { oxylabsUser, oxylabsPass } = getAiCredentials();

  if (!oxylabsUser || !oxylabsPass) {
    console.log('[Market Scraper] Using built-in codebase Abuja real estate search dataset.');
    const dLower = (district || 'Maitama').toLowerCase();
    let pricePerSqm = '₦450,000 - ₦650,000/sqm';
    let growthRate = '18.5% p.a.';
    let demandDriver = 'Diplomatic missions, institutional funds, and diaspora high-net-worth investors';

    if (dLower.includes('guzape')) {
      pricePerSqm = '₦320,000 - ₦480,000/sqm';
      growthRate = '21.2% p.a.';
      demandDriver = 'Elevated topography luxury residential development and diplomatic ridge expansion';
    } else if (dLower.includes('jabi')) {
      pricePerSqm = '₦380,000 - ₦520,000/sqm';
      growthRate = '19.8% p.a.';
      demandDriver = 'Prime shoreline waterfront access, executive corporate housing, and resort amenities';
    } else if (dLower.includes('katampe')) {
      pricePerSqm = '₦250,000 - ₦380,000/sqm';
      growthRate = '16.4% p.a.';
      demandDriver = 'Diplomatic zone extension, infrastructure completion, and gated community enclaves';
    }

    return `Abuja ${district} ${typology || 'Property'} Real Estate Search Brief:
- Land Value Benchmark: ${pricePerSqm}
- 36-Month Capital Growth Trend: ${growthRate}
- Primary Market Demand Drivers: ${demandDriver}`;
  }

  try {
    const query = `Abuja ${district} ${typology} real estate land price per sqm 2026`;
    const payload = {
      source: 'google_search',
      domain: 'com',
      query: query,
      start_page: 1,
      pages: 1
    };

    const response = await fetch('https://realtime.oxylabs.io/v1/queries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`${oxylabsUser}:${oxylabsPass}`)
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.warn('[Oxylabs API Error]', response.statusText);
      return null;
    }

    const data = await response.json();
    const organicResults = data?.results?.[0]?.content?.results?.organic || [];
    
    const snippets = organicResults.slice(0, 3).map(r => `${r.title}: ${r.snippet}`).join('\n');
    return snippets || null;
  } catch (e) {
    console.warn('[Oxylabs Exception]', e);
    return null;
  }
}

/**
 * Generate Real-Time Investment Thesis via Google Gemini API (Free Tier: 1,500 calls/day)
 */
export async function generateLiveGeminiThesis(propData, liveScrapedContext = null) {
  const { geminiKey } = getAiCredentials();

  if (!geminiKey) {
    return null; // Signals fallback to local benchmark engine
  }

  const prompt = `You are the Chief Real Estate Investment Strategist for Novacrest Homes Limited in Abuja, Nigeria.
Analyze the following development and write a compelling, 2-3 sentence executive Investment Thesis and Capital Return Analysis for diaspora and institutional investors.

Property Specifications:
- Name: ${propData.name}
- District: ${propData.district}, Abuja
- Typology: ${propData.type}
- Price NGN: ₦${Number(propData.priceNGN || 0).toLocaleString()}
- Price USD: $${Number(propData.priceUSD || 0).toLocaleString()} USD
- Land Size: ${propData.landSize || 'N/A'}
- Legal Title: ${propData.titleStatus || 'Certificate of Occupancy (C of O)'} (${propData.titleAgency || 'AGIS Verified'})

${liveScrapedContext ? `Real-Time Market Search Context (via Oxylabs):\n${liveScrapedContext}` : ''}

Instructions:
- Provide specific projected capital appreciation (%) and net annual rental yield (%).
- Highlight legal tenure security (AGIS / C of O) and high diaspora tenant demand.
- Keep it concise, authoritative, and focused on capital growth and rental yield. Do not include markdown code blocks.`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 250
        }
      })
    });

    if (!response.ok) {
      console.warn('[Gemini API Error]', response.statusText);
      return null;
    }

    const json = await response.json();
    const outputText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
    return outputText ? outputText.trim() : null;
  } catch (e) {
    console.warn('[Gemini Exception]', e);
    return null;
  }
}
