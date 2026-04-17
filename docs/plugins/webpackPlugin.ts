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

import fs from 'fs';
import path from 'path';

// eslint-disable-next-line func-names
export default function () {
  return {
    name: 'thunder-docs-webpack-plugin',
    configureWebpack() {
      // All @docusaurus/* and other packages in docs/node_modules are pnpm workspace
      // symlinks into frontend/node_modules/.pnpm/. Webpack cannot hop above a
      // node_modules boundary in the pnpm virtual store when resolving transitive deps,
      // so packages like @docusaurus/theme-common, prismjs, and @mui/* are invisible to
      // webpack even though the pnpm store contains them.
      //
      // Fix: pre-resolve each failing package using Node.js require.resolve() (which
      // handles pnpm's store layout correctly) and provide explicit webpack aliases
      // pointing to the physical store paths.

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const req = require;

      const themeClassicRoot: string = path.dirname(req.resolve('@docusaurus/theme-classic/package.json'));
      const presetClassicRoot: string = path.dirname(req.resolve('@docusaurus/preset-classic/package.json'));

      // @docusaurus/theme-common is a transitive dep resolved via preset-classic's context.
      const themeCommonInternal: string = req.resolve('@docusaurus/theme-common/internal', {
        paths: [presetClassicRoot],
      });
      // lib/internal.js  →  go up two directories  →  package root
      const themeCommonRoot: string = path.dirname(path.dirname(themeCommonInternal));

      // @wso2/oxygen-ui has MUI as a peer dep; use it to resolve the MUI packages.
      const oxygenRoot: string = fs.realpathSync(path.resolve(__dirname, '../node_modules/@wso2/oxygen-ui'));

      // Resolve a package directory, trying the oxygen-ui context first and the
      // preset-classic context as a fallback.
      function pkgDir(name: string): string {
        for (const ctx of [oxygenRoot, presetClassicRoot]) {
          try {
            return path.dirname(req.resolve(`${name}/package.json`, { paths: [ctx] }));
          } catch {
            // try next context
          }
        }
        throw new Error(`Cannot resolve pnpm package: ${name}`);
      }

      return {
        resolve: {
          alias: {
            // @theme/NavbarItem is a Docusaurus webpack alias that is unreachable when
            // webpack resolves from inside the pnpm virtual store's physical paths.
            '@theme/NavbarItem': path.join(themeClassicRoot, 'lib/theme/NavbarItem/index.js'),

            // @docusaurus/theme-common is only available inside the pnpm hash dirs of
            // packages that depend on it; webpack can't find it otherwise.  Use a $-
            // terminated key for the root import so it does not shadow the /internal
            // sub-path alias below.
            '@docusaurus/theme-common$': path.join(themeCommonRoot, 'lib/index.js'),
            '@docusaurus/theme-common/internal': themeCommonInternal,

            // These transitive deps live only inside pnpm virtual-store hash dirs and
            // are unreachable via webpack's normal traversal.
            '@scalar/api-reference': req.resolve('@scalar/api-reference', { paths: [presetClassicRoot] }),
            'lucide-react': pkgDir('lucide-react'),
            prismjs: pkgDir('prismjs'),
            '@mui/material': pkgDir('@mui/material'),
            '@mui/x-charts': pkgDir('@mui/x-charts'),
            '@mui/x-data-grid': pkgDir('@mui/x-data-grid'),
            '@mui/x-date-pickers': pkgDir('@mui/x-date-pickers'),
            '@mui/x-tree-view': pkgDir('@mui/x-tree-view'),
          },
        },
        module: {
          rules: [
            {
              test: /\.m?js$/,
              resolve: {
                fullySpecified: false,
              },
            },
          ],
        },
      };
    },
  };
}
