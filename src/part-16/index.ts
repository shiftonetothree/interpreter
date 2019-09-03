import toRegex from "to-regex";

let _SHOULD_LOG_SCOPE = false;

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
export function part16(program: string, scope = false){
    _SHOULD_LOG_SCOPE = scope;
    const lexer = new Lexer(program);
    const parser = new Parser(lexer);
    const tree = parser.parse(); 
    const semanticAnalyzer = new SemanticAnalyzer();
    semanticAnalyzer.visit(tree);

    const interpreter  = new Interpreter();
    const result = interpreter.interpret(tree);

    console.debug("");
    console.debug("Run-time GLOBAL_MEMORY contents:");
    console.debug(result);
    return result;
}

// single-character token types
const PLUS = "+";
const MINUS = "-";
const MUL = "*";
const SEMI = ";";
const DOT = ".";
const LPAREN = "(";
const RPAREN = ")";
const COLON = ":";
const COMMA = ",";
const FLOAT_DIV = "/";

// block of reserved words
const BEGIN = "BEGIN";
const INTEGER = "INTEGER";
const INTEGER_DIV = "DIV";
const PROGRAM = "PROGRAM";
const PROCEDURE = "PROCEDURE";
const VAR = "VAR";
const REAL = "REAL";
const END = "END";

// misc
const ID = "ID";
const INTEGER_CONST = "INTEGER_CONST";
const REAL_CONST = "REAL_CONST";
const ASSIGN = ":=";
const EOF = "EOF";


const tokenTuple = [
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

    // block of reserved words
    BEGIN,
    INTEGER,
    INTEGER_DIV,
    PROGRAM,
    PROCEDURE,
    VAR,
    REAL,
    END,

    // misc
    ID,
    INTEGER_CONST,
    REAL_CONST,
    FLOAT_DIV,
    ASSIGN,
    EOF,
] as const;

type TokenType = (typeof tokenTuple)[number];

enum ErrorCode{
    UNEXPECTED_TOKEN = "Unexpected token",
    ID_NOT_FOUND = "Identifier not found",
    DUPLICATE_ID = "Duplicate id found"
}

class MyError extends Error{
    name = "MyError";
    constructor(public errorCode?: ErrorCode,public token?: Token,message?:string){
        super();
        this.message = `${this.name}: ${message}`;
    }
}

class LexerError extends MyError{
    name = "LexerError";
    constructor(public errorCode?: ErrorCode,public token?: Token,message?:string){
        super();
        this.message = `${this.name}: ${message}`;
    }
}

class ParserError extends MyError{
    name = "ParserError";
    constructor(public errorCode?: ErrorCode,public token?: Token,message?:string){
        super();
        this.message = `${this.name}: ${message}`;
    }
}

class SemanticError extends MyError{
    name = "SemanticError";
    constructor(public errorCode?: ErrorCode,public token?: Token,message?:string){
        super();
        this.message = `${this.name}: ${message}`;
    }
}



class AST{

}

class Program extends AST{
    constructor(public name: string, public block: Block){
        super();
    }
}

class Block extends AST{
    constructor(public declarations: (VarDecl | ProcedureDecl)[], public compoundStatement: Compound){
        super();
    }
}

class VarDecl extends AST{
    constructor(public varNode: Var, public typeNode: Type){
        super();
    }
}

class ProcedureDecl extends AST{
    constructor(public procName: string,public params: Param[], public blockNode: Block){
        super();
    }
}

class Param extends AST{
    constructor(public varNode: Var, public typeNode: Type){
        super();
    }
}

class Type extends AST{
    value: string;
    constructor(public token: Token){
        super();
        this.value = token.value as string;
    }
}

class Assign extends AST{
    constructor(public left: Var, public token: Token, public right:AST){
        super();
    }
}

class Var extends AST{
    value: string;
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

class ProcedureCall extends AST{
    constructor(public procName: string, public actualParams: AST[], public token: Token){
        super();
    }
}

class Token{
    constructor(
        public type: TokenType, 
        public value: string | undefined | number,
        public lineno?: number,
        public column?: number,
        ){
    }
    toString(){
        return `Token(${this.type}, ${this.value}, positoin=${this.lineno}:${this.column})`;
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
        [PROCEDURE]: new Token(PROCEDURE,PROCEDURE),
        [END]: new Token(END,END),
    }
    
    constructor(private text: string){

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
            if (this.currentChar === COLON && this.peek() === "="){
                this.advance();
                this.advance();
                return new Token(ASSIGN, ASSIGN, this.lineno, this.column);
            }
            if (this.currentChar === COLON && this.peek() !== "="){
                this.advance();
                return new Token(COLON, COLON, this.lineno, this.column);
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

    

    factor(): AST{
        const currentToken = this.currentToken;
        if(currentToken.type === PLUS){
            this.eat(PLUS);
            return new UnaryOp(currentToken, this.factor());
        }else if(currentToken.type === MINUS){
            this.eat(MINUS);
            return new UnaryOp(currentToken, this.factor());
        }else if(currentToken.type === INTEGER_CONST){
            this.eat(INTEGER_CONST);
            return new Num(currentToken);
        }else if(currentToken.type === REAL_CONST){
            this.eat(REAL_CONST);
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

        while(this.currentToken.type === MUL 
                || this.currentToken.type === INTEGER_DIV 
                || this.currentToken.type === FLOAT_DIV
            ){
            const op = this.currentToken;
            if(op.type === MUL){
                this.eat(MUL);
                result = new BinOp(result, op, this.factor());
            }else if(op.type === INTEGER_DIV){
                this.eat(INTEGER_DIV);
                result = new BinOp(result, op, this.factor());
            }else if(op.type === FLOAT_DIV){
                this.eat(FLOAT_DIV);
                result = new BinOp(result, op, this.factor());
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
            }else if(op.type === MINUS){
                this.eat(MINUS);
            }
            result = new BinOp(result, op, this.term());
        }
        return result;
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
        }else{
            this.eat(REAL)
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

    proccallStatement(){
        const token = this.currentToken;
        const procName = this.currentToken.value;
        this.eat(ID);
        this.eat(LPAREN);
        const actualParams:AST[] = [];
        if(this.currentToken.type !== RPAREN){
            const node = this.expr();
            actualParams.push(node);
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

class MySymbol{
    constructor(public name: string,public type?: MySymbol){

    }

    toString(){
        return this.name;
    }
}

class BuiltinTypeSymbol extends MySymbol{
    className = "BuiltinTypeSymbol";
    constructor(public name: string){
        super(name);
    }
    toString(){
        return `<{${this.className}}(name='${this.name}')>`;
    }
}

class VarSymbol extends MySymbol{
    className = "VarSymbol";
    constructor(name: string, type: MySymbol){
        super(name, type);
    }

    toString(){
        return `<{${this.className}}(name='${this.name}, type=${this.type}')>`;
    }
}

class ProcedureSymbol extends MySymbol{
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

class ScopedSymbolTable {
    private symbols:{
        [key:string]: MySymbol | undefined;
    } = {};

    constructor(
        public scopeName: string,
        public scopeLevel: number,
        public enclosingScope: ScopedSymbolTable | undefined = undefined){
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


abstract class NodeVisitor{
    visit(node: AST){
        if(node instanceof Num){
            return this.visitNum(node);
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
        }else{
            throw new Error("ast错误");
        }
    }

    visitNum(node: Num){
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
}

export class SemanticAnalyzer extends NodeVisitor{
    currentScope = new ScopedSymbolTable("initial", 1);

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

class Interpreter extends NodeVisitor{
    GLOBAL_SCOPE:{
        [key: string]: number;
    } = {}

    constructor(){
        super();
    }

    visitNum(node: Num){
        return node.value;
    }

    visitProgram(node: Program){
        this.visit(node.block);
    }

    visitBlock(node: Block){
        for(const declaration of node.declarations){
            this.visit(declaration);
        }
        this.visit(node.compoundStatement);
    }

    visitVarDecl(node: VarDecl){

    }

    visitType(node: Type){

    }

    visitBinOp(node: BinOp): number{
        const leftVal = this.visit(node.left);
        const rightVal = this.visit(node.right);
        if(leftVal === undefined || rightVal === undefined){
            throw new Error("ast错误");
        }
        if(node.token.type === PLUS){
            return leftVal + rightVal;
        }else if(node.token.type === MINUS){
            return leftVal - rightVal;
        }else if(node.token.type === MUL){
            return leftVal * rightVal;
        }else if(node.token.type === FLOAT_DIV){
            return leftVal / rightVal;
        }else if(node.token.type === INTEGER_DIV){
            return Math.floor(leftVal / rightVal);
        }else{
            throw new Error("ast错误");
        }
    }
    visitUnaryOp(node: UnaryOp): number{
        const rightVal = this.visit(node.right);
        if(rightVal === undefined){
            throw new Error("ast错误");
        }
        if(node.token.type === PLUS){
            return + rightVal;
        }else if(node.token.type === MINUS){
            return - rightVal;
        }else{
            throw new Error("ast错误");
        }
    }

    visitAssign(node: Assign){
        const varName = node.left.value;
        const val = this.visit(node.right);
        if(val === undefined){
            throw new Error("ast错误");
        }else{
            this.GLOBAL_SCOPE[varName] = val;
        }
        
    }

    visitNoOp(node: NoOp){

    }

    visitVar(node: Var){
        const varName= node.value;
        const val = this.GLOBAL_SCOPE[varName];
        return val;
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

    interpret(tree: Program){
        this.visit(tree);
        return this.GLOBAL_SCOPE;
    }
}