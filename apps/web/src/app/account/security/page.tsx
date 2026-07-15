"use client";

import { AuthGuard } from "@/components/providers/AuthGuard";
import { Container } from "@/components/ui/Container";
import { TwoFactorSettings } from "@/app/account/security/TwoFactorSettings";

export default function AccountSecurityPage() {
  return (
    <AuthGuard>
      <Container className="max-w-2xl py-16">
        <h1 className="text-3xl font-bold tracking-tight text-ink-900">Security</h1>
        <div className="mt-8">
          <TwoFactorSettings />
        </div>
      </Container>
    </AuthGuard>
  );
}
