// Importa pacientes y sus estudios a partir de un archivo JSON, usando la
// API del servidor (POST /api/patients y POST /api/studies). A diferencia de
// "Importar respaldo" en la pantalla de Pacientes, este script NO borra los
// datos existentes: solo agrega los pacientes/estudios nuevos que traiga el
// archivo.
//
// Requisitos: el servidor debe estar corriendo (node server.js).
//
// Uso:
//   node scripts/import-patients.js <usuario> <contraseña> [archivo.json] [http://localhost:3000]
//
// Ejemplo (usa el archivo de ejemplo incluido):
//   node scripts/import-patients.js admin admin123 scripts/pacientes-ejemplo.json
//
// Formato esperado del JSON: un arreglo de pacientes, cada uno con sus
// estudios anidados en "studies". Revisa scripts/pacientes-ejemplo.json para
// ver el formato completo y los valores válidos de cada campo.

const fs = require('node:fs');
const path = require('node:path');

const [, , username, password, jsonFileArg, baseUrlArg] = process.argv;

if (!username || !password) {
  console.error('Uso: node scripts/import-patients.js <usuario> <contraseña> [archivo.json] [http://localhost:3000]');
  process.exit(1);
}

const jsonFile = jsonFileArg
  ? path.resolve(jsonFileArg)
  : path.join(__dirname, 'pacientes-ejemplo.json');
const baseUrl = (baseUrlArg || 'http://localhost:3000').replace(/\/$/, '');

async function main() {
  if (!fs.existsSync(jsonFile)) {
    console.error(`No se encontró el archivo: ${jsonFile}`);
    process.exit(1);
  }

  const patients = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
  if (!Array.isArray(patients)) {
    console.error('El JSON debe ser un arreglo de pacientes.');
    process.exit(1);
  }

  // Iniciar sesión y guardar la cookie de sesión para las siguientes llamadas.
  const loginResponse = await fetch(`${baseUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (!loginResponse.ok) {
    const error = await loginResponse.json().catch(() => ({}));
    console.error(`No se pudo iniciar sesión: ${error.error || loginResponse.statusText}`);
    process.exit(1);
  }

  const rawCookie = loginResponse.headers.get('set-cookie') || '';
  const sessionCookie = rawCookie.split(';')[0];
  if (!sessionCookie) {
    console.error('No se recibió cookie de sesión del servidor.');
    process.exit(1);
  }

  let patientsCreated = 0;
  let studiesCreated = 0;
  let errors = 0;

  for (const entry of patients) {
    const { studies = [], ...patientPayload } = entry;

    const patientResponse = await fetch(`${baseUrl}/api/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: sessionCookie },
      body: JSON.stringify(patientPayload)
    });

    if (!patientResponse.ok) {
      const error = await patientResponse.json().catch(() => ({}));
      console.error(`✗ Paciente "${patientPayload.name}": ${error.error || patientResponse.statusText}`);
      errors += 1;
      continue;
    }

    const createdPatient = await patientResponse.json();
    patientsCreated += 1;
    console.log(`✓ Paciente creado: ${createdPatient.name} (${createdPatient.patientCode})`);

    for (const study of studies) {
      const studyPayload = { ...study, patientId: createdPatient.id };
      const studyResponse = await fetch(`${baseUrl}/api/studies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: sessionCookie },
        body: JSON.stringify(studyPayload)
      });

      if (!studyResponse.ok) {
        const error = await studyResponse.json().catch(() => ({}));
        console.error(`  ✗ Estudio "${study.type}": ${error.error || studyResponse.statusText}`);
        errors += 1;
        continue;
      }

      studiesCreated += 1;
      console.log(`  ✓ Estudio agregado: ${study.type}`);
    }
  }

  console.log('');
  console.log(`Listo. Pacientes creados: ${patientsCreated}, estudios creados: ${studiesCreated}, errores: ${errors}.`);
}

main().catch((error) => {
  console.error('Error inesperado:', error.message);
  process.exit(1);
});
