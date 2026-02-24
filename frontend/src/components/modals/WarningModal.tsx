import { ModalBody } from '@heroui/react'
import { IoWarning } from 'react-icons/io5'

import CustomModalWrapper from '../custom/CustomModalWrapper'

interface IWarningModalProps {
	isOpen: boolean
	onClose: () => void
	message: string
}

const WarningModal = (props: IWarningModalProps) => {
	const { isOpen, onClose, message } = props

	return (
		<CustomModalWrapper isOpen={isOpen} onClose={onClose}>
			<ModalBody className="flex flex-col justify-evenly items-center p-10 gap-4 h-full">
				<IoWarning className="text-6xl text-warning" />

				<h1 className="font-bold text-2xl text-slateGray">Warning!</h1>

				<p className="text-justify text-gray">{message}</p>
			</ModalBody>
		</CustomModalWrapper>
	)
}

export default WarningModal
