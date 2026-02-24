'use client'

import React from 'react'
import { FaStar, FaRegStar } from 'react-icons/fa'

interface ICustomStarProps {
	rating: number
	totalStars?: number
	filledIcon?: React.ReactNode
	emptyIcon?: React.ReactNode
	className?: string
}

const CustomStar = (props: ICustomStarProps) => {
	const {
		rating,
		totalStars = 5,
		filledIcon = <FaStar />,
		emptyIcon = <FaRegStar />,
		className = 'text-primary flex text-lg flex-row'
	} = props
	const renderStars = () => {
		const stars = []

		for (let i = 1; i <= totalStars; i++) {
			stars.push(
				<span key={i} className={className}>
					{i <= Math.floor(rating) ? filledIcon : emptyIcon}
				</span>
			)
		}

		return stars
	}

	return <div className="flex items-center gap-1">{renderStars()}</div>
}

export default CustomStar