type Handler = (req: Request) => Promise<Response>;

export class RequestError extends Error {
  constructor(
    readonly code: string,
    readonly status: number,
    options?: { cause?: unknown },
  ) {
    super(code, options);
    this.name = 'RequestError';
  }
}

export const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' }, status });

const loggable = (error: unknown) => (error instanceof Error ? error.message : error);

export const serve = (tag: string, handler: Handler) =>
  Deno.serve(async (req) => {
    try {
      return await handler(req);
    } catch (error) {
      if (!(error instanceof RequestError)) {
        console.error(`[${tag}]`, loggable(error));
        return json({ code: 'internal_error' }, 500);
      }
      if (error.cause !== undefined) console.error(`[${tag}] ${error.code}:`, loggable(error.cause));
      return json({ code: error.code }, error.status);
    }
  });
