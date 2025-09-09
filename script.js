// DOM Elements
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const themeIcon = themeToggle.querySelector('i');
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const aiPersonality = document.getElementById('ai-personality');
    const templateButtons = document.querySelectorAll('.template-btn');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('overlay');
    const sttButton = document.getElementById('stt-button');
    const clearBtn = document.getElementById('clear-chat-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const sidebar = document.getElementById('sidebar');
    const promptTemplates = document.getElementById('prompt-templates');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutBtn = document.getElementById('logout-btn');
    const logoutBtnMobile = document.getElementById('logout-btn-mobile');
    const mainFooter = document.getElementById('main-footer');
    const uploadBtn = document.getElementById('upload-btn');
    const uploadOptions = document.getElementById('upload-options');
    const themeOptions = document.querySelectorAll('.theme-option');
    const toast = document.getElementById('toast');
    const fileUploadPreview = document.getElementById('file-upload-preview');
    const fileName = document.getElementById('file-name');
    const loginBtn = document.getElementById('login-btn');
    const loginText = document.getElementById('login-text');
    const loginSpinner = document.getElementById('login-spinner');
    const registerBtn = document.getElementById('register-btn');
    const registerText = document.getElementById('register-text');
    const registerSpinner = document.getElementById('register-spinner');
    const profileContent = document.getElementById('profile-content');
    const dashboardContent = document.getElementById('dashboard-content');
    const dashboardMenu = document.getElementById('dashboard-menu');
    const dashboardSubpages = document.querySelectorAll('.dashboard-subpage');
    const fileInput = document.getElementById('file-input');
    const imageInput = document.getElementById('image-input');
    const cameraInput = document.getElementById('camera-input');
    const recognitionIndicator = document.getElementById('recognition-indicator');
    const loginBackBtn = document.getElementById('login-back-btn');
    const registerBackBtn = document.getElementById('register-back-btn');
    const termsBackBtn = document.getElementById('terms-back-btn');
    const privacyBackBtn = document.getElementById('privacy-back-btn');
    
    // Dashboard counters
    let chatCount = 0;
    let aiCapacity = 0;
    let fileCount = 0;
    let timeSaved = 0;

    // State variables
    let isListening = false;
    let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    let isSpeechSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    let recognition = null;
    let usageStats = JSON.parse(localStorage.getItem('usageStats')) || {
      chats: 0,
      capacity: 0,
      files: 0,
      hours: 0
    };
    
    // User profile data
    let userProfile = JSON.parse(localStorage.getItem('userProfile')) || {
      name: "Habeeb Alamutu",
      email: "habeeb@alamz.com",
      avatar: null
    };

    // Initialize chat history
    function initChatHistory() {
      if (chatHistory.length > 0) {
        chatMessages.innerHTML = '';
        chatHistory.forEach(msg => {
          addMessage(msg.text, msg.isUser, false);
        });
        promptTemplates.style.display = 'none';
      }
    }

    // Mobile Menu Toggle
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      
      // Toggle menu and button states
      mobileMenuBtn.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      overlay.classList.toggle('active');
      
      // Update ARIA attributes
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      
      // Disable scroll when menu is open
      document.body.style.overflow = isExpanded ? 'auto' : 'hidden';
    });

    overlay.addEventListener('click', () => {
      mobileMenuBtn.classList.remove('active');
      mobileMenu.classList.remove('active');
      overlay.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = 'auto';
    });

    // Close menu when clicking on nav links
    document.querySelectorAll('.mobile-menu .nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = 'auto';
      });
    });

    // Theme Toggle
    function toggleTheme() {
      document.body.classList.toggle('dark-theme');
      if (document.body.classList.contains('dark-theme')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
        // Update mobile theme icon
        const mobileThemeIcon = themeToggleMobile.querySelector('i');
        mobileThemeIcon.classList.remove('fa-moon');
        mobileThemeIcon.classList.add('fa-sun');
      } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
        // Update mobile theme icon
        const mobileThemeIcon = themeToggleMobile.querySelector('i');
        mobileThemeIcon.classList.remove('fa-sun');
        mobileThemeIcon.classList.add('fa-moon');
      }
    }

    themeToggle.addEventListener('click', toggleTheme);
    themeToggleMobile.addEventListener('click', toggleTheme);

    // Theme options
    themeOptions.forEach(option => {
      option.addEventListener('click', () => {
        const theme = option.getAttribute('data-theme');
        if (theme === 'dark') {
          document.body.classList.add('dark-theme');
          themeIcon.classList.remove('fa-moon');
          themeIcon.classList.add('fa-sun');
          localStorage.setItem('theme', 'dark');
        } else {
          document.body.classList.remove('dark-theme');
          themeIcon.classList.remove('fa-sun');
          themeIcon.classList.add('fa-moon');
          localStorage.setItem('theme', 'light');
        }
      });
    });

    // Check for saved theme preference
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-theme');
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    }

    // Show toast notification
    function showToast(message, type = 'success') {
      toast.textContent = message;
      toast.className = 'toast show';
      
      setTimeout(() => {
        toast.className = 'toast';
      }, 3000);
    }

    // Authentication Functions
    function login() {
      localStorage.setItem('isLoggedIn', 'true');
      isLoggedIn = true;
      window.location.hash = '#/app';
      updateAuthUI();
      showToast('Login successful!');
    }

    function logout() {
      localStorage.setItem('isLoggedIn', 'false');
      isLoggedIn = false;
      window.location.hash = '#/';
      updateAuthUI();
      showToast('Logged out successfully');
    }

    function updateAuthUI() {
      if (isLoggedIn) {
        logoutBtn.style.display = 'inline-flex';
        logoutBtnMobile.style.display = 'block';
      } else {
        logoutBtn.style.display = 'none';
        logoutBtnMobile.style.display = 'none';
      }
    }

    // Form validation
    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }

    function validatePassword(password) {
      return password.length >= 8;
    }

    loginForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      let isValid = true;
      
      // Reset errors
      document.querySelectorAll('.form-error').forEach(el => el.style.display = 'none');
      document.querySelectorAll('input').forEach(el => el.classList.remove('input-error'));
      
      if (!validateEmail(email)) {
        document.getElementById('email-error').style.display = 'block';
        document.getElementById('email').classList.add('input-error');
        isValid = false;
      }
      
      if (!validatePassword(password)) {
        document.getElementById('password-error').style.display = 'block';
        document.getElementById('password').classList.add('input-error');
        isValid = false;
      }
      
      if (isValid) {
        loginText.style.display = 'none';
        loginSpinner.style.display = 'inline-block';
        
        // Simulate API call
        setTimeout(() => {
          loginText.style.display = 'inline';
          loginSpinner.style.display = 'none';
          login();
        }, 1500);
      }
    });

    registerForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('fullname').value;
      const email = document.getElementById('reg-email').value;
      const password = document.getElementById('reg-password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      let isValid = true;
      
      // Reset errors
      document.querySelectorAll('.form-error').forEach(el => el.style.display = 'none');
      document.querySelectorAll('input').forEach(el => el.classList.remove('input-error'));
      
      if (!name.trim()) {
        document.getElementById('name-error').style.display = 'block';
        document.getElementById('fullname').classList.add('input-error');
        isValid = false;
      }
      
      if (!validateEmail(email)) {
        document.getElementById('reg-email-error').style.display = 'block';
        document.getElementById('reg-email').classList.add('input-error');
        isValid = false;
      }
      
      if (!validatePassword(password)) {
        document.getElementById('reg-password-error').style.display = 'block';
        document.getElementById('reg-password').classList.add('input-error');
        isValid = false;
      }
      
      if (password !== confirmPassword) {
        document.getElementById('confirm-error').style.display = 'block';
        document.getElementById('confirm-password').classList.add('input-error');
        isValid = false;
      }
      
      if (isValid) {
        registerText.style.display = 'none';
        registerSpinner.style.display = 'inline-block';
        
        // Simulate API call
        setTimeout(() => {
          registerText.style.display = 'inline';
          registerSpinner.style.display = 'none';
          // Save user profile
          userProfile.name = name;
          userProfile.email = email;
          localStorage.setItem('userProfile', JSON.stringify(userProfile));
          login();
        }, 1500);
      }
    });

    logoutBtn?.addEventListener('click', logout);
    logoutBtnMobile?.addEventListener('click', logout);

    // Back button functionality
    loginBackBtn?.addEventListener('click', () => {
      window.history.back();
    });
    
    registerBackBtn?.addEventListener('click', () => {
      window.history.back();
    });
    
    termsBackBtn?.addEventListener('click', () => {
      window.history.back();
    });
    
    privacyBackBtn?.addEventListener('click', () => {
      window.history.back();
    });

    // Router
    function router() {
      const hash = window.location.hash.substring(2) || 'home';
      const pageId = hash === 'auth/login' ? 'auth-login' : 
                    hash === 'auth/register' ? 'auth-register' : 
                    hash;
      
      // Hide all pages
      pages.forEach(page => {
        page.classList.remove('active');
      });
      
      // Show current page
      const currentPage = document.getElementById(pageId);
      if (currentPage) {
        currentPage.classList.add('active');
      } else {
        document.getElementById('home').classList.add('active');
      }
      
      // Update active nav link
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
          link.classList.add('active');
        } else if (pageId === 'auth-login' || pageId === 'auth-register') {
          // Handle auth pages separately
          if (link.getAttribute('href') === '#/auth/login' || 
              link.getAttribute('href') === '#/auth/register') {
            // Don't activate nav links for auth pages
          }
        }
      });
      
      // Close mobile menu on navigation
      mobileMenu.classList.remove('active');
      overlay.classList.remove('active');
      sidebar.classList.remove('active');
      uploadOptions.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      
      // Hide footer on specific pages
      const hideFooterPages = ['app', 'dashboard', 'auth-login', 'auth-register'];
      if (hideFooterPages.includes(pageId)) {
        mainFooter.style.display = 'none';
      } else {
        mainFooter.style.display = 'block';
      }
      
      // Initialize chat history on chat page
      if (pageId === 'app') {
        initChatHistory();
      }
      
      // Render profile page based on login status
      if (pageId === 'profile') {
        renderProfilePage();
      }
      
      // Update dashboard stats
      if (pageId === 'dashboard') {
        updateDashboardStats();
      }
    }

    // Render profile page based on login status
    function renderProfilePage() {
      if (!isLoggedIn) {
        profileContent.innerHTML = `
          <div class="not-logged-in">
            <i class="fas fa-user-lock"></i>
            <h3>Account Required</h3>
            <p>Please sign in or create an account to access your profile</p>
            <div class="hero-buttons">
              <a href="#/auth/login" class="btn btn-primary">Sign In</a>
              <a href="#/auth/register" class="btn btn-outline">Create Account</a>
            </div>
          </div>
        `;
      } else {
        profileContent.innerHTML = `
          <div class="profile-card">
            <div class="profile-avatar">
              <div class="avatar" id="avatar-preview" style="${userProfile.avatar ? `background-image: url(${userProfile.avatar})` : ''}">
                ${userProfile.avatar ? '' : userProfile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <input type="file" id="avatar-input" class="avatar-input" accept="image/*">
              <label for="avatar-input" class="btn btn-outline avatar-label">
                <i class="fas fa-camera"></i> Change Photo
              </label>
            </div>
            <div class="profile-info">
              <div class="profile-section">
                <h3><i class="fas fa-user"></i> Personal Information</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">Full Name</span>
                    <span class="info-value">${userProfile.name}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Email Address</span>
                    <span class="info-value">${userProfile.email}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Account Type</span>
                    <span class="info-value">Pro</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Member Since</span>
                    <span class="info-value">June 15, 2025</span>
                  </div>
                </div>
              </div>
              
              <div class="profile-section">
                <h3><i class="fas fa-cog"></i> Account Settings</h3>
                <div class="form-group">
                  <label for="profile-password">New Password</label>
                  <input type="password" id="profile-password" placeholder="••••••••">
                </div>
                <div class="form-group">
                  <label for="profile-confirm">Confirm New Password</label>
                  <input type="password" id="profile-confirm" placeholder="••••••••">
                </div>
                <button type="submit" class="btn btn-primary">
                  Update Password
                </button>
              </div>
              
              <div class="profile-section">
                <h3><i class="fas fa-shield-alt"></i> Security</h3>
                <div class="info-item">
                  <span class="info-label">Two-Factor Authentication</span>
                  <span class="info-value">
                    <label class="switch">
                      <input type="checkbox" checked>
                      <span class="slider round"></span>
                    </label>
                    Enabled
                  </span>
                </div>
                <div class="info-item">
                  <span class="info-label">Active Sessions</span>
                  <span class="info-value">2 devices</span>
                </div>
              </div>
            </div>
          </div>
        `;
        // Add avatar upload functionality
        const avatarInput = document.getElementById('avatar-input');
        const avatarPreview = document.getElementById('avatar-preview');
        
        avatarInput.addEventListener('change', function() {
          const file = this.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
              avatarPreview.style.backgroundImage = `url(${e.target.result})`;
              avatarPreview.innerHTML = '';
              // Save to local storage
              userProfile.avatar = e.target.result;
              localStorage.setItem('userProfile', JSON.stringify(userProfile));
              showToast('Profile picture updated successfully!');
            }
            reader.readAsDataURL(file);
          }
        });
      }
    }

    // Update dashboard stats
    function updateDashboardStats() {
      document.getElementById('chat-count').textContent = usageStats.chats;
      document.getElementById('ai-capacity').textContent = usageStats.capacity + '%';
      document.getElementById('file-count').textContent = usageStats.files;
      document.getElementById('time-saved').textContent = usageStats.hours + 'h';
    }

    // Dashboard subpage navigation
    dashboardMenu?.addEventListener('click', (e) => {
      e.preventDefault();
      const target = e.target.closest('a');
      if (!target) return;
      
      // Update active menu item
      dashboardMenu.querySelectorAll('a').forEach(link => {
        link.classList.remove('active');
      });
      target.classList.add('active');
      
      // Show selected subpage
      const subpageId = target.getAttribute('data-subpage');
      if (subpageId) {
        dashboardSubpages.forEach(page => {
          page.classList.remove('active');
        });
        document.getElementById(subpageId).classList.add('active');
      }
    });

    // Voice selection
    document.querySelectorAll('.voice-option').forEach(option => {
      option.addEventListener('click', () => {
        document.querySelectorAll('.voice-option').forEach(opt => {
          opt.classList.remove('selected');
        });
        option.classList.add('selected');
        showToast("Voice preference updated");
      });
    });

    // Update usage stats
    function updateUsageStats() {
      if (isLoggedIn) {
        usageStats.chats++;
        usageStats.capacity = Math.min(100, Math.floor(usageStats.chats / 10));
        usageStats.files = Math.floor(usageStats.chats / 5);
        usageStats.hours = Math.floor(usageStats.chats / 2);
        
        localStorage.setItem('usageStats', JSON.stringify(usageStats));
        
        // Update dashboard if visible
        if (document.getElementById('dashboard').classList.contains('active')) {
          updateDashboardStats();
        }
      }
    }

    // Initial route
    window.addEventListener('load', () => {
      updateAuthUI();
      router();
      
      // Initialize speech recognition if supported
      if (isSpeechSupported) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = function(event) {
          const transcript = event.results[0][0].transcript;
          userInput.value = transcript;
          showToast('Speech recognized: ' + transcript);
          recognitionIndicator.classList.remove('active');
        };
        
        recognition.onerror = function(event) {
          showToast('Speech recognition error: ' + event.error, 'error');
          recognitionIndicator.classList.remove('active');
          sttButton.classList.remove('listening');
          isListening = false;
        };
        
        recognition.onend = function() {
          recognitionIndicator.classList.remove('active');
          sttButton.classList.remove('listening');
          isListening = false;
        };
      } else {
        sttButton.disabled = true;
        sttButton.title = "Speech recognition not supported in your browser";
      }
    });
    window.addEventListener('hashchange', router);

    // Chat functionality
    function addMessage(text, isUser = false, saveToHistory = true) {
      const messageDiv = document.createElement('div');
      messageDiv.classList.add('message');
      messageDiv.classList.add(isUser ? 'user-message' : 'ai-message');
      
      const messageContent = document.createElement('p');
      messageContent.textContent = text;
      
      messageDiv.appendChild(messageContent);
      
      if (!isUser && 'speechSynthesis' in window) {
        const ttsBtn = document.createElement('button');
        ttsBtn.classList.add('tts-button');
        ttsBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        ttsBtn.setAttribute('aria-label', 'Listen to message');
        ttsBtn.addEventListener('click', () => {
          speakText(text);
        });
        messageDiv.appendChild(ttsBtn);
      }
      
      chatMessages.appendChild(messageDiv);
      
      // Scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      // Hide prompt templates after first user message
      if (isUser && promptTemplates.style.display !== 'none') {
        promptTemplates.style.display = 'none';
      }
      
      // Save to history
      if (saveToHistory) {
        chatHistory.push({ text, isUser });
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
      }
    }

    function simulateTypingIndicator() {
      const typingIndicator = document.createElement('div');
      typingIndicator.classList.add('message', 'ai-message');
      typingIndicator.id = 'typing-indicator';
      
      const dots = document.createElement('div');
      dots.className = 'typing-dots';
      dots.innerHTML = `
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      `;
      
      typingIndicator.appendChild(dots);
      chatMessages.appendChild(typingIndicator);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      return typingIndicator;
    }

    function getAIResponse(userMessage) {
      // Update usage stats
      updateUsageStats();
      
      // Simulate AI response with different personalities
      const personality = aiPersonality.value;
      const responses = {
        default: [
          "I understand your question. Based on my knowledge, here's what I can tell you...",
          "That's an interesting point. Let me provide some insights on that topic...",
          "Thanks for your input. Here's my analysis of what you've shared..."
        ],
        coder: [
          "I see you're asking about code. Here's a solution I would implement...",
          "For this programming challenge, I recommend the following approach...",
          "The error you're encountering typically happens when... Try this fix:"
        ],
        writer: [
          "What a creative idea! Here's how I would develop that concept...",
          "For your writing project, consider these narrative approaches...",
          "The theme you mentioned reminds me of... Here's a possible storyline:"
        ],
        researcher: [
          "Based on academic literature, here's what we know about this topic...",
          "Several studies support this hypothesis. The key findings include...",
          "The research methodology most appropriate for this question would be..."
        ],
        casual: [
          "Hey there! That's a cool question. Here are my thoughts...",
          "I get what you're saying. From my perspective...",
          "Interesting! Have you considered...? Here's why I think that might work."
        ]
      };
      
      // Attempt to provide a relevant response
      if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
        return "Hello! How can I assist you today?";
      }
      
      if (userMessage.toLowerCase().includes('thank')) {
        return "You're welcome! Is there anything else I can help with?";
      }
      
      if (userMessage.toLowerCase().includes('weather')) {
        return "I'm an AI without real-time data access, but I can help you find weather information if you tell me your location.";
      }
      
      if (userMessage.toLowerCase().includes('help')) {
        return "I'm here to help! You can ask me questions, request summaries, generate content, or even help with coding problems.";
      }
      
      // Random response based on personality
      const personalityResponses = responses[personality] || responses.default;
      const randomIndex = Math.floor(Math.random() * personalityResponses.length);
      return personalityResponses[randomIndex];
    }

    // Text to Speech
    function speakText(text) {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        speechSynthesis.speak(utterance);
      } else {
        showToast("Text-to-speech not supported in your browser", 'error');
      }
    }

    // Send message to backend AI
    async function sendMessageToBackend() {
      const message = userInput.value.trim();
      if (message) {
        addMessage(message, true);
        userInput.value = '';
        const typingIndicator = simulateTypingIndicator();
        try {
          const res = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
          });
          const data = await res.json();
          typingIndicator.remove();
          addMessage(data.reply);
        } catch (error) {
          typingIndicator.remove();
          addMessage('Sorry, there was a problem connecting to the AI server.');
        }
      }
    }

    // Replace previous sendBtn event with backend call
    sendBtn.addEventListener('click', sendMessageToBackend);

    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessageToBackend();
      }
    });

    // File upload button
    uploadBtn.addEventListener('click', () => {
      uploadOptions.classList.toggle('active');
    });

    // Close upload options when clicking outside
    document.addEventListener('click', (e) => {
      if (!uploadBtn.contains(e.target) && !uploadOptions.contains(e.target)) {
        uploadOptions.classList.remove('active');
      }
    });

    // Handle file uploads
    function handleFileUpload(file, type) {
      const fileName = file.name;
      const fileSize = (file.size / 1024 / 1024).toFixed(2); // in MB
      
      // Add message indicating file upload
      addMessage(`Uploading ${type}: ${fileName} (${fileSize} MB)`, true);
      
      // Show file preview
      fileUploadPreview.style.display = 'flex';
      document.getElementById('file-name').textContent = fileName;
      
      // Update usage stats
      if (isLoggedIn) {
        usageStats.files++;
        localStorage.setItem('usageStats', JSON.stringify(usageStats));
        if (document.getElementById('dashboard').classList.contains('active')) {
          updateDashboardStats();
        }
      }
      
      // Simulate upload process
      setTimeout(() => {
        addMessage(`Successfully uploaded ${type}: ${fileName}. How would you like me to process this file?`);
      }, 2000);
    }

    // Setup file inputs
    document.getElementById('upload-file').addEventListener('click', () => {
      document.getElementById('file-input').click();
    });

    document.getElementById('upload-image').addEventListener('click', () => {
      document.getElementById('image-input').click();
    });

    document.getElementById('take-photo').addEventListener('click', () => {
      document.getElementById('camera-input').click();
    });

    // Handle file input changes
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleFileUpload(e.target.files[0], "document");
        uploadOptions.classList.remove('active');
      }
    });

    imageInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleFileUpload(e.target.files[0], "image");
        uploadOptions.classList.remove('active');
      }
    });

    cameraInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleFileUpload(e.target.files[0], "photo");
        uploadOptions.classList.remove('active');
      }
    });

    // Speech to Text
    sttButton.addEventListener('click', () => {
      if (!isSpeechSupported) {
        showToast('Speech recognition not supported in your browser', 'error');
        return;
      }
      
      if (isListening) {
        // Stop listening
        recognition.stop();
        recognitionIndicator.classList.remove('active');
        sttButton.classList.remove('listening');
        isListening = false;
      } else {
        // Start listening
        recognition.start();
        recognitionIndicator.classList.add('active');
        sttButton.classList.add('listening');
        isListening = true;
        userInput.focus();
      }
    });

    // Clear Chat button
    clearBtn.addEventListener('click', () => {
      chatMessages.innerHTML = '';
      chatHistory = [];
      localStorage.removeItem('chatHistory');
      promptTemplates.style.display = 'block';
      fileUploadPreview.style.display = 'none';
      addMessage("Hello! I'm Alamz, your AI assistant. How can I help you today? You can ask me questions, upload documents, or choose a specialized mode from settings.");
    });

    // Settings button for chat
    settingsBtn.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });

    // Template buttons
    templateButtons.forEach(button => {
      button.addEventListener('click', () => {
        const templateText = button.textContent;
        addMessage(templateText, true);
        
        // Show typing indicator
        const typingIndicator = simulateTypingIndicator();
        
        // Simulate AI response
        setTimeout(() => {
          // Remove typing indicator
          typingIndicator.remove();
          
          // Add AI response
          addMessage("Great! Let me help you with that. Here's what I've come up with...");
        }, 1500);
      });
    });

    // Simulate some initial messages
    setTimeout(() => {
      addMessage("Welcome to Alamz AI! I'm here to help with any questions or tasks you have. Try asking me something or uploading a document.");
    }, 1000);
    
    // Update UI based on auth status
    updateAuthUI();