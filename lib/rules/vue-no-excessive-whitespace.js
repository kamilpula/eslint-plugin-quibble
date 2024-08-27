import { nodeParser, ruleMetaData, stringManipulation, templateProcessor, vueNodeParser } from '../utils/index.js'

const { defineTemplateBodyVisitor } = templateProcessor()
const { getDocsUrl } = ruleMetaData()
const { getNodeValue, getNodeRange } = nodeParser()
const { removeWhitespace } = stringManipulation()
const { isVLiteral, isVueObjectExpression, isVueArrayExpression, isVueClassAttribute } = vueNodeParser()

export default {
  meta: {
    name: 'vue-no-excessive-whitespace',
    type: 'layout',
    fixable: 'code',
    docs: {
      description: 'Find excessive whitespace characters in class attribute in Vue templates.',
      recommended: true,
      category: 'Stylistic Issues',
      url: getDocsUrl('vue-no-excessive-whitespace'),
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
          case 'ArrayExpression':
            argument.elements.forEach((element) => {
              handleNodeArgument(node, element)
            })
            return
          case 'ConditionalExpression':
            handleNodeArgument(node, argument.consequent)
            handleNodeArgument(node, argument.alternate)
            return
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

    function callExpressionVisitor(node) {
      const customCallees = ['clsx']

      if (!customCallees.includes(node.callee.name))
        return

      node.arguments.forEach((argument) => {
        handleNodeArgument(node, argument, 'excessive-whitespace-in-custom-callee')
      })
    }

    const scriptVisitor = {
      CallExpression: callExpressionVisitor,
    }

    const templateVisitor = {
      CallExpression: callExpressionVisitor,
      VAttribute(node) {
        if (!isVueClassAttribute(node, 'class'))
          return

        switch (true) {
          case isVLiteral(node):
            handleNodeArgument(node, null)
            break
          case isVueArrayExpression(node):
            for (const element of node.value.expression.elements) {
              handleNodeArgument(node, element)
            }
            break
          case isVueObjectExpression(node):
            for (const property of node.value.expression.properties) {
              handleNodeArgument(node, property)
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
