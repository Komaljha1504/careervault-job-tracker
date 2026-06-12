import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  ExternalLink,
  MapPin,
  Calendar,
  X,
  FileText,
  Link as LinkIcon,
  BookOpen,
} from 'lucide-react';
const Jobs = () => {
  const [searchParams] = useSearchParams();
  // State for jobs
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get('status') || 'All'
  );

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedJobId, setSelectedJobId] = useState(null);

  // Form values
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [dateApplied, setDateApplied] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [status, setStatus] = useState('Applied');
  const [jobUrl, setJobUrl] = useState('');
  const [resume, setResume] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  const { showToast } = useToast();

  const statuses = [
    'Applied',
    'Phone Screen',
    'Interview',
    'Offer',
    'Rejected',
  ];

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/jobs', {
        params: {
          search: search || undefined,
          status: statusFilter,
          page,
          limit: 10,
        },
      });
      setJobs(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setTotalJobs(response.data.pagination.totalJobs);
      setError('');
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to retrieve job applications.');
      showToast('Could not load job applications.', 'error');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  useEffect(() => {
    fetchJobs();
  }, [page, search, statusFilter]);

  // Open modal for Create
  const handleOpenCreateModal = () => {
    setModalMode('create');
    setCompanyName('');
    setJobTitle('');
    setLocation('');
    setDateApplied(new Date().toISOString().split('T')[0]);
    setInterviewDate('');
    setStatus('Applied');
    setJobUrl('');
    setNotes('');
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (job) => {
    setModalMode('edit');
    setSelectedJobId(job._id);
    setCompanyName(job.companyName);
    setJobTitle(job.jobTitle);
    setLocation(job.location || '');
    setDateApplied(new Date(job.dateApplied).toISOString().split('T')[0]);
    setInterviewDate(
      job.interviewDate
        ? new Date(job.interviewDate).toISOString().split('T')[0]
        : ''
    );
    setStatus(job.status);
    setJobUrl(job.jobUrl || '');
    setNotes(job.notes || '');
    setFormError('');
    setIsModalOpen(true);
  };

  // Submit Handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!companyName || !jobTitle) {
      return setFormError('Company Name and Job Title are required.');
    }

    const jobData = {
      companyName,
      jobTitle,
      location,
      dateApplied,
      interviewDate,
      status,
      jobUrl,
      resume,
      notes,
    };

    try {
      if (modalMode === 'create') {
        await api.post('/jobs', jobData);
        showToast(`Logged application at ${companyName}!`, 'success');
      } else {
        await api.put(`/jobs/${selectedJobId}`, jobData);
        showToast(`Updated application at ${companyName}.`, 'success');
      }
      setIsModalOpen(false);
      fetchJobs();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error saving job application.';
      setFormError(msg);
      showToast(msg, 'error');
    }
  };

  // Delete Handler
  const handleDeleteJob = async (id, company) => {
    if (window.confirm(`Are you sure you want to delete the job application for ${company}?`)) {
      try {
        await api.delete(`/jobs/${id}`);
        showToast(`Deleted application at ${company}.`, 'success');
        fetchJobs();
      } catch (err) {
        showToast('Failed to delete job application.', 'error');
      }
    }
  };

  // Format date helper
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get status class for style mapping
  const getStatusClass = (statusVal) => {
    switch (statusVal) {
      case 'Applied': return 'status-badge-applied';
      case 'Phone Screen': return 'status-badge-phone-screen';
      case 'Interview': return 'status-badge-interview';
      case 'Offer': return 'status-badge-offer';
      case 'Rejected': return 'status-badge-rejected';
      default: return 'bg-slate-100 text-slate-600 border border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F172A] font-display">Job Applications</h1>
          <p className="mt-1 text-sm text-slate-500 font-medium font-sans">
            Track interview rounds, dates, and maintain your professional history.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#243B53] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1a2d40] shadow-sm transition-all duration-200"
        >
          <Plus className="h-4.5 w-4.5" />
          Add Application
        </button>
      </div>

      {/* Modern Floating Search Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-[0_2px_8px_rgba(15,23,42,0.01)] space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by company name or job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-[#0F172A] text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all duration-200"
          />
        </div>

        {/* Modern Segmented Control Filters */}
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-100">
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${statusFilter === 'All'
              ? 'bg-[#243B53] text-white border-transparent shadow-sm'
              : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50'
              }`}
          >
            All Statuses
          </button>
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${statusFilter === s
                ? 'bg-[#243B53] text-white border-transparent shadow-sm'
                : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50'
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Main Jobs List / Workspace */}
      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-100 p-4 text-sm text-rose-600 font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="shimmer-bg h-20 border border-slate-200 p-4 flex flex-col justify-between bg-white shadow-sm">
              <div className="flex justify-between items-center w-full">
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 bg-slate-200 rounded-lg"></div>
                  <div className="h-3 w-48 bg-slate-250 rounded-lg"></div>
                </div>
                <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="premium-card rounded-3xl p-12 text-center border border-slate-200 bg-white shadow-sm">
          <FileText className="h-10 w-10 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 font-display">No applications match filter</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
            Try resetting your search query or status filters to explore logged jobs.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {/* Card-row based grid layout for unified desktop/mobile responsiveness */}
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_2px_8px_rgba(15,23,42,0.01)] hover:border-slate-300 hover:shadow-[0_8px_20px_rgba(15,23,42,0.03)] hover:translate-y-[-1px] transition-all duration-200"
            >
              {/* Left Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3.5 flex-wrap sm:flex-nowrap">
                  <h3 className="text-base font-extrabold text-[#0F172A] truncate font-display leading-snug">
                    {job.companyName}
                  </h3>
                  <span className={`${getStatusClass(job.status)} shrink-0`}>
                    {job.status}
                  </span>
                </div>
                <p className="text-sm font-semibold text-[#243B53] mt-1 truncate">
                  {job.jobTitle}
                </p>

                {/* Secondary data strip */}
                <div className="flex items-center gap-4 text-xs text-slate-400 font-medium mt-3.5 pt-3.5 border-t border-slate-100 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>Applied on {formatDate(job.dateApplied)}</span>
                  </div>
                  {job.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Elements */}
              <div className="flex items-center justify-between sm:justify-end gap-3.5 pt-4 sm:pt-0 border-t border-slate-100 sm:border-0">
                <div>
                  {job.jobUrl ? (
                    <a
                      href={job.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-600 font-bold bg-blue-50 hover:bg-blue-100/60 px-3.5 py-2 rounded-xl border border-blue-100/30 transition-all duration-200"
                    >
                      <span>Posting</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-300 font-semibold select-none">No Link</span>
                  )}
                  {job.resume && (
                    <a
                      href={job.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-green-600 hover:text-green-700 font-bold bg-green-50 hover:bg-green-100/60 px-3.5 py-2 rounded-xl transition-all duration-200"
                    >
                      <span>Resume</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(job)}
                    className="rounded-xl border border-slate-200/80 bg-white p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job._id, job.companyName)}
                    className="rounded-xl border border-rose-100 bg-rose-50/10 p-2.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all duration-200 shadow-sm"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-[0_2px_8px_rgba(15,23,42,0.01)]">
              <span className="text-xs text-slate-500 font-medium">
                Showing <span className="font-bold text-slate-700 font-number">{jobs.length}</span> of{' '}
                <span className="font-bold text-slate-700 font-number">{totalJobs}</span> applications
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="rounded-xl bg-white border border-slate-200 p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-40 transition shadow-sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs font-bold text-slate-600 px-2.5">
                  Page <span className="text-blue-500 font-number">{page}</span> of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="rounded-xl bg-white border border-slate-200 p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-40 transition shadow-sm"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Slide-over Drawer Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-2xl relative animate-slide-up">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-6 top-6 rounded-xl p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-800 border border-slate-200 transition"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Title */}
            <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-tight font-display">
              {modalMode === 'create' ? 'Add Application' : 'Edit Application'}
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Log details to configure your interview pipeline.
            </p>

            {formError && (
              <div className="mt-4 rounded-xl bg-rose-50 border border-rose-100/50 p-4 text-xs text-rose-600 font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-6 mt-6">

              {/* SECTION 1: Role Overview */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                  <span>Role Overview</span>
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Company Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Google"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="premium-input"
                    />
                  </div>

                  {/* Job Title */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Frontend Developer"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="premium-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Location */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Remote, Hybrid, NY"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="premium-input"
                    />
                  </div>

                  {/* Date Applied */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Date Applied
                    </label>
                    <input
                      type="date"
                      value={dateApplied}
                      onChange={(e) => setDateApplied(e.target.value)}
                      className="premium-input cursor-pointer text-[#0F172A]"
                    />
                  </div>
                </div>
              </div>
              {/* Interview Date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Interview Date
                </label>

                <input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="premium-input cursor-pointer text-[#0F172A]"
                />
              </div>
              {/* SECTION 2: Pipeline Details */}
              <div className="border-t border-slate-100 pt-4 space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <LinkIcon className="h-3.5 w-3.5 text-slate-400" />
                  <span>Pipeline & URL</span>
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Status */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="premium-input cursor-pointer bg-white"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Job URL */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Job Posting URL
                    </label>

                    <input
                      type="url"
                      placeholder="e.g. https://careers.company.com/..."
                      value={jobUrl}
                      onChange={(e) => setJobUrl(e.target.value)}
                      className="premium-input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-600 mb-2">
                      Resume URL
                    </label>

                    <input
                      type="url"
                      placeholder="e.g. Google Drive Resume Link"
                      value={resume}
                      onChange={(e) => setResume(e.target.value)}
                      className="premium-input"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: Notes & Logs */}
              <div className="border-t border-slate-100 pt-4 space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                  <span>Notes & logs</span>
                </h3>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Interview Logs & compensation details
                  </label>
                  <textarea
                    placeholder="Recruiter contact info, interview timeline logs, compensation targets..."
                    rows="3"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="premium-input resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3.5 pt-5 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#243B53] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#1a2d40] shadow-sm transition"
                >
                  {modalMode === 'create' ? 'Add Application' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
