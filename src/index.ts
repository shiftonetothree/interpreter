import { part3 } from "./part-3";
console.log(part3("12-23 +10-20 +22"));
try{
    console.log(part3("12-23 +10-20 +22+"));
}catch(e){
    console.log("passed");
}
