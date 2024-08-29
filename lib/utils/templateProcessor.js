'use strict'

/**
 * Contains utils for working with templates.
 *
 * @returns {object} - An object with utility functions for working with templates.
 */
export function templateProcessor() {
  /**
   * Register the given visitor to parser services, in accordance to different eslint parsers such as `vue-eslint-parser`.
   *
   * @param {RuleContext} context The rule context to use parser services.
   * @param {TemplateListener} templateBodyVisitor The visitor to traverse the template body.
   * @param {ScriptListener} scriptBodyVisitor The visitor to traverse the script body.
   *
   * @returns {RuleListener | ScriptListener} The merged visitor.
   */
  function defineTemplateBodyVisitor(
    context,
    templateBodyVisitor,
    scriptVisitor,
  ) {
    const sourceCode = context.getSourceCode()
    const parserServices = sourceCode ? sourceCode.parserServices : context.parserServices

    if (parserServices === null || parserServices.defineTemplateBodyVisitor == null) {
      return scriptVisitor
    }

    return parserServices.defineTemplateBodyVisitor(
      templateBodyVisitor,
      scriptVisitor,
    )
  }

  return {
    defineTemplateBodyVisitor,
  }
}
