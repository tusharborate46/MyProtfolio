const USERNAME = 'tusharborate46';
const API_BASE = 'https://api.github.com';

const tabs = document.querySelectorAll('.tab');
const sections = document.querySelectorAll('.section');
const indicator = document.querySelector('.indicator');
const glow = document.querySelector('.bg-glow');

const glowPositions = {
  profile: { x: '-220px', y: '-220px' },
  projects: { x: '58%', y: '-160px' },
  skills: { x: '-160px', y: '58%' },
  contact: { x: '62%', y: '60px' }
};

let driftX = 0;
let driftY = 0;

function animateDrift() {
  driftX += 0.025;
  driftY += 0.018;
  glow.style.transform = `translate(${Math.sin(driftX) * 90}px, ${Math.cos(driftY) * 70}px) scale(${1 + Math.sin(driftX / 4) * 0.04})`;
  requestAnimationFrame(animateDrift);
}

function moveGlow(target) {
  const pos = glowPositions[target];
  if (!pos) return;
  glow.style.transition = 'top 2.8s ease, left 2.8s ease';
  glow.style.left = pos.x;
  glow.style.top = pos.y;
}

function moveIndicator(tab) {
  if (!indicator || window.innerWidth <= 900) return;
  const rect = tab.getBoundingClientRect();
  const navRect = tab.parentElement.getBoundingClientRect();
  indicator.style.top = `${rect.top - navRect.top}px`;
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((item) => item.classList.remove('active'));
    sections.forEach((section) => section.classList.remove('active'));

    tab.classList.add('active');
    document.getElementById(tab.dataset.target).classList.add('active');

    moveIndicator(tab);
    moveGlow(tab.dataset.target);
  });
});

async function getJSON(url) {
  const response = await fetch(url, {
    headers: { Accept: 'application/vnd.github+json' }
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed (${response.status})`);
  }

  return response.json();
}

function setProfile(profile) {
  document.getElementById('brandName').textContent = profile.name || profile.login;
  document.getElementById('name').textContent = profile.name || profile.login;
  document.getElementById('bio').textContent = profile.bio || 'No bio available in profile.';
  document.getElementById('about').textContent =
    `${profile.name || profile.login} is based in ${profile.location || 'an undisclosed location'} and actively builds in public on GitHub.`;

  const stats = document.getElementById('stats');
  const values = [
    `${profile.public_repos} repos`,
    `${profile.followers} followers`,
    `${profile.following} following`,
    profile.company || 'Independent'
  ];
  stats.innerHTML = values.map((value) => `<span class="stat">${value}</span>`).join('');

  const contactLinks = document.getElementById('contactLinks');
  const links = [
    { label: `GitHub ↗ ${profile.login}`, href: profile.html_url },
    profile.blog ? { label: `Website ↗ ${profile.blog}`, href: profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}` } : null,
    { label: `Email ↗ ${profile.login}@users.noreply.github.com`, href: `mailto:${profile.login}@users.noreply.github.com` }
  ].filter(Boolean);

  contactLinks.innerHTML = links
    .map((link) => `<a href="${link.href}" target="_blank" rel="noreferrer">${link.label}</a>`)
    .join('');
}

function setProjects(repos) {
  const container = document.getElementById('projectsGrid');
  const featured = repos
    .filter((repo) => !repo.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count || b.forks_count - a.forks_count)
    .slice(0, 6);

  if (!featured.length) {
    container.innerHTML = '<article class="project-card"><h3 class="project-title">No repositories found</h3></article>';
    return;
  }

  container.innerHTML = featured.map((repo) => `
    <article class="project-card">
      <h3 class="project-title">${repo.name}</h3>
      <p>${repo.description || 'No description provided.'}</p>
      <p class="project-tech">${repo.language || 'N/A'} · updated ${new Date(repo.updated_at).toLocaleDateString()}</p>
      <p class="project-meta">⭐ ${repo.stargazers_count} · 🍴 ${repo.forks_count}</p>
      <a class="project-link" href="${repo.html_url}" target="_blank" rel="noreferrer">Open Repository ↗</a>
    </article>
  `).join('');
}

function setSkills(repos, profile) {
  const languageTags = document.getElementById('languageTags');
  const signalTags = document.getElementById('signalTags');

  const counts = {};
  repos.forEach((repo) => {
    if (!repo.language) return;
    counts[repo.language] = (counts[repo.language] || 0) + 1;
  });

  const topLanguages = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  languageTags.innerHTML = topLanguages.length
    ? topLanguages.map(([name, count]) => `<span class="tag">${name} · ${count}</span>`).join('')
    : '<span class="tag">No language data</span>';

  const signals = [
    `Public repos · ${profile.public_repos}`,
    `Followers · ${profile.followers}`,
    `Following · ${profile.following}`,
    `Gists · ${profile.public_gists}`,
    `Account · ${new Date(profile.created_at).getFullYear()}`
  ];

  signalTags.innerHTML = signals.map((item) => `<span class="tag">${item}</span>`).join('');
}

async function loadPortfolio() {
  try {
    const [profile, repos] = await Promise.all([
      getJSON(`${API_BASE}/users/${USERNAME}`),
      getJSON(`${API_BASE}/users/${USERNAME}/repos?per_page=100&sort=updated`)
    ]);

    setProfile(profile);
    setProjects(repos);
    setSkills(repos, profile);
  } catch (error) {
    document.getElementById('name').textContent = 'Unable to load profile';
    document.getElementById('bio').textContent = error.message;
    document.getElementById('projectsGrid').innerHTML = '<article class="project-card"><h3 class="project-title">Error loading repositories</h3></article>';
  }
}

moveIndicator(document.querySelector('.tab.active'));
moveGlow('profile');
animateDrift();
loadPortfolio();

window.addEventListener('resize', () => {
  moveIndicator(document.querySelector('.tab.active'));
});
