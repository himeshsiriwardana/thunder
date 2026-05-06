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

import React, {PropsWithChildren, useEffect} from 'react';
import {OxygenUIThemeProvider, AcrylicOrangeTheme} from '@wso2/oxygen-ui';
import {LoggerProvider, LogLevel} from '@thunder/logger/react';
import {useLocation, useHistory} from '@docusaurus/router';
import {STORAGE_KEY, PERSONA_OPTIONS, applyPersona} from '../hooks/usePersona';
import {TECH_STORAGE_KEY, STANDARD_STORAGE_KEY, applyTech, type Technology} from '../hooks/useTech';

export default function Root({children = null}: PropsWithChildren<Record<string, unknown>>) {
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const html = document.documentElement;
    const pagePath = location.pathname.replace(/\//g, '-').replace(/^-|-$/g, '') || 'home';
    html.setAttribute('data-page', pagePath);
    return () => {
      html.removeAttribute('data-page');
    };
  }, [location.pathname]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const isValid = saved && PERSONA_OPTIONS.some(p => p.value === saved);

    if (isValid) {
      applyPersona(saved as Parameters<typeof applyPersona>[0]);
      return;
    }

    // No persona selected yet — send first-time visitors to the landing page
    const isOnDocsPage = location.pathname.includes('/docs/');
    const isAlreadyOnHome = location.pathname.includes('/docs-home');

    if (isOnDocsPage && !isAlreadyOnHome) {
      history.replace('/docs-home');
    }
  }, [location.pathname]);

  useEffect(() => {
    const savedTech = localStorage.getItem(TECH_STORAGE_KEY) as Technology | null;
    const savedStd = localStorage.getItem(STANDARD_STORAGE_KEY);
    if (savedTech) {
      applyTech(savedTech);
    }
    if (savedStd) {
      document.documentElement.setAttribute('data-standard', savedStd);
    }
  }, []);

  return (
    <OxygenUIThemeProvider theme={AcrylicOrangeTheme}>
      <LoggerProvider
        logger={{
          level: LogLevel.DEBUG,
        }}
      >
        {children}
      </LoggerProvider>
    </OxygenUIThemeProvider>
  );
}
