import { part11 } from "./part-11";
try{
    part11(`
        PROGRAM NameError1;
        VAR
            a : INTEGER;
    
        BEGIN
            a := 2 + b;
        END.
    `);
}catch(e){
    console.error(e);
}

try{
    part11(`
    PROGRAM NameError2;
    VAR
        b : INTEGER;

    BEGIN
        b := 1;
        a := b + 2;
    END.
`);
}catch(e){
    console.error(e);
}

try{
    part11(`
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
`);
}catch(e){
    console.error(e);
}

try{
    part11(`
    PROGRAM Part11;
    VAR
        x, y : INTEGER;
    BEGIN
        x := 2;
        y := 3 + x;
    END.
    `);
}catch(e){
    console.error(e);
}