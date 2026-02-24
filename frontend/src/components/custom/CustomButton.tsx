'use client'

import React from 'react'
import { Button, cn } from '@heroui/react'

interface ICustomButtonProps {
	text: string | React.ReactNode
	type?: 'button' | 'submit' | 'reset'
	color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
	className?: string
	variant?: 'solid' | 'bordered' | 'light' | 'flat' | 'faded' | 'shadow' | 'ghost'
	radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
	onPress?: () => void
	isLoading?: boolean
	isDisabled?: boolean
	leftIcon?: React.ReactNode
	rightIcon?: React.ReactNode
}

const CustomButton = (props: ICustomButtonProps) => {
	const {
		className,
		text,
		type,
		color,
		variant = 'solid',
		radius,
		onPress,
		isLoading,
		isDisabled,
		leftIcon,
		rightIcon
	} = props

	return (
		<Button
			className={cn(
				'h-9 rounded-md flex items-center justify-center gap-2',
				className,
				variant === 'solid' && 'bg-themeColor text-white'
			)}
			color={color}
			isDisabled={isDisabled}
			isLoading={isLoading}
			radius={radius}
			type={type}
			variant={variant}
			onPress={onPress}
		>
			{leftIcon && <span className="flex items-center">{leftIcon}</span>}
			{text}
			{rightIcon && <span className="flex items-center">{rightIcon}</span>}
		</Button>
	)
}

export default CustomButton