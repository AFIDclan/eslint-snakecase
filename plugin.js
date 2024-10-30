module.exports = {
    rules: {
      'snakecasejs': {
        meta: {
          type: 'suggestion',
          docs: {
            description: 'Enforce snake_case naming convention for local identifiers',
          },
          fixable: 'code',
        },
        create(context) {
          const source_code = context.getSourceCode();
  
          // const is_snake_case = (name) => /^[a-z]+(_[a-z]+)*$/.test(name);
          const is_snake_case = (name) => {
            return (
              /^_*[a-z]+(_[a-z]+)*$/.test(name) || // all lowercase snake_case
              /^_*[A-Z]+(_[A-Z]+)*$/.test(name)    // all uppercase SNAKE_CASE
            );
          };

          const check_identifier = (node, name) => {
            if (!is_snake_case(name)) {
              const snake_name = name
                .replace(/([A-Z])/g, '_$1')
                .toLowerCase()
                .replace(/__+/g, '_');
  
              // Get the variable from the scope manager
              const variable = source_code.getScope(node).set.get(name) || source_code.getScope(node).upper.set.get(name);
  
              let references = [];
              if (variable) {
                references = variable.references;
              } else {
                // For parameters and function names
                const variables = source_code.getDeclaredVariables(node);
                if (variables.length > 0) {
                  references = variables[0].references;
                }
              }
  
              context.report({
                node,
                message: 'Identifier "{{name}}" is not in snake_case.',
                data: { name },
                fix(fixer) {
                  const fixes = [];
  
                  // Fix the declaration
                  fixes.push(fixer.replaceText(node, snake_name));
  
                  // Fix all references
                  references.forEach((ref) => {
                    // Avoid replacing the declaration node again
                    if (ref.identifier !== node) {
                      fixes.push(fixer.replaceText(ref.identifier, snake_name));
                    }
                  });
  
                  return fixes;
                },
              });
            }
          };
  
          return {
            VariableDeclarator(node) {
              if (node.id.type === 'Identifier') {
                check_identifier(node.id, node.id.name);
              }
            },
            FunctionDeclaration(node) {
              if (node.id) {
                check_identifier(node.id, node.id.name);
              }
              node.params.forEach((param) => {
                if (param.type === 'Identifier') {
                  check_identifier(param, param.name);
                }
              });
            },
            FunctionExpression(node) {
              if (node.id) {
                check_identifier(node.id, node.id.name);
              }
              node.params.forEach((param) => {
                if (param.type === 'Identifier') {
                  check_identifier(param, param.name);
                }
              });
            },
            ArrowFunctionExpression(node) {
              node.params.forEach((param) => {
                if (param.type === 'Identifier') {
                  check_identifier(param, param.name);
                }
              });
            },
            // Ignore class names in ClassDeclaration
            ClassDeclaration(node) {
              // Do not check node.id (class name)
            },
            MethodDefinition(node) {
              if (
                node.key.type === 'Identifier' &&
                !node.computed &&
                node.kind !== 'constructor'
              ) {
                check_identifier(node.key, node.key.name);
              }
            },
            Property(node) {
              if (
                node.key.type === 'Identifier' &&
                !node.computed &&
                !node.method &&
                !node.shorthand
              ) {
                check_identifier(node.key, node.key.name);
              }
            },
            CatchClause(node) {
              if (node.param && node.param.type === 'Identifier') {
                check_identifier(node.param, node.param.name);
              }
            },
          };
        },
      },
    },
  };
  