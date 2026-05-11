import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the pill.finance team.',
};

export default function ContactPage() {
  return (
    <div className="static-page">
      <h1>Contact</h1>
      <p className="subtitle">We would like to hear from you.</p>

      <h2>Email</h2>
      <p>
        For general inquiries, feedback, or partnership opportunities, reach us
        at{' '}
        <a href="mailto:hello@pill.finance">hello@pill.finance</a>.
      </p>

      <h2>Response Time</h2>
      <p>
        We aim to respond to all inquiries within 48 hours on business days.
      </p>

      <h2>Bug Reports</h2>
      <p>
        Found an issue with a briefing or the site? Please include the asset
        name, date, and a description of the problem when contacting us.
      </p>
    </div>
  );
}
