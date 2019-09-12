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
    expect({... cli("src/final/test-5.pas")}).toEqual({
        x: 1, 
        y: 0, 
        t1: true,
        t2: true,
        t3: true,
        t4: true,
        t5: true,
        t6: true,
        t7: true,
        f1: false,
        f2: false,
        f3: false,
        f4: false,
        f5: false,
        f6: false,
        f7: false,
    });
});

test("test-6", () => {
    expect({... cli("src/final/test-6.pas")}).toEqual({
        a: 1,
        b: 1,
        c: 2,
    });
});

test("test-7", () => {
    expect({... cli("src/final/test-7.pas")}).toEqual({
        a: 10,
        b: 20,
        b2: 10,
        c: 15,
    });
});

test("test-error-1", () => {
    expect(()=>cli("src/final/test-error-1.pas")).toThrow();
});
