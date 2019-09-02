import { Lexer, Parser, SemanticAnalyzer } from "./part-15";
function semanticAnalyz(program: string){
    const lexer = new Lexer(program);
    const parser = new Parser(lexer);
    const tree = parser.parse(); 
    const semanticAnalyzer = new SemanticAnalyzer();
    return semanticAnalyzer.visit(tree);
}
try{
    semanticAnalyz(`
program SymTab6;
    var x, y : integer;
    var y : real;
begin
    x := x + y;
end.
    `);
}catch(e){
    console.error(e);
}