export interface FinanceAuthUser {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "BURSAR" | "CASHIER" | "AUDITOR";
  pin: string; // 4-digit quick POS counter PIN
  workstationId?: string;
  title: string;
  permissions: string[];
}

export const ENTERPRISE_FINANCE_USERS: FinanceAuthUser[] = [
  {
    id: "usr-super-admin",
    name: "Dr. Arthur Ssentongo",
    email: "admin@wellstarbright.sc.ug",
    role: "SUPER_ADMIN",
    pin: "9900",
    workstationId: "SUPER-ADMIN-CONSOLE",
    title: "Head of School & Executive Administrator",
    permissions: [
      "ALL_ACCESS",
      "WORKSTATION_LOCK",
      "APPROVE_EXPENDITURE",
      "MODIFY_COA",
      "SYSTEM_AUDIT",
      "TAX_FILING",
      "MANAGE_USERS",
    ],
  },
  {
    id: "usr-chief-bursar",
    name: "CPA Sarah Namubiru",
    email: "bursar@wellstarbright.sc.ug",
    role: "BURSAR",
    pin: "1234",
    workstationId: "WS-BURSAR-PC01",
    title: "Chief Bursar & Head of Accounts",
    permissions: [
      "POST_JOURNALS",
      "RECONCILE_BANK",
      "RUN_PAYROLL",
      "MANAGE_INVOICES",
      "GENERATE_STATEMENTS",
      "MANAGE_ASSETS",
      "MANAGE_BUDGETS",
      "AP_APPROVAL",
    ],
  },
  {
    id: "usr-cashier-1",
    name: "Joseph Kato",
    email: "cashier@wellstarbright.sc.ug",
    role: "CASHIER",
    pin: "5566",
    workstationId: "WS-COUNTER-POS1",
    title: "Senior Counter Bursar & POS Cashier",
    permissions: [
      "COLLECT_FEES",
      "ISSUE_RECEIPTS",
      "RECORD_PETTY_CASH",
      "DRAWER_FLOAT_COUNT",
      "REPRINT_RECEIPTS",
    ],
  },
  {
    id: "usr-cashier-2",
    name: "Grace Auma",
    email: "cashier2@wellstarbright.sc.ug",
    role: "CASHIER",
    pin: "5577",
    workstationId: "WS-COUNTER-POS2",
    title: "Counter Cashier 2 & POS Assistant",
    permissions: [
      "COLLECT_FEES",
      "ISSUE_RECEIPTS",
      "RECORD_PETTY_CASH",
      "DRAWER_FLOAT_COUNT",
      "REPRINT_RECEIPTS",
    ],
  },
  {
    id: "usr-senior-auditor",
    name: "Robert Mugisha",
    email: "auditor@wellstarbright.sc.ug",
    role: "AUDITOR",
    pin: "7788",
    workstationId: "AUDIT-DESK-01",
    title: "Senior Financial Auditor",
    permissions: [
      "READ_LEDGERS",
      "READ_TRIAL_BALANCE",
      "READ_STATEMENTS",
      "READ_AUDIT_LOGS",
      "INSPECT_COMPLIANCE",
    ],
  },
];
