// Projects: class "feature" = full spread + cover line, class "note" = pinned on the wall.
const wall = document.getElementById('wall');
const coverLines = document.getElementById('cover-lines');
let alt = false;
document.querySelectorAll('.project').forEach(p => {
  if (p.classList.contains('note')) { wall.append(p); return; }
  p.classList.toggle('alt', alt);
  alt = !alt;
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
