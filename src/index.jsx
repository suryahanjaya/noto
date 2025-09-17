import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { getInitialData, showFormattedDate } from './utils/index.js';

// import style
import './styles/styles.css';

// Data awal catatan dari utils
const initialNotes = getInitialData();

// Komponen utama App
function App() {
  const [notes, setNotes] = useState(initialNotes);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  // Fungsi untuk menambah catatan baru
  const addNote = (e) => {
    e.preventDefault();
    
    if (title.trim() === '' || body.trim() === '') return;
    
    const newNote = {
      id: +new Date(),
      title: title.trim(),
      body: body.trim(),
      archived: false,
      createdAt: new Date().toISOString()
    };
    
    setNotes([...notes, newNote]);
    setTitle('');
    setBody('');
  };

  // Fungsi untuk menghapus catatan
  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  // Fungsi untuk mengarsipkan/mengaktifkan catatan
  const toggleArchiveNote = (id) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, archived: !note.archived } : note
    ));
  };

  // Filter catatan berdasarkan kata kunci pencarian
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // Pisahkan catatan aktif dan arsip
  const activeNotes = filteredNotes.filter(note => !note.archived);
  const archivedNotes = filteredNotes.filter(note => note.archived);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Aplikasi Catatan Pribadi</h1>
      </header>
      
      <main className="app-main">
        <SearchBar 
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
        />
        
        <NoteInput 
          title={title}
          setTitle={setTitle}
          body={body}
          setBody={setBody}
          addNote={addNote}
        />
        
        <NoteList 
          title="Catatan Aktif"
          notes={activeNotes}
          onDelete={deleteNote}
          onArchive={toggleArchiveNote}
          emptyMessage="Tidak ada catatan aktif"
        />
        
        <NoteList 
          title="Catatan Arsip"
          notes={archivedNotes}
          onDelete={deleteNote}
          onArchive={toggleArchiveNote}
          emptyMessage="Tidak ada catatan diarsipkan"
        />
      </main>
    </div>
  );
}

// Komponen SearchBar untuk pencarian
function SearchBar({ searchKeyword, setSearchKeyword }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Cari catatan..."
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
      />
    </div>
  );
}

// Komponen NoteInput untuk menambah catatan baru
function NoteInput({ title, setTitle, body, setBody, addNote }) {
  const maxTitleLength = 50;
  const remainingChars = maxTitleLength - title.length;

  return (
    <div className="note-input">
      <h2>Tambah Catatan Baru</h2>
      <form onSubmit={addNote}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Judul catatan..."
            value={title}
            onChange={(e) => {
              if (e.target.value.length <= maxTitleLength) {
                setTitle(e.target.value);
              }
            }}
          />
          <span className="char-limit">Sisa karakter: {remainingChars}</span>
        </div>
        <textarea
          placeholder="Isi catatan..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows="5"
        ></textarea>
        <button type="submit">Tambah</button>
      </form>
    </div>
  );
}

// Komponen NoteList untuk menampilkan daftar catatan
function NoteList({ title, notes, onDelete, onArchive, emptyMessage }) {
  return (
    <div className="note-list">
      <h2>{title}</h2>
      {notes.length === 0 ? (
        <p className="empty-message">{emptyMessage}</p>
      ) : (
        <div className="notes-container">
          {notes.map(note => (
            <NoteItem
              key={note.id}
              note={note}
              onDelete={onDelete}
              onArchive={onArchive}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Komponen NoteItem untuk menampilkan setiap catatan
function NoteItem({ note, onDelete, onArchive }) {
  return (
    <div className="note-item">
      <div className="note-header">
        <h3>{note.title}</h3>
        <div className="note-actions">
          <button 
            className="archive-btn" 
            onClick={() => onArchive(note.id)}
          >
            {note.archived ? 'Aktifkan' : 'Arsipkan'}
          </button>
          <button 
            className="delete-btn" 
            onClick={() => onDelete(note.id)}
          >
            Hapus
          </button>
        </div>
      </div>
      <p className="note-date">
        {showFormattedDate(note.createdAt)}
      </p>
      <p className="note-body">{note.body}</p>
    </div>
  );
}

// Render aplikasi ke DOM
const root = createRoot(document.getElementById('root'));
root.render(<App />);