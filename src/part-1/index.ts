import toRegex from "to-regex";

function isNumber(str: string){
    return toRegex(["0","1","2","3","4","5","6","7","8","9"]).test(str);
}
export function part1(program: string){
    const interpreter = new Interpreter(program);
    return interpreter.expr();
}

type Type = "INTEGER"|"PLUS"|"EOF"|"STARTER";
const INTEGER = "INTEGER";
const PLUS = "PLUS";
const EOF = "EOF";
const STARTER = "STARTER";

class Token{
    constructor(public type: Type, public value: string|null|number){

    }
    toString(){
        return `Token(${this.type}, ${this.value})`;
    }
}

class Interpreter{
    private pos = 0;
    private currentToken: Token = new Token("STARTER", null);
    constructor(private text: string){

    }

    getNextToken(){
        if(this.pos > this.text.length - 1){
            return new Token(EOF, null);
        }
        const currentChar = this.text[this.pos];
        if (isNumber(currentChar)){
            this.pos ++;
            return new Token(INTEGER,parseInt(currentChar));
        }
        if (currentChar === "+"){
            this.pos ++;
            return new Token(PLUS, currentChar);
        }
        throw new Error();
    }

    eat(type: Type){
        if(this.currentToken!=undefined && this.currentToken.type === type){
            this.currentToken = this.getNextToken();
        }else{
            throw new Error();
        }
    }

    expr(){
        this.currentToken = this.getNextToken();
        const left = this.currentToken;
        this.eat(INTEGER);
        const op = this.currentToken;
        this.eat(PLUS);
        const right = this.currentToken;
        this.eat(INTEGER);
        return (left.value as number) + (right.value as number);
    }
}