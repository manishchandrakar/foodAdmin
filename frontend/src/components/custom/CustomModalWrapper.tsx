import { Modal, ModalContent, ModalHeader } from '@heroui/react'
import type { MotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

interface ICustomModalWrapperProps {
	isOpen: boolean
	onClose: () => void
	children: ReactNode
	headerTitle?: string
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full'
	scrollBehavior?: 'inside' | 'outside'
	placement?: 'top' | 'bottom' | 'center' | 'top-center' | 'bottom-center'
	backdrop?: 'opaque' | 'blur' | 'transparent'
	motionProps?: MotionProps
	radius?: 'none' | 'sm' | 'md' | 'lg'
	shadow?: 'sm' | 'md' | 'lg'
	className?: string
	hideCloseIcon?: boolean
	headerClassName?: string
}

const CustomModalWrapper = (props: ICustomModalWrapperProps) => {
	const {
		isOpen,
		onClose,
		children,
		headerTitle,
		size,
		scrollBehavior,
		placement,
		backdrop,
		motionProps,
		radius,
		shadow,
		className,
		hideCloseIcon = false,
		headerClassName
	} = props

	return (
		<Modal
			backdrop={backdrop}
			className={className}
			classNames={{
				closeButton: 'border-1 border-lightGray mt-2 mr-4'
			}}
			hideCloseButton={hideCloseIcon}
			isOpen={isOpen}
			motionProps={motionProps}
			placement={placement}
			radius={radius}
			scrollBehavior={scrollBehavior}
			shadow={shadow}
			size={size}
			onClose={onClose}
		>
			<ModalContent className="min-w-64 min-h-64 custom-scrollbar capitalize">
				{headerTitle && <ModalHeader className={headerClassName}>{headerTitle}</ModalHeader>}
				{children}
			</ModalContent>
		</Modal>
	)
}

export default CustomModalWrapper
