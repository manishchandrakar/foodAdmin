import { forwardRef } from 'react'
import { Checkbox } from '@heroui/react'

interface ICustomCheckboxProps {
	children?: React.ReactNode
	icon?: React.ReactNode
	value?: string
	name?: string
	size?: 'sm' | 'md' | 'lg'
	color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
	radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
	lineThrough?: boolean
	isSelected?: boolean
	defaultSelected?: boolean
	isRequired?: boolean
	isReadOnly?: boolean
	isDisabled?: boolean
	isIndeterminate?: boolean
	isInvalid?: boolean
	disableAnimation?: boolean
	className?: string
	classNames?: Partial<Record<'base' | 'wrapper' | 'icon' | 'label', string>>

	onChange?: React.ChangeEventHandler<HTMLInputElement>
	onValueChange?: (isSelected: boolean) => void
}

const CustomCheckbox = forwardRef<HTMLInputElement, ICustomCheckboxProps>((props, ref) => {
	const {
		children,
		icon,
		value,
		name,
		size = 'md',
		color = 'primary',
		radius,
		lineThrough = false,
		isSelected,
		defaultSelected,
		isRequired = false,
		isReadOnly,
		isDisabled = false,
		isIndeterminate,
		isInvalid,
		disableAnimation = false,
		className,
		classNames,
		onChange,
		onValueChange
	} = props

	return (
		<Checkbox
			ref={ref}
			className={className}
			classNames={classNames}
			color={color}
			defaultSelected={defaultSelected}
			disableAnimation={disableAnimation}
			icon={icon}
			isDisabled={isDisabled}
			isIndeterminate={isIndeterminate}
			isInvalid={isInvalid}
			isReadOnly={isReadOnly}
			isRequired={isRequired}
			isSelected={isSelected}
			lineThrough={lineThrough}
			name={name}
			radius={radius}
			size={size}
			value={value}
			onChange={onChange}
			onValueChange={onValueChange}
		>
			{children}
		</Checkbox>
	)
})

CustomCheckbox.displayName = 'CustomCheckbox'

export default CustomCheckbox
