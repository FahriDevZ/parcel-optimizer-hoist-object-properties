import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import generator, { GeneratorOptions, GeneratorResult } from '@babel/generator';

function createVarDeclaration(form: string, to: string) {
  return t.variableDeclaration('var', [
    t.variableDeclarator(t.identifier(to), t.stringLiteral(form)),
  ]);
}

export function compile(code: string, options?: Options) {
  const ast = parser.parse(code);

  const propertyMap: Map<string, string> = new Map();
  const varDeclarations: t.VariableDeclaration[] = [];

  traverse(ast, {
    ObjectProperty(path) {
      const node = path.node;

      if (node.computed || !node.loc || !t.isIdentifier(node.key)) {
        return;
      }

      const propertyName = node.key.name;
      let randomVarName = propertyMap.get(propertyName);
      if (!randomVarName) {
        randomVarName = `$prop$${propertyName}`;
        propertyMap.set(propertyName, randomVarName);

        varDeclarations.push(createVarDeclaration(propertyName, randomVarName));
      }

      node.key.name = randomVarName;
      node.computed = true;
    },
  });

  if (
    t.isExpressionStatement(ast.program.body[0]) &&
    t.isCallExpression(ast.program.body[0].expression) &&
    (t.isFunctionExpression(ast.program.body[0].expression.callee) ||
      t.isArrowFunctionExpression(ast.program.body[0].expression.callee)) &&
    ast.program.body[0].expression.callee.start === 1 &&
    t.isBlockStatement(ast.program.body[0].expression.callee.body)
  ) {
    for (const varDeclaration of varDeclarations.reverse()) {
      ast.program.body[0].expression.callee.body.body.unshift(varDeclaration);
    }
  } else {
    for (const varDeclaration of varDeclarations.reverse()) {
      ast.program.body.unshift(varDeclaration);
    }
  }

  const compiled = generator(ast, options?.generator ?? {}, code);

  return { code: compiled.code, codeMap: compiled.map, propertyMap };
}

export type { GeneratorOptions, GeneratorResult };

export interface Options {
  generator?: GeneratorOptions;
}
