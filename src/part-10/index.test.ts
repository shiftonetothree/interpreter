import {part10} from ".";

test("program a", () => {
    expect(part10(`
BEGIN

    BEGIN
        number := 2;
        a := number;
        b := 10 * a + 10 * number / 4;
        c := a - - b
    END;

    x := 11;
END.
    `)).toEqual({number: 2, a: 2, b: 25, c: 27, x: 11});
});