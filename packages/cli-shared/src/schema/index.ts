import joi, { Root, ObjectSchema } from 'joi'

type ICreateFn<T = any> = (joi: Root) => ObjectSchema<T>

export type IConfigSchema<T = any> = ObjectSchema<T>

export function createSchema<T = any>(fn: ICreateFn<T>): ObjectSchema<T> {
  let schema = fn(joi)
  if (typeof schema === 'object' && typeof schema.validate !== 'function') {
    schema = joi.object(schema)
  }
  return schema
}

export type IValidateCb = (message: string) => void

export function validateSchema<T = Record<string, any>>(
  obj: T,
  schema: ObjectSchema<T>,
  cb: IValidateCb
): void {
  const { error } = schema.validate(obj)
  if (error) {
    cb(error.details[0].message)
    process.exit(1)
  }
}

export type IConfigSchemaValidator<T = any> = (obj: T, cb: IValidateCb) => void
