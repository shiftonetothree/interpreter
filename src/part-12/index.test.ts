import {part12} from ".";

test("Part10AST", () => {
    expect(part12(`
PROGRAM Part10AST;
VAR
    a, b : INTEGER;
    y    : REAL;

BEGIN {Part10AST}
    a := 2;
    b := 10 * a + 10 * a DIV 4;
    y := 20 / 7 + 3.14;
END.  {Part10AST}
    `)).toEqual({a: 2, b: 25, y: 5.997142857142857});
});

test("NameError1", () => {
    expect(() => part12(`
PROGRAM NameError1;
VAR
    a : INTEGER;

BEGIN
    a := 2 + b;
END.
    `)).toThrowError();
});

test("NameError2", () => {
    expect(() => part12(`
PROGRAM NameError2;
VAR
    b : INTEGER;

BEGIN
    b := 1;
    a := b + 2;
END.
    `)).toThrowError();
});

test("Part11", () => {
    expect(part12(`
PROGRAM Part11;
VAR
    number : INTEGER;
    a, b   : INTEGER;
    y      : REAL;

BEGIN {Part11}
    number := 2;
    a := number ;
    b := 10 * a + 10 * number DIV 4;
    y := 20 / 7 + 3.14
END.  {Part11}
    `)).toEqual({a: 2, b: 25, y: 5.997142857142857, number: 2});
});

test("Part11 b", () => {
    expect(part12(`
PROGRAM Part11;
VAR
    x, y : INTEGER;
BEGIN
    x := 2;
    y := 3 + x;
END.
    `)).toEqual({x: 2, y: 5});
});

test("Part12", () => {
    expect(part12(`
PROGRAM Part12;
VAR
    a : INTEGER;

PROCEDURE P1;
VAR
    a : REAL;
    k : INTEGER;

    PROCEDURE P2;
    VAR
        a, z : INTEGER;
    BEGIN {P2}
        z := 777;
    END;  {P2}

BEGIN {P1}

END;  {P1}

BEGIN {Part12}
    a := 10;
END.  {Part12}
    `)).toEqual({a: 10});
});