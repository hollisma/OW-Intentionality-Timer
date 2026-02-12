import { type ReactNode } from 'react';

interface PracticePageLayoutProps {
  timerSlot: ReactNode;
  controlsSlot: ReactNode;
  detailSlot: ReactNode;
}

/**
 * Responsive layout for the Practice/Skills page.
 * Mobile: single column, stacked (Timer → Detail → Controls). Reordered via flex order.
 * Desktop (lg): split panel—left = timer + controls, right = skill detail.
 * CSS-only; no JS breakpoint detection.
 */
export const PracticePageLayout = ({
  timerSlot,
  controlsSlot,
  detailSlot,
}: PracticePageLayoutProps) => {
  return (
    <div
      className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(20rem,2fr)_minmax(24rem,3fr)] lg:gap-6 lg:min-h-[calc(100vh-8rem)] lg:items-stretch"
    >
      {/* On mobile: display:contents so parent sees timer + controls + detail; order puts detail between timer and controls. */}
      {/* Note: focus order may follow DOM (Timer→Controls→Detail) not visual (Timer→Detail→Controls). See implementation report. */}
      {/* On desktop: left column, scrolls as one. */}
      <div className="contents lg:flex lg:flex-col lg:gap-6 lg:min-h-0 lg:overflow-y-auto lg:scrollbar-app">
        <div className="order-1 lg:order-none">{timerSlot}</div>
        <div className="order-3 lg:order-none">{controlsSlot}</div>
      </div>
      {/* On mobile: order-2 puts detail between timer and controls. On desktop: right column. */}
      <div className="order-2 lg:order-none lg:min-h-0 lg:overflow-y-auto scrollbar-app">
        {detailSlot}
      </div>
    </div>
  );
};
