(() => {
  const data = window.PORTFOLIO_DATA || {};
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const safeUrl = (value) => {
    if (!value || typeof value !== 'string') return '';
    try {
      const url = new URL(value, window.location.href);
      if (url.protocol === 'https:' || url.protocol === 'http:') return url.href;
    } catch (_) {}
    return '';
  };
  const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

  // Fill the editable identity fields safely.
  const name = (data.name || 'Rahul Sutradhar').trim();
  document.title = `${name} â€” Selected Work & Ideas`;
  const description = $('meta[name="description"]');
  if (description && data.role) description.setAttribute('content', `${name} â€” ${data.role}. Selected work, ideas, and projects.`);
  $$('.brand-mark, .footer-mark').forEach((el) => { el.innerHTML = 'RS<span' + (el.classList.contains('footer-mark') ? '' : ' class="brand-dot"') + '>.</span>'; });
  $$('.footer-copyright').forEach((el) => { el.innerHTML = `Â© <span id="copyright-year">${new Date().getFullYear()}</span> ${escapeHTML(name.toUpperCase())}`; });
  const yearEl = $('#copyright-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  const aboutCopy = $('#about-copy');
  if (aboutCopy && data.about) aboutCopy.textContent = data.about;

  // Optional quick facts are only shown when populated.
  const factsWrap = $('#quickfacts');
  const facts = Array.isArray(data.facts) ? data.facts.filter((fact) => fact && fact.label && fact.value) : [];
  if (factsWrap && facts.length) {
    factsWrap.hidden = false;
    factsWrap.innerHTML = facts.map((fact) => `<div class="quickfact"><dt>${escapeHTML(fact.label)}</dt><dd>${escapeHTML(fact.value)}</dd></div>`).join('');
  }

  // Projects: never imply that placeholder projects are completed work.
  const projects = Array.isArray(data.projects) ? data.projects.filter((project) => project && project.title && project.description) : [];
  const projectContainer = $('#projects-container');
  const emptyWork = $('#empty-work');
  const projectCount = $('#project-count');
  if (projectCount) projectCount.textContent = String(projects.length).padStart(2, '0');
  if (projects.length && projectContainer) {
    if (emptyWork) emptyWork.remove();
    const grid = document.createElement('div');
    grid.className = 'project-grid';
    projects.forEach((project, index) => {
      const featured = Boolean(project.featured);
      const tools = Array.isArray(project.tools) ? project.tools.filter(Boolean) : [];
      const image = safeUrl(project.image);
      const liveUrl = safeUrl(project.liveUrl);
      const repoUrl = safeUrl(project.repoUrl);
      const category = project.category || 'Project';
      const card = document.createElement('article');
      card.className = `project-card reveal${featured ? ' is-featured' : ''}`;
      const imageMarkup = image
        ? `<img src="${escapeHTML(image)}" alt="${escapeHTML(project.imageAlt || `${project.title} project preview`)}" loading="lazy">`
        : `<div class="project-abstract" aria-hidden="true">${escapeHTML(project.shortLabel || `0${index + 1}`)}</div>`;
      const links = [liveUrl ? `<a class="project-action project-action-primary" href="${escapeHTML(liveUrl)}" target="_blank" rel="noopener noreferrer">View project <span aria-hidden="true">↗</span></a>` : '', repoUrl ? `<a class="project-action" href="${escapeHTML(repoUrl)}" target="_blank" rel="noopener noreferrer">Source code <span aria-hidden="true">↗</span></a>` : ''].filter(Boolean).join('');
      const noLinksLabel = project.concept ? 'CONCEPT STUDY / NO LIVE DEMO' : 'LINKS NOT PROVIDED';
      card.innerHTML = `<div class="project-visual">${imageMarkup}<span class="project-number mono">${escapeHTML(project.shortLabel || String(index + 1).padStart(2, '0'))}</span><span class="project-visual-caption mono">SELECTED STUDY / ${escapeHTML(project.year || '—')}</span></div><div class="project-info"><div class="project-meta"><span>${escapeHTML(category.toUpperCase())}</span><span>${escapeHTML(project.year || 'â€”')}</span></div><h3>${escapeHTML(project.title)}</h3><p>${escapeHTML(project.description)}</p>${tools.length ? `<div class="project-tools">${tools.map((tool) => `<span>${escapeHTML(tool)}</span>`).join('')}</div>` : ''}<div class="project-links">${links || `<span class="mono project-status">${noLinksLabel}</span>`}</div></div>`;
      grid.appendChild(card);
    });
    projectContainer.appendChild(grid);
  }

  // Skills and timeline remain hidden until real content is supplied.
  const skills = Array.isArray(data.skills) ? data.skills.filter((group) => group && group.group && Array.isArray(group.items) && group.items.length) : [];
  const expertise = $('#expertise');
  const skillsList = $('#skills-list');
  if (skills.length && expertise && skillsList) {
    expertise.hidden = false;
    skillsList.innerHTML = skills.map((group) => `<div class="skill-group"><h3>${escapeHTML(group.group)}</h3><div class="skill-chips">${group.items.map((item) => `<span>${escapeHTML(item)}</span>`).join('')}</div></div>`).join('');
  }
  const timeline = Array.isArray(data.timeline) ? data.timeline.filter((item) => item && item.title) : [];
  const journey = $('#journey');
  const timelineList = $('#timeline-list');
  if (timeline.length && journey && timelineList) {
    journey.hidden = false;
    timelineList.innerHTML = timeline.map((item) => `<article class="timeline-item"><div class="timeline-date">${escapeHTML(item.date || '')}</div><div><h3>${escapeHTML(item.title)}</h3><div class="timeline-place">${escapeHTML(item.place || '')}</div></div><p class="timeline-desc">${escapeHTML(item.description || '')}</p></article>`).join('');
  }

  // Real contact destinations only; don't display dead buttons.
  const links = $('#contact-links');
  const contactHint = $('#contact-hint');
  const contactItems = [];
  if (typeof data.phone === 'string' && /^\+?[0-9][0-9\s().-]*$/.test(data.phone.trim())) {
    const phone = data.phone.trim();
    const phoneHref = phone.replace(/[^\d+]/g, '');
    contactItems.push(`<a href="tel:${escapeHTML(phoneHref)}">CALL: ${escapeHTML(phone)} <span aria-hidden="true">â†—</span></a>`);
  }
  if (data.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    contactItems.push(`<a href="mailto:${escapeHTML(data.email)}">EMAIL: ${escapeHTML(data.email)} <span aria-hidden="true">â†—</span></a>`);
  }
  const social = data.social || {};
  [['linkedin', 'LINKEDIN'], ['github', 'GITHUB'], ['instagram', 'INSTAGRAM']].forEach(([key, label]) => {
    const url = safeUrl(social[key]);
    if (url) contactItems.push(`<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${label} <span aria-hidden="true">â†—</span></a>`);
  });
  if (links) links.innerHTML = contactItems.join('');
  if (contactHint && contactItems.length) contactHint.hidden = true;

  // Mobile navigation opens/closes accessibly and closes on selection or Escape.
  const menuToggle = $('.menu-toggle');
  const nav = $('#primary-nav');
  const navLinks = $$('.nav-link');
  const closeMenu = () => {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const opening = menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', String(opening));
      nav.classList.toggle('is-open', opening);
      document.body.classList.toggle('menu-open', opening);
      if (opening) {
        const first = $('.nav-link', nav);
        if (first && window.matchMedia('(max-width: 740px)').matches) first.focus({ preventScroll: true });
      }
    });
    navLinks.forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 740) closeMenu(); });
  }

  // Smooth in-page navigation with sticky-header offset behavior.
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = $(id);
      if (!target) return;
      event.preventDefault();
      closeMenu();
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      if (window.history && window.history.replaceState) window.history.replaceState(null, '', id);
    });
  });

  // Scroll-aware nav, sticky header, and back-to-top control.
  const header = $('.site-header');
  const topButton = $('.back-to-top');
  let ticking = false;
  const updateScrollUI = () => {
    const y = window.scrollY || 0;
    if (header) header.classList.toggle('is-scrolled', y > 24);
    if (topButton) topButton.classList.toggle('is-visible', y > 560);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { window.requestAnimationFrame(updateScrollUI); ticking = true; }
  }, { passive: true });
  updateScrollUI();
  if (topButton) topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }));

  const sections = ['home', 'about', 'work', 'contact'].map((id) => document.getElementById(id)).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-25% 0px -55% 0px', threshold: 0 });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  // Scroll reveals, bypassed for reduced motion.
  const revealEls = $$('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  // Small signature interaction: switch the abstract artwork between three modes.
  const heroArt = $('.hero-art');
  const modeButtons = $$('.mode-button');
  modeButtons.forEach((button) => button.addEventListener('click', () => {
    const mode = button.dataset.artMode;
    if (!heroArt || !mode) return;
    heroArt.dataset.mode = mode;
    modeButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle('is-selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
  }));
})();
