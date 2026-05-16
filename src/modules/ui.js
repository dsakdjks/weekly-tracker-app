import { StorageManager } from './storage.js';

/**
 * UI manager for handling DOM interactions
 */
export class UIManager {
  constructor() {
    this.elements = {};
    this.uploadedFilesList = [];
    this.folderAttachments = [];
    this.currentPreviewFile = null;
    this.currentUploadContainer = null;
    this.printPreviewData = [];
    this.validateElements();

    if (document.readyState !== 'loading') {
      this.initElements();
      this.setupPreviewEvents();
      this.setupAlertEvents();
      this.initTheme();
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        this.initElements();
        this.setupPreviewEvents();
        this.setupAlertEvents();
        this.initTheme();
      }, { once: true });
    }
  }

  initElements() {
    this.elements = {
      weeksGrid: document.getElementById('weeksGrid'),
      toggleBtn: document.getElementById('toggleBtn'),
      themeToggleBtn: document.getElementById('themeToggleBtn'),
      searchInput: document.getElementById('searchInput'),
      modal: document.getElementById('modal'),
      closeBtn: document.querySelector('.close'),
      saveBtn: document.getElementById('saveBtn'),
      highlightsText: document.getElementById('highlightsText'),
      weekNumber: document.getElementById('weekNumber'),
      weekDateInfo: document.getElementById('weekDateInfo'),
      weekImportantInput: document.getElementById('weekImportantInput'),
      editDobBtn: document.getElementById('editDobBtn'),
      printHighlightsBtn: document.getElementById('printHighlightsBtn'),
      infoBtn: document.getElementById('infoBtn'),
      dataPreservationAlert: document.getElementById('dataPreservationAlert'),
      closeAlertBtn: document.getElementById('closeAlertBtn'),
      totalWeeks: document.getElementById('totalWeeks'),
      weeksPassed: document.getElementById('weeksPassed'),
      weeksRemaining: document.getElementById('weeksRemaining'),
      ageInfo: document.getElementById('ageInfo'),
      birthDateModal: document.getElementById('birthDateModal'),
      birthDateInput: document.getElementById('birthDateInput'),
      birthDateSubmitBtn: document.getElementById('birthDateSubmitBtn'),
      highlightsFile: document.getElementById('highlightsFile'),
      uploadedFiles: document.getElementById('uploadedFiles'),
      filePreviewOverlay: document.getElementById('filePreviewOverlay'),
      filePreviewContent: document.getElementById('filePreviewContent'),
      filePreviewTitle: document.getElementById('filePreviewTitle'),
      filePreviewClose: document.getElementById('filePreviewClose'),
      filePreviewOpenBtn: document.getElementById('filePreviewOpenBtn'),
      filePreviewDownloadBtn: document.getElementById('filePreviewDownloadBtn'),
      folderBtn: document.getElementById('folderBtn'),
      printPreviewOverlay: document.getElementById('printPreviewOverlay'),
      printPreviewContent: document.getElementById('printPreviewContent'),
      printPreviewTitle: document.getElementById('printPreviewTitle'),
      printPreviewClose: document.getElementById('printPreviewClose'),
      printPreviewPrintBtn: document.getElementById('printPreviewPrintBtn'),
      infoModal: document.getElementById('infoModal'),
      infoModalClose: document.getElementById('infoModalClose'),
      folderAccessModal: document.getElementById('folderAccessModal'),
      folderAccessClose: document.getElementById('folderAccessClose'),
      folderPasswordInput: document.getElementById('folderPasswordInput'),
      folderPasswordSubmitBtn: document.getElementById('folderPasswordSubmitBtn'),
      folderForgotBtn: document.getElementById('folderForgotBtn'),
      folderPasswordLabel: document.getElementById('folderPasswordLabel'),
      folderPasswordError: document.getElementById('folderPasswordError'),
      folderManagerModal: document.getElementById('folderManagerModal'),
      folderManagerClose: document.getElementById('folderManagerClose'),
      folderManagerGrid: document.getElementById('folderManagerGrid'),
      newFolderBtn: document.getElementById('newFolderBtn'),
      folderNoteModal: document.getElementById('folderNoteModal'),
      folderNoteClose: document.getElementById('folderNoteClose'),
      folderTitleInput: document.getElementById('folderTitleInput'),
      folderDetailsText: document.getElementById('folderDetailsText'),
      folderImportantInput: document.getElementById('folderImportantInput'),
      folderSaveBtn: document.getElementById('folderSaveBtn'),
      folderDeleteBtn: document.getElementById('folderDeleteBtn'),
      folderFileInput: document.getElementById('folderFileInput'),
      folderUploadedFiles: document.getElementById('folderUploadedFiles'),
      // Password setup elements
      folderSetupModal: document.getElementById('folderSetupModal'),
      folderSetupPasswordInput: document.getElementById('folderSetupPasswordInput'),
      folderSetupPasswordConfirm: document.getElementById('folderSetupPasswordConfirm'),
      folderSetupQuestion1: document.getElementById('folderSetupQuestion1'),
      folderSetupQuestion2: document.getElementById('folderSetupQuestion2'),
      folderSetupBtn: document.getElementById('folderSetupBtn'),
      folderSetupError: document.getElementById('folderSetupError'),
      // Password recovery elements
      folderRecoveryModal: document.getElementById('folderRecoveryModal'),
      folderRecoveryQuestion1: document.getElementById('folderRecoveryQuestion1'),
      folderRecoveryQuestion2: document.getElementById('folderRecoveryQuestion2'),
      folderRecoveryNewPassword: document.getElementById('folderRecoveryNewPassword'),
      folderRecoveryConfirmPassword: document.getElementById('folderRecoveryConfirmPassword'),
      folderRecoverySubmitBtn: document.getElementById('folderRecoverySubmitBtn'),
      folderRecoveryCancelBtn: document.getElementById('folderRecoveryCancelBtn'),
      folderResetFolderBtn: document.getElementById('folderResetFolderBtn'),
      folderRecoveryError: document.getElementById('folderRecoveryError')
    };
  }

  validateElements() {
    // Silent validation - missing elements handled gracefully
  }

  showBirthDateModal() {
    if (this.elements.birthDateModal) {
      this.elements.birthDateModal.style.display = 'block';
    }
  }

  closeBirthDateModal() {
    if (this.elements.birthDateModal) {
      this.elements.birthDateModal.style.display = 'none';
    }
  }

  showInfoModal() {
    if (this.elements.infoModal) {
      this.elements.infoModal.classList.add('active');
    }
  }

  closeInfoModal() {
    if (this.elements.infoModal) {
      this.elements.infoModal.classList.remove('active');
    }
  }

  showDataPreservationAlert() {
    if (this.elements.dataPreservationAlert) {
      this.elements.dataPreservationAlert.classList.remove('hidden');
      document.body.classList.add('data-alert-visible');

      // Auto-hide after 5 seconds
      setTimeout(() => this.hideDataPreservationAlert(), 5000);
    }
  }

  hideDataPreservationAlert() {
    if (this.elements.dataPreservationAlert) {
      this.elements.dataPreservationAlert.classList.add('slideUp');
      setTimeout(() => {
        this.elements.dataPreservationAlert.classList.add('hidden');
        this.elements.dataPreservationAlert.classList.remove('slideUp');
        document.body.classList.remove('data-alert-visible');
      }, 400);
    }
  }

  setupAlertEvents() {
    if (this.elements.closeAlertBtn) {
      this.elements.closeAlertBtn.addEventListener('click', () => this.hideDataPreservationAlert());
    }
  }

  getBirthDate() {
    if (this.elements.birthDateInput) {
      return new Date(this.elements.birthDateInput.value);
    }
    return null;
  }

  setBirthDateValue(date) {
    if (this.elements.birthDateInput && date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      this.elements.birthDateInput.value = `${year}-${month}-${day}`;
    }
  }

  updateStats(stats) {
    this.elements.totalWeeks.textContent = stats.totalWeeks.toLocaleString();
    this.elements.weeksPassed.textContent = stats.weeksPassed.toLocaleString();
    this.elements.weeksRemaining.textContent = stats.weeksRemaining.toLocaleString();
    this.elements.ageInfo.textContent = `You are ${stats.currentAge} years old. ${stats.weeksRemaining} weeks remaining until you turn ${stats.currentAge + stats.yearsRemaining}!`;
  }

  renderWeeks(visibleWeeks, onWeekClick) {
    this.elements.weeksGrid.innerHTML = '';

    if (visibleWeeks.length === 0) {
      this.elements.weeksGrid.innerHTML = '<div class="empty-state"><p>No weeks found</p></div>';
      return;
    }

    visibleWeeks.forEach(week => {
      const weekEl = document.createElement('div');
      weekEl.className = 'week';

      if (week.important) weekEl.classList.add('important');

      if (week.isPassed) weekEl.classList.add('passed');
      if (week.isCurrent) weekEl.classList.add('current');
      if (week.highlights) weekEl.classList.add('with-highlights');

      const startMonth = String(week.startDate.getMonth() + 1).padStart(2, '0');
      const startDay = String(week.startDate.getDate()).padStart(2, '0');
      const startYear = week.startDate.getFullYear();
      const endMonth = String(week.endDate.getMonth() + 1).padStart(2, '0');
      const endDay = String(week.endDate.getDate()).padStart(2, '0');
      const endYear = week.endDate.getFullYear();

      weekEl.innerHTML = `
        <span class="week-number">${week.number}</span>
        ${week.important ? '<span class="week-important">★</span>' : ''}
        <span class="week-date">${startMonth}/${startDay}/${startYear} - ${endMonth}/${endDay}/${endYear}</span>
      `;

      weekEl.addEventListener('click', () => onWeekClick(week));
      this.elements.weeksGrid.appendChild(weekEl);
    });
  }

  openModal(week) {
    this.elements.weekNumber.textContent = week.number;
    const dateRange = `${week.startDate.toLocaleDateString()} - ${week.endDate.toLocaleDateString()}`;
    this.elements.weekDateInfo.textContent = dateRange;
    this.elements.highlightsText.value = week.highlights || '';
    if (this.elements.weekImportantInput) this.elements.weekImportantInput.checked = !!week.important;
    this.uploadedFilesList = week.attachments || [];
    this.currentUploadContainer = this.elements.uploadedFiles;
    if (this.elements.highlightsFile) this.elements.highlightsFile.value = '';
    this.displayUploadedFiles();
    this.elements.modal.style.display = 'block';
  }

  closeModal() {
    this.elements.modal.style.display = 'none';
    this.elements.highlightsText.value = '';
    if (this.elements.weekImportantInput) this.elements.weekImportantInput.checked = false;
    this.clearUploadedFiles();
  }

  getHighlightsText() {
    return this.elements.highlightsText.value;
  }

  getWeekImportant() {
    return !!this.elements.weekImportantInput?.checked;
  }

  getSearchTerm() {
    return this.elements.searchInput.value;
  }

  isShowingOnlyRemaining() {
    return this.elements.toggleBtn.classList.contains('active');
  }

  toggleShowRemaining() {
    this.elements.toggleBtn.classList.toggle('active');
    const isActive = this.elements.toggleBtn.classList.contains('active');
    this.elements.toggleBtn.textContent = isActive ? 'Show All Weeks' : 'Show Remaining Weeks';
    return !isActive; // Return opposite for showOnlyRemaining logic
  }

  async handleFileUpload(files) {
    const list = this.currentUploadContainer === this.elements.folderUploadedFiles ? this.folderAttachments : this.uploadedFilesList;
    const currentTotalSize = list.reduce((sum, item) => sum + (item.size || 0), 0);
    const newFiles = [];
    let runningSize = currentTotalSize;

    for (const file of files) {
      await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = URL.createObjectURL(file);
          newFiles.push({
            name: file.name,
            type: file.type,
            data: e.target.result,
            size: file.size,
            url,
            rawFile: file
          });
          runningSize += file.size;
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }
    
    if (this.currentUploadContainer === this.elements.folderUploadedFiles) {
      this.folderAttachments = [...this.folderAttachments, ...newFiles];
    } else {
      this.uploadedFilesList = [...this.uploadedFilesList, ...newFiles];
    }
    this.displayUploadedFiles();
  }

  displayUploadedFiles() {
    const target = this.currentUploadContainer || this.elements.uploadedFiles;
    if (!target) return;
    
    const list = this.currentUploadContainer === this.elements.folderUploadedFiles ? this.folderAttachments : this.uploadedFilesList;
    target.innerHTML = '';
    
    if (list.length === 0) {
      target.innerHTML = '<p class="no-files">No files uploaded</p>';
      return;
    }

    const filesList = document.createElement('div');
    filesList.className = 'files-list';
    
    list.forEach((file, index) => {
      const fileItem = document.createElement('div');
      fileItem.className = 'file-item';
      fileItem.dataset.index = index;
      
      const icon = file.type.startsWith('image') ? '🖼️' : '📄';
      const size = (file.size / 1024 / 1024).toFixed(2);
      
      const fileInfo = document.createElement('div');
      fileInfo.className = 'file-info';
      
      const iconEl = document.createElement('span');
      iconEl.className = 'file-icon';
      iconEl.textContent = icon;
      
      const details = document.createElement('div');
      details.className = 'file-details';
      
      const nameEl = document.createElement('span');
      nameEl.className = 'file-name';
      nameEl.textContent = file.name;
      
      const sizeEl = document.createElement('span');
      sizeEl.className = 'file-size';
      sizeEl.textContent = `${size} MB`;
      
      const hintEl = document.createElement('span');
      hintEl.className = 'file-preview-hint';
      hintEl.textContent = 'Click to preview';
      
      details.appendChild(nameEl);
      details.appendChild(sizeEl);
      details.appendChild(hintEl);
      fileInfo.appendChild(iconEl);
      fileInfo.appendChild(details);
      
      const removeButton = document.createElement('button');
      removeButton.className = 'file-remove';
      removeButton.dataset.index = String(index);
      removeButton.textContent = '✕';
      
      fileItem.appendChild(fileInfo);
      fileItem.appendChild(removeButton);
      
      fileItem.addEventListener('click', (event) => {
        if (event.target.closest('.file-remove')) return;
        const item = list[index];
        if (!item || !item.data) return;
        this.showFilePreview(item);
      });

      fileItem.addEventListener('dblclick', (event) => {
        event.stopPropagation();
        const item = list[index];
        if (!item) return;
        this.openFileInNewTab(item);
      });
      
      removeButton.addEventListener('click', (event) => {
        event.stopPropagation();
        list.splice(index, 1);
        this.displayUploadedFiles();
      });
      
      filesList.appendChild(fileItem);
    });
    
    target.appendChild(filesList);
  }

  getUploadedFiles() {
    return this.currentUploadContainer === this.elements.folderUploadedFiles ? this.folderAttachments : this.uploadedFilesList;
  }

  openFileInNewTab(file) {
    if (!file) return;
    const href = file.url || file.data;
    if (!href) return;

    window.open(href, '_blank', 'noopener');
  }

  downloadFile(file) {
    if (!file) return;
    const href = file.url || file.data;
    if (!href) return;

    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = file.name;
    anchor.target = '_blank';
    anchor.rel = 'noopener';
    anchor.click();
  }

  initTheme() {
    const savedTheme = StorageManager.getTheme();
    const theme = savedTheme || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.applyTheme(theme);
  }

  applyTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark-theme', isDark);
    document.body.classList.toggle('light-theme', !isDark);
    if (this.elements.themeToggleBtn) {
      this.elements.themeToggleBtn.textContent = isDark ? '☀️ Light' : '🌙 Dark';
    }
    StorageManager.setTheme(theme);
  }

  toggleTheme() {
    const isDark = document.body.classList.contains('dark-theme');
    this.applyTheme(isDark ? 'light' : 'dark');
  }

  setupPreviewEvents() {
    this.elements.filePreviewClose?.addEventListener('click', () => this.closeFilePreview());
    this.elements.filePreviewOverlay?.addEventListener('click', (event) => {
      if (event.target === this.elements.filePreviewOverlay) {
        this.closeFilePreview();
      }
    });

    this.elements.filePreviewOpenBtn?.addEventListener('click', () => {
      if (this.currentPreviewFile) {
        this.openFileInNewTab(this.currentPreviewFile);
      }
    });

    this.elements.filePreviewDownloadBtn?.addEventListener('click', () => {
      if (this.currentPreviewFile) {
        this.downloadFile(this.currentPreviewFile);
      }
    });

    this.elements.infoBtn?.addEventListener('click', () => this.showInfoModal());
    this.elements.infoModalClose?.addEventListener('click', () => this.closeInfoModal());
    this.elements.infoModal?.addEventListener('click', (event) => {
      if (event.target === this.elements.infoModal) {
        this.closeInfoModal();
      }
    });

    this.elements.printPreviewClose?.addEventListener('click', () => this.closeHighlightsPreview());
    this.elements.printPreviewOverlay?.addEventListener('click', (event) => {
      if (event.target === this.elements.printPreviewOverlay) {
        this.closeHighlightsPreview();
      }
    });

    this.elements.printPreviewPrintBtn?.addEventListener('click', () => {
      if (this.printPreviewData && this.printPreviewData.length > 0) {
        this.openPrintWindow(this.printPreviewData);
      } else {
        window.print();
      }
    });
  }

  showFilePreview(file) {
    if (!this.elements.filePreviewOverlay || !this.elements.filePreviewContent || !this.elements.filePreviewTitle) return;

    this.elements.filePreviewTitle.textContent = file.name;
    this.elements.filePreviewContent.innerHTML = '';

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'preview-wrapper';

    if (file.type.startsWith('image')) {
      const img = document.createElement('img');
      img.src = file.data;
      img.alt = file.name;
      img.className = 'preview-image';
      contentWrapper.appendChild(img);
    } else if (file.type.startsWith('video')) {
      const video = document.createElement('video');
      video.src = file.data;
      video.controls = true;
      video.className = 'preview-media';
      contentWrapper.appendChild(video);
    } else if (file.type.startsWith('audio')) {
      const audio = document.createElement('audio');
      audio.src = file.data;
      audio.controls = true;
      audio.className = 'preview-media';
      contentWrapper.appendChild(audio);
    } else if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      const objectEl = document.createElement('object');
      objectEl.data = file.data;
      objectEl.type = 'application/pdf';
      objectEl.className = 'preview-object';
      const objectFallback = document.createElement('p');
      objectFallback.textContent = 'Unable to preview PDF. ';
      const objectLink = document.createElement('a');
      objectLink.href = file.data;
      objectLink.download = file.name;
      objectLink.textContent = 'Download file';
      objectFallback.appendChild(objectLink);
      objectEl.appendChild(objectFallback);
      contentWrapper.appendChild(objectEl);
    } else if (file.type.startsWith('text') || /\.(txt|md|json|csv|js|css|html|xml)$/i.test(file.name)) {
      const iframe = document.createElement('iframe');
      iframe.src = file.data;
      iframe.className = 'preview-iframe';
      contentWrapper.appendChild(iframe);
    } else {
      const fallback = document.createElement('div');
      fallback.className = 'preview-fallback';
      const message = document.createElement('p');
      message.textContent = 'Preview is unavailable for this file type.';
      const downloadLink = document.createElement('a');
      downloadLink.href = file.data;
      downloadLink.download = file.name;
      downloadLink.className = 'download-link';
      downloadLink.textContent = 'Download file';
      fallback.appendChild(message);
      fallback.appendChild(downloadLink);
      contentWrapper.appendChild(fallback);
    }

    this.currentPreviewFile = file;
    this.elements.filePreviewOpenBtn?.removeAttribute('disabled');
    this.elements.filePreviewDownloadBtn?.removeAttribute('disabled');
    this.elements.filePreviewContent.appendChild(contentWrapper);
    this.elements.filePreviewOverlay.setAttribute('aria-hidden', 'false');
    this.elements.filePreviewOverlay.classList.add('active');
  }

  closeFilePreview() {
    if (!this.elements.filePreviewOverlay || !this.elements.filePreviewContent) return;
    this.elements.filePreviewOverlay.setAttribute('aria-hidden', 'true');
    this.elements.filePreviewOverlay.classList.remove('active');
    this.elements.filePreviewContent.innerHTML = '';
    this.currentPreviewFile = null;
    this.elements.filePreviewOpenBtn?.setAttribute('disabled', 'true');
    this.elements.filePreviewDownloadBtn?.setAttribute('disabled', 'true');
  }

  showHighlightsPreview(weeks) {
    if (!this.elements.printPreviewOverlay || !this.elements.printPreviewContent || !this.elements.printPreviewTitle) return;
    this.elements.printPreviewTitle.textContent = 'Highlights Preview';
    this.elements.printPreviewContent.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'print-preview-wrapper';

    const intro = document.createElement('p');
    intro.className = 'print-preview-note';
    intro.textContent = 'Review all saved week highlights here. Click Download PDF to open your browser print dialog, then choose Save as PDF.';
    wrapper.appendChild(intro);

    weeks.forEach((week) => {
      const weekCard = document.createElement('section');
      weekCard.className = 'print-week-card';

      const title = document.createElement('div');
      title.className = 'print-week-title';
      title.textContent = `Week ${week.number}${week.important ? ' ★' : ''}`;
      weekCard.appendChild(title);

      const range = document.createElement('div');
      range.className = 'print-week-dates';
      range.textContent = `${week.startDate.toLocaleDateString()} — ${week.endDate.toLocaleDateString()}`;
      weekCard.appendChild(range);

      const highlightsHeader = document.createElement('div');
      highlightsHeader.className = 'print-week-label';
      highlightsHeader.textContent = 'Highlights:';
      weekCard.appendChild(highlightsHeader);

      const highlightsText = document.createElement('p');
      highlightsText.className = 'print-week-highlights';
      highlightsText.textContent = week.highlights || 'No highlights saved.';
      weekCard.appendChild(highlightsText);

      if (week.attachments && week.attachments.length > 0) {
        const attachmentsLabel = document.createElement('div');
        attachmentsLabel.className = 'print-week-attachments';
        attachmentsLabel.textContent = `Attachments (${week.attachments.length}):`;
        weekCard.appendChild(attachmentsLabel);

        const attachmentsList = document.createElement('ul');
        attachmentsList.className = 'print-attachments-list';
        week.attachments.forEach((attachment) => {
          const attachmentName = attachment?.name || attachment?.fileName || 'Unnamed attachment';
          const item = document.createElement('li');
          item.textContent = attachmentName;
          attachmentsList.appendChild(item);
        });
        weekCard.appendChild(attachmentsList);
      }

      wrapper.appendChild(weekCard);
    });

    this.setPrintPreviewData(weeks);
    this.elements.printPreviewContent.appendChild(wrapper);
    this.elements.printPreviewOverlay.setAttribute('aria-hidden', 'false');
    this.elements.printPreviewOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  setPrintPreviewData(weeks) {
    this.printPreviewData = Array.isArray(weeks) ? weeks : [];
  }

  openPrintWindow(weeks) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      this.showNotification('Unable to open print window.', 'error');
      return;
    }

    const styles = `
      body { font-family: Arial, sans-serif; margin: 20px; color: #111; }
      h1, h2, h3, h4 { margin: 0 0 10px; }
      .print-week-card { border: 1px solid #ddd; border-radius: 10px; padding: 16px; margin-bottom: 18px; }
      .print-week-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 8px; }
      .print-week-dates, .print-week-label, .print-week-attachments { color: #555; margin-bottom: 8px; }
      .print-week-highlights { white-space: pre-wrap; line-height: 1.8; margin-bottom: 10px; }
      .print-attachments-list { margin: 0 0 10px 20px; }
      .print-attachments-list li { margin-bottom: 4px; }
      .print-note { color: #444; margin-bottom: 16px; }
    `;

    const content = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Highlights PDF</title>
          <style>${styles}</style>
        </head>
        <body>
          <h1>Life Weeks Highlights</h1>
          <p class="print-note">Use your browser's print dialog to save as PDF.</p>
          ${weeks.map((week) => `
            <section class="print-week-card">
              <div class="print-week-title">Week ${week.number}${week.important ? ' ★' : ''}</div>
              <div class="print-week-dates">${week.startDate.toLocaleDateString()} — ${week.endDate.toLocaleDateString()}</div>
              <div class="print-week-label">Highlights:</div>
              <div class="print-week-highlights">${(week.highlights || 'No highlights saved.').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
              ${week.attachments && week.attachments.length > 0 ? `
                <div class="print-week-attachments">Attachments (${week.attachments.length}):</div>
                <ul class="print-attachments-list">
                  ${week.attachments.map((attachment) => `<li>${(attachment?.name || attachment?.fileName || 'Unnamed attachment').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</li>`).join('')}
                </ul>
              ` : ''}
            </section>
          `).join('')}
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  closeHighlightsPreview() {
    if (!this.elements.printPreviewOverlay || !this.elements.printPreviewContent) return;
    this.elements.printPreviewOverlay.setAttribute('aria-hidden', 'true');
    this.elements.printPreviewOverlay.classList.remove('active');
    this.elements.printPreviewContent.innerHTML = '';
    document.body.style.overflow = '';
  }

  showFolderAccessModal(hasPassword) {
    if (!this.elements.folderAccessModal || !this.elements.folderPasswordInput || !this.elements.folderPasswordLabel || !this.elements.folderPasswordSubmitBtn) return;
    this.elements.folderPasswordInput.value = '';
    this.elements.folderPasswordError.textContent = '';
    if (hasPassword) {
      this.elements.folderPasswordLabel.textContent = 'Enter folder password:';
      this.elements.folderPasswordSubmitBtn.textContent = 'Unlock Folder';
    } else {
      this.elements.folderPasswordLabel.textContent = 'Create a password for the secure folder:';
      this.elements.folderPasswordSubmitBtn.textContent = 'Set Password';
    }
    this.elements.folderPasswordSubmitBtn.dataset.mode = hasPassword ? 'unlock' : 'create';
    this.elements.folderAccessModal.style.display = 'block';
  }

  closeFolderAccessModal() {
    if (!this.elements.folderAccessModal) return;
    this.elements.folderPasswordInput.value = '';
    this.elements.folderPasswordError.textContent = '';
    this.elements.folderAccessModal.style.display = 'none';
  }

  showFolderPasswordError(message) {
    if (this.elements.folderPasswordError) {
      this.elements.folderPasswordError.textContent = message;
    }
  }

  getFolderPassword() {
    return this.elements.folderPasswordInput?.value || '';
  }

  showFolderManagerModal(folders, onFolderClick) {
    if (!this.elements.folderManagerModal || !this.elements.folderManagerGrid) return;
    this.elements.folderManagerGrid.innerHTML = '';

    if (folders.length === 0) {
      this.elements.folderManagerGrid.innerHTML = '<div class="empty-state"><p>No folders yet</p></div>';
    } else {
      folders.forEach((folder) => {
        const folderCard = document.createElement('div');
        folderCard.className = `week folder-card${folder.important ? ' important' : ''}`;
        const updatedAt = folder.updatedAt ? new Date(folder.updatedAt).toLocaleDateString() : 'No updates yet';
        const titleEl = document.createElement('span');
        titleEl.className = 'week-number';
        titleEl.textContent = folder.title;
        folderCard.appendChild(titleEl);
        if (folder.important) {
          const badge = document.createElement('span');
          badge.className = 'folder-important';
          badge.textContent = '★ Important';
          folderCard.appendChild(badge);
        }
        const dateEl = document.createElement('span');
        dateEl.className = 'week-date';
        dateEl.textContent = updatedAt;
        folderCard.appendChild(dateEl);
        folderCard.addEventListener('click', () => onFolderClick(folder));
        this.elements.folderManagerGrid.appendChild(folderCard);
      });
    }

    this.elements.folderManagerModal.style.display = 'block';
  }

  closeFolderManagerModal() {
    if (!this.elements.folderManagerModal) return;
    this.elements.folderManagerModal.style.display = 'none';
  }

  openFolderNoteModal(folder) {
    if (!this.elements.folderNoteModal || !this.elements.folderTitleInput || !this.elements.folderDetailsText || !this.elements.folderImportantInput || !this.elements.folderSaveBtn || !this.elements.folderDeleteBtn || !this.elements.folderUploadedFiles || !this.elements.folderFileInput) return;
    this.elements.folderTitleInput.value = folder?.title || '';
    this.elements.folderDetailsText.value = folder?.details || '';
    this.elements.folderImportantInput.checked = !!folder?.important;
    this.elements.folderSaveBtn.textContent = folder ? 'Save Folder' : 'Create Folder';
    this.elements.folderDeleteBtn.style.display = folder ? 'inline-flex' : 'none';
    this.currentFolderId = folder?.id || null;
    this.folderAttachments = folder?.attachments || [];
    this.currentUploadContainer = this.elements.folderUploadedFiles;
    this.elements.folderFileInput.value = '';
    this.displayUploadedFiles();
    this.elements.folderNoteModal.style.display = 'block';
  }

  closeFolderNoteModal() {
    if (!this.elements.folderNoteModal) return;
    this.elements.folderNoteModal.style.display = 'none';
    this.currentFolderId = null;
    this.currentUploadContainer = null;
  }

  getFolderTitle() {
    return this.elements.folderTitleInput?.value || '';
  }

  getFolderDetails() {
    return this.elements.folderDetailsText?.value || '';
  }

  getFolderImportant() {
    return !!this.elements.folderImportantInput?.checked;
  }

  getCurrentFolderId() {
    return this.currentFolderId;
  }

  clearUploadedFiles() {
    this.closeFilePreview();
    if (this.currentUploadContainer === this.elements.folderUploadedFiles) {
      this.folderAttachments = [];
    } else {
      this.uploadedFilesList = [];
    }
    if (this.elements.highlightsFile) {
      this.elements.highlightsFile.value = '';
    }
    if (this.elements.folderFileInput) {
      this.elements.folderFileInput.value = '';
    }
    this.displayUploadedFiles();
  }

  // Password & Security Methods
  showFolderSetupModal() {
    if (this.elements.folderSetupModal) {
      this.clearFolderSetupForm();
      this.elements.folderSetupModal.style.display = 'block';
    }
  }

  closeFolderSetupModal() {
    if (this.elements.folderSetupModal) {
      this.elements.folderSetupModal.style.display = 'none';
      this.clearFolderSetupForm();
    }
  }

  clearFolderSetupForm() {
    if (this.elements.folderSetupPasswordInput) this.elements.folderSetupPasswordInput.value = '';
    if (this.elements.folderSetupPasswordConfirm) this.elements.folderSetupPasswordConfirm.value = '';
    if (this.elements.folderSetupQuestion1) this.elements.folderSetupQuestion1.value = '';
    if (this.elements.folderSetupQuestion2) this.elements.folderSetupQuestion2.value = '';
    if (this.elements.folderSetupError) this.elements.folderSetupError.textContent = '';
  }

  getFolderSetupData() {
    return {
      password: this.elements.folderSetupPasswordInput?.value || '',
      passwordConfirm: this.elements.folderSetupPasswordConfirm?.value || '',
      question1: this.elements.folderSetupQuestion1?.value || '',
      question2: this.elements.folderSetupQuestion2?.value || ''
    };
  }

  showFolderSetupError(message) {
    if (this.elements.folderSetupError) {
      this.elements.folderSetupError.textContent = message;
      this.elements.folderSetupError.style.display = 'block';
    }
  }

  clearFolderSetupError() {
    if (this.elements.folderSetupError) {
      this.elements.folderSetupError.textContent = '';
      this.elements.folderSetupError.style.display = 'none';
    }
  }

  showFolderRecoveryModal() {
    if (this.elements.folderRecoveryModal) {
      this.clearFolderRecoveryForm();
      this.elements.folderRecoveryModal.style.display = 'block';
    }
  }

  closeFolderRecoveryModal() {
    if (this.elements.folderRecoveryModal) {
      this.elements.folderRecoveryModal.style.display = 'none';
      this.clearFolderRecoveryForm();
    }
  }

  clearFolderRecoveryForm() {
    if (this.elements.folderRecoveryQuestion1) this.elements.folderRecoveryQuestion1.value = '';
    if (this.elements.folderRecoveryQuestion2) this.elements.folderRecoveryQuestion2.value = '';
    if (this.elements.folderRecoveryNewPassword) this.elements.folderRecoveryNewPassword.value = '';
    if (this.elements.folderRecoveryConfirmPassword) this.elements.folderRecoveryConfirmPassword.value = '';
    if (this.elements.folderRecoveryError) this.elements.folderRecoveryError.textContent = '';
  }

  getFolderRecoveryData() {
    return {
      question1: this.elements.folderRecoveryQuestion1?.value || '',
      question2: this.elements.folderRecoveryQuestion2?.value || '',
      newPassword: this.elements.folderRecoveryNewPassword?.value || '',
      confirmPassword: this.elements.folderRecoveryConfirmPassword?.value || ''
    };
  }

  showFolderRecoveryError(message) {
    if (this.elements.folderRecoveryError) {
      this.elements.folderRecoveryError.textContent = message;
      this.elements.folderRecoveryError.style.display = 'block';
    }
  }

  clearFolderRecoveryError() {
    if (this.elements.folderRecoveryError) {
      this.elements.folderRecoveryError.textContent = '';
      this.elements.folderRecoveryError.style.display = 'none';
    }
  }

  showNotification(message, type = 'success', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      background: ${type === 'success' ? '#10b981' : '#ef4444'};
      color: white;
      border-radius: 8px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      z-index: 2000;
      animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, duration);
  }
}
