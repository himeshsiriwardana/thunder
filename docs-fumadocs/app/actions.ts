'use server';

import { cookies } from 'next/headers';
import type { UseCase, Technology, Standard } from '@/lib/tech';

export async function setUseCase(useCase: UseCase) {
  const cookieStore = await cookies();
  cookieStore.set('thunder-docs-usecase', useCase, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
}

export async function setTechnology(technology: Technology) {
  const cookieStore = await cookies();
  cookieStore.set('thunder-docs-technology', technology, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
}

export async function setStandard(standard: Standard) {
  const cookieStore = await cookies();
  cookieStore.set('thunder-docs-standard', standard, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
}

export async function clearStandard() {
  const cookieStore = await cookies();
  cookieStore.delete('thunder-docs-standard');
}
