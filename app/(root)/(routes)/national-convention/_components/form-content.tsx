import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'

import { InputFieldForm } from '../../../../../components/forms/InputFieldForm'
import { CalendarIcon, Check, ChevronDownIcon, ChevronsUpDown, LucideIcon, MapPin } from 'lucide-react'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import React, { useMemo, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  CURRENT_CONVENTION,
  CURRENT_DATE,
  conventions,
  delegateClassList,
  nonPharmacistTypeEnum
} from '@/app/(app.domain.com)/dashboard/convention/_components/constant'
import { ConventionRegistrationForm, title } from '@/lib/schema'
import { useFormContext } from 'react-hook-form'
import { Separator } from '@/components/ui/separator'
import { ChapterList } from '@/actions/fetchers'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useParams } from 'next/navigation'
import { DatePickerForm } from '@/components/forms/DatePickerForm'
import Balancer from 'react-wrap-balancer'

type NationalConventionFormProps = {
  chapters: ChapterList
  showAllFees?: boolean
}

export function RegistrationFormInputs({ chapters, showAllFees }: NationalConventionFormProps) {
  const params = useParams() as { code: string }

  const conventionCode = useMemo(() => params.code ?? CURRENT_CONVENTION, [params.code])

  const convention = useMemo(() => conventions.find((row) => row.code === conventionCode), [conventionCode])
  const cutOffDate = convention?.preRegCutOff ?? '2025-01-28'
  const isPreReg = cutOffDate > CURRENT_DATE

  const [openChapter, setOpenChapter] = useState<boolean>(false)

  const {
    reset,
    setError,
    clearErrors,
    formState: { errors },
    getValues,
    watch,
    setValue,
    trigger,
    control
  } = useFormContext<ConventionRegistrationForm>()

  const onContactChange = (event: any) => {
    let val = event.target.value
    val = val.replace(/ /gm, '')

    let num = `${val.substring(0, 4)} ${val.substring(4, 7)} ${val.substring(7, val.length)}`

    num = num.trim()

    setValue('contactNo', num)
    clearErrors('contactNo')
  }

  const onKeyPressNumber = (event: any) => {
    if (!/[0-9+]/.test(event.key)) {
      event.preventDefault()
    }
  }

  return (
    <div className='space-y-5'>
      <RadioGroupForm
        name='type'
        options={convention?.rate.filter((r) => {
          return showAllFees ? true : r.preReg === isPreReg
        })}
        formItemClass='h-[130px]'
      />

      <div className='space-y-2'>
        <Label>Personal Information</Label>
        <RadioGroupForm name='regDelegate.delegateClass' options={delegateClassList} formItemClass='h-[60px]' />

        {watch('regDelegate.delegateClass') === 'Non-Pharmacist' ? (
          <RadioGroupForm
            name='regDelegate.title'
            options={title.map((t) => {
              return { label: t, value: t }
            })}
          />
        ) : null}

        {watch('regDelegate.delegateClass') === 'Pharmacist' ? (
          <>
            <RadioGroupForm
              name='regDelegate.regPharmacistMembership.memberType'
              options={nonPharmacistTypeEnum.map((t) => {
                return { label: t, value: t }
              })}
            />

            {/* <FormField
              control={control}
              name='regDelegate.regPharmacistMembership.memberType'
              render={({ field, formState }) => (
                <FormItem>
                  {formState.errors && <FormMessage className={cn('text-destructive')} />}

                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                    className='flex items-center space-x-2'
                  >
                    {nonPharmacistTypeEnum.map((value) => {
                      return (
                        <FormItem key={value} className='flex items-center space-x-3 space-y-0'>
                          <React.Fragment key={value}>
                            <FormControl>
                              <RadioGroupItem value={value} />
                            </FormControl>
                            <FormLabel className={cn('cursor-pointer font-normal', value === field.value && 'font-semibold')}>
                              {value}
                            </FormLabel>
                          </React.Fragment>
                        </FormItem>
                      )
                    })}
                  </RadioGroup>
                </FormItem>
              )}
            /> */}

            <>
              <div className='grid sm:grid-cols-2 sm:gap-2'>
                <InputFieldForm
                  control={control}
                  name='regDelegate.regPharmacistMembership.cphadIdNo'
                  fieldProps={{
                    placeholder: 'CPhAD ID No.',
                    required: watch('regDelegate.regPharmacistMembership.memberType') === 'CPhAD Member',
                    disabled: watch('regDelegate.regPharmacistMembership.memberType') !== 'CPhAD Member'
                  }}
                />

                <InputFieldForm
                  control={control}
                  name='regDelegate.regPharmacistMembership.prcLicenseNo'
                  fieldProps={{ placeholder: 'PRC License No.', required: true }}
                />
              </div>

              <div className='grid gap-2 sm:grid-cols-2'>
                <DatePickerForm
                  control={control}
                  name='regDelegate.regPharmacistMembership.dateIssued'
                  fieldProps={{ mode: 'single', fromYear: 2010, toYear: new Date().getFullYear(), captionLayout: 'dropdown-buttons' }}
                  extendedProps={{ disabledFuture: true, buttonClassName: '!mt-0', placeholder: 'Date Issued' }}
                />

                <DatePickerForm
                  control={control}
                  name='regDelegate.regPharmacistMembership.expiryDate'
                  fieldProps={{ mode: 'single', fromYear: 2010, toYear: 2030, captionLayout: 'dropdown-buttons' }}
                  extendedProps={{ buttonClassName: '!mt-0', placeholder: 'Expiry Date' }}
                />
              </div>
            </>
          </>
        ) : null}
        <InputFieldForm control={control} name='firstName' fieldProps={{ placeholder: 'First Name', required: true }} />
        <InputFieldForm control={control} name='middleName' fieldProps={{ placeholder: 'Middle Name' }} />
        <InputFieldForm control={control} name='lastName' fieldProps={{ placeholder: 'Last Name', required: true }} />
        <div className='!mt-0 grid sm:grid-cols-2 sm:gap-2'>
          <InputFieldForm
            control={control}
            name='contactNo'
            fieldProps={{
              placeholder: 'Contact No.',
              required: true,
              onChange: onContactChange,
              onKeyPress: onKeyPressNumber,
              maxLength: watch('contactNo')?.includes('+') ? 15 : 13
            }}
          />

          <InputFieldForm control={control} name='emailAdd' fieldProps={{ placeholder: 'Email Address', required: true, type: 'email' }} />
        </div>
      </div>

      <Separator />
      <div className='sm:space-y-2'>
        <Label>Address</Label>
        <div className='grid sm:grid-cols-2 sm:gap-2'>
          <InputFieldForm control={control} name='address.street' fieldProps={{ placeholder: 'No./Street' }} />
          <InputFieldForm control={control} name='address.brgy' fieldProps={{ placeholder: 'Barangay' }} />
        </div>

        <div className='grid sm:grid-cols-2 sm:gap-2'>
          <InputFieldForm control={control} name='address.city' fieldProps={{ placeholder: 'City' }} />
          <InputFieldForm control={control} name='address.province' fieldProps={{ placeholder: 'Province' }} />
        </div>
      </div>

      <Separator />
      <div className='sm:space-y-2'>
        <Label>Drugstore Information</Label>

        <div className='grid sm:grid-cols-2 sm:gap-2'>
          <InputFieldForm control={control} name='drugstoreInfo.establishment' fieldProps={{ placeholder: 'Establishment Represented' }} />

          <FormField
            control={control}
            name='drugstoreInfo.chapter'
            render={({ field }) => {
              return (
                <Popover open={openChapter} onOpenChange={setOpenChapter} modal={true}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        role='combobox'
                        className={cn('mt-2 w-full justify-between', !field.value && 'text-muted-foreground')}
                      >
                        {field.value ? chapters.find((chapter) => chapter.name === field.value)?.name : 'Select chapter'}
                        <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent align='start' className='z-50  w-full min-w-[var(--radix-popover-trigger-width)]  p-0'>
                    <ScrollArea className='flex max-h-[350px] flex-col' type='always'>
                      <Command>
                        <CommandInput placeholder='Search chapter...' />
                        <CommandEmpty>No chapter found.</CommandEmpty>
                        <CommandGroup>
                          {chapters.map((chapter) => (
                            <CommandItem
                              value={chapter.name}
                              key={chapter.name}
                              onSelect={() => {
                                setValue('drugstoreInfo.chapter', chapter.name)
                                setOpenChapter(false)
                              }}
                            >
                              <Check className={cn('mr-2 h-4 w-4', chapter.name === field.value ? 'opacity-100' : 'opacity-0')} />
                              {chapter.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
              )
            }}
          />
        </div>

        <div className='grid sm:grid-cols-2 sm:gap-2'>
          <InputFieldForm control={control} name='drugstoreInfo.owner' fieldProps={{ placeholder: 'Owner of Drugstore/Establishment' }} />
          <InputFieldForm control={control} name='drugstoreInfo.mainAddress' fieldProps={{ placeholder: 'Main Address' }} />
        </div>
      </div>
    </div>
  )
}

type RadioGroupOption = { value: string; label: string; icon?: LucideIcon } & Record<string, any>
type RadioGroupFormProps = {
  options: RadioGroupOption[] | undefined
  name: string
  formItemClass?: string
}

function RadioGroupForm({ options, name, formItemClass }: RadioGroupFormProps) {
  const {
    reset,
    setError,
    clearErrors,
    formState: { errors },
    getValues,
    watch,
    setValue,
    trigger,
    control
  } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className=' space-y-3'>
          {/* <FormLabel>Ownership Type</FormLabel> */}
          <FormControl>
            <ScrollArea>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-row items-center '>
                {options?.map((item) => {
                  return (
                    <FormItem key={item.value} className={cn('flex w-full flex-col  space-x-3 space-y-0 md:h-full', formItemClass)}>
                      <FormControl>
                        <Label
                          htmlFor={item.value}
                          className=' flex h-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-4 text-center leading-5 hover:bg-accent hover:text-accent-foreground md:flex-row  [&:has([data-state=checked])]:border-teal-600'
                        >
                          <RadioGroupItem value={item.value} id={item.value} className='sr-only leading-10 ' />
                          {item.icon && (
                            <div className={cn('size-10 rounded-full ', field.value === item.value && 'bg-teal-600 text-white')}>
                              <item.icon className={cn('h-full w-full p-[10px] ')} />
                            </div>
                          )}
                          {/* <Balancer>{item.label}</Balancer> */}
                          {item.label}
                        </Label>
                      </FormControl>
                    </FormItem>
                  )
                })}
              </RadioGroup>
              <ScrollBar orientation='horizontal' />
            </ScrollArea>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
