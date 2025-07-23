import LastUpdate from '@/ui/last-update';
import Image from 'next/image';

export default function PrivacyPolicy() {
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
        4. Third-Party Services
      </h2>
      <ul className="list-disc list-inside mb-4">
        <li>Google OAuth & Calendar API</li>
        <li>Hosting (e.g. Vercel)</li>
        <li>
          Optional analytics (e.g. Plausible, Posthog - with no personal
          identifiers)
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        5. Sharing Your Timeline
      </h2>
      <p className="mb-4">
        Your timeline is only visible to you. There are no public links, and no
        one else can access your calendar heatmap.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">6. Your Rights</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Revoke access at any time via your Google Account settings</li>
        <li>
          Request data deletion by contacting us (though we don't store any)
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">7. Cookies & Tracking</h2>
      <p className="mb-4">
        We use minimal cookies for login sessions and anonymous analytics (if
        enabled).
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        8. Changes to This Policy
      </h2>
      <p className="mb-4">
        We may occasionally update this Privacy Policy. Changes will be
        reflected by the "Last Update" date.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">9. Contact</h2>
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
