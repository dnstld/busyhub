import { login, logout } from '@/app/actions/auth';
import { auth } from '@/auth';

export default async function Header() {
  const session = await auth();
  const user = session?.user;

  return (
    <header>
      <h1>Calendar</h1>

      {user ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <form action={logout}>
            <button type="submit">Sign out</button>
          </form>
        </div>
      ) : (
        <form action={login}>
          <button type="submit">Signin with Google</button>
        </form>
      )}
    </header>
  );
}
