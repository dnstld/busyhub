'use client';

import { motion } from 'framer-motion';
import {
  BarChart2Icon,
  CalendarCheckIcon,
  LogInIcon,
  TerminalIcon,
} from 'lucide-react';

import { login } from '@/app/actions/login';
import HeatmapChart from '@/components/presenters/charts/heatmap-chart';
import ParallaxImage from '@/components/ui/parallax-image';
import Image from 'next/image';
import fakeData from '../fake-data.json';

export default function RootPage() {
  return (
    <main className="relative z-10 px-4 py-16 space-y-16 lg:space-y-24 text-center">
      <header className="max-w-7xl mx-auto text-center space-y-8">
        <Image
          src="./images/logo-horizontal.svg"
          alt="BusyHub Logo. A calendar on fire."
          width={100}
          height={73}
          className="mx-auto"
          priority
        />

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full text-sm">
          <div className="w-2 h-2 bg-lime-300 rounded-full animate-pulse"></div>
          <p>Made for busy people</p>
        </div>

        <motion.h2
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2,
              },
            },
          }}
        >
          <motion.span
            className="block"
            variants={{
              hidden: { opacity: 0, y: 50, rotateX: -90 },
              visible: {
                opacity: 1,
                y: 0,
                rotateX: 0,
                transition: {
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                },
              },
            }}
          >
            Make time
          </motion.span>
          <motion.span
            className="block text-lime-400"
            variants={{
              hidden: { opacity: 0, y: 50, rotateX: -90 },
              visible: {
                opacity: 1,
                y: 0,
                rotateX: 0,
                transition: {
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                },
              },
            }}
          >
            visible
          </motion.span>
        </motion.h2>

        <section
          className="max-w-fit mx-auto"
          aria-describedby="heatmap-description"
        >
          <p id="heatmap-description" className="sr-only">
            This is a visual heatmap showing a sample timeline of calendar
            activity. Lighter squares represent days with more events. This
            preview uses fictional data and is not interactive. Your actual
            calendar heatmap will appear here after connecting your Google
            Calendar.
          </p>
          <HeatmapChart events={fakeData} />
        </section>

        <form action={login}>
          <button
            type="submit"
            className="group bg-lime-400 hover:bg-lime-300 text-zinc-900 text-lg font-bold py-4 px-8 rounded-xl inline-flex items-center gap-3 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-lime-500/20"
          >
            <LogInIcon
              size={20}
              className="group-hover:translate-x-1 transition-transform"
              aria-hidden="true"
            />
            Log in with Google
          </button>
        </form>

        <h1 className="text-xl md:text-2xl lg:text-4xl max-w-2xl mx-auto leading-relaxed">
          Your calendar is more than meetings.
          <br />
          It's your life, visualized.
        </h1>
      </header>

      <section>
        <h2 className="text-4xl font-bold tracking-tight mb-8">How it works</h2>

        <ul className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
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
              Private by default, protected by Google
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
              Connect your calendar
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              We only read — never edit or write
            </p>
          </li>

          <li
            className="group space-y-4 p-6 rounded-lg border border-zinc-800 hover:border-lime-400/30 transition-all duration-300 hover:bg-zinc-900/30"
            aria-hidden="true"
          >
            <div className="w-12 h-12 bg-lime-500/10 rounded-xl mx-auto flex items-center justify-center group-hover:bg-lime-400/20 transition-colors">
              <BarChart2Icon className="text-lime-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-zinc-100">
              See your year
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Your events, transformed into interactive charts
            </p>
          </li>
        </ul>
      </section>

      <ParallaxImage />

      <section className="max-w-4xl mx-auto">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-100">
            Time flies — make it visible
          </h2>
          <p className="text-zinc-400 text-lg">
            Turn your calendar into clear insights
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
              <span className="text-lg">Log in with Google</span>
            </button>
          </form>
        </div>
      </section>

      <footer className="max-w-4xl mx-auto space-y-2 text-zinc-400">
        <p>
          <TerminalIcon className="inline-block mr-1" aria-hidden="true" />
          Built with care by{' '}
          <a
            href="https://www.linkedin.com/in/denistoledo/"
            target="_blank"
            className="text-lime-400 underline hover:opacity-50 transition-opacity font-semibold"
          >
            Denis Toledo
          </a>
        </p>
        <p className="text-sm">
          <a
            href="/privacy-policy"
            className="underline hover:opacity-50 transition-opacity"
          >
            Privacy Policy
          </a>{' '}
          |{' '}
          <a
            href="/terms-of-service"
            className="underline hover:opacity-50 transition-opacity"
          >
            Terms of Service
          </a>
        </p>
      </footer>
    </main>
  );
}
