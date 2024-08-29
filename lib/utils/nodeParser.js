'use strict'

/**
 * Contains utils for working with general nodes.
 *
 * @returns {object} - An object with utility functions for working with nodes.
 */
export function nodeParser() {
  /**
   * Gets the value of a node.
   *
   * @param {ASTNode} node - The node to get the value from.
   * @returns {string | Array | object} - The value of the node.
   */
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

  /**
   * Gets the range property of a node.
   *
   * @param {ASTNode} node - The node to get the range from.
   * @returns {Array} - The range of the node.
   */
  function getNodeRange(node) {
    if (node.type === 'TextAttribute' && node.name === 'class')
      return [node.valueSpan.fullStart.offset, node.valueSpan.end.offset]

    if (node.value === undefined)
      return [0, 0]

    switch (node.value.type) {
      case 'JSXExpressionContainer':
        return node.value.expression.range
      default:
        return node.value.range
    }
  }

  /**
   * Checks if the node is a class attribute.
   * @param {ASTNode} node - The node to check.
   * @param {string} classRegex - The regex to match the class attribute.
   *
   * @returns {boolean} - True if the node is a class attribute, false otherwise.
   */
  function isNodeClassAttribute(node, classRegex) {
    if (!node.name)
      return false

    let name = ''
    switch (node.type) {
      case 'TextAttribute':
        name = node.name
        break
      case 'JSXAttribute':
        if (node.name.type === 'JSXNamespacedName') {
          const namespace = node.name.namespace.name || ''
          name = (namespace.length ? `${namespace}:` : '') + node.name.name.name
        }
        else {
          name = node.name.name
        }
        break
      default:
        name = node.name.name
        break
    }

    return new RegExp(classRegex).test(name)
  }

  /**
   * Checks if the node is a literal attribute value.
   *
   * @param {ASTNode} node - The node to check.
   *
   * @returns {boolean} - True if the node is a literal attribute value, false otherwise.
   */
  function isNodeLiteralAttributeValue(node) {
    if (node.type === 'TextAttribute' && node.name === 'class' && typeof node.value === 'string')
      return true

    if (node.value) {
      switch (node.value.type) {
        case 'Literal':
          return !/[{?}]/.test(node.value.value)
        case 'JSXExpressionContainer':
          return node.value.expression.type === 'Literal'
      }
    }
    return false
  }

  return {
    getNodeValue,
    getNodeRange,
    isNodeClassAttribute,
    isNodeLiteralAttributeValue,
  }
}
