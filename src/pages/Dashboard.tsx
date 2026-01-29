import { useEffect } from "react";
import { useAuth } from "../hooks/api/useAuth";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../hooks/api/useDashboard";
import { useTasks } from "../hooks/api/useTasks";
import { useWallet } from "../hooks/api/useWallet";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Dashboard = () => {
  const { user, accessToken, initialized } = useAuth();
  const navigate = useNavigate();

  const { overview, overviewParticipant, fetchOverview, fetchOverviewParticipant } = useDashboard(accessToken);
  const { tasks, fetchTasks } = useTasks(accessToken);
  const { wallet, fetchWallet } = useWallet(accessToken);

  useEffect(() => {
    if (initialized && !user && !accessToken) navigate("/auth");
  }, [initialized, user, accessToken, navigate]);

  useEffect(() => {
    if (!initialized || !user || !accessToken) return;
    if (user.account_type === "participant") {
      fetchOverviewParticipant();
    } else {
      fetchOverview();
    }
    fetchTasks();
    fetchWallet();
  }, [initialized, user, accessToken, fetchOverview, fetchOverviewParticipant, fetchTasks, fetchWallet]);

  useEffect(() => {
    if (overview) {
      console.log("Dashboard overview:", overview);
    }
  }, [overview]);

  useEffect(() => {
    if (overviewParticipant) {
      console.log("Dashboard overviewParticipant:", overviewParticipant);
    }
  }, [overviewParticipant]);

  if (!initialized || !user) return null;

  const filteredTasks = Array.isArray(tasks)
    ? tasks.filter((t: any) => {
      if (user.account_type === "participant") return true;
      // For brands and influencers, only show tasks they created
      return t.creator_id === user.id || t.user_id === user.id;
    })
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {user?.name || user?.email}. Here's your overview.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${wallet?.data?.balance?.toLocaleString() ?? "0.00"}</div>
            <p className="text-xs text-muted-foreground">Total available</p>
          </CardContent>
          <img src="/coin.png" alt="coin" className="absolute -bottom-20 -right-16 w-40 h-40 opacity-80 pointer-events-none select-none" style={{ zIndex: 0 }} />
        </Card>
        {user.account_type === "participant" ? (
          <>
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verified Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewParticipant?.data?.verified ?? 0}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
              <img src="/trophy.png" alt="campaign" className="absolute -bottom-20 -right-16 w-40 h-40 opacity-80 pointer-events-none select-none" style={{ zIndex: 0 }} />
            </Card>
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overviewParticipant?.data?.in_progress ?? 0}</div>
                <p className="text-xs text-muted-foreground">Awaiting action</p>
              </CardContent>
              <img src="/task.png" alt="money" className="absolute -bottom-20 -right-16 w-40 h-40 opacity-80 pointer-events-none select-none" style={{ zIndex: 0 }} />
            </Card>
          </>
        ) : (
          <>
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overview?.active_campaigns ?? 0}</div>
                <p className="text-xs text-muted-foreground">Currently running</p>
              </CardContent>
              <img src="/campaign.png" alt="campaign" className="absolute -bottom-20 -right-16 w-40 h-40 opacity-80 pointer-events-none select-none" style={{ zIndex: 0 }} />
            </Card>
            {/* <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredTasks.filter((t: any) => t.status === "completed" || t.status === "verified").length}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
              <img src="/trophy.png" alt="completed" className="absolute -bottom-20 -right-16 w-40 h-40 opacity-80 pointer-events-none select-none" style={{ zIndex: 0 }} />
            </Card> */}
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${overview?.data?.total_spent?.toLocaleString() ?? "0.00"}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
              <img src="/money.png" alt="money" className="absolute -bottom-20 -right-16 w-40 h-40 opacity-80 pointer-events-none select-none" style={{ zIndex: 0 }} />
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{user.account_type === "participant" ? "Available Tasks" : user.account_type === "influencer" ? "Your Tasks" : "Recent Tasks"}</CardTitle>
            <CardDescription>Stay on top of your work</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredTasks.length > 0 ? (
                filteredTasks.slice(0, 8).map((t: any) => (
                  <div key={t.id} className="border rounded-lg p-3 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div>
                      <div className="font-medium text-sm">{t.title || t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.platform || t.type}</div>
                    </div>
                    <div className="text-xs">
                      {user.account_type === "participant" ? (
                        <span className="rounded-full bg-emerald-500/10 text-emerald-600 px-2 py-1">+{t.reward ?? t.amount ?? 0}</span>
                      ) : user.account_type === "brand" ? (
                        <span className="rounded-full bg-blue-500/10 text-blue-600 px-2 py-1">{t.submissions_count ?? 0} submissions</span>
                      ) : (
                        <span className="rounded-full bg-amber-500/10 text-amber-600 px-2 py-1">{t.status || "pending"}</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center py-6">No tasks to show.</div>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
            <CardDescription>Latest updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div>Wallet updated • {wallet?.updated_at ? new Date(wallet.updated_at).toLocaleString() : "–"}</div>
              <div>Tasks loaded • {Array.isArray(tasks) ? tasks.length : 0}</div>
              <div>Overview synced</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
