import { UseControllerProps, useFormContext } from 'react-hook-form'

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar, CalendarProps } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type FieldValues = Record<string, any>
type ExtendedProps = {
  label?: string
  required?: boolean
  disabledFuture?: boolean
}

interface TextFieldFormProps<T extends FieldValues> extends UseControllerProps<T> {
  fieldProps: CalendarProps
  extendedProps?: ExtendedProps
}

export function DatePickerForm<T extends FieldValues>(props: TextFieldFormProps<T>) {
  const { name, fieldProps, extendedProps } = props
  const { label, required, disabledFuture } = extendedProps || {}

  //React Hook Form Context
  const {
    control,
    formState: { errors },
    getValues
  } = useFormContext()

  const labelText = label ? `${label}${required ? ' *' : ''}` : null

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const value = field.value ? (typeof field.value === 'string' ? new Date(field.value) : field.value) : undefined

        return (
          <FormItem>
            <FormLabel>{labelText}</FormLabel>
            <Popover modal>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                    {field.value ? format(new Date(field.value), 'PPP') : <span>Pick a date</span>}
                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  {...fieldProps}
                  mode={fieldProps.mode as any}
                  defaultMonth={value}
                  selected={value}
                  onSelect={field.onChange}
                  disabled={disabledFuture ? (date) => date > new Date() || date < new Date('1900-01-01') : false}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
