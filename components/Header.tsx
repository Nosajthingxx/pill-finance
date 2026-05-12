import Link from 'next/link';
import type { DayBriefing } from '@/lib/types';
import AccountMenu from '@/components/auth/AccountMenu';

interface Props {
  briefing: DayBriefing | null;
}

export default function Header({ briefing }: Props) {
  const lastSlot = briefing?.updates?.[briefing.updates.length - 1];
  const labelTime = lastSlot
    ? lastSlot.timestamp_trt.replace(/^\d{4}-\d{2}-\d{2} /, '').replace(' TRT', ' TRT')
    : '--';

  return (
    <header className="app">
      <div className="header-inner">
        <Link href="/" className="logo" aria-label="pill.finance home">
          pill<span className="dot">.</span>finance
        </Link>

        <div className="status-pill" aria-live="polite">
          <span className="live-dot" aria-hidden="true" />
          <span className="label">LAST BRIEF {labelTime}</span>
        </div>

        <nav className="app-nav">
          <Link href="/" className="active">HOME</Link>
          <Link href="/how-it-works">METHOD</Link>
          <Link href="/about">ABOUT