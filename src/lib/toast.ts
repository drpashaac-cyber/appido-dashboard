// Toast singleton — the shell registers the real handler via setToastFn.
let handler: (m: string) => void = () => {};
export const toast = (m: string) => handler(m);
export const setToastFn = (fn: (m: string) => void) => { handler = fn; };
