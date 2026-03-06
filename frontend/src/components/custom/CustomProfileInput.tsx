'use client'

import React, { useEffect, useState } from 'react'
import { FiUpload, FiX } from 'react-icons/fi'
import { cn, Image } from '@heroui/react'

import colors from '@/theme/colors'

interface ICustomProfileInputProps {
	label: string
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
	onRemove?: () => void
}

const CustomProfileInput = (props: ICustomProfileInputProps) => {
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
		radius = 'full',
		size = 'md',
		errorMessage,
		isInvalid,
		// TODO: isLoading,
		onRemove
	} = props

	const [previewUrl, setPreviewUrl] = useState<string | null>(null)

	useEffect(() => {
		let url: string | null = null

		if (value) {
			if (value instanceof File && value.type.startsWith('image/')) {
				url = URL.createObjectURL(value)
			} else if (typeof value === 'string') {
				url = value
			}
			setPreviewUrl(url)
		} else {
			setPreviewUrl(null)
		}

		return () => {
			if (value instanceof File && url) {
				URL.revokeObjectURL(url)
			}
			setPreviewUrl(null)
		}
	}, [value])

	const displayName = value
		? value instanceof File
			? value.name.length > 17
				? value.name.substring(0, 17) + '...'
				: value.name
			: 'Profile Pic'
		: 'Profile Pic'

	const sizeMap: Record<string, string> = {
		sm: '56px',
		md: '80px',
		lg: '96px',
		xl: '112px'
	}
	const circleSize = sizeMap[size] || sizeMap.md

	return (
		<div className={cn('flex flex-col', className)}>
			{label && (
				<label
					className={cn('block text-left mb-1', {
						'text-xs': size === 'sm',
						'text-sm': size === 'md',
						'text-md': size === 'lg',
						'text-lg': size === 'xl'
					})}
					htmlFor={name}
					style={{ color: isInvalid ? colors.red : colors.slateGray }}
				>
					{label} {isRequired && <span className="text-danger">*</span>}
				</label>
			)}

			<div
				className={cn(
					'relative flex items-center justify-center border border-lightGray shadow-sm bg-white transition hover:bg-lightGray hover:border-gray',
					{
						'opacity-50 cursor-not-allowed': isDisabled,
						'rounded-full': radius === 'full',
						'rounded-lg': radius === 'lg',
						'rounded-md': radius === 'md',
						'rounded-sm': radius === 'sm',
						'rounded-none': radius === 'none'
					}
				)}
				style={{ width: circleSize, height: circleSize }}
			>
				{previewUrl ? (
					<>
						<Image alt="preview" className="w-full h-full object-cover rounded-full" src={previewUrl} />
						{/* Remove button is above everything */}
						<button
							aria-label="Remove image"
							className="absolute top-1 right-1 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-1 flex items-center justify-center"
							style={{ width: 24, height: 24 }}
							type="button"
							onClick={e => {
								e.stopPropagation()
								e.preventDefault()
								if (onRemove) onRemove()
							}}
						>
							<FiX size={16} />
						</button>
					</>
				) : (
					<div className="flex flex-col items-center justify-center gap-1 text-gray">
						<FiUpload size={24} />
						<span className="line-clamp-1 text-center text-sm">{displayName}</span>
					</div>
				)}

				{/* Place input last in DOM so it's behind the button */}
				<input
					accept={accept}
					className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-0"
					disabled={isDisabled}
					id={name}
					name={name}
					required={isRequired}
					type="file"
					onBlur={onBlur}
					onChange={onChange}
				/>
			</div>

			{description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
			{isInvalid && <p className="text-xs text-red mt-1">{errorMessage}</p>}
		</div>
	)
}

export default CustomProfileInput