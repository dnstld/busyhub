import { CalendarCheckIcon, LayoutGridIcon, LogInIcon } from 'lucide-react';
import { login } from './actions/auth';

import EventsPanel from '@/ui/events-panel';
import fakeData from '../fake-data.json';

export default async function HomePage() {
  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100">
      <div className="absolute inset-0 bg-gradient-to-br from-lime-300/7 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 py-8 text-center space-y-8 z-10 relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full text-sm text-zinc-400">
          <div className="w-2 h-2 bg-lime-300 rounded-full animate-pulse"></div>
          <p>For busy people</p>
        </div>

        <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
          <span className="text-zinc-100">Track your</span>
          <br />
          <span className="text-lime-300">chaos</span>
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
            className="group relative bg-lime-500 hover:bg-lime-300 text-zinc-900 font-bold py-4 px-8 rounded-xl inline-flex items-center gap-3 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-lime-500/20"
          >
            <span className="text-lg">Continue with Google</span>
            <LogInIcon
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </form>

        <h1 className="text-xl md:text-2xl lg:text-4xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Visualize your year calendar with a timeline that tells your story
        </h1>
      </div>

      <div className="py-24 px-6 z-10 relative">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group text-center space-y-4 p-6 rounded-lg border border-zinc-800 hover:border-lime-400/30 transition-all duration-300 hover:bg-zinc-900/30">
              <div className="w-12 h-12 bg-lime-500/10 rounded-xl mx-auto flex items-center justify-center group-hover:bg-lime-400/20 transition-colors">
                <LogInIcon className="text-lime-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100">
                Login with Google
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                One click, no forms. You're safe here
              </p>
            </div>

            <div className="group text-center space-y-4 p-6 rounded-lg border border-zinc-800 hover:border-lime-400/30 transition-all duration-300 hover:bg-zinc-900/30">
              <div className="w-12 h-12 bg-lime-500/10 rounded-xl mx-auto flex items-center justify-center group-hover:bg-lime-400/20 transition-colors">
                <CalendarCheckIcon className="text-lime-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100">
                Meetings load like magic
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                We connect to your calendar, you get a stress-free view
              </p>
            </div>

            <div className="group text-center space-y-4 p-6 rounded-lg border border-zinc-800 hover:border-lime-400/30 transition-all duration-300 hover:bg-zinc-900/30">
              <div className="w-12 h-12 bg-lime-500/10 rounded-xl mx-auto flex items-center justify-center group-hover:bg-lime-400/20 transition-colors">
                <LayoutGridIcon className="text-lime-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100">
                See your year, beautifully
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                A timeline that shows where your time really went
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="pb-24 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-100">
            Ready to tame the chaos?
          </h2>
          <p className="text-zinc-400 text-lg">
            Join thousands of busy professionals who've transformed their
            productivity
          </p>
          {!user && (
            <form action={login}>
              <button
                type="submit"
                className="bg-zinc-100 hover:bg-white text-zinc-900 font-bold py-3 px-6 rounded-lg inline-flex items-center gap-2 cursor-pointer transition-all duration-300 hover:shadow-lg"
              >
                <LogInIcon size={18} />
                <span>Get Started Free</span>
              </button>
            </form>
          )}
        </div>
      </div> */}

      <div className="fixed top-20 left-10 w-32 h-32 bg-lime-500/5 rounded-full blur-xl animate-pulse"></div>
      <div className="fixed bottom-20 right-10 w-24 h-24 bg-lime-500/10 rounded-full blur-lg animate-pulse delay-1000"></div>
    </div>
  );
}
