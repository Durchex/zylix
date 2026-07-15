"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/providers/AuthGuard";
import { Container } from "@/components/ui/Container";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuthStore } from "@/store/auth.store";
import { apiRequest } from "@/lib/api-client";

function AccountOverview() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);

  async function handleLogout() {
    await apiRequest("/auth/logout", { method: "POST" });
    clearSession();
    router.replace("/auth/login");
  }

  if (!user) return null;

  return (
    <Container className="max-w-2xl py-16">
      <h1 className="text-3xl font-bold tracking-tight text-ink-900">My Account</h1>

      <Card className="mt-8">
        <CardHeader className="flex items-center justify-between">
          <p className="font-semibold text-ink-900">
            {user.firstName} {user.lastName}
          </p>
          <Badge variant={user.emailVerifiedAt ? "success" : "warning"}>
            {user.emailVerifiedAt ? "Verified" : "Unverified"}
          </Badge>
        </CardHeader>
        <CardBody className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-500">Email</span>
            <span className="text-ink-900">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Role</span>
            <span className="text-ink-900">{user.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Two-factor authentication</span>
            <span className="text-ink-900">{user.twoFactorEnabled ? "Enabled" : "Disabled"}</span>
          </div>
        </CardBody>
      </Card>

      <div className="mt-6 flex gap-3">
        <Link href="/account/security">
          <Button variant="outline">Security settings</Button>
        </Link>
        <Button variant="ghost" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </Container>
  );
}

export default function AccountPage() {
  return (
    <AuthGuard>
      <AccountOverview />
    </AuthGuard>
  );
}
