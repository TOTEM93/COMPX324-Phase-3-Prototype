const screens = {

    // Login screen
  login: { view: () => `
    <h1 style="margin-top:40px">Simon!!!</h1>
    <p class="small">Enter your PIN (1234)</p>
    <div class="pins" id="pins">${pinDots("")}</div>
    <p class="error" id="pinError"></p>
    <div class="keypad">
      ${[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map(k =>
        k === "" ? "<span></span>" : `<button onclick="pressKey('${k}')">${k}</button>`).join("")}
    </div>` },

  // Home screen 
  home: { tab: "home", view: () => {
    const pending = state.pendingIncome;
    const top = state.goals[0];
    return `
    <!-- Greeting and alerts bell -->
    <div class="row">
      <div><div class="small">Wednesday, 30 September</div>
        <h2>Good morning, ${state.userName}</h2></div>
      ${bellButton(pending || state.securityAlert)}
    </div>

    <!-- Total balance -->
    <div class="card lavender-dark">
      <div class="small-white">Total across all identities</div>
      <div class="big">${money(totalBalance())}</div>
    </div>

    <!-- Transfer and save -->
    <div class="grid2">
      <button class="btn" onclick="go('transfer')">⇄ Transfer</button>
      <button class="btn light" onclick="go('save')">◎ Savings</button>
    </div>

    <!-- Security alert -->
    ${state.securityAlert ? `<div class="card click alert row" onclick="go('alerts')">
      <div><b>⚠ ${state.securityAlert.title}</b><div class="small">Tap to review</div></div><b>›</b></div>` : ""}

    <!-- Income waiting to be split -->
    ${pending && !state.incomeDismissed ? `<div class="card lavender">
      <b>New income: ${money(pending.amount)}</b>
      <p class="small">${pending.label}. Allocate it now?</p>
      <div class="grid2" style="margin-top:10px">
        <button class="btn small-btn" onclick="startAllocate()">Yes</button>
        <button class="btn light small-btn" onclick="dismissIncome()">Later</button>
      </div></div>` : ""}
    ${pending && state.incomeDismissed ? `<div class="card click lavender row" onclick="startAllocate()">
      <b>${money(pending.amount)} waiting to be allocated</b><b>›</b></div>` : ""}

    <!-- Identity cards -->
    <div class="row"><b>Your spaces</b><span class="small" onclick="go('accounts')" style="cursor:pointer">View all</span></div>
    <div class="grid2">
      ${state.identities.slice(0, 2).map(i => `
        <div class="card click ${i.colour}" onclick="go('accounts')">
          <div class="small">${i.name}</div><b>${money(identityTotal(i))}</b></div>`).join("")}
    </div>

    <!-- Recent transactions -->
    <div class="card">
      <div class="row"><b>Recent transactions</b>
        <span class="small" onclick="go('transactions')" style="cursor:pointer">See all</span></div>
      ${state.transactions.slice(0, 4).map(transactionRow).join("")}
    </div>

    <!-- Top savings goal  -->
    ${top ? `<div class="card click" onclick="go('goal', {id: ${top.id}})">
      <div class="small">Top Savings Goal</div>
      <div class="row"><b>${top.name}</b><b>${money(top.current)}</b></div>
      ${bar(top.current / top.target * 100)}
    </div>` : `<div class="card click" onclick="go('newGoal')"><b>Set a savings goal</b>
      <div class="small">Tap to create your first goal</div></div>`}`; } },

  // All transactions screen
  transactions: { view: () => `
    ${topbar("Transactions", "home")}
    <div class="card">${state.transactions.map(transactionRow).join("")}</div>` },

  // Alerts screen
  alerts: { view: () => `
    ${topbar("Alerts", "home")}

    <!-- Security alert -->
    ${state.securityAlert ? `<div class="card alert">
      <b>⚠ ${state.securityAlert.title}</b>
      <p class="small">${state.securityAlert.detail}</p>
      <p style="margin:8px 0">Was this you?</p>
      <div class="grid2">
        <button class="btn small-btn" onclick="securityOk()">Yes, it was me</button>
        <button class="btn small-btn" style="background:#b91c1c" onclick="securityNotMe()">No, secure my account</button>
      </div></div>` : ""}

    <!-- Income alert -->
    ${state.pendingIncome ? `<div class="card"><b>Income received</b>
      <p class="small">${money(state.pendingIncome.amount)} from ${state.pendingIncome.label}</p>
      <button class="btn small-btn" style="margin-top:10px" onclick="startAllocate()">Allocate</button></div>` : ""}

    <!-- No alerts -->
    ${!state.securityAlert && !state.pendingIncome
      ? `<p class="small" style="text-align:center;margin-top:60px">No new alerts</p>` : ""}` },

  // Accounts screen
  accounts: { tab: "accounts", view: () => `
    ${topbar("Identities & accounts")}
    ${state.identities.map(i => `
      <div class="card ${i.colour}">
        <div class="row"><div><b>${i.name}</b><div class="small">${i.subtitle}</div></div>
          <b>${money(identityTotal(i))}</b></div>
        ${i.accounts.map(a => `
          <div class="row card click" style="margin-top:10px" onclick="go('account', {id:'${a.id}'})">
            <div>${a.name}<div class="small">•• ${a.last4}</div></div><b>${money(a.balance)} ›</b>
          </div>`).join("")}
      </div>`).join("")}` },

  // One account screen (split details)
  account: { view: p => {
    const a = findAccount(p.id);
    const items = state.allocations[a.id] || [];
    const total = items.reduce((s, x) => s + x.amount, 0);
    const pending = state.pendingIncome && state.pendingIncome.accountId === a.id;
    return `
    ${topbar(a.name, "accounts")}
    <div class="card ${a.identity.colour}">
      <div class="small">${a.identity.name} • •• ${a.last4}</div>
      <div class="big">${money(a.balance)}</div>
      ${pending ? `<div class="small">+ ${money(state.pendingIncome.amount)} waiting to be allocated</div>` : ""}
    </div>
    ${pending ? `<button class="btn" onclick="startAllocate()">Allocate ${money(state.pendingIncome.amount)} income</button>` : ""}
    <b>Pay split</b>
    ${items.length === 0 ? `<p class="small">Nothing allocated yet.</p>` :
      items.map(x => `<div class="card"><div class="row"><span>${x.name}</span><b>${money(x.amount)}</b></div>
        ${bar(x.amount / total * 100, "lav")}</div>`).join("")}`; } },

  // Pay splitter screen (sliders)
  split: { view: () => `
    ${topbar("Allocate income", "home")}
    <div class="card lavender-dark"><div class="small-white">Amount to split</div>
      <div class="big">${money(state.pendingIncome.amount)}</div></div>
    ${state.split.map((s, i) => `
      <div>
        <div class="row"><span>${s.name}</span>
          <span><b id="pct${i}">${s.pct}%</b> • <span id="amt${i}">${money(state.pendingIncome.amount * s.pct / 100)}</span></span></div>
        <input type="range" min="0" max="100" value="${s.pct}" oninput="onSlide(${i}, this.value)">
      </div>`).join("")}
    <div class="row"><b>Total</b><b id="splitTotal">100%</b></div>
    <label><input type="checkbox" id="saveSplit" checked> Save this split for next time</label>
    <p class="error" id="splitError"></p>
    <button class="btn" onclick="reviewSplit()">Allocate</button>` },

  // Review split screen
  review: { view: () => `
    ${topbar("Review", "split")}
    <div class="card">
      <b>${state.pendingIncome.label}</b>
      ${state.split.map(s => `<div class="row" style="margin-top:8px"><span>${s.name} (${s.pct}%)</span>
        <b>${money(state.pendingIncome.amount * s.pct / 100)}</b></div>`).join("")}
      <hr style="margin:12px 0;border:none;border-top:1px solid var(--grey)">
      <div class="row"><b>Total</b><b>${money(state.pendingIncome.amount)}</b></div>
    </div>
    <button class="btn" onclick="confirmSplit()">Confirm</button>` },

  // Save screen (goals)
  save: { tab: "save", view: () => `
    ${topbar("Saving goals")}
    ${state.goals.map(g => `
      <div class="card click mint" onclick="go('goal', {id:${g.id}})">
        <div class="row"><b>${g.name}</b><span>${Math.round(g.current / g.target * 100)}%</span></div>
        <div class="big">${money(g.current)}</div>
        <div class="small">of ${money(g.target)} target</div>
        ${bar(g.current / g.target * 100)}
      </div>`).join("")}
    <button class="btn light" onclick="go('newGoal')">+ New goal</button>` },

  // One goal screen
  goal: { view: p => {
    const g = state.goals.find(x => x.id === p.id);
    const plan = goalPlan(g.target);
    // [label, amount to save in that period, amount saved so far this period]
    const checkpoints = [["Today", plan.daily, g.savedToday], ["This week", plan.weekly, g.savedWeek],
                         ["This month", plan.monthly, g.savedMonth]];
    const reward = g.current >= g.target * 0.5;     // reward unlocks at 50% of the goal
    return `
    ${topbar(g.name, "save")}
    <div class="card mint"><div class="big">${money(g.current)}</div>
      <div class="small">of ${money(g.target)}</div>${bar(g.current / g.target * 100)}</div>

    <b>Checkpoints</b>
    <p class="small">Save about ${money(plan.weekly)} a week to reach this goal in ${plan.weeks} weeks.</p>
    ${checkpoints.map(([n, goalAmt, saved]) => `<div class="card"><div class="row"><span>${n}</span>
      <span>${money(saved)} / ${money(goalAmt)}</span></div>${bar(saved / goalAmt * 100)}</div>`).join("")}

    <b>Milestones</b>
    ${goalMilestones(g.target).map(m => g.current >= m
      ? `<div class="milestone done"><b>✓ ${shortMoney(m)} milestone</b><span class="small">Unlocked</span></div>`
      : `<div class="milestone"><b>${shortMoney(m)} milestone</b><span class="small">Save ${money(m - g.current)} more</span></div>`).join("")}

    <b>Rewards</b>
    <div class="card ${reward ? "mint" : ""}"><b>10% off a coffee</b>
      <div class="small">${reward ? "Unlocked" : "Unlocks when you reach 50% of this goal"}</div></div>

    <b>Add funds</b>
    ${accountSelect("goalFrom")}
    <input type="number" id="goalAmount" placeholder="Amount">
    <p class="error" id="goalError"></p>
    <button class="btn" onclick="addToGoal(${g.id})">Add</button>
    <button class="btn light" style="color:#b91c1c" onclick="go('deleteGoal', {id: ${g.id}})">Delete goal</button>`; } },

  // Delete goal screen
  deleteGoal: { view: p => {
    const g = state.goals.find(x => x.id === p.id);
    return `
    ${topbar("Delete goal", "goal").replace("go('goal')", `go('goal', {id: ${g.id}})`)}
    <div class="card alert"><b>Delete "${g.name}"?</b>
      <p class="small">${g.current > 0
        ? `You have ${money(g.current)} saved. Choose where to return it.`
        : "Nothing has been saved to this goal yet."}</p></div>
    ${g.current > 0 ? `<div><label>Return money to</label>${accountSelect("refundTo")}</div>` : ""}
    <button class="btn" style="background:#b91c1c" onclick="deleteGoal(${g.id})">Yes, delete</button>
    <button class="btn light" onclick="go('goal', {id: ${g.id}})">Cancel</button>`; } },

  // New goal
  newGoal: { view: () => `
    ${topbar("New goal", "save")}
    <div><label>Name of goal</label><input type="text" id="goalName" placeholder="Trip to another country"></div>
    <div><label>Total amount</label><input type="number" id="goalTarget" placeholder="1000"></div>
    <p class="error" id="goalError"></p>
    <button class="btn" onclick="createGoal()">Create</button>` },

  // Transfer screen
  transfer: { view: () => `
    ${topbar("Transfer", "home")}
    <div><label>From</label>${accountSelect("from")}</div>
    <div><label>To</label>${accountSelect("to")}</div>
    <div><label>Amount</label><input type="number" id="amount" placeholder="0.00"></div>
    <p class="error" id="transferError"></p>
    <button class="btn" onclick="makeTransfer()">Make transfer</button>` },

  // Transfer done screen
  transferDone: { view: p => `
    <div class="card mint" style="margin-top:60px;text-align:center">
      <div class="big">✓</div><b>Transfer complete</b>
      <p class="small">${p.text}</p></div>
    <button class="btn" onclick="go('home')">Done</button>` },

  // Security settings screen
  security: { view: () => `
    ${topbar("Security", "settings")}

    <!-- Unreviewed login (same buttons as the Alerts screen) -->
    ${state.securityAlert ? `<div class="card alert">
      <b>⚠ ${state.securityAlert.title}</b>
      <p class="small">${state.securityAlert.detail}</p>
      <p style="margin:8px 0">Was this you?</p>
      <div class="grid2">
        <button class="btn small-btn" onclick="securityOk('security')">Yes, it was me</button>
        <button class="btn small-btn" style="background:#b91c1c" onclick="securityNotMe()">No, secure my account</button>
      </div></div>` : ""}

    ${[["twoFactor", "Two-factor authentication", "Ask for a code when logging in on a new device"],
       ["loginAlerts", "Login alerts", "Tell me when someone logs in"],
       ["faceId", "Face ID", "Use Face ID to open Simon"]].map(([key, label, hint]) => `
      <div class="card row"><div><b>${label}</b><div class="small">${hint}</div></div>
        <input type="checkbox" ${state.security[key] ? "checked" : ""} onchange="toggleSecurity('${key}')"></div>`).join("")}

    <b>Recent logins</b>
    <div class="card">${state.logins.map(l => `
      <div class="row" style="padding:8px 0"><div>${l.device}<div class="small">${l.place}</div></div>
      <span class="small">${l.time}</span></div>`).join("")}</div>` },

  // Account secured screen
  secured: { view: () => `
    <div class="card ok" style="margin-top:60px;text-align:center">
      <b>Account secured</b>
      <p class="small">We signed out the unknown device and turned on two-factor authentication.
      Please change your PIN and contact your bank if you see anything unusual.</p></div>
    <button class="btn" onclick="go('home')">Back to home</button>` },

  // Settings screen
  settings: { tab: "settings", view: () => `
    ${topbar("Settings")}
    <div class="card"><b>${state.fullName}</b><div class="small">${state.email}</div></div>
    <!-- Security check-up: changes with the settings below -->
    ${(() => { const strong = state.security.twoFactor && !state.securityAlert;
      return `<div class="card click ${strong ? "ok" : "alert"}" onclick="go('security')">
        <b>Security check-up: ${strong ? "Strong" : "Needs attention"}</b>
        <div class="small">${strong ? "All recommended protections are on." : "Tap to review your security."}</div></div>`; })()}
    ${[["security", "Security"], ["connected", "Connected accounts"], ["about", "About us"], ["help", "Help"]].map(([s, label]) =>
      `<div class="card click row" onclick="go('${s}')"><span>${label}</span><span>›</span></div>`).join("")}
    <button class="btn light" onclick="go('login')">Log out</button>` },

  // Connected accounts screen
  connected: { view: () => `
    ${topbar("Connected accounts", "settings")}
    ${state.connected.map((c, i) => `
      <div class="card row"><div><b>${c.name}</b><div class="small">${c.detail}</div></div>
        <button class="btn light small-btn" onclick="toggleBank(${i})">${c.on ? "Disconnect" : "Connect"}</button></div>`).join("")}` },

  // About us screen
  about: { view: () => `${topbar("About us", "settings")}
    <div class="card">Simon!!! helps you keep personal, business and community money separate,
    split income automatically, and build savings.</div>` },

  // Help screen
  help: { view: () => `${topbar("Help", "settings")}
    <div class="card"><b>Email</b><div class="small">help@simon.example</div></div>
    <div class="card"><b>Phone</b><div class="small">0800 000 000</div></div>` }
};

// Page logic goes here

// Login
let enteredPin = "";
function pinDots(pin) { return [0,1,2,3].map(i => `<span class="${i < pin.length ? "full" : ""}"></span>`).join(""); }
function pressKey(k) {
  enteredPin = k === "⌫" ? enteredPin.slice(0, -1) : (enteredPin + k).slice(0, 4);
  document.getElementById("pins").innerHTML = pinDots(enteredPin);
  if (enteredPin.length < 4) return;
  if (enteredPin === state.pin) { enteredPin = ""; go("home"); }
  else { enteredPin = ""; document.getElementById("pinError").textContent = "Wrong PIN"; 
         document.getElementById("pins").innerHTML = pinDots(""); }
}

// Pay splitter
function dismissIncome() {                        
  state.incomeDismissed = true;
  go("home");
}

function startAllocate() { go("split"); }

// Update labels without redrawing
function onSlide(i, value) {                      
  state.split[i].pct = Number(value);
  document.getElementById("pct" + i).textContent = value + "%";
  document.getElementById("amt" + i).textContent = money(state.pendingIncome.amount * value / 100);
  const total = state.split.reduce((s, x) => s + x.pct, 0);
  document.getElementById("splitTotal").textContent = total + "%";
}

function reviewSplit() {
  const total = state.split.reduce((s, x) => s + x.pct, 0);
  if (total !== 100) { document.getElementById("splitError").textContent = `Split must total 100% (now ${total}%)`; return; }
  go("review");
}

// Adds income to the account and stores allocation
function confirmSplit() {                         
  const inc = state.pendingIncome;
  findAccountRaw(inc.accountId).balance += inc.amount;
  state.allocations[inc.accountId] = state.split.map(s => ({ name: s.name, amount: inc.amount * s.pct / 100 }));
  addTransaction(inc.label, inc.amount);
  state.pendingIncome = null;
  go("account", { id: inc.accountId });
}

// The real object (findAccount returns a copy)
function findAccountRaw(id) {                     
  for (const i of state.identities) for (const a of i.accounts) if (a.id === id) return a;
}

// Transfer
function makeTransfer() {
  const from = findAccountRaw(document.getElementById("from").value);
  const to = findAccountRaw(document.getElementById("to").value);
  const amt = Number(document.getElementById("amount").value);
  const err = document.getElementById("transferError");
  if (from === to) { err.textContent = "Choose two different accounts"; return; }
  if (!(amt > 0)) { err.textContent = "Enter an amount"; return; }
  if (amt > from.balance) { err.textContent = "Not enough money in that account"; return; }
  from.balance -= amt; to.balance += amt;
  addTransaction(`Transfer to ${to.name}`, -amt);
  go("transferDone", { text: `${money(amt)} from ${from.name} to ${to.name}` });
}

// Goals
function createGoal() {
  const name = document.getElementById("goalName").value.trim();
  const target = Number(document.getElementById("goalTarget").value);
  if (!name || !(target > 0)) { document.getElementById("goalError").textContent = "Enter a name and amount"; return; }
  state.goals.push({ id: Date.now(), name, current: 0, target, savedToday: 0, savedWeek: 0, savedMonth: 0 });
  go("save");
}
function addToGoal(id) {
  const g = state.goals.find(x => x.id === id);
  const from = findAccountRaw(document.getElementById("goalFrom").value);
  const amt = Number(document.getElementById("goalAmount").value);
  if (!(amt > 0) || amt > from.balance) { document.getElementById("goalError").textContent = "Check the amount"; return; }
  from.balance -= amt; g.current += amt;
  g.savedToday += amt; g.savedWeek += amt; g.savedMonth += amt;
  addTransaction(`Saved to ${g.name}`, -amt);
  go("goal", { id });
}

function deleteGoal(id) {                         
  const g = state.goals.find(x => x.id === id);
  if (g.current > 0) {
    findAccountRaw(document.getElementById("refundTo").value).balance += g.current;
    addTransaction(`Returned from ${g.name}`, g.current);
  }
  state.goals = state.goals.filter(x => x.id !== id);
  go("save");
}

// Security
function toggleSecurity(key) { state.security[key] = !state.security[key]; go("security"); }
function securityOk(returnTo = "alerts") {                           // user recognises the login
  state.logins.unshift({ device: "Unknown device", place: "Hamilton", time: "Today" });
  state.securityAlert = null;
  go(returnTo);
}

// Not recognised
function securityNotMe() {                      
  state.securityAlert = null;
  state.security.twoFactor = true;
  go("secured");
}

// Connected banks
function toggleBank(i) { state.connected[i].on = !state.connected[i].on; go("connected"); }
