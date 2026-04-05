import Button from "../../../shared/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faXmark, faTrash } from "@fortawesome/free-solid-svg-icons";

type NoteEditorProps = {
    title: string;
    content: string;
    onTitleChange: (value: string) => void;
    onContentChange: (value: string) => void;
    onSave: () => void;
    onClose: () => void;
    onDelete: () => void;
    hasUnsavedChanges: boolean;
    isNewNote: boolean;
};

export default function NoteEditor({
    title,
    content,
    onTitleChange,
    onContentChange,
    onSave,
    onClose,
    onDelete,
    hasUnsavedChanges,
    isNewNote,
}: NoteEditorProps) {
    return (
        <>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    className="flex-1 min-w-0 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />

                <div className="flex gap-2">
                    <Button
                        text="Save"
                        variant="primary"
                        onClick={onSave}
                        disabled={!hasUnsavedChanges}
                        icon={<FontAwesomeIcon icon={faFloppyDisk} />}
                    />

                    <Button
                        text="Close"
                        variant="secondary"
                        onClick={onClose}
                        icon={<FontAwesomeIcon icon={faXmark} />}
                    />

                    <Button
                        text="Delete"
                        variant="danger"
                        onClick={onDelete}
                        disabled={isNewNote}
                        icon={<FontAwesomeIcon icon={faTrash} />}
                    />
                </div>
            </div>

            <textarea
                placeholder="Write your note..."
                value={content}
                onChange={(e) => onContentChange(e.target.value)}
                className="flex-1 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 p-3 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
        </>
    );
}
