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
        procedure PlusYAndX(a: integer; b: integer);
        begin
            x := x + a;
            y := y + b;
        end;
    begin
        x := x + 1;
        y := y + 1;
        PlusYAndX(2,3);
    end;
begin { Main }
        x := 1;
        y := 0;
        PlusXAndY();
end.  { Main }
    `, true, true);
}catch(e){
    console.error(e);
}