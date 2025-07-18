import Image from 'next/image';

export default function Header() {
  return (
    <header className="flex justify-between items-center bg-zinc-950/50 p-4 fixed top-0 left-0 right-0 z-20 backdrop-blur-md">
      <div className="flex items-baseline gap-2">
        <Image
          src="./images/logo-vertical.svg"
          alt="BusyHub Logo"
          width={125}
          height={32}
        />
      </div>
    </header>
  );
}
