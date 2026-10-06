const state = {

    // Mainly placeholder data

    userName: "User",
    pin: "1234",

    date: "Day, Date Month",

    identities: [
    { id: "Identity1", name: "Identity 1", subtitle: "Subtitle 1", colour: "mint",
        accounts: [
        { id: "account1", name: "Account 1", last4: "1234", balance: 1234.56 },
        { id: "account2",    name: "Account 2",    last4: "9032", balance: 789.10 } ] },
    { id: "Identity2", name: "Identity 2", subtitle: "Subtitle 2", colour: "lavender",
        accounts: [
        { id: "account3", name: "Account 3", last4: "5678", balance: 1112.13 },
        { id: "account4",    name: "Account 4",    last4: "9032", balance: 141.51 } ] },
    { id: "Identity3", name: "Identity 3", subtitle: "Subtitle 3", colour: "mint",
        accounts: [
        { id: "account5", name: "Account 5", last4: "9101", balance: 6171.81 },
        { id: "account6",    name: "Account 6",    last4: "9032", balance: 920.21 } ] }
    ],

    pendingIncome: { label: "Name", amount: 1234.56, accountId: "account1" },
    incomeDismissed: false,

    split: [
    { name: "Split 1",  pct: 30 },
    { name: "Split 2",  pct: 20 },
    { name: "Split 3",  pct: 15 },
    { name: "Split 4",  pct: 10 },
    { name: "Split 5",  pct: 25 }
    ],

    allocations: {},

    goals: [
    { id: 1, name: "Goal 1", current: 100, target: 1000 }
    ],

    transactions: [
    { name: "Recent1",       date: "Date", amount: -12.34 },
    { name: "Recent2",       date: "Date", amount: -56.78 },
    { name: "Recent3",         date: "Date", amount: 910.11 },
    { name: "Recent4",      date: "Date", amount: -121.31 },
    { name: "Recent5",     date: "Date", amount: -415.16 },
    ],

    connected: [
    { name: "Bank 1", detail: "2 accounts", on: true },
    { name: "Bank 2", detail: "1 account", on: true }
    ]
};