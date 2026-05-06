'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { setUseCase, setTechnology, setStandard } from '@/app/actions';
import type { UseCase, Technology, Standard } from '@/lib/tech';

const STORAGE_KEY = 'thunder-docs-usecase';
const STORAGE_TECH_KEY = 'thunder-docs-technology';
const STORAGE_STANDARD_KEY = 'thunder-docs-standard';

type Step = 'usecase' | 'sub';

// ─── Icons ───────────────────────────────────────────────────────────────────

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  );
}
function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
    </svg>
  );
}

// Use-case icons
function AppWindowIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="3" width="20" height="18" rx="2" />
      <path d="M2 8h20" />
      <circle cx="6" cy="5.5" r="0.8" fill="currentColor" />
      <circle cx="9" cy="5.5" r="0.8" fill="currentColor" />
    </svg>
  );
}
function AgentIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a4 4 0 0 1 8 0v2" />
      <circle cx="9" cy="13" r="1.2" fill="currentColor" />
      <circle cx="15" cy="13" r="1.2" fill="currentColor" />
      <path d="M9 17h6" />
    </svg>
  );
}
function ApiIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
function WalletIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 12V8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4" />
      <path d="M16 12h6v4h-6a2 2 0 0 1 0-4z" />
    </svg>
  );
}

// Tech icons
function ReactIcon() {
  return (
    <svg viewBox="-11.5 -10.232 23 20.464" width="28" height="28" aria-hidden>
      <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
      <g stroke="#61DAFB" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}
function NextjsIcon() {
  return (
    <svg viewBox="0 0 180 180" width="28" height="28" aria-hidden>
      <mask id="lp-nxt" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
        <circle cx="90" cy="90" r="90" fill="black" />
      </mask>
      <g mask="url(#lp-nxt)">
        <circle cx="90" cy="90" r="90" fill="black" />
        <path d="M149.508 157.52L69.142 54H54V125.97H66.1V69.3L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#lp-nxt-g1)" />
        <rect x="115" y="54" width="12" height="72" fill="url(#lp-nxt-g2)" />
      </g>
      <defs>
        <linearGradient id="lp-nxt-g1" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" /><stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lp-nxt-g2" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" /><stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
function VueIcon() {
  return (
    <svg viewBox="0 0 261.76 226.69" width="28" height="28" aria-hidden>
      <path d="M161.096.001l-30.224 52.35L100.647.001H-.005l130.877 226.688L261.749.001z" fill="#41B883" />
      <path d="M161.096.001l-30.224 52.35L100.647.001H52.346l78.527 136.01L209.4.001z" fill="#34495E" />
    </svg>
  );
}
function NuxtIcon() {
  return (
    <svg viewBox="0 0 400 298" width="28" height="28" aria-hidden>
      <path d="M227.92 82.498L162.34 197.502H299.1L227.92 82.498Z" fill="#00DC82" />
      <path d="M143.81 116.498L100.9 197.502H186.72L143.81 116.498Z" fill="#00DC82" fillOpacity="0.7" />
      <path d="M55.1 197.502L152.64 24.998L186.72 82.498L122.9 197.502H55.1Z" fill="#00DC82" />
    </svg>
  );
}
function FlutterIcon() {
  return (
    <svg viewBox="0 0 24 30" width="28" height="28" aria-hidden>
      <path d="M14.314.051L2.182 12.183l3.497 3.496 14.629-15.628z" fill="#54C5F8" />
      <path d="M14.314.051l-7.246 7.246 3.497 3.496 7.246-7.246z" fill="#01579B" />
      <path d="M5.934 19.17l2.561 2.562 7.252-7.252-2.562-2.562z" fill="#54C5F8" />
      <path d="M8.495 21.732l2.562 2.561 7.252-7.251-2.562-2.562z" fill="#01579B" />
      <path d="M5.934 19.17l5.123 5.123 5.25-5.251-5.25-5.25z" fill="#29B6F6" />
    </svg>
  );
}
function SpringBootIcon() {
  return (
    <svg viewBox="0 0 256 256" width="28" height="28" aria-hidden>
      <circle cx="128" cy="128" r="128" fill="#6DB33F" />
      <path d="M169.56 73.5c-20.56-20.56-53.9-20.56-74.46 0-16.6 16.6-19.93 41.7-9.97 61.9l-28.5 52.1 52.1-28.5c20.2 9.96 45.3 6.63 61.9-9.97 20.56-20.56 20.56-53.9-.07-75.53z" fill="white" />
    </svg>
  );
}
function DotNetIcon() {
  return (
    <svg viewBox="0 0 256 256" width="28" height="28" aria-hidden>
      <path d="M0 128C0 57.308 57.308 0 128 0s128 57.308 128 128-57.308 128-128 128S0 198.692 0 128z" fill="#512BD4" />
      <path d="M71.5 96h22.8v64H71.5V96zM108.3 96h24.2l38 48V96h22.8v64h-24.2l-38-48v48h-22.8V96z" fill="white" />
      <circle cx="59" cy="160" r="8" fill="white" />
    </svg>
  );
}
function AngularIcon() {
  return (
    <svg viewBox="0 0 250 250" width="28" height="28" aria-hidden>
      <path d="M125 30L31.9 63.8l14.2 123.1L125 230l78.9-43.1 14.2-123.1z" fill="#DD0031" />
      <path d="M125 30v22.2V230l78.9-43.1 14.2-123.1L125 30z" fill="#C3002F" />
      <path d="M125 52.1L66.8 182.6h21.7l11.7-29.2h49.4l11.7 29.2H183L125 52.1zm17 83.3h-34l17-40.9 17 40.9z" fill="white" />
    </svg>
  );
}

// Standard icons
function OidcIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="8" cy="15" r="4" />
      <path d="m15 9-1.5 1.5" /><path d="m12 12 5-5" /><path d="m17 7 1 1" />
    </svg>
  );
}
function SamlIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <circle cx="8.5" cy="12" r="1.5" />
      <path d="M14 10h4M14 14h4" />
    </svg>
  );
}
function NativeApiIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────

const USE_CASES: {
  id: Exclude<UseCase, 'all'>;
  label: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'applications',
    label: 'Applications',
    subtitle: 'Web & mobile apps',
    description: 'Secure user-facing applications with login, sign-up, social auth, and MFA using our SDKs and pre-built flows.',
    icon: <AppWindowIcon />,
  },
  {
    id: 'agents',
    label: 'Agents',
    subtitle: 'AI & autonomous agents',
    description: 'Add identity and authorization to AI agents, bots, and automated workflows that act on behalf of users.',
    icon: <AgentIcon />,
  },
  {
    id: 'apis',
    label: 'APIs',
    subtitle: 'Backend & microservices',
    description: 'Protect your APIs and services with token-based auth, scopes, and fine-grained access control.',
    icon: <ApiIcon />,
  },
  {
    id: 'wallets',
    label: 'Wallets',
    subtitle: 'Digital identity wallets',
    description: 'Issue and verify credentials, manage decentralized identities, and integrate with digital wallet standards.',
    icon: <WalletIcon />,
  },
];

const TECH_OPTIONS: { id: Technology; label: string; icon: React.ReactNode }[] = [
  { id: 'react',       label: 'React',        icon: <ReactIcon />      },
  { id: 'nextjs',      label: 'Next.js',      icon: <NextjsIcon />     },
  { id: 'vue',         label: 'Vue',          icon: <VueIcon />        },
  { id: 'nuxt',        label: 'Nuxt',         icon: <NuxtIcon />       },
  { id: 'flutter',     label: 'Flutter',      icon: <FlutterIcon />    },
  { id: 'springboot',  label: 'Spring Boot',  icon: <SpringBootIcon /> },
  { id: 'dotnet',      label: '.NET',         icon: <DotNetIcon />     },
  { id: 'angular',     label: 'Angular',      icon: <AngularIcon />    },
];

const STANDARD_OPTIONS: { id: Standard; label: string; description: string; icon: React.ReactNode }[] = [
  {
    id: 'oidc',
    label: 'OpenID Connect',
    description: 'Token-based auth for web & mobile apps',
    icon: <OidcIcon />,
  },
  {
    id: 'saml',
    label: 'SAML 2.0',
    description: 'XML-based enterprise SSO federation',
    icon: <SamlIcon />,
  },
  {
    id: 'native-api',
    label: 'Native API',
    description: 'Direct REST API integration',
    icon: <NativeApiIcon />,
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function LandingPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [step, setStep] = useState<Step>('usecase');
  const [chosenUseCase, setChosenUseCase] = useState<Exclude<UseCase, 'all'> | null>(null);
  const [selecting, setSelecting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as UseCase | null;
    const validUseCases: UseCase[] = ['all', 'applications', 'agents', 'apis', 'wallets'];
    if (saved && validUseCases.includes(saved)) {
      setUseCase(saved).then(() => router.replace('/docs'));
    } else {
      setChecking(false);
    }
  }, [router]);

  async function handleUseCaseClick(uc: Exclude<UseCase, 'all'>) {
    if (uc === 'applications') {
      setChosenUseCase(uc);
      setStep('sub');
    } else {
      setSelecting(true);
      localStorage.setItem(STORAGE_KEY, uc);
      localStorage.removeItem(STORAGE_TECH_KEY);
      localStorage.removeItem(STORAGE_STANDARD_KEY);
      await setUseCase(uc);
      router.push('/docs');
    }
  }

  async function handleTechSelect(tech: Technology) {
    if (!chosenUseCase) return;
    setSelecting(true);
    localStorage.setItem(STORAGE_KEY, chosenUseCase);
    localStorage.setItem(STORAGE_TECH_KEY, tech);
    localStorage.removeItem(STORAGE_STANDARD_KEY);
    await setUseCase(chosenUseCase);
    await setTechnology(tech);
    router.push('/docs');
  }

  async function handleStandardSelect(std: Standard) {
    if (!chosenUseCase) return;
    setSelecting(true);
    localStorage.setItem(STORAGE_KEY, chosenUseCase);
    localStorage.setItem(STORAGE_STANDARD_KEY, std);
    localStorage.removeItem(STORAGE_TECH_KEY);
    await setUseCase(chosenUseCase);
    await setStandard(std);
    router.push('/docs');
  }

  if (checking) return null;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 overflow-hidden">

      {/* Orange background glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 60% 35%, rgba(255,107,0,0.13) 0%, transparent 65%), ' +
            'radial-gradient(ellipse 40% 30% at 85% 25%, rgba(255,107,0,0.07) 0%, transparent 70%)',
        }}
      />
      <style>{`
        @keyframes lpHeroFloat {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-6px); }
        }
        @keyframes lpPulse {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50%       { opacity: 1;    transform: scale(1.15); }
        }
        @keyframes lpFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes lpCardIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes lpStepIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center gap-10">

        {/* ── Logo (always visible) ──────────────────────────── */}
        <div className="text-center flex flex-col items-center">
          <div
            className="relative mb-5 flex items-center justify-center"
            style={{ animation: 'lpHeroFloat 4s ease-in-out infinite' }}
          >
            <div
              aria-hidden
              style={{
                position: 'absolute',
                width: 96,
                height: 96,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,170,50,0.28) 0%, transparent 70%)',
                filter: 'blur(18px)',
                animation: 'lpPulse 3s ease-in-out infinite',
              }}
            />
            <svg width="40" height="58" viewBox="0 0 24 32" fill="none" aria-hidden style={{ position: 'relative' }}>
              <path
                d="M13.5 1L4 18h7l-1.5 13L20 14h-7L13.5 1z"
                fill="rgba(255,140,0,0.15)"
                stroke="#FF8C00"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p
            className="mb-3 text-sm font-medium tracking-[0.3em] uppercase"
            style={{ color: 'rgba(255,140,0,0.7)', animation: 'lpFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}
          >
            Thunder
          </p>
        </div>

        {/* ── Step 1: What do you want to secure? ──────────── */}
        {step === 'usecase' && (
          <div key="usecase" className="w-full flex flex-col items-center gap-10">
            <div className="text-center">
              <h1
                className="text-3xl md:text-4xl font-bold text-fd-foreground mb-2"
                style={{ animation: 'lpFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both' }}
              >
                What do you want to secure?
              </h1>
              <p
                className="text-base text-fd-muted-foreground max-w-sm mx-auto"
                style={{ animation: 'lpFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s both' }}
              >
                Pick your use case and we&apos;ll tailor the docs to what matters most.
              </p>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {USE_CASES.map((uc, i) => (
                <button
                  key={uc.id}
                  onClick={() => handleUseCaseClick(uc.id)}
                  className="group relative text-left rounded-2xl border border-fd-border bg-fd-card/60 p-7 flex flex-col gap-4 hover:border-orange-500/50 transition-all cursor-pointer"
                  style={{ outline: 'none', animation: `lpCardIn 0.6s cubic-bezier(0.16,1,0.3,1) ${0.35 + i * 0.08}s both` }}
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,107,0,0.09) 0%, transparent 70%)' }}
                  />
                  <div
                    className="relative w-10 h-10 rounded-lg flex items-center justify-center text-orange-500"
                    style={{ background: 'rgba(255,107,0,0.10)', border: '1px solid rgba(255,107,0,0.18)' }}
                  >
                    {uc.icon}
                  </div>
                  <div className="relative">
                    <p className="font-semibold text-fd-foreground text-base mb-0.5">{uc.label}</p>
                    <p className="text-sm text-orange-500/80 font-medium">{uc.subtitle}</p>
                  </div>
                  <p className="relative text-sm leading-relaxed text-fd-muted-foreground flex-1">{uc.description}</p>
                  <div className="relative flex items-center gap-1.5 text-sm font-medium text-orange-500 group-hover:gap-2 transition-all mt-1">
                    Continue <ArrowRightIcon />
                  </div>
                </button>
              ))}
            </div>

            <p className="text-sm text-fd-muted-foreground/50" style={{ animation: 'lpFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.6s both' }}>
              You can change this at any time from the sidebar.
            </p>
          </div>
        )}

        {/* ── Step 2: Technology + Standards ───────────────── */}
        {step === 'sub' && chosenUseCase && (
          <div key="sub" className="w-full flex flex-col items-center gap-10" style={{ animation: 'lpStepIn 0.5s cubic-bezier(0.16,1,0.3,1) both' }}>

            {/* Back button */}
            <button
              onClick={() => { setStep('usecase'); setChosenUseCase(null); }}
              className="self-start flex items-center gap-1.5 text-sm text-fd-muted-foreground hover:text-fd-foreground transition-colors"
            >
              <ArrowLeftIcon /> Back
            </button>

            {/* Step header */}
            <div className="text-center -mt-4">
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full text-xs font-medium border border-fd-border bg-fd-card/60 text-fd-muted-foreground">
                <span className="text-orange-500 capitalize">{chosenUseCase}</span>
                <span>·</span>
                <span>Step 2 of 2</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-fd-foreground mb-2">
                How do you want to integrate?
              </h1>
              <p className="text-base text-fd-muted-foreground max-w-sm mx-auto">
                Choose a technology or a standard to get tailored guides and examples.
              </p>
            </div>

            {/* ── Technology group ── */}
            <div className="w-full flex flex-col gap-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-fd-muted-foreground/60">Technology</p>
              <div className="w-full grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
                {TECH_OPTIONS.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => handleTechSelect(t.id)}
                    disabled={selecting}
                    className="group relative text-center rounded-xl border border-fd-border bg-fd-card/60 p-4 flex flex-col items-center gap-2 hover:border-orange-500/50 transition-all disabled:opacity-60 cursor-pointer"
                    style={{ outline: 'none', animation: `lpCardIn 0.5s cubic-bezier(0.16,1,0.3,1) ${0.05 + i * 0.05}s both` }}
                  >
                    <div
                      aria-hidden
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                      style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,107,0,0.09) 0%, transparent 70%)' }}
                    />
                    <div className="relative">{t.icon}</div>
                    <p className="relative text-xs font-medium text-fd-foreground leading-tight">{t.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Standards group ── */}
            <div className="w-full flex flex-col gap-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-fd-muted-foreground/60">Standards</p>
              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                {STANDARD_OPTIONS.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => handleStandardSelect(s.id)}
                    disabled={selecting}
                    className="group relative text-left rounded-xl border border-fd-border bg-fd-card/60 p-5 flex items-center gap-4 hover:border-orange-500/50 transition-all disabled:opacity-60 cursor-pointer"
                    style={{ outline: 'none', animation: `lpCardIn 0.5s cubic-bezier(0.16,1,0.3,1) ${0.45 + i * 0.07}s both` }}
                  >
                    <div
                      aria-hidden
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                      style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,107,0,0.09) 0%, transparent 70%)' }}
                    />
                    <div
                      className="relative w-10 h-10 rounded-lg flex items-center justify-center text-orange-500 flex-shrink-0"
                      style={{ background: 'rgba(255,107,0,0.10)', border: '1px solid rgba(255,107,0,0.18)' }}
                    >
                      {s.icon}
                    </div>
                    <div className="relative">
                      <p className="font-semibold text-fd-foreground text-sm">{s.label}</p>
                      <p className="text-xs text-fd-muted-foreground mt-0.5">{s.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <p className="text-sm text-fd-muted-foreground/50">
              You can change this at any time from the sidebar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

