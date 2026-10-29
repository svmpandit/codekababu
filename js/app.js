/**
 * CodeKaBabu - Frontend Controller & Event Coordinator
 */

import { ZipService } from './zip-service.js';
import { createCommentHeader, notebookToPersonalizedPython } from './header-injector.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Elements
  const form = document.getElementById('generatorForm');
  const nameInput = document.getElementById('studentName');
  const rollInput = document.getElementById('rollNumber');
  const batchSelect = document.getElementById('batchSelect');
  const btnSubmit = document.getElementById('btnSubmit');

  // Preview elements
  const previewName = document.getElementById('previewName');
  const previewRoll = document.getElementById('previewRoll');
  const previewBatch = document.getElementById('previewBatch');
  const previewDate = document.getElementById('previewDate');

  // Status elements
  const statusBox = document.getElementById('statusBox');
  const statusMessage = document.getElementById('statusMessage');
  const statusPercent = document.getElementById('statusPercent');
  const progressBarFill = document.getElementById('progressBarFill');

  // Practicals showcase
  const practicalsContainer = document.getElementById('practicalsContainer');
  const batchIndicator = document.getElementById('batchIndicator');

  // Modal elements
  const codeModal = document.getElementById('codeModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const btnCloseModal = document.getElementById('btnCloseModal');

  // Initialize Manifest
  let manifest = window.PRACTICALS_MANIFEST;
  if (!manifest) {
    try {
      const res = await fetch('practicals/manifest.json');
      if (res.ok) {
        manifest = await res.json();
      }
    } catch (e) {
      console.warn('Could not fetch manifest.json, using fallback.', e);
    }
  }

  const zipService = new ZipService(manifest);

  // Restore saved state from localStorage if available
  const savedName = localStorage.getItem('codekababu_name') || '';
  const savedRoll = localStorage.getItem('codekababu_roll') || '';
  const savedBatch = localStorage.getItem('codekababu_batch') || 'B1';

  if (savedName) nameInput.value = savedName;
  if (savedRoll) rollInput.value = savedRoll;
  if (savedBatch && ['B1', 'B2', 'B3'].includes(savedBatch)) {
    batchSelect.value = savedBatch;
  } else {
    batchSelect.value = 'B1';
  }

  // Update Live Preview
  function updateLivePreview() {
    const currentName = nameInput.value.trim() || 'Rahul Sharma';
    const currentRoll = rollInput.value.trim() || '42';
    const currentBatch = batchSelect.value || 'B1';

    previewName.textContent = currentName;
    previewRoll.textContent = currentRoll;
    previewBatch.textContent = currentBatch;

    const dates = manifest.batchDates[currentBatch] || manifest.batchDates['B1'];
    const p1Date = dates[0] || '17/07/2026';
    previewDate.textContent = p1Date;

    // Save to localStorage
    if (nameInput.value.trim()) localStorage.setItem('codekababu_name', nameInput.value.trim());
    if (rollInput.value.trim()) localStorage.setItem('codekababu_roll', rollInput.value.trim());
    if (batchSelect.value) localStorage.setItem('codekababu_batch', batchSelect.value);

    // Update batch indicator
    if (batchIndicator) {
      batchIndicator.innerHTML = `Selected Batch: <strong>${currentBatch}</strong> (Dates Active)`;
    }

    renderPracticalsList(currentBatch);
  }

  // Render the list of all 10 practicals with dynamic batch dates
  function renderPracticalsList(batchKey) {
    if (!practicalsContainer || !manifest || !manifest.practicals) return;

    const dates = manifest.batchDates[batchKey] || manifest.batchDates['B1'];
    practicalsContainer.innerHTML = '';

    manifest.practicals.forEach((p, index) => {
      const dateForThisExp = dates[index] || 'N/A';
      const row = document.createElement('div');
      row.className = 'practical-row';

      row.innerHTML = `
        <div class="prac-left">
          <span class="prac-exp-tag">Exp ${p.expNo}</span>
          <span class="prac-title-text" title="${p.title}">${p.title}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span class="prac-date-tag">📅 ${dateForThisExp}</span>
          <button type="button" class="btn-preview-prac" data-index="${index}" style="
            background: none; border: 1px solid #cbd5e1; border-radius: 6px; padding: 4px 8px;
            font-size: 0.78rem; font-weight: 600; color: #475569; cursor: pointer;
          ">Preview</button>
        </div>
      `;

      practicalsContainer.appendChild(row);
    });

    // Bind preview buttons
    practicalsContainer.querySelectorAll('.btn-preview-prac').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        await openPreviewModal(idx, batchKey);
      });
    });
  }

  // Open Preview Modal
  async function openPreviewModal(index, batchKey) {
    const exp = manifest.practicals[index];
    const dates = manifest.batchDates[batchKey] || manifest.batchDates['B1'];
    const dateStr = dates[index] || 'N/A';

    modalTitle.textContent = `Experiment ${exp.expNo}: ${exp.shortTitle}`;
    modalBody.textContent = 'Loading source code...';
    codeModal.classList.add('open');

    try {
      const rawContent = await zipService.loadRawFile(exp.filename);
      const student = {
        name: nameInput.value.trim() || 'Your Name',
        rollNo: rollInput.value.trim() || 'Your Roll No',
        batch: batchKey
      };

      const pyCode = notebookToPersonalizedPython(rawContent, student, exp, dateStr);
      modalBody.textContent = pyCode;
    } catch (err) {
      modalBody.textContent = `Error loading code preview: ${err.message}`;
    }
  }

  // Close modal
  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', () => {
      codeModal.classList.remove('open');
    });
  }

  if (codeModal) {
    codeModal.addEventListener('click', (e) => {
      if (e.target === codeModal) codeModal.classList.remove('open');
    });
  }

  // Event Listeners for inputs
  nameInput.addEventListener('input', updateLivePreview);
  rollInput.addEventListener('input', updateLivePreview);
  batchSelect.addEventListener('change', updateLivePreview);

  // Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const rollNo = rollInput.value.trim();
    const batch = batchSelect.value;

    if (!name || !rollNo || !batch) {
      alert('Please fill in your Name, Roll Number, and Batch.');
      return;
    }

    const selectedFormat = document.querySelector('input[name="fileFormat"]:checked')?.value || 'ipynb';

    // UI state: loading
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = `<span>⏳</span> Generating Practicals...`;
    statusBox.className = 'status-box active progress';
    statusMessage.textContent = 'Starting packaging...';
    statusPercent.textContent = '0%';
    progressBarFill.style.width = '0%';

    try {
      const student = { name, rollNo, batch };
      const result = await zipService.buildPracticalZip(student, selectedFormat, (percent, msg) => {
        statusPercent.textContent = `${percent}%`;
        statusMessage.textContent = msg;
        progressBarFill.style.width = `${percent}%`;
      });

      // Complete progress
      statusPercent.textContent = '100%';
      progressBarFill.style.width = '100%';
      statusMessage.textContent = `Generated ${result.fileCount} practicals! Downloading ZIP...`;

      // Trigger download
      zipService.downloadBlob(result.blob, result.filename);

      setTimeout(() => {
        statusBox.className = 'status-box active success';
        statusBox.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
            <div>
              <strong>🎉 ZIP Downloaded Successfully!</strong>
              <div style="font-size: 0.85rem; margin-top: 4px;">File: <code>${result.filename}</code> (All 10 Practicals with Batch ${batch} dates)</div>
            </div>
            <button id="btnRedownload" style="
              background: #15803d; color: white; border: none; border-radius: 6px; padding: 6px 14px;
              font-size: 0.82rem; font-weight: 700; cursor: pointer;
            ">Download Again</button>
          </div>
        `;

        document.getElementById('btnRedownload')?.addEventListener('click', () => {
          zipService.downloadBlob(result.blob, result.filename);
        });

        btnSubmit.disabled = false;
        btnSubmit.innerHTML = `<span>🗂️</span> Generate &amp; Download ZIP &rarr;`;
      }, 900);

    } catch (err) {
      console.error(err);
      statusBox.className = 'status-box active error';
      statusBox.innerHTML = `<strong>Error:</strong> ${err.message}`;
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = `<span>🗂️</span> Generate &amp; Download ZIP &rarr;`;
    }
  });

  // Initial render
  updateLivePreview();
});
