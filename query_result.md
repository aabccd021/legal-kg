# Query_001

query:

```sparql
# Describe Omnibus Law (UU Cipta Kerja)
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT * WHERE {
  <https://example.org/lex2kg/uu/2020/11> ?p ?o .
} 
ORDER BY ?p ?o
LIMIT 3
```

result:
| 0 |                                                   |
|---|---------------------------------------------------|
| p | <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> |
| o | <https://example.org/lex2kg/ontology/Peraturan>   |

| 1 |                                              |
|---|----------------------------------------------|
| p | <https://example.org/lex2kg/ontology/bahasa> |
| o | id                                           |

| 2 |                                                 |
|---|-------------------------------------------------|
| p | <https://example.org/lex2kg/ontology/daftarBab> |
| o | <https://example.org/lex2kg/uu/2020/11/bab>     |

# Query_002

query:

```sparql
# Retrieve all articles (= pasal) of Omnibus Law
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT ?pasalVersion ?text WHERE {
  <https://example.org/lex2kg/uu/2020/11> o:pasal ?pasal .
  ?pasal o:versi ?pasalVersion .
  ?pasalVersion o:teks ?text .
} 
ORDER BY ?pasal ?text
LIMIT 3
```

result:
| 0            |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|--------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| pasalVersion | <https://example.org/lex2kg/uu/2020/11/pasal/0001/versi/20201102>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| text         | Dalam Undang-Undang ini yang dimaksud dengan:\n1. Cipta Kerja adalah upaya penciptaan kerja melalui usaha kemudahan, perlindungan, dan pemberdayaan koperasi dan usaha mikro, kecil, dan menengah, peningkatan ekosistem investasi dan kemudahan berusaha, dan investasi Pemerintah Pusat dan percepatan proyek strategis nasional.\n2. Koperasi adalah koperasi sebagaimana dimaksud dalam Undang-Undang tentang Perkoperasian.\n3. Usaha Mikro, Kecil, dan Menengah yang selanjutnya disingkat UMK-M adalah usaha mikro, usaha kecil, dan usaha menengah sebagaimana dimaksud dalam Undang- Undang tentang Usaha Mikro, Kecil, dan Menengah.\n4. Perizinan Berusaha adalah legalitas yang diberikan kepada Pelaku Usaha untuk memulai dan menjalankan usaha dan/atau kegiatannya.\n5. Pemerintah Pusat adalah Presiden Republik Indonesia yang memegang kekuasaan pemerintahan negara Republik Indonesia yang dibantu oleh Wakil Presiden dan menteri sebagaimana dimaksud dalam Undang-Undang Dasar Negara Republik Indonesia Tahun 1945.\n6. Pemerintahan Daerah adalah penyelenggaraan urusan pemerintahan oleh Pemerintah Daerah dan dewan perwakilan rakyat daerah menurut asas otonomi dan tugas pembantuan dengan prinsip otonomi seluas-luasnya dalam sistem dan prinsip Negara Kesatuan Republik Indonesia sebagaimana dimaksud dalam Undang-Undang Dasar Negara Republik Indonesia Tahun 1945.\n7. Pemerintah Daerah adalah kepala daerah sebagai unsur penyelenggara Pemerintahan Daerah yang memimpin pelaksanaan urusan pemerintahan yang menjadi kewenangan daerah otonom.\n8. Pelaku Usaha adalah orang perseorangan atau badan usaha yang melakukan usaha dan/atau kegiatan pada bidang tertentu. an\n9. Badan Usaha adalah badan usaha berbentuk badan hukum atau tidak berbentuk badan hukum yang didirikan di wilayah Negara Kesatuan Republik Indonesia dan melakukan usaha dan/atau kegiatan pada bidang tertentu.\n10. Rencana Detail Tata Ruang yang selanjutnya disingkat RDTR adalah rencana secara terperinci tentang tata ruang wilayah kabupaten/kota yang dilengkapi dengan peraturan zonasi kabupaten/kota.\n11. Persetujuan Bangunan Gedung adalah perizinan yang diberikan kepada pemilik bangunan gedung untuk membangun baru, mengubah, memperluas, mengurangi, dan/atau merawat bangunan gedung sesuai dengan standar teknis Bangunan Gedung.\n12. Hari adalah hari kerja sesuai dengan yang ditetapkan oleh Pemerintah Pusat.\n |

| 1            |                                                                                                                                                                                                                                                                                                                                                                                      |
|--------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| pasalVersion | <https://example.org/lex2kg/uu/2020/11/pasal/0002/versi/20201102>                                                                                                                                                                                                                                                                                                                    |
| text         | (1). Undang-Undang ini diselenggarakan berdasarkan asas:\na. pemerataan hak,\nb. kepastian hukum:\nc. kemudahan berusaha:\nd. kebersamaan: dan\ne. kemandirian.\n\n(2). Selain berdasarkan asas sebagaimana dimaksud pada ayat (1), penyelenggaraan Cipta Kerja dilaksanakan berdasarkan asas lain sesuai dengan bidang hukum yang diatur dalam undang-undang yang bersangkutan. . R |

| 2            |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| pasalVersion | <https://example.org/lex2kg/uu/2020/11/pasal/0003/versi/20201102>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| text         | Undang-Undang ini dibentuk dengan tujuan untuk:\na. menciptakan dan meningkatkan lapangan kerja dengan memberikan kemudahan, pelindungan, dan pemberdayaan terhadap koperasi dan UMK-M serta industri dan perdagangan nasional sebagai upaya untuk dapat menyerap tenaga kerja Indonesia yang seluas-luasnya dengan tetap memperhatikan keseimbangan dan kemajuan antardaerah dalam kesatuan ekonomi nasional,\nb. menjamin setiap warga negara memperoleh pekerjaan, serta mendapat imbalan dan perlakuan yang adil dan layak dalam hubungan kerja,\nc. melakukan penyesuaian berbagai aspek pengaturan yang berkaitan dengan keberpihakan, penguatan, dan perlindungan bagi koperasi dan UMK-M serta industri nasional: dan\nd. melakukan penyesuaian berbagai aspek pengaturan yang berkaitan dengan peningkatan ekosistem investasi, kemudahan dan percepatan proyek strategis nasional yang berorientasi pada kepentingan nasional yang berlandaskan pada ilmu pengetahuan dan teknologi nasional dengan berpedoman pada haluan ideologi Pancasila.\n |

# Query_002_latest

query:

```sparql
# Retrieve all articles (= pasal) of Omnibus Law
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT ?pasal ?text WHERE {
  { 
    SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
      <https://example.org/lex2kg/uu/2020/11> o:pasal ?pasal .
      ?pasal o:versi ?pasalVersion .
    } GROUP BY ?pasal 
  }
  ?latestPasalVersion o:teks ?text
} 
ORDER BY ?pasal ?text
LIMIT 3
```

result:
| 0     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|-------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| pasal | <https://example.org/lex2kg/uu/2020/11/pasal/0001>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| text  | Dalam Undang-Undang ini yang dimaksud dengan:\n1. Cipta Kerja adalah upaya penciptaan kerja melalui usaha kemudahan, perlindungan, dan pemberdayaan koperasi dan usaha mikro, kecil, dan menengah, peningkatan ekosistem investasi dan kemudahan berusaha, dan investasi Pemerintah Pusat dan percepatan proyek strategis nasional.\n2. Koperasi adalah koperasi sebagaimana dimaksud dalam Undang-Undang tentang Perkoperasian.\n3. Usaha Mikro, Kecil, dan Menengah yang selanjutnya disingkat UMK-M adalah usaha mikro, usaha kecil, dan usaha menengah sebagaimana dimaksud dalam Undang- Undang tentang Usaha Mikro, Kecil, dan Menengah.\n4. Perizinan Berusaha adalah legalitas yang diberikan kepada Pelaku Usaha untuk memulai dan menjalankan usaha dan/atau kegiatannya.\n5. Pemerintah Pusat adalah Presiden Republik Indonesia yang memegang kekuasaan pemerintahan negara Republik Indonesia yang dibantu oleh Wakil Presiden dan menteri sebagaimana dimaksud dalam Undang-Undang Dasar Negara Republik Indonesia Tahun 1945.\n6. Pemerintahan Daerah adalah penyelenggaraan urusan pemerintahan oleh Pemerintah Daerah dan dewan perwakilan rakyat daerah menurut asas otonomi dan tugas pembantuan dengan prinsip otonomi seluas-luasnya dalam sistem dan prinsip Negara Kesatuan Republik Indonesia sebagaimana dimaksud dalam Undang-Undang Dasar Negara Republik Indonesia Tahun 1945.\n7. Pemerintah Daerah adalah kepala daerah sebagai unsur penyelenggara Pemerintahan Daerah yang memimpin pelaksanaan urusan pemerintahan yang menjadi kewenangan daerah otonom.\n8. Pelaku Usaha adalah orang perseorangan atau badan usaha yang melakukan usaha dan/atau kegiatan pada bidang tertentu. an\n9. Badan Usaha adalah badan usaha berbentuk badan hukum atau tidak berbentuk badan hukum yang didirikan di wilayah Negara Kesatuan Republik Indonesia dan melakukan usaha dan/atau kegiatan pada bidang tertentu.\n10. Rencana Detail Tata Ruang yang selanjutnya disingkat RDTR adalah rencana secara terperinci tentang tata ruang wilayah kabupaten/kota yang dilengkapi dengan peraturan zonasi kabupaten/kota.\n11. Persetujuan Bangunan Gedung adalah perizinan yang diberikan kepada pemilik bangunan gedung untuk membangun baru, mengubah, memperluas, mengurangi, dan/atau merawat bangunan gedung sesuai dengan standar teknis Bangunan Gedung.\n12. Hari adalah hari kerja sesuai dengan yang ditetapkan oleh Pemerintah Pusat.\n |

| 1     |                                                                                                                                                                                                                                                                                                                                                                                      |
|-------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| pasal | <https://example.org/lex2kg/uu/2020/11/pasal/0002>                                                                                                                                                                                                                                                                                                                                   |
| text  | (1). Undang-Undang ini diselenggarakan berdasarkan asas:\na. pemerataan hak,\nb. kepastian hukum:\nc. kemudahan berusaha:\nd. kebersamaan: dan\ne. kemandirian.\n\n(2). Selain berdasarkan asas sebagaimana dimaksud pada ayat (1), penyelenggaraan Cipta Kerja dilaksanakan berdasarkan asas lain sesuai dengan bidang hukum yang diatur dalam undang-undang yang bersangkutan. . R |

| 2     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|-------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| pasal | <https://example.org/lex2kg/uu/2020/11/pasal/0003>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| text  | Undang-Undang ini dibentuk dengan tujuan untuk:\na. menciptakan dan meningkatkan lapangan kerja dengan memberikan kemudahan, pelindungan, dan pemberdayaan terhadap koperasi dan UMK-M serta industri dan perdagangan nasional sebagai upaya untuk dapat menyerap tenaga kerja Indonesia yang seluas-luasnya dengan tetap memperhatikan keseimbangan dan kemajuan antardaerah dalam kesatuan ekonomi nasional,\nb. menjamin setiap warga negara memperoleh pekerjaan, serta mendapat imbalan dan perlakuan yang adil dan layak dalam hubungan kerja,\nc. melakukan penyesuaian berbagai aspek pengaturan yang berkaitan dengan keberpihakan, penguatan, dan perlindungan bagi koperasi dan UMK-M serta industri nasional: dan\nd. melakukan penyesuaian berbagai aspek pengaturan yang berkaitan dengan peningkatan ekosistem investasi, kemudahan dan percepatan proyek strategis nasional yang berorientasi pada kepentingan nasional yang berlandaskan pada ilmu pengetahuan dan teknologi nasional dengan berpedoman pada haluan ideologi Pancasila.\n |

# Query_003

query:

```sparql
# What is the textual content of Article (or Pasal) 2 Subsection (or Ayat) 1 of Omnibus Law?
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT ?x ?text WHERE {
  ?pasal o:bagianDari+ <https://example.org/lex2kg/uu/2020/11>.
  ?pasal o:nomor 2 .
  ?x o:bagianDari* ?pasal .
  ?x o:nomor 1 .
  ?x o:teks ?text .
}
ORDER BY ?x ?text
LIMIT 3
```

result:
| 0    |                                                                                                                                                              |
|------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| x    | <https://example.org/lex2kg/uu/2020/11/pasal/0002/versi/20201102/ayat/0001>                                                                                  |
| text | Undang-Undang ini diselenggarakan berdasarkan asas:\na. pemerataan hak,\nb. kepastian hukum:\nc. kemudahan berusaha:\nd. kebersamaan: dan\ne. kemandirian.\n |

| 1    |                                                                                                                                                              |
|------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| x    | <https://example.org/lex2kg/uu/2020/11/pasal/0002/versi/20201102/ayat/0001>                                                                                  |
| text | Undang-Undang ini diselenggarakan berdasarkan asas:\na. pemerataan hak,\nb. kepastian hukum:\nc. kemudahan berusaha:\nd. kebersamaan: dan\ne. kemandirian.\n |

| 2    |                                                                                                                                                                        |
|------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| x    | <https://example.org/lex2kg/uu/2020/11/pasal/0007/versi/20201102/ayat/0001>                                                                                            |
| text | Perizinan Berusaha berbasis risiko sebagaimana dimaksud dalam Pasal 6 huruf a dilakukan berdasarkan penetapan tingkat risiko dan peringkat skala usaha kegiatan usaha. |

# Query_003_latest

query:

```sparql
# What is the textual content of Article (or Pasal) 2 Subsection (or Ayat) 1 of Omnibus Law?
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT ?x ?text WHERE {
  {
    SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
      <https://example.org/lex2kg/uu/2020/11> o:pasal ?pasal .
      ?pasal o:nomor 2 .
      ?pasal o:versi ?pasalVersion .
    } GROUP BY ?pasal
  }
  ?x o:bagianDari* ?latestPasalVersion .
  ?x o:nomor 1 .
  ?x o:teks ?text .
} 
ORDER BY ?x ?text
LIMIT 3
```

result:
| 0    |                                                                                                                                                              |
|------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| x    | <https://example.org/lex2kg/uu/2020/11/pasal/0002/versi/20201102/ayat/0001>                                                                                  |
| text | Undang-Undang ini diselenggarakan berdasarkan asas:\na. pemerataan hak,\nb. kepastian hukum:\nc. kemudahan berusaha:\nd. kebersamaan: dan\ne. kemandirian.\n |

# Query_004

query:

```sparql
# Which are the articles of Chapter 2 (Bab 2) of Omnibus Law?
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT ?pasal ?text WHERE {
  ?bab o:bagianDari+ <https://example.org/lex2kg/uu/2020/11>.
  ?bab o:nomor 2 .
  ?pasal o:bagianDari+ ?bab .
  ?pasal o:versi ?pasalVersion .
  ?pasalVersion o:teks ?text
} 
ORDER BY ?pasal ?text
LIMIT 3
```

result:
| 0     |                                                                                                                                                                                                                                                                                                                                                                                      |
|-------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| pasal | <https://example.org/lex2kg/uu/2020/11/pasal/0002>                                                                                                                                                                                                                                                                                                                                   |
| text  | (1). Undang-Undang ini diselenggarakan berdasarkan asas:\na. pemerataan hak,\nb. kepastian hukum:\nc. kemudahan berusaha:\nd. kebersamaan: dan\ne. kemandirian.\n\n(2). Selain berdasarkan asas sebagaimana dimaksud pada ayat (1), penyelenggaraan Cipta Kerja dilaksanakan berdasarkan asas lain sesuai dengan bidang hukum yang diatur dalam undang-undang yang bersangkutan. . R |

| 1     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|-------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| pasal | <https://example.org/lex2kg/uu/2020/11/pasal/0003>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| text  | Undang-Undang ini dibentuk dengan tujuan untuk:\na. menciptakan dan meningkatkan lapangan kerja dengan memberikan kemudahan, pelindungan, dan pemberdayaan terhadap koperasi dan UMK-M serta industri dan perdagangan nasional sebagai upaya untuk dapat menyerap tenaga kerja Indonesia yang seluas-luasnya dengan tetap memperhatikan keseimbangan dan kemajuan antardaerah dalam kesatuan ekonomi nasional,\nb. menjamin setiap warga negara memperoleh pekerjaan, serta mendapat imbalan dan perlakuan yang adil dan layak dalam hubungan kerja,\nc. melakukan penyesuaian berbagai aspek pengaturan yang berkaitan dengan keberpihakan, penguatan, dan perlindungan bagi koperasi dan UMK-M serta industri nasional: dan\nd. melakukan penyesuaian berbagai aspek pengaturan yang berkaitan dengan peningkatan ekosistem investasi, kemudahan dan percepatan proyek strategis nasional yang berorientasi pada kepentingan nasional yang berlandaskan pada ilmu pengetahuan dan teknologi nasional dengan berpedoman pada haluan ideologi Pancasila.\n |

| 2     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|-------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| pasal | <https://example.org/lex2kg/uu/2020/11/pasal/0004>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| text  | Dalam rangka mencapai tujuan sebagaimana dimaksud dalam Pasal 3, ruang lingkup Undang-Undang ini mengatur kebijakan strategis Cipta Kerja yang meliputi:\na. peningkatan ekosistem investasi dan kegiatan berusaha,\nb. ketenagakerjaan,\nc. kemudahan, pelindungan, serta pemberdayaan koperasi dan UMK-M,\nd. kemudahan berusaha:\ne. dukungan riset dan inovasi,\nf. pengadaan tanah,\ng. kawasan ekonomi:\nh. investasi Pemerintah Pusat dan percepatan proyek strategis nasional, IX R Ii. pelaksanaan administrasi pemerintahan: dan J. pengenaan sanksi.\n |

# Query_004_latest

query:

```sparql
# Which are the articles of Chapter 2 (Bab 2) of Omnibus Law?
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT ?pasal ?text WHERE {
  {
    SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
      ?bab o:bagianDari+ <https://example.org/lex2kg/uu/2020/11>.
      ?bab o:nomor 2 .
      ?pasal o:bagianDari+ ?bab .
      ?pasal o:versi ?pasalVersion .
    } GROUP BY ?pasal
  }
  ?latestPasalVersion o:teks ?text
} 
ORDER BY ?pasal ?text
LIMIT 3
```

result:
| 0     |                                                                                                                                                                                                                                                                                                                                                                                      |
|-------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| pasal | <https://example.org/lex2kg/uu/2020/11/pasal/0002>                                                                                                                                                                                                                                                                                                                                   |
| text  | (1). Undang-Undang ini diselenggarakan berdasarkan asas:\na. pemerataan hak,\nb. kepastian hukum:\nc. kemudahan berusaha:\nd. kebersamaan: dan\ne. kemandirian.\n\n(2). Selain berdasarkan asas sebagaimana dimaksud pada ayat (1), penyelenggaraan Cipta Kerja dilaksanakan berdasarkan asas lain sesuai dengan bidang hukum yang diatur dalam undang-undang yang bersangkutan. . R |

| 1     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|-------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| pasal | <https://example.org/lex2kg/uu/2020/11/pasal/0003>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| text  | Undang-Undang ini dibentuk dengan tujuan untuk:\na. menciptakan dan meningkatkan lapangan kerja dengan memberikan kemudahan, pelindungan, dan pemberdayaan terhadap koperasi dan UMK-M serta industri dan perdagangan nasional sebagai upaya untuk dapat menyerap tenaga kerja Indonesia yang seluas-luasnya dengan tetap memperhatikan keseimbangan dan kemajuan antardaerah dalam kesatuan ekonomi nasional,\nb. menjamin setiap warga negara memperoleh pekerjaan, serta mendapat imbalan dan perlakuan yang adil dan layak dalam hubungan kerja,\nc. melakukan penyesuaian berbagai aspek pengaturan yang berkaitan dengan keberpihakan, penguatan, dan perlindungan bagi koperasi dan UMK-M serta industri nasional: dan\nd. melakukan penyesuaian berbagai aspek pengaturan yang berkaitan dengan peningkatan ekosistem investasi, kemudahan dan percepatan proyek strategis nasional yang berorientasi pada kepentingan nasional yang berlandaskan pada ilmu pengetahuan dan teknologi nasional dengan berpedoman pada haluan ideologi Pancasila.\n |

| 2     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|-------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| pasal | <https://example.org/lex2kg/uu/2020/11/pasal/0004>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| text  | Dalam rangka mencapai tujuan sebagaimana dimaksud dalam Pasal 3, ruang lingkup Undang-Undang ini mengatur kebijakan strategis Cipta Kerja yang meliputi:\na. peningkatan ekosistem investasi dan kegiatan berusaha,\nb. ketenagakerjaan,\nc. kemudahan, pelindungan, serta pemberdayaan koperasi dan UMK-M,\nd. kemudahan berusaha:\ne. dukungan riset dan inovasi,\nf. pengadaan tanah,\ng. kawasan ekonomi:\nh. investasi Pemerintah Pusat dan percepatan proyek strategis nasional, IX R Ii. pelaksanaan administrasi pemerintahan: dan J. pengenaan sanksi.\n |

# Query_005

query:

```sparql
# Get subsections (= ayat) containing "kompensasi" and "buruh" that are added by Omnibus Law into other laws
PREFIX o: <https://example.org/lex2kg/ontology/>
PREFIX uu: <https://example.org/lex2kg/uu/>

SELECT ?ayat ?text WHERE {
  ?insertingPoint o:bagianDari+ <https://example.org/lex2kg/uu/2020/11> .
  ?insertingPoint o:menyisipkan ?insertedPasalVersion .
  ?ayat o:bagianDari+ ?insertedPasalVersion .
  ?ayat o:teks ?text
  FILTER REGEX(str(?text), "kompensasi")
  FILTER REGEX(str(?text), "buruh")
} LIMIT 3
```

result:
| 0    |                                                                                                                                                                                        |
|------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ayat | <https://example.org/lex2kg/uu/2003/13/pasal/0061A/versi/20201102/ayat/0001>                                                                                                           |
| text | Dalam hal perjanjian kerja waktu tertentu berakhir sebagaimana dimaksud dalam Pasal 61 ayat (1) huruf b dan huruf c, pengusaha wajib memberikan uang kompensasi kepada pekerja/ buruh. |

| 1    |                                                                                                                                                                                        |
|------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ayat | <https://example.org/lex2kg/uu/2003/13/pasal/0061A/versi/20201102/ayat/0001/text>                                                                                                      |
| text | Dalam hal perjanjian kerja waktu tertentu berakhir sebagaimana dimaksud dalam Pasal 61 ayat (1) huruf b dan huruf c, pengusaha wajib memberikan uang kompensasi kepada pekerja/ buruh. |

| 2    |                                                                                                                                                           |
|------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| ayat | <https://example.org/lex2kg/uu/2003/13/pasal/0061A/versi/20201102/ayat/0002>                                                                              |
| text | Uang kompensasi sebagaimana dimaksud pada ayat (1) diberikan kepada pekerja/buruh sesuai dengan masa kerja pekerja/buruh di perusahaan yang bersangkutan. |

# Query_005_latest

query:

```sparql
# Get subsections (= ayat) containing "kompensasi" and "buruh" that are added by Omnibus Law into other laws
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT ?ayat ?text WHERE {
  {
    SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
      ?pasal o:bagianDari+ <https://example.org/lex2kg/uu/2020/11>.
      ?pasal o:versi ?pasalVersion .
    } GROUP BY ?pasal
  }
  ?insertingPoint o:bagianDari+ ?latestPasalVersion .
  ?insertingPoint o:menyisipkan ?insertedPasalVersion .
  ?ayat o:bagianDari+ ?insertedPasalVersion .
  ?ayat o:teks ?text
  FILTER REGEX(str(?text), "kompensasi")
  FILTER REGEX(str(?text), "buruh")
} LIMIT 3

```

result:
| 0    |                                                                                                                                                                                        |
|------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ayat | <https://example.org/lex2kg/uu/2003/13/pasal/0061A/versi/20201102/ayat/0001>                                                                                                           |
| text | Dalam hal perjanjian kerja waktu tertentu berakhir sebagaimana dimaksud dalam Pasal 61 ayat (1) huruf b dan huruf c, pengusaha wajib memberikan uang kompensasi kepada pekerja/ buruh. |

| 1    |                                                                                                                                                                                        |
|------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ayat | <https://example.org/lex2kg/uu/2003/13/pasal/0061A/versi/20201102/ayat/0001/text>                                                                                                      |
| text | Dalam hal perjanjian kerja waktu tertentu berakhir sebagaimana dimaksud dalam Pasal 61 ayat (1) huruf b dan huruf c, pengusaha wajib memberikan uang kompensasi kepada pekerja/ buruh. |

| 2    |                                                                                                                                                           |
|------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| ayat | <https://example.org/lex2kg/uu/2003/13/pasal/0061A/versi/20201102/ayat/0002>                                                                              |
| text | Uang kompensasi sebagaimana dimaksud pada ayat (1) diberikan kepada pekerja/buruh sesuai dengan masa kerja pekerja/buruh di perusahaan yang bersangkutan. |

# Query_006

query:

```sparql
# Retrieve components of Omnibus Law that insert (= menyisipkan) articles (= pasal) into Labor Law (UU Ketenagakerjaan) and show the textual content of the articles
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT ?insertingPoint ?insertedPasalVersion ?text WHERE {
  ?insertingPoint o:bagianDari+ <https://example.org/lex2kg/uu/2020/11>.
  ?insertingPoint o:menyisipkan ?insertedPasalVersion .
  ?insertedPasalVersion o:bagianDari+ <https://example.org/lex2kg/uu/2003/13> .
  ?insertedPasalVersion o:teks ?text .
}
ORDER BY ?insertingPoint ?insertedPasalVersion
LIMIT 3

```

result:
| 0                    |                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| insertingPoint       | <https://example.org/lex2kg/uu/2020/11/pasal/0081/versi/20201102/huruf/0017>                                                                                                                                                                                                                                                                                                                                                                         |
| insertedPasalVersion | <https://example.org/lex2kg/uu/2003/13/pasal/0061A/versi/20201102>                                                                                                                                                                                                                                                                                                                                                                                   |
| text                 | (1). Dalam hal perjanjian kerja waktu tertentu berakhir sebagaimana dimaksud dalam Pasal 61 ayat (1) huruf b dan huruf c, pengusaha wajib memberikan uang kompensasi kepada pekerja/ buruh.\n(2). Uang kompensasi sebagaimana dimaksud pada ayat (1) diberikan kepada pekerja/buruh sesuai dengan masa kerja pekerja/buruh di perusahaan yang bersangkutan.\n(3). Ketentuan lebih lanjut mengenai uang kompensasi diatur dalam Peraturan Pemerintah. |

| 1                    |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| insertingPoint       | <https://example.org/lex2kg/uu/2020/11/pasal/0081/versi/20201102/huruf/0025>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| insertedPasalVersion | <https://example.org/lex2kg/uu/2003/13/pasal/0088A/versi/20201102>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| text                 | (1). Hak pekerja/buruh atas upah timbul pada saat terjadi hubungan kerja antara pekerja/buruh dengan pengusaha dan berakhir pada saat putusnya hubungan kerja.\n(2). — Setiap pekerja/buruh berhak memperoleh upah yang sama untuk pekerjaan yang sama nilainya.\n(3). Pengusaha wajib membayar upah kepada pekerja/buruh sesuai dengan kesepakatan.\n(4). Pengaturan pengupahan yang ditetapkan atas kesepakatan antara pengusaha dan pekerja/buruh atau serikat pekerja/serikat buruh tidak boleh lebih rendah dari ketentuan pengupahan yang ditetapkan dalam peraturan perundang-undangan.\n(5). “Dalam hal kesepakatan sebagaimana dimaksud pada ayat (4) lebih rendah atau bertentangan dengan peraturan perundang-undangan, kesepakatan tersebut batal demi hukum dan pengaturan pengupahan dilaksanakan sesuai dengan ketentuan peraturan perundang-undangan.\n(6). Pengusaha yang karena kesengajaan atau kelalaiannya mengakibatkan keterlambatan pembayaran upah, dikenakan denda sesuai dengan persentase tertentu dari upah pekerja/ buruh.\n(7). Pekerja/buruh yang melakukan pelanggaran karena kesengajaan atau kelalaiannya dapat dikenakan denda. (8 Pemerintah mengatur pengenaan denda kepada pengusaha dan/atau pekerja/ buruh dalam pembayaran upah. |

| 2                    |                                                                                                                                                                                                                                               |
|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| insertingPoint       | <https://example.org/lex2kg/uu/2020/11/pasal/0081/versi/20201102/huruf/0025>                                                                                                                                                                  |
| insertedPasalVersion | <https://example.org/lex2kg/uu/2003/13/pasal/0088B/versi/20201102>                                                                                                                                                                            |
| text                 | (1). Upah ditetapkan berdasarkan: a satuan waktu, dan/atau b. satuan hasil.\n(2). — Ketentuan lebih lanjut mengenai upah berdasarkan satuan waktu dan/atau satuan hasil sebagaimana dimaksud pada ayat (1) diatur dalam Peraturan Pemerintah. |

# Query_006_latest

query:

```sparql
# Retrieve components of Omnibus Law that insert (= menyisipkan) articles (= pasal) into Labor Law (UU Ketenagakerjaan) and show the textual content of the articles
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT ?insertingPoint ?insertedPasalVersion ?text WHERE {
  {
    SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
      ?pasal o:bagianDari+ <https://example.org/lex2kg/uu/2020/11>.
      ?pasal o:versi ?pasalVersion .
    } GROUP BY ?pasal
  }
  ?insertingPoint o:bagianDari+ ?latestPasalVersion .
  ?insertingPoint o:menyisipkan ?insertedPasalVersion .
  ?insertedPasalVersion o:bagianDari+ <https://example.org/lex2kg/uu/2003/13> .
  ?insertedPasalVersion o:teks ?text .
}
ORDER BY ?insertingPoint ?insertedPasalVersion
LIMIT 3

```

result:
| 0                    |                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| insertingPoint       | <https://example.org/lex2kg/uu/2020/11/pasal/0081/versi/20201102/huruf/0017>                                                                                                                                                                                                                                                                                                                                                                         |
| insertedPasalVersion | <https://example.org/lex2kg/uu/2003/13/pasal/0061A/versi/20201102>                                                                                                                                                                                                                                                                                                                                                                                   |
| text                 | (1). Dalam hal perjanjian kerja waktu tertentu berakhir sebagaimana dimaksud dalam Pasal 61 ayat (1) huruf b dan huruf c, pengusaha wajib memberikan uang kompensasi kepada pekerja/ buruh.\n(2). Uang kompensasi sebagaimana dimaksud pada ayat (1) diberikan kepada pekerja/buruh sesuai dengan masa kerja pekerja/buruh di perusahaan yang bersangkutan.\n(3). Ketentuan lebih lanjut mengenai uang kompensasi diatur dalam Peraturan Pemerintah. |

| 1                    |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| insertingPoint       | <https://example.org/lex2kg/uu/2020/11/pasal/0081/versi/20201102/huruf/0025>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| insertedPasalVersion | <https://example.org/lex2kg/uu/2003/13/pasal/0088A/versi/20201102>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| text                 | (1). Hak pekerja/buruh atas upah timbul pada saat terjadi hubungan kerja antara pekerja/buruh dengan pengusaha dan berakhir pada saat putusnya hubungan kerja.\n(2). — Setiap pekerja/buruh berhak memperoleh upah yang sama untuk pekerjaan yang sama nilainya.\n(3). Pengusaha wajib membayar upah kepada pekerja/buruh sesuai dengan kesepakatan.\n(4). Pengaturan pengupahan yang ditetapkan atas kesepakatan antara pengusaha dan pekerja/buruh atau serikat pekerja/serikat buruh tidak boleh lebih rendah dari ketentuan pengupahan yang ditetapkan dalam peraturan perundang-undangan.\n(5). “Dalam hal kesepakatan sebagaimana dimaksud pada ayat (4) lebih rendah atau bertentangan dengan peraturan perundang-undangan, kesepakatan tersebut batal demi hukum dan pengaturan pengupahan dilaksanakan sesuai dengan ketentuan peraturan perundang-undangan.\n(6). Pengusaha yang karena kesengajaan atau kelalaiannya mengakibatkan keterlambatan pembayaran upah, dikenakan denda sesuai dengan persentase tertentu dari upah pekerja/ buruh.\n(7). Pekerja/buruh yang melakukan pelanggaran karena kesengajaan atau kelalaiannya dapat dikenakan denda. (8 Pemerintah mengatur pengenaan denda kepada pengusaha dan/atau pekerja/ buruh dalam pembayaran upah. |

| 2                    |                                                                                                                                                                                                                                               |
|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| insertingPoint       | <https://example.org/lex2kg/uu/2020/11/pasal/0081/versi/20201102/huruf/0025>                                                                                                                                                                  |
| insertedPasalVersion | <https://example.org/lex2kg/uu/2003/13/pasal/0088B/versi/20201102>                                                                                                                                                                            |
| text                 | (1). Upah ditetapkan berdasarkan: a satuan waktu, dan/atau b. satuan hasil.\n(2). — Ketentuan lebih lanjut mengenai upah berdasarkan satuan waktu dan/atau satuan hasil sebagaimana dimaksud pada ayat (1) diatur dalam Peraturan Pemerintah. |

# Query_007

query:

```sparql
# Get components of Omnibus Law that amend (= mengubah) articles in Labor Law and compare the textual content of the old vs. new articles
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT ?updatingPointt ?updatedPasal ?text ?version
WHERE {
  {
    SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
      ?pasal o:bagianDari+ <https://example.org/lex2kg/uu/2020/11>.
      ?pasal o:versi ?pasalVersion .
    } GROUP BY ?pasal
  }
  ?updatingPointt o:bagianDari+ <https://example.org/lex2kg/uu/2020/11>.
  ?updatingPointt o:mengubah ?updatedPasalVersion .
  ?updatedPasal o:versi ?updatedPasalVersion .
  <https://example.org/lex2kg/uu/2003/13> o:pasal ?updatedPasal .
  ?updatedPasal o:versi ?allPasalVersion .
  ?allPasalVersion o:teks ?text .
  ?allPasalVersion o:tanggal ?version .
}
ORDER BY ?insertingPoint ?insertedPasal ?version ?text
LIMIT 3

```

result:
| 0              |                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| updatingPointt | <https://example.org/lex2kg/uu/2020/11/pasal/0081/versi/20201102/huruf/0066>                                                                                                                                                                                                                                                                                                                                                                             |
| updatedPasal   | <https://example.org/lex2kg/uu/2003/13/pasal/0188>                                                                                                                                                                                                                                                                                                                                                                                                       |
| text           | (1). Barang siapa melanggar ketentuan sebagaimana dimaksud dalam Pasal 14 ayat (2), Pasal 38 ayat (2), Pasal 63 ayat (1), Pasal 78 ayat (1), Pasal 108 ayat (1), Pasal 111 ayat (3), Pasal 114, dan Pasal 148, dikenakan sanksi pidana denda paling sedikit Rp 5.000.000,00 (lima juta rupiah) dan paling banyak Rp 50.000.000,00 (lima puluh juta rupiah).\n(2). Tindak pidana sebagaimana dimaksud dalam ayat (1) merupakan tindak pidana pelanggaran. |
| version        | 2003-03-25                                                                                                                                                                                                                                                                                                                                                                                                                                               |

| 1              |                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| updatingPointt | <https://example.org/lex2kg/uu/2020/11/pasal/0081/versi/20201102/huruf/0066>                                                                                                                                                                                                                                                                                                                                                                             |
| updatedPasal   | <https://example.org/lex2kg/uu/2003/13/pasal/0188>                                                                                                                                                                                                                                                                                                                                                                                                       |
| text           | (1). Barang siapa melanggar ketentuan sebagaimana dimaksud dalam Pasal 14 ayat (2), Pasal 38 ayat (2), Pasal 63 ayat (1), Pasal 78 ayat (1), Pasal 108 ayat (1), Pasal 111 ayat (3), Pasal 114, dan Pasal 148, dikenakan sanksi pidana denda paling sedikit Rp 5.000.000,00 (lima juta rupiah) dan paling banyak Rp 50.000.000,00 (lima puluh juta rupiah).\n(2). Tindak pidana sebagaimana dimaksud dalam ayat (1) merupakan tindak pidana pelanggaran. |
| version        | 2003-03-25                                                                                                                                                                                                                                                                                                                                                                                                                                               |

| 2              |                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| updatingPointt | <https://example.org/lex2kg/uu/2020/11/pasal/0081/versi/20201102/huruf/0066>                                                                                                                                                                                                                                                                                                                                                                             |
| updatedPasal   | <https://example.org/lex2kg/uu/2003/13/pasal/0188>                                                                                                                                                                                                                                                                                                                                                                                                       |
| text           | (1). Barang siapa melanggar ketentuan sebagaimana dimaksud dalam Pasal 14 ayat (2), Pasal 38 ayat (2), Pasal 63 ayat (1), Pasal 78 ayat (1), Pasal 108 ayat (1), Pasal 111 ayat (3), Pasal 114, dan Pasal 148, dikenakan sanksi pidana denda paling sedikit Rp 5.000.000,00 (lima juta rupiah) dan paling banyak Rp 50.000.000,00 (lima puluh juta rupiah).\n(2). Tindak pidana sebagaimana dimaksud dalam ayat (1) merupakan tindak pidana pelanggaran. |
| version        | 2003-03-25                                                                                                                                                                                                                                                                                                                                                                                                                                               |

# Query_007_latest

query:

```sparql
# Get components of Omnibus Law that amend (= mengubah) articles in Labor Law and compare the textual content of the old vs. new articles
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT ?insertingPoint ?insertedPasal ?version ?text WHERE {
  {
    SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
      ?pasal o:bagianDari+ <https://example.org/lex2kg/uu/2020/11>.
      ?pasal o:versi ?pasalVersion .
    } GROUP BY ?pasal
  }
  ?insertingPoint o:bagianDari+ ?latestPasalVersion .
  ?insertingPoint o:menyisipkan ?insertedPasalVersion .
  ?insertedPasalVersion o:bagianDari+ <https://example.org/lex2kg/uu/2003/13> .
  ?insertedPasal o:versi ?insertedPasalVersion .
  ?insertedPasal o:versi ?allPasalVersion .
  ?allPasalVersion o:teks ?text .
  ?allPasalVersion o:tanggal ?version .
}
ORDER BY ?insertingPoint ?insertedPasal ?version ?text
LIMIT 3

```

result:
| 0              |                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
|----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| insertingPoint | <https://example.org/lex2kg/uu/2020/11/pasal/0081/versi/20201102/huruf/0017>                                                                                                                                                                                                                                                                                                                                                                         |
| insertedPasal  | <https://example.org/lex2kg/uu/2003/13/pasal/0061A>                                                                                                                                                                                                                                                                                                                                                                                                  |
| version        | 2020-11-02                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| text           | (1). Dalam hal perjanjian kerja waktu tertentu berakhir sebagaimana dimaksud dalam Pasal 61 ayat (1) huruf b dan huruf c, pengusaha wajib memberikan uang kompensasi kepada pekerja/ buruh.\n(2). Uang kompensasi sebagaimana dimaksud pada ayat (1) diberikan kepada pekerja/buruh sesuai dengan masa kerja pekerja/buruh di perusahaan yang bersangkutan.\n(3). Ketentuan lebih lanjut mengenai uang kompensasi diatur dalam Peraturan Pemerintah. |

| 1              |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| insertingPoint | <https://example.org/lex2kg/uu/2020/11/pasal/0081/versi/20201102/huruf/0025>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| insertedPasal  | <https://example.org/lex2kg/uu/2003/13/pasal/0088A>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| version        | 2020-11-02                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| text           | (1). Hak pekerja/buruh atas upah timbul pada saat terjadi hubungan kerja antara pekerja/buruh dengan pengusaha dan berakhir pada saat putusnya hubungan kerja.\n(2). — Setiap pekerja/buruh berhak memperoleh upah yang sama untuk pekerjaan yang sama nilainya.\n(3). Pengusaha wajib membayar upah kepada pekerja/buruh sesuai dengan kesepakatan.\n(4). Pengaturan pengupahan yang ditetapkan atas kesepakatan antara pengusaha dan pekerja/buruh atau serikat pekerja/serikat buruh tidak boleh lebih rendah dari ketentuan pengupahan yang ditetapkan dalam peraturan perundang-undangan.\n(5). “Dalam hal kesepakatan sebagaimana dimaksud pada ayat (4) lebih rendah atau bertentangan dengan peraturan perundang-undangan, kesepakatan tersebut batal demi hukum dan pengaturan pengupahan dilaksanakan sesuai dengan ketentuan peraturan perundang-undangan.\n(6). Pengusaha yang karena kesengajaan atau kelalaiannya mengakibatkan keterlambatan pembayaran upah, dikenakan denda sesuai dengan persentase tertentu dari upah pekerja/ buruh.\n(7). Pekerja/buruh yang melakukan pelanggaran karena kesengajaan atau kelalaiannya dapat dikenakan denda. (8 Pemerintah mengatur pengenaan denda kepada pengusaha dan/atau pekerja/ buruh dalam pembayaran upah. |

| 2              |                                                                                                                                                                                                                                               |
|----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| insertingPoint | <https://example.org/lex2kg/uu/2020/11/pasal/0081/versi/20201102/huruf/0025>                                                                                                                                                                  |
| insertedPasal  | <https://example.org/lex2kg/uu/2003/13/pasal/0088B>                                                                                                                                                                                           |
| version        | 2020-11-02                                                                                                                                                                                                                                    |
| text           | (1). Upah ditetapkan berdasarkan: a satuan waktu, dan/atau b. satuan hasil.\n(2). — Ketentuan lebih lanjut mengenai upah berdasarkan satuan waktu dan/atau satuan hasil sebagaimana dimaksud pada ayat (1) diatur dalam Peraturan Pemerintah. |

# Query_008

query:

```sparql
# Give me components of Omnibus Law that remove (= menghapus) articles in Labor Law and show the textual content of the removed articles
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT ?deletingPoint ?deletedPasal ?version ?text WHERE {
  ?deletingPoint o:bagianDari+ <https://example.org/lex2kg/uu/2020/11>.
  ?deletingPoint o:menghapus ?deletedPasalVersion .
  ?deletedPasal o:versi ?deletedPasalVersion .
  <https://example.org/lex2kg/uu/2003/13> o:pasal ?deletedPasal .
  ?deletedPasal o:versi ?allPasalVersion .
  ?allPasalVersion o:teks ?text .
  ?allPasalVersion o:tanggal ?version .
}
LIMIT 3

```

result:
| 0             |                                                                              |
|---------------|------------------------------------------------------------------------------|
| deletingPoint | <https://example.org/lex2kg/uu/2020/11/pasal/0081/versi/20201102/huruf/0043> |
| deletedPasal  | <https://example.org/lex2kg/uu/2003/13/pasal/0155>                           |
| version       | 2020-11-02                                                                   |
| text          |                                                                              |

| 1             |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
|---------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| deletingPoint | <https://example.org/lex2kg/uu/2020/11/pasal/0081/versi/20201102/huruf/0043>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| deletedPasal  | <https://example.org/lex2kg/uu/2003/13/pasal/0155>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| version       | 2003-03-25                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| text          | (1). Pemutusan hubungan kerja tanpa penetapan sebagaimana dimaksud dalam Pasal 151 ayat (3) batal demi hukum.\n(2). Selama putusan lembaga penyelesaian perselisihan hubungan industrial belum ditetapkan, baik pengusaha maupun pekerja/buruh harus tetap melaksanakan segala kewajibannya.\n(3). Pengusaha dapat melakukan penyimpangan terhadap ketentuan sebagaimana dimaksud dalam ayat (2) berupa tindakan skorsing kepada pekerja/buruh yang sedang dalam proses pemutusan hubungan kerja dengan tetap wajib membayar upah beserta hak-hak lainnya yang biasa diterima pekerja/buruh. |

| 2             |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| deletingPoint | <https://example.org/lex2kg/uu/2020/11/pasal/0081/versi/20201102/huruf/0005>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| deletedPasal  | <https://example.org/lex2kg/uu/2003/13/pasal/0043>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| version       | 2003-03-25                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| text          | (1). Pemberi kerja yang menggunakan tenaga kerja asing harus memiliki rencana penggunaan tenaga kerja asing yang disahkan oleh Menteri atau pejabat yang ditunjuk.\n(2). Rencana penggunaan tenaga kerja asing sebagaimana dimaksud dalam ayat (1) sekurang-kurangnya me muat keterangan :\na. alasan penggunaan tenaga kerja asing,\nb. jabatan dan/atau kedudukan tenaga kerja asing dalam struktur organisasi perusahaan yang bersangkutan,\nc. jangka waktu penggunaan tenaga kerja asing, dan\nd. penunjukan tenaga kerja warga negara Indonesia sebagai pendamping tenaga kerja asing yang dipekerjakan.\n\n(3). Ketentuan sebagaimana dimaksud dalam ayat (1) tidak berlaku bagi instansi pemerintah, badan-badan internasional dan perwakilan negara asing.\n(4). Ketentuan mengenai tata cara pengesahan rencana penggunaan tenaga kerja asing diatur dengan Keputu san Menteri. |

# Query_008_latest

query:

```sparql
# Give me components of Omnibus Law that remove (= menghapus) articles in Labor Law and show the textual content of the removed articles
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT ?deletingPoint ?deletedPasal ?version ?text WHERE {
  {
    SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
      ?pasal o:bagianDari+ <https://example.org/lex2kg/uu/2020/11>.
      ?pasal o:versi ?pasalVersion .
    } GROUP BY ?pasal
  }
  ?deletingPoint o:bagianDari+ ?latestPasalVersion .
  ?deletingPoint o:menghapus ?deletedPasalVersion .
  ?deletedPasal o:versi ?deletedPasalVersion .
  <https://example.org/lex2kg/uu/2003/13> o:pasal ?deletedPasal .
  ?deletedPasal o:versi ?allPasalVersion .
  ?allPasalVersion o:teks ?text .
  ?allPasalVersion o:tanggal ?version .
}
ORDER BY ?deletingPoint ?deletedPasal ?version ?text
LIMIT 3

```

result:
| 0             |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| deletingPoint | <https://example.org/lex2kg/uu/2020/11/pasal/0081/versi/20201102/huruf/0005>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| deletedPasal  | <https://example.org/lex2kg/uu/2003/13/pasal/0043>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| version       | 2003-03-25                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| text          | (1). Pemberi kerja yang menggunakan tenaga kerja asing harus memiliki rencana penggunaan tenaga kerja asing yang disahkan oleh Menteri atau pejabat yang ditunjuk.\n(2). Rencana penggunaan tenaga kerja asing sebagaimana dimaksud dalam ayat (1) sekurang-kurangnya me muat keterangan :\na. alasan penggunaan tenaga kerja asing,\nb. jabatan dan/atau kedudukan tenaga kerja asing dalam struktur organisasi perusahaan yang bersangkutan,\nc. jangka waktu penggunaan tenaga kerja asing, dan\nd. penunjukan tenaga kerja warga negara Indonesia sebagai pendamping tenaga kerja asing yang dipekerjakan.\n\n(3). Ketentuan sebagaimana dimaksud dalam ayat (1) tidak berlaku bagi instansi pemerintah, badan-badan internasional dan perwakilan negara asing.\n(4). Ketentuan mengenai tata cara pengesahan rencana penggunaan tenaga kerja asing diatur dengan Keputu san Menteri. |

| 1             |                                                                              |
|---------------|------------------------------------------------------------------------------|
| deletingPoint | <https://example.org/lex2kg/uu/2020/11/pasal/0081/versi/20201102/huruf/0005> |
| deletedPasal  | <https://example.org/lex2kg/uu/2003/13/pasal/0043>                           |
| version       | 2020-11-02                                                                   |
| text          |                                                                              |

| 2             |                                                                                                                                                                                                                                                  |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| deletingPoint | <https://example.org/lex2kg/uu/2020/11/pasal/0081/versi/20201102/huruf/0006>                                                                                                                                                                     |
| deletedPasal  | <https://example.org/lex2kg/uu/2003/13/pasal/0044>                                                                                                                                                                                               |
| version       | 2003-03-25                                                                                                                                                                                                                                       |
| text          | (1). Pemberi kerja tenaga kerja asing wajib menaati ketentuan mengenai jabatan dan standar kompetensi yang berlaku.\n(2). Ketentuan mengenai jabatan dan standar kompetensi sebagaimana dimaksud dalam ayat (1) diatur dengan Keputusan Menteri. |

# Query_009

query:

```sparql
# Which law has the most number of updates (= insertions/amendments/removals) by Omnibus Law? For that law, show the most recent version taking into account the updates by Omnibus Law!
PREFIX o: <https://example.org/lex2kg/ontology/>
PREFIX owl: <http://www.w3.org/2002/07/owl#>

SELECT ?law ?numOfUpdates ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
  {
    SELECT ?law (COUNT(*) AS ?numOfUpdates) WHERE {
      ?point o:bagianDari+ <https://example.org/lex2kg/uu/2020/11> .
      { ?point o:mengubah ?amendedPasalVersion }
      UNION { ?point o:menyisipkan ?amendedPasalVersion }
      UNION { ?point o:menghapus ?amendedPasalVersion }
      ?amendedPasalVersion o:bagianDari+ ?law .
      ?law a o:Peraturan .
    } GROUP BY ?law
  }
  ?pasal o:bagianDari+ ?law .
  ?pasal o:versi ?pasalVersion .
}
GROUP BY ?law ?numOfUpdates ?pasal
ORDER BY DESC (?numOfUpdates)
LIMIT 3

```

result:
| 0                  |                                                                  |
|--------------------|------------------------------------------------------------------|
| law                | <https://example.org/lex2kg/uu/2009/1>                           |
| numOfUpdates       | 90                                                               |
| pasal              | <https://example.org/lex2kg/uu/2009/1/pasal/0013>                |
| latestPasalVersion | <https://example.org/lex2kg/uu/2009/1/pasal/0013/versi/20201102> |

| 1                  |                                                                  |
|--------------------|------------------------------------------------------------------|
| law                | <https://example.org/lex2kg/uu/2009/1>                           |
| numOfUpdates       | 90                                                               |
| pasal              | <https://example.org/lex2kg/uu/2009/1/pasal/0014>                |
| latestPasalVersion | <https://example.org/lex2kg/uu/2009/1/pasal/0014/versi/20201102> |

| 2                  |                                                                  |
|--------------------|------------------------------------------------------------------|
| law                | <https://example.org/lex2kg/uu/2009/1>                           |
| numOfUpdates       | 90                                                               |
| pasal              | <https://example.org/lex2kg/uu/2009/1/pasal/0015>                |
| latestPasalVersion | <https://example.org/lex2kg/uu/2009/1/pasal/0015/versi/20201102> |

# Query_009_latest

query:

```sparql
# Which law has the most number of updates (= insertions/amendments/removals) by Omnibus Law? For that law, show the most recent version taking into account the updates by Omnibus Law!
PREFIX o: <https://example.org/lex2kg/ontology/>
PREFIX owl: <http://www.w3.org/2002/07/owl#>

SELECT ?law ?numOfUpdates ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
  {
    SELECT ?law (COUNT(*) AS ?numOfUpdates) WHERE {
      {
        SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
          ?pasal o:bagianDari+ <https://example.org/lex2kg/uu/2020/11>.
          ?pasal o:versi ?pasalVersion .
        } GROUP BY ?pasal
      }
      ?point o:bagianDari+ ?latestPasalVersion .
      { ?point o:mengubah ?amendedPasalVersion }
      UNION { ?point o:menyisipkan ?amendedPasalVersion }
      UNION { ?point o:menghapus ?amendedPasalVersion }
      ?amendedPasalVersion o:bagianDari+ ?law .
      ?law a o:Peraturan .
    } GROUP BY ?law
  }
  ?pasal o:bagianDari+ ?law .
  ?pasal o:versi ?pasalVersion .
}
GROUP BY ?law ?numOfUpdates ?pasal
ORDER BY DESC (?numOfUpdates)
LIMIT 3

```

result:
| 0                  |                                                                  |
|--------------------|------------------------------------------------------------------|
| law                | <https://example.org/lex2kg/uu/2009/1>                           |
| numOfUpdates       | 90                                                               |
| pasal              | <https://example.org/lex2kg/uu/2009/1/pasal/0013>                |
| latestPasalVersion | <https://example.org/lex2kg/uu/2009/1/pasal/0013/versi/20201102> |

| 1                  |                                                                  |
|--------------------|------------------------------------------------------------------|
| law                | <https://example.org/lex2kg/uu/2009/1>                           |
| numOfUpdates       | 90                                                               |
| pasal              | <https://example.org/lex2kg/uu/2009/1/pasal/0014>                |
| latestPasalVersion | <https://example.org/lex2kg/uu/2009/1/pasal/0014/versi/20201102> |

| 2                  |                                                                  |
|--------------------|------------------------------------------------------------------|
| law                | <https://example.org/lex2kg/uu/2009/1>                           |
| numOfUpdates       | 90                                                               |
| pasal              | <https://example.org/lex2kg/uu/2009/1/pasal/0015>                |
| latestPasalVersion | <https://example.org/lex2kg/uu/2009/1/pasal/0015/versi/20201102> |

# Query_010

query:

```sparql
# How many are insertions, amendments, and removals of other laws in Omnibus Law?
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT ?type (COUNT(*) AS ?jumlah) WHERE {
  {
    ?point o:bagianDari+ <https://example.org/lex2kg/uu/2020/11> .
    ?point o:menghapus ?pasal .
    BIND("menghapus" AS ?type)
  } UNION {
    ?point o:bagianDari+ <https://example.org/lex2kg/uu/2020/11> .
    ?point o:menyisipkan ?pasal .
    BIND("menyisipkan" AS ?type)
  } UNION {
    ?point o:bagianDari+ <https://example.org/lex2kg/uu/2020/11> .
    ?point o:mengubah ?pasal .
    BIND("mengubah" AS ?type)
  }
} GROUP BY ?type
LIMIT 3

```

result:
| 0      |             |
|--------|-------------|
| type   | menyisipkan |
| jumlah | 107         |

| 1      |           |
|--------|-----------|
| type   | menghapus |
| jumlah | 184       |

| 2      |          |
|--------|----------|
| type   | mengubah |
| jumlah | 930      |

# Query_010_latest

query:

```sparql
# How many are insertions, amendments, and removals of other laws in Omnibus Law?
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT ?type (COUNT(*) AS ?jumlah) WHERE {
  {
    {
      SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
        ?pasal o:bagianDari+ <https://example.org/lex2kg/uu/2020/11>.
        ?pasal o:versi ?pasalVersion .
      } GROUP BY ?pasal
    }
    ?deletingPoint o:bagianDari+ ?latestPasalVersion .
    ?deletingPoint o:menghapus ?deletedPasalVersion .
    BIND("menghapus" AS ?type)
  }
  UNION {
    {
      SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
        ?pasal o:bagianDari+ <https://example.org/lex2kg/uu/2020/11>.
        ?pasal o:versi ?pasalVersion .
      } GROUP BY ?pasal
    }
    ?deletingPoint o:bagianDari+ ?latestPasalVersion .
    ?deletingPoint o:menyisipkan ?deletedPasalVersion .
    BIND("menyisipkan" AS ?type)
  } UNION {
    {
      SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
        ?pasal o:bagianDari+ <https://example.org/lex2kg/uu/2020/11>.
        ?pasal o:versi ?pasalVersion .
      } GROUP BY ?pasal
    }
    ?deletingPoint o:bagianDari+ ?latestPasalVersion .
    ?deletingPoint o:mengubah ?deletedPasalVersion .
    BIND("mengubah" AS ?type)
  }
} GROUP BY ?type
LIMIT 3

```

result:
| 0      |             |
|--------|-------------|
| type   | menyisipkan |
| jumlah | 107         |

| 1      |           |
|--------|-----------|
| type   | menghapus |
| jumlah | 184       |

| 2      |          |
|--------|----------|
| type   | mengubah |
| jumlah | 930      |

# Query_011

query:

```sparql
# Get articles of Labor Law (UU Ketenagakerjaan) taking into account updates (= insertions/amendments/removals) from Omnibus Law (UU Cipta Kerja)
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT ?latestPasalVersion WHERE {
  {
    SELECT ?pasal (MAX(?pasalVersion) as ?latestPasalVersion) WHERE {
      ?pasal o:bagianDari+ <https://example.org/lex2kg/uu/2003/13>.
      ?pasal o:versi ?pasalVersion .
    } GROUP BY ?pasal
  }
}
ORDER BY ?latestPasalVersion
LIMIT 3
```

result:
| 0                  |                                                                   |
|--------------------|-------------------------------------------------------------------|
| latestPasalVersion | <https://example.org/lex2kg/uu/2003/13/pasal/0001/versi/20030325> |

| 1                  |                                                                   |
|--------------------|-------------------------------------------------------------------|
| latestPasalVersion | <https://example.org/lex2kg/uu/2003/13/pasal/0002/versi/20030325> |

| 2                  |                                                                   |
|--------------------|-------------------------------------------------------------------|
| latestPasalVersion | <https://example.org/lex2kg/uu/2003/13/pasal/0003/versi/20030325> |

# Query_012

query:

```sparql
# Get articles of Omnibus Law that are not about updating (= insertions/amendments/removals) other laws
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT DISTINCT ?pasalVersion ?text WHERE {
  ?pasalVersion o:bagianDari+ <https://example.org/lex2kg/uu/2020/11>.
  ?pasalVersion o:teks ?text .
  FILTER NOT EXISTS {
    ?point o:bagianDari+ ?pasalVersion . 
    ?point a o:Point .
    { ?point o:mengubah ?amendedPasalVersion }
    UNION { ?point o:menyisipkan ?amendedPasalVersion } 
    UNION { ?point o:menghapus ?amendedPasalVersion }
  }
}
ORDER BY ?pasalVersion ?text
LIMIT 3
```

result:
| 0            |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|--------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| pasalVersion | <https://example.org/lex2kg/uu/2020/11/pasal/0001/versi/20201102>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| text         | Dalam Undang-Undang ini yang dimaksud dengan:\n1. Cipta Kerja adalah upaya penciptaan kerja melalui usaha kemudahan, perlindungan, dan pemberdayaan koperasi dan usaha mikro, kecil, dan menengah, peningkatan ekosistem investasi dan kemudahan berusaha, dan investasi Pemerintah Pusat dan percepatan proyek strategis nasional.\n2. Koperasi adalah koperasi sebagaimana dimaksud dalam Undang-Undang tentang Perkoperasian.\n3. Usaha Mikro, Kecil, dan Menengah yang selanjutnya disingkat UMK-M adalah usaha mikro, usaha kecil, dan usaha menengah sebagaimana dimaksud dalam Undang- Undang tentang Usaha Mikro, Kecil, dan Menengah.\n4. Perizinan Berusaha adalah legalitas yang diberikan kepada Pelaku Usaha untuk memulai dan menjalankan usaha dan/atau kegiatannya.\n5. Pemerintah Pusat adalah Presiden Republik Indonesia yang memegang kekuasaan pemerintahan negara Republik Indonesia yang dibantu oleh Wakil Presiden dan menteri sebagaimana dimaksud dalam Undang-Undang Dasar Negara Republik Indonesia Tahun 1945.\n6. Pemerintahan Daerah adalah penyelenggaraan urusan pemerintahan oleh Pemerintah Daerah dan dewan perwakilan rakyat daerah menurut asas otonomi dan tugas pembantuan dengan prinsip otonomi seluas-luasnya dalam sistem dan prinsip Negara Kesatuan Republik Indonesia sebagaimana dimaksud dalam Undang-Undang Dasar Negara Republik Indonesia Tahun 1945.\n7. Pemerintah Daerah adalah kepala daerah sebagai unsur penyelenggara Pemerintahan Daerah yang memimpin pelaksanaan urusan pemerintahan yang menjadi kewenangan daerah otonom.\n8. Pelaku Usaha adalah orang perseorangan atau badan usaha yang melakukan usaha dan/atau kegiatan pada bidang tertentu. an\n9. Badan Usaha adalah badan usaha berbentuk badan hukum atau tidak berbentuk badan hukum yang didirikan di wilayah Negara Kesatuan Republik Indonesia dan melakukan usaha dan/atau kegiatan pada bidang tertentu.\n10. Rencana Detail Tata Ruang yang selanjutnya disingkat RDTR adalah rencana secara terperinci tentang tata ruang wilayah kabupaten/kota yang dilengkapi dengan peraturan zonasi kabupaten/kota.\n11. Persetujuan Bangunan Gedung adalah perizinan yang diberikan kepada pemilik bangunan gedung untuk membangun baru, mengubah, memperluas, mengurangi, dan/atau merawat bangunan gedung sesuai dengan standar teknis Bangunan Gedung.\n12. Hari adalah hari kerja sesuai dengan yang ditetapkan oleh Pemerintah Pusat.\n |

| 1            |                                                                                                                                                                                                                                                                                   |
|--------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| pasalVersion | <https://example.org/lex2kg/uu/2020/11/pasal/0001/versi/20201102/huruf/0001/text>                                                                                                                                                                                                 |
| text         | Cipta Kerja adalah upaya penciptaan kerja melalui usaha kemudahan, perlindungan, dan pemberdayaan koperasi dan usaha mikro, kecil, dan menengah, peningkatan ekosistem investasi dan kemudahan berusaha, dan investasi Pemerintah Pusat dan percepatan proyek strategis nasional. |

| 2            |                                                                                          |
|--------------|------------------------------------------------------------------------------------------|
| pasalVersion | <https://example.org/lex2kg/uu/2020/11/pasal/0001/versi/20201102/huruf/0002/text>        |
| text         | Koperasi adalah koperasi sebagaimana dimaksud dalam Undang-Undang tentang Perkoperasian. |

# Query_012_latest

query:

```sparql
# Get articles of Omnibus Law that are not about updating (= insertions/amendments/removals) other laws
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT DISTINCT ?pasalVersion ?text WHERE {
  ?pasalVersion o:bagianDari+ <https://example.org/lex2kg/uu/2020/11>.
  ?pasalVersion o:teks ?text .
  FILTER NOT EXISTS {
    ?point o:bagianDari+ ?pasalVersion . 
    ?point a o:Point .
    { ?point o:mengubah ?amendedPasalVersion }
    UNION { ?point o:menyisipkan ?amendedPasalVersion } 
    UNION { ?point o:menghapus ?amendedPasalVersion }
  }
}
ORDER BY ?pasalVersion ?text
LIMIT 3

```

result:
| 0            |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|--------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| pasalVersion | <https://example.org/lex2kg/uu/2020/11/pasal/0001/versi/20201102>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| text         | Dalam Undang-Undang ini yang dimaksud dengan:\n1. Cipta Kerja adalah upaya penciptaan kerja melalui usaha kemudahan, perlindungan, dan pemberdayaan koperasi dan usaha mikro, kecil, dan menengah, peningkatan ekosistem investasi dan kemudahan berusaha, dan investasi Pemerintah Pusat dan percepatan proyek strategis nasional.\n2. Koperasi adalah koperasi sebagaimana dimaksud dalam Undang-Undang tentang Perkoperasian.\n3. Usaha Mikro, Kecil, dan Menengah yang selanjutnya disingkat UMK-M adalah usaha mikro, usaha kecil, dan usaha menengah sebagaimana dimaksud dalam Undang- Undang tentang Usaha Mikro, Kecil, dan Menengah.\n4. Perizinan Berusaha adalah legalitas yang diberikan kepada Pelaku Usaha untuk memulai dan menjalankan usaha dan/atau kegiatannya.\n5. Pemerintah Pusat adalah Presiden Republik Indonesia yang memegang kekuasaan pemerintahan negara Republik Indonesia yang dibantu oleh Wakil Presiden dan menteri sebagaimana dimaksud dalam Undang-Undang Dasar Negara Republik Indonesia Tahun 1945.\n6. Pemerintahan Daerah adalah penyelenggaraan urusan pemerintahan oleh Pemerintah Daerah dan dewan perwakilan rakyat daerah menurut asas otonomi dan tugas pembantuan dengan prinsip otonomi seluas-luasnya dalam sistem dan prinsip Negara Kesatuan Republik Indonesia sebagaimana dimaksud dalam Undang-Undang Dasar Negara Republik Indonesia Tahun 1945.\n7. Pemerintah Daerah adalah kepala daerah sebagai unsur penyelenggara Pemerintahan Daerah yang memimpin pelaksanaan urusan pemerintahan yang menjadi kewenangan daerah otonom.\n8. Pelaku Usaha adalah orang perseorangan atau badan usaha yang melakukan usaha dan/atau kegiatan pada bidang tertentu. an\n9. Badan Usaha adalah badan usaha berbentuk badan hukum atau tidak berbentuk badan hukum yang didirikan di wilayah Negara Kesatuan Republik Indonesia dan melakukan usaha dan/atau kegiatan pada bidang tertentu.\n10. Rencana Detail Tata Ruang yang selanjutnya disingkat RDTR adalah rencana secara terperinci tentang tata ruang wilayah kabupaten/kota yang dilengkapi dengan peraturan zonasi kabupaten/kota.\n11. Persetujuan Bangunan Gedung adalah perizinan yang diberikan kepada pemilik bangunan gedung untuk membangun baru, mengubah, memperluas, mengurangi, dan/atau merawat bangunan gedung sesuai dengan standar teknis Bangunan Gedung.\n12. Hari adalah hari kerja sesuai dengan yang ditetapkan oleh Pemerintah Pusat.\n |

| 1            |                                                                                                                                                                                                                                                                                   |
|--------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| pasalVersion | <https://example.org/lex2kg/uu/2020/11/pasal/0001/versi/20201102/huruf/0001/text>                                                                                                                                                                                                 |
| text         | Cipta Kerja adalah upaya penciptaan kerja melalui usaha kemudahan, perlindungan, dan pemberdayaan koperasi dan usaha mikro, kecil, dan menengah, peningkatan ekosistem investasi dan kemudahan berusaha, dan investasi Pemerintah Pusat dan percepatan proyek strategis nasional. |

| 2            |                                                                                          |
|--------------|------------------------------------------------------------------------------------------|
| pasalVersion | <https://example.org/lex2kg/uu/2020/11/pasal/0001/versi/20201102/huruf/0002/text>        |
| text         | Koperasi adalah koperasi sebagaimana dimaksud dalam Undang-Undang tentang Perkoperasian. |

# Query_013

query:

```sparql
# Give me articles (= pasal) of Omnibus Law removing articles of laws legalized later than the year 2001
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT DISTINCT ?pasalVersion WHERE {
  ?point o:bagianDari+ <https://example.org/lex2kg/uu/2020/11>.
  ?point o:menghapus ?pasalVersion .
  ?pasalVersion o:bagianDari+ ?document .
  ?document o:disahkanPada ?legalizedDate
  FILTER(year(?legalizedDate) > 2001)
}
ORDER BY ?pasalVersion
LIMIT 3
```

result:
| 0            |                                                                   |
|--------------|-------------------------------------------------------------------|
| pasalVersion | <https://example.org/lex2kg/uu/2002/28/pasal/0008/versi/20201102> |

| 1            |                                                                   |
|--------------|-------------------------------------------------------------------|
| pasalVersion | <https://example.org/lex2kg/uu/2002/28/pasal/0009/versi/20201102> |

| 2            |                                                                   |
|--------------|-------------------------------------------------------------------|
| pasalVersion | <https://example.org/lex2kg/uu/2002/28/pasal/0010/versi/20201102> |

# Query_014

query:

```sparql
# Retrieve all subsections inserted by Omnibus Law into other laws and *optionally* the citations occurring in those subsections
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT ?ayat ?text ?citation WHERE {
  ?insertingPoint o:bagianDari+ <https://example.org/lex2kg/uu/2020/11>.
  ?insertingPoint o:menyisipkan ?insertedPasalVersion .
  ?ayat o:bagianDari+ ?insertedPasalVersion .
  ?ayat o:teks ?text .
  ?ayat o:teks ?textRef .
  OPTIONAL {?textRef o:merujuk ?citation}
}
ORDER BY ?ayat ?text ?citation
LIMIT 3
```

result:
| 0    |                                                                                                                                                                                                                     |
|------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ayat | <https://example.org/lex2kg/uu/1983/6/pasal/0027B/versi/20201102/ayat/0001>                                                                                                                                         |
| text | Wajib Pajak diberikan imbalan bunga dalam hal pengajuan keberatan, permohonan banding, atau permohonan peninjauan kembali yang dikabulkan sebagian atau seluruhnya sehingga menyebabkan kelebihan pembayaran pajak. |

| 1    |                                                                                                                                                                                                                     |
|------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ayat | <https://example.org/lex2kg/uu/1983/6/pasal/0027B/versi/20201102/ayat/0001/text>                                                                                                                                    |
| text | Wajib Pajak diberikan imbalan bunga dalam hal pengajuan keberatan, permohonan banding, atau permohonan peninjauan kembali yang dikabulkan sebagian atau seluruhnya sehingga menyebabkan kelebihan pembayaran pajak. |

| 2    |                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ayat | <https://example.org/lex2kg/uu/1983/6/pasal/0027B/versi/20201102/ayat/0002>                                                                                                                                                                                                                                                                                                                                                                                      |
| text | Imbalan bunga sebagaimana dimaksud pada ayat (1) diberikan terhadap kelebihan pembayaran pajak paling banyak sebesar jumlah lebih bayar yang disetujui Wajib Pajak dalam pembahasan akhir hasil pemeriksaan atas Surat Pemberitahuan yang menyatakan lebih bayar yang telah diterbitkan:\na. Surat Ketetapan Pajak Kurang Bayar,\nb. Surat Ketetapan Pajak Kurang Bayar Tambahan,\nc. Surat Ketetapan Pajak Lebih Bayar, atau\nd. Surat Ketetapan Pajak Nihil.\n |

# Query_015

query:

```sparql
# tampilkan legal document beserta yang ditimbangnya (menimbang)
PREFIX o: <https://example.org/lex2kg/ontology/>
PREFIX uu: <https://example.org/lex2kg/uu/>

SELECT DISTINCT ?penimbang ?ditimbang
WHERE {
  ?penimbang o:menimbang ?menimbang .
  ?menimbangText o:bagianDari* ?menimbang .
  ?menimbangText o:merujuk ?ditimbang .
  ?ditimbang a o:Peraturan
}
ORDER BY DESC(?penimbang) DESC(?ditimbang)
LIMIT 5
```

result:
| 0         |                                         |
|-----------|-----------------------------------------|
| penimbang | <https://example.org/lex2kg/uu/2020/8>  |
| ditimbang | <https://example.org/lex2kg/uu/2018/12> |

| 1         |                                        |
|-----------|----------------------------------------|
| penimbang | <https://example.org/lex2kg/uu/2020/6> |
| ditimbang | <https://example.org/lex2kg/uu/2020/2> |

| 2         |                                        |
|-----------|----------------------------------------|
| penimbang | <https://example.org/lex2kg/uu/2020/6> |
| ditimbang | <https://example.org/lex2kg/uu/2015/1> |

| 3         |                                        |
|-----------|----------------------------------------|
| penimbang | <https://example.org/lex2kg/uu/2020/6> |
| ditimbang | <https://example.org/lex2kg/uu/2014/1> |

| 4         |                                        |
|-----------|----------------------------------------|
| penimbang | <https://example.org/lex2kg/uu/2020/2> |
| ditimbang | <https://example.org/lex2kg/uu/2020/1> |

# Query_016

query:

```sparql
# select 10 legal document dengan pasal terbanyak
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT ?doc (COUNT(?pasal) as ?pasalCount)
WHERE {
  ?doc a o:Peraturan .
  ?doc o:pasal ?pasal .
}
GROUP BY ?doc
ORDER BY DESC(?pasalCount)
LIMIT 10

```

result:
| 0          |                                         |
|------------|-----------------------------------------|
| doc        | <https://example.org/lex2kg/uu/2014/17> |
| pasalCount | 377                                     |

| 1          |                                        |
|------------|----------------------------------------|
| doc        | <https://example.org/lex2kg/uu/2012/8> |
| pasalCount | 328                                    |

| 2          |                                        |
|------------|----------------------------------------|
| doc        | <https://example.org/lex2kg/uu/1981/8> |
| pasalCount | 286                                    |

| 3          |                                         |
|------------|-----------------------------------------|
| doc        | <https://example.org/lex2kg/uu/2006/11> |
| pasalCount | 230                                     |

| 4          |                                         |
|------------|-----------------------------------------|
| doc        | <https://example.org/lex2kg/uu/2009/22> |
| pasalCount | 223                                     |

| 5          |                                         |
|------------|-----------------------------------------|
| doc        | <https://example.org/lex2kg/uu/2003/13> |
| pasalCount | 206                                     |

| 6          |                                         |
|------------|-----------------------------------------|
| doc        | <https://example.org/lex2kg/uu/2009/36> |
| pasalCount | 205                                     |

| 7          |                                         |
|------------|-----------------------------------------|
| doc        | <https://example.org/lex2kg/uu/2020/11> |
| pasalCount | 186                                     |

| 8          |                                        |
|------------|----------------------------------------|
| doc        | <https://example.org/lex2kg/uu/2009/4> |
| pasalCount | 176                                    |

| 9          |                                         |
|------------|-----------------------------------------|
| doc        | <https://example.org/lex2kg/uu/2016/13> |
| pasalCount | 173                                     |

# Query_017

query:

```sparql
# tampilkan 10 dokumen yang pernah diamandemen
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT DISTINCT ?doc ?amenderDoc
WHERE {
  ?doc a o:Peraturan .
  ?pasal o:bagianDari ?doc .
  ?pasal o:versi ?pasalVersion .
  ?amender o:mengubah ?pasalVersion .
  ?amender o:bagianDari* ?amenderDoc .
  ?amenderDoc a o:Peraturan
}
ORDER BY ?doc ?amenderDoc
LIMIT 10
```

result:
| 0          |                                         |
|------------|-----------------------------------------|
| doc        | <https://example.org/lex2kg/uu/1981/2>  |
| amenderDoc | <https://example.org/lex2kg/uu/2020/11> |

| 1          |                                         |
|------------|-----------------------------------------|
| doc        | <https://example.org/lex2kg/uu/1983/6>  |
| amenderDoc | <https://example.org/lex2kg/uu/2020/11> |

| 2          |                                         |
|------------|-----------------------------------------|
| doc        | <https://example.org/lex2kg/uu/1983/7>  |
| amenderDoc | <https://example.org/lex2kg/uu/2020/11> |

| 3          |                                         |
|------------|-----------------------------------------|
| doc        | <https://example.org/lex2kg/uu/1983/8>  |
| amenderDoc | <https://example.org/lex2kg/uu/2020/11> |

| 4          |                                         |
|------------|-----------------------------------------|
| doc        | <https://example.org/lex2kg/uu/1992/25> |
| amenderDoc | <https://example.org/lex2kg/uu/2020/11> |

| 5          |                                         |
|------------|-----------------------------------------|
| doc        | <https://example.org/lex2kg/uu/1997/10> |
| amenderDoc | <https://example.org/lex2kg/uu/2020/11> |

| 6          |                                         |
|------------|-----------------------------------------|
| doc        | <https://example.org/lex2kg/uu/1997/5>  |
| amenderDoc | <https://example.org/lex2kg/uu/2020/11> |

| 7          |                                         |
|------------|-----------------------------------------|
| doc        | <https://example.org/lex2kg/uu/1999/36> |
| amenderDoc | <https://example.org/lex2kg/uu/2020/11> |

| 8          |                                         |
|------------|-----------------------------------------|
| doc        | <https://example.org/lex2kg/uu/1999/41> |
| amenderDoc | <https://example.org/lex2kg/uu/2020/11> |

| 9          |                                         |
|------------|-----------------------------------------|
| doc        | <https://example.org/lex2kg/uu/1999/5>  |
| amenderDoc | <https://example.org/lex2kg/uu/2020/11> |

# Query_018

query:

```sparql
# tampilkan 10 tempat disahkan paling banyak
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT ?location (COUNT(?doc) as ?docCount)
WHERE {
  ?doc o:disahkanDi ?location
}
GROUP BY ?location
ORDER BY DESC (?docCount)
```

result:
| 0        |         |
|----------|---------|
| location | Jakarta |
| docCount | 751     |

| 1        |          |
|----------|----------|
| location | Jakarta, |
| docCount | 6        |

| 2        |       |
|----------|-------|
| location | Jakar |
| docCount | 2     |

| 3        |            |
|----------|------------|
| location | Jogjakarta |
| docCount | 2          |

| 4        |   |
|----------|---|
| location | D |
| docCount | 1 |

| 5        |          |
|----------|----------|
| location | Djakarta |
| docCount | 1        |

| 6        |        |
|----------|--------|
| location | Jakart |
| docCount | 1      |

# Query_019

query:

```sparql
# tampilkan 10 dokumen paling banyak ditimbang
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT ?menimbangDoc (COUNT(?doc) as ?penimbangDocCount)
WHERE {
  ?doc o:menimbang ?menimbang ;
       a o:Peraturan .
  ?menimbangText o:bagianDari* ?menimbang ;
                 o:merujuk ?menimbangDoc .
  ?menimbangDoc a o:Peraturan .
}
GROUP BY ?menimbangDoc
ORDER BY DESC (?penimbangDocCount)
LIMIT 10

```

result:
| 0                 |                                         |
|-------------------|-----------------------------------------|
| menimbangDoc      | <https://example.org/lex2kg/uu/2004/15> |
| penimbangDocCount | 20                                      |

| 1                 |                                         |
|-------------------|-----------------------------------------|
| menimbangDoc      | <https://example.org/lex2kg/uu/2000/24> |
| penimbangDocCount | 10                                      |

| 2                 |                                        |
|-------------------|----------------------------------------|
| menimbangDoc      | <https://example.org/lex2kg/uu/1986/2> |
| penimbangDocCount | 6                                      |

| 3                 |                                         |
|-------------------|-----------------------------------------|
| menimbangDoc      | <https://example.org/lex2kg/uu/2009/47> |
| penimbangDocCount | 5                                       |

| 4                 |                                         |
|-------------------|-----------------------------------------|
| menimbangDoc      | <https://example.org/lex2kg/uu/2010/10> |
| penimbangDocCount | 5                                       |

| 5                 |                                         |
|-------------------|-----------------------------------------|
| menimbangDoc      | <https://example.org/lex2kg/uu/2013/23> |
| penimbangDocCount | 5                                       |

| 6                 |                                        |
|-------------------|----------------------------------------|
| menimbangDoc      | <https://example.org/lex2kg/uu/1983/6> |
| penimbangDocCount | 4                                      |

| 7                 |                                         |
|-------------------|-----------------------------------------|
| menimbangDoc      | <https://example.org/lex2kg/uu/2003/12> |
| penimbangDocCount | 4                                       |

| 8                 |                                         |
|-------------------|-----------------------------------------|
| menimbangDoc      | <https://example.org/lex2kg/uu/1985/17> |
| penimbangDocCount | 3                                       |

| 9                 |                                        |
|-------------------|----------------------------------------|
| menimbangDoc      | <https://example.org/lex2kg/uu/1992/9> |
| penimbangDocCount | 3                                      |

# Query_020

query:

```sparql
# tampilkan semua document yang melakukan amendment, dan banyaknya pasal yang diamendment oleh dokumen tersebut.
PREFIX o: <https://example.org/lex2kg/ontology/>
PREFIX uu: <https://example.org/lex2kg/uu/>

SELECT ?doc (COUNT(?point) as ?amendmentCount)
WHERE {
  ?doc a o:Peraturan .
  ?point o:bagianDari* ?doc .
  ?point o:mengubah|o:menyisipkan|o:menghapus ?pasalVersion .
}
GROUP BY (?doc)
ORDER BY DESC(?amendmentCount)
LIMIT 10
```

result:
| 0              |                                         |
|----------------|-----------------------------------------|
| doc            | <https://example.org/lex2kg/uu/2020/11> |
| amendmentCount | 1221                                    |

| 1              |                                        |
|----------------|----------------------------------------|
| doc            | <https://example.org/lex2kg/uu/2011/8> |
| amendmentCount | 20                                     |

| 2              |                                         |
|----------------|-----------------------------------------|
| doc            | <https://example.org/lex2kg/uu/2009/26> |
| amendmentCount | 11                                      |

# Query_021

query:

```sparql
# Count triples about document structure
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT (COUNT (*) as ?countResult) WHERE {
  ?s
    o:nomor|
    o:judul|
    o:bab|
    o:bagian|
    o:paragraf|
    o:pasal|
    o:ayat|
    o:huruf|
    o:segmen|
    o:daftarBab|
    o:daftarBagian|
    o:daftarParagraf|
    o:daftarPasal|
    o:daftarAyat|
    o:daftarHuruf|
    o:tanggal|
    o:jenisVersi|
    o:versi|
    o:menimbang|
    o:mengingat|
    o:bagianDari
  ?o
} 
```

result:
| 0           |        |
|-------------|--------|
| countResult | 714888 |

# Query_022

query:

```sparql
# Count triples about document metadata
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT (COUNT (*) as ?countResult) WHERE {
  ?s
    o:yurisdiksi|
    o:jenisPeraturan|
    o:tahun|
    o:bahasa|
    o:tentang|
    o:disahkanPada|
    o:disahkanDi|
    o:disahkanOleh|
    o:jabatanPengesah
  ?o
} 
```

result:
| 0           |      |
|-------------|------|
| countResult | 6869 |

# Query_023

query:

```sparql
# Count triples about document text
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT (COUNT (*) as ?countResult) WHERE {
  ?s
    o:teks
  ?o
} 
```

result:
| 0           |        |
|-------------|--------|
| countResult | 152301 |

# Query_024

query:

```sparql
# Count triples about document citation
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT (COUNT (*) as ?countResult) WHERE {
  ?s o:merujuk ?o
} 

```

result:
| 0           |       |
|-------------|-------|
| countResult | 31325 |

# Query_025

query:

```sparql
# Count triples about document change
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT (COUNT (*) as ?countResult) WHERE {
  ?s o:mengubah|o:menghapus|o:menyisipkan ?o
} 

```

result:
| 0           |      |
|-------------|------|
| countResult | 1252 |

# Query_026

query:

```sparql
# Count triples about class assignment
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT (COUNT (*) as ?countResult) WHERE {
  ?s a ?o
} 

```

result:
| 0           |        |
|-------------|--------|
| countResult | 256416 |

# Query_100

query:

```sparql
# tampilkan semua triple
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT * 
WHERE {
  ?s ?p ?o .
} 
ORDER BY ?s ?p ?o
LIMIT 3
```

result:
| 0 |                                                   |
|---|---------------------------------------------------|
| s | <https://example.org/lex2kg/uu/1950/1>            |
| p | <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> |
| o | <https://example.org/lex2kg/ontology/Peraturan>   |

| 1 |                                              |
|---|----------------------------------------------|
| s | <https://example.org/lex2kg/uu/1950/1>       |
| p | <https://example.org/lex2kg/ontology/bahasa> |
| o | id                                           |

| 2 |                                                    |
|---|----------------------------------------------------|
| s | <https://example.org/lex2kg/uu/1950/1>             |
| p | <https://example.org/lex2kg/ontology/daftarPasal>  |
| o | <https://example.org/lex2kg/uu/1950/1/daftarPasal> |

# Query_101

query:

```sparql
# tampilkan 10 legal doc pertama
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT * 
WHERE {
  ?legalDoc a o:Peraturan
} 
ORDER BY ?legalDoc
LIMIT 10
```

result:
| 0        |                                        |
|----------|----------------------------------------|
| legalDoc | <https://example.org/lex2kg/uu/1950/1> |

| 1        |                                         |
|----------|-----------------------------------------|
| legalDoc | <https://example.org/lex2kg/uu/1950/14> |

| 2        |                                         |
|----------|-----------------------------------------|
| legalDoc | <https://example.org/lex2kg/uu/1950/15> |

| 3        |                                        |
|----------|----------------------------------------|
| legalDoc | <https://example.org/lex2kg/uu/1950/2> |

| 4        |                                        |
|----------|----------------------------------------|
| legalDoc | <https://example.org/lex2kg/uu/1950/3> |

| 5        |                                        |
|----------|----------------------------------------|
| legalDoc | <https://example.org/lex2kg/uu/1950/4> |

| 6        |                                        |
|----------|----------------------------------------|
| legalDoc | <https://example.org/lex2kg/uu/1950/5> |

| 7        |                                        |
|----------|----------------------------------------|
| legalDoc | <https://example.org/lex2kg/uu/1950/6> |

| 8        |                                         |
|----------|-----------------------------------------|
| legalDoc | <https://example.org/lex2kg/uu/1953/10> |

| 9        |                                         |
|----------|-----------------------------------------|
| legalDoc | <https://example.org/lex2kg/uu/1953/18> |

# Query_102

query:

```sparql
# tampilkan semua UU yang disahkan setelah 10 Oktober 2019
PREFIX o: <https://example.org/lex2kg/ontology/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT *
WHERE {
  ?legalDoc o:disahkanPada ?date .
  FILTER ( ?date >= "2019-10-10"^^xsd:date )
}
ORDER BY ?legalDoc

```

result:
| 0        |                                         |
|----------|-----------------------------------------|
| legalDoc | <https://example.org/lex2kg/uu/2019/17> |
| date     | 2019-10-15                              |

| 1        |                                         |
|----------|-----------------------------------------|
| legalDoc | <https://example.org/lex2kg/uu/2019/18> |
| date     | 2019-10-15                              |

| 2        |                                         |
|----------|-----------------------------------------|
| legalDoc | <https://example.org/lex2kg/uu/2019/20> |
| date     | 2019-10-18                              |

| 3        |                                         |
|----------|-----------------------------------------|
| legalDoc | <https://example.org/lex2kg/uu/2019/21> |
| date     | 2019-10-18                              |

| 4        |                                         |
|----------|-----------------------------------------|
| legalDoc | <https://example.org/lex2kg/uu/2019/22> |
| date     | 2019-10-18                              |

| 5        |                                         |
|----------|-----------------------------------------|
| legalDoc | <https://example.org/lex2kg/uu/2019/23> |
| date     | 2019-10-24                              |

| 6        |                                         |
|----------|-----------------------------------------|
| legalDoc | <https://example.org/lex2kg/uu/2019/24> |
| date     | 2019-10-24                              |

| 7        |                                        |
|----------|----------------------------------------|
| legalDoc | <https://example.org/lex2kg/uu/2020/1> |
| date     | 2020-02-28                             |

| 8        |                                         |
|----------|-----------------------------------------|
| legalDoc | <https://example.org/lex2kg/uu/2020/10> |
| date     | 2020-10-26                              |

| 9        |                                         |
|----------|-----------------------------------------|
| legalDoc | <https://example.org/lex2kg/uu/2020/11> |
| date     | 2020-11-02                              |

| 10       |                                         |
|----------|-----------------------------------------|
| legalDoc | <https://example.org/lex2kg/uu/2020/12> |
| date     | 2020-11-02                              |

| 11       |                                         |
|----------|-----------------------------------------|
| legalDoc | <https://example.org/lex2kg/uu/2020/13> |
| date     | 2020-11-02                              |

| 12       |                                        |
|----------|----------------------------------------|
| legalDoc | <https://example.org/lex2kg/uu/2020/2> |
| date     | 2020-05-16                             |

| 13       |                                        |
|----------|----------------------------------------|
| legalDoc | <https://example.org/lex2kg/uu/2020/4> |
| date     | 2020-08-05                             |

| 14       |                                        |
|----------|----------------------------------------|
| legalDoc | <https://example.org/lex2kg/uu/2020/5> |
| date     | 2020-08-05                             |

| 15       |                                        |
|----------|----------------------------------------|
| legalDoc | <https://example.org/lex2kg/uu/2020/6> |
| date     | 2020-08-11                             |

| 16       |                                        |
|----------|----------------------------------------|
| legalDoc | <https://example.org/lex2kg/uu/2020/8> |
| date     | 2020-10-13                             |

| 17       |                                        |
|----------|----------------------------------------|
| legalDoc | <https://example.org/lex2kg/uu/2020/9> |
| date     | 2020-10-26                             |

# Query_103

query:

```sparql
# tampilkan 10 bab dengan substring "Kerja"
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT ?bab ?title
WHERE {
  ?doc a o:Peraturan .
  ?bab o:bagianDari* ?doc .
  ?bab a o:Bab .
  ?bab o:judul ?title.
  FILTER REGEX(str(?title), "KERJA")
}
ORDER BY ?bab ?title
LIMIT 10

```

result:
| 0     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
|-------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| bab   | <https://example.org/lex2kg/uu/1962/12/bab/0005>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| title | RENCANA KERJA TAHUNAN DAN PENGAWASAN OLEH PEMERINTAH. Pasal 18. (1) Selambat - lambatnya 3 bulan sebelum tahun buku baru mulai berjalan Direksi menyampaikan re ncana kerja tahunan kepada Badan Pengawas untuk disetujui. (2) Rencana kerja tahunan memuat secara terperinci proyek - proyek yang akan dilaksanakan dan untuk tiap proyek disebut anggaran pembiayaannya disertai penjelasan mengenai sumber dan asalnya, baik da ri dalam maupun luar negeri. (3) a. Segala perubahan atas rencana dimaksudkan pada ayat (1) dapat diadakan oleh Badan Pengawas setelah dirundingkan dengan Direksi. b. Badan Pengawas selekas mungkin memberikan persetujuannya atas rencana kerja tahunan deng an ketentuan, bahwa paling lambat sebulan sebelum tahun buku baru mulai berjalan rencana yang disetujuinya itu sudah sampai kepada Pemerintah untuk disahkan. c. Kecuali apabila sebelum menginjak tahun buku baru Pemerintah mengemukakan keberatan atau menol ak proyek yang dimuat dalam rencana kerja tahunan, rencana tersebut berlaku sepenuhnya. d. Pengesahan rencana kerja tahunan yang mengenai proyek - proyek yang akan dibiayai sebagian atau seluruhnya dengan kredit luar negeri dilaksanakan de ngan mengingat ketentuan tersebut dalam pasal 5 ayat (1) sub c. (4) Rencana kerja tahunan tambahan atau perubahan - perubahannya yang terjadi dalam tahun buku yang bersangkutan harus mendapat persetujuan terlebih dahulu dari Badan Pengawas dan baru dapat di jalankan setelah disahkan oleh Pemerintah. (5) Khusus mengenai proyek - proyek yang pembiayaannya direncanakan akan bersumber baik sebagian maupun seluruhnya pada kredit luar negeri dan telah disahkan Pemerintah, Pemerintah memberikan keterangan kepada Dewan Perwakilan Rakyat Gotong Royong. Pasal 19. (1) Untuk menjamin agar supaya tugas Bank dilaksanakan dalam rangka pembangunan semesta, maka Badan Pengawas dalam menentukan dan Melaksanakan kebijaksanaan Bank diawasi oleh Menteri Urusan Bank Sentral. (2) Pengawasan teknis perbankan dan perusahaan dijalankan oleh Bank Indonesia. |

| 1     |                                                         |
|-------|---------------------------------------------------------|
| bab   | <https://example.org/lex2kg/uu/1973/5/bab/0005>         |
| title | PEMBAGIAN TUGAS DAN TATA KERJA BADAN PEMERIKSA KEUANGAN |

| 2     |                                                 |
|-------|-------------------------------------------------|
| bab   | <https://example.org/lex2kg/uu/1979/5/bab/0004> |
| title | KERJASAMA DAN PENYELESAIAN PERSELISIHAN         |

| 3     |                                                                                |
|-------|--------------------------------------------------------------------------------|
| bab   | <https://example.org/lex2kg/uu/1992/11/bab/0003>                               |
| title | DANA PENSIUN PEMBERI KERJA Bagian Pertama Pembentukan dan Tata Cara Pengesahan |

| 4     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
|-------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| bab   | <https://example.org/lex2kg/uu/1997/16/bab/0006>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| title | KOORDINASI DAN KERJA SAMA Pasal 17 (1) Koordinasi dan kerja sama penyelenggaraan statistik dilakukan oleh Badan dengan instansi pemerintah dan masyarakat, di tingkat pusat dan daerah. (2) Dalam rangka mewujudkan dan mengembangkan Sistem Statistik Nasional, Badan bekerja sama den gan instansi pemerintah dan masyarakat untuk membangun pembakuan konsep, defenisi, klasifikasi dan ukuran - ukuran. (3) Koordinasi dan kerja sama sebagaimana dimaksud dalam ayat (1) dilaksanakan atas dasar kemitraan dan dengan tetap mengantisipasi serta mene rapkan perkembangan ilmu pengetahuan dan tehnologi. (4) Ketentuan mengenai tata cara dan lingkup koordinasi dan kerja sama penyelenggaraan statistik antara Badan, instansi pemerintah, dan masyarakat diatur lebih lanjut dengan Keputusan Presiden. Pasal 18 (1) Kerja sama penyelenggaraan statistik dapat juga dilakukan oleh Badan, instansi pemerintah, dan atau masyarakat dengan lembaga internasional, negara asing, atau lembaga swasta asing sesuai dengan peraturan perundang - undangan yang berlaku. (2) Kerja sama penyelenggara statistik sebagaimana dimaksud dalam ayat (1) didasarkan pada prinsip bahwa penyelenggara utama adalah Badan, instansi pemerintah atau masyarakat Indonesia. |

| 5     |                                                        |
|-------|--------------------------------------------------------|
| bab   | <https://example.org/lex2kg/uu/1997/25/bab/0004>       |
| title | PERENCANAAN TENAGA KERJA DAN INFORMASI KETENAGAKERJAAN |

| 6     |                                                  |
|-------|--------------------------------------------------|
| bab   | <https://example.org/lex2kg/uu/1997/25/bab/0005> |
| title | HUBUNGAN KERJA                                   |

| 7     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|-------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| bab   | <https://example.org/lex2kg/uu/1997/25/bab/0008>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| title | PELATIHAN KERJA Pasal 119 Pelatihan kerja diselenggarakan dan diarahkan untuk membekali dan/atau meningkatkan dan/atau mengembangkan keterampilan atau keahlian kerja guna meningkatkan kemampuan, produktivitas, dan kesejahteraan tenaga kerja. Pasal 120 (Jd) Pelatihan kerja dilaksanakan dengan memperhatikan kebutuhan pasar kerja dan dunia usaha, baik di dalam maupun di luar hubungan kerja. (2) Pelatihan kerja diselenggarakan berdasarkan program pelatihan yang mengacu pada standar kualifikasi keterampilan atau keahlian. (3) Pelatihan kerja dilakukan secara berjenjang. FAX NG 19 W, 17 Ng 07 Kp — 56 — Pasal 121 Setiap tenaga kerja berhak untuk memperoleh dan/atau meningkatkan dan/atau mengembangkan keterampilan dan/atau keahlian kerja sesuai dengan bakat, minat, dan kemampuannya melalui pelatihan kerja. Pasal 122 (Jd) Setiap pekerja memiliki kesempatan yang sama untuk mengikuti pelatihan kerja sesuai dengan bidang tugasnya. (2) Pengusaha bertanggung jawab atas pemberian kesempatan kepada pekerjanya untuk meningkatkan dan/atau mengembangkan keterampilan dan/atau keahlian kerja melalui pelatihan kerja. Pasal 123 Pelatihan kerja diselenggarakan oleh lembaga pelatihan kerja pemerintah, swasta, dan perusahaan yang dilaksanakan di tempat kerja dan tempat pelatihan kerja. Pasal 124 (dl) Pelatihan kerja yang diselenggarakan oleh lembaga pelatihan kerja swasta wajib memperoleh izin Menteri. (2) Untuk memperoleh izin sebagaimana dimaksud pada ayat (1), lembaga pelatihan kerja swasta harus berbentuk badan hukum Indonesia dan mengikuti tata cara perizinan sesuai dengan ketentuan peraturan perundang-undangan yang berlaku. GP . AF S 9 7 W Y, V7 Ni 77 TN Nay, Mn '£ Lapol — 57 — (3) Tata cara perizinan penyelenggaraan pelatihan kerja oleh lembaga pelatihan kerja swasta ditetapkan oleh Menteri. Pasal 125 Penyelenggara pelatihan kerja wajib memenuhi persyaratan: a. tersedianya tenaga kepelatihan, b. tersedianya dana bagi kelangsungan kegiatan penyelenggaraan pelatihan kerja, Cc. kurikulum: d. akreditasi: e. sarana dan prasarana pelatihan kerja. Pasal 126 (d) Pemerintah dapat menghentikan pelaksanaan penyelenggaraan pelatihan kerja, apabila di dalam pelaksanaannya ternyata: a. tidak sesuai dengan arah pelatihan kerja sebagaimana dimaksud dalam Pasal 119: b. tidak memenuhi persyaratan sebagaimana dimaksud dalam Pasal 125. (2) Penghentian pelaksanaan penyelenggaraan pelatihan kerja sebagaimana dimaksud pada ayat (1), dapat mengakibatkan dicabutnya izin penyelenggaraan pelatihan kerja. FAX NG 19 W, 17 Ng 07 Kp — 58 — Pasal 127 (l) Tenaga kerja berhak memperoleh pengakuan kualifikasi keterampilan dan/atau keahlian kerja setelah mengikuti pelatihan kerja yang diselenggarakan Pemerintah, atau swasta, atau perusahaan. (2) Pengakuan kualifikasi keterampilan atau keahlian kerja sebagaimana dimaksud pada ayat (1), dilakukan melalui sertifikasi keterampilan atau keahlian kerja. (3) Sertifikasi keterampilan atau keahlian kerja sebagaimana dimaksud pada ayat (2), dapat diikuti oleh tenaga kerja yang berpengalaman kerja. (4) Untuk melaksanakan sertifikasi keterampilan atau keahlian kerja dibentuk lembaga sertifikasi berdasarkan profesi yang unsurnya terdiri dari Pemerintah, asosiasi profesi, asosiasi perusahaan, serikat pekerja, dan pakar di bidangnya. Pasal 128 Pelatihan kerja yang pesertanya terdapat tenaga kerja penyandang cacat dilaksanakan dengan memperhatikan jenis, derajat kecacatan, dan kemampuan tenaga kerja penyandang cacat yang bersangkutan. Pasal 129 Untuk mendukung peningkatan pelatihan kerja dalam rangka pembangunan ketenagakerjaan, dikembangkan sistem pelatihan kerja nasional. FAX NG 19 W, 17 Ng 07 Kp — 5 9 — Pasal 130 Pemerintah melakukan pembinaan program dan informasi pelatihan kerja, baik yang diselenggarakan oleh Pemerintah, swasta, maupun perusahaan. Pasal 131 (d) Untuk memenuhi kebutuhan tenaga kerja pada pasar kerja dan dunia usaha, pelatihan kerja dapat diselenggarakan dengan sistem pemagangan. (2) Pemagangan dimaksudkan untuk meningkatkan dan/atau mengembangkan keterampilan atau keahlian kerja dengan bekerja secara langsung dalam proses produksi barang atau jasa di perusahaan. Pasal 132 (d) Pemagangan wajib diselenggarakan berdasarkan program pemagangan yang disusun berdasarkan persyaratan dan kualifikasi jabatan. (2) Program pemagangan sebagaimana dimaksud pada ayat (1), dapat dilaksanakan secara berjenjang sesuai dengan jenjang jabatan dalam perusahaan. FAX NG 19 W, 17 Ng 07 Kp — 60 — Pasal 133 (d) Pemagangan dilaksanakan atas dasar perjanjian pemagangan antara peserta dan pengusaha. (2) Perjanjian pemagangan sebagaimana dimaksud pada ayat (1), sekurang-kurangnya memuat ketentuan hak serta kewajiban peserta dan pengusaha serta jangka waktu pemagangan. (3) Pemagangan yang diselenggarakan tidak melalui perjanjian pemagangan sebagaimana dimaksud pada ayat (2), dianggap tidak sah dan status peserta dianggap sebagai pekerja perusahaan. Pasal 134 Tenaga kerja yang telah mengikuti program pemagangan berhak atas pengakuan kualifikasi keterampilan atau keahlian kerja dari perusahaan atau Pemerintah. Pasal 135 Pemagangan dapat dilaksanakan di perusahaan sendiri maupun bekerjasama dengan tempat penyelenggarakan pelatihan kerja atau perusahaan lain, baik di dalam maupun di luar wilayah Indonesia. Pasal 136 (l) Pemagangan yang dilaksanakan di luar wilayah Indonesia harus mendapat izin dari Menteri. — el — (2) Untuk memperoleh izin sebagaimana dimaksud pada ayat (1), penyelenggara pemagangan harus berbentuk badan hukum Indonesia sesuai dengan ketentuan peraturan perundang-undangan yang berlaku. (3) Tata cara perizinan pemagangan di luar wilayah Indonesia sebagaimana dimaksud pada ayat (1) dan ayat (2), diatur lebih lanjut oleh Menteri. Pasal 137 (l) Penyelenggaraan pemagangan ke luar wilayah Indonesia wajib memperhatikan: a. harkat dan martabat bangsa Indonesia, b. penguasaan keterampilan dan keahlian yang lebih tinggi, c. perlindungan dan kesejahteraan peserta pemagangan. (2) Pemerintah dapat menghentikan pelaksanaan pemagangan ke luar wilayah Indonesia apabila di dalam pelaksanaannya ternyata tidak sesuai dengan ketentuan tersebut pada ayat (1). Pasal 138 (d) Pemerintah dapat mewajibkan kepada perusahaan yang memenuhi persyaratan yang ditetapkan oleh Pemerintah untuk melaksanakan pelatihan kerja pemagangan. (2) Dalam menetapkan persyaratan sebagaimana dimaksud pada ayat (Jd), Pemerintah harus memperhatikan kepentingan perusahaan. FAX NG 19 W, 17 Ng 07 Kp — 62 — Pasal 139 (d) Untuk memberikan saran dan pertimbangan dalam penetapan kebijakan pelatihan kerja dan pemagangan dibentuk Dewan Pelatihan Kerja Nasional yang terdiri dari unsur Tripartit yang diperluas. (2) Anggota Dewan Pelatihan Kerja Nasional sebagaimana dimaksud pada ayat (1), diangkat dan diberhentikan oleh Presiden. Pasal 140 (d) Pembinaan pelatihan kerja dan pemagangan ditujukan ke arah peningkatan relevansi, kualitas, dan efisiensi penyelenggaraan pelatihan kerja dan pemagangan dalam rangka meningkatkan produktivitas. (2) Peningkatan produktivitas sebagaimana dimaksud pada ayat (1), dilakukan melalui pengembangan budaya produktif, etos kerja, teknologi, dan efisiensi kegiatan ekonomi, menuju terwujudnya produktivitas nasional. Pasal 141 (d) Untuk memberikan saran dan pertimbangan dalam penetapan kebijakan peningkatan produktivitas nasional, dibentuk lembaga produktivitas nasional. (2) Anggota lembaga produktivitas nasional sebagaimana dimaksud pada ayat (1), diangkat dan diberhentikan oleh Presiden. — 63 — Pasal 142 Ketentuan mengenai: a. tata cara penetapan standar kualifikasi keterampilan atau keahlian kerja, b. organisasi, tata kerja, dan akreditasi lembaga sertifikasi keterampilan atau keahlian kerja, c. bentuk, mekanisme, dan kelembagaan sistem pelatihan kerja nasional: d. persyaratan — perusahaan yang diwajibkan melaksanakan pemagangan, e. organisasi dan tata kerja Dewan Pelatihan Kerja Nasional, f. organisasi dan tata kerja lembaga produktivitas nasional, diatur lebih lanjut dengan Peraturan Pemerintah. |

| 8     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
|-------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| bab   | <https://example.org/lex2kg/uu/1997/25/bab/0009>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| title | PELAYANAN PENEMPATAN TENAGA KERJA Pasal 143 (l) Pelayanan penempatan tenaga kerja diarahkan untuk menempatkan tenaga kerja yang tepat pada pekerjaan yang tepat sesuai dengan keterampilan, keahlian, dan kemampuan. (2) Pelayanan penempatan tenaga kerja dilaksanakan dengan memperhatikan kodrat, harkat, martabat, perlindungan, dan kesejahteraan tenaga kerja tanpa diskriminasi. — 64 — Pasal 144 Setiap tenaga kerja mempunyai hak dan kesempatan yang sama untuk memperoleh pelayanan penempatan tenaga kerja di dalam dan/atau di luar wilayah Indonesia. Pasal 145 Pelayanan penempatan tenaga kerja dapat diselenggarakan oleh Pemerintah dan/atau masyarakat. Pasal 146 (d) Pelayanan penempatan tenaga kerja yang diselenggarakan oleh masyarakat hanya dapat dilakukan atas dasar izin Menteri. (2) Untuk memperoleh izin sebagaimana dimaksud pada ayat (1), penyelenggara pelayanan penempatan tenaga kerja oleh masyarakat harus dibentuk badan hukum Indonesia sesuai dengan ketentuan peraturan perundang-undangan yang berlaku. (3) Tata cara perizinan penyelenggaraan pelayanan penempatan tenaga kerja oleh masyarakat ditetapkan oleh Menteri. Pasal 147 (l) Penyelenggara pelayanan penempatan tenaga kerja oleh masyarakat wajib memenuhi persyaratan: a. adanya tenaga kerja yang akan ditempatkan, — 6 5 — b. tersedianya dana bagi kelangsungan kegiatan penyelenggaraan pelayanan penempatan tenaga kerja, c. jaminan perlindungan bagi tenaga kerja yang ditempatkan, d. informasi pasar kerja bagi tenaga kerja yang akan ditempatkan, e. tersedianya sarana dan prasarana pendidikan dan pelatihan kerja bagi tenaga kerja yang akan ditempatkan. (2) Jaminan perlindungan sebagaimana dimaksud pada ayat (1) huruf c, meliputi: a. perjanjian penempatan secara tertulis antara penyelenggara dan pengguna tenaga kerja, b. perjanjian penempatan secara tertulis antara penyelenggara dan tenaga kerja, c. perjanjian kerja secara tertulis antara pengguna dan tenaga kerja, d. perlindungan keselamatan dan kesehatan kerja serta kesejahteraan tenaga kerja mulai keberangkatan dari daerah asal, selama bekerja, sampai dengan kembali ke daerah asal. Pasal 148 (d) Pemerintah dapat menghentikan pelaksanaan penyelenggaraan pelayanan penempatan tenaga kerja apabila di dalam pelaksanaannya ternyata: a. tidak sesuai dengan ketentuan sebagaimana dimaksud dalam Pasal 143: b. tidak sesuai dengan ketentuan sebagaimana dimaksud dalam Pasal 147. — 66 — (2) Penghentian pelaksanaan penyelenggaraan pelayanan penempatan tenaga kerja sebagaimana dimaksud pada ayat (1), dapat mengakibatkan dicabutnya izin penyelenggara pelayanan penempatan tenaga kerja. Pasal 149 Penyelenggara pelayanan penempatan tenaga kerja dapat menetapkan standar dan/atau persyaratan kualifikasi bagi tenaga kerja yang akan ditempatkan sesuai dengan persyaratan jabatan yang akan ditempati. Pasal 150 (l) Penyelenggara pelayanan penempatan tenaga kerja ke luar wilayah Indonesia harus memiliki rencana penempatan tenaga kerja yang disahkan oleh Menteri. (2) Rencana penempatan tenaga kerja sebagaimana dimaksud pada ayat (1), sekurang-kurangnya memuat keterangan tentang: a. negara tujuan, b. jumlah tenaga kerja yang akan ditempatkan, c. jenis jabatan, d. kualifikasi keterampilan dan keahlian. Pasal 151 Ketentuan mengenai persyaratan, tata cara perizinan, hak, kewajiban, dan pelaporan penyelenggara oleh masyarakat serta persyaratan tenaga kerja dalam pelayanan penempatan tenaga kerja di dalam dan/atau di luar wilayah Indonesia, diatur lebih lanjut dengan Peraturan Pemerintah. — 67 — |

| 9     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|-------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| bab   | <https://example.org/lex2kg/uu/1997/25/bab/0010>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| title | TENAGA KERJA WARGA NEGARA ASING Pasal 152 (d) Tenaga kerja warga negara asing hanya dapat bekerja di wilayah Indonesia atas dasar izin Menteri. (2) Penggunaan tenaga kerja warga negara asing dilaksanakan secara selektif dalam rangka pendayagunaan tenaga kerja Indonesia secara optimal dan alih teknologi. (3) Perusahaan yang menggunakan tenaga kerja warga negara asing wajib memiliki izin Menteri. Pasal 153 (l) Perusahaan yang mempekerjakan tenaga kerja warga negara asing wajib memiliki rencana penggunaan tenaga kerja warga negara asing yang disahkan oleh Menteri. (2) Rencana penggunaan tenaga kerja warga negara asing sebagaimana dimaksud pada ayat (1), sekurang-kurangnya memuat keterangan: a. alasan penggunaan tenaga kerja warga negara asing, b. jabatan dan/atau kedudukan tenaga kerja warga negara asing dalam struktur organisasi perusahaan yang bersangkutan, c. jangka waktu penggunaan tenaga kerja warga negara asing, d. penunjukan tenaga kerja warga negara Indonesia sebagai pendamping tenaga kerja warga negara asing yang dipekerjakan. — 68 — (3) Tata cara pengesahan rencana penggunaan tenaga kerja warga negara asing ditetapkan oleh Menteri. Pasal 154 Dalam rangka pendayagunaan dan penyediaan tenaga kerja yang sesuai dengan pembangunan nasional, Menteri menetapkan jabatan dan standar kompetensi bagi setiap tenaga kerja warga negara asing yang bekerja di perusahaan. Pasal 155 Perusahaan yang mempekerjakan tenaga kerja warga negara asing wajib: a. menunjuk tenaga kerja warga negara Indonesia sebagai tenaga pendamping tenaga kerja warga negara asing yang dipekerjakan, b. melaksanakan pendidikan dan pelatihan kerja bagi tenaga kerja warga Negara Indonesia sebagaimana dimaksud pada huruf a, yang sesuai dengan jabatan yang diduduki oleh tenaga kerja warga negara asing. Pasal 156 (Jd) Setiap perusahaan yang mempekerjakan tenaga kerja warga negara asing dikenakan pungutan untuk setiap tenaga kerja warga negara asing yang dipekerjakan. (2) Besarnya pungutan sebagaimana dimaksud pada ayat (1), ditetapkan dengan Peraturan Pemerintah. FAX NG 19 W, 17 Ng 07 Kp — 6 9 — Pasal 157 Ketentuan mengenai persyaratan, tata cara perizinan, perencanaan, pengendalian dan pengawasan, jenis jabatan, dan pelaporan dalam penggunaan tenaga kerja warga negara asing, diatur lebih lanjut dengan Peraturan Pemerintah. |

# Query_104

query:

```sparql
# show raw text of UU 2007 No.26 Pasal 1 version 20201102
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT *
WHERE {
  <https://example.org/lex2kg/uu/2007/26/pasal/0001/versi/20201102> o:teks ?o
}
```

result:
| 0 |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|---|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| o | Dalam Undang-Undang ini yang dimaksud dengan:\n1. Ruang adalah wadah yang meliputi ruang darat, ruang laut, dan ruang udara, termasuk ruang di dalam bumi sebagai satu kesatuan wilayah, tempat manusia dan makhluk lain hidup, melakukan kegiatan, dan memelihara kelangsungan hidupnya.\n2. Tata ruang adalah wujud struktur ruang dan pola ruang.\n3. Struktur ruang adalah susunan pusat-pusat permukiman dan sistem jaringan prasarana dan sarana yang berfungsi sebagai pendukung kegiatan sosial ekonomi masyarakat yang secara hierarki memiliki hubungan fungsional.\n4. Pola ruang adalah distribusi peruntukan ruang dalam suatu wilayah yang meliputi peruntukan ruang untuk fungsi lindung dan peruntukan ruang untuk fungsi budi daya. an\n5. Penataan ruang adalah suatu sistem perencanaan tata ruang, pemanfaatan ruang, dan pengendalian pemanfaatan ruang.\n6. Penyelenggaraan penataan ruang adalah kegiatan yang meliputi pengaturan, pembinaan, pelaksanaan, dan pengawasan penataan ruang.\n7. Pemerintah Pusat adalah Presiden Republik Indonesia yang memegang kekuasaan pemerintahan negara Republik Indonesia yang dibantu oleh Wakil Presiden dan menteri sebagaimana dimaksud dalam Undang- Undang Dasar Negara Republik Indonesia Tahun 1945.\n8. Pemerintah Daerah adalah kepala daerah sebagai unsur penyelenggara Pemerintahan Daerah yang memimpin pelaksanaan urusan pemerintahan yang menjadi kewenangan daerah otonom.\n9. Pengaturan penataan ruang adalah upaya pembentukan landasan hukum bagi Pemerintah Pusat, Pemerintah Daerah, dan masyarakat dalam penataan ruang.\n10. Pembinaan penataan ruang adalah upaya untuk meningkatkan kinerja penataan ruang yang diselenggarakan oleh Pemerintah Pusat, Pemerintah Daerah, dan masyarakat.\n11. Pelaksanaan penataan ruang adalah upaya pencapaian tujuan penataan ruang melalui pelaksanaan perencanaan tata ruang, pemanfaatan ruang, dan pengendalian pemanfaatan ruang.\n12. Pengawasan penataan ruang adalah upaya agar penyelenggaraan penataan ruang dapat diwujudkan sesuai dengan ketentuan peraturan perundang- undangan.\n13. Perencanaan tata ruang adalah suatu proses untuk menentukan struktur ruang dan pola ruang yang meliputi penyusunan dan penetapan rencana tata ruang.\n14. Pemanfaatan ruang adalah upaya untuk mewujudkan struktur ruang dan pola ruang sesuai dengan rencana tata ruang melalui penyusunan dan pelaksanaan program beserta pembiayaannya.\n15. Pengendalian pemanfaatan ruang adalah upaya untuk mewujudkan tertib tata ruang.\n16. Rencana tata ruang adalah hasil perencanaan tata ruang.\n17. Wilayah adalah ruang yang merupakan kesatuan geografis beserta segenap unsur terkait yang batas dan sistemnya ditentukan berdasarkan aspek administratif dan/atau aspek fungsional.\n18. Sistem wilayah adalah struktur ruang dan pola ruang yang mempunyai jangkauan pelayanan pada tingkat wilayah.\n19. Sistem internal perkotaan adalah struktur ruang dan pola ruang yang mempunyai jangkauan pelayanan pada tingkat internal perkotaan.\n20. Kawasan adalah wilayah yang memiliki fungsi utama lindung atau budi daya.\n21. Kawasan lindung adalah wilayah yang ditetapkan dengan fungsi utama melindungi kelestarian lingkungan hidup yang mencakup sumber daya alam dan sumber daya buatan.\n22. Kawasan budi daya adalah wilayah yang ditetapkan dengan fungsi utama untuk dibudidayakan atas dasar kondisi dan potensi sumber daya alam, sumber daya manusia, dan sumber daya buatan.\n23. Kawasan perdesaan adalah wilayah yang mempunyai kegiatan utama pertanian, termasuk pengelolaan sumber daya alam dengan susunan fungsi kawasan sebagai tempat permukiman perdesaan, pelayanan jasa pemerintahan, pelayanan sosial, dan kegiatan ekonomi.\n24. Kawasan agropolitan adalah kawasan yang terdiri atas satu atau lebih pusat kegiatan pada wilayah perdesaan sebagai sistem produksi pertanian dan pengelolaan sumber daya alam tertentu yang ditunjukkan oleh adanya keterkaitan fungsional dan hierarki keruangan satuan sistem permukiman dan sistem agrobisnis.\n25. Kawasan perkotaan adalah wilayah yang mempunyai kegiatan utama bukan pertanian dengan susunan fungsi kawasan sebagai tempat permukiman perkotaan, pemusatan dan distribusi pelayanan jasa pemerintahan, pelayanan sosial, dan kegiatan ekonomi.\n26. Kawasan metropolitan adalah kawasan perkotaan yang terdiri atas sebuah kawasan perkotaan yang berdiri sendiri atau kawasan perkotaan inti dengan kawasan perkotaan di sekitarnya yang saling memiliki keterkaitan fungsional yang dihubungkan dengan sistem jaringan prasarana wilayah yang terintegrasi dengan jumlah penduduk secara keseluruhan sekurang-kurangnya 1.000.000 (satu juta) jiwa.\n27. Kawasan megapolitan adalah kawasan yang terbentuk dari 2 (dua) atau lebih kawasan metropolitan yang memiliki hubungan fungsional dan membentuk sebuah sistem.\n28. Kawasan strategis nasional adalah wilayah yang penataan ruangnya diprioritaskan karena mempunyai pengaruh sangat penting secara nasional terhadap kedaulatan negara, pertahanan, dan keamanan negara, ekonomi, sosial, budaya, dan/atau lingkungan, termasuk wilayah yang telah ditetapkan sebagai warisan dunia.\n29. Kawasan strategis provinsi adalah wilayah yang penataan ruangnya diprioritaskan karena mempunyai pengaruh sangat penting dalam lingkup provinsi terhadap ekonomi, sosial, budaya, dan/atau lingkungan.\n30. Kawasan strategis kabupaten/kota adalah wilayah yang penataan ruangnya diprioritaskan karena mempunyai pengaruh sangat penting dalam lingkup kabupaten/kota terhadap ekonomi, sosial, budaya, dan/atau lingkungan. aa\n31. Ruang terbuka hijau adalah area memanjang/jalur dan/atau mengelompok yang penggunaannya lebih bersifat terbuka, tempat tumbuh tanaman, baik yang tumbuh secara alamiah maupun yang sengaja ditanam, dengan mempertimbangkan aspek fungsi ekologis, resapan air, ekonomi, sosial budaya, dan estetika.\n32. Kesesuaian Kegiatan Pemanfaatan Ruang adalah kesesuaian antara rencana kegiatan pemanfaatan ruang dengan rencana tata ruang.\n33. Orang adalah orang perseorangan dan/atau korporasi.\n34. Menteri adalah menteri yang menyelenggarakan urusan pemerintahan dalam bidang penataan ruang.\n |

# Query_105

query:

```sparql
# Count triples with citation inside document
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT (COUNT (*) as ?countResult) WHERE {
  ?s o:merujuk ?o .
  ?s o:bagianDari* ?doc .
  ?o o:bagianDari* ?doc .
  ?doc a o:Peraturan .
} 


```

result:
| 0           |       |
|-------------|-------|
| countResult | 22829 |

# Query_106

query:

```sparql
# Count triples with citation between document
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT (COUNT (*) as ?countResult) WHERE {
  ?s o:merujuk ?o .
  ?s (o:bagianDari|^o:mengingat|^o:menimbang)* ?sdoc .
  ?o o:bagianDari* ?odoc .
  ?sdoc a o:Peraturan .
  ?odoc a o:Peraturan .
  FILTER (?sdoc != ?odoc)
} 

```

result:
| 0           |      |
|-------------|------|
| countResult | 1401 |

# Query_107

query:

```sparql
# Count triples with citation to non existing law
PREFIX o: <https://example.org/lex2kg/ontology/>

SELECT (COUNT(*) as ?countResult) WHERE {
  {
    SELECT ?s ?o WHERE {
      ?s o:merujuk ?o .
    }
  } MINUS {
    SELECT ?s ?o WHERE {
      ?s o:merujuk ?o .
      ?s o:bagianDari* ?doc .
      ?o o:bagianDari* ?doc .
      ?doc a o:Peraturan .
    }
  } MINUS {
    SELECT ?s ?o WHERE {
      ?s o:merujuk ?o .
      ?s (o:bagianDari|^o:mengingat|^o:menimbang)* ?sdoc .
      ?o o:bagianDari* ?odoc .
      ?sdoc a o:Peraturan .
      ?odoc a o:Peraturan .
      FILTER (?sdoc != ?odoc)
    }
  }
} 

```

result:
| 0           |      |
|-------------|------|
| countResult | 7095 |
