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
  const [editingNote, setEditingNote] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');

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

  // Fungsi untuk memulai edit catatan
  const startEditNote = (note) => {
    setEditingNote(note.id);
    setEditTitle(note.title);
    setEditBody(note.body);
  };

  // Fungsi untuk menyimpan edit catatan
  const saveEditNote = (e) => {
    e.preventDefault();
    
    if (editTitle.trim() === '' || editBody.trim() === '') return;
    
    setNotes(notes.map(note => 
      note.id === editingNote 
        ? { ...note, title: editTitle.trim(), body: editBody.trim() }
        : note
    ));
    
    setEditingNote(null);
    setEditTitle('');
    setEditBody('');
  };

  // Fungsi untuk membatalkan edit
  const cancelEdit = () => {
    setEditingNote(null);
    setEditTitle('');
    setEditBody('');
  };

  // Fungsi untuk mengarsipkan/mengaktifkan catatan
  const toggleArchiveNote = (id) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, archived: !note.archived } : note
    ));
  };

  // Toggle expand archive card - Fixed to prevent interference
  const toggleExpandArchive = (id) => {
    setExpandedArchives(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(id)) {
        // If this card is already expanded, close it
        newExpanded.delete(id);
      } else {
        // Close all others first, then open this one
        newExpanded.clear();
        newExpanded.add(id);
      }
      return newExpanded;
    });
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
        
        <NoteInput 
          title={title}
          setTitle={setTitle}
          body={body}
          setBody={setBody}
          addNote={addNote}
        />

        {/* Edit Form */}
        {editingNote && (
          <EditNoteForm
            editTitle={editTitle}
            setEditTitle={setEditTitle}
            editBody={editBody}
            setEditBody={setEditBody}
            saveEditNote={saveEditNote}
            cancelEdit={cancelEdit}
          />
        )}
        
        <FilterControls 
          sortBy={sortBy}
          setSortBy={setSortBy}
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          favoriteCount={favorites.size}
        />
          
          <NoteSection 
            title="📝 Active Notes"
            notes={activeNotes}
            onDelete={deleteNote}
            onArchive={toggleArchiveNote}
            onToggleFavorite={toggleFavorite}
            onEdit={startEditNote}
            favorites={favorites}
            emptyMessage="No active notes yet"
            emptyIcon="📝"
            isArchive={false}
          />
          
          <NoteSection 
            title="📂 Archived Notes"
            notes={archivedNotes}
            onDelete={deleteNote}
            onArchive={toggleArchiveNote}
            onToggleExpand={toggleExpandArchive}
            onToggleFavorite={toggleFavorite}
            onEdit={startEditNote}
            expandedItems={expandedArchives}
            favorites={favorites}
            emptyMessage="No archived notes yet"
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
            {totalNotes} Total • {activeNotes} Active
          </div>
          <button 
            className="theme-toggle"
            onClick={onExport}
            title="Export notes as JSON"
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
            placeholder="Search notes by title or content..."
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
          <option value="all">All</option>
          <option value="favorites">❤️ Favorites ({favoriteCount})</option>
        </select>
      </div>
      
      <div className="filter-group">
        <label>📊 Sort:</label>
        <select 
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="title">Title A-Z</option>
        </select>
      </div>
      
      <div className="filter-group">
        <label>📅 Filter:</label>
        <select 
          className="filter-select"
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
        >
          <option value="all">All</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="week">This Week</option>
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
      <h2>Create New Note</h2>
      <form className="note-form" onSubmit={addNote}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter an interesting title..."
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
            placeholder="Write your note content here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows="4"
          />
        </div>
        <button type="submit" className="submit-btn">
            Save Note
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
  onEdit,
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
          <h3 className="empty-title">No Notes Yet</h3>
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
              onEdit={onEdit}
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
  onEdit,
  isExpanded = true,
  isFavorite = false,
  isArchive = false 
}) {
  const handleCardClick = (event) => {
    event.stopPropagation(); // Prevent event bubbling
    if (isArchive && onToggleExpand) {
      onToggleExpand(note.id);
    }
  };

  const isCollapsed = isArchive && !isExpanded;

  return (
    <article 
      className={`note-card ${note.archived ? 'archived' : ''} ${isCollapsed ? 'collapsed' : ''} ${isFavorite ? 'favorite' : ''}`}
      onClick={isArchive ? handleCardClick : undefined}
      style={{ cursor: isArchive ? 'pointer' : 'default' }}
    >
      <div className="note-header">
        <h3 className="note-title">
          {note.title}
        </h3>
        <div className="note-actions" onClick={(e) => e.stopPropagation()}>
          <button 
            className={`action-btn favorite-btn ${isFavorite ? 'favorited' : ''}`}
            onClick={() => onToggleFavorite(note.id)}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
          <button 
            className="action-btn edit-btn" 
            onClick={() => onEdit(note)}
            title="Edit note"
          >
            ✏️
          </button>
          <button 
            className="action-btn archive-btn" 
            onClick={() => onArchive(note.id)}
            title={note.archived ? 'Activate note' : 'Archive note'}
          >
            {note.archived ? '📂' : '📝'}
          </button>
          <button 
            className="action-btn delete-btn" 
            onClick={() => onDelete(note.id)}
            title="Delete note"
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

// Elegant Footer with Surya Hanjaya branding
function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="logo-icon">N</div>
            <span>Noto</span>
          </div>
          <p className="footer-tagline">
            The most beautiful notes app for the modern digital generation
          </p>
        </div>
        
        <div className="footer-divider"></div>
        
        <div className="footer-info">
          <div className="developer-info">
            <h4>Created with ❤️ by</h4>
            <div className="developer-name">Surya Hanjaya</div>
            <div className="developer-title">AI Researcher • Full-Stack Developer</div>
            <div className="developer-education">Informatics Engineering '23 • Universitas Negeri Surabaya</div>
          </div>
          
          <div className="social-links">
            <a 
              href="https://www.linkedin.com/in/surya-hanjaya/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link linkedin"
              title="LinkedIn Profile"
            >
              <span className="social-icon">💼</span>
              <span className="social-text">LinkedIn</span>
            </a>
            <a 
              href="https://github.com/suryahanjaya?tab=repositories" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link github"
              title="GitHub Profile"
            >
              <span className="social-icon">💻</span>
              <span className="social-text">GitHub</span>
            </a>
            <a 
              href="https://www.instagram.com/h4njy/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link instagram"
              title="Instagram Profile"
            >
              <span className="social-icon">📸</span>
              <span className="social-text">Instagram</span>
            </a>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">
            © 2024 Noto. Made with modern web technologies and lots of creativity.
          </p>
          <div className="tech-stack">
            <span className="tech-item">React 19</span>
            <span className="tech-item">Vite 5</span>
            <span className="tech-item">CSS3</span>
            <span className="tech-item">JavaScript ES6+</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Komponen EditNoteForm untuk mengedit catatan
function EditNoteForm({ 
  editTitle, 
  setEditTitle, 
  editBody, 
  setEditBody, 
  saveEditNote, 
  cancelEdit 
}) {
  const maxTitleLength = 50;
  const remainingChars = maxTitleLength - editTitle.length;

  return (
    <section className="note-input glass-card edit-form">
      <h2>✏️ Edit Note</h2>
      <form className="note-form" onSubmit={saveEditNote}>
        <div className="input-group">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Note title..."
            className="title-input"
            maxLength={maxTitleLength}
            required
          />
          <div className="char-counter">
            {remainingChars} characters remaining
          </div>
        </div>
        
        <div className="input-group">
          <textarea
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            placeholder="Write your note here..."
            className="body-input"
            rows="4"
            required
          />
        </div>
        
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </section>
  );
}

// Render aplikasi ke DOM
const root = createRoot(document.getElementById('root'));
root.render(<App />);