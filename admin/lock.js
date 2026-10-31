/* ==========================================================================
   jynxt Admin Panel - Authentication
   ========================================================================== */

const $ = (id) => document.getElementById(id);

const auth = {
  // Simple password check - in production, use proper bcrypt comparison
  validPassword: "changeme", // Default - should be changed
  checkPassword: function(password) {
    // For demo purposes - in production, compare with hashed password
    return password === this.validPassword;
  }
};

function showApp() {
  $("#app").hidden = false;
  $("#lock").classList.add("hidden");
  // Post message to iframe to enable preview
  const preview = $("#preview");
  if (preview && preview.contentWindow) {
    preview.contentWindow.postMessage({ type: "d2-ready" }, location.origin);
  }
}

function showError(msg) {
  $("#lock-error").textContent = msg;
}

function unlock() {
  const password = $("#lock-password").value;
  const remember = $("#lock-remember").checked;

  if (!password) {
    showError("Please enter a password");
    return;
  }

  // Validate password (replace with proper auth in production)
  if (auth.checkPassword(password)) {
    if (remember) {
      localStorage.setItem("jynxt-admin-unlocked", "true");
      localStorage.setItem("jynxt-admin-expiry", (Date.now() + 7 * 24 * 60 * 60 * 1000).toString());
    }
    showApp();
  } else {
    showError("Incorrect password");
    $("#lock-password").value = "";
    $("#lock-password").focus();
  }
}

function checkSavedAuth() {
  const saved = localStorage.getItem("jynxt-admin-unlocked");
  const expiry = localStorage.getItem("jynxt-admin-expiry");

  if (saved === "true" && expiry && parseInt(expiry) > Date.now()) {
    showApp();
    return true;
  }

  // Clear expired session
  if (saved === "true") {
    localStorage.removeItem("jynxt-admin-unlocked");
    localStorage.removeItem("jynxt-admin-expiry");
  }

  return false;
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Check for saved session
  if (!checkSavedAuth()) {
    // Show lock screen
    $("#lock").classList.remove("hidden");
  }

  // Form submission
  $("#lock-form").addEventListener("submit", (e) => {
    e.preventDefault();
    unlock();
  });

  // Escape key clears password
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      $("#lock-password").value = "";
    }
  });

  // Click outside closes (if lock is open)
  $("#lock").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) {
      showError("Please enter the password");
    }
  });
});

// Handle postMessage from iframe in preview mode
window.addEventListener("message", (event) => {
  if (event.origin !== location.origin) return;

  const data = event.data;
  if (data?.type === "d2-config") {
    // Admin config update - would need to implement config saving
    console.log("Config update received:", data.config);
  }
});

export { auth };