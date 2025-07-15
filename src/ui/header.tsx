import { CalendarDaysIcon } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex justify-between items-center bg-zinc-950/50 p-4 fixed top-0 left-0 right-0 z-20 backdrop-blur-md">
      <CalendarDaysIcon size={24} />
    </header>
  );
}
