"use client"

import React from 'react'
import { useTheme } from 'next-themes'
import { ISelectDropdownOptions } from '@/types/entities'
import { cn } from '@/utils/utils'
import Select, { ActionMeta, SingleValue } from 'react-select'

interface ICustomSingleSelectProps<TValue extends string = string> {
	name?: string
	value?: ISelectDropdownOptions<TValue> | null
	defaultValue?: ISelectDropdownOptions<TValue> | null
	options: ISelectDropdownOptions<TValue>[]
	onChange?: (
		newValue: SingleValue<ISelectDropdownOptions<TValue>>,
		actionMeta: ActionMeta<ISelectDropdownOptions<TValue>>
	) => void
	onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
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
	emptyOptionsMessage?: string
	onInputChange?: (inputValue: string) => void
	menuPlacement?: 'auto' | 'bottom' | 'top'
}

function CustomSingleSelectInput<TValue extends string = string>(
	props: ICustomSingleSelectProps<TValue>
): React.ReactElement {
	const {
		name,
		value,
		defaultValue,
		options,
		onChange,
		onBlur,
		height = 40,
		label = 'Select',
		placeholder = 'Select...',
		errorMessage,
		onInputChange,
		isRequired = false,
		isDisabled = false,
		isLoading = false,
		isInvalid = false,
		isClearable = true,
		isSearchable = true,
		emptyOptionsMessage = 'No options found',
		menuPlacement = 'bottom',
	} = props

	const { resolvedTheme } = useTheme()
	const isDark = resolvedTheme === 'dark'

	const controlBg    = isDark ? '#27272a' : '#ffffff'
	const menuBg       = isDark ? '#1c1c1f' : '#ffffff'
	const optionBg     = isDark ? '#27272a' : '#ffffff'
	const optionHover  = isDark ? '#3f3f46' : '#f4f4f5'
	const optionSel    = isDark ? '#624AB1' : '#624AB1'
	const textColor    = isDark ? '#e4e4e7' : '#303030'
	const borderColor  = isInvalid ? '#ef4444' : isDark ? '#3f3f46' : '#d4d4d8'
	const borderHover  = isInvalid ? '#ef4444' : isDark ? '#52525b' : '#a1a1aa'
	const placeholderC = isDark ? '#71717a' : '#a1a1aa'

	return (
		<div>
			{label && (
				<label
					className={cn(
						'block text-left mb-1 text-sm font-medium text-slateGray',
						isDisabled && 'text-zinc-400',
						isInvalid && 'text-red-500'
					)}
				>
					{label} {!isDisabled && isRequired && <span className="text-red-500">*</span>}
				</label>
			)}

			<Select
				className="text-start cursor-pointer"
				defaultValue={defaultValue}
				isClearable={isClearable}
				isDisabled={isDisabled}
				isLoading={isLoading}
				isMulti={false}
				isSearchable={isSearchable}
				menuPlacement={menuPlacement}
				name={name}
				noOptionsMessage={() => emptyOptionsMessage}
				options={options}
				placeholder={placeholder}
				styles={{
					control: (provided, state) => ({
						...provided,
						height: `${height}px`,
						minHeight: `${height}px`,
						borderRadius: '8px',
						cursor: 'pointer',
						backgroundColor: controlBg,
						paddingLeft: '6px',
						border: `1px solid ${state.isFocused ? '#624AB1' : borderColor}`,
						boxShadow: state.isFocused ? '0 0 0 1px #624AB1' : 'none',
						':hover': { borderColor: borderHover },
					}),
					menuList: (provided) => ({ ...provided, cursor: 'pointer', padding: '4px' }),
					menu: (provided) => ({
						...provided,
						backgroundColor: menuBg,
						border: `1px solid ${isDark ? '#3f3f46' : '#e4e4e7'}`,
						boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
						borderRadius: '8px',
						zIndex: 99,
					}),
					option: (provided, state) => ({
						...provided,
						textTransform: 'capitalize',
						cursor: 'pointer',
						borderRadius: '6px',
						backgroundColor: state.isSelected
							? optionSel
							: state.isFocused
							? optionHover
							: optionBg,
						color: state.isSelected ? '#ffffff' : textColor,
					}),
					singleValue: (provided) => ({ ...provided, color: textColor }),
					input: (provided) => ({ ...provided, color: textColor }),
					placeholder: (provided) => ({ ...provided, color: placeholderC }),
					indicatorSeparator: (provided) => ({ ...provided, display: 'none' }),
					dropdownIndicator: (provided) => ({
						...provided,
						color: isDark ? '#71717a' : '#a1a1aa',
					}),
					clearIndicator: (provided) => ({
						...provided,
						color: isDark ? '#71717a' : '#a1a1aa',
						':hover': { color: isDark ? '#e4e4e7' : '#303030' },
					}),
				}}
				value={value}
				onBlur={onBlur}
				onChange={onChange}
				onInputChange={(inputValue, actionMeta) => {
					if (actionMeta.action === 'input-change' && onInputChange) {
						onInputChange(inputValue)
					}
				}}
			/>
			{isInvalid && errorMessage && (
				<span className="text-red-500 font-semibold text-xs">{errorMessage}</span>
			)}
		</div>
	)
}

export default CustomSingleSelectInput
