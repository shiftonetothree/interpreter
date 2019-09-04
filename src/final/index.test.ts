import { cli } from "./cli";

test("test-1", () => {
    expect(cli("src/final/test-1.pas")).toEqual({x: 30, y: 7});
});

test("test-error-1", () => {
    expect(()=>cli("src/final/test-error-1.pas")).not.toThrow();
});