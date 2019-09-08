import { final } from "./final";
try{
    final(`
    program Main;
    var f5 : boolean;
begin { Main }
    f5 := not(1 + 2 < 3) and (1 < 2 or 3 * 2 > 4);
end.  { Main }
    `, true, true);
}catch(e){
    console.error(e);
}