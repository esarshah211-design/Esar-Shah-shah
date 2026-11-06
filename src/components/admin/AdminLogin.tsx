import React, { useState } from 'react';
import {
  Flame,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ExternalLink,
  Info,
  LogOut,
  RefreshCw,
} from 'lucide-react';
import { useAuth, BOOTSTRAP_ADMIN_EMAIL } from '../../context/AuthContext';

interface Props {
  onBackToWebsite: () => void;
}

export const AdminLogin: React.FC<Props> = ({ onBackToWebsite }) => {
  const {
    signInWithGoogle,
    signInWithGoogleRedirect,
    simulateAdminLogin,
    grantAdminAccessToCurrentUser,
    signOut,
    error,
    authNotice,
    user,
    isAdmin,
    isCustomPasskeyActive,
    clearAuthError,
  } = useAuth();

  const [passcode, setPasscode] = useState('');
  const [authMode, setAuthMode] = useState<'google' | 'passcode'>('google');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handlePasscodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    clearAuthError();
    if (!passcode) {
      setLoginError('Please enter the admin security passkey.');
      return;
    }

    try {
      if (user && !isAdmin) {
        const success = await grantAdminAccessToCurrentUser(passcode);
        if (!success) {
          setLoginError('Invalid admin security key. Access denied.');
        }
      } else {
        const success = await simulateAdminLogin(passcode);
        if (!success) {
          setLoginError('Access denied: Invalid admin passkey. Please check credentials.');
        }
      }
    } catch (err: any) {
      setLoginError(err?.message || 'Authentication error.');
    }
  };

  const handleGoogleSignInPopup = async () => {
    setLoading(true);
    setLoginError(null);
    clearAuthError();
    try {
      await signInWithGoogle(false);
    } catch (err: any) {
      console.warn('Popup sign in returned error:', err);
      // If error occurred and not redirected yet
      if (err?.code !== 'auth/redirect-cancelled-by-user') {
        setLoginError(
          err?.message ||
            'Popup was blocked or closed. Please try the "Google Sign-In (Redirect Mode)" option below.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignInRedirect = async () => {
    setRedirecting(true);
    setLoginError(null);
    clearAuthError();
    try {
      await signInWithGoogleRedirect();
    } catch (err: any) {
      console.error('Redirect sign in error:', err);
      setLoginError(err?.message || 'Failed to start Google redirect.');
      setRedirecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#101010] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E63932]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top back button */}
      <div className="max-w-md mx-auto w-full px-4 mb-4">
        <button
          onClick={onBackToWebsite}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#B8B8B8] hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Customer Website</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E63932] to-[#b3241e] flex items-center justify-center shadow-xl shadow-[#E63932]/30">
            <Flame className="w-9 h-9 text-white fill-current" />
          </div>
        </div>
        <h2 className="text-center font-bebas text-4xl text-white tracking-wider">
          BURGER BITE <span className="text-[#E63932]">ADMIN PORTAL</span>
        </h2>
        <p className="mt-1 text-center text-xs text-[#B8B8B8]">
          Authorized Management System • Mian Gujar, Peshawar
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-[#171717] py-8 px-6 sm:px-10 rounded-3xl border border-[#272727] shadow-2xl space-y-6">
          {/* Error Message */}
          {(loginError || error) && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="block leading-relaxed">{loginError || error}</span>
                <button
                  type="button"
                  onClick={handleGoogleSignInRedirect}
                  className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline block mt-1 cursor-pointer"
                >
                  Click here to sign in using Redirect Mode →
                </button>
              </div>
            </div>
          )}

          {/* Info / Notice Message */}
          {authNotice && (
            <div className="p-3.5 rounded-xl bg-amber-950/50 border border-amber-500/50 text-amber-200 text-xs flex items-start gap-2.5">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <span className="leading-relaxed">{authNotice}</span>
            </div>
          )}

          {/* If already signed into Google but waiting for Admin key authorization */}
          {user && !isAdmin ? (
            <div className="space-y-4 bg-[#121212] p-5 rounded-2xl border border-[#2b2b2b]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                    Google Connected
                  </span>
                  <span className="text-xs font-bold text-white block mt-0.5 truncate max-w-[220px]">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={signOut}
                  className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                  title="Sign out this Google account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Switch</span>
                </button>
              </div>

              <p className="text-xs text-[#B8B8B8] leading-relaxed">
                Enter the admin security key to link and authorize this account for full store management:
              </p>

              <form onSubmit={handlePasscodeSubmit} className="space-y-3">
                <input
                  type="password"
                  placeholder="Enter security key (default: burgerbite2026)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full bg-[#171717] border border-[#333] focus:border-[#E63932] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#555] outline-none"
                />

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#E63932] hover:bg-[#c92f29] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                >
                  Grant Admin Access & Open Dashboard
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Toggle login methods */}
              <div className="grid grid-cols-2 gap-2 bg-[#101010] p-1.5 rounded-xl border border-[#222]">
                <button
                  type="button"
                  onClick={() => setAuthMode('google')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    authMode === 'google'
                      ? 'bg-[#E63932] text-white shadow-md'
                      : 'text-[#888] hover:text-white'
                  }`}
                >
                  Google Sign-In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('passcode')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    authMode === 'passcode'
                      ? 'bg-[#E63932] text-white shadow-md'
                      : 'text-[#888] hover:text-white'
                  }`}
                >
                  Security Passkey
                </button>
              </div>

              {authMode === 'google' ? (
                <div className="space-y-4">
                  <p className="text-xs text-[#B8B8B8] leading-relaxed">
                    Sign in with the restaurant owner Google account (
                    <strong className="text-white">{BOOTSTRAP_ADMIN_EMAIL}</strong>) or authorized team email.
                  </p>

                  {/* Primary Google Button (with smart popup & fallback) */}
                  <button
                    type="button"
                    onClick={handleGoogleSignInPopup}
                    disabled={loading || redirecting}
                    className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-neutral-100 disabled:bg-neutral-300 text-neutral-900 font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-98"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-neutral-700" />
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                    )}
                    <span>{loading ? 'Opening Google Sign-In...' : 'Continue with Google'}</span>
                  </button>

                  {/* Secondary Redirect Option (Guaranteed to work if popups get blocked or flash white) */}
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={handleGoogleSignInRedirect}
                      disabled={loading || redirecting}
                      className="text-[11px] text-[#888] hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3 h-3 text-[#E63932]" />
                      <span>
                        {redirecting
                          ? 'Redirecting to Google...'
                          : 'Popups blocked? Click to Sign In with Redirect Mode'}
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handlePasscodeSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                      Admin Passkey
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-[#777] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        placeholder={
                          isCustomPasskeyActive
                            ? 'Enter active store passkey'
                            : 'Enter security key (default: burgerbite2026)'
                        }
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        className="w-full bg-[#101010] border border-[#2e2e2e] focus:border-[#E63932] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#555] outline-none transition-all"
                      />
                    </div>
                    <p className="text-[11px] text-[#888] mt-1.5 flex items-center justify-between">
                      {isCustomPasskeyActive ? (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Custom store passkey is active</span>
                        </span>
                      ) : (
                        <span>
                          Store default key: <code className="text-[#E63932] font-mono">burgerbite2026</code>
                        </span>
                      )}
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#E63932] hover:bg-[#c92f29] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#E63932]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Authorize & Open Dashboard</span>
                  </button>
                </form>
              )}
            </>
          )}

          <div className="pt-4 border-t border-[#252525] text-center">
            <span className="text-[11px] text-[#777]">
              Security protected by Google Firebase Auth & Cloud Firestore
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
