sudo apt update
sudo apt install ocrmypdf tesseract-ocr-ind -y
cd legal-kg
ocrmypdf -l ind --force-ocr --jobs 4 --tesseract-config tesseract-config.cfg maintained_documents/pdf/uu/2018/6.pdf maintained_documents/normalized-pdf/uu/2018/613.pdf