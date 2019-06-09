import {part4} from "./";

test("7 * 4 / 2", () => {
    expect(part4("7 * 4 / 2")).toBe(14);
});

test("7 * 4 / 2 * 3", () => {
    expect(part4("7 * 4 / 2 * 3")).toBe(42);
});

test("10 * 4  * 2 * 3 / 8", () => {
    expect(part4("10 * 4  * 2 * 3 / 8")).toBe(30);
});
