/**
 * CodeKaBabu - ZIP Generation & File Delivery Service
 * Uses JSZip to bundle personalized files in-memory and triggers client-side download.
 */

import { personalizeNotebook, notebookToPersonalizedPython } from './header-injector.js';

export class ZipService {
  constructor(manifest) {
    this.manifest = manifest || (typeof window !== 'undefined' ? window.PRACTICALS_MANIFEST : null);
  }

  /**
   * Safely loads a practical file either from the server or from offline bundle
   */
  async loadRawFile(filename) {
    // 1. Check offline embedded bundle first (fastest, works on file:/// and offline)
    const rawCache = (typeof window !== 'undefined' && window.PRACTICALS_RAW_FILES) || 
                     (typeof globalThis !== 'undefined' && globalThis.PRACTICALS_RAW_FILES);
    if (rawCache && rawCache[filename]) {
      return rawCache[filename];
    }

    // 2. Fetch from practicals/ folder over HTTP/HTTPS
    if (typeof fetch === 'function' && typeof window !== 'undefined' && window.location?.protocol !== 'file:') {
      try {
        const res = await fetch(`practicals/${encodeURIComponent(filename)}`);
        if (res.ok) {
          return await res.text();
        }
      } catch (e) {
        console.warn(`Fetch failed for ${filename}, attempting cache fallback.`, e);
      }
    }

    if (rawCache && rawCache[filename]) {
      return rawCache[filename];
    }

    throw new Error(`Unable to load practical file: ${filename}`);
  }

  /**
   * Bundles all practicals into a ZIP archive
   * @param {Object} student - { name, rollNo, batch }
   * @param {string} format - 'ipynb' | 'py' | 'both'
   * @param {Function} onProgress - Progress callback (percentage, statusText)
   */
  async buildPracticalZip(student, format = 'ipynb', onProgress = () => {}) {
    const JSZipLib = (typeof window !== 'undefined' && window.JSZip) || (typeof globalThis !== 'undefined' && globalThis.JSZip);
    if (!JSZipLib) {
      throw new Error('JSZip library is not loaded. Please verify vendor script.');
    }

    const zip = new JSZipLib();
    const batchKey = student.batch.toUpperCase(); // 'B1', 'B2', or 'B3'
    const batchDates = this.manifest.batchDates[batchKey] || this.manifest.batchDates['B1'];

    const practicals = this.manifest.practicals;
    const total = practicals.length;

    const safeRoll = student.rollNo.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeName = student.name.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    const rootFolderName = `Practicals_${batchKey}_Roll_${safeRoll}`;
    const folder = zip.folder(rootFolderName);

    // Create a README file inside the zip for guidance
    const readmeContent = [
      `==============================================================================`,
      `  CodeKaBabu - NLP Practical Submission Package`,
      `  Subject: ${this.manifest.subject} (${this.manifest.courseCode})`,
      `==============================================================================`,
      `Student Details:`,
      `  Name     : ${student.name.trim()}`,
      `  Roll No  : ${student.rollNo.trim()}`,
      `  Batch    : ${batchKey}`,
      `==============================================================================`,
      `Included Practical Files (${total} total):`,
      ...practicals.map((p, idx) => {
        const d = batchDates[idx] || 'N/A';
        return `  ${p.expNo}. ${p.shortTitle} (Date: ${d})`;
      }),
      `==============================================================================`,
      `Notes:`,
      `  - All code outputs are preserved in the .ipynb notebook files.`,
      `  - Each file includes your personal header with the assigned batch date.`,
      `  - Generated using CodeKaBabu (https://codekababu.local)`,
      `==============================================================================`
    ].join('\n');

    folder.file('README.txt', readmeContent);

    for (let i = 0; i < total; i++) {
      const exp = practicals[i];
      const dateStr = batchDates[i] || 'N/A';
      const stepPercent = Math.round(((i + 1) / total) * 75);

      onProgress(stepPercent, `Personalizing Experiment ${exp.expNo}: ${exp.shortTitle}...`);

      const rawContent = await this.loadRawFile(exp.filename);

      // Add .ipynb if requested
      if (format === 'ipynb' || format === 'both') {
        const personalizedNb = personalizeNotebook(rawContent, student, exp, dateStr);
        folder.file(exp.filename, personalizedNb);
      }

      // Add .py if requested
      if (format === 'py' || format === 'both') {
        const personalizedPy = notebookToPersonalizedPython(rawContent, student, exp, dateStr);
        const pyFolder = format === 'both' ? folder.folder('python_scripts') : folder;
        pyFolder.file(exp.pyFilename, personalizedPy);
      }
    }

    onProgress(80, 'Compressing practicals into ZIP archive...');

    const zipBlob = await zip.generateAsync(
      {
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      },
      (metadata) => {
        const zipPercent = 80 + Math.round((metadata.percent / 100) * 20);
        onProgress(zipPercent, `Compressing ZIP... ${Math.round(metadata.percent)}%`);
      }
    );

    const downloadFilename = `Practicals_${batchKey}_Roll_${safeRoll}_${safeName}.zip`;
    return { blob: zipBlob, filename: downloadFilename, fileCount: total };
  }

  /**
   * Triggers native browser download
   */
  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Deterministic memory cleanup
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 20000);
  }
}
