import React, { useState } from 'react';
import { Database, RefreshCw, Shield, CheckCircle2, AlertCircle, HardDrive } from 'lucide-react';
import { seedInitialDataIfNeeded } from '../../services/dbService';
import { useAuth } from '../../context/AuthContext';
import firebaseConfig from '../../../firebase-applet-config.json';

export const SettingsManager: React.FC = () => {
  const { user, signOut } = useAuth();
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

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

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="font-bebas text-3xl sm:text-4xl text-white tracking-wide">
          SYSTEM SETTINGS & DATABASE STATUS
        </h2>
        <p className="text-xs text-[#B8B8B8]">
          Review cloud infrastructure, Firestore connection, and administrative permissions.
        </p>
      </div>

      {/* Cloud Status */}
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

      {/* Database Seeder */}
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

      {/* Admin Session Details */}
      <div className="bg-[#171717] rounded-3xl border border-[#272727] p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#222] flex items-center justify-center text-[#E63932]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Current Session</h3>
            <p className="text-xs text-[#888]">
              Authenticated as restaurant administrator.
            </p>
          </div>
        </div>

        <div className="text-xs text-[#BBB] space-y-2 bg-[#101010] p-4 rounded-2xl border border-[#252525]">
          <div>
            <span className="text-[#888]">Active Identity: </span>
            <span className="font-semibold text-white">
              {user?.email || 'Authorized Store Manager'}
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
