import { compile } from '../src/compile';

test('should refactor ObjectProperty', () => {
  const source = `something({ property: "value" });`;
  const { code } = compile(source);
  const expected = `var $prop$property = "property";
something({
  [$prop$property]: "value"
});`;
  expect(code).toBe(expected);
});

test('should not duplicate var declarations', () => {
  const source = `something({ property: "value" });
something({ property: "value" });`;
  const { code } = compile(source);
  const expected = `var $prop$property = "property";
something({
  [$prop$property]: "value"
});
something({
  [$prop$property]: "value"
});`;
  expect(code).toBe(expected);
});

test('should can refactor if have computed literal', () => {
  const source = `var sk = "prop";
something({ property: "value", [sk]: "sv" });`;
  const { code } = compile(source);
  const expected = `var $prop$property = "property";
var sk = "prop";
something({
  [$prop$property]: "value",
  [sk]: "sv"
});`;
  expect(code).toBe(expected);
});

test('should can refactor if have function', () => {
  const source = `something({ property: "value", some: v => v });`;
  const { code } = compile(source);
  const expected = `var $prop$property = "property";
var $prop$some = "some";
something({
  [$prop$property]: "value",
  [$prop$some]: v => v
});`;
  expect(code).toBe(expected);
});
