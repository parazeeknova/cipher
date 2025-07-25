import antfu from '@antfu/eslint-config'

export default antfu({
  nextjs: true,
  typescript: true,
  ignores: ['.next/**', 'src/shadcn/**', 'drizzle/**'],
})
