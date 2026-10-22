import { type FormEvent, useState } from "react";

import { authFieldClassName, PasswordField } from "./auth-fields.tsx";
import { OptionMenu } from "./components/dropdown-menu.tsx";
import googleIcon from "./assets/sign-in/google.svg";
import tickIcon from "./assets/sign-in/tick.svg";

const teamSizes = ["1-10", "11-50", "51-200", "201-500", "500+"];

export function SignUpForm({
  onLogin,
  onProceed,
  onForgot,
}: {
  onLogin: () => void;
  onProceed: (account: { email: string; password: string; name: string }) => void;
  onForgot: () => void;
}) {
  const [step, setStep] = useState<"details" | "password">("details");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [remember, setRemember] = useState(true);
  const [mismatch, setMismatch] = useState(false);

  function continueToPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStep("password");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!password || password !== confirm) {
      setMismatch(true);
      return;
    }
    setMismatch(false);
    onProceed({ email: email.trim(), password, name: firstName.trim() || "Hana Ito" });
  }

  return (
    <form className="flex w-full flex-col gap-14" onSubmit={step === "details" ? continueToPassword : submit} noValidate>
      <div className="flex flex-col gap-1.5 text-center">
        <h1 className="text-[24px] leading-10 font-medium">Sign Up Account</h1>
        <p className="text-[16px] leading-6 text-[#4b4b4b]">Enter your information to create your account.</p>
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

        <div key={step} className="auth-forward flex flex-col gap-6">
          {step === "details" ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Field label="First Name" name="firstName" value={firstName} placeholder="Enter first name" autoComplete="given-name" onChange={setFirstName} />
                <Field label="Last Name" name="lastName" value={lastName} placeholder="Enter last name" autoComplete="family-name" onChange={setLastName} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Email Address" name="email" type="email" value={email} placeholder="Enter your email" autoComplete="email" onChange={setEmail} />
                <Field label="Phone Number" name="phone" type="tel" value={phone} placeholder="+1" autoComplete="tel" onChange={setPhone} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Company Name" name="company" value={company} placeholder="Enter company name" autoComplete="organization" onChange={setCompany} />
                <SelectField label="Team Size" name="teamSize" value={teamSize} placeholder="Select team size" options={teamSizes} onChange={setTeamSize} />
              </div>
            </>
          ) : (
            <>
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
                    describedBy={mismatch ? "confirm-password-error" : undefined}
                    onChange={(next) => {
                      setConfirm(next);
                      if (mismatch) {
                        setMismatch(false);
                      }
                    }}
                  />
                </label>
                {mismatch ? (
                  <p id="confirm-password-error" className="font-[Inter,sans-serif] text-[12px] leading-normal text-[#d92d20]">
                    Passwords do not match
                  </p>
                ) : null}
                <div className="flex items-center justify-between gap-4">
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
                  <button type="button" onClick={onForgot} className="cursor-pointer text-[14px] leading-5 tracking-[0.28px] text-[#1e1e1e]">
                    Forget Password?
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <button type="submit" className="flex h-14 w-full cursor-pointer items-center justify-center rounded-[12px] bg-[#f04e1a] text-[16px] leading-6 text-white">
          Sign Up
        </button>

        <p className="text-center text-[16px] leading-6 text-[#4b4b4b]">
          Already have an account?{" "}
          <button type="button" onClick={onLogin} className="cursor-pointer font-medium text-[#f04e1a]">
            Log in
          </button>
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  value,
  placeholder,
  onChange,
  type = "text",
  autoComplete,
}: {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete: string;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-2.5">
      <span className="text-[16px] leading-6">{label}</span>
      <input
        type={type}
        name={name}
        autoComplete={autoComplete}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={authFieldClassName}
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  value,
  placeholder,
  options,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-2.5">
      <span className="text-[16px] leading-6">{label}</span>
      <OptionMenu
        name={name}
        value={value}
        options={options}
        onSelect={onChange}
        align="start"
        itemClassName="text-[14px] leading-6"
        className={`${authFieldClassName} flex cursor-pointer items-center text-left ${value ? "text-[#35383d]" : "text-[#6b6b6b]"}`}
      >
        <span className="min-w-0 flex-1 truncate">{value || placeholder}</span>
      </OptionMenu>
    </label>
  );
}
