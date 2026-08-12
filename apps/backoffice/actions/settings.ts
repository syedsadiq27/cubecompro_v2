'use server';

type Result = { ok: boolean; error?: string };

export async function saveCmsConfigAction(
  _projectId: string,
  _formData: FormData
): Promise<Result> {
  return {
    ok: false,
    error: 'CMS settings are deferred in CubeCom v1.',
  };
}

export async function saveCommerceConfigAction(
  _projectId: string,
  _formData: FormData
): Promise<Result> {
  return {
    ok: false,
    error: 'Commerce channel settings are deferred in CubeCom v1.',
  };
}

export async function saveApiSettingsAction(
  _projectId: string,
  _formData: FormData
): Promise<Result> {
  return {
    ok: false,
    error: 'Legacy API client settings are retired. Use CubeCom GraphQL.',
  };
}

export async function saveMicroserviceSettingsAction(
  _projectId: string,
  _formData: FormData
): Promise<Result> {
  return {
    ok: false,
    error: 'Microservice settings are deferred in CubeCom v1.',
  };
}
