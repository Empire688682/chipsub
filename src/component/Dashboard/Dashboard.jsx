import Link from "next/link";
import { LayoutDashboard, LogOut, Wallet, Wifi, User } from "lucide-react";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg hidden md:flex flex-col">
        <div className="px-6 py-5 border-b">
          <h2 className="text-xl font-bold text-blue-600">Chipsub</h2>
        </div>
        <nav className="flex-1 px-6 py-4 space-y-4">
          <NavItem href="/dashboard" icon={<LayoutDashboard size={18} />}>
            Dashboard
          </NavItem>
          <NavItem href="/dashboard/data" icon={<Wifi size={18} />}>
            Buy Data
          </NavItem>
          <NavItem href="/dashboard/wallet" icon={<Wallet size={18} />}>
            Wallet
          </NavItem>
          <NavItem href="/dashboard/profile" icon={<User size={18} />}>
            Profile
          </NavItem>
        </nav>
        <div className="px-6 py-4 border-t">
          <button className="flex items-center gap-2 text-red-500 hover:text-red-600">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}

function NavItem({ href, icon, children }) {
  return (
    <Link href={href} className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition">
      {icon}
      <span>{children}</span>
    </Link>
  );
}
