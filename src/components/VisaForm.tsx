import React, { useState, useEffect } from 'react';
import { FileText, Save, Upload, X } from 'lucide-react';
import { supabase, uploadVisaDocument } from '../lib/supabase';
import toast from 'react-hot-toast';
import type { Passport } from '../types/passport';
import type { VisaFormData, VisaDocument } from '../types/visa';

const VisaForm: React.FC = () => {
  const [passports, setPassports] = useState<Passport[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState<VisaDocument[]>([]);
  const [formData, setFormData] = useState<VisaFormData>({
    passport_id: '',
    visa_number: '',
    country: '',
    visa_type: '',
    issue_date: '',
    expiry_date: '',
    notes: '',
    documents: []
  });

  useEffect(() => {
    fetchPassports();
  }, []);

  const fetchPassports = async () => {
    try {
      const { data, error } = await supabase
        .from('passports')
        .select('id, first_name, last_name, passport_number')
        .order('last_name', { ascending: true });

      if (error) throw error;
      setPassports(data || []);
    } catch (err) {
      toast.error('Erreur lors du chargement des passeports');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.passport_id || !formData.visa_number) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      const { data: existingVisa } = await supabase
        .from('visas')
        .select('visa_number')
        .eq('visa_number', formData.visa_number)
        .single();

      if (existingVisa) {
        throw new Error('Ce numéro de visa existe déjà');
      }

      const { error } = await supabase
        .from('visas')
        .insert([{
          ...formData,
          status: 'active',
          documents
        }]);

      if (error) throw error;

      toast.success('Visa enregistré avec succès');
      
      setFormData({
        passport_id: '',
        visa_number: '',
        country: '',
        visa_type: '',
        issue_date: '',
        expiry_date: '',
        notes: '',
        documents: []
      });
      setDocuments([]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de l\'enregistrement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    const maxSize = 10 * 1024 * 1024; // 10MB

    for (const file of files) {
      if (file.size > maxSize) {
        toast.error(`Le fichier ${file.name} dépasse la taille maximale de 10MB`);
        continue;
      }

      try {
        const document = await uploadVisaDocument(file);
        setDocuments(prev => [...prev, document]);
        toast.success(`${file.name} téléchargé avec succès`);
      } catch (err) {
        toast.error(`Erreur lors du téléchargement de ${file.name}`);
      }
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-green-600 to-teal-600">
        <div className="flex items-center justify-center space-x-2">
          <FileText className="h-6 w-6 text-white" />
          <h2 className="text-xl font-bold text-white">Enregistrement de Visa</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Passeport</label>
            <select
              name="passport_id"
              value={formData.passport_id}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            >
              <option value="">Sélectionner un passeport</option>
              {passports.map((passport) => (
                <option key={passport.id} value={passport.id}>
                  {passport.last_name} {passport.first_name} - {passport.passport_number}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Numéro de visa</label>
            <input
              type="text"
              name="visa_number"
              value={formData.visa_number}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Pays</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type de visa</label>
            <select
              name="visa_type"
              value={formData.visa_type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            >
              <option value="">Sélectionner un type</option>
              <option value="tourist">Touriste</option>
              <option value="business">Affaires</option>
              <option value="student">Étudiant</option>
              <option value="work">Travail</option>
              <option value="transit">Transit</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date d'émission</label>
            <input
              type="date"
              name="issue_date"
              value={formData.issue_date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date d'expiration</label>
            <input
              type="date"
              name="expiry_date"
              value={formData.expiry_date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="Informations complémentaires..."
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Documents</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                  <span>Télécharger des fichiers</span>
                  <input
                    type="file"
                    className="sr-only"
                    multiple
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG jusqu'à 10MB</p>
            </div>
          </div>

          {documents.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Documents téléchargés</h4>
              <div className="space-y-2">
                {documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{doc.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VisaForm;