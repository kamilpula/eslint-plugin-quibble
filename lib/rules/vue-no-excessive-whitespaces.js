import { defineTemplateBodyVisitor } from '../utils/index.js'

export const meta = {
  name: 'vue-no-excessive-whitespaces',
  type: 'layout',
  fixable: 'whitespace',
  docs: {
    description: 'Find excessive whitespaces in vue classes',
    recommended: false,
  },
  messages: {
    'excessive-whitespaces-in-static-class': 'Static `class` attribute should not contain excessive whitespaces.',
    'excessive-whitespaces-in-class-object': 'Object expression for the `class` attribute should not contain excessive whitespaces.',
    'excessive-whitespaces-in-class-array': 'Array expression for the `class` attribute should not contain excessive whitespaces.',
  },
  schema: [],
}

function removeWhitespaces(classList) {
  if (!classList)
    return

  const classListWithWhitespace = classList.split(/(\s+)/)
  const divider = ' '

  const classListNoWhitespace = classListWithWhitespace.filter(
    className => className.trim() !== '',
  ).join(divider)

  return classListNoWhitespace
}

function handleObjectExpression(context, expression) {
  const properties = expression.properties

  for (const property of properties) {
    const classList = property.key.value
    const classListNoWhitespace = removeWhitespaces(classList)

    if (classList !== classListNoWhitespace) {
      context.report({
        node: property.key,
        loc: property.key.loc,
        messageId: 'excessive-whitespaces-in-class-object',
        fix: fixer => fixer.replaceText(property.key, `'${classListNoWhitespace}'`),
      })
    }
  }
}

function handleConditionalExpression(context, expression) {
  const consequent = expression.consequent
  const alternate = expression.alternate

  if (consequent.type === 'Literal') {
    const classList = consequent.value
    const classListNoWhitespace = removeWhitespaces(classList)

    if (classList !== classListNoWhitespace) {
      context.report({
        node: consequent,
        loc: consequent.loc,
        messageId: 'excessive-whitespaces-in-class-array',
        fix: fixer => fixer.replaceText(consequent, `'${classListNoWhitespace}'`),
      })
    }
  }

  if (alternate.type === 'Literal') {
    const classList = alternate.value
    const classListNoWhitespace = removeWhitespaces(classList)

    if (classList !== classListNoWhitespace) {
      context.report({
        node: alternate,
        loc: alternate.loc,
        messageId: 'excessive-whitespaces-in-class-array',
        fix: fixer => fixer.replaceText(alternate, `'${classListNoWhitespace}'`),
      })
    }
  }
}

export function create(context) {
  return defineTemplateBodyVisitor(context, {
    /** @param {VAttribute} node */
    'VAttribute[directive=false][key.name=\'class\']': function (node) {
      const value = node.value
      if (!value)
        return

      const classList = value.value
      const classListNoWhitespace = removeWhitespaces(classList)

      if (classList !== classListNoWhitespace) {
        context.report({
          node,
          loc: node.loc,
          messageId: 'excessive-whitespaces-in-static-class',
          fix: fixer => fixer.replaceText(value, `"${classListNoWhitespace}"`),
        })
      }
    },
    'VAttribute[directive=true][key.argument.name="class"][value.expression.type="ObjectExpression"]': function (node) {
      const attributeNode = node.value
      if (!attributeNode)
        return

      handleObjectExpression(context, attributeNode.expression)
    },
    'VAttribute[directive=true][key.argument.name="class"][value.expression.type="ArrayExpression"]': function (node) {
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
    },
  })
}
