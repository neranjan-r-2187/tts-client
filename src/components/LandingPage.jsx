import React from 'react';

function LandingPage({ user, onGetStarted, onLogin, onGoToDashboard, onGuestDemo, onSignOut }) {
  return (
    <div className="landing-container">
      {/* Header / Navbar */}
      <nav className="landing-nav">
        <div className="landing-nav__brand">
          <span className="landing-nav__logo">🎙️</span>
          <span className="landing-nav__title">Vocalizer AI</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-badge">✨ Next-Gen AI Voice Generator</div>
        <h1 className="hero-title">Transform your text into lifelike speech.</h1>
        <p className="hero-subtitle">
          Turn any text into ultra-realistic audio with our advanced multi-language voice engine. Preview instantly or save as high-quality MP3s.
        </p>

        <div className="hero-cta-group">
          <button type="button" className="btn btn--primary hero-btn" onClick={onGuestDemo}>
            Get Started Now →
          </button>
        </div>

        {/* Feature Pill Tags */}
        <div className="hero-tags">
          <span className="tag-pill">✓ Global Languages</span>
          <span className="tag-pill">✓ Premium Neural Audio</span>
          <span className="tag-pill">✓ One-Click MP3 Download</span>
          <span className="tag-pill">✓ Generation Archive</span>
        </div>
      </section>

      {/* Features Grid */}
      <section className="landing-features">
        <h2 className="section-title">Everything you need for voice synthesis</h2>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3>Global Languages</h3>
            <p>Seamlessly generate speech in English, Hindi, Gujarati, Marathi, Spanish, French, and German.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎙️</div>
            <h3>Premium Neural Audio</h3>
            <p>Crystal-clear, studio-quality AI voices in both male and female tones.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💾</div>
            <h3>One-Click MP3 Download</h3>
            <p>Export your generated speech directly to your device as standard MP3 files in seconds.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📜</div>
            <h3>Generation Archive</h3>
            <p>Keep track of all your past audio creations securely in your user dashboard.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Quick Favorites</h3>
            <p>Bookmark your most-used voices for immediate access during your next session.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Streamlined Experience</h3>
            <p>A clean, lightning-fast interface built for ultimate ease of use.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} Vocalizer AI • Built with React & Express</p>
      </footer>
    </div>
  );
}

export default LandingPage;
