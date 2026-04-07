import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type PreVRScreenShellProps = {
  eyebrow: string
  heading: string
  subtext?: string
  mode?: 'flow' | 'fit'
  desktopLayout?: 'stack' | 'split'
  bodyScroll?: 'clip' | 'auto'
  className?: string
  headerClassName?: string
  bodyClassName?: string
  subtextClassName?: string
  headerSlot?: ReactNode
  children: ReactNode
}

export default function PreVRScreenShell({
  eyebrow,
  heading,
  subtext,
  mode = 'flow',
  desktopLayout = 'stack',
  bodyScroll = 'clip',
  className,
  headerClassName,
  bodyClassName,
  subtextClassName,
  headerSlot,
  children,
}: PreVRScreenShellProps) {
  const isFit = mode === 'fit'
  const isSplit = desktopLayout === 'split'
  const scrollClasses =
    bodyScroll === 'auto'
      ? 'overflow-y-auto overscroll-contain'
      : 'overflow-hidden'

  return (
    <section
      data-prevr-shell={mode}
      className={cn(
        'mx-auto flex w-full max-w-[var(--max-content-width)] px-4 md:px-6',
        isFit
          ? 'h-full min-h-0 flex-1 py-4 md:py-6'
          : 'flex-col py-8 md:py-12',
        className,
      )}
    >
      <div
        className={cn(
          'flex w-full',
          isFit ? 'min-h-0 flex-1' : 'flex-col',
          isSplit
            ? cn(
                'flex-col gap-6 md:grid md:min-h-0 md:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] md:gap-10',
                isFit ? 'md:items-stretch' : 'md:items-center',
              )
            : 'flex-col',
        )}
      >
        <div
          className={cn(
            isSplit
              ? cn('text-center md:text-left', headerSlot ? 'md:self-start' : 'md:self-center')
              : 'mx-auto max-w-3xl text-center',
            isFit && !isSplit && 'flex-shrink-0',
            headerClassName,
          )}
        >
          <p className="text-[12px] font-[800] uppercase tracking-[0.24em] text-[var(--myb-primary-blue)]">
            {eyebrow}
          </p>
          <h2
            data-screen-heading
            className={cn(
              'mt-4 text-[28px] font-[800] leading-[1.15] text-[var(--myb-navy)] md:text-[40px]',
              isSplit ? 'text-center md:text-left' : 'text-center',
            )}
          >
            {heading}
          </h2>
          {subtext && (
            <p
              className={cn(
                'mt-3 text-[16px] font-[300] leading-[1.75] text-[var(--myb-neutral-5)]',
                isSplit ? 'text-center md:max-w-[28rem] md:text-left' : 'text-center',
                subtextClassName,
              )}
            >
              {subtext}
            </p>
          )}
          {headerSlot}
        </div>

        <div
          data-prevr-shell-body
          className={cn(
            isFit ? 'flex min-h-0 flex-1 flex-col' : 'mt-8',
            scrollClasses,
            bodyClassName,
          )}
        >
          {children}
        </div>
      </div>
    </section>
  )
}
