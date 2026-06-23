import Link from "next/link";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="flex w-full items-center justify-between gap-4 px-8 py-3 xl:px-10">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-semibold tracking-tight text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
            >
              DecisionDesk
            </Link>
            <nav aria-label="Primary">
              <ul className="flex items-center gap-4 text-sm">
                <li>
                  <Link
                    href="/"
                    className="text-slate-700 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <span className="rounded-sm border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-900">
            Demo environment
          </span>
        </div>
      </header>
      <main id="main-content" className="w-full flex-1 px-8 py-6 xl:px-10">
        {children}
      </main>
    </div>
  );
}
