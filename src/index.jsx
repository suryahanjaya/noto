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
  const [editDate, setEditDate] = useState('');
  const [showMenu, setShowMenu] = useState(new Set());
  const [lockedItems, setLockedItems] = useState(new Set());
  const [showFolderPopup, setShowFolderPopup] = useState(null);

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
    setEditDate(note.createdAt.split('T')[0]);
  };

  // Fungsi untuk menyimpan edit catatan
  const saveEditNote = (e) => {
    e.preventDefault();
    
    if (editTitle.trim() === '' || editBody.trim() === '') return;
    
    setNotes(notes.map(note => 
      note.id === editingNote 
        ? { ...note, title: editTitle.trim(), body: editBody.trim(), createdAt: new Date(editDate).toISOString() }
        : note
    ));
    
    setEditingNote(null);
    setEditTitle('');
    setEditBody('');
    setEditDate('');
  };

  // Fungsi untuk membatalkan edit
  const cancelEdit = () => {
    setEditingNote(null);
    setEditTitle('');
    setEditBody('');
    setEditDate('');
  };

  // Fungsi untuk toggle menu tombol
  const toggleMenu = (id) => {
    const newShowMenu = new Set(showMenu);
    if (newShowMenu.has(id)) {
      newShowMenu.delete(id);
    } else {
      newShowMenu.add(id);
    }
    setShowMenu(newShowMenu);
  };

  const toggleLock = (id) => {
    const newLockedItems = new Set(lockedItems);
    if (newLockedItems.has(id)) {
      newLockedItems.delete(id);
    } else {
      newLockedItems.add(id);
    }
    setLockedItems(newLockedItems);
  };

  const openFolderPopup = (folderId) => {
    setShowFolderPopup(folderId);
  };

  const closeFolderPopup = () => {
    setShowFolderPopup(null);
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
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
      />
      
      <div className="app">
        <main className="app-main">
        <RecentFoldersSection 
          onFolderClick={openFolderPopup}
          lockedItems={lockedItems}
          onToggleLock={toggleLock}
        />
        
        <NoteInput 
          title={title}
          setTitle={setTitle}
          body={body}
          setBody={setBody}
          addNote={addNote}
        />

        {/* Edit Modal */}
        {editingNote && (
          <div className="edit-modal-overlay" onClick={cancelEdit}>
            <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
              <EditNoteForm
                editTitle={editTitle}
                setEditTitle={setEditTitle}
                editBody={editBody}
                setEditBody={setEditBody}
                editDate={editDate}
                setEditDate={setEditDate}
                saveEditNote={saveEditNote}
                cancelEdit={cancelEdit}
              />
            </div>
          </div>
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
          
          <MyNotesSection 
            title="My Notes"
            notes={activeNotes}
            onDelete={deleteNote}
            onArchive={toggleArchiveNote}
            onToggleFavorite={toggleFavorite}
            onEdit={startEditNote}
            onToggleMenu={toggleMenu}
            onToggleLock={toggleLock}
            favorites={favorites}
            showMenu={showMenu}
            lockedItems={lockedItems}
            emptyMessage="No active notes yet"
            emptyIcon="📝"
            isArchive={false}
          />
          
          <NoteSection 
            title="🗃️ Archived Notes"
            notes={archivedNotes}
            onDelete={deleteNote}
            onArchive={toggleArchiveNote}
            onToggleExpand={toggleExpandArchive}
            onToggleFavorite={toggleFavorite}
            onEdit={startEditNote}
            onToggleMenu={toggleMenu}
            onToggleLock={toggleLock}
            expandedItems={expandedArchives}
            favorites={favorites}
            showMenu={showMenu}
            lockedItems={lockedItems}
            emptyMessage="No archived notes yet"
            emptyIcon="📂"
            isArchive={true}
          />
        </main>
      </div>
      
      {/* Folder Popup Modal */}
      {showFolderPopup && (
        <div className="folder-popup-overlay" onClick={closeFolderPopup}>
          <div className="folder-popup" onClick={(e) => e.stopPropagation()}>
            <div className="folder-popup-header">
              <h3>Folder Notes</h3>
              <button className="close-btn" onClick={closeFolderPopup}>✕</button>
            </div>
            <div className="folder-popup-content">
              <p>Notes in this folder will appear here...</p>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </>
  );
}

// Komponen Header dengan branding Noto dan dark mode toggle
function Header({ totalNotes, activeNotes, darkMode, setDarkMode, onExport, searchKeyword, setSearchKeyword }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">N</div>
            <div className="logo-text">Noto</div>
          </div>
        </div>
        
        <div className="header-center">
          <div className="search-container">
            <div className="search-icon">🔍</div>
            <input
              type="text"
              placeholder="Search"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        
        <div className="header-right">
          <div className="header-actions">
            <button 
              className="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button 
              className="theme-toggle"
              onClick={onExport}
              title="Export notes as JSON"
            >
              📥
            </button>
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
            placeholder="Search notes by title or content..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}

// Komponen RecentFoldersSection
function RecentFoldersSection({ onFolderClick, lockedItems, onToggleLock }) {
  const [activeFilter, setActiveFilter] = useState('This Week');
  
  const folders = [
    { id: 1, name: 'Movie Review', date: '12/12/2021', color: 'blue', icon: '📄' },
    { id: 2, name: 'Class Notes', date: '12/12/2021', color: 'pink', icon: '📄' },
    { id: 3, name: 'Book Lists', date: '12/12/2021', color: 'yellow', icon: '📄' },
  ];
  
  const filters = ['Todays', 'This Week', 'This Month'];
  
  return (
    <section className="recent-folders-section">
      <div className="section-header">
        <h2>Recent Folders</h2>
        <div className="filter-tabs">
          {filters.map(filter => (
            <button
              key={filter}
              className={`filter-tab ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      
      <div className="folders-grid">
        {folders.map(folder => (
          <div key={folder.id} className={`folder-card ${folder.color}`} onClick={() => onFolderClick(folder.id)}>
            <div className="folder-header">
              <div className="folder-icon">{folder.icon}</div>
              <div className="folder-actions">
                <button 
                  className="lock-btn" 
                  onClick={(e) => { e.stopPropagation(); onToggleLock(folder.id); }}
                  title={lockedItems.has(folder.id) ? 'Unlock folder' : 'Lock folder'}
                >
                  {lockedItems.has(folder.id) ? '🔒' : '🔓'}
                </button>
                <button className="folder-menu" onClick={(e) => e.stopPropagation()}>⋯</button>
              </div>
            </div>
            <div className="folder-content">
              <h3>{folder.name}</h3>
              <p>{folder.date}</p>
            </div>
          </div>
        ))}
        <div className="folder-card new-folder">
          <div className="new-folder-content">
            <div className="new-folder-icon">📁</div>
            <span>New folder</span>
          </div>
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
  onToggleMenu,
  onToggleLock,
  expandedItems,
  favorites,
  showMenu,
  lockedItems,
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
              onToggleMenu={onToggleMenu}
              onToggleLock={onToggleLock}
              isExpanded={expandedItems?.has(note.id)}
              isFavorite={favorites?.has(note.id)}
              isArchive={isArchive}
              showMenu={showMenu?.has(note.id)}
              isLocked={lockedItems?.has(note.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// Komponen MyNotesSection dengan date navigation
function MyNotesSection({ 
  title, 
  notes, 
  onDelete, 
  onArchive, 
  onToggleFavorite,
  onEdit,
  onToggleMenu,
  onToggleLock,
  favorites,
  showMenu,
  lockedItems,
  emptyMessage, 
  emptyIcon,
  isArchive = false
}) {
  const [activeFilter, setActiveFilter] = useState('Todays');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const filters = ['Todays', 'This Week', 'This Month'];
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  const getNoteColor = (index) => {
    const colors = ['yellow', 'pink', 'blue'];
    return colors[index % colors.length];
  };
  
  return (
    <section className="my-notes-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <div className="filter-tabs">
          {filters.map(filter => (
            <button
              key={filter}
              className={`filter-tab ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      
      <div className="date-navigation">
        <button className="date-nav-btn">◀</button>
        <span className="current-date">{formatDate(currentDate)}</span>
        <button className="date-nav-btn">▶</button>
      </div>
      
      {notes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{emptyIcon}</div>
          <p className="empty-message">{emptyMessage}</p>
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map((note, index) => (
            <div key={note.id} className={`note-card-commercial ${getNoteColor(index)}`}>
              <div className="note-header-commercial">
                <span className="note-date-commercial">
                  {new Date(note.createdAt).toLocaleDateString('en-US', { 
                    month: '2-digit', 
                    day: '2-digit', 
                    year: 'numeric' 
                  })}
                </span>
                <div className="note-actions-commercial">
                  <button 
                    className="action-btn-commercial favorite-btn" 
                    onClick={() => onToggleFavorite(note.id)}
                    title={favorites.has(note.id) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {favorites.has(note.id) ? '❤️' : '🤍'}
                  </button>
                  <button 
                    className="action-btn-commercial lock-btn" 
                    onClick={() => onToggleLock(note.id)}
                    title={lockedItems.has(note.id) ? 'Unlock note' : 'Lock note'}
                  >
                    {lockedItems.has(note.id) ? '🔒' : '🔓'}
                  </button>
                  <button 
                    className="action-btn-commercial archive-btn" 
                    onClick={() => onArchive(note.id)}
                    title={note.archived ? 'Activate note' : 'Archive note'}
                  >
                    {note.archived ? '📂' : '📝'}
                  </button>
                  <button 
                    className="action-btn-commercial edit-btn" 
                    onClick={() => onEdit(note.id)}
                    title="Edit note"
                  >
                    ✏️
                  </button>
                  <button 
                    className="action-btn-commercial delete-btn" 
                    onClick={() => onDelete(note.id)}
                    title="Delete note"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <h3 className="note-title-commercial">{note.title}</h3>
              
              <div className="note-body-commercial">
                {note.body.length > 150 ? `${note.body.substring(0, 150)}...` : note.body}
              </div>
              
              <div className="note-footer-commercial">
                <span className="note-time">
                  🕐 {new Date(note.createdAt).toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                  })}, {new Date(note.createdAt).toLocaleDateString('en-US', { weekday: 'long' })}
                </span>
              </div>
            </div>
          ))}
          <div className="note-card-commercial new-note">
            <div className="new-note-content">
              <div className="new-note-icon">📄</div>
              <span>New Note</span>
            </div>
          </div>
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
  onToggleMenu,
  onToggleLock,
  isExpanded = true,
  isFavorite = false,
  isArchive = false,
  showMenu = false,
  isLocked = false
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
            className="action-btn favorite-btn" 
            onClick={() => onToggleFavorite(note.id)}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
          <button 
            className="action-btn lock-btn" 
            onClick={() => onToggleLock(note.id)}
            title={isLocked ? 'Unlock note' : 'Lock note'}
          >
            {isLocked ? '🔒' : '🔓'}
          </button>
          <button 
            className="action-btn archive-btn" 
            onClick={() => onArchive(note.id)}
            title={note.archived ? 'Activate note' : 'Archive note'}
          >
            {note.archived ? '📂' : '📝'}
          </button>
          <button 
            className="action-btn edit-btn" 
            onClick={() => onEdit(note.id)}
            title="Edit note"
          >
            ✏️
          </button>
          <button 
            className="action-btn delete-btn" 
            onClick={() => onDelete(note.id)}
            title="Delete note"
          >
            🗑️
          </button>
          <button 
            className="action-btn menu-btn" 
            onClick={() => onToggleMenu(note.id)}
            title="More options"
          >
            ⋯
          </button>
          
          {showMenu && (
            <div className="note-menu">
              <button 
                className="action-btn favorite-btn" 
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
                className="action-btn delete-btn" 
                onClick={() => onDelete(note.id)}
                title="Delete note"
              >
                🗑️
              </button>
            </div>
          )}
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

// Professional Footer
function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-icon">N</div>
              <span>Noto</span>
            </div>
            <p className="footer-tagline">
              The most beautiful notes app for the modern digital generation
            </p>
          </div>
          
          <div className="footer-links">
            <div className="footer-section">
              <h4>Developer</h4>
              <p>Surya Hanjaya</p>
              <p>AI Researcher • Full-Stack Developer</p>
              <p>Informatics Engineering '23</p>
            </div>
            
            <div className="footer-section">
              <h4>Connect</h4>
              <div className="social-links">
                <a href="https://www.linkedin.com/in/surya-hanjaya/" target="_blank" rel="noopener noreferrer" className="social-link">
                  LinkedIn
                </a>
                <a href="https://github.com/suryahanjaya?tab=repositories" target="_blank" rel="noopener noreferrer" className="social-link">
                  GitHub
                </a>
                <a href="https://www.instagram.com/h4njy/" target="_blank" rel="noopener noreferrer" className="social-link">
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">
            © 2025 Noto. Built with modern web technologies and innovative design.
          </p>
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
  editDate,
  setEditDate,
  saveEditNote, 
  cancelEdit 
}) {
  const maxTitleLength = 50;
  const remainingChars = maxTitleLength - editTitle.length;

  return (
    <section className="note-input glass-card">
      <h2>Edit Note</h2>
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
        
        <div className="input-group">
          <label htmlFor="editDate" className="input-label">Date</label>
          <input
            type="date"
            id="editDate"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
            className="date-input"
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