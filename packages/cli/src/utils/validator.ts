import joi, { Root, ObjectSchema } from 'joi'

type CreateFn<T = any> = (joi: Root) => ObjectSchema<T>

export function createSchema<T = any>(fn: CreateFn<T>): ObjectSchema<T> {
  let schema = fn(joi)
  if (typeof schema === 'object' && typeof schema.validate !== 'function') {
    schema = joi.object(schema)
  }
  return schema
}

type ValidateCb = (message: string) => void

export function validate(
  obj: Record<string, any>,
  schema: ObjectSchema,
  cb: ValidateCb
): void {
  const { error } = schema.validate(obj)
  if (error) {
    cb(error.details[0].message)
    process.exit(1)
  }
}
