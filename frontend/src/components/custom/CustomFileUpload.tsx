'use client'

import React, { useState, useCallback, useId, useRef } from 'react'
import { IoCloudUploadOutline } from 'react-icons/io5'
import { MdDeleteForever } from 'react-icons/md'
import { RiAttachment2 } from 'react-icons/ri'
import { IoIosLink } from 'react-icons/io'
import { Image } from '@heroui/react'

import { showWarningToast } from '@/utils/toastUtils'

interface ICustomFileUploadProps {
	onFileSelect: (file: File[]) => void
	isMultipleFile?: boolean
	accept?: string
	fileSize?: number
	previewType?: 'file' | 'image'
	maximumFiles?: number
	defaultImage?: string | string[]
}
const CustomFileUpload = (props: ICustomFileUploadProps) => {
	const {
		onFileSelect,
		isMultipleFile = false,
		accept,
		fileSize = 1,
		previewType,
		maximumFiles = 4,
		defaultImage
	} = props

	const [files, setFiles] = useState<File[]>([])
	const inputId = useId()
	const inputRef = useRef<HTMLInputElement>(null)

	const processFiles = useCallback(
		(newFiles: File[]) => {
			const validFiles = newFiles.filter(file => {
				if (file.size > fileSize * 1024 * 1024) {
					showWarningToast({
						title: 'File size exceed',
						description: `File "${file.name}" exceeds ${fileSize}MB. Please select a smaller file.`
					})

					return false
				}

				return true
			})

			if (validFiles.length > 0) {
				setFiles(prevFiles => {
					if (prevFiles.length + validFiles.length > maximumFiles) {
						showWarningToast({
							title: 'File limit exceed',
							description: `You can upload a maximum of ${maximumFiles} files.`
						})

						return prevFiles
					}
					const updatedFiles = [...prevFiles, ...validFiles]

					onFileSelect(updatedFiles)

					return updatedFiles
				})
			}
		},
		[onFileSelect, fileSize, maximumFiles]
	)

	const handleFileDrop = useCallback(
		(event: React.DragEvent<HTMLDivElement>) => {
			event.preventDefault()
			if (event.dataTransfer?.files?.length) {
				processFiles(Array.from(event.dataTransfer.files))
			}
		},
		[processFiles]
	)

	const handleFileChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			if (event?.target?.files && event?.target?.files?.length > maximumFiles) {
				showWarningToast({
					title: 'File limit exceed',
					description: `You can upload a maximum of ${maximumFiles} files.`
				})

				return
			}
			if (event?.target?.files?.length) {
				processFiles(Array.from(event.target.files))
			}
		},
		[processFiles, maximumFiles]
	)

	const handleRemoveFile = (fileToRemove: File) => {
		setFiles(prevFiles => {
			const updatedFiles = prevFiles.filter(file => file !== fileToRemove)

			onFileSelect(updatedFiles)

			return updatedFiles
		})

		if (inputRef.current) inputRef.current.value = ''
	}

	const formatSize = (size: number): string => {
		if (size < 1024) return `${size} bytes`
		if (size < 1048576) return `${(size / 1024).toFixed(2)} KB`

		return `${(size / 1048576).toFixed(2)} MB`
	}

	const isOnlyImage = previewType === 'image' && files.every(file => file.type.startsWith('image'))

	const renderFilePreview = () => {
		if (files.length === 0 && defaultImage) {
			const defaultImagesArray = Array.isArray(defaultImage) ? defaultImage : [defaultImage]

			return defaultImagesArray.map((img, index) => (
				<div key={index} className="relative group">
					<Image alt="Default" className="w-21.75 h-21.75 object-cover rounded border" src={img} />
				</div>
			))
		}

		if (isOnlyImage) {
			return files.map((file, index) => (
				<div key={index} className="relative group">
					<Image
						alt="Preview"
						className="w-21.75 h-21.75 object-cover rounded border"
						src={URL.createObjectURL(file)}
					/>
					<div className="z-10 absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded">
						<a
							className="text-white text-xl font-medium p-2 rounded-md"
							href={URL.createObjectURL(file)}
							rel="noopener noreferrer"
							target="_blank"
						>
							<IoIosLink />
						</a>
						<button
							className="text-red text-xl font-medium px-2 py-2 rounded-md"
							type="button"
							onClick={() => handleRemoveFile(file)}
						>
							<MdDeleteForever />
						</button>
					</div>
				</div>
			))
		}

		return files.map(file => (
			<div
				key={file.name}
				className="w-full h-auto p-2 px-3 border border-muted-grey gap-2 rounded-lg flex items-center justify-between"
			>
				<div className="flex gap-2 items-center max-w-[70%]">
					<button
						aria-label={`Remove file ${file.name}`}
						className="text-slateGray cursor-pointer bg-transparent border-none p-0 m-0"
						onClick={() => handleRemoveFile(file)}
					>
						<RiAttachment2 />
					</button>
					<div className="flex flex-col">
						<p className="text-sm font-normal text-slateGray max-w-[75%] truncate">{file.name}</p>
						<p className="text-xs text-slateGray">{`${file.type.split('/')[1] || 'Unknown'} | ${formatSize(file.size)}`}</p>
					</div>
				</div>
				<div className="flex items-center">
					<a
						className="text-blue font-medium p-2 rounded-md underline"
						href={URL.createObjectURL(file)}
						rel="noopener noreferrer"
						target="_blank"
					>
						<IoIosLink />
					</a>
					<button
						aria-label={`Remove file ${file.name}`}
						className="text-red cursor-pointer bg-transparent border-none p-0 m-0"
						onClick={() => handleRemoveFile(file)}
					>
						<MdDeleteForever />
					</button>
				</div>
			</div>
		))
	}

	return (
		<div className="relative flex flex-col gap-4">
			{/* Upload Section */}
			<div
				className="w-full h-40 border-2 border-dashed border-lightGray rounded-lg flex flex-col items-center justify-center"
				onDragOver={e => e.preventDefault()}
				onDrop={handleFileDrop}
			>
				<div className="flex flex-col p-3 items-center">
					<IoCloudUploadOutline className="text-3xl text-gray" />
					<p className="text-sm text-gray font-medium mt-4">Drag & Drop to upload</p>
					<p className="text-sm text-gray font-medium mt-2">or</p>
				</div>

				<label className="px-4 py-2 text-themeColor font-medium text-sm rounded cursor-pointer" htmlFor={inputId}>
					Browse Files
				</label>

				{(files.length === 0 || files.length < maximumFiles) && (
					<input
						ref={inputRef}
						accept={accept}
						className="hidden"
						id={inputId}
						multiple={isMultipleFile}
						type="file"
						onChange={handleFileChange}
					/>
				)}
			</div>

			{/* Previews */}
			{(files.length > 0 || defaultImage) && <div className="flex flex-wrap gap-4">{renderFilePreview()}</div>}
		</div>
	)
}

export default CustomFileUpload