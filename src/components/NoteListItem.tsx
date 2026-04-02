type Note = {
  id: string;
  title: string;
  content: string;
};

type NoteListItemProps = {
  note: Note;
  isSelected: boolean;
  onSelect: (note: Note) => void;
};

export default function NoteListItem({ note, isSelected, onSelect }: NoteListItemProps) {
  return (
    <div
      className={`p-3 rounded-md cursor-pointer ${
        isSelected ? "bg-gray-600" : "bg-gray-800 hover:bg-gray-700"
      }`}
      onClick={() => onSelect(note)}
    >
      <h3 className="text-sm font-semibold truncate">
        {note.title || "Untitled"}
      </h3>
      <p className="text-xs text-gray-400 truncate">{note.content}</p>
    </div>
  );
}
