import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/auth";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "../shared/Button";
import NoteListItem from "../features/notes/ui/NoteListItem";
import NoteEditor from "../features/notes/ui/NoteEditor";
import Modal from "../shared/Modal";

// import Button from "../components/Button";
// import NoteListItem from "../components/NoteListItem";
// import NoteEditor from "../components/NoteEditor";
// import Modal from "../components/Modal";

type Note = {
    id: string;
    title: string;
    content: string;
};

export default function Notes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [originalNote, setOriginalNote] = useState<Note | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // modal & pending state
    const [modalOpen, setModalOpen] = useState(false);
    const [pendingSelection, setPendingSelection] = useState<Note | null>(null);
    const [pendingDelete, setPendingDelete] = useState(false);

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

    const handleLogout = () => {
        auth.logout();
        navigate("/login", { replace: true });
    };

    // 🚀 check if current note has unsaved changes
    const hasUnsavedChanges = () => {
        if (!originalNote) {
            return title.trim() !== "" || content.trim() !== "";
        }
        return title !== originalNote.title || content !== originalNote.content;
    };

    // 🚀 safely select note, show modal if unsaved changes
    const selectNoteSafely = (note: Note | null) => {
        if (hasUnsavedChanges()) {
            setPendingSelection(note);
            setModalOpen(true);
            return;
        }
        applySelection(note);
    };

    // 🚀 apply selection after modal confirmation
    const applySelection = (note: Note | null) => {
        if (note) {
            setSelectedNoteId(note.id);
            setTitle(note.title);
            setContent(note.content);
            setOriginalNote(note);
            setIsCreating(false);
        } else {
            setSelectedNoteId(null);
            setTitle("");
            setContent("");
            setOriginalNote(null);
            setIsCreating(true);
        }
    };

    const handleNewNote = () => {
        selectNoteSafely(null);
    };

    const handleSave = () => {
        if (!title.trim() && !content.trim()) return;

        if (selectedNoteId) {
            // UPDATE
            setNotes((prev) =>
                prev.map((note) =>
                note.id === selectedNoteId ? { ...note, title, content } : note     
        ));
            setOriginalNote({ id: selectedNoteId, title, content });
        } else {
            // CREATE
            const newNote: Note = {
                id: crypto.randomUUID(),
                title,
                content
            };
            setNotes((prev) => [newNote, ...prev]);
        }

        handleClose();
    };

    const handleDelete = () => {
        if (hasUnsavedChanges() && !selectedNoteId) {
            // new note with unsaved content → discard
            setPendingSelection(null);
            setModalOpen(true);
        } else if (selectedNoteId) {
            // existing note → delete confirmation
            setPendingDelete(true);
            setModalOpen(true);
        }
    };

    // Exit editor, blank note
    const handleClose = () => {
        setSelectedNoteId(null);
        setTitle("");
        setContent("");
        setOriginalNote(null);
        setIsCreating(false);
    };

    // 🔍 filter notes based on search (title + content, case-insensitive)
    const filteredNotes = notes.filter((note) => {
        if (!searchQuery.trim()) return true;

        const query = searchQuery.toLowerCase();

        return (
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query)
        );
    });

    return (
        <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-3 bg-white border-b-2 border-gray-300 shadow-md z-50">
                <h1 className="text-lg font-semibold text-gray-800">Notes App</h1>

                <div className="flex items-center gap-3 min-w-0">
                    <p className="text-sm text-gray-700 whitespace-nowrap">{user.email}</p>

                    <Button
                        text="Logout"
                        variant="danger"
                        icon={<FontAwesomeIcon icon={faRightFromBracket} />}
                        onClick={handleLogout}
                    />
                </div>
            </div>

            {/* MAIN */}
            <div className="flex flex-1 overflow-hidden">
                {/* LEFT PANEL */}
                <div className="flex flex-col w-[30%] bg-gray-900 border-r border-gray-700 p-4">
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 min-w-0 bg-gray-800 border border-gray-600 text-white placeholder-gray-400 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />

                        <Button
                            text="New Note"
                            variant="success"
                            onClick={handleNewNote}
                            icon={<FontAwesomeIcon icon={faPlus} />}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2">
                        {filteredNotes.length === 0 ? (
                            searchQuery.trim() ? (
                                <p className="text-sm text-gray-400">No notes match your search</p>
                            ) : (
                                <p className="text-sm text-gray-400">No notes yet</p>
                            )
                        ) : (
                            filteredNotes.map((note) => (
                                <NoteListItem
                                    key={note.id}
                                    note={note}
                                    isSelected={selectedNoteId === note.id}
                                    onSelect={selectNoteSafely}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="flex flex-col w-[70%] bg-gray-800 p-5">
                    {selectedNoteId === null && !isCreating ? (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            <p className="text-center font-semibold text-lg">
                                Select a Note <br />
                                OR <br />
                                Create a New One
                            </p>
                        </div>
                    ) : (
                        <NoteEditor
                            title={title}
                            content={content}              
                            onTitleChange={setTitle}
                            onContentChange={setContent}
                            onSave={handleSave}
                            onClose={() => {
                                if (hasUnsavedChanges()) {
                                    setPendingSelection(null);
                                    setModalOpen(true);
                                    return;
                                }
                                handleClose();
                            }}
                            onDelete={handleDelete}
                            hasUnsavedChanges={hasUnsavedChanges()}
                            isNewNote={!selectedNoteId}
                        />
                    )}
                </div>
            </div>

            {/* DISCARD / DELETE CONFIRM MODAL */}
            <Modal
                isOpen={modalOpen}
                title={pendingDelete ? "Delete Note" : "Unsaved Changes"}
                message={
                pendingDelete
                    ? "Are you sure you want to delete this note?"
                    : "You have unsaved changes. Are you sure you want to discard them?"
                }

                onConfirm={() => {
                    if (pendingDelete && selectedNoteId) {
                        // delete existing note
                        setNotes((prev) => prev.filter((note) => note.id !== selectedNoteId));
                    }
                    applySelection(pendingSelection); // discard new or switch note
                    setModalOpen(false);
                    setPendingSelection(null);
                    setPendingDelete(false);
                    handleClose(); // close editor if discard
                }}

                onCancel={() => {
                    setModalOpen(false);
                    setPendingSelection(null);
                    setPendingDelete(false);
                }}

                confirmText={pendingDelete ? "Delete" : "Discard"}
                cancelText="Keep Editing"
            />
        </div>
    );
}
