import type * as PageTree from 'fumadocs-core/page-tree';
import type { Technology, UseCase, Standard } from '@/lib/tech';

export type { UseCase };

/**
 * Derive a technology tag from a page URL.
 * Pages under /docs/sdks/{tech}/... are tagged with that technology.
 */
function getTechFromUrl(url: string): Technology | undefined {
  const match = url.match(/^\/docs\/sdks\/(react|nextjs|angular|vue|nuxt|flutter|springboot|dotnet)(\/|$)/);
  return match ? (match[1] as Technology) : undefined;
}

/**
 * Filter a page tree by use-case, technology, and standard.
 * Nodes without a usecase/standard tag are always kept (shared content).
 * Folders are kept if they have at least one matching descendant.
 */
export function filterPageTree(
  tree: PageTree.Root,
  urlUseCaseMap: Map<string, UseCase>,
  urlStandardMap: Map<string, Standard>,
  useCase: UseCase,
  technology?: Technology,
  standard?: Standard,
): PageTree.Root {
  if (useCase === 'all') return tree;

  return {
    ...tree,
    $id: undefined,
    children: filterNodes(tree.children, urlUseCaseMap, urlStandardMap, useCase, technology, standard),
  };
}

function filterNodes(
  nodes: PageTree.Node[],
  urlUseCaseMap: Map<string, UseCase>,
  urlStandardMap: Map<string, Standard>,
  useCase: UseCase,
  technology?: Technology,
  standard?: Standard,
): PageTree.Node[] {
  const result: PageTree.Node[] = [];

  for (const node of nodes) {
    if (node.type === 'separator') {
      result.push(node);
      continue;
    }

    if (node.type === 'page') {
      const nodeUseCase = urlUseCaseMap.get(node.url);
      const nodeStandard = urlStandardMap.get(node.url);
      const nodeTech = getTechFromUrl(node.url);

      const useCaseAllowed = !nodeUseCase || nodeUseCase === useCase;
      const techAllowed = !nodeTech || (technology !== undefined && nodeTech === technology);
      const standardAllowed = !nodeStandard || !standard || nodeStandard === standard;

      if (useCaseAllowed && techAllowed && standardAllowed) {
        result.push(node);
      }
      continue;
    }

    if (node.type === 'folder') {
      const filteredChildren = filterNodes(node.children, urlUseCaseMap, urlStandardMap, useCase, technology, standard);

      const indexUrl = node.index?.url;
      const indexUseCase = indexUrl ? urlUseCaseMap.get(indexUrl) : undefined;
      const indexStandard = indexUrl ? urlStandardMap.get(indexUrl) : undefined;
      const indexTech = indexUrl ? getTechFromUrl(indexUrl) : undefined;

      const indexAllowed =
        (!indexUseCase || indexUseCase === useCase) &&
        (!indexTech || (technology !== undefined && indexTech === technology)) &&
        (!indexStandard || !standard || indexStandard === standard);

      const isLeaf = node.children.length === 0;
      if (filteredChildren.length > 0 || (isLeaf && indexAllowed)) {
        result.push({
          ...node,
          index: indexAllowed ? node.index : undefined,
          children: filteredChildren,
        });
      }
    }
  }

  // Strip trailing separators
  while (result.length > 0 && result[result.length - 1].type === 'separator') {
    result.pop();
  }

  return result;
}

