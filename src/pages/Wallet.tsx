import { useAuth } from "@/hooks/api/useAuth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Wallet() {
  const { user, initialized } = useAuth();

  if (!initialized || !user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
          <p className="text-muted-foreground mt-1">Manage your funds and transactions</p>
        </div>
        <div className="flex gap-3">
          {user.account_type === "brand" && <Button>Add Funds</Button>}
          {(user.account_type === "influencer" || user.account_type === "participant") && <Button variant="outline">Withdraw</Button>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,234.50</div>
            <p className="text-xs text-muted-foreground">Ready to use</p>
          </CardContent>
          <img src="/coin.png" alt="Available Balance" className="absolute -bottom-20 -right-16 w-40 h-40 opacity-80 pointer-events-none select-none" style={{zIndex:0}} />
        </Card>

        {/* Show Total Spent only for brands and influencers */}
        {(user.account_type === "brand" || user.account_type === "influencer") && (
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$567.89</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
            <img src="/money.png" alt="Total Spent" className="absolute -bottom-20 -right-16 w-40 h-40 opacity-80 pointer-events-none select-none" style={{zIndex:0}} />
          </Card>
        )}

        {/* Show Total Earned only for influencers and participants */}
        {(user.account_type === "influencer" || user.account_type === "participant") && (
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,345.67</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
            <img src="/cash.png" alt="Total Earned" className="absolute -bottom-20 -right-16 w-40 h-40 opacity-80 pointer-events-none select-none" style={{zIndex:0}} />
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest wallet activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium text-sm">Task Completion Reward</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <span className="text-sm font-semibold text-green-600">+$50.00</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium text-sm">Campaign Fund Transfer</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
              <span className="text-sm font-semibold text-red-600">-$200.00</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
