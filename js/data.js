const state = {

    // Mainly placeholder data

    userName: "Kaleb",
    fullName: "Kaleb Cox",
    pin: "1234",
    email: "kaleb.cox@example.com",

    date: "Thursday, 8th October",

    identities: [
    { id: "personal", name: "Personal", subtitle: "Everyday money and bills", colour: "mint",
        accounts: [
        { id: "everyday", name: "Everyday", last4: "1234", balance: 1234.56 },
        { id: "bills",    name: "Bills",    last4: "9032", balance: 789.10 } ] },
    { id: "business", name: "Business", subtitle: "CraftyCarp", colour: "lavender",
        accounts: [
        { id: "main", name: "Main account", last4: "5678", balance: 1112.13 },
        { id: "tax", name: "Tax account", last4: "9032", balance: 141.51 } ] },
    ],

    pendingIncome: { label: "Custom job invoice", amount: 6543.21, accountId: "everyday" },
    incomeDismissed: false,

    split: [
    { name: "Materials",  pct: 30 },
    { name: "Expenses",  pct: 20 },
    { name: "Tax",  pct: 15 },
    { name: "Safety net", pct: 10 },
    { name: "Pay",  pct: 25 }
    ],

    allocations: {},

    goals: [
    { id: 1, name: "New work vehicle", current: 8420, target: 12000,
      savedToday: 10, savedWeek: 120, savedMonth: 620 } 
    ],

    transactions: [
    { name: "Netflix",       date: "7 Oct", amount: -12.34 },
    { name: "Bunnings",       date: "6 Oct", amount: -56.78 },
    { name: "Wages",         date: "6 Oct", amount: 910.11 },
    { name: "Z Energy",      date: "4 Oct", amount: -121.31 },
    { name: "Countdown",     date: "3 Oct", amount: -415.16 },
    ],

    // Security alert shown on Home and alerts screen
    securityAlert: { title: "New login detected", detail: "Unknown device - Christchurch - 10:11 am" },

    // Security settings
    security: { twoFactor: false, loginAlerts: true, faceId: true },

    // Recent logins for the settings screen
    logins: [
        { device: "iPhone (this device)", place: "Tauranga", time: "Today" },
        { device: "Chrome on Windows",    place: "Tauranga", time: "3 Oct" }
    ],

    connected: [
    { name: "Kiwibank", detail: "2 accounts", on: true },
    { name: "BNZ", detail: "1 account", on: true }
    ]
};