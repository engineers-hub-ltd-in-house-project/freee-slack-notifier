export type InvoiceStatus = "draft" | "issued" | "cancelled";
export type PaymentStatus = "settled" | "unsettled";

export type ClassifiedStatus =
  | "overdue"
  | "due_soon"
  | "unsettled"
  | "settled"
  | "irrelevant";

export interface Invoice {
  invoice_id: string;
  due_date: string;
  payment_status: PaymentStatus;
  invoice_status: InvoiceStatus;
}

export interface ClassifiedInvoice {
  invoice_id: string;
  status: ClassifiedStatus;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DUE_SOON_WINDOW_DAYS = 7;

const toUtcMidnight = (isoDate: string): number => {
  const [year, month, day] = isoDate.split("-").map(Number);
  return Date.UTC(year ?? 0, (month ?? 1) - 1, day ?? 1);
};

const diffInDays = (from: string, to: string): number =>
  (toUtcMidnight(to) - toUtcMidnight(from)) / MS_PER_DAY;

export const classify = (
  invoices: readonly Invoice[],
  now: string,
): ClassifiedInvoice[] =>
  invoices.map((invoice) => ({
    invoice_id: invoice.invoice_id,
    status: classifyOne(invoice, now),
  }));

const classifyOne = (invoice: Invoice, now: string): ClassifiedStatus => {
  if (invoice.invoice_status !== "issued") return "irrelevant";
  if (invoice.payment_status === "settled") return "settled";

  const days = diffInDays(now, invoice.due_date);
  if (days < 0) return "overdue";
  if (days <= DUE_SOON_WINDOW_DAYS) return "due_soon";
  return "unsettled";
};
