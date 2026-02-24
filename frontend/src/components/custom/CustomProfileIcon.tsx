'use client'

import { User } from '@heroui/react'

interface ICustomProfileIconProps {
	src: string
	description?: string
	name?: string
	showFallback?: boolean
	CustomFallback?: React.ReactNode
	classNames?: Partial<Record<'base' | 'wrapper' | 'name' | 'description', string>>
	className?: string
}

const CustomProfileIcon = (props: ICustomProfileIconProps) => {
	const { src, description, name, showFallback = true, CustomFallback, classNames, className } = props
	const userName = name?.split(' ')

	// INFO: If the last name is present, show only the first letter otherwise show the first two letters
	const firstName = userName?.[0]?.slice(0, userName?.[1] ? 1 : 2)
	const lastName = userName?.[1]?.slice(0, 1) // INFO: Show only the first letter of last name

	return (
		<User
			avatarProps={{
				src,
				showFallback,
				fallback: CustomFallback || <span className="text-lg font-bold">{`${firstName}${lastName}`}</span>,
				className: className
			}}
			classNames={classNames}
			description={description}
			name={name}
		/>
	)
}

export default CustomProfileIcon