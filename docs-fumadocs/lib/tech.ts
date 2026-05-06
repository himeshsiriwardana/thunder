/**
 * Shared types and constants — no React, no 'use client'.
 * Can be safely imported in both server and client components.
 */
export type Technology =
  | 'react'
  | 'nextjs'
  | 'vue'
  | 'nuxt'
  | 'flutter'
  | 'springboot'
  | 'dotnet'
  | 'angular';

export type UseCase = 'all' | 'applications' | 'agents' | 'apis' | 'wallets';

export type Standard = 'oidc' | 'saml' | 'native-api';

export const DEFAULT_TECHNOLOGY: Technology = 'react';
export const DEFAULT_USECASE: UseCase = 'applications';
