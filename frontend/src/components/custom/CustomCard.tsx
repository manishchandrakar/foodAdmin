'use client'

import type { ReactNode } from 'react'

import { Card, CardHeader, CardBody, CardFooter } from '@heroui/react'

interface ICustomCardProps {
	header?: ReactNode
	body: ReactNode
	footer?: ReactNode
	className?: string
	headerClassName?: string
	bodyClassName?: string
	footerClassName?: string
}

const CustomCard = (props: ICustomCardProps) => {
	const { header, body, footer, className, headerClassName, bodyClassName, footerClassName } = props

	return (
		<Card className={className}>
			{header && <CardHeader className={headerClassName}>{header}</CardHeader>}
			<CardBody className={bodyClassName}>{body}</CardBody>
			{footer && <CardFooter className={footerClassName}>{footer}</CardFooter>}
		</Card>
	)
}

export default CustomCard