import Achievements from './achievements';
import DailyEventsChart from './daily-events-chart';
import Header from './header';
import History from './history';
import Profile from './profile';
import Timeline from './timeline';

export default function EventsContent() {
  return (
    <main className="grid grid-cols-1 lg:grid-cols-12 w-full max-w-7xl lg:mx-auto p-4 gap-4 z-10 relative pt-24">
      <Header />

      <div className="flex flex-col gap-8 lg:col-span-3">
        <Profile />

        <section>
          <h2 className="mb-4">Achievements</h2>
          <Achievements />
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
          <Timeline />
        </section>

        <section className="flex flex-col gap-2" aria-labelledby="events-chart">
          <h2 id="events-chart" className="sr-only">
            Events activity chart
          </h2>
          <DailyEventsChart />
        </section>

        <section
          className="flex flex-col gap-4 w-full"
          aria-labelledby="events-history"
        >
          <h2 id="events-history" className="sr-only">
            Events history
          </h2>
          <History />
        </section>
      </div>
    </main>
  );
}
