import { final } from "./final";
try{
    console.log(
        final(`
program Main;
    var a: integer;
begin { Main }
    a := 0;
    while a < 30 do
    begin
        if a > 14 then
            begin
                a := a + 2;
                continue;
            end;
        a := a + 1;
    end;
end.  { Main }

    `, true, true)
    );
}catch(e){
    console.error(e);
}