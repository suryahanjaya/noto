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
  const [darkMode, setDarkMode] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [expandedArchives, setExpandedArchives] = useState(new Set());
  const [favorites, setFavorites] = useState(new Set());
  const [selectedTag, setSelectedTag] = useState('all');

  // Apply theme
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

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

  // Toggle expand archive card
  const toggleExpandArchive = (id) => {
    const newExpanded = new Set(expandedArchives);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedArchives(newExpanded);
  };

  // Toggle favorite note
  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  // Export notes as JSON
  const exportNotes = () => {
    const dataStr = JSON.stringify(notes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `noto-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Filter dan sort catatan
  const getFilteredAndSortedNotes = (notesToFilter) => {
    let filtered = notesToFilter;

    // Filter berdasarkan pencarian
    if (searchKeyword) {
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        note.body.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // Filter berdasarkan favorites
    if (selectedTag === 'favorites') {
      filtered = filtered.filter(note => favorites.has(note.id));
    }

    // Filter berdasarkan tanggal
    if (filterBy !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);

      filtered = filtered.filter(note => {
        const noteDate = new Date(note.createdAt);
        switch (filterBy) {
          case 'today':
            return noteDate >= today;
          case 'yesterday':
            return noteDate >= yesterday && noteDate < today;
          case 'week':
            return noteDate >= weekAgo;
          default:
            return true;
        }
      });
    }

    // Sort catatan
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  // Pisahkan catatan aktif dan arsip
  const allFilteredNotes = getFilteredAndSortedNotes(notes);
  const activeNotes = allFilteredNotes.filter(note => !note.archived);
  const archivedNotes = allFilteredNotes.filter(note => note.archived);

  return (
    <>
      <Header 
        totalNotes={notes.length} 
        activeNotes={activeNotes.length}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onExport={exportNotes}
      />
      
      <div className="app">
        <main className="app-main">
          <SearchBar 
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
          />
          
          <FilterControls
            sortBy={sortBy}
            setSortBy={setSortBy}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            favoriteCount={favorites.size}
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
            onToggleFavorite={toggleFavorite}
            favorites={favorites}
            emptyMessage="Belum ada catatan aktif"
            emptyIcon="📝"
            isArchive={false}
          />
          
          <NoteSection 
            title="📂 Catatan Arsip"
            notes={archivedNotes}
            onDelete={deleteNote}
            onArchive={toggleArchiveNote}
            onToggleExpand={toggleExpandArchive}
            onToggleFavorite={toggleFavorite}
            expandedItems={expandedArchives}
            favorites={favorites}
            emptyMessage="Belum ada catatan diarsipkan"
            emptyIcon="📂"
            isArchive={true}
          />
        </main>
      </div>
      
      <Footer />
    </>
  );
}

// Komponen Header dengan branding Noto dan dark mode toggle
function Header({ totalNotes, activeNotes, darkMode, setDarkMode, onExport }) {
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
          <button 
            className="theme-toggle"
            onClick={onExport}
            title="Export catatan sebagai JSON"
          >
            📥
          </button>
          <button 
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
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
            placeholder="Cari catatan berdasarkan judul atau isi..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}

// Komponen FilterControls untuk sorting dan filtering
function FilterControls({ 
  sortBy, 
  setSortBy, 
  filterBy, 
  setFilterBy, 
  selectedTag, 
  setSelectedTag, 
  favoriteCount 
}) {
  return (
    <section className="filter-controls">
      <div className="filter-group">
        <label>🏷️ Tags:</label>
        <select 
          className="filter-select"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="all">Semua</option>
          <option value="favorites">❤️ Favorit ({favoriteCount})</option>
        </select>
      </div>
      
      <div className="filter-group">
        <label>📊 Urutkan:</label>
        <select 
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Terbaru</option>
          <option value="oldest">Terlama</option>
          <option value="title">Judul A-Z</option>
        </select>
      </div>
      
      <div className="filter-group">
        <label>📅 Filter:</label>
        <select 
          className="filter-select"
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
        >
          <option value="all">Semua</option>
          <option value="today">Hari Ini</option>
          <option value="yesterday">Kemarin</option>
          <option value="week">Minggu Ini</option>
        </select>
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
function NoteSection({ 
  title, 
  notes, 
  onDelete, 
  onArchive, 
  onToggleExpand,
  onToggleFavorite,
  expandedItems,
  favorites,
  emptyMessage, 
  emptyIcon,
  isArchive = false
}) {
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
              onToggleExpand={onToggleExpand}
              onToggleFavorite={onToggleFavorite}
              isExpanded={expandedItems?.has(note.id)}
              isFavorite={favorites?.has(note.id)}
              isArchive={isArchive}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// Komponen NoteCard untuk menampilkan setiap catatan dengan design premium
function NoteCard({ 
  note, 
  onDelete, 
  onArchive, 
  onToggleExpand,
  onToggleFavorite,
  isExpanded = true,
  isFavorite = false,
  isArchive = false 
}) {
  const handleCardClick = () => {
    if (isArchive && onToggleExpand) {
      onToggleExpand(note.id);
    }
  };

  const isCollapsed = isArchive && !isExpanded;

  return (
    <article 
      className={`note-card ${note.archived ? 'archived' : ''} ${isCollapsed ? 'collapsed' : ''}`}
      onClick={isArchive ? handleCardClick : undefined}
      style={{ cursor: isArchive ? 'pointer' : 'default' }}
    >
      <div className="note-header">
        <h3 className="note-title">
          {note.title}
          {isArchive && (
            <span className="expand-indicator">
              {isCollapsed ? ' ▼' : ' ▲'}
            </span>
          )}
        </h3>
        <div className="note-actions" onClick={(e) => e.stopPropagation()}>
          <button 
            className="action-btn favorite-btn" 
            onClick={() => onToggleFavorite(note.id)}
            title={isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
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
      
      {!isCollapsed && (
        <>
          <div className="note-date">
            {showFormattedDate(note.createdAt)}
          </div>
          
          <div className="note-body">{note.body}</div>
        </>
      )}
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