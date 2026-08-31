import './header.css';
import './timeline.css';
import { renderHeader, renderFooter } from './header.js';
import { renderTimeline } from './timeline.js';

renderHeader('#site-header', {
  siteName: 'Aggie Timeline',
  siteHref: `${import.meta.env.BASE_URL}`,
  nav: [
    { text: 'Timeline', href: `${import.meta.env.BASE_URL}` },
    { text: 'Digital Collections', href: 'https://digitalcollections.library.tamu.edu/' },
    { text: 'University Libraries', href: 'https://library.tamu.edu/' },
  ],
});

// Content lives in public/timeline.json — edit it directly, no code changes needed.
renderTimeline('#timeline', `${import.meta.env.BASE_URL}timeline.json`);

renderFooter('#site-footer');
