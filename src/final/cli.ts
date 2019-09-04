import fs from "fs";
import {final} from ".";

export function cli(path:string, scope=false,  stack = false){
    const program = fs.readFileSync(path);
    return final(program.toString(), scope, stack, path);
}