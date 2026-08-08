const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');
const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'laboratory.sqlite');
const SESSION_COOKIE = 'lab_session';
const SESSION_DURATION_MS = 1000 * 60 * 60 * 8; // 8 horas

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new DatabaseSync(dbPath);
db.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS patients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    patientCode TEXT NOT NULL UNIQUE,
    age INTEGER NOT NULL,
    sex TEXT NOT NULL,
    phone TEXT,
    area TEXT NOT NULL,
    municipality TEXT NOT NULL DEFAULT 'San Carlos',
    locality TEXT NOT NULL DEFAULT '',
    affiliation TEXT NOT NULL DEFAULT 'Sin derechohabiencia',
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS studies (
    id TEXT PRIMARY KEY,
    patientId TEXT NOT NULL,
    type TEXT NOT NULL,
    date TEXT NOT NULL,
    priority TEXT NOT NULL,
    status TEXT NOT NULL,
    sampleType TEXT NOT NULL DEFAULT 'Sangre',
    fastingHours INTEGER NOT NULL DEFAULT 0,
    sampleCondition TEXT NOT NULL DEFAULT 'Adecuada',
    diagnosis TEXT NOT NULL DEFAULT '',
    resultFileName TEXT NOT NULL DEFAULT '',
    resultFileType TEXT NOT NULL DEFAULT '',
    resultFileData TEXT NOT NULL DEFAULT '',
    resultFileUploadedAt TEXT NOT NULL DEFAULT '',
    doctor TEXT,
    folio TEXT,
    notes TEXT,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patientId) REFERENCES patients(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    fullName TEXT NOT NULL DEFAULT '',
    passwordHash TEXT NOT NULL,
    passwordSalt TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'captura',
    active INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    username TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiresAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS activity_log (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entityId TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

function ensureColumn(tableName, columnName, definition) {
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all().map((column) => column.name);
  if (!columns.includes(columnName)) {
    db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
  }
}

ensureColumn('patients', 'municipality', "TEXT NOT NULL DEFAULT 'San Carlos'");
ensureColumn('patients', 'locality', "TEXT NOT NULL DEFAULT ''");
ensureColumn('patients', 'affiliation', "TEXT NOT NULL DEFAULT 'Sin derechohabiencia'");
ensureColumn('studies', 'sampleType', "TEXT NOT NULL DEFAULT 'Sangre'");
ensureColumn('studies', 'fastingHours', 'INTEGER NOT NULL DEFAULT 0');
ensureColumn('studies', 'sampleCondition', "TEXT NOT NULL DEFAULT 'Adecuada'");
ensureColumn('studies', 'diagnosis', "TEXT NOT NULL DEFAULT ''");
ensureColumn('studies', 'resultFileName', "TEXT NOT NULL DEFAULT ''");
ensureColumn('studies', 'resultFileType', "TEXT NOT NULL DEFAULT ''");
ensureColumn('studies', 'resultFileData', "TEXT NOT NULL DEFAULT ''");
ensureColumn('studies', 'resultFileUploadedAt', "TEXT NOT NULL DEFAULT ''");
ensureColumn('studies', 'resultParameters', "TEXT NOT NULL DEFAULT ''");
ensureColumn('users', 'role', "TEXT NOT NULL DEFAULT 'captura'");
ensureColumn('users', 'active', 'INTEGER NOT NULL DEFAULT 1');

// Las bases de datos creadas antes de que existieran roles no tenían ningún
// usuario marcado como "admin". Si detectamos que ningún usuario tiene ese
// rol, promovemos al usuario más antiguo para no dejar el sistema sin nadie
// que pueda gestionar usuarios.
const adminCount = db.prepare("SELECT COUNT(*) AS count FROM users WHERE role = 'admin'").get().count;
if (adminCount === 0) {
  const oldestUser = db.prepare('SELECT id FROM users ORDER BY createdAt ASC LIMIT 1').get();
  if (oldestUser) {
    db.prepare("UPDATE users SET role = 'admin' WHERE id = ?").run(oldestUser.id);
  }
}

function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

const VALID_ROLES = new Set(['admin', 'captura', 'lectura']);

function createUser(username, password, fullName = '', role = 'captura') {
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  const id = crypto.randomUUID();
  const safeRole = VALID_ROLES.has(role) ? role : 'captura';
  db.prepare(`
    INSERT INTO users (id, username, fullName, passwordHash, passwordSalt, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, username, fullName, passwordHash, salt, safeRole);
  return id;
}

function mapUser(row) {
  return {
    id: row.id,
    username: row.username,
    fullName: row.fullName || '',
    role: row.role || 'captura',
    active: Boolean(row.active),
    createdAt: row.createdAt
  };
}

function isAdmin(req) {
  return Boolean(req.sessionUser && req.sessionUser.role === 'admin');
}

function canWrite(req) {
  return Boolean(req.sessionUser && req.sessionUser.role !== 'lectura');
}

const userCount = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
if (userCount === 0) {
  createUser('admin', 'admin123', 'Administrador del laboratorio', 'admin');
  console.log('Usuario inicial creado -> usuario: admin / contraseña: admin123 (cámbiala después de iniciar sesión)');
}

function logActivity(username, action, entity, entityId, description) {
  db.prepare(`
    INSERT INTO activity_log (id, username, action, entity, entityId, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(crypto.randomUUID(), username || 'desconocido', action, entity, entityId || '', description || '');
}

function parseCookies(req) {
  const header = req.headers.cookie;
  const cookies = {};
  if (!header) {
    return cookies;
  }

  for (const part of header.split(';')) {
    const index = part.indexOf('=');
    if (index === -1) {
      continue;
    }

    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    cookies[key] = decodeURIComponent(value);
  }

  return cookies;
}

function getSessionUser(req) {
  const cookies = parseCookies(req);
  const token = cookies[SESSION_COOKIE];
  if (!token) {
    return null;
  }

  const session = db.prepare('SELECT * FROM sessions WHERE token = ?').get(token);
  if (!session) {
    return null;
  }

  if (new Date(session.expiresAt).getTime() < Date.now()) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    return null;
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(session.userId);
  if (!user || !user.active) {
    // El usuario fue desactivado o eliminado después de iniciar sesión:
    // cerramos la sesión inmediatamente.
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    return null;
  }

  return { userId: session.userId, username: session.username, token, role: user.role || 'captura' };
}

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function sendText(res, statusCode, message) {
  res.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(message);
}

function sendFile(res, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      sendText(res, 404, 'Archivo no encontrado');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';

    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        reject(new Error('Payload too large'));
        req.destroy();
      }
    });

    req.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });

    req.on('error', reject);
  });
}

function getPatients() {
  return db.prepare('SELECT * FROM patients ORDER BY createdAt DESC').all();
}

function getStudies() {
  return db.prepare(`
    SELECT studies.*, patients.name AS patientName, patients.patientCode AS patientCode, patients.age AS patientAge,
           patients.sex AS patientSex, patients.phone AS patientPhone, patients.area AS patientArea,
           patients.municipality AS patientMunicipality, patients.locality AS patientLocality,
           patients.affiliation AS patientAffiliation
    FROM studies
    INNER JOIN patients ON patients.id = studies.patientId
    ORDER BY studies.createdAt DESC
  `).all();
}

function mapPatient(row) {
  return {
    id: row.id,
    name: row.name,
    patientCode: row.patientCode,
    age: row.age,
    sex: row.sex,
    phone: row.phone || '',
    area: row.area,
    municipality: row.municipality || 'San Carlos',
    locality: row.locality || '',
    affiliation: row.affiliation || 'Sin derechohabiencia',
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}

function mapStudy(row) {
  return {
    id: row.id,
    patientId: row.patientId,
    type: row.type,
    date: row.date,
    priority: row.priority,
    status: row.status,
    sampleType: row.sampleType || 'Sangre',
    fastingHours: row.fastingHours || 0,
    sampleCondition: row.sampleCondition || 'Adecuada',
    diagnosis: row.diagnosis || '',
    resultFileName: row.resultFileName || '',
    resultFileType: row.resultFileType || '',
    resultFileData: row.resultFileData || '',
    resultFileUploadedAt: row.resultFileUploadedAt || '',
    resultParameters: row.resultParameters || '',
    doctor: row.doctor || '',
    folio: row.folio || '',
    notes: row.notes || '',
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    patient: {
      id: row.patientId,
      name: row.patientName,
      patientCode: row.patientCode,
      age: row.patientAge,
      sex: row.patientSex,
      phone: row.patientPhone || '',
      area: row.patientArea,
      municipality: row.patientMunicipality || 'San Carlos',
      locality: row.patientLocality || '',
      affiliation: row.patientAffiliation || 'Sin derechohabiencia'
    }
  };
}

function validatePatient(payload) {
  const name = String(payload.name || '').trim();
  const patientCode = String(payload.patientCode || '').trim().toUpperCase();
  const age = Number(payload.age);
  const sex = String(payload.sex || '').trim();
  const phone = String(payload.phone || '').trim();
  const area = String(payload.area || 'Consulta externa').trim() || 'Consulta externa';
  const municipality = String(payload.municipality || 'San Carlos').trim() || 'San Carlos';
  const locality = String(payload.locality || '').trim();
  const affiliation = String(payload.affiliation || 'Sin derechohabiencia').trim() || 'Sin derechohabiencia';

  if (!name || !patientCode || Number.isNaN(age) || !sex) {
    return null;
  }

  return { name, patientCode, age, sex, phone, area, municipality, locality, affiliation };
}

function validateStudy(payload) {
  const patientId = String(payload.patientId || '').trim();
  const type = String(payload.type || '').trim();
  const date = String(payload.date || '').trim();
  const priority = String(payload.priority || '').trim();
  const status = String(payload.status || '').trim();
  const sampleType = String(payload.sampleType || 'Sangre').trim() || 'Sangre';
  const fastingHours = Number(payload.fastingHours || 0);
  const sampleCondition = String(payload.sampleCondition || 'Adecuada').trim() || 'Adecuada';
  const diagnosis = String(payload.diagnosis || '').trim();
  const resultFileName = String(payload.resultFileName || '').trim();
  const resultFileType = String(payload.resultFileType || '').trim();
  const resultFileData = String(payload.resultFileData || '').trim();
  const resultFileUploadedAt = String(payload.resultFileUploadedAt || '').trim();
  let resultParameters = '';
  if (typeof payload.resultParameters === 'string') {
    resultParameters = payload.resultParameters.trim();
  } else if (payload.resultParameters && typeof payload.resultParameters === 'object') {
    resultParameters = JSON.stringify(payload.resultParameters);
  }
  const doctor = String(payload.doctor || '').trim();
  const folio = String(payload.folio || '').trim();
  const notes = String(payload.notes || '').trim();

  if (!patientId || !type || !date || !priority || !status) {
    return null;
  }

  return { patientId, type, date, priority, status, sampleType, fastingHours: Number.isNaN(fastingHours) ? 0 : fastingHours, sampleCondition, diagnosis, resultFileName, resultFileType, resultFileData, resultFileUploadedAt, resultParameters, doctor, folio, notes };
}

// Genera el siguiente folio consecutivo del año en curso (p. ej. L-2026-0001).
// Busca el folio más alto ya usado con ese prefijo (en vez de contar filas)
// para que no se repita un folio aunque se hayan borrado estudios anteriores.
function generateNextFolio() {
  const year = new Date().getFullYear();
  const prefix = `L-${year}-`;
  const rows = db.prepare('SELECT folio FROM studies WHERE folio LIKE ?').all(`${prefix}%`);

  let max = 0;
  for (const row of rows) {
    const suffix = (row.folio || '').slice(prefix.length);
    const num = parseInt(suffix, 10);
    if (!Number.isNaN(num) && num > max) {
      max = num;
    }
  }

  return `${prefix}${String(max + 1).padStart(4, '0')}`;
}

function validateUserPayload(body, { requirePassword }) {
  const username = String(body.username || '').trim();
  const fullName = String(body.fullName || '').trim();
  const role = VALID_ROLES.has(body.role) ? body.role : 'captura';
  const password = String(body.password || '');
  const active = body.active === false || body.active === 0 ? 0 : 1;

  if (!username) {
    return { error: 'El nombre de usuario es obligatorio' };
  }

  if ((requirePassword || password) && password.length < 6) {
    return { error: 'La contraseña debe tener al menos 6 caracteres' };
  }

  return { username, fullName, role, password, active };
}

const PUBLIC_ROUTES = new Set(['/api/health', '/api/login']);

function handleApi(req, res, requestUrl) {
  const { pathname } = requestUrl;

  if (req.method === 'GET' && pathname === '/api/health') {
    sendJson(res, 200, { ok: true, database: 'sqlite' });
    return true;
  }

  if (req.method === 'POST' && pathname === '/api/login') {
    readBody(req)
      .then((body) => {
        const username = String(body.username || '').trim();
        const password = String(body.password || '');
        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

        if (!user || hashPassword(password, user.passwordSalt) !== user.passwordHash) {
          sendJson(res, 401, { error: 'Usuario o contraseña incorrectos' });
          return;
        }

        if (!user.active) {
          sendJson(res, 403, { error: 'Tu usuario está desactivado. Contacta a un administrador.' });
          return;
        }

        const token = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();
        db.prepare(`
          INSERT INTO sessions (token, userId, username, expiresAt)
          VALUES (?, ?, ?, ?)
        `).run(token, user.id, user.username, expiresAt);

        logActivity(user.username, 'Inicio de sesión', 'auth', user.id, '');

        res.setHeader('Set-Cookie', `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DURATION_MS / 1000}`);
        sendJson(res, 200, { ok: true, username: user.username, fullName: user.fullName, role: user.role || 'captura' });
      })
      .catch(() => sendJson(res, 400, { error: 'Cuerpo JSON inválido' }));
    return true;
  }

  // A partir de aquí, todas las rutas requieren sesión iniciada.
  if (!PUBLIC_ROUTES.has(pathname)) {
    const sessionUser = getSessionUser(req);
    if (!sessionUser) {
      sendJson(res, 401, { error: 'Sesión no válida, inicia sesión de nuevo' });
      return true;
    }
    req.sessionUser = sessionUser;
  }

  if (req.method === 'GET' && pathname === '/api/session') {
    const user = db.prepare('SELECT username, fullName, role FROM users WHERE id = ?').get(req.sessionUser.userId);
    sendJson(res, 200, { username: req.sessionUser.username, fullName: user?.fullName || '', role: user?.role || 'captura' });
    return true;
  }

  if (req.method === 'POST' && pathname === '/api/logout') {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(req.sessionUser.token);
    logActivity(req.sessionUser.username, 'Cierre de sesión', 'auth', req.sessionUser.userId, '');
    res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
    sendJson(res, 200, { ok: true });
    return true;
  }

  if (req.method === 'GET' && pathname === '/api/activity-log') {
    const rows = db.prepare('SELECT * FROM activity_log ORDER BY createdAt DESC LIMIT 30').all();
    sendJson(res, 200, rows);
    return true;
  }

  if (req.method === 'GET' && pathname === '/api/summary') {
    const patientsCount = db.prepare('SELECT COUNT(*) AS count FROM patients').get().count;
    const studiesCount = db.prepare('SELECT COUNT(*) AS count FROM studies').get().count;
    const pendingCount = db.prepare("SELECT COUNT(*) AS count FROM studies WHERE status = 'Pendiente'").get().count;
    const deliveredCount = db.prepare("SELECT COUNT(*) AS count FROM studies WHERE status = 'Entregado'").get().count;

    sendJson(res, 200, {
      patients: patientsCount,
      studies: studiesCount,
      pending: pendingCount,
      delivered: deliveredCount
    });
    return true;
  }

  if (req.method === 'GET' && pathname === '/api/patients') {
    sendJson(res, 200, getPatients().map(mapPatient));
    return true;
  }

  if (req.method === 'POST' && pathname === '/api/patients') {
    if (!canWrite(req)) {
      sendJson(res, 403, { error: 'Tu rol es de solo lectura y no permite registrar pacientes' });
      return true;
    }
    readBody(req)
      .then((body) => {
        const payload = validatePatient(body);
        if (!payload) {
          sendJson(res, 400, { error: 'Datos de paciente inválidos' });
          return;
        }

        const exists = db.prepare('SELECT id FROM patients WHERE patientCode = ?').get(payload.patientCode);
        if (exists) {
          sendJson(res, 409, { error: 'Ya existe un paciente con ese ID' });
          return;
        }

        const id = String(body.id || crypto.randomUUID()).trim() || crypto.randomUUID();
        db.prepare(`
          INSERT INTO patients (id, name, patientCode, age, sex, phone, area, municipality, locality, affiliation)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(id, payload.name, payload.patientCode, payload.age, payload.sex, payload.phone, payload.area, payload.municipality, payload.locality, payload.affiliation);

        const created = db.prepare('SELECT * FROM patients WHERE id = ?').get(id);
        logActivity(req.sessionUser.username, 'Registró paciente', 'patient', id, `${payload.name} (${payload.patientCode})`);
        sendJson(res, 201, mapPatient(created));
      })
      .catch(() => sendJson(res, 400, { error: 'Cuerpo JSON inválido' }));
    return true;
  }

  if (req.method === 'PUT' && pathname.startsWith('/api/patients/')) {
    if (!canWrite(req)) {
      sendJson(res, 403, { error: 'Tu rol es de solo lectura y no permite editar pacientes' });
      return true;
    }
    const patientId = pathname.split('/').pop();
    readBody(req)
      .then((body) => {
        const payload = validatePatient(body);
        if (!payload || !patientId) {
          sendJson(res, 400, { error: 'Datos de paciente inválidos' });
          return;
        }

        const duplicate = db.prepare('SELECT id FROM patients WHERE patientCode = ? AND id <> ?').get(payload.patientCode, patientId);
        if (duplicate) {
          sendJson(res, 409, { error: 'Ya existe otro paciente con ese ID' });
          return;
        }

        const result = db.prepare(`
          UPDATE patients
          SET name = ?, patientCode = ?, age = ?, sex = ?, phone = ?, area = ?, municipality = ?, locality = ?, affiliation = ?, updatedAt = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(payload.name, payload.patientCode, payload.age, payload.sex, payload.phone, payload.area, payload.municipality, payload.locality, payload.affiliation, patientId);

        if (result.changes === 0) {
          sendJson(res, 404, { error: 'Paciente no encontrado' });
          return;
        }

        const updated = db.prepare('SELECT * FROM patients WHERE id = ?').get(patientId);
        logActivity(req.sessionUser.username, 'Actualizó paciente', 'patient', patientId, `${payload.name} (${payload.patientCode})`);
        sendJson(res, 200, mapPatient(updated));
      })
      .catch(() => sendJson(res, 400, { error: 'Cuerpo JSON inválido' }));
    return true;
  }

  if (req.method === 'DELETE' && pathname.startsWith('/api/patients/')) {
    if (!canWrite(req)) {
      sendJson(res, 403, { error: 'Tu rol es de solo lectura y no permite eliminar pacientes' });
      return true;
    }
    const patientId = pathname.split('/').pop();
    const existingPatient = db.prepare('SELECT * FROM patients WHERE id = ?').get(patientId);
    const result = db.prepare('DELETE FROM patients WHERE id = ?').run(patientId);
    if (result.changes === 0) {
      sendJson(res, 404, { error: 'Paciente no encontrado' });
      return true;
    }

    logActivity(req.sessionUser.username, 'Eliminó paciente', 'patient', patientId, existingPatient ? `${existingPatient.name} (${existingPatient.patientCode})` : '');
    sendJson(res, 200, { ok: true });
    return true;
  }

  if (req.method === 'GET' && pathname === '/api/studies') {
    sendJson(res, 200, getStudies().map(mapStudy));
    return true;
  }

  if (req.method === 'GET' && pathname === '/api/studies/next-folio') {
    sendJson(res, 200, { folio: generateNextFolio() });
    return true;
  }

  if (req.method === 'POST' && pathname === '/api/studies') {
    if (!canWrite(req)) {
      sendJson(res, 403, { error: 'Tu rol es de solo lectura y no permite registrar estudios' });
      return true;
    }
    readBody(req)
      .then((body) => {
        const payload = validateStudy(body);
        if (!payload) {
          sendJson(res, 400, { error: 'Datos de estudio inválidos' });
          return;
        }

        const patient = db.prepare('SELECT id FROM patients WHERE id = ?').get(payload.patientId);
        if (!patient) {
          sendJson(res, 400, { error: 'El paciente no existe' });
          return;
        }

        if (!payload.folio) {
          payload.folio = generateNextFolio();
        } else {
          const duplicateFolio = db.prepare('SELECT id FROM studies WHERE folio = ?').get(payload.folio);
          if (duplicateFolio) {
            sendJson(res, 409, { error: `Ya existe un estudio con el folio "${payload.folio}"` });
            return;
          }
        }

        const id = String(body.id || crypto.randomUUID()).trim() || crypto.randomUUID();
        db.prepare(`
          INSERT INTO studies (id, patientId, type, date, priority, status, sampleType, fastingHours, sampleCondition, diagnosis, resultFileName, resultFileType, resultFileData, resultFileUploadedAt, resultParameters, doctor, folio, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(id, payload.patientId, payload.type, payload.date, payload.priority, payload.status, payload.sampleType, payload.fastingHours, payload.sampleCondition, payload.diagnosis, payload.resultFileName, payload.resultFileType, payload.resultFileData, payload.resultFileUploadedAt, payload.resultParameters, payload.doctor, payload.folio, payload.notes);

        const created = db.prepare(`
          SELECT studies.*, patients.name AS patientName, patients.patientCode AS patientCode, patients.age AS patientAge,
                 patients.sex AS patientSex, patients.phone AS patientPhone, patients.area AS patientArea
          FROM studies
          INNER JOIN patients ON patients.id = studies.patientId
          WHERE studies.id = ?
        `).get(id);

        logActivity(req.sessionUser.username, 'Registró estudio', 'study', id, `${payload.type} - ${created.patientName || ''}`);
        sendJson(res, 201, mapStudy(created));
      })
      .catch(() => sendJson(res, 400, { error: 'Cuerpo JSON inválido' }));
    return true;
  }

  if (req.method === 'PUT' && pathname.startsWith('/api/studies/')) {
    if (!canWrite(req)) {
      sendJson(res, 403, { error: 'Tu rol es de solo lectura y no permite editar estudios' });
      return true;
    }
    const studyId = pathname.split('/').pop();
    readBody(req)
      .then((body) => {
        const payload = validateStudy(body);
        if (!payload || !studyId) {
          sendJson(res, 400, { error: 'Datos de estudio inválidos' });
          return;
        }

        const patient = db.prepare('SELECT id FROM patients WHERE id = ?').get(payload.patientId);
        if (!patient) {
          sendJson(res, 400, { error: 'El paciente no existe' });
          return;
        }

        if (!payload.folio) {
          payload.folio = generateNextFolio();
        } else {
          const duplicateFolio = db.prepare('SELECT id FROM studies WHERE folio = ? AND id <> ?').get(payload.folio, studyId);
          if (duplicateFolio) {
            sendJson(res, 409, { error: `Ya existe un estudio con el folio "${payload.folio}"` });
            return;
          }
        }

        const result = db.prepare(`
          UPDATE studies
          SET patientId = ?, type = ?, date = ?, priority = ?, status = ?, sampleType = ?, fastingHours = ?, sampleCondition = ?, diagnosis = ?, resultFileName = ?, resultFileType = ?, resultFileData = ?, resultFileUploadedAt = ?, resultParameters = ?, doctor = ?, folio = ?, notes = ?, updatedAt = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(payload.patientId, payload.type, payload.date, payload.priority, payload.status, payload.sampleType, payload.fastingHours, payload.sampleCondition, payload.diagnosis, payload.resultFileName, payload.resultFileType, payload.resultFileData, payload.resultFileUploadedAt, payload.resultParameters, payload.doctor, payload.folio, payload.notes, studyId);

        if (result.changes === 0) {
          sendJson(res, 404, { error: 'Estudio no encontrado' });
          return;
        }

        const updated = db.prepare(`
          SELECT studies.*, patients.name AS patientName, patients.patientCode AS patientCode, patients.age AS patientAge,
                 patients.sex AS patientSex, patients.phone AS patientPhone, patients.area AS patientArea
          FROM studies
          INNER JOIN patients ON patients.id = studies.patientId
          WHERE studies.id = ?
        `).get(studyId);

        logActivity(req.sessionUser.username, 'Actualizó estudio', 'study', studyId, `${payload.type} - ${updated.patientName || ''}`);
        sendJson(res, 200, mapStudy(updated));
      })
      .catch(() => sendJson(res, 400, { error: 'Cuerpo JSON inválido' }));
    return true;
  }

  if (req.method === 'DELETE' && pathname.startsWith('/api/studies/')) {
    if (!canWrite(req)) {
      sendJson(res, 403, { error: 'Tu rol es de solo lectura y no permite eliminar estudios' });
      return true;
    }
    const studyId = pathname.split('/').pop();
    const existingStudy = db.prepare('SELECT * FROM studies WHERE id = ?').get(studyId);
    const result = db.prepare('DELETE FROM studies WHERE id = ?').run(studyId);
    if (result.changes === 0) {
      sendJson(res, 404, { error: 'Estudio no encontrado' });
      return true;
    }

    logActivity(req.sessionUser.username, 'Eliminó estudio', 'study', studyId, existingStudy ? existingStudy.type : '');
    sendJson(res, 200, { ok: true });
    return true;
  }

  // Gestión de usuarios: solo un administrador puede crear, editar o
  // desactivar cuentas. El script de consola scripts/create-user.js sigue
  // funcionando como alternativa, pero esta es la vía normal.
  if (pathname === '/api/users' || pathname.startsWith('/api/users/')) {
    if (!isAdmin(req)) {
      sendJson(res, 403, { error: 'Solo un administrador puede gestionar usuarios' });
      return true;
    }
  }

  if (req.method === 'GET' && pathname === '/api/users') {
    const rows = db.prepare('SELECT * FROM users ORDER BY createdAt ASC').all();
    sendJson(res, 200, rows.map(mapUser));
    return true;
  }

  if (req.method === 'POST' && pathname === '/api/users') {
    readBody(req)
      .then((body) => {
        const payload = validateUserPayload(body, { requirePassword: true });
        if (payload.error) {
          sendJson(res, 400, { error: payload.error });
          return;
        }

        const exists = db.prepare('SELECT id FROM users WHERE username = ?').get(payload.username);
        if (exists) {
          sendJson(res, 409, { error: 'Ya existe un usuario con ese nombre' });
          return;
        }

        const id = createUser(payload.username, payload.password, payload.fullName, payload.role);
        if (payload.active === 0) {
          db.prepare('UPDATE users SET active = 0 WHERE id = ?').run(id);
        }

        logActivity(req.sessionUser.username, 'Creó usuario', 'user', id, `${payload.username} (${payload.role})`);
        const created = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
        sendJson(res, 201, mapUser(created));
      })
      .catch(() => sendJson(res, 400, { error: 'Cuerpo JSON inválido' }));
    return true;
  }

  if (req.method === 'PUT' && pathname.startsWith('/api/users/')) {
    const userId = pathname.split('/').pop();
    readBody(req)
      .then((body) => {
        const target = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
        if (!target) {
          sendJson(res, 404, { error: 'Usuario no encontrado' });
          return;
        }

        const payload = validateUserPayload({ ...target, ...body }, { requirePassword: false });
        if (payload.error) {
          sendJson(res, 400, { error: payload.error });
          return;
        }

        const duplicate = db.prepare('SELECT id FROM users WHERE username = ? AND id <> ?').get(payload.username, userId);
        if (duplicate) {
          sendJson(res, 409, { error: 'Ya existe otro usuario con ese nombre' });
          return;
        }

        // No permitir que se quede el sistema sin ningún administrador activo.
        const demotesOrDeactivatesAdmin = target.role === 'admin' && (payload.role !== 'admin' || payload.active === 0);
        if (demotesOrDeactivatesAdmin) {
          const otherActiveAdmins = db.prepare(
            "SELECT COUNT(*) AS count FROM users WHERE role = 'admin' AND active = 1 AND id <> ?"
          ).get(userId).count;
          if (otherActiveAdmins === 0) {
            sendJson(res, 400, { error: 'Debe quedar al menos un administrador activo' });
            return;
          }
        }

        if (body.password) {
          const salt = crypto.randomBytes(16).toString('hex');
          const passwordHash = hashPassword(payload.password, salt);
          db.prepare('UPDATE users SET passwordHash = ?, passwordSalt = ? WHERE id = ?').run(passwordHash, salt, userId);
        }

        db.prepare('UPDATE users SET username = ?, fullName = ?, role = ?, active = ? WHERE id = ?')
          .run(payload.username, payload.fullName, payload.role, payload.active, userId);

        if (payload.active === 0) {
          // Si se desactiva, cerramos cualquier sesión activa de ese usuario.
          db.prepare('DELETE FROM sessions WHERE userId = ?').run(userId);
        }

        logActivity(
          req.sessionUser.username,
          'Actualizó usuario',
          'user',
          userId,
          `${payload.username} (${payload.role}${payload.active === 0 ? ', desactivado' : ''})`
        );

        const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
        sendJson(res, 200, mapUser(updated));
      })
      .catch(() => sendJson(res, 400, { error: 'Cuerpo JSON inválido' }));
    return true;
  }

  if (req.method === 'GET' && pathname === '/api/backup') {
    sendJson(res, 200, {
      generatedAt: new Date().toISOString(),
      patients: getPatients().map(mapPatient),
      studies: getStudies().map(mapStudy)
    });
    return true;
  }

  if (req.method === 'POST' && pathname === '/api/backup/restore') {
    if (!canWrite(req)) {
      sendJson(res, 403, { error: 'Tu rol es de solo lectura y no permite restaurar respaldos' });
      return true;
    }
    readBody(req)
      .then((body) => {
        const patientsInput = Array.isArray(body.patients) ? body.patients : [];
        const studiesInput = Array.isArray(body.studies) ? body.studies : [];

        db.exec('BEGIN IMMEDIATE TRANSACTION;');
        try {
          db.exec('DELETE FROM studies; DELETE FROM patients;');

          const insertPatient = db.prepare(`
            INSERT INTO patients (id, name, patientCode, age, sex, phone, area, municipality, locality, affiliation, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);
          const insertStudy = db.prepare(`
            INSERT INTO studies (id, patientId, type, date, priority, status, sampleType, fastingHours, sampleCondition, diagnosis, resultFileName, resultFileType, resultFileData, resultFileUploadedAt, resultParameters, doctor, folio, notes, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);

          for (const patient of patientsInput) {
            const payload = validatePatient(patient);
            if (!payload || !patient.id) {
              continue;
            }

            insertPatient.run(
              String(patient.id),
              payload.name,
              payload.patientCode,
              payload.age,
              payload.sex,
              payload.phone,
              payload.area,
              payload.municipality,
              payload.locality,
              payload.affiliation,
              patient.createdAt || new Date().toISOString(),
              patient.updatedAt || new Date().toISOString()
            );
          }

          for (const study of studiesInput) {
            const payload = validateStudy(study);
            if (!payload || !study.id) {
              continue;
            }

            const patientExists = db.prepare('SELECT id FROM patients WHERE id = ?').get(payload.patientId);
            if (!patientExists) {
              continue;
            }

            insertStudy.run(
              String(study.id),
              payload.patientId,
              payload.type,
              payload.date,
              payload.priority,
              payload.status,
              payload.sampleType,
              payload.fastingHours,
              payload.sampleCondition,
              payload.diagnosis,
              payload.resultFileName,
              payload.resultFileType,
              payload.resultFileData,
              payload.resultFileUploadedAt,
              payload.resultParameters,
              payload.doctor,
              payload.folio,
              payload.notes,
              study.createdAt || new Date().toISOString(),
              study.updatedAt || new Date().toISOString()
            );
          }

          db.exec('COMMIT;');
          logActivity(req.sessionUser.username, 'Restauró respaldo', 'backup', '', `${patientsInput.length} pacientes, ${studiesInput.length} estudios`);
          sendJson(res, 200, { ok: true });
        } catch (error) {
          db.exec('ROLLBACK;');
          sendJson(res, 400, { error: error.message || 'No se pudo restaurar el respaldo' });
        }
      })
      .catch(() => sendJson(res, 400, { error: 'Cuerpo JSON inválido' }));
    return true;
  }

  return false;
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);

  if (requestUrl.pathname.startsWith('/api/')) {
    if (!handleApi(req, res, requestUrl)) {
      sendJson(res, 404, { error: 'Ruta API no encontrada' });
    }
    return;
  }

  let filePath = path.join(publicDir, requestUrl.pathname === '/' ? 'index.html' : requestUrl.pathname);

  if (!filePath.startsWith(publicDir)) {
    sendText(res, 403, 'Acceso denegado');
    return;
  }

  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {
      sendText(res, 404, 'Ruta no encontrada');
      return;
    }

    sendFile(res, filePath);
  });
});

server.listen(port, () => {
  console.log(`Servidor disponible en http://localhost:${port}`);
});