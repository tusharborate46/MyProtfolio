const API_BASE = 'http://localhost:4000/api';

const getKey = () => document.getElementById('adminKey').value.trim();

function setStatus(message) {
  document.getElementById('status').textContent = message;
}

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': getKey(),
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || `Request failed (${response.status})`);
  }

  if (response.status === 204) return null;
  return response.json();
}

async function loadData() {
  const data = await api('/portfolio');
  document.getElementById('name').value = data.profile?.name || '';
  document.getElementById('headline').value = data.profile?.headline || '';
  document.getElementById('about').value = data.profile?.about || '';

  const skillList = document.getElementById('skillList');
  skillList.innerHTML = '';
  (data.skills || []).forEach((skill) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${skill.name}</span><button class="danger" data-skill-id="${skill.id}">Delete</button>`;
    skillList.appendChild(li);
  });

  const projectList = document.getElementById('projectList');
  projectList.innerHTML = '';
  (data.projects || []).forEach((project) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${project.title}</span><button class="danger" data-project-id="${project.id}">Delete</button>`;
    projectList.appendChild(li);
  });
}

async function saveProfile() {
  await api('/admin/profile', {
    method: 'PUT',
    body: JSON.stringify({
      name: document.getElementById('name').value,
      headline: document.getElementById('headline').value,
      about: document.getElementById('about').value
    })
  });
  setStatus('Profile saved.');
}

async function addSkill() {
  const name = document.getElementById('skillName').value.trim();
  if (!name) return;
  await api('/admin/skills', { method: 'POST', body: JSON.stringify({ name }) });
  document.getElementById('skillName').value = '';
  await loadData();
  setStatus('Skill added.');
}

async function addProject() {
  const payload = {
    title: document.getElementById('projectTitle').value.trim(),
    tech_stack: document.getElementById('projectStack').value.trim(),
    summary: document.getElementById('projectSummary').value.trim(),
    url: document.getElementById('projectLink').value.trim()
  };
  if (!payload.title) return;
  await api('/admin/projects', { method: 'POST', body: JSON.stringify(payload) });
  document.getElementById('projectTitle').value = '';
  document.getElementById('projectStack').value = '';
  document.getElementById('projectSummary').value = '';
  document.getElementById('projectLink').value = '';
  await loadData();
  setStatus('Project added.');
}

async function removeSkill(id) {
  await api(`/admin/skills/${id}`, { method: 'DELETE' });
  await loadData();
}

async function removeProject(id) {
  await api(`/admin/projects/${id}`, { method: 'DELETE' });
  await loadData();
}

document.getElementById('loadBtn').addEventListener('click', async () => {
  try {
    await loadData();
    setStatus('Data loaded.');
  } catch (error) {
    setStatus(error.message);
  }
});

document.getElementById('saveProfile').addEventListener('click', async () => {
  try {
    await saveProfile();
  } catch (error) {
    setStatus(error.message);
  }
});

document.getElementById('addSkill').addEventListener('click', async () => {
  try {
    await addSkill();
  } catch (error) {
    setStatus(error.message);
  }
});

document.getElementById('addProject').addEventListener('click', async () => {
  try {
    await addProject();
  } catch (error) {
    setStatus(error.message);
  }
});

document.getElementById('skillList').addEventListener('click', async (event) => {
  const id = event.target.getAttribute('data-skill-id');
  if (!id) return;
  try {
    await removeSkill(id);
  } catch (error) {
    setStatus(error.message);
  }
});

document.getElementById('projectList').addEventListener('click', async (event) => {
  const id = event.target.getAttribute('data-project-id');
  if (!id) return;
  try {
    await removeProject(id);
  } catch (error) {
    setStatus(error.message);
  }
});
