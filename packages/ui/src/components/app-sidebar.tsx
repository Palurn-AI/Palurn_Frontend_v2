import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Link } from "react-router";
import { cn } from "cn";

import favicon from "../assets/sidebar/favicon.svg";
import analyticsIcon from "../assets/sidebar/brand-google-analytics.svg";
import tasksIcon from "../assets/sidebar/file-check.svg";
import projectsIcon from "../assets/sidebar/file-settings.svg";
import dashboardIcon from "../assets/sidebar/layout-grid.svg";
import logoutIcon from "../assets/sidebar/logout.svg";
import integrationIcon from "../assets/sidebar/plug-connected.svg";
import settingsIcon from "../assets/sidebar/settings.svg";
import accountIcon from "../assets/sidebar/user.svg";
import teamIcon from "../assets/sidebar/users-group.svg";
import meetingsIcon from "../assets/sidebar/video.svg";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "./sidebar.tsx";
import { logAction } from "../log-action.ts";
import { TooltipProvider } from "./tooltip.tsx";

export const sidebarIcons = {
  dashboard: dashboardIcon,
  meetings: meetingsIcon,
  tasks: tasksIcon,
  projects: projectsIcon,
  team: teamIcon,
  integration: integrationIcon,
  report: analyticsIcon,
  settings: settingsIcon,
  account: accountIcon,
  logout: logoutIcon,
} as const;

export type SidebarIconName = keyof typeof sidebarIcons;

export type SidebarItem = {
  id: SidebarIconName;
  label: string;
};

export const defaultSidebarItems: SidebarItem[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "meetings", label: "Meetings" },
  { id: "tasks", label: "Tasks" },
  { id: "projects", label: "Projects" },
  { id: "integration", label: "Integration" },
  { id: "report", label: "Report" },
  { id: "settings", label: "Settings" },
  { id: "account", label: "Account" },
];

export const defaultSidebarFooter: SidebarItem = {
  id: "logout",
  label: "Log out",
};

const WIDTH_MS = 300;
const SLIDE_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

type PillTone = "idle" | "hover" | "press";

const navButtonClass =
  "relative z-1 h-10! w-[226px]! shrink-0! cursor-pointer! justify-start! gap-2! rounded-[6px]! bg-transparent! py-2! pr-2! pl-3! text-base! leading-6! font-normal! text-[#35383d]! shadow-none! transition-[width,gap,padding] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] delay-0! hover:bg-[#f4f5f7]! hover:text-[#35383d]! focus-visible:ring-0! active:bg-[#eceef2]! active:text-[#35383d]! data-active:bg-transparent! data-active:font-normal! data-active:text-[#35383d]! data-active:hover:bg-transparent! data-active:hover:text-[#35383d]! data-active:active:bg-transparent! data-active:active:text-[#35383d]! group-data-[collapsible=icon]:w-10! group-data-[collapsible=icon]:justify-center! group-data-[collapsible=icon]:gap-0! group-data-[collapsible=icon]:px-0! motion-reduce:transition-none!";

const inkClass =
  "nav-active-ink pointer-events-none absolute inset-0 z-2 flex items-center justify-start gap-2 rounded-[6px] py-2 pr-2 pl-3 text-base leading-6 font-normal text-white group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0";

const footerButtonClass =
  "relative z-1 h-10! w-[226px]! shrink-0! cursor-pointer! justify-start! gap-2! rounded-[6px]! bg-transparent! py-2! pr-2! pl-3! text-base! leading-6! font-normal! text-black! shadow-none! transition-[width,gap,padding] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#f4f5f7]! hover:text-black! focus-visible:ring-0! active:bg-[#eceef2]! active:text-black! group-data-[collapsible=icon]:w-10! group-data-[collapsible=icon]:justify-center! group-data-[collapsible=icon]:gap-0! group-data-[collapsible=icon]:px-0! motion-reduce:transition-none!";

type AppSidebarProps = {
  brand?: string;
  items: SidebarItem[];
  footer?: SidebarItem;
  activeId?: string;
  defaultActiveId?: string;
  onActiveChange?: (id: SidebarIconName) => void;
  onLogout?: () => void;
  children?: ReactNode;
};

function SidebarGlyph({ src, color }: { src: string; color: string }) {
  return (
    <span
      aria-hidden
      className="relative z-1 inline-block size-6 shrink-0"
      style={{
        backgroundColor: color,
        WebkitMaskImage: `url("${src}")`,
        maskImage: `url("${src}")`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "24px 24px",
        maskSize: "24px 24px",
      }}
    />
  );
}

function ItemLabel({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <span className={cn("relative z-1 max-w-48 overflow-hidden text-left whitespace-nowrap opacity-100 transition-[max-width,opacity] delay-0 duration-100 ease-out group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0 motion-reduce:transition-none motion-reduce:delay-0", light ? "text-white!" : "text-[#35383d]")}>
      {children}
    </span>
  );
}

function placeIndicator(list: HTMLElement, indicator: HTMLElement, animate: boolean) {
  const active = list.querySelector<HTMLElement>("[data-nav-active='true']");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const slide = animate && !reduce;
  const move = `320ms ${SLIDE_EASING} 0ms`;
  const listRect = list.getBoundingClientRect();

  if (slide) {
    indicator.style.transition = `top ${move}, left ${move}, width ${move}, height ${move}, background-color 150ms ease 0ms`;
    list.style.transition = `--nav-pill-top ${move}, --nav-pill-height ${move}`;
    void indicator.offsetHeight;
    void list.offsetHeight;
  } else {
    indicator.style.transition = "background-color 150ms ease 0ms";
    list.style.transition = "none";
  }

  list.querySelectorAll<HTMLElement>("[data-nav-ink]").forEach((ink) => {
    const inkRect = ink.getBoundingClientRect();
    ink.style.setProperty("--item-top", `${inkRect.top - listRect.top}px`);
    ink.style.setProperty("--item-bottom", `${inkRect.bottom - listRect.top}px`);
  });

  if (!active) {
    indicator.style.opacity = "0";
    return;
  }

  const rect = active.getBoundingClientRect();
  const top = rect.top - listRect.top;
  indicator.style.opacity = "1";
  indicator.style.top = `${top}px`;
  indicator.style.left = `${rect.left - listRect.left}px`;
  indicator.style.width = `${rect.width}px`;
  indicator.style.height = `${rect.height}px`;
  list.style.setProperty("--nav-pill-top", `${top}px`);
  list.style.setProperty("--nav-pill-height", `${rect.height}px`);
}

export function AppSidebar(props: AppSidebarProps) {
  return (
    <TooltipProvider delay={200}>
      <SidebarProvider
        className="h-svh font-sans antialiased"
        style={
          {
            "--sidebar-width": "252px",
            "--sidebar-width-icon": "76px",
          } as CSSProperties
        }
      >
        <SidebarFrame {...props} />
      </SidebarProvider>
    </TooltipProvider>
  );
}

function SidebarFrame({
  brand = "PalurnAI",
  items,
  footer = defaultSidebarFooter,
  activeId,
  defaultActiveId,
  onActiveChange,
  onLogout,
  children,
}: AppSidebarProps) {
  const { state, isMobile, openMobile, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const [uncontrolledId, setUncontrolledId] = useState(
    defaultActiveId ?? items[0]?.id ?? "dashboard",
  );
  const [tone, setTone] = useState<PillTone>("idle");
  const currentId = activeId ?? uncontrolledId;
  const itemKey = items.map((item) => item.id).join("|");
  const listRef = useRef<HTMLUListElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const currentIdRef = useRef(currentId);
  const collapsedRef = useRef(collapsed);

  useLayoutEffect(() => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) {
      return;
    }

    const idChanged = currentIdRef.current !== currentId;
    const collapseChanged = collapsedRef.current !== collapsed;
    const sliding = idChanged && !collapseChanged;
    placeIndicator(list, indicator, sliding);
    currentIdRef.current = currentId;
    collapsedRef.current = collapsed;

    const measure = () => {
      if (sliding) return;
      const nextList = listRef.current;
      const nextIndicator = indicatorRef.current;
      if (nextList && nextIndicator) {
        placeIndicator(nextList, nextIndicator, false);
      }
    };
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    const frame = window.requestAnimationFrame(measure);
    const settled = window.setTimeout(measure, 220);

    if (!collapseChanged) {
      return () => {
        observer.disconnect();
        window.cancelAnimationFrame(frame);
        window.clearTimeout(settled);
      };
    }

    const shell = list.closest<HTMLElement>("[data-slot='sidebar-container']");
    let tickFrame = 0;
    const tick = () => {
      const nextList = listRef.current;
      const nextIndicator = indicatorRef.current;
      if (nextList && nextIndicator) {
        placeIndicator(nextList, nextIndicator, false);
      }
      tickFrame = window.requestAnimationFrame(tick);
    };
    tickFrame = window.requestAnimationFrame(tick);

    const stop = () => {
      window.cancelAnimationFrame(tickFrame);
      const nextList = listRef.current;
      const nextIndicator = indicatorRef.current;
      if (nextList && nextIndicator) {
        placeIndicator(nextList, nextIndicator, false);
      }
    };
    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.target !== shell || event.propertyName !== "width") {
        return;
      }
      stop();
    };
    shell?.addEventListener("transitionend", onTransitionEnd);
    const timeout = window.setTimeout(stop, WIDTH_MS + 80);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.clearTimeout(settled);
      window.cancelAnimationFrame(tickFrame);
      window.clearTimeout(timeout);
      shell?.removeEventListener("transitionend", onTransitionEnd);
    };
  }, [collapsed, currentId, itemKey, openMobile]);

  useLayoutEffect(() => {
    if (!isMobile || !openMobile) {
      return;
    }

    let attempts = 0;
    let frame = 0;
    const measure = () => {
      const list = listRef.current;
      const indicator = indicatorRef.current;
      if (list && indicator && list.querySelector("[data-nav-active='true']")) {
        placeIndicator(list, indicator, false);
        return;
      }
      attempts += 1;
      if (attempts < 12) {
        frame = window.requestAnimationFrame(measure);
      }
    };
    measure();

    return () => window.cancelAnimationFrame(frame);
  }, [isMobile, openMobile, currentId, itemKey]);

  function selectItem(id: SidebarIconName) {
    setTone("hover");
    if (activeId === undefined) {
      setUncontrolledId(id);
    }
    onActiveChange?.(id);
    if (isMobile) {
      setTone("idle");
      setOpenMobile(false);
    }
  }

  return (
    <>
          <Sidebar
            collapsible="icon"
            className="border-[#e2e4e9] bg-white text-[#35383d]"
          >
            <div className="flex h-full flex-col overflow-x-hidden py-6 in-data-[mobile=true]:h-auto in-data-[mobile=true]:py-4">
            <SidebarHeader className="gap-0 p-0">
              <div className="flex h-9 items-center px-6 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
                <img
                  src={favicon}
                  alt=""
                  width={36}
                  height={36}
                  className="size-9 shrink-0"
                />
                <span className="ml-3 max-w-40 overflow-hidden text-[20px] leading-normal font-medium whitespace-nowrap text-[#241328] opacity-100 transition-[max-width,opacity,margin] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-data-[collapsible=icon]:ml-0 group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0 motion-reduce:transition-none">
                  {brand}
                </span>
              </div>
            </SidebarHeader>
            <SidebarContent className="mt-9 overflow-x-hidden in-data-[mobile=true]:mt-4 in-data-[mobile=true]:flex-none">
              <SidebarGroup className="p-0">
                <SidebarGroupContent>
                  <nav aria-label="Primary">
                    <SidebarMenu ref={listRef} className="relative gap-0">
                      <span
                        ref={indicatorRef}
                        aria-hidden
                        className={cn(
                          "pointer-events-none absolute z-0 rounded-[6px] opacity-0",
                          tone === "press"
                            ? "bg-[#e44512]"
                            : tone === "hover"
                              ? "bg-[#f04c16]"
                              : "bg-[#ff541f]",
                        )}
                      />
                      {items.map((item) => {
                        const active = item.id === currentId;
                        return (
                          <SidebarMenuItem
                            key={item.id}
                            className="flex h-14 items-center justify-center in-data-[mobile=true]:h-11"
                          >
                              <SidebarMenuButton
                                render={<Link to={`/${item.id}`} />}
                                isActive={active}
                                tooltip={item.label}
                                data-nav-active={active ? "true" : undefined}
                                aria-current={active ? "page" : undefined}
                                className={navButtonClass}
                                onClick={() => selectItem(item.id)}
                                onMouseEnter={() => {
                                  if (item.id === currentId) {
                                    setTone("hover");
                                  }
                                }}
                                onMouseLeave={() => {
                                  if (item.id === currentId) {
                                    setTone("idle");
                                  }
                                }}
                                onMouseDown={() => {
                                  if (item.id === currentId) {
                                    setTone("press");
                                  }
                                }}
                                onMouseUp={() => {
                                  if (item.id === currentId) {
                                    setTone("hover");
                                  }
                                }}
                              >
                                <SidebarGlyph src={sidebarIcons[item.id]} color="#35383d" />
                                <ItemLabel>{item.label}</ItemLabel>
                                <div aria-hidden data-nav-ink className={inkClass}>
                                  <SidebarGlyph src={sidebarIcons[item.id]} color="#ffffff" />
                                  <ItemLabel light>{item.label}</ItemLabel>
                                </div>
                              </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </nav>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            {footer ? (
              <SidebarFooter className="gap-0 p-0">
                <SidebarMenu className="gap-0">
                  <SidebarMenuItem className="flex h-14 items-center justify-center in-data-[mobile=true]:h-11">
                      <SidebarMenuButton
                        type="button"
                        tooltip={footer.label}
                        className={footerButtonClass}
                        onClick={() => {
                          if (isMobile) {
                            setOpenMobile(false);
                          }
                          logAction("Log out");
                          onLogout?.();
                        }}
                      >
                        <SidebarGlyph src={sidebarIcons[footer.id]} color="#35383d" />
                        <ItemLabel>{footer.label}</ItemLabel>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
            ) : null}
            </div>
          </Sidebar>
          <SidebarInset className="min-w-0 bg-white">{children}</SidebarInset>
    </>
  );
}
