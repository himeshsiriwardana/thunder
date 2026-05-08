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

import React, {JSX} from 'react';
import {Box, Typography} from '@wso2/oxygen-ui';
import Link from '@docusaurus/Link';
import useIsDarkMode from '../hooks/useIsDarkMode';
import useScrollAnimation from '../hooks/useScrollAnimation';

// ─── Step cards ──────────────────────────────────────────────────────────────

const STEP_CARDS = [
  {
    number: '01',
    title: 'Install',
    description: 'Run ThunderID locally or with Docker Compose in minutes.',
    href: '/docs/next/guides/getting-started/get-thunderid',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" x2="12" y1="15" y2="3"/>
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Start the server',
    description: 'Boot ThunderID and open the management console.',
    href: '/docs/next/guides/getting-started/get-thunderid',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="3" rx="2"/>
        <line x1="8" x2="16" y1="21" y2="21"/>
        <line x1="12" x2="12" y1="17" y2="21"/>
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Create an app',
    description: 'Register an OAuth 2.0 application and get your client credentials.',
    href: '/docs/next/guides/quick-start/create-your-first-application',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect width="7" height="7" x="3" y="3" rx="1"/>
        <rect width="7" height="7" x="14" y="3" rx="1"/>
        <rect width="7" height="7" x="14" y="14" rx="1"/>
        <rect width="7" height="7" x="3" y="14" rx="1"/>
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Build a flow',
    description: 'Use the flow designer to wire up a complete sign-in experience.',
    href: '/docs/next/guides/guides/flows/build-a-flow',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="18" r="3"/>
        <circle cx="6" cy="6" r="3"/>
        <path d="M13 6h3a2 2 0 0 1 2 2v7"/>
        <path d="M11 18H8a2 2 0 0 1-2-2V9"/>
      </svg>
    ),
  },
];

interface StepItemProps {
  step: (typeof STEP_CARDS)[number];
  index: number;
  isVisible: boolean;
  isDark: boolean;
}

function StepItem({step, index, isVisible, isDark}: StepItemProps): JSX.Element {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.25,
        p: 2.5,
        borderRadius: '12px',
        border: '1px solid',
        borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
        bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
        transitionProperty: 'opacity, transform',
        transitionDuration: '0.45s',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: isVisible ? `${index * 0.07}s` : '0s',
      }}
    >
      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: '8px',
            bgcolor: 'rgba(250,123,63,0.12)',
            color: '#fa7b3f',
          }}
        >
          {step.icon}
        </Box>
        <Typography
          component="span"
          sx={{
            fontFamily: 'monospace',
            fontSize: '1.1rem',
            fontWeight: 700,
            color: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
            letterSpacing: '0.02em',
          }}
        >
          {step.number}
        </Typography>
      </Box>
      <Typography
        variant="body2"
        sx={{fontWeight: 700, fontSize: '0.9rem', color: isDark ? 'rgba(255,255,255,0.9)' : '#1a1a2e'}}
      >
        {step.title}
      </Typography>
      <Typography
        variant="body2"
        sx={{fontSize: '0.8rem', lineHeight: 1.55, color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.5)'}}
      >
        {step.description}
      </Typography>
    </Box>
  );
}

function QuickstartPanel({isDark, isVisible}: {isDark: boolean; isVisible: boolean}): JSX.Element {
  return (
    <Box
      sx={{
        p: {xs: 3, md: 4},
        borderRadius: '16px',
        border: '1px solid',
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
        bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
      }}
    >
      <Typography
        component="h2"
        variant="h4"
        sx={{fontWeight: 800, mb: 0.5, fontSize: {xs: '1.4rem', md: '1.6rem'}, color: isDark ? '#ffffff' : '#1a1a2e', letterSpacing: '-0.01em'}}
      >
        New to ThunderID?
      </Typography>
      <Typography
        variant="body1"
        sx={{fontWeight: 500, mb: 3, fontSize: '0.95rem', color: isDark ? 'rgba(250,123,63,0.75)' : 'rgba(200,80,20,0.75)'}}
      >
        Start in minutes with these simple steps.
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)'},
          gap: {xs: 2.5, lg: 3},
        }}
      >
        {STEP_CARDS.map((step, index) => (
          <StepItem key={step.number} step={step} index={index} isVisible={isVisible} isDark={isDark} />
        ))}
      </Box>
      <Box sx={{mt: 2.5}}>
        <Box
          component={Link}
          to="/docs/next/guides/getting-started/get-thunderid"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.75,
            px: 3,
            py: 1.25,
            borderRadius: '8px',
            bgcolor: '#fa7b3f',
            color: '#ffffff !important',
            fontWeight: 800,
            fontSize: '0.925rem',
            textDecoration: 'none !important',
            transition: 'background-color 0.2s',
            '&:hover': {bgcolor: '#e06930', textDecoration: 'none !important'},
          }}
        >
          Get started →
        </Box>
      </Box>
    </Box>
  );
}

// ─── Use-case cards ───────────────────────────────────────────────────────────

const USE_CASE_CARDS = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fa7b3f" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2"/>
        <path d="M10 4v4"/><path d="M2 8h20"/><path d="M6 4v4"/>
      </svg>
    ),
    label: 'Secure an application',
    description: 'Add sign-in to a web, mobile, or single-page app. Create an application, configure redirect URIs, and build a sign-in flow with OAuth 2.0 or OIDC.',
    cta: 'Learn more',
    featured: false,
    href: '/docs/next/guides/guides/applications/manage-applications',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fa7b3f" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="8" x="2" y="2" rx="2"/>
        <rect width="20" height="8" x="2" y="14" rx="2"/>
        <line x1="6" x2="6.01" y1="6" y2="6"/>
        <line x1="6" x2="6.01" y1="18" y2="18"/>
      </svg>
    ),
    label: 'Protect an API',
    description: 'Register a resource server, define granular scopes, and validate access tokens issued by ThunderID in your API or microservice.',
    cta: 'Learn more',
    featured: false,
    href: '/docs/next/guides/guides/resource-servers',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fa7b3f" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
        <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
        <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
        <path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
      </svg>
    ),
    label: 'Build B2B SaaS',
    description: 'Create organization units for each customer, configure per-tenant identity providers, and delegate admin access to your customers.',
    cta: 'Learn more',
    featured: false,
    href: '/docs/next/use-cases/b2b/multi-tenant-saas',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fa7b3f" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8V4H8"/>
        <rect width="16" height="12" x="4" y="8" rx="2"/>
        <path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
      </svg>
    ),
    label: 'Connect AI agents',
    description: 'Secure MCP servers and issue delegated access tokens so AI agents can call APIs and act on behalf of users in autonomous workflows.',
    cta: 'Learn more',
    featured: false,
    href: '/docs/next/use-cases/ai-agents/agent-authentication',
  },
];

interface UseCaseCardProps {
  card: (typeof USE_CASE_CARDS)[number];
  index: number;
  isVisible: boolean;
  isDark: boolean;
}

function UseCaseCard({card, index, isVisible, isDark}: UseCaseCardProps): JSX.Element {
  return (
    <Box
      component={Link}
      to={card.href}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 3,
        borderRadius: '14px',
        textDecoration: 'none !important',
        border: '1px solid',
        borderColor: card.featured
          ? (isDark ? 'rgba(255, 140, 0, 0.3)' : 'rgba(255, 140, 0, 0.35)')
          : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'),
        bgcolor: card.featured
          ? (isDark ? 'rgba(255, 143, 51, 0.06)' : 'rgba(255, 143, 51, 0.03)')
          : (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)'),
        color: 'inherit',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
        transitionProperty: 'opacity, transform, border-color, box-shadow',
        transitionDuration: '0.5s, 0.5s, 0.2s, 0.2s',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: isVisible ? `${index * 0.07}s` : '0s',
        '&:hover': {
          borderColor: card.featured
            ? 'rgba(255,107,0,0.55)'
            : 'rgba(255,107,0,0.3)',
          boxShadow: isDark ? '0 4px 16px rgba(255,107,0,0.07)' : '0 4px 16px rgba(255,107,0,0.05)',
          textDecoration: 'none !important',
        },
      }}
    >
      <Box sx={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between'}}>
        <Box sx={{p: 1, borderRadius: '8px', bgcolor: 'rgba(255,143,51,0.12)', display: 'inline-flex'}}>
          {card.icon}
        </Box>
        {card.featured && (
          <Typography
            component="span"
            sx={{
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: '#fa7b3f',
              bgcolor: 'rgba(255,143,51,0.12)',
              px: 1,
              py: 0.4,
              borderRadius: '4px',
              border: '1px solid rgba(255,143,51,0.25)',
            }}
          >
            NEW
          </Typography>
        )}
      </Box>
      <Box sx={{flex: 1}}>
        <Typography variant="h6" sx={{fontWeight: 700, fontSize: '1rem', mb: 0.75, color: isDark ? '#ffffff' : '#1a1a2e'}}>
          {card.label}
        </Typography>
        <Typography variant="body2" sx={{fontSize: '0.875rem', lineHeight: 1.6, color: isDark ? 'rgba(255,255,255,0.72)' : 'rgba(0,0,0,0.62)'}}>
          {card.description}
        </Typography>
      </Box>
    </Box>
  );
}

// ─── Browse by topic ─────────────────────────────────────────────────────────

const BROWSE_TOPICS = [
  {
    label: 'Guides',
    description: 'Step-by-step how-to guides',
    href: '/docs/next/guides',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
  },
  {
    label: 'Deployment',
    description: 'Run ThunderID in production',
    href: '/docs/next/guides/getting-started/get-thunderid',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
        <path d="M12 12v9"/><path d="m8 17 4-5 4 5"/>
      </svg>
    ),
  },
  {
    label: 'APIs',
    description: 'Full REST API reference',
    href: '/docs/next/apis',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  {
    label: 'SDKs',
    description: 'Client libraries and integrations',
    href: '/docs/next/sdks/overview',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      </svg>
    ),
  },
];

function BrowseTopics({isDark}: {isDark: boolean}): JSX.Element {
  return (
    <Box>
      <Typography component="h2" variant="h5" sx={{fontWeight: 700, mb: 2, fontSize: '1.2rem', color: isDark ? '#ffffff' : '#1a1a2e'}}>
        Explore the platform
      </Typography>
      <Box sx={{display: 'grid', gridTemplateColumns: {xs: '1fr 1fr', md: 'repeat(4, 1fr)'}, gap: 1.5}}>
        {BROWSE_TOPICS.map((topic) => (
          <Box
            key={topic.label}
            component={Link}
            to={topic.href}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              px: 2,
              py: 1.75,
              borderRadius: '10px',
              textDecoration: 'none !important',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.6)',
              border: '1px solid',
              borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
              transition: 'color 0.15s, border-color 0.15s, background-color 0.15s',
              '&:hover': {
                color: '#fa7b3f',
                borderColor: 'rgba(255,107,0,0.3)',
                bgcolor: isDark ? 'rgba(255,143,51,0.06)' : 'rgba(255,143,51,0.04)',
                textDecoration: 'none !important',
              },
            }}
          >
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
              <Box component="span" sx={{color: '#fa7b3f', display: 'flex', alignItems: 'center', flexShrink: 0}}>
                {topic.icon}
              </Box>
              <Typography component="span" sx={{fontWeight: 700, fontSize: '0.9rem', color: isDark ? 'rgba(255,255,255,0.9)' : '#1a1a2e'}}>
                {topic.label}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{fontSize: '0.78rem', lineHeight: 1.4, color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.45)'}}>
              {topic.description}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function DocsGetStarted(): JSX.Element {
  const isDark = useIsDarkMode();
  const {ref: quickstartRef, isVisible: quickstartVisible} = useScrollAnimation({threshold: 0.05});
  const {ref: useCaseRef, isVisible: useCaseVisible} = useScrollAnimation({threshold: 0.05});

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 5}}>

      {/* Quickstart panel */}
      <Box ref={quickstartRef}>
        <QuickstartPanel isDark={isDark} isVisible={quickstartVisible} />
      </Box>

      {/* Use cases */}
      <Box ref={useCaseRef}>
        <Typography component="h2" variant="h5" sx={{fontWeight: 700, mb: 2.5, fontSize: '1.2rem', color: isDark ? '#ffffff' : '#1a1a2e'}}>
          Know your use case?
        </Typography>
        <Box sx={{display: 'grid', gridTemplateColumns: {xs: '1fr', md: 'repeat(2, 1fr)'}, gap: 2}}>
          {USE_CASE_CARDS.map((card, index) => (
            <UseCaseCard key={card.label} card={card} index={index} isVisible={useCaseVisible} isDark={isDark} />
          ))}
        </Box>
      </Box>

      {/* Browse by topic */}
      <BrowseTopics isDark={isDark} />

    </Box>
  );
}
