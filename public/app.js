const patientForm = document.getElementById('patientForm');
const studyForm = document.getElementById('studyForm');
const patientsTable = document.getElementById('patientsTable');
const recordsTable = document.getElementById('recordsTable');
const searchInput = document.getElementById('searchInput');
const studyPatient = document.getElementById('studyPatient');
const emptyStateTemplate = document.getElementById('emptyStateTemplate');
const patientsEmptyStateTemplate = document.getElementById('patientsEmptyStateTemplate');
const exportButton = document.getElementById('exportButton');
const importButton = document.getElementById('importButton');
const importInput = document.getElementById('importInput');
const editModal = document.getElementById('editModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const closeModalButton = document.getElementById('closeModalButton');
const modalTitle = document.getElementById('modalTitle');
const modalSubtitle = document.getElementById('modalSubtitle');
const hospitalReportView = document.getElementById('hospitalReportView');
const reportPatientTitle = document.getElementById('reportPatientTitle');
const reportPatientSubtitle = document.getElementById('reportPatientSubtitle');
const reportPatientName = document.getElementById('reportPatientName');
const reportPatientCode = document.getElementById('reportPatientCode');
const reportPatientArea = document.getElementById('reportPatientArea');
const reportPatientLocality = document.getElementById('reportPatientLocality');
const reportPatientMunicipality = document.getElementById('reportPatientMunicipality');
const reportPatientAffiliation = document.getElementById('reportPatientAffiliation');
const reportPatientStudiesTotal = document.getElementById('reportPatientStudiesTotal');
const reportPatientStudiesSummary = document.getElementById('reportPatientStudiesSummary');
const reportPatientDataList = document.getElementById('reportPatientDataList');
const reportPatientMetricsList = document.getElementById('reportPatientMetricsList');
const reportStudiesTable = document.getElementById('reportStudiesTable');
const reportClinicalSummary = document.getElementById('reportClinicalSummary');
const printPatientReportButton = document.getElementById('printPatientReportButton');
const editPatientForm = document.getElementById('editPatientForm');
const editStudyForm = document.getElementById('editStudyForm');
const editPatientRecordId = document.getElementById('editPatientRecordId');
const editStudyRecordId = document.getElementById('editStudyRecordId');
const editStudyPatient = document.getElementById('editStudyPatient');
const editPatientName = document.getElementById('editPatientName');
const editPatientCode = document.getElementById('editPatientCode');
const editPatientAge = document.getElementById('editPatientAge');
const editPatientSex = document.getElementById('editPatientSex');
const editPatientPhone = document.getElementById('editPatientPhone');
const editPatientArea = document.getElementById('editPatientArea');
const editPatientMunicipality = document.getElementById('editPatientMunicipality');
const editPatientLocality = document.getElementById('editPatientLocality');
const editPatientAffiliation = document.getElementById('editPatientAffiliation');

const editStudyType = document.getElementById('editStudyType');
const editStudyDate = document.getElementById('editStudyDate');
const editStudyPriority = document.getElementById('editStudyPriority');
const editStudyStatus = document.getElementById('editStudyStatus');
const editStudyDoctor = document.getElementById('editStudyDoctor');
const editStudyFolio = document.getElementById('editStudyFolio');
const editStudySampleType = document.getElementById('editStudySampleType');
const editStudyFastingHours = document.getElementById('editStudyFastingHours');
const editStudySampleCondition = document.getElementById('editStudySampleCondition');
const editStudyDiagnosis = document.getElementById('editStudyDiagnosis');
const editStudyNotes = document.getElementById('editStudyNotes');

const reportAreaTop = document.getElementById('reportAreaTop');
const reportAreaLabel = document.getElementById('reportAreaLabel');
const reportStudyTop = document.getElementById('reportStudyTop');
const reportStudyLabel = document.getElementById('reportStudyLabel');
const reportProgress = document.getElementById('reportProgress');
const reportActivePatients = document.getElementById('reportActivePatients');
const reportActiveLabel = document.getElementById('reportActiveLabel');
const reportMunicipalityTop = document.getElementById('reportMunicipalityTop');
const reportMunicipalityLabel = document.getElementById('reportMunicipalityLabel');
const reportAffiliationTop = document.getElementById('reportAffiliationTop');
const reportAffiliationLabel = document.getElementById('reportAffiliationLabel');
const reportSampleTop = document.getElementById('reportSampleTop');
const reportSampleLabel = document.getElementById('reportSampleLabel');
const reportFastingAverage = document.getElementById('reportFastingAverage');
const reportFastingLabel = document.getElementById('reportFastingLabel');
const reportUrgentPending = document.getElementById('reportUrgentPending');
const reportDelayed = document.getElementById('reportDelayed');
const reportToday = document.getElementById('reportToday');
const reportWeek = document.getElementById('reportWeek');
const reportMonth = document.getElementById('reportMonth');
const reportDoctorList = document.getElementById('reportDoctorList');
const reportPriorityList = document.getElementById('reportPriorityList');
const reportStatusList = document.getElementById('reportStatusList');
const reportTypeList = document.getElementById('reportTypeList');
const reportMunicipalityList = document.getElementById('reportMunicipalityList');
const reportAffiliationList = document.getElementById('reportAffiliationList');
const reportSampleList = document.getElementById('reportSampleList');
const reportConditionList = document.getElementById('reportConditionList');
const recentActivityList = document.getElementById('recentActivityList');
const areaFilter = document.getElementById('areaFilter');
const statusFilter = document.getElementById('statusFilter');
const dateFromFilter = document.getElementById('dateFromFilter');
const dateToFilter = document.getElementById('dateToFilter');
const clearDateFilterButton = document.getElementById('clearDateFilterButton');
const downloadReportButton = document.getElementById('downloadReportButton');
const printReportButton = document.getElementById('printReportButton');

const userForm = document.getElementById('userForm');
const userUsername = document.getElementById('userUsername');
const userPassword = document.getElementById('userPassword');
const userFullName = document.getElementById('userFullName');
const userRole = document.getElementById('userRole');
const usersTable = document.getElementById('usersTable');
const editUserForm = document.getElementById('editUserForm');
const editUserId = document.getElementById('editUserId');
const editUserUsername = document.getElementById('editUserUsername');
const editUserFullName = document.getElementById('editUserFullName');
const editUserRole = document.getElementById('editUserRole');
const editUserActive = document.getElementById('editUserActive');
const editUserPassword = document.getElementById('editUserPassword');

const totalPatients = document.getElementById('totalPatients');
const totalStudies = document.getElementById('totalStudies');
const pendingResults = document.getElementById('pendingResults');
const deliveredResults = document.getElementById('deliveredResults');

const sessionUsername = document.getElementById('sessionUsername');
const logoutButton = document.getElementById('logoutButton');
const activityLogList = document.getElementById('activityLogList');
const patientsPagination = document.getElementById('patientsPagination');
const recordsPagination = document.getElementById('recordsPagination');
const studyResultParametersContainer = document.getElementById('studyResultParameters');
const editStudyResultParametersContainer = document.getElementById('editStudyResultParameters');

const REFERENCE_RANGES = {
  'Biometría hemática': [
    { key: 'hemoglobina', label: 'Hemoglobina', unit: 'g/dL', min: 12, max: 16.5 },
    { key: 'hematocrito', label: 'Hematocrito', unit: '%', min: 36, max: 50 },
    { key: 'leucocitos', label: 'Leucocitos', unit: 'x10³/µL', min: 4.5, max: 11 },
    { key: 'plaquetas', label: 'Plaquetas', unit: 'x10³/µL', min: 150, max: 450 }
  ],
  'Química sanguínea': [
    { key: 'glucosa', label: 'Glucosa', unit: 'mg/dL', min: 70, max: 100 },
    { key: 'colesterol', label: 'Colesterol total', unit: 'mg/dL', min: 0, max: 200 },
    { key: 'trigliceridos', label: 'Triglicéridos', unit: 'mg/dL', min: 0, max: 150 },
    { key: 'urea', label: 'Urea', unit: 'mg/dL', min: 15, max: 40 },
    { key: 'creatinina', label: 'Creatinina', unit: 'mg/dL', min: 0.6, max: 1.3 }
  ],
  'Examen general de orina': [
    { key: 'color', label: 'Color', type: 'select', options: ['Amarillo', 'Ámbar', 'Rojizo', 'Turbio', 'Incoloro'], normal: 'Amarillo' },
    { key: 'aspecto', label: 'Aspecto', type: 'select', options: ['Claro', 'Ligeramente turbio', 'Turbio'], normal: 'Claro' },
    { key: 'densidad', label: 'Densidad urinaria', unit: '', min: 1.005, max: 1.03 },
    { key: 'ph', label: 'pH', unit: '', min: 4.5, max: 8 },
    { key: 'proteinas', label: 'Proteínas', type: 'select', options: ['Negativo', 'Trazas', 'Positivo'], normal: 'Negativo' },
    { key: 'glucosaOrina', label: 'Glucosa', type: 'select', options: ['Negativo', 'Positivo'], normal: 'Negativo' },
    { key: 'cetonas', label: 'Cetonas', type: 'select', options: ['Negativo', 'Positivo'], normal: 'Negativo' },
    { key: 'nitritos', label: 'Nitritos', type: 'select', options: ['Negativo', 'Positivo'], normal: 'Negativo' },
    { key: 'leucocitosOrina', label: 'Leucocitos', unit: 'por campo', min: 0, max: 5 },
    { key: 'eritrocitosOrina', label: 'Eritrocitos', unit: 'por campo', min: 0, max: 3 },
    { key: 'bacterias', label: 'Bacterias', type: 'select', options: ['Ausentes', 'Escasas', 'Abundantes'], normal: 'Ausentes' }
  ],
  'Coprológico': [
    { key: 'colorHeces', label: 'Color', type: 'select', options: ['Café', 'Verdoso', 'Negro', 'Pálido'], normal: 'Café' },
    { key: 'consistencia', label: 'Consistencia', type: 'select', options: ['Formada', 'Blanda', 'Líquida', 'Dura'], normal: 'Formada' },
    { key: 'sangreOculta', label: 'Sangre oculta', type: 'select', options: ['Negativo', 'Positivo'], normal: 'Negativo' },
    { key: 'leucocitosHeces', label: 'Leucocitos', unit: 'por campo', min: 0, max: 2 },
    { key: 'parasitos', label: 'Parásitos', type: 'select', options: ['No se observan', 'Se observan'], normal: 'No se observan' },
    { key: 'grasas', label: 'Grasas (esteatorrea)', type: 'select', options: ['Negativo', 'Positivo'], normal: 'Negativo' }
  ],
  'Prueba de embarazo': [
    { key: 'hcgCualitativa', label: 'hCG cualitativa', type: 'select', options: ['No reactivo', 'Reactivo'], normal: 'No reactivo' },
    { key: 'hcgCuantitativa', label: 'hCG cuantitativa', unit: 'mUI/mL', min: 0, max: 5 }
  ],
  'Serología': [
    { key: 'vdrl', label: 'VDRL (sífilis)', type: 'select', options: ['No reactivo', 'Reactivo'], normal: 'No reactivo' },
    { key: 'vih', label: 'VIH (prueba rápida)', type: 'select', options: ['No reactivo', 'Reactivo'], normal: 'No reactivo' },
    { key: 'hepatitisB', label: 'Hepatitis B (HBsAg)', type: 'select', options: ['No reactivo', 'Reactivo'], normal: 'No reactivo' },
    { key: 'proteinaC', label: 'Proteína C reactiva', unit: 'mg/L', min: 0, max: 10 }
  ],
  'Cultivo': [
    { key: 'crecimientoBacteriano', label: 'Crecimiento bacteriano', type: 'select', options: ['Negativo', 'Positivo'], normal: 'Negativo' },
    { key: 'microorganismo', label: 'Microorganismo aislado', type: 'text', placeholder: 'Ej. E. coli' },
    { key: 'ufc', label: 'Unidades formadoras de colonias', unit: 'UFC/mL', min: 0, max: 100000 },
    { key: 'antibiograma', label: 'Sensibilidad a antibiótico(s)', type: 'text', placeholder: 'Ej. Sensible a ciprofloxacino' }
  ]
};

function getFlagForValue(value, min, max) {
  if (value === '' || value === null || value === undefined || Number.isNaN(Number(value))) {
    return null;
  }

  const numeric = Number(value);
  if (numeric < min) {
    return 'Bajo';
  }
  if (numeric > max) {
    return 'Alto';
  }
  return 'Normal';
}

function flagForParameter(parameter, value) {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  if (parameter.type === 'text') {
    return null;
  }

  if (parameter.type === 'select') {
    return value === parameter.normal ? 'Normal' : 'Alterado';
  }

  return getFlagForValue(value, parameter.min, parameter.max);
}

function renderResultParameterFields(container, studyTypeValue, existingValues = {}) {
  const parameters = REFERENCE_RANGES[studyTypeValue];
  if (!container) {
    return;
  }

  if (!parameters) {
    container.innerHTML = '';
    container.hidden = true;
    return;
  }

  container.hidden = false;
  container.innerHTML = parameters
    .map((parameter) => {
      const savedValue = existingValues[parameter.key] ?? '';
      const fieldId = `param-${container.id}-${parameter.key}`;

      if (parameter.type === 'select') {
        const optionsHtml = ['<option value="">Selecciona</option>']
          .concat(parameter.options.map((option) => `<option value="${option}" ${option === savedValue ? 'selected' : ''}>${option}</option>`))
          .join('');
        return `
          <div class="result-parameter-field">
            <label for="${fieldId}">${parameter.label}</label>
            <select id="${fieldId}" data-param-key="${parameter.key}" data-param-type="select">${optionsHtml}</select>
            <small>Valor normal: ${parameter.normal}</small>
          </div>
        `;
      }

      if (parameter.type === 'text') {
        return `
          <div class="result-parameter-field">
            <label for="${fieldId}">${parameter.label}</label>
            <input
              type="text"
              id="${fieldId}"
              data-param-key="${parameter.key}"
              data-param-type="text"
              value="${savedValue}"
              placeholder="${parameter.placeholder || ''}"
              maxlength="80"
            />
          </div>
        `;
      }

      return `
        <div class="result-parameter-field">
          <label for="${fieldId}">${parameter.label}</label>
          <input
            type="number"
            step="0.01"
            id="${fieldId}"
            data-param-key="${parameter.key}"
            data-param-type="number"
            data-param-min="${parameter.min}"
            data-param-max="${parameter.max}"
            value="${savedValue}"
            placeholder="${parameter.min} - ${parameter.max}"
          />
          <small>Rango normal: ${parameter.min} - ${parameter.max} ${parameter.unit || ''}</small>
        </div>
      `;
    })
    .join('');
}

function collectResultParameters(container, studyTypeValue) {
  const parameters = REFERENCE_RANGES[studyTypeValue];
  if (!container || !parameters) {
    return '';
  }

  const values = {};
  let hasAnyValue = false;

  parameters.forEach((parameter) => {
    const input = container.querySelector(`[data-param-key="${parameter.key}"]`);
    if (!input || input.value === '') {
      return;
    }

    values[parameter.key] = parameter.type === 'select' || parameter.type === 'text' ? input.value : Number(input.value);
    hasAnyValue = true;
  });

  return hasAnyValue ? JSON.stringify(values) : '';
}

function buildResultFlagBadge(study) {
  if (!study.resultParameters) {
    return '';
  }

  let parsed;
  try {
    parsed = JSON.parse(study.resultParameters);
  } catch {
    return '';
  }

  const parameters = REFERENCE_RANGES[study.type];
  if (!parameters) {
    return '';
  }

  const flags = parameters
    .map((parameter) => {
      const value = parsed[parameter.key];
      if (value === undefined) {
        return null;
      }
      return flagForParameter(parameter, value);
    })
    .filter(Boolean);

  if (flags.length === 0) {
    return '';
  }

  const isAltered = flags.some((flag) => flag !== 'Normal');
  if (!isAltered) {
    return '<span class="result-flag result-flag-normal">Valores normales</span>';
  }

  const cssClass = flags.includes('Alto') ? 'result-flag-alto' : (flags.includes('Bajo') ? 'result-flag-bajo' : 'result-flag-alto');
  return `<span class="result-flag ${cssClass}">Valores alterados</span>`;
}

let patientsPage = 1;
let recordsPage = 1;
const PAGE_SIZE = 8;

let statusChart = null;
let typeChart = null;
let areaChart = null;
let sexChart = null;
let priorityChart = null;
let ageChart = null;

const patientName = document.getElementById('patientName');
const patientId = document.getElementById('patientId');
const patientAge = document.getElementById('patientAge');
const patientSex = document.getElementById('patientSex');
const patientPhone = document.getElementById('patientPhone');
const patientArea = document.getElementById('patientArea');
const patientMunicipality = document.getElementById('patientMunicipality');
const patientLocality = document.getElementById('patientLocality');
const patientAffiliation = document.getElementById('patientAffiliation');
const studyType = document.getElementById('studyType');
const studyDate = document.getElementById('studyDate');
const studyPriority = document.getElementById('studyPriority');
const studyStatus = document.getElementById('studyStatus');
const studyDoctor = document.getElementById('studyDoctor');
const studyFolio = document.getElementById('studyFolio');
const studySampleType = document.getElementById('studySampleType');
const studyFastingHours = document.getElementById('studyFastingHours');
const studySampleCondition = document.getElementById('studySampleCondition');
const studyDiagnosis = document.getElementById('studyDiagnosis');
const studyNotes = document.getElementById('studyNotes');

const legacyPatientsKey = 'laboratorio-pacientes';
const legacyStudiesKey = 'laboratorio-estudios';
const migrationKey = 'laboratorio-db-migrated';

let patients = [];
let studies = [];
let systemUsers = [];
let isReady = false;
let currentPatientHospitalReport = null;
let currentUserRole = 'captura';

function requestJson(url, options = {}) {
  return fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  }).then(async (response) => {
    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json') ? await response.json() : await response.text();
    if (!response.ok) {
      throw new Error(payload?.error || 'Error inesperado');
    }
    return payload;
  });
}

function setReadyState() {
  totalPatients.textContent = patients.length;
  totalStudies.textContent = studies.length;
  pendingResults.textContent = studies.filter((study) => (study.status || 'Pendiente') === 'Pendiente').length;
  deliveredResults.textContent = studies.filter((study) => (study.status || '') === 'Entregado').length;
}

function buildFrequencyMap(items, selector, fallback = 'Sin datos') {
  return items.reduce((accumulator, item) => {
    const key = selector(item) || fallback;
    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});
}

function renderKeyValueList(targetElement, entries, emptyMessage) {
  if (!entries.length) {
    targetElement.innerHTML = `<li>${emptyMessage}</li>`;
    return;
  }

  targetElement.innerHTML = entries
    .map(([label, value]) => `<li><span>${label}</span><strong>${value}</strong></li>`)
    .join('');
}

function downloadJson(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function getAgeBucket(age) {
  const numericAge = Number(age);
  if (Number.isNaN(numericAge)) {
    return 'Sin dato';
  }
  if (numericAge <= 17) return '0-17';
  if (numericAge <= 35) return '18-35';
  if (numericAge <= 50) return '36-50';
  if (numericAge <= 65) return '51-65';
  return '66+';
}

function daysBetween(dateString) {
  if (!dateString) {
    return null;
  }
  const parsed = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((today - parsed) / (1000 * 60 * 60 * 24));
}

const AGE_BUCKET_ORDER = ['0-17', '18-35', '36-50', '51-65', '66+', 'Sin dato'];
const DELAYED_THRESHOLD_DAYS = 3;

function buildReportData() {
  const municipalityCounts = buildFrequencyMap(patients, (patient) => patient.municipality || 'San Carlos');
  const affiliationCounts = buildFrequencyMap(patients, (patient) => patient.affiliation || 'Sin derechohabiencia');
  const sampleCounts = buildFrequencyMap(studies, (study) => study.sampleType || 'Sangre');
  const conditionCounts = buildFrequencyMap(studies, (study) => study.sampleCondition || 'Adecuada');
  const sexCounts = buildFrequencyMap(patients, (patient) => patient.sex || 'No especificado');
  const priorityCounts = buildFrequencyMap(studies, (study) => study.priority || 'Normal');
  const doctorCounts = buildFrequencyMap(studies, (study) => study.doctor || 'Sin médico registrado');

  const ageCountsRaw = buildFrequencyMap(patients, (patient) => getAgeBucket(patient.age));
  const ageCounts = {};
  AGE_BUCKET_ORDER.forEach((bucket) => {
    if (ageCountsRaw[bucket]) {
      ageCounts[bucket] = ageCountsRaw[bucket];
    }
  });

  const fastingAverage = studies.length
    ? Math.round((studies.reduce((sum, study) => sum + Number(study.fastingHours || 0), 0) / studies.length) * 10) / 10
    : 0;

  const pendingStudies = studies.filter((study) => (study.status || 'Pendiente') !== 'Entregado');
  const urgentPending = pendingStudies.filter((study) => (study.priority || 'Normal') === 'Urgente').length;
  const delayed = pendingStudies.filter((study) => {
    const days = daysBetween(study.date);
    return days !== null && days > DELAYED_THRESHOLD_DAYS;
  }).length;

  const studiesToday = studies.filter((study) => daysBetween(study.date) === 0).length;
  const studiesWeek = studies.filter((study) => {
    const days = daysBetween(study.date);
    return days !== null && days >= 0 && days <= 7;
  }).length;
  const studiesMonth = studies.filter((study) => {
    const days = daysBetween(study.date);
    return days !== null && days >= 0 && days <= 30;
  }).length;

  return {
    generatedAt: new Date().toISOString(),
    totals: {
      patients: patients.length,
      studies: studies.length,
      pending: studies.filter((study) => (study.status || 'Pendiente') === 'Pendiente').length,
      delivered: studies.filter((study) => (study.status || '') === 'Entregado').length
    },
    timeIndicators: {
      urgentPending,
      delayed,
      studiesToday,
      studiesWeek,
      studiesMonth
    },
    distribution: {
      areaCounts: buildFrequencyMap(patients, (patient) => patient.area || 'Consulta externa'),
      municipalityCounts,
      affiliationCounts,
      studyCounts: buildFrequencyMap(studies, (study) => study.type || 'Otro'),
      statusCounts: buildFrequencyMap(studies, (study) => study.status || 'Pendiente'),
      sampleCounts,
      conditionCounts,
      sexCounts,
      priorityCounts,
      doctorCounts,
      ageCounts,
      fastingAverage
    },
    patients,
    studies
  };
}

function refreshStudySelect() {
  const fillSelect = (selectElement, emptyLabel) => {
    selectElement.innerHTML = '';

    if (patients.length === 0) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = emptyLabel;
      selectElement.appendChild(option);
      selectElement.disabled = true;
      return;
    }

    selectElement.disabled = false;
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecciona un paciente';
    selectElement.appendChild(defaultOption);

    patients.forEach((patient) => {
      const option = document.createElement('option');
      option.value = patient.id;
      option.textContent = `${patient.name} - ${patient.patientCode}`;
      selectElement.appendChild(option);
    });
  };

  fillSelect(studyPatient, 'Primero agrega un paciente');
  fillSelect(editStudyPatient, 'Primero agrega un paciente');
}

function paginate(items, page, pageSize) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    pageItems: items.slice(start, start + pageSize),
    totalPages,
    safePage
  };
}

function renderPaginationControls(container, safePage, totalPages, onPageChange) {
  if (!container) {
    return;
  }

  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <button type="button" data-page="prev" ${safePage <= 1 ? 'disabled' : ''}>Anterior</button>
    <span>Página ${safePage} de ${totalPages}</span>
    <button type="button" data-page="next" ${safePage >= totalPages ? 'disabled' : ''}>Siguiente</button>
  `;

  container.querySelectorAll('button[data-page]').forEach((button) => {
    button.addEventListener('click', () => {
      const direction = button.dataset.page === 'next' ? 1 : -1;
      onPageChange(safePage + direction);
    });
  });
}

function renderPatients() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = patients.filter((patient) => {
    const patientAreaValue = patient.area || 'Consulta externa';
    const searchTarget = `${patient.name} ${patient.patientCode} ${patient.sex || ''} ${patient.phone || ''} ${patientAreaValue} ${patient.municipality || ''} ${patient.locality || ''} ${patient.affiliation || ''}`.toLowerCase();
    return !query || searchTarget.includes(query);
  });

  const { pageItems, totalPages, safePage } = paginate(filtered, patientsPage, PAGE_SIZE);
  patientsPage = safePage;

  const rows = pageItems
    .map((patient) => {
      const patientAreaValue = patient.area || 'Consulta externa';
      return `
        <tr>
          <td>${patient.name}</td>
          <td>${patient.patientCode}</td>
          <td>${patient.age}</td>
          <td>${patient.sex || ''}</td>
          <td>${patient.municipality || 'San Carlos'}</td>
          <td>${patient.locality || ''}</td>
          <td>${patientAreaValue}</td>
          <td>
            <div class="action-group">
              <button class="table-btn" type="button" data-action="view-report" data-id="${patient.id}">Reporte</button>
              ${currentUserRole !== 'lectura' ? `
                <button class="table-btn" type="button" data-action="edit-patient" data-id="${patient.id}">Editar</button>
                <button class="table-btn danger" type="button" data-action="delete-patient" data-id="${patient.id}">Eliminar</button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    })
    .join('');

  patientsTable.innerHTML = rows || patientsEmptyStateTemplate.innerHTML;
  renderPaginationControls(patientsPagination, safePage, totalPages, (newPage) => {
    patientsPage = newPage;
    renderPatients();
  });
}

function renderRecords() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedArea = areaFilter.value;
  const selectedStatus = statusFilter.value;
  const dateFrom = dateFromFilter.value;
  const dateTo = dateToFilter.value;
  const filtered = studies.filter((study) => {
    const patient = patients.find((item) => item.id === study.patientId) || study.patient;
    if (!patient) {
      return false;
    }

    const area = patient.area || 'Consulta externa';
    const priority = study.priority || 'Normal';
    const status = study.status || 'Pendiente';
    const doctor = study.doctor || '';
    const folio = study.folio || '';
    const searchTarget = `${patient.name} ${patient.patientCode} ${area} ${study.type || ''} ${priority} ${status} ${doctor} ${folio} ${study.sampleType || ''} ${study.sampleCondition || ''} ${study.diagnosis || ''}`.toLowerCase();

    if (query && !searchTarget.includes(query)) {
      return false;
    }

    if (selectedArea && area !== selectedArea) {
      return false;
    }

    if (selectedStatus && status !== selectedStatus) {
      return false;
    }

    const studyDate = study.date || '';
    if (dateFrom && (!studyDate || studyDate < dateFrom)) {
      return false;
    }

    if (dateTo && (!studyDate || studyDate > dateTo)) {
      return false;
    }

    return true;
  });

  const { pageItems, totalPages, safePage } = paginate(filtered, recordsPage, PAGE_SIZE);
  recordsPage = safePage;

  const rows = pageItems
    .map((study) => {
      const patient = patients.find((item) => item.id === study.patientId) || study.patient;
      const area = patient.area || 'Consulta externa';
      const priority = study.priority || 'Normal';
      const status = study.status || 'Pendiente';
      const doctor = study.doctor || '';
      const folio = study.folio || '';

      return `
        <tr>
          <td>${patient.name}</td>
          <td>${patient.patientCode}</td>
          <td>${patient.age}</td>
          <td>${area}</td>
          <td>${study.type || ''}</td>
          <td>${study.sampleType || 'Sangre'}</td>
          <td>${study.fastingHours || 0} h</td>
          <td><span class="tag tag-${priority.toLowerCase()}">${priority}</span></td>
          <td>${study.date || ''}</td>
          <td>
            <div class="status-stack">
              <span class="tag tag-${status.toLowerCase().replace(/\s+/g, '-')}">${status}</span>
              ${buildResultFlagBadge(study)}
              ${study.diagnosis ? `<small>Dx: ${study.diagnosis}</small>` : ''}
              ${study.sampleCondition ? `<small>Muestra: ${study.sampleCondition}</small>` : ''}
              ${folio ? `<small>Folio: ${folio}</small>` : ''}
              ${doctor ? `<small>Médico: ${doctor}</small>` : ''}
              ${study.notes ? `<small>${study.notes}</small>` : ''}
            </div>
          </td>
          <td>
            <div class="action-group">
              ${currentUserRole !== 'lectura' ? `
                <button class="table-btn" type="button" data-action="edit-study" data-id="${study.id}">Editar</button>
                <button class="table-btn danger" type="button" data-action="delete-study" data-id="${study.id}">Eliminar</button>
              ` : '<span class="muted">Solo lectura</span>'}
            </div>
          </td>
        </tr>
      `;
    })
    .join('');

  recordsTable.innerHTML = rows || emptyStateTemplate.innerHTML;
  renderPaginationControls(recordsPagination, safePage, totalPages, (newPage) => {
    recordsPage = newPage;
    renderRecords();
  });
}

function renderReports() {
  if (patients.length === 0 && studies.length === 0) {
    reportAreaTop.textContent = '0';
    reportAreaLabel.textContent = 'Sin datos';
    reportStudyTop.textContent = '0';
    reportStudyLabel.textContent = 'Sin datos';
    reportProgress.textContent = '0%';
    reportActivePatients.textContent = '0';
    reportActiveLabel.textContent = 'Pacientes con estudios registrados';
    reportMunicipalityTop.textContent = '0';
    reportMunicipalityLabel.textContent = 'Sin datos';
    reportAffiliationTop.textContent = '0';
    reportAffiliationLabel.textContent = 'Sin datos';
    reportSampleTop.textContent = '0';
    reportSampleLabel.textContent = 'Sin datos';
    reportFastingAverage.textContent = '0 h';
    reportFastingLabel.textContent = 'Promedio en estudios capturados';
    reportUrgentPending.textContent = '0';
    reportDelayed.textContent = '0';
    reportToday.textContent = '0';
    reportWeek.textContent = '0';
    reportMonth.textContent = '0';
    reportStatusList.innerHTML = '<li>No hay suficientes registros para generar reportes.</li>';
    reportTypeList.innerHTML = '<li>No hay suficientes registros para generar reportes.</li>';
    reportMunicipalityList.innerHTML = '<li>No hay suficientes registros para generar reportes.</li>';
    reportAffiliationList.innerHTML = '<li>No hay suficientes registros para generar reportes.</li>';
    reportSampleList.innerHTML = '<li>No hay suficientes registros para generar reportes.</li>';
    reportConditionList.innerHTML = '<li>No hay suficientes registros para generar reportes.</li>';
    reportDoctorList.innerHTML = '<li>No hay suficientes registros para generar reportes.</li>';
    reportPriorityList.innerHTML = '<li>No hay suficientes registros para generar reportes.</li>';
    renderCharts({}, {}, {}, {}, {}, {});
    return;
  }

  const reportData = buildReportData();
  const areaCounts = reportData.distribution.areaCounts;
  const municipalityCounts = reportData.distribution.municipalityCounts;
  const affiliationCounts = reportData.distribution.affiliationCounts;
  const studyCounts = reportData.distribution.studyCounts;
  const statusCounts = reportData.distribution.statusCounts;
  const sampleCounts = reportData.distribution.sampleCounts;
  const conditionCounts = reportData.distribution.conditionCounts;
  const sexCounts = reportData.distribution.sexCounts;
  const priorityCounts = reportData.distribution.priorityCounts;
  const doctorCounts = reportData.distribution.doctorCounts;
  const ageCounts = reportData.distribution.ageCounts;

  const topArea = Object.entries(areaCounts).sort((left, right) => right[1] - left[1])[0];
  const topMunicipality = Object.entries(municipalityCounts).sort((left, right) => right[1] - left[1])[0];
  const topAffiliation = Object.entries(affiliationCounts).sort((left, right) => right[1] - left[1])[0];
  const topStudy = Object.entries(studyCounts).sort((left, right) => right[1] - left[1])[0];
  const topSample = Object.entries(sampleCounts).sort((left, right) => right[1] - left[1])[0];
  const activePatientsCount = new Set(studies.map((study) => study.patientId)).size;
  const progress = Math.round((studies.filter((study) => (study.status || '') === 'Entregado').length / studies.length) * 100);

  reportAreaTop.textContent = topArea ? String(topArea[1]) : '0';
  reportAreaLabel.textContent = topArea ? topArea[0] : 'Sin datos';
  reportMunicipalityTop.textContent = topMunicipality ? String(topMunicipality[1]) : '0';
  reportMunicipalityLabel.textContent = topMunicipality ? topMunicipality[0] : 'Sin datos';
  reportAffiliationTop.textContent = topAffiliation ? String(topAffiliation[1]) : '0';
  reportAffiliationLabel.textContent = topAffiliation ? topAffiliation[0] : 'Sin datos';
  reportStudyTop.textContent = topStudy ? String(topStudy[1]) : '0';
  reportStudyLabel.textContent = topStudy ? topStudy[0] : 'Sin datos';
  reportSampleTop.textContent = topSample ? String(topSample[1]) : '0';
  reportSampleLabel.textContent = topSample ? topSample[0] : 'Sin datos';
  reportProgress.textContent = `${progress}%`;
  reportActivePatients.textContent = String(activePatientsCount);
  reportActiveLabel.textContent = `${activePatientsCount} pacientes con estudios registrados`;
  reportFastingAverage.textContent = `${reportData.distribution.fastingAverage} h`;
  reportFastingLabel.textContent = `${studies.length} estudios capturados`;

  reportUrgentPending.textContent = String(reportData.timeIndicators.urgentPending);
  reportDelayed.textContent = String(reportData.timeIndicators.delayed);
  reportToday.textContent = String(reportData.timeIndicators.studiesToday);
  reportWeek.textContent = String(reportData.timeIndicators.studiesWeek);
  reportMonth.textContent = String(reportData.timeIndicators.studiesMonth);

  renderKeyValueList(reportStatusList, Object.entries(statusCounts), 'No hay estados registrados.');

  renderKeyValueList(reportTypeList, Object.entries(studyCounts).sort((left, right) => right[1] - left[1]), 'No hay tipos de estudio registrados.');
  renderKeyValueList(reportMunicipalityList, Object.entries(municipalityCounts).sort((left, right) => right[1] - left[1]), 'No hay municipios registrados.');
  renderKeyValueList(reportAffiliationList, Object.entries(affiliationCounts).sort((left, right) => right[1] - left[1]), 'No hay derechohabiencia registrada.');
  renderKeyValueList(reportSampleList, Object.entries(sampleCounts).sort((left, right) => right[1] - left[1]), 'No hay muestras registradas.');
  renderKeyValueList(reportConditionList, Object.entries(conditionCounts).sort((left, right) => right[1] - left[1]), 'No hay condiciones de muestra registradas.');
  renderKeyValueList(reportDoctorList, Object.entries(doctorCounts).sort((left, right) => right[1] - left[1]).slice(0, 8), 'No hay médicos solicitantes registrados.');
  renderKeyValueList(reportPriorityList, Object.entries(priorityCounts).sort((left, right) => right[1] - left[1]), 'No hay prioridades registradas.');

  const recentStudies = [...studies]
    .slice(0, 5)
    .map((study) => {
      const patient = patients.find((item) => item.id === study.patientId) || study.patient;
      const patientNameValue = patient ? patient.name : 'Paciente eliminado';
      return `<li><span>${patientNameValue} - ${study.type || 'Estudio'}</span><strong>${study.sampleType || study.status || 'Pendiente'}</strong></li>`;
    });

  recentActivityList.innerHTML = recentStudies.join('') || '<li>No hay actividad reciente.</li>';

  renderCharts(statusCounts, studyCounts, areaCounts, sexCounts, priorityCounts, ageCounts);
}

const CHART_PALETTE = ['#1f6f78', '#e2823a', '#5f6778', '#13484e', '#d5efef', '#a3312f', '#9a5321'];

function buildChart(existingChart, canvasId, type, labels, values) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') {
    return existingChart;
  }

  if (existingChart) {
    existingChart.destroy();
  }

  return new Chart(canvas, {
    type,
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: labels.map((_, index) => CHART_PALETTE[index % CHART_PALETTE.length]),
        borderWidth: type === 'bar' ? 0 : 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: type !== 'bar',
          position: 'bottom',
          labels: { boxWidth: 10, font: { size: 10 } }
        }
      },
      scales: type === 'bar' ? {
        y: { beginAtZero: true, ticks: { precision: 0 } }
      } : undefined
    }
  });
}

function renderCharts(statusCounts, studyCounts, areaCounts, sexCounts = {}, priorityCounts = {}, ageCounts = {}) {
  statusChart = buildChart(statusChart, 'chartStatus', 'doughnut', Object.keys(statusCounts), Object.values(statusCounts));
  typeChart = buildChart(typeChart, 'chartType', 'bar', Object.keys(studyCounts), Object.values(studyCounts));
  areaChart = buildChart(areaChart, 'chartArea', 'doughnut', Object.keys(areaCounts), Object.values(areaCounts));
  sexChart = buildChart(sexChart, 'chartSex', 'doughnut', Object.keys(sexCounts), Object.values(sexCounts));
  priorityChart = buildChart(priorityChart, 'chartPriority', 'doughnut', Object.keys(priorityCounts), Object.values(priorityCounts));
  ageChart = buildChart(ageChart, 'chartAge', 'bar', Object.keys(ageCounts), Object.values(ageCounts));
}

async function loadActivityLog() {
  if (!activityLogList) {
    return;
  }

  try {
    const entries = await requestJson('/api/activity-log');
    activityLogList.innerHTML = entries
      .map((entry) => `
        <li>
          <span><strong>${entry.username}</strong> — ${entry.action}${entry.description ? `: ${entry.description}` : ''}</span>
          <span class="log-meta">${entry.createdAt}</span>
        </li>
      `)
      .join('') || '<li>Sin actividad registrada todavía.</li>';
  } catch {
    activityLogList.innerHTML = '<li>No se pudo cargar la bitácora.</li>';
  }
}

const ROLE_LABELS = {
  admin: 'Administrador',
  captura: 'Captura',
  lectura: 'Solo lectura'
};

async function loadUsers() {
  if (currentUserRole !== 'admin') {
    return;
  }

  try {
    systemUsers = await requestJson('/api/users');
    renderUsers();
  } catch {
    if (usersTable) {
      usersTable.innerHTML = '<tr><td colspan="5" class="empty-state">No se pudo cargar la lista de usuarios.</td></tr>';
    }
  }
}

function renderUsers() {
  if (!usersTable) {
    return;
  }

  const rows = systemUsers
    .map((user) => `
      <tr>
        <td>${user.username}</td>
        <td>${user.fullName || ''}</td>
        <td>${ROLE_LABELS[user.role] || user.role}</td>
        <td><span class="tag ${user.active ? 'tag-entregado' : 'tag-pendiente'}">${user.active ? 'Activo' : 'Desactivado'}</span></td>
        <td>
          <div class="action-group">
            <button class="table-btn" type="button" data-action="edit-user" data-id="${user.id}">Editar</button>
            <button class="table-btn ${user.active ? 'danger' : ''}" type="button" data-action="toggle-user" data-id="${user.id}">
              ${user.active ? 'Desactivar' : 'Activar'}
            </button>
          </div>
        </td>
      </tr>
    `)
    .join('');

  usersTable.innerHTML = rows || '<tr><td colspan="5" class="empty-state">No hay usuarios registrados todavía.</td></tr>';
}

function editUser(userIdValue) {
  const user = systemUsers.find((item) => item.id === userIdValue);
  if (!user) {
    return;
  }

  editUserId.value = user.id;
  editUserUsername.value = user.username || '';
  editUserFullName.value = user.fullName || '';
  editUserRole.value = user.role || 'captura';
  editUserActive.value = user.active ? '1' : '0';
  editUserPassword.value = '';
  openModal('user', 'Editar usuario', 'Actualiza el rol, el estado o la contraseña.');
}

async function toggleUserActive(userIdValue) {
  const user = systemUsers.find((item) => item.id === userIdValue);
  if (!user) {
    return;
  }

  const nextActive = !user.active;
  const confirmed = window.confirm(
    nextActive ? `¿Reactivar al usuario ${user.username}?` : `¿Desactivar al usuario ${user.username}? No podrá iniciar sesión.`
  );
  if (!confirmed) {
    return;
  }

  try {
    await requestJson(`/api/users/${userIdValue}`, {
      method: 'PUT',
      body: JSON.stringify({
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        active: nextActive
      })
    });
    await loadUsers();
  } catch (error) {
    alert(error.message);
  }
}

if (usersTable) {
  usersTable.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) {
      return;
    }

    const { action, id } = button.dataset;
    if (action === 'edit-user') {
      editUser(id);
    }

    if (action === 'toggle-user') {
      toggleUserActive(id);
    }
  });
}

if (userForm) {
  userForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
      await requestJson('/api/users', {
        method: 'POST',
        body: JSON.stringify({
          username: userUsername.value.trim(),
          password: userPassword.value,
          fullName: userFullName.value.trim(),
          role: userRole.value
        })
      });
      userForm.reset();
      userRole.value = 'captura';
      await loadUsers();
    } catch (error) {
      alert(error.message);
    }
  });
}

if (editUserForm) {
  editUserForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
      const payload = {
        username: editUserUsername.value.trim(),
        fullName: editUserFullName.value.trim(),
        role: editUserRole.value,
        active: editUserActive.value === '1'
      };

      if (editUserPassword.value) {
        payload.password = editUserPassword.value;
      }

      await requestJson(`/api/users/${editUserId.value}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      closeModal();
      await loadUsers();
    } catch (error) {
      alert(error.message);
    }
  });
}

function openModal(mode, title, subtitle) {
  modalTitle.textContent = title;
  modalSubtitle.textContent = subtitle;
  editPatientForm.hidden = mode !== 'patient';
  editStudyForm.hidden = mode !== 'study';
  editUserForm.hidden = mode !== 'user';
  hospitalReportView.hidden = mode !== 'report';
  editModal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function buildPatientHospitalReport(patientIdValue) {
  const patient = patients.find((item) => item.id === patientIdValue);
  if (!patient) {
    return null;
  }

  const patientStudies = studies.filter((study) => study.patientId === patient.id);
  const deliveredCount = patientStudies.filter((study) => (study.status || '') === 'Entregado').length;
  const pendingCount = patientStudies.filter((study) => (study.status || 'Pendiente') !== 'Entregado').length;
  const sampleCounts = patientStudies.reduce((accumulator, study) => {
    const key = study.sampleType || 'Sangre';
    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});
  const topSample = Object.entries(sampleCounts).sort((left, right) => right[1] - left[1])[0];
  const averageFasting = patientStudies.length
    ? Math.round((patientStudies.reduce((sum, study) => sum + Number(study.fastingHours || 0), 0) / patientStudies.length) * 10) / 10
    : 0;

  return {
    patient,
    studies: patientStudies,
    summary: {
      deliveredCount,
      pendingCount,
      topSample: topSample ? topSample[0] : 'Sin datos',
      averageFasting
    }
  };
}

function renderPatientHospitalReport(report) {
  reportPatientTitle.textContent = `Reporte de ${report.patient.name}`;
  reportPatientSubtitle.textContent = `${report.patient.patientCode} · ${report.patient.municipality || 'San Carlos'} · ${report.patient.area || 'Consulta externa'}`;
  reportPatientName.textContent = report.patient.name || '-';
  reportPatientCode.textContent = report.patient.patientCode || '-';
  reportPatientArea.textContent = report.patient.area || 'Consulta externa';
  reportPatientLocality.textContent = report.patient.locality || 'Sin localidad registrada';
  reportPatientMunicipality.textContent = report.patient.municipality || 'San Carlos';
  reportPatientAffiliation.textContent = report.patient.affiliation || 'Sin derechohabiencia';
  reportPatientStudiesTotal.textContent = String(report.studies.length);
  reportPatientStudiesSummary.textContent = `${report.summary.deliveredCount} entregados, ${report.summary.pendingCount} pendientes`;

  reportPatientDataList.innerHTML = [
    ['Edad', `${report.patient.age} años`],
    ['Sexo', report.patient.sex || '-'],
    ['Teléfono', report.patient.phone || 'Sin teléfono'],
    ['Área de atención', report.patient.area || 'Consulta externa'],
    ['Localidad / comunidad', report.patient.locality || 'Sin localidad registrada'],
    ['Municipio', report.patient.municipality || 'San Carlos'],
    ['Derechohabiencia', report.patient.affiliation || 'Sin derechohabiencia']
  ].map(([label, value]) => `<li><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></li>`).join('');

  reportPatientMetricsList.innerHTML = [
    ['Total de estudios', String(report.studies.length)],
    ['Entregados', String(report.summary.deliveredCount)],
    ['Pendientes', String(report.summary.pendingCount)],
    ['Muestra más usada', report.summary.topSample],
    ['Ayuno promedio', `${report.summary.averageFasting} h`]
  ].map(([label, value]) => `<li><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></li>`).join('');

  reportStudiesTable.innerHTML = report.studies.length
    ? report.studies.map((study) => `
        <tr>
          <td>${escapeHtml(study.date || '')}</td>
          <td>
            <strong>${escapeHtml(study.type || '')}</strong>
            ${study.diagnosis ? `<small>Dx: ${escapeHtml(study.diagnosis)}</small>` : ''}
          </td>
          <td>${escapeHtml(study.sampleType || 'Sangre')}</td>
          <td>${escapeHtml(`${study.fastingHours || 0} h`)}</td>
          <td>
            <div class="status-stack">
              <span class="tag tag-${String(study.status || 'Pendiente').toLowerCase().replace(/\s+/g, '-')}">${escapeHtml(study.status || 'Pendiente')}</span>
              ${buildResultFlagBadge(study)}
              ${study.sampleCondition ? `<small>Condición: ${escapeHtml(study.sampleCondition)}</small>` : ''}
            </div>
          </td>
          <td>
            <div class="status-stack">
              ${study.doctor ? `<small>Médico: ${escapeHtml(study.doctor)}</small>` : ''}
              ${study.folio ? `<small>Folio: ${escapeHtml(study.folio)}</small>` : ''}
              ${study.notes ? `<small>${escapeHtml(study.notes)}</small>` : '<small>Sin observaciones</small>'}
            </div>
          </td>
        </tr>
      `).join('')
    : '<tr><td colspan="6" class="empty-state">No hay estudios registrados para este paciente.</td></tr>';

  reportClinicalSummary.textContent = report.studies.length
    ? `Paciente con ${report.studies.length} estudios. Se registran ${report.summary.deliveredCount} resultados entregados y ${report.summary.pendingCount} pendientes. La muestra más utilizada es ${report.summary.topSample} y el ayuno promedio es de ${report.summary.averageFasting} horas.`
    : 'Paciente sin estudios registrados.';

  return report;
}

function openPatientReport(patientIdValue) {
  const report = buildPatientHospitalReport(patientIdValue);
  if (!report) {
    return;
  }

  currentPatientHospitalReport = report;
  renderPatientHospitalReport(report);
  openModal('report', 'Reporte de hospital', 'Resumen clínico y laboratorial del paciente.');
}

function buildResultParametersPrintText(study) {
  const parameters = REFERENCE_RANGES[study.type];
  if (!parameters || !study.resultParameters) {
    return 'Sin valores capturados';
  }

  let parsed;
  try {
    parsed = JSON.parse(study.resultParameters);
  } catch {
    return 'Sin valores capturados';
  }

  const parts = parameters
    .map((parameter) => {
      const value = parsed[parameter.key];
      if (value === undefined || value === '') {
        return null;
      }
      const flag = flagForParameter(parameter, value);
      const flagText = flag && flag !== 'Normal' ? ` (${flag})` : '';
      return `${parameter.label}: ${value}${parameter.unit ? ` ${parameter.unit}` : ''}${flagText}`;
    })
    .filter(Boolean);

  return parts.length ? parts.join(' · ') : 'Sin valores capturados';
}

function printPatientHospitalReport(report) {
  const studyRows = report.studies.length
    ? report.studies.map((study) => `
        <tr>
          <td>${escapeHtml(study.date || '')}</td>
          <td>${escapeHtml(study.type || '')}</td>
          <td>${escapeHtml(study.sampleType || 'Sangre')}</td>
          <td>${escapeHtml(`${study.fastingHours || 0} h`)}</td>
          <td>${escapeHtml(study.status || 'Pendiente')}</td>
          <td>${escapeHtml(buildResultParametersPrintText(study))}</td>
          <td>${escapeHtml(study.diagnosis || 'Sin diagnóstico')}</td>
          <td>${escapeHtml(study.notes || 'Sin observaciones')}</td>
        </tr>
      `).join('')
    : '<tr><td colspan="8">Sin estudios registrados.</td></tr>';

  const html = `
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>Reporte de paciente</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 24px; color: #1d2433; background: #fff; }
          h1, h2, p { margin: 0 0 12px; }
          h1 { font-size: 26px; }
          .meta { color: #5f6778; }
          .summary { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin: 18px 0 20px; }
          .card { border: 1px solid #ddd3c6; border-radius: 12px; padding: 14px; }
          .card span { display: block; color: #5f6778; font-size: 12px; }
          .card strong { display: block; margin-top: 8px; font-size: 20px; color: #13484e; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd3c6; padding: 8px 10px; text-align: left; vertical-align: top; }
          th { background: #f1ebe0; }
          .section { margin-top: 22px; }
        </style>
      </head>
      <body>
        <h1>Hospital Rural de San Carlos</h1>
        <p class="meta">Reporte clínico del paciente</p>
        <p class="meta">${escapeHtml(report.patient.name)} · ${escapeHtml(report.patient.patientCode)} · ${escapeHtml(report.patient.municipality || 'San Carlos')}</p>

        <section class="summary">
          <div class="card"><span>Paciente</span><strong>${escapeHtml(report.patient.name)}</strong></div>
          <div class="card"><span>Procedencia</span><strong>${escapeHtml(report.patient.area || 'Consulta externa')}</strong></div>
          <div class="card"><span>Municipio</span><strong>${escapeHtml(report.patient.municipality || 'San Carlos')}</strong></div>
          <div class="card"><span>Derechohabiencia</span><strong>${escapeHtml(report.patient.affiliation || 'Sin derechohabiencia')}</strong></div>
        </section>

        <div class="section">
          <h2>Datos clínicos</h2>
          <p>Edad: ${escapeHtml(`${report.patient.age} años`)} · Sexo: ${escapeHtml(report.patient.sex || '-')} · Teléfono: ${escapeHtml(report.patient.phone || 'Sin teléfono')} · Localidad: ${escapeHtml(report.patient.locality || 'Sin localidad registrada')}</p>
        </div>

        <div class="section">
          <h2>Estudios y observaciones</h2>
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Estudio</th>
                <th>Muestra</th>
                <th>Ayuno</th>
                <th>Resultado</th>
                <th>Valores del análisis</th>
                <th>Diagnóstico</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>${studyRows}</tbody>
          </table>
        </div>
      </body>
    </html>
  `;

  const printFrame = document.createElement('iframe');
  printFrame.style.position = 'fixed';
  printFrame.style.right = '0';
  printFrame.style.bottom = '0';
  printFrame.style.width = '0';
  printFrame.style.height = '0';
  printFrame.style.border = '0';
  printFrame.style.visibility = 'hidden';
  printFrame.srcdoc = html;
  printFrame.addEventListener('load', () => {
    const frameWindow = printFrame.contentWindow;
    if (!frameWindow) {
      printFrame.remove();
      alert('No se pudo preparar la impresión del reporte.');
      return;
    }

    frameWindow.focus();
    frameWindow.print();
    window.setTimeout(() => printFrame.remove(), 1000);
  });
  document.body.appendChild(printFrame);
}

function closeModal() {
  editModal.hidden = true;
  document.body.style.overflow = '';
}

function updateViews() {
  setReadyState();
  refreshStudySelect();
  renderPatients();
  renderRecords();
  renderReports();
  loadActivityLog();
  if (currentUserRole === 'admin') {
    loadUsers();
  }
}

function resetPatientForm() {
  patientForm.reset();
  patientArea.value = 'Consulta externa';
  patientMunicipality.value = 'San Carlos';
  patientAffiliation.value = 'Sin derechohabiencia';
  patientName.focus();
}

function resetStudyForm() {
  studyForm.reset();
  studySampleType.value = 'Sangre';
  studyFastingHours.value = 0;
  studySampleCondition.value = 'Adecuada';
  renderResultParameterFields(studyResultParametersContainer, '');
  refreshFolioSuggestion();
  studyType.focus();
}

async function refreshFolioSuggestion() {
  try {
    const { folio } = await requestJson('/api/studies/next-folio');
    if (!studyFolio.value) {
      studyFolio.value = folio;
    }
  } catch {
    // Si falla la sugerencia, el folio se puede seguir capturando a mano;
    // el servidor igual lo autogenera si se deja vacío al guardar.
  }
}

async function loadData() {
  patients = await requestJson('/api/patients');
  studies = await requestJson('/api/studies');
}

async function migrateLegacyDataIfNeeded() {
  if (localStorage.getItem(migrationKey) === 'yes') {
    return;
  }

  const legacyPatients = JSON.parse(localStorage.getItem(legacyPatientsKey) || '[]');
  const legacyStudies = JSON.parse(localStorage.getItem(legacyStudiesKey) || '[]');

  if (patients.length === 0 && studies.length === 0 && (legacyPatients.length > 0 || legacyStudies.length > 0)) {
    for (const patient of legacyPatients) {
      await requestJson('/api/patients', {
        method: 'POST',
        body: JSON.stringify(patient)
      });
    }

    for (const study of legacyStudies) {
      await requestJson('/api/studies', {
        method: 'POST',
        body: JSON.stringify(study)
      });
    }

    localStorage.setItem(migrationKey, 'yes');
    localStorage.removeItem(legacyPatientsKey);
    localStorage.removeItem(legacyStudiesKey);
  }
}

async function savePatient(payload, patientIdValue = null) {
  const method = patientIdValue ? 'PUT' : 'POST';
  const endpoint = patientIdValue ? `/api/patients/${patientIdValue}` : '/api/patients';
  await requestJson(endpoint, {
    method,
    body: JSON.stringify(payload)
  });
  await loadData();
  updateViews();
}

async function saveStudy(payload, studyIdValue = null) {
  const method = studyIdValue ? 'PUT' : 'POST';
  const endpoint = studyIdValue ? `/api/studies/${studyIdValue}` : '/api/studies';
  await requestJson(endpoint, {
    method,
    body: JSON.stringify(payload)
  });
  await loadData();
  updateViews();
}

function buildPatientPayload(existingPatient = null) {
  const code = patientId.value.trim().toUpperCase();
  const payload = {
    id: existingPatient?.id,
    name: patientName.value.trim(),
    patientCode: code,
    age: Number(patientAge.value),
    sex: patientSex.value,
    phone: patientPhone.value.trim(),
    area: patientArea.value,
    municipality: patientMunicipality.value.trim(),
    locality: patientLocality.value.trim(),
    affiliation: patientAffiliation.value
  };

  return payload;
}

function buildStudyPayload(existingStudy = null) {
  const payload = {
    id: existingStudy?.id,
    patientId: studyPatient.value,
    type: studyType.value.trim(),
    date: studyDate.value,
    priority: studyPriority.value,
    status: studyStatus.value,
    sampleType: studySampleType.value,
    fastingHours: Number(studyFastingHours.value || 0),
    sampleCondition: studySampleCondition.value,
    diagnosis: studyDiagnosis.value.trim(),
    doctor: studyDoctor.value.trim(),
    folio: studyFolio.value.trim(),
    notes: studyNotes.value.trim(),
    resultParameters: collectResultParameters(studyResultParametersContainer, studyType.value.trim())
  };

  return payload;
}

function fillPatientForm(patient) {
  patientName.value = patient.name || '';
  patientId.value = patient.patientCode || '';
  patientAge.value = patient.age ?? '';
  patientSex.value = patient.sex || '';
  patientPhone.value = patient.phone || '';
  patientArea.value = patient.area || 'Consulta externa';
  patientMunicipality.value = patient.municipality || 'San Carlos';
  patientLocality.value = patient.locality || '';
  patientAffiliation.value = patient.affiliation || 'Sin derechohabiencia';
}

function fillStudyForm(study) {
  studyPatient.value = study.patientId || '';
  studyType.value = study.type || '';
  studyDate.value = study.date || '';
  studyPriority.value = study.priority || '';
  studyStatus.value = study.status || '';
  studySampleType.value = study.sampleType || 'Sangre';
  studyFastingHours.value = study.fastingHours ?? 0;
  studySampleCondition.value = study.sampleCondition || 'Adecuada';
  studyDiagnosis.value = study.diagnosis || '';
  studyDoctor.value = study.doctor || '';
  studyFolio.value = study.folio || '';
  studyNotes.value = study.notes || '';
  renderResultParameterFields(studyResultParametersContainer, study.type || '');
}

async function editPatient(patientIdValue) {
  const patient = patients.find((item) => item.id === patientIdValue);
  if (!patient) {
    return;
  }

  editPatientRecordId.value = patient.id;
  editPatientName.value = patient.name || '';
  editPatientCode.value = patient.patientCode || '';
  editPatientAge.value = patient.age ?? '';
  editPatientSex.value = patient.sex || '';
  editPatientPhone.value = patient.phone || '';
  editPatientArea.value = patient.area || 'Consulta externa';
  editPatientMunicipality.value = patient.municipality || 'San Carlos';
  editPatientLocality.value = patient.locality || '';
  editPatientAffiliation.value = patient.affiliation || 'Sin derechohabiencia';
  openModal('patient', 'Editar paciente', 'Actualiza la información del expediente.');
}

async function deletePatient(patientIdValue) {
  const patient = patients.find((item) => item.id === patientIdValue);
  if (!patient) {
    return;
  }

  const confirmed = window.confirm(`¿Eliminar al paciente ${patient.name} y sus estudios relacionados?`);
  if (!confirmed) {
    return;
  }

  try {
    await requestJson(`/api/patients/${patientIdValue}`, { method: 'DELETE' });
    await loadData();
    updateViews();
  } catch (error) {
    alert(error.message);
  }
}

async function editStudy(studyIdValue) {
  const study = studies.find((item) => item.id === studyIdValue);
  if (!study) {
    return;
  }

  editStudyRecordId.value = study.id;
  editStudyPatient.value = study.patientId || '';
  editStudyType.value = study.type || '';
  editStudyDate.value = study.date || '';
  editStudyPriority.value = study.priority || '';
  editStudyStatus.value = study.status || '';
  editStudySampleType.value = study.sampleType || 'Sangre';
  editStudyFastingHours.value = study.fastingHours ?? 0;
  editStudySampleCondition.value = study.sampleCondition || 'Adecuada';
  editStudyDiagnosis.value = study.diagnosis || '';
  editStudyDoctor.value = study.doctor || '';
  editStudyFolio.value = study.folio || '';
  editStudyNotes.value = study.notes || '';

  let existingValues = {};
  if (study.resultParameters) {
    try {
      existingValues = JSON.parse(study.resultParameters);
    } catch {
      existingValues = {};
    }
  }
  renderResultParameterFields(editStudyResultParametersContainer, study.type || '', existingValues);

  openModal('study', 'Editar estudio', 'Actualiza el estudio y su seguimiento.');
}

async function deleteStudy(studyIdValue) {
  const study = studies.find((item) => item.id === studyIdValue);
  if (!study) {
    return;
  }

  const confirmed = window.confirm('¿Eliminar este estudio?');
  if (!confirmed) {
    return;
  }

  try {
    await requestJson(`/api/studies/${studyIdValue}`, { method: 'DELETE' });
    await loadData();
    updateViews();
  } catch (error) {
    alert(error.message);
  }
}

async function exportBackup() {
  try {
    const payload = await requestJson('/api/backup');
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'respaldo-laboratorio.json';
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    alert(error.message);
  }
}

async function exportFullReport() {
  try {
    const payload = buildReportData();
    downloadJson(`reporte-general-laboratorio-${new Date().toISOString().slice(0, 10)}.json`, payload);
  } catch (error) {
    alert(error.message);
  }
}

function handlePatientReportPrint() {
  if (!currentPatientHospitalReport) {
    return;
  }

  printPatientHospitalReport(currentPatientHospitalReport);
}

function renderPrintableList(entries, emptyMessage) {
  if (!entries.length) {
    return `<p class="print-empty">${escapeHtml(emptyMessage)}</p>`;
  }

  return `
    <table>
      <thead>
        <tr><th>Concepto</th><th>Valor</th></tr>
      </thead>
      <tbody>
        ${entries.map(([label, value]) => `<tr><td>${escapeHtml(label)}</td><td>${escapeHtml(value)}</td></tr>`).join('')}
      </tbody>
    </table>
  `;
}

function openPrintableReport(reportData) {
  const topAreas = Object.entries(reportData.distribution.areaCounts).sort((left, right) => right[1] - left[1]).slice(0, 5);
  const topMunicipalities = Object.entries(reportData.distribution.municipalityCounts).sort((left, right) => right[1] - left[1]).slice(0, 5);
  const topAffiliations = Object.entries(reportData.distribution.affiliationCounts).sort((left, right) => right[1] - left[1]).slice(0, 5);
  const topStudies = Object.entries(reportData.distribution.studyCounts).sort((left, right) => right[1] - left[1]).slice(0, 5);
  const topSamples = Object.entries(reportData.distribution.sampleCounts).sort((left, right) => right[1] - left[1]).slice(0, 5);
  const topConditions = Object.entries(reportData.distribution.conditionCounts).sort((left, right) => right[1] - left[1]).slice(0, 5);
  const studyRows = [...reportData.studies]
    .sort((left, right) => String(right.date || '').localeCompare(String(left.date || '')))
    .slice(0, 12)
    .map((study) => {
      const patient = reportData.patients.find((item) => item.id === study.patientId);
      return `
        <tr>
          <td>${escapeHtml(patient ? patient.name : 'Paciente eliminado')}</td>
          <td>${escapeHtml(patient ? patient.patientCode : study.patientId)}</td>
          <td>${escapeHtml(study.type || '')}</td>
          <td>${escapeHtml(study.sampleType || 'Sangre')}</td>
          <td>${escapeHtml(study.status || 'Pendiente')}</td>
          <td>${escapeHtml(study.date || '')}</td>
        </tr>
      `;
    })
    .join('');

  const html = `
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>Reporte general del laboratorio</title>
        <style>
          :root { color-scheme: light; }
          body { font-family: Arial, sans-serif; margin: 0; padding: 24px; color: #1d2433; background: #f6f2e9; }
          h1, h2, h3, p { margin: 0 0 12px; }
          h1 { font-size: 28px; }
          h2 { margin-top: 24px; font-size: 18px; }
          .meta { margin-bottom: 20px; color: #5f6778; }
          .summary { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin: 18px 0 24px; }
          .card { border: 1px solid #d9d2c5; border-radius: 12px; padding: 14px; background: white; }
          .card span { display: block; color: #5f6778; font-size: 12px; }
          .card strong { display: block; margin-top: 8px; font-size: 22px; color: #13484e; }
          .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; background: white; }
          th, td { border: 1px solid #ddd3c6; padding: 8px 10px; text-align: left; vertical-align: top; }
          th { background: #f1ebe0; }
          .print-empty { padding: 12px; background: white; border: 1px dashed #cfc6b6; border-radius: 10px; color: #5f6778; }
          .footer { margin-top: 20px; color: #5f6778; font-size: 12px; }
          @media print { body { background: white; padding: 0; } .card, table, .print-empty { break-inside: avoid; } }
        </style>
      </head>
      <body>
        <h1>Hospital Rural de San Carlos</h1>
        <p class="meta">Reporte general del laboratorio clínico</p>
        <p class="meta">Generado el ${escapeHtml(new Date(reportData.generatedAt).toLocaleString('es-MX'))}</p>

        <section class="summary">
          <div class="card"><span>Pacientes</span><strong>${reportData.totals.patients}</strong></div>
          <div class="card"><span>Estudios</span><strong>${reportData.totals.studies}</strong></div>
          <div class="card"><span>Pendientes</span><strong>${reportData.totals.pending}</strong></div>
          <div class="card"><span>Entregados</span><strong>${reportData.totals.delivered}</strong></div>
          <div class="card"><span>Área principal</span><strong>${escapeHtml(Object.entries(reportData.distribution.areaCounts).sort((left, right) => right[1] - left[1])[0]?.[0] || 'Sin datos')}</strong></div>
          <div class="card"><span>Municipio principal</span><strong>${escapeHtml(Object.entries(reportData.distribution.municipalityCounts).sort((left, right) => right[1] - left[1])[0]?.[0] || 'Sin datos')}</strong></div>
          <div class="card"><span>Muestra más usada</span><strong>${escapeHtml(Object.entries(reportData.distribution.sampleCounts).sort((left, right) => right[1] - left[1])[0]?.[0] || 'Sin datos')}</strong></div>
          <div class="card"><span>Ayuno promedio</span><strong>${reportData.distribution.fastingAverage} h</strong></div>
        </section>

        <div class="grid">
          <section>
            <h2>Distribución por área</h2>
            ${renderPrintableList(topAreas, 'Sin datos')}
          </section>
          <section>
            <h2>Municipios con más pacientes</h2>
            ${renderPrintableList(topMunicipalities, 'Sin datos')}
          </section>
          <section>
            <h2>Derechohabiencia</h2>
            ${renderPrintableList(topAffiliations, 'Sin datos')}
          </section>
          <section>
            <h2>Tipos de estudio</h2>
            ${renderPrintableList(topStudies, 'Sin datos')}
          </section>
          <section>
            <h2>Tipos de muestra</h2>
            ${renderPrintableList(topSamples, 'Sin datos')}
          </section>
          <section>
            <h2>Condición de muestra</h2>
            ${renderPrintableList(topConditions, 'Sin datos')}
          </section>
        </div>

        <h2>Últimos estudios capturados</h2>
        <table>
          <thead>
            <tr>
              <th>Paciente</th>
              <th>ID</th>
              <th>Estudio</th>
              <th>Muestra</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            ${studyRows || '<tr><td colspan="6">Sin estudios registrados.</td></tr>'}
          </tbody>
        </table>

        <p class="footer">Reporte generado por el sistema de laboratorio clínico del Hospital Rural de San Carlos.</p>
      </body>
    </html>
  `;

  const frame = document.createElement('iframe');
  frame.title = 'Vista imprimible del reporte';
  frame.style.position = 'fixed';
  frame.style.right = '0';
  frame.style.bottom = '0';
  frame.style.width = '0';
  frame.style.height = '0';
  frame.style.border = '0';
  frame.style.visibility = 'hidden';
  frame.srcdoc = html;

  frame.addEventListener('load', () => {
    const frameWindow = frame.contentWindow;
    if (!frameWindow) {
      frame.remove();
      alert('No se pudo preparar la vista imprimible.');
      return;
    }

    frameWindow.focus();
    frameWindow.print();
    window.setTimeout(() => frame.remove(), 1000);
  });

  document.body.appendChild(frame);
}

async function printFullReport() {
  try {
    openPrintableReport(buildReportData());
  } catch (error) {
    alert(error.message);
  }
}

async function restoreBackupFromFile(file) {
  if (!file) {
    return;
  }

  const text = await file.text();
  const payload = JSON.parse(text);
  await requestJson('/api/backup/restore', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  await loadData();
  updateViews();
}

patientForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    const payload = buildPatientPayload();
    if (!payload.name || !payload.patientCode || Number.isNaN(payload.age) || !payload.sex) {
      alert('Completa los datos obligatorios del paciente.');
      return;
    }

    await savePatient(payload);
    resetPatientForm();
  } catch (error) {
    alert(error.message);
  }
});

studyForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (studyPatient.disabled) {
    alert('Primero registra al menos un paciente.');
    return;
  }

  try {
    const payload = buildStudyPayload();
    if (!payload.patientId || !payload.type || !payload.date || !payload.priority || !payload.status) {
      alert('Completa los datos obligatorios del estudio.');
      return;
    }

    await saveStudy(payload);
    resetStudyForm();
  } catch (error) {
    alert(error.message);
  }
});

searchInput.addEventListener('input', () => {
  patientsPage = 1;
  recordsPage = 1;
  renderPatients();
  renderRecords();
});

areaFilter.addEventListener('change', () => {
  recordsPage = 1;
  renderRecords();
});
statusFilter.addEventListener('change', () => {
  recordsPage = 1;
  renderRecords();
});

patientsTable.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) {
    return;
  }

  const { action, id } = button.dataset;
  if (action === 'view-report') {
    openPatientReport(id);
  }

  if (action === 'edit-patient') {
    editPatient(id);
  }

  if (action === 'delete-patient') {
    deletePatient(id);
  }
});

recordsTable.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) {
    return;
  }

  const { action, id } = button.dataset;
  if (action === 'edit-study') {
    editStudy(id);
  }

  if (action === 'delete-study') {
    deleteStudy(id);
  }
});

exportButton.addEventListener('click', exportBackup);
downloadReportButton.addEventListener('click', exportFullReport);
printReportButton.addEventListener('click', printFullReport);
printPatientReportButton.addEventListener('click', handlePatientReportPrint);

importButton.addEventListener('click', () => importInput.click());
importInput.addEventListener('change', async () => {
  const [file] = importInput.files || [];
  try {
    await restoreBackupFromFile(file);
  } catch (error) {
    alert(`No se pudo importar el respaldo: ${error.message}`);
  } finally {
    importInput.value = '';
  }
});

closeModalButton.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);

editPatientForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    await savePatient({
      name: editPatientName.value.trim(),
      patientCode: editPatientCode.value.trim().toUpperCase(),
      age: Number(editPatientAge.value),
      sex: editPatientSex.value,
      phone: editPatientPhone.value.trim(),
      area: editPatientArea.value,
      municipality: editPatientMunicipality.value.trim(),
      locality: editPatientLocality.value.trim(),
      affiliation: editPatientAffiliation.value
    }, editPatientRecordId.value);
    closeModal();
  } catch (error) {
    alert(error.message);
  }
});

editStudyForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    await saveStudy({
      patientId: editStudyPatient.value,
      type: editStudyType.value.trim(),
      date: editStudyDate.value,
      priority: editStudyPriority.value,
      status: editStudyStatus.value,
      sampleType: editStudySampleType.value,
      fastingHours: Number(editStudyFastingHours.value || 0),
      sampleCondition: editStudySampleCondition.value,
      diagnosis: editStudyDiagnosis.value.trim(),
      doctor: editStudyDoctor.value.trim(),
      folio: editStudyFolio.value.trim(),
      notes: editStudyNotes.value.trim(),
      resultParameters: collectResultParameters(editStudyResultParametersContainer, editStudyType.value.trim())
    }, editStudyRecordId.value);
    closeModal();
  } catch (error) {
    alert(error.message);
  }
});

studyType.addEventListener('change', () => {
  renderResultParameterFields(studyResultParametersContainer, studyType.value);
});

document.querySelectorAll('.nav-btn[data-view="view-registrar-estudio"]').forEach((button) => {
  button.addEventListener('click', () => {
    if (!studyFolio.value) {
      refreshFolioSuggestion();
    }
  });
});

dateFromFilter.addEventListener('change', () => {
  recordsPage = 1;
  renderRecords();
});
dateToFilter.addEventListener('change', () => {
  recordsPage = 1;
  renderRecords();
});
clearDateFilterButton.addEventListener('click', () => {
  dateFromFilter.value = '';
  dateToFilter.value = '';
  recordsPage = 1;
  renderRecords();
});

editStudyType.addEventListener('change', () => {
  renderResultParameterFields(editStudyResultParametersContainer, editStudyType.value);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !editModal.hidden) {
    closeModal();
  }
});

async function checkSession() {
  try {
    const session = await requestJson('/api/session');
    sessionUsername.textContent = session.fullName || session.username;
    currentUserRole = session.role || 'captura';
    applyRolePermissions();
    return true;
  } catch {
    window.location.href = '/login.html';
    return false;
  }
}

function applyRolePermissions() {
  const isAdminRole = currentUserRole === 'admin';
  const canWriteRole = currentUserRole !== 'lectura';

  document.querySelectorAll('.admin-only').forEach((element) => {
    element.hidden = !isAdminRole;
  });

  document.querySelectorAll('.write-only').forEach((element) => {
    element.hidden = !canWriteRole;
  });

  importButton.disabled = !canWriteRole;
}

logoutButton.addEventListener('click', async () => {
  try {
    await requestJson('/api/logout', { method: 'POST' });
  } catch {
    // Si falla, igual mandamos al login.
  }
  window.location.href = '/login.html';
});

async function init() {
  const hasSession = await checkSession();
  if (!hasSession) {
    return;
  }

  try {
    await loadData();
    await migrateLegacyDataIfNeeded();
    await loadData();
    isReady = true;
    updateViews();
  } catch (error) {
    alert(`No se pudo cargar la base de datos: ${error.message}`);
  }
}

init();
