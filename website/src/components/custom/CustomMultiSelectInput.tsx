import React from 'react'
import Select, { components } from 'react-select'
import type { ActionMeta, MultiValue, ValueContainerProps } from 'react-select'
import { cn } from '@heroui/theme'

import colors from '@/theme/colors'
import type { ISelectDropdownOptions } from '@/types/common'

interface ICustomMultiSelectProps {
	value?: ISelectDropdownOptions[] | null
	options: ISelectDropdownOptions[]
	onChange?: (newValue: MultiValue<ISelectDropdownOptions>, actionMeta: ActionMeta<ISelectDropdownOptions>) => void
	placeholder?: string
	label?: string
	height?: number
	errorMessage?: string
	isRequired?: boolean
	isLoading?: boolean
	isDisabled?: boolean
	isClearable?: boolean
	isSearchable?: boolean
	isInvalid?: boolean
	backgroundColor?: string
	labelClassName?: string
	placeholderFontSize?: string
	visibleValue?: number
}
interface ICustomValueContainerProps extends ValueContainerProps<ISelectDropdownOptions> {
	visibleValue: number
}

const ValueContainer = (props: ICustomValueContainerProps) => {
	const { children, getValue, hasValue, visibleValue } = props
	const value = getValue()
	const visibleValues = value.slice(0, visibleValue)
	const hiddenValues = value.slice(visibleValue)

	const renderContent = () => {
		if (!hasValue) return children

		return (
			<>
				{visibleValues.map((_, index) => (
					<span key={index} className="w-1/2">
						{React.Children.toArray(children)[index]}
					</span>
				))}
				{hiddenValues.length > 0 && (
					<span className="ml-2 px-2 py-1 text-xs text-steel-gray bg-white border border-steel-gray rounded">
						& {hiddenValues.length} more
					</span>
				)}
			</>
		)
	}

	return <components.ValueContainer {...props}>{renderContent()}</components.ValueContainer>
}

const CustomMultiSelectInput = (props: ICustomMultiSelectProps) => {
	const {
		value,
		options,
		onChange,
		height = 40,
		label = 'Select',
		placeholder = 'Select...',
		errorMessage,
		isRequired = false,
		isDisabled = false,
		isLoading = false,
		isInvalid = false,
		isClearable = true,
		isSearchable = true,
		backgroundColor = colors.white,
		labelClassName,
		placeholderFontSize = '14px',
		visibleValue = 1
	} = props

	return (
		<div className="">
			{label && (
				<label
					className={cn(
						'block text-left mb-1 text-slateGray',
						labelClassName,
						{
							'text-dis-gray': isDisabled
						},
						isInvalid && 'text-red'
					)}
				>
					{label} {!isDisabled && isRequired && <span className="text-danger">*</span>}
				</label>
			)}

			<Select
				className="text-start cursor-pointer z-50 custom-scrollbar"
				components={{
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					ValueContainer: (props: any) => <ValueContainer {...props} visibleValue={visibleValue} />
				}}
				isClearable={isClearable}
				isDisabled={isDisabled}
				isLoading={isLoading}
				isMulti={true}
				isSearchable={isSearchable}
				options={options}
				placeholder={placeholder}
				styles={{
					control: provided => ({
						...provided,
						minHeight: `${height}px`,
						borderRadius: '10px',
						cursor: 'pointer',
						backgroundColor: backgroundColor,
						border: isInvalid ? `1px solid ${colors.red}` : `1px solid ${colors.lightGray}`,
						':hover': {
							border: `2px solid ${colors['gray']}`
						}
					}),
					menuList: provided => ({ ...provided, cursor: 'pointer' }),
					indicatorSeparator: provided => ({ ...provided, display: 'none' }),
					menu: provided => ({
						...provided,
						backgroundColor: colors.white,
						color: colors['slateGray'],
						cursor: 'pointer'
					}),
					option: provided => ({
						...provided,
						cursor: 'pointer'
					}),
					placeholder: provided => ({
						...provided,
						fontSize: placeholderFontSize,
						color: colors['gray']
					})
				}}
				value={value}
				onChange={onChange}
			/>

			{isInvalid && errorMessage && <span className="text-danger text-[12px] font-semibold">{errorMessage}</span>}
		</div>
	)
}

export default CustomMultiSelectInput
