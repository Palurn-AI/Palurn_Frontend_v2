import { logAction } from "./log-action.ts";
import { useState, type ReactNode } from "react";

import { OptionMenu } from "./components/dropdown-menu.tsx";
import type { SettingsConsent, SettingsResponse, SettingsSectionId } from "@palurn/api";

import { Switch } from "./components/switch.tsx";
import chevronDownIcon from "./assets/settings/chevron-down.svg";
import warningIcon from "./assets/settings/warning-circle.svg";

const fieldClass =
  "w-full max-w-[500px] rounded-[6px] border border-[#d0d7de] bg-[#f6f8fa] px-3 text-[14px] leading-5 font-medium text-[#24292f] shadow-[inset_0_1px_0_rgba(208,215,222,0.2)] outline-none";

export function SettingsView({ data }: { data: SettingsResponse }) {
  const [section, setSection] = useState<SettingsSectionId>("company");
  const [name, setName] = useState(data.company.name);
  const [email, setEmail] = useState(data.company.email);
  const [timezone, setTimezone] = useState(data.company.timezone);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(data.company.location);
  const [autoJoin, setAutoJoin] = useState(data.calendar.autoJoin);
  const [consent, setConsent] = useState<SettingsConsent[]>(data.calendar.options);
  const [frequency, setFrequency] = useState(data.report.frequency);

  function openSection(id: SettingsSectionId) {
    setSection(id);
    logAction("Open settings section", id);
  }

  function updateProfile() {
    logAction("Update profile", { name, email, timezone, description, location });
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#fafafa] px-4 pt-4 pb-6 sm:px-6">
      <div className="flex max-h-full min-h-0 flex-1 flex-col overflow-hidden rounded-[12px] border border-[#e5e7eb] bg-white">
        <div className="flex shrink-0 items-center px-4 pt-4 sm:px-6">
          <h1 className="text-[20px] leading-8 font-semibold text-[#16151c]">{data.title}</h1>
        </div>
        <div className="mt-4 grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] overflow-hidden border-t border-[#e5e7eb] lg:grid-cols-[220px_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)]">
          <nav className="flex gap-x-6 gap-y-3 overflow-x-auto border-b border-[#e5e7eb] px-4 py-4 lg:min-h-0 lg:flex-col lg:gap-10 lg:overflow-y-auto lg:border-r lg:border-b-0 lg:px-6 lg:py-7">
            {data.nav.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`w-fit shrink-0 cursor-pointer text-left text-[16px] leading-normal whitespace-nowrap ${section === item.id ? "text-[#f04e1a]" : "text-[#35383d] hover:text-[#f04e1a]"}`}
                onClick={() => openSection(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="min-h-0 min-w-0 overflow-y-auto px-4 py-5 sm:px-6">
            {section === "company" ? (
              <CompanyPanel
                data={data}
                name={name}
                email={email}
                timezone={timezone}
                description={description}
                location={location}
                onName={setName}
                onEmail={setEmail}
                onTimezone={(value) => {
                  setTimezone(value);
                  logAction("Change time zone", value);
                }}
                onDescription={setDescription}
                onLocation={setLocation}
                onUpdate={updateProfile}
              />
            ) : null}
            {section === "subscription" ? <SubscriptionPanel data={data} /> : null}
            {section === "calendar" ? (
              <CalendarPanel
                data={data}
                autoJoin={autoJoin}
                consent={consent}
                onAutoJoin={(next) => {
                  setAutoJoin(next);
                  logAction("Toggle auto-join meetings", next);
                }}
                onConsent={(id, next) => {
                  setConsent((current) => current.map((item) => (item.id === id ? { ...item, enabled: next } : item)));
                  logAction("Toggle recording consent", { id, enabled: next });
                }}
              />
            ) : null}
            {section === "report" ? (
              <ReportPanel
                data={data}
                frequency={frequency}
                onFrequency={(value) => {
                  setFrequency(value);
                  logAction("Change report frequency", value);
                }}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function UpdateButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-[38px] w-fit shrink-0 cursor-pointer items-center justify-center rounded-[5px] bg-[#f04e1a] px-4 text-[14px] leading-6 font-medium text-white hover:bg-[#e44512]"
    >
      {label}
    </button>
  );
}

function SectionTitle({ children }: { children: string }) {
  return <h2 className="border-b border-[#d8dee4] pb-[9px] text-[16px] leading-9 font-semibold text-[#24292f]">{children}</h2>;
}

function FieldLabel({ children }: { children: string }) {
  return <span className="mb-2 block text-[14px] leading-[21px] font-medium text-[#4b5563]">{children}</span>;
}

function Hint({ children }: { children: ReactNode }) {
  return <span className="mt-2 block max-w-[500px] text-[12px] leading-5 text-[#57606a]">{children}</span>;
}

function CompanyPanel({
  data,
  name,
  email,
  timezone,
  description,
  location,
  onName,
  onEmail,
  onTimezone,
  onDescription,
  onLocation,
  onUpdate,
}: {
  data: SettingsResponse;
  name: string;
  email: string;
  timezone: string;
  description: string;
  location: string;
  onName: (value: string) => void;
  onEmail: (value: string) => void;
  onTimezone: (value: string) => void;
  onDescription: (value: string) => void;
  onLocation: (value: string) => void;
  onUpdate: () => void;
}) {
  const company = data.company;
  return (
    <div>
      <SectionTitle>{company.title}</SectionTitle>
      <div className="mt-4 flex flex-col gap-5">
        <label>
          <FieldLabel>{company.nameLabel}</FieldLabel>
          <input className={`${fieldClass} h-[42px]`} value={name} onChange={(event) => onName(event.target.value)} />
        </label>
        <label>
          <FieldLabel>{company.emailLabel}</FieldLabel>
          <input className={`${fieldClass} h-[42px]`} value={email} onChange={(event) => onEmail(event.target.value)} />
        </label>
        <div>
          <FieldLabel>{company.timezoneLabel}</FieldLabel>
          <FieldSelect label={company.timezoneLabel} value={timezone} options={company.timezones} onChange={onTimezone} />
          <Hint>{company.timezoneHint}</Hint>
        </div>
        <label>
          <FieldLabel>{company.descriptionLabel}</FieldLabel>
          <textarea
            className={`${fieldClass} h-[75px] resize-none py-2 placeholder:font-normal placeholder:text-[#6e7781]`}
            placeholder={company.descriptionPlaceholder}
            value={description}
            onChange={(event) => onDescription(event.target.value)}
          />
        </label>
        <label>
          <FieldLabel>{company.locationLabel}</FieldLabel>
          <input className={`${fieldClass} h-[42px]`} value={location} onChange={(event) => onLocation(event.target.value)} />
        </label>
        <UpdateButton label={data.updateLabel} onClick={onUpdate} />
      </div>
    </div>
  );
}

function SubscriptionPanel({ data }: { data: SettingsResponse }) {
  const plan = data.subscription;
  return (
    <div>
      <SectionTitle>{plan.title}</SectionTitle>
      <div className="mt-5 flex flex-col gap-4">
        <p className="text-[16px] leading-7 font-medium text-black">{plan.overview}</p>
        <p className="text-[14px] leading-5">
          <span className="font-semibold text-black">{plan.usersLabel}</span>{" "}
          <span className="text-[#6b7280]">{plan.usersValue}</span>
        </p>
        <div className="h-2 overflow-hidden rounded-full bg-[rgba(0,0,0,0.04)]">
          <div className="flex h-full w-[72.3%] gap-2">
            {Array.from({ length: 7 }, (_, index) => (
              <span key={index} className="h-full min-w-0 flex-1 rounded-full bg-[#009ddc]" />
            ))}
          </div>
        </div>
        <p className="border-b border-[rgba(0,0,0,0.1)] pb-4 text-[14px] leading-5 text-[#6b7280]">{plan.remaining}</p>
        <div className="border-b border-[rgba(0,0,0,0.1)] pb-4">
          <p className="text-[16px] leading-5 font-semibold text-black">{plan.activeTitle}</p>
          <p className="mt-1 text-[14px] leading-5 text-[#6b7280]">{plan.activeDetail}</p>
        </div>
        <div>
          <p className="text-[16px] leading-5 font-semibold text-black">{plan.priceTitle}</p>
          <p className="mt-1 text-[14px] leading-5 text-[#6b7280]">{plan.priceDetail}</p>
        </div>
        <div className="flex items-start gap-2 rounded-[16px] bg-[#f6f8fa] p-4">
          <img alt="" src={warningIcon} className="mt-0.5 size-5 shrink-0" />
          <div>
            <p className="text-[14px] leading-5 font-medium text-black">{plan.alertTitle}</p>
            <p className="text-[12px] leading-4 text-[#6b7280]" style={{ fontFamily: "Inter, sans-serif" }}>
              {plan.alertLead}
              <button
                type="button"
                className="cursor-pointer text-[#ff541f]"
                onClick={() => logAction("Add payment method")}
              >
                {plan.alertLink}
              </button>
              {plan.alertTrail}
            </p>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-3">
          <button
            type="button"
            className="h-[38px] w-[150px] cursor-pointer rounded-[5px] bg-[#f6f8fa] text-[14px] leading-6 font-medium text-[#373b47]"
            onClick={() => logAction("Cancel subscription")}
          >
            {plan.cancelLabel}
          </button>
          <button
            type="button"
            className="h-[38px] w-[150px] cursor-pointer rounded-[5px] bg-[#f04e1a] text-[14px] leading-6 font-medium text-white"
            onClick={() => logAction("Change subscription")}
          >
            {plan.upgradeLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function CalendarPanel({
  data,
  autoJoin,
  consent,
  onAutoJoin,
  onConsent,
}: {
  data: SettingsResponse;
  autoJoin: boolean;
  consent: SettingsConsent[];
  onAutoJoin: (next: boolean) => void;
  onConsent: (id: string, next: boolean) => void;
}) {
  const calendar = data.calendar;
  return (
    <div>
      <SectionTitle>{calendar.title}</SectionTitle>
      <div className="mt-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[16px] leading-7 font-semibold text-[#101828]">{calendar.autoJoinTitle}</p>
            <p className="text-[14px] leading-[21px] text-[#6b7280]">{calendar.autoJoinDetail}</p>
          </div>
          <Toggle label={calendar.autoJoinTitle} checked={autoJoin} onChange={onAutoJoin} />
        </div>
        <div>
          <p className="text-[16px] leading-7 font-semibold text-[#101828]">{calendar.consentTitle}</p>
          <p className="max-w-[649px] text-[14px] leading-[21px] text-[#6b7280]">{calendar.consentDetail}</p>
        </div>
        {consent.map((option) => (
          <div key={option.id} className="flex items-center justify-between gap-4">
            <p className="text-[16px] leading-7 font-medium text-[#101828]">{option.label}</p>
            <Toggle
              label={option.label}
              checked={option.enabled}
              onChange={(next) => onConsent(option.id, next)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportPanel({
  data,
  frequency,
  onFrequency,
}: {
  data: SettingsResponse;
  frequency: string;
  onFrequency: (value: string) => void;
}) {
  const report = data.report;
  return (
    <div>
      <SectionTitle>{report.title}</SectionTitle>
      <div className="mt-4">
        <p className="text-[16px] leading-7 font-medium tracking-[-0.24px] text-[#101828]">{report.weeklyLabel}</p>
        <div className="mt-2">
          <FieldSelect label={report.weeklyLabel} value={frequency} options={report.frequencies} onChange={onFrequency} />
          <Hint>{report.hint}</Hint>
        </div>
      </div>
    </div>
  );
}

function Toggle({ checked, label, onChange }: { checked: boolean; label: string; onChange: (next: boolean) => void }) {
  return (
    <Switch
      checked={checked}
      aria-label={label}
      onCheckedChange={onChange}
      className="shrink-0 cursor-pointer p-px data-[size=default]:h-[19px] data-[size=default]:w-[37px] data-checked:bg-[#f04e1a] data-unchecked:bg-[#d9d9d9] dark:data-checked:bg-[#f04e1a] dark:data-unchecked:bg-[#d9d9d9] [&_[data-slot=switch-thumb]]:size-[17px] [&_[data-slot=switch-thumb]]:bg-[#fcfcfd] [&_[data-slot=switch-thumb]]:data-checked:translate-x-[17px]! [&_[data-slot=switch-thumb]]:dark:data-checked:bg-[#fcfcfd] [&_[data-slot=switch-thumb]]:dark:data-unchecked:bg-[#fcfcfd]"
    />
  );
}

function FieldSelect({
  value,
  options,
  label,
  onChange,
}: {
  value: string;
  options: string[];
  label: string;
  onChange: (value: string) => void;
}) {
  return (
    <OptionMenu
      options={options}
      value={value}
      onSelect={onChange}
      align="start"
      itemClassName="text-[14px] leading-5"
      menuClassName="rounded-[6px] border-[#d0d7de]"
      className={`${fieldClass} flex h-[42px] cursor-pointer items-center text-left tracking-[0.28px]`}
    >
      <span className="sr-only">{label}</span>
      <span className="min-w-0 flex-1 truncate">{value}</span>
      <img alt="" src={chevronDownIcon} className="size-4 shrink-0" />
    </OptionMenu>
  );
}
