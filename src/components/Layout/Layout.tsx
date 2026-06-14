import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { CompareBar } from '@/components/CompareBar';

export function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <main className="pb-24">
        <Outlet />
      </main>
      <CompareBar />
    </div>
  );
}
