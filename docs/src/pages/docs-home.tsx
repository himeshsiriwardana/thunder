/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, {JSX, useEffect, useState} from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import {useHistory} from '@docusaurus/router';
import styles from './docs-home.module.css';
import {setStoredPersona, type Persona} from '../hooks/usePersona';
import {setStoredTech, setStoredStandard, type Technology, type Standard} from '../hooks/useTech';

type Step = 'usecase' | 'sub';

// ─── Icons ───────────────────────────────────────────────────────────────────

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
    </svg>
  );
}

function AppWindowIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="3" width="20" height="18" rx="2" />
      <path d="M2 8h20" />
      <circle cx="6" cy="5.5" r="0.8" fill="currentColor" />
      <circle cx="9" cy="5.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

function AgentIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 12V8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4" />
      <path d="M16 12h6v4h-6a2 2 0 0 1 0-4z" />
    </svg>
  );
}

function OidcIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="8" cy="15" r="4" />
      <path d="m15 9-1.5 1.5" /><path d="m12 12 5-5" /><path d="m17 7 1 1" />
    </svg>
  );
}

function SamlIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <circle cx="8.5" cy="12" r="1.5" />
      <path d="M14 10h4M14 14h4" />
    </svg>
  );
}

function NativeApiIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────

type UseCaseId = Exclude<Persona, 'all'>;

const USE_CASES: {
  id: UseCaseId;
  label: string;
  subtitle: string;
  description: string;
  icon: JSX.Element;
  colorScheme: 'blue' | 'violet' | 'amber' | 'emerald';
}[] = [
  {
    id: 'applications',
    label: 'Applications',
    subtitle: 'Web & mobile apps',
    description: 'Secure user-facing applications with login, sign-up, social auth, and MFA using our SDKs and pre-built flows.',
    icon: <AppWindowIcon />,
    colorScheme: 'blue',
  },
  {
    id: 'agents',
    label: 'Agents',
    subtitle: 'AI & autonomous agents',
    description: 'Add identity and authorization to AI agents, bots, and automated workflows that act on behalf of users.',
    icon: <AgentIcon />,
    colorScheme: 'violet',
  },
  {
    id: 'apis',
    label: 'APIs',
    subtitle: 'Backend & microservices',
    description: 'Protect your APIs and services with token-based auth, scopes, and fine-grained access control.',
    icon: <ApiIcon />,
    colorScheme: 'amber',
  },
  {
    id: 'wallets',
    label: 'Wallets',
    subtitle: 'Digital identity wallets',
    description: 'Issue and verify credentials, manage decentralized identities, and integrate with digital wallet standards.',
    icon: <WalletIcon />,
    colorScheme: 'emerald',
  },
];

const TECH_OPTIONS: {id: Technology; label: string}[] = [
  {id: 'react', label: 'React'},
  {id: 'nextjs', label: 'Next.js'},
  {id: 'vue', label: 'Vue'},
  {id: 'nuxt', label: 'Nuxt'},
  {id: 'flutter', label: 'Flutter'},
  {id: 'springboot', label: 'Spring Boot'},
  {id: 'dotnet', label: '.NET'},
  {id: 'angular', label: 'Angular'},
];

const STANDARD_OPTIONS: {id: Standard; label: string; description: string; icon: JSX.Element}[] = [
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

const STORAGE_KEY = 'thunder-docs-usecase';

// ─── Component ───────────────────────────────────────────────────────────────

export default function DocsHome(): JSX.Element {
  const history = useHistory();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<Step>('usecase');
  const [chosenUseCase, setChosenUseCase] = useState<UseCaseId | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Persona | null;
    const validUseCases: UseCaseId[] = ['applications', 'agents', 'apis', 'wallets'];
    if (saved && validUseCases.includes(saved as UseCaseId)) {
      setStoredPersona(saved as UseCaseId);
      history.replace('/docs');
      return;
    }
    const timer = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(timer);
  }, []);

  function handleUseCaseClick(uc: UseCaseId) {
    if (uc === 'applications') {
      setChosenUseCase(uc);
      setStep('sub');
    } else {
      setStoredPersona(uc);
      history.push('/docs');
    }
  }

  function handleTechSelect(tech: Technology) {
    if (!chosenUseCase) return;
    setStoredPersona(chosenUseCase);
    setStoredTech(tech);
    history.push('/docs');
  }

  function handleStandardSelect(std: Standard) {
    if (!chosenUseCase) return;
    setStoredPersona(chosenUseCase);
    setStoredStandard(std);
    history.push('/docs');
  }

  return (
    <Layout title="Get Started" description="Choose your use case and get started with Thunder documentation.">
      <Head>
        <html data-page="docs-home" />
      </Head>
      <main className={styles.page}>
        <div className={styles.background} aria-hidden="true" />
        <div className={styles.container}>
          <header className={`${styles.header} ${visible ? styles.headerVisible : ''}`}>
            <div className={styles.badge}>Documentation</div>
          </header>

          {/* ── Step 1: Use-case selection ── */}
          {step === 'usecase' && (
            <div className={styles.stepWrap}>
              <div className={`${styles.stepHeader} ${visible ? styles.stepHeaderVisible : ''}`}>
                <h1 className={styles.title}>What do you want to secure?</h1>
                <p className={styles.subtitle}>
                  Pick your use case and we&apos;ll tailor the docs to what matters most.
                </p>
              </div>

              <div className={styles.cardsGrid}>
                {USE_CASES.map((uc, index) => (
                  <button
                    key={uc.id}
                    type="button"
                    className={`${styles.ucCard} ${styles[uc.colorScheme]} ${visible ? styles.cardVisible : ''}`}
                    style={{'--stagger': index} as React.CSSProperties}
                    onClick={() => handleUseCaseClick(uc.id)}
                  >
                    <div className={styles.cardInner}>
                      <div className={styles.iconWrap}>{uc.icon}</div>
                      <div className={styles.cardSubtitle}>{uc.subtitle}</div>
                      <h2 className={styles.cardTitle}>{uc.label}</h2>
                      <p className={styles.cardDesc}>{uc.description}</p>
                    </div>
                    <div className={styles.cardFooter}>
                      <span className={styles.cta}>
                        Continue
                        <ArrowRightIcon />
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <p className={`${styles.hint} ${visible ? styles.hintVisible : ''}`}>
                You can change this at any time from the sidebar.
              </p>
            </div>
          )}

          {/* ── Step 2: Technology + Standards (Applications only) ── */}
          {step === 'sub' && chosenUseCase && (
            <div className={styles.subStep}>
              <button
                type="button"
                className={styles.backBtn}
                onClick={() => {setStep('usecase'); setChosenUseCase(null);}}
              >
                <ArrowLeftIcon /> Back
              </button>

              <div className={styles.subHeader}>
                <div className={styles.subBadge}>
                  <span className={styles.subBadgeUsecase}>{chosenUseCase}</span>
                  <span>·</span>
                  <span>Step 2 of 2</span>
                </div>
                <h1 className={styles.title}>How do you want to integrate?</h1>
                <p className={styles.subtitle}>
                  Choose a technology or a standard to get tailored guides and examples.
                </p>
              </div>

              <div className={styles.subSection}>
                <p className={styles.groupLabel}>Technology</p>
                <div className={styles.techGrid}>
                  {TECH_OPTIONS.map((t, index) => (
                    <button
                      key={t.id}
                      type="button"
                      className={styles.techCard}
                      style={{'--stagger': index} as React.CSSProperties}
                      onClick={() => handleTechSelect(t.id)}
                    >
                      <span className={styles.techLabel}>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.subSection}>
                <p className={styles.groupLabel}>Standards</p>
                <div className={styles.standardsGrid}>
                  {STANDARD_OPTIONS.map((s, index) => (
                    <button
                      key={s.id}
                      type="button"
                      className={styles.standardCard}
                      style={{'--stagger': index} as React.CSSProperties}
                      onClick={() => handleStandardSelect(s.id)}
                    >
                      <div className={styles.standardIcon}>{s.icon}</div>
                      <div>
                        <p className={styles.standardLabel}>{s.label}</p>
                        <p className={styles.standardDesc}>{s.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <p className={styles.hint}>You can change this at any time from the sidebar.</p>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
