import toRegex from "to-regex";

function isNumber(str: string){
    return toRegex(["0","1","2","3","4","5","6","7","8","9"]).test(str);
}
function isSpace(str: string){
    return toRegex([" "]).test(str);
}
export function part2(program: string){
    const interpreter = new Interpreter(program);
    return interpreter.expr();
}

type Type = "INTEGER"|"PLUS"|"MINUS"|"EOF"|"STARTER";
const INTEGER = "INTEGER";
const PLUS = "PLUS";
const MINUS = "MINUS";
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
    private currentChar: string|null = this.text[this.pos];
    constructor(private text: string){

    }

    getNextToken(){
        while(this.currentChar !== null){
            if(isSpace(this.currentChar)){
                this.skipWhitespace();
                continue;
            }
            if (isNumber(this.currentChar)){
                return new Token(INTEGER,this.integer());
            }
            if (this.currentChar === "+"){
                this.advance();
                return new Token(PLUS, this.currentChar);
            }
            if (this.currentChar === "-"){
                this.advance();
                return new Token(MINUS, this.currentChar);
            }
            throw new Error();
        }
        return new Token(EOF, null);
    }

    eat(type: Type){
        if(this.currentToken!=undefined && this.currentToken.type === type){
            this.currentToken = this.getNextToken();
        }else{
            throw new Error();
        }
    }

    integer(){
        let result = "";
        while (this.currentChar !== null && isNumber(this.currentChar)){
            result += this.currentChar;
            this.advance();
        }
        return parseInt(result);
    }

    advance(){
        this.pos ++;
        if(this.pos > this.text.length - 1){
            this.currentChar = null;
        }else{
            this.currentChar = this.text[this.pos];
        }
    }

    skipWhitespace(){
        while (this.currentChar!==null && isSpace(this.currentChar)){
            this.advance();
        }
    }

    expr(){
        this.currentToken = this.getNextToken();
        const left = this.currentToken;
        this.eat(INTEGER);
        const op = this.currentToken;
        if(op.type === PLUS){
            this.eat(PLUS);
        }else if(op.type === MINUS){
            this.eat(MINUS);
        }else{
            throw new Error();
        }
        
        const right = this.currentToken;
        this.eat(INTEGER);
        if(op.type === "PLUS"){
            return (left.value as number) + (right.value as number);
        }else{
            return (left.value as number) - (right.value as number);
        }
    }
}