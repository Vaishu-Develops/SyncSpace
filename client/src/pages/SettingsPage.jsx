import { useState } from 'react';
import { Settings as SettingsIcon, Bell, Lock, Palette, Globe, Shield, Trash2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { Button } from '../components/ui';

const SettingsPage = () => {
    const [settings, setSettings] = useState({
        emailNotifications: true,
        pushNotifications: false,
        taskReminders: true,
        weeklyDigest: true,
        darkMode: true,
        language: 'en',
        timezone: 'UTC',
        twoFactorAuth: false
    });

    const handleToggle = (key) => {
        setSettings(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSave = () => {
        // TODO: Save settings to backend
        console.log('Saving settings:', settings);
        alert('Settings saved successfully!');
    };

    const SettingSection = ({ icon: Icon, title, children }) => (
        <div className="card mb-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
                <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-white">{title}</h2>
            </div>
            {children}
        </div>
    );

    const ToggleSetting = ({ label, description, value, onChange }) => (
        <div className="flex items-center justify-between py-3">
            <div className="flex-1">
                <p className="text-sm font-medium text-white">{label}</p>
                {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
            </div>
            <button
                onClick={onChange}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-primary' : 'bg-slate-700'
                    }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                />
            </button>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-slate-900 text-white">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="h-16 border-b border-slate-700 flex items-center justify-between px-4 md:px-8 glass sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <SettingsIcon className="h-6 w-6 text-primary" />
                        <h1 className="text-2xl font-bold text-white">Settings</h1>
                    </div>
                    <Button variant="primary" onClick={handleSave}>
                        Save Changes
                    </Button>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <div className="max-w-4xl mx-auto">
                        {/* Notifications */}
                        <SettingSection icon={Bell} title="Notifications">
                            <div className="space-y-1">
                                <ToggleSetting
                                    label="Email Notifications"
                                    description="Receive email updates about your tasks and projects"
                                    value={settings.emailNotifications}
                                    onChange={() => handleToggle('emailNotifications')}
                                />
                                <ToggleSetting
                                    label="Push Notifications"
                                    description="Get browser notifications for important updates"
                                    value={settings.pushNotifications}
                                    onChange={() => handleToggle('pushNotifications')}
                                />
                                <ToggleSetting
                                    label="Task Reminders"
                                    description="Receive reminders for upcoming task deadlines"
                                    value={settings.taskReminders}
                                    onChange={() => handleToggle('taskReminders')}
                                />
                                <ToggleSetting
                                    label="Weekly Digest"
                                    description="Get a weekly summary of your activity"
                                    value={settings.weeklyDigest}
                                    onChange={() => handleToggle('weeklyDigest')}
                                />
                            </div>
                        </SettingSection>

                        {/* Appearance */}
                        <SettingSection icon={Palette} title="Appearance">
                            <div className="space-y-4">
                                <ToggleSetting
                                    label="Dark Mode"
                                    description="Use dark theme across the application"
                                    value={settings.darkMode}
                                    onChange={() => handleToggle('darkMode')}
                                />
                            </div>
                        </SettingSection>

                        {/* Language & Region */}
                        <SettingSection icon={Globe} title="Language & Region">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Language
                                    </label>
                                    <select
                                        value={settings.language}
                                        onChange={(e) => handleChange('language', e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="en">English</option>
                                        <option value="es">Spanish</option>
                                        <option value="fr">French</option>
                                        <option value="de">German</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Timezone
                                    </label>
                                    <select
                                        value={settings.timezone}
                                        onChange={(e) => handleChange('timezone', e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="UTC">UTC (Coordinated Universal Time)</option>
                                        <option value="America/New_York">Eastern Time (ET)</option>
                                        <option value="America/Chicago">Central Time (CT)</option>
                                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                        <option value="Europe/London">London (GMT)</option>
                                        <option value="Asia/Kolkata">India (IST)</option>
                                    </select>
                                </div>
                            </div>
                        </SettingSection>

                        {/* Security */}
                        <SettingSection icon={Shield} title="Security">
                            <div className="space-y-4">
                                <ToggleSetting
                                    label="Two-Factor Authentication"
                                    description="Add an extra layer of security to your account"
                                    value={settings.twoFactorAuth}
                                    onChange={() => handleToggle('twoFactorAuth')}
                                />
                                <div className="pt-4 border-t border-slate-700">
                                    <Button variant="secondary" icon={<Lock className="h-4 w-4" />}>
                                        Change Password
                                    </Button>
                                </div>
                            </div>
                        </SettingSection>

                        {/* Danger Zone */}
                        <div className="card border-danger/50">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-danger/30">
                                <div className="h-10 w-10 rounded-lg bg-danger/20 flex items-center justify-center">
                                    <Trash2 className="h-5 w-5 text-danger" />
                                </div>
                                <h2 className="text-xl font-semibold text-white">Danger Zone</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-white">Delete Account</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Permanently delete your account and all associated data
                                        </p>
                                    </div>
                                    <Button
                                        variant="danger"
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                                                console.log('Delete account');
                                            }
                                        }}
                                    >
                                        Delete Account
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SettingsPage;
