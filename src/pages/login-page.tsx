import { FormEvent, useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/redux";
import { adminApi, useGetProfileQuery, useLogInMutation } from "@/features/adminApi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLogInMutation();
  const { data: profile } = useGetProfileQuery(undefined, {
    skip: !window.localStorage.getItem("admin_token"),
  });
  const adminProfile = profile?.data ?? profile?.result ?? profile?.profile ?? profile?.admin ?? profile?.user ?? profile;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!adminProfile) return;
    const from = (location.state as { from?: string } | null)?.from ?? "/dashboard";
    navigate(from, { replace: true });
  }, [adminProfile, location.state, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await login({
      email: email.trim(),
      password,
    }).unwrap();

    const token = response.token ?? response.accessToken;
    if (token) {
      window.localStorage.setItem("admin_token", token);
    }

    await dispatch(adminApi.endpoints.getProfile.initiate(undefined, { forceRefetch: true })).unwrap();

    toast.success("Signed in", {
      description: "Welcome back to the super admin panel.",
    });
    const from = (location.state as { from?: string } | null)?.from ?? "/dashboard";
    navigate(from, { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">RestroKhata</p>
            <h1 className="text-2xl font-semibold">Super Admin Login</h1>
          </div>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
