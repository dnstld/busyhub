import { auth, signIn, signOut } from '@/auth';

export default async function SignIn() {
  const session = await auth();
  const user = session?.user;

  if (user) {
    return (
      <div>
        <p>Welcome, {user.name}!</p>
        <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <button type="submit">Sign out</button>
        </form>
      </div>
    );
  }

  return (
    <form
      action={async () => {
        'use server';
        await signIn('google');
      }}
    >
      <button type="submit">Signin with Google</button>
    </form>
  );
}
