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
    return toRegex([" ","\n","\r"]).test(str);
}
export function part9(program: string){
    const lexer = new Lexer(program);
    const parser = new Parser(lexer);
    const interpreter = new Interpreter(parser);
    return interpreter.interpret();
}

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
const ASSIGN = "ASSIGN";
const SEMI = "SEMI";
const DOT = "DOT";

type Type = "INTEGER"|"PLUS"|"MINUS"|"MUL"|"DIV"|"("|")"|"EOF"|"STARTER"|"BEGIN"|"END"|"ID"|"ASSIGN"|"SEMI"|"DOT";

class AST{

}

class Assign extends AST{
    constructor(public left: Var, public token: Token, public right:AST){
        super();
    }
}

class Var extends AST{
    value: string | number;
    constructor(public token: Token){
        super();
        this.value = token.value as string;
    }
}

class NoOp extends AST{
}

class Compound extends AST{
    children: AST[]=[];
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
            if (isAlphabet(this.currentChar)){
                return this.id();
            }
            if (this.currentChar === ":" && this.peek() === "="){
                this.advance();
                this.advance();
                return new Token(ASSIGN,":=");
            }
            if (this.currentChar === ";"){
                this.advance();
                return new Token(SEMI,";");
            }
            if (this.currentChar === "."){
                this.advance();
                return new Token(DOT,".");
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
        if(this.currentToken != undefined && this.currentToken.type === type){
            this.currentToken = this.lexer.getNextToken();
        }else{
            throw new Error();
        }
    }

    parse(){
        const node = this.program();
        if(this.currentToken.type !== EOF){
            throw new Error();
        }
        return node;
    }

    program(){
        const node = this.compoundStatement();
        this.eat(DOT);
        return node;
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
            return this.variable();
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

    compoundStatement(): AST{
        this.eat(BEGIN);
        const nodes = this.statementList();
        this.eat(END);
        const root = new Compound();
        for(const node of nodes){
            root.children.push(node);
        }
        return root;
    }

    statementList(): AST[]{
        const node = this.statement();
        const results= [node];
        while (this.currentToken.type === SEMI){
            this.eat(SEMI);
            results.push(this.statement());
        }
        if(this.currentToken.type === ID){
            throw new Error();
        }
        return results;
    }

    statement(): AST{
        let node: AST;
        if(this.currentToken.type === BEGIN){
            node = this.compoundStatement();
        }else if(this.currentToken.type=== "ID"){
            node =this.assignmentStatement();
        }else{
            node = this.empty();
        }
        return node;
    }

    assignmentStatement(): AST{
        const left = this.variable();
        const token = this.currentToken;
        this.eat(ASSIGN);
        const right = this.expr();
        const node= new Assign(left,token,right);
        return node;
    }

    variable(){
        const node = new Var(this.currentToken);
        this.eat(ID);
        return node;
    }

    empty(){
        return new NoOp();
    }
}

abstract class NodeVisitor{
    abstract visit(node: AST): number | void;
}

class Interpreter extends NodeVisitor{
    GLOBAL_SCOPE:{
        [key: string]: number;
    } = {}
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
        }else if(node instanceof Compound){
            return this.visitCompound(node);
        }else if(node instanceof Assign){
            return this.visitAssign(node);
        }else if(node instanceof Var){
            return this.visitVar(node);
        }else if(node instanceof NoOp){
            return this.visitNoOp(node);
        }else{
            throw new Error("ast错误");
        }
    }
    visitNum(node: Num){
        return node.value;
    }
    visitBinOp(node: BinOp): number{
        const leftVal = this.visit(node.left);
        const rightVal = this.visit(node.right);
        if(leftVal === undefined || rightVal === undefined){
            throw new Error("ast错误");
        }
        if(node.token.type === "PLUS"){
            return leftVal + rightVal;
        }else if(node.token.type === "MINUS"){
            return leftVal - rightVal;
        }else if(node.token.type === "MUL"){
            return leftVal * rightVal;
        }else if(node.token.type === "DIV"){
            return leftVal / rightVal;
        }else{
            throw new Error("ast错误");
        }
    }
    visitUnaryOp(node: UnaryOp): number{
        const rightVal = this.visit(node.right);
        if(rightVal === undefined){
            throw new Error("ast错误");
        }
        if(node.token.type === "PLUS"){
            return + rightVal;
        }else if(node.token.type === "MINUS"){
            return - rightVal;
        }else{
            throw new Error("ast错误");
        }
    }

    visitAssign(node: Assign){
        const varName = node.left.value;
        const val = this.visit(node.right);
        if(val === undefined){
            throw new Error();
        }else{
            this.GLOBAL_SCOPE[varName] = val;
        }
        
    }

    visitNoOp(node: NoOp){

    }

    visitVar(node: Var){
        const varName= node.value;
        const val = this.GLOBAL_SCOPE[varName];
        if(val === undefined){
            throw new Error(`variable ${val} is undefined`);
        }else{
            return val;
        }
    }

    visitCompound(node: Compound){
        for(const child of node.children){
            this.visit(child);
        }
    }

    interpret(){
        const tree = this.parser.parse();
        this.visit(tree);
        return this.GLOBAL_SCOPE;
    }
}