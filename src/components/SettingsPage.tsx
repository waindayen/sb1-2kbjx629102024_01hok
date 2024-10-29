import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Settings, Shield, Bell } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import PaymentSettings from './settings/PaymentSettings';
import SubscriptionSettings from './settings/SubscriptionSettings';
import NotificationSettings from './settings/NotificationSettings';
import SecuritySettings from './settings/SecuritySettings';

type SettingsTab = 'payment' | 'subscription' | 'notifications' | 'security';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('payment');
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'payment', label: 'Paiements', icon: CreditCard },
    { id: 'subscription', label: 'Abonnement', icon: DollarSign },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'payment':
        return <PaymentSettings />;
      case 'subscription':
        return <SubscriptionSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'security':
        return <SecuritySettings />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <div className="sm:flex sm:items-center px-6 py-3">
            <div className="flex items-center">
              <Settings className="h-6 w-6 text-gray-400" />
              <h2 className="ml-3 text-lg font-medium text-gray-900">Paramètres</h2>
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <div className="sm:hidden">
              <select
                id="tabs"
                name="tabs"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as SettingsTab)}
              >
                {tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as SettingsTab)}
                        className={`
                          ${
                            activeTab === tab.id
                              ? 'border-indigo-500 text-indigo-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }
                          group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                        `}
                      >
                        <Icon
                          className={`
                            ${
                              activeTab === tab.id
                                ? 'text-indigo-500'
                                : 'text-gray-400 group-hover:text-gray-500'
                            }
                            -ml-0.5 mr-2 h-5 w-5
                          `}
                        />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;