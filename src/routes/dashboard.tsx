import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/RequireAuth";
import { DashboardView } from "@/components/dashboard/DashboardView";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — UPC Deportes" }] }),
  component: () => (
    <RequireAuth roles={["administrador"]}>
      <section className="container mx-auto px-4 py-8">
        <DashboardView />
      </section>
    </RequireAuth>
  ),
});
