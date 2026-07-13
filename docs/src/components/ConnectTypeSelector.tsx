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

import {useLocation} from '@docusaurus/router';
import {Box} from '@wso2/oxygen-ui';
import {Bot, MonitorSmartphone, Server} from '@wso2/oxygen-ui-icons-react';
import React, {useEffect, useState} from 'react';
import {
  ConnectType,
  applyConnectType,
  connectTypeFromPath,
  getConnectType,
  replayConnectSectionAnimation,
  subscribeConnectType,
} from '../utils/connectType';

// ── Category metadata, keyed by type ───────────────────────────────────────────

const CATEGORY_INFO: Record<ConnectType, {Icon: typeof MonitorSmartphone; label: string; tagline: string; comingSoon: boolean}> = {
  app: {Icon: MonitorSmartphone, label: 'Application', tagline: 'Add sign-in to your app', comingSoon: false},
  agent: {Icon: Bot, label: 'AI Agent', tagline: 'Secure agentic workflows', comingSoon: true},
  mcp: {Icon: Server, label: 'MCP Server', tagline: 'Expose tools via MCP', comingSoon: true},
};

const px = 'var(--ifm-menu-link-padding-horizontal, 0.75rem)';

interface ConnectTypeCardProps {
  type: ConnectType;
}

// ── Component ─────────────────────────────────────────────────────────────────
// Renders a single "what are you building?" card. Each category (app/agent/mcp)
// mounts its own instance as a separate sidebar entry, immediately followed by
// that category's real doc items — this is what lets the tech list expand
// directly underneath the card that was clicked, rather than below all three.

export default function ConnectTypeSelector({type}: ConnectTypeCardProps): React.ReactElement {
  const location = useLocation();
  const {Icon, label, tagline, comingSoon} = CATEGORY_INFO[type];

  const [activeType, setActiveType] = useState<ConnectType | null>(
    () => getConnectType() ?? connectTypeFromPath(location.pathname),
  );

  useEffect(() => subscribeConnectType(setActiveType), []);

  // Auto-expand (or auto-collapse) this specific card based on the current
  // page, so landing directly on a technology page reveals the right section
  // without requiring a click.
  useEffect(() => {
    const fromPath = connectTypeFromPath(location.pathname);
    if (fromPath === type) {
      applyConnectType(type);
      replayConnectSectionAnimation(type);
    } else if (getConnectType() === type) {
      applyConnectType(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const isExpanded = activeType === type;

  function handleClick(): void {
    const next = isExpanded ? null : type;
    applyConnectType(next);
    if (next) replayConnectSectionAnimation(next);
  }

  return (
    <Box sx={{px}}>
      {type === 'app' && (
        <Box sx={{
          color: 'var(--ifm-color-content-secondary)',
          fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.03em',
          marginTop: '0.75rem', marginBottom: '0.55rem', textTransform: 'uppercase',
        }}>
          What are you building?
        </Box>
      )}
      <Box
        aria-expanded={comingSoon ? undefined : isExpanded}
        component="button"
        disabled={comingSoon}
        onClick={comingSoon ? undefined : handleClick}
        type="button"
        sx={{
          alignItems: 'center',
          background: isExpanded
            ? 'color-mix(in srgb, var(--ifm-color-primary) 8%, transparent)'
            : 'rgba(255,255,255,0.04)',
          border: '1px solid',
          borderColor: isExpanded
            ? 'color-mix(in srgb, var(--ifm-color-primary) 45%, transparent)'
            : 'rgba(255,255,255,0.1)',
          borderRadius: '12px',
          color: 'var(--ifm-font-color-base)',
          cursor: comingSoon ? 'default' : 'pointer',
          display: 'flex', gap: '0.75rem',
          marginBottom: '0.45rem',
          opacity: comingSoon ? 0.5 : 1,
          padding: '0.8rem 0.9rem',
          textAlign: 'left',
          transition: 'border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease',
          width: '100%',
          '[data-theme="light"] &': {
            background: isExpanded
              ? 'color-mix(in srgb, var(--ifm-color-primary) 8%, transparent)'
              : 'rgba(0,0,0,0.03)',
            borderColor: isExpanded
              ? 'color-mix(in srgb, var(--ifm-color-primary) 45%, transparent)'
              : 'rgba(0,0,0,0.09)',
          },
          ...(!comingSoon ? {
            '&:hover': {
              background: 'color-mix(in srgb, var(--ifm-color-primary) 8%, transparent)',
              borderColor: 'color-mix(in srgb, var(--ifm-color-primary) 45%, transparent)',
              boxShadow: '0 0 0 3px color-mix(in srgb, var(--ifm-color-primary) 10%, transparent)',
            },
            '&:active': {transform: 'scale(0.98)'},
          } : {}),
        }}
      >
        <Box component="span" sx={{
          alignItems: 'center',
          background: 'color-mix(in srgb, var(--ifm-color-primary) 18%, transparent)',
          borderRadius: '9px', color: 'var(--ifm-color-primary)',
          display: 'inline-flex', flexShrink: 0, height: '2.4rem',
          justifyContent: 'center', width: '2.4rem',
        }}>
          <Icon aria-hidden size={20} />
        </Box>
        <Box component="span" sx={{display: 'flex', flex: 1, flexDirection: 'column', gap: '0.1rem', minWidth: 0}}>
          <Box component="span" sx={{alignItems: 'center', display: 'flex', fontSize: '0.875rem', fontWeight: 700, gap: '0.45rem', lineHeight: 1.2}}>
            {label}
            {comingSoon && (
              <Box component="span" sx={{
                background: 'rgba(255,255,255,0.08)', borderRadius: '20px',
                color: 'var(--ifm-color-content-secondary)',
                fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.05em',
                padding: '0.1rem 0.45rem', textTransform: 'uppercase',
                '[data-theme="light"] &': {background: 'rgba(0,0,0,0.07)'},
              }}>Soon</Box>
            )}
          </Box>
          <Box component="span" sx={{color: 'var(--ifm-color-content-secondary)', fontSize: '0.72rem', lineHeight: 1.35}}>
            {tagline}
          </Box>
        </Box>
        {!comingSoon && (
          <Box component="span" sx={{
            color: 'color-mix(in srgb, var(--ifm-color-primary) 60%, transparent)',
            display: 'inline-flex', flexShrink: 0, opacity: 0.7,
            transform: isExpanded ? 'rotate(90deg)' : 'none',
            transition: 'transform 0.18s ease',
          }}>→</Box>
        )}
      </Box>
    </Box>
  );
}
