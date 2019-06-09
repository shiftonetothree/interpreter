import {part3} from "./";
test('1+2', () => {
    expect(part3("1+2")).toBe(3);
});
test('3+4', () => {
    expect(part3("3+4")).toBe(7);
});
test('3 +4', () => {
    expect(part3("3 +4")).toBe(7);
});
test('12+ 23', () => {
    expect(part3("12+ 23")).toBe(35);
});
test('3- 4', () => {
    expect(part3("3- 4")).toBe(-1);
});
test('3-4-6+8 -11', () => {
    expect(part3("3-4-6+8 -11")).toBe(-10);
});
test('12-23 +10-20 +22', () => {
    expect(part3("12-23 +10-20 +22")).toBe(1);
});
test('12-23 +10-20 +22+', () => {
    expect(()=>part3("12-23 +10-20 +22+")).toThrowError();
});
