// data.jsx — all site content; edit this file to update copy
export const OUTWIRE_DATA = {
  profile: {
    name: 'Will Yi',
    role: 'AI Security Professional · Founder',
    location: 'Seattle WA · Remote',
    experience: '18 years',
    leadership: '10 years',
    companies: ['Cisco Systems', 'WatchGuard Technologies'],
    credentials: [
      'CISSP (in progress)',
      'AWS Solutions Architect – Associate',
      'PMP',
      'Certified ScrumMaster (CSM)',
    ],
    links: {
      linkedin: 'https://www.linkedin.com/in/willyi/',
      substack: 'https://outwire.substack.com/',
      youtube: 'https://www.youtube.com/@outwireai',
      twitter: 'https://x.com/outwireai',
      github: 'https://github.com/willyiwei',
      email: 'hello@outwire.ai',
    },
  },

  topics: [
    {
      n: '01',
      title: 'Prompt Injection',
      body: 'Indirect attacks, tool-chain manipulation, and why your RAG pipeline is a confused deputy waiting to happen.',
    },
    {
      n: '02',
      title: 'Agent Security',
      body: 'Autonomous LLM agents that can read your email, write code, and wire money. What could go wrong.',
    },
    {
      n: '03',
      title: 'Red Teaming LLMs',
      body: 'Structured adversarial evaluation: jailbreaks, data exfiltration, and the art of making a model misbehave on command.',
    },
    {
      n: '04',
      title: 'Model & Data Theft',
      body: 'Extraction attacks, watermarking, training-data reconstruction — and the supply chain underneath it all.',
    },
    {
      n: '05',
      title: 'Governance & Policy',
      body: 'EU AI Act, NIST AI RMF, ISO 42001. What compliance actually means when the system is nondeterministic.',
    },
    {
      n: '06',
      title: 'Secure AI Engineering',
      body: 'Threat modeling for LLM apps, defense-in-depth for agents, and guardrails that survive contact with users.',
    },
  ],

  videos: [
    {
      status: 'Planned episode',
      title: "Your RAG Pipeline Is a Security Nightmare (Here's Why)",
      accent: 'indirect prompt injection — live demo',
    },
    {
      status: 'Planned episode',
      title: "I Red-Teamed a Production LLM Agent. It Didn't Go Well.",
      accent: 'field notes from the trenches',
    },
    {
      status: 'Planned episode',
      title: 'The OWASP Top 10 for LLMs, Explained',
      accent: 'what every engineer should know',
    },
  ],

  posts: [
    {
      status: 'Published · Jul 21, 2026',
      title: 'Your AI Agent Has a Blast Radius. Do You Know How Big It Is?',
      excerpt: 'Before you give an AI agent access to email, customer data, code, or money, measure how much damage one bad decision could cause.',
      url: 'https://outwire.substack.com/p/your-ai-agent-has-a-blast-radius?r=57ywg7',
    },
    {
      status: 'Planned essay',
      title: 'A Threat Model for Your Customer Support Chatbot',
      excerpt: 'Six attack paths, three mitigations, and one uncomfortable truth about vendor isolation.',
    },
    {
      status: 'Planned essay',
      title: 'The Quiet Rise of Indirect Prompt Injection',
      excerpt: "Your model is fine. The document it just summarized, on the other hand, isn't.",
    },
    {
      status: 'Planned essay',
      title: 'CISSP for the AI-Native Engineer',
      excerpt: 'Notes from the domain, translated for people who build with foundation models.',
    },
  ],

  resources: [
    { n: '01', title: 'OWASP Top 10 for LLM Applications', author: 'OWASP Foundation', kind: 'Framework' },
    { n: '02', title: 'NIST AI Risk Management Framework', author: 'U.S. Dept. of Commerce', kind: 'Standard' },
    { n: '03', title: 'MITRE ATLAS — Adversarial Threat Landscape for AI', author: 'MITRE Corporation', kind: 'Knowledge base' },
    { n: '04', title: 'Prompt Injection: A Critical Vulnerability in LLMs', author: 'Simon Willison', kind: 'Essay series' },
    { n: '05', title: 'Anthropic Responsible Scaling Policy', author: 'Anthropic', kind: 'Policy' },
    { n: '06', title: 'Red-Teaming Language Models — A Practical Guide', author: 'Outwire Labs', kind: 'Field guide' },
    { n: '07', title: 'Google Secure AI Framework (SAIF)', author: 'Google', kind: 'Framework' },
  ],

  services: [
    { n: '01', name: 'Threat modeling for LLM systems', status: 'Q3 2026' },
    { n: '02', name: 'Red-team engagements & jailbreak assessments', status: 'Q3 2026' },
    { n: '03', name: 'AI security architecture review', status: 'Q4 2026' },
    { n: '04', name: 'Executive workshops & team training', status: 'Q4 2026' },
  ],

  channels: [
    { n: '01', name: 'YouTube', handle: '@outwireai', url: 'https://www.youtube.com/@outwireai' },
    { n: '02', name: 'Substack', handle: 'outwire.substack.com', url: 'https://outwire.substack.com/' },
    { n: '03', name: 'LinkedIn', handle: '/in/willyi', url: 'https://www.linkedin.com/in/willyi/' },
    { n: '04', name: 'X (Twitter)', handle: '@outwireai', url: 'https://x.com/outwireai' },
    { n: '05', name: 'GitHub', handle: '@willyiwei', url: 'https://github.com/willyiwei' },
  ],
};
