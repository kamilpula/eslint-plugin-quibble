import { defineTemplateBodyVisitor, docsUrl } from '../utils/index.js'

/**
 * Removes excessive whitespace from a class list string.
 *
 * @param {string} classList - The class list string to process.
 * @returns {string | void} - The class list string without excessive whitespace.
 */
function removeWhitespace(classList) {
  if (!classList)
    return

  const classListWithWhitespace = classList.split(/(\s+)/)
  const divider = ' '

  const classListNoWhitespace = classListWithWhitespace.filter(
    className => className.trim() !== '',
  ).join(divider)

  return classListNoWhitespace
}

/**
 * Handles an object expression by removing excessive whitespace from class list properties.
 *
 * @param {object} context - The context object provided by the linter.
 * @param {ObjectExpression} expression - The object expression node to process.
 */
function handleObjectExpression(context, expression) {
  const properties = expression.properties

  for (const property of properties) {
    const classList = property.key.value
    const classListNoWhitespace = removeWhitespace(classList)

    if (classList !== classListNoWhitespace) {
      context.report({
        node: property.key,
        loc: property.key.loc,
        messageId: 'excessive-whitespace-in-class-object-expression',
        fix: fixer => fixer.replaceText(property.key, `'${classListNoWhitespace}'`),
      })
    }
  }
}

/**
 * Handles a conditional expression by removing excessive whitespace from class list literals.
 *
 * @param {object} context - The context object provided by the linter.
 * @param {ConditionalExpression} expression - The conditional expression node to process.
 */
function handleConditionalExpression(context, expression) {
  const consequent = expression.consequent
  const alternate = expression.alternate

  if (consequent.type === 'Literal') {
    const classList = consequent.value
    const classListNoWhitespace = removeWhitespace(classList)

    if (classList !== classListNoWhitespace) {
      context.report({
        node: consequent,
        loc: consequent.loc,
        messageId: 'excessive-whitespace-in-class-array-expression',
        fix: fixer => fixer.replaceText(consequent, `'${classListNoWhitespace}'`),
      })
    }
  }

  if (alternate.type === 'Literal') {
    const classList = alternate.value
    const classListNoWhitespace = removeWhitespace(classList)

    if (classList !== classListNoWhitespace) {
      context.report({
        node: alternate,
        loc: alternate.loc,
        messageId: 'excessive-whitespace-in-class-array-expression',
        fix: fixer => fixer.replaceText(alternate, `'${classListNoWhitespace}'`),
      })
    }
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
      'excessive-whitespace-in-static-class': 'Static `class` attribute should not contain excessive whitespace.',
      'excessive-whitespace-in-class-object-expression': 'Object expression for the `class` attribute should not contain excessive whitespace.',
      'excessive-whitespace-in-class-array-expression': 'Array expression for the `class` attribute should not contain excessive whitespace.',
    },
    schema: [],
  },

  create(context) {
    function handleStaticClassAttribute(node) {
      const value = node.value
      if (!value)
        return

      const classList = value.value
      const classListNoWhitespace = removeWhitespace(classList)

      if (classList !== classListNoWhitespace) {
        context.report({
          node,
          loc: node.loc,
          messageId: 'excessive-whitespace-in-static-class',
          fix: fixer => fixer.replaceText(value, `"${classListNoWhitespace}"`),
        })
      }
    }

    function handleClassObjectExpression(node) {
      const attributeNode = node.value
      if (!attributeNode)
        return

      handleObjectExpression(context, attributeNode.expression)
    }

    function handleClassArrayExpression(node) {
      const attributeNode = node.value
      if (!attributeNode)
        return

      const arrayExpressionElements = attributeNode.expression.elements
      const arrayObjectExpressionElements = arrayExpressionElements.filter(
        arrayExpressionElement => arrayExpressionElement.type === 'ObjectExpression',
      )

      for (const arrayObjectExpressionElement of arrayObjectExpressionElements)
        handleObjectExpression(context, arrayObjectExpressionElement)

      const arrayConditionalExpressionElements = arrayExpressionElements.filter(
        arrayExpressionElement => arrayExpressionElement.type === 'ConditionalExpression',
      )

      for (const arrayConditionalExpressionElement of arrayConditionalExpressionElements)
        handleConditionalExpression(context, arrayConditionalExpressionElement)
    }

    const templateVisitor = {
      'VAttribute[directive=false][key.name=\'class\']': function (node) {
        handleStaticClassAttribute(node)
      },
      'VAttribute[directive=true][key.argument.name="class"][value.expression.type="ObjectExpression"]': function (node) {
        handleClassObjectExpression(node)
      },
      'VAttribute[directive=true][key.argument.name="class"][value.expression.type="ArrayExpression"]': function (node) {
        handleClassArrayExpression(node)
      },
    }

    return defineTemplateBodyVisitor(context, templateVisitor)
  },
}
