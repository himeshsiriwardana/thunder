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

import {useCallback, useEffect, useState} from 'react';

export type Technology =
  | 'react'
  | 'nextjs'
  | 'vue'
  | 'nuxt'
  | 'flutter'
  | 'springboot'
  | 'dotnet'
  | 'angular';

export type Standard = 'oidc' | 'saml' | 'native-api';

export const TECH_STORAGE_KEY = 'thunder-docs-technology';
export const STANDARD_STORAGE_KEY = 'thunder-docs-standard';
export const DEFAULT_TECHNOLOGY: Technology = 'react';

const TECH_CHANGE_EVENT = 'thunder-tech-change';
const STANDARD_CHANGE_EVENT = 'thunder-standard-change';

export function applyTech(tech: Technology): void {
  document.documentElement.setAttribute('data-tech', tech);
}

export function setStoredTech(tech: Technology): void {
  localStorage.setItem(TECH_STORAGE_KEY, tech);
  localStorage.removeItem(STANDARD_STORAGE_KEY);
  applyTech(tech);
  document.documentElement.removeAttribute('data-standard');
  window.dispatchEvent(new CustomEvent<Technology>(TECH_CHANGE_EVENT, {detail: tech}));
  window.dispatchEvent(new CustomEvent<string>(STANDARD_CHANGE_EVENT, {detail: ''}));
}

export function setStoredStandard(standard: Standard): void {
  localStorage.setItem(STANDARD_STORAGE_KEY, standard);
  document.documentElement.setAttribute('data-standard', standard);
  window.dispatchEvent(new CustomEvent<Standard>(STANDARD_CHANGE_EVENT, {detail: standard}));
}

export function useTech(): [Technology, Standard | undefined, (tech: Technology) => void, (std: Standard) => void] {
  const [tech, setTech] = useState<Technology>(DEFAULT_TECHNOLOGY);
  const [standard, setStandard] = useState<Standard | undefined>(undefined);

  useEffect(() => {
    const savedTech = localStorage.getItem(TECH_STORAGE_KEY) as Technology | null;
    const savedStd = localStorage.getItem(STANDARD_STORAGE_KEY) as Standard | null;

    const validTechs: Technology[] = ['react', 'nextjs', 'vue', 'nuxt', 'flutter', 'springboot', 'dotnet', 'angular'];
    const validStds: Standard[] = ['oidc', 'saml', 'native-api'];

    if (savedTech && validTechs.includes(savedTech)) {
      setTech(savedTech);
      applyTech(savedTech);
    }
    if (savedStd && validStds.includes(savedStd)) {
      setStandard(savedStd);
      document.documentElement.setAttribute('data-standard', savedStd);
    }

    const techHandler = (e: Event) => {
      setTech((e as CustomEvent<Technology>).detail);
      setStandard(undefined);
    };
    const stdHandler = (e: Event) => {
      const val = (e as CustomEvent<string>).detail;
      setStandard(val ? (val as Standard) : undefined);
    };

    window.addEventListener(TECH_CHANGE_EVENT, techHandler);
    window.addEventListener(STANDARD_CHANGE_EVENT, stdHandler);
    return () => {
      window.removeEventListener(TECH_CHANGE_EVENT, techHandler);
      window.removeEventListener(STANDARD_CHANGE_EVENT, stdHandler);
    };
  }, []);

  const handleTech = useCallback((value: Technology) => {
    setStoredTech(value);
    setTech(value);
    setStandard(undefined);
  }, []);

  const handleStandard = useCallback((value: Standard) => {
    setStoredStandard(value);
    setStandard(value);
  }, []);

  return [tech, standard, handleTech, handleStandard];
}
