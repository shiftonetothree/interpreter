import { cli } from "./cli";

test("test-1", () => {
    expect(cli("src/final/test-1.pas")).toEqual({x: 30, y: 7});
});

test("test-2", () => {
    expect({... cli("src/final/test-2.pas"), PlusXAndY: undefined}).toEqual({x: 1, y: 0, PlusXAndY: undefined});
});

test("test-3", () => {
    expect({... cli("src/final/test-3.pas"), PlusXAndY: undefined}).toEqual({x: 2, y: 1, PlusXAndY: undefined});
});

test("test-4", () => {
    expect({... cli("src/final/test-4.pas"), PlusXAndY: undefined}).toEqual({x: 4, y: 4, PlusXAndY: undefined});
});

test("test-5", () => {
    expect({... cli("src/final/test-5.pas")}).toEqual({x: 4, y: 4, b: true});
});

test("test-error-1", () => {
    expect(()=>cli("src/final/test-error-1.pas")).toThrow();
});
