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

export type Persona = 'all' | 'applications' | 'agents' | 'apis' | 'wallets';

export const STORAGE_KEY = 'thunder-docs-usecase';

const CHANGE_EVENT = 'thunder-usecase-change';

export interface PersonaOption {
  value: Persona;
  label: string;
  description: string;
}

export const PERSONA_OPTIONS: PersonaOption[] = [
  {value: 'all', label: 'All', description: 'Browse all documentation'},
  {value: 'applications', label: 'Applications', description: 'Add login to your web or mobile app'},
  {value: 'agents', label: 'Agents', description: 'Secure AI agents and tool calls'},
  {value: 'apis', label: 'APIs', description: 'Protect your APIs and services'},
  {value: 'wallets', label: 'Wallets', description: 'Identity for digital wallets'},
];

export function applyPersona(persona: Persona): void {
  const html = document.documentElement;
  if (persona === 'all') {
    html.removeAttribute('data-usecase');
  } else {
    html.setAttribute('data-usecase', persona);
  }
}

export function setStoredPersona(persona: Persona): void {
  localStorage.setItem(STORAGE_KEY, persona);
  applyPersona(persona);
  window.dispatchEvent(new CustomEvent<Persona>(CHANGE_EVENT, {detail: persona}));
}

export function usePersona(): [Persona, (value: Persona) => void] {
  const [persona, setPersona] = useState<Persona>('all');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Persona | null;
    if (saved && PERSONA_OPTIONS.some(p => p.value === saved)) {
      setPersona(saved);
      applyPersona(saved);
    }

    const handler = (e: Event) => {
      setPersona((e as CustomEvent<Persona>).detail);
    };
    window.addEventListener(CHANGE_EVENT, handler);
    return () => window.removeEventListener(CHANGE_EVENT, handler);
  }, []);

  const handleSelect = useCallback((value: Persona) => {
    setStoredPersona(value);
    setPersona(value);
  }, []);

  return [persona, handleSelect];
}
