const screens = {

    // Login screen
    login: { view: () => `
        <h1 style="margin-top:40px">Title</h1>
        <p class="small">PIN is 1234</p>
        <div class="pins" id="pins">${pinDots("")}</div>
        <p class="error" id="pinError"></p>
        <div class="keypad">
        ${[1,2,3,4,5,6,7,8,9,"",0,"[B]"].map(k =>
            k === "" ? "<span></span>" : `<button onclick="pressKey('${k}')">${k}</button>`).join("")}
        </div>` },

    // Home screen
    home: { tab: "home", view: () => {
        const pending = state.pendingIncome;
        const top = state.goals[0];
        return `
        <!-- Header -->
        <div class="row">
        <div><div class="small">${state.date}</div>
            <h2>Good morning, ${state.userName}</h2></div>
        <button class="round" onclick="go('alerts')">${pending ? ' <span class="dot"></span>' : ""}</button>
        </div>

        <!--  Total balance -->
        <div class="card lavender-dark">
        <div class="small-white">Total</div>
        <div class="big">${money(totalBalance())}</div>
        </div>

        <!-- Transfer and savings buttons -->
        <div class="grid2">
        <button class="btn" onclick="go('transfer')">Transfer</button>
        <button class="btn light" onclick="go('save')">Savings</button>
        </div>

        <!-- Pending income alert -->
        ${pending && !state.incomeDismissed ? `<div class="card lavender">
        New income: ${money(pending.amount)}
        <p class="small">${pending.label}.</p>
        <div class="grid2" style="margin-top:10px">
            <button class="btn small-btn" onclick="startAllocate()">Yes</button>
            <button class="btn light small-btn" onclick="dismissIncome()">Later</button>
        </div></div>` : ""}
        ${pending && state.incomeDismissed ? `<div class="card click lavender row" onclick="startAllocate()">
        ${money(pending.amount)} needs to be allocated›</div>` : ""}

        <!-- Identities  -->
        <div class="row">Your identities<span class="small" onclick="go('accounts')" style="cursor:pointer">View all</span></div>
        <div class="grid2">
        ${state.identities.slice(0, 2).map(i => `
            <div class="card click ${i.colour}" onclick="go('accounts')">
            <div class="small">${i.name}</div>${money(identityTotal(i))}</div>`).join("")}
        </div>

         <!-- Recent transactions -->
        <div class="card">
            <div class="row">Recent transactions
                <span class="small" onclick="go('transactions')" style="cursor:pointer">See all</span></div>
         ${state.transactions.slice(0, 4).map(transactionRow).join("")}
        </div>

        <!-- Goals -->
        <div class="card click" onclick="go('goal')">
        <div class="small">Checkpoint</div>
        <div class="row">${top.name}${money(top.current)}</div>
        ${bar(top.current / top.target * 100)}
        </div>`; } },

    // All the screens needed
    // There might be more idk
    // Tab is just for the nav bar 

    transactions: {view: () => `<!--HTML goes here-->`},

    alerts: {view: () => `<!--HTML goes here-->`},

    accounts: {tab: "accounts", view: () => `<!--HTML goes here-->`},

    account: {view: () => `<!--HTML goes here-->`},

    split: {view: () => `<!--HTML goes here-->`},

    review: {view: () => `<!--HTML goes here-->`},

    save: {tab: "save", view: () => `<!--HTML goes here-->`},

    goal: {view: () => `<!--HTML goes here-->`},

    newGoal: {view: () => `<!--HTML goes here-->`},

    transfer: {view: () => `<!--HTML goes here-->`},

    transferDone: {view: () => `<!--HTML goes here-->`},

    settings: {tab: "settings", view: () => `<!--HTML goes here-->`},

    connected: {view: () => `<!--HTML goes here-->`},
    
    about: {view: () => `<!--HTML goes here-->`},

    help: {view: () => `<!--HTML goes here-->`}
};

// Page logic goes here

// Pin entry logic
let enteredPin = "";
function pinDots(pin) { return [0,1,2,3].map(i => `<span class="${i < pin.length ? "full" : ""}"></span>`).join(""); }
function pressKey(k) {
  enteredPin = k === "[B]" ? enteredPin.slice(0, -1) : (enteredPin + k).slice(0, 4);
  document.getElementById("pins").innerHTML = pinDots(enteredPin);
  if (enteredPin.length < 4) return;
  if (enteredPin === state.pin) { enteredPin = ""; go("home"); }
  else { enteredPin = ""; document.getElementById("pinError").textContent = "Wrong PIN"; 
         document.getElementById("pins").innerHTML = pinDots(""); }
}

// Income alert logic
function dismissIncome() {                        
  state.incomeDismissed = true;
  go("home");
}

function startAllocate() { go("split"); }
