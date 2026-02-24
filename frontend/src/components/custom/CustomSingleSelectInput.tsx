'use client'

import Select from 'react-select'
import type { ActionMeta, SingleValue } from 'react-select'
import { cn } from '@heroui/theme'

import colors from '@/theme/colors'
import type { ISelectDropdownOptions } from '@/types/common'

interface ICustomSingleSelectProps {
	name?: string
	value?: ISelectDropdownOptions | null
	defaultValue?: ISelectDropdownOptions | null
	options: ISelectDropdownOptions[]
	onChange?: (newValue: SingleValue<ISelectDropdownOptions>, actionMeta: ActionMeta<ISelectDropdownOptions>) => void
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
	backgroundColor?: string
	emptyOptionsMessage?: string
	onInputChange?: (inputValue: string) => void
	menuPlacement?: 'auto' | 'bottom' | 'top'
}

const CustomSingleSelectInput = (props: ICustomSingleSelectProps) => {
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
		backgroundColor = colors.white,
		emptyOptionsMessage = 'No options found',
		menuPlacement = 'bottom'
	} = props

	return (
		<div className="">
			{label && (
				<label
					className={cn(
						'block text-left mb-1 text-slateGray',
						{
							'text-dis-gray': isDisabled
						},
						isInvalid && ` ${colors.red}`
					)}
				>
					{label} {!isDisabled && isRequired && <span className="text-danger">*</span>}
				</label>
			)}

			<Select
				className="text-start cursor-pointer custom-scrollbar"
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
						borderRadius: '10px',
						cursor: 'pointer',
						backgroundColor: backgroundColor,
						paddingLeft: '10px',
						border: isInvalid ? `1px solid ${colors.red}` : `1px solid ${colors.lightGray}`,
						':hover': {
							border: `2px solid ${colors['gray']}`
						}
					}),
					menuList: provided => ({ ...provided, cursor: 'pointer' }),
					menu: provided => ({
						...provided,
						backgroundColor: colors.white,
						color: colors['slateGray'],
						cursor: 'pointer',
						zIndex: 99
					}),
					option: provided => ({
						...provided,
						textTransform: 'capitalize',
						cursor: 'pointer'
					}),
					placeholder: provided => ({
						...provided,
						color: colors['gray']
					}),
					indicatorSeparator: provided => ({ ...provided, display: 'none' })
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
			{isInvalid && errorMessage && <span className="text-danger font-semibold text-[12px]">{errorMessage}</span>}
		</div>
	)
}

export default CustomSingleSelectInput