# Tutorial Lengkap: Deploy Website Anime ke GitHub Pages

Halo! Berikut adalah panduan lengkap untuk memasang (deploy) website ini ke GitHub Pages agar bisa diakses oleh siapa saja secara online.

## Latar Belakang Perubahan

Sebelum kita mulai, penting untuk tahu bahwa saya telah melakukan beberapa penyesuaian pada struktur proyek Anda:

1.  **Menambahkan Proses Build**: Website Anda ditulis menggunakan TypeScript (`.tsx`), yang perlu diubah (di-compile) menjadi JavaScript biasa agar bisa dijalankan di browser. Saya telah menambahkan [Vite](https://vitejs.dev/), sebuah alat modern, untuk melakukan proses ini.
2.  **File Konfigurasi Baru**: Anda akan melihat file baru seperti `package.json`, `vite.config.ts`, dan `tsconfig.json`. Ini semua adalah file yang dibutuhkan oleh Vite dan TypeScript untuk bekerja.
3.  **Struktur Folder `src`**: Semua kode sumber (file `.ts` dan `.tsx`) telah dipindahkan ke dalam folder `src` agar lebih terorganisir, sesuai dengan praktik terbaik saat ini.

Perubahan ini sangat penting untuk membuat website Anda siap untuk di-hosting di layanan mana pun, termasuk GitHub Pages.

---

## Langkah-langkah Deployment

Proses ini paling mudah dilakukan di komputer, namun beberapa langkah bisa dilakukan dari HP. Bagian yang memerlukan komputer adalah saat menjalankan proses "build" karena butuh lingkungan Node.js.

### Langkah 1: Siapkan Repositori di GitHub (Bisa di HP)

1.  Buka aplikasi GitHub atau situs `github.com` di browser Anda.
2.  Buat **Repositori Baru**.
    *   Beri nama repositori Anda, misalnya: `enim-tod-app`.
    *   Pastikan repositori diatur ke **Public**.
3.  Upload semua file proyek yang sudah diperbarui ke repositori ini. Anda bisa menggunakan fitur "Add file" -> "Upload files" di situs GitHub.

### Langkah 2: Atur GitHub Pages (Bisa di HP)

Kita akan menggunakan **GitHub Actions**, cara modern dan otomatis untuk melakukan deployment.

1.  **Buat File Workflow**:
    *   Di dalam repositori Anda di GitHub, buat folder baru dengan nama `.github`.
    *   Di dalam folder `.github`, buat lagi folder bernama `workflows`.
    *   Di dalam `workflows`, buat file baru bernama `deploy.yml`.
    *   Salin dan tempel (copy-paste) seluruh kode di bawah ini ke dalam file `deploy.yml`:

    ```yaml
    # Simple workflow for deploying static content to GitHub Pages
    name: Deploy static content to Pages

    on:
      # Runs on pushes targeting the default branch
      push:
        branches: ['main'] # Ganti menjadi 'master' jika itu branch utama Anda

      # Allows you to run this workflow manually from the Actions tab
      workflow_dispatch:

    permissions:
      contents: read
      pages: write
      id-token: write

    concurrency:
      group: 'pages'
      cancel-in-progress: false

    jobs:
      deploy:
        environment:
          name: github-pages
          url: ${{ steps.deployment.outputs.page_url }}
        runs-on: ubuntu-latest
        steps:
          - name: Checkout
            uses: actions/checkout@v4
          - name: Set up Node.js
            uses: actions/setup-node@v4
            with:
              node-version: 18
              cache: 'npm'
          - name: Install dependencies
            run: npm install
          - name: Build
            run: npm run build
          - name: Setup Pages
            uses: actions/configure-pages@v4
          - name: Upload artifact
            uses: actions/upload-pages-artifact@v3
            with:
              path: './dist'
          - name: Deploy to GitHub Pages
            id: deployment
            uses: actions/deploy-pages@v4
    ```

2.  **Konfigurasi Pengaturan Pages**:
    *   Di halaman utama repositori Anda, klik tab **Settings**.
    *   Di menu sebelah kiri, pilih **Pages**.
    *   Di bawah "Build and deployment", pada bagian "Source", pilih **GitHub Actions**.

### Langkah 3: Cek Hasil Deployment

Setelah Anda menyimpan file `deploy.yml` dan melakukan push (atau upload), GitHub Actions akan otomatis berjalan.

1.  Buka tab **Actions** di repositori Anda untuk melihat status prosesnya. Proses ini biasanya memakan waktu 1-3 menit.
2.  Jika prosesnya berhasil (ada tanda centang hijau), website Anda sudah online!
3.  Alamat website Anda akan tersedia di `https://<USERNAME_ANDA>.github.io/<NAMA_REPOSITORI>/`.
    *   Contoh: Jika username Anda `yukiheker` dan nama repositori `enim-tod-app`, maka alamatnya adalah `https://yukiheker.github.io/enim-tod-app/`.

Alamat finalnya juga akan muncul di pengaturan **Settings -> Pages**.

Selamat, website Anda telah berhasil di-deploy!
