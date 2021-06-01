# Query_001

query:

```sparql
# Describe Omnibus Law (UU Cipta Kerja)
PREFIX legal: <http://example.org/legal/ontology/>

SELECT * WHERE {
  <http://example.org/legal/document/uu/2020/11> ?p ?o .
} LIMIT 3
```

result:
|0||
|-|-|
|p|http://www.w3.org/1999/02/22-rdf-syntax-ns#type|
|o|http://example.org/legal/ontology/Document|

|1||
|-|-|
|p|http://example.org/legal/ontology/documentMenimbang|
|o|http://example.org/legal/document/uu/2020/11/menimbang|

|2||
|-|-|
|p|http://example.org/legal/ontology/documentMengingat|
|o|http://example.org/legal/document/uu/2020/11/mengingat|

# Query_002

query:

```sparql
# Retrieve all articles (= pasal) of Omnibus Law
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?pasalVersion ?text WHERE {
  <http://example.org/legal/document/uu/2020/11> legal:documentHasPasal ?pasal .
  ?pasal legal:pasalHasPasalVersion ?pasalVersion .
  ?pasalVersion legal:pasalVersionHasRawText ?text .
} LIMIT 3
```

result:
|0||
|-|-|
|pasalVersion|http://example.org/legal/document/uu/2020/11/pasal/0186/version/20201102|
|text|Undang-Undang ini mulai berlaku pada tanggal diundangkan. Agar setiap orang mengetahuinya, memerintahkan pengundangan Undang-Undang ini dengan penempatannya dalam Lembaran Negara Republik Indonesia.|

|1||
|-|-|
|pasalVersion|http://example.org/legal/document/uu/2020/11/pasal/0185/version/20201102|
|text|Pada saat Undang-Undang ini mulai berlaku:\na. Peraturan pelaksanaan dari Undang-Undang ini wajib ditetapkan paling lama 3 (tiga) bulan, dan\nb. Semua peraturan pelaksanaan dari Undang-Undang yang telah diubah oleh Undang-Undang ini dinyatakan tetap berlaku sepanjang tidak bertentangan dengan Undang- Undang ini dan wajib disesuaikan paling lama 3 (tiga) bulan.\n|

|2||
|-|-|
|pasalVersion|http://example.org/legal/document/uu/2020/11/pasal/0184/version/20201102|
|text|Pada saat Undang-Undang ini mulai berlaku:\na. Perizinan Berusaha atau izin sektor yang sudah terbit masih tetap berlaku sampai dengan berakhirnya Perizinan Berusaha,\nb. Perizinan Berusaha dan/atau izin sektor yang sudah terbit sebelum berlakunya Undang-Undang ini dapat berlaku sesuai dengan Undang-Undang ini, dan\nc. Perizinan Berusaha yang sedang dalam proses permohonan disesuaikan dengan ketentuan dalam Undang-Undang ini.\n|

# Query_002_complete

query:

```sparql
# Retrieve all articles (= pasal) of Omnibus Law
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?pasal ?text WHERE {
  { 
    SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
      <http://example.org/legal/document/uu/2020/11> legal:documentHasPasal ?pasal .
      ?pasal legal:pasalHasPasalVersion ?pasalVersion .
    } GROUP BY ?pasal 
  }
  ?latestPasalVersion legal:pasalVersionHasRawText ?text
} LIMIT 3
```

result:
|0||
|-|-|
|pasal|http://example.org/legal/document/uu/2020/11/pasal/0098|
|text|Pemerintah Pusat dan Pemerintah Daerah sesuai dengan kewenangannya wajib memberikan pelatihan dan pendampingan pemanfaataan sistem/ aplikasi pembukuan/pencatatan keuangan yang memberi kemudahan bagi Usaha Mikro dan Kecil.|

|1||
|-|-|
|pasal|http://example.org/legal/document/uu/2020/11/pasal/0010|
|text|(1). Perizinan Berusaha untuk kegiatan usaha berisiko tinggi sebagaimana dimaksud dalam Pasal 7 ayat (7) huruf c berupa pemberian:\na. nomor induk berusaha: dan\nb. izin.\n\n(2). Izin sebagaimana dimaksud pada ayat (1) huruf b merupakan persetujuan Pemerintah Pusat atau Pemerintah Daerah untuk pelaksanaan kegiatan usaha yang wajib dipenuhi oleh Pelaku Usaha sebelum melaksanakan kegiatan usahanya.\n(3). Dalam hal kegiatan usaha berisiko tinggi memerlukan pemenuhan standar usaha dan standar produk, Pemerintah Pusat atau Pemerintah Daerah menerbitkan sertifikat standar usaha dan sertifikat standar produk berdasarkan hasil verifikasi pemenuhan standar.|

|2||
|-|-|
|pasal|http://example.org/legal/document/uu/2020/11/pasal/0022|
|text|Pasal 22 Beberapa ketentuan dalam Undang-Undang Nomor 32 Tahun 2009 tentang Perlindungan dan Pengelolaan Lingkungan Hidup (Lembaran Negara Republik Indonesia Tahun 2009 Nomor 140, Tambahan Lembaran Negara Republik Indonesia Nomor 5059) diubah sebagai berikut:\n1. Ketentuan Pasal 1 angka 11, angka 12, angka 35, angka 36, angka 37, dan angka 38 diubah sehingga Pasal 1 berbunyi sebagai berikut:\nDalam Undang-Undang ini yang dimaksud dengan:\n1. Lingkungan hidup adalah kesatuan ruang dengan semua benda, daya, keadaan, dan makhluk hidup, termasuk manusia dan perilakunya, yang mempengaruhi alam itu sendiri, kelangsungan perikehidupan, dan kesejahteraan manusia serta makhluk hidup lain.\n2. Perlindungan dan pengelolaan lingkungan hidup adalah upaya sistematis dan terpadu yang dilakukan untuk melestarikan fungsi lingkungan hidup dan mencegah terjadinya pencemaran dan/atau kerusakan lingkungan hidup yang meliputi perencanaan, pemanfaatan, pengendalian, pemeliharaan, pengawasan, dan penegakan hukum. . R\n3. Pembangunan berkelanjutan adalah upaya sadar dan terencana yang memadukan aspek lingkungan hidup, sosial, dan ekonomi ke dalam strategi pembangunan untuk menjamin keutuhan lingkungan hidup serta keselamatan, kemampuan, kesejahteraan, dan mutu hidup generasi masa kini dan generasi masa depan.\n4. Rencana perlindungan dan pengelolaan lingkungan hidup yang selanjutnya disingkat RPPLH adalah perencanaan tertulis yang memuat potensi, masalah lingkungan hidup, serta upaya perlindungan dan pengelolaannya dalam kurun waktu tertentu.\n5. Ekosistem adalah tatanan unsur lingkungan hidup yang merupakan kesatuan utuh-menyeluruh dan saling mempengaruhi dalam membentuk keseimbangan, stabilitas, dan produktivitas lingkungan hidup.\n6. Pelestarian fungsi lingkungan hidup adalah rangkaian upaya untuk memelihara kelangsungan daya dukung dan daya tampung lingkungan hidup.\n7. Daya dukung lingkungan hidup adalah kemampuan lingkungan hidup untuk mendukung perikehidupan manusia, makhluk hidup lain, dan keseimbangan antarkeduanya.\n8. Daya tampung lingkungan hidup adalah kemampuan lngkungan hidup untuk menyerap zat, energi, dan/atau komponen lain yang masuk atau dimasukkan ke dalamnya.\n9. Sumber daya alam adalah unsur lingkungan hidup yang terdiri atas sumber daya hayati dan nonhayati yang secara keseluruhan membentuk kesatuan ekosistem.\n10. Kajian lingkungan hidup strategis yang selanjutnya disingkat KLHS adalah rangkaian analisis yang sistematis, menyeluruh, dan partisipatif untuk memastikan bahwa prinsip pembangunan berkelanjutan telah menjadi dasar dan terintegrasi dalam pembangunan suatu wilayah dan/atau kebijakan, rencana, dan/atau program. a &\n11. Analisis mengenai dampak lingkungan hidup yang selanjutnya disebut Amdal adalah Kajian mengenai dampak penting pada lingkungan hidup dari suatu usaha dan/atau kegiatan yang direncanakan, untuk digunakan sebagai prasyarat pengambilan keputusan tentang penyelenggaraan usaha dan/atau kegiatan serta termuat dalam Perizinan Berusaha, atau persetujuan Pemerintah Pusat atau Pemerintah Daerah.\n12. Upaya pengelolaan lingkungan hidup dan upaya pemantauan lingkungan hidup yang selanjutnya disebut UKL-UPL adalah rangkaian proses pengelolaan dan pemantauan lingkungan hidup yang dituangkan dalam bentuk standar untuk digunakan sebagai prasyarat pengambilan keputusan serta termuat dalam Perizinan Berusaha, atau persetujuan Pemerintah Pusat atau Pemerintah Daerah.\n13. Baku mutu lingkungan hidup adalah ukuran batas atau kadar makhluk hidup, zat, energi, atau komponen yang ada atau harus ada dan/atau unsur pencemar yang ditenggang keberadaannya dalam suatu sumber daya tertentu sebagai unsur lingkungan hidup.\n14. Pencemaran lingkungan hidup adalah masuk atau dimasukkannya makhluk hidup, zat, energi, dan/atau komponen lain ke dalam lingkungan hidup oleh kegiatan manusia sehingga melampaui baku mutu lingkungan hidup yang telah ditetapkan.\n15. Kriteria baku kerusakan lingkungan hidup adalah ukuran batas perubahan sifat fisik, kimia, dan/atau hayati lingkungan hidup yang dapat ditenggang oleh llngkungan hidup untuk dapat tetap melestarikan fungsinya.\n16. Perusakan lingkungan hidup adalah tindakan orang yang menimbulkan perubahan langsung atau tidak langsung terhadap sifat fisik, kimia, dan/atau hayati lingkungan hidup sehingga melampaui kriteria baku kerusakan lingkungan hidup.\n17. Kerusakan lingkungan hidup adalah perubahan langsung dan/atau tidak langsung terhadap sifat fisik, kimia, dan/atau hayati lingkungan hidup yang melampaui kriteria baku kerusakan lingkungan hidup.\n18. Konservasi sumber daya alam adalah pengelolaan sumber daya alam untuk menjamin pemanfaatannya secara bijaksana serta kesinambungan ketersediaannya dengan tetap memelihara dan meningkatkan kualitas nilai serta keanekaragamannya.\n19. Perubahan iklim adalah berubahnya iklim yang diakibatkan langsung atau tidak langsung oleh aktivitas manusia sehingga menyebabkan perubahan komposisi atmosfir secara global dan selain itu juga berupa perubahan variabilitas iklim alamiah yang teramati pada kurun waktu yang dapat dibandingkan.\n20. Limbah adalah sisa suatu usaha dan/atau kegiatan.\n21. Bahan berbahaya dan beracun yang selanjutnya disingkat B3 adalah zat, energi, dan/atau komponen lan yang karena sifat, konsentrasi, dan/atau jumlahnya, baik secara langsung maupun tidak langsung, dapat mencemarkan dan/atau merusak lingkungan hidup, dan/atau membahayakan lingkungan hidup, kesehatan, serta kelangsungan hidup manusia dan makhluk hidup lain.\n22. Limbah bahan berbahaya dan beracun yang selanjutnya disebut Limbah B3 adalah sisa suatu usaha dan/atau kegiatan yang mengandung B3.\n23. Pengelolaan limbah B3 adalah kegiatan yang meliputi pengurangan, penyimpanan, pengumpulan, pengangkutan, pemanfaatan, pengolahan, dan/atau penimbunan.\n24. Dumping (pembuangan) adalah kegiatan membuang, menempatkan, dan/atau memasukkan limbah dan/atau bahan dalam jumlah, konsentrasi, waktu, dan lokasi tertentu dengan persyaratan tertentu ke media lingkungan hidup tertentu. .. &\n25. Sengketa lingkungan hidup adalah perselisihan antara dua pihak atau lebih yang timbul dari kegiatan yang berpotensi dan/atau telah berdampak pada lingkungan hidup.\n26. Dampak lingkungan hidup adalah pengaruh perubahan pada lingkungan hidup yang diakibatkan oleh suatu usaha dan/atau kegiatan.\n27. Organisasi lingkungan hidup adalah kelompok orang yang terorganisasi dan terbentuk atas kehendak sendiri yang tujuan dan kegiatannya berkaitan dengan lingkungan hidup.\n28. Audit lingkungan hidup adalah evaluasi yang dilakukan untuk menilai ketaatan penanggung jawab usaha dan/atau kegiatan terhadap persyaratan hukum dan kebijakan yang ditetapkan oleh pemerintah.\n29. Ekoregion adalah wilayah geografis yang memiliki kesamaan ciri iklim, tanah, air, flora, dan fauna asli, serta pola interaksi manusia dengan alam yang menggambarkan integritas sistem alam dan lingkungan hidup.\n30. Kearifan lokal adalah nilai-nilai luhur yang berlaku dalam tata kehidupan masyarakat untuk antara lain melindungi dan mengelola lingkungan hidup secara lestari.\n31. Masyarakat hukum adat adalah kelompok masyarakat yang secara turun temurun bermukim di wilayah geografis tertentu karena adanya ikatan pada asal usul leluhur, adanya hubungan yang kuat dengan lingkungan hidup, serta adanya sistem nilai yang menentukan pranata ekonomi, politik, sosial, dan hukum.\n32. Setiap orang adalah orang perseorangan atau badan usaha, baik yang berbadan hukum maupun yang tidak berbadan hukum.\n33. Instrumen ekonomi lingkungan hidup adalah seperangkat kebijakan ekonomi untuk mendorong Pemerintah, pemerintah daerah, atau setiap orang ke arah pelestarian fungsi lingkungan hidup.\n34. Ancaman serius adalah ancaman yang berdampak luas terhadap lingkungan hidup dan menimbulkan keresahan masyarakat.\n35. Persetujuan Lingkungan adalah Keputusan Kelayakan Lingkungan Hidup atau Pernyataan Kesanggupan Pengelolaan Lingkungan Hidup yang telah mendapatkan persetujuan dari Pemerintah Pusat atau Pemerintah Daerah.\n36. Pemerintah Pusat adalah Presiden Republik Indonesia yang memegang kekuasaan pemerintahan negara Republik Indonesia yang dibantu oleh Wakil Presiden dan menteri sebagaimana dimaksud dalam Undang- Undang Dasar Negara Republik Indonesia Tahun 1945.\n37. Pemerintah Daerah adalah kepala daerah sebagai unsur penyelenggara Pemerintahan Daerah yang memimpin pelaksanaan urusan pemerintahan yang menjadi kewenangan daerah otonom.\n38. Menteri adalah menteri yang menyelenggarakan urusan pemerintahan di bidang perlindungan dan pengelolaan lingkungan hidup.\n\n2. Ketentuan Pasal 20 diubah sehingga berbunyi sebagai berikut:\n(1). Penentuan terjadinya pencemaran lingkungan hidup diukur melalui baku mutu lingkungan hidup.\n(2). Baku mutu lingkungan hidup meliputi:\na. baku mutu air,\nb. baku mutu air limbah,\nc. baku mutu air laut:\nd. baku mutu udara ambien:\ne. baku mutu emisi:\nf. ' baku mutu gangguan: dan\ng. baku mutu lain sesuai dengan perkembangan ilmu pengetahuan dan teknologi. yA 8 &\n\n(3). Setiap orang diperbolehkan untuk membuang limbah ke media lingkungan hidup dengan persyaratan:\na. memenuhi baku mutu lingkungan hidup: dan\nb. mendapat persetujuan dari Pemerintah Pusat atau Pemerintah Daerah.\n\n(4). Ketentuan lebih lanjut mengenai baku mutu lingkungan hidup sebagaimana dimaksud pada ayat (2) diatur dalam Peraturan Pemerintah.\n3. Ketentuan Pasal 24 diubah sehingga berbunyi sebagai berikut:\n(1). Dokumen Amdal merupakan dasar uji kelayakan lingkungan hidup untuk rencana usaha dan/atau kegiatan.\n(2). Uji kelayakan lingkungan hidup sebagaimana dimaksud pada ayat (1) dilakukan oleh tim uji kelayakan lingkungan hidup yang dibentuk oleh lembaga uji kelayakan lingkungan hidup Pemerintah Pusat.\n(3). Tim uji kelayakan lingkungan hidup sebagaimana dimaksud pada ayat (2) terdiri atas unsur Pemerintah Pusat, Pemerintah Daerah, dan ahli bersertifikat.\n(4). Pemerintah Pusat atau Pemerintah Daerah menetapkan Keputusan Kelayakan Lingkungan Hidup berdasarkan hasil uji kelayakan lingkungan hidup.\n(5). Keputusan Kelayakan Lingkungan Hidup sebagaimana dimaksud pada ayat (4) digunakan sebagai persyaratan penerbitan Perizinan Berusaha, atau persetujuan Pemerintah Pusat atau Pemerintah Daerah.\n(6). Ketentuan lebih lanjut mengenai tata laksana uji kelayakan lingkungan hidup diatur dalam Peraturan Pemerintah.\n4. Ketentuan Pasal 25 diubah sehingga berbunyi sebagai berikut: . 0\nDokumen Amdal memuat:\na. pengkajian mengenai dampak rencana usaha dan/atau kegiatan:\nb. evaluasi kegiatan di sekitar lokasi rencana usaha dan/atau kegiatan:\nc. saran masukan serta tanggapan masyarakat terkena dampak langsung yang relevan terhadap rencana usaha dan/atau kegiatan:\nd. prakiraan terhadap besaran dampak serta sifat penting dampak yang terjadi jika rencana usaha dan/atau kegiatan tersebut dilaksanakan:\ne. evaluasi secara holistik terhadap dampak yang terjadi untuk menentukan kelayakan atau ketidaklayakan lingkungan hidup, dan\nf. rencana pengelolaan dan pemantauan lingkungan hidup.\n\n5. Ketentuan Pasal 26 diubah sehingga berbunyi sebagai berikut:\n(1). Dokumen Amdal sebagaimana dimaksud dalam Pasal 22 disusun oleh pemrakarsa dengan melibatkan masyarakat.\n(2). Penyusunan dokumen Amdal dilakukan dengan melibatkan masyarakat yang terkena dampak langsung terhadap rencana usaha dan/atau kegiatan.\n(3). Ketentuan lebih lanjut mengenai proses pelibatan masyarakat sebagaimana dimaksud pada ayat (2) diatur dalam Peraturan Pemerintah.\n6. Ketentuan Pasal 27 diubah sehingga berbunyi sebagai berikut: pa 2 2\nPasal 27 Dalam menyusun dokumen Amdal, pemrakarsa sebagaimana dimaksud dalam Pasal 26 ayat (1) dapat menunjuk pihak lain.\n7. Ketentuan Pasal 28 diubah sehingga berbunyi sebagai berikut:\n(1). Penyusun Amdal sebagaimana dimaksud dalam Pasal 26 ayat (1) dan Pasal 27 wajib memiliki sertifikat kompetensi penyusun Amdal.\n(2). Ketentuan lebih lanjut mengenai sertifikasi dan kriteria kompetensi penyusun Amdal diatur dalam Peraturan Pemerintah.\n8. Pasal 29 dihapus.\n9. Pasal 30 dihapus.\n10. Pasal 31 dihapus.\n11. Ketentuan Pasal 32 diubah sehingga berbunyi sebagai berikut:\n(1). Pemerintah Pusat dan Pemerintah Daerah membantu penyusunan Amdal bagi usaha dan/atau kegiatan Usaha Mikro dan Kecil yang berdampak penting terhadap lingkungan hidup.\n(2). Bantuan penyusunan Amdal sebagaimana dimaksud pada ayat (1) berupa fasilitasi, biaya, dan/atau penyusunan Amdal.\n(3). Penentuan mengenai usaha dan/atau kegiatan Usaha Mikro dan Kecil sebagaimana dimaksud pada ayat (1) dilakukan berdasarkan kriteria sesuai dengan ketentuan peraturan perundang-undangan.\n12. Ketentuan Pasal 34 diubah sehingga berbunyi sebagai berikut:\n(1). Setiap usaha dan/atau kegiatan yang tidak berdampak penting terhadap Lingkungan Hidup wajib memenuhi standar UKL-UPL.\n(2). Pemenuhan standar UKL-UPL sebagaimana dimaksud pada ayat (1) dinyatakan dalam Pernyataan Kesanggupan Pengelolaan Lingkungan Hidup.\n(3). Berdasarkan Pernyataan Kesanggupan Pengelolaan Lingkungan Hidup sebagaimana dimaksud pada ayat (2), Pemerintah Pusat atau Pemerintah Daerah menerbitkan Perizinan Berusaha, atau persetujuan Pemerintah Pusat atau Pemerintah Daerah.\n(4). Pemerintah Pusat menetapkan jenis usaha dan/atau kegiatan yang wajib dilengkapi UKL-UPL.\n(5). Ketentuan lebih lanjut mengenai UKL-UPL diatur dalam Peraturan Pemerintah.\n13. Ketentuan Pasal 35 diubah sehingga berbunyi sebagai berikut:\n(1). Usaha dan/atau kegiatan yang tidak wajib dilengkapi UKL-UPL sebagaimana dimaksud dalam Pasal 34 ayat (4) wajib membuat surat pernyataan kesanggupan pengelolaan dan pemantauan lingkungan hidup yang diintegrasikan ke dalam Nomor Induk Berusaha.\n(2). Penetapan jenis usaha dan/atau kegiatan sebagaimana dimaksud pada ayat (1) dilakukan terhadap kegiatan yang termasuk dalam kategori berisiko rendah.\n(3). Ketentuan lebih lanjut mengenai surat pernyataan kesanggupan pengelolaan dan pemantauan lingkungan hidup diatur dalam Peraturan Pemerintah.\n14. Pasal 36 dihapus.\n15. Ketentuan Pasal 37 diubah sehingga berbunyi sebagai berikut:\nPerizinan Berusaha dapat dibatalkan apabila:\na. persyaratan yang diajukan dalam permohonan Perizinan Berusaha mengandung cacat hukum, kekeliruan, penyalahgunaan, serta ketidakbenaran dan/atau pemalsuan data, dokumen, dan/atau informasi,\nb. penerbitannya tanpa memenuhi syarat sebagaimana tercantum dalam Keputusan Kelayakan Lingkungan Hidup atau Pernyataan Kesanggupan Pengelolaan Lingkungan Hidup, atau\nc. kewajiban yang ditetapkan dalam dokumen Amdal atau UKL-UPL tidak dilaksanakan oleh penanggung jawab usaha dan/atau kegiatan.\n\n16. Pasal 38 dihapus.\n17. Ketentuan Pasal 39 diubah sehingga berbunyi sebagai berikut:\n(1). Keputusan Kelayakan Lingkungan Hidup diumumkan kepada masyarakat.\n(2). Pengumuman sebagaimana dimaksud pada ayat (1) dilakukan melalui sistem elektronik dan/atau cara lain yang ditetapkan oleh Pemerintah Pusat.\n18. Pasal 40 dihapus.\n19. Ketentuan Pasal 55 diubah sehingga berbunyi sebagai berikut:\n(1). Pemegang Persetujuan Lingkungan wajib menyediakan dana penjaminan untuk pemulihan fungsi lingkungan hidup.\n(2). Dana penjaminan disimpan di bank pemerintah yang ditunjuk oleh Pemerintah Pusat.\n(3). Pemerintah Pusat dapat menetapkan pihak ketiga untuk melakukan pemulihan fungsi lingkungan hidup dengan menggunakan dana penjaminan.\n(4). Ketentuan lebih lanjut mengenai dana penjaminan sebagaimana dimaksud pada ayat (1), ayat (2), dan ayat (3) diatur dalam Peraturan Pemerintah.\n20. Ketentuan Pasal 59 diubah sehingga berbunyi sebagai berikut:\n(1). Setiap orang yang menghasilkan Limbah B3 wajib melakukan Pengelolaan Limbah B3 yang dihasilkannya.\n(2). Dalam hal B3 sebagaimana dimaksud dalam Pasal 58 ayat (1) telah kedaluwarsa, pengelolaannya mengikuti ketentuan Pengelolaan Limbah B3.\n(3). Dalam hal setiap orang sebagaimana dimaksud pada ayat (1) tidak mampu melakukan sendiri Pengelolaan Limbah B3, pengelolaannya diserahkan kepada pihak lain.\n(4). Pengelolaan Limbah B3 wajib mendapat Perizinan Berusaha, atau persetujuan Pemerintah Pusat atau Pemerintah Daerah. an 3\n(5). Pemerintah Pusat atau Pemerintah Daerah wajib mencantumkan persyaratan lingkungan hidup yang harus dipenuhi dan kewajiban yang harus dipatuhi pengelola limbah B3 dalam Perizinan Berusaha, atau persetujuan Pemerintah Pusat atau Pemerintah Daerah.\n(6). Keputusan pemberian Perizinan Berusaha wajib diumumkan.\n(7). Ketentuan lebih lanjut mengenai Pengelolaan Limbah B3 diatur dalam Peraturan Pemerintah.\n21. Ketentuan Pasal 61 diubah sehingga berbunyi sebagai berikut:\n(1). Dumping sebagaimana dimaksud dalam Pasal 60 hanya dapat dilakukan dengan persetujuan dari Pemerintah Pusat.\n(2). Dumping sebagaimana dimaksud pada ayat (1) hanya dapat dilakukan di lokasi yang telah ditentukan.\n(3). Ketentuan lebih lanjut mengenai tata cara dan persyaratan dumping limbah atau bahan diatur dalam Peraturan Pemerintah.\n22. Di antara Pasal 61 dan Pasal 62 disisipkan 1 (satu) pasal, yakni Pasal 61A sehingga berbunyi sebagai berikut:\n\na. menghasilkan, mengangkut, mengedarkan, menyimpan, memanfaatkan, dan/atau mengolah B3:\nb. menghasilkan, mengangkut, menyimpan, mengumpulkan, memanfaatkan, mengolah, dan/atau menimbun Limbah B3:\nc. . melakukan pembuangan air limbah ke laut:\nd. melakukan pembuangan air limbah ke sumber air:\ne. membuang emisi ke udara: dan/atau i. — memanfaatkan air limbah untuk aplikasi ke tanah: yang merupakan bagian dari kegiatan usaha, pengelolaan tersebut dinyatakan dalam Amdal atau UKL-UPL.\n\n23. Ketentuan Pasal 63 diubah sehingga berbunyi sebagai berikut:\n(1). Dalam pelindungan dan pengelolaan lingkungan hidup, Pemerintah Pusat bertugas dan berwenang:\na. menetapkan kebijakan nasional,\nb. menetapkan norma, standar, prosedur, dan kriteria:\nc. menetapkan dan melaksanakan kebijakan mengenai RPPLH nasional:\nd. menetapkan dan melaksanakan kebijakan mengenai KLHS,\ne. menetapkan dan melaksanakan kebijakan mengenai amdal dan UKL-UPL:\nf. ' menyelenggarakan inventarisasi sumber daya alam nasional dan emisi gas rumah kaca:\ng. mengembangkan standar kerja sama,\nh. mengoordinasikan dan melaksanakan pengendalian pencemaran dan/atau kerusakan lingkungan hidup:\ni. menetapkan dan melaksanakan kebijakan mengenai sumber daya alam hayati dan nonhayati, keanekaragaman hayati, sumber daya genetik, dan keamanan hayati produk rekayasa genetik,\nj. menetapkan dan melaksanakan kebijakan mengenai pengendalian dampak perubahan iklim dan perlindungan lapisan ozon:\nk. menetapkan dan melaksanakan kebijakan mengenai B3, limbah, serta limbah B3: Il. | menetapkan dan melaksanakan kebijakan mengenai perlindungan lingkungan laut: m. menetapkan dan melaksanakan kebijakan mengenai pencemaran dan/atau kerusakan lingkungan hidup lintas batas negara: n. melakukan pembinaan dan pengawasan terhadap pelaksanaan kebijakan tingkat nasional dan kebijakan tingkat provinsi: O. melakukan pembinaan dan pengawasan ketaatan penanggung jawab usaha dan/atau kegiatan terhadap ketentuan Persetujuan Lingkungan dan peraturan perundang- undangan, p. mengembangkan dan menerapkan instrumen lingkungan hidup: g. mengoordinasikan dan memfasilitasi kerja sama dan penyelesaian perselisihan antardaerah serta penyelesaian sengketa: r. mengembangkan dan melaksanakan kebijakan pengelolaan pengaduan masyarakat: S. menetapkan standar pelayanan minimal: t. ' menetapkan kebijakan mengenai tata cara pengakuan keberadaan masyarakat hukum adat, kearifan lokal, dan hak masyarakat hukum adat yang terkait dengan perlindungan dan pengelolaan lingkungan hidup: U. mengelola informasi lingkungan hidup nasional: V. mengoordinasikan, mengembangkan, dan menyosialisasikan pemanfaatan teknologi ramah lingkungan hidup: w. memberikan pendidikan, pelatihan, pembinaan, dan penghargaan, xXx. mengembangkan sarana dan standar laboratorium lingkungan hidup: y. menerbitkan Perizinan Berusaha atau persetujuan Pemerintah Pusat: Zz. menetapkan wilayah ekoregion: dan aa. melakukan penegakan hukum lingkungan hidup. .\n\n(2). Dalam pelindungan dan pengelolaan lingkungan hidup, pemerintah provinsi sesuai dengan norma, standar, prosedur, dan kriteria yang ditetapkan oleh Pemerintah Pusat bertugas dan berwenang:\na. menetapkan kebijakan tingkat provinsi:\nb. menetapkan dan melaksanakan KLHS tingkat provinsi:\nc. . menetapkan dan melaksanakan kebijakan mengenai RPPLH provinsi:\nd. melaksanakan kebijakan mengenai Amdal dan UKL-UPL,\ne. menyelenggarakan inventarisasi sumber daya alam dan emisi gas rumah kaca pada tingkat provinsi:\nf. ' mengembangkan dan melaksanakan kerja sama dan kemitraan:\ng. mengoordinasikan dan melaksanakan pengendalian pencemaran dan/atau kerusakan lingkungan hidup lintas kabupaten/kota:\nh. melakukan pembinaan dan pengawasan terhadap pelaksanaan kebijakan tingkat kabupaten/kota:\ni. | melakukan pembinaan dan pengawasan ketaatan penanggung jawab usaha dan/atau kegiatan sesuai ketentuan peraturan perundang- undangan,\nj. mengembangkan dan menerapkan instrumen lingkungan hidup:\nk. mengoordinasikan dan memfasilitasi kerja sama dan penyelesaian perselisihan antarkabupaten/antarkota serta penyelesaian sengketa:\nl. melakukan pembinaan, bantuan teknis, dan pengawasan kepada kabupaten/kota di bidang program dan kegiatan:\nm. melaksanakan standar pelayanan minimal: ap\nn. menetapkan kebijakan mengenai tata cara pengakuan keberadaan masyarakat hukum adat, kearifan lokal, dan hak masyarakat hukum adat yang terkait dengan perlindungan dan pengelolaan lingkungan hidup pada tingkat provinsi: Oo. mengelola informasi lingkungan hidup tingkat provinsi, p. mengembangkan dan menyosialisasikan pemanfaatan teknologi ramah lingkungan hidup: g. memberikan pendidikan, pelatihan, pembinaan, dan penghargaan: r. ' menerbitkan Perizinan Berusaha atau persetujuan Pemerintah Daerah pada tingkat provinsi, dan Ss. melakukan penegakan hukum lingkungan hidup pada tingkat provinsi.\n\n(3). Dalam pelindungan dan pengelolaan lingkungan hidup, pemerintah kabupaten/kota sesuai dengan norma, standar, prosedur, dan kriteria yang ditetapkan oleh Pemerintah Pusat bertugas dan berwenang:\na. menetapkan kebijakan tingkat kabupaten/kota:\nb. menetapkan dan melaksanakan KLHS tingkat kabupaten/kota,\nc. . menetapkan dan melaksanakan kebijakan mengenai RPPLH tingkat kabupaten/kota:\nd. melaksanakan kebijakan mengenai Amdal dan UKL-UPL,\ne. menyelenggarakan inventarisasi sumber daya alam dan emisi gas rumah kaca pada tingkat kabupaten/kota,\nf. mengembangkan dan melaksanakan kerja sama dan kemitraan:\ng. mengembangkan dan menerapkan instrumen lingkungan hidup,\nh. memfasilitasi penyelesaian sengketa, .\ni. melakukan pembinaan dan pengawasan ketaatan penanggung jawab usaha dan/atau kegiatan sesuai ketentuan peraturan perundang- undangan,\nj. melaksanakan standar pelayanan minimal:\nk. melaksanakan kebijakan mengenai tata cara pengakuan keberadaan masyarakat hukum adat, kearifan lokal, dan hak masyarakat hukum adat yang terkait dengan perlindungan dan pengelolaan lingkungan hidup pada tingkat kabupaten/kota,\nl. mengelola informasi lingkungan hidup tingkat kabupaten/kota,\nm. mengembangkan dan melaksanakan kebijakan sistem informasi lingkungan hidup tingkat kabupaten/kota:\nn. memberikan pendidikan, pelatihan, pembinaan, dan penghargaan,\no. menerbitkan Perizinan Berusaha atau persetujuan Pemerintah Daerah pada tingkat kabupaten/kota: dan\np. melakukan penegakan hukum lingkungan hidup pada tingkat kabupaten/kota.\n\n24. Ketentuan Pasal 69 diubah sehingga berbunyi sebagai berikut:\n(1). Setiap orang dilarang:\na. melakukan perbuatan yang mengakibatkan pencemaran dan/atau perusakan lingkungan hidup,\nb. memasukkan B3 yang dilarang menurut peraturan perundang-undangan ke dalam wilayah Negara Kesatuan Republik Indonesia:\nc. . memasukkan limbah yang berasal dari luar wilayah Negara Kesatuan Republik Indonesia ke media lingkungan hidup Negara Kesatuan Republik Indonesia,\nd. memasukkan limbah B3 ke dalam wilayah Negara Kesatuan Republik Indonesia:\ne. membuang limbah ke media lingkungan hidup: i. membuang B3 dan limbah B3 ke media lingkungan hidup: g. melepaskan produk rekayasa genetik ke media llngkungan hidup yang bertentangan dengan peraturan perundang-undangan atau persetujuan lingkungan: h. melakukan pembukaan lahan dengan cara membakar: i. menyusun Amdal tanpa memiliki sertifikat kompetensi penyusun Amdal, dan/atau j. memberikan informasi palsu, menyesatkan, menghilangkan informasi, merusak informasi, atau memberikan keterangan yang tidak benar.\n\n(2). Ketentuan sebagaimana dimaksud pada ayat (1) huruf h dikecualikan bagi masyarakat yang melakukan kegiatan dimaksud dengan memperhatikan sungguh-sungguh kearifan lokal di daerah masing-masing.\n25. Ketentuan Pasal 71 diubah sehingga berbunyi sebagai berikut:\n(1). Pemerintah Pusat atau Pemerintah Daerah melakukan pengawasan terhadap ketaatan penanggung jawab usaha dan/atau kegiatan atas ketentuan yang ditetapkan dalam peraturan perundang-undangan di bidang pelindungan dan pengelolaan lingkungan hidup. Hn 3\n(2). Pemerintah Pusat atau Pemerintah Daerah dapat mendelegasikan kewenangannya dalam melakukan pengawasan kepada pejabat/instansi teknis yang bertanggung jawab di bidang perlindungan dan pengelolaan lingkungan hidup.\n(3). Dalam melaksanakan pengawasan, Pemerintah Pusat atau Pemerintah Daerah menetapkan pejabat pengawas lingkungan hidup yang merupakan pejabat fungsional.\n(4). Ketentuan lebih lanjut mengenai pejabat pengawas lingkungan hidup diatur dalam Peraturan Pemerintah.\n26. Ketentuan Pasal 72 diubah sehingga berbunyi sebagai berikut:\nPasal 72 Pemerintah Pusat atau Pemerintah Daerah sesuai dengan kewenangannya berdasarkan norma, standar, prosedur, dan kriteria yang ditetapkan oleh Pemerintah Pusat wajib melakukan pengawasan ketaatan penanggung jawab usaha dan/atau kegiatan terhadap Perizinan Berusaha, atau persetujuan Pemerintah Pusat atau Pemerintah Daerah.\n27. Ketentuan Pasal 73 diubah sehingga berbunyi sebagai berikut:\nPasal 73 Menteri dapat melakukan pengawasan terhadap ketaatan penanggung jawab usaha dan/atau kegiatan yang Perizinan Berusaha atau persetujuan Pemerintah Daerah diterbitkan oleh Pemerintah Daerah jika Menteri menganggap terjadi pelanggaran yang serius di bidang pelindungan dan pengelolaan lingkungan hidup berdasarkan norma, standar, prosedur, dan kriteria yang ditetapkan oleh Pemerintah Pusat. Ha 90\n28. Ketentuan Pasal 76 diubah sehingga berbunyi sebagai berikut:\n(1). Pemerintah Pusat atau Pemerintah Daerah menerapkan sanksi administratif kepada penanggung jawab usaha dan/atau kegiatan jika dalam pengawasan ditemukan pelanggaran terhadap Perizinan Berusaha, atau persetujuan Pemerintah Pusat atau Pemerintah Daerah.\n(2). Ketentuan lebih lanjut mengenai tata cara pengenaan sanksi diatur dalam Peraturan Pemerintah.\n29. Ketentuan Pasal 77 diubah sehingga berbunyi sebagai berikut:\nPasal 77 Menteri dapat menerapkan sanksi administratif terhadap penanggung jawab usaha dan/atau kegiatan dalam hal Menteri menganggap Pemerintah Daerah secara sengaja tidak menerapkan sanksi administratif terhadap pelanggaran yang serius di bidang pelindungan dan pengelolaan lingkungan hidup.\n30. Pasal 79 dihapus.\n31. Ketentuan Pasal 82 diubah sehingga berbunyi sebagai berikut:\n(1). Pemerintah Pusat berwenang untuk memaksa penanggung jawab usaha dan/atau kegiatan untuk melakukan pemulihan lingkungan hidup akibat pencemaran dan/atau perusakan lingkungan hidup yang dilakukannya. aa\n(2). Pemerintah Pusat berwenang atau dapat menunjuk pihak ketiga untuk melakukan pemulihan lingkungan hidup akibat pencemaran dan/atau perusakan lingkungan hidup yang dilakukannya atas beban biaya penanggung jawab usaha dan/atau kegiatan.\n32. Di antara Pasal 82 dan Pasal 83 disisipkan 3 (tiga) pasal, yakni Pasal 82A, Pasal 82B, dan Pasal 82C sehingga berbunyi sebagai berikut:\n(1). Sanksi administratif sebagaimana dimaksud dalam Pasal 82A dan Pasal 82B ayat (1), ayat (2), dan ayat (3) berupa:\na. teguran tertulis:\nb. paksaan pemerintah:\nc. denda administratif:\nd. pembekuan Perizinan Berusaha, dan/atau\ne. pencabutan Perizinan Berusaha.\n\n(2). Ketentuan lebih lanjut mengenai kriteria, jenis, besaran denda, dan tata cara pengenaan sanksi administratif sebagaimana dimaksud pada ayat (1) diatur dalam Peraturan Pemerintah.\n(3). huruf b: dikenai sanksi administratif.\n(1). Setiap orang yang melakukan usaha dan/atau kegiatan yang memiliki:\na. Perizinan Berusaha, atau persetujuan Pemerintah Pusat atau Pemerintah Daerah sebagaimana dimaksud dalam Pasal 24 ayat (5), Pasal 34 ayat (3), Pasal 59 ayat (1), atau Pasal 59 ayat (4),\nb. persetujuan dari Pemerintah Pusat atau Pemerintah Daerah sebagaimana dimaksud dalam Pasal 20 ayat (3) huruf b: atau\nc. . persetujuan dari Pemerintah Pusat sebagaimana dimaksud dalam Pasal 61 ayat (1): si yang tidak sesuai dengan kewajiban dalam Perizinan Berusaha, atau persetujuan Pemerintah Pusat atau Pemerintah Daerah, dan/atau melanggar ketentuan peraturan perundang-undangan di bidang perlindungan dan pengelolaan lingkungan hidup, dikenai sanksi administratif.\n\n(2). Setiap orang yang melakukan pelanggaran larangan sebagaimana dimaksud dalam Pasal 69, yaitu:\na. melakukan perbuatan yang mengakibatkan pencemaran dan/atau perusakan lingkungan hidup sebagaimana dimaksud dalam Pasal 69 huruf a, dimana perbuatan tersebut dilakukan karena kelalaian dan tidak mengakibatkan bahaya kesehatan manusia dan/atau luka dan/atau luka berat, dan/atau matinya orang dikenai sanksi administratif dan mewajibkan kepada Penanggung Jawab perbuatan itu untuk melakukan pemulihan fungsi lingkungan hidup dan/atau tindakan lain yang diperlukan, atau\nb. menyusun Amdal tanpa memiliki sertifikat kompetensi penyusun Amdal sebagaimana dimaksud dalam Pasal 69 huruf i dikenai sanksi administratif.\n\n(3). Setiap orang yang karena kelalaiannya melakukan perbuatan yang mengakibatkan dilampauinya baku mutu udara ambien, baku mutu air, baku mutu air laut, atau kriteria baku kerusakan lingkungan hidup yang tidak sesuai dengan Perizinan Berusaha yang dimilikinya dikenai sanksi administratif.\n33. Ketentuan Pasal 88 diubah sehingga berbunyi sebagai berikut:\nPasal 88 Setiap orang yang tindakannya, usahanya, dan/atau kegiatannya menggunakan B3, menghasilkan dan/atau mengelola limbah B3, dan/atau yang menimbulkan ancaman serius terhadap lingkungan hidup bertanggung jawab mutlak atas kerugian yang terjadi dari usaha dan/atau kegiatannya.\n34. Pasal 93 dihapus.\n35. Pasal 102 dihapus.\n36. Ketentuan Pasal 109 diubah sehingga berbunyi sebagai berikut:\n(3). huruf b: atau C. persetujuan dari Pemerintah Pusat sebagaimana dimaksud dalam Pasal 61 ayat (1): yang mengakibatkan timbulnya korban/kerusakan terhadap kesehatan, keselamatan, dan/atau lingkungan, dipidana dengan pidana penjara paling singkat 1 (satu) tahun dan paling lama 3 (tiga) tahun dan denda paling sedikit Rp1.000.000.000,00 (satu miliar rupiah) dan paling banyak Rp3.000.000.000,00 (tiga miliar rupiah).\n37. Pasal 110 dihapus.\n38. Ketentuan Pasal 111 diubah sehingga berbunyi sebagai berikut:\nPasal 111 Pejabat pemberi persetujuan lingkungan yang menerbitkan persetujuan lingkungan tanpa dilengkapi dengan Amdal atau UKL-UPL sebagaimana dimaksud dalam Pasal 37 dipidana dengan pidana penjara paling lama 3 (tiga) tahun dan denda paling banyak Rp3.000.000.000,00 (tiga miliar rupiah).\n39. Ketentuan Pasal 112 diubah sehingga berbunyi sebagai berikut:\nPasal 112 Setiap pejabat berwenang yang dengan sengaja tidak melakukan pengawasan terhadap ketaatan penanggung jawab usaha dan/atau kegiatan terhadap peraturan perundang-undangan dan Perizinan Berusaha, atau persetujuan Pemerintah Pusat atau Pemerintah Daerah sebagaimana dimaksud dalam Pasal 71 yang mengakibatkan terjadinya pencemaran dan/atau kerusakan lingkungan yang mengakibatkan hilangnya nyawa manusia dipidana dengan pidana penjara paling lama 1 (satu) tahun atau denda paling banyak Rp500.000.000,00 (lima ratus juta rupiah).\n|

# Query_003

query:

```sparql
# What is the textual content of Article (or Pasal) 2 Subsection (or Ayat) 1 of Omnibus Law?
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?x ?text WHERE {
  ?pasal legal:partOf+ <http://example.org/legal/document/uu/2020/11>.
  ?pasal legal:pasalHasKey 2 .
  ?x legal:partOf* ?pasal .
  ?x legal:ayatHasKey 1 .
  ?x legal:ayatHasRawText ?text .
} LIMIT 3
```

result:
|0||
|-|-|
|x|http://example.org/legal/document/uu/2020/11/pasal/0002/version/20201102/ayat/0001|
|text|Undang-Undang ini diselenggarakan berdasarkan asas:\na. pemerataan hak,\nb. kepastian hukum:\nc. kemudahan berusaha:\nd. kebersamaan: dan\ne. kemandirian.\n|

# Query_003_complete

query:

```sparql
# What is the textual content of Article (or Pasal) 2 Subsection (or Ayat) 1 of Omnibus Law?
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?x ?text WHERE {
  {
    SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
      <http://example.org/legal/document/uu/2020/11> legal:documentHasPasal ?pasal .
      ?pasal legal:pasalHasKey 2 .
      ?pasal legal:pasalHasPasalVersion ?pasalVersion .
    } GROUP BY ?pasal
  }
  ?x legal:partOf* ?latestPasalVersion .
  ?x legal:ayatHasKey 1 .
  ?x legal:ayatHasRawText ?text .
} LIMIT 3
```

result:
|0||
|-|-|
|x|http://example.org/legal/document/uu/2020/11/pasal/0002/version/20201102/ayat/0001|
|text|Undang-Undang ini diselenggarakan berdasarkan asas:\na. pemerataan hak,\nb. kepastian hukum:\nc. kemudahan berusaha:\nd. kebersamaan: dan\ne. kemandirian.\n|

# Query_004

query:

```sparql
# Which are the articles of Chapter 2 (Bab 2) of Omnibus Law?
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?pasal ?text WHERE {
  ?bab legal:partOf+ <http://example.org/legal/document/uu/2020/11>.
  ?bab legal:babHasKey 2 .
  ?pasal legal:partOf+ ?bab .
  ?pasal legal:pasalHasPasalVersion ?pasalVersion .
  ?pasalVersion legal:pasalVersionHasRawText ?text
} LIMIT 3
```

result:
|0||
|-|-|
|pasal|http://example.org/legal/document/uu/2020/11/pasal/0004|
|text|Dalam rangka mencapai tujuan sebagaimana dimaksud dalam Pasal 3, ruang lingkup Undang-Undang ini mengatur kebijakan strategis Cipta Kerja yang meliputi:\na. peningkatan ekosistem investasi dan kegiatan berusaha,\nb. ketenagakerjaan,\nc. kemudahan, pelindungan, serta pemberdayaan koperasi dan UMK-M,\nd. kemudahan berusaha:\ne. dukungan riset dan inovasi,\nf. pengadaan tanah,\ng. kawasan ekonomi:\nh. investasi Pemerintah Pusat dan percepatan proyek strategis nasional, IX R Ii. pelaksanaan administrasi pemerintahan: dan J. pengenaan sanksi.\n|

|1||
|-|-|
|pasal|http://example.org/legal/document/uu/2020/11/pasal/0005|
|text|Ruang lingkup sebagaimana dimaksud dalam Pasal 4 meliputi bidang hukum yang diatur dalam undang-undang terkait.|

|2||
|-|-|
|pasal|http://example.org/legal/document/uu/2020/11/pasal/0003|
|text|Undang-Undang ini dibentuk dengan tujuan untuk:\na. menciptakan dan meningkatkan lapangan kerja dengan memberikan kemudahan, pelindungan, dan pemberdayaan terhadap koperasi dan UMK-M serta industri dan perdagangan nasional sebagai upaya untuk dapat menyerap tenaga kerja Indonesia yang seluas-luasnya dengan tetap memperhatikan keseimbangan dan kemajuan antardaerah dalam kesatuan ekonomi nasional,\nb. menjamin setiap warga negara memperoleh pekerjaan, serta mendapat imbalan dan perlakuan yang adil dan layak dalam hubungan kerja,\nc. melakukan penyesuaian berbagai aspek pengaturan yang berkaitan dengan keberpihakan, penguatan, dan perlindungan bagi koperasi dan UMK-M serta industri nasional: dan\nd. melakukan penyesuaian berbagai aspek pengaturan yang berkaitan dengan peningkatan ekosistem investasi, kemudahan dan percepatan proyek strategis nasional yang berorientasi pada kepentingan nasional yang berlandaskan pada ilmu pengetahuan dan teknologi nasional dengan berpedoman pada haluan ideologi Pancasila.\n|

# Query_004_complete

query:

```sparql
# Which are the articles of Chapter 2 (Bab 2) of Omnibus Law?
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?pasal ?text WHERE {
  {
    SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
      ?bab legal:partOf+ <http://example.org/legal/document/uu/2020/11>.
      ?bab legal:babHasKey 2 .
      ?pasal legal:partOf+ ?bab .
      ?pasal legal:pasalHasPasalVersion ?pasalVersion .
    } GROUP BY ?pasal
  }
  ?latestPasalVersion legal:pasalVersionHasRawText ?text
} LIMIT 3
```

result:
|0||
|-|-|
|pasal|http://example.org/legal/document/uu/2020/11/pasal/0005|
|text|Ruang lingkup sebagaimana dimaksud dalam Pasal 4 meliputi bidang hukum yang diatur dalam undang-undang terkait.|

|1||
|-|-|
|pasal|http://example.org/legal/document/uu/2020/11/pasal/0003|
|text|Undang-Undang ini dibentuk dengan tujuan untuk:\na. menciptakan dan meningkatkan lapangan kerja dengan memberikan kemudahan, pelindungan, dan pemberdayaan terhadap koperasi dan UMK-M serta industri dan perdagangan nasional sebagai upaya untuk dapat menyerap tenaga kerja Indonesia yang seluas-luasnya dengan tetap memperhatikan keseimbangan dan kemajuan antardaerah dalam kesatuan ekonomi nasional,\nb. menjamin setiap warga negara memperoleh pekerjaan, serta mendapat imbalan dan perlakuan yang adil dan layak dalam hubungan kerja,\nc. melakukan penyesuaian berbagai aspek pengaturan yang berkaitan dengan keberpihakan, penguatan, dan perlindungan bagi koperasi dan UMK-M serta industri nasional: dan\nd. melakukan penyesuaian berbagai aspek pengaturan yang berkaitan dengan peningkatan ekosistem investasi, kemudahan dan percepatan proyek strategis nasional yang berorientasi pada kepentingan nasional yang berlandaskan pada ilmu pengetahuan dan teknologi nasional dengan berpedoman pada haluan ideologi Pancasila.\n|

|2||
|-|-|
|pasal|http://example.org/legal/document/uu/2020/11/pasal/0004|
|text|Dalam rangka mencapai tujuan sebagaimana dimaksud dalam Pasal 3, ruang lingkup Undang-Undang ini mengatur kebijakan strategis Cipta Kerja yang meliputi:\na. peningkatan ekosistem investasi dan kegiatan berusaha,\nb. ketenagakerjaan,\nc. kemudahan, pelindungan, serta pemberdayaan koperasi dan UMK-M,\nd. kemudahan berusaha:\ne. dukungan riset dan inovasi,\nf. pengadaan tanah,\ng. kawasan ekonomi:\nh. investasi Pemerintah Pusat dan percepatan proyek strategis nasional, IX R Ii. pelaksanaan administrasi pemerintahan: dan J. pengenaan sanksi.\n|

# Query_005

query:

```sparql
# Get subsections (= ayat) containing "kompensasi" and "buruh" that are added by Omnibus Law into other laws
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?ayat ?text WHERE {
  ?insertingPoint legal:partOf+ <http://example.org/legal/document/uu/2020/11> .
  ?insertingPoint legal:pointInsertPasalVersion ?insertedPasalVersion .
  ?ayat legal:partOf+ ?insertedPasalVersion .
  ?ayat legal:ayatHasRawText ?text
  FILTER REGEX(str(?text), "kompensasi")
  FILTER REGEX(str(?text), "buruh")
} LIMIT 3
```

result:
|0||
|-|-|
|ayat|http://example.org/legal/document/uu/2003/13/pasal/0061A/version/20201102/ayat/0002|
|text|Uang kompensasi sebagaimana dimaksud pada ayat (1) diberikan kepada pekerja/buruh sesuai dengan masa kerja pekerja/buruh di perusahaan yang bersangkutan.|

|1||
|-|-|
|ayat|http://example.org/legal/document/uu/2003/13/pasal/0061A/version/20201102/ayat/0001|
|text|Dalam hal perjanjian kerja waktu tertentu berakhir sebagaimana dimaksud dalam Pasal 61 ayat (1) huruf b dan huruf c, pengusaha wajib memberikan uang kompensasi kepada pekerja/ buruh.|

# Query_005_complete

query:

```sparql
# Get subsections (= ayat) containing "kompensasi" and "buruh" that are added by Omnibus Law into other laws
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?ayat ?text WHERE {
  {
    SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
      ?pasal legal:partOf+ <http://example.org/legal/document/uu/2020/11>.
      ?pasal legal:pasalHasPasalVersion ?pasalVersion .
    } GROUP BY ?pasal
  }
  ?insertingPoint legal:partOf+ ?latestPasalVersion .
  ?insertingPoint legal:pointInsertPasalVersion ?insertedPasalVersion .
  ?ayat legal:partOf+ ?insertedPasalVersion .
  ?ayat legal:ayatHasRawText ?text
  FILTER REGEX(str(?text), "kompensasi")
  FILTER REGEX(str(?text), "buruh")
} LIMIT 3

```

result:
|0||
|-|-|
|ayat|http://example.org/legal/document/uu/2003/13/pasal/0061A/version/20201102/ayat/0002|
|text|Uang kompensasi sebagaimana dimaksud pada ayat (1) diberikan kepada pekerja/buruh sesuai dengan masa kerja pekerja/buruh di perusahaan yang bersangkutan.|

|1||
|-|-|
|ayat|http://example.org/legal/document/uu/2003/13/pasal/0061A/version/20201102/ayat/0001|
|text|Dalam hal perjanjian kerja waktu tertentu berakhir sebagaimana dimaksud dalam Pasal 61 ayat (1) huruf b dan huruf c, pengusaha wajib memberikan uang kompensasi kepada pekerja/ buruh.|

# Query_006

query:

```sparql
# Retrieve components of Omnibus Law that insert (= menyisipkan) articles (= pasal) into Labor Law (UU Ketenagakerjaan) and show the textual content of the articles
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?insertingPoint ?insertedPasalVersion ?text WHERE {
  ?insertingPoint legal:partOf+ <http://example.org/legal/document/uu/2020/11>.
  ?insertingPoint legal:pointInsertPasalVersion ?insertedPasalVersion .
  ?insertedPasalVersion legal:partOf+ <http://example.org/legal/document/uu/2003/13> .
  ?insertedPasalVersion legal:pasalVersionHasRawText ?text .
}
LIMIT 3

```

result:
|0||
|-|-|
|insertingPoint|http://example.org/legal/document/uu/2020/11/pasal/0081/version/20201102/point/0068|
|insertedPasalVersion|http://example.org/legal/document/uu/2003/13/pasal/0191A/version/20201102|
|text|\na. untuk pertama kali upah minimum yang berlaku, yaitu upah minimum yang telah ditetapkan berdasarkan peraturan pelaksanaan Undang-Undang Nomor 13 Tahun 2003 tentang Ketenagakerjaan yang mengatur mengenai pengupahan.\nb. bagi perusahaan yang telah memberikan upah lebih tinggi dari upah minimum yang ditetapkan sebelum Undang-Undang ini, pengusaha dilarang mengurangi atau menurunkan upah.\n|

|1||
|-|-|
|insertingPoint|http://example.org/legal/document/uu/2020/11/pasal/0081/version/20201102/point/0046|
|insertedPasalVersion|http://example.org/legal/document/uu/2003/13/pasal/0157A/version/20201102|
|text|(1). Selama penyelesaian perselisihan hubungan industrial, pengusaha dan pekerja/ buruh harus tetap melaksanakan kewajibannya.\n(2). Pengusaha dapat melakukan tindakan skorsing kepada pekerja/buruh yang sedang dalam proses pemutusan hubungan kerja dengan tetap membayar upah beserta hak lainnya yang biasa diterima pekerja/ buruh.\n(3). Pelaksanaan kewajiban sebagaimana dimaksud pada ayat (l) dilakukan sampai dengan selesainya proses penyelesaian perselisihan hubungan industrial sesuai tingkatannya. an » 8 RA|

|2||
|-|-|
|insertingPoint|http://example.org/legal/document/uu/2020/11/pasal/0081/version/20201102/point/0042|
|insertedPasalVersion|http://example.org/legal/document/uu/2003/13/pasal/0154A/version/20201102|
|text|(1). Pemutusan hubungan kerja dapat terjadi karena alasan:\na. perusahaan melakukan penggabungan, peleburan, pengambilalihan, atau pemisahan perusahaan dan pekerja/buruh tidak bersedia melanjutkan hubungan kerja atau pengusaha tidak bersedia menerima pekerja/ buruh,\nb. perusahaan melakukan efisiensi diikuti dengan penutupan perusahaan atau tidak diikuti dengan penutupan perusahaan yang disebabkan perusahaan mengalami kerugian,\nc. perusahaan tutup yang disebabkan karena perusahaan mengalami kerugian secara terus menerus selama 2 (dua) tahun,\nd. perusahaan tutup yang disebabkan keadaan memaksa (force majeur).\ne. perusahaan dalam keadaan penundaan kewajiban pembayaran utang,\nf. perusahaan pailit,\ng. adanya permohonan pemutusan hubungan kerja yang diajukan oleh pekerja/buruh dengan alasan pengusaha melakukan perbuatan sebagai berikut:\n1. menganiaya, menghina secara kasar atau mengancam pekerja/ buruh, .554 -\n2. membujuk dan/atau menyuruh pekerja/buruh untuk melakukan perbuatan yang bertentangan dengan peraturan perundang-undangan,\n3. tidak membayar upah tepat pada waktu yang telah ditentukan selama 3 (tiga) bulan berturut-turut atau lebih, meskipun pengusaha membayar upah secara tepat waktu sesudah itu:\n4. tidak melakukan kewajiban yang telah dijanjikan kepada pekerja/ buruh,\n5. memerintahkan pekerja/ buruh untuk melaksanakan pekerjaan di luar yang diperjanjikan, atau\n6. memberikan pekerjaan yang membahayakan jiwa, keselamatan, kesehatan, dan kesusilaan pekerja/buruh sedangkan pekerjaan tersebut tidak dicantumkan pada perjanjian kerja,\n\nh. adanya putusan lembaga penyelesaian perselisihan hubungan industrial yang menyatakan pengusaha tidak melakukan perbuatan sebagaimana dimaksud pada huruf g terhadap permohonan yang diajukan oleh pekerja/buruh dan pengusaha memutuskan untuk melakukan pemutusan hubungan kerja, 1 pekerja/buruh mengundurkan diri atas kemauan sendiri dan harus memenuhi syarat:\n1. mengajukan permohonan pengunduran diri secara tertulis selambat-lambatnya 30 (tiga puluh) hari sebelum tanggal mulai pengunduran diri,\n2. tidak terikat dalam ikatan dinas, dan\n3. tetap melaksanakan kewajibannya sampai tanggal mulai pengunduran diri, » REPUBLIK INDONESIA j. pekerja/buruh mangkir selama 5 (lima) hari kerja atau lebih berturut-turut tanpa keterangan secara tertulis yang dilengkapi dengan bukti yang sah dan telah dipanggil oleh pengusaha 2 (dua) kali secara patut dan tertulis, k. pekerja/buruh melakukan pelanggaran ketentuan yang diatur dalam perjanjian kerja, peraturan perusahaan, atau perjanjian kerja bersama dan sebelumnya telah diberikan surat peringatan pertama, kedua, dan ketiga secara berturut-turut masing-masing berlaku untuk paling lama 6 (enam) bulan kecuali ditetapkan lain dalam perjanjian kerja, peraturan perusahaan, atau perjanjian kerja bersama,\n1. pekerja/buruh tidak dapat melakukan pekerjaan selama 6 (enam) bulan akibat ditahan pihak yang berwajib karena diduga melakukan tindak pidana, m. pekerja/buruh mengalami sakit berkepanjangan atau cacat akibat kecelakaan kerja dan tidak dapat melakukan pekerjaannya setelah melampaui batas 12 (dua belas) bulan, n. pekerja/buruh memasuki usia pensiun, atau Oo. pekerja/buruh meninggal dunia.\n\n\n\n(2). Selain alasan pemutusan hubungan kerja sebagaimana dimaksud pada ayat (1), dapat ditetapkan alasan pemutusan hubungan kerja lainnya dalam perjanjian kerja, peraturan perusahaan, atau perjanjian kerja bersama sebagaimana dimaksud dalam Pasal 61 ayat (1).\n(3). Ketentuan lebih lanjut mengenai tata cara pemutusan hubungan kerja diatur dalam Peraturan Pemerintah.|

# Query_006_complete

query:

```sparql
# Retrieve components of Omnibus Law that insert (= menyisipkan) articles (= pasal) into Labor Law (UU Ketenagakerjaan) and show the textual content of the articles
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?insertingPoint ?insertedPasalVersion ?text WHERE {
  {
    SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
      ?pasal legal:partOf+ <http://example.org/legal/document/uu/2020/11>.
      ?pasal legal:pasalHasPasalVersion ?pasalVersion .
    } GROUP BY ?pasal
  }
  ?insertingPoint legal:partOf+ ?latestPasalVersion .
  ?insertingPoint legal:pointInsertPasalVersion ?insertedPasalVersion .
  ?insertedPasalVersion legal:partOf+ <http://example.org/legal/document/uu/2003/13> .
  ?insertedPasalVersion legal:pasalVersionHasRawText ?text .
}
LIMIT 3

```

result:
|0||
|-|-|
|insertingPoint|http://example.org/legal/document/uu/2020/11/pasal/0081/version/20201102/point/0068|
|insertedPasalVersion|http://example.org/legal/document/uu/2003/13/pasal/0191A/version/20201102|
|text|\na. untuk pertama kali upah minimum yang berlaku, yaitu upah minimum yang telah ditetapkan berdasarkan peraturan pelaksanaan Undang-Undang Nomor 13 Tahun 2003 tentang Ketenagakerjaan yang mengatur mengenai pengupahan.\nb. bagi perusahaan yang telah memberikan upah lebih tinggi dari upah minimum yang ditetapkan sebelum Undang-Undang ini, pengusaha dilarang mengurangi atau menurunkan upah.\n|

|1||
|-|-|
|insertingPoint|http://example.org/legal/document/uu/2020/11/pasal/0081/version/20201102/point/0046|
|insertedPasalVersion|http://example.org/legal/document/uu/2003/13/pasal/0157A/version/20201102|
|text|(1). Selama penyelesaian perselisihan hubungan industrial, pengusaha dan pekerja/ buruh harus tetap melaksanakan kewajibannya.\n(2). Pengusaha dapat melakukan tindakan skorsing kepada pekerja/buruh yang sedang dalam proses pemutusan hubungan kerja dengan tetap membayar upah beserta hak lainnya yang biasa diterima pekerja/ buruh.\n(3). Pelaksanaan kewajiban sebagaimana dimaksud pada ayat (l) dilakukan sampai dengan selesainya proses penyelesaian perselisihan hubungan industrial sesuai tingkatannya. an » 8 RA|

|2||
|-|-|
|insertingPoint|http://example.org/legal/document/uu/2020/11/pasal/0081/version/20201102/point/0042|
|insertedPasalVersion|http://example.org/legal/document/uu/2003/13/pasal/0154A/version/20201102|
|text|(1). Pemutusan hubungan kerja dapat terjadi karena alasan:\na. perusahaan melakukan penggabungan, peleburan, pengambilalihan, atau pemisahan perusahaan dan pekerja/buruh tidak bersedia melanjutkan hubungan kerja atau pengusaha tidak bersedia menerima pekerja/ buruh,\nb. perusahaan melakukan efisiensi diikuti dengan penutupan perusahaan atau tidak diikuti dengan penutupan perusahaan yang disebabkan perusahaan mengalami kerugian,\nc. perusahaan tutup yang disebabkan karena perusahaan mengalami kerugian secara terus menerus selama 2 (dua) tahun,\nd. perusahaan tutup yang disebabkan keadaan memaksa (force majeur).\ne. perusahaan dalam keadaan penundaan kewajiban pembayaran utang,\nf. perusahaan pailit,\ng. adanya permohonan pemutusan hubungan kerja yang diajukan oleh pekerja/buruh dengan alasan pengusaha melakukan perbuatan sebagai berikut:\n1. menganiaya, menghina secara kasar atau mengancam pekerja/ buruh, .554 -\n2. membujuk dan/atau menyuruh pekerja/buruh untuk melakukan perbuatan yang bertentangan dengan peraturan perundang-undangan,\n3. tidak membayar upah tepat pada waktu yang telah ditentukan selama 3 (tiga) bulan berturut-turut atau lebih, meskipun pengusaha membayar upah secara tepat waktu sesudah itu:\n4. tidak melakukan kewajiban yang telah dijanjikan kepada pekerja/ buruh,\n5. memerintahkan pekerja/ buruh untuk melaksanakan pekerjaan di luar yang diperjanjikan, atau\n6. memberikan pekerjaan yang membahayakan jiwa, keselamatan, kesehatan, dan kesusilaan pekerja/buruh sedangkan pekerjaan tersebut tidak dicantumkan pada perjanjian kerja,\n\nh. adanya putusan lembaga penyelesaian perselisihan hubungan industrial yang menyatakan pengusaha tidak melakukan perbuatan sebagaimana dimaksud pada huruf g terhadap permohonan yang diajukan oleh pekerja/buruh dan pengusaha memutuskan untuk melakukan pemutusan hubungan kerja, 1 pekerja/buruh mengundurkan diri atas kemauan sendiri dan harus memenuhi syarat:\n1. mengajukan permohonan pengunduran diri secara tertulis selambat-lambatnya 30 (tiga puluh) hari sebelum tanggal mulai pengunduran diri,\n2. tidak terikat dalam ikatan dinas, dan\n3. tetap melaksanakan kewajibannya sampai tanggal mulai pengunduran diri, » REPUBLIK INDONESIA j. pekerja/buruh mangkir selama 5 (lima) hari kerja atau lebih berturut-turut tanpa keterangan secara tertulis yang dilengkapi dengan bukti yang sah dan telah dipanggil oleh pengusaha 2 (dua) kali secara patut dan tertulis, k. pekerja/buruh melakukan pelanggaran ketentuan yang diatur dalam perjanjian kerja, peraturan perusahaan, atau perjanjian kerja bersama dan sebelumnya telah diberikan surat peringatan pertama, kedua, dan ketiga secara berturut-turut masing-masing berlaku untuk paling lama 6 (enam) bulan kecuali ditetapkan lain dalam perjanjian kerja, peraturan perusahaan, atau perjanjian kerja bersama,\n1. pekerja/buruh tidak dapat melakukan pekerjaan selama 6 (enam) bulan akibat ditahan pihak yang berwajib karena diduga melakukan tindak pidana, m. pekerja/buruh mengalami sakit berkepanjangan atau cacat akibat kecelakaan kerja dan tidak dapat melakukan pekerjaannya setelah melampaui batas 12 (dua belas) bulan, n. pekerja/buruh memasuki usia pensiun, atau Oo. pekerja/buruh meninggal dunia.\n\n\n\n(2). Selain alasan pemutusan hubungan kerja sebagaimana dimaksud pada ayat (1), dapat ditetapkan alasan pemutusan hubungan kerja lainnya dalam perjanjian kerja, peraturan perusahaan, atau perjanjian kerja bersama sebagaimana dimaksud dalam Pasal 61 ayat (1).\n(3). Ketentuan lebih lanjut mengenai tata cara pemutusan hubungan kerja diatur dalam Peraturan Pemerintah.|

# Query_007

query:

```sparql
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?insertingPoint ?insertedPasal ?version ?text WHERE {
  ?insertingPoint legal:partOf+ <http://example.org/legal/document/uu/2020/11>.
  ?insertingPoint legal:pointInsertPasalVersion ?insertedPasalVersion .
  ?insertedPasalVersion legal:partOf+ <http://example.org/legal/document/uu/2003/13> .
  ?insertedPasal legal:pasalHasPasalVersion ?insertedPasalVersion .
  ?insertedPasal legal:pasalHasPasalVersion ?allPasalVersion .
  ?allPasalVersion legal:pasalVersionHasRawText ?text .
  ?allPasalVersion legal:pasalVersionHasCreatedTimeEpoch ?version .
}
LIMIT 3

```

result:


# Query_007_complete

query:

```sparql
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?insertingPoint ?insertedPasal ?version ?text WHERE {
  {
    SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
      ?pasal legal:partOf+ <http://example.org/legal/document/uu/2020/11>.
      ?pasal legal:pasalHasPasalVersion ?pasalVersion .
    } GROUP BY ?pasal
  }
  ?insertingPoint legal:partOf+ ?latestPasalVersion .
  ?insertingPoint legal:pointInsertPasalVersion ?insertedPasalVersion .
  ?insertedPasalVersion legal:partOf+ <http://example.org/legal/document/uu/2003/13> .
  ?insertedPasal legal:pasalHasPasalVersion ?insertedPasalVersion .
  ?insertedPasal legal:pasalHasPasalVersion ?allPasalVersion .
  ?allPasalVersion legal:pasalVersionHasRawText ?text .
  ?allPasalVersion legal:pasalVersionHasCreatedTimeEpoch ?version .
}
LIMIT 3

```

result:


# Query_008

query:

```sparql
# Give me components of Omnibus Law that remove (= menghapus) articles in Labor Law and show the textual content of the removed articles
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?deletingPoint ?deletedPasal ?version ?text WHERE {
  ?deletingPoint legal:partOf+ <http://example.org/legal/document/uu/2020/11>.
  ?deletingPoint legal:pointDeletePasalVersion ?deletedPasalVersion .
  ?deletedPasal legal:pasalHasPasalVersion ?deletedPasalVersion .
  <http://example.org/legal/document/uu/2003/13> legal:documentHasPasal ?deletedPasal .
  ?deletedPasal legal:pasalHasPasalVersion ?allPasalVersion .
  ?allPasalVersion legal:pasalVersionHasRawText ?text .
  ?allPasalVersion legal:pasalVersionHasCreatedTimeEpoch ?version .
}
LIMIT 3

```

result:


# Query_008_complete

query:

```sparql
# Give me components of Omnibus Law that remove (= menghapus) articles in Labor Law and show the textual content of the removed articles
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?deletingPoint ?deletedPasal ?version ?text WHERE {
  {
    SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
      ?pasal legal:partOf+ <http://example.org/legal/document/uu/2020/11>.
      ?pasal legal:pasalHasPasalVersion ?pasalVersion .
    } GROUP BY ?pasal
  }
  ?deletingPoint legal:partOf+ ?latestPasalVersion .
  ?deletingPoint legal:pointDeletePasalVersion ?deletedPasalVersion .
  ?deletedPasal legal:pasalHasPasalVersion ?deletedPasalVersion .
  <http://example.org/legal/document/uu/2003/13> legal:documentHasPasal ?deletedPasal .
  ?deletedPasal legal:pasalHasPasalVersion ?allPasalVersion .
  ?allPasalVersion legal:pasalVersionHasRawText ?text .
  ?allPasalVersion legal:pasalVersionHasCreatedTimeEpoch ?version .
}
LIMIT 3

```

result:


# Query_010

query:

```sparql
# How many are insertions, amendments, and removals of other laws in Omnibus Law?
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?type (COUNT(*) AS ?jumlah) WHERE {
  {
    ?point legal:partOf+ <http://example.org/legal/document/uu/2020/11> .
    ?point legal:pointDeletePasalVersion ?pasal .
    BIND("menghapus" AS ?type)
  } UNION {
    ?point legal:partOf+ <http://example.org/legal/document/uu/2020/11> .
    ?point legal:pointInsertPasalVersion ?pasal .
    BIND("menyisipkan" AS ?type)
  } UNION {
    ?point legal:partOf+ <http://example.org/legal/document/uu/2020/11> .
    ?point legal:pointUpdatePasalVersion ?pasal .
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

# Query_010_complete

query:

```sparql
# How many are insertions, amendments, and removals of other laws in Omnibus Law?
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?type (COUNT(*) AS ?jumlah) WHERE {
  {
    {
      SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
        ?pasal legal:partOf+ <http://example.org/legal/document/uu/2020/11>.
        ?pasal legal:pasalHasPasalVersion ?pasalVersion .
      } GROUP BY ?pasal
    }
    ?deletingPoint legal:partOf+ ?latestPasalVersion .
    ?deletingPoint legal:pointDeletePasalVersion ?deletedPasalVersion .
    BIND("menghapus" AS ?type)
  }
  UNION {
    {
      SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
        ?pasal legal:partOf+ <http://example.org/legal/document/uu/2020/11>.
        ?pasal legal:pasalHasPasalVersion ?pasalVersion .
      } GROUP BY ?pasal
    }
    ?deletingPoint legal:partOf+ ?latestPasalVersion .
    ?deletingPoint legal:pointInsertPasalVersion ?deletedPasalVersion .
    BIND("menyisipkan" AS ?type)
  } UNION {
    {
      SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
        ?pasal legal:partOf+ <http://example.org/legal/document/uu/2020/11>.
        ?pasal legal:pasalHasPasalVersion ?pasalVersion .
      } GROUP BY ?pasal
    }
    ?deletingPoint legal:partOf+ ?latestPasalVersion .
    ?deletingPoint legal:pointUpdatePasalVersion ?deletedPasalVersion .
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
      ?pasal legal:partOf+ <http://example.org/legal/document/uu/2003/13>.
      ?pasal legal:pasalHasPasalVersion ?pasalVersion .
    } GROUP BY ?pasal
  }
}
LIMIT 3
```

result:
|0||
|-|-|
|latestPasalVersion|http://example.org/legal/document/uu/2003/13/pasal/0175/version/20030325|

|1||
|-|-|
|latestPasalVersion|http://example.org/legal/document/uu/2003/13/pasal/0066/version/20201102|

|2||
|-|-|
|latestPasalVersion|http://example.org/legal/document/uu/2003/13/pasal/0078/version/20201102|

# Query_012

query:

```sparql
# Get articles of Omnibus Law that are not about updating (= insertions/amendments/removals) other laws
PREFIX legal: <http://example.org/legal/ontology/>

SELECT DISTINCT ?pasalVersion ?text WHERE {
  ?pasalVersion legal:partOf+ <http://example.org/legal/document/uu/2020/11>.
  ?pasalVersion legal:pasalVersionHasRawText ?text .
  FILTER NOT EXISTS {
    ?point legal:partOf+ ?pasalVersion . 
    ?point a legal:Point .
    { ?point legal:pointUpdatePasalVersion ?amendedPasalVersion }
    UNION { ?point legal:pointInsertPasalVersion ?amendedPasalVersion } 
    UNION { ?point legal:pointDeletePasalVersion ?amendedPasalVersion }
  }
}
LIMIT 3
```

result:
|0||
|-|-|
|pasalVersion|http://example.org/legal/document/uu/2020/11/pasal/0186/version/20201102|
|text|Undang-Undang ini mulai berlaku pada tanggal diundangkan. Agar setiap orang mengetahuinya, memerintahkan pengundangan Undang-Undang ini dengan penempatannya dalam Lembaran Negara Republik Indonesia.|

|1||
|-|-|
|pasalVersion|http://example.org/legal/document/uu/2020/11/pasal/0185/version/20201102|
|text|Pada saat Undang-Undang ini mulai berlaku:\na. Peraturan pelaksanaan dari Undang-Undang ini wajib ditetapkan paling lama 3 (tiga) bulan, dan\nb. Semua peraturan pelaksanaan dari Undang-Undang yang telah diubah oleh Undang-Undang ini dinyatakan tetap berlaku sepanjang tidak bertentangan dengan Undang- Undang ini dan wajib disesuaikan paling lama 3 (tiga) bulan.\n|

|2||
|-|-|
|pasalVersion|http://example.org/legal/document/uu/2020/11/pasal/0184/version/20201102|
|text|Pada saat Undang-Undang ini mulai berlaku:\na. Perizinan Berusaha atau izin sektor yang sudah terbit masih tetap berlaku sampai dengan berakhirnya Perizinan Berusaha,\nb. Perizinan Berusaha dan/atau izin sektor yang sudah terbit sebelum berlakunya Undang-Undang ini dapat berlaku sesuai dengan Undang-Undang ini, dan\nc. Perizinan Berusaha yang sedang dalam proses permohonan disesuaikan dengan ketentuan dalam Undang-Undang ini.\n|

# Query_012_complete

query:

```sparql
# Get articles of Omnibus Law that are not about updating (= insertions/amendments/removals) other laws
PREFIX legal: <http://example.org/legal/ontology/>

SELECT DISTINCT ?pasalVersion ?text WHERE {
  ?pasalVersion legal:partOf+ <http://example.org/legal/document/uu/2020/11>.
  ?pasalVersion legal:pasalVersionHasRawText ?text .
  FILTER NOT EXISTS {
    ?point legal:partOf+ ?pasalVersion . 
    ?point a legal:Point .
    { ?point legal:pointUpdatePasalVersion ?amendedPasalVersion }
    UNION { ?point legal:pointInsertPasalVersion ?amendedPasalVersion } 
    UNION { ?point legal:pointDeletePasalVersion ?amendedPasalVersion }
  }
}
LIMIT 3

```

result:
|0||
|-|-|
|pasalVersion|http://example.org/legal/document/uu/2020/11/pasal/0186/version/20201102|
|text|Undang-Undang ini mulai berlaku pada tanggal diundangkan. Agar setiap orang mengetahuinya, memerintahkan pengundangan Undang-Undang ini dengan penempatannya dalam Lembaran Negara Republik Indonesia.|

|1||
|-|-|
|pasalVersion|http://example.org/legal/document/uu/2020/11/pasal/0185/version/20201102|
|text|Pada saat Undang-Undang ini mulai berlaku:\na. Peraturan pelaksanaan dari Undang-Undang ini wajib ditetapkan paling lama 3 (tiga) bulan, dan\nb. Semua peraturan pelaksanaan dari Undang-Undang yang telah diubah oleh Undang-Undang ini dinyatakan tetap berlaku sepanjang tidak bertentangan dengan Undang- Undang ini dan wajib disesuaikan paling lama 3 (tiga) bulan.\n|

|2||
|-|-|
|pasalVersion|http://example.org/legal/document/uu/2020/11/pasal/0184/version/20201102|
|text|Pada saat Undang-Undang ini mulai berlaku:\na. Perizinan Berusaha atau izin sektor yang sudah terbit masih tetap berlaku sampai dengan berakhirnya Perizinan Berusaha,\nb. Perizinan Berusaha dan/atau izin sektor yang sudah terbit sebelum berlakunya Undang-Undang ini dapat berlaku sesuai dengan Undang-Undang ini, dan\nc. Perizinan Berusaha yang sedang dalam proses permohonan disesuaikan dengan ketentuan dalam Undang-Undang ini.\n|

# Query_013

query:

```sparql
# Give me articles (= pasal) of Omnibus Law removing articles of laws legalized later than the year 2001
PREFIX legal: <http://example.org/legal/ontology/>

SELECT DISTINCT ?pasalVersion WHERE {
  ?point legal:partOf+ <http://example.org/legal/document/uu/2020/11>.
  ?point legal:pointDeletePasalVersion ?pasalVersion .
  ?pasalVersion legal:partOf+ ?document .
  ?document legal:documentHasYear ?year
  FILTER(?year > 2001)
}
LIMIT 3

```

result:


# Query_014

query:

```sparql
# Retrieve all subsections inserted by Omnibus Law into other laws and *optionally* the citations occurring in those subsections
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?ayat ?text ?citation WHERE {
  ?insertingPoint legal:partOf+ <http://example.org/legal/document/uu/2020/11>.
  ?insertingPoint legal:pointInsertPasalVersion ?insertedPasalVersion .
  ?ayat legal:partOf+ ?insertedPasalVersion .
  ?ayat legal:ayatHasRawText ?text .
  ?ayat legal:ayatHasText ?textRef .
  OPTIONAL {?textRef legal:textReferencesLegal ?citation}
}
LIMIT 3
```

result:
|0||
|-|-|
|ayat|http://example.org/legal/document/uu/2015/9/pasal/0292A/version/20201102/ayat/0002|
|text|Pemberian anggaran sebagaimana dimaksud pada ayat (1) diatur dalam Peraturan Pemerintah.|

|1||
|-|-|
|ayat|http://example.org/legal/document/uu/2015/9/pasal/0292A/version/20201102/ayat/0001|
|text|Dalam hal penyederhanaan perizinan dan pelaksanaan Perizinan Berusaha oleh Pemerintah Daerah sebagaimana dimaksud dalam Undang- Undang ini menyebabkan berkurangnya pendapatan asli daerah, Pemerintah Pusat memberikan dukungan insentif anggaran.|

|2||
|-|-|
|ayat|http://example.org/legal/document/uu/2014/30/pasal/0039A/version/20201102/ayat/0003|
|text|Ketentuan mengenai jenis, bentuk, dan mekanisme pembinaan dan pengawasan atas Izin, Standar, Dispensasi, dan/atau Konsesi yang dapat dilakukan oleh profesi sebagaimana dimaksud pada ayat (2) diatur dalam Peraturan Presiden.|

# Query_017

query:

```sparql
# Which law has the most number of updates (= insertions/amendments/removals) by Omnibus Law? For that law, show the most recent version taking into account the updates by Omnibus Law!
PREFIX legal: <http://example.org/legal/ontology/>
PREFIX owl: <http://www.w3.org/2002/07/owl#>

SELECT ?law ?numOfUpdates ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
  {
    SELECT ?law (COUNT(*) AS ?numOfUpdates) WHERE {
      ?point legal:partOf+ <http://example.org/legal/document/uu/2020/11> .
      { ?point legal:pointUpdatePasalVersion ?amendedPasalVersion }
      UNION { ?point legal:pointInsertPasalVersion ?amendedPasalVersion }
      UNION { ?point legal:pointDeletePasalVersion ?amendedPasalVersion }
      ?amendedPasalVersion legal:partOf+ ?law .
      ?law a legal:Document .
    } GROUP BY ?law
  }
  ?pasal legal:partOf+ ?law .
  ?pasal legal:pasalHasPasalVersion ?pasalVersion .
}
GROUP BY ?law ?numOfUpdates ?pasal
ORDER BY DESC (?numOfUpdates)
LIMIT 3

```

result:
|0||
|-|-|
|law|http://example.org/legal/document/uu/2009/1|
|numOfUpdates|90|
|pasal|http://example.org/legal/document/uu/2009/1/pasal/0001|
|latestPasalVersion|http://example.org/legal/document/uu/2009/1/pasal/0001/version/20090112|

|1||
|-|-|
|law|http://example.org/legal/document/uu/2009/1|
|numOfUpdates|90|
|pasal|http://example.org/legal/document/uu/2009/1/pasal/0002|
|latestPasalVersion|http://example.org/legal/document/uu/2009/1/pasal/0002/version/20090112|

|2||
|-|-|
|law|http://example.org/legal/document/uu/2009/1|
|numOfUpdates|90|
|pasal|http://example.org/legal/document/uu/2009/1/pasal/0003|
|latestPasalVersion|http://example.org/legal/document/uu/2009/1/pasal/0003/version/20090112|

# Query_017_complete

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
          ?pasal legal:partOf+ <http://example.org/legal/document/uu/2020/11>.
          ?pasal legal:pasalHasPasalVersion ?pasalVersion .
        } GROUP BY ?pasal
      }
      ?point legal:partOf+ ?latestPasalVersion .
      { ?point legal:pointUpdatePasalVersion ?amendedPasalVersion }
      UNION { ?point legal:pointInsertPasalVersion ?amendedPasalVersion }
      UNION { ?point legal:pointDeletePasalVersion ?amendedPasalVersion }
      ?amendedPasalVersion legal:partOf+ ?law .
      ?law a legal:Document .
    } GROUP BY ?law
  }
  ?pasal legal:partOf+ ?law .
  ?pasal legal:pasalHasPasalVersion ?pasalVersion .
}
GROUP BY ?law ?numOfUpdates ?pasal
ORDER BY DESC (?numOfUpdates)
LIMIT 3

```

result:
|0||
|-|-|
|law|http://example.org/legal/document/uu/2009/1|
|numOfUpdates|90|
|pasal|http://example.org/legal/document/uu/2009/1/pasal/0001|
|latestPasalVersion|http://example.org/legal/document/uu/2009/1/pasal/0001/version/20090112|

|1||
|-|-|
|law|http://example.org/legal/document/uu/2009/1|
|numOfUpdates|90|
|pasal|http://example.org/legal/document/uu/2009/1/pasal/0002|
|latestPasalVersion|http://example.org/legal/document/uu/2009/1/pasal/0002/version/20090112|

|2||
|-|-|
|law|http://example.org/legal/document/uu/2009/1|
|numOfUpdates|90|
|pasal|http://example.org/legal/document/uu/2009/1/pasal/0003|
|latestPasalVersion|http://example.org/legal/document/uu/2009/1/pasal/0003/version/20090112|

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
|s|http://example.org/legal/document/uu/1950/1|
|p|http://example.org/legal/ontology/documentHasDisahkanDate|
|o|1950-05-06|

|1||
|-|-|
|s|http://example.org/legal/document/uu/1950/1|
|p|http://example.org/legal/ontology/documentHasDisahkanJabatanPengesah|
|o|PRESIDEN REPUBLIK-|

|2||
|-|-|
|s|http://example.org/legal/document/uu/1950/1|
|p|http://example.org/legal/ontology/documentHasDisahkanLocation|
|o|Jakarta|

# Query_019

query:

```sparql
# tampilkan 10 legal doc pertama
PREFIX legal: <http://example.org/legal/ontology/>

SELECT * 
WHERE {
  ?legalDoc a legal:Document
} 
ORDER BY ?legalDoc
LIMIT 10
```

result:
|0||
|-|-|
|legalDoc|http://example.org/legal/document/uu/1950/1|

|1||
|-|-|
|legalDoc|http://example.org/legal/document/uu/1950/14|

|2||
|-|-|
|legalDoc|http://example.org/legal/document/uu/1950/15|

|3||
|-|-|
|legalDoc|http://example.org/legal/document/uu/1950/2|

|4||
|-|-|
|legalDoc|http://example.org/legal/document/uu/1950/3|

|5||
|-|-|
|legalDoc|http://example.org/legal/document/uu/1950/4|

|6||
|-|-|
|legalDoc|http://example.org/legal/document/uu/1950/5|

|7||
|-|-|
|legalDoc|http://example.org/legal/document/uu/1950/6|

|8||
|-|-|
|legalDoc|http://example.org/legal/document/uu/1953/10|

|9||
|-|-|
|legalDoc|http://example.org/legal/document/uu/1953/18|

# Query_020

query:

```sparql
# tampilkan semua UU yang disahkan setelah 10 Oktober 2019
PREFIX legal: <http://example.org/legal/ontology/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT *
WHERE {
  ?legalDoc legal:documentHasDisahkanDate ?date .
  FILTER ( ?date >= "2019-10-10"^^xsd:date )
}
ORDER BY ?legalDoc

```

result:
|0||
|-|-|
|legalDoc|http://example.org/legal/document/uu/2019/17|
|date|2019-10-15|

|1||
|-|-|
|legalDoc|http://example.org/legal/document/uu/2019/18|
|date|2019-10-15|

|2||
|-|-|
|legalDoc|http://example.org/legal/document/uu/2019/20|
|date|2019-10-18|

|3||
|-|-|
|legalDoc|http://example.org/legal/document/uu/2019/21|
|date|2019-10-18|

|4||
|-|-|
|legalDoc|http://example.org/legal/document/uu/2019/22|
|date|2019-10-18|

|5||
|-|-|
|legalDoc|http://example.org/legal/document/uu/2019/23|
|date|2019-10-24|

|6||
|-|-|
|legalDoc|http://example.org/legal/document/uu/2019/24|
|date|2019-10-24|

|7||
|-|-|
|legalDoc|http://example.org/legal/document/uu/2020/1|
|date|2020-02-28|

|8||
|-|-|
|legalDoc|http://example.org/legal/document/uu/2020/10|
|date|2020-10-26|

|9||
|-|-|
|legalDoc|http://example.org/legal/document/uu/2020/11|
|date|2020-11-02|

|10||
|-|-|
|legalDoc|http://example.org/legal/document/uu/2020/12|
|date|2020-11-02|

|11||
|-|-|
|legalDoc|http://example.org/legal/document/uu/2020/13|
|date|2020-11-02|

|12||
|-|-|
|legalDoc|http://example.org/legal/document/uu/2020/2|
|date|2020-05-16|

|13||
|-|-|
|legalDoc|http://example.org/legal/document/uu/2020/4|
|date|2020-08-05|

|14||
|-|-|
|legalDoc|http://example.org/legal/document/uu/2020/5|
|date|2020-08-05|

|15||
|-|-|
|legalDoc|http://example.org/legal/document/uu/2020/6|
|date|2020-08-11|

|16||
|-|-|
|legalDoc|http://example.org/legal/document/uu/2020/8|
|date|2020-10-13|

|17||
|-|-|
|legalDoc|http://example.org/legal/document/uu/2020/9|
|date|2020-10-26|

# Query_021

query:

```sparql
# tampilkan legal document beserta yang ditimbangnya (menimbang)
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?doc ?menimbangDoc
WHERE {
  ?doc legal:documentMenimbang ?menimbang .
  ?menimbangText legal:partOf* ?menimbang .
  ?menimbangText legal:textReferencesLegal ?menimbangDoc .
  ?menimbangDoc a legal:Document
}
ORDER BY ?doc
LIMIT 10

```

result:
|0||
|-|-|
|doc|http://example.org/legal/document/uu/2004/11|
|menimbangDoc|http://example.org/legal/document/uu/1986/2|

|1||
|-|-|
|doc|http://example.org/legal/document/uu/2004/12|
|menimbangDoc|http://example.org/legal/document/uu/1986/2|

|2||
|-|-|
|doc|http://example.org/legal/document/uu/2004/13|
|menimbangDoc|http://example.org/legal/document/uu/1986/2|

|3||
|-|-|
|doc|http://example.org/legal/document/uu/2004/14|
|menimbangDoc|http://example.org/legal/document/uu/1986/2|

|4||
|-|-|
|doc|http://example.org/legal/document/uu/2004/16|
|menimbangDoc|http://example.org/legal/document/uu/1991/5|

|5||
|-|-|
|doc|http://example.org/legal/document/uu/2004/21|
|menimbangDoc|http://example.org/legal/document/uu/1994/5|

|6||
|-|-|
|doc|http://example.org/legal/document/uu/2004/31|
|menimbangDoc|http://example.org/legal/document/uu/1985/9|

|7||
|-|-|
|doc|http://example.org/legal/document/uu/2004/31|
|menimbangDoc|http://example.org/legal/document/uu/1985/9|

|8||
|-|-|
|doc|http://example.org/legal/document/uu/2004/37|
|menimbangDoc|http://example.org/legal/document/uu/1998/4|

|9||
|-|-|
|doc|http://example.org/legal/document/uu/2004/5|
|menimbangDoc|http://example.org/legal/document/uu/1985/14|

# Query_022

query:

```sparql
# select 10 legal document dengan pasal terbanyak
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?doc (COUNT(?pasal) as ?pasalCount)
WHERE {
  ?doc a legal:Document .
  ?pasal legal:partOf ?doc .
  ?pasal a legal:Pasal .
}
GROUP BY ?doc
ORDER BY DESC(?pasalCount)
LIMIT 10

```

result:
|0||
|-|-|
|doc|http://example.org/legal/document/uu/2009/1|
|pasalCount|466|

|1||
|-|-|
|doc|http://example.org/legal/document/uu/2014/17|
|pasalCount|377|

|2||
|-|-|
|doc|http://example.org/legal/document/uu/2008/17|
|pasalCount|356|

|3||
|-|-|
|doc|http://example.org/legal/document/uu/2012/8|
|pasalCount|328|

|4||
|-|-|
|doc|http://example.org/legal/document/uu/2004/37|
|pasalCount|308|

|5||
|-|-|
|doc|http://example.org/legal/document/uu/1981/8|
|pasalCount|286|

|6||
|-|-|
|doc|http://example.org/legal/document/uu/2006/11|
|pasalCount|230|

|7||
|-|-|
|doc|http://example.org/legal/document/uu/2009/22|
|pasalCount|223|

|8||
|-|-|
|doc|http://example.org/legal/document/uu/2003/13|
|pasalCount|206|

|9||
|-|-|
|doc|http://example.org/legal/document/uu/2009/36|
|pasalCount|205|

# Query_023

query:

```sparql
# tampilkan 10 dokumen yang pernah diamandemen
PREFIX legal: <http://example.org/legal/ontology/>

SELECT DISTINCT ?doc ?amenderDoc
WHERE {
  ?doc a legal:Document .
  ?pasal legal:partOf ?doc .
  ?pasal legal:pasalHasPasalVersion ?pasalVersion .
  ?amender legal:pointUpdatePasalVersion ?pasalVersion .
  ?amender legal:partOf* ?amenderDoc .
  ?amenderDoc a legal:Document
}
LIMIT 10
```

result:
|0||
|-|-|
|doc|http://example.org/legal/document/uu/2014/7|
|amenderDoc|http://example.org/legal/document/uu/2020/11|

|1||
|-|-|
|doc|http://example.org/legal/document/uu/2000/36|
|amenderDoc|http://example.org/legal/document/uu/2020/11|

|2||
|-|-|
|doc|http://example.org/legal/document/uu/2009/39|
|amenderDoc|http://example.org/legal/document/uu/2020/11|

|3||
|-|-|
|doc|http://example.org/legal/document/uu/2009/41|
|amenderDoc|http://example.org/legal/document/uu/2020/11|

|4||
|-|-|
|doc|http://example.org/legal/document/uu/2012/2|
|amenderDoc|http://example.org/legal/document/uu/2020/11|

|5||
|-|-|
|doc|http://example.org/legal/document/uu/2003/19|
|amenderDoc|http://example.org/legal/document/uu/2020/11|

|6||
|-|-|
|doc|http://example.org/legal/document/uu/1999/5|
|amenderDoc|http://example.org/legal/document/uu/2020/11|

|7||
|-|-|
|doc|http://example.org/legal/document/uu/2016/7|
|amenderDoc|http://example.org/legal/document/uu/2020/11|

|8||
|-|-|
|doc|http://example.org/legal/document/uu/2009/28|
|amenderDoc|http://example.org/legal/document/uu/2020/11|

|9||
|-|-|
|doc|http://example.org/legal/document/uu/1983/6|
|amenderDoc|http://example.org/legal/document/uu/2020/11|

# Query_024

query:

```sparql
# tampilkan 10 tempat disahkan paling banyak
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?location (COUNT(?doc) as ?docCount)
WHERE {
  ?doc legal:documentHasDisahkanLocation ?location
}
GROUP BY ?location
ORDER BY DESC (?docCount)
```

result:
|0||
|-|-|
|location|Jakarta|
|docCount|768|

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
  ?doc legal:documentMenimbang ?menimbang .
  ?menimbang legal:menimbangHasPointSet ?menimbangPointSet .
  ?menimbangPointSet legal:pointSetHasPoint ?menimbangPoint .
  ?menimbangPoint legal:pointHasText ?menimbangText .
  ?menimbangText legal:textReferencesLegal ?menimbangDoc .
  ?menimbangDoc a legal:Document
}
GROUP BY ?menimbangDoc
ORDER BY DESC (?penimbangDocCount)
LIMIT 10

```

result:
|0||
|-|-|
|menimbangDoc|http://example.org/legal/document/uu/2004/15|
|penimbangDocCount|20|

|1||
|-|-|
|menimbangDoc|http://example.org/legal/document/uu/2000/24|
|penimbangDocCount|9|

|2||
|-|-|
|menimbangDoc|http://example.org/legal/document/uu/1986/2|
|penimbangDocCount|6|

|3||
|-|-|
|menimbangDoc|http://example.org/legal/document/uu/2009/47|
|penimbangDocCount|5|

|4||
|-|-|
|menimbangDoc|http://example.org/legal/document/uu/2010/10|
|penimbangDocCount|5|

|5||
|-|-|
|menimbangDoc|http://example.org/legal/document/uu/2013/23|
|penimbangDocCount|5|

|6||
|-|-|
|menimbangDoc|http://example.org/legal/document/uu/1983/6|
|penimbangDocCount|4|

|7||
|-|-|
|menimbangDoc|http://example.org/legal/document/uu/2003/12|
|penimbangDocCount|4|

|8||
|-|-|
|menimbangDoc|http://example.org/legal/document/uu/2004/32|
|penimbangDocCount|4|

|9||
|-|-|
|menimbangDoc|http://example.org/legal/document/uu/1985/17|
|penimbangDocCount|3|

# Query_026

query:

```sparql
# tampilkan semua document yang melakukan amendment, dan banyaknya pasal yang diamendment oleh dokumen tersebut.
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?doc (COUNT(?point) as ?amendmentCount)
WHERE {
  ?doc a legal:Document .
  ?point legal:partOf* ?doc .
  ?point legal:pointUpdatePasalVersion|legal:pointInsertPasalVersion|legal:pointDeletePasalVersion ?pasalVersion .
}
GROUP BY (?doc)
ORDER BY DESC(?amendmentCount)
LIMIT 10
```

result:
|0||
|-|-|
|doc|http://example.org/legal/document/uu/2020/11|
|amendmentCount|1221|

|1||
|-|-|
|doc|http://example.org/legal/document/uu/2011/8|
|amendmentCount|20|

|2||
|-|-|
|doc|http://example.org/legal/document/uu/2009/26|
|amendmentCount|11|

# Query_027

query:

```sparql
# tampilkan 10 bab dengan substring "Kerja"
PREFIX legal: <http://example.org/legal/ontology/>

SELECT ?bab ?title
WHERE {
  ?doc a legal:Document .
  ?bab legal:partOf* ?doc .
  ?bab a legal:Bab .
  ?bab legal:babHasTitle ?title.
  FILTER REGEX(str(?title), "KERJA")
}
LIMIT 10

```

result:
|0||
|-|-|
|bab|http://example.org/legal/document/uu/2014/7/bab/0012|
|title|KERJA SAMA PERDAGANGAN INTERNASIONAL|

|1||
|-|-|
|bab|http://example.org/legal/document/uu/2020/11/bab/0011|
|title|PELAKSANAAN ADMINISTRASI PEMERINTAHAN UNTUK MENDUKUNG CIPTA KERJA|

|2||
|-|-|
|bab|http://example.org/legal/document/uu/2020/11/bab/0004|
|title|KETENAGAKERJAAN|

|3||
|-|-|
|bab|http://example.org/legal/document/uu/2007/40/bab/0004|
|title|RENCANA KERJA, LAPORAN TAHUNAN, DAN PENGGUNAAN LABA|

|4||
|-|-|
|bab|http://example.org/legal/document/uu/2014/6/bab/0011|
|title|KERJA SAMA DESA Pasal 91 Desa dapat mengadakan kerja sama dengan Desa lain dan/atau kerja sama dengan pihak ketiga.|

|5||
|-|-|
|bab|http://example.org/legal/document/uu/2017/18/bab/0007|
|title|PELAKSANA PENEMPATAN PEKERJA MIGRAN INDONESIA|

|6||
|-|-|
|bab|http://example.org/legal/document/uu/2017/18/bab/0004|
|title|LAYANAN TERPADU SATU ATAP PENEMPATAN DAN PELINDUNGAN PEKERJA MIGRAN INDONESIA|

|7||
|-|-|
|bab|http://example.org/legal/document/uu/2017/18/bab/0003|
|title|PELINDUNGAN PEKERJA MIGRAN INDONESIA|

|8||
|-|-|
|bab|http://example.org/legal/document/uu/2017/18/bab/0002|
|title|PEKERJA MIGRAN INDONESIA|

|9||
|-|-|
|bab|http://example.org/legal/document/uu/2003/13/bab/0012|
|title|PEMUTUSAN HUBUNGAN KERJA|

# Query_028

query:

```sparql
# show raw text of UU 2007 No.26 Pasal 1 version 20201102
PREFIX legal: <http://example.org/legal/ontology/>

SELECT *
WHERE {
  <http://example.org/legal/document/uu/2007/26/pasal/0001/version/20201102> <http://example.org/legal/ontology/pasalVersionHasRawText> ?o
}
```

result:
|0||
|-|-|
|o|Dalam Undang-Undang ini yang dimaksud dengan:\n1. Ruang adalah wadah yang meliputi ruang darat, ruang laut, dan ruang udara, termasuk ruang di dalam bumi sebagai satu kesatuan wilayah, tempat manusia dan makhluk lain hidup, melakukan kegiatan, dan memelihara kelangsungan hidupnya.\n2. Tata ruang adalah wujud struktur ruang dan pola ruang.\n3. Struktur ruang adalah susunan pusat-pusat permukiman dan sistem jaringan prasarana dan sarana yang berfungsi sebagai pendukung kegiatan sosial ekonomi masyarakat yang secara hierarki memiliki hubungan fungsional.\n4. Pola ruang adalah distribusi peruntukan ruang dalam suatu wilayah yang meliputi peruntukan ruang untuk fungsi lindung dan peruntukan ruang untuk fungsi budi daya. an\n5. Penataan ruang adalah suatu sistem perencanaan tata ruang, pemanfaatan ruang, dan pengendalian pemanfaatan ruang.\n6. Penyelenggaraan penataan ruang adalah kegiatan yang meliputi pengaturan, pembinaan, pelaksanaan, dan pengawasan penataan ruang.\n7. Pemerintah Pusat adalah Presiden Republik Indonesia yang memegang kekuasaan pemerintahan negara Republik Indonesia yang dibantu oleh Wakil Presiden dan menteri sebagaimana dimaksud dalam Undang- Undang Dasar Negara Republik Indonesia Tahun 1945.\n8. Pemerintah Daerah adalah kepala daerah sebagai unsur penyelenggara Pemerintahan Daerah yang memimpin pelaksanaan urusan pemerintahan yang menjadi kewenangan daerah otonom.\n9. Pengaturan penataan ruang adalah upaya pembentukan landasan hukum bagi Pemerintah Pusat, Pemerintah Daerah, dan masyarakat dalam penataan ruang.\n10. Pembinaan penataan ruang adalah upaya untuk meningkatkan kinerja penataan ruang yang diselenggarakan oleh Pemerintah Pusat, Pemerintah Daerah, dan masyarakat.\n11. Pelaksanaan penataan ruang adalah upaya pencapaian tujuan penataan ruang melalui pelaksanaan perencanaan tata ruang, pemanfaatan ruang, dan pengendalian pemanfaatan ruang.\n12. Pengawasan penataan ruang adalah upaya agar penyelenggaraan penataan ruang dapat diwujudkan sesuai dengan ketentuan peraturan perundang- undangan.\n13. Perencanaan tata ruang adalah suatu proses untuk menentukan struktur ruang dan pola ruang yang meliputi penyusunan dan penetapan rencana tata ruang.\n14. Pemanfaatan ruang adalah upaya untuk mewujudkan struktur ruang dan pola ruang sesuai dengan rencana tata ruang melalui penyusunan dan pelaksanaan program beserta pembiayaannya.\n15. Pengendalian pemanfaatan ruang adalah upaya untuk mewujudkan tertib tata ruang.\n16. Rencana tata ruang adalah hasil perencanaan tata ruang.\n17. Wilayah adalah ruang yang merupakan kesatuan geografis beserta segenap unsur terkait yang batas dan sistemnya ditentukan berdasarkan aspek administratif dan/atau aspek fungsional.\n18. Sistem wilayah adalah struktur ruang dan pola ruang yang mempunyai jangkauan pelayanan pada tingkat wilayah.\n19. Sistem internal perkotaan adalah struktur ruang dan pola ruang yang mempunyai jangkauan pelayanan pada tingkat internal perkotaan.\n20. Kawasan adalah wilayah yang memiliki fungsi utama lindung atau budi daya.\n21. Kawasan lindung adalah wilayah yang ditetapkan dengan fungsi utama melindungi kelestarian lingkungan hidup yang mencakup sumber daya alam dan sumber daya buatan.\n22. Kawasan budi daya adalah wilayah yang ditetapkan dengan fungsi utama untuk dibudidayakan atas dasar kondisi dan potensi sumber daya alam, sumber daya manusia, dan sumber daya buatan.\n23. Kawasan perdesaan adalah wilayah yang mempunyai kegiatan utama pertanian, termasuk pengelolaan sumber daya alam dengan susunan fungsi kawasan sebagai tempat permukiman perdesaan, pelayanan jasa pemerintahan, pelayanan sosial, dan kegiatan ekonomi.\n24. Kawasan agropolitan adalah kawasan yang terdiri atas satu atau lebih pusat kegiatan pada wilayah perdesaan sebagai sistem produksi pertanian dan pengelolaan sumber daya alam tertentu yang ditunjukkan oleh adanya keterkaitan fungsional dan hierarki keruangan satuan sistem permukiman dan sistem agrobisnis.\n25. Kawasan perkotaan adalah wilayah yang mempunyai kegiatan utama bukan pertanian dengan susunan fungsi kawasan sebagai tempat permukiman perkotaan, pemusatan dan distribusi pelayanan jasa pemerintahan, pelayanan sosial, dan kegiatan ekonomi.\n26. Kawasan metropolitan adalah kawasan perkotaan yang terdiri atas sebuah kawasan perkotaan yang berdiri sendiri atau kawasan perkotaan inti dengan kawasan perkotaan di sekitarnya yang saling memiliki keterkaitan fungsional yang dihubungkan dengan sistem jaringan prasarana wilayah yang terintegrasi dengan jumlah penduduk secara keseluruhan sekurang-kurangnya 1.000.000 (satu juta) jiwa.\n27. Kawasan megapolitan adalah kawasan yang terbentuk dari 2 (dua) atau lebih kawasan metropolitan yang memiliki hubungan fungsional dan membentuk sebuah sistem.\n28. Kawasan strategis nasional adalah wilayah yang penataan ruangnya diprioritaskan karena mempunyai pengaruh sangat penting secara nasional terhadap kedaulatan negara, pertahanan, dan keamanan negara, ekonomi, sosial, budaya, dan/atau lingkungan, termasuk wilayah yang telah ditetapkan sebagai warisan dunia.\n29. Kawasan strategis provinsi adalah wilayah yang penataan ruangnya diprioritaskan karena mempunyai pengaruh sangat penting dalam lingkup provinsi terhadap ekonomi, sosial, budaya, dan/atau lingkungan.\n30. Kawasan strategis kabupaten/kota adalah wilayah yang penataan ruangnya diprioritaskan karena mempunyai pengaruh sangat penting dalam lingkup kabupaten/kota terhadap ekonomi, sosial, budaya, dan/atau lingkungan. aa\n31. Ruang terbuka hijau adalah area memanjang/jalur dan/atau mengelompok yang penggunaannya lebih bersifat terbuka, tempat tumbuh tanaman, baik yang tumbuh secara alamiah maupun yang sengaja ditanam, dengan mempertimbangkan aspek fungsi ekologis, resapan air, ekonomi, sosial budaya, dan estetika.\n32. Kesesuaian Kegiatan Pemanfaatan Ruang adalah kesesuaian antara rencana kegiatan pemanfaatan ruang dengan rencana tata ruang.\n33. Orang adalah orang perseorangan dan/atau korporasi.\n34. Menteri adalah menteri yang menyelenggarakan urusan pemerintahan dalam bidang penataan ruang.\n|