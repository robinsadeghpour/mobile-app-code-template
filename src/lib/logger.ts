// The one place to wire in a crash reporter.
export const logError = (message: string, error?: unknown) => {
  console.error(message, error);
};
