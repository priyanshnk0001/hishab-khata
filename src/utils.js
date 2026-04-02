const STORAGE_KEY = 'hishab_khata_ledgers';
const CATERING_STORAGE_KEY = 'hishab_khata_catering';

export const getLedgers = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const getCateringLedgers = () => {
  const data = localStorage.getItem(CATERING_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveLedger = (ledger) => {
  const ledgers = getLedgers();
  const index = ledgers.findIndex(l => l.id === ledger.id);
  
  const updatedLedger = {
    ...ledger,
    updatedAt: new Date().toISOString()
  };

  if (index >= 0) {
    ledgers[index] = updatedLedger;
  } else {
    ledgers.push(updatedLedger);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ledgers));
  return updatedLedger;
};

export const deleteLedger = (id) => {
  const ledgers = getLedgers();
  const filtered = ledgers.filter(l => l.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const getLedgerById = (id) => {
  const ledgers = getLedgers();
  return ledgers.find(l => l.id === id);
};

export const saveCateringLedger = (ledger) => {
  const ledgers = getCateringLedgers();
  const index = ledgers.findIndex(l => l.id === ledger.id);
  
  const updatedLedger = {
    ...ledger,
    updatedAt: new Date().toISOString()
  };

  if (index >= 0) {
    ledgers[index] = updatedLedger;
  } else {
    ledgers.push(updatedLedger);
  }
  
  localStorage.setItem(CATERING_STORAGE_KEY, JSON.stringify(ledgers));
  return updatedLedger;
};

export const deleteCateringLedger = (id) => {
  const ledgers = getCateringLedgers();
  const filtered = ledgers.filter(l => l.id !== id);
  localStorage.setItem(CATERING_STORAGE_KEY, JSON.stringify(filtered));
};

export const getCateringLedgerById = (id) => {
  const ledgers = getCateringLedgers();
  return ledgers.find(l => l.id === id);
};
