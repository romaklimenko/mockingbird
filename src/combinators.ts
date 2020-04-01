export type Idiot = <T>(a: T) => T;
export type Kestrel = <T0, T1>(a: T0) => (b: T1) => T0;
export type Starling = <TC>(a: (c: TC) => any) =>
    (b: (c: TC) => any) => (c: TC) => any;

export const I: Idiot = a => a;
export const K: Kestrel = a => b => a;
export const S: Starling = a => b => c => a(c)(b(c));

export const TRUE = K;
export const FALSE = S(K);

export const NOT = b => b(S(K))(K);

export const OR = TRUE;

export const AND = FALSE;