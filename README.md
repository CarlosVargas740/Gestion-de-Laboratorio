# Gestión de Laboratorio — Hospital Rural de San Carlos

Sistema web para la gestión del laboratorio clínico del Hospital Rural de San
Carlos. Permite registrar pacientes, capturar estudios de laboratorio, dar
seguimiento a resultados, generar reportes estadísticos y mantener un
respaldo de la información.

Proyecto desarrollado como parte de las estadías profesionales de la carrera
de Ingeniería en Tecnologías de la Información e Innovación Digital.

## Características principales

- **Gestión de pacientes**: alta, edición, baja y búsqueda por nombre, ID,
  municipio, localidad o derechohabiencia.
- **Gestión de estudios de laboratorio**: registro de estudios (biometría
  hemática, química sanguínea, examen general de orina, coprológico, prueba
  de embarazo, serología, cultivo, etc.), prioridad, estado, tipo de
  muestra, horas de ayuno y condición de la muestra.
- **Valores de referencia y alertas**: para biometría hemática y química
  sanguínea, el sistema permite capturar los valores obtenidos y marca
  automáticamente si están dentro o fuera del rango normal.
- **Inicio de sesión**: acceso protegido con usuario y contraseña
  (contraseñas cifradas con `scrypt`, sesiones con cookies HTTP-only).
- **Bitácora de actividad**: registro de qué usuario capturó, editó o
  eliminó cada paciente o estudio, y cuándo.
- **Reportes y gráficas**: estadísticas generales del laboratorio
  (distribución por área, tipo de estudio, municipio, derechohabiencia,
  tipo de muestra, condición de muestra) con gráficas interactivas
  (Chart.js) y listas de frecuencia.
- **Reporte clínico por paciente**: vista imprimible con el historial de
  estudios de un paciente.
- **Respaldo de información**: exportación e importación de toda la base de
  datos en formato JSON.
- **Paginación** en las tablas de pacientes y estudios para un mejor manejo
  de listados largos.

## Tecnologías utilizadas

| Capa       | Tecnología                                              |
|------------|----------------------------------------------------------|
| Backend    | Node.js (`http` nativo, sin frameworks) + `node:sqlite`  |
| Frontend   | HTML5, CSS3, JavaScript (Vanilla, sin frameworks)        |
| Gráficas   | Chart.js (vía CDN)                                        |
| Base de datos | SQLite (archivo local `data/laboratory.sqlite`)       |

El proyecto se apega intencionalmente a tecnologías nativas de Node.js (sin
Express ni ORMs) para mantener el stack simple y fácil de entender a nivel
académico.

## Requisitos

- Node.js **22 o superior** (se requiere el módulo experimental
  `node:sqlite`).

## Instalación y uso

```bash
# 1. Clonar el repositorio
git clone https://github.com/CarlosVargas740/Gestion-de-Laboratorio.git
cd Gestion-de-Laboratorio

# 2. Ejecutar el servidor (no requiere instalar dependencias externas)
npm start
# o bien: node server.js
```

El servidor queda disponible en `http://localhost:3000`.

Al iniciar por primera vez, el sistema crea automáticamente un usuario
administrador y lo muestra en la consola:

```
Usuario: admin
Contraseña: admin123
```

**Se recomienda cambiar esta contraseña** una vez dentro del sistema (ver
sección de mejoras futuras).

## Estructura del proyecto

```
Gestion-de-Laboratorio/
├── data/
│   └── laboratory.sqlite     # Base de datos (se crea automáticamente)
├── public/
│   ├── index.html            # Interfaz principal del sistema
│   ├── login.html            # Pantalla de inicio de sesión
│   ├── app.js                # Lógica del frontend
│   ├── login.js              # Lógica de la pantalla de login
│   └── styles.css            # Estilos de toda la aplicación
├── server.js                 # Servidor HTTP, rutas de la API y acceso a BD
├── package.json
└── README.md
```

## Modelo de datos (resumen)

- **patients**: información del paciente (nombre, ID, edad, sexo, teléfono,
  área, municipio, localidad, derechohabiencia).
- **studies**: estudios asociados a un paciente (tipo, fecha, prioridad,
  estado, tipo de muestra, ayuno, condición de la muestra, diagnóstico
  presuntivo, valores de resultado, archivo de resultado, médico, folio,
  notas).
- **users**: usuarios del sistema (usuario, nombre completo, contraseña
  cifrada).
- **sessions**: sesiones activas de inicio de sesión.
- **activity_log**: bitácora de acciones realizadas por los usuarios.

## Rutas principales de la API

| Método | Ruta                     | Descripción                              |
|--------|--------------------------|-------------------------------------------|
| POST   | `/api/login`             | Inicia sesión                             |
| POST   | `/api/logout`            | Cierra sesión                             |
| GET    | `/api/session`           | Verifica sesión activa                    |
| GET    | `/api/summary`           | Estadísticas rápidas del laboratorio      |
| GET/POST | `/api/patients`         | Listar / crear pacientes                |
| PUT/DELETE | `/api/patients/:id`   | Editar / eliminar paciente               |
| GET/POST | `/api/studies`          | Listar / crear estudios                 |
| PUT/DELETE | `/api/studies/:id`    | Editar / eliminar estudio                |
| GET    | `/api/activity-log`      | Últimos movimientos registrados en el sistema |
| GET    | `/api/backup`             | Descarga respaldo completo (JSON)       |
| POST   | `/api/backup/restore`    | Restaura un respaldo                     |

Todas las rutas, excepto `/api/health` y `/api/login`, requieren una sesión
válida.

## Posibles mejoras futuras

- Pantalla para administración de usuarios (crear, editar, cambiar
  contraseña, desactivar) en lugar de un solo usuario fijo.
- Roles diferenciados (recepción, laboratorista, jefe de laboratorio).
- Carga real de archivos de resultado (actualmente se guarda como texto
  codificado dentro de la base de datos).
- Rangos de referencia diferenciados por edad y sexo.
- Pruebas automatizadas del backend.
- Migración de SQLite a un motor de base de datos con soporte multiusuario
  concurrente si el laboratorio crece en volumen de operación.

## Autor

Carlos Vargas — Ingeniería en Tecnologías de la Información e Innovación
Digital, Universidad Politécnica de Victoria.
