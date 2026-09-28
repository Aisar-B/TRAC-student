import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import {
  FaUser, FaEnvelope, FaGraduationCap, FaBuilding,
  FaLock, FaEye, FaEyeSlash, FaSave, FaCheckCircle,
  FaExclamationTriangle, FaSpinner, FaEdit, FaTimes,
  FaIdCard, FaUserTag, FaSchool, FaCalendarAlt, FaInfoCircle
  ,FaCamera, FaTrash
} from "react-icons/fa";
import { SCHOOL, DEPARTMENTS, SYSTEM, PROGRAMS } from "../../config/trac.config";

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const dismissMessage = useCallback(() => setMessage({ type: '', text: '' }), []);
  const [academicCatalog, setAcademicCatalog] = useState([]);

  const [profile, setProfile] = useState({
    id_number: '',
    full_name: '',
    email: '',
    course: '',
    year_level: '',
    year_graduated: '',
    department: '',
    role: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    email: '',
    course: '',
    year_level: '',
    year_graduated: '',
    department: ''
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/auth` : `${SYSTEM.apiBaseUrl}/auth`;

  const departments = academicCatalog.length
    ? academicCatalog.map(institute => ({
      code: institute.code,
      name: `${institute.code} - ${institute.name}`,
      fullName: institute.name
    }))
    : DEPARTMENTS;
  const selectedInstitute = academicCatalog.length
    ? academicCatalog.find(institute => institute.code === editData.department)
    : PROGRAMS.institutes.find(institute => institute.code === editData.department);

  const getUserInitials = () => {
    if (!profile.full_name) return '?';
    const nameParts = profile.full_name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return profile.full_name.substring(0, 2).toUpperCase();
  };

  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await fetch(`${API_BASE_URL}/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      const userProfile = data.profile;
      setProfile(userProfile);
      setAvatarPreview(userProfile.avatar_url || '');
      const cachedUser = localStorage.getItem('currentUser');
      if (cachedUser) {
        try {
          const parsed = JSON.parse(cachedUser);
          const currentUser = parsed.user || parsed;
          localStorage.setItem('currentUser', JSON.stringify({
            ...currentUser,
            ...userProfile,
            name: userProfile.full_name
          }));
          window.dispatchEvent(new Event('auth-changed'));
        } catch (cacheError) {
          console.error('Error updating cached user:', cacheError);
        }
      }
      setEditData({
        email: userProfile.email || '',
        course: userProfile.course || '',
        year_level: userProfile.year_level || '',
        year_graduated: userProfile.year_graduated || '',
        department: userProfile.department || ''
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setMessage({ type: 'error', text: 'Failed to load profile' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    let isCurrent = true;
    const fetchAcademicCatalog = async () => {
      try {
        const response = await fetch(`${SYSTEM.apiBaseUrl}/public/settings`);
        if (!response.ok) return;
        const data = await response.json();
        if (isCurrent && Array.isArray(data.academic_settings)) setAcademicCatalog(data.academic_settings);
      } catch {
        console.warn('Using default institute names in Profile');
      }
    };
    fetchAcademicCatalog();
    return () => { isCurrent = false; };
  }, []);

  const handleEditChange = (field, value) => {
    if (field === 'department') {
      const institute = academicCatalog.find(item => item.code === value) || PROGRAMS.institutes.find(item => item.code === value);
      const hasCurrentCourse = institute?.programs?.some(program => program.name === editData.course);
      setEditData(prev => ({ ...prev, department: value, course: hasCurrentCourse ? prev.course : '' }));
      return;
    }
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setMessage({ type: 'error', text: 'Please choose a JPG, PNG, or WebP image.' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Profile photos must be 5 MB or smaller.' });
      return;
    }

    setAvatarPreview(URL.createObjectURL(file));
    setAvatarLoading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await fetch(`${API_BASE_URL}/profile/avatar`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
        body: formData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update profile photo');
      await fetchProfile();
      setMessage({ type: 'success', text: 'Profile photo updated successfully.' });
    } catch (err) {
      setAvatarPreview(profile.avatar_url || '');
      setMessage({ type: 'error', text: err.message });
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleAvatarDelete = async () => {
    if (!window.confirm('Remove your profile photo?')) return;
    setAvatarLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/profile/avatar`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to remove profile photo');
      await fetchProfile();
      setMessage({ type: 'success', text: 'Profile photo removed.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update profile');
      setProfile(prev => ({ ...prev, ...data.profile }));
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to change password');
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } finally {
      setPasswordLoading(false);
    }
  };

  const yearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: 45 }, (_, i) => currentYear - i);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F1F8E9]/30 to-white py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-8"></div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F1F8E9]/30 to-white py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Toast type={message.type} message={message.text} onDismiss={dismissMessage} />

        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-28 h-28 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] rounded-full flex items-center justify-center shadow-lg overflow-hidden">
              {avatarPreview ? <img src={avatarPreview} alt={`${profile.full_name} profile`} className="h-full w-full object-cover" /> : <span className="text-4xl font-bold text-white">{getUserInitials()}</span>}
            </div>
            <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#2E7D32] rounded-full border-4 border-white flex items-center justify-center cursor-pointer hover:bg-[#1B5E20]" title="Update profile photo">
              {avatarLoading ? <FaSpinner className="text-white text-sm animate-spin" /> : <FaCamera className="text-white text-sm" />}
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarUpload} disabled={avatarLoading} />
            </label>
            {avatarPreview && (
              <button type="button" onClick={handleAvatarDelete} disabled={avatarLoading} className="absolute -bottom-2 -left-2 w-8 h-8 bg-white rounded-full border border-red-200 flex items-center justify-center text-red-500 hover:bg-red-50" title="Remove profile photo">
                <FaTrash className="text-xs" />
              </button>
            )}
            <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" aria-label="Verified account" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">{profile.full_name}</h1>
          <p className="text-gray-500 capitalize">{profile.role} • {SCHOOL.shortName}</p>
          <p className="text-xs text-gray-400 mt-1">{SCHOOL.fullName}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-green-50 bg-gradient-to-r from-[#F1F8E9] to-white">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaUser className="text-[#1B5E20]" />
                Personal Information
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#1B5E20] hover:bg-[#1B5E20]/10 rounded-lg transition"
                >
                  <FaEdit />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {!isEditing ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <FaIdCard className="text-gray-400 mt-1" />
                    <div>
                      <label className="block text-xs text-gray-500 uppercase tracking-wider">Student ID</label>
                      <p className="text-gray-900 font-medium mt-1">{profile.id_number}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaUserTag className="text-gray-400 mt-1" />
                    <div>
                      <label className="block text-xs text-gray-500 uppercase tracking-wider">Full Name</label>
                      <p className="text-gray-900 font-medium mt-1">{profile.full_name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaSchool className="text-gray-400 mt-1" />
                    <div>
                      <label className="block text-xs text-gray-500 uppercase tracking-wider">Institute</label>
                      <p className="text-gray-900 font-medium mt-1">{departments.find(d => d.code === profile.department)?.name || profile.department || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-green-50 my-6"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <FaEnvelope className="text-gray-400 mt-1" />
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 uppercase tracking-wider">Email Address</label>
                      <p className="text-gray-900 mt-1 break-all">{profile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaGraduationCap className="text-gray-400 mt-1" />
                    <div>
                      <label className="block text-xs text-gray-500 uppercase tracking-wider">Course</label>
                      <p className="text-gray-900 mt-1">{profile.course || 'N/A'}</p>
                    </div>
                  </div>
                  {profile.role === 'student' && (
                    <div className="flex items-start gap-3">
                      <FaBuilding className="text-gray-400 mt-1" />
                      <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wider">Year Level</label>
                        <p className="text-gray-900 mt-1">{profile.year_level || 'N/A'}</p>
                      </div>
                    </div>
                  )}
                  {profile.role === 'alumni' && (
                    <div className="flex items-start gap-3">
                      <FaCalendarAlt className="text-gray-400 mt-1" />
                      <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wider">Year Graduated</label>
                        <p className="text-gray-900 mt-1">{profile.year_graduated || 'N/A'}</p>
                      </div>
                    </div>
                  )}
                </div>


              </>
            ) : (
              <div className="space-y-5">
                <div className="bg-[#F1F8E9] border border-green-100 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider mb-1"><FaIdCard /> Student ID</div>
                      <p className="text-gray-900 font-medium">{profile.id_number}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider mb-1"><FaUserTag /> Full Name</div>
                      <p className="text-gray-900 font-medium">{profile.full_name}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input type="email" value={editData.email} onChange={(e) => handleEditChange('email', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent outline-none transition" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Institute / Department</label>
                  <select value={editData.department} onChange={(e) => handleEditChange('department', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent outline-none transition">
                    <option value="">Select Institute</option>
                    {editData.department && !departments.some(dept => dept.code === editData.department) && (
                      <option value={editData.department}>{editData.department} (current value)</option>
                    )}
                    {departments.map(dept => (<option key={dept.code} value={dept.code}>{dept.name}</option>))}
                  </select>
                  <p className="mt-2 text-xs text-amber-600 flex items-center gap-1"><FaInfoCircle className="w-3 h-3" />Changing your institute may affect your pending requests.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                  <select value={editData.course} onChange={(e) => handleEditChange('course', e.target.value)} disabled={!editData.department} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent outline-none transition disabled:bg-gray-100">
                    <option value="">Select Course</option>
                    {editData.course && !selectedInstitute?.programs?.some(program => program.name === editData.course) && (
                      <option value={editData.course}>{editData.course} (current value)</option>
                    )}
                    {(selectedInstitute?.programs || []).map(program => (
                      <option key={program.code} value={program.name}>{program.name}</option>
                    ))}
                  </select>
                </div>

                {profile.role === 'student' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year Level</label>
                    <select value={editData.year_level} onChange={(e) => handleEditChange('year_level', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent outline-none transition">
                      <option value="">Select Year Level</option>
                      {yearLevels.map(level => (<option key={level} value={level}>{level}</option>))}
                    </select>
                  </div>
                )}

                {profile.role === 'alumni' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year Graduated</label>
                    <select value={editData.year_graduated} onChange={(e) => handleEditChange('year_graduated', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent outline-none transition">
                      <option value="">Select Year Graduated</option>
                      {graduationYears.map(year => (<option key={year} value={year}>{year}</option>))}
                    </select>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button onClick={handleSaveProfile} disabled={saving} className="trac-button flex items-center gap-2 rounded-lg px-6 py-2.5 font-medium">
                    {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}{saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition flex items-center gap-2"><FaTimes />Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-green-50 bg-gradient-to-r from-[#F1F8E9] to-white">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2"><FaLock className="text-[#1B5E20]" />Security</h2>
              <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="text-sm text-[#1B5E20] hover:underline">{showPasswordForm ? 'Cancel' : 'Change Password'}</button>
            </div>
          </div>

          {showPasswordForm && (
            <div className="p-6">
              <form onSubmit={handlePasswordChange} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <input type={showCurrentPassword ? "text" : "password"} value={passwordData.currentPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent outline-none transition pr-10" required />
                    <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">{showCurrentPassword ? <FaEyeSlash /> : <FaEye />}</button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <input type={showNewPassword ? "text" : "password"} value={passwordData.newPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent outline-none transition pr-10" required />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">{showNewPassword ? <FaEyeSlash /> : <FaEye />}</button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className="text-green-600">✓ At least 8 characters</span>
                    <span className="text-green-600">✓ Uppercase & lowercase</span>
                    <span className="text-green-600">✓ Number & special character</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input type={showConfirmPassword ? "text" : "password"} value={passwordData.confirmPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent outline-none transition pr-10" required />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</button>
                  </div>
                </div>
                <button type="submit" disabled={passwordLoading} className="trac-button w-full rounded-lg py-2.5 font-medium">
                  {passwordLoading ? <FaSpinner className="animate-spin mx-auto" /> : 'Update Password'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
