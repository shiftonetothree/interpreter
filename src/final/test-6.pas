program Main;
    var a: integer;
    var b: integer;
    var c: integer;
begin { Main }
    a := 0;
    b := 0;
    c := 1;
    if a = 0 then
        a := a + 1;
    
    if b = 0 then
        b := b + 1
    else
        b := b + 2;
    
    if c = 0 then
        c := 1
    else if c = 1 then
        if (c + 1 = 2) and (c - 1 = 0) then
            begin
                c := 2
            end
        else 
            c := 3
    else
        c := 4;
end.  { Main }
