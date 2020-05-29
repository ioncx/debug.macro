const { createMacro, MacroError } = require('babel-plugin-macros');

module.exports = createMacro(debugMacro);

function debugMacro({ references, state, babel }) {
    const { assert = [], expose = [], assertIsDefined = [], default: defaultImport = [] } = references;
    const t = babel.types;

    assert.forEach(function assertMacro(referencePath) {
        if (process.env.NODE_ENV === 'production') {
            referencePath.parentPath.replaceWithMultiple([]);
            return;
        }

        if (referencePath.parentPath.type !== 'CallExpression') {
            throw new MacroError('assert.macro is a function(condition, message?)');
        }

        if (defaultImport.length) {
            throw new MacroError('debug.macro has no default export');
        }

        const args = referencePath.parentPath.get('arguments');

        referencePath.parentPath.replaceWithMultiple([
            t.ifStatement(
                t.unaryExpression('!', args[0].node),
                t.blockStatement([
                    t.throwStatement(
                        t.newExpression(t.identifier('Error'), [
                            t.binaryExpression('+', t.stringLiteral('[Assert Failed]: '), args[1] ? args[1].node : t.stringLiteral('no message'))
                        ])
                    )
                ])
            )
        ]);
    });

    assertIsDefined.forEach(function assertIsDefinedMacro(referencePath) {
        if (process.env.NODE_ENV === 'production') {
            referencePath.parentPath.replaceWithMultiple([]);
            return;
        }

        if (referencePath.parentPath.type !== 'CallExpression') {
            throw new MacroError('assertIsDefined.macro is a function(val, message?)');
        }

        if (defaultImport.length) {
            throw new MacroError('debug.macro has no default export');
        }

        const args = referencePath.parentPath.get('arguments');

        referencePath.parentPath.replaceWithMultiple([
            t.ifStatement(
              t.unaryExpression('!', args[0].node),
              t.blockStatement([
                  t.throwStatement(
                    t.newExpression(t.identifier('Error'), [
                        t.binaryExpression('+', t.stringLiteral('[Assert Is Defined Failed] '), args[1] ? args[1].node : t.stringLiteral(''))
                    ])
                  )
              ])
            )
        ]);
    });

    expose.forEach(function exposeMacro(referencePath) {
        if (process.env.NODE_ENV === 'production') {
            referencePath.parentPath.replaceWithMultiple([]);
            return;
        }

        if (referencePath.parentPath.type !== 'CallExpression') {
            throw new MacroError('expose.macro is a function(condition, message)');
        }

        const [identifier, name] = referencePath.parentPath.get('arguments');
        const identifierName = name ? t.identifier(name.node.value) : identifier.node;
        referencePath.parentPath.replaceWithMultiple([
            t.assignmentExpression(
                '=',
                t.memberExpression(t.identifier('window'), identifierName),
                identifier.node
            )
        ]);
    });
}
