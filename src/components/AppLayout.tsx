import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import logo from "@/assets/logo-upc.png";
import {
  Home,
  ClipboardList,
  LogIn,
  LogOut,
  Menu,
  X,
  Trophy,
  Package,
  FolderOpen,
  Shield,
  Users,
  ExternalLink,
  MapPin,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, type Role } from "@/lib/auth";
import { LoginModal } from "@/components/LoginModal";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

type NavItem = {
  to: string;
  search?: Record<string, string>;
  label: string;
  icon: typeof Home;
  roles?: Role[];
  requiresAuth?: boolean;
};

type NavGroup = {
  label: string;
  icon: typeof Home;
  roles?: Role[];
  items: NavItem[];
};

// Rutas que usan el layout autenticado con sidebar
const PROTECTED_PATHS = ["/panel", "/dashboard"];

const navItems: NavItem[] = [
  { to: "/panel", label: "Inicio", icon: Home, requiresAuth: true },
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["administrador"],
  },
  {
    to: "/panel",
    search: { seccion: "reservas" },
    label: "Reservas",
    icon: ClipboardList,
    roles: ["administrador"],
  },
  {
    to: "/panel",
    search: { seccion: "espacios" },
    label: "Escenarios deportivos",
    icon: MapPin,
    roles: ["administrador"],
  },
  {
    to: "/panel",
    search: { seccion: "deportes" },
    label: "Deportes",
    icon: Trophy,
    roles: ["administrador", "entrenador"],
  },
  {
    to: "/panel",
    search: { seccion: "roles" },
    label: "Roles",
    icon: Shield,
    roles: ["administrador"],
  },
  {
    to: "/panel",
    search: { seccion: "usuarios" },
    label: "Usuarios",
    icon: Users,
    roles: ["administrador"],
  },
];

const navGroups: NavGroup[] = [
  {
    label: "Articulos deportivos",
    icon: Package,
    roles: ["administrador", "utilero"],
    items: [
      {
        to: "/panel",
        search: { seccion: "articulos" },
        label: "Articulos",
        icon: Package,
        roles: ["administrador", "utilero"],
      },
      {
        to: "/panel",
        search: { seccion: "categorias" },
        label: "Categorias",
        icon: FolderOpen,
        roles: ["administrador", "utilero"],
      },
    ],
  },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isLogin = location.pathname === "/login";
  const isProtected = PROTECTED_PATHS.includes(location.pathname);

  if (isLogin) return <>{children}</>;

  if (isAuthenticated && isProtected) {
    return (
      <SidebarProvider>
        <div className="flex min-h-svh w-full bg-background overflow-auto">
          <AuthenticatedSidebar />
          <SidebarInset className="min-w-0 overflow-auto">
            <AuthenticatedTopbar />
            <main className="flex-1 min-w-0">{children}</main>
            <SiteFooter />
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return <PublicLayout>{children}</PublicLayout>;
}

function AuthenticatedSidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  if (!user) return null;

  const items = navItems.filter((item) => {
    if (item.roles && !item.roles.includes(user.role)) return false;
    return true;
  });

  const groups = navGroups.filter((group) => {
    if (group.roles && !group.roles.includes(user.role)) return false;
    return true;
  });

  const isItemActive = (item: NavItem) => {
    if (location.pathname !== item.to) return false;
    if (item.search) {
      const params = new URLSearchParams(location.searchStr);
      return Object.entries(item.search).every(([k, v]) => params.get(k) === v);
    }
    if (item.to === "/panel" && !item.search) {
      const params = new URLSearchParams(location.searchStr);
      return !params.has("seccion");
    }
    return true;
  };

  const isSubActive = (item: NavItem) => {
    if (location.pathname !== item.to) return false;
    if (item.search) {
      const params = new URLSearchParams(location.searchStr);
      return Object.entries(item.search).every(([k, v]) => params.get(k) === v);
    }
    return false;
  };

  const isGroupOpen = (label: string, hasActive: boolean) => {
    if (label in openGroups) return openGroups[label];
    return hasActive;
  };

  const toggleGroup = (label: string, currentlyOpen: boolean) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !currentlyOpen }));
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/panel" className="flex items-center gap-2 px-2 py-1.5">
          <img src={logo} alt="UPC" className="h-9 w-auto shrink-0 brightness-0 invert" />
          <div className="leading-tight group-data-[collapsible=icon]:hidden">
            <p className="text-[10px] uppercase tracking-widest text-white/70">UPC</p>
            <p className="text-sm font-display font-semibold text-white">Bienestar Deportivo</p>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Módulos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(item);
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                      <Link to={item.to} search={item.search}>
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {groups.map((group) => {
                const GroupIcon = group.icon;
                const hasActive = group.items.some((item) => isSubActive(item));
                const groupOpen = isGroupOpen(group.label, hasActive);
                return (
                  <SidebarMenuItem key={group.label}>
                    <SidebarMenuButton
                      isActive={hasActive}
                      tooltip={group.label}
                      onClick={() => toggleGroup(group.label, groupOpen)}
                    >
                      <GroupIcon className="h-4 w-4" />
                      <span>{group.label}</span>
                    </SidebarMenuButton>
                    {groupOpen && (
                      <SidebarMenuSub>
                        {group.items.map((item) => {
                          const Icon = item.icon;
                          const active = isSubActive(item);
                          return (
                            <SidebarMenuSubItem key={item.label}>
                              <SidebarMenuSubButton asChild isActive={active}>
                                <Link to={item.to} search={item.search}>
                                  <Icon className="h-4 w-4" />
                                  <span>{item.label}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <Link
          to="/"
          className="flex items-center gap-2 px-2 py-2 rounded-md text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition group-data-[collapsible=icon]:justify-center"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          <span className="group-data-[collapsible=icon]:hidden">Volver al sitio</span>
        </Link>
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="h-9 w-9 shrink-0 rounded-full bg-white text-primary flex items-center justify-center text-sm font-bold">
            {user.nombre.charAt(0)}
          </div>
          <div className="leading-tight min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-semibold text-white truncate">{user.nombre}</p>
            <p className="text-xs capitalize text-white/80">{user.role}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

function AuthenticatedTopbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/85 backdrop-blur px-4">
      <SidebarTrigger />
      <div className="ml-auto flex items-center gap-3">
        {user && (
          <div className="text-right leading-tight hidden sm:block">
            <p className="text-sm font-semibold">{user.nombre}</p>
            <p className="text-xs capitalize text-muted-foreground">{user.role}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
        >
          <LogOut className="h-4 w-4" /> Salir
        </button>
      </div>
    </header>
  );
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const loginTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [loginTriggerEl, setLoginTriggerEl] = useState<HTMLElement | null>(null);

  const visibleItems = navItems.filter((item) => {
    if (item.roles || item.requiresAuth) return false;
    return true;
  });

  return (
    <div className="min-h-svh flex flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="container mx-auto flex h-20 items-center justify-between gap-4 px-4">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src={logo} alt="Universidad Popular del Cesar" className="h-12 w-auto" />
            <div className="hidden sm:block leading-tight">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">UPC</p>
              <p className="font-display font-semibold text-primary">Bienestar Deportivo</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {visibleItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            {isAuthenticated ? (
              <Link
                to="/panel"
                className="hidden sm:inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
              >
                Ir al Panel
              </Link>
            ) : (
              <button
                ref={loginTriggerRef}
                type="button"
                onClick={() => {
                  setLoginTriggerEl(loginTriggerRef.current);
                  setLoginOpen(true);
                }}
                className="hidden sm:inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
              >
                <LogIn className="h-4 w-4" /> Ingresar
              </button>
            )}
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent"
              aria-label="Menú"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-border bg-background">
            <nav className="container mx-auto flex flex-col px-4 py-3 gap-1">
              {visibleItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    {item.label}
                  </Link>
                );
              })}
              {isAuthenticated ? (
                <Link
                  to="/panel"
                  onClick={() => setOpen(false)}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                  Ir al Panel
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setLoginTriggerEl(null);
                    setLoginOpen(true);
                  }}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                  <LogIn className="h-4 w-4" /> Ingresar
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 min-w-0">{children}</main>
      <SiteFooter />
      {loginOpen && (
        <LoginModal triggerElement={loginTriggerEl} onClose={() => setLoginOpen(false)} />
      )}
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-8 grid gap-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo} alt="UPC" className="h-10 w-auto bg-white rounded-md p-1" />
            <p className="font-display font-semibold">Bienestar Deportivo UPC</p>
          </div>
          <p className="mt-3 text-sm opacity-80">
            Plataforma para la gestión de actividades deportivas de la Universidad Popular del
            Cesar.
          </p>
        </div>
        <div className="text-sm opacity-90">
          <p className="font-semibold mb-2">Contacto</p>
          <p>deportes@unicesar.edu.co</p>
          <p>+57 (605) 535 8030</p>
          <p>Valledupar, Cesar</p>
        </div>
        <div className="text-sm opacity-90">
          <p className="font-semibold mb-2">Horario de atención</p>
          <p>Lunes a Viernes: 7:00 a.m. – 7:00 p.m.</p>
          <p>Sábados: 8:00 a.m. – 12:00 m.</p>
        </div>
      </div>
      <div className="border-t border-white/15 py-4 text-center text-xs opacity-80">
        © {new Date().getFullYear()} Universidad Popular del Cesar — Área de Deportes.
      </div>
    </footer>
  );
}