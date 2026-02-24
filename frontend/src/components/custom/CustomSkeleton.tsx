'use client'

import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card'
import { Skeleton } from '@heroui/skeleton'

const ServiceCardSkeleton = () => {
	return (
		<Card className="w-full shadow-lg rounded-2xl">
			{/* Header */}
			<CardHeader className="flex justify-between items-center p-4">
				<div className="flex items-center gap-2 w-full justify-between">
					<div className="flex items-center gap-2">
						{/* Active label */}
						<Skeleton className="h-4 w-14 rounded-md animate-pulse" />
						{/* Switch */}
						<Skeleton className="h-5 w-10 rounded-full animate-pulse" />
						{/* Delete icon */}
						<Skeleton className="h-6 w-6 rounded-full animate-pulse" />
					</div>
					{/* Edit button */}
					<Skeleton className="h-6 w-16 rounded-md animate-pulse" />
				</div>
			</CardHeader>

			{/* Body */}
			<CardBody className="flex flex-col items-center gap-3">
				{/* Image placeholder */}
				<Skeleton className="h-32 w-full rounded-lg animate-pulse" />
				{/* Name placeholder */}
				<Skeleton className="h-4 w-1/2 rounded-md animate-pulse" />
			</CardBody>

			{/* Footer */}
			<CardFooter className="h-0 p-0" />
		</Card>
	)
}

export default ServiceCardSkeleton