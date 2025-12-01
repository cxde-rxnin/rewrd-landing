import { Home, LogOut, BarChart3, ListChecks, Wallet, Sparkles, ChevronLeft, Settings } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/api/useAuth";
import React from "react";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: ListChecks,
  },
  {
    title: "Wallet",
    url: "/wallet",
    icon: Wallet,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  // Analytics will be conditionally added below
];

export function AppSidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { state, toggleSidebar } = useSidebar();

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const isActive = (url: string) => location.pathname === url;

  const sidebarItems = items;

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="border-b border-border/50 px-0">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-primary via-primary to-primary/70 text-white font-bold text-sm shadow-md shrink-0">
              <Sparkles className="h-6 w-6" />
            </div>
            {state === "expanded" && (
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-base leading-tight">PartnerPulse</span>
                <span className="text-xs text-muted-foreground/80 capitalize font-medium">{user?.account_type}</span>
              </div>
            )}
          </div>
          {state === "expanded" && (
            <button
              onClick={toggleSidebar}
              className="p-1 hover:bg-muted rounded-md transition-colors md:hidden"
              title="Collapse sidebar"
            >
              <ChevronLeft className="h-5 w-5 text-muted-foreground" />
            </button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-0">
        <SidebarGroup className="px-0">
          {state === "expanded" && (
            <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Navigation</SidebarGroupLabel>
          )}
          <SidebarGroupContent className="px-2">
            <SidebarMenu className="gap-2">
              {sidebarItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={`transition-all duration-200 h-11 ${active
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 shrink-0" />
                        {state === "expanded" && (
                          <span className="text-base">{item.title}</span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 px-0">
        <SidebarSeparator className="mx-0" />
        <div className="px-2 py-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                className="w-full h-11 text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 font-medium"
              >
                <LogOut className="h-5 w-5" />
                {state === "expanded" && (
                  <span className="text-base">Logout</span>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
