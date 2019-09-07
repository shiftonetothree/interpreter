program Main;
    var x, y : integer;
    var t1 : boolean;
    var f1 : boolean;
    var t2 : boolean;
    var f2 : boolean;
    var t3 : boolean;
    var f3 : boolean;
    var t4 : boolean;
    var f4 : boolean;
begin { Main }
    x := 1;
    y := 0;
    t1 := true;
    f1 := not true;
    t2 := not f1;
    f2 := t1 and false;
    t3 := t2 or f2;
    f3 := t1 or f1 and f2;
    t4 := t1 or f1 and t2 or f2;
    f4 := not (t1 or (f1 and t2)) or f2;
end.  { Main }