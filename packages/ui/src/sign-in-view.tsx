import { companyLogin, matchesCompanyLogin, useLogin, useSessionStore } from "@palurn/api";
import { type AnimationEvent, type FormEvent, type ReactNode, useLayoutEffect, useRef, useState } from "react";

import { authFieldClassName, PasswordField } from "./auth-fields.tsx";
import { notifySuccess } from "./log-action.ts";
import panelCircle from "./assets/sign-in/circle.svg";
import googleIcon from "./assets/sign-in/google.svg";
import tickIcon from "./assets/sign-in/tick.svg";
import { OtpForm } from "./otp-view.tsx";
import { ResetPasswordForm } from "./reset-password-view.tsx";
import { SignUpForm } from "./sign-up-view.tsx";

type PendingAccount = { email: string; password: string; name?: string };

const signInDelay = 500;

const tasks = [
  { label: "About Us", value: "78%", width: "78%", fill: "#ef4444", track: "#fde8e8", knob: true },
  { label: "PalurnAI Landing Page Design", value: "82%", width: "82%", fill: "#22a06b", track: "#e5f6ee", knob: false },
  { label: "User Research", value: "54%", width: "54%", fill: "#f5b942", track: "#fbf3df", knob: false },
];

export function SignInView() {
  const login = useLogin();
  const setSession = useSessionStore((state) => state.setSession);
  const [screen, setScreen] = useState<"sign-in" | "sign-up" | "otp" | "reset">("sign-in");
  const [direction, setDirection] = useState<"forward" | "back" | null>(null);
  const [pending, setPending] = useState<PendingAccount | null>(null);
  const [email, setEmail] = useState<string>(companyLogin.email);
  const [password, setPassword] = useState<string>(companyLogin.password);
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const invalid = login.isError;
  const busy = submitting || login.isPending;

  function updateEmail(value: string) {
    setEmail(value);
    if (login.isError) {
      login.reset();
    }
  }

  function updatePassword(value: string) {
    setPassword(value);
    if (login.isError) {
      login.reset();
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, signInDelay));
    try {
      await login.mutateAsync({ email, password });
      notifySuccess("Signed in");
    } catch {
      setSubmitting(false);
    }
  }

  function continueToVerification(account: PendingAccount) {
    setPending(account);
    setScreen("otp");
  }

  function openReset() {
    setDirection("forward");
    setScreen("reset");
  }

  function returnToSignIn() {
    setDirection("back");
    setScreen("sign-in");
  }

  async function confirmCode() {
    if (pending?.email && pending.password && matchesCompanyLogin(pending.email, pending.password)) {
      try {
        await login.mutateAsync({ email: pending.email, password: pending.password });
        notifySuccess("Signed in");
      } catch {
        return;
      }
      return;
    }
    setSession({ token: "company-demo-token", name: pending?.name || "Hana Ito" });
    notifySuccess("Signed in");
  }

  return (
    <div className="grid min-h-svh bg-white text-[#111] min-[1200px]:grid-cols-[740fr_700fr]">
      <SignInPanel />

      <main
        className={`flex min-h-svh justify-center overflow-y-auto px-6 min-[1200px]:px-[67px] ${screen === "otp" ? "items-center py-16" : "py-16 min-[1200px]:pt-[100px] min-[1200px]:pb-16"}`}
      >
        <div key={screen} className={`w-full max-w-[566px] ${direction === "forward" ? "auth-forward" : direction === "back" ? "auth-back" : ""}`}>
        {screen === "otp" ? (
          <OtpForm pending={login.isPending} onConfirm={confirmCode} />
        ) : screen === "reset" ? (
          <ResetPasswordForm
            onLogin={returnToSignIn}
            onReset={(account) => {
              setEmail(account.email);
              setPassword(account.password);
              if (login.isError) {
                login.reset();
              }
              setDirection("forward");
              continueToVerification(account);
            }}
          />
        ) : screen === "sign-up" ? (
          <SignUpForm
            onLogin={returnToSignIn}
            onForgot={openReset}
            onProceed={continueToVerification}
          />
        ) : (
        <form className="flex w-full flex-col gap-14" onSubmit={submit} noValidate>
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

            <div className="flex flex-col gap-6">
              <label className="flex flex-col gap-2.5">
                <span className="text-[16px] leading-6">Email Address</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  placeholder="Enter your email"
                  onChange={(event) => updateEmail(event.target.value)}
                  className={authFieldClassName}
                />
              </label>

              <div className="flex flex-col gap-3">
                <label className="flex flex-col gap-2.5">
                  <span className="text-[16px] leading-6">Password</span>
                  <PasswordField
                    name="password"
                    value={password}
                    placeholder="Enter your password"
                    invalid={invalid}
                    describedBy={invalid ? "sign-in-error" : undefined}
                    onChange={updatePassword}
                  />
                </label>

                {invalid ? (
                  <p id="sign-in-error" className="font-[Inter,sans-serif] text-[12px] leading-normal text-[#d92d20]">
                    Invalid Credentials
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
                  <button type="button" onClick={openReset} className="cursor-pointer text-[14px] leading-5 tracking-[0.28px] text-[#1e1e1e]">
                    Forget Password?
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              aria-busy={busy}
              className="flex h-14 w-full cursor-pointer items-center justify-center rounded-[12px] bg-[#f04e1a] text-[16px] leading-6 text-white disabled:cursor-wait"
            >
              {busy ? (
                <>
                  <span className="size-5 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                  <span className="sr-only">Signing in</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <p className="text-center text-[16px] leading-6 text-[#4b4b4b]">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setDirection("forward");
                  setScreen("sign-up");
                }}
                className="cursor-pointer text-[#f04e1a]"
              >
                Sign Up
              </button>
            </p>
          </div>
        </form>
        )}
        </div>
      </main>
      <PanelMotion />
    </div>
  );
}

function SignInPanel() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [meeting, setMeeting] = useState<"in" | "out" | "gone">("in");

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) {
      return;
    }

    const measure = () => {
      const { width, height } = frame.getBoundingClientRect();
      const next = Math.min(width / 740, height / 900);
      setScale(next > 0 ? next : 1);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  function finishWarp(event: AnimationEvent<HTMLDivElement>) {
    if (event.animationName === "sign-in-warp") {
      setMeeting("gone");
    }
  }

  function closeMeeting() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMeeting("gone");
      return;
    }
    setMeeting("out");
  }

  const gathered = meeting !== "in";

  return (
    <div ref={frameRef} data-sign-in-panel className="relative hidden h-full min-h-svh overflow-hidden bg-[#f04e1a] min-[1200px]:block">
      <div className="absolute top-1/2 left-1/2 h-[900px] w-[740px]" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
        <img alt="" src={panelCircle} className="pointer-events-none absolute top-[168px] left-[112px] size-[500px]" />

        {meeting !== "gone" ? (
          <div
            className={`${meeting === "out" ? "sign-in-warp" : "sign-in-pop"} absolute top-[180px] left-[120px] z-20 h-[277px] w-[268px]`}
            style={{ ["--dx" as string]: "-46px", ["--dy" as string]: "-34px", ["--dr" as string]: "-7deg", ["--delay" as string]: "0.22s" }}
            onAnimationEnd={finishWarp}
          >
            <article className="group/card relative size-full">
              <div className="absolute top-[89px] left-0 h-[188px] w-[268px]">
                <div className="relative size-full overflow-hidden rounded-[12px] bg-white shadow-[8px_8px_30px_rgba(0,0,0,0.08)] transition-transform duration-200 ease-out group-hover/card:-translate-y-1.5">
                <div className="pointer-events-none absolute -top-16 -right-14 size-[128px] rounded-full bg-[#f3f5f7]" />
                <div className="absolute top-[14px] left-[21px] flex gap-1.5">
                  <button
                    type="button"
                    aria-label="Close Design Review Meeting"
                    onClick={closeMeeting}
                    className="group grid size-2 cursor-pointer place-items-center rounded-full bg-[#ff5f57] transition-transform duration-150 hover:scale-125"
                  >
                    <span className="text-[7px] leading-none font-bold text-[#9a3412] opacity-0 group-hover:opacity-100">×</span>
                  </button>
                  <span className="size-2 rounded-full bg-[#febc2e]" />
                  <span className="size-2 rounded-full bg-[#28c840]" />
                </div>
                <h2 className="absolute top-[31px] left-5 text-[14px] leading-[22px] font-medium text-[#0e0a0f]">Design Review Meeting</h2>
                <p className="absolute top-[55px] left-5 text-[10px] leading-[14px] font-medium text-[#979797]">Feb 22 at 4pm - 5pm</p>
                <p className="absolute top-[85px] left-5 w-[225px] text-[12px] leading-5 text-[#0e0a0f]">
                  We have a meeting with the client next week to present our progress
                </p>
                <p className="absolute top-[136px] left-5 w-[220px] text-[12px] leading-4 text-[#0e0a0f]">
                  You have been invited to attend a meeting of the Board Directors.
                </p>
                </div>
              </div>
            </article>
          </div>
        ) : null}

        <FloatCard className="z-30" dx="42px" dy="-26px" dr="6deg" delay="0.36s" gathered={gathered} rest={{ top: 291, left: 424 }} together={{ top: 270, left: 290 }}>
          <Notice
            name="Karen"
            body="change project info on Project Homepage"
            date="Aug 10"
            tone="blue"
          />
        </FloatCard>

        <FloatCard className="z-10" dx="30px" dy="42px" dr="4deg" delay="0.48s" gathered={gathered} rest={{ top: 396, left: 378 }} together={{ top: 318, left: 220 }}>
          <div className="h-[182px] w-[254px] rounded-[10px] bg-white px-4 pt-[18px] shadow-[0_30px_75px_rgba(0,0,0,0.09)] transition-transform duration-200 ease-out hover:-translate-y-1.5">
            <p className="font-[Inter,sans-serif] text-[13px] leading-4 font-semibold text-[#0e0a0f]">Task Progress</p>
            <div className="mt-[18px] flex flex-col gap-[14px]">
              {tasks.map((task, index) => (
                <div key={task.label}>
                  <div className="flex items-center justify-between font-[Inter,sans-serif] text-[11px] leading-none text-[#0e0a0f]">
                    <span>{task.label}</span>
                    <span className="text-[8px] opacity-70">{task.value}</span>
                  </div>
                  <div className="relative mt-[7px] h-[5px] rounded-full" style={{ backgroundColor: task.track }}>
                    <span
                      className="sign-in-bar absolute inset-y-0 left-0 rounded-full"
                      style={{ width: task.width, backgroundColor: task.fill, ["--bar-delay" as string]: `${0.72 + index * 0.12}s` }}
                    />
                    {task.knob ? (
                      <span
                        className="sign-in-knob absolute top-1/2 size-[7px] -translate-y-1/2 rounded-full border border-white"
                        style={{ left: `calc(${task.width} - 4px)`, backgroundColor: task.fill }}
                      />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FloatCard>

        <FloatCard className="z-20" dx="-28px" dy="36px" dr="-5deg" delay="0.58s" gathered={gathered} rest={{ top: 499, left: 145 }} together={{ top: 478, left: 198 }}>
          <Notice
            name="Andrea"
            body="change the due date of Project Homepage"
            date="June 05"
            tone="amber"
          />
        </FloatCard>

        <div
          className="sign-in-pop absolute top-[710px] left-[110px] w-[505px] text-white"
          style={{ ["--dx" as string]: "0px", ["--dy" as string]: "22px", ["--dr" as string]: "0deg", ["--delay" as string]: "0.42s" }}
        >
          <p className="text-[36px] leading-[48px] font-bold">Streamline your workflow</p>
          <p className="mt-0.5 w-[440px] text-[18px] leading-7 text-[#eaecf0]">Complete these easy steps to register your account.</p>
        </div>
      </div>
    </div>
  );
}

function FloatCard({
  className,
  dx,
  dy,
  dr,
  delay,
  gathered,
  rest,
  together,
  children,
}: {
  className: string;
  dx: string;
  dy: string;
  dr: string;
  delay: string;
  gathered: boolean;
  rest: { top: number; left: number };
  together: { top: number; left: number };
  children: ReactNode;
}) {
  const place = gathered ? together : rest;

  return (
    <div
      className={`sign-in-pop sign-in-card absolute ${className}`}
      style={{
        top: place.top,
        left: place.left,
        ["--dx" as string]: dx,
        ["--dy" as string]: dy,
        ["--dr" as string]: dr,
        ["--delay" as string]: delay,
      }}
    >
      {children}
    </div>
  );
}

function Notice({ name, body, date, tone }: { name: string; body: string; date: string; tone: "blue" | "amber" }) {
  return (
    <div className="flex h-[66px] w-[164px] gap-2 rounded-[7px] bg-white px-[14px] py-[15px] shadow-[0_4px_40px_rgba(0,0,0,0.08)] transition-transform duration-200 ease-out hover:-translate-y-1">
      <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${tone === "blue" ? "bg-[#3b82f6]" : "bg-[#f5b942]"}`}>
        {tone === "blue" ? (
          <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true">
            <path d="M2 5.6 4.3 8 9 3" fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true">
            <path d="M3 1.8h3.2L8.2 4v5.2H3V1.8Z" fill="none" stroke="white" strokeWidth="1.1" />
            <path d="M6.1 1.8V4H8.2" fill="none" stroke="white" strokeWidth="1.1" />
          </svg>
        )}
      </span>
      <span className="min-w-0">
        <p className="text-[9px] leading-[13px] text-[#0e0a0f]">
          <span className="font-semibold">{name} </span>
          {body}
        </p>
        <p className="mt-1 text-[9px] leading-none text-[#0e0a0f]/50">{date}</p>
      </span>
    </div>
  );
}

function PanelMotion() {
  return (
    <style>{`
      .auth-forward,
      .auth-back {
        animation-duration: 0.46s;
        animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
        animation-fill-mode: both;
      }
      .auth-forward { animation-name: auth-forward; }
      .auth-back { animation-name: auth-back; }
      @keyframes auth-forward {
        from { opacity: 0; transform: translateX(36px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes auth-back {
        from { opacity: 0; transform: translateX(-36px); }
        to { opacity: 1; transform: translateX(0); }
      }
      .sign-in-pop {
        animation: sign-in-enter 1.08s cubic-bezier(0.22, 1, 0.36, 1) both;
        animation-delay: var(--delay, 0.3s);
      }
      .sign-in-card {
        transition: top 0.82s cubic-bezier(0.22, 1, 0.36, 1) 0.08s, left 0.82s cubic-bezier(0.22, 1, 0.36, 1) 0.08s;
      }
      .sign-in-warp {
        transform-origin: 70% 20%;
        animation: sign-in-warp 0.72s cubic-bezier(0.55, 0.05, 0.2, 1) forwards;
      }
      .sign-in-bar {
        transform-origin: left center;
        animation: sign-in-bar 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
        animation-delay: var(--bar-delay, 0.7s);
      }
      @keyframes sign-in-enter {
        0% {
          opacity: 0;
          transform: translate(var(--dx), var(--dy)) rotate(var(--dr)) scale(0.84);
        }
        58% {
          opacity: 1;
          transform: translate(calc(var(--dx) * -0.16), calc(var(--dy) * -0.2)) rotate(calc(var(--dr) * -0.35)) scale(1.035);
        }
        80% {
          transform: translate(calc(var(--dx) * 0.05), 7px) rotate(calc(var(--dr) * 0.12)) scale(0.985);
        }
        100% {
          opacity: 1;
          transform: translate(0, 0) rotate(0deg) scale(1);
        }
      }
      @keyframes sign-in-warp {
        0% {
          opacity: 1;
          filter: blur(0);
          transform: perspective(680px) translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) scale(1);
        }
        32% {
          opacity: 1;
          transform: perspective(680px) translate3d(10px, -14px, 40px) rotateX(14deg) rotateY(-18deg) scale(1.08);
        }
        100% {
          opacity: 0;
          filter: blur(1.5px);
          transform: perspective(680px) translate3d(70px, -48px, -80px) rotateX(34deg) rotateY(26deg) rotateZ(8deg) scale(0.12);
        }
      }
      .sign-in-knob {
        animation: sign-in-knob 0.35s ease both;
        animation-delay: 1.35s;
      }
      @keyframes sign-in-bar {
        from { transform: scaleX(0); }
        to { transform: scaleX(1); }
      }
      @keyframes sign-in-knob {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @media (prefers-reduced-motion: reduce) {
        .auth-forward,
        .auth-back,
        .sign-in-pop,
        .sign-in-warp,
        .sign-in-bar,
        .sign-in-knob {
          animation: none;
        }
        .sign-in-card {
          transition: none;
        }
      }
    `}</style>
  );
}
