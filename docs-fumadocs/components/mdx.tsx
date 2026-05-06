import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { TechContent } from '@/components/TechContent';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    TechContent,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
