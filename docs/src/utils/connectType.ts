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

export type ConnectType = 'app' | 'agent' | 'mcp';

const CONNECT_TYPE_EVENT = 'connect-type-change';

function isConnectType(value: string | undefined): value is ConnectType {
  return value === 'app' || value === 'agent' || value === 'mcp';
}

// The card components are mounted as independent sidebar entries (one per
// category), so a click on one needs to notify the others — there's no
// shared parent to hold this in ordinary React state.
export function applyConnectType(type: ConnectType | null): void {
  if (typeof document === 'undefined') return;
  if (type) {
    document.documentElement.dataset.connectType = type;
  } else {
    delete document.documentElement.dataset.connectType;
  }
  window.dispatchEvent(new CustomEvent<ConnectType | null>(CONNECT_TYPE_EVENT, {detail: type}));
}

export function getConnectType(): ConnectType | null {
  if (typeof document === 'undefined') return null;
  const current = document.documentElement.dataset.connectType;
  return isConnectType(current) ? current : null;
}

export function subscribeConnectType(callback: (type: ConnectType | null) => void): () => void {
  function handler(event: Event): void {
    callback((event as CustomEvent<ConnectType | null>).detail);
  }
  window.addEventListener(CONNECT_TYPE_EVENT, handler);
  return () => window.removeEventListener(CONNECT_TYPE_EVENT, handler);
}

export function connectTypeFromPath(pathname: string): ConnectType | null {
  return pathname.includes('/guides/getting-started/connect-your-application/') ? 'app' : null;
}

// Forces the per-item entrance animation on a connect section's tech list to
// replay. CSS animations don't re-trigger just because a max-height transition
// reveals the element again, so restart them manually via a reflow.
export function replayConnectSectionAnimation(type: ConnectType): void {
  if (typeof document === 'undefined') return;
  const items = document.querySelectorAll<HTMLElement>(`.connect-section--${type} > .menu__list > li`);
  items.forEach(el => {
    el.style.animation = 'none';
    void el.offsetHeight;
    el.style.animation = '';
  });
}
