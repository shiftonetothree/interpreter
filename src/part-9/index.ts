import toRegex from "to-regex";

function isNumber(str: string){
    return toRegex(["0","1","2","3","4","5","6","7","8","9"]).test(str);
}
function isAlphabet(str: string){
    return toRegex([
        "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
        "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"
    ]).test(str);
}
function isSpace(str: string){
    return toRegex([" "]).test(str);
}
export function part9(program: string){
    const lexer = new Lexer(program);
    const parser = new Parser(lexer);
    const interpreter = new Interpreter(parser);
    return interpreter.interpret();
}
type Type = "INTEGER"|"PLUS"|"MINUS"|"MUL"|"DIV"|"("|")"|"EOF"|"STARTER"|"BEGIN"|"END"|"ID";
const INTEGER = "INTEGER";
const PLUS = "PLUS";
const MINUS = "MINUS";
const MUL = "MUL";
const DIV = "DIV";
const LPAREN = "(";
const RPAREN = ")";
const EOF = "EOF";
const STARTER = "STARTER";
const BEGIN = "BEGIN";
const END = "END";
const ID = "ID";

class AST{

}

class BinOp extends AST{
    constructor(public left: AST, public token: Token, public right:AST){
        super();
    }
}

class UnaryOp extends AST{
    constructor(public token: Token, public right:AST){
        super();
    }
}

class Num extends AST{
    value: number;
    constructor(public token: Token){
        super();
        this.value = token.value as number;
    }
}

class Token{
    constructor(public type: Type, public value: string|undefined|number){

    }
    toString(){
        return `Token(${this.type}, ${this.value})`;
    }
}

class Lexer{
    private pos = 0;
    private currentChar: string | undefined = this.text[this.pos];
    private RESERVED_KEYWORDS = {
        "BEGIN": new Token(BEGIN,"BEGIN"),
        "END": new Token(END,"END"),
    }
    
    constructor(private text: string){

    }
    
    getNextToken(){
        while(this.currentChar !== undefined){
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
            if (this.currentChar === "("){
                this.advance();
                return new Token(LPAREN, this.currentChar);
            }
            if (this.currentChar === ")"){
                this.advance();
                return new Token(RPAREN, this.currentChar);
            }
            throw new Error();
        }
        return new Token(EOF, undefined);
    }

    integer(){
        let result = "";
        while (this.currentChar !== undefined && isNumber(this.currentChar)){
            result += this.currentChar;
            this.advance();
        }
        return parseInt(result);
    }

    advance(){
        this.pos ++;
        if(this.pos > this.text.length - 1){
            this.currentChar = undefined;
        }else{
            this.currentChar = this.text[this.pos];
        }
    }

    skipWhitespace(){
        while (this.currentChar!==undefined && isSpace(this.currentChar)){
            this.advance();
        }
    }

    peek(){
        const peekPos = this.pos + 1;
        if(peekPos > this.text.length - 1){
            return undefined;
        }else{
            return this.text[peekPos];
        }
    }

    private id(){
        let result = "";
        while (this.currentChar !== undefined && (isNumber(this.currentChar) || isAlphabet(this.currentChar))){
            result += this.currentChar;
            this.advance();
        }
        //@ts-ignore
        const token = this.RESERVED_KEYWORDS[result] as Token;
        if(token){
            return token;
        }else{
            return new Token(ID, result);
        }
    }
}

class Parser{
    
    private currentToken: Token = new Token("STARTER", undefined);
    
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

    factor(): AST{
        const currentToken = this.currentToken;
        if(currentToken.type === PLUS){
            this.eat(PLUS);
            return new UnaryOp(currentToken, this.factor());
        }else if(currentToken.type === MINUS){
            this.eat(MINUS);
            return new UnaryOp(currentToken, this.factor());
        }else if(currentToken.type === INTEGER){
            this.eat(INTEGER);
            return new Num(currentToken);
        }else if(this.currentToken.type === LPAREN){
            this.eat(LPAREN);
            const result = this.expr();
            this.eat(RPAREN);
            return result;
        }else{
            throw new Error();
        }
    }

    term(){
        const left = this.factor();
        let result = left;

        while(this.currentToken.type === MUL || this.currentToken.type === DIV ){
            const op = this.currentToken;
            if(op.type === MUL){
                this.eat(MUL);
                result = new BinOp(result, op, this.factor());
            }else if(op.type === DIV){
                this.eat(DIV);
                result = new BinOp(result, op, this.factor());
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
                result = new BinOp(result, op, this.term());
            }else if(op.type === MINUS){
                this.eat(MINUS);
                result = new BinOp(result, op, this.term());
            }else{
                throw new Error();
            }
        }
        return result;
    }
}

abstract class NodeVisitor{
    abstract visit(node: AST): AST;
}

class Interpreter extends NodeVisitor{
    constructor(public parser: Parser){
        super();
    }
    visit(node: AST){
        if(node instanceof Num){
            return this.visitNum(node);
        }else if(node instanceof BinOp){
            return this.visitBinOp(node);
        }else if(node instanceof UnaryOp){
            return this.visitUnaryOp(node);
        }else{
            throw new Error("ast错误");
        }
    }
    visitNum(node: Num){
        return node.value;
    }
    visitBinOp(node: BinOp): number{
        if(node.token.type === "PLUS"){
            return this.visit(node.left) + this.visit(node.right);
        }else if(node.token.type === "MINUS"){
            return this.visit(node.left) - this.visit(node.right);
        }else if(node.token.type === "MUL"){
            return this.visit(node.left) * this.visit(node.right);
        }else if(node.token.type === "DIV"){
            return this.visit(node.left) / this.visit(node.right);
        }else{
            throw new Error("ast错误");
        }
    }
    visitUnaryOp(node: UnaryOp): number{
        if(node.token.type === "PLUS"){
            return + this.visit(node.right);
        }else if(node.token.type === "MINUS"){
            return - this.visit(node.right);
        }else{
            throw new Error("ast错误");
        }
    }
    interpret(){
        const tree = this.parser.expr();
        return this.visit(tree);
    }
}