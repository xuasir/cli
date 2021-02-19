export async function loadModule<T = any>(
  modulePath: string
): Promise<[Error | null, T]> {
  let error: Error | null = null
  let moduleContent
  try {
    moduleContent = await import(modulePath)
  } catch (err) {
    error = err
  }
  return [error, moduleContent?.default || null]
}
