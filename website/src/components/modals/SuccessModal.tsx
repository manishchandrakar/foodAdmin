import { ModalBody } from '@heroui/react'
import { FaCircleCheck } from 'react-icons/fa6'

import CustomModalWrapper from '../custom/CustomModalWrapper'

interface ISuccessModalProps {
	isOpen: boolean
	onClose: () => void
	message: string
	hideCloseIcon?: boolean
}

const SuccessModal = (props: ISuccessModalProps) => {
	const { isOpen, onClose, message, hideCloseIcon = true } = props

	return (
		<CustomModalWrapper hideCloseIcon={hideCloseIcon} isOpen={isOpen} onClose={onClose}>
			<ModalBody className="flex flex-col justify-between items-center p-12 gap-4 h-full">
				<FaCircleCheck className="text-6xl text-success" />

				<h1 className="font-bold text-2xl text-black">Success</h1>
				<p className="text-center text-black">{message}</p>
			</ModalBody>
		</CustomModalWrapper>
	)
}

export default SuccessModal
