"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { getApiError } from "@/src/lib/apiClient";
import { login } from "@/src/services/auth";
import Link from "next/link";

type FieldErrors = Record<string, string>;

const mapFieldErrors = (errors: { error: string; message: string }[]) =>
  errors.reduce<FieldErrors>((acc, item) => {
    acc[item.error] = item.message;
    return acc;
  }, {});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      const response = await login({ email, password });

      console.log("Login successful:", response);
      setSuccessMessage("Login successful.");
      form.reset();
      const ref = searchParams.get("ref");
      if (ref && !ref.startsWith("http") && !ref.startsWith("//")) {
        router.push(ref.startsWith("/") ? ref : `/${ref}`);
      } else {
        router.push("/home");
      }
    } catch (error) {
      const apiError = getApiError(error);
      if (apiError?.errors?.length) {
        setFieldErrors(mapFieldErrors(apiError.errors));
      }
      setErrorMessage(
        apiError?.message ?? "Unable to login. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex w-full justify-center px-4">
      <div className="flex min-h-screen w-full flex-col justify-center max-w-157 space-y-8">
        {/* CARD LOGIN FORM */}
        <div className="border border-border bg-card p-8 w-full space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground uppercase">
              Returning Customers
            </h1>
            <p className="text-base text-muted-foreground">
              If you already have an account, please log in to continue
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-0.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="font-medium focus-visible:font-semibold"
                placeholder="Enter email"
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
                required
              />
              {fieldErrors.email ? (
                <p id="email-error" className="text-xs text-destructive">
                  {fieldErrors.email}
                </p>
              ) : null}
            </div>

            <div className="space-y-0.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter password"
                  aria-invalid={Boolean(fieldErrors.password)}
                  aria-describedby={
                    fieldErrors.password ? "password-error" : undefined
                  }
                  required
                  className="pr-12 font-medium focus-visible:font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {fieldErrors.password ? (
                <p id="password-error" className="text-xs text-destructive">
                  {fieldErrors.password}
                </p>
              ) : null}

              <div className="flex justify-end mt-3.5">
                <a
                  href="/auth/forgot-password"
                  className="uppercase font-bold text-sm text-muted-foreground transition hover:text-foreground"
                >
                  Forgot Password
                </a>
              </div>
            </div>

            {errorMessage ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {errorMessage}
              </div>
            ) : null}

            {successMessage ? (
              <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {successMessage}
              </div>
            ) : null}

            <Button className="w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Processing... Please wait." : "Log In"}
            </Button>
          </form>
        </div>

        {/* CARD REGISTER */}
        <div className="border border-border bg-card p-8 w-full space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground uppercase">
              New Customers
            </h1>
            <p className="text-base text-muted-foreground">
              Create an account for seamless checkout experience & access to
              your order history
            </p>
          </div>

          <Button asChild className="w-full">
            <Link
              href={`/auth/register${
                searchParams.get("ref")
                  ? `?ref=${encodeURIComponent(searchParams.get("ref") ?? "")}`
                  : ""
              }`}
            >
              Register
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
