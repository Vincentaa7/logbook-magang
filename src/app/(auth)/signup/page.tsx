import Link from "next/link";
import { signup } from "./actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 p-4 transition-colors">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-4 shadow-lg shadow-blue-500/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Logbook Magang</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Buat akun baru</p>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          {message && (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400 text-sm text-center">
              <p className="font-semibold text-base mb-1">✅ Pendaftaran berhasil!</p>
              <p>{decodeURIComponent(message)}</p>
              <p className="mt-1 opacity-80">Klik link di email untuk mengaktifkan akun.</p>
              <Link href="/login" className="inline-block mt-3 text-blue-600 dark:text-blue-400 hover:text-blue-500 font-medium">
                Ke halaman Login →
              </Link>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm">
              {decodeURIComponent(error)}
            </div>
          )}

          {!message && (
            <form action={signup} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                <input
                  id="email" name="email" type="email" required placeholder="nama@email.com"
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <input
                  id="password" name="password" type="password" required minLength={6} placeholder="Minimal 6 karakter"
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <button type="submit" className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-blue-500/25">
                Daftar
              </button>
            </form>
          )}

          {!message && (
            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 font-medium">Masuk di sini</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
