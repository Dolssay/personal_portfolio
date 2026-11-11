// Projects: class "feature" = full spread + cover line, class "note" = pinned on the wall.
const wall = document.getElementById('wall');
const coverLines = document.getElementById('cover-lines');
document.querySelectorAll('.project').forEach(p => {
  if (p.classList.contains('note')) { wall.append(p); return; }
  const a = document.createElement('a');
  a.className = 'line';
  a.href = '#' + p.id;
  a.dataset.reveal = '';
  const place = document.createElement('b');
  place.textContent = p.dataset.place || '';
  a.append(place, p.dataset.line || p.querySelector('h2').textContent);
  coverLines.append(a);
});
wall.closest('.wall').hidden = !wall.children.length;

// Entrance: the parts of each section rise in turn as it enters.
const reveal = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in');
  reveal.unobserve(e.target);
}), { rootMargin: '0px 0px -10% 0px' });
document.querySelectorAll('header, section').forEach(sec => {
  sec.querySelectorAll('[data-reveal]').forEach((el, i) => {
    if (el.closest('header, section') !== sec && !el.closest('.wall')) return;
    el.style.setProperty('--d', Math.min(i, 6) * 80 + 'ms');
    reveal.observe(el);
  });
});

// The AWS stamp lands when the certification block is half in view.
const stamp = new IntersectionObserver(([e]) => {
  if (e.isIntersecting) { e.target.classList.add('in'); stamp.disconnect(); }
}, { threshold: .5 });
const page = document.querySelector('.page');
if (page) stamp.observe(page);

// Photo stacks: arrows on the front photo cycle the slides (wraps around).
const chevron = d => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${d}" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
document.querySelectorAll('[data-stack]').forEach(stack => {
  const imgs = [...stack.querySelectorAll('.shots img')];
  if (imgs.length < 2) return;
  const cap = stack.querySelector('.cap');
  const nav = document.createElement('div');
  nav.className = 'stack-nav';
  nav.innerHTML = `<button type="button" class="prev" aria-label="Previous photo">${chevron('m15 18-6-6 6-6')}</button><span class="count">1 / ${imgs.length}</span><button type="button" class="next" aria-label="Next photo">${chevron('m9 18 6-6-6-6')}</button>`;
  stack.querySelector('.shots').append(nav);
  let i = 0;
  const show = n => {
    imgs[i].classList.remove('on');
    i = (n + imgs.length) % imgs.length;
    imgs[i].classList.add('on');
    cap.textContent = imgs[i].dataset.caption || '';
    nav.querySelector('.count').textContent = `${i + 1} / ${imgs.length}`;
  };
  nav.querySelector('.prev').addEventListener('click', () => show(i - 1));
  nav.querySelector('.next').addEventListener('click', () => show(i + 1));
});

// Flip notes: click the photo to read the back.
document.querySelectorAll('.flip').forEach(card => {
  const hit = card.querySelector('.flip-hit');
  hit.addEventListener('click', () => hit.setAttribute('aria-pressed', card.classList.toggle('flipped')));
});

// Expand: every photo gets a button (top right) that opens it full size.
const box = document.createElement('dialog');
box.className = 'lightbox';
box.innerHTML = '<img alt=""><p></p><button type="button" class="close" aria-label="Close">×</button>';
document.body.append(box);
box.addEventListener('click', e => { if (e.target === box || e.target.closest('.close')) box.close(); });
const expandIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const addExpand = (host, pickImg) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'expand';
  b.setAttribute('aria-label', 'View photo full size');
  b.innerHTML = expandIcon;
  b.addEventListener('click', e => {
    e.stopPropagation();
    const img = pickImg();
    box.querySelector('img').src = img.currentSrc || img.src;
    box.querySelector('img').alt = img.alt;
    box.querySelector('p').textContent = img.dataset.caption || img.closest('figure')?.querySelector('figcaption')?.textContent || img.alt;
    box.showModal();
  });
  host.append(b);
};
document.querySelectorAll('.cover-photo, .screen').forEach(f => addExpand(f, () => f.querySelector('img')));
document.querySelectorAll('.shots').forEach(s => addExpand(s, () => s.querySelector('img.on')));
document.querySelectorAll('.flip').forEach(c => addExpand(c, () => c.querySelector('.front img')));

// The live thing: load the real aircraft demo in place of its screenshot.
const tryDemo = document.getElementById('try-demo');
tryDemo?.addEventListener('click', () => {
  const frame = document.getElementById('demo-frame');
  frame.classList.add('live');
  frame.innerHTML = '<iframe src="https://advanced-design-visualization.vercel.app/demo1/" title="Boeing 777 design visualization demo"></iframe>';
  tryDemo.textContent = 'Demo loaded below';
  tryDemo.disabled = true;
  frame.scrollIntoView({ block: 'center' });
});
