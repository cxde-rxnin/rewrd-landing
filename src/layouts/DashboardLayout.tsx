import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "../hooks/api/useAuth";

export default function DashboardLayout() {
  const { user, accessToken, initialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!initialized) return;
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!user && !accessToken && !storedToken) navigate("/auth");
  }, [initialized, user, accessToken, navigate]);

  if (!initialized) return null;
  const storedToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!user && !accessToken && !storedToken) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-1 flex-col w-full">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/70 px-4 backdrop-blur-md">
          <SidebarTrigger className="md:hidden" />
          <div className="ml-auto flex items-center gap-3 text-sm">
            <div className="font-semibold truncate max-w-[160px]">{user?.name || user?.email || "User"}</div>
            <div className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
              {(user?.name || user?.email || "U").slice(0, 2).toUpperCase()}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto">
          <div className="w-full px-4 py-6 md:px-6">
            <Outlet />
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
