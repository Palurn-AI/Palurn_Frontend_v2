import { type FormEvent, useState } from "react";

import { authFieldClassName, PasswordField } from "./auth-fields.tsx";
import googleIcon from "./assets/sign-in/google.svg";
import tickIcon from "./assets/sign-in/tick.svg";

export function ResetPasswordForm({
  onLogin,
  onReset,
}: {
  onLogin: () => void;
  onReset: (account: { email: string; password: string }) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [remember, setRemember] = useState(true);
  const [emailMissing, setEmailMissing] = useState(false);
  const [mismatch, setMismatch] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const missingEmail = !email.trim();
    const passwordsDiffer = !password || password !== confirm;
    setEmailMissing(missingEmail);
    setMismatch(passwordsDiffer);
    if (missingEmail || passwordsDiffer) {
      return;
    }
    onReset({ email: email.trim(), password });
  }

  return (
    <form className="flex w-full flex-col gap-14" onSubmit={submit} noValidate>
      <div className="flex flex-col gap-1.5 text-center">
        <h1 className="text-[24px] leading-10 font-medium">Reset Password</h1>
        <p className="text-[16px] leading-6 text-[#4b4b4b]">Enter your email and a new password for your account.</p>
      </div>

      <div className="flex flex-col gap-8">
        <button
          type="button"
          className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] border border-[#f2f3f5] bg-white text-[16px] leading-6 font-medium"
        >
          <img alt="" src={googleIcon} className="size-5" />
          Google
        </button>

        <div className="flex items-center gap-4">
          <span className="h-px flex-1 bg-[#e8eaed]" />
          <span className="text-[14px] leading-5">Or</span>
          <span className="h-px flex-1 bg-[#e8eaed]" />
        </div>

        <div className="flex flex-col gap-6">
          <label className="flex flex-col gap-2.5">
            <span className="text-[16px] leading-6">Email Address</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              placeholder="Enter your email"
              aria-invalid={emailMissing || undefined}
              onChange={(event) => {
                setEmail(event.target.value);
                if (emailMissing) {
                  setEmailMissing(false);
                }
              }}
              className={authFieldClassName}
            />
          </label>
          <label className="flex flex-col gap-2.5">
            <span className="text-[16px] leading-6">Password</span>
            <PasswordField
              name="new-password"
              value={password}
              placeholder="Enter your password"
              autoComplete="new-password"
              invalid={mismatch}
              onChange={(next) => {
                setPassword(next);
                if (mismatch) {
                  setMismatch(false);
                }
              }}
            />
          </label>
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-2.5">
              <span className="text-[16px] leading-6">Confirm Password</span>
              <PasswordField
                name="confirm-password"
                value={confirm}
                placeholder="Confirm your password"
                autoComplete="new-password"
                invalid={mismatch}
                describedBy={mismatch ? "reset-password-error" : undefined}
                onChange={(next) => {
                  setConfirm(next);
                  if (mismatch) {
                    setMismatch(false);
                  }
                }}
              />
            </label>
            {mismatch ? (
              <p id="reset-password-error" className="font-[Inter,sans-serif] text-[12px] leading-normal text-[#d92d20]">
                Passwords do not match
              </p>
            ) : null}
            <label className="flex cursor-pointer items-center gap-3">
              <span className="relative size-[15px] shrink-0">
                <input
                  type="checkbox"
                  name="remember"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                <span className="pointer-events-none grid size-[15px] place-items-center rounded-[4px] border-[0.5px] border-[#f04e1a]">
                  {remember ? <img alt="" src={tickIcon} className="size-[15px]" /> : null}
                </span>
              </span>
              <span className="text-[14px] leading-5 tracking-[0.28px] text-[#6b7280]">Remember me</span>
            </label>
          </div>
        </div>

        <button type="submit" className="flex h-14 w-full cursor-pointer items-center justify-center rounded-[12px] bg-[#f04e1a] text-[16px] leading-6 text-white">
          Reset Password
        </button>

        <p className="text-center text-[16px] leading-6 text-[#4b4b4b]">
          Remember your password?{" "}
          <button type="button" onClick={onLogin} className="cursor-pointer font-medium text-[#f04e1a]">
            Log in
          </button>
        </p>
      </div>
    </form>
  );
}
