import { type ClipboardEvent, type FormEvent, type KeyboardEvent, useEffect, useRef, useState } from "react";

const length = 6;

export function OtpForm({ onConfirm, pending = false }: { onConfirm: (code: string) => void; pending?: boolean }) {
  const [digits, setDigits] = useState<string[]>(() => Array.from({ length }, () => ""));
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  function write(index: number, raw: string) {
    const clean = raw.replace(/\D/g, "");
    const chunk = clean.slice(0, length - index);
    setDigits((current) => {
      const next = [...current];
      if (!chunk) {
        next[index] = "";
        return next;
      }
      for (let offset = 0; offset < chunk.length; offset += 1) {
        next[index + offset] = chunk[offset] ?? "";
      }
      return next;
    });
    if (!chunk) {
      return;
    }
    const focusAt = Math.min(index + chunk.length, length - 1);
    inputs.current[focusAt]?.focus();
  }

  function onPaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    const text = event.clipboardData.getData("text");
    if (!/\d/.test(text)) {
      return;
    }
    event.preventDefault();
    write(index, text);
  }

  function onKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowLeft" && index > 0) {
      inputs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowRight" && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  }

  function confirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = digits.join("");
    if (code.length < length) {
      const empty = digits.findIndex((digit) => !digit);
      inputs.current[empty]?.focus();
      return;
    }
    onConfirm(code);
  }

  function resend() {
    setDigits(Array.from({ length }, () => ""));
    inputs.current[0]?.focus();
  }

  return (
    <form className="flex w-full max-w-[566px] flex-col gap-14" onSubmit={confirm} noValidate>
      <div className="flex flex-col items-center gap-1.5 text-center">
        <h1 className="w-full text-[24px] leading-10 font-medium">Enter the code</h1>
        <p className="w-full max-w-[396px] text-[16px] leading-6 text-[#4b4b4b]">
          Enter the 6-digit code sent to your phone number to complete verification
        </p>
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="flex w-full max-w-[392px] justify-center gap-3">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(node) => {
                inputs.current[index] = node;
              }}
              value={digit}
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              aria-label={`Digit ${index + 1} of ${length}`}
              maxLength={1}
              onFocus={(event) => event.target.select()}
              onChange={(event) => write(index, event.target.value)}
              onPaste={(event) => onPaste(index, event)}
              onKeyDown={(event) => onKeyDown(index, event)}
              className={`h-14 w-[55.333px] shrink-0 rounded-[5px] border bg-[#fdfdfd] text-center text-[16px] leading-6 text-[#6b6b6b] outline-none transition-colors focus:border-[#009ddc] ${digit ? "border-[#8f929c]" : "border-[#d9d9d9]"}`}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={pending}
          className="flex h-14 w-full cursor-pointer items-center justify-center rounded-[12px] bg-[#f04e1a] text-[16px] leading-6 text-white disabled:cursor-wait"
        >
          Confirm and proceed
        </button>

        <button type="button" onClick={resend} className="cursor-pointer text-[16px] leading-6 font-medium text-[#1e1e1e]">
          Resend Code
        </button>
      </div>
    </form>
  );
}
