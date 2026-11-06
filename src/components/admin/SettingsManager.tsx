import React, { useState } from 'react';
import {
  Database,
  RefreshCw,
  Shield,
  CheckCircle2,
  AlertCircle,
  HardDrive,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  RotateCcw,
} from 'lucide-react';
import { seedInitialDataIfNeeded } from '../../services/dbService';
import { useAuth, DEFAULT_PASSKEY } from '../../context/AuthContext';
import firebaseConfig from '../../../firebase-applet-config.json';

export const SettingsManager: React.FC = () => {
  const {
    user,
    signOut,
    isCustomPasskeyActive,
    changeAdminPasskey,
    resetAdminPasskeyToDefault,
  } = useAuth();

  // Seeder state
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  // Passkey change state
  const [currentPasskey, setCurrentPasskey] = useState('');
  const [newPasskey, setNewPasskey] = useState('');
  const [confirmPasskey, setConfirmPasskey] = useState('');
  const [showMasked, setShowMasked] = useState(false);
  const [updatingPasskey, setUpdatingPasskey] = useState(false);
  const [passkeySuccess, setPasskeySuccess] = useState<string | null>(null);
  const [passkeyError, setPasskeyError] = useState<string | null>(null);

  // Reset to default state
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetConfirmPasskey, setResetConfirmPasskey] = useState('');
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const handleSeed = async () => {
    setSeeding(true);
    setSeedResult(null);
    try {
      const didSeed = await seedInitialDataIfNeeded();
      if (didSeed) {
        setSeedResult('Database seeded with standard Burger Bite menu, gallery, and settings!');
      } else {
        setSeedResult('Database already initialized with active collections.');
      }
    } catch (err: any) {
      console.error('Seed error:', err);
      setSeedResult('Seeding note: ' + (err?.message || 'Check connection'));
    } finally {
      setSeeding(false);
    }
  };

  const handleChangePasskey = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasskeyError(null);
    setPasskeySuccess(null);

    if (!currentPasskey) {
      setPasskeyError('Please enter your current admin passkey to authorize this change.');
      return;
    }

    if (!newPasskey || newPasskey.trim().length < 6) {
      setPasskeyError('New passkey must be at least 6 characters long.');
      return;
    }

    if (newPasskey !== confirmPasskey) {
      setPasskeyError('New passkey and confirmation do not match.');
      return;
    }

    setUpdatingPasskey(true);
    try {
      const res = await changeAdminPasskey(currentPasskey, newPasskey, confirmPasskey);
      setPasskeySuccess(res.message);
      setCurrentPasskey('');
      setNewPasskey('');
      setConfirmPasskey('');
      setTimeout(() => setPasskeySuccess(null), 6000);
    } catch (err: any) {
      console.error('Passkey update error:', err);
      setPasskeyError(err?.message || 'Failed to update admin passkey.');
    } finally {
      setUpdatingPasskey(false);
    }
  };

  const handleResetToDefault = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);

    if (!resetConfirmPasskey) {
      setResetError('Enter current active passkey to confirm reset.');
      return;
    }

    setResetting(true);
    try {
      await resetAdminPasskeyToDefault(resetConfirmPasskey);
      setShowResetConfirm(false);
      setResetConfirmPasskey('');
      setPasskeySuccess('Passkey reset back to default (burgerbite2026).');
      setTimeout(() => setPasskeySuccess(null), 6000);
    } catch (err: any) {
      setResetError(err?.message || 'Failed to reset passkey. Check current passkey.');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="font-bebas text-3xl sm:text-4xl text-white tracking-wide">
          SYSTEM SETTINGS & SECURITY
        </h2>
        <p className="text-xs text-[#B8B8B8]">
          Manage administrative passkeys, database connectivity, and store access credentials.
        </p>
      </div>

      {/* 1. Admin Passkey Security Management */}
      <div className="bg-[#171717] rounded-3xl border border-[#272727] p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#252525]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#E63932]/10 border border-[#E63932]/30 flex items-center justify-center text-[#E63932]">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bebas text-2xl text-white tracking-wide">
                Admin Passkey Management
              </h3>
              <p className="text-xs text-[#888]">
                Change the access key required to log into the Burger Bite management dashboard.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                isCustomPasskeyActive
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
              }`}
            >
              {isCustomPasskeyActive ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Custom Passkey Active</span>
                </>
              ) : (
                <>
                  <Shield className="w-3.5 h-3.5" />
                  <span>Default Key Active</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Success Alert */}
        {passkeySuccess && (
          <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 text-xs flex items-start gap-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Passkey Updated Successfully</span>
              <span className="leading-relaxed block">{passkeySuccess}</span>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {passkeyError && (
          <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
            <span className="leading-relaxed">{passkeyError}</span>
          </div>
        )}

        {/* Change Passkey Form */}
        <form onSubmit={handleChangePasskey} className="space-y-4">
          {/* Current Passkey */}
          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
              Current Passkey *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#777] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showMasked ? 'text' : 'password'}
                required
                placeholder={
                  isCustomPasskeyActive
                    ? 'Enter current active passkey'
                    : `Enter default key (${DEFAULT_PASSKEY})`
                }
                value={currentPasskey}
                onChange={(e) => setCurrentPasskey(e.target.value)}
                className="w-full bg-[#101010] border border-[#2a2a2a] focus:border-[#E63932] rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder-[#555] outline-none transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowMasked(!showMasked)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#777] hover:text-white transition-colors cursor-pointer"
                title={showMasked ? 'Hide characters' : 'Show characters'}
              >
                {showMasked ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-[#777] mt-1">
              Required for identity verification before modifying administrative access.
            </p>
          </div>

          {/* New Passkey & Confirm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                New Passkey *
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#777] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showMasked ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={newPasskey}
                  onChange={(e) => setNewPasskey(e.target.value)}
                  className="w-full bg-[#101010] border border-[#2a2a2a] focus:border-[#E63932] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-[#555] outline-none transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                Confirm New Passkey *
              </label>
              <div className="relative">
                <CheckCircle2 className="w-4 h-4 text-[#777] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showMasked ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="Re-enter new passkey"
                  value={confirmPasskey}
                  onChange={(e) => setConfirmPasskey(e.target.value)}
                  className="w-full bg-[#101010] border border-[#2a2a2a] focus:border-[#E63932] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-[#555] outline-none transition-all font-mono"
                />
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#121212] border border-[#222] text-[11px] text-[#888] space-y-1">
            <span className="font-semibold text-[#BBB] block">Security Architecture:</span>
            <p>
              • Passkeys are cryptographically hashed using salted SHA-256 before storage.
            </p>
            <p>
              • Neither staff nor visitors can view your passkey in plain text.
            </p>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              type="submit"
              disabled={updatingPasskey}
              className="px-6 py-3.5 rounded-xl bg-[#E63932] hover:bg-[#c92f29] disabled:bg-[#444] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#E63932]/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Lock className="w-4 h-4" />
              <span>{updatingPasskey ? 'Verifying & Saving...' : 'Save New Admin Passkey'}</span>
            </button>

            {isCustomPasskeyActive && (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="text-xs text-[#888] hover:text-white transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg hover:bg-[#222]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default Key</span>
              </button>
            )}
          </div>
        </form>

        {/* Modal: Confirm Reset to Default */}
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#171717] border border-[#2f2f2f] rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
              <h3 className="font-bebas text-2xl text-white mb-1">
                RESET TO DEFAULT PASSKEY?
              </h3>
              <p className="text-xs text-[#888] mb-4 leading-relaxed">
                This will revert the admin security key back to the initial factory default (
                <code className="text-[#E63932] font-mono">burgerbite2026</code>). Enter your current
                passkey to confirm:
              </p>

              {resetError && (
                <div className="p-3 mb-4 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs">
                  {resetError}
                </div>
              )}

              <form onSubmit={handleResetToDefault} className="space-y-4">
                <input
                  type="password"
                  required
                  placeholder="Enter current passkey"
                  value={resetConfirmPasskey}
                  onChange={(e) => setResetConfirmPasskey(e.target.value)}
                  className="w-full bg-[#101010] border border-[#2a2a2a] focus:border-[#E63932] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
                />

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowResetConfirm(false);
                      setResetConfirmPasskey('');
                      setResetError(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#252525] text-[#888] hover:text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetting}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase transition-colors cursor-pointer"
                  >
                    {resetting ? 'Resetting...' : 'Confirm Reset'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* 2. Cloud Infrastructure Status */}
      <div className="bg-[#171717] rounded-3xl border border-[#272727] p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Google Cloud Firestore Connection</h3>
            <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Connected & Operational</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#101010] border border-[#252525]">
            <span className="text-[#888] block text-[11px] uppercase font-bold">
              Firebase Project ID
            </span>
            <span className="font-mono font-bold text-white mt-1 block">
              {firebaseConfig.projectId}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#101010] border border-[#252525]">
            <span className="text-[#888] block text-[11px] uppercase font-bold">
              Firestore Database ID
            </span>
            <span className="font-mono font-bold text-white mt-1 block truncate">
              {firebaseConfig.firestoreDatabaseId}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Initial Data Setup & Recovery */}
      <div className="bg-[#171717] rounded-3xl border border-[#272727] p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#222] flex items-center justify-center text-amber-400">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Initial Data Setup & Recovery</h3>
            <p className="text-xs text-[#888]">
              Verify or restore default burgers, categories, and Mian Gujar store settings.
            </p>
          </div>
        </div>

        {seedResult && (
          <div className="p-3.5 rounded-xl bg-[#222] border border-[#333] text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{seedResult}</span>
          </div>
        )}

        <button
          onClick={handleSeed}
          disabled={seeding}
          className="px-5 py-3 rounded-xl bg-[#252525] hover:bg-[#333] text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${seeding ? 'animate-spin' : ''}`} />
          <span>{seeding ? 'Verifying Database...' : 'Verify / Seed Initial Data'}</span>
        </button>
      </div>

      {/* 4. Active Admin Session */}
      <div className="bg-[#171717] rounded-3xl border border-[#272727] p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#222] flex items-center justify-center text-[#E63932]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Active Session Details</h3>
            <p className="text-xs text-[#888]">
              Current verified administrator credentials.
            </p>
          </div>
        </div>

        <div className="text-xs text-[#BBB] space-y-2 bg-[#101010] p-4 rounded-2xl border border-[#252525]">
          <div>
            <span className="text-[#888]">Active Identity: </span>
            <span className="font-semibold text-white">
              {user?.email || 'Authorized Store Manager (Passkey Authenticated)'}
            </span>
          </div>
          <div>
            <span className="text-[#888]">Permissions: </span>
            <span className="font-bold text-emerald-400">Full Store Read/Write Access</span>
          </div>
        </div>

        <button
          onClick={signOut}
          className="px-5 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-bold transition-colors cursor-pointer"
        >
          Sign Out of Admin Panel
        </button>
      </div>
    </div>
  );
};
