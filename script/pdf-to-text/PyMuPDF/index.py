import sys
import fitz
import os
import json

if __name__ == "__main__":
    pdf_path = sys.argv[1]
    text_path = sys.argv[2]
    pages = fitz.Document(pdf_path)
    pageDicts = [page.getText('json') for page in pages]
    text = ',\n'.join(pageDicts)
    text = f'[{text}]'
    with open(text_path, 'w') as f:
        f.write(text)
