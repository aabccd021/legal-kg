import { exec } from 'child_process';
import { promisify } from 'util';
const awaitExec = promisify(exec);

export async function execOCR(inputPath: string, outputPath: string): Promise<void> {
  try {
    await awaitExec(
      `ocrmypdf` +
        ` -l ind` +
        ` --force-ocr` +
        ` --jobs 4` +
        ` --tesseract-config tesseract-config.cfg` +
        ` ${inputPath} ${outputPath}`
    );
  } catch (e) {
    console.log(e);
  }
}
