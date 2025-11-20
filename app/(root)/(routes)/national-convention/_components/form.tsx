"use client";

import { Icons } from "@/components/shared/icons";
import { cn, getFileFromBlobUrl } from "@/lib/utils";
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	useTransition,
} from "react";

// import { InputFieldForm } from '../membership/_components/InputFieldForm'

import { useZodForm } from "@/lib/zod-form";
import {
	ConventionRegistrationForm,
	ConventionRegistrationFormSchema,
} from "@/lib/schema";
import { SubmitHandler } from "react-hook-form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { Button } from "@/components/ui/button";

// import { DatePickerForm } from './_components/DatePickerForm'

const RHFDevTool = dynamic(
	() => import("../../../../../components/forms/DevTools"),
	{ ssr: false },
);

import dsap27th from "public/images/dsap27th.png";
// import dsap26th from 'public/images/dsap26th.jpg'
// import logo from 'public/images/logo.jpg'

import Image from "next/image";
import dynamic from "next/dynamic";

import Balancer from "react-wrap-balancer";
import { Label } from "@/components/ui/label";
import {
	CURRENT_CONVENTION,
	CURRENT_DATE,
	conventions,
	rateValues,
} from "@/app/(app.domain.com)/dashboard/convention/_components/constant";
import { registerConvention } from "@/actions/convention";

// import { FileWithPath, useDropzone } from 'react-dropzone'
// import { generateClientDropzoneAccept } from 'uploadthing/client'
// import { useUploadThing } from '@/lib/uploadthing'
import { Form } from "@/components/ui/form";
import { RegistrationFormInputs } from "./form-content";
import { ChapterList } from "@/actions/fetchers";
import { ImageUploader } from "@/components/image-uploader";
import { toast } from "sonner";

type NationalConventionFormProps = {
	chapters: ChapterList;
};

export function NationalConventionForm({
	chapters,
}: NationalConventionFormProps) {
	const [showForm, setShowForm] = useState(false);

	useEffect(() => {
		if (showForm) window.scrollTo(0, 0);
	}, [showForm]);

	const convention = useMemo(
		() => conventions.find((row) => row.code === CURRENT_CONVENTION),
		[],
	);
	const cutOffDate = convention?.preRegCutOff ?? "2026-03-06";
	const isPreReg = cutOffDate > CURRENT_DATE;
	const showRegistration = process.env.NEXT_PUBLIC_SHOW_REGISTRATION === "true";

	const defaultValues = {
		// ['regDelegate.delegateClass']: 'Non-Pharmacist',
		convention: CURRENT_CONVENTION,
		type: isPreReg ? "27th-prm" : "27th-m",
		firstName: "",
		lastName: "",
		contactNo: "",
		emailAdd: "",
		proofOfPaymentUrl: "",
	} as const;

	const [isPending, startTransition] = useTransition();
	const [response, setResponse] = useState<{
		success: boolean;
		message: string;
	}>();
	const refSubmit = useRef<HTMLButtonElement>(null);

	const form = useZodForm({
		schema: ConventionRegistrationFormSchema,
		defaultValues,
		shouldUnregister: false,
	});

	const {
		clearErrors,
		formState: { errors },
		getValues,
		watch,
		setValue,
	} = form;

	// const year = new Date().getFullYear();
  const year = 2026;

	if (!showForm) {
		return (
			<div className="mx-auto mt-40 max-w-[85rem] px-4 py-10 xs:mt-32 sm:px-6 lg:px-8 lg:py-14">
				<div className="md:grid md:grid-cols-2 md:items-center md:gap-12 xl:gap-32">
					<div className="mb-5 flex h-full items-start justify-start">
						<Image
							src={dsap27th}
							alt="dsap-national-convention-27th"
							className=" w-full rounded-xl object-cover"
						/>
					</div>

					<div className=" flex h-full items-start justify-start  ">
						<div className="space-y-6 sm:space-y-8">
							<div className="space-y-2 md:space-y-4">
								<p className="text-center text-lg">
									<Balancer>
										Those who wish to join{" "}
										<span className="font-bold">DSAP Convention {year}</span>{" "}
										shall submit registration together with the corresponding
										fee and requirements.
									</Balancer>
								</p>
							</div>

							<Separator />
							{/* <div className='flex flex-col items-center justify-center space-y-2 md:space-y-4'> */}
							<h2 className="text-center text-2xl font-bold text-teal-600 dark:text-white md:text-3xl lg:text-4xl">
								Registration Procedures
							</h2>

							<ol className="max space-y-3 px-6 text-base font-semibold md:text-lg">
								<li className="list-decimal">
									Pay DSAP Membership dues {year}.
								</li>
								<li className="list-decimal">
									Pay Registration Fee to DSAPCON{year}
								</li>
								<ul className="max space-y-3 px-5 font-semibold">
									<li className="-ml-5">
										Deposit to Metrobank Shaw Blvd. Branch Account:
									</li>
									<ul className="space-y-3 font-semibold">
										<li className="list-disc">
											Account Name:{" "}
											<span className="font-bold underline">
												Drugstores Association of the Phils. Inc.
											</span>
										</li>
										<li className="list-disc">
											Account Number:{" "}
											<span className="font-bold underline">
												062-7-06251142-3
											</span>
										</li>
									</ul>
								</ul>

								<li className="list-decimal">
									Register online (Click "Register Now")
								</li>
								<li className="list-decimal">
									Fill up Form & upload proof of payment and submit.
								</li>
								<li className="list-decimal">
									Check e-mail for acknowledgement of registration.
								</li>
								<li className="list-decimal">
									Wait for the Registration Confirmation thru email.
								</li>
							</ol>
							<Separator />
							<h2 className="text-center text-2xl font-bold text-teal-600 dark:text-white md:text-3xl lg:text-4xl">
								How to Register
							</h2>

							<ol className="max space-y-3 px-6 text-base font-semibold md:text-lg">
								<li className="list-decimal">Fill up required fields.</li>
								<ul className="max space-y-3 px-5 font-semibold">
									<li className="list-disc">First Name</li>
									<li className="list-disc">Last Name</li>
									<li className="list-disc">Contact No.</li>
									<li className="list-disc">Email Address</li>
								</ul>

								<li className="list-decimal">Upload Proof of Payment</li>
								<li className="list-decimal">Submit Registration Form</li>
								<li className="list-decimal">
									Wait for the Email Confirmation
								</li>
							</ol>
							{/* </div> */}

							<Separator />
							<Button
								variant="main"
								className={cn("h-16 w-64", !showRegistration && "hidden")}
								onClick={() => {
									setShowForm(true);
								}}
							>
								Register Now
							</Button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	const onSubmit: SubmitHandler<ConventionRegistrationForm> = (data) => {
		startTransition(async () => {
			try {
				const formData = new FormData();
				const proofOfPaymentUrlFile = await getFileFromBlobUrl(
					data.proofOfPaymentUrl,
				);

				formData.append("proofOfPaymentUrl", proofOfPaymentUrlFile);

				const result = await registerConvention(data, formData);

				if (result && result.code) {
					setResponse({
						success: true,
						message: "Successfully submitted your registration.",
					});
					toast.success("Successfully submitted your registration", {
						position: "top-center",
					});
					return;
				}

				toast.error("Something went wrong.", { position: "top-center" });
				setResponse({
					success: false,
					message: "Error submitting registration! Please try again.",
				});
			} catch (error) {
				console.error("NATIONAL_CONVENTION_REGISTRATION_ERROR:", error);
				setResponse({
					success: false,
					message: "Error submitting registration! Please try again.",
				});
				toast.error("Error submitting registration! Please try again.", {
					position: "top-center",
				});
			}
		});
	};

	// const showBanner = process.env.NEXT_PUBLIC_SHOW_BANNER === 'true'

	return (
		<div className={"w-full bg-gradient-to-br from-teal-400 to-cyan-100"}>
			<div className="mx-auto mt-28 max-w-[900px] px-0 py-10  sm:px-6  ">
				<div className="p-5">
					<div className="p-4">
						<Form {...form}>
							<form className="space-y-4">
								<Card className="w-full">
									<CardHeader>
										<CardTitle className="text-xl">
											Convention Registration Form
										</CardTitle>
										<CardDescription className="mb-5">
											Please fill up the form below.{" "}
											<span className="text-lg font-bold text-teal-500">
												{" "}
												*{" "}
											</span>{" "}
											is required.
										</CardDescription>
									</CardHeader>
									<Separator />

									<CardContent className="mt-5">
										<RegistrationFormInputs chapters={chapters} />

										<Separator className="mb-2 mt-6" />
										<div className="mt-2.5 space-y-2">
											<Label
												className={cn(
													"font-medium",
													errors.proofOfPaymentUrl && "text-red-500",
												)}
											>
												Proof of Payment{" "}
												{!watch("proofOfPaymentUrl") &&
													errors.proofOfPaymentUrl &&
													" is required. "}
												<span
													className={cn(
														"text-lg font-bold text-teal-500",
														errors.proofOfPaymentUrl && "text-red-500",
													)}
												>
													{" "}
													*{" "}
												</span>
											</Label>

											<ImageUploader
												label="Photo"
												value={getValues("proofOfPaymentUrl")}
												isRequired
												uploaderKey="national-convention-registration-proofOfPaymentUrl"
												icon={Icons.media}
												limitSize={2}
												isMultiple={false}
												display={null}
												className="h-[440px]"
												onChange={(url) => {
													setValue("proofOfPaymentUrl", url ?? "");
													clearErrors("proofOfPaymentUrl");
												}}
												isError={!!errors.proofOfPaymentUrl}
												errorMessage={errors.proofOfPaymentUrl?.message}
											/>
										</div>
									</CardContent>
								</Card>
							</form>
						</Form>

						<div className="mt-5 flex flex-col space-y-3">
							<h2 className="text-xl font-bold text-teal-600 underline dark:text-white">
								Terms & Conditions
							</h2>

							<ol className="max space-y-2 px-6 text-base  md:text-lg">
								<li className="list-decimal">
									Registration is{" "}
									<span className="font-bold underline">Non-transferable</span>{" "}
									and{" "}
									<span className="font-bold underline">Non-refundable.</span>
								</li>
								<li className="list-decimal">
									DSAP and CPhAD Membership dues 2026 should be paid to avail of
									member Registration rate.
								</li>
							</ol>
						</div>

						{response && (
							<div
								className="mt-10 flex cursor-pointer justify-center text-center"
								onClick={() => {
									response.success
										? window.location.reload()
										: refSubmit.current?.click();
								}}
							>
								<div
									className={cn(
										"flex flex-col items-center justify-center gap-2 text-lg font-bold text-teal-600",
										!response.success && "text-red-600",
									)}
								>
									<div className="flex items-center gap-2">
										{response.message}
										<span>
											{response.success && (
												<Icons.check className="mr-2 h-6 w-6" />
											)}
										</span>
									</div>

									{response.success && (
										<span className="inline-flex items-center justify-center gap-x-2 text-xs font-semibold text-gray-800 decoration-2 group-hover:underline sm:text-sm ">
											Click here to create new.
										</span>
									)}
								</div>
							</div>
						)}

						{!response?.success && (
							<div className="mt-10 flex items-center p-2">
								<div>
									<p>Registration Fee:</p>
									<Label className="text-xl font-semibold text-teal-600">
										{rateValues.find((r) => r.value === watch("type"))?.label}
									</Label>
								</div>
								<div className="flex flex-auto flex-row-reverse">
									<button
										ref={refSubmit}
										className={cn(
											"ml-2 flex h-16 min-w-[150px] cursor-pointer items-center justify-center rounded border border-teal-500 bg-teal-500 px-4 py-2 text-lg font-semibold  text-white  transition duration-200 ease-in-out focus:outline-none  enabled:hover:bg-teal-400",
											isPending &&
												"cursor-not-allowed border-gray-400 bg-gray-100 text-gray-700",
										)}
										onClick={form.handleSubmit(onSubmit)}
										disabled={isPending}
									>
										{isPending
											? "Submitting Registration"
											: "Submit Registration"}
										{isPending && (
											<Icons.spinner className="ml-2 h-8 w-8 animate-spin" />
										)}
									</button>
								</div>
							</div>
						)}
					</div>

					<RHFDevTool control={form.control} />
				</div>
			</div>
		</div>
	);
}
