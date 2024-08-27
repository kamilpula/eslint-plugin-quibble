import { defineTemplateBodyVisitor, docsUrl } from '../utils/index.js'

/**
 * Removes excessive whitespace from a class list string.
 *
 * @param {string} classList - The class list string to process.
 * @returns {string | void} - The class list string without excessive whitespace.
 */
function removeWhitespace(classList) {
  const classListWithWhitespace = classList.split(/(\s+)/)
  const divider = ' '

  const classListNoWhitespace = classListWithWhitespace.filter(
    className => className.trim() !== '',
  ).join(divider)

  return classListNoWhitespace
}

function getNodeValue(node) {
  if (node.type === 'TextAttribute' && node.name === 'class') {
    return node.value
  }
  if (node.value === undefined) {
    return node.value
  }

  switch (node.value.type) {
    case 'JSXExpressionContainer':
      return node.value.expression.value
    case 'VExpressionContainer':
      switch (node.value.expression.type) {
        case 'ArrayExpression':
          return node.value.expression.elements
        case 'ObjectExpression':
          return node.value.expression.properties
      }
      return node.value.expression.value
    default:
      return node.value.value
  }
}

function getNodeRange(node) {
  if (node.type === 'TextAttribute' && node.name === 'class') {
    return [node.valueSpan.fullStart.offset, node.valueSpan.end.offset]
  }
  if (node.value === undefined) {
    return [0, 0]
  }
  switch (node.value.type) {
    case 'JSXExpressionContainer':
      return node.value.expression.range
    default:
      return node.value.range
  }
}

export default {
  meta: {
    name: 'vue-no-excessive-whitespace',
    type: 'layout',
    fixable: 'code',
    docs: {
      description: 'Find excessive whitespace characters in class attribute in Vue templates.',
      recommended: true,
      category: 'Stylistic Issues',
      url: docsUrl('vue-no-excessive-whitespace'),
    },
    messages: {
      'excessive-whitespace-in-class-attribute': 'The `class` attribute should not contain excessive whitespace.',
      'excessive-whitespace-in-custom-callee': 'Custom callee `class` attribute definition should not contain excessive whitespace',
    },
    schema: [],
  },

  create(context) {
    function handleNodeArgument(node, argument = null, messageId = 'excessive-whitespace-in-class-attribute') {
      let originalClassNamesValue = null
      let start = null
      let end = null

      if (argument === null) {
        originalClassNamesValue = getNodeValue(node)
        const range = getNodeRange(node)
        if (node.type === 'TextAttribute') {
          start = range[0]
          end = range[1]
        }
        else {
          start = range[0] + 1
          end = range[1] - 1
        }
      }
      else {
        switch (argument.type) {
          case 'ObjectExpression':
            argument.properties.forEach((property) => {
              const isVue = node.key && node.key.type === 'VDirectiveKey'
              const propertyValue = isVue ? property.key : property.value

              handleNodeArgument(node, propertyValue)
            })
            break
          case 'Literal':
            originalClassNamesValue = argument.value
            start = argument.range[0] + 1
            end = argument.range[1] - 1
            break
          case 'Property':
            handleNodeArgument(node, argument.key)
            break
          default:
            break
        }
      }

      if (originalClassNamesValue === null)
        return

      const classListNoWhitespace = removeWhitespace(originalClassNamesValue)

      if (originalClassNamesValue !== classListNoWhitespace) {
        context.report({
          node,
          messageId,
          fix: fixer => fixer.replaceTextRange([start, end], `${classListNoWhitespace}`),
        })
      }
    }

    const scriptVisitor = {
      CallExpression(node) {
        const customCallees = ['clsx']

        if (!customCallees.includes(node.callee.name))
          return

        node.arguments.forEach((argument) => {
          handleNodeArgument(node, argument, 'excessive-whitespace-in-custom-callee')
        })
      },
    }

    const templateVisitor = {
      VAttribute(node) {
        switch (true) {
          case node.value && node.value.type === 'VLiteral':
            handleNodeArgument(node, null)
            break
          case node.value && node.value.type === 'VExpressionContainer':
            if (!node.value.expression)
              break

            if (node.value.expression.type === 'ObjectExpression') {
              for (const property of node.value.expression.properties) {
                handleNodeArgument(node, property)
              }
            }
            break
          default:
            break
        }
      },
    }

    return defineTemplateBodyVisitor(context, templateVisitor, scriptVisitor)
  },
}
