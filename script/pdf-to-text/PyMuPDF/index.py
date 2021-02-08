import sys
import fitz
import os
if __name__ == "__main__":
    pdf_path = sys.argv[1]
    text_path = sys.argv[2]
    pages = fitz.Document(pdf_path)
    pageTexts = [page.getText() for page in pages]
    lines = [line for line in pageTexts]
    text = '\n'.join(lines)
    with open(text_path, 'w') as f:
        f.write(text)
