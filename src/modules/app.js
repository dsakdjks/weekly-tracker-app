import { WeekManager } from "./weekManager.js";
import { UIManager } from "./ui.js";
import { StorageManager } from "./storage.js";
import { setBirthDate } from "../config.js";

/**
 * Main app manager
 */
class App {
  constructor() {
    this.weekManager = WeekManager;
    this.ui = new UIManager();
    this.allWeeks = [];
    this.currentSelectedWeek = null;
    this.showOnlyRemaining = true;
    this.listenersAttached = false;
    this.isAppReady = false;
  }

  initBirthDate() {
    // Check if birth date is stored
    const storedBirthDate = StorageManager.getBirthDate();

    // Bind submit button
    this.ui.elements.birthDateSubmitBtn?.addEventListener("click", () =>
      this.handleBirthDateSubmit(),
    );

    // Handle Enter key
    this.ui.elements.birthDateInput?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.handleBirthDateSubmit();
      }
    });

    // Prevent closing modal by clicking outside
    this.ui.elements.birthDateModal?.addEventListener("click", (e) => {
      if (e.target === this.ui.elements.birthDateModal) {
        e.stopPropagation();
      }
    });

    if (storedBirthDate) {
      setBirthDate(storedBirthDate);
      return true;
    }

    // Show birth date modal
    this.ui.showBirthDateModal();
    return false;
  }

  handleBirthDateSubmit() {
    const birthDate = this.ui.getBirthDate();

    if (!birthDate || isNaN(birthDate.getTime())) {
      this.ui.showNotification("Please select a valid date of birth", "error");
      return;
    }

    if (birthDate > new Date()) {
      this.ui.showNotification(
        "Date of birth cannot be in the future",
        "error",
      );
      return;
    }

    // Save birth date
    StorageManager.saveBirthDate(birthDate);
    setBirthDate(birthDate);

    // Close modal and notify the user
    this.ui.closeBirthDateModal();
    this.ui.showNotification("Birth date saved successfully!");

    if (!this.isAppReady) {
      this.init();
      return;
    }

    this.allWeeks = this.weekManager.generateAllWeeks();
    const stats = this.weekManager.calculateStats(this.allWeeks);
    this.ui.updateStats(stats);
    this.renderWeeks();
  }

  handleEditBirthDate() {
    const storedBirthDate = StorageManager.getBirthDate();
    if (storedBirthDate) {
      this.ui.setBirthDateValue(storedBirthDate);
    }
    this.ui.showBirthDateModal();
  }

  init() {
    try {
      // Generate weeks
      this.allWeeks = this.weekManager.generateAllWeeks();

      // Update stats
      const stats = this.weekManager.calculateStats(this.allWeeks);
      this.ui.updateStats(stats);

      // Initial render
      this.renderWeeks();

      // Setup event listeners once
      if (!this.listenersAttached) {
        this.setupEventListeners();
        this.listenersAttached = true;
      }
      this.isAppReady = true;
    } catch (error) {
      this.ui.showNotification("Error initializing app", "error");
    }
  }

  renderWeeks() {
    const filtered = this.weekManager.filterWeeks(
      this.allWeeks,
      this.showOnlyRemaining,
      this.ui.getSearchTerm(),
    );
    this.ui.renderWeeks(filtered, (week) => this.handleWeekClick(week));
  }

  handleWeekClick(week) {
    this.currentSelectedWeek = week;
    this.ui.openModal(week);
  }

  formatHighlightsWithDate(highlights) {
    const trimmed = highlights.trim();
    if (!trimmed) return "";

    const dateLabel = new Date().toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Split by newlines and format each line that doesn't already have a date
    const lines = trimmed.split("\n");
    const formattedLines = lines.map((line) => {
      const lineTrimmed = line.trim();
      if (!lineTrimmed) return "";

      // Check if line already has a date prefix (em-dash)
      if (lineTrimmed.includes(" — ")) {
        return lineTrimmed;
      }

      return `${dateLabel} — ${lineTrimmed}`;
    });

    return formattedLines.filter((line) => line).join("\n");
  }

  handleSaveHighlights() {
    if (!this.currentSelectedWeek) return;

    const rawHighlights = this.ui.getHighlightsText();
    const highlights = this.formatHighlightsWithDate(rawHighlights);
    const attachments = this.ui.getUploadedFiles();
    const important = this.ui.getWeekImportant();
    const saved = StorageManager.saveWeekData(
      this.currentSelectedWeek.number,
      highlights,
      attachments,
      important,
    );

    if (saved) {
      this.currentSelectedWeek.highlights = highlights;
      this.currentSelectedWeek.important = important;
      this.currentSelectedWeek.attachments = attachments;
      this.ui.showNotification("Highlights saved successfully!");
      this.renderWeeks();
      this.ui.closeModal();
    } else {
      this.ui.showNotification("Error saving highlights", "error");
    }
  }

  handleToggle() {
    this.showOnlyRemaining = this.ui.toggleShowRemaining();
    this.renderWeeks();
  }

  handleSearch() {
    this.renderWeeks();
  }

  handlePrintHighlights() {
    const weeksForPrint = this.allWeeks
      .map((week) => {
        const weekData = StorageManager.getWeekData(week.number);
        return {
          ...week,
          highlights: weekData.highlights || "",
          attachments: Array.isArray(weekData.attachments)
            ? weekData.attachments
            : [],
          important:
            weekData.important !== undefined
              ? !!weekData.important
              : !!week.important,
        };
      })
      .filter(
        (week) =>
          week.highlights.trim() ||
          (week.attachments && week.attachments.length > 0),
      );

    if (weeksForPrint.length === 0) {
      this.ui.showNotification(
        "No saved highlights available to print.",
        "error",
      );
      return;
    }

    this.ui.showHighlightsPreview(weeksForPrint);
  }

  handleSecureFolder() {
    // Check if folder setup is complete
    if (!StorageManager.isFolderSetupComplete()) {
      // Show setup modal for first time
      this.ui.showFolderSetupModal();
    } else {
      // Show password input for existing setup
      this.ui.showFolderAccessModal(true);
    }
  }

  handleFolderForgot() {
    const confirmed = window.confirm(
      "Resetting the secure folder will clear all stored folder data and password. Continue?",
    );
    if (!confirmed) return;

    StorageManager.clearFolderPassword();
    StorageManager.clearFolderData();
    this.ui.closeFolderAccessModal();
    this.ui.showNotification(
      "Password reset complete. Secure folder data has been cleared.",
    );
    this.ui.showFolderAccessModal(false);
  }

  loadFolderManager() {
    const folders = StorageManager.getFolderData();
    this.ui.showFolderManagerModal(folders, (folder) =>
      this.handleFolderCardClick(folder),
    );
  }

  handleFolderCardClick(folder) {
    this.ui.openFolderNoteModal(folder);
  }

  handleNewFolder() {
    this.ui.openFolderNoteModal(null);
  }

  handleSaveFolder() {
    const title = this.ui.getFolderTitle();
    const details = this.ui.getFolderDetails();
    if (!title.trim()) {
      this.ui.showNotification("Folder title is required", "error");
      return;
    }

    const folderId = this.ui.getCurrentFolderId();
    const attachments = this.ui.getUploadedFiles();
    const important = this.ui.getFolderImportant();
    const folder = {
      id: folderId || `${Date.now()}`,
      title: title.trim(),
      details: details.trim(),
      important,
      attachments: attachments,
    };

    if (!StorageManager.saveFolder(folder)) {
      this.ui.showNotification(
        "Unable to save folder. Attachment size may be too large for browser storage.",
        "error",
      );
      return;
    }

    this.ui.showNotification("Folder saved successfully!");
    this.ui.closeFolderNoteModal();
    this.loadFolderManager();
  }

  handleDeleteFolder() {
    const folderId = this.ui.getCurrentFolderId();
    if (!folderId) return;

    if (StorageManager.deleteFolder(folderId)) {
      this.ui.showNotification("Folder deleted successfully!");
      this.ui.closeFolderNoteModal();
      this.loadFolderManager();
    } else {
      this.ui.showNotification("Unable to delete folder", "error");
    }
  }

  // Password Setup Handler
  handleFolderSetup() {
    this.ui.clearFolderSetupError();
    const data = this.ui.getFolderSetupData();

    // Validate password match
    if (!data.password || !data.passwordConfirm) {
      this.ui.showFolderSetupError("Please enter and confirm your password");
      return;
    }

    if (data.password !== data.passwordConfirm) {
      this.ui.showFolderSetupError("Passwords do not match");
      return;
    }

    if (data.password.length < 4) {
      this.ui.showFolderSetupError(
        "Password must be at least 4 characters long",
      );
      return;
    }

    // Validate security questions
    if (!data.question1.trim() || !data.question2.trim()) {
      this.ui.showFolderSetupError("Please answer both security questions");
      return;
    }

    // Save password
    if (!StorageManager.saveFolderPassword(data.password)) {
      this.ui.showFolderSetupError("Error saving password. Try again.");
      return;
    }

    // Save security questions
    if (!StorageManager.saveSecurityQuestions(data.question1, data.question2)) {
      this.ui.showFolderSetupError(
        "Error saving security questions. Try again.",
      );
      StorageManager.clearFolderPassword();
      return;
    }

    // Mark setup as complete
    StorageManager.markFolderSetupComplete();
    StorageManager.resetPasswordAttempts();

    this.ui.closeFolderSetupModal();
    this.ui.showNotification("Folder secured successfully!");

    // Load folder manager
    this.loadFolderManager();
  }

  // Password Verification Handler
  handleFolderPasswordSubmit() {
    const password = this.ui.getFolderPassword();
    if (!password) {
      this.ui.showFolderPasswordError("Please enter a password");
      return;
    }

    if (!StorageManager.verifyFolderPassword(password)) {
      const attempts = StorageManager.incrementPasswordAttempts();
      const maxAttempts = 3;

      if (attempts >= maxAttempts) {
        this.ui.showFolderPasswordError(
          "Too many failed attempts. Use password recovery.",
        );
        setTimeout(() => {
          this.ui.closeFolderAccessModal();
        }, 2000);
        return;
      }

      const remaining = maxAttempts - attempts;
      this.ui.showFolderPasswordError(
        `Incorrect password. ${remaining} attempt(s) remaining.`,
      );
      return;
    }

    // Password is correct
    StorageManager.resetPasswordAttempts();
    this.ui.closeFolderAccessModal();
    this.loadFolderManager();
  }

  // Password Recovery Handler
  handleFolderForgotPassword() {
    this.ui.closeFolderAccessModal();
    this.ui.showFolderRecoveryModal();
  }

  // Password Recovery Submit
  handleFolderRecoverySubmit() {
    this.ui.clearFolderRecoveryError();
    const data = this.ui.getFolderRecoveryData();

    // Verify security questions
    if (
      !StorageManager.verifySecurityQuestions(data.question1, data.question2)
    ) {
      this.ui.showFolderRecoveryError(
        "Security answers are incorrect. Please try again.",
      );
      return;
    }

    // Validate new password
    if (!data.newPassword || !data.confirmPassword) {
      this.ui.showFolderRecoveryError(
        "Please enter and confirm your new password",
      );
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      this.ui.showFolderRecoveryError("Passwords do not match");
      return;
    }

    if (data.newPassword.length < 4) {
      this.ui.showFolderRecoveryError(
        "Password must be at least 4 characters long",
      );
      return;
    }

    // Update password
    StorageManager.clearFolderPassword();
    if (!StorageManager.saveFolderPassword(data.newPassword)) {
      this.ui.showFolderRecoveryError("Error updating password. Try again.");
      return;
    }

    StorageManager.resetPasswordAttempts();
    this.ui.closeFolderRecoveryModal();
    this.ui.showNotification(
      "Password reset successfully! Please log in with your new password.",
    );
  }

  // Folder Reset Handler
  handleFolderResetComplete() {
    const confirmed = window.confirm(
      "This will permanently delete all folder data and reset your password. This action cannot be undone. Continue?",
    );
    if (!confirmed) return;

    StorageManager.resetFolderAndPassword();
    this.ui.closeFolderRecoveryModal();
    this.ui.showNotification(
      "Folder has been reset. You can now create a new password.",
    );
    this.handleSecureFolder();
  }

  // Folder Recovery Cancel
  handleFolderRecoveryCancel() {
    this.ui.closeFolderRecoveryModal();
    this.handleSecureFolder();
  }

  setupEventListeners() {
    this.ui.elements.toggleBtn?.addEventListener("click", () =>
      this.handleToggle(),
    );
    this.ui.elements.themeToggleBtn?.addEventListener("click", () =>
      this.ui.toggleTheme(),
    );
    this.ui.elements.editDobBtn?.addEventListener("click", () =>
      this.handleEditBirthDate(),
    );
    this.ui.elements.printHighlightsBtn?.addEventListener("click", () =>
      this.handlePrintHighlights(),
    );
    this.ui.elements.folderBtn?.addEventListener("click", () =>
      this.handleSecureFolder(),
    );
    this.ui.elements.searchInput?.addEventListener("input", () =>
      this.handleSearch(),
    );
    this.ui.elements.closeBtn?.addEventListener("click", () =>
      this.ui.closeModal(),
    );
    this.ui.elements.saveBtn?.addEventListener("click", () =>
      this.handleSaveHighlights(),
    );
    this.ui.elements.folderAccessClose?.addEventListener("click", () =>
      this.ui.closeFolderAccessModal(),
    );
    this.ui.elements.folderPasswordSubmitBtn?.addEventListener("click", () =>
      this.handleFolderPasswordSubmit(),
    );
    this.ui.elements.folderPasswordInput?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.handleFolderPasswordSubmit();
    });
    this.ui.elements.folderForgotBtn?.addEventListener("click", () =>
      this.handleFolderForgotPassword(),
    );
    this.ui.elements.folderManagerClose?.addEventListener("click", () =>
      this.ui.closeFolderManagerModal(),
    );
    this.ui.elements.newFolderBtn?.addEventListener("click", () =>
      this.handleNewFolder(),
    );
    this.ui.elements.folderNoteClose?.addEventListener("click", () =>
      this.ui.closeFolderNoteModal(),
    );
    this.ui.elements.folderSaveBtn?.addEventListener("click", () =>
      this.handleSaveFolder(),
    );
    this.ui.elements.folderDeleteBtn?.addEventListener("click", () =>
      this.handleDeleteFolder(),
    );
    this.ui.elements.folderFileInput?.addEventListener("change", (event) => {
      // Ensure folder uploads render inside the folder modal attachment list
      if (this.ui.elements.folderUploadedFiles) {
        this.ui.currentUploadContainer = this.ui.elements.folderUploadedFiles;
      }
      const files = event.target.files;
      if (files && files.length) {
        this.ui.handleFileUpload(files);
      }
      if (this.ui.elements.folderFileInput) {
        this.ui.elements.folderFileInput.value = "";
      }
    });

    // Password setup event listeners
    this.ui.elements.folderSetupBtn?.addEventListener("click", () =>
      this.handleFolderSetup(),
    );
    this.ui.elements.folderSetupPasswordConfirm?.addEventListener(
      "keypress",
      (e) => {
        if (e.key === "Enter") this.handleFolderSetup();
      },
    );

    // Password recovery event listeners
    this.ui.elements.folderRecoverySubmitBtn?.addEventListener("click", () =>
      this.handleFolderRecoverySubmit(),
    );
    this.ui.elements.folderRecoveryConfirmPassword?.addEventListener(
      "keypress",
      (e) => {
        if (e.key === "Enter") this.handleFolderRecoverySubmit();
      },
    );
    this.ui.elements.folderRecoveryCancelBtn?.addEventListener("click", () =>
      this.handleFolderRecoveryCancel(),
    );
    this.ui.elements.folderResetFolderBtn?.addEventListener("click", () =>
      this.handleFolderResetComplete(),
    );

    this.ui.elements.highlightsFile?.addEventListener("change", (event) => {
      const files = event.target.files;
      if (files && files.length) {
        this.ui.handleFileUpload(files);
      }
      if (this.ui.elements.highlightsFile) {
        this.ui.elements.highlightsFile.value = "";
      }
    });

    // Close modal when clicking outside
    window.addEventListener("click", (event) => {
      if (event.target === this.ui.elements.modal) {
        this.ui.closeModal();
      }
    });

    // Close modal with Escape key
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.ui.closeModal();
      }
    });
  }

  // Public methods for data management
  exportData() {
    const data = StorageManager.exportData();
    if (data) {
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `life-weeks-backup-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      this.ui.showNotification("Data exported successfully!");
    } else {
      this.ui.showNotification("Error exporting data", "error");
    }
  }

  importData(jsonData) {
    if (StorageManager.importData(jsonData)) {
      this.allWeeks = this.weekManager.generateAllWeeks();
      this.renderWeeks();
      this.ui.showNotification("Data imported successfully!");
    } else {
      this.ui.showNotification("Error importing data", "error");
    }
  }
}

export const app = new App();

export async function init() {
  // Initialize storage (IndexedDB) before using StorageManager
  try {
    await StorageManager.init();
  } catch (error) {
    // Ignore initialization errors if IndexedDB is not available
  }

  // Show data preservation alert
  if (app.ui) {
    app.ui.showDataPreservationAlert();
  }

  // First check and handle birth date initialization
  if (!app.initBirthDate()) {
    // Birth date modal is shown, init will be called after submission
    return;
  }
  // If birth date already exists, initialize the app
  app.init();
}
