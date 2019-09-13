import { final } from "./final";
try{
    console.log(
        final(`
program Main;
    var x, y : integer;
    function PlusBy1(a: integer): integer;
    begin
        PlusBy1 := a + 1;
    end;
begin { Main }
    x := 1;
    y := 0;
    x := PlusBy1(x);
end.  { Main }
    `, true, true)
    );
}catch(e){
    console.error(e);
}