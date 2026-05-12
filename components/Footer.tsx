import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="app">
      <div className="footer-inner">
        <div className="left">
          pill<span className="lime">.</span>finance | briefings refresh 06:30 / 19:00 TRT | Mon-Fri
        </div>
        <div className="right">
          <Link href="/privacy">Privacy</Link>
          <span className="footer-sep">|</span>
          <Link href="/terms">Terms</Link>
          <span className="footer-sep">|</span>
          indicative prices | not investment advice | (c) {year}
        </div>
      </div>
    </footer>
  );
}
