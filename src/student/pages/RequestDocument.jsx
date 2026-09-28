import Card from '../components/Card'
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaInfoCircle,
  FaClock,
  FaEnvelope,
  FaBuilding,
  FaFileAlt,
  FaFileSignature,
  FaCheckCircle,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaSpinner,
  FaUserGraduate,
  FaUserTie,
  FaWifi,
  FaPhoneAlt
} from 'react-icons/fa'
import { SCHOOL, OFFICE, SYSTEM } from '../../config/trac.config'

const toRequestItem = (doc) => {
  const category = doc.category === 'Forms' ? 'Form' : doc.category
  const fee = Number(doc.fee ?? 0)
  const feeUnit = doc.feeUnit || doc.fee_unit || 'per_copy'
  const unitLabel = feeUnit === 'per_page' ? 'per page' : feeUnit === 'per_subject' ? 'per subject' : 'per copy'

  return {
    value: doc.name || doc.label,
    label: doc.label || doc.name,
    days: Number(doc.processing_days),
    fee,
    feeUnit,
    feeDisplay: `₱${fee.toFixed(2)} ${unitLabel}`,
    allowedRoles: Array.isArray(doc.allowedRoles) ? doc.allowedRoles : [],
    allowsMultiple: doc.allowsMultiple ?? category === 'Document',
    multipleLabel: doc.multipleLabel || (feeUnit === 'per_page' ? 'page' : feeUnit === 'per_subject' ? 'subject' : null),
    category,
    active: doc.active !== false
  }
}

export default function RequestDocument() {
  const [formData, setFormData] = useState({
    category: '',
    request_type: '',
    purpose: '',
    copies: 1
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [authError, setAuthError] = useState(false)
  const [networkError, setNetworkError] = useState(false)
  const [settingsError, setSettingsError] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const nav = useNavigate()

  const [maxCopies, setMaxCopies] = useState(SYSTEM.requests.maxCopies)
  const [officeHours, setOfficeHours] = useState(OFFICE.schedule.display)
  const [contactEmail, setContactEmail] = useState(SCHOOL.contact.email)
  const [dynamicDocuments, setDynamicDocuments] = useState([])
  const [dynamicForms, setDynamicForms] = useState([])
  const [requirePurpose, setRequirePurpose] = useState(true)
  const [settingsLoading, setSettingsLoading] = useState(true)

  const API_BASE_URL = SYSTEM.apiBaseUrl

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setCurrentUser(user)
      } catch (error) {
        console.error('Error parsing user:', error)
      }
    }
  }, [])

  useEffect(() => {
    const fetchPublicSettings = async () => {
      setSettingsLoading(true)
      setSettingsError('')
      try {
        const response = await fetch(`${API_BASE_URL}/public/settings`)
        if (!response.ok) throw new Error('Request catalog is currently unavailable. Please try again later.')
        const data = await response.json()
        if (data.office_hours) setOfficeHours(data.office_hours)
        if (data.contact_email) setContactEmail(data.contact_email)
        const items = Array.isArray(data.document_settings)
          ? data.document_settings.map(toRequestItem).filter(item => item.value && item.active)
          : []
        if (!items.length) throw new Error('No request types are currently available. Please contact the Registrar’s Office.')
        setMaxCopies(Number(data.max_copies_per_request) || SYSTEM.requests.maxCopies)
        setRequirePurpose(data.require_purpose !== false)
        setDynamicDocuments(items.filter(item => item.category === 'Document'))
        setDynamicForms(items.filter(item => item.category === 'Form'))
      } catch (error) {
        setDynamicDocuments([])
        setDynamicForms([])
        setSettingsError(error.message || 'Request catalog is currently unavailable. Please try again later.')
      } finally {
        setSettingsLoading(false)
      }
    }
    fetchPublicSettings()
  }, [API_BASE_URL])

  const documentTypes = useMemo(() => {
    if (!currentUser) return []
    return dynamicDocuments.filter(doc =>
      doc.allowedRoles.includes(currentUser.role)
    )
  }, [currentUser, dynamicDocuments])

  const formTypes = useMemo(() => {
    if (!currentUser) return []
    return dynamicForms.filter(form =>
      form.allowedRoles.includes(currentUser.role)
    )
  }, [currentUser, dynamicForms])

  const requestTypes = useMemo(() => [...documentTypes, ...formTypes], [documentTypes, formTypes])

  const requestCategories = useMemo(() => {
    return [
      ...(documentTypes.length > 0 ? ['Document'] : []),
      ...(formTypes.length > 0 ? ['Form'] : [])
    ]
  }, [documentTypes, formTypes])

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const user = localStorage.getItem('currentUser')
    if (!token || !user) {
      setAuthError(true)
      setSubmitError('You are not logged in. Please sign in to make requests.')
    } else {
      setAuthError(false)
      setNetworkError(false)
    }
  }, [])

  const getAuthToken = () => localStorage.getItem('authToken')

  const submitRequest = async (requestData) => {
    const token = getAuthToken()
    if (!token) throw new Error('AUTH_NO_TOKEN')
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)
    const response = await fetch(`${API_BASE_URL}/requests/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(requestData),
      signal: controller.signal
    })
    clearTimeout(timeoutId)
    const data = await response.json()
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) throw new Error('AUTH_FAILED')
      if (response.status === 0 || response.status === 500) throw new Error('SERVER_ERROR')
      throw new Error(data.message || data.error || 'Failed to submit request')
    }
    return data
  }

  const handleInputChange = (field, value) => {
    if (field === 'category') {
      setFormData(prev => ({ ...prev, [field]: value, request_type: '', copies: 1 }))
    } else if (field === 'copies') {
      setFormData(prev => ({ ...prev, [field]: parseInt(value) || 1 }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
    if (errors[field]) {
      setErrors(prev => { const newErrors = { ...prev }; delete newErrors[field]; return newErrors })
    }
    if (submitError) { setSubmitError(''); setNetworkError(false) }
  }

  const handleDocumentSelect = (e) => handleInputChange('request_type', e.target.value)

  const validateForm = () => {
    const newErrors = {}
    if (!formData.category) newErrors.category = 'Select request type.'
    if (!formData.request_type) newErrors.request_type = 'Select a document or form.'
    if (requirePurpose && !formData.purpose.trim()) newErrors.purpose = 'Purpose is required.'
    if (!formData.copies || formData.copies < 1) newErrors.copies = 'Invalid number of copies.'
    if (formData.copies > maxCopies) newErrors.copies = `Maximum ${maxCopies} copies allowed.`

    const selectedItem = requestTypes.find(item => item.value === formData.request_type)
    if (selectedItem?.category === 'Form') {
      if (!selectedItem.allowsMultiple && formData.copies > 1) {
        newErrors.copies = 'This form only allows 1 copy.'
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const getSelectedItem = useMemo(() => {
    return requestTypes.find(item => item.category === formData.category && item.value === formData.request_type)
  }, [formData.category, formData.request_type, requestTypes])

  const allowsMultipleCopies = useMemo(() => {
    if (!getSelectedItem) return false
    return Boolean(getSelectedItem.allowsMultiple)
  }, [getSelectedItem])

  const calculateTotalFee = useMemo(() => {
    if (!getSelectedItem) return '₱0.00'
    const total = getSelectedItem.fee * formData.copies
    return `₱${total.toFixed(2)}`
  }, [getSelectedItem, formData.copies])

  const getEstimatedCompletionDate = useMemo(() => {
    if (!getSelectedItem) return null
    let daysToAdd = getSelectedItem.days
    let currentDate = new Date()
    let workingDaysAdded = 0
    while (workingDaysAdded < daysToAdd) {
      currentDate.setDate(currentDate.getDate() + 1)
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) workingDaysAdded++
    }
    return {
      formatted: currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    }
  }, [getSelectedItem])

  const handleAuthError = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('currentUser')
    nav('/', { state: { error: 'Your session has expired. Please login again.' } })
  }

  const copiesArray = useMemo(() => {
    return Array.from({ length: maxCopies }, (_, i) => i + 1)
  }, [maxCopies])

  const processingRange = (items) => {
    const days = items.map(item => item.days).filter(Number.isInteger).sort((left, right) => left - right)
    if (!days.length) return 'Not available'
    if (days[0] === days[days.length - 1]) return `${days[0]} working day(s)`
    return `${days[0]}-${days[days.length - 1]} working days`
  }

  async function submit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')
    setAuthError(false)
    setNetworkError(false)
    if (!validateForm()) { setIsSubmitting(false); return }

    try {
      const requestData = {
        category: getSelectedItem?.category,
        request_type: formData.request_type,
        purpose: formData.purpose?.trim() || 'Not specified',
        copies: formData.copies
      }
      const response = await submitRequest(requestData)

      const successData = {
        request_id: response.request_id,
        request_type: response.request_type,
        purpose: response.purpose,
        date_submitted: response.date_submitted,
        copies: response.copies,
        estimated_completion: response.estimated_completion?.formatted || getEstimatedCompletionDate?.formatted,
        tracking_code: response.tracking_code,
        display_name: getSelectedItem?.label || formData.request_type,
        category: getSelectedItem?.category,
        fee: calculateTotalFee,
        queue_number: response.queue_number
      }
      localStorage.setItem('currentRequest', JSON.stringify(successData))
      nav('/submitted', { state: successData })

    } catch (error) {
      if (error.message === 'AUTH_NO_TOKEN') { setAuthError(true); setSubmitError('You are not logged in.') }
      else if (error.message === 'AUTH_FAILED') { setAuthError(true); setSubmitError('Session expired.'); localStorage.removeItem('authToken') }
      else if (error.message === 'NETWORK_ERROR') { setNetworkError(true); setSubmitError('Network error.') }
      else if (error.message === 'SERVER_ERROR') { setNetworkError(true); setSubmitError('Server error.') }
      else { setSubmitError(error.message || 'Failed to submit.') }
    } finally {
      setIsSubmitting(false)
    }
  }

  const RoleBadge = () => {
    if (!currentUser) return null
    return (
      <div className={`inline-flex items-center gap-2 px-5 py-1.5 rounded-full text-sm font-bold ${
        currentUser.role === 'student'
          ? 'bg-[#1B5E20] text-white'
          : 'bg-[#F9A825] text-white'
      }`}>
        {currentUser.role === 'student' ? <FaUserGraduate /> : <FaUserTie />}
        <span>{currentUser.role === 'student' ? 'Student' : 'Alumni'}</span>
      </div>
    )
  }

  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#1B5E20] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[600px] space-y-6 px-4 py-8 bg-[#fafafa] min-h-screen">

      {/* Header Mimicking the Mock UI */}
      <div className="mb-8">


        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-[2.2rem] font-black leading-tight">
            <span className="text-[#1B5E20]">Document</span>
            <span className="text-[#1B5E20]">/</span>
            <span className="text-[#F9A825]">Form</span>
            <span className="text-[#1e293b]"> Request</span>
          </h1>
          <RoleBadge />
        </div>
      </div>

      {authError && (
        <div className="mx-auto mb-4">
          <div className="flex items-start gap-4 rounded-xl border border-red-200 bg-red-50 p-6">
            <FaExclamationTriangle className="mt-1 text-xl text-red-600" />
            <div>
              <h3 className="text-lg font-bold text-red-800">Authentication Required</h3>
              <p className="text-red-700">{submitError || 'Please sign in to submit requests.'}</p>
              <button onClick={handleAuthError} className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm text-white font-bold">Go to Login</button>
            </div>
          </div>
        </div>
      )}

      {networkError && (
        <div className="mx-auto mb-4">
          <div className="flex items-start gap-4 rounded-xl border border-orange-200 bg-orange-50 p-6">
            <FaWifi className="mt-1 text-xl text-orange-600" />
            <div>
              <h3 className="text-lg font-bold text-orange-800">Connection Error</h3>
              <p className="text-orange-700">{submitError}</p>
            </div>
          </div>
        </div>
      )}

      {settingsError && (
        <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <FaExclamationTriangle className="mr-2 inline" />{settingsError}
        </div>
      )}

      {!authError && !networkError && submitError && (
        <div className="mx-auto mb-4">
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <FaExclamationTriangle className="mt-0.5 text-red-600" />
            <p className="text-sm text-red-700">{submitError}</p>
          </div>
        </div>
      )}

      {/* Main Request Form Card */}
      <Card className="rounded-[1.5rem] border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <form className="space-y-6" onSubmit={submit}>
          <div>
            <h3 className="mb-6 text-xl font-black text-[#1e293b]">Request Details</h3>

            {/* Category Selection */}
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-gray-500">Category</label>
              <div className="grid gap-4 sm:grid-cols-2">
                {requestCategories.map(requestCategory => {
                  const isForm = requestCategory === 'Form'
                  const selected = formData.category === requestCategory

                  const subtext = isForm ? 'Clearance, Graduation' : 'Transcripts, Certificates'

                  return (
                    <button
                      key={requestCategory}
                      type="button"
                      onClick={() => handleInputChange('category', requestCategory)}
                      disabled={authError || isSubmitting || networkError || Boolean(settingsError)}
                      className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200
                        ${selected
                          ? (isForm
                              ? 'border-[#F9A825] bg-white shadow-sm'
                              : 'border-[#1B5E20] bg-[#f2f8f3] shadow-sm')
                          : 'border-gray-100 bg-white hover:border-gray-200'}
                        ${(authError || isSubmitting || networkError) ? 'cursor-not-allowed opacity-60' : ''}`}
                    >
                      <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-full
                        ${selected
                          ? (isForm ? 'bg-[#F9A825] text-white' : 'bg-[#1B5E20] text-white')
                          : 'bg-[#f1f5f9] text-gray-400'}`}>
                        {isForm ? <FaFileSignature className="text-2xl" /> : <FaFileAlt className="text-2xl" />}
                      </div>
                      <div className="text-lg font-black text-[#1e293b]">{isForm ? 'Form' : 'Document'}</div>
                      <div className="mt-1 text-xs text-gray-400">{subtext}</div>

                      {selected && (
                        <div className="mt-4 h-5">
                          <FaCheckCircle className={`text-xl ${isForm ? 'text-[#F9A825]' : 'text-[#1B5E20]'}`} />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
              {errors.category && <p className="mt-2 text-sm text-red-600"><FaExclamationTriangle className="mr-1 inline" />{errors.category}</p>}
            </div>

            {/* Document Select */}
            {formData.category && (
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-500">
                  {formData.category === 'Document' ? 'Select Document' : 'Select Form'}
                </label>
                <select
                  value={formData.request_type || ''}
                  onChange={handleDocumentSelect}
                  disabled={authError || isSubmitting || networkError || requestTypes.filter(item => item.category === formData.category).length === 0}
                  className={`w-full rounded-xl border p-3.5 text-[0.95rem] outline-none transition-colors
                    ${errors.request_type ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white focus:border-[#1B5E20]'}`}
                >
                  <option value="" disabled className="text-gray-400">Choose a request...</option>
                  {requestTypes.filter(item => item.category === formData.category).map(item => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
                {errors.request_type && <p className="mt-2 text-sm text-red-600"><FaExclamationTriangle className="mr-1 inline" />{errors.request_type}</p>}
              </div>
            )}

            {/* Copies and Fee Layout */}
            {formData.request_type && (
              <div className="mb-6 flex items-end justify-between gap-4">
                <div className="flex-1">
                  <label className="mb-2 block text-sm font-medium text-gray-500">
                    {formData.request_type && allowsMultipleCopies
                      ? (getSelectedItem?.multipleLabel ? `Number of ${getSelectedItem.multipleLabel}s` : 'Number of Copies')
                      : 'Number of Copies'}
                  </label>
                  <select
                    value={formData.copies}
                    onChange={(e) => handleInputChange('copies', e.target.value)}
                    disabled={authError || isSubmitting || networkError || !allowsMultipleCopies}
                    className="w-full rounded-xl border border-gray-300 bg-white p-3.5 text-[0.95rem] outline-none focus:border-[#1B5E20] disabled:opacity-50 disabled:bg-gray-50"
                  >
                    {copiesArray.map(num => (
                      <option key={num} value={num}>{num} {num > 1 ? 'copies' : 'copy'}</option>
                    ))}
                  </select>
                  {errors.copies && <p className="mt-2 text-sm text-red-600"><FaExclamationTriangle className="mr-1 inline" />{errors.copies}</p>}
                </div>

                <div className="pb-1 text-right min-w-[100px]">
                  <div className="text-[0.8rem] text-gray-500 font-medium mb-1">Total Fee:</div>
                  <div className="text-2xl font-black text-[#1B5E20] leading-none">{calculateTotalFee}</div>
                </div>
              </div>
            )}

            {/* Selected Item Detail Box (Mock style) */}
            {formData.request_type && getSelectedItem && (
              <div className="mb-6 rounded-[1rem] border border-[#e8e4d9] bg-[#fdfcf5] p-5">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="text-lg font-black text-[#1e293b] leading-tight pr-2">{getSelectedItem.label}</div>
                  <span className={`shrink-0 inline-flex items-center justify-center rounded-full px-3 py-1 text-[0.7rem] font-bold text-white uppercase tracking-wider
                    ${getSelectedItem.category === 'Document' ? 'bg-[#3b8341]' : 'bg-[#F9A825]'}`}>
                    {getSelectedItem.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-[0.85rem] text-gray-700 mb-3">
                  <div>
                    <FaClock className="mr-2 inline text-[#3b8341]" />
                    Processing: <span className="font-bold">{getSelectedItem.days} day(s)</span>
                  </div>
                  <div>
                    <FaMoneyBillWave className="mr-2 inline text-[#3b8341]" />
                    Fee: <span className="font-bold">{getSelectedItem.feeDisplay}</span>
                  </div>
                </div>

                {getEstimatedCompletionDate && (
                  <div className="mt-3 border-t border-[#e8e4d9] pt-3 text-[0.85rem] text-gray-600">
                    <FaCalendarAlt className="mr-2 inline text-[#f5a623]" />
                    Estimated: <span className="font-bold text-[#3b8341]">{getEstimatedCompletionDate.formatted}</span>
                  </div>
                )}
              </div>
            )}

            {formData.request_type && getSelectedItem?.category === 'Form' && !allowsMultipleCopies && (
              <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <FaInfoCircle className="mr-2 inline" />This form is issued as a single copy only.
              </div>
            )}

            {/* Purpose Textarea */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-500">
                Purpose <span className="text-[0.7rem] font-normal">({requirePurpose ? 'Required' : 'Optional'})</span>
              </label>
              <textarea
                value={formData.purpose}
                onChange={(e) => handleInputChange('purpose', e.target.value)}
                disabled={authError || isSubmitting || networkError}
                rows={3}
                className="w-full resize-none rounded-xl border border-gray-300 bg-white p-3 text-[0.95rem] outline-none focus:border-[#1B5E20] disabled:opacity-50"
              />
              {errors.purpose && <p className="mt-2 text-sm text-red-600"><FaExclamationTriangle className="mr-1 inline" />{errors.purpose}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={authError || isSubmitting || networkError || Boolean(settingsError) || !formData.category || !formData.request_type}
              className="w-full rounded-xl bg-[#1B5E20] py-4 text-center text-[1.05rem] font-bold text-white transition hover:bg-[#154d19] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? <><FaSpinner className="mr-2 inline animate-spin" />Submitting...</> : 'Submit Request'}
            </button>

            {/* Pickup Required Alert */}
            <div className="mt-5 rounded-xl border border-[#c3dec7] bg-[#f2f9f3] p-4 text-[0.85rem] text-[#1B5E20] flex items-center gap-3">
              <FaBuilding className="shrink-0 text-lg" />
              <div><strong>Office Pickup Required</strong> — Bring valid ID and receipt.</div>
            </div>
          </div>
        </form>
      </Card>

      {/* Processing Info Card */}
      <Card className="rounded-[1.5rem] border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h4 className="mb-5 text-xl font-black text-[#1e293b]">Processing Info</h4>

        <div className="space-y-3 text-[0.85rem] text-gray-600 mb-6">
          <div className="flex items-start gap-3">
            <FaClock className="mt-0.5 shrink-0 text-[#3b8341] text-base" />
            <div>
              <div>Documents: {processingRange(documentTypes)}</div>
              <div>Forms: {processingRange(formTypes)}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaEnvelope className="shrink-0 text-[#f5a623] text-base" />
            <span>Email notifications for status updates</span>
          </div>
          <div className="flex items-center gap-3">
            <FaBuilding className="shrink-0 text-[#3b8341] text-base" />
            <span>Pickup at Registrar's Office</span>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-5 text-[0.85rem] text-gray-500 space-y-1 mb-6">
           <div className="flex"><strong className="text-gray-700 w-24 shrink-0">Office Hours:</strong> 8:00 AM - 11:45 AM <span className="ml-1 text-red-500">(Cut-off)</span></div>
           <div className="ml-24">1:30 PM - 5:00 PM <span className="ml-1 text-[#3b8341]">(Resume)</span></div>
        </div>

        <div className="border-t border-gray-100 pt-5">
           <strong className="text-gray-800 text-[0.9rem] block mb-3 font-bold">Required for Pickup:</strong>
           <ul className="text-[0.85rem] text-gray-600 space-y-2 list-disc pl-5 marker:text-gray-300">
             <li>Valid ID</li>
             <li>Official Receipt</li>
             <li>Authorization Letter (if representative)</li>
           </ul>
        </div>
      </Card>

      {/* Office Hours Card */}
      <Card className="rounded-[1.5rem] border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h4 className="mb-5 text-xl font-black text-[#1e293b]">Office Hours</h4>

        <div className="space-y-3 text-[0.9rem]">
          <div className="font-bold text-[#1B5E20] whitespace-pre-line">{officeHours}</div>
        </div>

        <div className="border-t border-gray-100 pt-5 mt-6 space-y-3 text-[0.85rem] text-gray-500">
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-[#3b8341] text-base" />
            <span>{contactEmail}</span>
          </div>
          <div className="flex items-center gap-3">
            <FaPhoneAlt className="text-[#3b8341] text-base" />
            <span>{SCHOOL.contact.phone}</span>
          </div>
        </div>
      </Card>

    </div>
  )
}