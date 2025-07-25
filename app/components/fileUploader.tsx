import { type JSX, useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { formatSize } from '~/helperFunctions/SizeFormater'

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file: File = acceptedFiles[0] || null
      setSelectedFile(file)
      onFileSelect?.(file)
    },
    [onFileSelect]
  )

  const maxFileSize = 20 * 1024 * 1024

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: maxFileSize,
  })

  return (
    <div className="w-full gradient-border">
      <div {...getRootProps()} className="cursor-pointer">
        <input {...getInputProps()} />
        <div className="space-y-4">
          {selectedFile ? (
            <div
              className="uploader-selected-file"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3">
                <img src="/images/pdf.png" alt="pdf" className="size-10" />
                <div>
                  <p className="text-sm text-gray-700 font-medium truncate max-w-xs">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <button
                className="p-2 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedFile(null)
                  onFileSelect?.(null)
                }}
              >
                <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
                <img src="/icons/info.svg" alt="upload" className="size-20" />
              </div>
              <p className="text-lg text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop a file here
              </p>
              <p className="text-lg text-gray-500">
                PDF (max {formatSize(maxFileSize)})
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FileUploader
