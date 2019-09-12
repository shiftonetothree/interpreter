program Main;
    var a: integer;
    var b: integer;
    var c: integer;
begin { Main }
    a := 0;
    b := 0;
    c := 1;
    while a < 10 do
        begin
        a := a + 1;
        while (b < 20) and (b > 0) do
            b := b + 1;
        while (c < 30) and (c > 0) do
        begin
            if c < 15 then
                break;
            c := c + 1;
        end
        end;
    
end.  { Main }
