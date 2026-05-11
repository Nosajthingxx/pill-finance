export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="app">
      <div className="footer-inner">
        <div className="left">
          pill<span className="lime">.</span>finance · briefings refresh 06:30 / 19:00 TRT · Mon–Fri
        </div>
        <div className="right">indicative prices · not investment advice · © {year}</div>
      </div>
    </footer>
  );
}
