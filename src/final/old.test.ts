import { final } from ".";
import { Lexer, Parser, SemanticAnalyzer } from "./basic";


test("Part10AST", () => {
    expect(final(`
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
    expect(() => final(`
PROGRAM NameError1;
VAR
    a : INTEGER;

BEGIN
    a := 2 + b;
END.
    `)).toThrowError();
});

test("NameError2", () => {
    expect(() => final(`
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
    expect(final(`
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
    expect(final(`
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
    expect({
        ...final(`
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
    `),
    P1: undefined
    }).toEqual({a: 10, P1: undefined});
});

function semanticAnalyz(program: string){
    const lexer = new Lexer(program, "");
    const parser = new Parser(lexer);
    const tree = parser.parse(); 
    const semanticAnalyzer = new SemanticAnalyzer(false);
    return semanticAnalyzer.visit(tree);
}


test("Part13 SymTab1", () => {
    expect(()=>semanticAnalyz(`
program SymTab1;
    var x, y : integer;

begin

end.
    `)).not.toThrow();
});

test("Part13 SymTab4", () => {
    expect(()=>semanticAnalyz(`
program SymTab4;
    var x, y : integer;

begin
    x := x + y;
end.
    `)).not.toThrow();
});

test("Part13 SymTab5", () => {
    expect(()=>semanticAnalyz(`
program SymTab5;
    var x : integer;

begin
    x := y;
end.
    `)).toThrow();
});

test("Part13 SymTab6", () => {
    expect(()=>semanticAnalyz(`
program SymTab6;
    var x, y : integer;
    var y : real;
begin
    x := x + y;
end.
    `)).toThrow();
});

test("Part14 Main", () => {
    expect(()=>semanticAnalyz(`
program Main;
    var x, y: real;

    procedure Alpha(a : integer);
       var y : integer;
    begin
       x := a + x + y;
    end;
 
begin { Main }
 
end.  { Main }
    `)).not.toThrow();
});

test("Part14 error", () => {
    expect(()=>semanticAnalyz(`
program Main;
    var x, y: real;
 
    procedure Alpha(a : integer);
       var y : integer;
    begin
       x := b + x + y; { ERROR here! }
    end;
 
begin { Main }
 
end.  { Main }
    `)).toThrow();
});



test("Part14 good", () => {
    expect(()=>semanticAnalyz(`
program Main;
    var b, x, y : real;
    var z : integer;

    procedure AlphaA(a : integer);
        var b : integer;

        procedure Beta(c : integer);
            var y : integer;

            procedure Gamma(c : integer);
                var x : integer;
            begin { Gamma }
                x := a + b + c + x + y + z;
            end;  { Gamma }

        begin { Beta }

        end;  { Beta }

    begin { AlphaA }

    end;  { AlphaA }

    procedure AlphaB(a : integer);
        var c : real;
    begin { AlphaB }
        c := a + b;
    end;  { AlphaB }

begin { Main }
end.  { Main }
    `)).not.toThrow();
});

test("Part14 Error 2", () => {
    expect(()=>semanticAnalyz(`
program Main;
    var x, y: real;

    procedure Alpha(a : integer);
        var y : integer;
        var a : real;  { ERROR here! }
    begin
        x := a + x + y;
    end;

begin { Main }

end.  { Main }
    `)).toThrow();
});

test("Part17 good", () => {
    expect(final(`
    program Main;
    var x, y : integer;
    begin { Main }
       y := 7;
       x := (y + 3) * 3;
    end.  { Main }
    `)).toEqual({x: 30, y: 7});
});
