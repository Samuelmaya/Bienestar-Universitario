import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import logo from "@/assets/logo-upc.png";
import {
  Home,
  Package,
  CalendarCheck,
  Trophy,
  ClipboardList,
  Clock,
  LogIn,
  LogOut,
  Menu,
  X,
  ChevronDown,
  MapPin,
  Search,
  Trash2,
  Edit,
  FolderOpen,
  List,
  Shield,
  Users,
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar";
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
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

type NavItem = {
  to: string;
  label: string;
  icon: typeof Home;
  roles?: Role[];
  requiresAuth?: boolean;
  publicOnly?: boolean;
};

const navItems: NavItem[] = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/dashboard", label: "Dashboard", icon: Trophy, roles: ["admin", "entrenador"] },
  { to: "/inventario", label: "Inventario", icon: Package, roles: ["admin", "utilero"] },

  { to: "/registros", label: "Registros", icon: ClipboardList, roles: ["admin", "entrenador"] },
  { to: "/horarios", label: "Horarios", icon: Clock, requiresAuth: true },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isLogin = location.pathname === "/login";

  if (isLogin) return <>{children}</>;

  if (isAuthenticated) {
    return (
      <SidebarProvider>
        {/* Cambiado: min-h-screen → min-h-svh, agregado overflow-auto */}
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
  if (!user) return null;

  const items = navItems.filter((item) => !item.publicOnly);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2 px-2 py-1.5">
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
                const active = location.pathname === item.to;
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                      <Link to={item.to}>
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              <UsuariosMenu />
              <RolesMenu />
              <CategoriasMenu />
              <DeportesMenu />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
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

function UsuariosMenu() {
  const location = useLocation();
  const usuariosItems = [
    { to: "/usuarios/crear", label: "Crear usuario", icon: Users },
    { to: "/usuarios/buscar", label: "Buscar usuarios", icon: Search },
    { to: "/usuarios/eliminar", label: "Eliminar usuario", icon: Trash2 },
    { to: "/usuarios/actualizar", label: "Actualizar usuario", icon: Edit },
  ] as const;
  const isOnUsuarios = location.pathname.startsWith("/usuarios");
  const [open, setOpen] = useState(isOnUsuarios);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip="Usuarios" isActive={isOnUsuarios}>
            <Users className="h-4 w-4" />
            <span>Usuarios</span>
            <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180 group-data-[collapsible=icon]:hidden" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {usuariosItems.map((s) => {
              const SIcon = s.icon;
              const active = location.pathname === s.to;
              return (
                <SidebarMenuSubItem key={s.to}>
                  <SidebarMenuSubButton asChild isActive={active}>
                    <Link to={s.to}>
                      <SIcon className="h-4 w-4" />
                      <span>{s.label}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

function RolesMenu() {
  const location = useLocation();
  const rolesItems = [
    { to: "/roles/crear", label: "Crear rol", icon: Shield },
    { to: "/roles/buscar", label: "Buscar por ID", icon: Search },
    { to: "/roles/listar", label: "Listar todos", icon: List },
    { to: "/roles/actualizar", label: "Actualizar", icon: Edit },
    { to: "/roles/eliminar", label: "Eliminar", icon: Trash2 },
  ] as const;
  const isOnRoles = location.pathname.startsWith("/roles");
  const [open, setOpen] = useState(isOnRoles);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip="Roles" isActive={isOnRoles}>
            <Shield className="h-4 w-4" />
            <span>Roles</span>
            <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180 group-data-[collapsible=icon]:hidden" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {rolesItems.map((s) => {
              const SIcon = s.icon;
              const active = location.pathname === s.to;
              return (
                <SidebarMenuSubItem key={s.to}>
                  <SidebarMenuSubButton asChild isActive={active}>
                    <Link to={s.to}>
                      <SIcon className="h-4 w-4" />
                      <span>{s.label}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

function CategoriasMenu() {
  const location = useLocation();
  const categoriasItems = [
    { to: "/categorias/crear", label: "Crear categoría", icon: FolderOpen },
    { to: "/categorias/buscar", label: "Buscar por ID", icon: Search },
    { to: "/categorias/listar", label: "Listar todas", icon: List },
    { to: "/categorias/actualizar", label: "Actualizar", icon: Edit },
    { to: "/categorias/eliminar", label: "Eliminar", icon: Trash2 },
  ] as const;
  const isOnCategorias = location.pathname.startsWith("/categorias");
  const [open, setOpen] = useState(isOnCategorias);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip="Categorías" isActive={isOnCategorias}>
            <FolderOpen className="h-4 w-4" />
            <span>Categorías</span>
            <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180 group-data-[collapsible=icon]:hidden" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {categoriasItems.map((s) => {
              const SIcon = s.icon;
              const active = location.pathname === s.to;
              return (
                <SidebarMenuSubItem key={s.to}>
                  <SidebarMenuSubButton asChild isActive={active}>
                    <Link to={s.to}>
                      <SIcon className="h-4 w-4" />
                      <span>{s.label}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

function DeportesMenu() {
  const location = useLocation();
  const deportesItems = [
    { to: "/deportes/crear", label: "Crear deporte", icon: Trophy },
    { to: "/deportes/listar", label: "Listar todos", icon: List },
    { to: "/deportes/actualizar", label: "Actualizar", icon: Edit },
    { to: "/deportes/eliminar", label: "Eliminar", icon: Trash2 },
  ] as const;
  const isOnDeportes = location.pathname.startsWith("/deportes");
  const [open, setOpen] = useState(isOnDeportes);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip="Deportes" isActive={isOnDeportes}>
            <Trophy className="h-4 w-4" />
            <span>Deportes</span>
            <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180 group-data-[collapsible=icon]:hidden" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {deportesItems.map((s) => {
              const SIcon = s.icon;
              const active = location.pathname === s.to;
              return (
                <SidebarMenuSubItem key={s.to}>
                  <SidebarMenuSubButton asChild isActive={active}>
                    <Link to={s.to}>
                      <SIcon className="h-4 w-4" />
                      <span>{s.label}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
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
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const loginTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [loginTriggerEl, setLoginTriggerEl] = useState<HTMLElement | null>(null);

  const visibleItems = navItems.filter((item) => {
    if (item.publicOnly) return true;
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
