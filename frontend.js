const USERNAME = 'tusharborate46';
const API_BASE = 'https://api.github.com';

async function getJSON(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json'
    }
  });
  if (!response.ok) {
    throw new Error(`GitHub API request failed (${response.status})`);
  }
  return response.json();
}

function setMeta(profile) {
  const meta = document.getElementById('meta');
  const details = [
    `${profile.followers} followers`,
    `${profile.following} following`,
    `${profile.public_repos} public repos`,
    profile.location || 'Location unavailable'
  ];
  meta.innerHTML = details.map((text) => `<li>${text}</li>`).join('');
}

function setLanguages(repos) {
  const languages = {};
  repos.forEach((repo) => {
    if (!repo.language) return;
    languages[repo.language] = (languages[repo.language] || 0) + 1;
  });

  const sorted = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const languagesEl = document.getElementById('languages');
  languagesEl.innerHTML = '';

  if (!sorted.length) {
    languagesEl.innerHTML = '<span class="tag">No language stats available</span>';
    return;
  }

  sorted.forEach(([language, count]) => {
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = `${language} • ${count}`;
    languagesEl.appendChild(tag);
  });
}

function setRepos(repos) {
  const reposEl = document.getElementById('repos');
  reposEl.innerHTML = '';

  repos
    .slice(0, 6)
    .forEach((repo) => {
      const card = document.createElement('article');
      card.className = 'repo';
      card.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description || 'No description provided.'}</p>
        <small>⭐ ${repo.stargazers_count} • 🍴 ${repo.forks_count} • ${repo.language || 'N/A'}</small><br />
        <a href="${repo.html_url}" target="_blank" rel="noreferrer">Open Repository</a>
      `;
      reposEl.appendChild(card);
    });
}

async function loadPortfolio() {
  try {
    const [profile, repos] = await Promise.all([
      getJSON(`${API_BASE}/users/${USERNAME}`),
      getJSON(`${API_BASE}/users/${USERNAME}/repos?per_page=100&sort=updated`)
    ]);

    const filteredRepos = repos.filter((repo) => !repo.fork);
    const featured = [...filteredRepos].sort(
      (a, b) => b.stargazers_count - a.stargazers_count || b.forks_count - a.forks_count
    );

    document.getElementById('avatar').src = profile.avatar_url;
    document.getElementById('name').textContent = profile.name || profile.login;
    document.getElementById('bio').textContent = profile.bio || 'No bio available in profile.';
    document.getElementById('aboutText').textContent = profile.bio || 'Update your GitHub bio to show more information here.';

    const githubLink = document.getElementById('githubLink');
    githubLink.href = profile.html_url;

    const blogLink = document.getElementById('blogLink');
    if (profile.blog) {
      const normalized = profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`;
      blogLink.href = normalized;
    } else {
      blogLink.style.display = 'none';
    }

    document.getElementById('repoMore').href = `${profile.html_url}?tab=repositories`;

    setMeta(profile);
    setLanguages(filteredRepos);
    setRepos(featured);
  } catch (error) {
    document.getElementById('name').textContent = 'Unable to load profile';
    document.getElementById('bio').textContent = error.message;
    document.getElementById('aboutText').textContent =
      'Check your internet connection or GitHub API rate limits, then refresh the page.';
  }
}

loadPortfolio();
