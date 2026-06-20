// Product-catalogue lookup helpers.
import { CATS } from "../data";

export const catDeliver = (key: string) => { const c = CATS.find((x) => x.key === key); return c ? c.deliver : null; };
