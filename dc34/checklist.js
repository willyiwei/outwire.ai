const PROFILE_QUESTIONS = [
  { id: 'data', text: 'Does your application handle personal, confidential, or customer data?', categories: [0, 4, 5, 7] },
  { id: 'tools', text: 'Can the AI call tools or take actions outside the conversation?', categories: [0, 2, 3, 6, 7] },
  { id: 'content', text: 'Does it read uploaded files, retrieved documents, email, or web content?', categories: [2, 4, 6] },
  { id: 'multiuser', text: 'Can multiple users or organizations access the application?', categories: [0, 4, 5] },
  { id: 'impact', text: 'Can an AI action spend money, modify important data, execute code, or affect production?', categories: [0, 3, 5, 6, 7] },
];

const CATEGORIES = [
  {
    name: 'Map the Blast Radius',
    checks: [
      { id: 'blast-access', text: 'List the data, systems, and external services your AI can access.', why: 'You cannot contain an incident until you know what the application can reach.', verify: 'Trace model, database, storage, API, and retrieval connections. Remove anything you cannot explain.', risk: 75 },
      { id: 'blast-actions', text: 'List every action it can take, and require confirmation before high-impact actions.', why: 'An AI mistake becomes consequential when it can act without a trustworthy approval boundary.', verify: 'Inventory tool calls and workflows. Test that payments, messages, data changes, and code execution pause for approval.', risk: 92 },
      { id: 'blast-outcome', text: 'Identify the worst realistic outcome, then remove access or add limits to reduce its impact.', why: 'A defined worst case turns abstract risk into specific engineering decisions.', verify: 'Write one credible failure scenario and confirm that permissions, rate limits, or isolation reduce the damage.', risk: 85 },
    ],
  },
  {
    name: 'Protect Secrets & Generated Code',
    checks: [
      { id: 'secret-search', text: 'Search your repository, browser code, prompts, and logs for exposed credentials; remove and rotate anything you find.', why: 'A leaked credential can bypass every control in the AI interface.', verify: 'Run repository and secret searches, inspect browser bundles and logs, then rotate—not merely delete—exposed credentials.', risk: 100 },
      { id: 'code-review', text: 'Manually review AI-generated code that handles login, permissions, payments, uploads, or sensitive data.', why: 'Generated code can look plausible while omitting checks or introducing unsafe defaults.', verify: 'Have a person trace trust boundaries, error paths, and authorization decisions in each sensitive workflow.', risk: 86 },
      { id: 'vuln-scan', text: 'Run dependency vulnerability and secret scans; investigate all critical and high-severity findings.', why: 'Known vulnerable packages and committed secrets are common, preventable entry points.', verify: 'Use your repository host and package manager security tools. A pass means every severe finding is fixed or explicitly understood.', risk: 82 },
    ],
  },
  {
    name: 'Test for Prompt Injection',
    checks: [
      { id: 'direct-injection', text: 'Ask the AI to ignore its instructions, reveal hidden prompts, or perform prohibited actions; record what succeeds.', why: 'Direct attacks reveal whether prompts are being mistaken for enforceable security controls.', verify: 'Try multiple phrasings and encodings. Record successful behavior and fix the underlying application boundary.', risk: 70 },
      { id: 'indirect-injection', text: 'Place malicious instructions inside content the AI reads and verify that it does not follow them.', why: 'Documents, webpages, emails, and retrieved records can carry instructions the user never sees.', verify: 'Insert a harmless test instruction into retrieved content and observe whether it changes behavior or triggers tools.', risk: 94 },
      { id: 'trusted-controls', text: 'Move security decisions into trusted application code; never rely on prompts to enforce them.', why: 'Model instructions are probabilistic and can be overridden or misunderstood.', verify: 'Confirm that access control, approvals, destinations, and spending limits are enforced after model output by trusted code.', risk: 98 },
    ],
  },
  {
    name: 'Restrict Agents & Tools',
    checks: [
      { id: 'least-privilege', text: 'Remove every tool, permission, file path, and network destination the AI does not need.', why: 'Each unnecessary capability expands what prompt injection or model error can reach.', verify: 'Start with no access, then allow only the exact operations and destinations required for the task.', risk: 95 },
      { id: 'human-confirmation', text: 'Require confirmation before the AI sends messages, spends money, changes data, or executes code.', why: 'Human approval creates a boundary before an uncertain model decision becomes a real-world action.', verify: 'Trigger every consequential action and verify that a clear, specific approval is required immediately before execution.', risk: 97 },
      { id: 'agent-limits', text: 'Set limits on tool calls, runtime, tokens, and spending, then test that those limits work.', why: 'Loops and abuse can create outages, runaway costs, or repeated destructive actions.', verify: 'Deliberately hit each limit in a safe environment and confirm that execution stops and produces an alert.', risk: 78 },
    ],
  },
  {
    name: 'Minimize & Protect Data',
    checks: [
      { id: 'data-minimize', text: 'Inspect what your app sends to the AI; remove or redact personal and confidential fields the task does not require.', why: 'Data that never reaches a model cannot leak through its output, provider, or logs.', verify: 'Inspect actual model requests with test data containing known personal fields and confirm unnecessary fields are absent.', risk: 90 },
      { id: 'provider-settings', text: 'Verify the provider’s retention and training settings, then configure them for your data requirements.', why: 'Provider defaults may not match your promises to users or your organization’s requirements.', verify: 'Document the active account settings, retention period, training policy, region, and deletion process.', risk: 73 },
      { id: 'tenant-data', text: 'Test that one user cannot retrieve another user’s prompts, files, history, or search results.', why: 'Cross-user access is a direct confidentiality and authorization failure.', verify: 'Use two test accounts and attempt to access each other’s identifiers, retrieval results, uploads, and conversation history.', risk: 99 },
    ],
  },
  {
    name: 'Enforce Identity & Access',
    checks: [
      { id: 'backend-authz', text: 'Require the backend—not the AI—to verify permission before every sensitive access or action.', why: 'The model cannot be trusted to decide who is authorized.', verify: 'Trace sensitive requests and confirm server-side code checks the authenticated identity against the requested resource and action.', risk: 100 },
      { id: 'tamper-ids', text: 'Change IDs, paths, and tool arguments in test requests; verify that you cannot access another user’s resources.', why: 'User-controlled identifiers commonly expose broken object-level authorization.', verify: 'Intercept test requests, substitute values belonging to another test account, and expect a denied response.', risk: 98 },
      { id: 'admin-separation', text: 'Keep administrative functions and credentials separate from ordinary user and AI access.', why: 'Shared administrative access turns a normal application compromise into a system-wide incident.', verify: 'Confirm the default runtime identity lacks administrative roles and that admin operations use a separate protected path.', risk: 91 },
    ],
  },
  {
    name: 'Validate AI Output',
    checks: [
      { id: 'untrusted-output', text: 'Treat AI-generated text, links, code, and structured data as untrusted input.', why: 'Models can reproduce attacker-controlled content or generate unsafe syntax.', verify: 'Map every place output is displayed or consumed and ensure it receives the same controls as other untrusted input.', risk: 83 },
      { id: 'validate-format', text: 'Validate output against explicit formats and allowed values before passing it to another system.', why: 'Strict validation reduces the chance that unexpected model output becomes an instruction.', verify: 'Reject missing fields, unknown values, extra commands, invalid URLs, and output that does not match a defined schema.', risk: 88 },
      { id: 'malicious-output', text: 'Test malicious output and verify that it cannot execute scripts, commands, queries, or unauthorized actions.', why: 'Unsafe downstream use can turn model output into code injection or cross-site scripting.', verify: 'Use harmless test payloads for HTML, shell, database, and tool contexts relevant to your application.', risk: 96 },
    ],
  },
  {
    name: 'Monitor & Prepare to Respond',
    checks: [
      { id: 'audit-events', text: 'Record every AI request and tool call with investigative metadata, excluding secrets and unnecessary personal data.', why: 'Without an audit trail, misuse and failures are difficult to detect or reconstruct.', verify: 'Confirm events include time, request ID, user or tenant, model version, tool decision, result, usage, and cost.', risk: 76 },
      { id: 'alerts', text: 'Alert on unusual spending, repeated failures, excessive tool use, and prohibited access attempts.', why: 'Useful telemetry must reach someone quickly enough to limit damage.', verify: 'Trigger safe test events and verify that alerts reach a named owner with enough context to investigate.', risk: 80 },
      { id: 'kill-switch', text: 'Test that you can disable the AI, revoke credentials, stop tools, and roll back during an incident.', why: 'An untested response control may fail precisely when it is needed.', verify: 'Run a tabletop or staging exercise and record who can perform each containment step and how long it takes.', risk: 89 },
    ],
  },
];

const STORAGE_KEY = 'outwire:dc34-checklist:v1';
let state = loadState();

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return { statuses: saved.statuses || {}, profile: saved.profile || {} };
  } catch { return { statuses: {}, profile: {} }; }
}

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

function renderProfile() {
  const host = document.querySelector('#profile-questions');
  PROFILE_QUESTIONS.forEach((q, index) => {
    const row = document.createElement('div');
    row.className = 'profile-question';
    row.innerHTML = `<span class="num">0${index + 1}</span><span>${q.text}</span><div class="answer-buttons"><button class="small-choice" type="button" data-answer="yes">Yes</button><button class="small-choice" type="button" data-answer="no">No</button></div>`;
    row.querySelectorAll('[data-answer]').forEach(button => {
      button.setAttribute('aria-pressed', state.profile[q.id] === button.dataset.answer ? 'true' : 'false');
      button.addEventListener('click', () => {
        state.profile[q.id] = button.dataset.answer;
        saveState();
        renderProfileStates();
        updatePriorities();
      });
    });
    host.append(row);
  });
}

function renderProfileStates() {
  document.querySelectorAll('.profile-question').forEach((row, index) => {
    const value = state.profile[PROFILE_QUESTIONS[index].id];
    row.querySelectorAll('[data-answer]').forEach(button => button.setAttribute('aria-pressed', value === button.dataset.answer ? 'true' : 'false'));
  });
}

function renderCategories() {
  const host = document.querySelector('#categories');
  const template = document.querySelector('#category-template');
  CATEGORIES.forEach((category, categoryIndex) => {
    const fragment = template.content.cloneNode(true);
    const section = fragment.querySelector('.category');
    const toggle = fragment.querySelector('.category-toggle');
    const content = fragment.querySelector('.category-content');
    section.dataset.category = categoryIndex;
    fragment.querySelector('.category-number').textContent = `0${categoryIndex + 1}`;
    fragment.querySelector('.category-name').textContent = category.name;
    toggle.setAttribute('aria-controls', `category-${categoryIndex}`);
    content.id = `category-${categoryIndex}`;
    category.checks.forEach((check, checkIndex) => content.append(renderCheck(check, categoryIndex, checkIndex)));
    toggle.addEventListener('click', () => setCategoryOpen(section, toggle.getAttribute('aria-expanded') !== 'true'));
    host.append(fragment);
  });
  const first = host.querySelector('.category');
  setCategoryOpen(first, true);
}

function renderCheck(check, categoryIndex, checkIndex) {
  const article = document.createElement('article');
  article.className = 'check';
  article.dataset.check = check.id;
  article.innerHTML = `
    <span class="check-index">${categoryIndex + 1}.${checkIndex + 1}</span>
    <h3>${check.text}</h3>
    <div class="check-status" role="group" aria-label="Review result">
      <button class="status-button" type="button" data-value="good">✓ Passes check</button>
      <button class="status-button" type="button" data-value="work">! Needs work</button>
    </div>
    <div class="check-details">
      <button class="detail-toggle" type="button" data-detail="why" aria-expanded="false">Why it matters +</button>
      <button class="detail-toggle" type="button" data-detail="verify" aria-expanded="false">How to verify +</button>
      <p class="detail-copy" hidden></p>
    </div>`;
  article.querySelectorAll('.status-button').forEach(button => {
    button.addEventListener('click', () => setStatus(check.id, button.dataset.value));
  });
  article.querySelectorAll('.detail-toggle').forEach(button => {
    button.addEventListener('click', () => toggleDetail(article, button, check[button.dataset.detail]));
  });
  updateCheckState(article, check.id);
  return article;
}

function setCategoryOpen(section, open) {
  section.querySelector('.category-toggle').setAttribute('aria-expanded', String(open));
  section.querySelector('.category-content').hidden = !open;
}

function toggleDetail(article, button, copy) {
  const output = article.querySelector('.detail-copy');
  const wasOpen = button.getAttribute('aria-expanded') === 'true';
  article.querySelectorAll('.detail-toggle').forEach(item => {
    item.setAttribute('aria-expanded', 'false');
    item.textContent = `${item.dataset.detail === 'why' ? 'Why it matters' : 'How to verify'} +`;
  });
  if (wasOpen) { output.hidden = true; return; }
  button.setAttribute('aria-expanded', 'true');
  button.textContent = `${button.dataset.detail === 'why' ? 'Why it matters' : 'How to verify'} −`;
  output.textContent = copy;
  output.hidden = false;
}

function setStatus(id, value) {
  state.statuses[id] = state.statuses[id] === value ? undefined : value;
  if (!state.statuses[id]) delete state.statuses[id];
  saveState();
  updateCheckState(document.querySelector(`[data-check="${id}"]`), id);
  updateSummary();
}

function updateCheckState(article, id) {
  const value = state.statuses[id];
  if (value) article.dataset.status = value; else delete article.dataset.status;
  article.querySelectorAll('.status-button').forEach(button => button.setAttribute('aria-pressed', button.dataset.value === value ? 'true' : 'false'));
}

function relevantCategories() {
  const relevant = new Set();
  PROFILE_QUESTIONS.forEach(q => {
    if (state.profile[q.id] === 'yes') q.categories.forEach(index => relevant.add(index));
  });
  return relevant;
}

function updatePriorities() {
  const relevant = relevantCategories();
  document.querySelectorAll('.category').forEach((section, index) => {
    const prioritized = relevant.has(index);
    section.classList.toggle('is-priority', prioritized);
    section.querySelector('.priority-badge').hidden = !prioritized;
  });
  updateSummary();
}

function allChecks() {
  return CATEGORIES.flatMap((category, categoryIndex) => category.checks.map(check => ({ ...check, categoryIndex, category: category.name })));
}

function priorityItems() {
  const relevant = relevantCategories();
  return allChecks()
    .filter(check => state.statuses[check.id] === 'work')
    .map(check => ({ ...check, adjustedRisk: check.risk + (relevant.has(check.categoryIndex) ? 12 : 0) }))
    .sort((a, b) => b.adjustedRisk - a.adjustedRisk);
}

function updateSummary() {
  const checks = allChecks();
  const reviewed = checks.filter(check => state.statuses[check.id]).length;
  const good = checks.filter(check => state.statuses[check.id] === 'good').length;
  const work = checks.filter(check => state.statuses[check.id] === 'work').length;
  const open = checks.length - reviewed;
  const percent = Math.round(reviewed / checks.length * 100);

  document.querySelectorAll('.progress-count').forEach(el => el.textContent = `${reviewed} of ${checks.length} reviewed`);
  document.querySelectorAll('.progress-track span').forEach(el => el.style.width = `${percent}%`);
  document.querySelector('.progress-percent').textContent = `${percent}%`;
  document.querySelector('[data-stat="good"]').textContent = good;
  document.querySelector('[data-stat="work"]').textContent = work;
  document.querySelector('[data-stat="open"]').textContent = open;
  document.querySelector('#review-title').textContent = reviewed === 0 ? 'Start with one check.' : reviewed === checks.length ? 'Review complete.' : 'Keep checking.';

  CATEGORIES.forEach((category, index) => {
    const categoryReviewed = category.checks.filter(check => state.statuses[check.id]).length;
    document.querySelector(`[data-category="${index}"] .category-summary`).textContent = `${categoryReviewed} / ${category.checks.length}`;
  });

  const priorities = priorityItems();
  const results = document.querySelector('.priority-results');
  results.hidden = priorities.length === 0;
  document.querySelector('#priority-list').innerHTML = priorities.slice(0, 5).map(item => `<li>${item.text}</li>`).join('');
  document.querySelectorAll('[data-copy-results], [data-print-results], [data-reset-progress]').forEach(button => button.disabled = reviewed === 0);
}

function resultsText() {
  const checks = allChecks();
  const good = checks.filter(check => state.statuses[check.id] === 'good');
  const work = priorityItems();
  const open = checks.filter(check => !state.statuses[check.id]);
  const lines = [
    'OUTWIRE AI APPLICATION SECURITY REVIEW',
    `Reviewed: ${new Date().toLocaleDateString()}`,
    '',
    `${checks.length - open.length} of ${checks.length} checks reviewed`,
    `${good.length} checks passed · ${work.length} need work · ${open.length} not reviewed`,
  ];
  if (work.length) lines.push('', 'PRIORITY ACTIONS', ...work.map((item, index) => `${index + 1}. ${item.text}`));
  if (open.length) lines.push('', 'NOT YET REVIEWED', ...open.map(item => `- ${item.text}`));
  lines.push('', 'Self-assessment only—not a certification or guarantee of security.', 'https://outwire.ai/dc34');
  return lines.join('\n');
}

async function copyResults() {
  const message = document.querySelector('.action-message');
  try {
    await navigator.clipboard.writeText(resultsText());
    message.textContent = 'Results copied to clipboard.';
  } catch {
    message.textContent = 'Copy was blocked by your browser. Try Print / save PDF.';
  }
}

function nextSection() {
  const sections = [...document.querySelectorAll('.category')];
  const next = sections.find(section => {
    const rect = section.getBoundingClientRect();
    return rect.top > 100;
  });
  (next || document.querySelector('#review-card')).scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (next) setCategoryOpen(next, true);
}

function resetProgress() {
  if (!window.confirm('Reset all 24 checklist responses? Your optional app profile will be kept.')) return;
  state.statuses = {};
  saveState();
  document.querySelectorAll('[data-check]').forEach(article => updateCheckState(article, article.dataset.check));
  updateSummary();
  const message = document.querySelector('.action-message');
  message.textContent = 'Checklist progress reset.';
  document.querySelector('#checklist').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.querySelectorAll('[data-open-profile]').forEach(button => button.addEventListener('click', () => {
  const profile = document.querySelector('#risk-profile');
  profile.hidden = false;
  profile.scrollIntoView({ behavior: 'smooth' });
}));
document.querySelector('[data-clear-profile]').addEventListener('click', () => {
  state.profile = {};
  saveState();
  renderProfileStates();
  updatePriorities();
});
document.querySelector('[data-copy-results]').addEventListener('click', copyResults);
document.querySelector('[data-print-results]').addEventListener('click', () => window.print());
document.querySelector('[data-reset-progress]').addEventListener('click', resetProgress);
document.querySelector('[data-next-section]').addEventListener('click', nextSection);

renderProfile();
renderCategories();
updatePriorities();
