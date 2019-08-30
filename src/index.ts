import { part12 } from "./part-12";
try{
    part12(`
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
    part12(`
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
    part12(`
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
    part12(`
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

try{
    part12(`
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
    `);
}catch(e){
    console.error(e);
}