import { Lexer, Parser, SemanticAnalyzer, final } from "./final";
function semanticAnalyz(program: string){
    const lexer = new Lexer(program);
    const parser = new Parser(lexer);
    const tree = parser.parse(); 
    const semanticAnalyzer = new SemanticAnalyzer();
    return semanticAnalyzer.visit(tree);
}
try{
    final(`
    program Main;
    var x, y : integer;
    procedure PlusXAndY();
    begin
        x := x + 1;
        y := y + 1;
    end;
    begin { Main }
        y := 0;
        x := 1;
    end.  { Main }
    `, true, true);
}catch(e){
    console.error(e);
}