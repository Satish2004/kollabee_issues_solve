import React, { FC, useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserDropdown } from './user-dropdown';
import { authApi } from '@/lib/api/auth';
import {
  Home,
  Store,
  Users,
  MessageSquare,
  Bell,
  Mail,
  StoreIcon,
  PenTool,
  Headphones,
  UserCog,
  Settings,
  Share,
  NotebookPen,
  Menu as MenuIcon,
  X as CloseIcon,
} from 'lucide-react';

// Custom hook using React state and effect to lock body scroll
function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    if (locked) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalStyle;
    }
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [locked]);
}

interface RouteItem {
  label: string;
  icon: FC<React.SVGProps<SVGSVGElement>>;
  href: string;
}

const routes: RouteItem[] = [
  { label: 'Dashboard', icon: Home, href: '/seller' },
  { label: 'Your Products', icon: Store, href: '/seller/products' },
  { label: 'Customers', icon: Users, href: '/seller/customers' },
  { label: 'Messages', icon: MessageSquare, href: '/seller/messages' },
  { label: 'Requests', icon: StoreIcon, href: '/seller/request' },
  { label: 'Advertise', icon: Headphones, href: '/seller/advertise' },
  { label: 'Profile Manage', icon: UserCog, href: '/seller/profile/seller' },
  { label: 'Post New Product', icon: StoreIcon, href: '/seller/add-product' },
  { label: 'Settings', icon: Settings, href: '/seller/settings' },
  { label: 'Chat', icon: MessageSquare, href: '/seller/chat' },
  { label: 'Notifications', icon: Bell, href: '/seller/notifications' },
  { label: 'Invite', icon: Share, href: '/seller/invite' },
  { label: 'Help', icon: NotebookPen, href: '/seller/help' },
];

const SellerLayoutHeader: FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setMenuOpen] = useState(false);

  // Use React-style hook to lock body scroll
  useLockBodyScroll(isMenuOpen);

  // Fetch current user
  useEffect(() => {
    let mounted = true;
    authApi.getCurrentUser()
      .then((u) => mounted && setUser(u))
      .catch(console.error);
    return () => { mounted = false; };
  }, []);

  // Determine current route
  const currentRoute = useMemo(() => {
    if (pathname.startsWith('/seller/update-product/')) {
      return { label: 'Update Product', icon: PenTool, href: pathname };
    }
    if (pathname.startsWith('/seller/products/')) {
      return { label: 'Product', icon: Store, href: pathname };
    }
    return routes.find(r => r.href === pathname) || routes[0];
  }, [pathname]);

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const handleLogout = async () => {
    try {
      await authApi.logout();
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const NavActions: FC = () => (
    <>
      <Button variant="outline" className="bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white p-5 font-semibold">
        Upgrade
      </Button>
      {['/seller/notifications', '/seller/chat'].map((href) => {
        const Icon = href.includes('notifications') ? Bell : Mail;
        return (
          <Link key={href} href={href}>
            <Button variant="outline" size="icon" className="border-neutral-300">
              <Icon className="h-5 w-5" />
            </Button>
          </Link>
        );
      })}
      <UserDropdown currentUser={user} onLogout={handleLogout} />
    </>
  );

  return (
    <header className="sticky top-0 z-50 flex w-[95%] items-center justify-between rounded-xl bg-white p-5 text-lg font-semibold capitalize mx-auto my-6">
      <div className="flex items-center gap-2">
        <currentRoute.icon className="h-5 w-5" />
        <span>{currentRoute.label}</span>
      </div>

      {/* Desktop nav */}
      <nav className="hidden items-center gap-4 md:flex">
        <NavActions />
      </nav>

      {/* Mobile burger */}
      <div className="md:hidden">
        <Button variant="ghost" size="icon" onClick={toggleMenu}>
          {isMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[1000] flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={toggleMenu} />
          <aside className="relative flex w-3/4 max-w-xs flex-col bg-white shadow-xl">
            <div className="flex justify-end p-4">
              <Button variant="ghost" size="icon" onClick={toggleMenu}>
                <CloseIcon className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex flex-col gap-6 p-6">
              <NavActions />
            </div>
          </aside>
        </div>
      )}
    </header>
  );
};

export default SellerLayoutHeader;
