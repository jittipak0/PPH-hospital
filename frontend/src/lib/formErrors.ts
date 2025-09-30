import type { FieldPath, FieldValues, UseFormSetError } from 'react-hook-form'
import type { ValidationErrors } from './formsApi'

type FieldNameMap<FormValues extends FieldValues> = Partial<Record<string, FieldPath<FormValues>>>

export const applyServerValidationErrors = <FormValues extends FieldValues>(
  errors: ValidationErrors,
  setError: UseFormSetError<FormValues>,
  fieldNameMap: FieldNameMap<FormValues> = {}
) => {
  Object.entries(errors).forEach(([field, messages]) => {
    const [message] = messages

    if (!message) {
      return
    }

    const mappedField = (fieldNameMap[field] ?? field) as FieldPath<FormValues>
    setError(mappedField, { type: 'server', message })
  })
}
