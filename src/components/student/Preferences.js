// src/components/student/Preferences.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // أو fetch


const Preferences = () => {
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [minStipend, setMinStipend] = useState(19000);
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [selectedTheme, setSelectedTheme] = useState('light');
    const [notificationFrequency, setNotificationFrequency] = useState('daily');
    const [loading, setLoading] = useState(false);

    // جلب التفضيلات عند تحميل الصفحة
    useEffect(() => {
        fetchPreferences();
    }, []);

    const fetchPreferences = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/student/preferences', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            
            if (data.success && data.settings) {
                setSelectedLocations(data.settings.preferences?.preferredLocations || []);
                setSelectedTypes(data.settings.preferences?.internshipTypes || ['remote', 'part-time', 'full-time']);
                setMinStipend(data.settings.preferences?.minStipend || 0);
                setSelectedLanguage(data.settings.preferences?.language || 'en');
                setSelectedTheme(data.settings.preferences?.theme || 'light');
                setNotificationFrequency(data.settings.preferences?.notificationFrequency || 'daily');
            }
        } catch (error) {
            console.error('Error fetching preferences:', error);
        }
    };

    const savePreferences = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch('http://localhost:5000/api/student/preferences', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    preferredLocations: selectedLocations,
                    internshipTypes: selectedTypes,
                    minStipend: minStipend,
                    language: selectedLanguage,
                    theme: selectedTheme,
                    notificationFrequency: notificationFrequency
                })
            });

            const data = await response.json();
            
            if (data.success) {
                // حفظ محلياً أيضاً
                localStorage.setItem('studentPreferences', JSON.stringify({
                    preferredLocations: selectedLocations,
                    internshipTypes: selectedTypes,
                    minStipend: minStipend,
                    language: selectedLanguage,
                    theme: selectedTheme,
                    notificationFrequency: notificationFrequency
                }));
                
                alert('Preferences saved successfully!');
            }
        } catch (error) {
            console.error('Error saving preferences:', error);
            alert('Error saving preferences');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="preferences-container">
            <h2>Preferences</h2>
            
            {/* Preferred Locations */}
            <div className="form-group">
                <label>Preferred Locations</label>
                <div className="checkbox-group">
                    {['Algiers', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Remote', 'Any'].map(loc => (
                        <label key={loc}>
                            <input
                                type="checkbox"
                                value={loc}
                                checked={selectedLocations.includes(loc)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedLocations([...selectedLocations, loc]);
                                    } else {
                                        setSelectedLocations(selectedLocations.filter(l => l !== loc));
                                    }
                                }}
                            />
                            {loc}
                        </label>
                    ))}
                </div>
            </div>

            {/* Internship Types */}
            <div className="form-group">
                <label>Internship Types</label>
                <div className="checkbox-group">
                    {['remote', 'part-time', 'full-time', 'hybrid', 'project'].map(type => (
                        <label key={type}>
                            <input
                                type="checkbox"
                                value={type}
                                checked={selectedTypes.includes(type)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedTypes([...selectedTypes, type]);
                                    } else {
                                        setSelectedTypes(selectedTypes.filter(t => t !== type));
                                    }
                                }}
                            />
                            {type}
                        </label>
                    ))}
                </div>
            </div>

            {/* Minimum Stipend */}
            <div className="form-group">
                <label>Minimum Stipend Preference: {minStipend} DZD/month</label>
                <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={minStipend}
                    onChange={(e) => setMinStipend(parseInt(e.target.value))}
                />
            </div>

            {/* Language */}
            <div className="form-group">
                <label>Language</label>
                <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="ar">Arabic</option>
                </select>
            </div>

            {/* Theme */}
            <div className="form-group">
                <label>Theme</label>
                <select value={selectedTheme} onChange={(e) => setSelectedTheme(e.target.value)}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                </select>
            </div>

            {/* Notification Frequency */}
            <div className="form-group">
                <label>Notification Frequency</label>
                <select value={notificationFrequency} onChange={(e) => setNotificationFrequency(e.target.value)}>
                    <option value="instant">Instant</option>
                    <option value="daily">Daily Digest</option>
                    <option value="weekly">Weekly</option>
                </select>
            </div>

            <button onClick={savePreferences} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
    );
};

export default Preferences;