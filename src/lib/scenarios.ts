import type { CapturedRecord, Lead, Scenario } from "./types";

const emptyRecord = (lead: Lead, callId: string): CapturedRecord => ({
  lead_id: lead.id,
  call_id: callId,
  contact_verified: null,
  product_interest: lead.formFields.product_interest ?? null,
  amount_sought: lead.formFields.amount_sought ?? null,
  work_type: lead.formFields.work_type ?? null,
  income_band: lead.formFields.income_band ?? null,
  location_preference: lead.formFields.location_preference ?? null,
  document_readiness: null,
  commitment: null,
  objections: [],
  qualification_status: null,
  next_action: null,
  consent_captured: false,
  disclosure_at: null,
  language: lead.language,
});

export { emptyRecord };

const raju: Lead = {
  id: "LD-18402",
  name: "Raju Yadav",
  phoneMasked: "+91 ••••• 4412",
  city: "Lucknow",
  product: "Two-wheeler EV",
  source: "Facebook",
  language: "Hinglish",
  priority: 92,
  attempts: 0,
  consent: true,
  dnd: false,
  formFields: {
    product_interest: "two_wheeler_ev",
    location_preference: "Lucknow",
  },
  notes: "Form submitted 11 minutes ago. Intent still hot.",
};

const priya: Lead = {
  id: "LD-18411",
  name: "Priya Nair",
  phoneMasked: "+91 ••••• 7731",
  city: "Kochi",
  product: "Personal loan",
  source: "Website",
  language: "Hinglish",
  priority: 74,
  attempts: 1,
  consent: true,
  dnd: false,
  formFields: {
    product_interest: "personal_loan",
    location_preference: "Kochi",
    amount_sought: 200000,
  },
  notes: "Requested 2L. No documents uploaded yet.",
};

const amit: Lead = {
  id: "LD-18390",
  name: "Amit Sharma",
  phoneMasked: "+91 ••••• 2208",
  city: "Jaipur",
  product: "Two-wheeler EV",
  source: "Partner",
  language: "Hindi",
  priority: 41,
  attempts: 2,
  consent: true,
  dnd: false,
  formFields: {
    product_interest: "two_wheeler_ev",
    location_preference: "Jaipur",
  },
  notes: "Partner feed. Two prior no-answers.",
};

export const queueLeads: Lead[] = [
  raju,
  priya,
  {
    id: "LD-18418",
    name: "Sneha Patil",
    phoneMasked: "+91 ••••• 9014",
    city: "Pune",
    product: "Rider plan",
    source: "Inbound",
    language: "Hinglish",
    priority: 88,
    attempts: 0,
    consent: true,
    dnd: false,
    formFields: { product_interest: "rider_plan", location_preference: "Pune" },
  },
  amit,
  {
    id: "LD-18407",
    name: "Mohammed Irfan",
    phoneMasked: "+91 ••••• 5520",
    city: "Hyderabad",
    product: "Two-wheeler EV",
    source: "Referral",
    language: "Hinglish",
    priority: 67,
    attempts: 1,
    consent: true,
    dnd: false,
    formFields: { product_interest: "two_wheeler_ev", location_preference: "Hyderabad" },
  },
  {
    id: "LD-18376",
    name: "Kavita Devi",
    phoneMasked: "+91 ••••• 1183",
    city: "Patna",
    product: "Personal loan",
    source: "Facebook",
    language: "Hindi",
    priority: 55,
    attempts: 3,
    consent: true,
    dnd: false,
    formFields: { product_interest: "personal_loan", location_preference: "Patna" },
  },
  {
    id: "LD-18221",
    name: "Vikram Singh",
    phoneMasked: "+91 ••••• 6640",
    city: "Indore",
    product: "Rider plan",
    source: "Partner",
    language: "Hinglish",
    priority: 0,
    attempts: 0,
    consent: true,
    dnd: true,
    formFields: { product_interest: "rider_plan" },
    notes: "DND registry. Orchestrator will not dial.",
  },
];

export const scenarios: Scenario[] = [
  {
    id: "qualified",
    label: "Qualified · rider EV",
    outcome: "qualified",
    lead: raju,
    turns: [
      {
        speaker: "system",
        text: "DND and consent checked. Window open. Dialling Raju Yadav.",
        ms: 1600,
        meta: "dnd-check",
      },
      {
        speaker: "system",
        text: "Connected. 0.9s ring time.",
        ms: 900,
        meta: "connect",
      },
      {
        speaker: "agent",
        text: "Namaste, main Ananya bol rahi hoon — Embifi ki AI assistant. Aapne two-wheeler finance ke liye form bhara tha, usi ke baare mein call hai. Kya ab baat karna theek rahega?",
        ms: 5200,
        meta: "disclosure",
        write: {
          consent_captured: true,
          disclosure_at: "11:24:07 IST",
        },
      },
      {
        speaker: "customer",
        text: "Haan, bolo. Main Swiggy pe kaam karta hoon.",
        ms: 2800,
        write: {
          contact_verified: true,
          work_type: "delivery_rider",
        },
      },
      {
        speaker: "agent",
        text: "Samajh gayi. Form mein Lucknow aur EV scooter diya hai — wahi dekh rahe ho? Kitne ke around soch rahe ho?",
        ms: 4200,
      },
      {
        speaker: "customer",
        text: "Haan Lucknow, electric. Socha tha one lakh ke around. Ather ya Ola.",
        ms: 3400,
        write: {
          location_preference: "Lucknow",
          product_interest: "two_wheeler_ev",
          amount_sought: 100000,
          income_band: "rider_typical",
        },
      },
      {
        speaker: "agent",
        text: "Theek hai. Rider plans pe down payment aur EMI dikhate hain — final terms lender review ke baad lock hote hain, main approve nahi kar sakti. Documents ke hisaab se, Aadhaar, PAN aur bank statement phone pe ready hain?",
        ms: 6200,
      },
      {
        speaker: "customer",
        text: "Haan, sab hai. Kab tak pata chalega?",
        ms: 2600,
        write: { document_readiness: true },
      },
      {
        speaker: "agent",
        text: "Application app se start hogi to aaj hi chal padegi. Main WhatsApp pe link bhej deti hoon — teen minute lagenge. Abhi download karoge?",
        ms: 4800,
      },
      {
        speaker: "customer",
        text: "Haan, bhej do.",
        ms: 1800,
        write: { commitment: { type: "app_download", when: "now" } },
      },
      {
        speaker: "agent",
        text: "Ho gaya, Raju. Link aa jayega. Koi sawaal ho to app mein help hai. Dhanyavaad.",
        ms: 3600,
        meta: "outcome",
        write: {
          qualification_status: "qualified",
          next_action: "whatsapp_link",
        },
      },
    ],
  },
  {
    id: "partial",
    label: "Partial · salaried",
    outcome: "partial",
    lead: priya,
    turns: [
      {
        speaker: "system",
        text: "Consent valid. Prior attempt yesterday, no connect. Dialling Priya Nair.",
        ms: 1500,
        meta: "dnd-check",
      },
      {
        speaker: "system",
        text: "Connected.",
        ms: 800,
        meta: "connect",
      },
      {
        speaker: "agent",
        text: "Namaste Priya, main Ananya, Embifi ki AI assistant. Aapne personal loan ke liye website pe enquiry ki thi. Do minute lagenge — ab baat ho sakti hai?",
        ms: 5000,
        meta: "disclosure",
        write: { consent_captured: true, disclosure_at: "11:31:14 IST" },
      },
      {
        speaker: "customer",
        text: "Haan, sun rahi hoon. Two lakh chahiye tha.",
        ms: 2800,
        write: {
          contact_verified: true,
          product_interest: "personal_loan",
          amount_sought: 200000,
        },
      },
      {
        speaker: "agent",
        text: "Noted. Aap salaried ho ya business? Aur Kochi hi base hai?",
        ms: 3200,
      },
      {
        speaker: "customer",
        text: "Salaried, IT firm. Kochi hi. Salary around forty-five.",
        ms: 3000,
        write: {
          work_type: "salaried",
          income_band: "40-50k",
          location_preference: "Kochi",
        },
      },
      {
        speaker: "agent",
        text: "Theek hai. Documents — salary slips, PAN, Aadhaar — abhi phone pe available hain? Final eligibility lender decide karega, main wada nahi kar sakti.",
        ms: 5000,
      },
      {
        speaker: "customer",
        text: "Slips office laptop pe hain, aaj nahi nikaal paungi. Weekend pe try karti hoon.",
        ms: 3800,
        write: {
          document_readiness: false,
          objections: ["documents_not_on_hand"],
        },
      },
      {
        speaker: "agent",
        text: "Koi baat nahi. Main Thursday shaam ko ek reminder WhatsApp kar doon, aur ek callback slot Saturday subah? Tab slips ke saath app complete kar lena.",
        ms: 4800,
      },
      {
        speaker: "customer",
        text: "Saturday theek hai. Abhi mat call karna baar baar.",
        ms: 2600,
        write: { commitment: { type: "callback_slot", when: "Saturday 10:00" } },
      },
      {
        speaker: "agent",
        text: "Samajh gayi — aaj ke baad Saturday tak koi call nahi. Reminder pe link rahega. Dhanyavaad, Priya.",
        ms: 3800,
        meta: "outcome",
        write: {
          qualification_status: "partial",
          next_action: "nurture",
        },
      },
    ],
  },
  {
    id: "dnc",
    label: "Do not contact",
    outcome: "do_not_contact",
    lead: amit,
    turns: [
      {
        speaker: "system",
        text: "Consent on partner feed. Attempt 3 of 3 today. Dialling Amit Sharma.",
        ms: 1500,
        meta: "dnd-check",
      },
      {
        speaker: "system",
        text: "Connected.",
        ms: 700,
        meta: "connect",
      },
      {
        speaker: "agent",
        text: "Namaste, main Ananya bol rahi hoon, Embifi ki AI assistant. Aapke two-wheeler loan enquiry ke baare mein—",
        ms: 2800,
        meta: "barge-in",
        write: { consent_captured: true, disclosure_at: "11:38:02 IST" },
      },
      {
        speaker: "customer",
        text: "Arre, kaun ho tum? Maine koi form nahi bhara. Number kahaan se mila?",
        ms: 3200,
        write: { contact_verified: true },
      },
      {
        speaker: "agent",
        text: "Aapka number partner listing se aaya hai, consent ke saath. Agar aap interested nahi ho to main abhi band kar deti hoon. Call band karoon?",
        ms: 4600,
      },
      {
        speaker: "customer",
        text: "Haan, number hatao. Mat call karna, kisi campaign se nahi.",
        ms: 2800,
        meta: "opt-out",
        write: { objections: ["did_not_apply", "do_not_contact"] },
      },
      {
        speaker: "agent",
        text: "Ho gaya. Aapka number saari campaigns se suppress ho gaya hai. Phir call nahi aayegi. Maaf kijiye, Amit. Namaste.",
        ms: 4200,
        meta: "outcome",
        write: {
          qualification_status: "do_not_contact",
          next_action: "suppress",
        },
      },
    ],
  },
];

export function scenarioByLeadId(id: string) {
  return scenarios.find((s) => s.lead.id === id) ?? scenarios[0];
}
