import { MdDeleteForever } from 'react-icons/md'
import { ModalBody, ModalFooter } from '@heroui/react'

import CustomModalWrapper from '../custom/CustomModalWrapper'
import CustomButton from '../custom/CustomButton'

interface IDeleteAlertModalProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	message: string
	subMessage?: string
	isSaveLoading?: boolean
}

const DeleteAlertModal = (props: IDeleteAlertModalProps) => {
	const {
		isOpen,
		onClose,
		onConfirm,
		message,
		isSaveLoading = false,
		subMessage = 'This action will delete the account, but their details will remain viewable.'
	} = props

	return (
		<CustomModalWrapper isOpen={isOpen} onClose={onClose}>
			<ModalBody className="flex flex-col justify-between items-center p-8 gap-3 h-full">
				<MdDeleteForever className="text-6xl text-danger" />

				<h1 className="text-center font-bold text-xl text-black mt-3">{message}</h1>
				<p className="text-center text-black">{subMessage}</p>
				<ModalFooter>
					<CustomButton isDisabled={isSaveLoading} radius="full" text="Yes, delete" onPress={onConfirm} />
					<CustomButton isLoading={isSaveLoading} radius="full" text="Cancel" variant="bordered" onPress={onClose} />
				</ModalFooter>
			</ModalBody>
		</CustomModalWrapper>
	)
}

export default DeleteAlertModal
