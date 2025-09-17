# 📝 Noto - Premium Notes App

<div align="center">

![Noto Logo](https://img.shields.io/badge/Noto-Notes%20App-67AE6E?style=for-the-badge&logo=react&logoColor=white)

*The most beautiful and modern notes application for the digital generation*

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![CSS3](https://img.shields.io/badge/CSS3-Advanced-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Available-67AE6E?style=for-the-badge)](https://noto-notes-app.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## 🌟 Overview

**Noto** is a premium, modern notes application built with cutting-edge web technologies. Featuring a stunning liquid glass design inspired by Apple's iOS 16+ interface, it provides an intuitive and beautiful experience for managing personal notes.

### ✨ Key Highlights

- 🎨 **Premium Liquid Glass Design** - Apple-inspired glassmorphism effects
- 📱 **Fully Responsive** - Optimized for all devices and screen sizes
- ⚡ **Lightning Fast** - Built with Vite for optimal performance
- 🌙 **Dark Mode Ready** - Seamless theme switching
- 📂 **Smart Organization** - Folder system and archive functionality
- 🔍 **Advanced Search** - Real-time note searching and filtering

---

## 🚀 Features

### 📝 Core Note Management
- **Create Notes** - Add new notes with rich text content
- **Edit Notes** - Modify existing notes with inline editing
- **Delete Notes** - Remove notes with confirmation
- **Archive System** - Organize notes with archive functionality
- **Character Counter** - Real-time character limit for titles (50 chars)

### 🗂️ Organization & Navigation
- **Folder System** - Organize notes into custom folders
- **Recent Folders** - Quick access to frequently used folders
- **Smart Search** - Search notes by title and content
- **Filter Options** - Filter by date, favorites, and status
- **Sort Options** - Sort by newest, oldest, or alphabetical

### 🎨 Premium UI/UX
- **Liquid Glass Effect** - Advanced glassmorphism with backdrop blur
- **Smooth Animations** - 60fps transitions and micro-interactions
- **Responsive Grid** - Adaptive layout for all screen sizes
- **Empty States** - Engaging illustrations for empty sections
- **Loading States** - Seamless user experience

### ⚡ Advanced Functionality
- **Favorites System** - Mark important notes as favorites
- **Export Feature** - Export notes as JSON backup
- **Theme Toggle** - Switch between light and dark modes
- **Touch Optimized** - Mobile-first design with gesture support

---

## 🛠️ Technology Stack

### Frontend Framework
- **React 19** - Latest React with concurrent features and improved performance
- **Vite 5** - Ultra-fast build tool and development server
- **JavaScript ES6+** - Modern JavaScript with latest features

### Styling & Design
- **CSS3 Advanced** - Custom CSS with modern features:
  - CSS Grid & Flexbox for responsive layouts
  - CSS Custom Properties (CSS Variables)
  - Advanced animations and transitions
  - Backdrop filters and glassmorphism effects
  - Media queries for responsive design

### Development Tools
- **ESLint** - Code linting and quality assurance
- **Prettier** - Code formatting and consistency
- **Git** - Version control and collaboration

### Design System
- **Apple-inspired Color Palette** - Premium green color scheme
- **Inter Font Family** - Modern, readable typography
- **Emoji Icons** - Expressive and universal iconography
- **Glassmorphism** - Liquid glass design language

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/suryahanjaya/noto-notes-app.git
   cd noto-notes-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🏗️ Project Structure

```
noto-notes-app/
├── public/
│   └── vite.svg
├── src/
│   ├── components/          # Reusable components
│   ├── styles/
│   │   └── styles.css      # Main stylesheet with glassmorphism
│   ├── utils/
│   │   └── index.js        # Utility functions and initial data
│   ├── index.jsx           # Main application component
│   └── test.jsx            # Test components
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
└── README.md               # Project documentation
```

---

## 🎯 Component Architecture

### Core Components

- **`App`** - Main application component with state management
- **`Header`** - Navigation header with branding and theme toggle
- **`NoteInput`** - Form component for creating new notes
- **`MyNotesSection`** - Active notes display with commercial layout
- **`NoteSection`** - Archive notes with collapsible design
- **`NoteCard`** - Individual note card with premium styling
- **`RecentFoldersSection`** - Folder management interface
- **`FilterControls`** - Search and filter functionality
- **`Footer`** - Simple footer with branding

### State Management

```javascript
// Main application state
const [notes, setNotes] = useState(initialNotes);
const [searchKeyword, setSearchKeyword] = useState('');
const [darkMode, setDarkMode] = useState(false);
const [folders, setFolders] = useState([...]);
const [favorites, setFavorites] = useState(new Set());
```

---

## 📊 Data Structure

### Note Object
```javascript
{
  id: number,           // Unique identifier (timestamp)
  title: string,        // Note title (max 50 characters)
  body: string,         // Note content
  archived: boolean,    // Archive status
  createdAt: string,    // ISO date string
  folderId: number      // Associated folder ID
}
```

### Folder Object
```javascript
{
  id: number,           // Unique identifier
  name: string,         // Folder name
  date: string,         // Creation date
  color: string,        // Folder color theme
  noteCount: number     // Number of notes in folder
}
```

---

## 🎨 Design System

### Color Palette
- **Primary Green**: `#328E6E` - Main brand color
- **Secondary Green**: `#67AE6E` - Accent color
- **Success Green**: `#90C67C` - Success states
- **Background**: `#E1EEBC` - Light mode background
- **Dark Background**: `#0d1f1a` - Dark mode background

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800
- **Monospace**: JetBrains Mono for code elements

### Spacing & Layout
- **Grid System**: CSS Grid with responsive breakpoints
- **Spacing Scale**: 0.25rem, 0.5rem, 1rem, 1.5rem, 2rem, 3rem
- **Border Radius**: 8px, 12px, 16px, 20px, 24px

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 480px
- **Tablet Portrait**: 481px - 768px
- **Tablet Landscape**: 769px - 1024px
- **Desktop**: 1025px - 1440px
- **Large Desktop**: > 1440px

### Mobile Optimizations
- Touch-friendly button sizes (44px minimum)
- Swipe gestures for navigation
- Optimized typography scaling
- Reduced animations for better performance

---

## ⚡ Performance Features

- **Vite Build System** - Ultra-fast development and production builds
- **Code Splitting** - Automatic code splitting for optimal loading
- **Tree Shaking** - Dead code elimination
- **CSS Optimization** - Minified and optimized stylesheets
- **Lazy Loading** - Components loaded on demand

---

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Development with specific options
npm run dev -- --host    # Expose to network
npm run dev -- --port 3001  # Custom port
```

---

## 🌐 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

### Modern Features Used
- CSS Grid & Flexbox
- CSS Custom Properties
- Backdrop Filter
- ES6+ JavaScript
- React Hooks

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developer

<div align="center">

**Surya Hanjaya**

*AI Researcher • Full-Stack Developer*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/surya-hanjaya/)
[![GitHub](https://img.shields.io/badge/GitHub-333333?style=for-the-badge&logo=github&logoColor=white)](https://github.com/suryahanjaya)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/h4njy/)

**Informatics Engineering '23**

*Building the future with modern web technologies*

</div>

---

## 🙏 Acknowledgments

- **Apple** - Design inspiration from iOS 16+ interface
- **React Team** - Amazing framework for building user interfaces
- **Vite Team** - Lightning-fast build tool
- **Google Fonts** - Beautiful typography with Inter font
- **Open Source Community** - For continuous innovation and support

---

<div align="center">

**Made with ❤️ for the digital generation**

*Noto - Where beauty meets functionality*

[![Star](https://img.shields.io/github/stars/suryahanjaya/noto-notes-app?style=social)](https://github.com/suryahanjaya/noto-notes-app)
[![Fork](https://img.shields.io/github/forks/suryahanjaya/noto-notes-app?style=social)](https://github.com/suryahanjaya/noto-notes-app)

</div>