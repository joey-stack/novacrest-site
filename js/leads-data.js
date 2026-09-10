/**
 * NOVACREST HOMES LIMITED — AI CRM Leads & Sales Pipeline Engine
 * Manages Investor Leads, Pipeline Stages, AI Qualification Scores, Risk Ratings, and Firestore Sync
 */

import { saveFirestoreDocument, fetchFirestoreCollection, deleteFirestoreDocument } from './firebase-config.js';

export const CRM_STAGES = [
  { id: 'new', label: 'New Inquiry', badgeClass: 'stage-new', icon: '📥', desc: 'Web form & WhatsApp incoming inquiries' },
  { id: 'qualified', label: 'Contacted & Qualified', badgeClass: 'stage-qualified', icon: '🎯', desc: 'Budget & title expectations verified' },
  { id: 'inspection', label: 'Inspection Scheduled', badgeClass: 'stage-inspection', icon: '🏰', desc: 'Private site tour or virtual 3D walkthrough' },
  { id: 'proposal', label: 'Offer & Deed Sent', badgeClass: 'stage-proposal', icon: '📑', desc: 'Formal offer sheet & allocation terms' },
  { id: 'closed', label: 'Closed & Won', badgeClass: 'stage-closed', icon: '🎉', desc: 'Payment received & Deed of Assignment executed' }
];

export const INITIAL_LEADS = [
  {
    id: 'lead-101',
    name: 'Dr. Kelechi Nwosu',
    phone: '+447700900123',
    email: 'kelechi.nwosu@nhs.uk',
    location: 'London, UK (Diaspora)',
    interest: 'Nova Crest Palace (Maitama)',
    propertyId: 'nova-crest-palace-maitama',
    budgetNGN: 850000000,
    budgetUSD: 550000,
    stage: 'inspection',
    riskLevel: 'low',
    aiScore: 96,
    aiSummary: 'Senior NHS Consultant in London relocating to Maitama. High liquidity cash buyer with immediate closing intent.',
    notes: [
      { date: '2026-09-02', text: 'Inquired via Website Consultation Form.' },
      { date: '2026-09-06', text: 'Virtual 3D Walkthrough completed with spouse. Requested AGIS C of O verification copy.' }
    ],
    source: 'Website Consultation Form',
    timestamp: '2026-09-02T10:30:00Z'
  },
  {
    id: 'lead-102',
    name: 'Mrs. Amina Bello',
    phone: '+17135550192',
    email: 'a.bello@chevron-us.com',
    location: 'Houston, TX (Energy Executive)',
    interest: 'Karshi Horizon Land Banking',
    propertyId: 'karshi-horizon-plots',
    budgetNGN: 180000000,
    budgetUSD: 120000,
    stage: 'proposal',
    riskLevel: 'low',
    aiScore: 91,
    aiSummary: 'Purchasing 1,000 sqm commercial land banking parcels for long-term capital inflation hedge in Karshi axis.',
    notes: [
      { date: '2026-09-03', text: 'Initial WhatsApp inquiry on land plot allocation schedule.' },
      { date: '2026-09-07', text: 'Drafted 3-tranche milestone payment plan. Offer sheet pending signature.' }
    ],
    source: 'WhatsApp Advisory',
    timestamp: '2026-09-03T14:15:00Z'
  },
  {
    id: 'lead-103',
    name: 'Engr. Farouk Al-Mansoor',
    phone: '+2348039988776',
    email: 'farouk@almansoor-corp.ng',
    location: 'Abuja (Central Business District)',
    interest: 'Guzape Diplomatic Ridge Villa',
    propertyId: 'guzape-diplomatic-ridge',
    budgetNGN: 620000000,
    budgetUSD: 400000,
    stage: 'qualified',
    riskLevel: 'medium',
    aiScore: 84,
    aiSummary: 'Corporate executive expanding luxury portfolio. Requires smart home automation & 6-car basement garage.',
    notes: [
      { date: '2026-09-05', text: 'Phone consultation regarding Guzape topography and road paving timeline.' }
    ],
    source: 'Direct Phone Inquiry',
    timestamp: '2026-09-05T09:00:00Z'
  },
  {
    id: 'lead-104',
    name: 'Chief Emeka & Barr. Ifeoma Okonkwo',
    phone: '+2348021122334',
    email: 'ifeoma@okonkwo-law.ng',
    location: 'Lagos / Abuja',
    interest: 'Jabi Lakefront Heights Duplex',
    propertyId: 'jabi-lakefront-heights',
    budgetNGN: 480000000,
    budgetUSD: 310000,
    stage: 'closed',
    riskLevel: 'low',
    aiScore: 98,
    aiSummary: 'Transaction completed! Full payment cleared for 4-Bedroom Waterfront Terrace Duplex with private dock access.',
    notes: [
      { date: '2026-08-20', text: 'Inspected site in person.' },
      { date: '2026-08-28', text: 'Deed of Assignment signed & funds disbursed.' }
    ],
    source: 'Executive Referral',
    timestamp: '2026-08-20T11:45:00Z'
  },
  {
    id: 'lead-105',
    name: 'Dr. Tariq Sanusi',
    phone: '+14165550882',
    email: 'tariq.sanusi@toronto-health.ca',
    location: 'Toronto, Canada',
    interest: 'Katampe Diplomatic Enclave',
    propertyId: 'katampe-diplomatic-enclave',
    budgetNGN: 350000000,
    budgetUSD: 230000,
    stage: 'new',
    riskLevel: 'high',
    aiScore: 68,
    aiSummary: 'Inquired about Katampe off-plan prices via web form. High risk due to 5 days without response to initial email.',
    notes: [
      { date: '2026-09-04', text: 'Form submitted on website.' }
    ],
    source: 'Website Consultation Form',
    timestamp: '2026-09-04T16:20:00Z'
  }
];

const LEADS_STORAGE_KEY = 'novacrest_leads';

/**
 * Fetch all leads from local storage or seed data
 */
export function getLeads() {
  try {
    const stored = localStorage.getItem(LEADS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('[Leads Data Error]', err);
  }
  saveLeadsLocal(INITIAL_LEADS);
  return INITIAL_LEADS;
}

/**
 * Save leads array to local storage
 */
export function saveLeadsLocal(leads) {
  try {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
  } catch (err) {
    console.warn('[Leads Save Local Error]', err);
  }
}

/**
 * Add or Update single lead
 */
export function saveLead(lead) {
  const leads = getLeads();
  const index = leads.findIndex(l => l.id === lead.id);
  
  if (index >= 0) {
    leads[index] = { ...leads[index], ...lead, timestamp: new Date().toISOString() };
  } else {
    lead.id = lead.id || 'lead-' + Date.now();
    lead.timestamp = lead.timestamp || new Date().toISOString();
    lead.stage = lead.stage || 'new';
    lead.riskLevel = lead.riskLevel || 'low';
    lead.aiScore = lead.aiScore || calculateDefaultAiScore(lead);
    leads.unshift(lead);
  }
  
  saveLeadsLocal(leads);
  saveFirestoreDocument('leads', lead.id, lead);
  return lead;
}

/**
 * Update lead stage (e.g. via Kanban drag-and-drop or select)
 */
export function updateLeadStage(id, newStage) {
  const leads = getLeads();
  const lead = leads.find(l => l.id === id);
  if (lead) {
    lead.stage = newStage;
    lead.updatedAt = new Date().toISOString();
    saveLeadsLocal(leads);
    saveFirestoreDocument('leads', lead.id, lead);
  }
  return lead;
}

/**
 * Delete a lead record
 */
export function deleteLead(id) {
  let leads = getLeads();
  leads = leads.filter(l => l.id !== id);
  saveLeadsLocal(leads);
  deleteFirestoreDocument('leads', id);
}

/**
 * Sync Cloud Firestore leads down to local session
 */
export async function fetchFirestoreLeads() {
  const remote = await fetchFirestoreCollection('leads');
  if (remote && Array.isArray(remote) && remote.length > 0) {
    saveLeadsLocal(remote);
    return remote;
  }
  return getLeads();
}

/**
 * Sync all local leads to Cloud Firestore
 */
export async function syncAllLeadsToFirestore() {
  const leads = getLeads();
  let count = 0;
  for (const lead of leads) {
    const success = await saveFirestoreDocument('leads', lead.id, lead);
    if (success) count++;
  }
  return count;
}

/**
 * Calculate lead score helper (0-100)
 */
function calculateDefaultAiScore(lead) {
  let score = 70;
  if (lead.phone && lead.phone.length > 8) score += 10;
  if (lead.email && lead.email.includes('@')) score += 10;
  if (lead.budgetNGN && lead.budgetNGN > 300000000) score += 10;
  return Math.min(100, score);
}
