'use client';

import { useTech } from '@/lib/TechContext';
import type { Technology } from '@/lib/tech';

interface TechContentProps {
  tech: Technology;
  children: React.ReactNode;
}

/**
 * Renders its children only when the currently selected technology matches
 * the `tech` prop. Use this in MDX to write technology-specific content:
 *
 * ```mdx
 * <TechContent tech="react">
 *   Install: `npm install @asgardeo/react`
 * </TechContent>
 * <TechContent tech="nextjs">
 *   Install: `npm install @asgardeo/nextjs`
 * </TechContent>
 * ```
 */
export function TechContent({ tech, children }: TechContentProps) {
  const current = useTech();
  if (current !== tech) return null;
  return <>{children}</>;
}
