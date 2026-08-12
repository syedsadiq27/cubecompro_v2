'use server';

export type CategoryResult = { ok: boolean; error?: string };

export async function createCategoryAction(
  _projectId: string,
  _formData: FormData
): Promise<CategoryResult> {
  return {
    ok: false,
    error: 'Categories are deferred in CubeCom v1.',
  };
}

export async function updateCategoryAction(
  _projectId: string,
  _categoryId: string,
  _formData: FormData
): Promise<CategoryResult> {
  return {
    ok: false,
    error: 'Categories are deferred in CubeCom v1.',
  };
}

export async function deleteCategoryAction(
  _projectId: string,
  _categoryId: string
): Promise<CategoryResult> {
  return {
    ok: false,
    error: 'Categories are deferred in CubeCom v1.',
  };
}
