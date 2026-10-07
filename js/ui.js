// Helper functions for UI stuff 

// Convert a number to a NZD money string 
function money(n) {
  return "$" + n.toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Get all accounts across all identities
function allAccounts() {
  return state.identities.flatMap(i => i.accounts.map(a => ({ ...a, identity: i })));
}

// Find an account by ID
function findAccount(id) { return allAccounts().find(a => a.id === id); }

// Get the total balance across all accounts
function totalBalance() { return allAccounts().reduce((sum, a) => sum + a.balance, 0); }

// Get the total balance for an identity
function identityTotal(i) { return i.accounts.reduce((sum, a) => sum + a.balance, 0); }

// Go back to a screen button
function topbar(title, backTo) {
  const back = backTo ? `<button class="round" onclick="go('${backTo}')">←</button>` : "";
  return `<div class="topbar">${back}<div class="title">${title}</div></div>`;
}

// Progress bar 
function bar(percent, extra = "") {
  return `<div class="bar ${extra}"><div style="width:${Math.min(100, percent)}%"></div></div>`;
}

// Dropdown for accounts
function accountSelect(id) {
  const options = allAccounts()
    .map(a => `<option value="${a.id}">${a.identity.name} - ${a.name} (${money(a.balance)})</option>`).join("");
  return `<select id="${id}">${options}</select>`;
}

// Bottom nav bar
function navBar(active) {
  const tabs = [
    { screen: "home",     icon: "⌂", label: "Home" },
    { screen: "accounts", icon: "▤", label: "Accounts" },
    { screen: "save",     icon: "◎", label: "Save" },
    { screen: "settings", icon: "⚙", label: "Settings" }
  ];
  const buttons = tabs.map(t =>
    `<button class="${t.screen === active ? "active" : ""}" onclick="go('${t.screen}')">
       <span class="icon">${t.icon}</span>${t.label}</button>`).join("");
  return `<div class="nav">${buttons}</div>`;
}

// Add a transaction to the list
function addTransaction(name, amount) {
  state.transactions.unshift({ name, date: "Today", amount });
}

// Format transactions
function transactionRow(t) {
  const colour = t.amount > 0 ? "color:var(--mint-dark)" : "";
  const sign = t.amount > 0 ? "+" : "-";
  return `<div class="row" style="padding:10px 0;border-bottom:1px solid var(--grey)">
    <div>${t.name}<div class="small">${t.date}</div></div>
    <b style="${colour}">${sign}${money(Math.abs(t.amount))}</b></div>`;
}

// Fancy bell
function bellButton(hasAlert) {
  return `<button class="round bell" onclick="go('alerts')" aria-label="Alerts">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>
    ${hasAlert ? '<span class="dot"></span>' : ""}</button>`;
}

function shortMoney(n) { return "$" + (n >= 1000 ? n / 1000 + "k" : n); }

// Decide which milestones to show for a goal based on the target amount
const MILESTONE_VALUES = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 8000, 10000, 25000, 50000, 100000];
function goalMilestones(target) {
  const steps = MILESTONE_VALUES.filter(v => v >= target * 0.1 && v < target);
  return [...steps, target];
}

// Calculate a goal plan based on the target amount
function goalPlan(target) {
  const weeks = target <= 250 ? 4 : target <= 1000 ? 12 : target <= 5000 ? 26 : 52;
  const weekly = Math.ceil(target / weeks);
  const daily = Math.max(1, Math.ceil(weekly / 7));
  const monthly = Math.min(target, weekly * 4);   
  return { weeks, daily, weekly, monthly };
}