import Header from '@/ui/header';
import LastUpdate from '@/ui/last-update';

export default function TermsAndConditions() {
  return (
    <main className="w-full max-w-7xl lg:mx-auto p-4 gap-4 z-10 relative pt-24">
      <Header />

      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>

      <p className="mb-4">
        Welcome to <strong>BusyHub</strong>. By accessing or using our app, you
        agree to comply with and be bound by these Terms and Conditions. Please
        read them carefully.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">1. Use of Our Service</h2>
      <p className="mb-4">
        BusyHub provides a tool to visualize your Google Calendar events as a
        personal heatmap. You agree to use this service only for lawful purposes
        and in accordance with these terms.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        2. User Accounts & Access
      </h2>
      <p className="mb-4">
        To use BusyHub, you must authenticate via your Google Account and grant
        permission to access your calendar events. You are responsible for
        maintaining the confidentiality of your account.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        3. Data Privacy & Security
      </h2>
      <p className="mb-4">
        We do not store your calendar data beyond your active session. For more
        details, see our Privacy Policy.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        4. Intellectual Property
      </h2>
      <p className="mb-4">
        BusyHub and its content, including designs and software, are the
        intellectual property of their respective owners. You may not reproduce
        or distribute any part of the service without permission.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">5. User Content</h2>
      <p className="mb-4">
        You retain ownership of your calendar data and any content you share via
        BusyHub. You grant us a limited license to use this data solely to
        provide the service.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        6. Disclaimer of Warranties
      </h2>
      <p className="mb-4">
        BusyHub is provided “as is” without warranties of any kind, express or
        implied. We do not guarantee the accuracy, reliability, or availability
        of the service.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        7. Limitation of Liability
      </h2>
      <p className="mb-4">
        To the maximum extent permitted by law, BusyHub shall not be liable for
        any damages arising from the use or inability to use the service.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">8. Changes to Terms</h2>
      <p className="mb-4">
        We may update these Terms and Conditions from time to time. Changes will
        be posted here with an updated “Last Updated” date.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">9. Governing Law</h2>
      <p className="mb-4">
        These terms are governed by the laws of the country where BusyHub
        operates, without regard to conflict of laws principles.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">10. Contact</h2>
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
