import { final } from "./final";
try{
    console.log(
        final(`
program Main;
    var a: integer;
    var b: integer;
    var c: integer;
begin { Main }
    a := 0;
    b := 0;
    c := 1;
    while a = 0 do
        a := a + 1;
end.  { Main }

    `, true, true)
    );
}catch(e){
    console.error(e);
}