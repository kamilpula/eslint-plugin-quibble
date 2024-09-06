import { nodeParser, ruleMetaData, stringManipulation, templateProcessor, vueNodeParser } from '../utils/index.js'

const { defineTemplateBodyVisitor } = templateProcessor()
const { getDocsUrl } = ruleMetaData()
const { getNodeValue, getNodeRange, isNodeClassAttribute, isNodeLiteralAttributeValue } = nodeParser()
const { removeWhitespace } = stringManipulation()
const { isVLiteral, isVueObjectExpression, isVueArrayExpression, isVueClassAttribute } = vueNodeParser()

export default {
  meta: {
    name: 'no-excessive-whitespace',
    type: 'layout',
    fixable: 'code',
    docs: {
      description: 'Find excessive whitespace characters in class attribute in Vue templates.',
      recommended: true,
      category: 'Stylistic Issues',
      url: getDocsUrl('no-excessive-whitespace'),
    },
    messages: {
      'excessive-whitespace-in-class-attribute': 'The `class` attribute should not contain excessive whitespace.',
      'excessive-whitespace-in-class-callee': 'A class callee definition should not contain excessive whitespace',
    },
    schema: [
      {
        type: 'object',
        properties: {
          callees: {
            type: 'array',
            items: {
              type: 'string',
              minLength: 0,
              uniqueItems: true,
            },
          },
          classRegex: {
            type: 'string',
          },
        },
      },
    ],
  },

  create(context) {
    // Parse options
    const options = context.options[0]

    const DEFAULT_CALLEES = ['classnames', 'clsx', 'ctl', 'cva', 'tv']
    const DEFAULT_CLASS_REGEX = '^class(Name)?$'

    const callees = options && options.callees ? options.callees : DEFAULT_CALLEES
    const classRegex = options && options.classRegex ? options.classRegex : DEFAULT_CLASS_REGEX

    // Method of crawling into nodes adapted from https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/lib/rules/classnames-order.js#L95
    /**
     * Recursive function that crawls into the node and its children to find the class attribute value.
     * @param {ASTNode} node The node to crawl into.
     * @param {ASTNode} argument The argument to check for excessive whitespace.
     * @param {string} messageId The messageId to report if excessive whitespace is found.
     *
     * @returns {void}
     */
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
          case 'Identifier':
            return
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

      if (!originalClassNamesValue || originalClassNamesValue.length <= 1 || typeof originalClassNamesValue !== 'string')
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

    /**
     * CallExpression visitor used in both script and template visitors.
     *
     * @param {ASTNode} node The node to check for excessive whitespace.
     *
     * @returns {void}
     */
    function callExpressionVisitor(node) {
      if (!callees.includes(node.callee.name))
        return

      node.arguments.forEach((argument) => {
        handleNodeArgument(node, argument, 'excessive-whitespace-in-class-callee')
      })
    }

    function attributeVisitor(node) {
      if (!isNodeClassAttribute(node, classRegex))
        return

      if (isNodeLiteralAttributeValue(node))
        handleNodeArgument(node)

      else if (node.value && node.value.type === 'JSXExpressionContainer')
        handleNodeArgument(node, node.value.expression)
    }

    const scriptVisitor = {
      CallExpression: callExpressionVisitor,
      JSXAttribute: attributeVisitor,
      TextAttribute: attributeVisitor,
    }

    const templateVisitor = {
      CallExpression: callExpressionVisitor,
      VAttribute(node) {
        if (!isVueClassAttribute(node, classRegex))
          return

        switch (true) {
          case isVLiteral(node):
            handleNodeArgument(node)
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
