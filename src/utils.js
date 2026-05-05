const STORAGE_KEY = 'hishab_khata_ledgers';
const CATERING_STORAGE_KEY = 'hishab_khata_catering';

const getCurrentUserMobile = () => {
  const session = localStorage.getItem('hishab_current_user');
  if (session) {
    try {
      const user = JSON.parse(session);
      return user.mobile;
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
export const getLedgers = async () => {
  const mobile = getCurrentUserMobile();
  if (!mobile) return [];
  
  try {
    const response = await fetch(`https://hishab-khata-backend.onrender.com/hishab-data?mobile=${mobile}`);
    const result = await response.json();
    const data = result.data || [];
    // Normalize MongoDB _id to id for frontend compatibility
    return data.map(l => ({ ...l, id: l._id || l.id }));
  } catch (error) {
    console.error('Failed to fetch ledgers:', error);
    return [];
  }
};

// --- Ledger Actions ---
export const saveLedger = async (ledger) => {
  const mobile = getCurrentUserMobile();
  if (!mobile) throw new Error("Unauthenticated users cannot save ledgers");

  try {
    const response = await fetch('https://hishab-khata-backend.onrender.com/hishab-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...ledger,
        createdBy: mobile,
        updatedAt: new Date().toISOString()
      })
    });

    let result;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      result = await response.json();
    } else {
      const text = await response.text();
      throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
    }

    if (!response.ok) throw new Error(result.message || 'Failed to save ledger');
    // Normalize normalized result
    const savedData = result.data;
    return { ...savedData, id: savedData._id || savedData.id };
  } catch (error) {
    console.error('Save error detail:', error);
    throw error;
  }
};

export const deleteLedger = async (id) => {
  try {
    const response = await fetch(`https://hishab-khata-backend.onrender.com/hishab-data/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete ledger');
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
};

export const getLedgerById = async (id) => {
  try {
    const response = await fetch(`https://hishab-khata-backend.onrender.com/hishab-data`);
    const result = await response.json();
    const ledger = result.data.find(l => l._id === id || l.id === id);
    if (ledger) {
      return { ...ledger, id: ledger._id || ledger.id };
    }
    return undefined;
  } catch (error) {
    console.error('Fetch by ID error:', error);
    return undefined;
  }
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
