import LastUpdate from '@/components/ui/last-update';
import Image from 'next/image';

export default function TermsOfServicePage() {
  return (
    <main className="w-full max-w-7xl lg:mx-auto p-4 gap-4">
      <Image
        src="./images/logo-vertical.svg"
        alt="BusyHub Logo"
        width={125}
        height={32}
        className="mb-8"
      />

      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <p className="mb-4">
        Welcome to <strong>BusyHub</strong>. By accessing or using our app, you
        agree to comply with and be bound by these Terms of Service. Please read
        them carefully.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">1. Use of Our Service</h2>
      <p className="mb-4">
        BusyHub provides a tool to visualize your Google Calendar events as a
        personal heatmap and generate productivity insights. You agree to use this service only for lawful purposes
        and in accordance with these terms.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        2. User Accounts & Google Calendar Access
      </h2>
      <p className="mb-4">
        To use BusyHub, you must authenticate via your Google Account and grant
        permission to access your calendar events with read-only access. By granting this permission, you agree that:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>
          BusyHub will only access your calendar data with the scope "https://www.googleapis.com/auth/calendar.readonly"
        </li>
        <li>
          Your calendar data will be processed in real-time and not stored permanently on our servers
        </li>
        <li>
          You can revoke access at any time through your Google Account settings
        </li>
        <li>
          You are responsible for maintaining the confidentiality and security of your Google Account
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        3. Data Processing & Third-Party Services
      </h2>
      <p className="mb-4">
        BusyHub processes your calendar data to provide visualization and insights services. By using our service, you agree that:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>
          Your calendar data may be processed using third-party AI services (OpenAI) to generate productivity insights, with anonymized data only
        </li>
        <li>
          Usage analytics may be collected via Vercel Analytics to improve our service (no personal calendar data included)
        </li>
        <li>
          All data processing complies with our Privacy Policy and applicable data protection laws
        </li>
        <li>
          We implement appropriate security measures to protect your data during processing
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        4. Data Privacy & Security
      </h2>
      <p className="mb-4">
        We do not store your calendar data beyond your active session. For more
        details, see our Privacy Policy.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        5. Intellectual Property
      </h2>
      <p className="mb-4">
        BusyHub and its content, including designs and software, are the
        intellectual property of their respective owners. You may not reproduce
        or distribute any part of the service without permission.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">6. User Content & Data Ownership</h2>
      <p className="mb-4">
        You retain ownership of your calendar data and any content you share via
        BusyHub. You grant us a limited license to use this data solely to
        provide the service.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        7. Compliance & Data Protection
      </h2>
      <p className="mb-4">
        BusyHub is committed to protecting your data and complying with applicable privacy laws. We implement appropriate technical and organizational measures to ensure data security and privacy.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        8. Disclaimer of Warranties
      </h2>
      <p className="mb-4">
        BusyHub is provided "as is" without warranties of any kind, express or
        implied. We do not guarantee the accuracy, reliability, or availability
        of the service.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        9. Limitation of Liability
      </h2>
      <p className="mb-4">
        To the maximum extent permitted by law, BusyHub shall not be liable for
        any damages arising from the use or inability to use the service.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">10. Changes to Terms</h2>
      <p className="mb-4">
        We may update these Terms of Service from time to time. Changes will be
        posted here with an updated "Last Update" date. Your continued use of the service after changes constitutes acceptance of the new terms.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">11. OAuth Scopes & Permissions</h2>
      <p className="mb-4">
        BusyHub requests the following specific Google OAuth scopes:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>
          <strong>openid email profile:</strong> For user identification and authentication
        </li>
        <li>
          <strong>https://www.googleapis.com/auth/calendar.readonly:</strong> Read-only access to your calendar events to generate visualizations and insights
        </li>
      </ul>
      <p className="mb-4">
        These scopes are the minimum required for BusyHub to function. We do not request write access or access to other Google services.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">12. Governing Law</h2>
      <p className="mb-4">
        These terms are governed by the laws of the country where BusyHub
        operates, without regard to conflict of laws principles.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">13. Contact</h2>
      <p>
        If you have questions about these Terms, please contact us at{' '}
        <a
          href="mailto:detoledo.denis@gmail.com"
          className="text-lime-400 hover:underline"
        >
          detoledo.denis@gmail.com
        </a>
        .
      </p>

      <LastUpdate />
    </main>
  );
}
