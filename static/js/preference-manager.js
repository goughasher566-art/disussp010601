// Preference Management System
(function() {
  'use strict';

  const PREFERENCE_KEY = 'user_preferences';
  const PREFERENCE_EXPIRY_DAYS = 365;

  // Cookie utility functions
  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + date.toUTCString();
    document.cookie = name + '=' + value + ';' + expires + ';path=/;SameSite=Lax';
  }

  function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  // Check if preferences have been set
  function hasPreferences() {
    return getCookie(PREFERENCE_KEY) !== null;
  }

  // Get user preferences
  function getUserPreferences() {
    const prefs = getCookie(PREFERENCE_KEY);
    if (prefs) {
      try {
        return JSON.parse(prefs);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  // Save user preferences
  function savePreferences(preferences) {
    setCookie(PREFERENCE_KEY, JSON.stringify(preferences), PREFERENCE_EXPIRY_DAYS);
  }

  // Show preference banner
  function showPreferenceBanner() {
    const banner = document.getElementById('preference-banner');
    if (banner) {
      banner.style.display = 'block';
      setTimeout(() => {
        banner.classList.add('show');
      }, 10);
    }
  }

  // Hide preference banner
  function hidePreferenceBanner() {
    const banner = document.getElementById('preference-banner');
    if (banner) {
      banner.classList.remove('show');
      setTimeout(() => {
        banner.style.display = 'none';
      }, 300);
    }
  }

  // Accept all preferences
  function acceptAll() {
    const preferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    };
    savePreferences(preferences);
    hidePreferenceBanner();
    loadGoogleAnalytics();
    triggerPreferenceEvent('accepted_all', preferences);
  }

  // Accept necessary only
  function acceptNecessary() {
    const preferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    };
    savePreferences(preferences);
    hidePreferenceBanner();
    triggerPreferenceEvent('accepted_necessary', preferences);
  }

  // Save custom preferences
  function saveCustomPreferences() {
    const necessary = document.getElementById('pref-necessary');
    const analytics = document.getElementById('pref-analytics');
    const marketing = document.getElementById('pref-marketing');

    const preferences = {
      necessary: necessary ? necessary.checked : true,
      analytics: analytics ? analytics.checked : false,
      marketing: marketing ? marketing.checked : false,
      timestamp: new Date().toISOString()
    };

    savePreferences(preferences);
    hidePreferenceBanner();

    if (preferences.analytics) {
      loadGoogleAnalytics();
    }

    triggerPreferenceEvent('custom_preferences', preferences);
  }

  // Load Google Analytics conditionally
  function loadGoogleAnalytics() {
    const preferences = getUserPreferences();
    if (preferences && preferences.analytics) {
      // Load Google Analytics script if not already loaded
      if (typeof gtag === 'undefined' || !document.querySelector('script[src*="googletagmanager"]')) {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=AW-691892044';
        document.head.appendChild(script);
        
        script.onload = function() {
          gtag('config', 'AW-691892044');
          gtag('consent', 'update', {
            'analytics_storage': 'granted'
          });
        };
      } else {
        // Google Analytics is already loaded, just update consent
        if (typeof gtag !== 'undefined') {
          gtag('config', 'AW-691892044');
          gtag('consent', 'update', {
            'analytics_storage': 'granted'
          });
        }
      }
    }
  }

  // Trigger preference event
  function triggerPreferenceEvent(action, preferences) {
    if (typeof gtag !== 'undefined' && preferences.analytics) {
      gtag('event', 'preference_setting', {
        'event_category': 'engagement',
        'event_label': action,
        'value': 1
      });
    }
  }

  // Initialize preference management
  function initPreferenceManager() {
    // Check for existing preferences on page load
    if (!hasPreferences()) {
      showPreferenceBanner();
    } else {
      const preferences = getUserPreferences();
      if (preferences && preferences.analytics) {
        // Load GA script dynamically
        loadGoogleAnalytics();
      }
    }

    // Attach event listeners
    const acceptAllBtn = document.getElementById('pref-accept-all');
    const acceptNecessaryBtn = document.getElementById('pref-accept-necessary');
    const savePreferencesBtn = document.getElementById('pref-save');
    const customizeBtn = document.getElementById('pref-customize');
    const closeBtn = document.getElementById('pref-close');

    if (acceptAllBtn) {
      acceptAllBtn.addEventListener('click', acceptAll);
    }

    if (acceptNecessaryBtn) {
      acceptNecessaryBtn.addEventListener('click', acceptNecessary);
    }

    if (savePreferencesBtn) {
      savePreferencesBtn.addEventListener('click', saveCustomPreferences);
    }

    if (customizeBtn) {
      customizeBtn.addEventListener('click', function() {
        const settings = document.getElementById('preference-settings');
        if (settings) {
          settings.style.display = 'block';
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        hidePreferenceBanner();
      });
    }

    // Load preferences into settings if they exist
    const preferences = getUserPreferences();
    if (preferences) {
      const necessary = document.getElementById('pref-necessary');
      const analytics = document.getElementById('pref-analytics');
      const marketing = document.getElementById('pref-marketing');

      if (necessary) necessary.checked = preferences.necessary !== false;
      if (analytics) analytics.checked = preferences.analytics === true;
      if (marketing) marketing.checked = preferences.marketing === true;
    }
  }

  // Expose functions globally for manual control
  window.preferenceManager = {
    acceptAll: acceptAll,
    acceptNecessary: acceptNecessary,
    saveCustomPreferences: saveCustomPreferences,
    getPreferences: getUserPreferences,
    hasPreferences: hasPreferences,
    revoke: function() {
      deleteCookie(PREFERENCE_KEY);
      location.reload();
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreferenceManager);
  } else {
    initPreferenceManager();
  }
})();

