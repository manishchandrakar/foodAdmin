import React from 'react'
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

	return (
		<div>
			{label && (
				<label
					className={cn(
						'block text-left mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300',
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
					control: provided => ({
						...provided,
						height: `${height}px`,
						borderRadius: '8px',
						cursor: 'pointer',
						backgroundColor: 'var(--color-background, #fff)',
						paddingLeft: '10px',
						border: isInvalid ? '1px solid #ef4444' : '1px solid #d4d4d8',
						':hover': { border: '2px solid #a1a1aa' },
					}),
					menuList: provided => ({ ...provided, cursor: 'pointer' }),
					menu: provided => ({
						...provided,
						backgroundColor: 'var(--color-background, #fff)',
						color: '#71717a',
						cursor: 'pointer',
						zIndex: 99,
					}),
					option: provided => ({
						...provided,
						textTransform: 'capitalize',
						cursor: 'pointer',
					}),
					placeholder: provided => ({ ...provided, color: '#a1a1aa' }),
					indicatorSeparator: provided => ({ ...provided, display: 'none' }),
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
