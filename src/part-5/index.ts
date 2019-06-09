import toRegex from "to-regex";

function isNumber(str: string){
    return toRegex(["0","1","2","3","4","5","6","7","8","9"]).test(str);
}
function isSpace(str: string){
    return toRegex([" "]).test(str);
}
export function part5(program: string){
    const lexer = new Lexer(program);
    const interpreter = new Interpreter(lexer);
    return interpreter.expr();
}
type Type = "INTEGER"|"PLUS"|"MINUS"|"MUL"|"DIV"|"EOF"|"STARTER";
const INTEGER = "INTEGER";
const PLUS = "PLUS";
const MINUS = "MINUS";
const MUL = "MUL";
const DIV = "DIV";
const EOF = "EOF";
const STARTER = "STARTER";

class Token{
    constructor(public type: Type, public value: string|null|number){

    }
    toString(){
        return `Token(${this.type}, ${this.value})`;
    }
}

class Lexer{
    private pos = 0;
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
            if (this.currentChar === "*"){
                this.advance();
                return new Token(MUL, this.currentChar);
            }
            if (this.currentChar === "/"){
                this.advance();
                return new Token(DIV, this.currentChar);
            }
            throw new Error();
        }
        return new Token(EOF, null);
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
}

class Interpreter{
    
    private currentToken: Token = new Token("STARTER", null);
    
    constructor(private lexer:Lexer){
        this.currentToken = this.lexer.getNextToken();
    }

    eat(type: Type){
        if(this.currentToken!=undefined && this.currentToken.type === type){
            this.currentToken = this.lexer.getNextToken();
        }else{
            throw new Error();
        }
    }

    factor(){
        const currentToken = this.currentToken;
        this.eat(INTEGER);
        return currentToken.value as number;      
    }

    term(){
        const left = this.factor();
        let result = left;

        while(this.currentToken.type === MUL || this.currentToken.type === DIV ){
            const op = this.currentToken;
            if(op.type === MUL){
                this.eat(MUL);
                result = result * this.factor();
            }else if(op.type === DIV){
                this.eat(DIV);
                result = result / this.factor();
            }else{
                throw new Error();
            }
        }
        return result;      
    }

    expr(){
        const left = this.term();
        let result = left;

        while(this.currentToken.type === PLUS || this.currentToken.type === MINUS ){
            const op = this.currentToken;
            if(op.type === PLUS){
                this.eat(PLUS);
                result = result + this.term();
            }else if(op.type === MINUS){
                this.eat(MINUS);
                result = result - this.term();
            }else{
                throw new Error();
            }
        }
        return result;
    }
}