import {part5} from "./";

test("7 * 4 / 2", () => {
    expect(part5("7 * 4 / 2")).toBe(14);
});

test("7 * 4 / 2 * 3", () => {
    expect(part5("7 * 4 / 2 * 3")).toBe(42);
});

test("10 * 4  * 2 * 3 / 8", () => {
    expect(part5("10 * 4  * 2 * 3 / 8")).toBe(30);
});

test("3", () => {
    expect(part5("3")).toBe(3);
});

test("2 + 7 * 4", () => {
    expect(part5("2 + 7 * 4")).toBe(30);
});

test("7 - 8 / 4", () => {
    expect(part5("7 - 8 / 4")).toBe(5);
});

test("14 + 2 * 3 - 6 / 2", () => {
    expect(part5("14 + 2 * 3 - 6 / 2")).toBe(17);
});

