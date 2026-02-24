import { forwardRef } from 'react'
import { Textarea } from '@heroui/react'
import type { ValidationError } from '@react-types/shared'

interface ICustomTextareaProps {
	label?: React.ReactNode
	placeholder?: string
	name?: string
	value?: string
	labelPlacement?: 'outside' | 'outside-left' | 'inside'
	radius?: 'sm' | 'md' | 'lg' | 'none' | 'full'
	size?: 'sm' | 'md' | 'lg'
	variant?: 'flat' | 'faded' | 'bordered' | 'underlined'
	className?: string
	description?: React.ReactNode
	errorMessage?: React.ReactNode
	pattern?: string
	validate?: (value: string) => true | ValidationError | null | undefined
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
	onValueChange?: (value: string) => void
	onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
	isClearable?: boolean
	isInvalid?: boolean
	isRequired?: boolean
	isReadOnly?: boolean
	rows?: number
	maxLength?: number
	minLength?: number
}

const CustomTextarea = forwardRef<HTMLTextAreaElement, ICustomTextareaProps>((props, ref) => {
	const {
		placeholder = 'Enter text',
		name,
		value,
		label = 'Descriptions',
		labelPlacement = 'outside',
		radius,
		size,
		variant = 'bordered',
		className,
		description,
		errorMessage,
		pattern,
		validate,
		onValueChange,
		onBlur,
		onChange,
		isClearable,
		isInvalid,
		isRequired,
		isReadOnly,
		rows = 4,
		maxLength,
		minLength
	} = props

	return (
		<div>
			<Textarea
				ref={ref}
				className={className}
				classNames={{ input: 'focus:outline-none focus:ring-0' }}
				description={description}
				errorMessage={errorMessage}
				isClearable={isClearable}
				isInvalid={isInvalid}
				isReadOnly={isReadOnly}
				isRequired={isRequired}
				label={label}
				labelPlacement={labelPlacement}
				maxLength={maxLength}
				minLength={minLength}
				name={name}
				pattern={pattern}
				placeholder={placeholder}
				radius={radius}
				rows={rows}
				size={size}
				value={value}
				variant={variant}
				onBlur={onBlur}
				onChange={onChange}
				onValueChange={onValueChange}
				{...(validate && { validate })}
			/>
		</div>
	)
})

CustomTextarea.displayName = 'CustomTextarea'

export default CustomTextarea
