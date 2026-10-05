import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export class EdgeFunctionError extends Error {
  constructor(readonly code: string) {
    super(code);
  }
}

const errorCodeOf = (body: unknown) =>
  typeof body === 'object' && body !== null && 'code' in body && typeof body.code === 'string'
    ? body.code
    : 'unknown_error';

export async function callEdgeFunction(name: string, body?: Record<string, unknown>): Promise<unknown> {
  const { data, error } = await supabase.functions.invoke<unknown>(name, { body });

  if (error instanceof FunctionsHttpError) {
    const response = error.context as Response;
    throw new EdgeFunctionError(errorCodeOf(await response.json().catch(() => null)));
  }
  if (error) throw error;

  return data;
}
