"use client"

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, VariantProps } from 'class-variance-authority'
import { PanelLeftIcon, PanelRightIcon, Menu, X } from 'lucide-react'

import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { motion, type HTMLMotionProps, AnimatePresence } from 'framer-motion'

const SIDEBAR_COOKIE_NAME = 'sidebar_state'
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = '280px'
const SIDEBAR_WIDTH_MOBILE = '320px'
const SIDEBAR_WIDTH_ICON = '72px'

type SidebarContextProps = {
  state: 'expanded' | 'collapsed' | 'animating'
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.')
  }
  return context
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)

  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === 'function' ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [setOpenProp, open],
  )

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
  }, [isMobile, setOpen, setOpenMobile])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'b' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggleSidebar()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleSidebar])

  const state = open ? 'expanded' : 'collapsed'

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          style={{
            '--sidebar-width': SIDEBAR_WIDTH,
            '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
            ...style,
          } as React.CSSProperties}
          className={cn(
            'group/sidebar-wrapper bg-gradient-to-b from-background/50 to-background/80 backdrop-blur-xl flex min-h-svh w-full shadow-2xl',
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
}

function Sidebar({
  side = 'left',
  variant = 'modern',
  collapsible = 'offcanvas',
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  side?: 'left' | 'right'
  variant?: 'modern' | 'floating' | 'inset'
  collapsible?: 'offcanvas' | 'icon' | 'none'
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  if (collapsible === 'none') {
    return (
      <motion.div
        initial={false}
        animate={{ scale: 1 }}
        className={cn(
          'bg-gradient-to-b from-sidebar/90 to-sidebar backdrop-blur-xl text-sidebar-foreground flex h-full w-[var(--sidebar-width)] flex-col border-r border-sidebar-border shadow-2xl',
          className,
        )}
        {...props}
      >
        {children}
      </motion.div>
    )
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className="bg-gradient-to-b from-primary/95 to-primary/90 backdrop-blur-2xl text-primary-foreground border-primary/30 w-[var(--sidebar-width)] p-0 [&>button]:hidden shadow-2xl"
          style={{
            '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
          } as React.CSSProperties}
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col p-6 gap-6">{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      className="group peer text-sidebar-foreground hidden md:block"
      data-state={state}
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      <div
        data-slot="sidebar-gap"
        className={cn(
          'relative w-[var(--sidebar-width)] bg-gradient-to-r from-transparent to-background/50 backdrop-blur-sm transition-[width] duration-500 ease-out',
          'group-data-[collapsible=offcanvas]:w-0',
          'group-data-[side=right]:rotate-180',
          variant === 'floating' || variant === 'inset'
            ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+1rem)]'
            : 'group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]',
        )}
      />
      <div
        data-slot="sidebar-container"
        className={cn(
          'fixed inset-y-0 z-50 hidden h-svh w-[var(--sidebar-width)] backdrop-blur-xl transition-all duration-500 ease-out md:flex shadow-2xl',
          side === 'left'
            ? 'left-0 group-data-[collapsible=offcanvas]:-left-full'
            : 'right-0 group-data-[collapsible=offcanvas]:right-full',
          variant === 'floating' || variant === 'inset'
            ? 'p-3 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+0.75rem)] border border-sidebar-border/50 rounded-xl bg-white/80 shadow-xl'
            : 'group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)] border-r border-sidebar-border',
          className,
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className="bg-gradient-to-b from-white/90 to-white/70 backdrop-blur-xl flex h-full w-full flex-col border-0 shadow-none rounded-xl border border-sidebar-border/50"
        >
          {children}
        </div>
      </div>
    </div>
  )
}

function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn(
        'size-10 border border-border/50 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-md hover:border-primary/50 active:scale-95 transition-all duration-200 shadow-lg',
        className,
      )}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <motion.div
        animate={{ rotate: open() ? 180 : 0 }}
        transition={{ duration: 0.2 }}
        {...({} as HTMLMotionProps<"div">)}
      >
        <PanelLeftIcon />
      </motion.div>
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

function SidebarRail({ className, ...props }: React.ComponentProps<'button'>) {
  const { toggleSidebar } = useSidebar()

  return (
    <motion.button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        'group hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 backdrop-blur-sm absolute inset-y-0 z-20 hidden h-12 w-12 -translate-x-1/2 cursor-pointer rounded-full border border-border/50 shadow-lg backdrop-blur-xl hover:shadow-xl hover:border-primary/50 active:scale-[0.97] transition-all duration-300 sm:flex',
        'group-data-[side=left]:-right-6 group-data-[side=right]:left-6',
        className,
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      <PanelLeftIcon className="h-5 w-5 text-foreground group-data-[side=right]:rotate-180" />
    </motion.button>
  )
}

function SidebarInset({ className, ...props }: React.ComponentProps<'main'>) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        'bg-gradient-to-b from-background/90 to-background backdrop-blur-sm relative flex w-full flex-1 flex-col shadow-inner',
        className,
      )}
      {...props}
    />
  )
}

// Rest of components unchanged...
function SidebarInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn(
        'ring-offset-background bg-gradient-to-r from-muted to-muted/50 backdrop-blur-sm focus-visible:ring-primary/50 border-border/50 shadow-inner hover:shadow-md h-10 w-full transition-all duration-200',
        className,
      )}
      {...props}
    />
  )
}

function SidebarHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn(
        'backdrop-blur-xl bg-gradient-to-b from-sidebar/80 to-sidebar/60 p-6 pt-8 rounded-t-2xl border-b border-sidebar-border/50 shadow-lg',
        className,
      )}
      {...props}
    />
  )
}

function SidebarFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn(
        'backdrop-blur-xl bg-gradient-to-t from-sidebar/80 to-transparent p-6 rounded-b-2xl border-t border-sidebar-border/50 mt-auto shadow-lg',
        className,
      )}
      {...props}
    />
  )
}

function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn(
        'bg-gradient-to-r from-sidebar-border/50 to-transparent backdrop-blur-sm shadow-sm mx-6 my-3 w-auto h-[2px] rounded-full',
        className,
      )}
      {...props}
    />
  )
}

export {}
   />
  )
}

export {}
