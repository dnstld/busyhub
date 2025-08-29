'use client';

import { logout } from '@/app/actions/logout';
import { useUser } from '@/providers';
import { LogOutIcon } from 'lucide-react';
import Image from 'next/image';

export default function Profile() {
  const user = useUser();

  return (
    <section
      className="flex items-center lg:flex-col lg:items-start gap-4"
      aria-labelledby="your-profile"
    >
      <h2 id="your-profile" className="sr-only">
        Your profile
      </h2>
      <Image
        className="w-20 sm:w-32 h-20 sm:h-32 rounded-full"
        src={user?.image || ''}
        alt={`${user?.name ?? 'User'} avatar`}
        width={100}
        height={100}
        priority
      />
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-2xl font-bold">{user?.name}</p>
          <p className="text-xs text-zinc-400">{user?.email}</p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="group flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <LogOutIcon
              size={16}
              aria-hidden="true"
              className="group-hover:translate-x-1 transition-transform"
            />
            Sign out
          </button>
        </form>
      </div>
    </section>
  );
}
