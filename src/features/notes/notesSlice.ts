import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Note type
type Note = {
    id: string;
    title: string;
    content: string;
    userEmail: string; // Each note belongs to a user
    };

// Notes state type
type NotesState = {
    notes: Note[];
    searchTerm: string;
};

// Initial state
const initialState: NotesState = {
    notes: [],
    searchTerm: "",
};

const notesSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {
        // Add new note with user association
        addNote: (
            state,
            action: PayloadAction<{
                id: string;
                title: string;
                content: string;
                userEmail: string; // current user
            }>
        ) => {
            // Add new note with userEmail to associate it with the logged-in user
            state.notes.push(action.payload);
        },

        // Update Note by ID 
        updateNote: (
            state,
            action: PayloadAction<{
                id: string;
                title: string;
                content: string;
            }>
        ) => {
            const note = state.notes.find((n) => n.id === action.payload.id);

            if (note) {
                // Only updating content, userEmail stays same
                note.title = action.payload.title;
                note.content = action.payload.content;
            }
        },

        // Delete note by ID
        deleteNote: (state, action: PayloadAction<string>) => {
            // Remove the note with the given ID from the state
            state.notes = state.notes.filter((n) => n.id !== action.payload);
        },

        // Search term for filtering notes in UI
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
        },
    },
});

export const { addNote, updateNote, deleteNote, setSearchTerm } = notesSlice.actions;
export default notesSlice.reducer;