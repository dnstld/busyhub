import LastUpdate from '@/components/ui/last-update';
import Image from 'next/image';

export default function PrivacyPolicyPage() {
  return (
    <main className="w-full max-w-7xl lg:mx-auto p-4 gap-4">
      <Image
        src="./images/logo-vertical.svg"
        alt="BusyHub Logo"
        width={125}
        height={32}
        className="mb-8"
      />

      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        At <strong>BusyHub</strong>, we believe your time and your data are
        deeply personal. This Privacy Policy outlines what information we
        collect, how we use it, and your rights.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">1. What We Collect</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Your email address (used for identification)</li>
        <li>
          Your Google Calendar events: title, start/end times, and recurrence
          info
        </li>
        <li>
          Basic usage metadata: event counts, streaks, and visualization data
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        2. How We Use Your Data
      </h2>
      <p className="mb-4">
        Your calendar data is used solely to generate your personal heatmap and
        event insights. We do not sell, rent, or analyze your personal events
        beyond what's needed for visualization.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        3. Data Storage & Security
      </h2>
      <p className="mb-4">
        We do not store your calendar data in any database. All processing
        happens in-memory, temporarily, and only during your active session.
        Once you leave the page, the data disappears.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        4. Data Sharing & Third-Party Services
      </h2>
      <p className="mb-4">
        We share your data with the following third-party services solely to
        provide our service:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>
          <strong>Google OAuth & Calendar API:</strong> We access your calendar
          events using Google's secure OAuth 2.0 system with read-only
          permissions (scope:
          https://www.googleapis.com/auth/calendar.events.readonly). Google's
          privacy policy applies to this data access.
        </li>
        <li>
          <strong>OpenAI API:</strong> Anonymous calendar event patterns (no
          personal identifiers, event titles, or attendee information) may be
          sent to OpenAI's API to generate insights about your productivity
          patterns. OpenAI's privacy policy applies to this processing.
        </li>
        <li>
          <strong>Vercel (Hosting & Analytics):</strong> Our application is
          hosted on Vercel. Anonymous usage analytics are collected to improve
          our service (no personal calendar data is included). Vercel's privacy
          policy applies.
        </li>
      </ul>
      <p className="mb-4">
        <strong>
          We do not sell, rent, or share your personal calendar data with any
          other third parties.
        </strong>{' '}
        Data sharing is limited to what's necessary to provide the service
        functionality.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        5. Data Protection & Security Mechanisms
      </h2>
      <p className="mb-4">
        We implement multiple layers of security to protect your sensitive
        calendar data:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>
          <strong>OAuth 2.0 Authentication:</strong> We use Google's secure
          OAuth 2.0 system with read-only calendar permissions. We never store
          your Google credentials.
        </li>
        <li>
          <strong>HTTPS Encryption:</strong> All data transmission between your
          browser and our servers is encrypted using industry-standard TLS/SSL
          protocols.
        </li>
        <li>
          <strong>No Persistent Storage:</strong> Your raw calendar data is
          processed in-memory only and is never stored in databases or files on
          our servers.
        </li>
        <li>
          <strong>Token Security:</strong> OAuth access tokens are securely
          stored in encrypted session cookies with secure flags and same-site
          policies.
        </li>
        <li>
          <strong>Data Anonymization:</strong> When generating AI insights, only
          anonymized patterns are processed (no event titles, attendees, or
          personal details).
        </li>
        <li>
          <strong>Limited Data Retention:</strong> AI analysis results are
          cached in-memory for maximum 3 days to improve performance, then
          automatically deleted.
        </li>
        <li>
          <strong>Access Controls:</strong> Your data is only accessible during
          your authenticated session and is never shared between users.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">6. Your Rights</h2>
      <ul className="list-disc list-inside mb-4">
        <li>
          <strong>Revoke Access:</strong> You can revoke BusyHub's access to
          your calendar at any time via your Google Account settings
          (myaccount.google.com/permissions)
        </li>
        <li>
          <strong>Data Deletion:</strong> Since we don't store your calendar
          data, disconnecting your account automatically removes all access to
          your information
        </li>
        <li>
          <strong>Access Information:</strong> You can request information about
          any cached analysis data by contacting us
        </li>
        <li>
          <strong>Data Portability:</strong> Your calendar data remains in your
          Google account and can be exported using Google Takeout
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">7. Data Retention</h2>
      <p className="mb-4">
        <strong>Calendar Data:</strong> We do not retain your raw calendar data.
        It's processed in real-time and discarded after each session.
      </p>
      <p className="mb-4">
        <strong>AI Analysis Cache:</strong> Anonymized analysis results may be
        cached in-memory for up to 3 days to improve performance, after which
        they are automatically deleted.
      </p>
      <p className="mb-4">
        <strong>Session Data:</strong> Login sessions expire after 30 days of
        inactivity.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">8. Cookies & Tracking</h2>
      <p className="mb-4">We use minimal cookies and tracking:</p>
      <ul className="list-disc list-inside mb-4">
        <li>
          <strong>Essential Cookies:</strong> Required for login sessions and
          security (NextAuth.js session cookies)
        </li>
        <li>
          <strong>Analytics:</strong> Anonymous usage analytics via Vercel
          Analytics (no personal identifiers or calendar data)
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        9. Changes to This Policy
      </h2>
      <p className="mb-4">
        We may occasionally update this Privacy Policy. Changes will be
        reflected by the "Last Update" date.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">10. Contact</h2>
      <p>
        For questions or concerns, email us at
        <a
          href="mailto:detoledo.denis@gmail.com"
          className="text-lime-400 hover:underline ml-1"
        >
          detoledo.denis@gmail.com
        </a>
      </p>

      <LastUpdate />
    </main>
  );
}
