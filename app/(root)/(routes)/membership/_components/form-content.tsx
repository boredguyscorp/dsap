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
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription, Form } from '@/components/ui/form'
import { cn, toDate, toDateNormal, toProperCase } from '@/lib/utils'

import { watch } from 'fs'
import { ChevronDownIcon, ChevronsUpDown } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { DatePickerForm } from '../../../../../components/forms/DatePickerForm'
import { InputFieldForm } from '../../../../../components/forms/InputFieldForm'
import { TextAreaForm } from '../../../../../components/forms/TextAreaForm'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { SubmitHandler, useFieldArray, useFormContext } from 'react-hook-form'
import { STEPS } from './constant'
import { DrugstoreChainClassDetails, MemberRegistrationForm, dpChainClassDetailsSchema } from '@/lib/schema'
import { Label } from '@/components/ui/label'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Check } from 'lucide-react'
import { ChapterList } from '@/actions/fetchers'
import { MembershipFormProps } from './form'
import { useZodForm } from '@/lib/zod-form'
import { Icons } from '@/components/shared/icons'

type StepProps = {
  activeStep: number
  setActiveStep: (step: number) => void
  chapters?: Pick<MembershipFormProps, 'chapters'>['chapters']
}

export function getFormStepContent(props: StepProps) {
  switch (props.activeStep) {
    case STEPS.GENERAL_INFO:
      return <GeneralInfo chapters={props.chapters} />
    case STEPS.DRUGSTORE_PROFILE:
      return <DrugstoreProfile />
    case STEPS.OWNER_PROFILE:
      return <OwnerProfile />
    case STEPS.REGISTRATION_DETAIL:
      return <RegistrationDetails />
    case STEPS.REVIEW_INFORMATION:
      return <ReviewInformation {...props} />
    case STEPS.UPLOAD_PAYMENT:
      return <ProofOfPayment />
    default:
      return 'Unknown step'
  }
}

function GeneralInfo({ chapters }: Pick<StepProps, 'chapters'>) {
  const { control, setValue, watch } = useFormContext<MemberRegistrationForm>()
  const [openChapter, setOpenChapter] = useState<boolean>(false)
  const [drugstoreClass, setDrugstoreClass] = useState<boolean>(false)

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
        <CardDescription className='mb-5'>
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

          {chapters && (
            <FormField
              control={control}
              name='chapter'
              render={({ field }) => {
                return (
                  <FormItem className='flex w-full flex-col'>
                    <FormLabel>Chapter *</FormLabel>
                    <Popover open={openChapter} onOpenChange={setOpenChapter} modal={true}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            role='combobox'
                            className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
                          >
                            {field.value ? chapters.find((chapter) => chapter.id === field.value)?.name : 'Select chapter'}
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
                                    setValue('chapter', chapter.id)
                                    setOpenChapter(false)
                                  }}
                                >
                                  <Check className={cn('mr-2 h-4 w-4', chapter.id === field.value ? 'opacity-100' : 'opacity-0')} />
                                  {chapter.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </ScrollArea>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          )}

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
              fieldProps={{ placeholder: 'Mobile No.', required: true, type: 'number', pattern: '[0-9]*' }}
              extendedProps={{ label: 'Mobile No.' }}
            />
            <InputFieldForm
              control={control}
              name='telNo'
              fieldProps={{ placeholder: 'Telephone No.', type: 'number', pattern: '[0-9]*' }}
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
                      {ownershipType.map((row, i) => {
                        return (
                          <FormItem key={i} className='flex items-center space-x-3 space-y-0'>
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
                    <RadioGroup
                      onValueChange={(e) => {
                        field.onChange(e)
                        setValue('drugstoreClass', '')
                      }}
                      defaultValue={field.value}
                      className='flex flex-col space-y-1'
                    >
                      {membershipType.map((row, i) => {
                        return (
                          <FormItem key={i} className='flex items-center space-x-3 space-y-0'>
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
              render={({ field }) => {
                return (
                  <FormItem className='flex w-full flex-col'>
                    <FormLabel>Drugstore Classification</FormLabel>
                    <Popover open={drugstoreClass} onOpenChange={setDrugstoreClass} modal={true}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            role='combobox'
                            className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
                            disabled={!watch('membershipType')}
                          >
                            {field.value
                              ? drugstoreClassType.find((row) => row.value === field.value)?.label
                              : 'Select drugstore classification'}
                            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align='start' className='z-50  w-full min-w-[var(--radix-popover-trigger-width)]  p-0'>
                        <ScrollArea className='flex max-h-[350px] flex-col' type='always'>
                          <Command>
                            <CommandInput placeholder='Search drugstore classification...' />
                            <CommandEmpty>No drugstore classification found.</CommandEmpty>
                            <CommandGroup>
                              {drugstoreClassType
                                .filter((ds) => ds.category === watch('membershipType'))
                                .map((row) => (
                                  <CommandItem
                                    key={row.value}
                                    value={row.value}
                                    onSelect={() => {
                                      setValue('drugstoreClass', row.value)
                                      if (row.value === 'single' || row.value === 'chain') {
                                        setValue('dpDSClassDetails.dsClass', row.value)
                                      } else {
                                        setValue('dpDSClassDetails.dsClass', 'others')
                                      }
                                      setDrugstoreClass(false)
                                    }}
                                  >
                                    <Check className={cn('mr-2 h-4 w-4', row.value === field.value ? 'opacity-100' : 'opacity-0')} />
                                    {row.label}
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </Command>
                        </ScrollArea>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function DrugstoreProfile() {
  const { control, watch } = useFormContext<MemberRegistrationForm>()

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Drugstore Profile</CardTitle>
        <CardDescription className='mb-5'>
          Please fill up the form below. <span className='text-lg font-bold text-teal-500'> * </span> is required.
        </CardDescription>
      </CardHeader>
      <Separator />

      <CardContent className='mt-5'>
        <div className='space-y-4'>
          <div className='w-60'>
            <DatePickerForm
              control={control}
              name='dpDateEstablished'
              fieldProps={{ mode: 'single', fromYear: 1900, toYear: new Date().getFullYear(), captionLayout: 'dropdown-buttons' }}
              extendedProps={{ label: 'Date Established', required: true, disabledFuture: true }}
            />
          </div>

          <div className='grid grid-cols-4 gap-4'>
            <FormField
              control={control}
              name='dpSetup'
              render={({ field }) => (
                <FormItem className='space-y-3'>
                  <FormLabel>Setup</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value as string} className='flex flex-col space-y-1'>
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
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value as string} className='flex flex-col space-y-1'>
                      {dpLocation.map((row, i) => {
                        return (
                          <FormItem key={i} className='flex items-center space-x-3 space-y-0'>
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
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value as string} className='flex flex-col space-y-1'>
                      {dpStoreHours.map((row, i) => {
                        return (
                          <FormItem key={i} className='flex items-center space-x-3 space-y-0'>
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
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value as string} className='flex flex-col space-y-1'>
                      {dpInvSystem.map((row, i) => {
                        return (
                          <FormItem key={i} className='flex items-center space-x-3 space-y-0'>
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

        {watch('dpDSClassDetails.dsClass') === 'single' && (
          <div className='mt-8 w-full'>
            <SingleDrugstoreProfilePharmacist />
          </div>
        )}

        {watch('dpDSClassDetails.dsClass') === 'chain' && (
          <div className='mt-8 w-full'>
            <DrugstoreChainDetails />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SingleDrugstoreProfilePharmacist() {
  const {
    control,
    setValue,
    watch,
    formState: { errors }
  } = useFormContext<MemberRegistrationForm>()

  const [photoErr, setPhotoErr] = useState<{ ph?: boolean; phAs?: boolean }>({ ph: false, phAs: false })

  const [tab, setTab] = useState('registered-pharmacist')
  const onTabChange = (value: string) => setTab(value)

  const phImgContainerRef = useRef<HTMLDivElement>(null)
  const phAsImgContainerRef = useRef<HTMLDivElement>(null)
  const phAsCOEContainerRef = useRef<HTMLDivElement>(null)
  const phAsDiplomaContainerRef = useRef<HTMLDivElement>(null)
  const phAsCOAContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!errors.dpDSClassDetails) return
    const errorKey = Object.keys(errors.dpDSClassDetails)

    if (errorKey.length < 1) return

    setPhotoErr({ ph: errorKey.includes('dpPhImageUrl'), phAs: errorKey.includes('dpPhAsImageUrl') })

    if (errorKey.includes('dpPhImageUrl')) phImgContainerRef.current?.focus()
    if (errorKey.includes('dpPhAsImageUrl')) phAsImgContainerRef.current?.focus()
    if (errorKey.includes('dpPhAsAttachmentCOEUrl')) phAsCOEContainerRef.current?.focus()
    if (errorKey.includes('dpPhAsAttachmentDiplomaUrl')) phAsDiplomaContainerRef.current?.focus()
    if (errorKey.includes('dpPhAsAttachmentCOAUrl')) phAsCOAContainerRef.current?.focus()

    if ((errorKey.includes('dpPhAsFirstName') || errorKey.includes('dpPhAsLastName')) && errorKey.length < 1) {
      setTab('pharmacy-assistant')
    }
  }, [errors])

  const phEducAttArr = [
    {
      label: 'College',
      collegeUniv: 'dpDSClassDetails.dpPhEducCollege.collegeUniv',
      course: 'dpDSClassDetails.dpPhEducCollege.course',
      yearGrad: 'dpDSClassDetails.dpPhEducCollege.yearGrad'
    },
    {
      label: 'Masters',
      collegeUniv: 'dpDSClassDetails.dpPhEducMasters.collegeUniv',
      course: 'dpDSClassDetails.dpPhEducMasters.course',
      yearGrad: 'dpDSClassDetails.dpPhEducMasters.yearGrad'
    },
    {
      label: 'Doctorate',
      collegeUniv: 'dpDSClassDetails.dpPhEducDoctorate.collegeUniv',
      course: 'dpDSClassDetails.dpPhEducDoctorate.course',
      yearGrad: 'dpDSClassDetails.dpPhEducDoctorate.yearGrad'
    },
    {
      label: 'Special Program',
      collegeUniv: 'dpDSClassDetails.dpPhEducSpecialProg.collegeUniv',
      course: 'dpDSClassDetails.dpPhEducSpecialProg.course',
      yearGrad: 'dpDSClassDetails.dpPhEducSpecialProg.yearGrad'
    },
    {
      label: 'Others',
      collegeUniv: 'dpDSClassDetails.dpPhEducOthers.collegeUniv',
      course: 'dpDSClassDetails.dpPhEducOthers.course',
      yearGrad: 'dpDSClassDetails.dpPhEducOthers.yearGrad'
    }
  ] as const

  const phAsEducAttArr = [
    {
      label: 'Primary',
      collegeUniv: 'dpDSClassDetails.dpPhAsEducPrimary.collegeUniv',
      course: 'dpDSClassDetails.dpPhAsEducPrimary.course',
      yearGrad: 'dpDSClassDetails.dpPhAsEducPrimary.yearGrad'
    },
    {
      label: 'Secondary',
      collegeUniv: 'dpDSClassDetails.dpPhAsEducSecondary.collegeUniv',
      course: 'dpDSClassDetails.dpPhAsEducSecondary.course',
      yearGrad: 'dpDSClassDetails.dpPhAsEducSecondary.yearGrad'
    },
    {
      label: 'College',
      collegeUniv: 'dpDSClassDetails.dpPhAsEducCollege.collegeUniv',
      course: 'dpDSClassDetails.dpPhAsEducCollege.course',
      yearGrad: 'dpDSClassDetails.dpPhAsEducCollege.yearGrad'
    },
    {
      label: 'Masters',
      collegeUniv: 'dpDSClassDetails.dpPhAsEducMasters.collegeUniv',
      course: 'dpDSClassDetails.dpPhAsEducMasters.course',
      yearGrad: 'dpDSClassDetails.dpPhAsEducMasters.yearGrad'
    },
    {
      label: 'Doctorate',
      collegeUniv: 'dpDSClassDetails.dpPhAsEducDoctorate.collegeUniv',
      course: 'dpDSClassDetails.dpPhAsEducDoctorate.course',
      yearGrad: 'dpDSClassDetails.dpPhAsEducDoctorate.yearGrad'
    },
    {
      label: 'Special Program',
      collegeUniv: 'dpDSClassDetails.dpPhAsEducSpecialProg.collegeUniv',
      course: 'dpDSClassDetails.dpPhAsEducSpecialProg.course',
      yearGrad: 'dpDSClassDetails.dpPhAsEducSpecialProg.yearGrad'
    },
    {
      label: 'Others',
      collegeUniv: 'dpDSClassDetails.dpPhAsEducOthers.collegeUniv',
      course: 'dpDSClassDetails.dpPhAsEducOthers.course',
      yearGrad: 'dpDSClassDetails.dpPhAsEducOthers.yearGrad'
    }
  ] as const

  return (
    <Tabs value={tab} onValueChange={onTabChange} className='w-full'>
      <TabsList className='grid w-[500px] grid-cols-2'>
        <TabsTrigger value='registered-pharmacist'>Registered Pharmacist</TabsTrigger>
        <TabsTrigger value='pharmacy-assistant'>Pharmacy Assistant</TabsTrigger>
      </TabsList>
      <TabsContent value='registered-pharmacist'>
        <Card>
          <CardHeader>
            <div className='relative flex justify-between'>
              <div className='flex flex-col '>
                <CardTitle>Registered Pharmacist Details</CardTitle>
                <CardDescription>Drugstore Pharmacist Form.</CardDescription>
              </div>
              <div
                ref={phImgContainerRef}
                tabIndex={0}
                className={cn(
                  'absolute -top-3 right-0 flex h-[150px] w-[156px] flex-col items-center justify-center space-y-1 rounded-md border-2 border-dashed',
                  photoErr.ph && 'border-red-400 text-destructive'
                )}
              >
                {(watch('dpDSClassDetails.dpPhImageUrl')?.length < 1 || !watch('dpDSClassDetails.dpPhImageUrl')) && (
                  <p className={cn('text-sm font-medium')}>Photo *</p>
                )}

                <FileUpload
                  uploader='button'
                  endpoint='photoUploader'
                  value={watch('dpDSClassDetails.dpPhImageUrl')}
                  onChange={(urlValue) => {
                    setValue('dpDSClassDetails.dpPhImageUrl', urlValue ?? '')
                    setPhotoErr((prev) => {
                      return { ph: urlValue ? false : true, phAs: prev.phAs }
                    })
                  }}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className='space-y-2'>
            <div className='space-y-4'>
              <div className='grid grid-cols-3 gap-4'>
                <InputFieldForm
                  control={control}
                  name='dpDSClassDetails.dpPhLastName'
                  fieldProps={{ placeholder: 'Last Name', required: true }}
                  extendedProps={{ label: 'Last Name' }}
                />
                <InputFieldForm
                  control={control}
                  name='dpDSClassDetails.dpPhFirstName'
                  fieldProps={{ placeholder: 'First Name', required: true }}
                  extendedProps={{ label: 'First Name' }}
                />
                <div className='max-w-[140px]'>
                  <InputFieldForm
                    control={control}
                    name='dpDSClassDetails.dpPhMiddleName'
                    fieldProps={{ placeholder: 'Middle Initial', width: '12px' }}
                    extendedProps={{ label: 'Middle Initial' }}
                  />
                </div>
              </div>

              <TextAreaForm
                control={control}
                name='dpDSClassDetails.dpPhAddress'
                fieldProps={{ placeholder: 'Address' }}
                extendedProps={{ label: 'Address' }}
              />

              <div className='grid grid-cols-2 gap-8'>
                <div className='flex flex-col space-y-2'>
                  <DatePickerForm
                    control={control}
                    name='dpDSClassDetails.dpPhBirthday'
                    fieldProps={{ mode: 'single', fromYear: 1800, toYear: new Date().getFullYear(), captionLayout: 'dropdown-buttons' }}
                    extendedProps={{ label: 'Birthday', disabledFuture: true }}
                  />

                  <InputFieldForm
                    control={control}
                    name='dpDSClassDetails.dpPhEmail'
                    fieldProps={{ placeholder: 'Email Add' }}
                    extendedProps={{ label: 'Email Add' }}
                  />
                </div>

                <div className='flex flex-col space-y-2'>
                  <InputFieldForm
                    control={control}
                    name='dpDSClassDetails.dpPhCellNo'
                    fieldProps={{ placeholder: 'Cellphone No.', type: 'number', pattern: '[0-9]*' }}
                    extendedProps={{ label: 'Cellphone No.' }}
                  />

                  <InputFieldForm
                    control={control}
                    name='dpDSClassDetails.dpPhTelNo'
                    fieldProps={{ placeholder: 'Telephone No', type: 'number', pattern: '[0-9]*' }}
                    extendedProps={{ label: 'Telephone No.' }}
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-8'>
                <FormField
                  control={control}
                  name='dpDSClassDetails.dpPhStatus'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <div className='relative w-full'>
                        <FormControl>
                          <select
                            className={cn(buttonVariants({ variant: 'outline' }), 'w-full appearance-none bg-transparent')}
                            {...field}
                          >
                            {opStatus.map((row) => (
                              <option key={row.value} value={row.value}>
                                {row.label}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <ChevronDownIcon className='absolute right-3 top-2.5 h-4 w-4 opacity-50' />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name='dpDSClassDetails.dpPhGender'
                  render={({ field }) => (
                    <FormItem className='space-y-3'>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-col space-y-1'>
                          {[
                            { value: 'male', label: 'Male' },
                            { value: 'female', label: 'Female' }
                          ].map((row, i) => {
                            return (
                              <FormItem key={i} className='flex items-center space-x-3 space-y-0'>
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

              <InputFieldForm
                control={control}
                name='dpDSClassDetails.dpPhNameInCert'
                fieldProps={{ placeholder: 'Name in PRC Certificate', required: true }}
                extendedProps={{ label: 'Name in PRC Certificate' }}
              />

              <InputFieldForm
                control={control}
                name='dpDSClassDetails.dpPhOtherName'
                fieldProps={{ placeholder: 'Other Name (Maiden or Married)' }}
                extendedProps={{ label: 'Other Name (Maiden or Married)' }}
              />

              <div className='grid grid-cols-3 gap-4'>
                <InputFieldForm
                  control={control}
                  name='dpDSClassDetails.dpPhLicenseNo'
                  fieldProps={{ placeholder: 'PRC License No.', required: true }}
                  extendedProps={{ label: 'PRC License No.' }}
                />

                <DatePickerForm
                  control={control}
                  name='dpDSClassDetails.dpPhDateIssued'
                  fieldProps={{ mode: 'single', fromYear: 1900, toYear: new Date().getFullYear(), captionLayout: 'dropdown-buttons' }}
                  extendedProps={{ label: 'Date Issued', required: true, disabledFuture: true }}
                />

                <DatePickerForm
                  control={control}
                  name='dpDSClassDetails.dpPhExpDate'
                  fieldProps={{ mode: 'single', fromYear: 1900, toYear: 3000, captionLayout: 'dropdown-buttons' }}
                  extendedProps={{ label: 'Expiry Date', required: true }}
                />
              </div>

              <div className='!mt-10 flex h-11 w-full items-center justify-center rounded-md border-2 border-teal-500'>
                <h1>Educational Attainment</h1>
              </div>
              <div className='grid grid-cols-4 gap-2'>
                {phEducAttArr.map((r, i) => {
                  return (
                    <React.Fragment key={i}>
                      <Label className='flex items-center'>{r.label}</Label>

                      <InputFieldForm
                        control={control}
                        name={r.collegeUniv}
                        fieldProps={{ placeholder: 'College/University' }}
                        extendedProps={{ style: 'classic' }}
                      />

                      <InputFieldForm
                        control={control}
                        name={r.course}
                        fieldProps={{ placeholder: 'Course' }}
                        extendedProps={{ style: 'classic' }}
                      />

                      <InputFieldForm
                        control={control}
                        name={r.yearGrad}
                        fieldProps={{ placeholder: 'Year Graduated', type: 'number', maxLength: 4 }}
                        extendedProps={{ style: 'classic' }}
                      />
                    </React.Fragment>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value='pharmacy-assistant'>
        <Card>
          <CardHeader>
            <div className='relative flex justify-between'>
              <div className='flex flex-col '>
                <CardTitle>Pharmacy Assistant Details</CardTitle>
                <CardDescription>Drugstore Pharmacy Assistant Form.</CardDescription>
              </div>
              <div
                ref={phAsImgContainerRef}
                tabIndex={0}
                className={cn(
                  'absolute -top-3 right-0 flex h-[150px] w-[156px] flex-col items-center justify-center space-y-1 rounded-md border-2 border-dashed',
                  photoErr.phAs && 'border-red-400 text-destructive'
                )}
              >
                {(watch('dpDSClassDetails.dpPhAsImageUrl')?.length < 1 || !watch('dpDSClassDetails.dpPhAsImageUrl')) && (
                  <p className={cn('text-sm font-medium')}>Photo *</p>
                )}

                <FileUpload
                  uploader='button'
                  endpoint='photoUploader'
                  value={watch('dpDSClassDetails.dpPhAsImageUrl')}
                  onChange={(urlValue) => {
                    setValue('dpDSClassDetails.dpPhAsImageUrl', urlValue ?? '')
                    setPhotoErr((prev) => {
                      return { ph: prev.ph, phAs: urlValue ? false : true }
                    })
                  }}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className='space-y-2'>
            <div className='space-y-4'>
              <div className='grid grid-cols-3 gap-4'>
                <InputFieldForm
                  control={control}
                  name='dpDSClassDetails.dpPhAsLastName'
                  fieldProps={{ placeholder: 'Last Name', required: true }}
                  extendedProps={{ label: 'Last Name' }}
                />
                <InputFieldForm
                  control={control}
                  name='dpDSClassDetails.dpPhAsFirstName'
                  fieldProps={{ placeholder: 'First Name', required: true }}
                  extendedProps={{ label: 'First Name' }}
                />
                <div className='max-w-[140px]'>
                  <InputFieldForm
                    control={control}
                    name='dpDSClassDetails.dpPhAsMiddleName'
                    fieldProps={{ placeholder: 'Middle Initial', width: '12px' }}
                    extendedProps={{ label: 'Middle Initial' }}
                  />
                </div>
              </div>

              <TextAreaForm
                control={control}
                name='dpDSClassDetails.dpPhAsAddress'
                fieldProps={{ placeholder: 'Address' }}
                extendedProps={{ label: 'Address' }}
              />

              <div className='grid grid-cols-2 gap-8'>
                <div className='flex flex-col space-y-2'>
                  <DatePickerForm
                    control={control}
                    name='dpDSClassDetails.dpPhAsBirthday'
                    fieldProps={{ mode: 'single', fromYear: 1900, toYear: new Date().getFullYear(), captionLayout: 'dropdown-buttons' }}
                    extendedProps={{ label: 'Birthday', disabledFuture: true }}
                  />

                  <InputFieldForm
                    control={control}
                    name='dpDSClassDetails.dpPhAsEmail'
                    fieldProps={{ placeholder: 'Email Add' }}
                    extendedProps={{ label: 'Email Add' }}
                  />
                </div>

                <div className='flex flex-col space-y-2'>
                  <InputFieldForm
                    control={control}
                    name='dpDSClassDetails.dpPhAsCellNo'
                    fieldProps={{ placeholder: 'Cellphone No.', type: 'number', pattern: '[0-9]*' }}
                    extendedProps={{ label: 'Cellphone No.' }}
                  />
                  <InputFieldForm
                    control={control}
                    name='dpDSClassDetails.dpPhAsTelNo'
                    fieldProps={{ placeholder: 'Telephone No.', type: 'number', pattern: '[0-9]*' }}
                    extendedProps={{ label: 'Telephone No.' }}
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-8'>
                <FormField
                  control={control}
                  name='dpDSClassDetails.dpPhAsStatus'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <div className='relative w-full'>
                        <FormControl>
                          <select
                            className={cn(buttonVariants({ variant: 'outline' }), 'w-full appearance-none bg-transparent')}
                            {...field}
                          >
                            {opStatus.map((row) => (
                              <option key={row.value} value={row.value}>
                                {row.label}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <ChevronDownIcon className='absolute right-3 top-2.5 h-4 w-4 opacity-50' />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name='dpDSClassDetails.dpPhAsGender'
                  render={({ field }) => (
                    <FormItem className='space-y-3'>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-col space-y-1'>
                          {[
                            { value: 'male', label: 'Male' },
                            { value: 'female', label: 'Female' }
                          ].map((row, i) => {
                            return (
                              <FormItem key={i} className='flex items-center space-x-3 space-y-0'>
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

              <InputFieldForm
                control={control}
                name='dpDSClassDetails.dpPhAsEmployer'
                fieldProps={{ placeholder: 'Employer' }}
                extendedProps={{ label: 'Employer' }}
              />
              <InputFieldForm
                control={control}
                name='dpDSClassDetails.dpPhAsEmployerAddress'
                fieldProps={{ placeholder: 'Employer Address' }}
                extendedProps={{ label: 'Employer Address' }}
              />

              <div className='!mt-10 flex h-11 w-full items-center justify-center rounded-md border-2 border-teal-500'>
                <h1>Educational Attainment</h1>
              </div>
              <div className='grid grid-cols-4 gap-2'>
                {phAsEducAttArr.map((r, i) => {
                  return (
                    <React.Fragment key={i}>
                      <Label className='flex items-center'>{r.label}</Label>

                      <InputFieldForm
                        control={control}
                        name={r.collegeUniv}
                        fieldProps={{ placeholder: 'College/University' }}
                        extendedProps={{ style: 'classic' }}
                      />

                      <InputFieldForm
                        control={control}
                        name={r.course}
                        fieldProps={{ placeholder: 'Course' }}
                        extendedProps={{ style: 'classic' }}
                      />

                      <InputFieldForm
                        control={control}
                        name={r.yearGrad}
                        fieldProps={{ placeholder: 'Year Graduated', type: 'number', maxLength: 4 }}
                        extendedProps={{ style: 'classic' }}
                      />
                    </React.Fragment>
                  )
                })}
              </div>

              <div className='!mt-10 flex h-11 w-full items-center justify-center rounded-md border-2 border-teal-500'>
                <h1>Attached Required Forms *</h1>
              </div>
              <div className='grid grid-cols-3 gap-2'>
                <div className='flex flex-col space-y-4' ref={phAsCOEContainerRef} tabIndex={0}>
                  <Label className={cn('', !watch('dpDSClassDetails.dpPhAsAttachmentCOEUrl') && 'text-red-500')}>
                    Certificate of Employment *
                  </Label>
                  <FileUpload
                    uploader='button'
                    endpoint='pdfUploader'
                    value={watch('dpDSClassDetails.dpPhAsAttachmentCOEUrl')}
                    onChange={(urlValue) => setValue('dpDSClassDetails.dpPhAsAttachmentCOEUrl', urlValue ?? '')}
                  />
                </div>

                <div className='flex flex-col space-y-4' ref={phAsDiplomaContainerRef} tabIndex={0}>
                  <Label className={cn('', !watch('dpDSClassDetails.dpPhAsAttachmentDiplomaUrl') && 'text-red-500')}>Diploma *</Label>
                  <FileUpload
                    uploader='button'
                    endpoint='pdfUploader'
                    value={watch('dpDSClassDetails.dpPhAsAttachmentDiplomaUrl')}
                    onChange={(urlValue) => setValue('dpDSClassDetails.dpPhAsAttachmentDiplomaUrl', urlValue ?? '')}
                  />
                </div>

                <div className='flex flex-col space-y-4' ref={phAsCOAContainerRef} tabIndex={0}>
                  <Label className={cn('', !watch('dpDSClassDetails.dpPhAsAttachmentCOAUrl') && 'text-red-500')}>
                    Certificate of Attendance *
                  </Label>
                  <FileUpload
                    uploader='button'
                    endpoint='pdfUploader'
                    value={watch('dpDSClassDetails.dpPhAsAttachmentCOAUrl')}
                    onChange={(urlValue) => setValue('dpDSClassDetails.dpPhAsAttachmentCOAUrl', urlValue ?? '')}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

function DrugstoreChainDetails() {
  const { control: mainFormControl } = useFormContext<MemberRegistrationForm>()
  const { fields, append, remove, update } = useFieldArray({ name: 'dpDSClassDetails.dpBranches', control: mainFormControl })

  const form = useZodForm({
    schema: dpChainClassDetailsSchema,
    defaultValues: { branchName: '' },
    shouldUnregister: false
  })

  const {
    control,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = form

  // console.log(errors)

  const [openDialog, setOpenDialog] = React.useState<{
    isOpen: boolean
    type: 'add' | 'edit'
    row?: number
  } | null>(null)

  const [tab, setTab] = useState('general')

  const onTabChange = (value: string) => setTab(value)

  const onSubmit: SubmitHandler<DrugstoreChainClassDetails> = (data, event) => {
    if (openDialog?.type === 'add') {
      append(data)
      reset()

      setOpenDialog(null)
      setTab('general')
      return
    }

    if ((openDialog && openDialog.row) || openDialog?.row === 0) {
      update(openDialog.row, data)

      reset()
      setOpenDialog(null)
      setTab('general')
    }
  }

  const onEdit = (index: number, row: DrugstoreChainClassDetails) => {
    setOpenDialog({ isOpen: true, type: 'edit', row: index })

    reset(row, { keepDefaultValues: true })
  }

  const onClose = () => {
    setOpenDialog(null)
    reset()
    setTab('general')
  }

  return (
    <>
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex gap-2 text-lg font-medium'>
          Chain Drugstore List <span className={cn('hidden', fields.length > 0 && 'flex')}>({fields.length} Branch)</span>
        </div>
        <Button
          type='button'
          className='cursor-pointer justify-center rounded border border-teal-600 bg-teal-600 px-4 py-2 text-base font-bold  text-white  transition duration-200 ease-in-out hover:border-teal-500  hover:bg-teal-500 focus:outline-none'
          onClick={() => {
            setOpenDialog({ isOpen: true, type: 'add' })
            reset()
          }}
        >
          Add Branch
        </Button>
      </div>

      <div className={cn('max-h-[400px] overflow-y-auto', fields.length > 9 && 'pr-1')}>
        {fields.map((row, index) => {
          return (
            <div key={index} className='flex items-center justify-between border-b border-teal-500 py-2'>
              <div className='flex items-center justify-center gap-2'>
                <div className='flex h-5 w-5 items-center justify-center rounded-sm bg-teal-500 text-center text-xs text-white'>
                  {index + 1}
                </div>
                <h1>{row.branchName}</h1>
              </div>
              <div className='flex items-center justify-center gap-2'>
                <Button type='button' size='icon' variant='outline' title='Edit' className='h-5 w-5' onClick={() => onEdit(index, row)}>
                  <Icons.edit className='h-4 w-4' />
                </Button>

                <Button type='button' size='icon' variant='destructive' className='h-5 w-5' onClick={() => remove(index)}>
                  <Icons.close className='h-4 w-4' />
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      <Dialog open={openDialog?.isOpen} onOpenChange={onClose}>
        <DialogContent className='min-w-[900px]'>
          <DialogHeader>
            <DialogTitle>Chain Drugstore Branch Details</DialogTitle>
          </DialogHeader>
          <div className='flex items-center space-x-2'>
            <div className='grid flex-1 gap-2'>
              <Form {...form}>
                <form className='max-h-[600px] space-y-4 overflow-y-scroll pl-1 pr-2'>
                  <InputFieldForm
                    control={control}
                    name='branchName'
                    fieldProps={{ placeholder: 'Branch Name', required: true }}
                    extendedProps={{ label: 'Branch Name' }}
                  />

                  <Tabs value={tab} onValueChange={onTabChange} className='w-full'>
                    <TabsList className='grid w-full grid-cols-3'>
                      <TabsTrigger value='general'>General</TabsTrigger>
                      <TabsTrigger value='pharmacy-info'>Pharmacist Info</TabsTrigger>
                      <TabsTrigger value='drugstore-profile'>Drugstore Profile</TabsTrigger>
                    </TabsList>
                    <TabsContent value='general'>
                      <Card>
                        <CardContent className='space-y-2'>
                          <div className='space-y-4 py-4'>
                            <ChainDSGeneralInfo />
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value='pharmacy-info'>
                      <Card>
                        <CardContent className='space-y-2'>
                          <div className='space-y-4 py-4'>
                            <ChainDSPharmacyInfo />
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value='drugstore-profile'>
                      <Card>
                        <CardContent className='space-y-2 py-4'>
                          <div className='space-y-4'>
                            <ChainDSProfile />
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </form>
              </Form>
            </div>
          </div>

          <DialogFooter className='flex items-center justify-end'>
            <div className='flex items-center gap-2'>
              <Button type='button' variant='secondary' onClick={onClose}>
                Cancel
              </Button>
              {/* <Button type='button' onClick={form.handleSubmit((data, e) => onSubmit(data, e))}> */}
              <Button type='button' onClick={form.handleSubmit(onSubmit)}>
                Save
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function ChainDSGeneralInfo() {
  const {
    control,
    setValue,
    watch,
    formState: { errors }
  } = useFormContext<DrugstoreChainClassDetails>()

  return (
    <div className='gap-2 space-y-2'>
      <TextAreaForm control={control} name='address' fieldProps={{ placeholder: 'Address' }} extendedProps={{ label: 'Address' }} />

      <div className='grid grid-cols-3 gap-4'>
        <InputFieldForm
          control={control}
          name='emailAdd'
          fieldProps={{ placeholder: 'Email Address' }}
          extendedProps={{ label: 'Email Address' }}
        />
        <InputFieldForm
          control={control}
          name='mobileNo'
          fieldProps={{ placeholder: 'Mobile No.', type: 'number', pattern: '[0-9]*' }}
          extendedProps={{ label: 'Mobile No.' }}
        />
        <InputFieldForm
          control={control}
          name='telNo'
          fieldProps={{ placeholder: 'Telephone No.', type: 'number', pattern: '[0-9]*' }}
          extendedProps={{ label: 'Telephone No.' }}
        />
      </div>

      <InputFieldForm
        control={control}
        name='managerOic'
        fieldProps={{ placeholder: 'Manager/OIC' }}
        extendedProps={{ label: 'Manager/OIC' }}
      />

      <div className='!mb-4 !mt-7 flex h-11 w-full items-center justify-center rounded-md border-2 border-teal-500'>
        <h1>Document Attachment</h1>
      </div>
      <div className='grid grid-cols-2 gap-2 divide-x-2 p-0 '>
        <div className='relative space-y-4 px-5 first:pl-0 first:pr-5 last:pl-5 last:pr-0 '>
          <div className='flex flex-col gap-4'>
            <InputFieldForm
              control={control}
              name='fdaLtoNo'
              fieldProps={{ placeholder: 'FDA LTO No.' }}
              extendedProps={{ label: 'FDA LTO No.' }}
            />

            <DatePickerForm
              control={control}
              name='fdaDateIssued'
              fieldProps={{ mode: 'single', fromYear: 1900, toYear: new Date().getFullYear(), captionLayout: 'dropdown-buttons' }}
              extendedProps={{ label: 'Date issue', disabledFuture: true }}
            />

            <DatePickerForm
              control={control}
              name='fdaDateExpiry'
              fieldProps={{ mode: 'single', fromYear: 1900, toYear: 3000, captionLayout: 'dropdown-buttons' }}
              extendedProps={{ label: 'Date Expiry' }}
            />

            <Label className={cn('', errors.fdaUrlAttachment && 'text-red-500')}>FDA LTO Document Attachment</Label>
            <FileUpload
              uploader='button'
              endpoint='pdfUploader'
              value={watch('fdaUrlAttachment')}
              onChange={(urlValue) => setValue('fdaUrlAttachment', urlValue ?? '')}
            />
          </div>
        </div>

        <div className='relative space-y-4 px-5 first:pl-0 first:pr-5 last:pl-5 last:pr-0 '>
          <div className='flex flex-col gap-4'>
            <InputFieldForm
              control={control}
              name='docNo'
              fieldProps={{ placeholder: 'Document No. (DTI/SEC Certificate)' }}
              extendedProps={{ label: 'Document No. (DTI/SEC Certificate)' }}
            />

            <DatePickerForm
              control={control}
              name='docDateIssued'
              fieldProps={{ mode: 'single', fromYear: 1900, toYear: new Date().getFullYear(), captionLayout: 'dropdown-buttons' }}
              extendedProps={{ label: 'Date issue', disabledFuture: true }}
            />

            <DatePickerForm
              control={control}
              name='docDateExpiry'
              fieldProps={{ mode: 'single', fromYear: 1900, toYear: 3000, captionLayout: 'dropdown-buttons' }}
              extendedProps={{ label: 'Date Expiry' }}
            />

            <Label className={cn('', errors.docUrlAttachment && 'text-red-500')}>DTI/SEC Document Attachment</Label>
            <FileUpload
              uploader='button'
              endpoint='pdfUploader'
              value={watch('docUrlAttachment')}
              onChange={(urlValue) => setValue('docUrlAttachment', urlValue ?? '')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function ChainDSPharmacyInfo() {
  const {
    control,
    setValue,
    watch,
    formState: { errors }
  } = useFormContext<DrugstoreChainClassDetails>()

  const [tab, setTab] = useState('registered-pharmacist')
  const onTabChange = (value: string) => setTab(value)

  return (
    <Tabs value={tab} onValueChange={onTabChange} className='w-full'>
      <TabsList className='grid w-[500px] grid-cols-2'>
        <TabsTrigger value='registered-pharmacist'>Registered Pharmacist</TabsTrigger>
        <TabsTrigger value='pharmacy-assistant'>Pharmacy Assistant</TabsTrigger>
      </TabsList>
      <TabsContent value='registered-pharmacist'>
        <Card className='border-none'>
          {/* <CardHeader>
            <CardTitle>Registered Pharmacist Details</CardTitle>
            <CardDescription>Drugstore Pharmacist Form.</CardDescription>
          </CardHeader> */}

          <CardContent className='space-y-2 p-1'>
            <div className='space-y-4'>
              <div className='grid grid-cols-3 gap-4'>
                <InputFieldForm
                  control={control}
                  name='dpPhLastName'
                  fieldProps={{ placeholder: 'Last Name' }}
                  extendedProps={{ label: 'Last Name' }}
                />
                <InputFieldForm
                  control={control}
                  name='dpPhFirstName'
                  fieldProps={{ placeholder: 'First Name' }}
                  extendedProps={{ label: 'First Name' }}
                />
                <InputFieldForm
                  control={control}
                  name='dpPhMiddleName'
                  fieldProps={{ placeholder: 'Middle Initial' }}
                  extendedProps={{ label: 'Middle Initial' }}
                />
              </div>

              <TextAreaForm
                control={control}
                name='dpPhAddress'
                fieldProps={{ placeholder: 'Address' }}
                extendedProps={{ label: 'Address' }}
              />

              <InputFieldForm
                control={control}
                name='dpPhNameInCert'
                fieldProps={{ placeholder: 'Name in PRC Certificate' }}
                extendedProps={{ label: 'Name in PRC Certificate' }}
              />

              <InputFieldForm
                control={control}
                name='dpPhOtherName'
                fieldProps={{ placeholder: 'Other Name (Maiden or Married)' }}
                extendedProps={{ label: 'Other Name (Maiden or Married)' }}
              />

              <div className='grid grid-cols-3 gap-4'>
                <InputFieldForm
                  control={control}
                  name='dpPhLicenseNo'
                  fieldProps={{ placeholder: 'PRC License No.' }}
                  extendedProps={{ label: 'PRC License No.' }}
                />

                <DatePickerForm
                  control={control}
                  name='dpPhDateIssued'
                  fieldProps={{ mode: 'single', fromYear: 1900, toYear: new Date().getFullYear(), captionLayout: 'dropdown-buttons' }}
                  extendedProps={{ label: 'Date issue', disabledFuture: true }}
                />

                <DatePickerForm
                  control={control}
                  name='dpPhExpDate'
                  fieldProps={{ mode: 'single', fromYear: 1900, toYear: 3000, captionLayout: 'dropdown-buttons' }}
                  extendedProps={{ label: 'Date Expiry' }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value='pharmacy-assistant'>
        <Card className='border-none'>
          {/* <CardHeader>
            <CardTitle>Pharmacy Assistant Details</CardTitle>
            <CardDescription>Drugstore Pharmacy Assistant Form.</CardDescription>
          </CardHeader> */}
          <CardContent className='space-y-2 p-1'>
            <div className='space-y-4'>
              <div className='grid grid-cols-3 gap-4'>
                <InputFieldForm
                  control={control}
                  name='dpPhAsLastName'
                  fieldProps={{ placeholder: 'Last Name' }}
                  extendedProps={{ label: 'Last Name' }}
                />
                <InputFieldForm
                  control={control}
                  name='dpPhAsFirstName'
                  fieldProps={{ placeholder: 'First Name' }}
                  extendedProps={{ label: 'First Name' }}
                />
                <InputFieldForm
                  control={control}
                  name='dpPhAsMiddleName'
                  fieldProps={{ placeholder: 'Middle Initial' }}
                  extendedProps={{ label: 'Middle Initial' }}
                />
              </div>

              <TextAreaForm
                control={control}
                name='dpPhAsAddress'
                fieldProps={{ placeholder: 'Address' }}
                extendedProps={{ label: 'Address' }}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

function ChainDSProfile() {
  const {
    control,
    setValue,
    watch,
    formState: { errors }
  } = useFormContext<DrugstoreChainClassDetails>()

  return (
    <div className='space-y-4'>
      <div className='w-60'>
        <DatePickerForm
          control={control}
          name='dpDateEstablished'
          fieldProps={{ mode: 'single', fromYear: 1900, toYear: new Date().getFullYear(), captionLayout: 'dropdown-buttons' }}
          extendedProps={{ label: 'Date Established', disabledFuture: true }}
        />
      </div>

      <div className='grid grid-cols-4 gap-4'>
        <FormField
          control={control}
          name='dpSetup'
          render={({ field }) => (
            <FormItem className='space-y-3'>
              <FormLabel>Setup</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-col space-y-1'>
                  {dpSetup.map((row, i) => {
                    return (
                      <FormItem key={i} className='flex items-center space-x-3 space-y-0'>
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
                  {dpLocation.map((row, i) => {
                    return (
                      <FormItem key={i} className='flex items-center space-x-3 space-y-0'>
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
                  {dpStoreHours.map((row, i) => {
                    return (
                      <FormItem key={i} className='flex items-center space-x-3 space-y-0'>
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
                  {dpInvSystem.map((row, i) => {
                    return (
                      <FormItem key={i} className='flex items-center space-x-3 space-y-0'>
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
  )
}

function OwnerProfile() {
  const {
    control,
    setValue,
    formState: { errors },
    clearErrors,
    watch
  } = useFormContext<MemberRegistrationForm>()

  // console.log(errors.opDsapMember)

  const phEducAttArr = [
    {
      label: 'College',
      collegeUniv: 'opEducCollege.collegeUniv',
      course: 'opEducCollege.course',
      yearGrad: 'opEducCollege.yearGrad'
    },
    {
      label: 'Masters',
      collegeUniv: 'opEducMasters.collegeUniv',
      course: 'opEducMasters.course',
      yearGrad: 'opEducMasters.yearGrad'
    },
    {
      label: 'Doctorate',
      collegeUniv: 'opEducDoctorate.collegeUniv',
      course: 'opEducDoctorate.course',
      yearGrad: 'opEducDoctorate.yearGrad'
    },
    {
      label: 'Special Program',
      collegeUniv: 'opEducSpecialProg.collegeUniv',
      course: 'opEducSpecialProg.course',
      yearGrad: 'opEducSpecialProg.yearGrad'
    },
    {
      label: 'Others',
      collegeUniv: 'opEducOthers.collegeUniv',
      course: 'opEducOthers.course',
      yearGrad: 'opEducOthers.yearGrad'
    }
  ] as const

  const opPhImageContainerRef = useRef<HTMLDivElement>(null)
  const opRepFormContainerRef = useRef<HTMLDivElement>(null)
  const opRepPhotoContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const errorKeys = Object.keys(errors)

    if (errorKeys.includes('opPhImageUrl')) opPhImageContainerRef.current?.focus()

    if (errors.opDsapMember) {
      const dsapMemberErrorKeys = Object.keys(errors.opDsapMember)

      if (dsapMemberErrorKeys.includes('opRepFormUrl')) opRepFormContainerRef.current?.focus()
      if (dsapMemberErrorKeys.includes('opRepPhotoUrl')) opRepPhotoContainerRef.current?.focus()
    }
  }, [errors])

  return (
    <Card className='w-full'>
      {/* <CardHeader>
        <CardTitle>Owners Profile</CardTitle>
        <CardDescription className='mb-5'>
          Please fill up the form below. <span className='text-lg font-bold text-teal-500'> * </span> is required.
        </CardDescription>
      </CardHeader>
      <Separator /> */}

      <CardHeader>
        <div className='relative flex justify-between'>
          <div className='flex flex-col '>
            <CardTitle>Registered Pharmacist Details</CardTitle>
            <CardDescription>Drugstore Pharmacist Form.</CardDescription>
          </div>
          <div
            ref={opPhImageContainerRef}
            tabIndex={0}
            className={cn(
              'absolute -top-3 right-0 flex h-[150px] w-[156px] flex-col items-center justify-center space-y-1 rounded-md border-2 border-dashed',
              errors.opPhImageUrl && 'border-red-400 text-destructive'
            )}
          >
            {(watch('opPhImageUrl')?.length < 1 || !watch('opPhImageUrl')) && <p className={cn('text-sm font-medium')}>Photo *</p>}

            <FileUpload
              uploader='button'
              endpoint='photoUploader'
              value={watch('opPhImageUrl')}
              onChange={(urlValue) => {
                setValue('opPhImageUrl', urlValue ?? '')
                clearErrors('opPhImageUrl')
                // setPhotoErr((prev) => {
                //   return { ph: urlValue ? false : true, phAs: prev.phAs }
                // })
              }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className='mt-1'>
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
            {/* <InputFieldForm
              control={control}
              name='opMiddleName'
              fieldProps={{ placeholder: 'Middle Initial' }}
              extendedProps={{ label: 'Middle Initial' }}
            /> */}

            <div className='max-w-[150px]'>
              <InputFieldForm
                control={control}
                name='opMiddleName'
                fieldProps={{ placeholder: 'Middle Initial' }}
                extendedProps={{ label: 'Middle Initial' }}
              />
            </div>
          </div>

          <TextAreaForm control={control} name='opAddress' fieldProps={{ placeholder: 'Address' }} extendedProps={{ label: 'Address' }} />

          <div className='grid grid-cols-2 gap-8'>
            <div className='flex flex-col space-y-2'>
              <DatePickerForm
                control={control}
                name='opBirthday'
                fieldProps={{ mode: 'single', fromYear: 1900, toYear: new Date().getFullYear(), captionLayout: 'dropdown-buttons' }}
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
                fieldProps={{ placeholder: 'Cellphone No.', type: 'number', pattern: '[0-9]*' }}
                extendedProps={{ label: 'Cellphone No.' }}
              />
              <InputFieldForm
                control={control}
                name='opTelNo'
                fieldProps={{ placeholder: 'Telephone No.', type: 'number', pattern: '[0-9]*' }}
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
                      <select
                        className={cn(buttonVariants({ variant: 'outline' }), 'w-full appearance-none bg-transparent')}
                        {...field}
                        value={field.value as string}
                      >
                        {opStatus.map((row) => (
                          <option key={row.value} value={row.value}>
                            {row.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <ChevronDownIcon className='absolute right-3 top-2.5 h-4 w-4 opacity-50' />
                  </div>
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
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value as string} className='flex flex-col space-y-1'>
                      {[
                        { value: 'male', label: 'Male' },
                        { value: 'female', label: 'Female' }
                      ].map((row, i) => {
                        return (
                          <FormItem key={i} className='flex items-center space-x-3 space-y-0'>
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

          <div className='!mt-10 flex h-11 w-full items-center justify-center rounded-md border-2 border-teal-500'>
            <h1>Educational Attainment</h1>
          </div>
          <div className='grid grid-cols-4 gap-2'>
            {phEducAttArr.map((r, i) => {
              return (
                <React.Fragment key={i}>
                  <Label className='flex items-center'>{r.label}</Label>

                  <InputFieldForm
                    control={control}
                    name={r.collegeUniv}
                    fieldProps={{ placeholder: 'College/University' }}
                    extendedProps={{ style: 'classic' }}
                  />

                  <InputFieldForm
                    control={control}
                    name={r.course}
                    fieldProps={{ placeholder: 'Course' }}
                    extendedProps={{ style: 'classic' }}
                  />

                  <InputFieldForm
                    control={control}
                    name={r.yearGrad}
                    fieldProps={{ placeholder: 'Year Graduated', type: 'number', maxLength: 4 }}
                    extendedProps={{ style: 'classic' }}
                  />
                </React.Fragment>
              )
            })}
          </div>

          <div className='!mt-10 flex h-11 w-full items-center justify-center rounded-md border-2 border-teal-500'>
            <h1>Who will be the DSAP Member?</h1>
          </div>

          <FormField
            control={control}
            name='opDsapMember.opDsapMemberType'
            render={({ field }) => (
              <FormItem className='space-y-3'>
                <FormLabel>Who will be the DSAP Member?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-col space-y-1'>
                    {[
                      { value: 'owner', label: 'Owner' },
                      { value: 'representative', label: 'Representative' }
                    ].map((row, i) => {
                      return (
                        <FormItem key={i} className='flex items-center space-x-3 space-y-0'>
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
                {/* <FormMessage>xxx</FormMessage> */}
                {errors.opDsapMember?.opDsapMemberType && (
                  <p className='text-sm font-medium text-destructive'>Please select who will be the DSAP Member</p>
                )}
              </FormItem>
            )}
          />

          {watch('opDsapMember.opDsapMemberType') === 'representative' && (
            <div className='!mt-8 grid grid-cols-2'>
              <div className='flex flex-col gap-2' ref={opRepFormContainerRef} tabIndex={0}>
                <Label className={cn('', errors.opDsapMember && 'text-red-500')}>Authorized Representative form *</Label>
                <FileUpload
                  uploader='button'
                  endpoint='pdfUploader'
                  value={watch('opDsapMember.opRepFormUrl')}
                  onChange={(urlValue) => setValue('opDsapMember.opRepFormUrl', urlValue ?? '')}
                />

                {errors.opDsapMember && 'opRepFormUrl' in errors.opDsapMember && (
                  <p className='text-sm font-medium text-destructive'>Please attached Authorized Representative form</p>
                )}
              </div>

              <div className='flex flex-col gap-2' ref={opRepPhotoContainerRef} tabIndex={0}>
                <Label className={cn('', errors.opDsapMember && 'text-red-500')}>Authorized Representative photo *</Label>
                <FileUpload
                  uploader='button'
                  endpoint='photoUploader'
                  value={watch('opDsapMember.opRepPhotoUrl')}
                  onChange={(urlValue) => setValue('opDsapMember.opRepPhotoUrl', urlValue ?? '')}
                />

                {errors.opDsapMember && 'opRepPhotoUrl' in errors.opDsapMember && (
                  <p className='text-sm font-medium text-destructive'>Please select Authorized Representative photo.</p>
                )}
              </div>
            </div>
          )}
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

  const fdaAttachmentContainerRef = useRef<HTMLDivElement>(null)
  const bpaAttachmentContainerRef = useRef<HTMLDivElement>(null)
  const docAttachmentContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const errorKeys = Object.keys(errors)

    if (errorKeys.includes('fdaUrlAttachment')) fdaAttachmentContainerRef.current?.focus()
    if (errorKeys.includes('bpUrlAttachment')) bpaAttachmentContainerRef.current?.focus()
    if (errorKeys.includes('docUrlAttachment')) docAttachmentContainerRef.current?.focus()
  }, [errors])

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Registration Details and Attachment</CardTitle>
        <CardDescription className='mb-5'>
          Please fill up the form below. <span className='text-lg font-bold text-teal-500'> * </span> is required.
        </CardDescription>
      </CardHeader>
      <Separator />

      <CardContent className='mt-5 grid grid-cols-3 gap-2 divide-x-2 '>
        <div className='relative space-y-4 px-5 first:pl-0 first:pr-5 last:pl-5 last:pr-0 '>
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
              fieldProps={{ mode: 'single', fromYear: 1900, toYear: 3000, captionLayout: 'dropdown-buttons' }}
              extendedProps={{ label: 'Date Issued', required: true, disabledFuture: true }}
            />

            <DatePickerForm
              control={control}
              name='fdaDateExpiry'
              fieldProps={{ mode: 'single', fromYear: 1900, toYear: 3000, captionLayout: 'dropdown-buttons' }}
              extendedProps={{ label: 'Date Expiry', required: true }}
            />

            {/* <Label>FDA LTO Document Attachment *</Label> */}

            <Label className={cn('', errors.fdaUrlAttachment && 'text-red-500')}>FDA LTO Document Attachment *</Label>

            <div ref={fdaAttachmentContainerRef} tabIndex={0}>
              <FileUpload
                uploader='button'
                endpoint='pdfUploader'
                value={watch('fdaUrlAttachment')}
                onChange={(urlValue) => setValue('fdaUrlAttachment', urlValue ?? '')}
              />
            </div>
          </div>
        </div>

        <div className='relative space-y-4 px-5 first:pl-0 first:pr-5 last:pl-5 last:pr-0 '>
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
              fieldProps={{ mode: 'single', fromYear: 1900, toYear: 3000, captionLayout: 'dropdown-buttons' }}
              extendedProps={{ label: 'Date Issued', required: true, disabledFuture: true }}
            />

            <DatePickerForm
              control={control}
              name='bpDateExpiry'
              fieldProps={{ mode: 'single', fromYear: 1900, toYear: 3000, captionLayout: 'dropdown-buttons' }}
              extendedProps={{ label: 'Date Expiry', required: true }}
            />

            <Label className={cn('', errors.bpUrlAttachment && 'text-red-500')}>Business Permit Document Attachment *</Label>

            <div ref={bpaAttachmentContainerRef} tabIndex={0}>
              <FileUpload
                uploader='button'
                endpoint='pdfUploader'
                value={watch('bpUrlAttachment')}
                onChange={(urlValue) => setValue('bpUrlAttachment', urlValue ?? '')}
              />
            </div>
          </div>
        </div>

        <div className='relative space-y-4 px-5 first:pl-0 first:pr-5 last:pl-5 last:pr-0 '>
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
              fieldProps={{ mode: 'single', fromYear: 1900, toYear: 3000, captionLayout: 'dropdown-buttons' }}
              extendedProps={{ label: 'Date Issued', required: true, disabledFuture: true }}
            />

            <DatePickerForm
              control={control}
              name='docDateExpiry'
              fieldProps={{ mode: 'single', fromYear: 1900, toYear: 3000, captionLayout: 'dropdown-buttons' }}
              extendedProps={{ label: 'Date Expiry', required: true }}
            />

            <Label className={cn('', errors.docUrlAttachment && 'text-red-500')}>DTI/SEC Document Attachment *</Label>

            <div ref={docAttachmentContainerRef} tabIndex={0}>
              <FileUpload
                uploader='button'
                endpoint='pdfUploader'
                value={watch('docUrlAttachment')}
                onChange={(urlValue) => setValue('docUrlAttachment', urlValue ?? '')}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ProofOfPayment() {
  const {
    control,
    setValue,
    watch,
    formState: { errors }
  } = useFormContext<MemberRegistrationForm>()

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Upload Proof of Payment</CardTitle>
      </CardHeader>
      <Separator />

      <CardContent className='mt-5 flex flex-col space-y-4'>
        <Label className={cn('')}>Proof of Payment</Label>
        <FileUpload
          uploader='button'
          endpoint='pdfUploader'
          value={watch('proofOfPaymentUrl')}
          onChange={(urlValue) => setValue('proofOfPaymentUrl', urlValue ?? '')}
        />
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
        {stepTitleTrigger('Owner Profile', 2)}
        <AccordionContent className='px-4 py-8'>
          <div className='grid gap-3 md:grid-cols-2'>
            <div className='grid space-y-3'>
              {fieldValue('First Name', 'opFirstName')}
              {fieldValue('Middle Name', 'opMiddleName')}
              {fieldValue('Last Name', 'opLastName')}
              {fieldValue('Address', 'opAddress')}
              {fieldValue('Birthday', 'opBirthday', { isDate: true })}
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
              {fieldValue('Date Issued', 'bpDateIssued', { isDate: true })}
              {fieldValue('Date Expiry', 'bpDateExpiry', { isDate: true })}
              {fieldValue('Attachment', 'bpUrlAttachment', { isLink: true })}
            </div>

            <div className='grid space-y-3'>
              {fieldValue('DTI/SEC Certificate No.', 'docNo')}
              {fieldValue('Date Issued', 'docDateIssued', { isDate: true })}
              {fieldValue('Date Expiry', 'docDateExpiry', { isDate: true })}
              {fieldValue('Attachment', 'docUrlAttachment', { isLink: true })}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
