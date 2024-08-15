import path from 'node:path'

export function defineTemplateBodyVisitor(
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
