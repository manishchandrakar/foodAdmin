'use client'

import React, { useState, useEffect } from 'react'
import { FiUpload } from 'react-icons/fi'
import { Spinner, cn, Image } from '@heroui/react'

import colors from '@/theme/colors'

interface ICustomFileInputProps {
	label?: string
	name: string
	className?: string
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
	onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
	value?: File | null
	accept?: string
	description?: React.ReactNode
	isRequired?: boolean
	isDisabled?: boolean
	radius?: 'full' | 'lg' | 'md' | 'sm' | 'none'
	size?: 'lg' | 'md' | 'sm' | 'xl'
	errorMessage?: string
	isInvalid?: boolean
	isLoading?: boolean
	showPreview?: boolean
	previewSize?: number
	defaultImage?: string
}

const CustomFileInputs = (props: ICustomFileInputProps) => {
	const {
		label,
		name,
		className,
		onChange,
		onBlur,
		value,
		accept,
		description,
		isRequired = false,
		isDisabled = false,
		radius = 'md',
		size = 'md',
		errorMessage,
		isInvalid,
		isLoading,
		showPreview = false,
		previewSize = 160,
		defaultImage
	} = props

	const [filePreview, setFilePreview] = useState<string | null>(defaultImage || null)

	useEffect(() => {
		/* eslint-disable react-hooks/set-state-in-effect */
		if (value && showPreview) {
			const url = URL.createObjectURL(value)
			setFilePreview(url)
			return () => URL.revokeObjectURL(url)
		} else if (!value) {
			setFilePreview(defaultImage || null)
		}
		/* eslint-enable react-hooks/set-state-in-effect */
	}, [value, showPreview, defaultImage])

	const displayName = value
		? value.name.length > 17
			? value.name.substring(0, 17) + '...'
			: value.name
		: 'Click to upload'

	return (
		<div className={cn('flex flex-col gap-2', className)}>
			{showPreview && filePreview && (
				<div
					className="border border-themeColor p-2 rounded-lg overflow-hidden mt-2"
					style={{ width: previewSize, height: previewSize }}
				>
					<Image alt="Preview" className="object-contain w-full h-full" src={filePreview} />
				</div>
			)}
			{label && (
				<label
					className={cn('block text-left mb-1', {
						'text-xs': size === 'sm',
						'text-sm': size === 'md',
						'text-md': size === 'lg',
						'text-lg': size === 'xl'
					})}
					style={{ color: isInvalid ? colors.red : colors.slateGray }}
				>
					{label} {isRequired && <span className="text-danger">*</span>}
				</label>
			)}

			<div
				className={cn(
					`relative flex items-center justify-center border border-lightGray rounded-lg shadow-sm bg-white cursor-pointer transition hover:bg-lightGray hover:border-gray`,
					{
						'opacity-50 cursor-not-allowed': isDisabled,
						'rounded-full': radius === 'full',
						'rounded-lg': radius === 'lg',
						'rounded-md': radius === 'md',
						'rounded-sm': radius === 'sm',
						'rounded-none': radius === 'none'
					},
					{
						'h-8 text-xs': size === 'sm',
						'h-10 text-sm': size === 'md',
						'h-12 text-md': size === 'lg',
						'h-14 text-lg': size === 'xl'
					}
				)}
			>
				<input
					accept={accept}
					className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
					disabled={isDisabled}
					id={name}
					name={name}
					required={isRequired}
					type="file"
					onBlur={onBlur}
					onChange={onChange}
				/>
				{isLoading && <Spinner className="mr-2" size="sm" />}
				<div className="flex items-center justify-center gap-2 text-gray">
					<FiUpload />
					<span className="line-clamp-1">{displayName}</span>
				</div>
			</div>

			{description && <p className="text-xs text-gray-400">{description}</p>}
			{isInvalid && <p className="text-xs text-red">{errorMessage}</p>}
		</div>
	)
}

export default CustomFileInputs