document.addEventListener("DOMContentLoaded", () => {
  // User ID Management
  const getUserID = () => {
    let userId = localStorage.getItem("userID");
    if (!userId) {
      userId = generateUUID();
      localStorage.setItem("userID", userId);
    }
    return userId;
  };

  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const userID = getUserID();
  // Configuration
  const MAX_FILE_SIZE_MB = 50;
  const MAX_DURATION_MINUTES = 15;

  // --- DOM Elements (Common to both pages) ---
  const postUploadSection = document.getElementById("postUploadSection");
  const uploadedVideo = document.getElementById("uploadedVideo");
  const uploadedAudio = document.getElementById("uploadedAudio");

  const dropArea = document.getElementById("dropArea");
  const fileInput = document.getElementById("fileInput");
  const fileName = document.getElementById("fileName");
  const uploadSection = document.getElementById("uploadSection");
  const processingMessage = document.getElementById("processingMessage");
  const uploadProgressBar = document.getElementById("uploadProgressBar");
  const progressText = document.getElementById("progressText");
  const uploadedSize = document.getElementById("uploadedSize");
  const cancelUploadButton = document.getElementById("cancelUpload");
  const sessionIdInput = document.getElementById("session-id");
  const clearButton = document.getElementById("clearButton");

  const showAlert = (message) => {
    alert(message);
  };

  const displayElement = (element, display = "block") => {
    element.style.display = display;
  };

  const hideElement = (element) => {
    displayElement(element, "none");
  };

  function animateText(text, element, delay = 20) {
    element.textContent = "";
    let i = 0;
    const intervalId = setInterval(() => {
      element.textContent += text.charAt(i);
      i++;
      if (i > text.length) {
        clearInterval(intervalId);
      }
    }, delay);
  }
  // --- File Handling ---

  const validateFile = (file) => {
    if (!file.type.startsWith("video/") && !file.type.startsWith("audio/")) {
      showToast(
        "Invalid file type. Please select a video or audio file.",
        "warning"
      );
      return false;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      showToast(
        `File size too large. The maximum allowed size is ${MAX_FILE_SIZE_MB}MB.`,
        "warning"
      );
      return false;
    }

    if (
      file.type.startsWith("video/") &&
      file.duration > MAX_DURATION_MINUTES * 60
    ) {
      showToast(
        `Video duration too long. The maximum allowed duration is ${MAX_DURATION_MINUTES} minutes.`,
        "warning"
      );
      return false;
    }

    return true;
  };

  const handleFileUpload = (file) => {
    // if (!validateFile(file)) return;
    uploadFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleFileSelection = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
  };

  // --- Upload and Interaction ---

  let uploadRequest = null; // Store the request for cancellation

  const uploadFile = (file) => {
    const formData = new FormData();
    formData.append("video", file);
    formData.append("user_id", userID);

    uploadRequest = new XMLHttpRequest();
    uploadRequest.open("POST", "{% url 'ask-yourtube:analyze-video' %}", true);

    uploadRequest.upload.onprogress = updateProgressBar;

    uploadRequest.onload = function () {
      if (this.status === 200) {
        const data = JSON.parse(this.responseText);
        const player = file.type.startsWith("video/")
          ? uploadedVideo
          : uploadedAudio;
        player.src = URL.createObjectURL(file);
        player.style.display = "block";
        (player === uploadedVideo
          ? uploadedAudio
          : uploadedVideo
        ).style.display = "none";
        const summaryContent = document.getElementById("summaryContent");
        const summaryText = data.summary;

        animateText(summaryText, summaryContent);

        progressText.textContent = `Generating a summery from the file`;
        document.getElementById("transcriptContent").textContent =
          data.transcript;
        sessionIdInput.value = data.session_id;
        hideElement(uploadSection);
        displayElement(postUploadSection);
      } else {
        const data = JSON.parse(this.responseText);
        console.log(data);
        console.error("Error during file upload:", this.status);
        showToast(`Error during file upload. ${data.error}`, "danger");
      }
      // Reset upload state
      enableUploadArea();
      hideElement(processingMessage);
      uploadRequest = null;
    };

    uploadRequest.onerror = function (errorEvent) {
      console.error(errorEvent.message);
      showToast(`Error during file upload. ${errorEvent.message}`, "danger");

      // Reset upload state
      fileName.textContent = "";
      enableUploadArea();
      hideElement(processingMessage);
      uploadRequest = null;
    };
    fileName.textContent = file.name;

    // Initiate upload
    disableUploadArea();
    displayElement(processingMessage);
    uploadRequest.send(formData);
  };

  const disableUploadArea = () => {
    dropArea.classList.add("disabled");
  };

  const enableUploadArea = () => {
    dropArea.classList.remove("disabled");
  };

  let startTime = null;
  let timeRemainingElement = document.getElementById("timeRemaining");
  const updateProgressBar = (e) => {
    if (e.lengthComputable) {
      const percentComplete = (e.loaded / e.total) * 100;
      uploadProgressBar.style.width = `${percentComplete}%`;
      progressText.textContent = `${percentComplete.toFixed(1)}%`;
      const uploadedMB = (e.loaded / (1024 * 1024)).toFixed(2);
      const totalMB = (e.total / (1024 * 1024)).toFixed(2);
      uploadedSize.textContent = `${uploadedMB} MB / ${totalMB} MB`;
      // Time Remaining Estimation
      if (!startTime) {
        startTime = Date.now();
      } else {
        const elapsedMs = Date.now() - startTime;
        const secondsRemaining = Math.round(
          ((e.total - e.loaded) * elapsedMs) / (e.loaded * 1000)
        );
        const minutesRemaining = Math.floor(secondsRemaining / 60);
        const remainingSeconds = secondsRemaining % 60;
        timeRemainingElement.textContent = `${minutesRemaining}:${remainingSeconds
          .toString()
          .padStart(2, "0")}`;
      }
    }
  };

  // --- Event Listeners (Specific to index.html) ---

  clearButton.addEventListener("click", () => {
    // 1. Reset File Upload:
    fileInput.value = ""; // This clears the file input element
    fileName.textContent = "";

    // 2. Hide Video/Audio Player and Summary:
    hideElement(postUploadSection); // Assuming you are hiding the entire post upload section
    displayElement(uploadSection); // Show the upload section again

    // 3. Clear Transcript:
    document.getElementById("transcriptContent").textContent = "";

    // 4. Clear Chat Messages:
    chatMessages.innerHTML = ""; // This clears the content of the chat messages container

    // 5. Reset Session ID (Important for backend):
    sessionIdInput.value = ""; // Or set to a default value if needed

    // (Optional) You might want to reset other elements or variables related to the previous upload
  });

  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  });

  dropArea.addEventListener("drop", handleDrop);
  fileInput.addEventListener("change", handleFileSelection);
  cancelUploadButton.addEventListener("click", () => {
    if (uploadRequest) {
      fileName.textContent = "";
      uploadRequest.abort();
      enableUploadArea();
      hideElement(processingMessage);
      uploadRequest = null;
    }
  });

  const showToast = (message, type = "info") => {
    // Default to 'info' type
    const toastContainer = document.getElementById("toastContainer"); // Assuming you have a container for toasts
    const toastElement = document.createElement("div");
    toastElement.classList.add("toast", `toast-${type}`); // Add type-specific class
    toastElement.setAttribute("role", "alert");
    toastElement.setAttribute("aria-live", "assertive");
    toastElement.setAttribute("aria-atomic", "true");

    toastElement.innerHTML = `
      <div class="toast-header">
        <strong class="me-auto text-${type}">${
      type.charAt(0).toUpperCase() + type.slice(1)
    }</strong> <span id="toastCloseBtn" type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></span>
      </div>
      <div class="toast-body">
        ${message}
      </div>
    `;

    toastContainer.appendChild(toastElement);
    const toast = new bootstrap.Toast(toastElement);
    toast.show();

    // Add an event listener to the close button to remove the toast from the DOM
    toastElement
      .querySelector("#toastCloseBtn")
      .addEventListener("click", () => {
        toastContainer.removeChild(toastElement);
      });
  };
});
