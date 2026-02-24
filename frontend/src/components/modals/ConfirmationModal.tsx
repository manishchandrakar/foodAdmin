import { ModalBody, ModalFooter } from '@heroui/react'

import CustomModalWrapper from '../custom/CustomModalWrapper'
import CustomButton from '../custom/CustomButton'

interface IConformationModalProps {
	isOpen: boolean
	onClose: () => void
	onSave: () => void
	isCloseDisabled?: boolean
	isLoading?: boolean
	title: string
	saveCTAName?: string
	cancelCTAName?: string
}

const ConfirmationModal = (props: IConformationModalProps) => {
	const {
		isOpen,
		onClose,
		title,
		isLoading,
		isCloseDisabled,
		onSave,
		cancelCTAName = 'Cancel',
		saveCTAName = 'Save'
	} = props

	return (
		<CustomModalWrapper
			className="min-h-32!"
			isOpen={isOpen}
			onClose={() => {
				onClose()
			}}
		>
			<ModalBody className="flex flex-col justify-start gap-3 h-fit">
				<h1 className="font-medium text-lg text-midnight mt-3 max-w-[90%]">{title}</h1>

				<ModalFooter className="flex items-center justify-end px-0">
					<CustomButton
						isDisabled={isCloseDisabled || isLoading}
						radius="full"
						text={cancelCTAName}
						variant="bordered"
						onPress={onClose}
					/>
					<CustomButton
						isDisabled={isLoading}
						isLoading={isLoading}
						radius="full"
						text={saveCTAName}
						onPress={onSave}
					/>
				</ModalFooter>
			</ModalBody>
		</CustomModalWrapper>
	)
}

export default ConfirmationModal
