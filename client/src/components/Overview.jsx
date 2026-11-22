import { CalendarClock, CheckCircle2, Clock3, Users as UsersIcon, Wallet, XCircle, Receipt } from "lucide-react";
import useFetch from "../hooks/useFetch";
import { Card, ErrorBox, Loader, PageHeader, StatCard } from "./ui";
import TransactionTable from "./TransactionTable";
import { naira, num, SERVICE_KEYS, SERVICE_META } from "../utils";

export default function Overview({ onNavigate }) {
  const { data, loading, error, reload } = useFetch("/overview");
  if (loading) return <Loader />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  const { users, balances, services, totals, today, recent } = data;

  return (
    <>
      <PageHeader title="Overview" subtitle="Everything that has moved through the platform, as it stands now." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Successful volume" value={naira(totals.successAmount)} sub={`${num(totals.successCount)} successful transactions`} icon={Receipt} tone="teal" />
        <StatCard title="Today" value={naira(today.successAmount)} sub={`${num(today.successCount)} successful · ${num(today.count)} total`} icon={CalendarClock} tone="blue" />
        <StatCard title="Users' wallet balance" value={naira(balances.wallet)} sub={`${num(balances.usersWithFunds)} users hold funds`} icon={Wallet} tone="amber" onClick={() => onNavigate("users")} />
        <StatCard title="Users" value={num(users.total)} sub={`${num(users.active)} active · ${num(users.suspended)} suspended · +${num(users.newLast7Days)} this week`} icon={UsersIcon} tone="violet" onClick={() => onNavigate("users")} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <StatCard title="Pending" value={naira(totals.pendingAmount)} sub={`${num(totals.pendingCount)} transactions waiting`} icon={Clock3} tone="amber" />
        <StatCard title="Failed" value={naira(totals.failedAmount)} sub={`${num(totals.failedCount)} transactions failed`} icon={XCircle} tone="rose" />
        <StatCard title="Verified emails" value={num(users.verified)} sub={`${num(users.deleted)} deleted · ${num(users.admins)} admins`} icon={CheckCircle2} tone="emerald" />
      </div>

      <h2 className="mb-3 mt-8 text-sm font-semibold text-slate-800">By service</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {SERVICE_KEYS.map((k) => {
          const s = services[k];
          const meta = SERVICE_META[k];
          return (
            <StatCard
              key={k}
              title={meta.label}
              value={naira(s.successAmount)}
              sub={`${num(s.successCount)} ok · ${num(s.pendingCount)} pending · ${num(s.failedCount)} failed`}
              icon={meta.icon}
              tone={meta.tone}
              onClick={() => onNavigate(k)}
            />
          );
        })}
      </div>

      <Card
        className="mt-8"
        bodyClass="p-0"
        title="Latest transactions"
        actions={
          <button onClick={() => onNavigate("all")} className="text-sm font-medium text-teal-700 hover:underline">
            View all
          </button>
        }
      >
        <TransactionTable rows={recent} />
      </Card>
    </>
  );
}
