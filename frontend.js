const API_BASE = 'http://localhost:4000/api';

async function loadPortfolio() {
  try {
    const res = await fetch(`${API_BASE}/portfolio`);
    if (!res.ok) throw new Error('Failed to fetch portfolio data');
    const data = await res.json();

    document.getElementById('name').textContent = data.profile?.name || 'Your Name';
    document.getElementById('headline').textContent = data.profile?.headline || '';
    document.getElementById('about').textContent = data.profile?.about || '';

    const contactsEl = document.getElementById('contacts');
    contactsEl.innerHTML = '';
    (data.contacts || []).forEach((item) => {
      const li = document.createElement('li');
      li.textContent = `${item.label}: ${item.value}`;
      contactsEl.appendChild(li);
    });

    const skillsEl = document.getElementById('skills');
    skillsEl.innerHTML = '';
    (data.skills || []).forEach((skill) => {
      const badge = document.createElement('span');
      badge.className = 'tag';
      badge.textContent = skill.name;
      skillsEl.appendChild(badge);
    });

    const projectsEl = document.getElementById('projects');
    projectsEl.innerHTML = '';
    (data.projects || []).forEach((project) => {
      const card = document.createElement('article');
      card.className = 'project';
      card.innerHTML = `
        <h3>${project.title}</h3>
        <small>${project.tech_stack || ''}</small>
        <p>${project.summary || ''}</p>
        ${project.url ? `<a href="${project.url}" target="_blank" rel="noreferrer">View Project</a>` : ''}
      `;
      projectsEl.appendChild(card);
    });
  } catch (error) {
    document.getElementById('headline').textContent = `Error: ${error.message}`;
  }
}

loadPortfolio();
