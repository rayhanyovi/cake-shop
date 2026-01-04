"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { getApiError } from "@/src/lib/apiClient";
import { register } from "@/src/services/auth";
type FieldErrors = Record<string, string>;

const mapFieldErrors = (errors: { error: string; message: string }[]) =>
  errors.reduce<FieldErrors>((acc, item) => {
    acc[item.error] = item.message;
    return acc;
  }, {});

function RegisterFormContent() {
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
    const firstName = String(formData.get("first_name") ?? "");
    const lastName = String(formData.get("last_name") ?? "");
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      await register({ firstName, lastName, email, password });
      setSuccessMessage("Account created. You can now sign in.");
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
        apiError?.message ?? "Unable to register. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full justify-center items-center flex-1 flex-col">
      <div className="flex w-full max-w-157 flex-col justify-center">
        <div className="w-full border border-border bg-card p-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              NEW CUSTOMERS
            </h1>
            <p className="text-base text-muted-foreground">
              Create an account for seamless checkout experience & access to
              your order history
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-0.5">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Email
              </Label>
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
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Create password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create password"
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
              <div className="pt-2 text-sm text-foreground">
                <p>Password must contain:</p>
                <ul className="list-disc pl-4">
                  <li>8 characters</li>
                  <li>Upper and lower case</li>
                  <li>Number</li>
                </ul>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">
                  First name
                </Label>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Enter first name"
                  className="font-medium focus-visible:font-semibold"
                  aria-invalid={Boolean(fieldErrors.first_name)}
                  aria-describedby={
                    fieldErrors.first_name ? "first-name-error" : undefined
                  }
                  required
                />
                {fieldErrors.first_name ? (
                  <p id="first-name-error" className="text-xs text-destructive">
                    {fieldErrors.first_name}
                  </p>
                ) : null}
              </div>
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">
                  Last name
                </Label>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Enter last name"
                  className="font-medium focus-visible:font-semibold"
                  aria-invalid={Boolean(fieldErrors.last_name)}
                  aria-describedby={
                    fieldErrors.last_name ? "last-name-error" : undefined
                  }
                  required
                />
                {fieldErrors.last_name ? (
                  <p id="last-name-error" className="text-xs text-destructive">
                    {fieldErrors.last_name}
                  </p>
                ) : null}
              </div>
            </div>
            <label className="flex items-start gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                name="marketing_opt_in"
                className="mt-0.5 h-4 w-4 border border-input"
              />
              <span>Send me latest info & promotions about Union Bakery</span>
            </label>
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
              {isSubmitting ? "Creating account..." : "Register"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              By signing up, you agree to our{" "}
              <a href="/terms" className="font-semibold text-foreground">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="font-semibold text-foreground">
                Privacy Policy
              </a>
              .
            </p>

            {/* Ini gaada di Figma, tapi menurutku agak penting nambahin ini krn
            kalo ga sengaja pencet register, ada cara gampang balik ke login */}
            <p className="text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <a
                href={`/auth/login${
                  searchParams.get("ref")
                    ? `?ref=${encodeURIComponent(
                        searchParams.get("ref") ?? ""
                      )}`
                    : ""
                }`}
                className="font-semibold text-foreground"
              >
                Log in
              </a>
              .
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <RegisterFormContent />
    </Suspense>
  );
}
