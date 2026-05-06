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

import React, {useEffect, useRef, useState} from 'react';
import {PERSONA_OPTIONS, usePersona, type Persona} from '../../hooks/usePersona';

export type {Persona};

export default function PersonaDropdown(): React.ReactElement | null {
  const [persona, handleSelect] = usePersona();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const onSelect = (value: Persona) => {
    handleSelect(value);
    setIsOpen(false);
  };

  const current = PERSONA_OPTIONS.find(p => p.value === persona) ?? PERSONA_OPTIONS[0];

  return (
    <div
      ref={containerRef}
      className={`persona-dropdown${isOpen ? ' persona-dropdown--open' : ''}`}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`I'm securing: ${current.label}`}
        className="persona-dropdown__trigger"
        onClick={() => setIsOpen(prev => !prev)}
      >
        <span className="persona-dropdown__section-label">I&apos;m securing</span>
        <span className="persona-dropdown__label">{current.label}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`persona-dropdown__chevron${isOpen ? ' persona-dropdown__chevron--open' : ''}`}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <ul className="persona-dropdown__menu" role="listbox" aria-label="Select your role">
          {PERSONA_OPTIONS.map(option => (
            <li key={option.value} role="none">
              <button
                type="button"
                role="option"
                aria-selected={persona === option.value}
                className={`persona-dropdown__item${persona === option.value ? ' persona-dropdown__item--active' : ''}`}
                onClick={() => onSelect(option.value)}
              >
                <span className="persona-dropdown__item-label">{option.label}</span>
                <span className="persona-dropdown__item-desc">{option.description}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
