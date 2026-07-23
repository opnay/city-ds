export type StateClassName<State> = string | ((state: State) => string | undefined);

export function resolveClassName<State>(
  className: StateClassName<State> | undefined,
  state: State,
): string | undefined {
  return typeof className === 'function' ? className(state) : className;
}
