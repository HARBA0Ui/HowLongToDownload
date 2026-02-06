/**
 * Modern Download Time Estimator - Enhanced JavaScript
 */

// Speed presets in Mbps
const SPEED_PRESETS = {
  dial: 0.056,
  broadband: 10,
  fast: 100,
  very_fast: 500,
  gigabit: 1000
};

// Streaming bitrate presets in Mbps
const STREAMING_PRESETS = {
  "720p30": 3,
  "720p60": 4.5,
  "1080p30": 5,
  "1080p60": 8,
  "1440p60": 12,
  "4k30": 16,
  "4k60": 25
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  setupMobileNav();
  setupCalculator();
  setupSpeedPresets();
  setupFAQ();
  setupSmoothScroll();
  setupScrollAnimations();
  checkForPrefilledValues();
  setupStreamingCalculator();
});

/**
 * Mobile Navigation Toggle
 */
function setupMobileNav() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navbarMenu = document.querySelector('.navbar-menu');
  
  if (mobileToggle && navbarMenu) {
    mobileToggle.addEventListener('click', function() {
      navbarMenu.classList.toggle('active');
      
      // Animate hamburger icon
      const spans = this.querySelectorAll('span');
      if (navbarMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(8px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });
    
    // Close menu when clicking a link
    const navLinks = navbarMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navbarMenu.classList.remove('active');
        const spans = mobileToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });
  }
}

/**
 * Setup calculator form listeners
 */
function setupCalculator() {
  const form = document.getElementById('calculator-form');
  if (!form) return;
  
  const calculateBtn = document.getElementById('btn-calculate');
  if (calculateBtn) {
    calculateBtn.addEventListener('click', function(e) {
      e.preventDefault();
      calculateDownloadTime();
    });
  }
  
  // Allow Enter key on inputs
  const inputs = form.querySelectorAll('input[type="number"], select');
  inputs.forEach(input => {
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        calculateDownloadTime();
      }
    });
  });
}

/**
 * Setup streaming calculator listeners
 */
function setupStreamingCalculator() {
  const form = document.getElementById('streaming-form');
  if (!form) return;
  
  const calculateBtn = document.getElementById('btn-streaming');
  if (calculateBtn) {
    calculateBtn.addEventListener('click', function(e) {
      e.preventDefault();
      calculateStreamingReadiness();
    });
  }
  
  const inputs = form.querySelectorAll('input[type="number"], select');
  inputs.forEach(input => {
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        calculateStreamingReadiness();
      }
    });
  });
}

/**
 * Setup speed preset buttons
 */
function setupSpeedPresets() {
  const presetBtns = document.querySelectorAll('.preset-btn');
  presetBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      
      const speedKey = this.getAttribute('data-speed');
      const speed = SPEED_PRESETS[speedKey];
      
      if (speed) {
        document.getElementById('speed').value = speed;
        
        // Update active button state with animation
        presetBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Add a little bounce animation
        this.style.transform = 'scale(1.05)';
        setTimeout(() => {
          this.style.transform = '';
        }, 200);
      }
    });
  });
}

/**
 * Setup FAQ accordion
 */
function setupFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    if (question) {
      question.addEventListener('click', function() {
        const isActive = item.classList.contains('active');
        
        // Close all other FAQ items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });
        
        // Toggle current item
        item.classList.toggle('active');
      });
    }
  });
}

/**
 * Smooth scroll for navigation links
 */
function setupSmoothScroll() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#"
      if (href === '#') return;
      
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        e.preventDefault();
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = targetElement.offsetTop - navbarHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Scroll animations for sections
 */
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe all sections
  const sections = document.querySelectorAll('.calculator-section, .popular-section, .faq-section, .cta-section');
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
  
  // Observe cards with stagger effect
  const cards = document.querySelectorAll('.download-card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
  });
}

/**
 * Check for pre-filled values
 */
function checkForPrefilledValues() {
  const fileSizeInput = document.getElementById('file-size');
  const unitSelect = document.getElementById('unit');
  const speedInput = document.getElementById('speed');
  
  if (!fileSizeInput) return;
  
  const form = document.getElementById('calculator-form');
  if (!form) return;
  let fileSize = form.getAttribute('data-file-size');
  let unit = form.getAttribute('data-unit');
  let speed = form.getAttribute('data-speed');
  
  if (fileSize) {
    fileSizeInput.value = fileSize;
  }
  
  if (unit && unitSelect) {
    unitSelect.value = unit;
  }
  
  if (speed && speedInput) {
    speedInput.value = speed;
    
    // Highlight matching preset
    for (const [key, presetSpeed] of Object.entries(SPEED_PRESETS)) {
      if (presetSpeed === parseFloat(speed)) {
        const btn = document.querySelector(`[data-speed="${key}"]`);
        if (btn) {
          document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        }
      }
    }
  }
  
  // Auto-calculate if pre-filled
  if (fileSizeInput.value) {
    setTimeout(() => calculateDownloadTime(), 500);
  }
}

/**
 * Streaming readiness calculator
 */
function calculateStreamingReadiness() {
  const speedInput = document.getElementById('streaming-speed');
  const profileSelect = document.getElementById('streaming-profile');
  const resultDiv = document.getElementById('streaming-result');
  
  if (!speedInput || !profileSelect || !resultDiv) return;
  
  const uploadSpeed = parseFloat(speedInput.value);
  const profileKey = profileSelect.value;
  const targetBitrate = STREAMING_PRESETS[profileKey];
  
  if (!uploadSpeed || uploadSpeed <= 0) {
    showNotification('Please enter a valid upload speed', 'error');
    speedInput.focus();
    return;
  }
  
  const headroomMultiplier = 1.3;
  const requiredSpeed = targetBitrate * headroomMultiplier;
  const isReady = uploadSpeed >= requiredSpeed;
  
  const statusEl = resultDiv.querySelector('.result-time');
  const detailEl = resultDiv.querySelector('.result-eta');
  const recText = resultDiv.querySelector('.rec-text');
  
  if (statusEl) {
    statusEl.textContent = isReady ? 'Ready to Stream' : 'Not Enough Upload';
  }
  if (detailEl) {
    detailEl.textContent = `Target: ${targetBitrate.toFixed(1)} Mbps • Recommended: ${requiredSpeed.toFixed(1)} Mbps • Yours: ${uploadSpeed.toFixed(1)} Mbps`;
  }
  if (recText) {
    recText.textContent = isReady
      ? 'You have enough upload speed for this stream profile.'
      : 'Lower the resolution/FPS or upgrade your upload speed for smoother streaming.';
  }
  
  resultDiv.classList.add('visible');
  resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Main calculation function
 */
function calculateDownloadTime() {
  const fileSizeInput = document.getElementById('file-size');
  const unitSelect = document.getElementById('unit');
  const speedInput = document.getElementById('speed');
  const resultDiv = document.getElementById('result');
  
  if (!fileSizeInput || !unitSelect || !speedInput || !resultDiv) {
    console.error('Calculator elements not found');
    return;
  }
  
  const fileSize = parseFloat(fileSizeInput.value);
  const unit = unitSelect.value;
  const speed = parseFloat(speedInput.value);
  
  // Validation with friendly messages
  if (!fileSize || fileSize <= 0) {
    showNotification('Please enter a valid file size', 'error');
    fileSizeInput.focus();
    return;
  }
  
  if (!speed || speed <= 0) {
    showNotification('Please enter a valid internet speed', 'error');
    speedInput.focus();
    return;
  }
  
  // Convert file size to MB
  let fileSizeMB = fileSize;
  if (unit === 'GB') {
    fileSizeMB = fileSize * 1024;
  } else if (unit === 'TB') {
    fileSizeMB = fileSize * 1024 * 1024;
  }
  
  // Calculate download time in seconds
  const downloadSeconds = (fileSizeMB * 8) / speed;
  
  // Format the result
  const timeString = formatTime(downloadSeconds);
  const eta = calculateETA(downloadSeconds);
  const recommendation = getRecommendation(downloadSeconds);
  const transferLabel = getTransferLabel();
  
  // Display result with animation
  displayResult(timeString, eta, recommendation, transferLabel);
}

/**
 * Convert seconds to human-readable time format
 */
function formatTime(totalSeconds) {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  
  const parts = [];
  
  if (days > 0) {
    parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  }
  
  if (hours > 0) {
    parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  }
  
  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  }
  
  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);
  }
  
  return parts.join(', ');
}

/**
 * Calculate ETA
 */
function calculateETA(downloadSeconds) {
  const now = new Date();
  const completionTime = new Date(now.getTime() + downloadSeconds * 1000);
  
  const hours = completionTime.getHours();
  const minutes = String(completionTime.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  
  return `${String(displayHours).padStart(2, '0')}:${minutes} ${ampm}`;
}

/**
 * Get recommendation based on download time
 */
function getRecommendation(downloadSeconds) {
  if (downloadSeconds < 60) {
    return { icon: '!', text: 'Lightning fast! Should be done in seconds.' };
  } else if (downloadSeconds < 300) {
    return { icon: 'OK', text: 'Quick transfer, just a few minutes.' };
  } else if (downloadSeconds < 3600) {
    return { icon: 'TIME', text: 'Moderate wait. Perfect time for a coffee break!' };
  } else if (downloadSeconds < 28800) {
    return { icon: 'NIGHT', text: 'This will take a few hours. Great time to start overnight.' };
  } else if (downloadSeconds < 86400) {
    return { icon: 'ALARM', text: 'Large file! Consider starting this before bed.' };
  } else {
    return { icon: 'WARN', text: 'Very large file. This may take several days. Consider upgrading your connection.' };
  }
}

/**
 * Display the result
 */
function displayResult(timeString, eta, recommendation, transferLabel) {
  const resultDiv = document.getElementById('result');
  
  if (!resultDiv) return;
  
  const timeEl = resultDiv.querySelector('.result-time');
  const etaEl = resultDiv.querySelector('.result-eta');
  const recIcon = resultDiv.querySelector('.rec-icon');
  const recText = resultDiv.querySelector('.rec-text');
  
  if (timeEl) timeEl.textContent = timeString;
  if (etaEl) etaEl.textContent = `${transferLabel} will finish at approximately ${eta}`;
  if (recIcon && recIcon.tagName && recIcon.tagName.toLowerCase() !== 'svg') {
    recIcon.textContent = recommendation.icon;
  }
  if (recText) recText.textContent = recommendation.text;
  
  // Show with animation
  resultDiv.classList.add('visible');
  
  // Smooth scroll to result
  setTimeout(() => {
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
  
  showNotification('Calculation complete!', 'success');
}

/**
 * Get transfer label for upload/download pages
 */
function getTransferLabel() {
  const form = document.getElementById('calculator-form');
  const mode = (form ? form.getAttribute('data-mode') : null) || document.body.getAttribute('data-mode') || '';
  
  if (mode.toLowerCase() === 'upload') {
    return 'Upload';
  }
  
  return 'Download';
}

/**
 * Show notification (simple toast)
 */
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existing = document.querySelector('.notification-toast');
  if (existing) {
    existing.remove();
  }
  
  const toast = document.createElement('div');
  toast.className = `notification-toast ${type}`;
  toast.textContent = message;
  
  // Style the toast
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    padding: '1rem 1.5rem',
    borderRadius: '0.5rem',
    color: 'white',
    fontWeight: '600',
    zIndex: '10000',
    animation: 'slideInRight 0.3s ease',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
  });
  
  if (type === 'success') {
    toast.style.background = 'linear-gradient(135deg, #10b981, #059669)';
  } else if (type === 'error') {
    toast.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
  } else {
    toast.style.background = 'linear-gradient(135deg, #6366f1, #4f46e5)';
  }
  
  document.body.appendChild(toast);
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideInRight 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * Update active nav link on scroll
 */
window.addEventListener('scroll', function() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let current = '';
  const navbarHeight = (document.querySelector('.navbar') || {}).offsetHeight || 0;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (window.pageYOffset >= sectionTop - navbarHeight - 100) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});
