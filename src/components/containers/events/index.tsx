import Achievements from '@/components/presenters/achievements';
import DailyEventsChart from '@/components/presenters/charts/daily-events-chart';
import MonthlyEventsChart from '@/components/presenters/charts/monthly-events-chart';
import WeeklyEventsChart from '@/components/presenters/charts/weekly-events-chart';
import Heatmap from '@/components/presenters/heatmap';
import History from '@/components/presenters/history';
import Profile from '@/components/presenters/profile';
import { TerminalIcon } from 'lucide-react';
import Image from 'next/image';

export default function Events() {
  return (
    <main className="grid grid-cols-1 lg:grid-cols-12 w-full max-w-7xl lg:mx-auto p-4 lg:p-8 gap-4">
      <div className="flex flex-col gap-8 lg:col-span-3">
        <Profile />

        <section>
          <h2 className="mb-4">Achievements</h2>
          <Achievements />
        </section>
      </div>

      <div className="flex flex-col gap-8 lg:min-w-max">
        <Image
          src="./images/logo-vertical.svg"
          alt="BusyHub Logo"
          width={125}
          height={32}
        />

        <section
          className="flex flex-col gap-2"
          aria-labelledby="events-section"
        >
          <h2 id="events-section" className="sr-only">
            Events timeline
          </h2>
          <Heatmap />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <section aria-labelledby="weekly-events-chart">
            <h2 className="sr-only">Weekly Events Chart</h2>
            <WeeklyEventsChart />
          </section>
          <section aria-labelledby="monthly-events-chart">
            <h2 className="sr-only">Monthly Events Chart</h2>
            <MonthlyEventsChart />
          </section>
        </div>

        <DailyEventsChart />

        <section
          className="flex flex-col gap-4 w-full"
          aria-labelledby="events-history"
        >
          <h2 id="events-history" className="sr-only">
            Events history
          </h2>
          <History />
        </section>

        <footer>
          <p className="text-sm">
            <TerminalIcon className="inline-block mr-1" aria-hidden="true" />
            Developed by{' '}
            <a
              href="https://www.linkedin.com/in/denistoledo/"
              target="_blank"
              className="text-lime-400 hover:underline"
            >
              Denis Toledo
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
