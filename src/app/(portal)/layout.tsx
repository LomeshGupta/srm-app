import { AuthGuard } from "@/components/layout/AuthGuard";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
