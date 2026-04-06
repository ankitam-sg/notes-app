type Note = {
    id: string;
    title: string;
    content: string;
    userEmail: string; // Each note belongs to a specific user
};

// Props for NoteListItem component
type NoteListItemProps = {
    note: Note;                   // receives a single note object
    isSelected: boolean;    
    onSelect: (note: Note) => void;         // callback when user clicks a note
};

export default function NoteListItem({ note, isSelected, onSelect }: NoteListItemProps) {
    return (
        <div
            // Highlight selected note, otherwise default styling with hover effect
            className={`p-3 rounded-md cursor-pointer ${
                isSelected ? "bg-gray-600" : "bg-gray-800 hover:bg-gray-700"
            }`}
            
            // On click, send full note object back to parent (Notes.tsx) to set as selectedNote
            onClick={() => onSelect(note)}
        >
            {/* Show title or Untitled */}
            <h3 className="text-sm font-semibold truncate">
                {note.title || "Untitled"}
            </h3>

            {/* Preview of note content (truncated) */}
            <p className="text-xs text-gray-400 truncate">
                {note.content}
            </p>
        </div>
    );
}
