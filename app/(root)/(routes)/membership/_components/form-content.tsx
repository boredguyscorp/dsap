import {
  ownershipType,
  membershipType,
  drugstoreClassType,
  dpSetup,
  dpLocation,
  dpStoreHours,
  dpInvSystem,
  opStatus
} from '@/app/(app.domain.com)/dashboard/membership/_components/membership'
import { FileUpload } from '@/components/editor/settings/file-upload'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form'
import { cn, toDate, toDateNormal, toProperCase } from '@/lib/utils'

import { watch } from 'fs'
import { ChevronDownIcon } from 'lucide-react'
import React from 'react'
import { DatePickerForm } from '../../../../../components/forms/DatePickerForm'
import { InputFieldForm } from '../../../../../components/forms/InputFieldForm'
import { TextAreaForm } from '../../../../../components/forms/TextAreaForm'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useFormContext } from 'react-hook-form'
import { STEPS } from './constant'
import { MemberRegistrationForm } from '@/lib/schema'
import { Label } from '@/components/ui/label'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

type StepProps = {
  activeStep: number
  setActiveStep: (step: number) => void
}

export function getFormStepContent(props: StepProps) {
  switch (props.activeStep) {
    case STEPS.GENERAL_INFO:
      return <GeneralInfo />
    case STEPS.DRUGSTORE_PROFILE:
      return <DrugstoreProfile />
    case STEPS.OWNER_PROFILE:
      return <OwnerProfile />
    case STEPS.REGISTRATION_DETAIL:
      return <RegistrationDetails />
    case STEPS.REVIEW_INFORMATION:
      return <ReviewInformation {...props} />
    default:
      return 'Unknown step'
  }
}

function GeneralInfo() {
  const { control } = useFormContext<MemberRegistrationForm>()

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
        <CardDescription className='mb-5'>
          {' '}
          Please fill up the form below. <span className='text-lg font-bold text-teal-500'> * </span> is required.
        </CardDescription>
      </CardHeader>
      <Separator />

      <CardContent className='mt-5'>
        <div className='space-y-4'>
          <InputFieldForm
            control={control}
            name='drugStoreName'
            fieldProps={{ placeholder: 'Drugstore Name', required: true }}
            extendedProps={{ label: 'Drugstore Name' }}
          />

          <TextAreaForm
            control={control}
            name='address'
            fieldProps={{ placeholder: 'Address', required: true }}
            extendedProps={{ label: 'Address' }}
          />

          <div className='grid grid-cols-3 gap-4'>
            <InputFieldForm
              control={control}
              name='emailAdd'
              fieldProps={{ placeholder: 'Email Address', required: true }}
              extendedProps={{ label: 'Email Address' }}
            />
            <InputFieldForm
              control={control}
              name='mobileNo'
              fieldProps={{ placeholder: 'Mobile No.', required: true }}
              extendedProps={{ label: 'Mobile No.' }}
            />
            <InputFieldForm
              control={control}
              name='telNo'
              fieldProps={{ placeholder: 'Telephone No.' }}
              extendedProps={{ label: 'Telephone No.' }}
            />
          </div>

          <div className='grid grid-cols-3 gap-4'>
            <FormField
              control={control}
              name='ownershipType'
              render={({ field }) => (
                <FormItem className='space-y-3'>
                  <FormLabel>Ownership Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      // onValueChange={(e) => {
                      //   field.onChange(e)
                      //   setValue('ownershipTypeDetails.type', e as Ownership)
                      // }}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className='flex flex-col space-y-1'
                    >
                      {ownershipType.map((row) => {
                        return (
                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <React.Fragment key={row.value}>
                              <FormControl>
                                <RadioGroupItem value={row.value} />
                              </FormControl>
                              <FormLabel className='font-normal'>{row.label}</FormLabel>
                            </React.Fragment>
                          </FormItem>
                        )
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name='membershipType'
              render={({ field }) => (
                <FormItem className='space-y-3'>
                  <FormLabel>Membership Type</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-col space-y-1'>
                      {membershipType.map((row) => {
                        return (
                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <React.Fragment key={row.value}>
                              <FormControl>
                                <RadioGroupItem value={row.value} />
                              </FormControl>
                              <FormLabel className='font-normal'>{row.label}</FormLabel>
                            </React.Fragment>
                          </FormItem>
                        )
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name='drugstoreClass'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Drugstore Classification</FormLabel>
                  <div className='relative w-full'>
                    <FormControl>
                      <select className={cn(buttonVariants({ variant: 'outline' }), 'w-full appearance-none bg-transparent')} {...field}>
                        {drugstoreClassType.map((row) => (
                          <option key={row.value} value={row.value}>
                            {row.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <ChevronDownIcon className='absolute right-3 top-2.5 h-4 w-4 opacity-50' />
                  </div>
                  <FormDescription>Select to classify your Drugstore.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function DrugstoreProfile() {
  const { control } = useFormContext<MemberRegistrationForm>()

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Drugstore Profile</CardTitle>
        <CardDescription className='mb-5'>
          {' '}
          Please fill up the form below. <span className='text-lg font-bold text-teal-500'> * </span> is required.
        </CardDescription>
      </CardHeader>
      <Separator />

      <CardContent className='mt-5'>
        <div className='space-y-4'>
          <div className='grid grid-cols-4 gap-4'>
            <FormField
              control={control}
              name='dpSetup'
              render={({ field }) => (
                <FormItem className='space-y-3'>
                  <FormLabel>Setup</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-col space-y-1'>
                      {dpSetup.map((row) => {
                        return (
                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <React.Fragment key={row.value}>
                              <FormControl>
                                <RadioGroupItem value={row.value} />
                              </FormControl>
                              <FormLabel className='font-normal'>{row.label}</FormLabel>
                            </React.Fragment>
                          </FormItem>
                        )
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name='dpLocation'
              render={({ field }) => (
                <FormItem className='space-y-3'>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-col space-y-1'>
                      {dpLocation.map((row) => {
                        return (
                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <React.Fragment key={row.value}>
                              <FormControl>
                                <RadioGroupItem value={row.value} />
                              </FormControl>
                              <FormLabel className='font-normal'>{row.label}</FormLabel>
                            </React.Fragment>
                          </FormItem>
                        )
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name='dpStoreHours'
              render={({ field }) => (
                <FormItem className='space-y-3'>
                  <FormLabel>Store Hours</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-col space-y-1'>
                      {dpStoreHours.map((row) => {
                        return (
                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <React.Fragment key={row.value}>
                              <FormControl>
                                <RadioGroupItem value={row.value} />
                              </FormControl>
                              <FormLabel className='font-normal'>{row.label}</FormLabel>
                            </React.Fragment>
                          </FormItem>
                        )
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name='dpInvSystem'
              render={({ field }) => (
                <FormItem className='space-y-3'>
                  <FormLabel>Inventory System</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-col space-y-1'>
                      {dpInvSystem.map((row) => {
                        return (
                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <React.Fragment key={row.value}>
                              <FormControl>
                                <RadioGroupItem value={row.value} />
                              </FormControl>
                              <FormLabel className='font-normal'>{row.label}</FormLabel>
                            </React.Fragment>
                          </FormItem>
                        )
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function OwnerProfile() {
  const { control } = useFormContext<MemberRegistrationForm>()

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Owners Profile</CardTitle>
        <CardDescription className='mb-5'>
          {' '}
          Please fill up the form below. <span className='text-lg font-bold text-teal-500'> * </span> is required.
        </CardDescription>
      </CardHeader>
      <Separator />

      <CardContent className='mt-5'>
        <div className='space-y-4'>
          <div className='grid grid-cols-3 gap-4'>
            <InputFieldForm
              control={control}
              name='opLastName'
              fieldProps={{ placeholder: 'Last Name', required: true }}
              extendedProps={{ label: 'Last Name' }}
            />
            <InputFieldForm
              control={control}
              name='opFirstName'
              fieldProps={{ placeholder: 'First Name', required: true }}
              extendedProps={{ label: 'First Name' }}
            />
            <InputFieldForm
              control={control}
              name='opMiddleName'
              fieldProps={{ placeholder: 'Middle Initial' }}
              extendedProps={{ label: 'Middle Initial' }}
            />
          </div>

          <TextAreaForm control={control} name='opAddress' fieldProps={{ placeholder: 'Address' }} extendedProps={{ label: 'Address' }} />

          <div className='grid grid-cols-2 gap-8'>
            <div className='flex flex-col space-y-2'>
              <DatePickerForm
                control={control}
                name='opBirthday'
                fieldProps={{ mode: 'single' }}
                extendedProps={{ label: 'Birthday', disabledFuture: true }}
              />

              <InputFieldForm
                control={control}
                name='opEmail'
                fieldProps={{ placeholder: 'Email Add' }}
                extendedProps={{ label: 'Email Add' }}
              />
            </div>

            <div className='flex flex-col space-y-2'>
              <InputFieldForm
                control={control}
                name='opCellNo'
                fieldProps={{ placeholder: 'Cellphone No.' }}
                extendedProps={{ label: 'Cellphone No.' }}
              />
              <InputFieldForm
                control={control}
                name='opTelNo'
                fieldProps={{ placeholder: 'Telephone No.' }}
                extendedProps={{ label: 'Telephone No.' }}
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-8'>
            <FormField
              control={control}
              name='opStatus'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <div className='relative w-full'>
                    <FormControl>
                      <select className={cn(buttonVariants({ variant: 'outline' }), 'w-full appearance-none bg-transparent')} {...field}>
                        {opStatus.map((row) => (
                          <option key={row.value} value={row.value}>
                            {row.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <ChevronDownIcon className='absolute right-3 top-2.5 h-4 w-4 opacity-50' />
                  </div>
                  {/* <FormDescription>Select Owner Status.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name='opGender'
              render={({ field }) => (
                <FormItem className='space-y-3'>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-col space-y-1'>
                      {[
                        { value: 'male', label: 'Male' },
                        { value: 'female', label: 'Female' }
                      ].map((row) => {
                        return (
                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <React.Fragment key={row.value}>
                              <FormControl>
                                <RadioGroupItem value={row.value} />
                              </FormControl>
                              <FormLabel className='font-normal'>{row.label}</FormLabel>
                            </React.Fragment>
                          </FormItem>
                        )
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function RegistrationDetails() {
  const {
    control,
    setValue,
    watch,
    formState: { errors }
  } = useFormContext<MemberRegistrationForm>()

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Registration Details and Attachment</CardTitle>
        <CardDescription className='mb-5'>
          Please fill up the form below. <span className='text-lg font-bold text-teal-500'> * </span> is required.
        </CardDescription>
      </CardHeader>
      <Separator />

      <CardContent className='mt-5 grid grid-cols-3 gap-10'>
        <div className='space-y-4'>
          <div className='flex flex-col gap-4'>
            <InputFieldForm
              control={control}
              name='fdaLtoNo'
              fieldProps={{ placeholder: 'FDA LTO No.', required: true }}
              extendedProps={{ label: 'FDA LTO No.' }}
            />

            <DatePickerForm
              control={control}
              name='fdaDateIssued'
              fieldProps={{ mode: 'single' }}
              extendedProps={{ label: 'Date Issued', required: true, disabledFuture: true }}
            />

            <DatePickerForm
              control={control}
              name='fdaDateExpiry'
              fieldProps={{ mode: 'single' }}
              extendedProps={{ label: 'Date Expiry', required: true }}
            />

            {/* <Label>FDA LTO Document Attachment *</Label> */}

            <Label className={cn('', errors.fdaUrlAttachment && 'text-red-500')}>FDA LTO Document Attachment *</Label>
            <FileUpload
              uploader='button'
              endpoint='pdfUploader'
              value={watch('fdaUrlAttachment')}
              onChange={(urlValue) => setValue('fdaUrlAttachment', urlValue ?? '')}
            />
          </div>
        </div>

        <div className='space-y-4'>
          <div className='flex flex-col gap-4'>
            <InputFieldForm
              control={control}
              name='bpNo'
              fieldProps={{ placeholder: 'Business Permit No.', required: true }}
              extendedProps={{ label: 'Business Permit No.' }}
            />

            <DatePickerForm
              control={control}
              name='bpDateIssued'
              fieldProps={{ mode: 'single' }}
              extendedProps={{ label: 'Date Issued', required: true, disabledFuture: true }}
            />

            <DatePickerForm
              control={control}
              name='bpDateExpiry'
              fieldProps={{ mode: 'single' }}
              extendedProps={{ label: 'Date Expiry', required: true }}
            />

            <Label className={cn('', errors.bpUrlAttachment && 'text-red-500')}>Business Permit Document Attachment *</Label>
            <FileUpload
              uploader='button'
              endpoint='pdfUploader'
              value={watch('bpUrlAttachment')}
              onChange={(urlValue) => setValue('bpUrlAttachment', urlValue ?? '')}
            />
          </div>
        </div>

        <div className='space-y-4'>
          <div className='flex flex-col gap-4'>
            <InputFieldForm
              control={control}
              name='docNo'
              fieldProps={{ placeholder: 'Document No. (DTI/SEC Certificate)', required: true }}
              extendedProps={{ label: 'Document No. (DTI/SEC Certificate)' }}
            />

            <DatePickerForm
              control={control}
              name='docDateIssued'
              fieldProps={{ mode: 'single' }}
              extendedProps={{ label: 'Date Issued', required: true, disabledFuture: true }}
            />

            <DatePickerForm
              control={control}
              name='docDateExpiry'
              fieldProps={{ mode: 'single' }}
              extendedProps={{ label: 'Date Expiry', required: true }}
            />

            <Label className={cn('', errors.docUrlAttachment && 'text-red-500')}>DTI/SEC Document Attachment *</Label>
            <FileUpload
              uploader='button'
              endpoint='pdfUploader'
              value={watch('docUrlAttachment')}
              onChange={(urlValue) => setValue('docUrlAttachment', urlValue ?? '')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ReviewInformation(props: StepProps) {
  const { getValues } = useFormContext<MemberRegistrationForm>()

  function fieldValue(
    label: string,
    formValue: keyof MemberRegistrationForm,
    options?: { properCase?: true; isDate?: true; isLink?: true }
  ) {
    let value = getValues(formValue as any)

    if (options) {
      const { properCase, isDate, isLink } = options

      if (properCase) value = toProperCase(value)
      if (isDate) value = toDate(new Date(value))
    }

    return (
      <dl className='grid gap-x-3 text-lg sm:flex'>
        <dt className='min-w-[220px] text-gray-500'>{label}:</dt>
        <dd className='max-w-[50%] font-medium text-gray-800 dark:text-gray-200'>
          {options?.isLink ? (
            <a href={value} target='_blank' className='cursor-pointer font-normal text-blue-500 hover:underline'>
              Click here to see attachment.
            </a>
          ) : (
            <p className={cn('', options?.isLink && 'cursor-pointer text-blue-500 hover:underline')}>{value}</p>
          )}
        </dd>
      </dl>
    )
  }

  function stepTitleTrigger(label: string, step: STEPS) {
    return (
      <div className='flex h-16 items-center justify-between rounded-md border-2 border-teal-600 px-4 text-lg text-teal-600'>
        <p className='font-medium'>{label}</p>
        <Button
          type='button'
          variant='default'
          className='min-w-[80px] bg-teal-600 hover:bg-teal-500'
          onClick={() => props.setActiveStep(step)}
        >
          Edit
        </Button>
      </div>
    )
  }

  return (
    <Accordion
      type='multiple'
      defaultValue={['general-information', 'drugstore-profile', 'owner-profile', 'registration-details']}
      className='w-full'
    >
      <AccordionItem value='general-information'>
        {/* <AccordionTrigger className='rounded-md border-2 border-teal-600 px-4 text-lg text-teal-600'>General Information</AccordionTrigger> */}
        {stepTitleTrigger('General Information', 0)}

        <AccordionContent className='relative px-4 py-8'>
          <div className='grid gap-3 md:grid-cols-2'>
            <div className='grid space-y-3'>
              {fieldValue('Drugstore Name', 'drugStoreName')}
              {fieldValue('Address', 'address')}

              {fieldValue('Email Address', 'emailAdd')}
              {fieldValue('Mobile No.', 'mobileNo')}
              {fieldValue('Telephone No.', 'telNo')}
            </div>

            <div className='grid space-y-3'>
              {fieldValue('Ownership Type', 'ownershipType', { properCase: true })}
              {fieldValue('Membership Type', 'membershipType', { properCase: true })}
              {fieldValue('Drugstore Classification', 'drugstoreClass', { properCase: true })}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='drugstore-profile'>
        {/* <AccordionTrigger className='rounded-md border-2 border-teal-600 px-4 text-lg text-teal-600'>Drugstore Profile</AccordionTrigger> */}
        {stepTitleTrigger('Drugstore Profile', 1)}
        <AccordionContent className='px-4 py-8'>
          <div className='grid gap-3 md:grid-cols-2'>
            <div className='grid space-y-3'>
              {fieldValue('Setup', 'dpSetup', { properCase: true })}
              {fieldValue('Location', 'dpLocation', { properCase: true })}
            </div>

            <div className='grid space-y-3'>
              {fieldValue('Store Hours', 'dpStoreHours', { properCase: true })}
              {fieldValue('Inventory System', 'dpInvSystem', { properCase: true })}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='owner-profile'>
        {/* <AccordionTrigger className='rounded-md border-2 border-teal-600 px-4 text-lg text-teal-600'>Owner Profile</AccordionTrigger> */}
        {stepTitleTrigger('Owner Profile', 2)}
        <AccordionContent className='px-4 py-8'>
          <div className='grid gap-3 md:grid-cols-2'>
            <div className='grid space-y-3'>
              {fieldValue('First Name', 'opFirstName')}
              {fieldValue('Middle Name', 'opMiddleName')}
              {fieldValue('Last Name', 'opLastName')}
              {fieldValue('Address', 'opAddress')}
              {fieldValue('Birthday', 'opBirthday')}
            </div>

            <div className='grid space-y-3'>
              {fieldValue('Email Address', 'opEmail')}
              {fieldValue('Mobile No.', 'opCellNo')}
              {fieldValue('Telephone No.', 'opTelNo')}

              {fieldValue('Status', 'opStatus', { properCase: true })}
              {fieldValue('Gender', 'opGender', { properCase: true })}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='registration-details'>
        {/* <AccordionTrigger className='rounded-md border-2 border-teal-600 px-4 text-lg text-teal-600'>Registration Details</AccordionTrigger> */}
        {stepTitleTrigger('Registration Details', 3)}
        <AccordionContent className='px-4 py-8'>
          <div className='grid gap-3 md:grid-cols-3'>
            <div className='grid space-y-3'>
              {fieldValue('FDA LTO No.', 'fdaLtoNo')}
              {fieldValue('Date Issued', 'fdaDateIssued', { isDate: true })}
              {fieldValue('Date Expiry', 'fdaDateExpiry', { isDate: true })}
              {fieldValue('Attachment', 'fdaUrlAttachment', { isLink: true })}
            </div>

            <div className='grid space-y-3'>
              {fieldValue('Business Permit No.', 'bpNo')}
              {fieldValue('Date Issued', 'bpDateIssued')}
              {fieldValue('Date Expiry', 'bpDateExpiry')}
              {fieldValue('Attachment', 'bpUrlAttachment')}
            </div>

            <div className='grid space-y-3'>
              {fieldValue('DTI/SEC Certificate No.', 'docNo')}
              {fieldValue('Date Issued', 'docDateIssued')}
              {fieldValue('Date Expiry', 'docDateExpiry')}
              {fieldValue('Attachment', 'docUrlAttachment')}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
