# Noto ✨

*The most beautiful notes app for Gen Z*

Aplikasi catatan pribadi dengan desain premium liquid glass effect ala Apple iOS 16+. Dibuat khusus untuk generasi digital yang menghargai estetika dan fungsionalitas.

## ✨ Fitur

### Fitur Utama
- ✅ **Menampilkan Daftar Catatan** - Menampilkan catatan dengan data awal
- ✅ **Menambahkan Catatan** - Form untuk menambah catatan baru
- ✅ **Menghapus Catatan** - Tombol hapus untuk setiap catatan

### Fitur Tambahan
- 🔍 **Pencarian Catatan** - Cari catatan berdasarkan judul
- 📏 **Limit Karakter** - Pembatasan 50 karakter untuk judul dengan counter
- 📂 **Arsip Catatan** - Fitur arsip dengan tampilan terpisah

## 🚀 Cara Menjalankan

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Jalankan development server:**
   ```bash
   npm run dev
   ```

3. **Buka browser dan kunjungi:**
   ```
   http://localhost:3000
   ```

## 🛠️ Teknologi yang Digunakan

- **React 19** - Library JavaScript terbaru untuk UI
- **Vite 5** - Build tool dan development server super cepat
- **CSS3** - Advanced styling dengan:
  - Liquid Glass Effect (Glassmorphism)
  - Apple-inspired Color Palette
  - Backdrop Blur & Advanced Animations
  - Responsive Grid Layout
  - Micro-interactions & Hover Effects

## 📱 Struktur Komponen

- `App` - Komponen utama aplikasi dengan state management
- `Header` - Header dengan branding Noto dan statistik
- `SearchBar` - Pencarian catatan dengan glass effect
- `NoteInput` - Form premium untuk menambah catatan baru
- `NoteSection` - Section catatan dengan counter dan empty state
- `NoteCard` - Card catatan individual dengan liquid glass design
- `Footer` - Footer dengan branding dan links

## 📊 Data Structure

Setiap catatan memiliki struktur:
```javascript
{
  id: number | string,
  title: string,
  body: string,
  archived: boolean,
  createdAt: string
}
```

## 🎯 Kriteria yang Dipenuhi

✅ Menggunakan functional components (bukan class)  
✅ Memanfaatkan state component untuk data  
✅ Menggunakan array map untuk render list  
✅ Controlled component untuk form input  
✅ Data disimpan di memori (state)  
✅ ID unik menggunakan timestamp  
✅ Conditional rendering untuk empty state  
✅ Komponen terpecah sesuai tanggung jawab  

## 📝 Cara Penggunaan

1. **Mencari Catatan**: Gunakan search bar di atas untuk mencari berdasarkan judul
2. **Menambah Catatan**: Isi form "Tambah Catatan Baru" dan klik tombol "Tambah"
3. **Mengarsipkan**: Klik tombol "Arsipkan" untuk memindahkan ke arsip
4. **Mengaktifkan**: Klik tombol "Aktifkan" pada catatan arsip untuk mengembalikan
5. **Menghapus**: Klik tombol "Hapus" untuk menghapus catatan permanen

## 🎨 Fitur UI/UX Premium

### ✨ Liquid Glass Design
- **Glassmorphism Effect** - Backdrop blur dengan transparansi
- **Apple-inspired Colors** - Palet warna premium seperti iOS
- **Liquid Animation** - Background bergerak seperti cairan
- **Micro-interactions** - Hover dan click animations yang smooth

### 📱 Responsive & Modern
- **Grid Layout** - Adaptif untuk semua ukuran layar
- **Typography** - SF Pro Display font (Apple style)
- **Iconography** - Emoji dan symbols yang ekspresif
- **Empty States** - Ilustrasi yang engaging dan informatif

### ⚡ Performance & Accessibility
- **Smooth Animations** - 60fps dengan CSS transitions
- **Touch Friendly** - Optimized untuk mobile interaction
- **Keyboard Navigation** - Full accessibility support
- **Loading States** - Seamless user experience

### 🎯 Gen Z Features
- **Dark Mode Ready** - Siap untuk tema gelap
- **Social Media Style** - Card-based layout yang familiar
- **Instant Feedback** - Real-time character counter
- **Gesture Support** - Swipe dan touch interactions

---

**Noto** - Dibuat dengan 💙 untuk generasi digital yang menghargai beauty & functionality
