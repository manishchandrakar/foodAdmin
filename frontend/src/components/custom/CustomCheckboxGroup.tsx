'use client'

import { CheckboxGroup, Checkbox } from '@heroui/react'

import type { ISelectDropdownOptions } from '@/types/common'

interface ICustomCheckboxGroupProps {
	label?: string
	options: ISelectDropdownOptions[]
	defaultValue?: string[]
	value?: string[]
	onChange?: (value: string[]) => void
	color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
	size?: 'sm' | 'md' | 'lg'
	orientation?: 'vertical' | 'horizontal'
	radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
	isInvalid?: boolean
	isDisabled?: boolean
	isRequired?: boolean
	isReadOnly?: boolean
	lineThrough?: boolean
	className?: string
	name?: string
}

const CustomCheckboxGroup = (props: ICustomCheckboxGroupProps) => {
	const {
		label,
		options,
		defaultValue,
		value,
		onChange,
		color = 'primary',
		size = 'md',
		orientation,
		radius,
		isInvalid,
		isDisabled,
		isRequired,
		isReadOnly,
		lineThrough,
		className,
		name
	} = props

	return (
		<CheckboxGroup
			className={className}
			color={color}
			defaultValue={defaultValue}
			isDisabled={isDisabled}
			isInvalid={isInvalid}
			isReadOnly={isReadOnly}
			isRequired={isRequired}
			label={label}
			name={name}
			orientation={orientation}
			radius={radius}
			size={size}
			value={value}
			onChange={onChange}
		>
			{options.map(option => (
				<Checkbox key={option.value} className={lineThrough ? 'line-through' : ''} value={option.value}>
					{option.label}
				</Checkbox>
			))}
		</CheckboxGroup>
	)
}

export default CustomCheckboxGroup