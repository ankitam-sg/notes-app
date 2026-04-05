import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Note = {
    id: string;
    title: string;
    content: string;
};

type NotesState = {
    notes: Note[];
    searchTerm: string; 
};

const initialState: NotesState = {
    notes: [],
    searchTerm: "",
};

const notesSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {
        addNote: (state, action: PayloadAction<Note>) => {
            state.notes.unshift(action.payload);
        },

        updateNote: (state, action: PayloadAction<Note>) => {
            const index = state.notes.findIndex(
                (note) => note.id === action.payload.id
            );

            // If the note exists (index is not -1), update it
            if (index !== -1) {
                state.notes[index] = action.payload;
            }
        },
        
        deleteNote: (state, action: PayloadAction<string>) => {
            state.notes = state.notes.filter(
                (note) => note.id !== action.payload
            );
        },

        // Read operation like fetching notes (persist)
        setNotes: (state, action: PayloadAction<Note[]>) => {
            state.notes = action.payload;
        },

        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
        }
    },
});

export const { addNote, updateNote, deleteNote, setNotes, setSearchTerm } = notesSlice.actions;
export default notesSlice.reducer;