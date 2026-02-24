import { forwardRef, useState } from 'react'
import { Input } from '@heroui/react'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import type { ValidationError } from '@react-types/shared'

import CustomButton from './CustomButton'

interface ICustomInputProps {
	label?: React.ReactNode
	placeholder?: string
	name?: string
	value?: string
	type?: string
	labelPlacement?: 'outside' | 'outside-left' | 'inside'
	radius?: 'sm' | 'md' | 'lg' | 'none' | 'full'
	size?: 'sm' | 'md' | 'lg'
	variant?: 'flat' | 'faded' | 'bordered' | 'underlined'
	className?: string
	startContent?: React.ReactNode // INFO: Add start icon like +91, $, ₹ etc.
	endContent?: React.ReactNode // INFO: Add password toggle icon
	description?: React.ReactNode // INFO: Add description below input like how many characters left
	errorMessage?: React.ReactNode // INFO: Provide regex pattern to validate automatically
	pattern?: string // INFO: Provide regex pattern to validate automatically
	validate?: (value: string) => true | ValidationError | null | undefined // INFO: Validate manually

	onChange?: React.ChangeEventHandler<HTMLInputElement>
	onValueChange?: (value: string) => void
	onBlur?: React.FocusEventHandler<HTMLInputElement> & ((e: React.FocusEvent<HTMLInputElement, Element>) => void)
	isClearable?: boolean
	isInvalid?: boolean
	isRequired?: boolean
	isPassword?: boolean

	min?: number | string
	max?: number | string
}

const CustomInput = forwardRef<HTMLInputElement, ICustomInputProps>((props, ref) => {
	const {
		label,
		placeholder = 'Enter text',
		name,
		value,
		type,
		labelPlacement = 'outside',
		radius,
		size,
		variant = 'bordered',
		className,
		startContent,
		endContent,
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
		isPassword,
		min,
		max
	} = props

	const [showPassword, setShowPassword] = useState(false)

	const togglePasswordVisibility = () => setShowPassword(prev => !prev)

	return (
		<Input
			ref={ref}
			className={className}
			classNames={{ input: 'focus:outline-none focus:ring-0' }}
			description={description}
			endContent={
				isPassword ? (
					<CustomButton
						className="min-w-0 h-auto px-1"
						rightIcon={showPassword ? <AiFillEyeInvisible size={18} /> : <AiFillEye size={18} />}
						text={undefined}
						type="button"
						variant="light"
						onPress={togglePasswordVisibility}
					/>
				) : (
					endContent
				)
			}
			errorMessage={errorMessage}
			isClearable={isClearable}
			isInvalid={isInvalid}
			isRequired={isRequired}
			label={label}
			labelPlacement={labelPlacement}
			max={max}
			min={min}
			name={name}
			pattern={pattern}
			placeholder={placeholder}
			radius={radius}
			size={size}
			startContent={startContent}
			type={isPassword ? (showPassword ? 'text' : 'password') : type}
			validate={validate}
			value={value}
			variant={variant}
			onBlur={onBlur}
			onChange={onChange}
			onValueChange={onValueChange}
		/>
	)
})

CustomInput.displayName = 'CustomInput'

export default CustomInput
