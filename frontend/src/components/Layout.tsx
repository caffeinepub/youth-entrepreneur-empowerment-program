import { useState } from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { Menu, X, Sprout, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Register', path: '/register' },
  { label: 'Directory', path: '/directory' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Resources', path: '/resources' },
  { label: 'Stories', path: '/stories' },
  { label: 'Community', path: '/community' },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  const appId = typeof window !== 'undefined' ? encodeURIComponent(window.location.hostname) : 'youth-entrepreneur-india';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top accent stripe */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, oklch(0.68 0.20 55), oklch(0.38 0.12 145), oklch(0.68 0.20 55))' }} />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-xs">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
              <img
                src="/assets/generated/program-logo.dim_256x256.png"
                alt="YEEP Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.className = 'w-10 h-10 rounded-xl flex items-center justify-center saffron-stripe';
                    parent.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/><path d="M2 12h4"/></svg>';
                  }
                }}
              />
            </div>
            <div className="leading-tight">
              <div className="font-heading font-800 text-sm text-saffron-600 tracking-tight">YEEP India</div>
              <div className="text-xs text-muted-foreground font-medium hidden sm:block">Youth Entrepreneur Empowerment</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  currentPath === link.path
                    ? 'bg-primary/10 text-saffron-600 font-semibold'
                    : 'text-foreground/70 hover:text-foreground hover:bg-accent'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-2">
            <Link to="/register" className="hidden sm:block">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-saffron">
                <Sprout className="w-3.5 h-3.5 mr-1.5" />
                Join Now
              </Button>
            </Link>
            <button
              className="lg:hidden p-2 rounded-md hover:bg-accent transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-card px-4 py-3 space-y-1 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPath === link.path
                    ? 'bg-primary/10 text-saffron-600 font-semibold'
                    : 'text-foreground/70 hover:text-foreground hover:bg-accent'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link to="/register" onClick={() => setMobileOpen(false)}>
                <Button size="sm" className="w-full bg-primary text-primary-foreground font-semibold">
                  <Sprout className="w-3.5 h-3.5 mr-1.5" />
                  Join as Entrepreneur
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-forest-900 text-cream-100 mt-auto">
        {/* Top stripe */}
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, oklch(0.68 0.20 55), oklch(0.38 0.12 145), oklch(0.68 0.20 55))' }} />

        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg overflow-hidden">
                  <img
                    src="/assets/generated/program-logo.dim_256x256.png"
                    alt="YEEP"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
                <span className="font-heading font-bold text-saffron-300 text-lg">YEEP India</span>
              </div>
              <p className="text-cream-300 text-sm leading-relaxed">
                Empowering young entrepreneurs across every village and panchayat in India — to feed the world and protect the environment.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-cream-100 mb-3 text-sm uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2">
                {navLinks.slice(0, 5).map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-cream-300 hover:text-saffron-300 text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mission */}
            <div>
              <h4 className="font-semibold text-cream-100 mb-3 text-sm uppercase tracking-wider">Our Mission</h4>
              <ul className="space-y-1.5 text-sm text-cream-300">
                <li>🌾 100–1000 entrepreneurs per village</li>
                <li>🌱 Sustainable agriculture & food security</li>
                <li>🌍 Environmental protection</li>
                <li>🤝 Connect, equip & motivate youth</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-forest-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream-400">
            <span>© {new Date().getFullYear()} YEEP India. Empowering Rural Youth.</span>
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3 h-3 text-saffron-400 fill-saffron-400 mx-0.5" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-saffron-300 hover:text-saffron-200 font-medium transition-colors"
              >
                caffeine.ai
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
