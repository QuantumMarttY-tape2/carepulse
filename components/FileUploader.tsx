"use client"

import { convertFileToUrl } from '@/lib/utils'
import Image from 'next/image'
import React, { useCallback } from 'react'

// React dropzone might have issues with React 19.
import { useDropzone } from 'react-dropzone'

type FileUploaderProps = {
    files: File[] | undefined,

    // Function that accepts files.
    onChange: (files: File[]) => void
}

const FileUploader = ({ files, onChange }: FileUploaderProps) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Do something after dropping files.
        onChange(acceptedFiles)
    }, [])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    return (
        <div {...getRootProps()} className='file-upload'>
            <input {...getInputProps()} />
            {/* In the case where a file exists: */}
            {files && files?.length > 0 ? (
                // If we have an image:
                <Image
                    src={convertFileToUrl(files[0])}
                    width={1000}
                    height={1000}
                    alt="uploaded image"
                    className="max-h-[400px] overflow-hidden object-cover" />
            ) : (
                // Otherwise render a placeholder image:
                <>
                    <Image
                        src="/assets/icons/upload.svg"
                        width={40}
                        height={40}
                        alt="upload"
                    />
                    <div className="file-upload_label">
                        <p className="text-14-regular">
                            <span className="text-green-500">Click to upload</span> or drag and drop.
                        </p>
                        <p>
                            SVG, PNG, JPG, or GIF (max 800x400)
                        </p>
                    </div>
                </>
            )}
        </div>
    )
}

export default FileUploader;