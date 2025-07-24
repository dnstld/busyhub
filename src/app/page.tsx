import {
  CalendarCheckIcon,
  LayoutGridIcon,
  LogInIcon,
  TerminalIcon,
} from 'lucide-react';

import EventsPanel from '@/ui/heatmap';
import Image from 'next/image';
import fakeData from '../fake-data.json';
import { login } from './actions/login';

export default async function RootPage() {
  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-lime-800/7 to-transparent top-0 bottom-0 left-0 right-0"></div>

      <main className="relative z-10 px-4 py-16 space-y-16 lg:space-y-24 text-center">
        <header className="max-w-7xl mx-auto text-center space-y-8">
          <Image
            src="./images/logo-horizontal.svg"
            alt="BusyHub Logo"
            width={100}
            height={73}
            className="mx-auto"
            priority
          />

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full text-sm">
            <div className="w-2 h-2 bg-lime-300 rounded-full animate-pulse"></div>
            <p>Developed for busy people</p>
          </div>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
            <span>Make time</span>
            <br />
            <span className="text-lime-400">visible</span>
          </h2>

          <div className="max-w-fit mx-auto">
            <EventsPanel
              events={fakeData}
              aria-label="A visual timeline of Google Calendar events displayed as a heatmap panel"
            />
          </div>

          <form action={login}>
            <button
              type="submit"
              className="group bg-lime-400 hover:bg-lime-300 text-zinc-900 font-bold py-4 px-8 rounded-xl inline-flex items-center gap-3 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-lime-500/20"
            >
              <LogInIcon
                size={20}
                className="group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
              <span className="text-lg">Continue with Google</span>
            </button>
          </form>

          <h1 className="text-xl md:text-2xl lg:text-4xl max-w-2xl mx-auto leading-relaxed">
            Because your calendar isn't just a tool — it's your story,
            visualized.
          </h1>
        </header>

        <section>
          <h2 className="text-4xl font-bold tracking-tight mb-8">
            How it works
          </h2>

          <div className="max-w-4xl mx-auto">
            <ul className="grid md:grid-cols-3 gap-8">
              <li className="group space-y-4 p-6 rounded-lg border border-zinc-800 hover:border-lime-400/30 transition-all duration-300 hover:bg-zinc-900/30">
                <div
                  className="w-12 h-12 bg-lime-500/10 rounded-xl mx-auto flex items-center justify-center group-hover:bg-lime-400/20 transition-colors"
                  aria-hidden="true"
                >
                  <LogInIcon className="text-lime-400" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-zinc-100">
                  Sign in with Google
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  Just one click. Fast, safe, and secure.
                </p>
              </li>

              <li
                className="group space-y-4 p-6 rounded-lg border border-zinc-800 hover:border-lime-400/30 transition-all duration-300 hover:bg-zinc-900/30"
                aria-hidden="true"
              >
                <div className="w-12 h-12 bg-lime-500/10 rounded-xl mx-auto flex items-center justify-center group-hover:bg-lime-400/20 transition-colors">
                  <CalendarCheckIcon className="text-lime-400" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-zinc-100">
                  Sync your calendar
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  We load your events for the year.
                </p>
              </li>

              <li
                className="group space-y-4 p-6 rounded-lg border border-zinc-800 hover:border-lime-400/30 transition-all duration-300 hover:bg-zinc-900/30"
                aria-hidden="true"
              >
                <div className="w-12 h-12 bg-lime-500/10 rounded-xl mx-auto flex items-center justify-center group-hover:bg-lime-400/20 transition-colors">
                  <LayoutGridIcon className="text-lime-400" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-zinc-100">
                  See your timeline
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  A year of effort, finally worth showing off.
                </p>
              </li>
            </ul>
          </div>
        </section>

        <section className="aspect-video max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto relative overflow-hidden rounded-lg shadow-xl">
          <h2 className="sr-only">App Screenshot</h2>
          <Image
            src="/images/app.jpg"
            fill
            sizes="(max-width: 480px) 320px, (max-width: 768px) 448px, (max-width: 1024px) 512px, 672px"
            className="object-cover"
            alt="A screenshot of the app showing the heatmap panel and calendar events of the app creator, Denis Toledo"
          />
        </section>

        <section className="max-w-4xl mx-auto">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-100">
              What does your year look like?
            </h2>
            <p className="text-zinc-400 text-lg">
              Join thousands of busy professionals who visualize their timeline
              with us. It's free, secure, and takes seconds to get started.
            </p>
            <form action={login}>
              <button
                type="submit"
                className="group bg-lime-400 hover:bg-lime-300 text-zinc-900 font-bold py-4 px-8 rounded-xl inline-flex items-center gap-3 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-lime-500/20"
              >
                <LogInIcon
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
                <span className="text-lg">Let's go — log in with Google</span>
              </button>
            </form>
          </div>
        </section>

        <footer className="max-w-4xl mx-auto space-y-2 text-zinc-400">
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
          <p className="text-xs">
            <a href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </a>{' '}
            |{' '}
            <a href="/terms-of-service" className="hover:underline">
              Terms of Service
            </a>
          </p>
        </footer>
      </main>

      <div className="fixed top-20 left-10 w-32 h-32 bg-lime-500/5 rounded-full blur-xl animate-pulse"></div>
      <div className="fixed bottom-20 right-10 w-24 h-24 bg-lime-500/10 rounded-full blur-lg animate-pulse delay-1000"></div>
    </>
  );
}
