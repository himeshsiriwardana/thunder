'use client';

import { useRouter } from 'next/navigation';
import { useTransition, useState, useRef, useEffect } from 'react';
import { setUseCase, setTechnology, setStandard, clearStandard } from '@/app/actions';
import type { UseCase, Technology, Standard } from '@/lib/tech';
import { ChevronDown, Check, LayoutGrid, Bot, Braces, Wallet } from 'lucide-react';

// ─── Brand SVG icons ──────────────────────────────────────────────────────────

const ReactIcon = () => (
  <svg viewBox="-11.5 -10.23174 23 20.46348" className="size-4" fill="none">
    <circle cx="0" cy="0" r="2.05" fill="#61DAFB"/>
    <g stroke="#61DAFB" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2"/>
      <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
      <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
    </g>
  </svg>
);

const NextjsIcon = () => (
  <svg viewBox="0 0 180 180" className="size-4">
    <mask id="pf-nxt" style={{maskType:'alpha'}} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
      <circle cx="90" cy="90" r="90" fill="black"/>
    </mask>
    <g mask="url(#pf-nxt)">
      <circle cx="90" cy="90" r="90" fill="black"/>
      <path d="M149.508 157.52L69.142 54H54V125.97H66.1V69.3L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#pf-nxt-g1)"/>
      <rect x="115" y="54" width="12" height="72" fill="url(#pf-nxt-g2)"/>
    </g>
    <defs>
      <linearGradient id="pf-nxt-g1" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="white"/><stop offset="1" stopColor="white" stopOpacity="0"/>
      </linearGradient>
      <linearGradient id="pf-nxt-g2" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
        <stop stopColor="white"/><stop offset="1" stopColor="white" stopOpacity="0"/>
      </linearGradient>
    </defs>
  </svg>
);

const VueIcon = () => (
  <svg viewBox="0 0 261.76 226.69" className="size-4">
    <path d="M161.096.001l-30.224 52.35L100.647.001H-.005l130.877 226.688L261.749.001z" fill="#41B883"/>
    <path d="M161.096.001l-30.224 52.35L100.647.001H52.346l78.527 136.01L209.4.001z" fill="#34495E"/>
  </svg>
);

const NuxtIcon = () => (
  <svg viewBox="0 0 400 298" className="size-4">
    <path d="M227.92 82.498L162.34 197.502H299.1L227.92 82.498Z" fill="#00DC82"/>
    <path d="M143.81 116.498L100.9 197.502H186.72L143.81 116.498Z" fill="#00DC82" fillOpacity="0.7"/>
    <path d="M55.1 197.502L152.64 24.998L186.72 82.498L122.9 197.502H55.1Z" fill="#00DC82"/>
  </svg>
);

const FlutterIcon = () => (
  <svg viewBox="0 0 24 30" className="size-4">
    <path d="M14.314.051L2.182 12.183l3.497 3.496 14.629-15.628z" fill="#54C5F8"/>
    <path d="M14.314.051l-7.246 7.246 3.497 3.496 7.246-7.246z" fill="#01579B"/>
    <path d="M5.934 19.17l2.561 2.562 7.252-7.252-2.562-2.562z" fill="#54C5F8"/>
    <path d="M8.495 21.732l2.562 2.561 7.252-7.251-2.562-2.562z" fill="#01579B"/>
    <path d="M5.934 19.17l5.123 5.123 5.25-5.251-5.25-5.25z" fill="#29B6F6"/>
  </svg>
);

const SpringBootIcon = () => (
  <svg viewBox="0 0 256 256" className="size-4">
    <circle cx="128" cy="128" r="128" fill="#6DB33F"/>
    <path d="M169.56 73.5c-20.56-20.56-53.9-20.56-74.46 0-16.6 16.6-19.93 41.7-9.97 61.9l-28.5 52.1 52.1-28.5c20.2 9.96 45.3 6.63 61.9-9.97 20.56-20.56 20.56-53.9-.07-75.53z" fill="white"/>
  </svg>
);

const DotNetIcon = () => (
  <svg viewBox="0 0 256 256" className="size-4">
    <path d="M0 128C0 57.308 57.308 0 128 0s128 57.308 128 128-57.308 128-128 128S0 198.692 0 128z" fill="#512BD4"/>
    <path d="M71.5 96h22.8v64H71.5V96zM108.3 96h24.2l38 48V96h22.8v64h-24.2l-38-48v48h-22.8V96z" fill="white"/>
    <circle cx="59" cy="160" r="8" fill="white"/>
  </svg>
);

const AngularIcon = () => (
  <svg viewBox="0 0 250 250" className="size-4">
    <path d="M125 30L31.9 63.8l14.2 123.1L125 230l78.9-43.1 14.2-123.1z" fill="#DD0031"/>
    <path d="M125 30v22.2-.1V230l78.9-43.1 14.2-123.1L125 30z" fill="#C3002F"/>
    <path d="M125 52.1L66.8 182.6h21.7l11.7-29.2h49.4l11.7 29.2H183L125 52.1zm17 83.3h-34l17-40.9 17 40.9z" fill="white"/>
  </svg>
);

const OIDCIcon = () => (
  <svg viewBox="0 0 256 256" className="size-4" aria-hidden="true">
    <g transform="translate(-373.642,-318.344)">
      <path fill="#ff8e00" d="m 488.0825,538.40564 26.93006,-19.41471 -1.2525,-154.06511 -25.67756,20.04099 0,153.43883 z"/>
      <path fill="#626262" d="M 488.39564,538.40564 C 387.66591,522.39153 384.79535,434.69468 487.76935,415.65457 l 0.31315,18.16215 c -73.04418,12.17854 -63.78999,77.70661 0,87.36619 l 0.31314,17.22273 z"/>
      <path fill="#626262" d="m 514.69946,433.19044 c 12.45669,0.0847 23.30841,5.78683 34.13233,11.58619 l -15.97017,11.89934 51.04191,0 0.3131,-34.75859 -15.97018,11.89934 c -16.16175,-8.16308 -31.01691,-17.95941 -53.54699,-18.16215 l 0,17.53587 z"/>
    </g>
  </svg>
);

const SAMLIcon = () => (
  <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
    <g fill="#c22e33">
      <path d="m7.754 2 .463.41q.516.454 1.026.915C11.44 5.32 13.3 7.565 14.7 10.149q.106.2.202.403l.098.203-.108.057-.081-.115-.21-.299-.147-.214c-1.019-1.479-2.04-2.96-3.442-4.145a6.6 6.6 0 0 0-1.393-.904c-1.014-.485-1.916-.291-2.69.505-.736.757-1.118 1.697-1.463 2.653q-.068.184-.139.367l-.082.215-.172-.055q.148-.522.284-1.049c.21-.795.42-1.59.712-2.356.31-.816.702-1.603 1.093-2.39q.255-.511.5-1.025z"/>
      <path d="M8.448 11.822c-1.626.77-5.56 1.564-7.426 1.36C.717 11.576 3.71 4.05 5.18 2.91l-.095.218a5 5 0 0 1-.138.303l-.066.129c-.76 1.462-1.519 2.926-1.908 4.53a7.5 7.5 0 0 0-.228 1.689c-.01 1.34.824 2.252 2.217 2.309.67.027 1.347-.043 2.023-.114.294-.03.587-.061.88-.084.108-.008.214-.021.352-.039z"/>
      <path d="M3.825 14.781q-.668.05-1.333.108c4.097.39 8.03-.277 11.91-1.644-1.265-2.23-2.97-3.991-4.952-5.522.026.098.084.169.141.239l.048.06q.257.338.527.67c.409.509.818 1.018 1.126 1.578.778 1.42.356 2.648-1.168 3.296-1.002.427-2.097.718-3.18.892-1.03.164-2.075.243-3.119.323"/>
    </g>
  </svg>
);

// ─── Data ──────────────────────────────────────────────────────────────────────

const USE_CASE_OPTIONS: { value: UseCase; label: string; icon: React.ReactNode }[] = [
  { value: 'applications', label: 'Applications', icon: <LayoutGrid className="size-4" /> },
  { value: 'agents',       label: 'Agents',       icon: <Bot className="size-4" /> },
  { value: 'apis',         label: 'APIs',         icon: <Braces className="size-4" /> },
  { value: 'wallets',      label: 'Wallets',      icon: <Wallet className="size-4" /> },
];

type IntegrationKind = 'tech' | 'standard';

type IntegrationOption = {
  kind: IntegrationKind;
  value: Technology | Standard;
  label: string;
  icon: React.ReactNode;
};

type IntegrationGroup = {
  label: string;
  options: IntegrationOption[];
};

const INTEGRATION_GROUPS: IntegrationGroup[] = [
  {
    label: 'Official SDKs',
    options: [
      { kind: 'tech', value: 'react',  label: 'React',   icon: <ReactIcon /> },
      { kind: 'tech', value: 'nextjs', label: 'Next.js', icon: <NextjsIcon /> },
    ],
  },
  {
    label: 'Community SDKs',
    options: [
      { kind: 'tech', value: 'vue',        label: 'Vue',        icon: <VueIcon /> },
      { kind: 'tech', value: 'nuxt',       label: 'Nuxt',       icon: <NuxtIcon /> },
      { kind: 'tech', value: 'flutter',    label: 'Flutter',    icon: <FlutterIcon /> },
      { kind: 'tech', value: 'springboot', label: 'Spring Boot',icon: <SpringBootIcon /> },
      { kind: 'tech', value: 'dotnet',     label: '.NET',       icon: <DotNetIcon /> },
      { kind: 'tech', value: 'angular',    label: 'Angular',    icon: <AngularIcon /> },
    ],
  },
  {
    label: 'Standards',
    options: [
      { kind: 'standard', value: 'oidc',       label: 'OpenID Connect', icon: <OIDCIcon /> },
      { kind: 'standard', value: 'saml',       label: 'SAML 2.0',       icon: <SAMLIcon /> },
      { kind: 'standard', value: 'native-api', label: 'Native API',     icon: <Braces className="size-4" /> },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export interface PersonaFilterProps {
  currentUseCase: UseCase;
  currentTech: Technology;
  currentStandard?: Standard;
}

function Dropdown<T extends string>({
  options,
  value,
  onChange,
  disabled,
  label,
}: {
  options: { value: T; label: string; icon: React.ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  disabled?: boolean;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-fd-muted-foreground/60">{label}</p>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={disabled}
        className="flex w-full items-center gap-2 rounded-lg border border-fd-border bg-fd-card px-3 py-2 text-sm text-fd-foreground shadow-sm transition-all duration-150 hover:border-fd-ring/60 hover:bg-fd-accent disabled:opacity-50"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-fd-primary/10 text-fd-primary">
          {selected.icon}
        </span>
        <span className="flex-1 truncate text-left font-medium">{selected.label}</span>
        <ChevronDown
          className={`size-3.5 shrink-0 text-fd-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-fd-border bg-fd-popover shadow-lg">
          <ul role="listbox" className="max-h-56 overflow-y-auto p-1">
            {options.map((opt) => (
              <li key={opt.value} role="option" aria-selected={opt.value === value}>
                <button
                  type="button"
                  onClick={() => { setOpen(false); onChange(opt.value); }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-fd-foreground transition-colors hover:bg-fd-accent"
                >
                  <span className="flex size-5 shrink-0 items-center justify-center text-fd-primary">
                    {opt.icon}
                  </span>
                  <span className="flex-1 text-left">{opt.label}</span>
                  {opt.value === value && <Check className="size-3.5 text-fd-primary" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function IntegrationDropdown({
  currentTech,
  currentStandard,
  onTech,
  onStandard,
  disabled,
}: {
  currentTech: Technology;
  currentStandard?: Standard;
  onTech: (v: Technology) => void;
  onStandard: (v: Standard) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const allOptions = INTEGRATION_GROUPS.flatMap((g) => g.options);
  const active = currentStandard
    ? allOptions.find((o) => o.kind === 'standard' && o.value === currentStandard)
    : allOptions.find((o) => o.kind === 'tech' && o.value === currentTech);
  const displayed = active ?? allOptions[0];

  function isActive(opt: IntegrationOption) {
    return opt.kind === 'standard'
      ? opt.value === currentStandard
      : opt.kind === 'tech' && opt.value === currentTech && !currentStandard;
  }

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function handleSelect(opt: IntegrationOption) {
    setOpen(false);
    if (opt.kind === 'tech') onTech(opt.value as Technology);
    else onStandard(opt.value as Standard);
  }

  return (
    <div ref={ref} className="relative">
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-fd-muted-foreground/60">With</p>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={disabled}
        className="flex w-full items-center gap-2 rounded-lg border border-fd-border bg-fd-card px-3 py-2 text-sm text-fd-foreground shadow-sm transition-all duration-150 hover:border-fd-ring/60 hover:bg-fd-accent disabled:opacity-50"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-fd-primary/10 text-fd-primary">
          {displayed.icon}
        </span>
        <span className="flex-1 truncate text-left font-medium">{displayed.label}</span>
        <ChevronDown
          className={`size-3.5 shrink-0 text-fd-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-fd-border bg-fd-popover shadow-lg">
          <ul role="listbox" className="p-1">
            {INTEGRATION_GROUPS.map((group, gi) => (
              <li key={group.label}>
                {gi > 0 && <div className="my-1 h-px bg-fd-border mx-2" />}
                <p className="px-2.5 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-fd-muted-foreground/60">
                  {group.label}
                </p>
                <ul>
                  {group.options.map((opt) => (
                    <li key={`${opt.kind}-${opt.value}`} role="option" aria-selected={isActive(opt)}>
                      <button
                        type="button"
                        onClick={() => handleSelect(opt)}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-fd-foreground transition-colors hover:bg-fd-accent"
                      >
                        <span className="flex size-5 shrink-0 items-center justify-center text-fd-primary">
                          {opt.icon}
                        </span>
                        <span className="flex-1 text-left">{opt.label}</span>
                        {isActive(opt) && <Check className="size-3.5 text-fd-primary" />}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function PersonaFilter({ currentUseCase, currentTech, currentStandard }: PersonaFilterProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleUseCase(value: UseCase) {
    if (value === currentUseCase) return;
    startTransition(async () => {
      await setUseCase(value);
      router.refresh();
    });
  }

  function handleTechnology(value: Technology) {
    if (value === currentTech && !currentStandard) return;
    startTransition(async () => {
      await setTechnology(value);
      await clearStandard();
      router.refresh();
    });
  }

  function handleStandard(value: Standard) {
    if (value === currentStandard) return;
    startTransition(async () => {
      await setStandard(value);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-3 pb-2">
      <Dropdown
        label="I'm securing"
        options={USE_CASE_OPTIONS}
        value={currentUseCase}
        onChange={handleUseCase}
        disabled={isPending}
      />
      {currentUseCase === 'applications' && (
        <IntegrationDropdown
          currentTech={currentTech}
          currentStandard={currentStandard}
          onTech={handleTechnology}
          onStandard={handleStandard}
          disabled={isPending}
        />
      )}
    </div>
  );
}
