# Query_001

query:

```sparql
# Describe Omnibus Law (UU Cipta Kerja)
PREFIX legal: <http://example.org/legal/ontology/>

SELECT * WHERE {
  <http://example.org/legal/peraturan/uu/2020/11> ?p ?o .
} LIMIT 3
```

result:
|0||
|-|-|
|p|http://www.w3.org/1999/02/22-rdf-syntax-ns#type|
|o|http://example.org/legal/ontology/Peraturan|

|1||
|-|-|
|p|http://example.org/legal/ontology/tentang|
|o| CIPTA KERJA|

|2||
|-|-|
|p|http://example.org/legal/ontology/pasal|
|o|http://example.org/legal/peraturan/uu/2020/11/pasal/0186|

# Query_002

query:

```sparql
# Retrieve all articles (= pasal) of Omnibus Law
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?pasalVersion ?text WHERE {
  <http://example.org/legal/peraturan/uu/2020/11> legal:pasal ?pasal .
  ?pasal legal:versi ?pasalVersion .
  ?pasalVersion legal:teks ?text .
} LIMIT 3
```

result:
|0||
|-|-|
|pasalVersion|http://example.org/legal/peraturan/uu/2020/11/pasal/0186/versi/20201102|
|text|Undang-Undang ini mulai berlaku pada tanggal diundangkan. Agar setiap orang mengetahuinya, memerintahkan pengundangan Undang-Undang ini dengan penempatannya dalam Lembaran Negara Republik Indonesia.|

|1||
|-|-|
|pasalVersion|http://example.org/legal/peraturan/uu/2020/11/pasal/0185/versi/20201102|
|text|Pada saat Undang-Undang ini mulai berlaku:\na. Peraturan pelaksanaan dari Undang-Undang ini wajib ditetapkan paling lama 3 (tiga) bulan, dan\nb. Semua peraturan pelaksanaan dari Undang-Undang yang telah diubah oleh Undang-Undang ini dinyatakan tetap berlaku sepanjang tidak bertentangan dengan Undang- Undang ini dan wajib disesuaikan paling lama 3 (tiga) bulan.\n|

|2||
|-|-|
|pasalVersion|http://example.org/legal/peraturan/uu/2020/11/pasal/0184/versi/20201102|
|text|Pada saat Undang-Undang ini mulai berlaku:\na. Perizinan Berusaha atau izin sektor yang sudah terbit masih tetap berlaku sampai dengan berakhirnya Perizinan Berusaha,\nb. Perizinan Berusaha dan/atau izin sektor yang sudah terbit sebelum berlakunya Undang-Undang ini dapat berlaku sesuai dengan Undang-Undang ini, dan\nc. Perizinan Berusaha yang sedang dalam proses permohonan disesuaikan dengan ketentuan dalam Undang-Undang ini.\n|

# Query_002_latest

query:

```sparql
# Retrieve all articles (= pasal) of Omnibus Law
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?pasal ?text WHERE {
  { 
    SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
      <http://example.org/legal/peraturan/uu/2020/11> legal:pasal ?pasal .
      ?pasal legal:versi ?pasalVersion .
    } GROUP BY ?pasal 
  }
  ?latestPasalVersion legal:teks ?text
} LIMIT 3
```

result:
|0||
|-|-|
|pasal|http://example.org/legal/peraturan/uu/2020/11/pasal/0072|
|text|Pasal 72 Beberapa ketentuan dalam Undang-Undang Nomor 32 Tahun 2002 tentang Penyiaran (Lembaran Negara Republik Indonesia Tahun 2002 Nomor 139, Tambahan Lembaran Negara Republik Indonesia Nomor 4252) diubah sebagai berikut:\n1. Ketentuan Pasal 16 diubah sehingga berbunyi sebagai berikut:\n(1). Lembaga Penyiaran Swasta sebagaimana dimaksud dalam Pasal 13 ayat (2) huruf b adalah lembaga penyiaran yang bersifat komersial berbentuk badan hukum Indonesia yang bidang usahanya menyelenggarakan jasa penyiaran radio atau televisi.\n(2). Warga negara asing dapat menjadi pengurus Lembaga Penyiaran Swasta sebagaimana dimaksud pada ayat (1) hanya untuk bidang keuangan dan bidang teknik.\n2. Ketentuan Pasal 25 diubah sehingga berbunyi sebagai berikut:\n(1). Lembaga Penyiaran Berlangganan sebagaimana dimaksud dalam Pasal 13 ayat (2) huruf d merupakan lembaga penyiaran berbentuk badan hukum Indonesia yang bidang usahanya menyelenggarakan jasa penyiaran berlangganan dan wajib terlebih dahulu memperoleh izin penyelenggaraan penyiaran berlangganan.\n(2). Lembaga Penyiaran Berlangganan sebagaimana dimaksud pada ayat (1) memancarluaskan atau menyalurkan materi siarannya secara khusus kepada pelanggan melalui radio, televisi, multi- media, atau media informasi lainnya.\n3. Ketentuan Pasal 33 diubah sehingga berbunyi sebagai berikut:\n(1). Penyelenggaraan penyiaran dapat diselenggarakan setelah memenuhi Perizinan Berusaha dari Pemerintah Pusat.\n(2). Lembaga penyiaran wajib membayar biaya Perizinan Berusaha sebagaimana dimaksud pada ayat (1) diatur berdasarkan zona/daerah penyelenggaraan penyiaran yang ditetapkan dengan parameter tingkat ekonomi setiap zona/ daerah.\n(3). Ketentuan lebih lanjut mengenai Perizinan Berusaha sebagaimana dimaksud pada ayat (1) diatur dalam Peraturan Pemerintah dengan cakupan wilayah siaran penyelenggaraan penyiaran dapat meliputi seluruh Indonesia.\n4. Pasal 34 dihapus.\n5. Ketentuan Pasal 55 diubah sehingga berbunyi sebagai berikut:\n(1). Setiap orang yang melanggar ketentuan sebagaimana dimaksud dalam Pasal 15 ayat (2), Pasal 17 ayat (3), Pasal 18 ayat (1), Pasal 18 ayat (2), Pasal 20, Pasal 23, Pasal 24, Pasal 26 ayat (2), Pasal 27, Pasal 28, Pasal 33 ayat (1), Pasal 33 ayat (2), Pasal 36 ayat (2), Pasal 36 ayat (3), Pasal 36 ayat (4), Pasal 39 ayat (1), Pasal 43 ayat (2), Pasal 44 ayat (1), Pasal 45 ayat (1), Pasal 46 ayat (3), Pasal 46 ayat (6), Pasal 46 ayat (7), Pasal 46 ayat (8), Pasal 46 ayat (9), Pasal 46 ayat (10), atau Pasal 46 ayat (11) dikenai sanksi administratif.\n(2). Sanksi administratif sebagaimana dimaksud pada ayat (1) dapat berupa:\na. Teguran tertulis,\nb. Penghentian sementara mata acara yang bermasalah setelah melalui tahap tertentu,\nc. Pembatasan durasi dan waktu siaran,\nd. Denda administratif,\ne. Pembekuan kegiatan siaran untuk waktu tertentu:\nf. ' Tidak diberi perpanjangan Perizinan Berusaha penyelenggaraan penyiaran, dan/atau\ng. Pencabutan Perizinan Berusaha penyelenggaraan penyiaran.\n\n(3). Ketentuan lebih lanjut mengenai kriteria, jenis, besaran denda, dan tata cara pengenaan sanksi administratif sebagaimana dimaksud pada ayat (2) diatur dalam Peraturan Pemerintah.\n6. Ketentuan Pasal 57 diubah sehingga berbunyi sebagai berikut:\n(1). Setiap orang yang melanggar ketentuan sebagaimana dimaksud dalam Pasal 30 ayat (1), Pasal 36 ayat (5), atau Pasal 36 ayat (6) yang dilakukan untuk penyiaran radio dipidana dengan dengan pidana penjara paling lama 5 (lima) tahun atau denda paling banyak Rp1.500.000.000,00 (satu miliar lima ratus juta rupiah).\n(2). Setiap orang yang melanggar ketentuan sebagaimana dimaksud dalam Pasal 30 ayat (1), Pasal 36 ayat (5), atau Pasal 36 ayat (6) yang dilakukan untuk penyiaran televisi dipidana dengan pidana penjara paling lama 5 (lima) tahun atau denda paling banyak Rp10.000.000.000,00 (sepuluh miliar rupiah).\n7. Ketentuan Pasal 58 diubah sehingga berbunyi sebagai berikut:\n(1). Setiap Orang yang melanggar ketentuan sebagaimana dimaksud dalam Pasal 33 ayat (1) untuk penyiaran radio dipidana dengan pidana penjara paling lama 2 (dua) tahun dan/atau denda paling banyak Rp500.000.000,00 (lima ratus juta rupiah).\n(2). Setiap Orang yang melanggar ketentuan sebagaimana dimaksud dalam Pasal 33 ayat (1) untuk penyiaran televisi dipidana dengan pidana penjara paling lama 2 (dua) tahun dan/atau denda paling banyak Rp5.000.000.000,00 (lima miliar rupiah).\n8. Di antara Pasal 60 dan Pasal 61 disisipkan 1 (satu) pasal, yakni Pasal 60A sehingga berbunyi sebagai berikut:\n(1). Penyelenggaraan penyiaran dilaksanakan dengan mengikuti perkembangan teknologi, termasuk migrasi penyiaran dari teknologi analog ke teknologi digital.\n(2). Migrasi penyiaran televisi terestrial dari teknologi analog ke teknologi digital sebagaimana dimaksud pada ayat (1) dan penghentian siaran analog (analog switch offj diselesaikan paling lambat 2 (dua) tahun sejak mulai berlakunya Undang-Undang ini.\n(3). Ketentuan lebih lanjut mengenai migrasi penyiaran dari teknologi analog ke teknologi digital sebagaimana dimaksud pada ayat (1) dan ayat (2) diatur dalam Peraturan Pemerintah.\n|

|1||
|-|-|
|pasal|http://example.org/legal/peraturan/uu/2020/11/pasal/0181|
|text|(1). Pada saat berlakunya Undang-Undang ini, setiap peraturan perundang-undangan di bawah Undang- Undang yang berlaku dan bertentangan dengan ketentuan Undang-Undang ini atau bertentangan dengan peraturan perundang-undangan yang lebih tinggi, atau bertentangan dengan putusan pengadilan harus dilakukan harmonisasi dan sinkronisasi yang dikoordinasikan oleh kementerian atau lembaga yang menyelenggarakan urusan pemerintahan di bidang pembentukan peraturan perundang-undangan.\n(2). Harmonisasi dan sinkronisasi yang berkaitan dengan peraturan daerah dan/atau peraturan kepala daerah, dilaksanakan oleh kementerian atau lembaga yang menyelenggarakan urusan pemerintahan di bidang pembentukan peraturan perundang-undangan bersama dengan kementerian yang menyelenggarakan urusan pemerintahan dalam negeri.\n(3). Ketentuan lebih lanjut mengenai harmonisasi dan sinkronisasi sebagaimana dimaksud pada ayat (1) dan ayat (2) diatur dalam Peraturan Pemerintah.|

|2||
|-|-|
|pasal|http://example.org/legal/peraturan/uu/2020/11/pasal/0060|
|text|Pasal 60 Beberapa ketentuan dalam Undang-Undang Nomor 36 Tahun 2009 tentang Kesehatan (Lembaran Negara Republik Indonesia Tahun 2009 Nomor 144, Tambahan Lembaran Negara Republik Indonesia Nomor 5063) diubah sebagai berikut.\n1. Ketentuan Pasal 30 diubah sehingga berbunyi sebagai berikut:\n(1). Fasilitas pelayanan kesehatan menurut jenis pelayanannya terdiri atas:\na. pelayanan kesehatan perseorangan, dan\nb. pelayanan kesehatan masyarakat.\n\n(2). Fasilitas pelayanan kesehatan sebagaimana dimaksud pada ayat (1) meliputi:\na. pelayanan kesehatan tingkat pertama,\nb. pelayanan kesehatan tingkat kedua, dan\nc. . pelayanan kesehatan tingkat ketiga.\n\n(3). Fasilitas pelayanan kesehatan sebagaimana dimaksud pada ayat (1) dilaksanakan oleh pihak Pemerintah Pusat, Pemerintah Daerah, dan swasta.\n(4). Setiap fasilitas pelayanan kesehatan wajib memenuhi Perizinan Berusaha dari Pemerintah Pusat atau Pemerintah Daerah sesuai dengan kewenangannya berdasarkan norma, standar, prosedur, dan kriteria yang ditetapkan oleh Pemerintah Pusat.\n2. Ketentuan Pasal 35 diubah sehingga berbunyi sebagai berikut:\nPasal 35 Ketentuan lebih lanjut mengenai fasilitas pelayanan kesehatan dan Perizinan Berusaha diatur dalam Peraturan Pemerintah.\n3. Ketentuan Pasal 60 diubah sehingga berbunyi sebagai berikut:\n(1). Setiap orang yang melakukan pelayanan kesehatan tradisional yang menggunakan alat dan teknologi wajib memenuhi Perizinan Berusaha dari Pemerintah Pusat atau Pemerintah Daerah sesuai dengan kewenangannya berdasarkan norma, standar, prosedur, dan kriteria yang ditetapkan oleh Pemerintah Pusat.\n(2). Ketentuan lebih lanjut mengenai Perizinan Berusaha sebagaimana dimaksud pada ayat (1) diatur dalam Peraturan Pemerintah.\n4. Ketentuan Pasal 106 diubah sehingga berbunyi sebagai berikut: .\n(1). Setiap orang yang memproduksi dan/atau mengedarkan sediaan farmasi dan alat kesehatan harus memenuhi Perizinan Berusaha dari Pemerintah Pusat atau Pemerintah Daerah sesuai dengan kewenangannya berdasarkan norma, standar, prosedur, dan kriteria yang ditetapkan oleh Pemerintah Pusat.\n(2). Sediaan farmasi dan alat kesehatan hanya dapat diedarkan setelah memenuhi Perizinan Berusaha dari Pemerintah Pusat atau Pemerintah Daerah sesuai dengan kewenangannya berdasarkan norma, standar, prosedur, dan kriteria yang ditetapkan oleh Pemerintah Pusat.\n(3). Pemerintah Pusat atau Pemerintah Daerah sesuai dengan kewenangannya berdasarkan norma, standar, prosedur, dan kriteria yang ditetapkan oleh Pemerintah Pusat berwenang mencabut Perizinan Berusaha dan memerintahkan penarikan dari peredaran sediaan farmasi dan alat kesehatan yang telah memperoleh Perizinan Berusaha, yang terbukti tidak memenuhi persyaratan mutu dan/atau keamanan dan/atau kemanfaatan, dan alat kesehatan tersebut dapat disita dan dimusnahkan sesuai dengan ketentuan peraturan perundang-undangan.\n(4). Ketentuan lebih lanjut mengenai Perizinan Berusaha terkait sediaan farmasi dan alat kesehatan sebagaimana dimaksud pada ayat (1) dan ayat (2) diatur dalam Peraturan Pemerintah.\n5. Ketentuan Pasal 111 diubah sehingga berbunyi sebagai berikut:\n(1). Makanan dan minuman yang dipergunakan untuk masyarakat harus didasarkan pada standar dan/atau persyaratan kesehatan. api\n(2). Makanan dan minuman hanya dapat diedarkan setelah memenuhi Perizinan Berusaha dari Pemerintah Pusat atau Pemerintah Daerah sesuai dengan kewenangannya berdasarkan norma, standar, prosedur, dan kriteria yang ditetapkan oleh Pemerintah Pusat.\n(3). Makanan dan minuman yang tidak memenuhi ketentuan standar, persyaratan kesehatan, dan/atau membahayakan kesehatan sebagaimana dimaksud pada ayat (1) dilarang untuk diedarkan, serta harus ditarik dari peredaran, dicabut Perizinan Berusaha, dan diamankan/ disita untuk dimusnahkan sesuai dengan ketentuan peraturan perundang-undangan.\n(4). Ketentuan lebih lanjut mengenai Perizinan Berusaha terkait makanan dan minuman sebagaimana dimaksud pada ayat (2) dan ayat (3) diatur dalam Peraturan Pemerintah.\n6. Ketentuan Pasal 182 diubah sehingga berbunyi sebagai berikut:\n(1). Pemerintah Pusat atau Pemerintah Daerah sesuai dengan kewenangannya melakukan pengawasan terhadap masyarakat dan setiap penyelenggara kegiatan yang berhubungan dengan sumber daya di bidang kesehatan dan upaya kesehatan berdasarkan norma, standar, prosedur, dan kriteria yang ditetapkan oleh Pemerintah Pusat.\n(2). Pemerintah Pusat atau Pemerintah Daerah sesuai dengan kewenangannya dalam melakukan pengawasan dapat memberikan Perizinan Berusaha terhadap setiap penyelenggaraan upaya kesehatan berdasarkan norma, standar, prosedur, dan kriteria yang ditetapkan oleh Pemerintah Pusat.\n(3). Pemerintah Pusat dalam melaksanakan pengawasan dapat mendelegasikan pengawasan kepada Pemerintah Daerah dan mengikutsertakan masyarakat. SK No 050954 A So\n7. Ketentuan Pasal 183 diubah sehingga berbunyi sebagai berikut:\nPasal 183 Pemerintah Pusat atau Pemerintah Daerah sesuai dengan kewenangan sebagaimana dimaksud dalam Pasal 182 dalam melaksanakan tugasnya dapat mengangkat tenaga pengawas dengan tugas pokok untuk melakukan pengawasan terhadap segala sesuatu yang berhubungan dengan sumber daya di bidang kesehatan dan upaya kesehatan.\n8. Ketentuan Pasal 187 diubah sehingga berbunyi sebagai berikut:\nPasal 187 Ketentuan lebih lanjut mengenai pengawasan dalam penyelenggaraan upaya di bidang kesehatan diatur dalam Peraturan Pemerintah.\n9. Ketentuan Pasal 188 diubah sehingga berbunyi sebagai berikut:\nPasal 188 Pemerintah Pusat atau Pemerintah Daerah sesuai dengan kewenangannya berdasarkan norma, standar, prosedur, dan kriteria yang ditetapkan oleh Pemerintah Pusat dapat mengambil tindakan administratif terhadap tenaga kesehatan dan fasilitas pelayanan kesehatan yang melanggar ketentuan sebagaimana diatur dalam Undang-Undang ini.\n10. Ketentuan Pasal 197 diubah sehingga berbunyi sebagai berikut:\nPasal 197 Setiap Orang yang dengan sengaja memproduksi atau mengedarkan sediaan farmasi dan/atau alat kesehatan yang tidak memiliki Perizinan Berusaha sebagaimana dimaksud dalam Pasal 106 ayat (1), dan ayat (2), dipidana dengan pidana penjara paling lama 15 (lima belas) tahun dan denda paling banyak Rp1.500.000.000,00 (satu miliar lima ratus juta rupiah).\n|

# Query_003

query:

```sparql
# What is the textual content of Article (or Pasal) 2 Subsection (or Ayat) 1 of Omnibus Law?
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?x ?text WHERE {
  ?pasal legal:bagianDari+ <http://example.org/legal/peraturan/uu/2020/11>.
  ?pasal legal:nomor 2 .
  ?x legal:bagianDari* ?pasal .
  ?x legal:nomor 1 .
  ?x legal:teks ?text .
} LIMIT 3
```

result:
|0||
|-|-|
|x|http://example.org/legal/peraturan/uu/2020/11/pasal/0002/versi/20201102/ayat/0001|
|text|Undang-Undang ini diselenggarakan berdasarkan asas:\na. pemerataan hak,\nb. kepastian hukum:\nc. kemudahan berusaha:\nd. kebersamaan: dan\ne. kemandirian.\n|

|1||
|-|-|
|x|http://example.org/legal/peraturan/uu/2020/11/pasal/0173/versi/20201102/ayat/0001|
|text|Pemerintah Pusat atau Pemerintah Daerah sesuai dengan kewenangannya berdasarkan norma, standar, prosedur, dan kriteria yang ditetapkan oleh Pemerintah Pusat bertanggung jawab dalam menyediakan lahan dan Perizinan Berusaha bagi proyek strategis nasional dari Pemerintah Pusat, Pemerintah Daerah, Badan Usaha Milik Negara, atau Badan Usaha Milik Daerah.|

|2||
|-|-|
|x|http://example.org/legal/peraturan/uu/2020/11/pasal/0172/versi/20201102/ayat/0001|
|text|Lembaga Pengelola Investasi dapat melakukan transaksi baik langsung maupun tidak langsung dengan entitas yang dimilikinya.|

# Query_003_latest

query:

```sparql
# What is the textual content of Article (or Pasal) 2 Subsection (or Ayat) 1 of Omnibus Law?
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?x ?text WHERE {
  {
    SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
      <http://example.org/legal/peraturan/uu/2020/11> legal:pasal ?pasal .
      ?pasal legal:nomor 2 .
      ?pasal legal:versi ?pasalVersion .
    } GROUP BY ?pasal
  }
  ?x legal:bagianDari* ?latestPasalVersion .
  ?x legal:nomor 1 .
  ?x legal:teks ?text .
} LIMIT 3
```

result:
|0||
|-|-|
|x|http://example.org/legal/peraturan/uu/2020/11/pasal/0002/versi/20201102/ayat/0001|
|text|Undang-Undang ini diselenggarakan berdasarkan asas:\na. pemerataan hak,\nb. kepastian hukum:\nc. kemudahan berusaha:\nd. kebersamaan: dan\ne. kemandirian.\n|

# Query_004

query:

```sparql
# Which are the articles of Chapter 2 (Bab 2) of Omnibus Law?
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?pasal ?text WHERE {
  ?bab legal:bagianDari+ <http://example.org/legal/peraturan/uu/2020/11>.
  ?bab legal:nomor 2 .
  ?pasal legal:bagianDari+ ?bab .
  ?pasal legal:versi ?pasalVersion .
  ?pasalVersion legal:teks ?text
} LIMIT 3
```

result:
|0||
|-|-|
|pasal|http://example.org/legal/peraturan/uu/2020/11/pasal/0175|
|text|Pasal 175 Beberapa ketentuan dalam Undang-Undang Nomor 30 Tahun 2014 tentang Administrasi Pemerintahan (Lembaran Negara Republik Indonesia Tahun 2014 Nomor 292, Tambahan Lembaran Negara Republik Indonesia Nomor 5601) diubah menjadi sebagai berikut:\n1. Di antara Pasal 1 angka 19 dan Pasal 1 angka 20 disisipkan 1 (satu) angka baru, yakni angka 19a sehingga berbunyi:\n\n1. Administrasi Pemerintahan adalah tata laksana dalam pengambilan keputusan dan/atau tindakan oleh badan dan/atau pejabat pemerintahan.\n2. Fungsi Pemerintahan adalah fungsi dalam melaksanakan Administrasi Pemerintahan yang meliputi fungsi pengaturan, pelayanan, pembangunan, pemberdayaan, dan pelindungan.\n3. Badan dan/atau Pejabat Pemerintahan adalah unsur yang melaksanakan Fungsi Pemerintahan, baik di lingkungan pemerintah maupun penyelenggara negara lainnya.\n4. Atasan Pejabat adalah atasan pejabat langsung yang mempunyai kedudukan dalam organisasi atau strata pemerintahan yang lebih tinggi.\n5. Wewenang adalah hak yang dimiliki oleh Badan dan/atau Pejabat Pemerintahan atau penyelenggara negara lainnya untuk mengambil keputusan dan/atau tindakan dalam penyelenggaraan pemerintahan.\n6. Kewenangan Pemerintahan yang selanjutnya disebut Kewenangan adalah kekuasaan Badan dan/atau Pejabat Pemerintahan atau penyelenggara negara lainnya untuk bertindak dalam ranah hukum publik.\n7. Keputusan Administrasi Pemerintahan yang juga disebut Keputusan Tata Usaha Negara atau Keputusan Administrasi Negara yang selanjutnya disebut Keputusan adalah ketetapan tertulis yang dikeluarkan oleh Badan dan/atau Pejabat Pemerintahan dalam penyelenggaraan pemerintahan. | 3 — PRESIDEN\n8. Tindakan Administrasi Pemerintahan yang selanjutnya disebut Tindakan adalah perbuatan Pejabat Pemerintahan atau penyelenggara negara lannya untuk melakukan dan/atau tidak melakukan perbuatan konkret dalam rangka penyelenggaraan pemerintahan.\n9. Diskresi adalah Keputusan dan/atau Tindakan yang ditetapkan dan/atau dilakukan oleh Pejabat Pemerintahan untuk mengatasi persoalan konkret yang dihadapi dalam penyelenggaraan pemerintahan dalam hal peraturan perundang-undangan yang memberikan pilihan, tidak mengatur, tidak lengkap atau tidak jelas, dan/atau adanya stagnasi pemerintahan.\n10. Bantuan Kedinasan adalah kerja sama antara Badan dan/atau Pejabat Pemerintahan guna kelancaran pelayanan Administrasi Pemerintahan di suatu instansi pemerintahan yang membutuhkan.\n11. Keputusan Berbentuk Elektronis adalah Keputusan yang dibuat atau disampaikan dengan menggunakan atau memanfaatkan media elektronik.\n12. Legalisasi adalah pernyataan Badan dan/atau Pejabat Pemerintahan mengenai keabsahan suatu Salinan surat atau dokumen Administrasi Pemerintahan yang dinyatakan sesuai dengan aslinya.\n13. Sengketa Kewenangan adalah klaim penggunaan Wewenang yang dilakukan oleh 2 (dua) Pejabat Pemerintahan atau lebih yang disebabkan oleh tumpang tindih atau tidak jelasnya Pejabat Pemerintahan yang berwenang menangani suatu urusan pemerintahan.\n14. Konflik Kepentingan adalah kondisi Pejabat Pemerintahan yang memiliki kepentingan pribadi untuk menguntungkan diri sendiri dan/atau orang lain dalam penggunaan Wewenang sehingga dapat mempengaruhi netralitas dan kualitas Keputusan dan/atau Tindakan yang dibuat dan/atau dilakukannya. 5\n15. Warga Masyarakat adalah seseorang atau badan hukum perdata yang terkait dengan Keputusan dan/atau Tindakan.\n16. Upaya Administratif adalah penyelesaian sengketa yang dilakukan dalam lingkungan Administrasi Pemerintahan sebagai akibat dikeluarkannya Keputusan dan/atau Tindakan yang merugikan.\n17. Asas-asas Umum Pemerintahan yang Baik yang selanjutnya disingkat AUPB adalah prinsip yang digunakan sebagai acuan penggunaan Wewenang bagi Pejabat Pemerintahan dalam mengeluarkan Keputusan dan/atau Tindakan dalam penyelenggaraan pemerintahan.\n18. Pengadilan adalah Pengadilan Tata Usaha Negara.\n19. Izin adalah Keputusan Pejabat Pemerintahan yang berwenang sebagai wujud persetujuan atas permohonan Warga Masyarakat sesuai dengan ketentuan peraturan perundang-undangan. 19a. Standar adalah Keputusan Pejabat Pemerintahan yang berwenang atau Lembaga yang diakui oleh Pemerintah Pusat sebagai wujud persetujuan atas pernyataan untuk pemenuhan seluruh persyaratan yang ditetapkan sesuai dengan ketentuan peraturan perundang-undangan.\n20. Konsesi adalah Keputusan Pejabat Pemerintahan yang berwenang sebagai wujud persetujuan dari kesepakatan Badan dan/atau Pejabat Pemerintahan dengan selain Badan dan/atau Pejabat Pemerintahan dalam pengelolaan fasilitas umum dan/atau sumber daya alam dan pengelolaan lainnya sesuai dengan ketentuan peraturan perundang-undangan.\n21. Dispensasi adalah Keputusan Pejabat Pemerintahan yang berwenang sebagai wujud persetujuan atas permohonan Warga Masyarakat yang merupakan pengecualian terhadap suatu larangan atau perintah sesuai dengan ketentuan peraturan perundang- undangan. -\n22. Atribusi adalah pemberian Kewenangan kepada Badan dan/atau Pejabat Pemerintahan oleh Undang-Undang Dasar Negara Republik Indonesia Tahun 1945 atau Undang-Undang.\n23. Delegasi adalah pelimpahan Kewenangan dari Badan dan/atau Pejabat Pemerintahan yang lebih tinggi kepada Badan dan/atau Pejabat Pemerintahan yang lebih rendah dengan tanggung jawab dan tanggung gugat beralih sepenuhnya kepada penerima delegasi.\n24. Mandat adalah pelimpahan Kewenangan dari Badan dan/atau Pejabat Pemerintahan yang lebih tinggi kepada Badan dan/atau Pejabat Pemerintahan yang lebih rendah dengan tanggung jawab dan tanggung gugat tetap berada pada pemberi mandat.\n25. Menteri adalah menteri yang menyelenggarakan urusan pemerintahan di bidang pendayagunaan aparatur negara.\n\n2. Ketentuan Pasal 24 diubah sehingga berbunyi sebagai berikut:\nPejabat Pemerintahan yang menggunakan Diskresi harus memenuhi syarat:\na. sesuai dengan tujuan Diskresi sebagaimana dimaksud dalam Pasal 22 ayat (2):\nb. sesuai dengan AUPB,\nc. berdasarkan alasan-alasan yang objektif:\nd. tidak menimbulkan Konflik Kepentingan: dan\ne. dilakukan dengan iktikad baik.\n\n3. Ketentuan Pasal 38 diubah sehingga berbunyi sebagai berikut: — PRESIDEN\n(1). Pejabat dan/atau Badan Pemerintahan dapat membuat Keputusan Berbentuk Elektronis.\n(2). Keputusan Berbentuk Elektronis wajib dibuat atau disampaikan terhadap Keputusan yang diproses oleh sistem elektronik yang ditetapkan Pemerintah Pusat.\n(3). Keputusan Berbentuk Elektronis berkekuatan hukum sama dengan Keputusan yang tertulis dan berlaku sejak diterimanya Keputusan tersebut oleh pihak yang bersangkutan.\n(4). Dalam hal Keputusan dibuat dalam bentuk elektronis, tidak dibuat Keputusan dalam bentuk tertulis.\n5. Di antara Pasal 39 dan Pasal 40 disisipkan 1 (satu) pasal, yakni Pasal 39A yang berbunyi sebagai berikut:\n(1). Badan dan/atau Pejabat Pemerintahan wajib melakukan pembinaan dan pengawasan atas pelaksanaan Izin, Standar, Dispensasi, dan/atau Konsesi.\n(2). Pembinaan dan pengawasan terhadap Izin, Standar, Dispensasi, dan/atau Konsesi sebagaimana dimaksud pada ayat (1) dapat dikerjasamakan dengan atau dilakukan oleh profesi yang memiliki sertifikat keahlian sesuai dengan bidang pengawasan.\n(3). Ketentuan mengenai jenis, bentuk, dan mekanisme pembinaan dan pengawasan atas Izin, Standar, Dispensasi, dan/atau Konsesi yang dapat dilakukan oleh profesi sebagaimana dimaksud pada ayat (2) diatur dalam Peraturan Presiden.\n6. Ketentuan Pasal 53 diubah sehingga berbunyi sebagai berikut:\n(1). Batas waktu kewajiban untuk menetapkan dan/atau melakukan Keputusan dan/atau Tindakan diberikan sesuai dengan ketentuan peraturan perundang- undangan.\n(2). Jika ketentuan peraturan perundang-undangan tidak menentukan batas waktu kewajiban sebagaimana dimaksud pada ayat (1), Badan dan/atau Pejabat Pemerintahan wajib menetapkan dan/atau melakukan Keputusan dan/atau Tindakan dalam waktu paling lama 5 (lima) hari kerja setelah permohonan diterima secara lengkap oleh Badan dan/atau Pejabat Pemerintahan.\n(3). Dalam hal permohonan diproses melalui sistem elektronik dan seluruh persyaratan dalam sistem elektronik telah terpenuhi, sistem elektronik menetapkan Keputusan dan/atau Tindakan sebagai Keputusan atau Tindakan Badan atau Pejabat Pemerintahan yang berwenang.\n(4). Apabila dalam batas waktu sebagaimana dimaksud pada ayat (2), Badan dan/atau Pejabat Pemerintahan tidak menetapkan dan/atau melakukan Keputusan dan/atau Tindakan, permohonan dianggap dikabulkan secara hukum.\n(5). Ketentuan lebih lanjut mengenai bentuk penetapan Keputusan dan/atau Tindakan yang dianggap dikabulkan secara hukum sebagaimana dimaksud pada ayat (3) diatur dalam Peraturan Presiden.\n|

|1||
|-|-|
|pasal|http://example.org/legal/peraturan/uu/2020/11/pasal/0173|
|text|(1). Pemerintah Pusat atau Pemerintah Daerah sesuai dengan kewenangannya berdasarkan norma, standar, prosedur, dan kriteria yang ditetapkan oleh Pemerintah Pusat bertanggung jawab dalam menyediakan lahan dan Perizinan Berusaha bagi proyek strategis nasional dari Pemerintah Pusat, Pemerintah Daerah, Badan Usaha Milik Negara, atau Badan Usaha Milik Daerah.\n(2). Dalam hal pengadaan tanah belum dapat dilaksanakan oleh Pemerintah Pusat atau Pemerintah Daerah sesuai dengan kewenangannya berdasarkan norma, standar, prosedur, dan kriteria yang ditetapkan oleh Pemerintah Pusat, pengadaan tanah untuk proyek strategis nasional dapat dilakukan oleh badan usaha. “ PRESIDEN\n(3). Pengadaan tanah untuk proyek strategis nasional sebagaimana dimaksud pada ayat (1) dan ayat (2) dilaksanakan dengan mempertimbangkan prinsip kemampuan keuangan negara dan kesinambungan fiskal.\n(4). Dalam hal pengadaan tanah sebagaimana dimaksud pada ayat (2) dilakukan oleh badan usaha, mekanisme pengadaan tanah dilaksanakan sesuai dengan ketentuan peraturan perundang-undangan mengenai pengadaan tanah untuk kepentingan umum.\n(5). Ketentuan lebih lanjut mengenai pengadaan tanah dan Perizinan Berusaha bagi proyek strategis nasional diatur dalam Peraturan Pemerintah.|

|2||
|-|-|
|pasal|http://example.org/legal/peraturan/uu/2020/11/pasal/0172|
|text|(1). Lembaga Pengelola Investasi dapat melakukan transaksi baik langsung maupun tidak langsung dengan entitas yang dimilikinya.\n(2). Perlakuan perpajakan atas transaksi yang melibatkan Lembaga Pengelola Investasi dan/atau entitas yang dimilikinya, termasuk transaksi sebagaimana dimaksud pada ayat (1), diatur dengan atau berdasarkan Peraturan Pemerintah.|

# Query_004_latest

query:

```sparql
# Which are the articles of Chapter 2 (Bab 2) of Omnibus Law?
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?pasal ?text WHERE {
  {
    SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
      ?bab legal:bagianDari+ <http://example.org/legal/peraturan/uu/2020/11>.
      ?bab legal:nomor 2 .
      ?pasal legal:bagianDari+ ?bab .
      ?pasal legal:versi ?pasalVersion .
    } GROUP BY ?pasal
  }
  ?latestPasalVersion legal:teks ?text
} LIMIT 3
```

result:
|0||
|-|-|
|pasal|http://example.org/legal/peraturan/uu/2020/11/pasal/0171|
|text|(1). Lembaga Pengelola Investasi yang dibentuk dengan Undang-Undang ini hanya dapat dibubarkan dengan Undang-Undang. @\n(2). Pembinaan Lembaga Pengelola Investasi dilaksanakan oleh Menteri Keuangan.\n(3). Ketentuan lebih lanjut mengenai Lembaga Pengelola Investasi diatur dalam Peraturan Pemerintah.|

|1||
|-|-|
|pasal|http://example.org/legal/peraturan/uu/2020/11/pasal/0175|
|text|Pasal 175 Beberapa ketentuan dalam Undang-Undang Nomor 30 Tahun 2014 tentang Administrasi Pemerintahan (Lembaran Negara Republik Indonesia Tahun 2014 Nomor 292, Tambahan Lembaran Negara Republik Indonesia Nomor 5601) diubah menjadi sebagai berikut:\n1. Di antara Pasal 1 angka 19 dan Pasal 1 angka 20 disisipkan 1 (satu) angka baru, yakni angka 19a sehingga berbunyi:\n\n1. Administrasi Pemerintahan adalah tata laksana dalam pengambilan keputusan dan/atau tindakan oleh badan dan/atau pejabat pemerintahan.\n2. Fungsi Pemerintahan adalah fungsi dalam melaksanakan Administrasi Pemerintahan yang meliputi fungsi pengaturan, pelayanan, pembangunan, pemberdayaan, dan pelindungan.\n3. Badan dan/atau Pejabat Pemerintahan adalah unsur yang melaksanakan Fungsi Pemerintahan, baik di lingkungan pemerintah maupun penyelenggara negara lainnya.\n4. Atasan Pejabat adalah atasan pejabat langsung yang mempunyai kedudukan dalam organisasi atau strata pemerintahan yang lebih tinggi.\n5. Wewenang adalah hak yang dimiliki oleh Badan dan/atau Pejabat Pemerintahan atau penyelenggara negara lainnya untuk mengambil keputusan dan/atau tindakan dalam penyelenggaraan pemerintahan.\n6. Kewenangan Pemerintahan yang selanjutnya disebut Kewenangan adalah kekuasaan Badan dan/atau Pejabat Pemerintahan atau penyelenggara negara lainnya untuk bertindak dalam ranah hukum publik.\n7. Keputusan Administrasi Pemerintahan yang juga disebut Keputusan Tata Usaha Negara atau Keputusan Administrasi Negara yang selanjutnya disebut Keputusan adalah ketetapan tertulis yang dikeluarkan oleh Badan dan/atau Pejabat Pemerintahan dalam penyelenggaraan pemerintahan. | 3 — PRESIDEN\n8. Tindakan Administrasi Pemerintahan yang selanjutnya disebut Tindakan adalah perbuatan Pejabat Pemerintahan atau penyelenggara negara lannya untuk melakukan dan/atau tidak melakukan perbuatan konkret dalam rangka penyelenggaraan pemerintahan.\n9. Diskresi adalah Keputusan dan/atau Tindakan yang ditetapkan dan/atau dilakukan oleh Pejabat Pemerintahan untuk mengatasi persoalan konkret yang dihadapi dalam penyelenggaraan pemerintahan dalam hal peraturan perundang-undangan yang memberikan pilihan, tidak mengatur, tidak lengkap atau tidak jelas, dan/atau adanya stagnasi pemerintahan.\n10. Bantuan Kedinasan adalah kerja sama antara Badan dan/atau Pejabat Pemerintahan guna kelancaran pelayanan Administrasi Pemerintahan di suatu instansi pemerintahan yang membutuhkan.\n11. Keputusan Berbentuk Elektronis adalah Keputusan yang dibuat atau disampaikan dengan menggunakan atau memanfaatkan media elektronik.\n12. Legalisasi adalah pernyataan Badan dan/atau Pejabat Pemerintahan mengenai keabsahan suatu Salinan surat atau dokumen Administrasi Pemerintahan yang dinyatakan sesuai dengan aslinya.\n13. Sengketa Kewenangan adalah klaim penggunaan Wewenang yang dilakukan oleh 2 (dua) Pejabat Pemerintahan atau lebih yang disebabkan oleh tumpang tindih atau tidak jelasnya Pejabat Pemerintahan yang berwenang menangani suatu urusan pemerintahan.\n14. Konflik Kepentingan adalah kondisi Pejabat Pemerintahan yang memiliki kepentingan pribadi untuk menguntungkan diri sendiri dan/atau orang lain dalam penggunaan Wewenang sehingga dapat mempengaruhi netralitas dan kualitas Keputusan dan/atau Tindakan yang dibuat dan/atau dilakukannya. 5\n15. Warga Masyarakat adalah seseorang atau badan hukum perdata yang terkait dengan Keputusan dan/atau Tindakan.\n16. Upaya Administratif adalah penyelesaian sengketa yang dilakukan dalam lingkungan Administrasi Pemerintahan sebagai akibat dikeluarkannya Keputusan dan/atau Tindakan yang merugikan.\n17. Asas-asas Umum Pemerintahan yang Baik yang selanjutnya disingkat AUPB adalah prinsip yang digunakan sebagai acuan penggunaan Wewenang bagi Pejabat Pemerintahan dalam mengeluarkan Keputusan dan/atau Tindakan dalam penyelenggaraan pemerintahan.\n18. Pengadilan adalah Pengadilan Tata Usaha Negara.\n19. Izin adalah Keputusan Pejabat Pemerintahan yang berwenang sebagai wujud persetujuan atas permohonan Warga Masyarakat sesuai dengan ketentuan peraturan perundang-undangan. 19a. Standar adalah Keputusan Pejabat Pemerintahan yang berwenang atau Lembaga yang diakui oleh Pemerintah Pusat sebagai wujud persetujuan atas pernyataan untuk pemenuhan seluruh persyaratan yang ditetapkan sesuai dengan ketentuan peraturan perundang-undangan.\n20. Konsesi adalah Keputusan Pejabat Pemerintahan yang berwenang sebagai wujud persetujuan dari kesepakatan Badan dan/atau Pejabat Pemerintahan dengan selain Badan dan/atau Pejabat Pemerintahan dalam pengelolaan fasilitas umum dan/atau sumber daya alam dan pengelolaan lainnya sesuai dengan ketentuan peraturan perundang-undangan.\n21. Dispensasi adalah Keputusan Pejabat Pemerintahan yang berwenang sebagai wujud persetujuan atas permohonan Warga Masyarakat yang merupakan pengecualian terhadap suatu larangan atau perintah sesuai dengan ketentuan peraturan perundang- undangan. -\n22. Atribusi adalah pemberian Kewenangan kepada Badan dan/atau Pejabat Pemerintahan oleh Undang-Undang Dasar Negara Republik Indonesia Tahun 1945 atau Undang-Undang.\n23. Delegasi adalah pelimpahan Kewenangan dari Badan dan/atau Pejabat Pemerintahan yang lebih tinggi kepada Badan dan/atau Pejabat Pemerintahan yang lebih rendah dengan tanggung jawab dan tanggung gugat beralih sepenuhnya kepada penerima delegasi.\n24. Mandat adalah pelimpahan Kewenangan dari Badan dan/atau Pejabat Pemerintahan yang lebih tinggi kepada Badan dan/atau Pejabat Pemerintahan yang lebih rendah dengan tanggung jawab dan tanggung gugat tetap berada pada pemberi mandat.\n25. Menteri adalah menteri yang menyelenggarakan urusan pemerintahan di bidang pendayagunaan aparatur negara.\n\n2. Ketentuan Pasal 24 diubah sehingga berbunyi sebagai berikut:\nPejabat Pemerintahan yang menggunakan Diskresi harus memenuhi syarat:\na. sesuai dengan tujuan Diskresi sebagaimana dimaksud dalam Pasal 22 ayat (2):\nb. sesuai dengan AUPB,\nc. berdasarkan alasan-alasan yang objektif:\nd. tidak menimbulkan Konflik Kepentingan: dan\ne. dilakukan dengan iktikad baik.\n\n3. Ketentuan Pasal 38 diubah sehingga berbunyi sebagai berikut: — PRESIDEN\n(1). Pejabat dan/atau Badan Pemerintahan dapat membuat Keputusan Berbentuk Elektronis.\n(2). Keputusan Berbentuk Elektronis wajib dibuat atau disampaikan terhadap Keputusan yang diproses oleh sistem elektronik yang ditetapkan Pemerintah Pusat.\n(3). Keputusan Berbentuk Elektronis berkekuatan hukum sama dengan Keputusan yang tertulis dan berlaku sejak diterimanya Keputusan tersebut oleh pihak yang bersangkutan.\n(4). Dalam hal Keputusan dibuat dalam bentuk elektronis, tidak dibuat Keputusan dalam bentuk tertulis.\n5. Di antara Pasal 39 dan Pasal 40 disisipkan 1 (satu) pasal, yakni Pasal 39A yang berbunyi sebagai berikut:\n(1). Badan dan/atau Pejabat Pemerintahan wajib melakukan pembinaan dan pengawasan atas pelaksanaan Izin, Standar, Dispensasi, dan/atau Konsesi.\n(2). Pembinaan dan pengawasan terhadap Izin, Standar, Dispensasi, dan/atau Konsesi sebagaimana dimaksud pada ayat (1) dapat dikerjasamakan dengan atau dilakukan oleh profesi yang memiliki sertifikat keahlian sesuai dengan bidang pengawasan.\n(3). Ketentuan mengenai jenis, bentuk, dan mekanisme pembinaan dan pengawasan atas Izin, Standar, Dispensasi, dan/atau Konsesi yang dapat dilakukan oleh profesi sebagaimana dimaksud pada ayat (2) diatur dalam Peraturan Presiden.\n6. Ketentuan Pasal 53 diubah sehingga berbunyi sebagai berikut:\n(1). Batas waktu kewajiban untuk menetapkan dan/atau melakukan Keputusan dan/atau Tindakan diberikan sesuai dengan ketentuan peraturan perundang- undangan.\n(2). Jika ketentuan peraturan perundang-undangan tidak menentukan batas waktu kewajiban sebagaimana dimaksud pada ayat (1), Badan dan/atau Pejabat Pemerintahan wajib menetapkan dan/atau melakukan Keputusan dan/atau Tindakan dalam waktu paling lama 5 (lima) hari kerja setelah permohonan diterima secara lengkap oleh Badan dan/atau Pejabat Pemerintahan.\n(3). Dalam hal permohonan diproses melalui sistem elektronik dan seluruh persyaratan dalam sistem elektronik telah terpenuhi, sistem elektronik menetapkan Keputusan dan/atau Tindakan sebagai Keputusan atau Tindakan Badan atau Pejabat Pemerintahan yang berwenang.\n(4). Apabila dalam batas waktu sebagaimana dimaksud pada ayat (2), Badan dan/atau Pejabat Pemerintahan tidak menetapkan dan/atau melakukan Keputusan dan/atau Tindakan, permohonan dianggap dikabulkan secara hukum.\n(5). Ketentuan lebih lanjut mengenai bentuk penetapan Keputusan dan/atau Tindakan yang dianggap dikabulkan secara hukum sebagaimana dimaksud pada ayat (3) diatur dalam Peraturan Presiden.\n|

|2||
|-|-|
|pasal|http://example.org/legal/peraturan/uu/2020/11/pasal/0010|
|text|(1). Perizinan Berusaha untuk kegiatan usaha berisiko tinggi sebagaimana dimaksud dalam Pasal 7 ayat (7) huruf c berupa pemberian:\na. nomor induk berusaha: dan\nb. izin.\n\n(2). Izin sebagaimana dimaksud pada ayat (1) huruf b merupakan persetujuan Pemerintah Pusat atau Pemerintah Daerah untuk pelaksanaan kegiatan usaha yang wajib dipenuhi oleh Pelaku Usaha sebelum melaksanakan kegiatan usahanya.\n(3). Dalam hal kegiatan usaha berisiko tinggi memerlukan pemenuhan standar usaha dan standar produk, Pemerintah Pusat atau Pemerintah Daerah menerbitkan sertifikat standar usaha dan sertifikat standar produk berdasarkan hasil verifikasi pemenuhan standar.|

# Query_005

query:

```sparql
# Get subsections (= ayat) containing "kompensasi" and "buruh" that are added by Omnibus Law into other laws
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?ayat ?text WHERE {
  ?insertingPoint legal:bagianDari+ <http://example.org/legal/peraturan/uu/2020/11> .
  ?insertingPoint legal:menyisipkan ?insertedPasalVersion .
  ?ayat legal:bagianDari+ ?insertedPasalVersion .
  ?ayat legal:teks ?text
  FILTER REGEX(str(?text), "kompensasi")
  FILTER REGEX(str(?text), "buruh")
} LIMIT 3
```

result:
|0||
|-|-|
|ayat|http://example.org/legal/peraturan/uu/2003/13/pasal/0061A/versi/20201102/ayat/0002|
|text|Uang kompensasi sebagaimana dimaksud pada ayat (1) diberikan kepada pekerja/buruh sesuai dengan masa kerja pekerja/buruh di perusahaan yang bersangkutan.|

|1||
|-|-|
|ayat|http://example.org/legal/peraturan/uu/2003/13/pasal/0061A/versi/20201102/ayat/0002/text|
|text|Uang kompensasi sebagaimana dimaksud pada ayat (1) diberikan kepada pekerja/buruh sesuai dengan masa kerja pekerja/buruh di perusahaan yang bersangkutan.|

|2||
|-|-|
|ayat|http://example.org/legal/peraturan/uu/2003/13/pasal/0061A/versi/20201102/ayat/0001|
|text|Dalam hal perjanjian kerja waktu tertentu berakhir sebagaimana dimaksud dalam Pasal 61 ayat (1) huruf b dan huruf c, pengusaha wajib memberikan uang kompensasi kepada pekerja/ buruh.|

# Query_005_latest

query:

```sparql
# Get subsections (= ayat) containing "kompensasi" and "buruh" that are added by Omnibus Law into other laws
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?ayat ?text WHERE {
  {
    SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
      ?pasal legal:bagianDari+ <http://example.org/legal/peraturan/uu/2020/11>.
      ?pasal legal:versi ?pasalVersion .
    } GROUP BY ?pasal
  }
  ?insertingPoint legal:bagianDari+ ?latestPasalVersion .
  ?insertingPoint legal:menyisipkan ?insertedPasalVersion .
  ?ayat legal:bagianDari+ ?insertedPasalVersion .
  ?ayat legal:teks ?text
  FILTER REGEX(str(?text), "kompensasi")
  FILTER REGEX(str(?text), "buruh")
} LIMIT 3

```

result:
|0||
|-|-|
|ayat|http://example.org/legal/peraturan/uu/2003/13/pasal/0061A/versi/20201102/ayat/0002|
|text|Uang kompensasi sebagaimana dimaksud pada ayat (1) diberikan kepada pekerja/buruh sesuai dengan masa kerja pekerja/buruh di perusahaan yang bersangkutan.|

|1||
|-|-|
|ayat|http://example.org/legal/peraturan/uu/2003/13/pasal/0061A/versi/20201102/ayat/0002/text|
|text|Uang kompensasi sebagaimana dimaksud pada ayat (1) diberikan kepada pekerja/buruh sesuai dengan masa kerja pekerja/buruh di perusahaan yang bersangkutan.|

|2||
|-|-|
|ayat|http://example.org/legal/peraturan/uu/2003/13/pasal/0061A/versi/20201102/ayat/0001|
|text|Dalam hal perjanjian kerja waktu tertentu berakhir sebagaimana dimaksud dalam Pasal 61 ayat (1) huruf b dan huruf c, pengusaha wajib memberikan uang kompensasi kepada pekerja/ buruh.|

# Query_006

query:

```sparql
# Retrieve components of Omnibus Law that insert (= menyisipkan) articles (= pasal) into Labor Law (UU Ketenagakerjaan) and show the textual content of the articles
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?insertingPoint ?insertedPasalVersion ?text WHERE {
  ?insertingPoint legal:bagianDari+ <http://example.org/legal/peraturan/uu/2020/11>.
  ?insertingPoint legal:menyisipkan ?insertedPasalVersion .
  ?insertedPasalVersion legal:bagianDari+ <http://example.org/legal/peraturan/uu/2003/13> .
  ?insertedPasalVersion legal:teks ?text .
}
LIMIT 3

```

result:
|0||
|-|-|
|insertingPoint|http://example.org/legal/peraturan/uu/2020/11/pasal/0081/versi/20201102/huruf/0068|
|insertedPasalVersion|http://example.org/legal/peraturan/uu/2003/13/pasal/0191A/versi/20201102|
|text|\na. untuk pertama kali upah minimum yang berlaku, yaitu upah minimum yang telah ditetapkan berdasarkan peraturan pelaksanaan Undang-Undang Nomor 13 Tahun 2003 tentang Ketenagakerjaan yang mengatur mengenai pengupahan.\nb. bagi perusahaan yang telah memberikan upah lebih tinggi dari upah minimum yang ditetapkan sebelum Undang-Undang ini, pengusaha dilarang mengurangi atau menurunkan upah.\n|

|1||
|-|-|
|insertingPoint|http://example.org/legal/peraturan/uu/2020/11/pasal/0081/versi/20201102/huruf/0046|
|insertedPasalVersion|http://example.org/legal/peraturan/uu/2003/13/pasal/0157A/versi/20201102|
|text|(1). Selama penyelesaian perselisihan hubungan industrial, pengusaha dan pekerja/ buruh harus tetap melaksanakan kewajibannya.\n(2). Pengusaha dapat melakukan tindakan skorsing kepada pekerja/buruh yang sedang dalam proses pemutusan hubungan kerja dengan tetap membayar upah beserta hak lainnya yang biasa diterima pekerja/ buruh.\n(3). Pelaksanaan kewajiban sebagaimana dimaksud pada ayat (l) dilakukan sampai dengan selesainya proses penyelesaian perselisihan hubungan industrial sesuai tingkatannya. an » 8 RA|

|2||
|-|-|
|insertingPoint|http://example.org/legal/peraturan/uu/2020/11/pasal/0081/versi/20201102/huruf/0042|
|insertedPasalVersion|http://example.org/legal/peraturan/uu/2003/13/pasal/0154A/versi/20201102|
|text|(1). Pemutusan hubungan kerja dapat terjadi karena alasan:\na. perusahaan melakukan penggabungan, peleburan, pengambilalihan, atau pemisahan perusahaan dan pekerja/buruh tidak bersedia melanjutkan hubungan kerja atau pengusaha tidak bersedia menerima pekerja/ buruh,\nb. perusahaan melakukan efisiensi diikuti dengan penutupan perusahaan atau tidak diikuti dengan penutupan perusahaan yang disebabkan perusahaan mengalami kerugian,\nc. perusahaan tutup yang disebabkan karena perusahaan mengalami kerugian secara terus menerus selama 2 (dua) tahun,\nd. perusahaan tutup yang disebabkan keadaan memaksa (force majeur).\ne. perusahaan dalam keadaan penundaan kewajiban pembayaran utang,\nf. perusahaan pailit,\ng. adanya permohonan pemutusan hubungan kerja yang diajukan oleh pekerja/buruh dengan alasan pengusaha melakukan perbuatan sebagai berikut:\n1. menganiaya, menghina secara kasar atau mengancam pekerja/ buruh, .554 -\n2. membujuk dan/atau menyuruh pekerja/buruh untuk melakukan perbuatan yang bertentangan dengan peraturan perundang-undangan,\n3. tidak membayar upah tepat pada waktu yang telah ditentukan selama 3 (tiga) bulan berturut-turut atau lebih, meskipun pengusaha membayar upah secara tepat waktu sesudah itu:\n4. tidak melakukan kewajiban yang telah dijanjikan kepada pekerja/ buruh,\n5. memerintahkan pekerja/ buruh untuk melaksanakan pekerjaan di luar yang diperjanjikan, atau\n6. memberikan pekerjaan yang membahayakan jiwa, keselamatan, kesehatan, dan kesusilaan pekerja/buruh sedangkan pekerjaan tersebut tidak dicantumkan pada perjanjian kerja,\n\nh. adanya putusan lembaga penyelesaian perselisihan hubungan industrial yang menyatakan pengusaha tidak melakukan perbuatan sebagaimana dimaksud pada huruf g terhadap permohonan yang diajukan oleh pekerja/buruh dan pengusaha memutuskan untuk melakukan pemutusan hubungan kerja, 1 pekerja/buruh mengundurkan diri atas kemauan sendiri dan harus memenuhi syarat:\n1. mengajukan permohonan pengunduran diri secara tertulis selambat-lambatnya 30 (tiga puluh) hari sebelum tanggal mulai pengunduran diri,\n2. tidak terikat dalam ikatan dinas, dan\n3. tetap melaksanakan kewajibannya sampai tanggal mulai pengunduran diri, » REPUBLIK INDONESIA j. pekerja/buruh mangkir selama 5 (lima) hari kerja atau lebih berturut-turut tanpa keterangan secara tertulis yang dilengkapi dengan bukti yang sah dan telah dipanggil oleh pengusaha 2 (dua) kali secara patut dan tertulis, k. pekerja/buruh melakukan pelanggaran ketentuan yang diatur dalam perjanjian kerja, peraturan perusahaan, atau perjanjian kerja bersama dan sebelumnya telah diberikan surat peringatan pertama, kedua, dan ketiga secara berturut-turut masing-masing berlaku untuk paling lama 6 (enam) bulan kecuali ditetapkan lain dalam perjanjian kerja, peraturan perusahaan, atau perjanjian kerja bersama,\n1. pekerja/buruh tidak dapat melakukan pekerjaan selama 6 (enam) bulan akibat ditahan pihak yang berwajib karena diduga melakukan tindak pidana, m. pekerja/buruh mengalami sakit berkepanjangan atau cacat akibat kecelakaan kerja dan tidak dapat melakukan pekerjaannya setelah melampaui batas 12 (dua belas) bulan, n. pekerja/buruh memasuki usia pensiun, atau Oo. pekerja/buruh meninggal dunia.\n\n\n\n(2). Selain alasan pemutusan hubungan kerja sebagaimana dimaksud pada ayat (1), dapat ditetapkan alasan pemutusan hubungan kerja lainnya dalam perjanjian kerja, peraturan perusahaan, atau perjanjian kerja bersama sebagaimana dimaksud dalam Pasal 61 ayat (1).\n(3). Ketentuan lebih lanjut mengenai tata cara pemutusan hubungan kerja diatur dalam Peraturan Pemerintah.|

# Query_006_latest

query:

```sparql
# Retrieve components of Omnibus Law that insert (= menyisipkan) articles (= pasal) into Labor Law (UU Ketenagakerjaan) and show the textual content of the articles
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?insertingPoint ?insertedPasalVersion ?text WHERE {
  {
    SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
      ?pasal legal:bagianDari+ <http://example.org/legal/peraturan/uu/2020/11>.
      ?pasal legal:versi ?pasalVersion .
    } GROUP BY ?pasal
  }
  ?insertingPoint legal:bagianDari+ ?latestPasalVersion .
  ?insertingPoint legal:menyisipkan ?insertedPasalVersion .
  ?insertedPasalVersion legal:bagianDari+ <http://example.org/legal/peraturan/uu/2003/13> .
  ?insertedPasalVersion legal:teks ?text .
}
LIMIT 3

```

result:
|0||
|-|-|
|insertingPoint|http://example.org/legal/peraturan/uu/2020/11/pasal/0081/versi/20201102/huruf/0068|
|insertedPasalVersion|http://example.org/legal/peraturan/uu/2003/13/pasal/0191A/versi/20201102|
|text|\na. untuk pertama kali upah minimum yang berlaku, yaitu upah minimum yang telah ditetapkan berdasarkan peraturan pelaksanaan Undang-Undang Nomor 13 Tahun 2003 tentang Ketenagakerjaan yang mengatur mengenai pengupahan.\nb. bagi perusahaan yang telah memberikan upah lebih tinggi dari upah minimum yang ditetapkan sebelum Undang-Undang ini, pengusaha dilarang mengurangi atau menurunkan upah.\n|

|1||
|-|-|
|insertingPoint|http://example.org/legal/peraturan/uu/2020/11/pasal/0081/versi/20201102/huruf/0046|
|insertedPasalVersion|http://example.org/legal/peraturan/uu/2003/13/pasal/0157A/versi/20201102|
|text|(1). Selama penyelesaian perselisihan hubungan industrial, pengusaha dan pekerja/ buruh harus tetap melaksanakan kewajibannya.\n(2). Pengusaha dapat melakukan tindakan skorsing kepada pekerja/buruh yang sedang dalam proses pemutusan hubungan kerja dengan tetap membayar upah beserta hak lainnya yang biasa diterima pekerja/ buruh.\n(3). Pelaksanaan kewajiban sebagaimana dimaksud pada ayat (l) dilakukan sampai dengan selesainya proses penyelesaian perselisihan hubungan industrial sesuai tingkatannya. an » 8 RA|

|2||
|-|-|
|insertingPoint|http://example.org/legal/peraturan/uu/2020/11/pasal/0081/versi/20201102/huruf/0042|
|insertedPasalVersion|http://example.org/legal/peraturan/uu/2003/13/pasal/0154A/versi/20201102|
|text|(1). Pemutusan hubungan kerja dapat terjadi karena alasan:\na. perusahaan melakukan penggabungan, peleburan, pengambilalihan, atau pemisahan perusahaan dan pekerja/buruh tidak bersedia melanjutkan hubungan kerja atau pengusaha tidak bersedia menerima pekerja/ buruh,\nb. perusahaan melakukan efisiensi diikuti dengan penutupan perusahaan atau tidak diikuti dengan penutupan perusahaan yang disebabkan perusahaan mengalami kerugian,\nc. perusahaan tutup yang disebabkan karena perusahaan mengalami kerugian secara terus menerus selama 2 (dua) tahun,\nd. perusahaan tutup yang disebabkan keadaan memaksa (force majeur).\ne. perusahaan dalam keadaan penundaan kewajiban pembayaran utang,\nf. perusahaan pailit,\ng. adanya permohonan pemutusan hubungan kerja yang diajukan oleh pekerja/buruh dengan alasan pengusaha melakukan perbuatan sebagai berikut:\n1. menganiaya, menghina secara kasar atau mengancam pekerja/ buruh, .554 -\n2. membujuk dan/atau menyuruh pekerja/buruh untuk melakukan perbuatan yang bertentangan dengan peraturan perundang-undangan,\n3. tidak membayar upah tepat pada waktu yang telah ditentukan selama 3 (tiga) bulan berturut-turut atau lebih, meskipun pengusaha membayar upah secara tepat waktu sesudah itu:\n4. tidak melakukan kewajiban yang telah dijanjikan kepada pekerja/ buruh,\n5. memerintahkan pekerja/ buruh untuk melaksanakan pekerjaan di luar yang diperjanjikan, atau\n6. memberikan pekerjaan yang membahayakan jiwa, keselamatan, kesehatan, dan kesusilaan pekerja/buruh sedangkan pekerjaan tersebut tidak dicantumkan pada perjanjian kerja,\n\nh. adanya putusan lembaga penyelesaian perselisihan hubungan industrial yang menyatakan pengusaha tidak melakukan perbuatan sebagaimana dimaksud pada huruf g terhadap permohonan yang diajukan oleh pekerja/buruh dan pengusaha memutuskan untuk melakukan pemutusan hubungan kerja, 1 pekerja/buruh mengundurkan diri atas kemauan sendiri dan harus memenuhi syarat:\n1. mengajukan permohonan pengunduran diri secara tertulis selambat-lambatnya 30 (tiga puluh) hari sebelum tanggal mulai pengunduran diri,\n2. tidak terikat dalam ikatan dinas, dan\n3. tetap melaksanakan kewajibannya sampai tanggal mulai pengunduran diri, » REPUBLIK INDONESIA j. pekerja/buruh mangkir selama 5 (lima) hari kerja atau lebih berturut-turut tanpa keterangan secara tertulis yang dilengkapi dengan bukti yang sah dan telah dipanggil oleh pengusaha 2 (dua) kali secara patut dan tertulis, k. pekerja/buruh melakukan pelanggaran ketentuan yang diatur dalam perjanjian kerja, peraturan perusahaan, atau perjanjian kerja bersama dan sebelumnya telah diberikan surat peringatan pertama, kedua, dan ketiga secara berturut-turut masing-masing berlaku untuk paling lama 6 (enam) bulan kecuali ditetapkan lain dalam perjanjian kerja, peraturan perusahaan, atau perjanjian kerja bersama,\n1. pekerja/buruh tidak dapat melakukan pekerjaan selama 6 (enam) bulan akibat ditahan pihak yang berwajib karena diduga melakukan tindak pidana, m. pekerja/buruh mengalami sakit berkepanjangan atau cacat akibat kecelakaan kerja dan tidak dapat melakukan pekerjaannya setelah melampaui batas 12 (dua belas) bulan, n. pekerja/buruh memasuki usia pensiun, atau Oo. pekerja/buruh meninggal dunia.\n\n\n\n(2). Selain alasan pemutusan hubungan kerja sebagaimana dimaksud pada ayat (1), dapat ditetapkan alasan pemutusan hubungan kerja lainnya dalam perjanjian kerja, peraturan perusahaan, atau perjanjian kerja bersama sebagaimana dimaksud dalam Pasal 61 ayat (1).\n(3). Ketentuan lebih lanjut mengenai tata cara pemutusan hubungan kerja diatur dalam Peraturan Pemerintah.|

# Query_007

query:

```sparql
# Get components of Omnibus Law that amend (= mengubah) articles in Labor Law and compare the textual content of the old vs. new articles
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?updatingPointt ?updatedPasal ?text ?version
WHERE {
  {
    SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
      ?pasal legal:bagianDari+ <http://example.org/legal/peraturan/uu/2020/11>.
      ?pasal legal:versi ?pasalVersion .
    } GROUP BY ?pasal
  }
  ?updatingPointt legal:bagianDari+ <http://example.org/legal/peraturan/uu/2020/11>.
  ?updatingPointt legal:mengubah ?updatedPasalVersion .
  ?updatedPasal legal:versi ?updatedPasalVersion .
  <http://example.org/legal/peraturan/uu/2003/13> legal:pasal ?updatedPasal .
  ?updatedPasal legal:versi ?allPasalVersion .
  ?allPasalVersion legal:teks ?text .
  ?allPasalVersion legal:tanggal ?version .
}
LIMIT 3

```

result:
|0||
|-|-|
|updatingPointt|http://example.org/legal/peraturan/uu/2020/11/pasal/0081/versi/20201102/huruf/0067|
|updatedPasal|http://example.org/legal/peraturan/uu/2003/13/pasal/0190|
|text|(1). Pemerintah Pusat atau Pemerintah Daerah sesuai kewenangannya mengenakan sanksi administratif atas pelanggaran ketentuan-ketentuan sebagaimana diatur dalam Pasal 5, Pasal 6, Pasal 14 ayat (1), Pasal 15, Pasal 25, Pasal 37 ayat (2), Pasal 38 ayat (2), Pasal 42 ayat (1), Pasal 47 ayat (1), Pasal 61A, Pasal 66 ayat (4), Pasal 87, Pasal 92, Pasal 106, Pasal 126 ayat (3), atau Pasal 160 ayat (1) atau ayat (2) undang-undang ini serta peraturan pelaksanaannya.\n(2). Ketentuan lebih lanjut mengenai sanksi administratif sebagaimana dimaksud pada ayat (1) diatur dalam Peraturan Pemerintah.|
|version|2020-11-02|

|1||
|-|-|
|updatingPointt|http://example.org/legal/peraturan/uu/2020/11/pasal/0081/versi/20201102/huruf/0067|
|updatedPasal|http://example.org/legal/peraturan/uu/2003/13/pasal/0190|
|text|(1). Menteri atau pejabat yang ditunjuk mengenakan sanksi administratif atas pelanggaran ketentuan-ketentuan sebagaimana diatur dalam Pasal 5, Pasal 6, Pasal 15, Pasal 25, Pasal 38 ayat (2), Pasal 45 ayat (1), Pasal 47 ayat (1), Pasal 48, Pasal 87, Pasal 106, Pasal 126 ayat (3), dan Pasal 160 ayat (1) dan ayat (2) Undang-undang ini serta peraturan pelaksanaannya.\n(2). Sanksi administratif sebagaimana dimaksud dalam ayat (1) berupa :\na. teguran,\nb. peringatan tertulis,\nc. pembatasan kegiatan usaha,\nd. pembekuan kegiatan usaha,\ne. pembatalan persetujuan:\nf. pembatalan pendaftaran,\ng. penghentian sementara sebagian atau seluruh alat produksi,\nh. pencabutan ijin.\n\n(3). Ketentuan mengenai sanksi administratif sebagaimana dimaksud dalam ayat (1) dan ayat (2) diatur lebih lanjut oleh Menteri.|
|version|2003-03-25|

|2||
|-|-|
|updatingPointt|http://example.org/legal/peraturan/uu/2020/11/pasal/0081/versi/20201102/huruf/0066|
|updatedPasal|http://example.org/legal/peraturan/uu/2003/13/pasal/0188|
|text|(1). Barang siapa melanggar ketentuan sebagaimana dimaksud dalam Pasal 38 ayat (2), Pasal 63 ayat (1), Pasal 78 ayat (1), Pasal 108 ayat (1), Pasal 111 ayat (3), Pasal 114, atau Pasal 148 dikenai sanksi pidana denda paling sedikit Rp5.000.000,00 (lima juta rupiah) dan paling banyak Rp50.000.000,00 (lima puluh juta rupiah).\n(2). Tindak pidana sebagaimana dimaksud pada ayat (1) merupakan tindak pidana pelanggaran.|
|version|2020-11-02|

# Query_007_latest

query:

```sparql
# Get components of Omnibus Law that amend (= mengubah) articles in Labor Law and compare the textual content of the old vs. new articles
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?insertingPoint ?insertedPasal ?version ?text WHERE {
  {
    SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
      ?pasal legal:bagianDari+ <http://example.org/legal/peraturan/uu/2020/11>.
      ?pasal legal:versi ?pasalVersion .
    } GROUP BY ?pasal
  }
  ?insertingPoint legal:bagianDari+ ?latestPasalVersion .
  ?insertingPoint legal:menyisipkan ?insertedPasalVersion .
  ?insertedPasalVersion legal:bagianDari+ <http://example.org/legal/peraturan/uu/2003/13> .
  ?insertedPasal legal:versi ?insertedPasalVersion .
  ?insertedPasal legal:versi ?allPasalVersion .
  ?allPasalVersion legal:teks ?text .
  ?allPasalVersion legal:tanggal ?version .
}
LIMIT 3

```

result:
|0||
|-|-|
|insertingPoint|http://example.org/legal/peraturan/uu/2020/11/pasal/0081/versi/20201102/huruf/0068|
|insertedPasal|http://example.org/legal/peraturan/uu/2003/13/pasal/0191A|
|version|2020-11-02|
|text|\na. untuk pertama kali upah minimum yang berlaku, yaitu upah minimum yang telah ditetapkan berdasarkan peraturan pelaksanaan Undang-Undang Nomor 13 Tahun 2003 tentang Ketenagakerjaan yang mengatur mengenai pengupahan.\nb. bagi perusahaan yang telah memberikan upah lebih tinggi dari upah minimum yang ditetapkan sebelum Undang-Undang ini, pengusaha dilarang mengurangi atau menurunkan upah.\n|

|1||
|-|-|
|insertingPoint|http://example.org/legal/peraturan/uu/2020/11/pasal/0081/versi/20201102/huruf/0046|
|insertedPasal|http://example.org/legal/peraturan/uu/2003/13/pasal/0157A|
|version|2020-11-02|
|text|(1). Selama penyelesaian perselisihan hubungan industrial, pengusaha dan pekerja/ buruh harus tetap melaksanakan kewajibannya.\n(2). Pengusaha dapat melakukan tindakan skorsing kepada pekerja/buruh yang sedang dalam proses pemutusan hubungan kerja dengan tetap membayar upah beserta hak lainnya yang biasa diterima pekerja/ buruh.\n(3). Pelaksanaan kewajiban sebagaimana dimaksud pada ayat (l) dilakukan sampai dengan selesainya proses penyelesaian perselisihan hubungan industrial sesuai tingkatannya. an » 8 RA|

|2||
|-|-|
|insertingPoint|http://example.org/legal/peraturan/uu/2020/11/pasal/0081/versi/20201102/huruf/0042|
|insertedPasal|http://example.org/legal/peraturan/uu/2003/13/pasal/0154A|
|version|2020-11-02|
|text|(1). Pemutusan hubungan kerja dapat terjadi karena alasan:\na. perusahaan melakukan penggabungan, peleburan, pengambilalihan, atau pemisahan perusahaan dan pekerja/buruh tidak bersedia melanjutkan hubungan kerja atau pengusaha tidak bersedia menerima pekerja/ buruh,\nb. perusahaan melakukan efisiensi diikuti dengan penutupan perusahaan atau tidak diikuti dengan penutupan perusahaan yang disebabkan perusahaan mengalami kerugian,\nc. perusahaan tutup yang disebabkan karena perusahaan mengalami kerugian secara terus menerus selama 2 (dua) tahun,\nd. perusahaan tutup yang disebabkan keadaan memaksa (force majeur).\ne. perusahaan dalam keadaan penundaan kewajiban pembayaran utang,\nf. perusahaan pailit,\ng. adanya permohonan pemutusan hubungan kerja yang diajukan oleh pekerja/buruh dengan alasan pengusaha melakukan perbuatan sebagai berikut:\n1. menganiaya, menghina secara kasar atau mengancam pekerja/ buruh, .554 -\n2. membujuk dan/atau menyuruh pekerja/buruh untuk melakukan perbuatan yang bertentangan dengan peraturan perundang-undangan,\n3. tidak membayar upah tepat pada waktu yang telah ditentukan selama 3 (tiga) bulan berturut-turut atau lebih, meskipun pengusaha membayar upah secara tepat waktu sesudah itu:\n4. tidak melakukan kewajiban yang telah dijanjikan kepada pekerja/ buruh,\n5. memerintahkan pekerja/ buruh untuk melaksanakan pekerjaan di luar yang diperjanjikan, atau\n6. memberikan pekerjaan yang membahayakan jiwa, keselamatan, kesehatan, dan kesusilaan pekerja/buruh sedangkan pekerjaan tersebut tidak dicantumkan pada perjanjian kerja,\n\nh. adanya putusan lembaga penyelesaian perselisihan hubungan industrial yang menyatakan pengusaha tidak melakukan perbuatan sebagaimana dimaksud pada huruf g terhadap permohonan yang diajukan oleh pekerja/buruh dan pengusaha memutuskan untuk melakukan pemutusan hubungan kerja, 1 pekerja/buruh mengundurkan diri atas kemauan sendiri dan harus memenuhi syarat:\n1. mengajukan permohonan pengunduran diri secara tertulis selambat-lambatnya 30 (tiga puluh) hari sebelum tanggal mulai pengunduran diri,\n2. tidak terikat dalam ikatan dinas, dan\n3. tetap melaksanakan kewajibannya sampai tanggal mulai pengunduran diri, » REPUBLIK INDONESIA j. pekerja/buruh mangkir selama 5 (lima) hari kerja atau lebih berturut-turut tanpa keterangan secara tertulis yang dilengkapi dengan bukti yang sah dan telah dipanggil oleh pengusaha 2 (dua) kali secara patut dan tertulis, k. pekerja/buruh melakukan pelanggaran ketentuan yang diatur dalam perjanjian kerja, peraturan perusahaan, atau perjanjian kerja bersama dan sebelumnya telah diberikan surat peringatan pertama, kedua, dan ketiga secara berturut-turut masing-masing berlaku untuk paling lama 6 (enam) bulan kecuali ditetapkan lain dalam perjanjian kerja, peraturan perusahaan, atau perjanjian kerja bersama,\n1. pekerja/buruh tidak dapat melakukan pekerjaan selama 6 (enam) bulan akibat ditahan pihak yang berwajib karena diduga melakukan tindak pidana, m. pekerja/buruh mengalami sakit berkepanjangan atau cacat akibat kecelakaan kerja dan tidak dapat melakukan pekerjaannya setelah melampaui batas 12 (dua belas) bulan, n. pekerja/buruh memasuki usia pensiun, atau Oo. pekerja/buruh meninggal dunia.\n\n\n\n(2). Selain alasan pemutusan hubungan kerja sebagaimana dimaksud pada ayat (1), dapat ditetapkan alasan pemutusan hubungan kerja lainnya dalam perjanjian kerja, peraturan perusahaan, atau perjanjian kerja bersama sebagaimana dimaksud dalam Pasal 61 ayat (1).\n(3). Ketentuan lebih lanjut mengenai tata cara pemutusan hubungan kerja diatur dalam Peraturan Pemerintah.|

# Query_008

query:

```sparql
# Give me components of Omnibus Law that remove (= menghapus) articles in Labor Law and show the textual content of the removed articles
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?deletingPoint ?deletedPasal ?version ?text WHERE {
  ?deletingPoint legal:bagianDari+ <http://example.org/legal/peraturan/uu/2020/11>.
  ?deletingPoint legal:menghapus ?deletedPasalVersion .
  ?deletedPasal legal:versi ?deletedPasalVersion .
  <http://example.org/legal/peraturan/uu/2003/13> legal:pasal ?deletedPasal .
  ?deletedPasal legal:versi ?allPasalVersion .
  ?allPasalVersion legal:teks ?text .
  ?allPasalVersion legal:tanggal ?version .
}
LIMIT 3

```

result:
|0||
|-|-|
|deletingPoint|http://example.org/legal/peraturan/uu/2020/11/pasal/0081/versi/20201102/huruf/0062|
|deletedPasal|http://example.org/legal/peraturan/uu/2003/13/pasal/0184|
|version|2020-11-02|
|text||

|1||
|-|-|
|deletingPoint|http://example.org/legal/peraturan/uu/2020/11/pasal/0081/versi/20201102/huruf/0062|
|deletedPasal|http://example.org/legal/peraturan/uu/2003/13/pasal/0184|
|version|2003-03-25|
|text|(1). Barang siapa melanggar ketentuan sebagaimana dimaksud dalam Pasal 167 ayat (5), dikenakan sanksi pidana penjara paling singkat 1 (satu) tahun dan paling lama 5 (lima) tahun dan/atau denda paling sedikit Rp 100.000.000,00 (seratus juta rupiah) dan paling banyak Rp 500.000.000,00 (lima ratus juta rupiah).\n(2). Tindak pidana sebagaimana dimaksud dalam ayat (1) merupakan tindak pidana kejahatan.|

|2||
|-|-|
|deletingPoint|http://example.org/legal/peraturan/uu/2020/11/pasal/0081/versi/20201102/huruf/0061|
|deletedPasal|http://example.org/legal/peraturan/uu/2003/13/pasal/0172|
|version|2020-11-02|
|text||

# Query_008_latest

query:

```sparql
# Give me components of Omnibus Law that remove (= menghapus) articles in Labor Law and show the textual content of the removed articles
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?deletingPoint ?deletedPasal ?version ?text WHERE {
  {
    SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
      ?pasal legal:bagianDari+ <http://example.org/legal/peraturan/uu/2020/11>.
      ?pasal legal:versi ?pasalVersion .
    } GROUP BY ?pasal
  }
  ?deletingPoint legal:bagianDari+ ?latestPasalVersion .
  ?deletingPoint legal:menghapus ?deletedPasalVersion .
  ?deletedPasal legal:versi ?deletedPasalVersion .
  <http://example.org/legal/peraturan/uu/2003/13> legal:pasal ?deletedPasal .
  ?deletedPasal legal:versi ?allPasalVersion .
  ?allPasalVersion legal:teks ?text .
  ?allPasalVersion legal:tanggal ?version .
}
LIMIT 3

```

result:
|0||
|-|-|
|deletingPoint|http://example.org/legal/peraturan/uu/2020/11/pasal/0081/versi/20201102/huruf/0062|
|deletedPasal|http://example.org/legal/peraturan/uu/2003/13/pasal/0184|
|version|2020-11-02|
|text||

|1||
|-|-|
|deletingPoint|http://example.org/legal/peraturan/uu/2020/11/pasal/0081/versi/20201102/huruf/0062|
|deletedPasal|http://example.org/legal/peraturan/uu/2003/13/pasal/0184|
|version|2003-03-25|
|text|(1). Barang siapa melanggar ketentuan sebagaimana dimaksud dalam Pasal 167 ayat (5), dikenakan sanksi pidana penjara paling singkat 1 (satu) tahun dan paling lama 5 (lima) tahun dan/atau denda paling sedikit Rp 100.000.000,00 (seratus juta rupiah) dan paling banyak Rp 500.000.000,00 (lima ratus juta rupiah).\n(2). Tindak pidana sebagaimana dimaksud dalam ayat (1) merupakan tindak pidana kejahatan.|

|2||
|-|-|
|deletingPoint|http://example.org/legal/peraturan/uu/2020/11/pasal/0081/versi/20201102/huruf/0061|
|deletedPasal|http://example.org/legal/peraturan/uu/2003/13/pasal/0172|
|version|2020-11-02|
|text||

# Query_010

query:

```sparql
# How many are insertions, amendments, and removals of other laws in Omnibus Law?
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?type (COUNT(*) AS ?jumlah) WHERE {
  {
    ?point legal:bagianDari+ <http://example.org/legal/peraturan/uu/2020/11> .
    ?point legal:menghapus ?pasal .
    BIND("menghapus" AS ?type)
  } UNION {
    ?point legal:bagianDari+ <http://example.org/legal/peraturan/uu/2020/11> .
    ?point legal:menyisipkan ?pasal .
    BIND("menyisipkan" AS ?type)
  } UNION {
    ?point legal:bagianDari+ <http://example.org/legal/peraturan/uu/2020/11> .
    ?point legal:mengubah ?pasal .
    BIND("mengubah" AS ?type)
  }
} GROUP BY ?type
LIMIT 3

```

result:
|0||
|-|-|
|type|menyisipkan|
|jumlah|107|

|1||
|-|-|
|type|menghapus|
|jumlah|184|

|2||
|-|-|
|type|mengubah|
|jumlah|930|

# Query_010_latest

query:

```sparql
# How many are insertions, amendments, and removals of other laws in Omnibus Law?
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?type (COUNT(*) AS ?jumlah) WHERE {
  {
    {
      SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
        ?pasal legal:bagianDari+ <http://example.org/legal/peraturan/uu/2020/11>.
        ?pasal legal:versi ?pasalVersion .
      } GROUP BY ?pasal
    }
    ?deletingPoint legal:bagianDari+ ?latestPasalVersion .
    ?deletingPoint legal:menghapus ?deletedPasalVersion .
    BIND("menghapus" AS ?type)
  }
  UNION {
    {
      SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
        ?pasal legal:bagianDari+ <http://example.org/legal/peraturan/uu/2020/11>.
        ?pasal legal:versi ?pasalVersion .
      } GROUP BY ?pasal
    }
    ?deletingPoint legal:bagianDari+ ?latestPasalVersion .
    ?deletingPoint legal:menyisipkan ?deletedPasalVersion .
    BIND("menyisipkan" AS ?type)
  } UNION {
    {
      SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
        ?pasal legal:bagianDari+ <http://example.org/legal/peraturan/uu/2020/11>.
        ?pasal legal:versi ?pasalVersion .
      } GROUP BY ?pasal
    }
    ?deletingPoint legal:bagianDari+ ?latestPasalVersion .
    ?deletingPoint legal:mengubah ?deletedPasalVersion .
    BIND("mengubah" AS ?type)
  }
} GROUP BY ?type
LIMIT 3

```

result:
|0||
|-|-|
|type|menyisipkan|
|jumlah|107|

|1||
|-|-|
|type|menghapus|
|jumlah|184|

|2||
|-|-|
|type|mengubah|
|jumlah|930|

# Query_011

query:

```sparql
# Get articles of Labor Law (UU Ketenagakerjaan) taking into account updates (= insertions/amendments/removals) from Omnibus Law (UU Cipta Kerja)
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?latestPasalVersion WHERE {
  {
    SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
      ?pasal legal:bagianDari+ <http://example.org/legal/peraturan/uu/2003/13>.
      ?pasal legal:versi ?pasalVersion .
    } GROUP BY ?pasal
  }
}
LIMIT 3
```

result:
|0||
|-|-|
|latestPasalVersion|http://example.org/legal/peraturan/uu/2003/13/pasal/0096/versi/20201102|

|1||
|-|-|
|latestPasalVersion|http://example.org/legal/peraturan/uu/2003/13/pasal/0004/versi/20030325|

|2||
|-|-|
|latestPasalVersion|http://example.org/legal/peraturan/uu/2003/13/pasal/0125/versi/20030325|

# Query_012

query:

```sparql
# Get articles of Omnibus Law that are not about updating (= insertions/amendments/removals) other laws
PREFIX legal: <http://example.org/legal/ontology/>

SELECT DISTINCT ?pasalVersion ?text WHERE {
  ?pasalVersion legal:bagianDari+ <http://example.org/legal/peraturan/uu/2020/11>.
  ?pasalVersion legal:teks ?text .
  FILTER NOT EXISTS {
    ?point legal:bagianDari+ ?pasalVersion . 
    ?point a legal:Point .
    { ?point legal:mengubah ?amendedPasalVersion }
    UNION { ?point legal:menyisipkan ?amendedPasalVersion } 
    UNION { ?point legal:menghapus ?amendedPasalVersion }
  }
}
LIMIT 3
```

result:
|0||
|-|-|
|pasalVersion|http://example.org/legal/peraturan/uu/2020/11/pasal/0186/versi/20201102|
|text|Undang-Undang ini mulai berlaku pada tanggal diundangkan. Agar setiap orang mengetahuinya, memerintahkan pengundangan Undang-Undang ini dengan penempatannya dalam Lembaran Negara Republik Indonesia.|

|1||
|-|-|
|pasalVersion|http://example.org/legal/peraturan/uu/2020/11/pasal/0186/versi/20201102/text|
|text|Undang-Undang ini mulai berlaku pada tanggal diundangkan. Agar setiap orang mengetahuinya, memerintahkan pengundangan Undang-Undang ini dengan penempatannya dalam Lembaran Negara Republik Indonesia.|

|2||
|-|-|
|pasalVersion|http://example.org/legal/peraturan/uu/2020/11/pasal/0185/versi/20201102|
|text|Pada saat Undang-Undang ini mulai berlaku:\na. Peraturan pelaksanaan dari Undang-Undang ini wajib ditetapkan paling lama 3 (tiga) bulan, dan\nb. Semua peraturan pelaksanaan dari Undang-Undang yang telah diubah oleh Undang-Undang ini dinyatakan tetap berlaku sepanjang tidak bertentangan dengan Undang- Undang ini dan wajib disesuaikan paling lama 3 (tiga) bulan.\n|

# Query_012_latest

query:

```sparql
# Get articles of Omnibus Law that are not about updating (= insertions/amendments/removals) other laws
PREFIX legal: <http://example.org/legal/ontology/>

SELECT DISTINCT ?pasalVersion ?text WHERE {
  ?pasalVersion legal:bagianDari+ <http://example.org/legal/peraturan/uu/2020/11>.
  ?pasalVersion legal:teks ?text .
  FILTER NOT EXISTS {
    ?point legal:bagianDari+ ?pasalVersion . 
    ?point a legal:Point .
    { ?point legal:mengubah ?amendedPasalVersion }
    UNION { ?point legal:menyisipkan ?amendedPasalVersion } 
    UNION { ?point legal:menghapus ?amendedPasalVersion }
  }
}
LIMIT 3

```

result:
|0||
|-|-|
|pasalVersion|http://example.org/legal/peraturan/uu/2020/11/pasal/0186/versi/20201102|
|text|Undang-Undang ini mulai berlaku pada tanggal diundangkan. Agar setiap orang mengetahuinya, memerintahkan pengundangan Undang-Undang ini dengan penempatannya dalam Lembaran Negara Republik Indonesia.|

|1||
|-|-|
|pasalVersion|http://example.org/legal/peraturan/uu/2020/11/pasal/0186/versi/20201102/text|
|text|Undang-Undang ini mulai berlaku pada tanggal diundangkan. Agar setiap orang mengetahuinya, memerintahkan pengundangan Undang-Undang ini dengan penempatannya dalam Lembaran Negara Republik Indonesia.|

|2||
|-|-|
|pasalVersion|http://example.org/legal/peraturan/uu/2020/11/pasal/0185/versi/20201102|
|text|Pada saat Undang-Undang ini mulai berlaku:\na. Peraturan pelaksanaan dari Undang-Undang ini wajib ditetapkan paling lama 3 (tiga) bulan, dan\nb. Semua peraturan pelaksanaan dari Undang-Undang yang telah diubah oleh Undang-Undang ini dinyatakan tetap berlaku sepanjang tidak bertentangan dengan Undang- Undang ini dan wajib disesuaikan paling lama 3 (tiga) bulan.\n|

# Query_013

query:

```sparql
# Give me articles (= pasal) of Omnibus Law removing articles of laws legalized later than the year 2001
PREFIX legal: <http://example.org/legal/ontology/>

SELECT DISTINCT ?pasalVersion WHERE {
  ?point legal:bagianDari+ <http://example.org/legal/peraturan/uu/2020/11>.
  ?point legal:menghapus ?pasalVersion .
  ?pasalVersion legal:bagianDari+ ?document .
  ?document legal:disahkanPada ?legalizedDate
  FILTER(year(?legalizedDate) > 2001)
}
LIMIT 3
```

result:
|0||
|-|-|
|pasalVersion|http://example.org/legal/peraturan/uu/2009/39/pasal/0045/versi/20201102|

|1||
|-|-|
|pasalVersion|http://example.org/legal/peraturan/uu/2009/39/pasal/0044/versi/20201102|

|2||
|-|-|
|pasalVersion|http://example.org/legal/peraturan/uu/2009/39/pasal/0031/versi/20201102|

# Query_014

query:

```sparql
# Retrieve all subsections inserted by Omnibus Law into other laws and *optionally* the citations occurring in those subsections
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?ayat ?text ?citation WHERE {
  ?insertingPoint legal:bagianDari+ <http://example.org/legal/peraturan/uu/2020/11>.
  ?insertingPoint legal:menyisipkan ?insertedPasalVersion .
  ?ayat legal:bagianDari+ ?insertedPasalVersion .
  ?ayat legal:teks ?text .
  ?ayat legal:teks ?textRef .
  OPTIONAL {?textRef legal:merujuk ?citation}
}
LIMIT 3
```

result:
|0||
|-|-|
|ayat|http://example.org/legal/peraturan/uu/2015/9/pasal/0402A/versi/20201102/text|
|text|Pembagian urusan pemerintahan konkuren antara Pemerintah Pusat dan Daerah Provinsi serta Daerah Kabupaten/Kota sebagaimana tercantum dalam Lampiran Undang Nomor 23 Tahun 2014 tentang Pemerintahan Daerah sebagaimana telah diubah terakhir dengan Undang-Undang Nomor 9 Tahun 2015 tentang Perubahan Kedua atas Undang-Undang Nomor 23 Tahun 2014 tentang Pemerintahan Daerah harus dibaca dan dimaknai sesuai dengan ketentuan yang diatur dalam Undang-Undang tentang Cipta Kerja.|

|1||
|-|-|
|ayat|http://example.org/legal/peraturan/uu/2015/9/pasal/0292A/versi/20201102/ayat/0002|
|text|Pemberian anggaran sebagaimana dimaksud pada ayat (1) diatur dalam Peraturan Pemerintah.|

|2||
|-|-|
|ayat|http://example.org/legal/peraturan/uu/2015/9/pasal/0292A/versi/20201102/ayat/0002/text|
|text|Pemberian anggaran sebagaimana dimaksud pada ayat (1) diatur dalam Peraturan Pemerintah.|

# Query_017

query:

```sparql
# Which law has the most number of updates (= insertions/amendments/removals) by Omnibus Law? For that law, show the most recent version taking into account the updates by Omnibus Law!
PREFIX legal: <http://example.org/legal/ontology/>
PREFIX owl: <http://www.w3.org/2002/07/owl#>

SELECT ?law ?numOfUpdates ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
  {
    SELECT ?law (COUNT(*) AS ?numOfUpdates) WHERE {
      ?point legal:bagianDari+ <http://example.org/legal/peraturan/uu/2020/11> .
      { ?point legal:mengubah ?amendedPasalVersion }
      UNION { ?point legal:menyisipkan ?amendedPasalVersion }
      UNION { ?point legal:menghapus ?amendedPasalVersion }
      ?amendedPasalVersion legal:bagianDari+ ?law .
      ?law a legal:Peraturan .
    } GROUP BY ?law
  }
  ?pasal legal:bagianDari+ ?law .
  ?pasal legal:versi ?pasalVersion .
}
GROUP BY ?law ?numOfUpdates ?pasal
ORDER BY DESC (?numOfUpdates)
LIMIT 3

```

result:
|0||
|-|-|
|law|http://example.org/legal/peraturan/uu/2009/1|
|numOfUpdates|90|
|pasal|http://example.org/legal/peraturan/uu/2009/1/pasal/0013|
|latestPasalVersion|http://example.org/legal/peraturan/uu/2009/1/pasal/0013/versi/20201102|

|1||
|-|-|
|law|http://example.org/legal/peraturan/uu/2009/1|
|numOfUpdates|90|
|pasal|http://example.org/legal/peraturan/uu/2009/1/pasal/0014|
|latestPasalVersion|http://example.org/legal/peraturan/uu/2009/1/pasal/0014/versi/20201102|

|2||
|-|-|
|law|http://example.org/legal/peraturan/uu/2009/1|
|numOfUpdates|90|
|pasal|http://example.org/legal/peraturan/uu/2009/1/pasal/0015|
|latestPasalVersion|http://example.org/legal/peraturan/uu/2009/1/pasal/0015/versi/20201102|

# Query_017_latest

query:

```sparql
# Which law has the most number of updates (= insertions/amendments/removals) by Omnibus Law? For that law, show the most recent version taking into account the updates by Omnibus Law!
PREFIX legal: <http://example.org/legal/ontology/>
PREFIX owl: <http://www.w3.org/2002/07/owl#>

SELECT ?law ?numOfUpdates ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
  {
    SELECT ?law (COUNT(*) AS ?numOfUpdates) WHERE {
      {
        SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
          ?pasal legal:bagianDari+ <http://example.org/legal/peraturan/uu/2020/11>.
          ?pasal legal:versi ?pasalVersion .
        } GROUP BY ?pasal
      }
      ?point legal:bagianDari+ ?latestPasalVersion .
      { ?point legal:mengubah ?amendedPasalVersion }
      UNION { ?point legal:menyisipkan ?amendedPasalVersion }
      UNION { ?point legal:menghapus ?amendedPasalVersion }
      ?amendedPasalVersion legal:bagianDari+ ?law .
      ?law a legal:Peraturan .
    } GROUP BY ?law
  }
  ?pasal legal:bagianDari+ ?law .
  ?pasal legal:versi ?pasalVersion .
}
GROUP BY ?law ?numOfUpdates ?pasal
ORDER BY DESC (?numOfUpdates)
LIMIT 3

```

result:
|0||
|-|-|
|law|http://example.org/legal/peraturan/uu/2009/1|
|numOfUpdates|90|
|pasal|http://example.org/legal/peraturan/uu/2009/1/pasal/0013|
|latestPasalVersion|http://example.org/legal/peraturan/uu/2009/1/pasal/0013/versi/20201102|

|1||
|-|-|
|law|http://example.org/legal/peraturan/uu/2009/1|
|numOfUpdates|90|
|pasal|http://example.org/legal/peraturan/uu/2009/1/pasal/0014|
|latestPasalVersion|http://example.org/legal/peraturan/uu/2009/1/pasal/0014/versi/20201102|

|2||
|-|-|
|law|http://example.org/legal/peraturan/uu/2009/1|
|numOfUpdates|90|
|pasal|http://example.org/legal/peraturan/uu/2009/1/pasal/0015|
|latestPasalVersion|http://example.org/legal/peraturan/uu/2009/1/pasal/0015/versi/20201102|

# Query_018

query:

```sparql
# tampilkan semua triple
PREFIX legal: <http://example.org/legal/ontology/>

SELECT * 
WHERE {
  ?s ?p ?o .
} 
ORDER BY ?s ?p ?o
LIMIT 3
```

result:
|0||
|-|-|
|s|http://example.org/legal/peraturan/uu/1950/1|
|p|http://example.org/legal/ontology/daftarPasal|
|o|http://example.org/legal/peraturan/uu/1950/1/daftarPasal|

|1||
|-|-|
|s|http://example.org/legal/peraturan/uu/1950/1|
|p|http://example.org/legal/ontology/disahkanDi|
|o|Jakarta|

|2||
|-|-|
|s|http://example.org/legal/peraturan/uu/1950/1|
|p|http://example.org/legal/ontology/disahkanOleh|
|o|SOEKARNO|

# Query_019

query:

```sparql
# tampilkan 10 legal doc pertama
PREFIX legal: <http://example.org/legal/ontology/>

SELECT * 
WHERE {
  ?legalDoc a legal:Peraturan
} 
ORDER BY ?legalDoc
LIMIT 10
```

result:
|0||
|-|-|
|legalDoc|http://example.org/legal/peraturan/uu/1950/1|

|1||
|-|-|
|legalDoc|http://example.org/legal/peraturan/uu/1950/14|

|2||
|-|-|
|legalDoc|http://example.org/legal/peraturan/uu/1950/15|

|3||
|-|-|
|legalDoc|http://example.org/legal/peraturan/uu/1950/2|

|4||
|-|-|
|legalDoc|http://example.org/legal/peraturan/uu/1950/3|

|5||
|-|-|
|legalDoc|http://example.org/legal/peraturan/uu/1950/4|

|6||
|-|-|
|legalDoc|http://example.org/legal/peraturan/uu/1950/5|

|7||
|-|-|
|legalDoc|http://example.org/legal/peraturan/uu/1950/6|

|8||
|-|-|
|legalDoc|http://example.org/legal/peraturan/uu/1953/10|

|9||
|-|-|
|legalDoc|http://example.org/legal/peraturan/uu/1953/18|

# Query_020

query:

```sparql
# tampilkan semua UU yang disahkan setelah 10 Oktober 2019
PREFIX legal: <http://example.org/legal/ontology/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT *
WHERE {
  ?legalDoc legal:disahkanPada ?date .
  FILTER ( ?date >= "2019-10-10"^^xsd:date )
}
ORDER BY ?legalDoc

```

result:
|0||
|-|-|
|legalDoc|http://example.org/legal/peraturan/uu/2019/17|
|date|2019-10-15|

|1||
|-|-|
|legalDoc|http://example.org/legal/peraturan/uu/2019/18|
|date|2019-10-15|

|2||
|-|-|
|legalDoc|http://example.org/legal/peraturan/uu/2019/20|
|date|2019-10-18|

|3||
|-|-|
|legalDoc|http://example.org/legal/peraturan/uu/2019/21|
|date|2019-10-18|

|4||
|-|-|
|legalDoc|http://example.org/legal/peraturan/uu/2019/22|
|date|2019-10-18|

|5||
|-|-|
|legalDoc|http://example.org/legal/peraturan/uu/2019/23|
|date|2019-10-24|

|6||
|-|-|
|legalDoc|http://example.org/legal/peraturan/uu/2019/24|
|date|2019-10-24|

|7||
|-|-|
|legalDoc|http://example.org/legal/peraturan/uu/2020/1|
|date|2020-02-28|

|8||
|-|-|
|legalDoc|http://example.org/legal/peraturan/uu/2020/10|
|date|2020-10-26|

|9||
|-|-|
|legalDoc|http://example.org/legal/peraturan/uu/2020/11|
|date|2020-11-02|

|10||
|-|-|
|legalDoc|http://example.org/legal/peraturan/uu/2020/12|
|date|2020-11-02|

|11||
|-|-|
|legalDoc|http://example.org/legal/peraturan/uu/2020/13|
|date|2020-11-02|

|12||
|-|-|
|legalDoc|http://example.org/legal/peraturan/uu/2020/2|
|date|2020-05-16|

|13||
|-|-|
|legalDoc|http://example.org/legal/peraturan/uu/2020/4|
|date|2020-08-05|

|14||
|-|-|
|legalDoc|http://example.org/legal/peraturan/uu/2020/5|
|date|2020-08-05|

|15||
|-|-|
|legalDoc|http://example.org/legal/peraturan/uu/2020/6|
|date|2020-08-11|

|16||
|-|-|
|legalDoc|http://example.org/legal/peraturan/uu/2020/8|
|date|2020-10-13|

|17||
|-|-|
|legalDoc|http://example.org/legal/peraturan/uu/2020/9|
|date|2020-10-26|

# Query_021

query:

```sparql
# tampilkan legal document beserta yang ditimbangnya (menimbang)
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?doc ?menimbangDoc
WHERE {
  ?doc legal:menimbang ?menimbang .
  ?menimbangText legal:bagianDari* ?menimbang .
  ?menimbangText legal:merujuk ?menimbangDoc .
  ?menimbangDoc a legal:Peraturan
}
ORDER BY ?doc
LIMIT 10

```

result:
|0||
|-|-|
|doc|http://example.org/legal/peraturan/uu/2004/11|
|menimbangDoc|http://example.org/legal/peraturan/uu/1986/2|

|1||
|-|-|
|doc|http://example.org/legal/peraturan/uu/2004/12|
|menimbangDoc|http://example.org/legal/peraturan/uu/1986/2|

|2||
|-|-|
|doc|http://example.org/legal/peraturan/uu/2004/13|
|menimbangDoc|http://example.org/legal/peraturan/uu/1986/2|

|3||
|-|-|
|doc|http://example.org/legal/peraturan/uu/2004/14|
|menimbangDoc|http://example.org/legal/peraturan/uu/1986/2|

|4||
|-|-|
|doc|http://example.org/legal/peraturan/uu/2004/16|
|menimbangDoc|http://example.org/legal/peraturan/uu/1991/5|

|5||
|-|-|
|doc|http://example.org/legal/peraturan/uu/2004/21|
|menimbangDoc|http://example.org/legal/peraturan/uu/1994/5|

|6||
|-|-|
|doc|http://example.org/legal/peraturan/uu/2004/5|
|menimbangDoc|http://example.org/legal/peraturan/uu/1985/14|

|7||
|-|-|
|doc|http://example.org/legal/peraturan/uu/2005/10|
|menimbangDoc|http://example.org/legal/peraturan/uu/2005/2|

|8||
|-|-|
|doc|http://example.org/legal/peraturan/uu/2005/10|
|menimbangDoc|http://example.org/legal/peraturan/uu/2005/2|

|9||
|-|-|
|doc|http://example.org/legal/peraturan/uu/2005/2|
|menimbangDoc|http://example.org/legal/peraturan/uu/2004/2|

# Query_022

query:

```sparql
# select 10 legal document dengan pasal terbanyak
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?doc (COUNT(?pasal) as ?pasalCount)
WHERE {
  ?doc a legal:Peraturan .
  ?pasal legal:bagianDari ?doc .
  ?pasal a legal:Pasal .
}
GROUP BY ?doc
ORDER BY DESC(?pasalCount)
LIMIT 10

```

result:
|0||
|-|-|
|doc|http://example.org/legal/peraturan/uu/2014/17|
|pasalCount|377|

|1||
|-|-|
|doc|http://example.org/legal/peraturan/uu/2012/8|
|pasalCount|328|

|2||
|-|-|
|doc|http://example.org/legal/peraturan/uu/1981/8|
|pasalCount|286|

|3||
|-|-|
|doc|http://example.org/legal/peraturan/uu/2006/11|
|pasalCount|230|

|4||
|-|-|
|doc|http://example.org/legal/peraturan/uu/2009/22|
|pasalCount|223|

|5||
|-|-|
|doc|http://example.org/legal/peraturan/uu/2003/13|
|pasalCount|206|

|6||
|-|-|
|doc|http://example.org/legal/peraturan/uu/2009/36|
|pasalCount|205|

|7||
|-|-|
|doc|http://example.org/legal/peraturan/uu/2020/11|
|pasalCount|186|

|8||
|-|-|
|doc|http://example.org/legal/peraturan/uu/2009/4|
|pasalCount|176|

|9||
|-|-|
|doc|http://example.org/legal/peraturan/uu/2016/13|
|pasalCount|173|

# Query_023

query:

```sparql
# tampilkan 10 dokumen yang pernah diamandemen
PREFIX legal: <http://example.org/legal/ontology/>

SELECT DISTINCT ?doc ?amenderDoc
WHERE {
  ?doc a legal:Peraturan .
  ?pasal legal:bagianDari ?doc .
  ?pasal legal:versi ?pasalVersion .
  ?amender legal:mengubah ?pasalVersion .
  ?amender legal:bagianDari* ?amenderDoc .
  ?amenderDoc a legal:Peraturan
}
LIMIT 10
```

result:
|0||
|-|-|
|doc|http://example.org/legal/peraturan/uu/2014/7|
|amenderDoc|http://example.org/legal/peraturan/uu/2020/11|

|1||
|-|-|
|doc|http://example.org/legal/peraturan/uu/2000/36|
|amenderDoc|http://example.org/legal/peraturan/uu/2020/11|

|2||
|-|-|
|doc|http://example.org/legal/peraturan/uu/2009/39|
|amenderDoc|http://example.org/legal/peraturan/uu/2020/11|

|3||
|-|-|
|doc|http://example.org/legal/peraturan/uu/2009/41|
|amenderDoc|http://example.org/legal/peraturan/uu/2020/11|

|4||
|-|-|
|doc|http://example.org/legal/peraturan/uu/2012/2|
|amenderDoc|http://example.org/legal/peraturan/uu/2020/11|

|5||
|-|-|
|doc|http://example.org/legal/peraturan/uu/2003/19|
|amenderDoc|http://example.org/legal/peraturan/uu/2020/11|

|6||
|-|-|
|doc|http://example.org/legal/peraturan/uu/1999/5|
|amenderDoc|http://example.org/legal/peraturan/uu/2020/11|

|7||
|-|-|
|doc|http://example.org/legal/peraturan/uu/2016/7|
|amenderDoc|http://example.org/legal/peraturan/uu/2020/11|

|8||
|-|-|
|doc|http://example.org/legal/peraturan/uu/2009/28|
|amenderDoc|http://example.org/legal/peraturan/uu/2020/11|

|9||
|-|-|
|doc|http://example.org/legal/peraturan/uu/1983/6|
|amenderDoc|http://example.org/legal/peraturan/uu/2020/11|

# Query_024

query:

```sparql
# tampilkan 10 tempat disahkan paling banyak
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?location (COUNT(?doc) as ?docCount)
WHERE {
  ?doc legal:disahkanDi ?location
}
GROUP BY ?location
ORDER BY DESC (?docCount)
```

result:
|0||
|-|-|
|location|Jakarta|
|docCount|751|

|1||
|-|-|
|location|Jakarta,|
|docCount|6|

|2||
|-|-|
|location|Jakar|
|docCount|2|

|3||
|-|-|
|location|Jogjakarta|
|docCount|2|

|4||
|-|-|
|location|D|
|docCount|1|

|5||
|-|-|
|location|Djakarta|
|docCount|1|

|6||
|-|-|
|location|Jakart|
|docCount|1|

# Query_025

query:

```sparql
# tampilkan 10 dokumen paling banyak ditimbang
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?menimbangDoc (COUNT(?doc) as ?penimbangDocCount)
WHERE {
  ?doc legal:menimbang ?menimbang .
  ?menimbang legal:daftarHuruf ?menimbangPointSet .
  ?menimbangPointSet legal:huruf ?menimbangPoint .
  ?menimbangPoint legal:segmen ?menimbangText .
  ?menimbangText legal:merujuk ?menimbangDoc .
  ?menimbangDoc a legal:Peraturan
}
GROUP BY ?menimbangDoc
ORDER BY DESC (?penimbangDocCount)
LIMIT 10

```

result:
|0||
|-|-|
|menimbangDoc|http://example.org/legal/peraturan/uu/2004/15|
|penimbangDocCount|20|

|1||
|-|-|
|menimbangDoc|http://example.org/legal/peraturan/uu/2000/24|
|penimbangDocCount|9|

|2||
|-|-|
|menimbangDoc|http://example.org/legal/peraturan/uu/1986/2|
|penimbangDocCount|6|

|3||
|-|-|
|menimbangDoc|http://example.org/legal/peraturan/uu/2009/47|
|penimbangDocCount|5|

|4||
|-|-|
|menimbangDoc|http://example.org/legal/peraturan/uu/2010/10|
|penimbangDocCount|5|

|5||
|-|-|
|menimbangDoc|http://example.org/legal/peraturan/uu/2013/23|
|penimbangDocCount|5|

|6||
|-|-|
|menimbangDoc|http://example.org/legal/peraturan/uu/1983/6|
|penimbangDocCount|4|

|7||
|-|-|
|menimbangDoc|http://example.org/legal/peraturan/uu/2003/12|
|penimbangDocCount|4|

|8||
|-|-|
|menimbangDoc|http://example.org/legal/peraturan/uu/1985/17|
|penimbangDocCount|3|

|9||
|-|-|
|menimbangDoc|http://example.org/legal/peraturan/uu/1992/9|
|penimbangDocCount|3|

# Query_026

query:

```sparql
# tampilkan semua document yang melakukan amendment, dan banyaknya pasal yang diamendment oleh dokumen tersebut.
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?doc (COUNT(?point) as ?amendmentCount)
WHERE {
  ?doc a legal:Peraturan .
  ?point legal:bagianDari* ?doc .
  ?point legal:mengubah|legal:menyisipkan|legal:menghapus ?pasalVersion .
}
GROUP BY (?doc)
ORDER BY DESC(?amendmentCount)
LIMIT 10
```

result:
|0||
|-|-|
|doc|http://example.org/legal/peraturan/uu/2020/11|
|amendmentCount|1221|

|1||
|-|-|
|doc|http://example.org/legal/peraturan/uu/2011/8|
|amendmentCount|20|

|2||
|-|-|
|doc|http://example.org/legal/peraturan/uu/2009/26|
|amendmentCount|11|

# Query_027

query:

```sparql
# tampilkan 10 bab dengan substring "Kerja"
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?bab ?title
WHERE {
  ?doc a legal:Peraturan .
  ?bab legal:bagianDari* ?doc .
  ?bab a legal:Bab .
  ?bab legal:judul ?title.
  FILTER REGEX(str(?title), "KERJA")
}
LIMIT 10

```

result:
|0||
|-|-|
|bab|http://example.org/legal/peraturan/uu/2014/7/bab/0012|
|title|KERJA SAMA PERDAGANGAN INTERNASIONAL|

|1||
|-|-|
|bab|http://example.org/legal/peraturan/uu/2020/11/bab/0011|
|title|PELAKSANAAN ADMINISTRASI PEMERINTAHAN UNTUK MENDUKUNG CIPTA KERJA|

|2||
|-|-|
|bab|http://example.org/legal/peraturan/uu/2020/11/bab/0004|
|title|KETENAGAKERJAAN|

|3||
|-|-|
|bab|http://example.org/legal/peraturan/uu/2007/40/bab/0004|
|title|RENCANA KERJA, LAPORAN TAHUNAN, DAN PENGGUNAAN LABA|

|4||
|-|-|
|bab|http://example.org/legal/peraturan/uu/2014/6/bab/0011|
|title|KERJA SAMA DESA Pasal 91 Desa dapat mengadakan kerja sama dengan Desa lain dan/atau kerja sama dengan pihak ketiga.|

|5||
|-|-|
|bab|http://example.org/legal/peraturan/uu/2017/18/bab/0007|
|title|PELAKSANA PENEMPATAN PEKERJA MIGRAN INDONESIA|

|6||
|-|-|
|bab|http://example.org/legal/peraturan/uu/2017/18/bab/0004|
|title|LAYANAN TERPADU SATU ATAP PENEMPATAN DAN PELINDUNGAN PEKERJA MIGRAN INDONESIA|

|7||
|-|-|
|bab|http://example.org/legal/peraturan/uu/2017/18/bab/0003|
|title|PELINDUNGAN PEKERJA MIGRAN INDONESIA|

|8||
|-|-|
|bab|http://example.org/legal/peraturan/uu/2017/18/bab/0002|
|title|PEKERJA MIGRAN INDONESIA|

|9||
|-|-|
|bab|http://example.org/legal/peraturan/uu/2003/13/bab/0012|
|title|PEMUTUSAN HUBUNGAN KERJA|

# Query_028

query:

```sparql
# show raw text of UU 2007 No.26 Pasal 1 version 20201102
PREFIX legal: <http://example.org/legal/ontology/>

SELECT *
WHERE {
  <http://example.org/legal/peraturan/uu/2007/26/pasal/0001/versi/20201102> legal:teks ?o
}
```

result:
|0||
|-|-|
|o|Dalam Undang-Undang ini yang dimaksud dengan:\n1. Ruang adalah wadah yang meliputi ruang darat, ruang laut, dan ruang udara, termasuk ruang di dalam bumi sebagai satu kesatuan wilayah, tempat manusia dan makhluk lain hidup, melakukan kegiatan, dan memelihara kelangsungan hidupnya.\n2. Tata ruang adalah wujud struktur ruang dan pola ruang.\n3. Struktur ruang adalah susunan pusat-pusat permukiman dan sistem jaringan prasarana dan sarana yang berfungsi sebagai pendukung kegiatan sosial ekonomi masyarakat yang secara hierarki memiliki hubungan fungsional.\n4. Pola ruang adalah distribusi peruntukan ruang dalam suatu wilayah yang meliputi peruntukan ruang untuk fungsi lindung dan peruntukan ruang untuk fungsi budi daya. an\n5. Penataan ruang adalah suatu sistem perencanaan tata ruang, pemanfaatan ruang, dan pengendalian pemanfaatan ruang.\n6. Penyelenggaraan penataan ruang adalah kegiatan yang meliputi pengaturan, pembinaan, pelaksanaan, dan pengawasan penataan ruang.\n7. Pemerintah Pusat adalah Presiden Republik Indonesia yang memegang kekuasaan pemerintahan negara Republik Indonesia yang dibantu oleh Wakil Presiden dan menteri sebagaimana dimaksud dalam Undang- Undang Dasar Negara Republik Indonesia Tahun 1945.\n8. Pemerintah Daerah adalah kepala daerah sebagai unsur penyelenggara Pemerintahan Daerah yang memimpin pelaksanaan urusan pemerintahan yang menjadi kewenangan daerah otonom.\n9. Pengaturan penataan ruang adalah upaya pembentukan landasan hukum bagi Pemerintah Pusat, Pemerintah Daerah, dan masyarakat dalam penataan ruang.\n10. Pembinaan penataan ruang adalah upaya untuk meningkatkan kinerja penataan ruang yang diselenggarakan oleh Pemerintah Pusat, Pemerintah Daerah, dan masyarakat.\n11. Pelaksanaan penataan ruang adalah upaya pencapaian tujuan penataan ruang melalui pelaksanaan perencanaan tata ruang, pemanfaatan ruang, dan pengendalian pemanfaatan ruang.\n12. Pengawasan penataan ruang adalah upaya agar penyelenggaraan penataan ruang dapat diwujudkan sesuai dengan ketentuan peraturan perundang- undangan.\n13. Perencanaan tata ruang adalah suatu proses untuk menentukan struktur ruang dan pola ruang yang meliputi penyusunan dan penetapan rencana tata ruang.\n14. Pemanfaatan ruang adalah upaya untuk mewujudkan struktur ruang dan pola ruang sesuai dengan rencana tata ruang melalui penyusunan dan pelaksanaan program beserta pembiayaannya.\n15. Pengendalian pemanfaatan ruang adalah upaya untuk mewujudkan tertib tata ruang.\n16. Rencana tata ruang adalah hasil perencanaan tata ruang.\n17. Wilayah adalah ruang yang merupakan kesatuan geografis beserta segenap unsur terkait yang batas dan sistemnya ditentukan berdasarkan aspek administratif dan/atau aspek fungsional.\n18. Sistem wilayah adalah struktur ruang dan pola ruang yang mempunyai jangkauan pelayanan pada tingkat wilayah.\n19. Sistem internal perkotaan adalah struktur ruang dan pola ruang yang mempunyai jangkauan pelayanan pada tingkat internal perkotaan.\n20. Kawasan adalah wilayah yang memiliki fungsi utama lindung atau budi daya.\n21. Kawasan lindung adalah wilayah yang ditetapkan dengan fungsi utama melindungi kelestarian lingkungan hidup yang mencakup sumber daya alam dan sumber daya buatan.\n22. Kawasan budi daya adalah wilayah yang ditetapkan dengan fungsi utama untuk dibudidayakan atas dasar kondisi dan potensi sumber daya alam, sumber daya manusia, dan sumber daya buatan.\n23. Kawasan perdesaan adalah wilayah yang mempunyai kegiatan utama pertanian, termasuk pengelolaan sumber daya alam dengan susunan fungsi kawasan sebagai tempat permukiman perdesaan, pelayanan jasa pemerintahan, pelayanan sosial, dan kegiatan ekonomi.\n24. Kawasan agropolitan adalah kawasan yang terdiri atas satu atau lebih pusat kegiatan pada wilayah perdesaan sebagai sistem produksi pertanian dan pengelolaan sumber daya alam tertentu yang ditunjukkan oleh adanya keterkaitan fungsional dan hierarki keruangan satuan sistem permukiman dan sistem agrobisnis.\n25. Kawasan perkotaan adalah wilayah yang mempunyai kegiatan utama bukan pertanian dengan susunan fungsi kawasan sebagai tempat permukiman perkotaan, pemusatan dan distribusi pelayanan jasa pemerintahan, pelayanan sosial, dan kegiatan ekonomi.\n26. Kawasan metropolitan adalah kawasan perkotaan yang terdiri atas sebuah kawasan perkotaan yang berdiri sendiri atau kawasan perkotaan inti dengan kawasan perkotaan di sekitarnya yang saling memiliki keterkaitan fungsional yang dihubungkan dengan sistem jaringan prasarana wilayah yang terintegrasi dengan jumlah penduduk secara keseluruhan sekurang-kurangnya 1.000.000 (satu juta) jiwa.\n27. Kawasan megapolitan adalah kawasan yang terbentuk dari 2 (dua) atau lebih kawasan metropolitan yang memiliki hubungan fungsional dan membentuk sebuah sistem.\n28. Kawasan strategis nasional adalah wilayah yang penataan ruangnya diprioritaskan karena mempunyai pengaruh sangat penting secara nasional terhadap kedaulatan negara, pertahanan, dan keamanan negara, ekonomi, sosial, budaya, dan/atau lingkungan, termasuk wilayah yang telah ditetapkan sebagai warisan dunia.\n29. Kawasan strategis provinsi adalah wilayah yang penataan ruangnya diprioritaskan karena mempunyai pengaruh sangat penting dalam lingkup provinsi terhadap ekonomi, sosial, budaya, dan/atau lingkungan.\n30. Kawasan strategis kabupaten/kota adalah wilayah yang penataan ruangnya diprioritaskan karena mempunyai pengaruh sangat penting dalam lingkup kabupaten/kota terhadap ekonomi, sosial, budaya, dan/atau lingkungan. aa\n31. Ruang terbuka hijau adalah area memanjang/jalur dan/atau mengelompok yang penggunaannya lebih bersifat terbuka, tempat tumbuh tanaman, baik yang tumbuh secara alamiah maupun yang sengaja ditanam, dengan mempertimbangkan aspek fungsi ekologis, resapan air, ekonomi, sosial budaya, dan estetika.\n32. Kesesuaian Kegiatan Pemanfaatan Ruang adalah kesesuaian antara rencana kegiatan pemanfaatan ruang dengan rencana tata ruang.\n33. Orang adalah orang perseorangan dan/atau korporasi.\n34. Menteri adalah menteri yang menyelenggarakan urusan pemerintahan dalam bidang penataan ruang.\n|