import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Send,
  CalendarCheck,
  Award,
  XCircle,
  Clock,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [jobs, setJobs] = useState([]);
  const upcomingInterviews = jobs.filter(
    (job) =>
      job.interviewDate &&
      new Date(job.interviewDate) >= new Date()
  );

  const nearestInterview = upcomingInterviews.sort(
    (a, b) =>
      new Date(a.interviewDate) - new Date(b.interviewDate)
  )[0];
  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/jobs/stats');
      setStats(response.data.stats);
      const jobsResponse = await api.get('/jobs');
      console.log("Jobs API:", jobsResponse.data);

      if (Array.isArray(jobsResponse.data)) {
        setJobs(jobsResponse.data);
      } else if (Array.isArray(jobsResponse.data.data)) {
        setJobs(jobsResponse.data.data);
      } else {
        setJobs([]);
      }
      const activeChartData = response.data.chartData.filter(item => item.value > 0);
      setChartData(activeChartData);
      setError('');
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard statistics.');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // 1. Loading Skeletons
  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Banner Skeleton */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="h-9 w-48 bg-slate-200 rounded-2xl"></div>
            <div className="h-4 w-72 bg-slate-200/80 rounded-xl"></div>
          </div>
          <div className="h-10 w-36 bg-slate-200 rounded-2xl"></div>
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="shimmer-bg h-32 p-5 flex flex-col justify-between border border-slate-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="h-3.5 w-16 bg-slate-200 rounded-lg"></div>
                <div className="h-8 w-8 bg-slate-200 rounded-xl"></div>
              </div>
              <div>
                <div className="h-8 w-10 bg-slate-200 rounded-xl"></div>
                <div className="h-2.5 w-20 bg-slate-200 rounded mt-2"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 mt-8">
          <div className="shimmer-bg h-96 lg:col-span-7 border border-slate-200 p-6 bg-white">
            <div className="h-5 w-40 bg-slate-200 rounded-xl mb-4"></div>
            <div className="h-3 w-60 bg-slate-200 rounded mb-8"></div>
            <div className="h-60 w-full bg-slate-200/50 rounded-2xl"></div>
          </div>
          <div className="shimmer-bg h-96 lg:col-span-5 border border-slate-200 p-6 bg-white">
            <div className="h-5 w-32 bg-slate-200 rounded-xl mb-4"></div>
            <div className="h-3 w-48 bg-slate-200 rounded mb-8"></div>
            <div className="h-60 w-full bg-slate-200/50 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="premium-card border-rose-200 rounded-3xl p-8 text-center text-rose-600 max-w-md mx-auto mt-12 shadow-md">
        <p className="font-semibold text-base">{error}</p>
        <button
          onClick={fetchStats}
          className="mt-5 px-5 py-2.5 bg-[#243B53] text-white rounded-xl hover:bg-[#1a2d40] text-xs font-semibold tracking-wide transition shadow-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Colors mapping based on CareerVault Premium identity specs
  const STATUS_CONFIG = {
    'Total': { color: '#243B53', icon: Briefcase, bg: 'bg-[#243B53]/5', text: 'text-[#243B53]', border: 'border-[#243B53]/15' },
    'Applied': { color: '#3B82F6', icon: Send, bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
    'Phone Screen': { color: '#6366F1', icon: Clock, bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100' },
    'Interview': { color: '#F59E0B', icon: CalendarCheck, bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
    'Offer': { color: '#10B981', icon: Award, bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
    'Rejected': { color: '#EF4444', icon: XCircle, bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100' }
  };

  // Custom tooltips (Notion/Stripe style)
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const config = STATUS_CONFIG[data.name] || { color: '#243B53' };
      return (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-lg text-xs">
          <div className="flex items-center gap-2.5 font-bold">
            <div className="h-2 w-2 rounded-full shadow-sm" style={{ backgroundColor: config.color }}></div>
            <span className="text-slate-800">{data.name}</span>
          </div>
          <p className="mt-1 text-slate-500 font-medium">
            Applications: <span className="font-extrabold text-slate-900">{data.value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const offerRate = stats.Total > 0 ? ((stats.Offer / stats.Total) * 100).toFixed(0) : 0;
  const interviewRate = stats.Total > 0 ? (((stats.Interview + stats['Phone Screen']) / stats.Total) * 100).toFixed(0) : 0;

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F172A] dark:text-whites m:text-4xl font-display">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500 font-medium">
            Analyze and monitor your recruitment metrics.
          </p>
        </div>

        {/* Metric badge */}
        <div className="flex items-center gap-2.5 self-start rounded-2xl bg-blue-50 border border-blue-100 px-4 py-2.5 text-xs font-semibold text-blue-700 shadow-sm">
          <TrendingUp className="h-4 w-4 text-blue-600" />
          <span>Interview rate: {interviewRate}%</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {/* Total Card */}
        <div
          onClick={() => {
            console.log('TOTAL CLICKED');
            navigate('/jobs');
          }}
          className="premium-card premium-card-hover flex flex-col justify-between h-32 bg-white dark:bg-slate-800 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total</span>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-2 text-slate-600 dark:text-white border border-slate-200/80 dark:border-slate-600">
              <Briefcase className="h-4 w-4 text-slate-600 dark:text-slate-200" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-[#0F172A] dark:text-white dark:text-white leading-none tracking-tight font-number">{stats.Total}</h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-300 font-bold mt-1.5 uppercase tracking-wider">Logged jobs</p>
          </div>
        </div>

        {/* Applied Card */}
        <div
          onClick={() => {
            navigate('/jobs?status=Applied');
          }}
          className="premium-card premium-card-hover flex flex-col justify-between h-32 bg-white dark:bg-slate-800 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Applied</span>
            <div className="rounded-xl bg-blue-50 dark:bg-blue-900/40 p-2 text-blue-600 dark:text-blue-300 border border-blue-100/50 dark:border-blue-700">
              <Send className="h-4 w-4 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-[#0F172A] dark:text-white leading-none tracking-tight font-number">{stats.Applied}</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-wider">Review pending</p>
          </div>
        </div>

        {/* Interview Card */}
        <div
          onClick={() => {
            navigate('/jobs?status=Interview');
          }}
          className="premium-card premium-card-hover flex flex-col justify-between h-32 bg-white dark:bg-slate-800 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Interviews</span>
            <div className="rounded-xl bg-amber-50 dark:bg-amber-900/40 p-2 text-amber-600 dark:text-amber-300 border border-amber-100/50">
              <CalendarCheck className="h-4 w-4 text-amber-600 dark:text-amber-300" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-[#0F172A] dark:text-white leading-none tracking-tight font-number">
              {stats.Interview + stats['Phone Screen']}
            </h3>
            <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-wider">Scheduled calls</p>
          </div>
        </div>

        {/* Offer Card */}
        <div
          onClick={() => {
            navigate('/jobs?status=Offer');
          }}
          className="premium-card premium-card-hover flex flex-col justify-between h-32 bg-white dark:bg-slate-800 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Offers</span>
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/40 p-2 text-emerald-600 dark:text-emerald-300 border border-emerald-100/50">
              <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-[#0F172A] dark:text-white leading-none tracking-tight font-number">{stats.Offer}</h3>
            <p className="text-[10px] text-emerald-600 font-bold mt-1.5 uppercase tracking-wider">Success rate: {offerRate}%</p>
          </div>
        </div>
        {/* Upcoming Interviews Card */}
        <div className="premium-card premium-card-hover flex flex-col justify-between h-32 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Upcoming
            </span>

            <div className="rounded-xl bg-purple-50 p-2 text-purple-600 border border-purple-100/50">
              <CalendarCheck className="h-4 w-4 text-purple-600 dark:text-purple-300" />
            </div>
          </div>

          <div>
            <h3 className="text-3xl font-extrabold text-[#0F172A] dark:text-white leading-none tracking-tight font-number">
              {stats.Interview}
            </h3>

            <p className="text-[10px] text-purple-600 font-bold mt-1.5 uppercase tracking-wider">
              Interviews Scheduled
            </p>
          </div>
        </div>

        {/* Rejected Card */}
        <div
          onClick={() => {
            navigate('/jobs?status=Rejected');
          }}
          className="premium-card premium-card-hover flex flex-col justify-between h-32 bg-white dark:bg-slate-800 col-span-2 sm:col-span-1 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rejected</span>
            <div className="rounded-xl bg-rose-50 p-2 text-rose-600 border border-rose-100/50">
              <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-300" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-[#0F172A] dark:text-white leading-none tracking-tight font-number">{stats.Rejected}</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-wider">Unsuccessful</p>
          </div>
        </div>
      </div>
      {nearestInterview && (
        <div className="premium-card rounded-3xl p-6 border border-amber-200 bg-amber-50 mb-6">
          <h3 className="text-lg font-bold text-amber-800 mb-2">
            📅 Upcoming Interview
          </h3>

          <p className="text-amber-700 font-semibold">
            {nearestInterview.companyName}
          </p>

          <p className="text-sm text-amber-600">
            {nearestInterview.jobTitle}
          </p>

          <p className="text-sm text-amber-600 mt-2">
            Interview on{" "}
            {new Date(
              nearestInterview.interviewDate
            ).toLocaleDateString()}
          </p>
        </div>
      )}
      {/* Recent Activity */}
      <div className="premium-card rounded-3xl p-6 border border-slate-200/80 bg-white dark:bg-slate-800 mb-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Recent Activity
        </h3>

        <div className="space-y-3">
          {jobs
            .slice()
            .reverse()
            .slice(0, 5)
            .map((job) => (
              <div
                key={job._id}
                className="flex justify-between items-center border-b border-slate-100 pb-3"
              >
                <div>
                  <p className="font-semibold text-slate-800">
                    {job.companyName}
                  </p>

                  <p className="text-sm text-slate-500">
                    {job.jobTitle}
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600">
                  {job.status}
                </span>
              </div>
            ))}
        </div>
      </div>
      {/* Charts / Empty State Section */}
      {stats.Total === 0 ? (
        <div className="premium-card rounded-3xl p-12 text-center border border-slate-200/80 max-w-xl mx-auto bg-white dark:bg-slate-800 shadow-sm mt-8 animate-fade-in">
          <Briefcase className="h-10 w-10 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 font-display">Your journey starts with one application.</h3>
          <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
            Logging applications is the first step toward landing your next dream role. Go ahead and add a job to begin tracking metrics!
          </p>
        </div>
      ) : (

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Bar Chart Panel */}
          <div className="premium-card rounded-3xl p-6 border border-slate-200/80 lg:col-span-7 flex flex-col bg-white">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900 leading-none font-display">Status Funnel</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Breakdown distribution counts across recruitment phases.</p>
            </div>
            <div className="h-80 w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(15,23,42,0.01)' }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => {
                      const config = STATUS_CONFIG[entry.name] || { color: '#243B53' };
                      return <Cell key={`cell-${index}`} fill={config.color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart Panel */}
          <div className="premium-card rounded-3xl p-6 border border-slate-200/80 lg:col-span-5 flex flex-col bg-white">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900 leading-none font-display">Share Ratios</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Percentage distribution of each pipeline stage.</p>
            </div>
            <div className="h-80 w-full flex-1 flex flex-col justify-center items-center">
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => {
                        const config = STATUS_CONFIG[entry.name] || { color: '#243B53' };
                        return <Cell key={`cell-${index}`} fill={config.color} />;
                      })}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legends */}
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-2 max-w-sm">
                {chartData.map((entry, index) => {
                  const config = STATUS_CONFIG[entry.name] || { color: '#243B53' };
                  const percentage = ((entry.value / stats.Total) * 100).toFixed(0);
                  return (
                    <div key={index} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                      <div className="h-2 w-2 rounded-full shadow-sm" style={{ backgroundColor: config.color }}></div>
                      <span>{entry.name}</span>
                      <span className="font-extrabold text-slate-900 font-number">({percentage}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
