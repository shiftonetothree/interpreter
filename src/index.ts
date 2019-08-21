import { part10 } from "./part-10";
console.log(part10(`
PROGRAM Part10AST;
VAR
    a, b : INTEGER;
    y    : REAL;

BEGIN {Part10AST}
    a := 2;
    b := 10 * a + 10 * a DIV 4;
    y := 20 / 7 + 3.14;
END.  {Part10AST}
`));