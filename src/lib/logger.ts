/**
 * Error logging.
 *
 * Console only. The paid kit sends these to a crash reporter; here the point
 * is that every call site already goes through one function, so adding one
 * later is a change in this file and nowhere else.
 */
export const logError = (message: string, error?: unknown) => {
  console.error(message, error);
};
