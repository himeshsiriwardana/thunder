export const dynamic = 'force-dynamic';

import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { filterPageTree, type UseCase } from '@/lib/filterPageTree';
import { TechProvider } from '@/lib/TechContext';
import { type Technology, type Standard, DEFAULT_TECHNOLOGY } from '@/lib/tech';
import { PersonaFilter } from '@/components/PersonaFilter';

export default async function Layout({ children }: LayoutProps<'/docs'>) {
  const cookieStore = await cookies();
  const rawUseCase = cookieStore.get('thunder-docs-usecase')?.value;
  if (!rawUseCase) redirect('/');
  const useCase = rawUseCase as UseCase;
  const technology = (cookieStore.get('thunder-docs-technology')?.value ?? DEFAULT_TECHNOLOGY) as Technology;
  const standard = cookieStore.get('thunder-docs-standard')?.value as Standard | undefined;

  // Build URL → usecase and URL → standard maps from all pages
  const urlUseCaseMap = new Map<string, UseCase>();
  const urlStandardMap = new Map<string, Standard>();
  for (const page of source.getPages()) {
    const data = page.data as { usecase?: UseCase; standard?: Standard };
    if (data.usecase) urlUseCaseMap.set(page.url, data.usecase);
    if (data.standard) urlStandardMap.set(page.url, data.standard);
  }

  const rawTree = source.getPageTree();
  const effectiveTech = useCase === 'applications' ? technology : undefined;
  const effectiveStandard = useCase === 'applications' ? standard : undefined;
  const tree = filterPageTree(rawTree, urlUseCaseMap, urlStandardMap, useCase, effectiveTech, effectiveStandard);

  return (
    <DocsLayout
      tree={tree}
      {...baseOptions()}
      sidebar={{
        banner: <PersonaFilter key="persona-filter" currentUseCase={useCase} currentTech={technology} currentStandard={standard} />,
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background:
            'radial-gradient(ellipse 70% 50% at 60% 35%, rgba(255,107,0,0.13) 0%, transparent 65%), ' +
            'radial-gradient(ellipse 40% 30% at 85% 25%, rgba(255,107,0,0.08) 0%, transparent 70%)',
        }}
      />
      <TechProvider tech={effectiveTech ?? DEFAULT_TECHNOLOGY}>
        {children}
      </TechProvider>
    </DocsLayout>
  );
}
