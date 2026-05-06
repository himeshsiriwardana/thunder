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

import React, {useEffect, useRef} from 'react';
import {DEFAULT_TECHNOLOGY, setStoredStandard, setStoredTech, useTech, type Standard, type Technology} from '../../hooks/useTech';

interface TechOption {
  value: Technology;
  label: string;
}

interface StandardOption {
  value: Standard;
  label: string;
}

interface OptionGroup {
  label: string;
  type: 'tech' | 'standard';
  options: TechOption[] | StandardOption[];
}

const OPTION_GROUPS: OptionGroup[] = [
  {
    label: 'Official SDKs',
    type: 'tech',
    options: [
      {value: 'react', label: 'React'},
      {value: 'nextjs', label: 'Next.js'},
    ] as TechOption[],
  },
  {
    label: 'Community SDKs',
    type: 'tech',
    options: [
      {value: 'vue', label: 'Vue'},
      {value: 'nuxt', label: 'Nuxt'},
      {value: 'flutter', label: 'Flutter'},
      {value: 'springboot', label: 'Spring Boot'},
      {value: 'dotnet', label: '.NET'},
      {value: 'angular', label: 'Angular'},
    ] as TechOption[],
  },
  {
    label: 'Standards',
    type: 'standard',
    options: [
      {value: 'oidc', label: 'OpenID Connect'},
      {value: 'saml', label: 'SAML 2.0'},
      {value: 'native-api', label: 'Native API'},
    ] as StandardOption[],
  },
];

function getDisplayLabel(tech: Technology, standard: Standard | undefined): string {
  if (standard) {
    const stdGroup = OPTION_GROUPS.find(g => g.type === 'standard');
    const found = stdGroup?.options.find(o => o.value === standard);
    return found?.label ?? standard;
  }
  const techGroup = OPTION_GROUPS.filter(g => g.type === 'tech');
  for (const group of techGroup) {
    const found = group.options.find(o => o.value === tech);
    if (found) return found.label;
  }
  return tech;
}

export default function TechDropdown(): React.ReactElement {
  const [tech, standard, , ] = useTech();
  const [isOpen, setIsOpen] = React.useState(false);
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

  const effectiveTech = tech ?? DEFAULT_TECHNOLOGY;
  const displayLabel = getDisplayLabel(effectiveTech, standard);

  return (
    <div
      ref={containerRef}
      className={`tech-dropdown${isOpen ? ' tech-dropdown--open' : ''}`}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`With: ${displayLabel}`}
        className="tech-dropdown__trigger"
        onClick={() => setIsOpen(prev => !prev)}
      >
        <span className="tech-dropdown__section-label">With</span>
        <span className="tech-dropdown__label">{displayLabel}</span>
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
        <div className="tech-dropdown__menu" role="listbox" aria-label="Select integration">
          {OPTION_GROUPS.map(group => (
            <div key={group.label} className="tech-dropdown__group">
              <div className="tech-dropdown__group-label">{group.label}</div>
              {group.type === 'tech'
                ? (group.options as TechOption[]).map(option => {
                    const isActive = !standard && tech === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        className={`tech-dropdown__item${isActive ? ' tech-dropdown__item--active' : ''}`}
                        onClick={() => {
                          setStoredTech(option.value);
                          setIsOpen(false);
                        }}
                      >
                        <span className="tech-dropdown__item-label">{option.label}</span>
                      </button>
                    );
                  })
                : (group.options as StandardOption[]).map(option => {
                    const isActive = standard === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        className={`tech-dropdown__item${isActive ? ' tech-dropdown__item--active' : ''}`}
                        onClick={() => {
                          setStoredStandard(option.value);
                          setIsOpen(false);
                        }}
                      >
                        <span className="tech-dropdown__item-label">{option.label}</span>
                      </button>
                    );
                  })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
