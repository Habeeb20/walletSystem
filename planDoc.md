# Plans API: Frontend Integration Guide

## 1. What this is

Previously, all plan data (MTN, Airtel, DStv, etc.) lived in `.jsx` files bundled into the frontend. That made the bundle heavy and meant any price change required a frontend redeploy.

Now the plans are served by the backend. The frontend **only requests the plans it needs, at the moment it needs them** (for example, when a user opens the "Buy Data" screen and selects MTN).

- **Base path:** `/api/plans`
- **Method:** `GET` only
- **Auth:** none required by this router (if you mount it behind auth middleware on the backend, send your token as usual)
- **Format:** JSON
- **Currency:** `price` is a number in Naira (₦)

Replace `BASE_URL` in all examples below with the backend's URL.

---

## 2. Quick reference

| Endpoint | Purpose |
|---|---|
| `GET /api/plans` | List all services (for building menus). No plans returned. |
| `GET /api/plans/:service` | Plans for **one** service, e.g. `mtn` |
| `GET /api/plans/type/:type` | Plans for **all services of one type**, e.g. every TV provider |

### Valid `:service` values

| Service key | Type |
|---|---|
| `mtn`, `airtel`, `glo`, `9mobile` | `data` |
| `dstv`, `gotv`, `startimes`, `showmax` | `tv` |
| `electricity` | `electricity` |

Keys are case-insensitive (`MTN` and `mtn` both work).

### Valid `:type` values

`data`, `tv`, `electricity`

---

## 3. Endpoints in detail

### 3.1 `GET /api/plans`

Use this once to build your service picker. It is tiny and returns no plan data.

**Response**
```json
{
  "success": true,
  "services": [
    { "key": "mtn",         "label": "MTN",         "type": "data",        "count": 98 },
    { "key": "airtel",      "label": "Airtel",      "type": "data",        "count": 69 },
    { "key": "glo",         "label": "Glo",         "type": "data",        "count": 21 },
    { "key": "9mobile",     "label": "9mobile",     "type": "data",        "count": 19 },
    { "key": "dstv",        "label": "DStv",        "type": "tv",          "count": 45 },
    { "key": "gotv",        "label": "GOtv",        "type": "tv",          "count": 8 },
    { "key": "startimes",   "label": "Startimes",   "type": "tv",          "count": 28 },
    { "key": "showmax",     "label": "Showmax",     "type": "tv",          "count": 15 },
    { "key": "electricity", "label": "Electricity", "type": "electricity", "count": 8 }
  ]
}
```

`count` is the number of **active** plans (status `1`).

---

### 3.2 `GET /api/plans/:service`

Returns plans for a single service. This is the endpoint you will use most.

**Example:** `GET /api/plans/mtn?category=SME&maxPrice=1000`

**Response**
```json
{
  "success": true,
  "service": "mtn",
  "type": "data",
  "count": 3,
  "plans": [
    {
      "coded": "10_729",
      "name": "MTN SME 500.0MB 30 Days Plan",
      "price": 520,
      "network": "MTN",
      "category": "SME",
      "server": "10",
      "status": 1,
      "id": 8158,
      "dataplan": "0.5"
    }
  ]
}
```

**Unknown service → `404`**
```json
{
  "success": false,
  "message": "Unknown service \"foo\"",
  "available": ["mtn", "airtel", "glo", "9mobile", "dstv", "gotv", "startimes", "showmax", "electricity"]
}
```

---

### 3.3 `GET /api/plans/type/:type`

Returns plans for every service of that type, **grouped by service key**. Useful if one screen needs several providers at once (for example, a "Cable TV" screen with tabs).

**Example:** `GET /api/plans/type/tv`

**Response**
```json
{
  "success": true,
  "type": "tv",
  "data": {
    "dstv":      [ { "name": "DStv Padi", "coded": "dstv-padi", "price": 4450, "type": "dstv", "status": 1, "id": 877 } ],
    "gotv":      [ ... ],
    "startimes": [ ... ],
    "showmax":   [ ... ]
  }
}
```

Note the shape difference: this endpoint returns `data: { [serviceKey]: plans[] }`, while `/:service` returns `plans: []`.

**Unknown type → `404`**
```json
{ "success": false, "message": "Unknown type \"foo\"" }
```

---

## 4. Query filters (all optional)

These work on both `/:service` and `/type/:type`.

| Param | Example | Behavior |
|---|---|---|
| `category` | `?category=SME` | Exact match, case-insensitive |
| `server` | `?server=10` | Exact match on the server field |
| `minPrice` | `?minPrice=500` | Price greater than or equal to value |
| `maxPrice` | `?maxPrice=5000` | Price less than or equal to value |
| `search` | `?search=1gb` | Case-insensitive substring match on `name` |
| `includeInactive` | `?includeInactive=true` | Include plans with `status` other than `1` |

Filters can be combined: `/api/plans/glo?category=DG&maxPrice=3000&search=30 days`

**By default, only active plans (`status: 1`) are returned.** You normally never need `includeInactive`.

---

## 5. Plan object shapes

The three kinds of services return slightly different fields.

### Data plans (`mtn`, `airtel`, `glo`, `9mobile`)

| Field | Type | Notes |
|---|---|---|
| `id` | number | Unique plan id |
| `coded` | string | Provider plan code, e.g. `"10_729"` or `"6_mtn-1gb-350"` |
| `name` | string | Display name, e.g. `"MTN 1GB + 1.5mins Daily Plan"` |
| `price` | number | Price in Naira |
| `network` | string | `MTN`, `AIRTEL`, `GLO`, `9MOBILE` |
| `category` | string | Plan group, e.g. `COOL`, `CG`, `DG`, `SME`, `SPECIAL`, `XTRADATA`. Can be an **empty string** |
| `server` | string | Provider server, `"6"` or `"10"` |
| `status` | number | `1` = active |
| `dataplan` | string | Internal value, **do not display** (see notes) |

### TV plans (`dstv`, `gotv`, `startimes`, `showmax`)

| Field | Type | Notes |
|---|---|---|
| `id` | number | Unique plan id |
| `coded` | string | Plan code, e.g. `"dstv-padi"` |
| `name` | string | Display name, e.g. `"DStv Padi"` |
| `price` | number | Price in Naira |
| `type` | string | `dstv`, `gotv`, `startimes`, `showmax` |
| `status` | number | `1` = active |

### Electricity (`electricity`)

```json
{ "id": 1, "name": "IKEDC", "code": "ikeja-electric", "status": 1 }
```

| Field | Type | Notes |
|---|---|---|
| `id` | number | Unique id |
| `name` | string | Distribution company, e.g. `IKEDC` |
| `code` | string | Disco code, e.g. `ikeja-electric` |
| `status` | number | `1` = active |

> **Heads-up:** electricity entries use **`code`**, while data and TV plans use **`coded`**. Electricity entries also have **no `price`**, so `minPrice` / `maxPrice` will return nothing for the `electricity` service. Do not use price filters there.

---

## 6. Usage examples

### Plain `fetch`

```js
const BASE_URL = 'https://your-backend.com';

export async function getPlans(service, filters = {}) {
  const query = new URLSearchParams(filters).toString();
  const res = await fetch(`${BASE_URL}/api/plans/${service}${query ? `?${query}` : ''}`);
  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to load plans');
  }
  return json.plans;
}

// usage
const plans = await getPlans('mtn', { category: 'SME', maxPrice: 1000 });
```

### React: fetch when the user picks a network

```jsx
import { useEffect, useState } from 'react';
import { getPlans } from './api/plans';

export default function DataPlans({ network }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!network) return;
    let cancelled = false;

    setLoading(true);
    setError(null);

    getPlans(network)
      .then((data) => { if (!cancelled) setPlans(data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [network]);

  if (loading) return <p>Loading plans...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ul>
      {plans.map((p) => (
        <li key={p.id}>{p.name}: ₦{p.price.toLocaleString()}</li>
      ))}
    </ul>
  );
}
```

### Building the service menu

```js
const res = await fetch(`${BASE_URL}/api/plans`);
const { services } = await res.json();

const dataNetworks = services.filter((s) => s.type === 'data');
const tvProviders  = services.filter((s) => s.type === 'tv');
```

### Grouping data plans by category (tabs/filters in the UI)

```js
const grouped = plans.reduce((acc, plan) => {
  const key = plan.category || 'OTHER';
  (acc[key] ||= []).push(plan);
  return acc;
}, {});
```

---

## 7. Recommended practices

1. **Fetch on demand.** Call `/api/plans/:service` when the user selects a network or provider, not on app start.
2. **Cache in memory** for the session (for example React Query, SWR, or a simple object keyed by service). Plans rarely change, so there's no need to refetch each time the user switches tabs.
3. **Use `id` as the React `key`.** It is unique per plan.
4. **Handle loading and error states.** Always check `success` and the HTTP status.
5. **Don't hardcode the list of services.** Use `GET /api/plans` so new services appear automatically.
6. **Sort in the frontend** if you need a particular order, since the API returns plans in the order stored (by price is not guaranteed).

---

## 8. Things to know about the data

- **`category` can be empty** for a few plans (some 9mobile and Airtel plans). Treat `""` as "Other" when grouping.
- **`dataplan` is internal.** Values like `"Plan"` or `"AM)"` are not meaningful. Don't show it to users.
- **Some plan names are long**, for example `"MTN 2.7GB + 2mins + 2GB All Night Streaming + 200MB YouTube Music Monthly Plan"`. Plan for text wrapping or truncation in your cards.
- **Prices include decimals** in the data (`130.00`) but come through as JSON numbers (`130`). Format with `toLocaleString()` for display.
- **`coded`, `server`, `category` and `id`** identify the plan to the backend, so keep them when a user selects a plan. Check with the backend developer which field the purchase endpoint expects.

---

## 9. Migrating from the old `.jsx` files

| Old | New |
|---|---|
| `import mtnPlans from './plans/MTN.jsx'` | `const mtnPlans = await getPlans('mtn')` |
| `import gotvPlans from './plans/GOTV.jsx'` | `const gotvPlans = await getPlans('gotv')` |
| `import electricityPlans from './plans/Electricty.jsx'` | `const discos = await getPlans('electricity')` |
| `import startimesPlans from './plans/Startimes.jsx'` | `const startimesPlans = await getPlans('startimes')` |

The plan objects keep the same field names as before, so most UI code should work unchanged once the data is loaded asynchronously. The main change is that the data is now **async**, so add loading and error states. After migrating, the `plans/*.jsx` files can be deleted from the frontend.

---

## 10. Error summary

| Situation | Status | Body |
|---|---|---|
| Success | `200` | `{ "success": true, ... }` |
| Unknown service | `404` | `{ "success": false, "message": "...", "available": [...] }` |
| Unknown type | `404` | `{ "success": false, "message": "..." }` |
| Filters match nothing | `200` | `plans: []` and `count: 0` (not an error) |