import dynamic from "next/dynamic";
import Link from "next/link";
import { siteConfig } from "@/app/config";
import { cn } from "@/lib/utils";

import Logo from "./logo";

export default function SiteFooter({
	className,
}: React.HTMLAttributes<HTMLElement>) {
	return (
		<footer className="z-50 bg-teal-600">
			<div className="mx-auto w-full px-4 py-10 sm:px-6 lg:px-8 lg:pt-20 2xl:px-20">
				<div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-5">
					<div className="col-span-full lg:col-span-1">
						<Logo textSize="text-lg" />
						<span className="flex flex-col">
							<span className="hidden text-sm font-bold tracking-[-0.03em] text-white sm:block">
								{siteConfig.name}
							</span>
							<span className="hidden text-sm font-normal tracking-[-0.03em] text-white sm:block">
								{siteConfig.description}
							</span>
						</span>
					</div>

					<div className="col-span-1">
						<h4 className="font-bold text-white">Our Works</h4>

						<div className="mt-3 grid space-y-3">
							<p>
								<a
									className="inline-flex gap-x-2 text-white hover:text-gray-200"
									href="/event"
								>
									Event
								</a>
							</p>
							<p>
								<a
									className="inline-flex gap-x-2 text-white hover:text-gray-200"
									href="/news"
								>
									News
								</a>
							</p>
							<p>
								<a
									className="inline-flex gap-x-2 text-white hover:text-gray-200"
									href="/convention"
								>
									Convention
								</a>
							</p>
						</div>
					</div>

					<div className="col-span-1">
						<h4 className="font-bold text-gray-100">Why DSAP?</h4>

						<div className="mt-3 grid space-y-3">
							<p>
								<a
									className="inline-flex gap-x-2 text-white hover:text-gray-200"
									href="/about-us"
								>
									About us
								</a>
							</p>
							<p>
								<a
									className="inline-flex gap-x-2 text-white hover:text-gray-200"
									href="/contact-us"
								>
									Contact us
								</a>
							</p>
							<p>
								<a
									className="inline-flex gap-x-2 text-white hover:text-gray-200"
									href="/membership"
								>
									Become a member
								</a>
								{/* <span className='ml-1 inline rounded-md bg-teal-500 px-2 py-1 text-xs text-white'>Check here</span> */}
							</p>
						</div>
					</div>

					<div className="col-span-2">
						<h4 className="font-bold text-white">Stay up to date</h4>

						<form>
							<div className="mt-4 flex flex-col items-center gap-2 rounded-md bg-white p-2 sm:flex-row sm:gap-3">
								<div className="w-full">
									<label htmlFor="hero-input" className="sr-only">
										Search
									</label>
									<input
										type="text"
										id="hero-input"
										name="hero-input"
										className="block w-full rounded-md border-transparent px-4 py-3 shadow-sm focus:z-10 focus:border-teal-500 focus:ring-blue-500"
										placeholder="Enter your email"
									/>
								</div>
								<a
									className="inline-flex w-full items-center justify-center gap-x-3 whitespace-nowrap rounded-md border border-transparent bg-teal-500 px-4 py-3 text-center font-medium text-white transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-white sm:w-auto"
									href="/contact-us"
								>
									Subscribe
								</a>
							</div>
						</form>
					</div>
				</div>

				<div className="mt-5 grid gap-y-2 sm:mt-12 sm:flex sm:items-center sm:justify-between sm:gap-y-0">
					<div className="flex items-center space-x-1 text-sm text-white sm:justify-between">
						<p>Made with ❤️ by</p>
						<a href={siteConfig.url.developer} target="_blank" rel="noreferrer">
							TheBoredGuys Corp.
						</a>
					</div>

					<div>
						<a
							className="inline-flex h-10 w-10 items-center justify-center gap-x-3.5 rounded-md text-center text-gray-200 transition hover:bg-white/[.1] focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 focus:ring-offset-teal-600"
							href="/contact-us"
						>
							{/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
							<svg
								className="h-4 w-4"
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								viewBox="0 0 16 16"
							>
								<path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
							</svg>
						</a>
						<a
							className="inline-flex h-10 w-10 items-center justify-center gap-x-3.5 rounded-md text-center text-gray-200 transition hover:bg-white/[.1] focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 focus:ring-offset-teal-600"
							href="/contact-us"
						>
							{/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
							<svg
								className="h-4 w-4"
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								viewBox="0 0 16 16"
							>
								<path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
							</svg>
						</a>
						<a
							className="inline-flex h-10 w-10 items-center justify-center gap-x-3.5 rounded-md text-center text-gray-200 transition hover:bg-white/[.1] focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 focus:ring-offset-teal-600"
							href="/contact-us"
						>
							{/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
							<svg
								className="h-4 w-4"
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								viewBox="0 0 16 16"
							>
								<path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
							</svg>
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
