# BAB 1 PENDAHULUAN
## Latar Belakang

Peraturan   Perundang-undangan   adalah   peraturan tertulis  yang  memuat  norma  hukum  yang  mengikat secara  umum  dan  dibentuk  atau  ditetapkan  oleh lembaga negara atau pejabat yang berwenang melalui prosedur yang ditetapkan dalam Peraturan Perundang-undangan. [1]
Peraturan perundang-undangan dapat digunakan untuk menjawab pertanyaan yang berkaitan dengan hukum, seperti:

- Peraturan apa saja yang berlaku pada suatu daerah? 
- Apa hubungan suatu peraturan dengan peraturan lain?
- Apa saja peraturan yang mengatur suatu topik?

Pertanyaan-pertanyaan tersebut umumnya dapat dijawab oleh seorang ahli hukum, artinya penerapan peraturan perundang-undangan ini hanya dapat dilakukan dalam skala kecil dan biaya relatif mahal.
Komputer dapat menjadi alternatif untuk aplikasi tersebut dalam skala lebih besar dan biaya lebih murah, jika peraturan perundang-undangan adalah berupa data terstruktur yang dapat diolah oleh komputer.
Sayangnya, data peraturan perundang-undangan umumnya dibuat dalam bentuk data semi-terstruktur, yaitu berupa dokumen yang memiliki data terstruktur seperti aturan penomoran dan aturan struktur (seperti bab, pasal, dan ayat), tetapi penulisan peraturan sendiri dalam bentuk data tidak terstruktur yaitu teks bahasa manusia.

Dengan melakukan ekstraksi data dari data tidak terstruktur pada dokumen, digabung dengan data yang sudah terstruktur, peraturan perundang-undangan dapat diubah menjadi dapat diolah oleh komputer.
Selain dapat menjawab pertanyaan, representasi _knowledge graph_ juga dapat digunakan untuk analisis karena data sudah terstruktur. Representasi _knowledge graph_ juga memungkinkan untuk dapat melakukan _reasoning_. Pada skripsi ini, akan dilakukan konversi dokumen peraturan perundang-undangan menjadi data terstruktur dalam bentuk _knowledge graph_, dan memberikan contoh pengaplikasian dari _knowledge graph_ peraturan perundang-undangan tersebut.

Beberapa usaha telah dilakukan untuk membuat _vocabulary_ untuk _knowledge graph_ peraturan perundang-undangan seperti _European Legislation Identifier_ (ELI). Tetapi ELI belum memiliki _vocabulary_ untuk struktur dokumen. Sehingga dengan membuat _vocabulary_ yang belum tersedia, diharapkan dapat menjadi kontribusi dalam mendukung pembuatan _knowledge graph_ untuk dokumen peraturan perundan-undangan.


## Permasalahan
Berikut ini adalah rumusan permasalahan dari penelitian yang dilakukan:

- Bagaimana konversi dokumen peraturan perudang-undangan menjadi knowledge graph dapat dilakukan secara otomatis?
- Apa saja contoh aplikasi dari knowledge graph peraturan perundang-undangan tersebut?

## Batasan Permasalahan

## Sistematika Penulisan

# BAB 2 TINJAUAN PUSTAKA

## Triple

_Triple_ merupakan tuple dengan yang terdiri dari tiga elemen yaitu subject, object, dan predikat. 
Terdapat dua representasi elemen dari _triple_, yaitu URI dan literal. 
Resource merupakan URI yang dapat digunakan sebagai subject dan object. Property merupakan URI yang dapat digunakan sebagai predikat. 
Dan literal hanya dapat digunakan sebagai object. 
_Knowledge graph_ dibangun dari _triple_.
_resource_ akan dinotasikan dalam `teks monospace berwarna biru` dan _predicate_ akan dinotasikan dalam `teks monospace berwarna merah`.

![ilustrasi triple](pictures/ilustrasi_triple.png)

## Jenis Peraturan Perundang-undangan

Terdapat beberapa jenis peraturan perundang-undangan.
Setiap dokumen peraturan perundang-undangan adalah resource, dan memiliki susunan URI yang berbeda.
Berikut adalah jenis peraturan perundang-undangan:
- Undang-Undang
- Peraturan Pemerintah Pengganti Undang-Undang
- Peraturan Pemerintah
- Peraturan Presiden
- Peraturan Menteri
- Peraturan Lembaga
- Peraturan Daerah

### Undang-Undang

### Peraturan Daerah

## Komponen Dokumen Peraturan Perundang-undangan

Dokumen terdiri dari komponen dokumen. Komponen dokumen diantaranya adalah `bab`, `bagian`, `paragraf`, `pasal`, `ayat`, dan `point`. Setiap komponen dokumen merupakan resource, dan memiliki URI. URI sebuah komponen didahului oleh URI dokumennya. Berikut adalah relasi antara komponen dokumen yang disediakan.


### Pemodelan European Legislation Identifier (ELI)

ELI merupakan sistem untuk membuat peraturan perundang-undangan tersedia secara daring dalam format terstandardisasi, sehingga dapat diakses dan digunakan oleh berbagai instansi. ELI dibangun berdasarkan persetujuan antara negara-negara EU. ELI memberikan spesifikasi untuk hal-hal berikut:
- URI untuk informasi peraturan perundang-undangan.
- Metadata yang mendeskripsikan informasi peraturan perundang-undangan.

# BAB 3 METODOLOGI

## Konversi Dokumen Peraturan Perundang-undangan ke Knowledge Graph

Konversi dokumen peraturan perundang-undangan dalam bentuk berkas pdf, menjadi knowledge graph dalam bentuk berkas turtle, akan melalui struktur data penengah yaitu JSON. 
JSON digunakan sebagai pengengah karena kompatibel dengan bahasa pemrograman typescript, sehingga menuliskan data ke dalam json, atau membaca file json ke dalam program tidak memerlukan suatu serialization atau parsing khusus.

### Konversi PDF menjadi 

# BAB 5 EVALUASI DAN ANALISIS HASIL

## Aplikasi Knowledge Graph Peraturan Perundang-undangan
Dibuat _chatbot_ untuk mensimulasikan pengaplikasian KG.
_Chatbot_ akan memproses input yand diberikan oleh user, kemudian meng-_generate_ SPARQL _query_.
Chatbot akan menampilkan hasil dari _query_ tersebut.

## Evaluasi Hasil Konversi
Evaluasi akan dilakukan terhadap semua dokumen yang terdapat pada <peraturan.go.id>.
Selanjutnya dokumen-dokumen ini akan disebut dokument tes.

## Evaluasi Manual
Evaluasi kualitatif dilakukan terhadap sebagian dokumen yang didapatkan dari hasil sam-
pling dari dokumen tes.
Seorang penilai akan melihat markdown dari setiap dokumen hasil sampling, masing-masing dokumen akan diberikan skor 0 sampai 100. 
Kualitas konversi dapat dilihat dari rata-rata skor tersebut.

## Evaluasi Otomatis
Evaluasi dilakukan dengan terlebih dahulu mendefinisikan metadata yang pasti terdapat pada sebuah dokumen (misal, tempat dokumen disahkan), kemudian menghitung sebera pa banyak metadata yang berhasil diekstrak.
Metadata hasil ekstraksi yang akan dihitung tidak perlu sesuai dengan yang terdapat di dalam dokumen.


[1]: http://luk.staff.ugm.ac.id/atur/UU12-2011Lengkap.pdf