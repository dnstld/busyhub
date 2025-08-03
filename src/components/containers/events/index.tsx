export const dynamic = 'force-dynamic';

import { getCalendarAccessToken } from '@/app/actions/get-calendar-token';
import Achievements from '@/components/presenters/achievements';
import DailyEventsChart from '@/components/presenters/charts/daily-events-chart';
import MonthlyEventsChart from '@/components/presenters/charts/monthly-events-chart';
import EventAnalyticsChart from '@/components/presenters/charts/response-analytics-chart';
import WeeklyEventsChart from '@/components/presenters/charts/weekly-events-chart';
import ConnectStepper from '@/components/presenters/connect-stepper';
import Heatmap from '@/components/presenters/heatmap';
import History from '@/components/presenters/history';
import Profile from '@/components/presenters/profile';
import LastUpdate from '@/components/ui/last-update';
import { TerminalIcon } from 'lucide-react';
import Image from 'next/image';

export default async function Events() {
  const calendarToken = await getCalendarAccessToken();

  return (
    <main className="grid grid-cols-1 lg:grid-cols-12 w-full max-w-7xl lg:mx-auto p-4 lg:p-8 gap-8">
      <Image
        src="./images/logo-vertical.svg"
        alt="BusyHub Logo"
        width={125}
        height={32}
        className="lg:hidden"
      />

      <div className="flex flex-col gap-8 lg:col-span-3">
        <Profile />
        <Achievements />
      </div>

      <div className="flex flex-col gap-8 lg:min-w-max">
        <Image
          src="./images/logo-vertical.svg"
          alt="BusyHub Logo"
          width={125}
          height={32}
          className="hidden lg:block"
        />

        {!calendarToken && <ConnectStepper />}

        <div
          className={`flex flex-col gap-8 ${
            !calendarToken ? 'opacity-50' : ''
          }`}
          aria-hidden={!calendarToken}
        >
          <Heatmap />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <WeeklyEventsChart />
            <MonthlyEventsChart />
          </div>

          <EventAnalyticsChart />

          <DailyEventsChart />

          <History />
        </div>

        <footer>
          <p className="text-sm">
            <TerminalIcon className="inline-block mr-1" aria-hidden="true" />
            Built with care by{' '}
            <a
              href="https://www.linkedin.com/in/denistoledo/"
              target="_blank"
              className="text-lime-400 hover:underline"
            >
              Denis Toledo
            </a>
          </p>
          <LastUpdate />
        </footer>
      </div>
    </main>
  );
}
