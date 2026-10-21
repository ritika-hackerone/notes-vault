import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../AuthContext";

export default function Notes() {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ title: "", content: "" });

  useEffect(() => {
    api("/notes")
      .then(setNotes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function addNote(e) {
    e.preventDefault();
    setError("");
    try {
      const note = await api("/notes", { method: "POST", body: { title, content } });
      setNotes((prev) => [note, ...prev]);
      setTitle("");
      setContent("");
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(note) {
    setEditingId(note.id);
    setDraft({ title: note.title, content: note.content });
  }

  async function saveEdit(id) {
    setError("");
    try {
      const updated = await api(`/notes/${id}`, { method: "PUT", body: draft });
      setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeNote(id) {
    if (!window.confirm("Delete this note?")) return;
    setError("");
    try {
      await api(`/notes/${id}`, { method: "DELETE" });
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="card">
      <header className="bar">
        <h1>Notes Vault</h1>
        <div>
          <span className="muted">{user.email}</span>{" "}
          <button className="secondary" onClick={logout}>Log out</button>
        </div>
      </header>

      <form onSubmit={addNote} className="new-note">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          required
        />
        <textarea
          placeholder="Write something..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
        <button>Add note</button>
      </form>

      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Loading...</p>}
      {!loading && notes.length === 0 && <p className="muted">No notes yet. Add your first one above.</p>}

      <ul className="notes">
        {notes.map((note) => (
          <li key={note.id}>
            {editingId === note.id ? (
              <>
                <input
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  maxLength={200}
                />
                <textarea
                  value={draft.content}
                  onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                  rows={3}
                />
                <div className="actions">
                  <button onClick={() => saveEdit(note.id)}>Save</button>
                  <button className="secondary" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h3>{note.title}</h3>
                <p>{note.content}</p>
                <small className="muted">
                  Updated {new Date(note.updatedAt).toLocaleString()}
                </small>
                <div className="actions">
                  <button className="secondary" onClick={() => startEdit(note)}>Edit</button>
                  <button className="danger" onClick={() => removeNote(note.id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}