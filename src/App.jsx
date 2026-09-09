import React, { useState, useEffect } from 'react';
import { AuthLayout } from './components/auth/AuthLayout';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { FarmerDashboardPreview } from './components/dashboards/FarmerDashboardPreview';
import { MarketplacePreview } from './components/dashboards/MarketplacePreview';
import { BuyerDashboardPreview } from './components/dashboards/BuyerDashboardPreview';
import { RouteOptimizerPreview } from './components/dashboards/RouteOptimizerPreview';
import { authService } from './services/authService';
import { LanguageToggle } from './components/common/LanguageToggle';
import { useLanguage } from './context/LanguageContext';

export function App() {
  const { t } = useLanguage();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState('farmer'); // 'farmer' | 'consumer' | 'buyer'
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [backendStatus, setBackendStatus] = useState({ checked: false, online: false, database: '' });

  // Check stored session and backend health on mount
  useEffect(() => {
    const existing = authService.getSession();
    if (existing) {
      setSession(existing);
    }

    // Ping backend API
    authService.checkBackendHealth().then((res) => {
      setBackendStatus({
        checked: true,
        online: res.online,
        database: res.database || (res.online ? 'MongoDB Connected' : 'Offline'),
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
      }, 500);
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
      }, 500);
      return userSession;
    } catch (err) {
      setIsLoading(false);
      setApiError(err.message || 'Registration failed. Please try again.');
      throw err;
    }
  };

  // Handle Google Social Login
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setApiError('');
    try {
      const userSession = await authService.loginWithGoogle(role);
      setSession(userSession);
      setIsLoading(false);
    } catch (err) {
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

  // If user is authenticated, route to corresponding role dashboard view
  if (session) {
    if (session.redirectUrl === '/farmer/dashboard' || session.role === 'farmer') {
      return <FarmerDashboardPreview session={session} onLogout={handleLogout} />;
    }
    if (session.redirectUrl === '/marketplace' || session.role === 'consumer') {
      return <MarketplacePreview session={session} onLogout={handleLogout} />;
    }
    if (session.redirectUrl === '/buyer/dashboard' || session.role === 'buyer') {
      return <BuyerDashboardPreview session={session} onLogout={handleLogout} />;
    }
    if (session.redirectUrl === '/logistics/routes' || session.role === 'logistics') {
      return (
        <RouteOptimizerPreview
          session={session}
          onLogout={handleLogout}
          onBackToBuyer={() =>
            setSession({
              user: { name: 'Rajiv Mehra', businessName: 'TastyGreens Chain', location: 'Mumbai, MH', badge: 'Verified B2B Buyer' },
              role: 'buyer',
              redirectUrl: '/buyer/dashboard',
            })
          }
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfbf9]">
      {/* Backend API status & Preview switcher header */}
      <div className="bg-emerald-950 text-emerald-200 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-emerald-800/40">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 bg-emerald-900/80 px-2.5 py-0.5 rounded-full border border-emerald-700/50 text-[11px] font-semibold text-emerald-300">
            <span
              className={`w-2 h-2 rounded-full ${
                backendStatus.online ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span>
              Backend:{' '}
              {backendStatus.online
                ? t('backendOnline')
                : t('backendConnecting')}
            </span>
          </span>

          <span className="hidden md:inline text-emerald-500/60">•</span>
          <span className="hidden md:inline text-emerald-300/90">
            {t('activeRole')}: <strong className="text-white capitalize">{role === 'farmer' ? t('roleFarmer') : role === 'buyer' ? t('roleBuyer') : t('roleConsumer')}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Top Header Language Toggle Button */}
          <LanguageToggle variant="dark" />

          <span className="text-emerald-500/60 hidden sm:inline">|</span>

          <span className="text-emerald-300/80 text-[11px] hidden lg:inline">{t('quickPreview')}:</span>
          <button
            type="button"
            onClick={() => {
              setRole('farmer');
              setSession({
                user: { name: 'Rameshwar Patel', businessName: 'Krishi Vikas FPO', location: 'Nashik, MH', badge: 'Verified FPO Leader' },
                role: 'farmer',
                redirectUrl: '/farmer/dashboard',
              });
            }}
            className="text-[11px] bg-emerald-800 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-md transition-colors cursor-pointer"
          >
            {t('farmerHub')}
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('consumer');
              setSession({
                user: { name: 'Ananya Sharma', location: 'Bengaluru, KA', badge: 'Direct Consumer' },
                role: 'consumer',
                redirectUrl: '/marketplace',
              });
            }}
            className="text-[11px] bg-emerald-800 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-md transition-colors cursor-pointer"
          >
            {t('marketplace')}
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('buyer');
              setSession({
                user: { name: 'Rajiv Mehra', businessName: 'TastyGreens Chain', location: 'Mumbai, MH', badge: 'Verified B2B Buyer' },
                role: 'buyer',
                redirectUrl: '/buyer/dashboard',
              });
            }}
            className="text-[11px] bg-emerald-800 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-md transition-colors cursor-pointer"
          >
            {t('buyerDashboard')}
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('buyer');
              setSession({
                user: { name: 'Logistics Fleet Controller', businessName: 'KisanDirect Cold Fleet', location: 'Navi Mumbai Hub', badge: 'AI Fleet Manager' },
                role: 'logistics',
                redirectUrl: '/logistics/routes',
              });
            }}
            className="text-[11px] bg-teal-800 hover:bg-teal-700 text-white font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 border border-teal-600/50"
          >
            <span>🚚</span>
            <span>{t('routeOptimizerNav')}</span>
          </button>
        </div>
      </div>

      <AuthLayout mode={mode}>
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
  );
}

export default App;
