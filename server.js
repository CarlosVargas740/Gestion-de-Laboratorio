const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');
const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'laboratory.sqlite');

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
  const doctor = String(payload.doctor || '').trim();
  const folio = String(payload.folio || '').trim();
  const notes = String(payload.notes || '').trim();

  if (!patientId || !type || !date || !priority || !status) {
    return null;
  }

  return { patientId, type, date, priority, status, sampleType, fastingHours: Number.isNaN(fastingHours) ? 0 : fastingHours, sampleCondition, diagnosis, resultFileName, resultFileType, resultFileData, resultFileUploadedAt, doctor, folio, notes };
}

function handleApi(req, res, requestUrl) {
  const { pathname } = requestUrl;

  if (req.method === 'GET' && pathname === '/api/health') {
    sendJson(res, 200, { ok: true, database: 'sqlite' });
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
        sendJson(res, 201, mapPatient(created));
      })
      .catch(() => sendJson(res, 400, { error: 'Cuerpo JSON inválido' }));
    return true;
  }

  if (req.method === 'PUT' && pathname.startsWith('/api/patients/')) {
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
        sendJson(res, 200, mapPatient(updated));
      })
      .catch(() => sendJson(res, 400, { error: 'Cuerpo JSON inválido' }));
    return true;
  }

  if (req.method === 'DELETE' && pathname.startsWith('/api/patients/')) {
    const patientId = pathname.split('/').pop();
    const result = db.prepare('DELETE FROM patients WHERE id = ?').run(patientId);
    if (result.changes === 0) {
      sendJson(res, 404, { error: 'Paciente no encontrado' });
      return true;
    }

    sendJson(res, 200, { ok: true });
    return true;
  }

  if (req.method === 'GET' && pathname === '/api/studies') {
    sendJson(res, 200, getStudies().map(mapStudy));
    return true;
  }

  if (req.method === 'POST' && pathname === '/api/studies') {
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

        const id = String(body.id || crypto.randomUUID()).trim() || crypto.randomUUID();
        db.prepare(`
          INSERT INTO studies (id, patientId, type, date, priority, status, sampleType, fastingHours, sampleCondition, diagnosis, resultFileName, resultFileType, resultFileData, resultFileUploadedAt, doctor, folio, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(id, payload.patientId, payload.type, payload.date, payload.priority, payload.status, payload.sampleType, payload.fastingHours, payload.sampleCondition, payload.diagnosis, payload.resultFileName, payload.resultFileType, payload.resultFileData, payload.resultFileUploadedAt, payload.doctor, payload.folio, payload.notes);

        const created = db.prepare(`
          SELECT studies.*, patients.name AS patientName, patients.patientCode AS patientCode, patients.age AS patientAge,
                 patients.sex AS patientSex, patients.phone AS patientPhone, patients.area AS patientArea
          FROM studies
          INNER JOIN patients ON patients.id = studies.patientId
          WHERE studies.id = ?
        `).get(id);

        sendJson(res, 201, mapStudy(created));
      })
      .catch(() => sendJson(res, 400, { error: 'Cuerpo JSON inválido' }));
    return true;
  }

  if (req.method === 'PUT' && pathname.startsWith('/api/studies/')) {
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

        const result = db.prepare(`
          UPDATE studies
          SET patientId = ?, type = ?, date = ?, priority = ?, status = ?, sampleType = ?, fastingHours = ?, sampleCondition = ?, diagnosis = ?, resultFileName = ?, resultFileType = ?, resultFileData = ?, resultFileUploadedAt = ?, doctor = ?, folio = ?, notes = ?, updatedAt = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(payload.patientId, payload.type, payload.date, payload.priority, payload.status, payload.sampleType, payload.fastingHours, payload.sampleCondition, payload.diagnosis, payload.resultFileName, payload.resultFileType, payload.resultFileData, payload.resultFileUploadedAt, payload.doctor, payload.folio, payload.notes, studyId);

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

        sendJson(res, 200, mapStudy(updated));
      })
      .catch(() => sendJson(res, 400, { error: 'Cuerpo JSON inválido' }));
    return true;
  }

  if (req.method === 'DELETE' && pathname.startsWith('/api/studies/')) {
    const studyId = pathname.split('/').pop();
    const result = db.prepare('DELETE FROM studies WHERE id = ?').run(studyId);
    if (result.changes === 0) {
      sendJson(res, 404, { error: 'Estudio no encontrado' });
      return true;
    }

    sendJson(res, 200, { ok: true });
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
            INSERT INTO studies (id, patientId, type, date, priority, status, sampleType, fastingHours, sampleCondition, diagnosis, resultFileName, resultFileType, resultFileData, resultFileUploadedAt, doctor, folio, notes, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
              payload.doctor,
              payload.folio,
              payload.notes,
              study.createdAt || new Date().toISOString(),
              study.updatedAt || new Date().toISOString()
            );
          }

          db.exec('COMMIT;');
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