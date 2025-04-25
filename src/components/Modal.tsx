import React from 'react';

type ModalProps = {
    onClose: () => void;
    title: string;
    children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ onClose, title, children }) => {
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    return (
        <div
            className="fixed inset-0 bg-black/40 bg-opacity-50 flex justify-center items-center z-50"
            onClick={handleOverlayClick}
        >
            <div
                className="dark-gradient w-[550px] p-6 rounded-xl shadow-xl"
            >
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-light">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-lg font-semibold text-gray-500 hover:text-gray-700"
                    >
                        &times;
                    </button>
                </div>
                <div className="mt-4">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
