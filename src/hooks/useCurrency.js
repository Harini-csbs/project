import { useState, useEffect } from "react";

export default function useCurrency(base = "INR") {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch(
          `https://v6.exchangerate-api.com/v6/YOUR_API_KEY/latest/${base}`
        );
        const data = await res.json();
        setRates(data.conversion_rates);
      } catch (err) {
        console.error("Currency API error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRates();
  }, [base]);

  return { rates, loading };
}
