"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { ChevronsUpDown } from "lucide-react";

// import type { CreateApiKey } from '@acme/api/validators'
// import { createApiKeySchema } from '@acme/api/validators'
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useZodForm } from "@/lib/zod-form";
import { useToast } from "@/components/ui/use-toast";
import { CreateApiKeyDto, createApiKeySchema } from "@/lib/schema";
import { useState, useTransition } from "react";
// import { createApiKey } from '@/actions/api-key'
import { Icons } from "@/components/shared/icons";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

import { LocationEntity } from "@/actions/location";

const optExpiresIn = [
	{ label: "4h", value: "4h" },
	{ label: "8h", value: "8h" },
	{ label: "12h", value: "12h" },
	{ label: "24h", value: "24h" },
	{ label: "2d", value: "2d" },
	{ label: "5d", value: "5d" },
	{ label: "1w", value: "1w" },
] as const;

type ApiKeyFormProps = { locationData: LocationEntity[] };

export function ApiKeyForm(props: ApiKeyFormProps) {
	const { locationData } = props;

	const toaster = useToast();
	const pathname = usePathname();
	const router = useRouter();
	const params = useParams();

	if (!params) return null;

	const { businessId } = params as { businessId: string };

	const [isPosting, setIsPosting] = useTransition();

	const [dialogOpen, setDialogOpen] = useState(false);

	const form = useZodForm({
		schema: createApiKeySchema,
		defaultValues: { name: "", businessId, expiresIn: "24h" },
	});

	function onSubmit(data: CreateApiKeyDto) {
		try {
			setIsPosting(async () => {
				// await createApiKey(data, { pathname: pathname! })

				form.reset();
				router.refresh();
				setDialogOpen(false);

				toaster.toast({
					title: "API Key Created",
					description: `API Key '${data.name}' created successfully.`,
				});
			});
		} catch (error) {
			toaster.toast({
				title: "Error creating API Key",
				variant: "destructive",
				description:
					"An issue occurred while creating your key. Please try again.",
			});
		}
	}

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button>Create API Key</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create API Key</DialogTitle>
					<DialogDescription>
						Fill out the form to create an API key.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name *</FormLabel>
									<FormControl>
										<Input {...field} placeholder="Token Name" />
									</FormControl>
									<FormDescription>
										Enter a name for your token to differentiate it from other
										tokens.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="locationId"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>For Location</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant="outline"
													role="combobox"
													className={cn(
														"w-[200px] justify-between",
														!field.value && "text-muted-foreground",
													)}
												>
													{field.value
														? locationData.find((loc) => loc.id === field.value)
																?.name
														: "Select location"}
													<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-[200px] p-0">
											<Command>
												<CommandInput placeholder="Search location..." />
												<CommandEmpty>No location found.</CommandEmpty>
												<CommandGroup>
													{locationData.map((loc) => (
														<CommandItem
															value={loc.name}
															key={loc.id}
															onSelect={() => {
																form.setValue("locationId", loc.id);
															}}
														>
															<Check
																className={cn(
																	"mr-2 h-4 w-4",
																	loc.id === field.value
																		? "opacity-100"
																		: "opacity-0",
																)}
															/>
															{loc.name}
														</CommandItem>
													))}
												</CommandGroup>
											</Command>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="expiresIn"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Expires in</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant="outline"
													role="combobox"
													className={cn(
														"w-[200px] justify-between",
														!field.value && "text-muted-foreground",
													)}
												>
													{field.value
														? optExpiresIn.find(
																(expIn) => expIn.value === field.value,
															)?.label
														: "Select expiration"}
													<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-[200px] p-0">
											<Command>
												<CommandInput placeholder="Search expiration..." />
												<CommandEmpty>No expiration found.</CommandEmpty>
												<CommandGroup>
													{optExpiresIn.map((expIn) => (
														<CommandItem
															value={expIn.label}
															key={expIn.value}
															onSelect={() => {
																form.setValue("expiresIn", expIn.value);
															}}
														>
															<Check
																className={cn(
																	"mr-2 h-4 w-4",
																	expIn.value === field.value
																		? "opacity-100"
																		: "opacity-0",
																)}
															/>
															{expIn.label}
														</CommandItem>
													))}
												</CommandGroup>
											</Command>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end">
							<Button type="submit" disabled={isPosting}>
								{isPosting && (
									<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
								)}
								Create API Key
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
