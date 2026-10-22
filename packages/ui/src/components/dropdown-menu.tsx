import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { cn } from "cn"
import type { ReactNode } from "react"

function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

function DropdownMenuContent({
  className,
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  children,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-[80] outline-none"
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-popup"
          className={cn(
            "max-h-(--available-height) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-[5px] border border-[#e5e7eb] bg-white p-1 text-[#111827] shadow-[0_8px_24px_rgba(15,23,42,0.12)] outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className,
          )}
          {...props}
        >
          {children}
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

function DropdownMenuItem({ className, ...props }: MenuPrimitive.Item.Props) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      className={cn(
        "flex cursor-pointer items-center rounded-[4px] px-3 py-1.5 text-left text-[12px] leading-4 whitespace-nowrap text-[#111827] outline-none select-none data-highlighted:bg-[#f8f9fa]",
        className,
      )}
      {...props}
    />
  )
}

function OptionMenu({
  options,
  value,
  name,
  label,
  onSelect,
  align = "end",
  className,
  menuClassName,
  itemClassName,
  children,
}: {
  options: readonly string[]
  value?: string
  name?: string
  label?: string
  onSelect: (value: string) => void
  align?: "start" | "center" | "end"
  className?: string
  menuClassName?: string
  itemClassName?: string
  children: ReactNode
}) {
  return (
    <>
      {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger id={name} type="button" aria-label={label} className={className}>
          {children}
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align} className={cn("min-w-(--anchor-width)", menuClassName)}>
          {options.map((option) => (
            <DropdownMenuItem key={option} className={itemClassName} onClick={() => onSelect(option)}>
              {option}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, OptionMenu }
