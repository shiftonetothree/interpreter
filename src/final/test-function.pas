program Main;
    var x, y : integer;
    procedure PlusXAndY();
        procedure PlusYAndX(a: integer; b: integer);
        begin
            x := x + a;
            y := y + b;
        end;
    begin
        x := x + 1;
        y := y + 1;
        PlusYAndX(2,3);
    end;
    function PlusBy1(a: integer): integer;
    begin
        PlusBy1 := a + 1;
    end;
begin { Main }
    x := 1;
    y := 0;
    PlusXAndY();
    x := PlusBy1(x);
end.  { Main }