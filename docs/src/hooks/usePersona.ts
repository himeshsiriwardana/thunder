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

export type Persona = 'all' | 'app' | 'iam' | 'devops';

export const STORAGE_KEY = 'thunder-docs-persona';

const CHANGE_EVENT = 'thunder-persona-change';

export interface PersonaOption {
  value: Persona;
  label: string;
  description: string;
}

export const PERSONA_OPTIONS: PersonaOption[] = [
  {value: 'all', label: 'All Roles', description: 'Browse all documentation'},
  {value: 'app', label: 'Application Developer', description: 'Integrate Thunder into your app'},
  {value: 'iam', label: 'IAM Developer', description: 'Configure and manage Thunder'},
  {value: 'devops', label: 'DevOps Engineer', description: 'Deploy and operate Thunder'},
];

export function applyPersona(persona: Persona): void {
  const html = document.documentElement;
  if (persona === 'all') {
    html.removeAttribute('data-persona');
  } else {
    html.setAttribute('data-persona', persona);
  }
}

/**
 * Persists the selected persona to localStorage, applies it to the DOM, and
 * dispatches a custom event so any other component using usePersona() updates
 * in the same browser tab without a page reload.
 */
export function setStoredPersona(persona: Persona): void {
  localStorage.setItem(STORAGE_KEY, persona);
  applyPersona(persona);
  window.dispatchEvent(new CustomEvent<Persona>(CHANGE_EVENT, {detail: persona}));
}

/**
 * Returns the current persona value and a setter that persists and broadcasts
 * the change. Both the landing page and the navbar dropdown use this hook so
 * they always reflect the same selection.
 */
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
