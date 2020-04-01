import { S, K, I, TRUE, FALSE, NOT, OR, AND } from './combinators';

describe('SKI boolean logic', () => {
  const t = () => true;
  const f = () => false;

  describe('Kestrel', () => {
    test('Kxy = x', () => {
      const x = 'x';
      const y = 'y';

      const actual = K(x)(y);

      expect(actual).toBe(x);
    });
  });

  describe('Starling', () => {
    test('Sxyz = xz(yz)', () => {
      const x = _ => I;
      const y = a => a() * 2;
      const z = () => 3;

      const xz = x(z);
      const yz = y(z);

      const actual = S(x)(y)(z);

      expect(actual).toBe(xz(yz));
      expect(actual).toBe(6);
    });
  });

  describe('Idiot', () => {
    const x = 'whatever';

    test('Ix = x', () => {
      expect(I(x)).toBe(x);
    });

    test('Ix = SSKKx = x', () => {
      expect(S(S)(K)(K)(x)).toBe(I(x));
    });

    test('Ix = SK(KK)x = x', () => {
      const sk = S(K);
      const kk = K(K);
      expect(sk(kk)(x)).toBe(I(x));
    });
  });

  describe('TRUE = K', () => {
    test('Ktf = (TRUE)tf = t', () => {
      const actual = TRUE(t)(f)();
      expect(actual).toBe(K(t)(f)());
      expect(actual).toBe(true);
    });
  });

  describe('FALSE = SK', () => {
    test('SKxy = y', () => {
      expect(FALSE(t)(f)()).toBe(false);
    });

    test('KItf = (FALSE)tf = f', () => {
      const actual = K(I)(t)(f)();
      expect(actual).toBe(FALSE(t)(f)());
      expect(actual).toBe(false);
    });
  });

  describe('NOT = (SK)(K)', () => {
    test('NOT = (SK)(K)', () => {
      const sk = S(K);
      expect(TRUE(sk(K))(t)(f)()).toBe(false);
      expect(TRUE(sk(K))(f)(t)()).toBe(true);
    });

    test('NOT(TRUE) = FALSE', () => {
      expect(NOT(TRUE)(t)(f)()).toBe(false);
      expect(NOT(TRUE)(f)(t)()).toBe(true);
    });

    test('NOT(FALSE) = TRUE', () => {
      expect(NOT(FALSE)(t)(f)()).toBe(true);
      expect(NOT(FALSE)(f)(t)()).toBe(false);
    });

    test('TRUE(FALSE)(TRUE) = FALSE', () => {
      expect(TRUE(FALSE)(TRUE)(t)(f)()).toBe(false);
    });

    test('FALSE(FALSE)(TRUE) = TRUE', () => {
      expect(FALSE(FALSE)(TRUE)(t)(f)()).toBe(true);
    });
  });

  describe('OR = T = K', () => {
    test('(T)OR(T) = T(T)(T) = T', () => {
      expect(TRUE(OR)(TRUE)(t)(f)()).toBe(true);
    });

    test('(T)OR(F) = T(T)(F) = T', () => {
      expect(TRUE(OR)(FALSE)(t)(f)()).toBe(true);
    });

    test('(F)OR(T) = F(T)(T) = T', () => {
      expect(FALSE(OR)(TRUE)(t)(f)()).toBe(true);
    });

    test('(F)OR(F) = F(T)(F) = F', () => {
      expect(FALSE(OR)(FALSE)(t)(f)()).toBe(false);
    });
  });

  describe('AND = F = SK', () => {
    test('(T)(T)AND = T(T)(F) = T', () => {
      expect(TRUE(TRUE)(AND)(t)(f)()).toBe(true);
    });
    test('(T)(F)AND = T(F)(F) = F', () => {
      expect(TRUE(FALSE)(AND)(t)(f)()).toBe(false);
    });
    test('(F)(T)AND = F(T)(F) = F', () => {
      expect(FALSE(TRUE)(AND)(t)(f)()).toBe(false);
    });
    test('(F)(F)AND = F(F)(F) = F', () => {
      expect(FALSE(FALSE)(AND)(t)(f)()).toBe(false);
    });
  });

  describe('De Morgan\'s Laws', () => {
    const or = (a, b) => a(OR)(b);
    const and = (a, b) => a(b)(AND);
    const not = a => NOT(a);

    test('¬(a ∨ b) ⇔ (¬a) ∧ (¬b)', () => {
      expect(!(true || true)).toBe(false);
      expect(!true && !true).toBe(false);
      expect(not(or(TRUE, TRUE))(t)(f)()).toBe(false);
      expect(and(not(TRUE), not(TRUE))(t)(f)()).toBe(false);

      expect(!(true || false)).toBe(false);
      expect(!true && !false).toBe(false);
      expect(not(or(TRUE, FALSE))(t)(f)()).toBe(false);
      expect(and(not(TRUE), not(FALSE))(t)(f)()).toBe(false);

      expect(!(false || false)).toBe(true);
      expect(!false && !false).toBe(true);
      expect(not(or(FALSE, FALSE))(t)(f)()).toBe(true);
      expect(and(not(FALSE), not(FALSE))(t)(f)()).toBe(true);

      expect(!(false || true)).toBe(false);
      expect(!false && !true).toBe(false);
      expect(not(or(FALSE, TRUE))(t)(f)()).toBe(false);
      expect(and(not(FALSE), not(TRUE))(t)(f)()).toBe(false);
    });

    test('¬(a ∧ b) ⇔ (¬a) ∨ (¬b)', () => {
      expect(!(true && true)).toBe(false);
      expect(!true || !true).toBe(false);
      expect(not(and(TRUE, TRUE))(t)(f)()).toBe(false);
      expect(or(not(TRUE), not(TRUE))(t)(f)()).toBe(false);

      expect(!(true && false)).toBe(true);
      expect(!true || !false).toBe(true);
      expect(not(and(TRUE, FALSE))(t)(f)()).toBe(true);
      expect(or(not(TRUE), not(FALSE))(t)(f)()).toBe(true);

      expect(!(false && false)).toBe(true);
      expect(!false || !false).toBe(true);
      expect(not(and(FALSE, FALSE))(t)(f)()).toBe(true);
      expect(or(not(FALSE), not(FALSE))(t)(f)()).toBe(true);

      expect(!(false && false)).toBe(true);
      expect(!false || !false).toBe(true);
      expect(not(and(FALSE, FALSE))(t)(f)()).toBe(true);
      expect(or(not(FALSE), not(FALSE))(t)(f)()).toBe(true);

      expect(!(false && true)).toBe(true);
      expect(!false || !true).toBe(true);
      expect(not(and(FALSE, TRUE))(t)(f)()).toBe(true);
      expect(or(not(FALSE), not(TRUE))(t)(f)()).toBe(true);
    });
  });
});