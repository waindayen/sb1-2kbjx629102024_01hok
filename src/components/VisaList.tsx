import React, { useEffect, useState } from 'react';
import { Eye, Edit, Trash2, Search, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Visa } from '../types/visa';

export default function VisaList() {
  const [visas, setVisas] = useState<Visa[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVisa, setSelectedVisa] = useState<Visa | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    fetchVisas();
  }, []);

  const fetchVisas = async () => {
    try {
      const { data, error } = await supabase
        .from('visas')
        .select(`
          *,
          passport:passports(first_name, last_name, passport_number)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVisas(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce visa ?')) return;

    try {
      const { error } = await supabase
        .from('visas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setVisas(visas.filter(visa => visa.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting visa');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const filteredVisas = visas.filter(visa =>
    `${visa.passport?.first_name} ${visa.passport?.last_name} ${visa.visa_number} ${visa.country}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Liste des Visas</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titulaire</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Visa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pays</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVisas.map((visa) => (
                <tr key={visa.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {visa.passport?.last_name} {visa.passport?.first_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {visa.passport?.passport_number}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{visa.visa_number}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{visa.country}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{visa.visa_type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(visa.status)}`}>
                      {visa.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(visa.expiry_date).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => {
                          setSelectedVisa(visa);
                          setIsViewModalOpen(true);
                        }}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(visa.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Affichage de <span className="font-medium">{filteredVisas.length}</span> visas
            </div>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedVisa && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Détails du Visa</h3>
              <button onClick={() => setIsViewModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Titulaire</p>
                <p className="text-sm text-gray-900">
                  {selectedVisa.passport?.first_name} {selectedVisa.passport?.last_name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Numéro de visa</p>
                <p className="text-sm text-gray-900">{selectedVisa.visa_number}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pays</p>
                <p className="text-sm text-gray-900">{selectedVisa.country}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Type de visa</p>
                <p className="text-sm text-gray-900">{selectedVisa.visa_type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date d'émission</p>
                <p className="text-sm text-gray-900">
                  {new Date(selectedVisa.issue_date).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date d'expiration</p>
                <p className="text-sm text-gray-900">
                  {new Date(selectedVisa.expiry_date).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Statut</p>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(selectedVisa.status)}`}>
                  {selectedVisa.status}
                </span>
              </div>
              {selectedVisa.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Notes</p>
                  <p className="text-sm text-gray-900">{selectedVisa.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}