'use client'

import { Avatar, cn } from '@heroui/react'

interface ICustomAvatarProps {
	uri: string
	className?: string
	size?: 'sm' | 'md' | 'lg'
}

const CustomAvatar = (props: ICustomAvatarProps) => {
	const { uri, className, size } = props

	return <Avatar className={cn(className)} size={size} src={uri} />
}

export default CustomAvatar