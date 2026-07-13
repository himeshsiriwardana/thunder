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

import OriginalDocSidebarItemHtml from '@theme-original/DocSidebarItem/Html';
import React from 'react';
import ConnectTypeSelector from '@site/src/components/ConnectTypeSelector';
import type {ConnectType} from '@site/src/utils/connectType';

type OriginalProps = React.ComponentProps<typeof OriginalDocSidebarItemHtml>;

function connectCardType(value: string | undefined): ConnectType | null {
  const match = value?.match(/connect-type-card:(app|agent|mcp)/);
  return (match?.[1] as ConnectType | undefined) ?? null;
}

export default function DocSidebarItemHtml({item, ...rest}: OriginalProps): React.ReactElement {
  const itemWithMeta = item as {className?: string; value?: string};
  if (itemWithMeta.className?.split(' ').includes('connect-type-selector-wrapper')) {
    const type = connectCardType(itemWithMeta.value);
    if (type) {
      return (
        <li className="menu__list-item connect-type-selector-item">
          <ConnectTypeSelector type={type} />
        </li>
      );
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return <OriginalDocSidebarItemHtml item={item} {...rest} />;
}
