import { 
    _SHOULD_LOG_SCOPE,
    _PRGRAM_FILE_PATH,
    Lexer,
    Parser,
    SemanticAnalyzer,
    AST,
    TokenType,
    RuntimeError,
    NodeVisitor,
    Num,
    VarDecl,
    Type,
    ProcedureDecl,
    BinOp,
    UnaryOp,
    Assign,
    NoOp,
    Var,
    Call,
    Compound,
    Token,
    ErrorCode,
    Program,
    PROGRAM,
    Block,
    PLUS,
    MINUS,
    MUL,
    FLOAT_DIV,
    INTEGER_DIV,
    PROCEDURE,
    MyBoolean,
    NOT,
    OR,
    AND,
    EQUALS,
    NOT_EQUALS,
    GREATER_THAN,
    GREATER_OR_EQUALS_THAN,
    LESS_OR_EQUALS_THAN,
    LESS_THAN,
    Condition,
    Then,
    MyElse,
    While,
    MyDo,
    Continue,
    Break,
    FunctionDecl,
    FUNCTION,
} from "./basic";

let _SHOULD_LOG_STACK = false;

export function final(program: string, scope = false, stack = false, path = ""){
    const lexer = new Lexer(program, path);
    const parser = new Parser(lexer);
    const tree = parser.parse(); 
    const semanticAnalyzer = new SemanticAnalyzer(scope);
    semanticAnalyzer.visit(tree);

    const interpreter  = new Interpreter(stack);
    const result = interpreter.interpret(tree);

    return result;
}


export class CallStack{

    private records: ActivationRecord[] = [];

    push(ar: ActivationRecord){
        const arNow = this.peek();
        if(arNow !== undefined){
            ar.enclosingActivationRecord = arNow;
            ar.nestingLevel = arNow.nestingLevel + 1;
        }
        this.records.push(ar);
    }

    pop(){
        return this.records.pop();
    }

    peek(){
        return this.records[this.records.length - 1];
    }

    toString(){
        let s = this.records.reverse().join("\n");
        s = `CALL STACK\n${s}\n`;
        return s;
    }

}


class ActivationRecord{
    members:{
        [key: string]: string | number | AST | undefined,
    } = {};

    returnValue: number | string | undefined;
    constructor(
        public name: string, 
        public type: TokenType, 
        public nestingLevel: number = 1,
        public enclosingActivationRecord: ActivationRecord | undefined = undefined
    ){
    }

    declareItem(key: string){
        this.members[key] = undefined;
    }

    setItem(key:string, value: string | number | AST){
        if(this.members.hasOwnProperty(key)){
            this.members[key] = value;
        }else if(this.enclosingActivationRecord !== undefined){
            this.enclosingActivationRecord.setItem(key, value);
        }else{
            throw new RuntimeError(ErrorCode.ID_NOT_FOUND, undefined, `${ErrorCode.ID_NOT_FOUND} -> ${key}`);
        }
    }

    setReturn(value: string | number){
        this.returnValue = value;
    }

    getItem(key: string): string | number | AST | undefined{
        if(this.members.hasOwnProperty(key)){
            return this.members[key];
        }else if(this.enclosingActivationRecord !== undefined){
            return this.enclosingActivationRecord.getItem(key);
        }else{
            throw new RuntimeError(ErrorCode.ID_NOT_FOUND, undefined, `${ErrorCode.ID_NOT_FOUND} -> ${key}`);
        }
    }

    hasItem(key: string): boolean{
        if(this.members.hasOwnProperty(key)){
            return true;
        }else if(this.enclosingActivationRecord !== undefined){
            return this.enclosingActivationRecord.hasItem(key);
        }else{
            return false;
        }
    }

    toString(){
        const lines = [`${this.nestingLevel}: ${this.type}, ${this.name}`];
        for(const key in this.members){
            lines.push(`    ${key}: ${this.members[key]}`);
        }
        const s = lines.join("\n");
        return s;
    }
}

export class BreakError extends Error{
    name = "BreakError";
    constructor(public token?: Token){
        super();
    }
}

export class ContinueError extends Error{
    name = "ContinueError";
    constructor(public token?: Token){
        super();
    }
}

export class ReturnError extends Error{
    name = "ReturnError";
    constructor(public value: string | number,public token?: Token){
        super();
    }
}

export class Interpreter extends NodeVisitor{
    callStack = new CallStack();

    programActivationRecord: ActivationRecord | undefined;

    constructor(stack: boolean){
        super();
        _SHOULD_LOG_STACK = stack;
    }

    visitNum(node: Num){
        return node.value;
    }

    visitMyBoolean(node: MyBoolean){
        return node.value;
    }

    visitProgram(node: Program){
        const programName = node.name;

        const ar = new ActivationRecord(
            programName,
            PROGRAM,
            1
        );

        this.callStack.push(ar);

        this.log(`ENTER: PROGRAM ${programName}`);

        this.visit(node.block);

        this.log(`LEAVE: PROGRAM ${programName}`);
        this.log(`${this.callStack}`);
        this.programActivationRecord = ar;
    }

    visitVarDecl(node: VarDecl){
        const varName = node.varNode.value;
        const ar = this.callStack.peek();
        ar.declareItem(varName);
    }

    visitType(node: Type){

    }

    visitProcedureDecl(node: ProcedureDecl){
        const procName = node.procName;
        const ar = this.callStack.peek();
        ar.declareItem(procName);
        ar.setItem(procName, node);
    }

    visitFunctionDecl(node: FunctionDecl){
        const funcName = node.funcName;
        const ar = this.callStack.peek();
        ar.declareItem(funcName);
        ar.setItem(funcName, node);
    }

    visitBlock(node: Block){
        for(const declaration of node.declarations){
            this.visit(declaration);
        }
        this.visit(node.compoundStatement);
    }

    visitBinOp(node: BinOp): number | boolean{
        const leftVal = this.visit(node.left);
        const rightVal = this.visit(node.right);
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
        }else if(node.token.type === AND){
            return leftVal && rightVal;
        }else if(node.token.type === OR){
            return leftVal || rightVal;
        }else if(node.token.type === EQUALS){
            return leftVal === rightVal;
        }else if(node.token.type === NOT_EQUALS){
            return leftVal !== rightVal;
        }else if(node.token.type === GREATER_THAN){
            return leftVal > rightVal;
        }else if(node.token.type === GREATER_OR_EQUALS_THAN){
            return leftVal >= rightVal;
        }else if(node.token.type === LESS_THAN){
            return leftVal < rightVal;
        }else if(node.token.type === LESS_OR_EQUALS_THAN){
            return leftVal <= rightVal;
        }else{
            throw this.runtimeError(
                ErrorCode.UNEXPECTED_TOKEN,
                node.token,
            );
        }
    }
    visitUnaryOp(node: UnaryOp): number | boolean{
        const rightVal = this.visit(node.right);
        if(rightVal === undefined){
            throw this.runtimeError(
                ErrorCode.ID_NOT_FOUND,
                node.token,
            );
        }
        if(node.token.type === PLUS){
            return + rightVal;
        }else if(node.token.type === MINUS){
            return - rightVal;
        }else if(node.token.type === NOT){
            return !rightVal;
        }else{
            throw this.runtimeError(
                ErrorCode.UNEXPECTED_TOKEN,
                node.token,
            );
        }
    }

    visitAssign(node: Assign){
        const varName = node.left.value;
        const valValue = this.visit(node.right);
        const ar = this.callStack.peek();
        if (ar.type === FUNCTION && varName === ar.name){
            ar.setReturn(valValue);
        }else{
            ar.setItem(varName, valValue);
        }
    }

    visitNoOp(node: NoOp){

    }

    visitVar(node: Var){
        const varName= node.value;
        const ar = this.callStack.peek();
        if(ar.hasItem(varName)){
            const val = ar.getItem(varName);
            if(val === undefined){
                throw this.runtimeError(
                    ErrorCode.VARIABLE_NOT_INITIALIZED,
                    node.token,
                );
            }
            return val;
        }
        throw this.runtimeError(
            ErrorCode.ID_NOT_FOUND,
            node.token
        );
    }

    visitCall(node: Call){
        const name = node.name;
        let ar = this.callStack.peek();
        // @ts-ignore
        const proc: ProcedureDecl | FunctionDecl = ar.getItem(name);

        if(proc instanceof ProcedureDecl){
            this.log(`ENTER: PROCEDURE ${name}`);
        
            const actualParamValues: (number|string)[] = [];
            for(const actualParam of node.actualParams){
                actualParamValues.push(this.visit(actualParam));
            }
    
            const newAr = new ActivationRecord(name,PROCEDURE);
            this.callStack.push(newAr);
            ar = this.callStack.peek();
            for(let i=0;i<proc.params.length;i++){
                ar.declareItem(proc.params[i].varNode.value);
                ar.setItem(proc.params[i].varNode.value, actualParamValues[i]);
            }
            this.visit(proc.blockNode);
            this.log(`${this.callStack}`);
            this.callStack.pop();
            this.log(`LEAVE: PROCEDURE ${name}`);
        }else if(proc instanceof FunctionDecl){
            this.log(`ENTER: FUNCTION ${name}`);
        
            const actualParamValues: (number|string)[] = [];
            for(const actualParam of node.actualParams){
                actualParamValues.push(this.visit(actualParam));
            }
    
            const newAr = new ActivationRecord(name,FUNCTION);
            this.callStack.push(newAr);
            ar = this.callStack.peek();
            for(let i=0;i<proc.params.length;i++){
                ar.declareItem(proc.params[i].varNode.value);
                ar.setItem(proc.params[i].varNode.value, actualParamValues[i]);
            }
            this.visit(proc.blockNode);
            this.log(`${this.callStack}`);
            this.callStack.pop();
            this.log(`LEAVE: FUNCTION ${name}`);
            if(ar.returnValue === undefined){
                throw this.runtimeError(
                    ErrorCode.MISSING_RETURN,
                    proc.token
                );
            }
            return ar.returnValue;
        }
        
    }

    visitCompound(node: Compound){
        for(const child of node.children){
            this.visit(child);
        }
    }

    visitCondition(node: Condition){
        if(this.visit(node.condition) === true){
            this.visit(node.then);
        }else{
            if(node.myElse){
                this.visit(node.myElse); 
            }
        }
    }

    visitThen(node: Then){
        this.visit(node.child);
    }

    visitMyElse(node: MyElse){
        this.visit(node.child);
    }

    visitWhile(node: While){
        while(this.visit(node.condition) === true){
            try{
                if(this.visit(node.myDo) === true){
                    break;
                }
            }catch(e){
                if(e.name === "BreakError"){
                    break;
                }else if(e.name === "ContinueError"){
                    continue;
                }else{
                    throw e;
                }
            }
            
        }
    }

    visitMyDo(node: MyDo){
        this.visit(node.child);
    }

    visitBreak(node: Break){
        throw new BreakError(node.token);
    }

    visitContinue(node: Continue){
        throw new ContinueError(node.token);
    }

    interpret(tree: Program){
        this.visit(tree);
        if(this.programActivationRecord){
            return this.programActivationRecord.members;
        }
    }

    runtimeError(errorCode: ErrorCode, token: Token){
        return new RuntimeError(
            errorCode,
            token,
            `${errorCode} -> ${token}`,
        );
    }

    log(msg: any){
        if(_SHOULD_LOG_STACK){
            console.debug(msg);
        }
    }
}
