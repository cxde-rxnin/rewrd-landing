import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/api/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserAPI, AuthAPI, TaskAPI } from "@/services/api";
import { toast } from "sonner";
import { User, Shield, Link as LinkIcon, Twitter, Instagram, Facebook, Linkedin, Youtube, Globe, Video } from "lucide-react";

export default function Settings() {
    const { user, accessToken, setUser } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");

    if (!user) return null;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col md:flex-row gap-8 items-start">
                <aside className="w-full md:w-64 shrink-0">
                    <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 gap-2 justify-start">
                        <TabsTrigger
                            value="profile"
                            className="w-full justify-start px-4 py-2 h-10 data-[state=active]:bg-muted data-[state=active]:text-foreground hover:bg-muted/50 transition-colors"
                        >
                            <User className="w-4 h-4 mr-2" />
                            Profile
                        </TabsTrigger>
                        <TabsTrigger
                            value="security"
                            className="w-full justify-start px-4 py-2 h-10 data-[state=active]:bg-muted data-[state=active]:text-foreground hover:bg-muted/50 transition-colors"
                        >
                            <Shield className="w-4 h-4 mr-2" />
                            Security
                        </TabsTrigger>
                        <TabsTrigger
                            value="accounts"
                            className="w-full justify-start px-4 py-2 h-10 data-[state=active]:bg-muted data-[state=active]:text-foreground hover:bg-muted/50 transition-colors"
                        >
                            <LinkIcon className="w-4 h-4 mr-2" />
                            Connected Accounts
                        </TabsTrigger>
                    </TabsList>
                </aside>

                <div className="flex-1 w-full max-w-2xl">
                    <TabsContent value="profile" className="mt-0">
                        <ProfileSettings user={user} accessToken={accessToken} setUser={setUser} />
                    </TabsContent>
                    <TabsContent value="security" className="mt-0">
                        <SecuritySettings accessToken={accessToken} />
                    </TabsContent>
                    <TabsContent value="accounts" className="mt-0">
                        <AccountSettings accessToken={accessToken} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}

function ProfileSettings({ user, accessToken, setUser }: { user: any, accessToken: string | null, setUser: (u: any) => void }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!accessToken) return;
        setLoading(true);
        try {
            const updatedUser = await UserAPI.update(accessToken, formData);
            setUser(updatedUser);
            toast.success("Profile updated successfully");
        } catch (err: any) {
            toast.error(err?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                            value={formData.email}
                            disabled
                            className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                    </div>
                    {user.account_type !== 'participant' && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Bio</label>
                            <textarea
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Tell us a little about yourself"
                            />
                        </div>
                    )}
                    <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

function SecuritySettings({ accessToken }: { accessToken: string | null }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!accessToken) return;
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }
        setLoading(true);
        try {
            await AuthAPI.changePassword(accessToken, {
                current_password: formData.currentPassword,
                new_password: formData.newPassword
            });
            toast.success("Password updated successfully");
            setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err: any) {
            toast.error(err?.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your password and security settings.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Current Password</label>
                        <Input
                            type="password"
                            value={formData.currentPassword}
                            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">New Password</label>
                        <Input
                            type="password"
                            value={formData.newPassword}
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Confirm New Password</label>
                        <Input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                        />
                    </div>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Updating..." : "Update Password"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

// Helper to get icon based on platform name
const getPlatformIcon = (platformName: string) => {
    const name = platformName.toLowerCase();
    if (name.includes("twitter") || name.includes("x")) return <Twitter className="w-5 h-5" />;
    if (name.includes("instagram")) return <Instagram className="w-5 h-5" />;
    if (name.includes("facebook")) return <Facebook className="w-5 h-5" />;
    if (name.includes("linkedin")) return <Linkedin className="w-5 h-5" />;
    if (name.includes("youtube")) return <Youtube className="w-5 h-5" />;
    if (name.includes("tiktok")) return <Video className="w-5 h-5" />;
    return <Globe className="w-5 h-5" />;
};

function AccountSettings({ accessToken }: { accessToken: string | null }) {
    const [loading, setLoading] = useState(false);
    const [platforms, setPlatforms] = useState<any[]>([]);
    const [connectedAccounts, setConnectedAccounts] = useState<any[]>([]);

    useEffect(() => {
        if (!accessToken) return;
        const fetchData = async () => {
            try {
                const [platformsData, accountsData] = await Promise.all([
                    TaskAPI.getSocialPlatforms(accessToken),
                    UserAPI.getConnectedAccounts(accessToken).catch(() => []) // Handle error if endpoint doesn't exist yet
                ]);

                const platformsArr = Array.isArray(platformsData) ? platformsData : (platformsData && Array.isArray((platformsData as any).data) ? (platformsData as any).data : []);
                setPlatforms(platformsArr);

                const accountsArr = Array.isArray(accountsData) ? accountsData : (accountsData && Array.isArray((accountsData as any).data) ? (accountsData as any).data : []);
                setConnectedAccounts(accountsArr);
            } catch (err) {
                console.error("Failed to fetch account settings data", err);
            }
        };
        fetchData();
    }, [accessToken]);

    const handleConnect = async (platformId: string) => {
        if (!accessToken) return;
        setLoading(true);
        try {
            await UserAPI.connectAccount(accessToken, { platform_id: platformId });
            toast.success("Account connected");
            const accounts = await UserAPI.getConnectedAccounts(accessToken);
            setConnectedAccounts(Array.isArray(accounts) ? accounts : []);
        } catch (err: any) {
            toast.error(err?.message || "Failed to connect account");
        } finally {
            setLoading(false);
        }
    };

    const handleDisconnect = async (accountId: string) => {
        if (!accessToken) return;
        setLoading(true);
        try {
            await UserAPI.disconnectAccount(accessToken, accountId);
            toast.success("Account disconnected");
            setConnectedAccounts(prev => prev.filter(a => a.id !== accountId));
        } catch (err: any) {
            toast.error(err?.message || "Failed to disconnect account");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Connected Accounts</CardTitle>
                <CardDescription>Connect your social media accounts to verify tasks.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {platforms.map(platform => {
                        const connected = connectedAccounts.find(a => a.platform_id === platform.id);
                        return (
                            <div key={platform.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                                        {getPlatformIcon(platform.name)}
                                    </div>
                                    <div>
                                        <div className="font-medium">{platform.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {connected ? "Connected" : "Not connected"}
                                        </div>
                                    </div>
                                </div>
                                {connected ? (
                                    <Button variant="outline" size="sm" onClick={() => handleDisconnect(connected.id)} disabled={loading}>
                                        Disconnect
                                    </Button>
                                ) : (
                                    <Button size="sm" onClick={() => handleConnect(platform.id)} disabled={loading}>
                                        Connect
                                    </Button>
                                )}
                            </div>
                        );
                    })}
                    {platforms.length === 0 && (
                        <div className="text-center text-muted-foreground py-4">
                            No platforms available.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
