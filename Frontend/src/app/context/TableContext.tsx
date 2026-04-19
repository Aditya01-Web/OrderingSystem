import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchTables } from '../services/menuApi';

export interface TableInfo {
  table_id: number;
  qr_code: string;
  table_number: number;
  capacity: number;
  status: string;
  last_updated: string;
}

interface TableContextType {
  tables: TableInfo[];
  loadingTables: boolean;
  errorTables: boolean;
  currentTableId: number;
  setCurrentTableId: (id: number) => void;
  getTableByNumber: (tableNumber: number) => TableInfo | undefined;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

export const TableProvider = ({ children }: { children: ReactNode }) => {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [loadingTables, setLoadingTables] = useState(true);
  const [errorTables, setErrorTables] = useState(false);
  // Default to table 1, can be overridden by URL param
  const [currentTableId, setCurrentTableId] = useState<number>(1);

  useEffect(() => {
    // 1. Check for table in URL parameters (?table=2)
    const params = new URLSearchParams(window.location.search);
    let tableParam = params.get('table');

    // 1b. Check for table in URL path (e.g. /2)
    if (!tableParam) {
      const match = window.location.pathname.match(/^\/(\d+)\/?$/);
      if (match) {
        tableParam = match[1];
      }
    }
    
    if (tableParam) {
      const parsed = parseInt(tableParam, 10);
      if (!isNaN(parsed)) {
        setCurrentTableId(parsed);
        localStorage.setItem('currentTableId', parsed.toString());
      }
    } else {
      // 2. Fallback to localStorage
      const stored = localStorage.getItem('currentTableId');
      if (stored) {
        setCurrentTableId(parseInt(stored, 10));
      }
    }
  }, []);

  useEffect(() => {
    const loadTables = async () => {
      try {
        setLoadingTables(true);
        // Ensure error state is reset
        setErrorTables(false);
        const data = await fetchTables();
        setTables(data);
      } catch (err) {
        console.error('Failed to load tables:', err);
        setErrorTables(true);
      } finally {
        setLoadingTables(false);
      }
    };
    loadTables();
  }, []);

  const getTableByNumber = (tableNumber: number) => {
    return tables.find((t) => t.table_number === tableNumber);
  };

  return (
    <TableContext.Provider value={{ tables, loadingTables, errorTables, currentTableId, setCurrentTableId, getTableByNumber }}>
      {children}
    </TableContext.Provider>
  );
};

export const useTable = () => {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error('useTable must be used within a TableProvider');
  }
  return context;
};
