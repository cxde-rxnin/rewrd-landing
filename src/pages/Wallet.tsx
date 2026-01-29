import { useAuth } from "@/hooks/api/useAuth";
import { useWallet } from "@/hooks/api/useWallet";
import { useDashboard } from "@/hooks/api/useDashboard";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Toaster, toast } from "sonner";
import { useState, useEffect } from "react";

export default function Wallet() {
  const { user, accessToken, initialized } = useAuth();
  const { wallet, fetchWallet, fundWallet, loading } = useWallet(accessToken);
  const { overview, fetchOverview } = useDashboard(accessToken);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [justFunded, setJustFunded] = useState(false);

  useEffect(() => {
    if (justFunded) {
      toast.success(`Wallet funded successfully. New balance: $${wallet?.data?.balance?.toLocaleString() ?? "0.00"}`);
      console.log("Wallet after funding:", wallet);
      setJustFunded(false);
    }
  }, [wallet, justFunded]);

  useEffect(() => {
    if (initialized && user && accessToken) {
      fetchWallet();
      fetchOverview();
    }
  }, [initialized, user, accessToken, fetchWallet, fetchOverview]);

  useEffect(() => {
    if (overview) {
      console.log("Wallet overview:", overview);
    }
  }, [overview]);

  console.log("Wallet object:", wallet);

  if (!initialized || !user) return null;

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
            <p className="text-muted-foreground mt-1">Manage your funds and transactions</p>
          </div>
          <div className="flex gap-3">
            {(user.account_type === "brand" || user.account_type === "influencer") && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Funds
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Fund Wallet</DialogTitle>
                  </DialogHeader>
                  <form
                    className="flex flex-col gap-4 p-2"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        const result = await fundWallet(Number(amount), "usd");
                        if (result?.data?.checkout_url) {
                          // Ensure the redirect uses the VITE_BASE_URL as callback
                          const appUrl = import.meta.env.VITE_BASE_URL || "https://usepartnerpulse.vercel.app/";
                          const url = new URL(result.data.checkout_url);
                          // Replace the 'return_url' param if present, or add it
                          url.searchParams.set('return_url', appUrl + 'wallet');
                          window.location.href = url.toString();
                          // Do not close dialog or reset state yet; wait for Stripe redirect
                          return;
                        }
                        await fetchWallet();
                        setJustFunded(true);
                        setOpen(false);
                        setAmount("");
                      } catch (err: any) {
                        toast.error(err?.message || "Failed to fund wallet");
                      }
                    }}
                  >
                    <input
                      type="number"
                      min="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="border rounded p-2"
                      required
                    />
                    <DialogFooter>
                      <Button type="submit" disabled={loading}>
                        {loading ? "Funding..." : "Fund Wallet"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
            {(user.account_type === "influencer" || user.account_type === "participant") && <Button variant="outline">Withdraw</Button>}
          </div>
        </div>

        <div className={`grid grid-cols-1 gap-4 md:grid-cols-2 ${user.account_type === 'influencer' ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${wallet?.data?.balance?.toLocaleString() ?? "0.00"}</div>
              <p className="text-xs text-muted-foreground">Ready to use</p>
            </CardContent>
            <img src="/coin.png" alt="Available Balance" className="absolute -bottom-20 -right-16 w-40 h-40 opacity-80 pointer-events-none select-none" style={{ zIndex: 0 }} />
          </Card>

          {/* Show Total Spent only for brands and influencers */}
          {(user.account_type === "brand" || user.account_type === "influencer") && (
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${overview?.data?.total_spent?.toLocaleString() ?? "0.00"}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
              <img src="/money.png" alt="Total Spent" className="absolute -bottom-20 -right-16 w-40 h-40 opacity-80 pointer-events-none select-none" style={{ zIndex: 0 }} />
            </Card>
          )}

          {/* Show Total Earned only for influencers and participants */}
          {(user.account_type === "influencer" || user.account_type === "participant") && (
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${wallet?.data?.total_earned?.toLocaleString() ?? "0.00"}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
              <img src="/cash.png" alt="Total Earned" className="absolute -bottom-20 -right-16 w-40 h-40 opacity-80 pointer-events-none select-none" style={{ zIndex: 0 }} />
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
              {/* Transaction list would go here */}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
