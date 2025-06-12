import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    heading?: string
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, heading='Modal' }) => {


    if (!isOpen) return null

    return (
        <dialog
            className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-transparent"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <div className='flex flex-col bg-white rounded-2xl border'>
                <div className='flex justify-between items-center p-3'>
                    <h1 className='text-lg font-semibold ps-3'>{heading}</h1>
                    <button
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="px-4 pb-4">{children}</div>
            </div>
        </dialog>
    )
}

export default Modal