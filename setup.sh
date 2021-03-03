sudo apt update
sudo apt install ocrmypdf tesseract-ocr-ind -y
cd legal-kg
ocrmypdf -l ind --force-ocr --rotate-pages --deskew --jobs 4 maintained_documents/pdf/uu/2020/11.pdf 11.pdf