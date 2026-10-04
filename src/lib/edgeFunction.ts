import { supabase } from '@/lib/supabase';

export class EdgeFunctionError extends Error {
  status: number;
  code: string;
  body: unknown;

  constructor(status: number, code: string, body: unknown = null) {
    super(code);
    this.status = status;
    this.code = code;
    this.body = body;
  }
}

const errorCodeOf = (body: unknown): string =>
  typeof body === 'object' && body !== null && 'code' in body && typeof body.code === 'string'
    ? body.code
    : 'unknown_error';

export const edgeFunctionErrorFrom = async (response: { status: number; json: () => Promise<unknown> }) => {
  const body = await response.json().catch(() => null);
  return new EdgeFunctionError(response.status, errorCodeOf(body), body);
};

export type EdgeFunctionAction = 'not_configured' | 'generic';

const ACTION_BY_CODE: Record<string, EdgeFunctionAction> = {
  provider_not_configured: 'not_configured',
};

export const edgeFunctionAction = (error: unknown): EdgeFunctionAction =>
  error instanceof EdgeFunctionError ? (ACTION_BY_CODE[error.code] ?? 'generic') : 'generic';

export async function callEdgeFunction<T>(name: string, body?: unknown): Promise<T> {
  const { data } = await supabase.auth.getSession();

  const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/${name}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: `${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
      Authorization: `Bearer ${data.session?.access_token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw await edgeFunctionErrorFrom(response);
  }

  return response.json();
}
