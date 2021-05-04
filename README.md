# BAB 1 PENDAHULUAN

## Latar Belakang

Peraturan   Perundang-undangan   adalah   peraturan tertulis  yang  memuat norma
hukum  yang  mengikat secara  umum  dan  dibentuk  atau  ditetapkan  oleh
lembaga negara atau pejabat yang berwenang melalui prosedur yang ditetapkan
dalam Peraturan Perundang-undangan, sesuai yang dijelaskan dalam UU No.12 Tahun
2011 Pasal 1 Ayat 2 [1]. Peraturan perundang-undangan dapat digunakan untuk
menjawab pertanyaan yang berkaitan dengan hukum, seperti:

- Peraturan apa saja yang berlaku pada suatu daerah?
- Apa hubungan suatu peraturan dengan peraturan lain?
- Apa saja peraturan yang mengatur suatu topik?

Pertanyaan-pertanyaan tersebut umumnya dapat dijawab oleh seorang ahli hukum,
artinya penerapan peraturan perundang-undangan ini hanya dapat dilakukan dalam
skala kecil dan biaya relatif mahal. Komputer dapat menjadi alternatif untuk
aplikasi tersebut dalam skala lebih besar dan biaya lebih murah, jika peraturan
perundang-undangan adalah berupa data terstruktur yang dapat diolah oleh
komputer. Sayangnya, data peraturan perundang-undangan umumnya dibuat dalam
bentuk data semi-terstruktur, yaitu berupa dokumen yang memiliki data
terstruktur seperti aturan penomoran dan aturan struktur (seperti bab, pasal,
dan ayat), tetapi penulisan peraturan sendiri dalam bentuk data tidak
terstruktur yaitu teks bahasa manusia.

Dengan melakukan ekstraksi data dari data tidak terstruktur pada dokumen,
digabung dengan data yang sudah terstruktur, peraturan perundang-undangan dapat
diubah menjadi dapat diolah oleh komputer. Selain dapat menjawab pertanyaan,
representasi _knowledge graph_ juga dapat digunakan untuk analisis karena data
sudah terstruktur. Representasi _knowledge graph_ juga memungkinkan untuk dapat
melakukan _reasoning_. Pada skripsi ini, akan dilakukan konversi dokumen
peraturan perundang-undangan menjadi data terstruktur dalam bentuk _knowledge
graph_, dan memberikan contoh pengaplikasian dari _knowledge graph_ peraturan
perundang-undangan tersebut.

Beberapa usaha telah dilakukan untuk membuat _vocabulary_ untuk _knowledge
graph_ peraturan perundang-undangan seperti _European Legislation Identifier_
(ELI) [2]. Tetapi ELI belum memiliki _vocabulary_ untuk struktur dokumen.
Sehingga dengan membuat _vocabulary_ yang belum tersedia, diharapkan dapat
menjadi kontribusi dalam mendukung pembuatan _knowledge graph_ untuk dokumen
peraturan perundan-undangan.

## Permasalahan

Berikut ini adalah rumusan permasalahan dari penelitian yang dilakukan:

- Bagaimana konversi dokumen peraturan perudang-undangan menjadi knowledge graph
  dapat dilakukan secara otomatis?
- Apa saja contoh aplikasi dari knowledge graph peraturan perundang-undangan
  tersebut?

## Batasan Permasalahan

## Sistematika Penulisan

# BAB 2 TINJAUAN PUSTAKA

## Knowledge Graph

_Triple_ merupakan tuple dengan yang terdiri dari tiga elemen yaitu subject,
object, dan predikat. Terdapat dua representasi elemen dari _triple_, yaitu URI
dan literal. Resource merupakan URI yang dapat digunakan sebagai subject dan
object. Property merupakan URI yang dapat digunakan sebagai predikat. Literal
hanya dapat digunakan sebagai object. _Knowledge graph_ dibangun dari _triple_.
_resource_ akan dinotasikan dalam `teks monospace berwarna biru` dan _predicate_
akan dinotasikan dalam `teks monospace berwarna merah`.

![ilustrasi triple](pictures/ilustrasi_triple.png)

# Turtle Syntax

TODO: konsep dan sintaks perlu dijelaskan ya di Bab 2

## Jenis Peraturan Perundang-undangan

Terdapat beberapa jenis peraturan perundang-undangan. Setiap dokumen peraturan
perundang-undangan adalah resource, dan memiliki susunan URI yang berbeda.
Menurut UU No.12 Tahun 2011 Pasal 7 Ayat 1 [1], terdapat 7 jenis Peraturan
Perundang-undangan yaitu:

- Undang-Undang Dasar Negara Republik Indonesia Tahun 1945;
- Ketetapan Majelis Permusyawaratan Rakyat;
- Undang-Undang/Peraturan Pemerintah Pengganti
- Peraturan Pemerintah;
- Peraturan Presiden;
- Peraturan Daerah Provinsi; dan
- Peraturan Daerah Kabupaten/Kota.

### Undang-Undang

### Peraturan Daerah

### Pemodelan European Legislation Identifier (ELI)

ELI merupakan sistem untuk membuat peraturan perundang-undangan tersedia secara
daring dalam format terstandardisasi, sehingga dapat diakses dan digunakan oleh
berbagai instansi. ELI dibangun berdasarkan persetujuan antara negara-negara EU.
ELI memberikan spesifikasi untuk hal-hal berikut:

- URI untuk informasi peraturan perundang-undangan.
- Metadata yang mendeskripsikan informasi peraturan perundang-undangan. TODO:
  terlalu singkat, ksh konsepnya gmn dan contoh pemodelan ELI utk suatu
  peraturan

# BAB 3 METODOLOGI

TODO: suatu KG construction dimulai dengan competency questions (requirements).
Saran sy: coba baca serta rangkum (di Bab 2) dan terapkan ini:
http://www.ksl.stanford.edu/people/dlm/papers/ontology-tutorial-noy-mcguinness-abstract.html
???

## Komponen Dokumen Peraturan Perundang-undangan

Dokumen terdiri dari komponen dokumen. Komponen dokumen diantaranya adalah
`bab`, `bagian`, `paragraf`, `pasal`, `ayat`, dan `point`. Setiap komponen
dokumen merupakan resource, dan memiliki URI. URI sebuah komponen didahului oleh
URI dokumennya. Berikut adalah relasi antara komponen dokumen yang disediakan.

TODO: URI Scheme

## Amendemen

## Konversi Dokumen Peraturan Perundang-undangan ke Knowledge Graph

Konversi dokumen peraturan perundang-undangan dalam bentuk berkas pdf, menjadi
knowledge graph dalam bentuk berkas turtle, akan melalui struktur data penengah
yaitu JSON. JSON digunakan sebagai pengengah karena kompatibel dengan bahasa
pemrograman typescript, sehingga menuliskan data ke dalam json, atau membaca
berkas json ke dalam program tidak memerlukan suatu serialization atau parsing
khusus.

### Konversi PDF menjadi

# BAB 4 IMPLEMENTASI

## OCR Ulang Berkas PDF

Dokumen Peraturan Perundang-undangan yang digunakan pada penelitian didapatkan
dalam format berkas PDF. Penulis pada awalnya mencoba langsung mengekstraksi
data dari PDF, tetapi penulis menemukan kesulitan. Salahsatu kesulitan yang
penulis temui adalah terdapatnya salah pemindaian pada berkas PDF. Sebagai
contoh, terdapat teks yang tertulis `Pasal` tetapi mengandung data `Pasai`.
Selain itu, penulis juga menemukan bahwa setiap dokumen mengandung keslahan
pemindaian yang bervariasi. Untuk suatu kasus, teks `(2)` selalu terdeteksi
sebagai `(21` pada suatu dokumen, tetapi tidak pada dokumen lainnya. Pada kasus
lainnya terdapat dokumen yang hampir tidak memiliki kesalahan pemindaian dan
juga terdapat dokumen yang teksnya tidak dapat dibaca samasekali.

Walaupun dokumen-dokumen tersebut dipelihara oleh satu lembaga pada satu situs
web, yaitu oleh Dewan Perwakilan Rakyat pada situs web dpr.go.id/jdih,
masing-masing dokumen dibuat kedalam berkas PDF dengan cara yang berbeda-beda.
Penulis tidak dapat mengetahui secara pasti metode apa yang digunakan, tetapi
dari metadata yang didapatkan dari berkas PDF, penulis dapat membuat beberapa
dugaan. Pada berkas PDF, terdapat metadata dengan nama __Creator__, dimana pada
dokumen-dokumen Peraturan Perudang-udangan yang didapatkan, tercantum nama-nama
alat pencetak atau merk dari pencetak tersebut. Dari informasi tersebut penulis
menduga bahwa terdapat sebagian Peraturan Perundang-undangan yang dibuat menjadi
PDF dengan mencetaknya menjadi kertas terlebih dahulu kemudian di pindai oleh
pemindai dan sebagian lainnya dikonversi langsung dari berkas _.docx_. Data yang
dipindai adalah berupa gambar, artinya teks yang terdapat pada berkas PDF adalah
hasil OCR (_optical character recognition_) oleh pemindai tersebut. Berikut
adalah salahsatu contoh dokumen beserta data yang tercantum sebagai __Creator__
dan contoh kesalahan pemindaiannya yang banyak terjadi.

| Dokumen             | __Creator__            | Kesalahan pemindaian        |
| ------------------- | ---------------------- | --------------------------- |
| UU No.13 Tahun 2003 | ScanSoft PDF Create! 4 | - (tidak ada)               |
| UU No.6 Tahun 2018  | Canon                  | `(2)` selalu dipindai `(21` |
| PP No.34 Tahun 2021 | Fuji Xerox B9100       | data teks tidak terbaca     |

Pemindaian berkas PDF dengan metode yang berbeda-beda memberikan kualitas hasil
pemindaian yang berbeda-beda dan kesalahan pemindaian yang tidak konsisten.
Untuk menyelesaikan masalah ini, penulis melakukan OCR ulang terhadap semua
dokumen yang akan di konversi. Dengan melakukan OCR ulang menggunakan satu
metode yang sama, penulis tidak hanya berhasil mendapatkan data hasil pemindaian
berkas PDF dengan kualitas pemindaian yang konsisten untuk semua dokumen.
Penulis memilih menggunakan Tesseract OCR [4] sebagai metode OCR karena sifatnya
_open source_ dan mendukung Bahasa Indonesia sebagai bahasa yang dipindai.

## PDF to Data

TODO: show images

pdfExtract position and text 

merge 2 PDF why? => 0-9, BAB show image merge if has same pos

remove noise refex and position header footer

## Data to component data

detect dari bab ke pasal, dari pasal ke bawah gimana

### Normal Component

node assignment exception seperti ketentuan umum

### Amended Data

standard deviation

## Citation detection

## Data To MD

visualization

## Data to triple

### triple definition

### triple to ttl

part of

??? Bab3 atau Bab 4?

# BAB 5 EVALUASI DAN ANALISIS HASIL

## Maintained docs masukin mana?

## Aplikasi Knowledge Graph Peraturan Perundang-undangan

Dibuat _chatbot_ untuk mensimulasikan pengaplikasian KG. _Chatbot_ akan
memproses input yand diberikan oleh user, kemudian meng-_generate_ SPARQL
_query_. Chatbot akan menampilkan hasil dari _query_ tersebut.

## Evaluasi Hasil Konversi

Evaluasi akan dilakukan terhadap semua dokumen yang terdapat pada
peraturan.go.id. Selanjutnya dokumen-dokumen ini akan disebut dokument tes.

## Evaluasi Manual

Evaluasi kualitatif dilakukan terhadap sebagian dokumen yang didapatkan dari
hasil sam- pling dari dokumen tes. Seorang penilai akan melihat markdown dari
setiap dokumen hasil sampling, masing-masing dokumen akan diberikan skor 0
sampai 100. Kualitas konversi dapat dilihat dari rata-rata skor tersebut.

## Evaluasi Otomatis

Evaluasi dilakukan dengan terlebih dahulu mendefinisikan metadata yang pasti
terdapat pada sebuah dokumen (misal, tempat dokumen disahkan), kemudian
menghitung sebera pa banyak metadata yang berhasil diekstrak. Metadata hasil
ekstraksi yang akan dihitung tidak perlu sesuai dengan yang terdapat di dalam
dokumen.

[1]: http://luk.staff.ugm.ac.id/atur/UU12-2011Lengkap.pdf
[2]: https://eur-lex.europa.eu/eli-register/about.html
[3]: http://www.ksl.stanford.edu/people/dlm/papers/ontology101/ontology101-noy-mcguinness.html
[4]: https://github.com/tesseract-ocr/tesseract