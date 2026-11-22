import { useEffect, useState } from "react";
import { Download, Search } from "lucide-react";
import useFetch from "../hooks/useFetch";
import { Card, ErrorBox, Loader, PageHeader, Pagination, StatCard, inputCls } from "./ui";
import TransactionTable from "./TransactionTable";
import { naira, num, SERVICE_META } from "../utils";

const blank = { search: "", status: "", payment: "", from: "", to: "" };

export default function Transactions({ type = "all" }) {
  const [filters, setFilters] = useState(blank);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // debounce the search box
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(filters.search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [filters.search]);

  const set = (k, v) => {
    setFilters((f) => ({ ...f, [k]: v }));
    if (k !== "search") setPage(1);
  };

  const url = type === "all" ? "/transactions" : `/transactions/${type}`;
  const { data, loading, error, reload } = useFetch(url, { ...filters, search, page, limit: 20 });

  const title = type === "all" ? "All transactions" : `${SERVICE_META[type].label} transactions`;
  const s = data?.summary;

  const exportCsv = () => {
    if (!data?.items?.length) return;
    const head = ["Date", "User", "Email", "Service", "Reference", "Target", "Provider", "Amount", "Payment", "Status"];
    const lines = data.items.map((r) =>
      [r.timestamp, r.user?.fullName, r.user?.email, r.type, r.ref, r.target, r.provider, r.amount, r.payment, r.status]
        .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
        .join(",")
    );
    const blob = new Blob([[head.join(","), ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${type}-transactions-page-${page}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <PageHeader
        title={title}
        subtitle="Totals below follow whatever filters you set."
        actions={
          <button onClick={exportCsv} className={`${inputCls} flex items-center gap-2 font-medium hover:bg-slate-50`}>
            <Download size={15} /> Export this page
          </button>
        }
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Matching records" value={num(s?.count)} />
        <StatCard title="Successful" value={naira(s?.successAmount)} sub={`${num(s?.successCount)} transactions`} tone="emerald" />
        <StatCard title="Pending" value={naira(s?.pendingAmount)} sub={`${num(s?.pendingCount)} transactions`} tone="amber" />
        <StatCard title="Failed" value={naira(s?.failedAmount)} sub={`${num(s?.failedCount)} transactions`} tone="rose" />
      </div>

      <Card bodyClass="p-0">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 p-4">
          <div className="relative min-w-[220px] flex-1">
            <Search size={15} className="pointer-events-none absolute left-3 top-3 text-slate-400" />
            <input
              value={filters.search}
              onChange={(e) => set("search", e.target.value)}
              placeholder="Search reference, number, user name or email"
              className={`${inputCls} w-full pl-9`}
            />
          </div>
          <select value={filters.status} onChange={(e) => set("status", e.target.value)} className={inputCls}>
            <option value="">Any status</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          {type !== "transfer" && (
            <select value={filters.payment} onChange={(e) => set("payment", e.target.value)} className={inputCls}>
              <option value="">Any payment</option>
              <option value="wallet">Wallet</option>
              <option value="card">Card</option>
              <option value="bank">Bank</option>
            </select>
          )}
          <input type="date" value={filters.from} onChange={(e) => set("from", e.target.value)} className={inputCls} aria-label="From date" />
          <input type="date" value={filters.to} onChange={(e) => set("to", e.target.value)} className={inputCls} aria-label="To date" />
          <button onClick={() => { setFilters(blank); setPage(1); }} className="px-2 text-sm text-slate-500 hover:text-slate-800">
            Clear
          </button>
        </div>

        {error ? (
          <div className="p-4"><ErrorBox message={error} onRetry={reload} /></div>
        ) : loading && !data ? (
          <Loader />
        ) : (
          <div className={loading ? "opacity-60 transition-opacity" : ""}>
            <TransactionTable rows={data.items} showType={type === "all"} />
            <Pagination pagination={data.pagination} onChange={setPage} />
          </div>
        )}
      </Card>
    </>
  );
}
