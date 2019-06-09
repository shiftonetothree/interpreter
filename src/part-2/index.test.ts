import {part2} from "./";
test('1+2', () => {
    expect(part2("1+2")).toBe(3);
});
test('3+4', () => {
    expect(part2("3+4")).toBe(7);
});
test('3 +4', () => {
    expect(part2("3 +4")).toBe(7);
});
test('12+ 23', () => {
    expect(part2("12+ 23")).toBe(35);
});
test('3- 4', () => {
    expect(part2("3- 4")).toBe(-1);
});
test('12 -23', () => {
    expect(part2("12 -23")).toBe(-11);
});
