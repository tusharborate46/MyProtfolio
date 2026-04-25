import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables');
}
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
const adminKey = process.env.ADMIN_PORTAL_KEY;

function requireAdmin(req, res, next) {
  if (req.headers['x-admin-key'] !== adminKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return next();
}

async function fetchPortfolio() {
  const [{ data: profile, error: profileError }, { data: skills, error: skillsError }, { data: projects, error: projectsError }, { data: contacts, error: contactsError }] = await Promise.all([
    supabase.from('profile').select('*').eq('id', 1).maybeSingle(),
    supabase.from('skills').select('*').order('id', { ascending: true }),
    supabase.from('projects').select('*').order('id', { ascending: false }),
    supabase.from('contacts').select('*').order('id', { ascending: true })
  ]);

  if (profileError) throw profileError;
  if (skillsError) throw skillsError;
  if (projectsError) throw projectsError;
  if (contactsError) throw contactsError;

  return { profile, skills, projects, contacts };
}

app.get('/api/portfolio', async (_req, res) => {
  try {
    const payload = await fetchPortfolio();
    res.json(payload);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/profile', requireAdmin, async (req, res) => {
  const { name, headline, about } = req.body;
  const { data, error } = await supabase
    .from('profile')
    .upsert({ id: 1, name, headline, about }, { onConflict: 'id' })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  return res.json(data);
});

app.post('/api/admin/skills', requireAdmin, async (req, res) => {
  const { name } = req.body;
  const { data, error } = await supabase.from('skills').insert({ name }).select().single();
  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json(data);
});

app.delete('/api/admin/skills/:id', requireAdmin, async (req, res) => {
  const { error } = await supabase.from('skills').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  return res.status(204).send();
});

app.post('/api/admin/projects', requireAdmin, async (req, res) => {
  const { title, tech_stack, summary, url } = req.body;
  const { data, error } = await supabase
    .from('projects')
    .insert({ title, tech_stack, summary, url })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json(data);
});

app.delete('/api/admin/projects/:id', requireAdmin, async (req, res) => {
  const { error } = await supabase.from('projects').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  return res.status(204).send();
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
