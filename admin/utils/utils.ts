import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export const isObjectEmpty = (obj: unknown): boolean => {
	return !obj || (typeof obj === 'object' && Object.keys(obj || {}).length === 0)
}

export const isArrayEmpty = (arr: unknown): boolean => {
	return !arr || (Array.isArray(arr) && arr.length === 0)
}

// INFO:- utils to check if key is valid in the object
export const isValidKey = (key: string, obj: object): key is keyof typeof obj => key in obj

// INFO:- Format a given size in bytes to a human-readable format like KB and MB.
export const formatSize = (size: number): string => {
	if (size < 1024) return `${size} bytes`
	if (size < 1048576) return `${(size / 1024).toFixed(2)} KB`

	return `${(size / 1048576).toFixed(2)} MB`
}

export const formatNumberToRupees = (amount: string | number): string => {
	const num = Number(amount)

	if (Number.isNaN(num)) return '₹0'

	const formattedNum = num.toLocaleString('en-IN', {
		maximumFractionDigits: 2,
		minimumFractionDigits: 2
	})

	return `₹${formattedNum}`
}

export const sleep = (time: number) => new Promise(resolve => setTimeout(resolve, time))

// INFO:- use cases
// INFO: concatStrings('hello', 'world') // 'hello world'
// INFO: concatStrings('hello', '', 'world') // 'hello world'
// INFO: concatStrings('hello', null, 'world') // 'hello world'
// INFO: concatStrings('hello', undefined, 'world') // 'hello world'
// INFO: concatStrings('hello', ' ', 'world') // 'hello world'
export const concatStrings = (...strings: string[]): string => {
	return strings
		.filter(Boolean)
		.map(str => `${str}`.trim())
		.join(' ')
		.trim()
}

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

// Extract readable messages from a Zod .format() error object
const extractZodErrors = (error: Record<string, unknown>): string => {
	const messages: string[] = []

	if (Array.isArray(error._errors) && error._errors.length > 0) {
		messages.push(...(error._errors as string[]))
	}

	for (const key of Object.keys(error)) {
		if (key === "_errors") continue
		const field = error[key] as Record<string, unknown>
		if (field && typeof field === "object" && Array.isArray(field._errors) && field._errors.length > 0) {
			;(field._errors as string[]).forEach((msg) => messages.push(`${key}: ${msg}`))
		}
	}

	return messages.length > 0 ? messages.join(" | ") : "Validation failed"
}

// Extract readable error message from axios errors or generic errors
export const getErrorMessage = (error: unknown): string => {
	if (typeof error === "object" && error !== null && "response" in error) {
		const res = (error as { response?: { data?: { error?: unknown; message?: string } } }).response
		if (res?.data?.error) {
			if (typeof res.data.error === "string") return res.data.error
			if (typeof res.data.error === "object" && res.data.error !== null) {
				return extractZodErrors(res.data.error as Record<string, unknown>)
			}
		}
		if (res?.data?.message) return res.data.message
	}
	if (error instanceof Error) return error.message
	return "Something went wrong"
}


