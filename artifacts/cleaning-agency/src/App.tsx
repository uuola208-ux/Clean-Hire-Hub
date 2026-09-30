import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CookieBanner } from '@/components/CookieBanner';

// Pages
import Home from '@/pages/Home';
import About from '@/pages/About';
import Jobs from '@/pages/Jobs';
import Apply from '@/pages/Apply';
import Contact from '@/pages/Contact';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';

// Admin Pages
import Dashboard from '@/pages/admin/Dashboard';
import ApplicantDetail from '@/pages/admin/ApplicantDetail';
import SiteSettings from '@/pages/admin/SiteSettings';
import AdminLogin from '@/pages/admin/AdminLogin';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

const queryClient = new QueryClient();

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { data: session, isLoading } = useQuery({
    queryKey: ['admin-session'],
    queryFn: async () => {
      const response = await fetch('/api/admin/auth/session');
      if (!response.ok) throw new Error('Unable to check admin session');
      return response.json() as Promise<{ authenticated: boolean; configured: boolean }>;
    },
    retry: false,
  });

  if (isLoading) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Checking admin access…</div>;
  }

  if (!session?.authenticated) {
    return <AdminLogin configured={session?.configured ?? false} onLogin={() => {
      queryClient.invalidateQueries({ queryKey: ['admin-session'] });
    }} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <header className="bg-primary text-primary-foreground border-b border-primary-foreground/10 sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold tracking-tight">TJ FreshSpace</span>
            <span className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full font-medium ml-2">Admin Portal</span>
          </div>
          <nav className="flex items-center gap-4 text-sm font-medium">
            <a href="/admin" className="hover:text-secondary transition-colors">Dashboard</a>
            <a href="/admin/site" className="hover:text-secondary transition-colors">Website settings</a>
            <a href="/" className="hover:text-secondary transition-colors text-primary-foreground/70">Public Site</a>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-white/10"
              onClick={async () => {
                await fetch('/api/admin/auth/logout', { method: 'POST' });
                queryClient.setQueryData(['admin-session'], { authenticated: false, configured: true });
              }}
            >
              Sign out
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1 py-8">
        {children}
      </main>
    </div>
  );
}

function Router() {
  const [location] = useLocation();
  const isAdmin = location.startsWith('/admin');

  if (isAdmin) {
    return (
      <AdminLayout>
        <Switch>
          <Route path="/admin" component={Dashboard} />
          <Route path="/admin/site" component={SiteSettings} />
          <Route path="/admin/applications/:id" component={ApplicantDetail} />
          <Route component={NotFound} />
        </Switch>
      </AdminLayout>
    );
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/jobs" component={Jobs} />
        <Route path="/apply" component={Apply} />
        <Route path="/contact" component={Contact} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
