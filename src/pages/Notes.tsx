import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faPlus } from "@fortawesome/free-solid-svg-icons";

import Button from "../shared/Button";
import NoteListItem from "../features/notes/ui/NoteListItem";
import NoteEditor from "../features/notes/ui/NoteEditor";
import Modal from "../shared/Modal";

import { RootState } from "../store/store";
import { addNote, updateNote, deleteNote, setSearchTerm } from "../features/notes/notesSlice";
import { logout } from "../features/auth/authSlice";

// ✅ UPDATED: Note now includes userEmail (required for per-user notes)
type Note = {
    id: string;
    title: string;
    content: string;
    userEmail: string; // ✅ NEW: bind note to logged-in user
};

export default function Notes() {

    // ✅ Get current logged-in user
    const user = useSelector((state: RootState) => state.auth.currentUser);

    // ❌ OLD: was showing all notes
    // ✅ NEW: filter notes only for current user
    const notes = useSelector((state: RootState) =>
        state.notes.notes.filter((note) => note.userEmail === user?.email)
    );

    const searchTerm = useSelector((state: RootState) => state.notes.searchTerm);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // ✅ UPDATED: originalNote must also include userEmail
    const [originalNote, setOriginalNote] = useState<Note | null>(null);

    const [isCreating, setIsCreating] = useState(false);

    // modal & pending state
    const [modalOpen, setModalOpen] = useState(false);
    const [pendingSelection, setPendingSelection] = useState<Note | null>(null);
    const [pendingDelete, setPendingDelete] = useState(false);

    // Logout
    const handleLogout = () => {
        dispatch(logout());
        navigate("/login", { replace: true });
    };

    // Unsaved changes check for both new and existing notes
    const hasUnsavedChanges = () => {
        if (!originalNote) {
            return title.trim() !== "" || content.trim() !== "";
        }
        return title !== originalNote.title || content !== originalNote.content;
    };

    // Safe note selection with modal if unsaved changes 
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

    const handleNewNote = () => selectNoteSafely(null);
    
    const handleSave = () => {
        if (!title.trim() && !content.trim()) return;

        if (selectedNoteId) {
            // UPDATE
            dispatch(updateNote({ id: selectedNoteId, title, content }));

            // ✅ FIX: include userEmail in originalNote
            setOriginalNote({
                id: selectedNoteId,
                title,
                content,
                userEmail: user!.email
            });
        } else {
            // CREATE
            if (!user) return; // safety

            const newNote: Note = {
                id: crypto.randomUUID(),
                title,
                content,
                userEmail: user.email // ✅ attach note to user
            };

            dispatch(addNote(newNote));
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

    // Search Input Handler
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchTerm(e.target.value));
    };

    // Filter notes (case-insensitive, title / content)
    const filteredNotes = useMemo(() => {
        if (!searchTerm.trim()) return notes;

        const lowerSearch = searchTerm.toLowerCase();
        return notes.filter(
            (note) =>
                note.title.toLowerCase().includes(lowerSearch) ||
                note.content.toLowerCase().includes(lowerSearch)
        );
    }, [notes, searchTerm]);
        
    return (
        <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-3 bg-white border-b-2 border-gray-300 shadow-md z-50">
                <h1 className="text-lg font-semibold text-gray-800">Notes App</h1>

                <div className="flex items-center gap-3 min-w-0">
                    <p className="text-sm text-gray-700 whitespace-nowrap">{user?.email}</p>

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
                            value={searchTerm}
                            onChange={handleSearchChange}
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
                        {searchTerm.trim() && filteredNotes.length === 0 ? (
                            <p className="text-sm text-gray-400">No notes match your search</p>
                        ) : notes.length === 0 ? (
                            <p className="text-sm text-gray-400">No notes yet</p>
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
                        dispatch(deleteNote(selectedNoteId));
                    }
                    applySelection(pendingSelection);
                    setModalOpen(false);
                    setPendingSelection(null);
                    setPendingDelete(false);
                    handleClose();
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
