# Personal Notes App 📝

Aplikasi catatan pribadi yang dibuat dengan React untuk mengelola catatan harian Anda.

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

- **React** - Library JavaScript untuk UI
- **Vite** - Build tool dan development server
- **CSS3** - Styling dengan responsive design

## 📱 Struktur Komponen

- `App` - Komponen utama aplikasi
- `SearchBar` - Komponen pencarian catatan
- `NoteInput` - Form untuk menambah catatan baru
- `NoteList` - Menampilkan daftar catatan
- `NoteItem` - Item catatan individual

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

## 🎨 Fitur UI/UX

- Responsive design untuk mobile dan desktop
- Hover effects pada cards
- Grid layout yang adaptif
- Pesan empty state yang informatif
- Counter karakter real-time
- Styling yang modern dan clean

---
