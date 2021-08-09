sudo apt update
sudo apt install ocrmypdf tesseract-ocr-ind -y
cd legal-kg
ocrmypdf -l ind --force-ocr --jobs 4 --tesseract-config tesseract-config.cfg maintained_documents/pdf/pp/2021/34.pdf maintained_documents/normalized-pdf/pp/2021/34.pdf