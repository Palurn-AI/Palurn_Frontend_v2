import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { type ChangeEvent, type ComponentProps } from "react"
import { DayPicker, getDefaultClassNames, type DayButtonProps, type DayProps, type DropdownProps } from "react-day-picker"
import { cn } from "cn"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu.tsx"

function Calendar({
  className,
  classNames,
  components,
  showOutsideDays = true,
  ...props
}: ComponentProps<typeof DayPicker>) {
  const defaults = getDefaultClassNames()
  const { root, dropdowns, months, month, ...restClassNames } = classNames ?? {}

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        root: cn("w-fit", defaults.root, root),
        months: cn("relative flex flex-col gap-4 sm:flex-row", defaults.months, months),
        month: cn("flex w-full flex-col gap-3", defaults.month, month),
        month_caption: cn("flex h-8 w-full items-center justify-center px-8", defaults.month_caption),
        caption_label: cn("text-[14px] font-medium text-[#35383d]", defaults.caption_label),
        dropdowns: cn("flex w-full items-center justify-center gap-1", defaults.dropdowns, dropdowns),
        nav: cn("pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between", defaults.nav),
        button_previous: cn(
          "pointer-events-auto inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-[#35383d] hover:bg-[#f8f9fa]",
          defaults.button_previous,
        ),
        button_next: cn(
          "pointer-events-auto inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-[#35383d] hover:bg-[#f8f9fa]",
          defaults.button_next,
        ),
        month_grid: cn("w-full border-collapse", defaults.month_grid),
        weekdays: cn("flex w-full", defaults.weekdays),
        weekday: cn("flex-1 text-center text-[12px] font-medium text-[#6b7280]", defaults.weekday),
        week: cn("mt-1 flex w-full", defaults.week),
        day: cn("relative flex h-8 flex-1 items-center justify-center p-0 text-center", defaults.day),
        day_button: cn("inline-flex h-8 w-full items-center justify-center text-[13px]", defaults.day_button),
        outside: cn("text-[#9ca3af]", defaults.outside),
        disabled: cn("pointer-events-none text-[#d1d5db]", defaults.disabled),
        hidden: cn("invisible", defaults.hidden),
        ...restClassNames,
      }}
      components={{
        Chevron: ({ orientation = "left", className: iconClass }) => {
          const Icon = orientation === "left" || orientation === "up" ? ChevronLeft : ChevronRight
          return <Icon className={cn("size-4", orientation === "up" && "-rotate-90", orientation === "down" && "rotate-90", iconClass)} />
        },
        Dropdown: CalendarDropdown,
        Day: CalendarDay,
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDropdown({ options, value, onChange, "aria-label": ariaLabel }: DropdownProps) {
  const choices = (options ?? []).filter((option) => !option.disabled)
  const selected = options?.find((option) => String(option.value) === String(value))

  return (
    <DropdownMenu
      modal={false}
      onOpenChange={(open) => {
        if (!open) return
        requestAnimationFrame(() => {
          const selected = document.querySelector("[data-slot=dropdown-menu-popup] [data-selected=true]")
          const popup = selected?.closest("[data-slot=dropdown-menu-popup]")
          if (!(selected instanceof HTMLElement) || !(popup instanceof HTMLElement)) return
          popup.scrollTop = selected.offsetTop - popup.clientHeight / 2 + selected.clientHeight / 2
        })
      }}
    >
      <DropdownMenuTrigger
        type="button"
        aria-label={ariaLabel}
        className="inline-flex h-8 min-w-0 cursor-pointer items-center gap-1 rounded-md px-1.5 text-[14px] font-medium text-[#35383d] hover:bg-[#f8f9fa]"
      >
        <span className="truncate">{selected?.label}</span>
        <ChevronDown className="size-3.5 shrink-0 text-[#6b7280]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="max-h-56 min-w-28">
        {choices.map((option) => {
          const isSelected = option.value === selected?.value
          return (
            <DropdownMenuItem
              key={option.value}
              data-selected={isSelected ? "true" : undefined}
              className={isSelected ? "bg-[#fff1eb] font-medium" : undefined}
              onClick={() => {
                onChange?.({ target: { value: String(option.value) } } as ChangeEvent<HTMLSelectElement>)
              }}
            >
              {option.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function CalendarDay({ modifiers, className, ...props }: DayProps) {
  const start = Boolean(modifiers.range_start)
  const end = Boolean(modifiers.range_end)
  const middle = Boolean(modifiers.range_middle)

  return (
    <td
      {...props}
      className={cn(
        className,
        middle && "bg-[#ffe4d6]",
        start && "rounded-l-md bg-[#ff541f]",
        end && "rounded-r-md bg-[#ff541f]",
        start && end && "rounded-md",
      )}
    />
  )
}

function CalendarDayButton({ modifiers, className, ...props }: DayButtonProps) {
  const start = Boolean(modifiers.range_start)
  const end = Boolean(modifiers.range_end)
  const middle = Boolean(modifiers.range_middle)
  const single = Boolean(modifiers.selected) && !start && !end && !middle

  return (
    <button
      {...props}
      className={cn(
        "inline-flex h-8 w-full cursor-pointer items-center justify-center text-[13px] text-[#35383d]",
        !modifiers.selected && "hover:bg-[#f8f9fa]",
        modifiers.outside && !middle && !start && !end && "text-[#9ca3af]",
        modifiers.today && !modifiers.selected && "font-semibold text-[#ff541f]",
        middle && "text-[#35383d] hover:bg-[#ffd4c2]",
        (start || end || single) && "text-white hover:bg-[#f04c16]",
        single && "rounded-md bg-[#ff541f]",
        className,
      )}
    />
  )
}

export { Calendar }
