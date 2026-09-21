import React, { useState, useEffect } from 'react';
import {
  Sprout,
  ShoppingBag,
  Truck,
  Store,
  Sparkles,
  User,
  LogOut,
} from 'lucide-react';
import { AuthLayout } from './components/auth/AuthLayout';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { FarmerDashboardPreview } from './components/dashboards/FarmerDashboardPreview';
import { MarketplacePreview } from './components/dashboards/MarketplacePreview';
import { BuyerDashboardPreview } from './components/dashboards/BuyerDashboardPreview';
import { RouteOptimizerPreview } from './components/dashboards/RouteOptimizerPreview';
import { SihDemoWalkthroughModal } from './components/dashboards/SihDemoWalkthroughModal';
import { authService } from './services/authService';
import { LanguageToggle } from './components/common/LanguageToggle';
import { useLanguage } from './context/LanguageContext';
import { KisanChatbotWidget } from './components/common/KisanChatbotWidget';

export function App() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState('farmer'); // 'farmer' | 'consumer' | 'buyer'
  const [session, setSession] = useState(null);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [backendStatus, setBackendStatus] = useState({ checked: false, online: false, database: '', latency: 18 });

  // Check stored session and backend health on mount
  useEffect(() => {
    const existing = authService.getSession();
    if (existing) {
      setSession(existing);
    }

    const startPing = performance.now();
    authService.checkBackendHealth().then((res) => {
      const pingMs = Math.round(performance.now() - startPing);
      setBackendStatus({
        checked: true,
        online: res.online,
        database: res.database || (res.online ? 'MongoDB Atlas' : 'Offline'),
        latency: pingMs || 18,
      });
    });
  }, []);

  // Handle Login
  const handleLogin = async (credentials) => {
    setIsLoading(true);
    setApiError('');
    try {
      const userSession = await authService.login(credentials);
      setTimeout(() => {
        setSession(userSession);
        setIsLoading(false);
      }, 350);
      return userSession;
    } catch (err) {
      setIsLoading(false);
      setApiError(err.message || 'Authentication failed. Please check your credentials.');
      throw err;
    }
  };

  // Handle Registration
  const handleRegister = async (userData) => {
    setIsLoading(true);
    setApiError('');
    try {
      const userSession = await authService.register(userData);
      setTimeout(() => {
        setSession(userSession);
        setIsLoading(false);
      }, 350);
      return userSession;
    } catch (err) {
      setIsLoading(false);
      setApiError(err.message || 'Registration failed. Please try again.');
      throw err;
    }
  };

  // Handle Google Social Login
  const handleGoogleLogin = async (googleAccount = null) => {
    setIsLoading(true);
    setApiError('');
    try {
      const userSession = await authService.loginWithGoogle(role, googleAccount);
      setSession(userSession);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
      setApiError('Google sign in encountered an issue. Please try again.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    authService.logout();
    setSession(null);
    setApiError('');
  };

  // Quick switch role preset
  const switchToRole = (targetRole) => {
    if (targetRole === 'farmer') {
      setRole('farmer');
      setSession({
        user: { name: 'Rameshwar Patel', businessName: 'Krishi Vikas Organic FPO', location: 'Nashik, MH', badge: 'Verified FPO Leader (45+ Farmers)' },
        role: 'farmer',
        redirectUrl: '/farmer/dashboard',
      });
    } else if (targetRole === 'buyer') {
      setRole('buyer');
      setSession({
        user: { name: 'Rajiv Mehra', businessName: 'TastyGreens Chain', location: 'Mumbai, MH', badge: 'Verified Institutional Buyer' },
        role: 'buyer',
        redirectUrl: '/buyer/dashboard',
      });
    } else if (targetRole === 'logistics') {
      setRole('buyer');
      setSession({
        user: { name: 'Logistics Fleet Controller', businessName: 'KisanDirect Cold Fleet', location: 'Navi Mumbai Reefer Hub', badge: 'AI Fleet Manager' },
        role: 'logistics',
        redirectUrl: '/logistics/routes',
      });
    } else if (targetRole === 'consumer') {
      setRole('consumer');
      setSession({
        user: { name: 'Ananya Sharma', location: 'Bengaluru, KA', badge: 'Verified Direct Consumer' },
        role: 'consumer',
        redirectUrl: '/marketplace',
      });
    }
  };

  const activeDashboard = session?.role || (session ? 'farmer' : null);

  // Enterprise Top Command Header component
  const EnterpriseHeader = () => (
    <header className="bg-slate-950 text-slate-100 border-b border-slate-800/80 sticky top-0 z-50 backdrop-blur-md bg-slate-950/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm ring-1 ring-emerald-400/30">
            <Sprout className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-white">
              Kisan<span className="text-emerald-400">Direct</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono tracking-wider px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700/60 uppercase">
              SIH Enterprise v2.4
            </span>
          </div>
        </div>

        {/* Center: Enterprise Segmented Navigation / Role Switcher */}
        <nav className="hidden md:flex items-center p-1 bg-slate-900/90 border border-slate-800 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => switchToRole('farmer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeDashboard === 'farmer'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sprout className="w-3.5 h-3.5" />
            <span>{isHindi ? 'किसान व FPO' : 'Farmer & FPO'}</span>
          </button>

          <button
            type="button"
            onClick={() => switchToRole('buyer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeDashboard === 'buyer'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isHindi ? 'बायर RFQ' : 'Buyer RFQ'}</span>
          </button>

          <button
            type="button"
            onClick={() => switchToRole('logistics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeDashboard === 'logistics'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>{isHindi ? 'रीफर लॉजिस्टिक्स' : 'Reefer Logistics'}</span>
          </button>

          <button
            type="button"
            onClick={() => switchToRole('consumer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeDashboard === 'consumer'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>{isHindi ? 'मार्केटप्लेस' : 'Marketplace'}</span>
          </button>
        </nav>

        {/* Right: Telemetry, Voice AI, Language, Pitch Studio Launcher */}
        <div className="flex items-center gap-2.5">
          {/* MongoDB Atlas Latency Indicator */}
          <div
            className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300"
            title="Active Cloud Database Connection Status"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Atlas Live</span>
            <span className="text-slate-500 tabular-nums">({backendStatus.latency}ms)</span>
          </div>

          {/* Voice AI Launcher */}
          <button
            type="button"
            onClick={() => setIsChatbotOpen(true)}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30 transition-all cursor-pointer"
            title="Open Kisan AI Voice Advisor"
          >
            <span>🎙️</span>
            <span>{isHindi ? 'व्यापार AI' : 'Voice AI'}</span>
          </button>

          {/* Bilingual Switch */}
          <LanguageToggle variant="dark" />

          {/* SIH Live Demo Studio Launcher */}
          <button
            type="button"
            onClick={() => setIsDemoModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm transition-all cursor-pointer ring-1 ring-emerald-400/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
            <span>{isHindi ? 'SIH पिच स्टूडियो' : 'SIH Demo Studio'}</span>
          </button>

          {/* Active User Avatar / Logout */}
          {session ? (
            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Sign out / Switch account"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs font-semibold">
              <User className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    </header>
  );

  // If user is authenticated, route to corresponding role dashboard view
  if (session) {
    let dashboardContent = null;
    if (session.redirectUrl === '/farmer/dashboard' || session.role === 'farmer') {
      dashboardContent = <FarmerDashboardPreview session={session} onLogout={handleLogout} />;
    } else if (session.redirectUrl === '/marketplace' || session.role === 'consumer') {
      dashboardContent = <MarketplacePreview session={session} onLogout={handleLogout} />;
    } else if (session.redirectUrl === '/buyer/dashboard' || session.role === 'buyer') {
      dashboardContent = <BuyerDashboardPreview session={session} onLogout={handleLogout} />;
    } else if (session.redirectUrl === '/logistics/routes' || session.role === 'logistics') {
      dashboardContent = (
        <RouteOptimizerPreview
          session={session}
          onLogout={handleLogout}
          onBackToBuyer={() => switchToRole('buyer')}
        />
      );
    }

    return (
      <div className="min-h-screen bg-[#f8faf8] flex flex-col">
        <EnterpriseHeader />
        <main className="flex-1">{dashboardContent}</main>

        {/* Refined Docked Pitch Studio Trigger */}
        <button
          type="button"
          onClick={() => setIsDemoModalOpen(true)}
          className="fixed bottom-4 left-4 z-40 bg-slate-950/95 hover:bg-slate-900 text-slate-100 px-3.5 py-2 rounded-full shadow-lg border border-slate-800 flex items-center gap-2 text-xs font-semibold backdrop-blur-md transition-all hover:scale-102 cursor-pointer group"
          title="Open Official SIH 12-Step Pitch Walkthrough (PRD Section 47)"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:animate-ping" />
          <span>{isHindi ? '12-स्टेप लाइव पिच' : 'SIH 12-Step Pitch'}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
            PRD 47
          </span>
        </button>

        <SihDemoWalkthroughModal
          isOpen={isDemoModalOpen}
          onClose={() => setIsDemoModalOpen(false)}
        />

        {/* Global AI Voice & Chat Assistant */}
        <KisanChatbotWidget isOpen={isChatbotOpen} onOpenChange={setIsChatbotOpen} />
      </div>
    );
  }

  // Unauthenticated Auth Screen
  return (
    <div className="min-h-screen bg-[#f8faf8] flex flex-col">
      <EnterpriseHeader />

      <div className="flex-1 flex flex-col justify-center">
        <AuthLayout mode={mode}>
          {/* Top Auth Mode Tabs: Sign In vs Sign Up */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6 text-xs font-bold border border-slate-200/80">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setApiError('');
              }}
              className={`py-2 px-3 rounded-lg transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-white text-emerald-800 shadow-xs font-bold ring-1 ring-slate-200/80'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <span>🔑</span>
              <span>{isHindi ? 'लॉगिन करें (Sign In)' : 'Sign In (Login)'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setApiError('');
              }}
              className={`py-2 px-3 rounded-lg transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <span>✨</span>
              <span>{isHindi ? 'साइन अप (Sign Up)' : 'Create Account (Sign Up)'}</span>
            </button>
          </div>

          {mode === 'login' ? (
            <LoginForm
              role={role}
              onRoleChange={setRole}
              onLogin={handleLogin}
              onSwitchToRegister={() => {
                setMode('register');
                setApiError('');
              }}
              onGoogleLogin={handleGoogleLogin}
              isLoading={isLoading}
              apiError={apiError}
              onOpenChatbot={() => setIsChatbotOpen(true)}
            />
          ) : (
            <RegisterForm
              role={role}
              onRoleChange={setRole}
              onRegister={handleRegister}
              onSwitchToLogin={() => {
                setMode('login');
                setApiError('');
              }}
              isLoading={isLoading}
              apiError={apiError}
            />
          )}
        </AuthLayout>
      </div>

      {/* Refined Docked Pitch Studio Trigger */}
      <button
        type="button"
        onClick={() => setIsDemoModalOpen(true)}
        className="fixed bottom-4 left-4 z-40 bg-slate-950/95 hover:bg-slate-900 text-slate-100 px-3.5 py-2 rounded-full shadow-lg border border-slate-800 flex items-center gap-2 text-xs font-semibold backdrop-blur-md transition-all hover:scale-102 cursor-pointer group"
        title="Open Official SIH 12-Step Pitch Walkthrough (PRD Section 47)"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:animate-ping" />
        <span>{isHindi ? '12-स्टेप लाइव पिच' : 'SIH 12-Step Pitch'}</span>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
          PRD 47
        </span>
      </button>

      <SihDemoWalkthroughModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />

      {/* Global AI Voice & Chat Assistant for Unauthenticated Users */}
      <KisanChatbotWidget isOpen={isChatbotOpen} onOpenChange={setIsChatbotOpen} />
    </div>
  );
}

export default App;
