import { part9 } from "./part-9";
console.log(part9(`
BEGIN

    BEGIN
        number := 2;
        a := number;
        b := 10 * a + 10 * number / 4;
        c := a - - b
    END;

    x := 11;
END.
`));