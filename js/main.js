
const body = document.body;
const current = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === current) a.classList.add('active');
});

const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav-links');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

const orb = document.querySelector('.cursor-orb');
window.addEventListener('pointermove', (e) => {
  if (!orb) return;
  orb.style.left = e.clientX + 'px';
  orb.style.top = e.clientY + 'px';
});

document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `rotateX(${(-y*5).toFixed(2)}deg) rotateY(${(x*5).toFixed(2)}deg)`;
  });
  card.addEventListener('pointerleave', () => card.style.transform = 'rotateX(0deg) rotateY(0deg)');
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, {threshold:.14});

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
document.querySelectorAll('.reveal-stagger').forEach(group => {
  [...group.children].forEach((el, i) => {
    el.style.transitionDelay = `${i * 80}ms`;
    observer.observe(el);
  });
});

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.count, 10);
    let n = 0;
    const step = Math.max(1, Math.ceil(target / 38));
    const suffix = el.textContent.includes('+') ? '+' : '';
    const timer = setInterval(() => {
      n += step;
      if (n >= target) { n = target; clearInterval(timer); }
      el.textContent = n + suffix;
    }, 24);
    countObserver.unobserve(el);
  });
}, {threshold:.8});
document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

// Products filter
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    productCards.forEach(card => {
      card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  });
});

// Sourcing network content
const networkData = {
  buyer: {k:'Buyer Market', h:'Requirement received and reviewed.', p:'Product category, quantity, specs, target price, delivery window and compliance needs are clarified before sourcing begins.'},
  desk: {k:'TR Sourcing Desk', h:'One coordination point manages the sourcing route.', p:'The sourcing desk reviews production options, questions unclear details, confirms feasibility and organizes communication with selected partners.'},
  factory: {k:'Sri Lanka Manufacturing', h:'Production partners matched to the project.', p:'Factories are considered based on machinery, workforce, product type, capacity, sampling ability and quality expectations.'},
  shipment: {k:'Export Shipment', h:'Inspection and export support before release.', p:'Final review, packing status, documentation and shipment coordination are checked before goods move to destination markets.'}
};
const networkCopy = document.getElementById('networkCopy');
document.querySelectorAll('.map-point').forEach(point => {
  point.addEventListener('mouseenter', () => setNetwork(point));
  point.addEventListener('focus', () => setNetwork(point));
  point.addEventListener('click', () => setNetwork(point));
});
function setNetwork(point){
  document.querySelectorAll('.map-point').forEach(p => p.classList.remove('active'));
  point.classList.add('active');
  if (!networkCopy) return;
  const d = networkData[point.dataset.network];
  networkCopy.innerHTML = `<span class="section-kicker">${d.k}</span><h2>${d.h}</h2><p>${d.p}</p>`;
}

// Process steps
const steps = [
  ['01','Inquiry Review','You send product details, quantity, target market, timeline and technical references.'],
  ['02','Feasibility & Costing','TR Global reviews category fit, MOQ, material availability and production route.'],
  ['03','Factory Matching','A production partner is selected around capability, product type and order requirements.'],
  ['04','Sampling','Prototype, fit, approval or pre-production samples are coordinated depending on the project.'],
  ['05','Production Follow-Up','Production status, timing, quality concerns and packing details are monitored.'],
  ['06','Inspection & Shipment','Final checks, documentation and shipment coordination are completed before release.']
];
const processDetail = document.getElementById('processDetail');
document.querySelectorAll('.process-step').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.process-step').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const d = steps[Number(btn.dataset.step)];
    if (processDetail) processDetail.innerHTML = `<span>${d[0]}</span><h2>${d[1]}</h2><p>${d[2]}</p>`;
  });
});

// Contact preview
const form = document.getElementById('inquiryForm');
const preview = document.getElementById('inquiryPreview');
if (form && preview) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name') || 'Buyer';
    const company = data.get('company') || 'Company not provided';
    const category = data.get('category') || 'Product category';
    const qty = data.get('quantity') || 'Quantity not provided';
    const country = data.get('country') || 'Country not provided';
    const msg = data.get('message') || 'No additional project details added yet.';
    preview.innerHTML = `<span class="section-kicker">Inquiry preview</span><h2>${category}</h2><p><strong>Contact:</strong> ${name}<br><strong>Company:</strong> ${company}<br><strong>Country:</strong> ${country}<br><strong>Estimated quantity:</strong> ${qty}</p><p>${msg}</p><a class="btn primary" href="mailto:info@trglobalsolutions.ca?subject=TR Global Sourcing Inquiry - ${encodeURIComponent(category)}&body=${encodeURIComponent(msg)}">Open email draft</a>`;
  });
}
