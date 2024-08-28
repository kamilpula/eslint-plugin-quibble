export function vueNodeParser() {
  /**
   * Checks if the node is a VLiteral node.
   * @param {ASTNode} node - The node to check.
   *
   * @returns {boolean} - True if the node is a VLiteral node, false otherwise.
   */
  function isVLiteral(node) {
    return node.value && node.value.type === 'VLiteral'
  }

  /**
   * Checks if the node is a VExpressionContainer node.
   * @param {ASTNode} node - The node to check.
   *
   * @returns {boolean} - True if the node is a VExpressionContainer node, false otherwise.
   */
  function isVExpressionContainer(node) {
    return node.value && node.value.type === 'VExpressionContainer'
  }

  /**
   * Checks if the node is a Vue ObjectExpression node.
   * @param {ASTNode} node - The node to check.
   *
   * @returns {boolean} - True if the node is a Vue ObjectExpression node, false otherwise.
   *
   */
  function isVueObjectExpression(node) {
    return isVExpressionContainer(node) && node.value.expression && node.value.expression.type === 'ObjectExpression'
  }

  /**
   * Checks if the node is a Vue ArrayExpression node.
   * @param {ASTNode} node - The node to check.
   *
   * @returns {boolean} - True if the node is a Vue ArrayExpression node, false otherwise.
   *
   */
  function isVueArrayExpression(node) {
    return isVExpressionContainer(node) && node.value.expression && node.value.expression.type === 'ArrayExpression'
  }

  /**
   * Checks if the node is a Vue class attribute.
   * @param {ASTNode} node - The node to check.
   * @param {string} classRegex - The regex to match the class attribute.
   *
   * @returns {boolean} - True if the node is a Vue class attribute, false otherwise.
   */
  function isVueClassAttribute(node, classRegex) {
    const re = new RegExp(classRegex)

    // Check literal class definiton
    if (node.key && node.key.name && re.test(node.key.name)) {
      return true
    }

    // Check v-bind:class && :class definitions
    if (node.key && node.key.name && node.key.name.name && node.key.argument && node.key.argument.name
      && /^bind$/.test(node.key.name.name)
      && re.test(node.key.argument.name)) {
      return true
    }

    return false
  }

  return {
    isVLiteral,
    isVExpressionContainer,
    isVueObjectExpression,
    isVueArrayExpression,
    isVueClassAttribute,
  }
}
