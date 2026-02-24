'use client'

import CustomButton from '@/components/custom/CustomButton'

interface PaginationProps {
	page: number
	totalPages: number
	onNext: () => void
	onPrevious: () => void
	className?: string

	limit?: number
	limitOptions?: number[]
	onLimitChange?: (value: number) => void
}

const Pagination = (props: PaginationProps) => {
	const {
		page,
		totalPages,
		onNext,
		onPrevious,
		className,
		limit,
		limitOptions = [10, 20, 50, 100],
		onLimitChange
	} = props

	return (
		<div className={`flex justify-center border-themeColor items-center gap-4 mt-6 mb-4 ${className || ''}`}>
			{/* Render limit selector ONLY if onLimitChange is provided */}
			{onLimitChange && (
				<div className="flex items-center gap-2 mr-4">
					<span className="text-sm font-medium">Show:</span>
					<select
						className="border border-themeColor  rounded-md px-2 py-1"
						value={limit}
						onChange={e => onLimitChange(Number(e.target.value))}
					>
						{limitOptions.map(opt => (
							<option key={opt} value={opt}>
								{opt}
							</option>
						))}
					</select>
				</div>
			)}

			<CustomButton
				className="px-4 py-2 border rounded-md"
				isDisabled={page === 1}
				text="Previous"
				onPress={onPrevious}
			/>

			<span className="text-lg font-semibold">
				Page {page} of {totalPages}
			</span>

			<CustomButton
				className="px-4 py-2 border rounded-md"
				isDisabled={page === totalPages}
				text="Next"
				onPress={onNext}
			/>
		</div>
	)
}

export default Pagination