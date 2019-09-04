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
    begin { Main }
       y := 7;
       x := (y + 3) * 3;
    end.  { Main }
    `, true, true);
}catch(e){
    console.error(e);
}