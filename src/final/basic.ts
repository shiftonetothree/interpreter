import toRegex from "to-regex";

export let _SHOULD_LOG_SCOPE = false;

export let _PRGRAM_FILE_PATH = "";

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

// single-character token types
export const PLUS = "+";
export const MINUS = "-";
export const MUL = "*";
export const SEMI = ";";
export const DOT = ".";
export const LPAREN = "(";
export const RPAREN = ")";
export const COLON = ":";
export const COMMA = ",";
export const FLOAT_DIV = "/";
export const EQUALS = "=";
export const GREATER_THAN = ">";
export const LESS_THAN = "<";

// block of reserved words
export const BEGIN = "BEGIN";
export const INTEGER = "INTEGER";
export const BOOLEAN = "BOOLEAN";
export const TRUE = "TRUE";
export const FALSE = "FALSE";
export const AND = "AND";
export const OR = "OR";
export const NOT = "NOT";
export const INTEGER_DIV = "DIV";
export const PROGRAM = "PROGRAM";
export const PROCEDURE = "PROCEDURE";
export const VAR = "VAR";
export const REAL = "REAL";
export const IF = "IF";
export const THEN = "THEN";
export const ELSE = "ELSE";
export const END = "END";

// misc
export const ID = "ID";
export const INTEGER_CONST = "INTEGER_CONST";
export const REAL_CONST = "REAL_CONST";
export const ASSIGN = ":=";
export const NOT_EQUALS = "<>";
export const GREATER_OR_EQUALS_THAN = ">=";
export const LESS_OR_EQUALS_THAN = "<=";
export const EOF = "EOF";


export const tokenTuple = [
    // single-character token types
    PLUS,
    MINUS,
    MUL,
    LPAREN,
    RPAREN,
    COLON,
    COMMA,
    SEMI,
    DOT,
    EQUALS,
    GREATER_THAN,
    LESS_THAN,

    // block of reserved words
    BEGIN,
    REAL,
    INTEGER_DIV,
    PROGRAM,
    PROCEDURE,
    VAR,
    INTEGER,
    BOOLEAN,
    TRUE,
    FALSE,
    AND,
    OR,
    NOT,
    IF,
    THEN,
    ELSE,
    END,

    // misc
    ID,
    INTEGER_CONST,
    REAL_CONST,
    FLOAT_DIV,
    ASSIGN,
    GREATER_OR_EQUALS_THAN,
    LESS_OR_EQUALS_THAN,
    NOT_EQUALS,
    EOF,
] as const;

export type TokenType = (typeof tokenTuple)[number];

export enum ErrorCode{
    UNEXPECTED_TOKEN = "Unexpected token",
    ID_NOT_FOUND = "Identifier not found",
    VARIABLE_NOT_INITIALIZED = "Variable not initialized",
    DUPLICATE_ID = "Duplicate id found"
}

export class MyError extends Error{
    name = "MyError";
    constructor(public errorCode?: ErrorCode,public token?: Token,message?:string){
        super();
        this.message = `${this.name}: ${message}`;
    }
}

export class LexerError extends MyError{
    name = "LexerError";
    constructor(public errorCode?: ErrorCode,public token?: Token,message?:string){
        super();
        this.message = `${this.name}: ${message}`;
    }
}

export class ParserError extends MyError{
    name = "ParserError";
    constructor(public errorCode?: ErrorCode,public token?: Token,message?:string){
        super();
        this.message = `${this.name}: ${message}`;
    }
}

export class SemanticError extends MyError{
    name = "SemanticError";
    constructor(public errorCode?: ErrorCode,public token?: Token,message?:string){
        super();
        this.message = `${this.name}: ${message}`;
    }
}

export class RuntimeError extends MyError{
    name = "RuntimeError";
    constructor(public errorCode?: ErrorCode,public token?: Token,message?:string){
        super();
        this.message = `${this.name}: ${message}`;
    }
}


export class AST{

}

export class Program extends AST{
    constructor(public name: string, public block: Block){
        super();
    }
}

export class Block extends AST{
    constructor(public declarations: (VarDecl | ProcedureDecl)[], public compoundStatement: Compound){
        super();
    }
}

export class VarDecl extends AST{
    constructor(public varNode: Var, public typeNode: Type){
        super();
    }
}

export class ProcedureDecl extends AST{
    constructor(public procName: string,public params: Param[], public blockNode: Block){
        super();
    }
}

export class Param extends AST{
    constructor(public varNode: Var, public typeNode: Type){
        super();
    }
}

export class Type extends AST{
    value: string;
    constructor(public token: Token){
        super();
        this.value = token.value as string;
    }
}

export class Assign extends AST{
    constructor(public left: Var, public token: Token, public right:AST){
        super();
    }
}

export class Condition extends AST{
    constructor(public token: Token, 
        public condition: AST,
        public then: Then, 
        public myElse?: MyElse
    ){
        super();
    }
}

export class Then extends AST{
    constructor(public token: Token, public children: AST[]){
        super();
    }
}

export class MyElse extends AST{
    constructor(public token: Token, public children: AST[]){
        super();
    }
}

export class Var extends AST{
    value: string;
    constructor(public token: Token){
        super();
        this.value = token.value as string;
    }
}

export class NoOp extends AST{
}

export class Compound extends AST{
    children: AST[]=[];
}

export class BinOp extends AST{
    constructor(public left: AST, public token: Token, public right:AST){
        super();
    }
}

export class UnaryOp extends AST{
    constructor(public token: Token, public right:AST){
        super();
    }
}

export class Num extends AST{
    value: number;
    constructor(public token: Token){
        super();
        this.value = token.value as number;
    }
}

export class MyBoolean extends AST{
    value: boolean;
    constructor(public token: Token){
        super();
        this.value = token.value as boolean;
    }
}

export class ProcedureCall extends AST{
    constructor(public procName: string, public actualParams: AST[], public token: Token){
        super();
    }
}

export class Token{
    constructor(
        public type: TokenType, 
        public value: string | undefined | number | boolean,
        public lineno?: number,
        public column?: number,
        ){
    }
    toString(){
        return `Token(${this.type}, ${this.value}, at ${_PRGRAM_FILE_PATH}:${this.lineno}:${this.column})`;
    }
}

export class Lexer{
    private pos = 0;
    public currentChar: string | undefined = this.text[this.pos];
    private lineno = 1;
    private column = 1;
    private readonly RESERVED_KEYWORDS = {
        [BEGIN]: new Token(BEGIN,BEGIN),
        [PROGRAM]: new Token(PROGRAM, PROGRAM),
        [VAR]: new Token(VAR, VAR),
        [INTEGER_DIV]: new Token(INTEGER_DIV, INTEGER_DIV),
        [INTEGER]: new Token(INTEGER, INTEGER),
        [REAL]: new Token(REAL, REAL),
        [BOOLEAN]: new Token(BOOLEAN, BOOLEAN),
        [TRUE]: new Token(TRUE, true),
        [FALSE]: new Token(FALSE, false),
        [AND]: new Token(AND, AND),
        [OR]: new Token(OR, OR),
        [NOT]: new Token(NOT, NOT),
        [PROCEDURE]: new Token(PROCEDURE,PROCEDURE),
        [IF]: new Token(IF,IF),
        [THEN]: new Token(THEN,THEN),
        [ELSE]: new Token(ELSE,ELSE),
        [END]: new Token(END,END),
    }
    
    constructor(private text: string,path: string){
        _PRGRAM_FILE_PATH = path;
    }
    
    getNextToken(){
        while(this.currentChar !== undefined){
            if(isSpace(this.currentChar)){
                this.skipWhitespace();
                continue;
            }
            if(this.currentChar === "{"){
                this.advance();
                this.skipComment();
                continue;
            }
            if (isAlphabet(this.currentChar)){
                return this.id();
            }
            if (isNumber(this.currentChar)){
                return this.integer();
            }
            if (this.currentChar === COLON && this.peek() === EQUALS){
                this.advance();
                this.advance();
                return new Token(ASSIGN, ASSIGN, this.lineno, this.column);
            }
            if (this.currentChar === GREATER_THAN && this.peek() === EQUALS){
                this.advance();
                this.advance();
                return new Token(GREATER_OR_EQUALS_THAN, GREATER_OR_EQUALS_THAN, this.lineno, this.column);
            }
            if (this.currentChar === LESS_THAN && this.peek() === EQUALS){
                this.advance();
                this.advance();
                return new Token(LESS_OR_EQUALS_THAN, LESS_OR_EQUALS_THAN, this.lineno, this.column);
            }
            if (this.currentChar === LESS_THAN && this.peek() === GREATER_THAN){
                this.advance();
                this.advance();
                return new Token(NOT_EQUALS, NOT_EQUALS, this.lineno, this.column);
            }
            // @ts-ignore
            if(tokenTuple.indexOf(this.currentChar >= 0)){
                const token = new Token(
                    this.currentChar as TokenType,
                    this.currentChar,
                    this.lineno,
                    this.column,
                );
                this.advance();
                return token;
            }
            throw this.lexerError();
        }
        return new Token(EOF, undefined, this.lineno, this.column);
    }

    integer(){
        let result = "";
        while (this.currentChar !== undefined && isNumber(this.currentChar)){
            result += this.currentChar;
            this.advance();
        }
        if(this.currentChar === DOT){
            result += this.currentChar;
            this.advance();

            while (this.currentChar !== undefined && isNumber(this.currentChar)){
                result += this.currentChar;
                this.advance();
            }

            return new Token(REAL_CONST, parseFloat(result), this.lineno, this.column);
        }else{
            return new Token(INTEGER_CONST, parseInt(result), this.lineno, this.column);
        }
        
    }

    advance(){
        if(this.currentChar === "\n"){
            this.lineno += 1;
            this.column = 0;
        }
        this.pos ++;
        if(this.pos > this.text.length - 1){
            this.currentChar = undefined;
        }else{
            this.currentChar = this.text[this.pos];
            this.column += 1;
        }
    }

    skipWhitespace(){
        while (this.currentChar!==undefined && isSpace(this.currentChar)){
            this.advance();
        }
    }

    skipComment(){
        while (this.currentChar!=="}"){
            this.advance();
        }
        this.advance();
    }

    peek(){
        const peekPos = this.pos + 1;
        if(peekPos > this.text.length - 1){
            return undefined;
        }else{
            return this.text[peekPos];
        }
    }

    getProcessedString(){
        return this.text.slice(0,this.pos);
    }

    latestWord(){
        const processedString = this.getProcessedString();
        const latest10Word = processedString.slice(
            processedString.length >= 20 ? processedString.length - 20: 0,
            processedString.length
        );
        return latest10Word;
    }

    private id(){
        let result = "";
        while (this.currentChar !== undefined && (isNumber(this.currentChar) || isAlphabet(this.currentChar))){
            result += this.currentChar;
            this.advance();
        }
        //@ts-ignore
        const token: Token = this.RESERVED_KEYWORDS[result.toUpperCase()];
        if(token){
            return token;
        }else{
            return new Token(ID, result, this.lineno, this.column);
        }
    }

    lexerError(){
        return new LexerError(
            undefined,
            undefined,
            `Lexer error on '${this.currentChar}' line: ${this.lineno} column: ${this.column}`
        );
    }
}

export class Parser{
    
    private currentToken: Token;
    
    constructor(private lexer:Lexer){
        this.currentToken = this.lexer.getNextToken();
    }

    eat(type: TokenType){
        if(this.currentToken != undefined && this.currentToken.type === type){
            this.currentToken = this.lexer.getNextToken();
        }else{
            throw this.parserError(
                ErrorCode.UNEXPECTED_TOKEN,
                this.currentToken
            );
        }
    }

    parse(){
        const node = this.program();
        if(this.currentToken.type !== EOF){
            throw this.parserError(
                ErrorCode.UNEXPECTED_TOKEN,
                this.currentToken
            );
        }
        return node;
    }

    program(){
        this.eat(PROGRAM);
        const varNode = this.variable();
        const progName = varNode.value;
        this.eat(SEMI);
        const blockNode =this.block();
        const programNode = new Program(progName, blockNode);
        this.eat(DOT);
        return programNode;
    }

    

    precedence1(): AST{
        const currentToken = this.currentToken;
        if(currentToken.type === PLUS){
            this.eat(PLUS);
            return new UnaryOp(currentToken, this.precedence1());
        }else if(currentToken.type === MINUS){
            this.eat(MINUS);
            return new UnaryOp(currentToken, this.precedence1());
        }else if(currentToken.type === NOT){
            this.eat(NOT);
            return new UnaryOp(currentToken, this.precedence1());
        }else if(currentToken.type === INTEGER_CONST){
            this.eat(INTEGER_CONST);
            return new Num(currentToken);
        }else if(currentToken.type === REAL_CONST){
            this.eat(REAL_CONST);
            return new Num(currentToken);
        }else if (currentToken.type === TRUE){
            this.eat(TRUE);
            return new MyBoolean(currentToken);
        }else if (currentToken.type === FALSE){
            this.eat(FALSE);
            return new MyBoolean(currentToken);
        }else if(this.currentToken.type === LPAREN){
            this.eat(LPAREN);
            const result = this.expr();
            this.eat(RPAREN);
            return result;
        }else{
            return this.variable();
        }
    }

    precedence2(){
        const left = this.precedence1();
        let result = left;

        while(this.currentToken.type === MUL 
                || this.currentToken.type === INTEGER_DIV 
                || this.currentToken.type === FLOAT_DIV
                || this.currentToken.type === AND
            ){
            const op = this.currentToken;
            this.eat(op.type);
            result = new BinOp(result, op, this.precedence1());
        }
        return result;      
    }

    precedence3(){
        const left = this.precedence2();
        let result = left;
        while(
            this.currentToken.type === PLUS 
            || this.currentToken.type === MINUS
            || this.currentToken.type === OR
        ){
            const op = this.currentToken;
            this.eat(op.type);
            result = new BinOp(result, op, this.precedence2());
        }
        return result;
    }

    precedence4(){
        const left = this.precedence3();
        let result = left;
        while(
            this.currentToken.type === EQUALS
            || this.currentToken.type === GREATER_THAN
            || this.currentToken.type === GREATER_OR_EQUALS_THAN
            || this.currentToken.type === LESS_THAN
            || this.currentToken.type === LESS_OR_EQUALS_THAN
            || this.currentToken.type === NOT_EQUALS
        ){
            const op = this.currentToken;
            this.eat(op.type);
            result = new BinOp(result, op, this.precedence3());
        }
        return result;
    }

    expr(){
        return this.precedence4();
    }

    block(){
        const declarationNodes = this.declarations();
        const compoundStatementNode = this.compoundStatement();
        const node = new Block(declarationNodes, compoundStatementNode);
        return node;
    }

    declarations(){
        let declarations: (VarDecl | ProcedureDecl)[] = [];
        while(true){
            if(this.currentToken.type === VAR){
                this.eat(VAR);
                // @ts-ignore this.currentToken will change after this.eat(VAR);
                while (this.currentToken.type === ID){
                    const varDecl = this.variableDeclaration();
                    declarations = declarations.concat(varDecl);
                    this.eat(SEMI);
                };
            }else if(this.currentToken.type === PROCEDURE){
                const procDecl = this.procedureDeclaration();
                declarations.push(procDecl);
            }else{
                break;
            }
        }
        return declarations;
    }

    procedureDeclaration(){
        this.eat(PROCEDURE);
        const procName = this.currentToken.value;
        this.eat(ID);
        let params = this.formalParameterList();
        this.eat(SEMI);
        const blockNode= this.block();
        // @ts-ignore
        const procDecl: ProcedureDecl = new ProcedureDecl(procName, params, blockNode);
        this.eat(SEMI);
        return procDecl;
    }

    formalParameterList(){
        let declarations: VarDecl[] = [];
        if(this.currentToken.type === LPAREN){
            this.eat(LPAREN);
            // @ts-ignore this.currentToken will change after this.eat(VAR);
            while (this.currentToken.type === ID){
                const varDecl = this.formalParameters();
                declarations = declarations.concat(varDecl);
                // @ts-ignore
                if(this.currentToken.type === RPAREN){
                    break;
                // @ts-ignore
                }else if(this.currentToken.type === SEMI){
                    this.eat(SEMI);
                }
            };
            this.eat(RPAREN);
        }
        return declarations;
    }

    formalParameters(){
        const varNodes= [new Var(this.currentToken)];
        this.eat(ID);
        while (this.currentToken.type === COMMA){
            this.eat(COMMA);
            varNodes.push(new Var(this.currentToken));
            this.eat(ID);
        }

        this.eat(COLON);

        const typeNode = this.typeSpec();

        const variableDeclarations = varNodes.map(varNode=>new Param(varNode, typeNode));
        return variableDeclarations;
    }

    variableDeclaration(){
        const varNodes= [new Var(this.currentToken)];
        this.eat(ID);
        while (this.currentToken.type === COMMA){
            this.eat(COMMA);
            varNodes.push(new Var(this.currentToken));
            this.eat(ID);
        }

        this.eat(COLON);

        const typeNode = this.typeSpec();

        const variableDeclarations = varNodes.map(varNode=>new VarDecl(varNode, typeNode));
        return variableDeclarations;
    }

    typeSpec(){
        const token= this.currentToken;
        if(this.currentToken.type === INTEGER){
            this.eat(INTEGER);
        }else if(this.currentToken.type === REAL){
            this.eat(REAL);
        }else {
            this.eat(BOOLEAN);
        }
        const node = new Type(token);
        return node;
    }

    compoundStatement(){
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
        return results;
    }

    statement(): AST{
        let node: AST;
        if(this.currentToken.type === BEGIN){
            node = this.compoundStatement();
        }else if(this.currentToken.type === IF){
            node = this.conditionStatement();
        }else if(this.currentToken.type === ID && this.lexer.currentChar === LPAREN){
            node = this.proccallStatement();
        }else if(this.currentToken.type === ID){
            node = this.assignmentStatement();
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

    conditionStatement(): AST{
        const token = this.currentToken;
        this.eat(IF);
        const condition = this.expr();
        const tokenThen = this.currentToken;
        this.eat(THEN);
        const thenStatementList = this.statementList();
        const then = new Then(tokenThen, thenStatementList);
        
        let node: Condition;
        if(this.currentToken.type === ELSE){
            const myElseToken = this.currentToken;
            this.eat(ELSE);
            const myElseStatementList = this.statementList();
            const myElse = new MyElse(myElseToken, myElseStatementList);
            node = new Condition(token,condition,then, myElse);
        }else{
            node = new Condition(token,condition,then);
        }
        return node;
    }

    proccallStatement(){
        const token = this.currentToken;
        const procName = this.currentToken.value;
        this.eat(ID);
        this.eat(LPAREN);
        const actualParams:AST[] = [];
        while(this.currentToken.type !== RPAREN){
            const node = this.expr();
            actualParams.push(node);
            // @ts-ignore
            if(this.currentToken.type === RPAREN){
                break;
            }else if(this.currentToken.type === COMMA){
                this.eat(COMMA);
            }
        }

        this.eat(RPAREN);

        const node = new ProcedureCall(
            // @ts-ignore
            procName,
            actualParams,
            token
        );
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

    parserError(eooroCode: ErrorCode, token: Token){
        return new ParserError(
            eooroCode,
            token,
            `${eooroCode} -> ${token}`,
        );
    }

}

export class MySymbol{
    constructor(public name: string,public type?: MySymbol){

    }

    toString(){
        return this.name;
    }
}

export class BuiltinTypeSymbol extends MySymbol{
    className = "BuiltinTypeSymbol";
    constructor(public name: string){
        super(name);
    }
    toString(){
        return `<{${this.className}}(name='${this.name}')>`;
    }
}

export class VarSymbol extends MySymbol{
    className = "VarSymbol";
    constructor(name: string, type: MySymbol){
        super(name, type);
    }

    toString(){
        return `<{${this.className}}(name='${this.name}, type=${this.type}')>`;
    }
}

export class ProcedureSymbol extends MySymbol{
    className = "ProcedureSymbol";
    params: VarSymbol[] = [];
    constructor(name: string, params?: VarSymbol[]){
        super(name);
        if(params !== undefined){
            this.params = params;
        }
    }

    toString(){
        return `<{${this.className}}(name='${this.name}, parameters=${this.params}')>`;
    }
}

export class ScopedSymbolTable {
    private symbols:{
        [key:string]: MySymbol | undefined;
    } = {};

    constructor(
        public scopeName: string,
        public scopeLevel: number,
        public enclosingScope: ScopedSymbolTable | undefined = undefined
    ){
        this.insert(new BuiltinTypeSymbol(INTEGER));
        this.insert(new BuiltinTypeSymbol(REAL));
    }

    insert(symbol: MySymbol){
        this.log(`Define: ${symbol}`);
        this.symbols[symbol.name] = symbol;
    }

    lookup(name: string, currentScopeOnly = false): MySymbol | undefined{
        this.log(`Lookup: ${name}`);
        const symbol = this.symbols[name];
        if(symbol !== undefined){
            return symbol;
        }

        if(currentScopeOnly){
            return undefined;
        }

        if(this.enclosingScope !== undefined){
            return this.enclosingScope.lookup(name);
        }
    }

    toString(){
        const h1 = "SCOPE (SCOPED SYMBOL TABLE)";
        const lines = ["\n", h1, h1.split("").map(()=>"=").join(""), "\n"];
        lines.push(`Scope name: ${this.scopeName}`);
        const h2 = "Scope (Scoped symbol table) contents";
        lines.push(h2);
        lines.push(h2.split("").map(()=>"=").join(""));
        for(let key in this.symbols){
            lines.push(`${key}: ${this.symbols[key]}`);
        }
        lines.push("\n");
        return lines.join("\n");
    }

    log(message: any){
        if(_SHOULD_LOG_SCOPE){
            console.log(message);
        }
    }
}


export abstract class NodeVisitor{
    visit(node: AST){
        if(node instanceof Num){
            return this.visitNum(node);
        }else if(node instanceof MyBoolean){
            return this.visitMyBoolean(node);
        }else if(node instanceof Program){
            return this.visitProgram(node);
        }else if(node instanceof Block){
            return this.visitBlock(node);
        }else if(node instanceof VarDecl){
            return this.visitVarDecl(node);
        }else if(node instanceof Type){
            return this.visitType(node);
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
        }else if(node instanceof ProcedureDecl){
            return this.visitProcedureDecl(node);
        }else if(node instanceof ProcedureCall){
            return this.visitProcedureCall(node);
        }else if(node instanceof Condition){
            return this.visitCondition(node);
        }else if(node instanceof Then){
            return this.visitThen(node);
        }else if(node instanceof MyElse){
            return this.visitMyElse(node);
        }else{
            throw new Error("ast错误");
        }
    }

    visitNum(node: Num){
    }

    visitMyBoolean(node: MyBoolean){
    }

    visitProgram(node: Program){
    }

    visitBlock(node: Block){
    }

    visitVarDecl(node: VarDecl){
    }

    visitType(node: Type){
    }

    visitBinOp(node: BinOp): any{
    }

    visitUnaryOp(node: UnaryOp): any{
    }

    visitAssign(node: Assign){
    }

    visitNoOp(node: NoOp){
    }

    visitVar(node: Var){
    }

    visitCompound(node: Compound){
    }

    visitProcedureDecl(node: ProcedureDecl){
    }

    visitProcedureCall(node: ProcedureCall){

    }
    
    visitCondition(node: Condition){

    }

    visitThen(node: Then){

    }

    visitMyElse(node: MyElse){

    }
}

export class SemanticAnalyzer extends NodeVisitor{
    currentScope = new ScopedSymbolTable("initial", 1);

    constructor(scope: boolean){
        super();
        _SHOULD_LOG_SCOPE = scope;
    }

    visitProgram(node: Program){
        const globalScope = new ScopedSymbolTable("global", 1);
        this.currentScope = globalScope;
        this.visit(node.block);
        this.log(`${globalScope}`);
        // @ts-ignore
        this.currentScope = this.currentScope.enclosingScope;
        this.log('LEAVE scope: global')
    }

    visitProcedureDecl(node: ProcedureDecl){
        const procName = node.procName;
        const procSymbol = new ProcedureSymbol(procName);
        this.currentScope.insert(procSymbol);
        this.log(`ENTER scope: ${procName}`);
        const procedureScope = new ScopedSymbolTable(
            procName,
            this.currentScope.scopeLevel + 1,
            this.currentScope
        );
        this.currentScope = procedureScope;
        for(const param of node.params){
            const paramType = this.currentScope.lookup(param.typeNode.value);
            const paramName = param.varNode.value;
            // @ts-ignore
            const varSymbol: VarSymbol = new VarSymbol(paramName, paramType);
            this.currentScope.insert(varSymbol);
            procSymbol.params.push(varSymbol);
        }
        this.visit(node.blockNode);
        this.log(`${procedureScope}`);
        // @ts-ignore
        this.currentScope = this.currentScope.enclosingScope;
        this.log(`LEAVE scope: ${procName}`);
    }

    visitBlock(node: Block){
        for(const declaration of node.declarations){
            this.visit(declaration);
        }
        this.visit(node.compoundStatement);
    }

    visitVarDecl(node: VarDecl){
        const typeName = node.typeNode.value;
        const typeSymbol = this.currentScope.lookup(typeName);
        const varName = node.varNode.value;
        // @ts-ignore
        const varSymbol: VarSymbol = new VarSymbol(varName, typeSymbol);
        if(this.currentScope.lookup(varName, true) !== undefined){
            throw this.semanticError(
                ErrorCode.DUPLICATE_ID,
                node.varNode.token
            );
        }
        this.currentScope.insert(varSymbol);
    }

    visitType(node: Type){

    }

    visitBinOp(node: BinOp): any{
        this.visit(node.left);
        this.visit(node.right);
    }
    visitUnaryOp(node: UnaryOp): any{
        this.visit(node.right);
    }

    visitAssign(node: Assign){
        const varName = node.left.value;
        const varSymbol = this.currentScope.lookup(varName);
        if(varSymbol === undefined){
            throw this.semanticError(
                ErrorCode.ID_NOT_FOUND,
                node.token
            );
        }
        this.visit(node.right);
    }

    visitNoOp(node: NoOp){

    }

    visitVar(node: Var){
        const varName = node.value;
        const varSymbol = this.currentScope.lookup(varName);
        if(varSymbol === undefined){
            throw this.semanticError(
                ErrorCode.ID_NOT_FOUND,
                node.token,
            );
        }
    }

    visitCompound(node: Compound){
        for(const child of node.children){
            this.visit(child);
        }
    }

    visitProcedureCall(node: ProcedureCall){
        for(const paramNode of node.actualParams){
            this.visit(paramNode);
        }
    }

    visitCondition(node: Condition){
        if(this.visit(node.condition)){
            this.visit(node.then);
        }else{
            if(node.myElse){
                this.visit(node.myElse); 
            }
        }
    }

    visitThen(node: Then){
        for(const child of node.children){
            this.visit(child);
        }
    }

    visitMyElse(node: MyElse){
        for(const child of node.children){
            this.visit(child);
        }
    }

    semanticError(errorCode: ErrorCode, token: Token){
        return new SemanticError(
            errorCode,
            token,
            `${errorCode} -> ${token}`,
        );
    }

    log(message: any){
        if(_SHOULD_LOG_SCOPE){
            console.log(message);
        }
    }

}