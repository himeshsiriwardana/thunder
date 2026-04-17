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

interface TechOption {
  value: string;
  label: string;
  logo: React.ReactElement;
}

const TECH_OPTIONS: TechOption[] = [
  {
    value: 'react',
    label: 'React',
    logo: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="tech-dropdown__logo"
      >
        <circle cx="12" cy="12" r="2.139" fill="#61dafb" />
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="3.8"
          fill="none"
          stroke="#61dafb"
          strokeWidth="1.2"
        />
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="3.8"
          fill="none"
          stroke="#61dafb"
          strokeWidth="1.2"
          transform="rotate(60 12 12)"
        />
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="3.8"
          fill="none"
          stroke="#61dafb"
          strokeWidth="1.2"
          transform="rotate(120 12 12)"
        />
      </svg>
    ),
  },
  {
    value: 'nodejs',
    label: 'Node.js',
    logo: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="tech-dropdown__logo"
      >
        <path
          d="M12 1.85L2.5 7.28v9.44L12 22.15l9.5-5.43V7.28L12 1.85zm0 2.31l7.5 4.29v8.1L12 20.84l-7.5-4.29V8.45L12 4.16z"
          fill="#539e43"
        />
        <path
          d="M12 7.5c-.28 0-.5.11-.65.28L8.5 10.5c-.15.17-.27.42-.27.7v2.6c0 .28.12.53.27.7l2.85 2.72c.15.17.37.28.65.28s.5-.11.65-.28l2.85-2.72c.15-.17.27-.42.27-.7v-2.6c0-.28-.12-.53-.27-.7l-2.85-2.72A.88.88 0 0 0 12 7.5z"
          fill="#539e43"
        />
      </svg>
    ),
  },
];

export default function TechDropdown(): React.ReactElement {
  const [selected, setSelected] = useState<string>('react');
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

  const current = TECH_OPTIONS.find(t => t.value === selected) ?? TECH_OPTIONS[0];

  return (
    <div
      ref={containerRef}
      className={`tech-dropdown${isOpen ? ' tech-dropdown--open' : ''}`}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Technology: ${current.label}`}
        className="tech-dropdown__trigger"
        onClick={() => setIsOpen(prev => !prev)}
      >
        {current.logo}
        <span className="tech-dropdown__label">{current.label}</span>
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
          className={`tech-dropdown__chevron${isOpen ? ' tech-dropdown__chevron--open' : ''}`}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <ul className="tech-dropdown__menu" role="listbox" aria-label="Select technology">
          {TECH_OPTIONS.map(option => (
            <li key={option.value} role="none">
              <button
                type="button"
                role="option"
                aria-selected={selected === option.value}
                className={`tech-dropdown__item${selected === option.value ? ' tech-dropdown__item--active' : ''}`}
                onClick={() => {
                  setSelected(option.value);
                  setIsOpen(false);
                }}
              >
                {option.logo}
                <span className="tech-dropdown__item-label">{option.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
