import { useState, useCallback } from "react";
import { DashboardAPI } from "../../services/api";

export function useDashboard(accessToken: string | null) {
  const [overview, setOverview] = useState<any>(null);
  const [overviewParticipant, setOverviewParticipant] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const data = await DashboardAPI.overview(accessToken);
      setOverview(data);
      setLoading(false);
      return data;
    } catch (e: any) {
      setError(e?.message || "Failed to fetch overview");
      setLoading(false);
    }
  }, [accessToken]);

  const fetchOverviewParticipant = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const data = await DashboardAPI.overviewParticipant(accessToken);
      setOverviewParticipant(data);
      setLoading(false);
      return data;
    } catch (e: any) {
      setError(e?.message || "Failed to fetch participant overview");
      setLoading(false);
    }
  }, [accessToken]);

  return {
    overview,
    overviewParticipant,
    loading,
    error,
    fetchOverview,
    fetchOverviewParticipant,
  };
}
