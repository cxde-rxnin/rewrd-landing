import { useState, useCallback } from "react";
import { WalletAPI } from "../../services/api";

export function useWallet(accessToken: string | null) {
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const data = await WalletAPI.get(accessToken);
      setWallet(data);
      setLoading(false);
      return data;
    } catch (e: any) {
      setError(e?.message || "Failed to fetch wallet");
      setLoading(false);
    }
  }, [accessToken]);

  const fundWallet = useCallback(
    async (amount: number, currency: string = "usd") => {
      if (!accessToken) return;
      setLoading(true);
      setError(null);
      try {
        const data = await WalletAPI.fund(accessToken, amount, currency);
        setWallet(data);
        setLoading(false);
        return data;
      } catch (e: any) {
        setError(e?.message || "Failed to fund wallet");
        setLoading(false);
      }
    },
    [accessToken]
  );

  return {
    wallet,
    loading,
    error,
    fetchWallet,
    fundWallet,
  };
}
