import joi, { Root, ObjectSchema } from 'joi'

type CreateFn<T = any> = (joi: Root) => ObjectSchema<T>

export function createSchema<T = any>(fn: CreateFn<T>): ObjectSchema<T> {
  let schema = fn(joi)
  if (typeof schema === 'object' && typeof schema.validate !== 'function') {
    schema = joi.object(schema)
  }
  return schema
}

export type ValidateCb = (message: string) => void

export function validate<T = Record<string, any>>(
  obj: T,
  schema: ObjectSchema<T>,
  cb: ValidateCb
): void {
  const { error } = schema.validate(obj)
  if (error) {
    cb(error.details[0].message)
    process.exit(1)
  }
}

export type ConfigValidator = {
  [key: string]: ObjectSchema
}
