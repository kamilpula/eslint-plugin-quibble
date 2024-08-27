'use strict'

import path from 'node:path'

/**
 * Contains utils for working with templates.
 *
 * @returns {object} - An object with utility functions for working with templates.
 */
export function templateProcessor() {
  /**
   * Register the given visitor to parser services.
   * If the parser service of `vue-eslint-parser` was not found,
   * this generates a warning.
   *
   * @author https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/utils/index.js#L2262
   *
   * @param {RuleContext} context The rule context to use parser services.
   * @param {TemplateListener} templateBodyVisitor The visitor to traverse the template body.
   * @param {RuleListener} [scriptVisitor] The visitor to traverse the script.
   * @param { { templateBodyTriggerSelector: "Program" | "Program:exit" } } [options] The options.
   * @returns {RuleListener} The merged visitor.
   */
  function defineTemplateBodyVisitor(
    context,
    templateBodyVisitor,
    scriptVisitor,
    options,
  ) {
    const sourceCode = context.getSourceCode()

    if (sourceCode.parserServices.defineTemplateBodyVisitor == null) {
      const filename = context.getFilename()
      if (path.extname(filename) === '.vue') {
        context.report({
          loc: { line: 1, column: 0 },
          message:
            'Use the latest vue-eslint-parser. See also https://eslint.vuejs.org/user-guide/#what-is-the-use-the-latest-vue-eslint-parser-error.',
        })
      }

      return {}
    }

    return sourceCode.parserServices.defineTemplateBodyVisitor(
      templateBodyVisitor,
      scriptVisitor,
      options,
    )
  }

  return {
    defineTemplateBodyVisitor,
  }
}
