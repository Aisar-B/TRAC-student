import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCopy, FaCheckCircle, FaEnvelope, FaPhone, FaHome, FaList } from 'react-icons/fa';
import { SCHOOL, OFFICE, SYSTEM } from '../../config/trac.config';
import Toast from '../components/Toast';

export default function Submitted() {
  const location = useLocation();
  const navigate = useNavigate();
  const request = location.state || {};
  const [contactEmail, setContactEmail] = useState(SCHOOL.contact.email);
  const [officeHours, setOfficeHours] = useState(OFFICE.schedule.full);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchPublicSettings = async () => {
      try {
        const response = await fetch(`${SYSTEM.apiBaseUrl}/public/settings`);
        if (response.ok) {
          const data = await response.json();
          if (data.contact_email) setContactEmail(data.contact_email);
          if (data.office_hours) setOfficeHours(data.office_hours);
        }
      } catch {
        console.warn('Using default contact information');
      }
    };
    fetchPublicSettings();
  }, []);

  const queueNumber = request.queue_number;
  const showQueueCard = queueNumber && queueNumber !== '—';

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast({ type: 'success', message: 'Copied to clipboard.' });
    } catch {
      setToast({ type: 'error', message: 'Could not copy to clipboard.' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F1F8E9]/30 to-white p-4">
      <Toast type={toast?.type} message={toast?.message} onDismiss={() => setToast(null)} />
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] rounded-full mb-4 shadow-lg">
            <FaCheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1B5E20] to-[#F9A825] bg-clip-text text-transparent">
            Request Submitted!
          </h1>
          <p className="text-gray-500 mt-2">Your request has been received and is now in queue at {SCHOOL.shortName}.</p>
        </div>

        {/* Success Alert */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-[#1B5E20]" />
            </div>
            <div>
              <p className="font-medium text-[#1B5E20]">Request submitted successfully!</p>
              <p className="text-sm text-green-700 mt-1">
                You will receive <strong>Email notifications</strong> for status updates at {contactEmail}.
              </p>
            </div>
          </div>
        </div>

        {/* QUEUE NUMBER CARD */}
        {showQueueCard && (
          <div className="relative mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-[#F1F8E9] via-white to-[#FFF8E1] border border-green-100 shadow-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#DCEDC8] rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#FFECB3] rounded-full -ml-12 -mb-12 opacity-50"></div>

            <div className="relative p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] rounded-full mb-4 shadow-md">
                <FaList className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Your Queue Number</h3>
              <p className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] mb-2">
                #{queueNumber}
              </p>
              <p className="text-sm text-gray-600">
                You are <span className="font-semibold text-[#1B5E20]">#{queueNumber}</span> in line for today at {SCHOOL.shortName}
              </p>
            </div>
          </div>
        )}

        {/* Request Summary Card */}
        <div className="bg-white rounded-xl shadow-sm border border-green-100 mb-6 overflow-hidden">
          <div className="border-b border-green-50 bg-[#F1F8E9]/50 px-6 py-4">
            <h3 className="font-semibold text-gray-800">Request Summary - {SCHOOL.shortName}</h3>
          </div>

          <div className="p-6 space-y-5">
            <div className="bg-[#F1F8E9]/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Tracking Code</p>
                  <p className="font-mono font-medium text-gray-800">{request.tracking_code || 'REQ-20260331-001'}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(request.tracking_code || 'REQ-20260331-001')}
                  className="p-2 text-gray-400 hover:text-[#1B5E20] hover:bg-green-50 rounded-lg transition"
                  title="Copy Tracking Code"
                >
                  <FaCopy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">Use this code to check your request status</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Document Type</p>
                <p className="font-medium text-gray-800">{request.request_type || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Purpose</p>
                <p className="font-medium text-gray-800">{request.purpose || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Copies</p>
                <p className="font-medium text-gray-800">{request.copies ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Fee</p>
                <p className="font-bold text-[#1B5E20]">{request.fee || 'Not recorded'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Submitted</p>
                <p className="text-sm text-gray-700">{formatDate(request.date_submitted) || 'Mar 31, 2026, 10:30 AM'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Est. Completion</p>
                <p className="text-sm font-medium text-[#1B5E20]">{request.estimated_completion || 'Apr 6, 2026'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-xl shadow-sm border border-green-100 mb-6 overflow-hidden">
          <div className="border-b border-green-50 bg-[#F1F8E9]/50 px-6 py-4">
            <h3 className="font-semibold text-gray-800">Next Steps - {SCHOOL.shortName} Process</h3>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-800">Wait for Email Notification</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    You will receive an <strong>email</strong> when your request status changes. First-come, first-served.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-800">Payment at Cashier</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Proceed to the Cashier's Office for payment. Bring your Request ID.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-800">Pickup at Registrar</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Bring your official receipt and valid ID when picking up. {OFFICE.schedule.closedNote}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Need Assistance */}
        <div className="bg-gradient-to-r from-[#F1F8E9] to-[#FFF8E1] rounded-xl p-5 border border-green-100 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Need Assistance? - {SCHOOL.shortName}</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <FaEnvelope className="text-[#1B5E20] w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium">{contactEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <FaPhone className="text-[#F9A825] w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm font-medium">{SCHOOL.contact.phone}</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4 pt-3 border-t border-green-100">
            Office Hours: {officeHours}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white rounded-xl font-medium hover:shadow-lg transition flex items-center justify-center gap-2"
          >
            <FaHome className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => navigate(`/track/${request.tracking_code || 'REQ-20260331-001'}`)}
            className="flex-1 px-6 py-3 border border-green-200 bg-white text-gray-700 rounded-xl font-medium hover:bg-green-50 transition"
          >
            Track Status
          </button>
        </div>
      </div>
    </div>
  );
}
