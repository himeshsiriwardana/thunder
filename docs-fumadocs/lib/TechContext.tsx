'use client';

import { createContext, useContext } from 'react';
import { type Technology, DEFAULT_TECHNOLOGY } from '@/lib/tech';

export type { Technology };
export { DEFAULT_TECHNOLOGY };

const TechContext = createContext<Technology>(DEFAULT_TECHNOLOGY);

export function TechProvider({
  tech,
  children,
}: {
  tech: Technology;
  children: React.ReactNode;
}) {
  return <TechContext.Provider value={tech}>{children}</TechContext.Provider>;
}

export function useTech(): Technology {
  return useContext(TechContext);
}
