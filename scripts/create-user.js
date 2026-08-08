// Crea un nuevo usuario en la base de datos del sistema.
//
// NOTA: ahora existe una pantalla "Usuarios" dentro del sistema (visible solo
// para administradores) para crear, editar y desactivar usuarios sin usar la
// consola. Este script se conserva como alternativa para cuando el servidor
// no está corriendo o para crear el primer administrador de emergencia.
//
// Uso:
//   node scripts/create-user.js <usuario> <contraseña> ["Nombre completo"] [rol]
//
// El rol puede ser: admin | captura | lectura (por defecto: captura)
//
// Ejemplo:
//   node scripts/create-user.js karla.lab "MiClaveSegura2026" "Karla Pérez" captura
//
// El servidor NO necesita estar corriendo para usar este script: se conecta
// directamente al archivo data/laboratory.sqlite, usando el mismo método de
// hash (scrypt) que server.js, así que el usuario creado funciona de
// inmediato en la pantalla de inicio de sesión.

const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');

const VALID_ROLES = new Set(['admin', 'captura', 'lectura']);
const [, , username, password, fullName = '', roleArg = 'captura'] = process.argv;
const role = VALID_ROLES.has(roleArg) ? roleArg : 'captura';

if (!username || !password) {
  console.error('Uso: node scripts/create-user.js <usuario> <contraseña> ["Nombre completo"] [admin|captura|lectura]');
  process.exit(1);
}

if (password.length < 6) {
  console.error('La contraseña debe tener al menos 6 caracteres.');
  process.exit(1);
}

const dbPath = path.join(__dirname, '..', 'data', 'laboratory.sqlite');
const db = new DatabaseSync(dbPath);

const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
if (existing) {
  console.error(`Ya existe un usuario con el nombre "${username}".`);
  process.exit(1);
}

function hashPassword(rawPassword, salt) {
  return crypto.scryptSync(rawPassword, salt, 64).toString('hex');
}

const salt = crypto.randomBytes(16).toString('hex');
const passwordHash = hashPassword(password, salt);
const id = crypto.randomUUID();

db.prepare(`
  INSERT INTO users (id, username, fullName, passwordHash, passwordSalt, role)
  VALUES (?, ?, ?, ?, ?, ?)
`).run(id, username, fullName, passwordHash, salt, role);

console.log(`Usuario creado correctamente:`);
console.log(`  Usuario: ${username}`);
console.log(`  Nombre:  ${fullName || '(sin especificar)'}`);
console.log(`  Rol:     ${role}`);
console.log('Ya puede iniciar sesión con este usuario y la contraseña indicada.');
