/** Opaque handle returned by startHttpSpan — call finish() when the response is ready. */
export type SpanHandle = {
  /** Records the response status code, sets the span status, and ends the span. */
  finish: (statusCode: number) => void;
};
