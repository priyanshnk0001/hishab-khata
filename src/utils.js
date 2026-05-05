const STORAGE_KEY = 'hishab_khata_ledgers';
const CATERING_STORAGE_KEY = 'hishab_khata_catering';

const getCurrentUsername = () => {
  const session = localStorage.getItem('hishab_current_user');
  if (session) {
    try {
      const user = JSON.parse(session);
      return user.username;
    } catch (e) {
      return null;
    }
  }
  return null;
};

// --- Raw Database Accessors (Unfiltered, used internally to prevent wiping other users' data) ---
const getAllLedgersRaw = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const getAllCateringRaw = () => {
  const data = localStorage.getItem(CATERING_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// --- Public Accessors (Filtered by currentUser) ---
export const getLedgers = () => {
  const allLedgers = getAllLedgersRaw();
  const username = getCurrentUsername();
  return allLedgers.filter(l => l.createdBy === username);
};

export const getCateringLedgers = () => {
  const allCatering = getAllCateringRaw();
  const username = getCurrentUsername();
  return allCatering.filter(l => l.createdBy === username);
};

// --- Ledger Actions ---
export const saveLedger = (ledger) => {
  const username = getCurrentUsername();
  if (!username) throw new Error("Unauthenticated users cannot save ledgers");

  const allLedgers = getAllLedgersRaw();
  const index = allLedgers.findIndex(l => l.id === ledger.id);
  
  const updatedLedger = {
    ...ledger,
    createdBy: ledger.createdBy || username,
    updatedAt: new Date().toISOString()
  };

  if (index >= 0) {
    if (allLedgers[index].createdBy && allLedgers[index].createdBy !== username) {
      throw new Error("Unauthorized to edit this ledger");
    }
    allLedgers[index] = updatedLedger;
  } else {
    allLedgers.push(updatedLedger);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allLedgers));
  return updatedLedger;
};

export const deleteLedger = (id) => {
  const username = getCurrentUsername();
  const allLedgers = getAllLedgersRaw();

  const ledger = allLedgers.find(l => l.id === id);
  if (ledger && ledger.createdBy && ledger.createdBy !== username) {
    throw new Error("Unauthorized to delete this ledger");
  }

  const filtered = allLedgers.filter(l => l.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const getLedgerById = (id) => {
  const username = getCurrentUsername();
  const allLedgers = getAllLedgersRaw();
  const ledger = allLedgers.find(l => l.id === id);
  
  if (ledger && (!ledger.createdBy || ledger.createdBy === username)) {
    return ledger;
  }
  return undefined;
};

// --- Catering Actions ---
export const saveCateringLedger = (ledger) => {
  const username = getCurrentUsername();
  if (!username) throw new Error("Unauthenticated users cannot save catering ledgers");

  const allCatering = getAllCateringRaw();
  const index = allCatering.findIndex(l => l.id === ledger.id);
  
  const updatedLedger = {
    ...ledger,
    createdBy: ledger.createdBy || username,
    updatedAt: new Date().toISOString()
  };

  if (index >= 0) {
    if (allCatering[index].createdBy && allCatering[index].createdBy !== username) {
      throw new Error("Unauthorized to edit this catering ledger");
    }
    allCatering[index] = updatedLedger;
  } else {
    allCatering.push(updatedLedger);
  }
  
  localStorage.setItem(CATERING_STORAGE_KEY, JSON.stringify(allCatering));
  return updatedLedger;
};

export const deleteCateringLedger = (id) => {
  const username = getCurrentUsername();
  const allCatering = getAllCateringRaw();

  const ledger = allCatering.find(l => l.id === id);
  if (ledger && ledger.createdBy && ledger.createdBy !== username) {
    throw new Error("Unauthorized to delete this catering ledger");
  }

  const filtered = allCatering.filter(l => l.id !== id);
  localStorage.setItem(CATERING_STORAGE_KEY, JSON.stringify(filtered));
};

export const getCateringLedgerById = (id) => {
  const username = getCurrentUsername();
  const allCatering = getAllCateringRaw();
  const ledger = allCatering.find(l => l.id === id);

  if (ledger && (!ledger.createdBy || ledger.createdBy === username)) {
    return ledger;
  }
  return undefined;
};
