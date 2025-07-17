import { logout } from '@/app/actions/logout';
import { auth } from '@/lib/auth';
import { LogOutIcon } from 'lucide-react';
import Image from 'next/image';

export default async function Profile() {
  const session = await auth();
  const user = session?.user;

  return (
    <section>
      <div className="flex items-center lg:flex-col lg:items-start gap-4">
        <Image
          className="w-20 sm:w-32 h-20 sm:h-32 rounded-full"
          src={user?.image || ''}
          alt={`${user?.name ?? 'User'} avatar`}
          width={100}
          height={100}
          priority
        />
        <div className="flex flex-col gap-1">
          <p className="text-2xl font-bold">{user?.name}</p>
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-1 text-zinc-500 hover:text-zinc-400 transition-colors cursor-pointer"
            >
              <LogOutIcon size={16} />
              Sign out
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
