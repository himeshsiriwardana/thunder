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
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import styles from './docs-home.module.css';
import {setStoredPersona, usePersona, type Persona as PersonaValue} from '../hooks/usePersona';

interface Persona {
  id: string;
  tagline: string;
  title: string;
  description: string;
  href: string;
  colorScheme: 'blue' | 'violet' | 'emerald';
  tags: string[];
  icon: JSX.Element;
}

const CODE_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const SHIELD_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const SERVER_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="8" rx="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" />
    <line x1="6" y1="18" x2="6.01" y2="18" />
  </svg>
);

const PERSONAS: Persona[] = [
  {
    id: 'app',
    tagline: "I'm building an app",
    title: 'Application Developer',
    description:
      'Integrate login and registration into your application. Register OAuth clients, manage users, and connect your frontend or backend with Thunder using ready-to-go SDKs and quick-start guides.',
    href: '/docs/next/guides/quick-start/quickstart',
    colorScheme: 'blue',
    tags: ['Quick Start', 'OAuth 2.0', 'OIDC', 'SDKs'],
    icon: CODE_ICON,
  },
  {
    id: 'iam',
    tagline: "I'm designing identity flows",
    title: 'Identity Developer',
    description:
      'Orchestrate login, registration, and account recovery flows. Configure identity providers, define auth policies, and extend Thunder with custom executors and user schema definitions.',
    href: '/docs/next/guides/getting-started/what-is-thunder',
    colorScheme: 'violet',
    tags: ['Flows', 'Identity Providers', 'Policies', 'Schema'],
    icon: SHIELD_ICON,
  },
  {
    id: 'devops',
    tagline: "I'm deploying infrastructure",
    title: 'DevOps Engineer',
    description:
      'Run Thunder reliably at scale. Explore containerized deployment patterns, Kubernetes configurations, and operational best practices for a production-ready identity platform.',
    href: '/docs/next/guides/deployment-patterns/docker',
    colorScheme: 'emerald',
    tags: ['Docker', 'Kubernetes', 'OpenChoreo', 'Configuration'],
    icon: SERVER_ICON,
  },
];

export default function DocsHome(): JSX.Element {
  const [visible, setVisible] = useState(false);
  const [activePersona] = usePersona();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 60);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout
      title="Get Started"
      description="Choose your path and get started with Thunder documentation."
    >
      <Head>
        <html data-page="docs-home" />
      </Head>
      <main className={styles.page}>
        <div className={styles.background} aria-hidden="true" />
        <div className={styles.container}>
          <header className={`${styles.header} ${visible ? styles.headerVisible : ''}`}>
            <div className={styles.badge}>Documentation</div>
            <h1 className={styles.title}>What&apos;s the best way to describe you?</h1>
            <p className={styles.subtitle}>
              We&apos;ll show you what&apos;s needed to get started.
            </p>
          </header>

          <div className={styles.cards}>
            {PERSONAS.map((persona, index) => (
              <Link
                key={persona.id}
                to={persona.href}
                className={`${styles.card} ${styles[persona.colorScheme]} ${visible ? styles.cardVisible : ''} ${activePersona === persona.id ? styles.cardActive : ''}`}
                style={{'--stagger': index} as React.CSSProperties}
                onClick={() => setStoredPersona(persona.id as PersonaValue)}
              >
                <div className={styles.cardInner}>
                  <div className={styles.iconWrap}>{persona.icon}</div>
                  <div className={styles.cardTagline}>{persona.tagline}</div>
                  <h2 className={styles.cardTitle}>{persona.title}</h2>
                  <p className={styles.cardDesc}>{persona.description}</p>
                  <div className={styles.tags}>
                    {persona.tags.map(tag => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.cta}>
                    Get started
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={styles.ctaArrow}
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
