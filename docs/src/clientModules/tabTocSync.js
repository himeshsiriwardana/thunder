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

let observer = null;

function isHeadingVisible(id) {
  const el = document.getElementById(id);
  if (!el) return null; // heading not in DOM — don't hide
  // offsetParent is null when the element or any ancestor has display:none
  return el.offsetParent !== null;
}

function syncTocWithTabs() {
  const tabPanels = document.querySelectorAll('[role="tabpanel"]');
  if (tabPanels.length === 0) return;

  document.querySelectorAll('.table-of-contents__link').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href?.startsWith('#')) return;
    const id = href.slice(1);
    const li = link.closest('li');
    if (!li) return;

    const visible = isHeadingVisible(id);
    // visible===null means heading not in DOM (don't touch it)
    if (visible === false) {
      li.style.display = 'none';
    } else {
      li.style.display = '';
    }
  });
}

function setup() {
  syncTocWithTabs();

  if (observer) observer.disconnect();

  observer = new MutationObserver((mutations) => {
    let shouldSync = false;
    for (const mutation of mutations) {
      // Tab panel toggled hidden/visible
      if (mutation.type === 'attributes') {
        shouldSync = true;
        break;
      }
      // TOC links added to DOM (lazy-rendered when user opens "On this page")
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1 && node.querySelector?.('.table-of-contents__link')) {
            shouldSync = true;
            break;
          }
        }
      }
      if (shouldSync) break;
    }
    if (shouldSync) syncTocWithTabs();
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['hidden'],
    childList: true,
    subtree: true,
  });
}

// Fires once when the client JS bundle is first loaded (initial hard page load).
export function onClientEntry() {
  // Defer until after React has hydrated and set hidden attributes on inactive panels.
  requestAnimationFrame(() => requestAnimationFrame(setup));
}

// Fires after every SPA route change.
export function onRouteDidUpdate() {
  requestAnimationFrame(setup);
}
