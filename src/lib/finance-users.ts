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
    name: "School Administrator & Head",
    email: "admin@yourschool.com",
    role: "SUPER_ADMIN",
    pin: "9900",
    workstationId: "SUPER-ADMIN-CONSOLE",
    title: "Executive Head & Principal",
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
    name: "Chief Bursar",
    email: "bursar@yourschool.com",
    role: "BURSAR",
    pin: "1234",
    workstationId: "WS-BURSAR-PC01",
    title: "Head of Accounts & Financial Control",
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
    name: "Senior Counter Cashier",
    email: "cashier@yourschool.com",
    role: "CASHIER",
    pin: "5566",
    workstationId: "WS-COUNTER-POS1",
    title: "Counter Cashier & POS Desk 1",
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
    name: "Assistant Cashier",
    email: "cashier2@yourschool.com",
    role: "CASHIER",
    pin: "5577",
    workstationId: "WS-COUNTER-POS2",
    title: "Counter Cashier & POS Desk 2",
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
    name: "Internal Auditor",
    email: "auditor@yourschool.com",
    role: "AUDITOR",
    pin: "7788",
    workstationId: "AUDIT-DESK-01",
    title: "Audit & Compliance Officer",
    permissions: [
      "READ_LEDGERS",
      "READ_TRIAL_BALANCE",
      "READ_STATEMENTS",
      "READ_AUDIT_LOGS",
      "INSPECT_COMPLIANCE",
    ],
  },
];
