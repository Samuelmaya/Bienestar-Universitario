import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import logo from "@/assets/logo-upc.png";
import { LoginModal } from "@/components/LoginModal";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Iniciar sesion — UPC Deportes" }] }),
  component: LoginPage,
});

function LoginPage() {
  const triggerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <div ref={triggerRef} className="absolute top-6 left-6">
        <img src={logo} alt="UPC" className="h-10 w-auto" />
      </div>
      <LoginModal triggerElement={triggerRef.current} />
    </div>
  );
}
