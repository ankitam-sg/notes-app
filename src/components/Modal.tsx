type ModalProps = {
    isOpen: boolean;
    title?: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
};

export default function Modal({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "Discard",
    cancelText = "Keep Editing"
}: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-gray-800 text-white rounded-lg shadow-lg max-w-sm w-full p-6"> 
                {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
                <p className="mb-4">{message}</p>
                <div className="flex justify-end gap-4">
                    <button onClick={onCancel} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded">
                        {cancelText}
                    </button>   
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded">
                        {confirmText}
                    </button>       
                </div>
            </div>
        </div>
    );
}