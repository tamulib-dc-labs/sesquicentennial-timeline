/**
 * TAMU-style site header, modeled on the Aggie UX / bootstrap_barrio
 * masthead used at https://digitalcollections.library.tamu.edu/
 *
 * Three stacked bands:
 *   1. Maroon institutional top bar  — TAMU chevron wordmark + utility links/dropdowns
 *   2. White site-identity band       — site title + primary TAMU logo
 *   3. Light-gray primary nav bar     — site navigation (collapses to a toggle on mobile)
 */

/**
 * Escapes HTML special characters in a string to prevent XSS.
 * @param {string} str - The string to escape
 * @returns {string} The escaped string
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const CHEVRON = `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
  <path d="M60.98 0H13.5c-1.67 0-3.02 1.35-3.02 3.02s1.35 3.02 3.02 3.02h40.18L.89 58.84a3.018 3.018 0 0 0 0 4.27 3.018 3.018 0 0 0 4.27 0l52.79-52.79V50.5c0 1.67 1.35 3.02 3.02 3.02s3.02-1.35 3.02-3.02V3.02c0-1.67-1.35-3.02-3.02-3.02Z" style="stroke-width:0"/>
</svg>`;

const DEFAULT_TOP_LINKS = [
  { text: 'Help', href: 'https://library.tamu.edu/askus' },
  { text: 'Hours', href: 'https://library.tamu.edu/about/hours' },
  { text: 'My Library', href: 'https://library.tamu.edu/mylibrary/' },
];

const DEFAULT_DROPDOWNS = [
  {
    text: 'Libraries',
    items: [
      { text: 'Cushing Memorial Library & Archives', href: 'https://library.tamu.edu/cushing/' },
      { text: 'Jack K. Williams Library - Galveston', href: 'https://library.tamu.edu/galveston/' },
      { text: 'Medical Sciences Library', href: 'https://library.tamu.edu/medical-sciences/' },
      { text: 'Sterling C. Evans Library & Annex', href: 'https://library.tamu.edu/evans/' },
      { text: 'West Campus Library', href: 'https://library.tamu.edu/west-campus/' },
    ],
  },
  {
    text: 'Information For',
    items: [
      { text: 'Undergraduates', href: 'https://library.tamu.edu/' },
      { text: 'Graduates', href: 'https://library.tamu.edu/' },
      { text: 'Faculty', href: 'https://library.tamu.edu/' },
      { text: 'Individuals with Disabilities', href: 'https://library.tamu.edu/' },
    ],
  },
];

function dropdownHTML({ text, items }, idx) {
  const id = `hdr-dd-${idx}`;
  return `
    <div class="tamu-top-bar__dropdown">
      <button type="button" class="tamu-top-bar__button" aria-expanded="false" aria-controls="${id}">
        ${escapeHtml(text)}
        <span class="tamu-top-bar__caret" aria-hidden="true">▾</span>
      </button>
      <ul class="tamu-top-bar__menu" id="${id}" role="menu">
        ${items.map((i) => `<li role="none"><a role="menuitem" href="${escapeHtml(i.href)}" target="_blank" rel="noopener">${escapeHtml(i.text)}</a></li>`).join('')}
      </ul>
    </div>`;
}

/**
 * @param {Object} opts
 * @param {string} opts.siteName        Text shown in the white identity band.
 * @param {string} [opts.siteHref]      Link target for the site name (default '/').
 * @param {Array}  [opts.nav]           Primary nav: [{ text, href }].
 * @param {Array}  [opts.topLinks]      Utility links in the maroon bar.
 * @param {Array}  [opts.dropdowns]     Dropdown menus in the maroon bar.
 * @param {string} [opts.logoSrc]       Primary TAMU logo image URL.
 */
export function createHeader({
  siteName = 'Digital Collections',
  siteHref = '/',
  nav = [{ text: 'Home', href: '/' }],
  topLinks = DEFAULT_TOP_LINKS,
  dropdowns = DEFAULT_DROPDOWNS,
  logoSrc = `${import.meta.env.BASE_URL}images/primaryTAM.png`,
} = {}) {
  return `
  <div class="tamu-top-bar" role="banner" aria-label="Institutional header">
    <div class="tamu-top-bar__inner">
      <a href="https://www.tamu.edu" class="tamu-top-bar__brand" target="_blank" rel="noopener">
        ${CHEVRON}
        <span class="tamu-top-bar__wordmark">Texas A&amp;M University</span>
      </a>
      <nav class="tamu-top-bar__nav" aria-label="Institutional links">
        ${topLinks.map((l) => `<a href="${escapeHtml(l.href)}" class="tamu-top-bar__link" target="_blank" rel="noopener">${escapeHtml(l.text)}</a>`).join('')}
        ${dropdowns.map(dropdownHTML).join('')}
      </nav>
    </div>
  </div>

  <div class="tamu-site-identity">
    <div class="tamu-site-identity__inner">
      <div class="tamu-site-identity__title"><a href="${escapeHtml(siteHref)}">${escapeHtml(siteName)}</a></div>
      <div class="tamu-site-identity__logo">
        <a aria-label="Texas A&amp;M University" href="https://www.tamu.edu" target="_blank" rel="noopener">
          <img alt="Texas A&amp;M University" src="${escapeHtml(logoSrc)}" />
        </a>
      </div>
    </div>
  </div>

  <nav class="tamu-navbar" aria-label="Primary">
    <div class="tamu-navbar__inner">
      <button type="button" class="tamu-navbar__toggle" aria-expanded="false" aria-controls="tamu-navbar-menu" aria-label="Toggle navigation">
        <span class="tamu-navbar__toggle-bar"></span>
      </button>
      <ul class="tamu-navbar__menu" id="tamu-navbar-menu">
        ${nav.map((l, i) => `<li><a class="tamu-navbar__link${i === 0 ? ' is-active' : ''}" href="${escapeHtml(l.href)}">${escapeHtml(l.text)}</a></li>`).join('')}
      </ul>
    </div>
  </nav>`;
}

function attachHeaderListeners(root) {
  // Maroon-bar dropdowns: click to toggle, click-outside / Escape to close.
  const dropdowns = [...root.querySelectorAll('.tamu-top-bar__dropdown')];
  const closeAll = (except) => {
    dropdowns.forEach((d) => {
      if (d === except) return;
      d.classList.remove('is-open');
      d.querySelector('.tamu-top-bar__button')?.setAttribute('aria-expanded', 'false');
    });
  };
  dropdowns.forEach((d) => {
    const btn = d.querySelector('.tamu-top-bar__button');
    btn?.addEventListener('click', () => {
      const open = d.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
      closeAll(d);
    });
  });
  document.addEventListener('click', (e) => {
    if (e.target.closest('.tamu-top-bar__dropdown')) return;
    closeAll(null);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll(null);
  });

  // Mobile nav toggle.
  const toggle = root.querySelector('.tamu-navbar__toggle');
  const menu = root.querySelector('.tamu-navbar__menu');
  toggle?.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
}

export function renderHeader(selector, opts) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.innerHTML = createHeader(opts);
  attachHeaderListeners(el);
}

/**
 * Creates the TAMU footer with AskUs section, navigation, and social media links
 */
export function createFooter() {
  return `
  <footer aria-label="giving and organization information" class="tamu-footer">
    <div class="tamu-footer__inner">
      <div class="tamu-footer__col tamu-footer__col--brand">
        <a href="https://library.tamu.edu/about/giving/" class="tamu-footer__support-btn">Support the Libraries</a>
        <img src="${import.meta.env.BASE_URL}images/150-logo.svg" alt="Texas A&M 150th Anniversary Logo" class="tamu-footer__anniversary-logo">
      </div>
      <div class="tamu-footer__col tamu-footer__col--askus">
        <div class="tamu-footer__askus-header">
          <img alt="Ask Us" src="${import.meta.env.BASE_URL}images/askus_white.png" width="80" height="76">
          <h2 class="tamu-footer__askus-title">ASKUS ANYTHING<br>AT ANY TIME.</h2>
        </div>
        <ul class="tamu-footer__links">
          <li><a href="https://library.tamu.edu/askus/index"><span class="tamu-footer__arrow">➜</span> Chat with Us</a></li>
          <li><a href="https://library.tamu.edu/about/phone"><span class="tamu-footer__arrow">➜</span> Call Us</a></li>
          <li><a href="sms:9792561091"><span class="tamu-footer__arrow">➜</span> Text Us @ 979-256-1091</a></li>
          <li><a href="https://library.tamu.edu/askus/contact-us.php"><span class="tamu-footer__arrow">➜</span> Email Us</a></li>
        </ul>
      </div>
      <div class="tamu-footer__col tamu-footer__col--nav">
        <ul class="tamu-footer__links tamu-footer__links--nav">
          <li><a href="https://library.tamu.edu/about/">About the Libraries</a></li>
          <li><a href="https://library.tamu.edu/about/phone">Quick Phone & Mailing List</a></li>
          <li><a href="https://library.tamu.edu/directory/">Directory</a></li>
          <li><a href="https://library.tamu.edu/about/employment/">Employment</a></li>
          <li>
            <a href="https://library.tamu.edu/sitemap">Site Map</a>
            <span class="tamu-footer__divider">|</span>
            <a href="https://library.tamu.edu/search/site">Site Search</a>
          </li>
        </ul>
        <h3 class="tamu-footer__follow-heading">Follow Us</h3>
        <ul class="tamu-footer__social">
          <li><a href="https://www.facebook.com/profile.php?id=61577442545402" aria-label="Follow us on Facebook">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a></li>
          <li><a href="https://www.instagram.com/tamulibraries" aria-label="Follow us on Instagram">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a></li>
          <li><a href="https://twitter.com/tamulibraries" aria-label="Follow us on Twitter">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
          </a></li>
          <li><a href="https://www.youtube.com/user/tamulibrary" aria-label="Follow us on YouTube">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </a></li>
          <li><a href="https://linkedin.com/company/tamulibraries" aria-label="Follow us on LinkedIn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a></li>
        </ul>
      </div>
    </div>
  </footer>
  <div class="tamu-footer-bar">
    <div class="tamu-footer-bar__inner">
      <a href="https://howdy.tamu.edu">howdy.tamu.edu</a>
      <a href="https://library.tamu.edu/services/off-campus_access">Off-Campus Access</a>
      <a href="https://www.tamu.edu">Texas A&amp;M University</a>
      <a href="https://library.tamu.edu/site-policies">Site Policies</a>
      <a href="https://www.tamu.edu/accessibility/">Accessibility</a>
      <a href="https://library.tamu.edu/texas-crews">Texas CREWS</a>
      <a href="https://library.tamu.edu/askus/contact-us.php">Comments</a>
      <a href="https://library.tamu.edu/services-status">Services Status</a>
    </div>
  </div>`;
}

export function renderFooter(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.innerHTML = createFooter();
}
