// Helper functions for UI stuff 

// Convert a number to a NZD money string 
function money(n) {
  return "$" + n.toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Get all accounts across all identities
function allAccounts() {
  return state.identities.flatMap(i => i.accounts.map(a => ({ ...a, identity: i })));
}

function findAccount(id) { return allAccounts().find(a => a.id === id); }
function totalBalance() { return allAccounts().reduce((sum, a) => sum + a.balance, 0); }
function identityTotal(i) { return i.accounts.reduce((sum, a) => sum + a.balance, 0); }

// Go back to a screen button
function topbar(title, backTo) {
  const back = backTo ? `<button class="round" onclick="go('${backTo}')"></button>` : "";
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
    { screen: "home",     icon: "1", label: "Home" },
    { screen: "accounts", icon: "2", label: "Accounts" },
    { screen: "save",     icon: "3", label: "Save" },
    { screen: "settings", icon: "4", label: "Settings" }
  ];
  const buttons = tabs.map(t =>
    `<button class="${t.screen === active ? "active" : ""}" onclick="go('${t.screen}')">
       <span class="icon">${t.icon}</span>${t.label}</button>`).join("");
  return `<div class="nav">${buttons}</div>`;
}

// Format transactions
function transactionRow(t) {
  const sign = t.amount > 0 ? "+" : "-";
  return `<div class="row" style="padding:10px 0;border-bottom:1px solid var(--grey)">
    <div>${t.name}<div class="small">${t.date}</div></div>
    <b">${sign}${money(Math.abs(t.amount))}</b></div>`;
}