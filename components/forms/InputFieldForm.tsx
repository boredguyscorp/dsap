import { UseControllerProps, useFormContext } from 'react-hook-form'

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input, InputProps } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type FieldValues = Record<string, any>
type ExtendedProps = {
  label?: string
  labelClassName?: string
  errorMessageClassName?: string
  description?: string
  style?: 'default' | 'classic'
  formItemClassName?: string
}

interface TextFieldFormProps<T extends FieldValues> extends UseControllerProps<T> {
  fieldProps?: InputProps
  extendedProps?: ExtendedProps
}

export function InputFieldForm<T extends FieldValues>(props: TextFieldFormProps<T>) {
  const { name, fieldProps, extendedProps } = props
  const { label, style = 'default', formItemClassName } = extendedProps || {}

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
          <FormItem className={cn('', formItemClassName)}>
            <FormLabel className={cn('w-52', extendedProps?.labelClassName)}>{labelText}</FormLabel>
            <FormControl className={cn('', style === 'classic' && 'border-b')}>
              <div className='relative w-full'>
                <Input
                  {...field}
                  {...fieldProps}
                  required={undefined}
                  value={getValues(name)}
                  className={cn('', style === 'classic' && 'border-none', fieldProps?.className)}
                />
                {fieldProps?.required && <p className='absolute right-1 top-0 text-lg font-bold text-teal-500'> * </p>}
              </div>
            </FormControl>
            {extendedProps?.description ? <FormDescription className='text-xs'>{extendedProps.description}</FormDescription> : null}
            <FormMessage className={cn(extendedProps?.errorMessageClassName)} />
          </FormItem>
        )
      }}
    />
  )
}
