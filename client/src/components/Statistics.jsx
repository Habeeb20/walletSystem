import { useState } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import useFetch from "../hooks/useFetch";
import { Card, Empty, ErrorBox, Loader, PageHeader, StatCard, inputCls } from "./ui";
import { compact, naira, num, SERVICE_KEYS, SERVICE_META } from "../utils";

const tip = { contentStyle: { borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 12 } };
const axis = { fontSize: 11, fill: "#64748b" };
const PAY_COLORS = { wallet: "#0f766e", card: "#2563eb", bank: "#d97706", unknown: "#94a3b8" };
const monthName = (m) => new Date(`${m}-01T12:00:00`).toLocaleString("en", { month: "short" });

function Grid() {
  return <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />;
}

export default function Statistics() {
  const [days, setDays] = useState(30);
  const { data: d, loading, error, reload } = useFetch("/statistics", { days });
console.log(d)
  if (loading && !d) return <Loader />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  const periodTotal = d.daily.reduce((s, x) => s + x.total, 0);
  const periodCount = d.daily.reduce((s, x) => s + x.count, 0);
  const newUsers = d.newUsers.reduce((s, x) => s + x.count, 0);
  const maxSpend = d.topSpenders[0]?.total || 1;
  const shareTotal = d.serviceShare.reduce((s, x) => s + x.value, 0);

  return (
    <div className={loading ? "opacity-60 transition-opacity" : ""}>
      <PageHeader
        title="Statistics"
        subtitle="Successful transactions only, in Lagos time."
        actions={
          <select value={days} onChange={(e) => setDays(Number(e.target.value))} className={inputCls}>
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last 12 months</option>
          </select>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title={`Volume, last ${days} days`} value={naira(periodTotal)} tone="teal" />
        <StatCard title="Transactions" value={num(periodCount)} sub={`${num(Math.round(periodCount / days))} per day on average`} tone="blue" />
        <StatCard title="Average per day" value={naira(periodTotal / days)} tone="amber" />
        <StatCard title="New users" value={num(newUsers)} tone="violet" />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Card title="Daily volume by service" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={d.daily}>
              <Grid />
              <XAxis dataKey="label" tickFormatter={(v) => v.slice(5)} tick={axis} minTickGap={24} />
              <YAxis tickFormatter={compact} tick={axis} width={48} />
              <Tooltip formatter={(v) => naira(v)} {...tip} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {SERVICE_KEYS.map((k) => (
                <Bar key={k} dataKey={k} name={SERVICE_META[k].label} stackId="v" fill={SERVICE_META[k].color} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Share of all-time volume">
          {shareTotal ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={d.serviceShare} dataKey="value" nameKey="name" innerRadius={62} outerRadius={100} paddingAngle={2}>
                  {d.serviceShare.map((s) => <Cell key={s.key} fill={SERVICE_META[s.key].color} />)}
                </Pie>
                <Tooltip formatter={(v) => naira(v)} {...tip} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <Empty text="No successful transactions yet" />}
        </Card>

        <Card title="Transactions per day">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={d.daily}>
              <Grid />
              <XAxis dataKey="label" tickFormatter={(v) => v.slice(5)} tick={axis} minTickGap={24} />
              <YAxis tick={axis} width={36} allowDecimals={false} />
              <Tooltip {...tip} />
              <Area type="monotone" dataKey="count" name="Transactions" stroke="#0f766e" fill="#0f766e" fillOpacity={0.15} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="New users per day">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={d.newUsers}>
              <Grid />
              <XAxis dataKey="label" tickFormatter={(v) => v.slice(5)} tick={axis} minTickGap={24} />
              <YAxis tick={axis} width={36} allowDecimals={false} />
              <Tooltip {...tip} />
              <Area type="monotone" dataKey="count" name="New users" stroke="#6d28d9" fill="#6d28d9" fillOpacity={0.15} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Busiest hours">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={d.hourly}>
              <Grid />
              <XAxis dataKey="label" tickFormatter={(v) => `${v}h`} tick={axis} interval={2} />
              <YAxis tickFormatter={compact} tick={axis} width={44} />
              <Tooltip formatter={(v) => naira(v)} labelFormatter={(l) => `${l}:00`} {...tip} />
              <Bar dataKey="total" name="Volume" fill="#0f766e" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Outcome by service" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={d.statusByService}>
              <Grid />
              <XAxis dataKey="name" tick={axis} />
              <YAxis tick={axis} width={40} allowDecimals={false} />
              <Tooltip {...tip} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="success" name="Success" stackId="s" fill="#059669" />
              <Bar dataKey="pending" name="Pending" stackId="s" fill="#d97706" />
              <Bar dataKey="failed" name="Failed" stackId="s" fill="#e11d48" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="How people pay">
          {d.paymentMethods.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={d.paymentMethods} dataKey="amount" nameKey="name" outerRadius={90} paddingAngle={2}>
                  {d.paymentMethods.map((p) => <Cell key={p.name} fill={PAY_COLORS[p.name] || PAY_COLORS.unknown} />)}
                </Pie>
                <Tooltip formatter={(v) => naira(v)} {...tip} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <Empty text="No payments yet" />}
        </Card>

        <Card title="Monthly volume, last 12 months" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={d.monthly}>
              <Grid />
              <XAxis dataKey="label" tickFormatter={monthName} tick={axis} />
              <YAxis tickFormatter={compact} tick={axis} width={48} />
              <Tooltip formatter={(v) => naira(v)} {...tip} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {SERVICE_KEYS.map((k) => (
                <Bar key={k} dataKey={k} name={SERVICE_META[k].label} stackId="m" fill={SERVICE_META[k].color} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Top spenders, all time">
          {d.topSpenders.length ? (
            <ol className="space-y-3">
              {d.topSpenders.map((u, i) => (
                <li key={u._id}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="truncate font-medium text-slate-800">{i + 1}. {u.name || "Unknown user"}</span>
                    <span className="shrink-0 tabular-nums text-slate-900">{naira(u.total)}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-slate-100">
                    <div className="h-1.5 rounded-full bg-teal-700" style={{ width: `${(u.total / maxSpend) * 100}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{num(u.count)} transactions · wallet {naira(u.walletBalance)}</p>
                </li>
              ))}
            </ol>
          ) : <Empty text="No spend recorded yet" />}
        </Card>
      </div>
    </div>
  );
}
