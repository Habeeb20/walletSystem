// import { useCallback, useEffect, useRef, useState } from "react";
// import api from "../api/adminApi";

// export default function useFetch(url, params) {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const latest = useRef(0);
//   const key = JSON.stringify(params || {});

//   const load = useCallback(async () => {
//     const id = ++latest.current;
//     setLoading(true);
//     setError("");
//     try {
//       const res = await api.get(url, { params: JSON.parse(key) });
//       console.log(res.data.data)
//       if (id === latest.current) setData(res.data.data);
//     } catch (e) {
//       if (id === latest.current) setError(e.response?.data?.message || e.message);
//     } finally {
//       if (id === latest.current) setLoading(false);
//     }
//   }, [url, key]);

//   useEffect(() => {
//     load();
//   }, [load]);
// console.log(data)
//   return { data, loading, error, reload: load };
// }





import { useCallback, useEffect, useRef, useState } from "react";
import api from "../api/adminApi";

export default function useFetch(url, params) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const latest = useRef(0);
  const key = JSON.stringify(params || {});

  const load = useCallback(async () => {
    const id = ++latest.current;
    setLoading(true);
    setError("");
    try {
      const res = await api.get(url, { params: JSON.parse(key) });
      const body = res.data;

      // Every admin endpoint answers { success: true, data: {...} }.
      // Anything else means another route answered, or the server returned an error shape.
      if (!body || typeof body !== "object" || body.data === undefined) {
        throw new Error(
          `${url} returned an unexpected response (keys: ${
            body && typeof body === "object" ? Object.keys(body).join(", ") || "none" : typeof body
          })`
        );
      }
      if (id === latest.current) setData(body.data);
    } catch (e) {
      const msg = e.response?.data?.message || e.message;
      if (id === latest.current) setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      if (id === latest.current) setLoading(false);
    }
  }, [url, key]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}