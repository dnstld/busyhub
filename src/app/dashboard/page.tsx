import Achievements from '@/ui/achievements';
import Events from '@/ui/events';
import Header from '@/ui/header';
import History from '@/ui/history';
import Profile from '@/ui/profile';
import { Suspense } from 'react';

export default async function Dashboard() {
  return (
    <main className="grid grid-cols-1 lg:grid-cols-12 w-full max-w-7xl lg:mx-auto p-4 gap-4 z-10 relative pt-24">
      <Header />

      <div className="flex flex-col gap-8 lg:col-span-3">
        <Profile />

        <section>
          <h2 className="mb-4">Achievements</h2>
          <Suspense fallback={<p>Loading achievements...</p>}>
            <Achievements />
          </Suspense>
        </section>
      </div>

      <div className="flex flex-col gap-8 lg:min-w-max">
        <section
          className="flex flex-col gap-2"
          aria-labelledby="events-section"
        >
          <h2 id="events-section" className="sr-only">
            Events timeline
          </h2>
          <Suspense fallback={<p>Loading events...</p>}>
            <Events />
          </Suspense>
        </section>

        <section
          className="flex flex-col gap-4 w-full"
          aria-labelledby="events-history"
        >
          <h2 id="events-history" className="sr-only">
            Events history
          </h2>
          <Suspense fallback={<p>Loading history...</p>}>
            <History />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
