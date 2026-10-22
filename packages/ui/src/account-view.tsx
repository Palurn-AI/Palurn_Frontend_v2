import { logAction } from "./log-action.ts";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import type { AccountResponse } from "@palurn/api";

import { reconcileMaskedPassword } from "./auth-fields.tsx";
import closeIcon from "./assets/dashboard/modal-close.svg";
import editIcon from "./assets/settings/edit.svg";
import plusIcon from "./assets/account/plus.svg";
import portrait from "./assets/account/portrait.png";
import shieldIcon from "./assets/account/shield.svg";
import trashIcon from "./assets/account/trash.svg";

const fieldClass =
  "flex h-10 w-full items-center rounded-[6px] border border-[#ececec] px-4 text-[14px] leading-normal font-medium tracking-[0.2px] text-[#1e293b] outline-none";

function accountUsername(fields: { label: string }[], values: string[], fallback: string) {
  const read = (label: string) => values[fields.findIndex((field) => field.label === label)]?.trim() ?? "";
  return `${read("First Name")} ${read("Last Name")}`.trim() || fallback;
}

function initialsFor(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

type AccountModal = "password" | "delete";

export function AccountView({ data, onLogout }: { data: AccountResponse; onLogout: () => void }) {
  const [editing, setEditing] = useState(false);
  const [personal, setPersonal] = useState(data.personal.map((field) => field.value));
  const [photo, setPhoto] = useState<string | null>(portrait);
  const [modal, setModal] = useState<AccountModal | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const username = accountUsername(data.personal, personal, data.name);

  function editProfile() {
    if (editing) {
      logAction("Save profile", personal);
      setEditing(false);
      return;
    }
    setEditing(true);
    logAction("Edit profile");
  }

  function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhoto(url);
    logAction("Change account image", file.name);
  }

  return (
    <div className="bg-[#f8f9fa] px-4 pt-4 pb-6 sm:px-6">
      <div className="flex h-[66px] items-center justify-between gap-3 pr-3 pl-6 pt-1">
        <h1 className="text-[20px] leading-8 font-semibold text-[#16151c]">{data.title}</h1>
        <button
          type="button"
          onClick={editProfile}
          className="inline-flex h-[38px] shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[5px] bg-[#f04e1a] px-4 text-[14px] leading-6 font-medium text-white"
        >
          <img alt="" src={editIcon} className="size-3.5" />
          {data.editLabel}
        </button>
      </div>

      <div className="rounded-[8px] border border-[#eaecf0] bg-white px-6 py-8 sm:px-[61px]">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          {photo ? (
            <img alt="" src={photo} className="size-[100px] shrink-0 rounded-full border border-[#cfcccc] object-cover" />
          ) : (
            <span
              role="img"
              aria-label={username}
              className="flex size-[100px] shrink-0 items-center justify-center rounded-full border border-[#cfcccc] bg-[#ff541f] text-[32px] leading-none font-semibold tracking-[0.4px] text-white"
            >
              {initialsFor(username)}
            </span>
          )}
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex h-[38px] w-[132px] cursor-pointer items-center justify-center gap-0.5 rounded-[4px] bg-[#f04e1a] px-2 text-[14px] text-white"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <img alt="" src={plusIcon} className="size-4" />
                Change Image
              </button>
              <button
                type="button"
                onClick={() => {
                  setPhoto(null);
                  logAction("Remove account image");
                }}
                className="inline-flex h-[38px] w-[120px] cursor-pointer items-center justify-center rounded-[5px] bg-[#f6f8fa] text-[14px] leading-6 font-medium text-[#373b47]"
              >
                Remove Image
              </button>
              <input ref={fileRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={choosePhoto} />
            </div>
            <p className="mt-3 text-[16px] leading-normal text-[#56575a]">we support PNGs, JPEGs and JPG under 2mb</p>
          </div>
        </div>

        <h2 className="mt-8 text-[16px] leading-normal font-medium text-black">{data.personalTitle}</h2>
        <div className="mt-5 grid max-w-[793px] grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          {data.personal.map((field, index) => (
            <label key={field.label} className="block">
              <span className="mb-2.5 block text-[14px] leading-normal text-[#56575a]">{field.label}</span>
              {editing ? (
                <input
                  value={personal[index] ?? ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    setPersonal((current) => current.map((item, itemIndex) => (itemIndex === index ? value : item)));
                  }}
                  className={`${fieldClass} bg-white`}
                />
              ) : (
                <span className={fieldClass}>{personal[index]}</span>
              )}
            </label>
          ))}
        </div>

        <h2 className="mt-8 text-[16px] leading-normal font-medium text-black">Security</h2>
        <div className="mt-4 flex max-w-[793px] flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <label className="w-full max-w-[380px]">
            <span className="mb-2.5 block text-[14px] leading-normal text-[#56575a]">Password</span>
            <span className={`${fieldClass} text-[20px] tracking-[0.2px]`}>**********</span>
          </label>
          <button
            type="button"
            onClick={() => setModal("password")}
            className="inline-flex h-[38px] w-[150px] shrink-0 cursor-pointer items-center justify-center rounded-[5px] bg-[#f6f8fa] text-[14px] leading-6 font-medium text-[#373b47]"
          >
            Change password
          </button>
        </div>

        <div className="mt-8 flex max-w-[793px] flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="max-w-[511px]">
            <p className="text-[16px] leading-normal font-medium text-[#35383d]">Log out</p>
            <p className="mt-1.5 text-[14px] leading-normal text-[#56575a]">Sign out of your account. You can log back in anytime.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              logAction("Log out from account");
              onLogout();
            }}
            className="inline-flex h-[38px] w-[120px] shrink-0 cursor-pointer items-center justify-center rounded-[5px] bg-[#f6f8fa] text-[14px] leading-6 font-medium text-[#373b47]"
          >
            Log out
          </button>
        </div>

        <div className="mt-8 flex max-w-[793px] flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="max-w-[511px]">
            <p className="text-[16px] leading-normal font-medium text-[#35383d]">Delete account</p>
            <p className="mt-1.5 text-[14px] leading-normal text-[#56575a]">
              Your profile and data will be permanently erased. You won’t be able to recover them.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModal("delete")}
            className="inline-flex h-[38px] w-[136px] shrink-0 cursor-pointer items-center justify-center rounded-[5px] bg-[#f6f8fa] text-[14px] leading-6 font-medium text-[#373b47]"
          >
            Delete account
          </button>
        </div>
      </div>

      <AccountDialogs modal={modal} onClose={() => setModal(null)} onDelete={onLogout} />
    </div>
  );
}

function AccountDialogs({ modal, onClose, onDelete }: { modal: AccountModal | null; onClose: () => void; onDelete: () => void }) {
  const [rendered, setRendered] = useState<AccountModal | null>(modal);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!modal) {
      setOpen(false);
      return;
    }
    setRendered(modal);
    setOpen(true);
  }, [modal]);

  useEffect(() => {
    if (modal || !rendered) return;
    const timer = window.setTimeout(() => setRendered(null), 200);
    return () => window.clearTimeout(timer);
  }, [modal, rendered]);

  useEffect(() => {
    if (!rendered || !open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [rendered, open, onClose]);

  if (!rendered) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${open ? "" : "pointer-events-none"}`}>
      <div
        className={`absolute inset-0 bg-black/40 ${open ? "palurn-overlay-in" : "palurn-overlay-out"}`}
        onMouseDown={() => {
          if (open) onClose();
        }}
      />
      <div
        key={rendered}
        className={`relative w-full max-w-[400px] ${open ? "palurn-modal-in" : "palurn-modal-out"}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {rendered === "password" ? <PasswordDialog onClose={onClose} /> : <DeleteDialog onClose={onClose} onDelete={onDelete} />}
      </div>
    </div>
  );
}

function PasswordDialog({ onClose }: { onClose: () => void }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    logAction("Save password");
    onClose();
  }

  return (
    <form
      className="rounded-[16px] bg-white shadow-[0_20px_24px_-4px_rgba(10,13,18,0.1),0_8px_8px_-4px_rgba(10,13,18,0.04)]"
      onSubmit={save}
    >
      <div className="relative px-6 pt-6 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full border-8 border-[rgba(255,84,31,0.02)] bg-[rgba(255,84,31,0.05)]">
          <img alt="" src={shieldIcon} className="size-6" />
        </span>
        <h2 className="mt-4 text-[18px] leading-7 font-semibold text-[#181d27]">Please enter your password</h2>
        <p className="mt-1 text-[14px] leading-5 text-[#535862]">Enter your password to make this change.</p>
        <button type="button" aria-label="Close" onClick={onClose} className="absolute top-4 right-4 cursor-pointer rounded-[8px] p-2.5">
          <img alt="" src={closeIcon} className="size-6" />
        </button>
      </div>
      <div className="mt-5 flex flex-col gap-4 px-6">
        <MaskedField label="Password" name="password" value={password} onChange={setPassword} />
        <MaskedField label="Confirm Password" name="confirm-password" value={confirm} onChange={setConfirm} />
      </div>
      <div className="flex justify-end gap-3 px-6 py-6">
        <button type="button" onClick={onClose} className="h-[38px] w-[100px] cursor-pointer rounded-[5px] bg-[#f6f8fa] text-[14px] leading-6 font-medium text-[#373b47]">
          Cancel
        </button>
        <button type="submit" className="h-[38px] w-[100px] cursor-pointer rounded-[5px] bg-[#f04e1a] text-[14px] leading-6 font-medium text-white">
          Save
        </button>
      </div>
    </form>
  );
}

function MaskedField({ label, name, value, onChange }: { label: string; name: string; value: string; onChange: (value: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  function update(event: ChangeEvent<HTMLInputElement>) {
    const cursor = event.target.selectionStart ?? event.target.value.length;
    const next = reconcileMaskedPassword(value, event.target.value);
    onChange(next.value);
    const place = Math.min(next.cursor, cursor);
    requestAnimationFrame(() => inputRef.current?.setSelectionRange(place, place));
  }

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[14px] leading-5 font-medium text-[#414651]">{label}</span>
      <input
        ref={inputRef}
        type="text"
        name={name}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        value={value ? "*".repeat(value.length) : ""}
        placeholder="••••••••"
        onChange={update}
        className="h-11 rounded-[8px] border border-[#d5d7da] bg-white px-3.5 font-[Inter,sans-serif] text-[16px] leading-6 text-[#181d27] shadow-[0_1px_2px_rgba(10,13,18,0.05)] outline-none placeholder:text-[#717680] placeholder:tracking-[2px]"
      />
    </label>
  );
}

function DeleteDialog({ onClose, onDelete }: { onClose: () => void; onDelete: () => void }) {
  return (
    <div className="rounded-[16px] bg-white shadow-[0_20px_24px_-4px_rgba(10,13,18,0.1),0_8px_8px_-4px_rgba(10,13,18,0.04)]">
      <div className="relative px-6 pt-6">
        <span className="flex size-12 items-center justify-center rounded-full border-8 border-[#fef3f2] bg-[#fee4e2]">
          <img alt="" src={trashIcon} className="size-6" />
        </span>
        <h2 className="mt-4 text-[16px] leading-7 font-semibold text-[#181d27]">Delete account</h2>
        <p className="mt-1 text-[14px] leading-6 text-[#535862]">Are you sure you want to delete this account? This action cannot be undone.</p>
        <button type="button" aria-label="Close" onClick={onClose} className="absolute top-4 right-4 cursor-pointer rounded-[8px] p-2.5">
          <img alt="" src={closeIcon} className="size-6" />
        </button>
      </div>
      <div className="flex justify-end gap-3 px-6 py-6">
        <button type="button" onClick={onClose} className="h-[38px] w-[100px] cursor-pointer rounded-[5px] bg-[#f6f8fa] text-[14px] leading-6 font-medium text-[#373b47]">
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            logAction("Delete account");
            onDelete();
          }}
          className="h-[38px] w-[100px] cursor-pointer rounded-[5px] bg-[#e70d0d] text-[14px] leading-6 font-medium text-white"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
