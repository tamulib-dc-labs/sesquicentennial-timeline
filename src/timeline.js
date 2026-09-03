import FlexSearch from 'flexsearch';

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

/**
 * Creates a timeline component with decade-based navigation and search
 * @param {Object} options - Configuration options
 * @param {string} options.title - The timeline title
 * @param {string} options.subtitle - Optional subtitle
 * @param {Array} options.decades - Array of decade objects
 * @param {boolean} options.enableSearch - Enable search functionality (default: true)
 * @returns {string} HTML string for the timeline
 *
 * Decade object structure:
 * {
 *   label: '1970s',
 *   year: '1970',
 *   events: [
 *     {
 *       date: '1975',
 *       title: 'Event Title',
 *       description: 'Event description',
 *       image: 'path/to/image.jpg', // optional
 *       imageAlt: 'Image description', // optional
 *       link: 'https://example.com' // optional
 *     }
 *   ]
 * }
 */
export function createTimeline({ title = 'Timeline', subtitle = '', decades = [], enableSearch = true } = {}) {
  const timelineId = `timeline-${Math.random().toString(36).substr(2, 9)}`;

  // Search box HTML — follows Aggie UX landing page header pattern
  const searchHTML = enableSearch ? `
    <div class="hero">
      <div class="hero__image">
        <img src="https://digitalcollections.library.tamu.edu/iiif/2/4e8%2Fimage-att-academicbuilding-3423991149-f2d8d808f2-o-edit-5d81e941-6682-4ea0-922c-87122fe202a9.jp2/0,585,2567,1212/full/0/default.jpg" alt="Historic Texas A&M Academic Building">
        <div class="hero__overlay"></div>
      </div>
      <div class="hero__container">
        <div class="hero__content">
          <h1 class="timeline-search-heading">Aggie Timeline</h1>
          <form class="timeline-search-form" role="search">
            <div class="timeline-search-form-row">
              <div class="timeline-search-input-wrap">
                <input
                  type="text"
                  class="timeline-search-input"
                  placeholder="Search events"
                  aria-label="Search timeline events"
                />
              </div>
              <div class="timeline-search-submit-wrap">
                <input
                  type="submit"
                  class="timeline-search-submit"
                  value="SEARCH"
                  aria-label="Submit search"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  ` : '';

  // Generate decade tabs with "All" tab for search results
  const allTabHTML = enableSearch ? `
    <button
      class="timeline-tab timeline-tab-all"
      data-decade="all"
      aria-selected="false"
      role="tab"
      style="display: none;"
    >
      Search Results
    </button>
  ` : '';

  const tabsHTML = decades.map((decade, index) => `
    <button
      class="timeline-tab ${index === 0 ? 'timeline-tab-active' : ''}"
      data-decade="${escapeHtml(decade.year)}"
      aria-selected="${index === 0 ? 'true' : 'false'}"
      role="tab"
    >
      ${escapeHtml(decade.label)}
    </button>
  `).join('');

  // Generate decade sections with event cards
  const sectionsHTML = decades.map((decade, index) => {
    const eventsHTML = decade.events.map((event, eventIndex) => {
      const eventId = `event-${decade.year}-${eventIndex}`;

      // Linked card structure (for cards with links)
      if (event.link) {
        const imageHTML = event.image ? `
          <div class="card__image">
            <img alt="${escapeHtml(event.imageAlt || event.title)}" src="${escapeHtml(event.image)}">
          </div>
        ` : '';

        return `
          <div class="linked-card" data-event-id="${escapeHtml(eventId)}" data-decade="${escapeHtml(decade.year)}">
            <span class="link-arrow" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            ${imageHTML}
            <div class="linked-card__content">
              <a href="${escapeHtml(event.link)}" class="linked-card__link" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(event.date)} ${escapeHtml(event.title)}">
                <div class="heading-group">
                  <span class="superhead">${escapeHtml(event.date)}</span>
                  <h3>${escapeHtml(event.title)}</h3>
                </div>
              </a>
              <p>${escapeHtml(event.description)}</p>
            </div>
          </div>
        `;
      }

      // Featured card structure (for non-linked cards)
      const imageHTML = event.image ? `
        <div class="card__image">
          <img alt="${escapeHtml(event.imageAlt || event.title)}" src="${escapeHtml(event.image)}">
        </div>
      ` : '';

      return `
        <div class="card card--featured" data-event-id="${escapeHtml(eventId)}" data-decade="${escapeHtml(decade.year)}">
          <div class="featured-container">
            ${imageHTML}
            <div class="card__content">
              <div class="heading-group heading-group--feature">
                <span class="superhead">${escapeHtml(event.date)}</span>
                <h2>${escapeHtml(event.title)}</h2>
              </div>
              <p>${escapeHtml(event.description)}</p>
            </div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div
        class="timeline-section ${index === 0 ? 'timeline-section-active' : ''}"
        data-decade="${decade.year}"
        role="tabpanel"
      >
        <div class="timeline-cards">
          ${eventsHTML}
        </div>
      </div>
    `;
  }).join('');

  // Search results section
  const searchResultsHTML = enableSearch ? `
    <div
      class="timeline-section timeline-search-results"
      data-decade="all"
      role="tabpanel"
      style="display: none;"
    >
      <div class="timeline-cards"></div>
      <div class="timeline-no-results" style="display: none;">
        <p>No events found matching your search.</p>
      </div>
    </div>
  ` : '';

  // Anniversary brand bar
  const anniversaryBar = `
    <div class="logo-strip logo-strip--light-gray logo-strip--simple" role="banner">
      <div class="logo-strip__container">
        <div class="logo-strip__left">
          <img alt="Texas A&M University 150 Here for Good logo" src="https://cache.cloud.tamu.edu/logo-strips/150.svg">
        </div>
        <span class="dot-divider"></span>
        <div class="logo-strip__right">
          <a href="https://150.tamu.edu/">Celebrate 150 Years</a>
        </div>
      </div>
    </div>
  `;

  return `
    <div class="timeline" id="${timelineId}">
      ${anniversaryBar}
      ${searchHTML}

      <div class="timeline-tabs" role="tablist">
        ${allTabHTML}
        ${tabsHTML}
      </div>

      <div class="timeline-content">
        ${searchResultsHTML}
        ${sectionsHTML}
      </div>
    </div>
  `;
}

/**
 * Creates a search index from timeline data
 * @param {Array} decades - Array of decade objects
 * @returns {Object} FlexSearch index and event mapping
 */
function createSearchIndex(decades) {
  const index = new FlexSearch.Document({
    document: {
      id: 'id',
      index: ['title', 'description', 'date'],
      store: ['title', 'description', 'date', 'decadeYear', 'eventIndex', 'image', 'imageAlt', 'link']
    },
    tokenize: 'forward',
    cache: true
  });

  const events = [];
  let eventId = 0;

  decades.forEach(decade => {
    decade.events.forEach((event, eventIndex) => {
      const doc = {
        id: eventId++,
        title: event.title,
        description: event.description,
        date: event.date,
        decadeYear: decade.year,
        eventIndex: eventIndex,
        image: event.image || '',
        imageAlt: event.imageAlt || '',
        link: event.link || ''
      };
      index.add(doc);
      events.push(doc);
    });
  });

  return { index, events };
}

/**
 * Attaches event listeners to timeline tabs and search
 * @param {Element} element - The timeline container element
 * @param {Object} searchData - Search index and events (optional)
 */
function attachTimelineListeners(element, searchData = null) {
  const tabs = element.querySelectorAll('.timeline-tab');
  const sections = element.querySelectorAll('.timeline-section');

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const decade = tab.dataset.decade;

      // Update active tab
      tabs.forEach(t => {
        t.classList.remove('timeline-tab-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('timeline-tab-active');
      tab.setAttribute('aria-selected', 'true');

      // Update active section
      sections.forEach(section => {
        if (section.dataset.decade === decade) {
          section.classList.add('timeline-section-active');
        } else {
          section.classList.remove('timeline-section-active');
        }
      });
    });
  });

  // Search functionality
  if (searchData) {
    const searchForm = element.querySelector('.timeline-search-form');
    const searchInput = element.querySelector('.timeline-search-input');
    const searchResultsSection = element.querySelector('.timeline-search-results');
    const searchResultsCards = searchResultsSection?.querySelector('.timeline-cards');
    const noResults = searchResultsSection?.querySelector('.timeline-no-results');
    const allTab = element.querySelector('.timeline-tab-all');

    if (searchInput && searchData) {
      let searchTimeout;

      // Helper: run a search for the current input value
      const runSearch = () => {
        const query = searchInput.value.trim();
        if (query.length >= 2) {
          performSearch(query, searchData, element, {
            searchResultsSection,
            searchResultsCards,
            noResults,
            allTab,
            tabs,
            sections
          });
        } else if (query.length === 0) {
          clearSearch({ searchResultsSection, allTab, tabs, sections });
        }
      };

      // Live (debounced) search as the user types
      searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(runSearch, 300);
      });

      // Submit via the Search button / Enter key
      if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
          e.preventDefault();
          clearTimeout(searchTimeout);
          runSearch();
        });
      }
    }
  }
}

/**
 * Performs a search and displays results
 */
function performSearch(query, searchData, element, components) {
  const { searchResultsSection, searchResultsCards, noResults, allTab, tabs, sections } = components;

  // Perform search
  const results = searchData.index.search(query, { limit: 100, enrich: true });

  // Combine results from different fields
  const uniqueResults = new Map();
  results.forEach(fieldResults => {
    fieldResults.result.forEach(item => {
      if (!uniqueResults.has(item.id)) {
        uniqueResults.set(item.id, item.doc);
      }
    });
  });

  const resultDocs = Array.from(uniqueResults.values());

  if (resultDocs.length > 0) {
    // Show results
    const resultsHTML = resultDocs.map(event => {
      const eventId = `event-${event.decadeYear}-${event.eventIndex}`;

      // Linked card structure (for cards with links)
      if (event.link) {
        const imageHTML = event.image ? `
          <div class="card__image">
            <img alt="${escapeHtml(event.imageAlt || event.title)}" src="${escapeHtml(event.image)}">
          </div>
        ` : '';

        return `
          <div class="linked-card" data-event-id="${escapeHtml(eventId)}" data-decade="${escapeHtml(event.decadeYear)}">
            <span class="link-arrow" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            ${imageHTML}
            <div class="linked-card__content">
              <a href="${escapeHtml(event.link)}" class="linked-card__link" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(event.date)} ${escapeHtml(event.title)}">
                <div class="heading-group">
                  <span class="superhead">${escapeHtml(event.date)}</span>
                  <h3>${escapeHtml(event.title)}</h3>
                </div>
              </a>
              <p>${escapeHtml(event.description)}</p>
            </div>
          </div>
        `;
      }

      // Featured card structure (for non-linked cards)
      const imageHTML = event.image ? `
        <div class="card__image">
          <img alt="${escapeHtml(event.imageAlt || event.title)}" src="${escapeHtml(event.image)}">
        </div>
      ` : '';

      return `
        <div class="card card--featured" data-event-id="${escapeHtml(eventId)}" data-decade="${escapeHtml(event.decadeYear)}">
          <div class="featured-container">
            ${imageHTML}
            <div class="card__content">
              <div class="heading-group heading-group--feature">
                <span class="superhead">${escapeHtml(event.date)}</span>
                <h2>${escapeHtml(event.title)}</h2>
              </div>
              <p>${escapeHtml(event.description)}</p>
            </div>
          </div>
        </div>
      `;
    }).join('');

    searchResultsCards.innerHTML = resultsHTML;
    noResults.style.display = 'none';
  } else {
    searchResultsCards.innerHTML = '';
    noResults.style.display = 'block';
  }

  // Switch to search results tab
  if (allTab) {
    allTab.style.display = 'block';
    allTab.textContent = `Search Results (${resultDocs.length})`;

    tabs.forEach(t => {
      t.classList.remove('timeline-tab-active');
      t.setAttribute('aria-selected', 'false');
    });
    allTab.classList.add('timeline-tab-active');
    allTab.setAttribute('aria-selected', 'true');
  }

  sections.forEach(section => {
    section.classList.remove('timeline-section-active');
  });
  searchResultsSection.style.display = 'block';
  searchResultsSection.classList.add('timeline-section-active');
}

/**
 * Clears search and returns to normal view
 */
function clearSearch(components) {
  const { searchResultsSection, allTab, tabs, sections } = components;

  // Hide search results
  if (searchResultsSection) {
    searchResultsSection.style.display = 'none';
    searchResultsSection.classList.remove('timeline-section-active');
  }

  // Hide "All" tab
  if (allTab) {
    allTab.style.display = 'none';
    allTab.classList.remove('timeline-tab-active');
    allTab.setAttribute('aria-selected', 'false');
  }

  // Activate first regular tab
  const firstRegularTab = Array.from(tabs).find(t => !t.classList.contains('timeline-tab-all'));
  if (firstRegularTab) {
    firstRegularTab.classList.add('timeline-tab-active');
    firstRegularTab.setAttribute('aria-selected', 'true');

    const decade = firstRegularTab.dataset.decade;
    sections.forEach(section => {
      if (section.dataset.decade === decade && !section.classList.contains('timeline-search-results')) {
        section.classList.add('timeline-section-active');
      } else {
        section.classList.remove('timeline-section-active');
      }
    });
  }
}

/**
 * Renders timeline into a DOM element and attaches event listeners
 * @param {string} selector - CSS selector for the container element
 * @param {Object|string} options - Timeline configuration options or path to JSON file
 * @returns {Promise<void>} Promise that resolves when timeline is rendered
 *
 * Usage with inline data:
 *   renderTimeline('#timeline', { title: 'My Timeline', decades: [...] })
 *
 * Usage with JSON file:
 *   renderTimeline('#timeline', 'data/timeline.json')
 *   or
 *   renderTimeline('#timeline', { dataUrl: 'data/timeline.json' })
 */
export async function renderTimeline(selector, options) {
  const element = document.querySelector(selector);
  if (!element) return;

  let timelineData;

  // Handle different input types
  if (typeof options === 'string') {
    // If options is a string, treat it as a JSON file path
    try {
      const response = await fetch(options);
      if (!response.ok) {
        throw new Error(`Failed to load timeline data: ${response.statusText}`);
      }
      timelineData = await response.json();
    } catch (error) {
      console.error('Error loading timeline JSON:', error);
      element.innerHTML = `<div class="timeline-error">Error loading timeline data</div>`;
      return;
    }
  } else if (options && options.dataUrl) {
    // If options has a dataUrl property, fetch from that URL
    try {
      const response = await fetch(options.dataUrl);
      if (!response.ok) {
        throw new Error(`Failed to load timeline data: ${response.statusText}`);
      }
      timelineData = await response.json();
    } catch (error) {
      console.error('Error loading timeline JSON:', error);
      element.innerHTML = `<div class="timeline-error">Error loading timeline data</div>`;
      return;
    }
  } else {
    // Otherwise use inline data
    timelineData = options;
  }

  element.innerHTML = createTimeline(timelineData);

  // Create search index if search is enabled
  const enableSearch = timelineData.enableSearch !== false;
  const searchData = enableSearch ? createSearchIndex(timelineData.decades) : null;

  attachTimelineListeners(element, searchData);
}
