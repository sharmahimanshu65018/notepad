import { useEffect, useState } from "react";
import "./App.css";
import { title } from "process";

type Note = {
  id: number;
  title: string;
  content: string;
};

const App = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  const [title, setTitle] = useState("");
  const [content, setcontent] = useState("");
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/notes");
        const notes: Note[] = await response.json();
        setNotes(notes);
      } catch (e) {}
    };
    fetchNotes();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });
      const newNote = await response.json();
      setNotes([newNote, ...notes]);
      setTitle("");
      setcontent("");
    } catch (e) {
      console.log(e);
    }
  };
  const [selectedNote, SetSelectedNote] = useState<Note | null>(null);
  const handelNoteClick = (note: Note) => {
    SetSelectedNote(note);
    setTitle(note.title);
    setcontent(note.content);
  };

  const handelUpdateNote = async (event: React.FormEvent) => {
    if (!selectedNote) return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/notes/${selectedNote.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
          }),
        }
      );
      const updatedNote = await response.json();
      const updatedNotesList = notes.map((note) =>
        note.id === selectedNote.id ? updatedNote : note
      );
      console.log(updatedNotesList);

      setNotes(updatedNotesList);
      setTitle("");
      setcontent("");
      SetSelectedNote(null);
    } catch (e) {
      console.log(e);
    }
  };

  const handelCancel = () => {
    setTitle("");
    setcontent("");
    SetSelectedNote(null);
  };

  const deleteNote = async (event: React.MouseEvent, noteId: number) => {
    if (!selectedNote) return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/notes/${noteId}`,
        {
          method: "DELETE",
          // headers: {
          //   "Content-Type": "application/json",
          // },
          // body: JSON.stringify({
          //   title,
          //   content,
          // }),
        }
      );

      const updatedNotes = notes.filter((note) => note.id !== noteId);
      setNotes(updatedNotes);
    } catch (e) {
      console.log(e);
    }

    event.stopPropagation();
  };

  return (
    <div className="app-container">
      <form className="note-form" onSubmit={(event) => handleSubmit(event)}>
        <input
          placeholder="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          rows={10}
          value={content}
          onChange={(event) => setcontent(event.target.value)}
          required
        />

        {selectedNote ? (
          <div className="edit-buttons">
            <button type="submit">Save</button>
            <button onClick={handelCancel}>Cancel</button>
          </div>
        ) : (
          <button type="submit">Add Notes</button>
        )}

        <button type="submit">Add Note</button>
      </form>
      <div className="notes-grid">
        {notes.map((note) => (
          <div className="note-item" onClick={() => handelNoteClick(note)}>
            <div className="notes-header">
              <button onClick={(event) => deleteNote(event, note.id)}>x</button>
            </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
