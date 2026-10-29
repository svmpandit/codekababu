/**
 * CodeKaBabu - Frontend Controller & Event Coordinator
 * Optimized for mobile touch, fast client-side execution, and zero clutter.
 */

import { ZipService } from './zip-service.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Form & Inputs
  const form = document.getElementById('generatorForm');
  const nameInput = document.getElementById('studentName');
  const rollInput = document.getElementById('rollNumber');
  const batchSelect = document.getElementById('batchSelect');
  const btnSubmit = document.getElementById('btnSubmit');

  // Hero Live Preview Elements
  const previewName = document.getElementById('previewName');
  const previewRoll = document.getElementById('previewRoll');
  const previewBatch = document.getElementById('previewBatch');
  const previewDate = document.getElementById('previewDate');

  // Status & Progress Bar Elements
  const statusBox = document.getElementById('statusBox');
  const statusMessage = document.getElementById('statusMessage');
  const statusPercent = document.getElementById('statusPercent');
  const progressBarFill = document.getElementById('progressBarFill');

  // Load Manifest
  let manifest = window.PRACTICALS_MANIFEST;
  if (!manifest) {
    try {
      const res = await fetch('practicals/manifest.json');
      if (res.ok) {
        manifest = await res.json();
      }
    } catch (e) {
      console.warn('Could not fetch manifest.json, using offline bundle.', e);
    }
  }

  const zipService = new ZipService(manifest);

  // Restore saved fields from localStorage
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

  // Update Live Preview in the Hero Illustration
  function updateLivePreview() {
    const currentName = nameInput.value.trim() || 'Rahul Sharma';
    const currentRoll = rollInput.value.trim() || '42';
    const currentBatch = batchSelect.value || 'B1';

    if (previewName) previewName.textContent = currentName;
    if (previewRoll) previewRoll.textContent = currentRoll;
    if (previewBatch) previewBatch.textContent = currentBatch;

    if (manifest && manifest.batchDates) {
      const dates = manifest.batchDates[currentBatch] || manifest.batchDates['B1'];
      const p1Date = dates[0] || '17/07/2026';
      if (previewDate) previewDate.textContent = p1Date;
    }

    // Persist to localStorage for student convenience
    if (nameInput.value.trim()) localStorage.setItem('codekababu_name', nameInput.value.trim());
    if (rollInput.value.trim()) localStorage.setItem('codekababu_roll', rollInput.value.trim());
    if (batchSelect.value) localStorage.setItem('codekababu_batch', batchSelect.value);
  }

  // Listen to input changes (works on mobile touch keyboards, paste, & autofill)
  nameInput.addEventListener('input', updateLivePreview);
  rollInput.addEventListener('input', updateLivePreview);
  batchSelect.addEventListener('change', updateLivePreview);

  // Handle Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const rollNo = rollInput.value.trim();
    const batch = batchSelect.value;

    if (!name || !rollNo || !batch) {
      alert('Please fill in your Full Name, Roll Number, and select your Batch.');
      return;
    }

    // UI state: generating
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = `
      <span class="btn-icon">⏳</span>
      <span class="btn-text">Generating Practicals...</span>
    `;

    statusBox.className = 'status-box active progress';
    statusMessage.textContent = 'Reading practical files...';
    statusPercent.textContent = '0%';
    progressBarFill.style.width = '0%';

    try {
      const student = { name, rollNo, batch };
      // Default to 'both' so student gets .ipynb (with outputs) and pure .py scripts inside
      const result = await zipService.buildPracticalZip(student, 'both', (percent, msg) => {
        statusPercent.textContent = `${percent}%`;
        statusMessage.textContent = msg;
        progressBarFill.style.width = `${percent}%`;
      });

      // Complete progress animation
      statusPercent.textContent = '100%';
      progressBarFill.style.width = '100%';
      statusMessage.textContent = `Generated ${result.fileCount} practicals! Downloading ZIP...`;

      // Trigger automatic browser download
      zipService.downloadBlob(result.blob, result.filename);

      setTimeout(() => {
        statusBox.className = 'status-box active success';
        statusBox.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
            <div>
              <strong>🎉 ZIP Downloaded Successfully!</strong>
              <div style="font-size: 0.82rem; margin-top: 3px;">
                File: <code>${result.filename}</code> (All 10 Practicals with Batch ${batch} dates)
              </div>
            </div>
            <button type="button" id="btnRedownload" style="
              background: #15803d; color: white; border: none; border-radius: 8px; padding: 6px 14px;
              font-size: 0.82rem; font-weight: 700; cursor: pointer;
            ">Download Again</button>
          </div>
        `;

        document.getElementById('btnRedownload')?.addEventListener('click', () => {
          zipService.downloadBlob(result.blob, result.filename);
        });

        btnSubmit.disabled = false;
        btnSubmit.innerHTML = `
          <span class="btn-icon">🗂️</span>
          <span class="btn-text">Generate &amp; Download ZIP</span>
          <span class="btn-arrow">&rarr;</span>
        `;
      }, 700);

    } catch (err) {
      console.error(err);
      statusBox.className = 'status-box active error';
      statusBox.innerHTML = `<strong>Error:</strong> ${err.message}`;
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = `
        <span class="btn-icon">🗂️</span>
        <span class="btn-text">Generate &amp; Download ZIP</span>
        <span class="btn-arrow">&rarr;</span>
      `;
    }
  });

  // Initial preview render
  updateLivePreview();
});
