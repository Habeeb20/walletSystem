import { useState } from "react";
import { X } from "lucide-react";
import api from "../api/adminApi";
import useFetch from "../hooks/useFetch";
import { ErrorBox, Loader, Pill, StatCard, StatusBadge } from "./ui";
import TransactionTable from "./TransactionTable";
import { dateTime, naira, num, SERVICE_KEYS, SERVICE_META } from "../utils";

const Field = ({ label, value }) => (
  <div>
    <p className="text-xs text-slate-500">{label}</p>
    <p className="mt-0.5 break-all text-sm text-slate-800">{value || "—"}</p>
  </div>
);

export default function UserDetail({ userId, onClose, onChanged }) {
  const { data, loading, error, reload } = useFetch(`/users/${userId}`);
  const [tab, setTab] = useState("transactions");
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");

  const act = async (body, confirmText) => {
    if (confirmText && !window.confirm(confirmText)) return;
    setBusy(true);
    setActionError("");
    try {
      await api.patch(`/users/${userId}`, body);
      await reload();
      onChanged?.();
    } catch (e) {
      setActionError(e.response?.data?.message || e.message);
    } finally {
      setBusy(false);
    }
  };

  const u = data?.user;
  const btn = "rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium hover:bg-slate-50 disabled:opacity-50";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40" onClick={onClose}>
      <aside onClick={(e) => e.stopPropagation()} className="h-full w-full max-w-4xl overflow-y-auto bg-[#f5f6f3] shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">{u?.fullName || "User"}</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-slate-100" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 p-6">
          {loading && !data ? <Loader /> : error ? <ErrorBox message={error} onRetry={reload} /> : (
            <>
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <Pill tone={u.isDeleted ? "rose" : u.isActive === false ? "amber" : "emerald"}>
                    {u.isDeleted ? "deleted" : u.isActive === false ? "suspended" : "active"}
                  </Pill>
                  <Pill tone="slate">{u.role}</Pill>
                  <Pill tone={u.isEmailVerified ? "emerald" : "amber"}>{u.isEmailVerified ? "email verified" : "email not verified"}</Pill>
                  <div className="ml-auto flex flex-wrap gap-2">
                    {!u.isDeleted && (
                      <button disabled={busy} className={btn} onClick={() => act({ isActive: u.isActive === false }, u.isActive === false ? null : `Suspend ${u.fullName}?`)}>
                        {u.isActive === false ? "Reactivate" : "Suspend"}
                      </button>
                    )}
                    <button disabled={busy} className={btn} onClick={() => act({ role: u.role === "admin" ? "user" : "admin" }, `Change ${u.fullName}'s role to ${u.role === "admin" ? "user" : "admin"}?`)}>
                      {u.role === "admin" ? "Remove admin" : "Make admin"}
                    </button>
                    <button
                      disabled={busy}
                      className={`${btn} ${u.isDeleted ? "" : "text-rose-700"}`}
                      onClick={() => act({ isDeleted: !u.isDeleted }, u.isDeleted ? null : `Delete ${u.fullName}? The account is soft-deleted and can be restored.`)}
                    >
                      {u.isDeleted ? "Restore" : "Delete"}
                    </button>
                  </div>
                </div>
                {actionError && <p className="mb-3 text-sm text-rose-700">{actionError}</p>}

                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Email" value={u.email} />
                  <Field label="Phone" value={u.phone} />
                  <Field label="Username" value={u.username} />
                  <Field label="Joined" value={dateTime(u.createdAt)} />
                  <Field label="Paystack customer" value={u.paystackCustomerId} />
                  <Field label="Deleted at" value={u.deletedAt && dateTime(u.deletedAt)} />
                  <Field label="Virtual account" value={u.virtualAccountDetails?.account_number && `${u.virtualAccountDetails.account_number} · ${u.virtualAccountDetails.bank || ""}`} />
                  <Field label="Paylony account" value={u.paylonyVirtualAccountDetails?.account_number && `${u.paylonyVirtualAccountDetails.account_number} · ${u.paylonyVirtualAccountDetails.bank_name || ""}`} />
                  <Field label="Paylony status" value={u.paylonyVirtualAccountDetails?.status} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard title="Wallet balance" value={naira(u.wallet?.balance)} tone="amber" sub={u.balance ? `Legacy balance field: ${naira(u.balance)}` : undefined} />
                <StatCard title="Total spent" value={naira(data.totals.successAmount)} sub={`${num(data.totals.successCount)} successful`} tone="teal" />
                <StatCard title="Pending / failed" value={`${num(data.totals.pendingCount)} / ${num(data.totals.failedCount)}`} sub={`${naira(data.totals.pendingAmount)} pending`} tone="rose" />
              </div>

              <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-5">
                {SERVICE_KEYS.map((k) => (
                  <StatCard key={k} title={SERVICE_META[k].label} icon={SERVICE_META[k].icon} tone={SERVICE_META[k].tone}
                    value={naira(data.services[k].successAmount)} sub={`${num(data.services[k].successCount)} successful`} />
                ))}
              </div>

              <div className="rounded-xl border border-slate-200 bg-white">
                <div className="flex gap-1 border-b border-slate-100 px-3 pt-2">
                  {[["transactions", "Transactions"], ["ledger", "Wallet ledger"]].map(([id, label]) => (
                    <button key={id} onClick={() => setTab(id)}
                      className={`border-b-2 px-3 py-2 text-sm font-medium ${tab === id ? "border-teal-700 text-teal-800" : "border-transparent text-slate-500 hover:text-slate-800"}`}>
                      {label}
                    </button>
                  ))}
                </div>

                {tab === "transactions" ? (
                  <TransactionTable rows={data.transactions} showUser={false} />
                ) : data.walletLedger.length ? (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
                          <th className="px-5 py-3 font-medium">Date</th>
                          <th className="px-3 py-3 font-medium">Type</th>
                          <th className="px-3 py-3 font-medium">Provider</th>
                          <th className="px-3 py-3 font-medium">Reference</th>
                          <th className="px-3 py-3 text-right font-medium">Amount</th>
                          <th className="px-3 py-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.walletLedger.map((t, i) => (
                          <tr key={t._id || i} className="border-b border-slate-50">
                            <td className="whitespace-nowrap px-5 py-3 text-slate-600">{dateTime(t.timestamp)}</td>
                            <td className="px-3 py-3 capitalize">{(t.type || "").replace("_", " ")}</td>
                            <td className="px-3 py-3">{t.provider || "—"}</td>
                            <td className="px-3 py-3 font-mono text-xs text-slate-600">{t.reference || "—"}</td>
                            <td className={`px-3 py-3 text-right font-medium tabular-nums ${t.type === "credit" ? "text-emerald-700" : "text-slate-900"}`}>
                              {t.type === "credit" ? "+" : t.type === "debit" ? "−" : ""}{naira(t.amount)}
                            </td>
                            <td className="px-3 py-3"><StatusBadge status={t.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="py-12 text-center text-sm text-slate-400">No wallet entries yet</p>
                )}
              </div>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
