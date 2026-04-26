import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import logo from "@/assets/logo-upc.png";
import {
  Home,
  Package,
  CalendarCheck,
  Trophy,
  ClipboardList,
  UserPlus,
  Clock,
  LogIn,
  LogOut,
  Menu,
  X,
  UserCircle,
  IdCard,
  GraduationCap,
  Users,
  HeartPulse,
  ChevronDown,
  MapPin,
  Search,
  Trash2,
  Edit,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAuth, type Role } from "@/lib/auth";
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
  { to: "/inventario", label: "Inventario", icon: Package, roles: ["admin", "utilero"] },
  { to: "/deportes", label: "Deportes", icon: Trophy, requiresAuth: true },
  { to: "/registros", label: "Registros", icon: ClipboardList, roles: ["admin", "entrenador"] },
  { to: "/horarios", label: "Horarios", icon: Clock, requiresAuth: true },
  { to: "/registro", label: "Registro", icon: UserPlus, publicOnly: true },
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

  const items = navItems.filter((item) => {
    if (item.publicOnly) return false;
    if (item.roles) return item.roles.includes(user.role);
    return true;
  });

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
              {user.role === "admin" && <UsuariosMenu />}
              <PerfilMenu />
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

function PerfilMenu() {
  const location = useLocation();
  const subItems = [
    { to: "/perfil/datos-personales", label: "Datos personales", icon: IdCard },
    { to: "/perfil/datos-academicos", label: "Datos académicos", icon: GraduationCap },
    { to: "/perfil/datos-familiares", label: "Datos familiares", icon: Users },
    { to: "/perfil/valoracion-medica", label: "Valoración médica", icon: HeartPulse },
  ] as const;
  const isOnPerfil = location.pathname.startsWith("/perfil");
  const [open, setOpen] = useState(isOnPerfil);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip="Perfil" isActive={isOnPerfil}>
            <UserCircle className="h-4 w-4" />
            <span>Perfil</span>
            <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180 group-data-[collapsible=icon]:hidden" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {subItems.map((s) => {
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

function UsuariosMenu() {
  const location = useLocation();
  const usuariosItems = [
    { to: "/usuarios/crear", label: "Crear usuario", icon: UserPlus },
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

  const visibleItems = navItems.filter((item) => {
    if (item.publicOnly) return true;
    if (item.roles || item.requiresAuth) return false;
    return true;
  });

  // Rutas públicas adicionales (reservas)
  const reservasItems = [
    { to: "/reservas", label: "Artículos", icon: Package },
    { to: "/reservas/lugares", label: "Lugares", icon: MapPin },
  ];

  
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
            {/* Menú desplegable de Reservas */}
            <div className="relative group">
              <button className="px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-1">
                Reservas <ChevronDown className="h-3 w-3" />
              </button>
              <div className="absolute left-0 top-full mt-1 w-48 rounded-md border border-border bg-card shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {reservasItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent first:rounded-t-md last:rounded-b-md"
                    >
                      <Icon className="h-4 w-4 text-primary" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
            >
              <LogIn className="h-4 w-4" /> Ingresar
            </Link>
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
              {/* Opciones de reservas en menú móvil */}
              <div className="border-t border-border pt-2 mt-2">
                <p className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase">Reservas</p>
                {reservasItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent pl-6"
                    >
                      <Icon className="h-4 w-4 text-primary" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                <LogIn className="h-4 w-4" /> Ingresar
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 min-w-0">{children}</main>
      <SiteFooter />
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