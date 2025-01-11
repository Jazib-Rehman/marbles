"use client";
import React from "react";
import { 
  MdPerson, 
  MdNotifications, 
  MdSecurity, 
  MdBackup,
  MdLanguage
} from "react-icons/md";

const SettingSection = ({ 
  title, 
  description, 
  icon, 
  children 
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
    <div className="flex items-start gap-4 mb-6">
      <div className="text-[#FF914D] p-2 bg-[#FF914D]/10 rounded-lg">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
    </div>
    <div className="pl-14">
      {children}
    </div>
  </div>
);

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your business preferences</p>
      </div>

      <SettingSection
        title="Business Profile"
        description="Update your business information"
        icon={<MdPerson size={24} />}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              defaultValue="Jehangira Marble"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg"
              defaultValue="contact@jehangiramarble.com"
            />
          </div>
        </div>
      </SettingSection>

      <SettingSection
        title="Notifications"
        description="Configure your notification preferences"
        icon={<MdNotifications size={24} />}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Email Notifications</h4>
              <p className="text-sm text-gray-500">Receive order updates via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF914D]"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">SMS Notifications</h4>
              <p className="text-sm text-gray-500">Get SMS alerts for new orders</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF914D]"></div>
            </label>
          </div>
        </div>
      </SettingSection>

      <SettingSection
        title="Security"
        description="Manage your security settings"
        icon={<MdSecurity size={24} />}
      >
        <button className="bg-[#FF914D] text-white px-4 py-2 rounded-lg hover:bg-[#b16f46] transition-colors">
          Change Password
        </button>
      </SettingSection>

      <SettingSection
        title="Data Management"
        description="Backup and restore your data"
        icon={<MdBackup size={24} />}
      >
        <div className="flex gap-4">
          <button className="bg-[#FF914D] text-white px-4 py-2 rounded-lg hover:bg-[#b16f46] transition-colors">
            Backup Data
          </button>
          <button className="border border-[#FF914D] text-[#FF914D] px-4 py-2 rounded-lg hover:bg-[#FF914D]/10 transition-colors">
            Restore Data
          </button>
        </div>
      </SettingSection>

      <SettingSection
        title="Language & Region"
        description="Set your preferred language and region"
        icon={<MdLanguage size={24} />}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select className="w-full px-3 py-2 border rounded-lg">
              <option>English</option>
              <option>Urdu</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <select className="w-full px-3 py-2 border rounded-lg">
              <option>PKR (₨)</option>
              <option>USD ($)</option>
            </select>
          </div>
        </div>
      </SettingSection>
    </div>
  );
} 