import { Eye, EyeOff } from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";

import alertIcon from "./assets/sign-in/alert.svg";

export const authFieldClassName =
  "h-14 w-full rounded-[5px] border border-[#f2f3f5] bg-[#fdfdfd] px-5 text-[14px] leading-6 text-[#35383d] outline-none transition-colors placeholder:text-[14px] placeholder:tracking-normal placeholder:text-[#6b6b6b] focus:border-[#009ddc] aria-invalid:border-[#e70d0d] aria-invalid:focus:border-[#e70d0d]";

export function reconcileMaskedPassword(current: string, nextDisplay: string) {
  let start = 0;
  const max = Math.min(current.length, nextDisplay.length);
  while (start < max && nextDisplay[start] === "*") {
    start += 1;
  }

  let endCurrent = current.length;
  let endNext = nextDisplay.length;
  while (endCurrent > start && endNext > start && nextDisplay[endNext - 1] === "*") {
    endCurrent -= 1;
    endNext -= 1;
  }

  const inserted = nextDisplay.slice(start, endNext);
  return {
    value: current.slice(0, start) + inserted + current.slice(endCurrent),
    cursor: start + inserted.length,
  };
}

export function PasswordField({
  name,
  value,
  onChange,
  placeholder,
  invalid = false,
  autoComplete = "current-password",
  describedBy,
}: {
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  invalid?: boolean;
  autoComplete?: string;
  describedBy?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [visible, setVisible] = useState(false);
  const masked = !visible && value.length > 0;

  function update(event: ChangeEvent<HTMLInputElement>) {
    if (visible) {
      onChange(event.target.value);
      return;
    }

    const cursor = event.target.selectionStart ?? event.target.value.length;
    const next = reconcileMaskedPassword(value, event.target.value);
    onChange(next.value);
    const place = Math.min(next.cursor, cursor);
    requestAnimationFrame(() => {
      inputRef.current?.setSelectionRange(place, place);
    });
  }

  return (
    <span className="relative block">
      <input
        ref={inputRef}
        type="text"
        name={name}
        autoComplete={autoComplete}
        autoCapitalize="off"
        spellCheck={false}
        value={visible ? value : "*".repeat(value.length)}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onChange={update}
        style={
          masked
            ? {
                fontSize: "24px",
                lineHeight: "24px",
                letterSpacing: "2.88px",
                paddingTop: "17px",
                paddingBottom: "11px",
              }
            : undefined
        }
        className={`${authFieldClassName} ${invalid ? "pr-[72px]" : "pr-12"} ${masked ? "text-[24px] text-[#35383d]" : ""}`}
      />
      <span className="absolute top-1/2 right-5 flex -translate-y-1/2 items-center gap-2">
        {invalid ? <img alt="" src={alertIcon} className="size-4" /> : null}
        <button
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible((current) => !current)}
          className="grid size-4 cursor-pointer place-items-center text-[#6b6b6b]"
        >
          {visible ? <EyeOff size={16} strokeWidth={1.75} /> : <Eye size={16} strokeWidth={1.75} />}
        </button>
      </span>
    </span>
  );
}
