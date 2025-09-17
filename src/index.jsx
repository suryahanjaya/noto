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
    <>
      <Header totalNotes={notes.length} activeNotes={activeNotes.length} />
      
      <div className="app">
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
          
          <NoteSection 
            title="📝 Catatan Aktif"
            notes={activeNotes}
            onDelete={deleteNote}
            onArchive={toggleArchiveNote}
            emptyMessage="Belum ada catatan aktif"
            emptyIcon="📝"
          />
          
          <NoteSection 
            title="📂 Catatan Arsip"
            notes={archivedNotes}
            onDelete={deleteNote}
            onArchive={toggleArchiveNote}
            emptyMessage="Belum ada catatan diarsipkan"
            emptyIcon="📂"
          />
        </main>
      </div>
      
      <Footer />
    </>
  );
}

// Komponen Header dengan branding Noto
function Header({ totalNotes, activeNotes }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
          <div className="logo-icon">N</div>
          <div className="logo-text">Noto</div>
        </div>
        <div className="header-actions">
          <div className="stats-badge">
            {totalNotes} Total • {activeNotes} Aktif
          </div>
        </div>
      </div>
    </header>
  );
}

// Komponen SearchBar untuk pencarian dengan glass effect
function SearchBar({ searchKeyword, setSearchKeyword }) {
  return (
    <section className="search-section">
      <div className="search-container">
        <div className="search-bar">
          <div className="search-icon">🔍</div>
          <input
            type="text"
            placeholder="Cari catatan berdasarkan judul..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}

// Komponen NoteInput untuk menambah catatan baru dengan design premium
function NoteInput({ title, setTitle, body, setBody, addNote }) {
  const maxTitleLength = 50;
  const remainingChars = maxTitleLength - title.length;

  return (
    <section className="note-input glass-card">
      <h2>Buat Catatan Baru</h2>
      <form className="note-form" onSubmit={addNote}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Judul catatan yang menarik..."
            value={title}
            onChange={(e) => {
              if (e.target.value.length <= maxTitleLength) {
                setTitle(e.target.value);
              }
            }}
          />
          <div className={`char-counter ${remainingChars <= 10 ? 'warning' : ''}`}>
            {remainingChars}/50
          </div>
        </div>
        <div className="input-group">
          <textarea
            placeholder="Tulis isi catatan Anda di sini..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows="4"
          />
        </div>
        <button type="submit" className="submit-btn">
          ✨ Simpan Catatan
        </button>
      </form>
    </section>
  );
}

// Komponen NoteSection untuk menampilkan section catatan dengan design modern
function NoteSection({ title, notes, onDelete, onArchive, emptyMessage, emptyIcon }) {
  return (
    <section className="notes-section">
      <div className="section-header">
        <h2 className="section-title">
          {title}
        </h2>
        <div className="section-count">
          {notes.length}
        </div>
      </div>
      
      {notes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{emptyIcon}</div>
          <h3 className="empty-title">Belum Ada Catatan</h3>
          <p className="empty-message">{emptyMessage}</p>
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={onDelete}
              onArchive={onArchive}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// Komponen NoteCard untuk menampilkan setiap catatan dengan design premium
function NoteCard({ note, onDelete, onArchive }) {
  return (
    <article className={`note-card ${note.archived ? 'archived' : ''}`}>
      <div className="note-header">
        <h3 className="note-title">{note.title}</h3>
        <div className="note-actions">
          <button 
            className="action-btn archive-btn" 
            onClick={() => onArchive(note.id)}
            title={note.archived ? 'Aktifkan catatan' : 'Arsipkan catatan'}
          >
            {note.archived ? '📂' : '📝'}
          </button>
          <button 
            className="action-btn delete-btn" 
            onClick={() => onDelete(note.id)}
            title="Hapus catatan"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <div className="note-date">
        {showFormattedDate(note.createdAt)}
      </div>
      
      <div className="note-body">{note.body}</div>
    </article>
  );
}

// Komponen Footer dengan branding Noto
function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-logo">Noto</div>
        <p className="footer-text">
          Aplikasi catatan pribadi yang elegan dan powerful untuk Gen Z
        </p>
        <div className="footer-links">
          <a href="#" className="footer-link">Privacy</a>
          <a href="#" className="footer-link">Terms</a>
          <a href="#" className="footer-link">Support</a>
          <a href="#" className="footer-link">About</a>
        </div>
      </div>
    </footer>
  );
}

// Render aplikasi ke DOM
const root = createRoot(document.getElementById('root'));
root.render(<App />);