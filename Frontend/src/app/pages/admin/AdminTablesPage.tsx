import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useTable } from '../../context/TableContext';
import { Download, QrCode, Plus, Trash2, X } from 'lucide-react';
import { addTable, deleteTable } from '../../services/adminApi';

export const AdminTablesPage = () => {
  const { tables, loadingTables, errorTables, refreshTables } = useTable();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTable, setNewTable] = useState({ table_number: '', capacity: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDownload = (base64Data: string, tableName: string) => {
    const a = document.createElement('a');
    a.href = base64Data;
    a.download = `${tableName}-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await addTable({ table_number: Number(newTable.table_number), capacity: Number(newTable.capacity) });
      await refreshTables();
      setIsAddModalOpen(false);
      setNewTable({ table_number: '', capacity: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to add table. It may already exist.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTable = async (tableId: number) => {
    if (!window.confirm('Are you sure you want to delete this table?')) return;
    try {
      await deleteTable(tableId);
      await refreshTables();
    } catch (err) {
      console.error(err);
      alert('Failed to delete table.');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#1C2B1A' }}>
              Tables & QR Codes
            </h1>
            <p className="mt-1" style={{ color: '#4A5E47' }}>
              Manage tables and download QR codes for ordering
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-colors shadow-sm"
            style={{ backgroundColor: '#3A6B35', color: '#F7F3ED' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2E5529')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3A6B35')}
          >
            <Plus className="w-5 h-5" />
            Add New Table
          </button>
        </div>

        {loadingTables ? (
          <div className="flex justify-center items-center h-64">
            <div
              className="w-8 h-8 border-4 rounded-full animate-spin"
              style={{ borderColor: '#A8C9A0', borderTopColor: '#3A6B35' }}
            />
          </div>
        ) : errorTables ? (
          <div
            className="p-4 rounded-xl border text-center"
            style={{ backgroundColor: '#FEF2F2', borderColor: '#FECACA', color: '#DC2626' }}
          >
            Failed to load tables. Please refresh the page.
          </div>
        ) : tables.length === 0 ? (
          <div
            className="text-center py-20 rounded-2xl border"
            style={{ backgroundColor: '#fff', borderColor: '#C8BAA8' }}
          >
            <QrCode className="w-12 h-12 mx-auto mb-4" style={{ color: '#A8C9A0' }} />
            <p className="text-lg font-medium" style={{ color: '#4A5E47' }}>
              No tables found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tables.map((table) => (
              <div
                key={table.table_id}
                className="rounded-2xl border bg-white overflow-hidden flex flex-col transition-shadow hover:shadow-md"
                style={{ borderColor: '#C8BAA8' }}
              >
                <div className="p-6 flex-1 flex flex-col items-center border-b" style={{ borderColor: '#E8F0E5' }}>
                  <div className="w-full flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold" style={{ color: '#1C2B1A' }}>
                        Table {table.table_number}
                      </h3>
                      <p className="text-sm mt-1" style={{ color: '#6B7F68' }}>
                        Capacity: {table.capacity} persons
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: table.status === 'Free' ? '#E8F0E5' : '#FEF2F2',
                          color: table.status === 'Free' ? '#3A6B35' : '#DC2626',
                          border: `1px solid ${table.status === 'Free' ? '#A8C9A0' : '#FECACA'}`
                        }}
                      >
                        {table.status}
                      </span>
                      <button
                        onClick={() => handleDeleteTable(table.table_id)}
                        className="p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors"
                        title="Delete Table"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl mb-4 bg-white shadow-sm border border-gray-100 flex items-center justify-center">
                    <img
                      src={table.qr_code}
                      alt={`QR Code for Table ${table.table_number}`}
                      className="w-40 h-40 object-contain"
                    />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 flex justify-center">
                  <button
                    onClick={() => handleDownload(table.qr_code, `Table-${table.table_number}`)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-colors w-full justify-center"
                    style={{ backgroundColor: '#3A6B35', color: '#F7F3ED' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2E5529')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3A6B35')}
                  >
                    <Download className="w-4 h-4" />
                    Download QR Code
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Table Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl" style={{ backgroundColor: '#F7F3ED' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold" style={{ color: '#1C2B1A' }}>Add New Table</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-5 h-5" style={{ color: '#4A5E47' }} />
              </button>
            </div>
            <form onSubmit={handleAddTable} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1" style={{ color: '#4A5E47' }}>Table Number</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newTable.table_number}
                  onChange={(e) => setNewTable({ ...newTable, table_number: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border outline-none bg-white"
                  style={{ borderColor: '#C8BAA8', color: '#1C2B1A' }}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1" style={{ color: '#4A5E47' }}>Capacity (Persons)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newTable.capacity}
                  onChange={(e) => setNewTable({ ...newTable, capacity: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border outline-none bg-white"
                  style={{ borderColor: '#C8BAA8', color: '#1C2B1A' }}
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-6 py-2 rounded-xl font-bold border"
                  style={{ borderColor: '#C8BAA8', color: '#4A5E47' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50"
                  style={{ backgroundColor: '#3A6B35', color: '#F7F3ED' }}
                >
                  {isSubmitting ? 'Adding...' : 'Add Table'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
