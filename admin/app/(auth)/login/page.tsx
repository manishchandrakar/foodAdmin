"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import useAuthStore from "@/store/authStore";
import { api } from "@/lib/config/axios";

type Tab = "password" | "otp";
type OtpStep = "email" | "code";

const LoginPage = () => {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [tab, setTab] = useState<Tab>("password");

  // --- Password tab ---
  const [pwEmail, setPwEmail] = useState("");
  const [pwPassword, setPwPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  // --- OTP tab ---
  const [otpStep, setOtpStep] = useState<OtpStep>("email");
  const [otpEmail, setOtpEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const onLoginSuccess = (data: { name: string; role: string }) => {
    setUser({ id: 0, email: "", name: data.name, role: data.role });
    router.push("/dashboard");
    router.refresh();
  };

  // ---------- Password login ----------
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    if (!pwEmail.trim()) { setPwError("Email is required"); return; }
    if (!pwPassword) { setPwError("Password is required"); return; }
    setPwLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", {
        email: pwEmail.trim().toLowerCase(),
        password: pwPassword,
      });
      onLoginSuccess(data);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } }).response?.data?.error;
      setPwError(msg || "Login failed");
    } finally {
      setPwLoading(false);
    }
  };

  // ---------- OTP: send ----------
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");
    if (!otpEmail.trim()) { setOtpError("Email is required"); return; }
    setOtpLoading(true);
    try {
      await api.post("/api/auth/otp/send", { email: otpEmail.trim().toLowerCase() });
      setOtpSent(true);
      setOtpStep("code");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } }).response?.data?.error;
      setOtpError(msg || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // ---------- OTP: verify ----------
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");
    if (!otpCode || otpCode.length !== 6) { setOtpError("Enter the 6-digit OTP"); return; }
    setOtpLoading(true);
    try {
      const { data } = await api.post("/api/auth/otp/verify", {
        email: otpEmail.trim().toLowerCase(),
        otp: otpCode.trim(),
      });
      onLoginSuccess(data);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } }).response?.data?.error;
      setOtpError(msg || "Invalid OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Food Admin</CardTitle>
          <CardDescription>Sign in to your admin panel</CardDescription>
        </CardHeader>

        {/* Tabs */}
        <div className="flex border-b mx-6">
          <button
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              tab === "password"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => { setTab("password"); setPwError(""); }}
          >
            Password
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              tab === "otp"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => { setTab("otp"); setOtpError(""); setOtpStep("email"); setOtpCode(""); setOtpSent(false); }}
          >
            Login with OTP
          </button>
        </div>

        <CardContent className="pt-6">

          {/* ---- Password tab ---- */}
          {tab === "password" && (
            <form onSubmit={handlePasswordLogin} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="pw-email">Email</Label>
                <Input
                  id="pw-email"
                  type="email"
                  placeholder="admin@example.com"
                  value={pwEmail}
                  onChange={(e) => { setPwEmail(e.target.value); setPwError(""); }}
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pw-password">Password</Label>
                <Input
                  id="pw-password"
                  type="password"
                  placeholder="Enter password"
                  value={pwPassword}
                  onChange={(e) => { setPwPassword(e.target.value); setPwError(""); }}
                  autoComplete="current-password"
                />
              </div>
              {pwError && <p className="text-sm text-red-500 text-center">{pwError}</p>}
              <Button type="submit" className="w-full" disabled={pwLoading}>
                {pwLoading ? "Signing in..." : "Sign In"}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Forgot password?{" "}
                <button
                  type="button"
                  className="underline text-primary"
                  onClick={() => { setTab("otp"); setOtpEmail(pwEmail); setOtpError(""); }}
                >
                  Login with OTP
                </button>
              </p>
            </form>
          )}

          {/* ---- OTP tab ---- */}
          {tab === "otp" && (
            <>
              {/* Step 1: Enter email */}
              {otpStep === "email" && (
                <form onSubmit={handleSendOtp} className="space-y-4" noValidate>
                  <div className="space-y-2">
                    <Label htmlFor="otp-email">Email</Label>
                    <Input
                      id="otp-email"
                      type="email"
                      placeholder="admin@example.com"
                      value={otpEmail}
                      onChange={(e) => { setOtpEmail(e.target.value); setOtpError(""); }}
                      autoComplete="email"
                    />
                  </div>
                  {otpError && <p className="text-sm text-red-500 text-center">{otpError}</p>}
                  <Button type="submit" className="w-full" disabled={otpLoading}>
                    {otpLoading ? "Sending OTP..." : "Send OTP"}
                  </Button>
                </form>
              )}

              {/* Step 2: Enter OTP code */}
              {otpStep === "code" && (
                <form onSubmit={handleVerifyOtp} className="space-y-4" noValidate>
                  {otpSent && (
                    <p className="text-sm text-center text-muted-foreground">
                      OTP sent to <strong>{otpEmail}</strong>. Check your inbox. Valid for 10 minutes.
                    </p>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="otp-code">6-Digit OTP</Label>
                    <Input
                      id="otp-code"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="123456"
                      value={otpCode}
                      onChange={(e) => { setOtpCode(e.target.value.replace(/\D/g, "")); setOtpError(""); }}
                      className="text-center text-xl tracking-widest"
                      autoComplete="one-time-code"
                    />
                  </div>
                  {otpError && <p className="text-sm text-red-500 text-center">{otpError}</p>}
                  <Button type="submit" className="w-full" disabled={otpLoading}>
                    {otpLoading ? "Verifying..." : "Verify OTP"}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Didn&apos;t receive it?{" "}
                    <button
                      type="button"
                      className="underline text-primary"
                      onClick={() => { setOtpStep("email"); setOtpCode(""); setOtpSent(false); setOtpError(""); }}
                    >
                      Resend OTP
                    </button>
                  </p>
                </form>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
