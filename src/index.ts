import { Lexer, Parser, SemanticAnalyzer } from "./part-16";
function semanticAnalyz(program: string){
    const lexer = new Lexer(program);
    const parser = new Parser(lexer);
    const tree = parser.parse(); 
    const semanticAnalyzer = new SemanticAnalyzer();
    return semanticAnalyzer.visit(tree);
}
try{
    semanticAnalyz(`
program Main;

procedure Alpha(a : integer; b : integer);
var x : integer;
begin
    x := (a + b ) * 2;
end;

begin { Main }

    Alpha(3 + 5, 7);  { procedure call }

end.  { Main }
    `);
}catch(e){
    console.error(e);
}