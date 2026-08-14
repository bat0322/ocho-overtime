const STORAGE_KEY = 'ocho_overtimes';

export function loadOvertimes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist(overtimes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overtimes));
}

export function saveOvertime(title, items) {
  const overtimes = loadOvertimes();
  const entry = { id: Date.now(), title, items, used: false, savedAt: new Date().toISOString() };
  overtimes.push(entry);
  persist(overtimes);
  return entry;
}

export function updateOvertime(id, title, items) {
  const overtimes = loadOvertimes();
  const idx = overtimes.findIndex(o => o.id === id);
  if (idx !== -1) {
    overtimes[idx] = { ...overtimes[idx], title, items };
    persist(overtimes);
  }
}

export function markOvertimeUsed(id) {
  const overtimes = loadOvertimes();
  const idx = overtimes.findIndex(o => o.id === id);
  if (idx !== -1) {
    overtimes[idx].used = true;
    persist(overtimes);
  }
}

export function deleteOvertime(id) {
  persist(loadOvertimes().filter(o => o.id !== id));
}
