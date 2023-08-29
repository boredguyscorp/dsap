import { UseControllerProps, useFormContext } from 'react-hook-form'

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input, InputProps } from '@/components/ui/input'

type FieldValues = Record<string, any>
type ExtendedProps = {
  label?: string
}

interface TextFieldFormProps<T extends FieldValues> extends UseControllerProps<T> {
  fieldProps?: InputProps
  extendedProps?: ExtendedProps
}

export function InputFieldForm<T extends FieldValues>(props: TextFieldFormProps<T>) {
  const { name, fieldProps, extendedProps } = props
  const { label } = extendedProps || {}

  //React Hook Form Context
  const {
    control,
    formState: { errors },
    getValues
  } = useFormContext()

  const labelText = label ? `${label}${fieldProps?.required ? ' *' : ''}` : null

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel className='w-52'>{labelText}</FormLabel>
            <FormControl>
              <Input {...field} {...fieldProps} value={getValues(name)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
