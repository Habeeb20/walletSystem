import { Fragment, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Empty, StatusBadge } from "./ui";
import { dateTime, naira, SERVICE_META } from "../utils";

export default function TransactionTable({ rows = [], showUser = true, showType = true }) {
  const [open, setOpen] = useState(null);
  if (!rows.length) return <Empty text="No transactions found" />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
            <th className="px-5 py-3 font-medium">Date</th>
            {showUser && <th className="px-3 py-3 font-medium">User</th>}
            {showType && <th className="px-3 py-3 font-medium">Service</th>}
            <th className="px-3 py-3 font-medium">Reference</th>
            <th className="px-3 py-3 font-medium">Target</th>
            <th className="px-3 py-3 font-medium">Provider / plan</th>
            <th className="px-3 py-3 text-right font-medium">Amount</th>
            <th className="px-3 py-3 font-medium">Paid with</th>
            <th className="px-3 py-3 font-medium">Status</th>
            <th className="w-10" />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const key = `${r.type}-${r._id}`;
            const meta = SERVICE_META[r.type];
            const expandable = r.narration || r.details;
            return (
              <Fragment key={key}>
                <tr className="border-b border-slate-50 hover:bg-slate-50/60">
                  <td className="whitespace-nowrap px-5 py-3 text-slate-600">{dateTime(r.timestamp)}</td>
                  {showUser && (
                    <td className="px-3 py-3">
                      <p className="font-medium text-slate-800">{r.user?.fullName || "Unknown user"}</p>
                      <p className="text-xs text-slate-500">{r.user?.email}</p>
                    </td>
                  )}
                  {showType && (
                    <td className="px-3 py-3">
                      <span className="inline-flex items-center gap-1.5 text-slate-700">
                        <span className="h-2 w-2 rounded-full" style={{ background: meta?.color }} />
                        {meta?.label || r.type}
                      </span>
                    </td>
                  )}
                  <td className="px-3 py-3 font-mono text-xs text-slate-600">{r.ref}</td>
                  <td className="px-3 py-3 tabular-nums text-slate-700">{r.target || "—"}</td>
                  <td className="px-3 py-3 text-slate-700">
                    {r.type === "transfer" && r.provider ? `Bank code ${r.provider}` : r.provider || "—"}
                  </td>
                  <td className="px-3 py-3 text-right font-medium tabular-nums text-slate-900">{naira(r.amount)}</td>
                  <td className="px-3 py-3 capitalize text-slate-600">{r.payment || "—"}</td>
                  <td className="px-3 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="pr-4">
                    {expandable && (
                      <button
                        onClick={() => setOpen(open === key ? null : key)}
                        className="grid h-7 w-7 place-items-center rounded-md text-slate-400 hover:bg-slate-100"
                        aria-label="Show details"
                      >
                        {open === key ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    )}
                  </td>
                </tr>
                {open === key && (
                  <tr className="bg-slate-50">
                    <td colSpan={10} className="px-5 py-3">
                      {r.narration && <p className="mb-2 text-sm text-slate-700">Narration: {r.narration}</p>}
                      {r.details && (
                        <pre className="max-h-56 overflow-auto rounded-lg bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200">
                          {JSON.stringify(r.details, null, 2)}
                        </pre>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
