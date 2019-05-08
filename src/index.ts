import { part1 } from "./part-1";
import { part2 } from "./part-2";
import { part3 } from "./part-3";
console.log(part1("1+2"));
console.log(part1("3+4"));
console.log(part2("1+2"));
console.log(part2("3 +4"));
console.log(part2("12+ 23"));
console.log(part2("3- 4"));
console.log(part2("12 -23"));
console.log(part3("1+2"));
console.log(part3("3 +4"));
console.log(part3("12+ 23"));
console.log(part3("3- 4"));
console.log(part3("12 -23"));
console.log(part3("3-4-6 +8 -11"));
console.log(part3("12-23 +10-20 +22"));
try{
    console.log(part3("12-23 +10-20 +22+"));
}catch(e){
    console.log("passed");
}
