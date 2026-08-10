import { GetCategoriesByProjectIdDocument } from '@repo/graphql/generated';
import { addCategoryAction, deleteCategoryAction } from '../../../../actions/categories';
import {
  EmptyState,
  ErrorState,
  PageHeader,
  Panel,
} from '../../../../components/ui';
import { createProjectClient } from '../../../../lib/graphql';
import { getProjectSession } from '../../../../lib/session-server';
import { CategoryAddForm, CategoryDeleteButton } from '../../../../components/categories/category-forms';

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProjectSession();
  if (!project) return null;

  let error: string | null = null;
  let categories: Array<{
    id: string | number;
    name?: string | null;
    description?: string | null;
    createdAt?: string | null;
  }> = [];

  try {
    const client = createProjectClient(projectId, project.projectToken);
    const data = await client.project(GetCategoriesByProjectIdDocument, {
      projectId,
    });
    categories = data.getCategoryByProjectId ?? [];
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load categories.';
  }

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Organize products with project categories."
      />
      {error ? <ErrorState message={error} /> : null}
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Panel>
          <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase">
            Add category
          </h3>
          <CategoryAddForm projectId={projectId} action={addCategoryAction} />
        </Panel>
        <div className="space-y-3">
          {!error && categories.length === 0 ? (
            <EmptyState message="No categories yet." />
          ) : null}
          {categories.map((category) => (
            <Panel
              key={String(category.id)}
              className="flex items-start justify-between gap-4"
            >
              <div>
                <h3 className="font-semibold">{category.name}</h3>
                <p className="mt-1 text-sm text-[var(--bo-muted)]">
                  {category.description || 'No description'}
                </p>
              </div>
              <CategoryDeleteButton
                projectId={projectId}
                categoryId={String(category.id)}
                action={deleteCategoryAction}
              />
            </Panel>
          ))}
        </div>
      </div>
    </div>
  );
}
