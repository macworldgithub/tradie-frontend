import { useState, useEffect } from "react";
import {
  Building2,
  Users,
  Phone,
  ChevronRight,
  CheckCircle2,
  XCircle,
  LayoutDashboard,

  Search,
  LogOut,
  Filter,
  Activity,
  Plus,
  Sliders,
  ShieldAlert,
  Save,
  Menu,
  X,
  Mail,
  Calendar,
  Clock,
  Smartphone,
  ShieldCheck,
  CreditCard
} from "lucide-react";
import logo from "../assets/logo.png";
import { adminService } from "../services/adminService";

export default function AdminPanel({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'companies' | 'tradies' | 'dids' | 'settings'>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Data States
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter] = useState("all");

  // Detail Modal States
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [companyDetails, setCompanyDetails] = useState<any | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  // Add Tradie Form States
  const [showAddTradieForm, setShowAddTradieForm] = useState(false);
  const [tradieName, setTradieName] = useState("");
  const [tradiePhone, setTradiePhone] = useState("");
  const [tradieEmail, setTradieEmail] = useState("");
  const [tradieNotifPref, setTradieNotifPref] = useState("both");
  const [tradieCallMode, setTradieCallMode] = useState("geo");
  const [isAddingTradie, setIsAddingTradie] = useState(false);
  const [addTradieError, setAddTradieError] = useState<string | null>(null);

  // Allocate DID Form States
  const [showAllocateDidForm, setShowAllocateDidForm] = useState(false);
  const [didNumber, setDidNumber] = useState("");
  const [didTradieId, setDidTradieId] = useState("");
  const [isAllocatingDid, setIsAllocatingDid] = useState(false);
  const [allocateDidError, setAllocateDidError] = useState<string | null>(null);
  const [isMappingTradie, setIsMappingTradie] = useState(false);
  const [mappingTradieId, setMappingTradieId] = useState<string | null>(null);
  const [mapTradieError, setMapTradieError] = useState<string | null>(null);

  // Delete Company State
  const [isDeletingCompany, setIsDeletingCompany] = useState(false);
  const [deleteCompanyError, setDeleteCompanyError] = useState<string | null>(null);

  // Settings State
  const [settings, setSettings] = useState({
    defaultVoiceModel: "mia-v2-turbo",
    recordingEnabled: true,
    twillioTrunk: "AC88b901a1f11e9b2512a843e9",
    billingAlertThreshold: 150,
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Fetch Companies on Mount & Token Change
  const fetchCompanies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminService.getCompanies(token);
      if (Array.isArray(data)) {
        setCompanies(data);
      } else {
        setCompanies([]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load companies list");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [token]);

  // Fetch Company Details
  const handleViewDetails = async (companyId: string) => {
    setSelectedCompanyId(companyId);
    setIsDetailsModalOpen(true);
    setIsLoadingDetails(true);
    setDetailsError(null);
    setCompanyDetails(null);

    try {
      const details = await adminService.getCompanyDetails(companyId, token);
      setCompanyDetails(details);
    } catch (err: any) {
      setDetailsError(err.message || "Failed to fetch company details");
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Add Tradie Submission
  const handleAddTradie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompanyId) return;
    setIsAddingTradie(true);
    setAddTradieError(null);

    const payload = {
      name: tradieName,
      phoneNumber: tradiePhone,
      email: tradieEmail,
      notificationPreference: tradieNotifPref,
      callMode: tradieCallMode
    };

    try {
      await adminService.addTradie(selectedCompanyId, payload, token);

      // Reset form & states
      setTradieName("");
      setTradiePhone("");
      setTradieEmail("");
      setTradieNotifPref("both");
      setTradieCallMode("geo");
      setShowAddTradieForm(false);

      // Refresh details and company list
      await handleViewDetails(selectedCompanyId);
      await fetchCompanies();
    } catch (err: any) {
      setAddTradieError(err.message || "Failed to add tradie");
    } finally {
      setIsAddingTradie(false);
    }
  };

  // Allocate DID Submission
  const handleAllocateDid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompanyId) return;
    setIsAllocatingDid(true);
    setAllocateDidError(null);

    const payload = {
      didNumber,
      tradieId: didTradieId
    };

    try {
      await adminService.allocateDid(selectedCompanyId, payload, token);

      // Reset form & states
      setDidNumber("");
      setDidTradieId("");
      setShowAllocateDidForm(false);

      // Refresh details and company list
      await handleViewDetails(selectedCompanyId);
      await fetchCompanies();
    } catch (err: any) {
      setAllocateDidError(err.message || "Failed to allocate DID");
    } finally {
      setIsAllocatingDid(false);
    }
  };

  const handleMapTradie = async (tradieId: string) => {
    if (!selectedCompanyId || !companyDetails?.did?.didNumber) return;

    const confirmed = window.confirm("Do you want to map this tradie to the company's DID?");
    if (!confirmed) return;

    setMapTradieError(null);
    setMappingTradieId(tradieId);
    setIsMappingTradie(true);

    try {
      const payload = {
        companyId: selectedCompanyId,
        didNumber: companyDetails.did.didNumber,
        tradieId,
      };

      await adminService.allocateDid(selectedCompanyId, payload, token);
      await handleViewDetails(selectedCompanyId);
      await fetchCompanies();
    } catch (err: any) {
      setMapTradieError(err.message || "Failed to map tradie to DID");
    } finally {
      setIsMappingTradie(false);
      setMappingTradieId(null);
    }
  };

  // Delete Company Submission
  const handleDeleteCompany = async () => {
    if (!selectedCompanyId) return;

    if (!window.confirm("Are you sure you want to delete this company? This action cannot be undone.")) {
      return;
    }

    setIsDeletingCompany(true);
    setDeleteCompanyError(null);

    try {
      await adminService.deleteCompany(selectedCompanyId, token);

      // Close modal and refresh companies list
      setIsDetailsModalOpen(false);
      await fetchCompanies();
    } catch (err: any) {
      setDeleteCompanyError(err.message || "Failed to delete company");
    } finally {
      setIsDeletingCompany(false);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // Aggregated Stats based on API data
  const totalCompanies = companies.length;
  const totalTradies = companies.reduce((acc, c) => acc + (c.tradieCount || 0), 0);
  const totalDids = companies.filter(c => c.didNumber).length;

  // Flattened DIDs list from loaded companies
  const activeDids = companies
    .filter(c => c.didNumber)
    .map(c => ({
      number: c.didNumber,
      companyId: c.companyId,
      companyName: c.companyName,
      status: c.isActive ? 'active' : 'inactive',
      daysRemaining: c.daysRemaining
    }));

  // Filtered Companies
  const filteredCompanies = companies.filter(c => {
    const matchesSearch =
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.didNumber && c.didNumber.includes(searchQuery));

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && c.isActive) ||
      (statusFilter === "inactive" && !c.isActive);

    const matchesPayment =
      paymentFilter === "all" ||
      (paymentFilter === "paid" && c.hasPaid) ||
      (paymentFilter === "unpaid" && c.hasPaid === false);

    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Filtered DIDs
  const filteredDids = activeDids.filter(d =>
    d.number.includes(searchQuery) ||
    d.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#03070b] text-white flex flex-col md:flex-row relative">

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#090e14] border-b border-white/5 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
          <span className="bg-orange-500 text-black font-black px-2 py-0.5 rounded text-[10px]">ADMIN</span>
        </div>
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="text-zinc-400 hover:text-white p-1"
        >
          {isMobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar - Desktop and Mobile (Drawer) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#090e14] border-r border-white/5 flex flex-col justify-between transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:h-screen shrink-0
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col gap-8 p-6 overflow-y-auto">
          {/* Logo and Pill */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Logo" className="h-16 w-auto" />
            </div>
            <span className="bg-[#f97316] text-black font-black px-2.5 py-0.5 rounded-md text-[10px] tracking-wide">
              SYSTEM ADMIN
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => { setActiveTab('dashboard'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'dashboard'
                ? 'bg-orange-500 text-black'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>

            <button
              onClick={() => { setActiveTab('dids'); setIsMobileSidebarOpen(false); setSearchQuery(""); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'dids'
                ? 'bg-orange-500 text-black'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <Phone size={18} />
              DIDs
            </button>

            {/* <button
              onClick={() => { setActiveTab('settings'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'settings'
                ? 'bg-orange-500 text-black'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <Settings size={18} />
              System Settings
            </button> */}
          </nav>
        </div>

        {/* Profile Card & Logout */}
        <div className="p-6 border-t border-white/5 bg-[#05090e]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center font-bold text-orange-500">
              BF
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white truncate">Burhan Fani</p>
              <p className="text-xs text-zinc-500 truncate">burhanfani92@gmail.com</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 border border-red-500/20 bg-red-500/5 hover:bg-red-500 hover:text-white text-red-500 py-2.5 rounded-xl text-xs font-bold transition-all"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Backdrop for Mobile Sidebar */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Main Content Pane */}
      <main className="flex-1 min-w-0 flex flex-col md:h-screen md:overflow-y-auto">
        <header className="hidden md:flex items-center justify-between px-8 py-6 border-b border-white/5 bg-[#090e14]">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight text-white capitalize">
              {activeTab === 'dids' ? 'DID Management' : activeTab + ' Overview'}
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-zinc-400">
            <button
              onClick={fetchCompanies}
              className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Activity size={14} className="text-emerald-500" />
              Refresh Data Feed
            </button>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
            <span>v1.2.4-stable</span>
          </div>
        </header>

        {/* Inner Content Body */}
        <div className="p-4 sm:p-8 space-y-8 flex-1">

          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-500">

              {/* API Loaders */}
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <span className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : error ? (
                <div className="bg-red-500/10 border border-red-500/25 rounded-2xl p-6 text-center">
                  <ShieldAlert className="text-red-500 mx-auto mb-3" size={32} />
                  <p className="text-sm text-red-400 font-bold">{error}</p>
                  <button
                    onClick={fetchCompanies}
                    className="mt-3 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-bold transition-all"
                  >
                    Retry Connection
                  </button>
                </div>
              ) : (
                <>
                  {/* Stat Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    <div
                      onClick={() => setActiveTab('companies')}
                      className="bg-[#090e14] border border-white/5 hover:border-orange-500/20 cursor-pointer rounded-2xl p-6 relative overflow-hidden group transition-all"
                    >
                      <div className="absolute top-0 right-0 bg-orange-500/5 w-24 h-24 blur-xl rounded-full group-hover:bg-orange-500/10 transition-all" />
                      <div className="flex items-center gap-4 mb-4 relative z-10">
                        <div className="bg-orange-500/10 p-2.5 rounded-xl text-orange-500">
                          <Building2 size={20} />
                        </div>
                        <h3 className="text-zinc-400 font-bold text-sm">Total Companies</h3>
                      </div>
                      <p className="text-3xl font-black text-white relative z-10">{totalCompanies}</p>
                    </div>

                    <div className="bg-[#090e14] border border-white/5 rounded-2xl p-6 relative overflow-hidden group transition-all">
                      <div className="absolute top-0 right-0 bg-orange-500/5 w-24 h-24 blur-xl rounded-full group-hover:bg-orange-500/10 transition-all" />
                      <div className="flex items-center gap-4 mb-4 relative z-10">
                        <div className="bg-orange-500/10 p-2.5 rounded-xl text-orange-500">
                          <Users size={20} />
                        </div>
                        <h3 className="text-zinc-400 font-bold text-sm">Total Tradies</h3>
                      </div>
                      <p className="text-3xl font-black text-white relative z-10">{totalTradies}</p>
                    </div>

                    <div
                      onClick={() => setActiveTab('dids')}
                      className="bg-[#090e14] border border-white/5 hover:border-orange-500/20 cursor-pointer rounded-2xl p-6 relative overflow-hidden group transition-all"
                    >
                      <div className="absolute top-0 right-0 bg-orange-500/5 w-24 h-24 blur-xl rounded-full group-hover:bg-orange-500/10 transition-all" />
                      <div className="flex items-center gap-4 mb-4 relative z-10">
                        <div className="bg-orange-500/10 p-2.5 rounded-xl text-orange-500">
                          <Phone size={20} />
                        </div>
                        <h3 className="text-zinc-400 font-bold text-sm">Active DIDs</h3>
                      </div>
                      <p className="text-3xl font-black text-white relative z-10">{totalDids}</p>
                    </div>
                  </div>
                    <div className="space-y-6 animate-in fade-in duration-500">

              {/* Search & Action Bar */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#090e14] border border-white/5 p-4 rounded-2xl">

                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search companies or emails..."
                    className="w-full bg-[#12181e] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-2 bg-[#12181e] border border-white/5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-400">
                    <Filter size={14} className="text-[#f97316]" />
                    <span>Filters:</span>
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-[#12181e] border border-white/5 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>


                  <button className="flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-black px-4 py-2 rounded-xl text-xs font-black transition-all ml-auto md:ml-0 shadow-lg shadow-orange-500/10">
                    <Plus size={14} /> Add Company
                  </button>
                </div>

              </div>

              {/* API Loaders */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <span className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-zinc-500 text-sm font-semibold">Loading companies directory...</p>
                </div>
              ) : error ? (
                <div className="bg-red-500/10 border border-red-500/25 rounded-2xl p-12 text-center">
                  <ShieldAlert className="text-red-500 mx-auto mb-4" size={40} />
                  <h3 className="font-bold text-lg text-white mb-2">Error Connecting to Backend</h3>
                  <p className="text-sm text-red-400 max-w-md mx-auto">{error}</p>
                  <button
                    onClick={fetchCompanies}
                    className="mt-4 bg-[#f97316] text-black font-black px-6 py-2.5 rounded-xl text-xs transition-all shadow-lg hover:bg-orange-400"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                /* Card Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCompanies.map((company) => (
                    <div
                      key={company.companyId}
                      className="bg-[#090e14] border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-white/10 transition-all group"
                    >
                      <div className="space-y-4">
                        {/* Title and status */}
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-black text-lg text-white group-hover:text-[#f97316] transition-colors truncate">
                            {company.companyName}
                          </h3>
                          <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${company.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}>
                            {company.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>

                        {/* Email */}
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                          <Mail size={14} className="text-zinc-500 shrink-0" />
                          <span className="truncate">{company.email}</span>
                        </div>

                        {/* DID details */}
                        <div className="bg-[#12181e] p-3 rounded-xl border border-white/5 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-500">DID Number:</span>
                            <span className="font-mono text-zinc-300 font-bold">
                              {company.didNumber || 'None Assigned'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-500">Tradie Staff:</span>
                            <span className="text-zinc-300 font-bold">
                              {company.tradieCount || 0} registered
                            </span>
                          </div>
                        </div>

                        {/* Days Remaining Banner */}
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-zinc-500">Trial Period:</span>
                          <span className={`px-2 py-0.5 rounded font-bold ${company.daysRemaining > 0
                            ? 'bg-[#f97316]/10 text-[#f97316]'
                            : 'bg-zinc-800 text-zinc-400'
                            }`}>
                            {company.daysRemaining} days left
                          </span>
                        </div>
                      </div>

                      {/* Detail Button */}
                      <button
                        onClick={() => handleViewDetails(company.companyId)}
                        className="mt-6 w-full flex items-center justify-center gap-1.5 bg-white/5 group-hover:bg-[#f97316] text-white group-hover:text-black font-black py-2.5 rounded-xl text-xs transition-all"
                      >
                        View Details
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  ))}

                  {filteredCompanies.length === 0 && (
                    <div className="col-span-full bg-[#090e14] border border-white/5 rounded-2xl p-16 text-center">
                      <Building2 className="mx-auto text-zinc-700 mb-4" size={40} />
                      <h3 className="font-bold text-base">No companies match your filters</h3>
                      <p className="text-sm text-zinc-500 mt-1">Try resetting the status/payment parameters.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
                </>
              )}
            </div>
          )}

          {/* TAB 3: DIDs & NUMBERS */}
          {activeTab === 'dids' && (
            <div className="space-y-6 animate-in fade-in duration-500">

              {/* Search Header */}
              <div className="bg-[#090e14] border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search active DID numbers..."
                    className="w-full bg-[#12181e] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>
                <button className="flex items-center gap-2 bg-[#f97316] hover:bg-orange-400 text-black px-4 py-2.5 rounded-xl text-xs font-black transition-all shadow-lg shadow-orange-500/10">
                  <Plus size={14} /> Buy New Number
                </button>
              </div>

              {/* Grid of numbers */}
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <span className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDids.map((did, index) => (
                    <div key={index} className="bg-[#090e14] border border-white/5 rounded-2xl p-6 space-y-4 hover:border-white/10 transition-all">

                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${did.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                          {did.status.toUpperCase()}
                        </span>
                        <Phone size={16} className="text-zinc-600" />
                      </div>

                      <div>
                        <p className="text-lg font-black text-white tracking-wide font-mono">{did.number}</p>
                        <p className="text-xs text-zinc-500 mt-2">Company: <span className="text-zinc-300 font-bold">{did.companyName}</span></p>
                        <p className="text-xs text-zinc-500 mt-0.5">Trial Status: <span className="text-zinc-300 font-semibold">{did.daysRemaining} days left</span></p>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                        <button
                          onClick={() => handleViewDetails(did.companyId)}
                          className="text-[#f97316] hover:underline text-xs font-bold flex items-center gap-1"
                        >
                          View Company Details <ChevronRight size={12} />
                        </button>
                      </div>

                    </div>
                  ))}

                  {filteredDids.length === 0 && (
                    <div className="col-span-full bg-[#090e14] border border-white/5 rounded-2xl p-12 text-center">
                      <Phone className="mx-auto text-zinc-700 mb-4" size={40} />
                      <h3 className="font-bold text-base">No DIDs active</h3>
                      <p className="text-sm text-zinc-500 mt-1">No phone numbers match the search query.</p>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* TAB 4: SYSTEM SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl">

              <div className="bg-[#090e14] border border-white/5 rounded-2xl p-6 space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-white/5">
                  <Sliders size={18} className="text-[#f97316]" />
                  <div>
                    <h3 className="font-bold text-base text-white">Global Parameters</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">Modify default routing, system voices, and Twilio integration keys.</p>
                  </div>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-6">

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Default Voice Model</label>
                    <select
                      value={settings.defaultVoiceModel}
                      onChange={(e) => setSettings({ ...settings, defaultVoiceModel: e.target.value })}
                      className="w-full bg-[#12181e] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-all"
                    >
                      <option value="mia-v2-turbo">Mia.Ai v2 Turbo (Recommended)</option>
                      <option value="mia-v2-hq">Mia.Ai v2 High Fidelity</option>
                      <option value="mia-v1-stable">Mia.Ai v1 Legacy Stable</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Twilio Trunk ID</label>
                    <input
                      type="text"
                      value={settings.twillioTrunk}
                      onChange={(e) => setSettings({ ...settings, twillioTrunk: e.target.value })}
                      placeholder="AC..."
                      className="w-full bg-[#12181e] border border-white/5 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-orange-500 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Billing Limit Alert ($ / month)</label>
                    <input
                      type="number"
                      value={settings.billingAlertThreshold}
                      onChange={(e) => setSettings({ ...settings, billingAlertThreshold: Number(e.target.value) })}
                      className="w-full bg-[#12181e] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-3 bg-[#12181e] p-4 rounded-xl border border-white/5">
                    <input
                      type="checkbox"
                      id="recordingEnabled"
                      checked={settings.recordingEnabled}
                      onChange={(e) => setSettings({ ...settings, recordingEnabled: e.target.checked })}
                      className="w-4 h-4 rounded text-orange-500 bg-[#090e14] border-white/10 focus:ring-orange-500 focus:ring-offset-[#090e14] focus:ring-2"
                    />
                    <div>
                      <label htmlFor="recordingEnabled" className="text-sm font-bold text-white block cursor-pointer">Enable Voice Recording Logs</label>
                      <span className="text-xs text-zinc-500">Record inbound queries for AI diagnostics and company reviews.</span>
                    </div>
                  </div>

                  {settingsSaved && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-4 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-300">
                      <CheckCircle2 size={16} /> Global configuration settings saved successfully.
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-[#f97316] hover:bg-orange-400 text-black py-3.5 rounded-xl text-sm font-black transition-all shadow-lg shadow-orange-500/10"
                  >
                    <Save size={16} /> Save Configuration
                  </button>

                </form>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* DETAIL MODAL OVERLAY */}
      {isDetailsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setIsDetailsModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-4xl max-h-[85vh] bg-[#090e14] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200 z-50">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-[#05090e]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#12181e] border border-white/5 flex items-center justify-center font-black text-[#f97316]">
                  {companyDetails?.company?.companyName?.charAt(0) || 'C'}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    {companyDetails?.company?.companyName || "Loading Details..."}
                  </h3>
                  <p className="text-xs text-zinc-500">Company Identity Portal</p>
                </div>
              </div>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Scroll Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">

              {isLoadingDetails ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <span className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-zinc-500 text-sm font-semibold">Connecting to secure storage...</p>
                </div>
              ) : detailsError ? (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 text-sm font-bold flex items-center gap-2">
                  <XCircle size={18} className="shrink-0" />
                  <span>{detailsError}</span>
                </div>
              ) : companyDetails ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Left: Profile Information */}
                    <div className="bg-[#12181e] border border-white/5 rounded-xl p-5 space-y-4">
                      <h4 className="text-xs font-bold text-[#f97316] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/5">
                        <ShieldCheck size={14} />
                        Registration Profile
                      </h4>

                      <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs">
                        <div>
                          <span className="text-zinc-500 block">Customer Name</span>
                          <span className="text-white font-bold">{companyDetails.company.customerName}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block">Aussie ACN</span>
                          <span className="text-white font-bold font-mono">{companyDetails.company.acn || 'Not Specified'}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block">Core Trade</span>
                          <span className="text-[#f97316] font-bold">{companyDetails.company.trade}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block">Mobile Number</span>
                          <span className="text-white font-mono font-bold">{companyDetails.company.mobileNumber}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-zinc-500 block">Email Address</span>
                          <span className="text-white font-mono font-semibold break-all">{companyDetails.company.email}</span>
                          <span className={`inline-block text-[9px] font-extrabold mt-1 px-1.5 py-0.5 rounded uppercase tracking-wider ${companyDetails.company.emailVerified ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                            {companyDetails.company.emailVerified ? 'Verified' : 'Pending Verification'}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-zinc-500 flex items-center gap-1"><Clock size={12} /> Opening Hours</span>
                          <span className="text-zinc-300 font-bold">{companyDetails.company.openingHours}</span>
                        </div>
                        <div className="col-span-2 pt-2 border-t border-white/5 text-[10px] text-zinc-500 flex items-center gap-1">
                          <Calendar size={12} /> Created: {new Date(companyDetails.company.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Right: DID Allocation & Trial Status */}
                    <div className="bg-[#12181e] border border-white/5 rounded-xl p-5 flex flex-col justify-between gap-6">

                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-[#f97316] uppercase tracking-wider flex items-center justify-between pb-2 border-b border-white/5">
                          <span className="flex items-center gap-2"><Phone size={14} /> DID Number Allocation</span>
                          {!showAllocateDidForm && (
                            <button
                              onClick={() => {
                                setShowAllocateDidForm(true);
                                setAllocateDidError(null);
                              }}
                              className="text-[10px] font-bold text-zinc-400 hover:text-white transition-all flex items-center gap-1"
                            >
                              <Plus size={10} /> {companyDetails.did ? 'Reassign' : 'Allocate'}
                            </button>
                          )}
                        </h4>

                        {showAllocateDidForm ? (
                          <form onSubmit={handleAllocateDid} className="space-y-3 bg-[#090e14] p-4 rounded-xl border border-white/5 animate-in slide-in-from-top-2 duration-200">
                            <div className="flex justify-between items-center pb-2 border-b border-white/5">
                              <span className="text-[10px] font-bold text-zinc-400 uppercase">Allocate DID Number</span>
                              <button
                                type="button"
                                onClick={() => setShowAllocateDidForm(false)}
                                className="text-zinc-500 hover:text-white"
                              >
                                <X size={12} />
                              </button>
                            </div>

                            <div className="space-y-1.5 text-xs">
                              <label className="text-[10px] text-zinc-500 uppercase tracking-wider">DID Phone Number</label>
                              <input
                                type="text"
                                required
                                value={didNumber}
                                onChange={(e) => setDidNumber(e.target.value)}
                                placeholder="+61291234567"
                                className="w-full bg-[#12181e] border border-white/5 rounded-lg px-3 py-2 text-white placeholder-zinc-700 focus:outline-none focus:border-orange-500"
                              />
                            </div>

                            <div className="space-y-1.5 text-xs">
                              <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Assign to Tradie</label>
                              <select
                                required
                                value={didTradieId}
                                onChange={(e) => setDidTradieId(e.target.value)}
                                className="w-full bg-[#12181e] border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                              >
                                <option value="">-- Select Tradie --</option>
                                {companyDetails.tradies.map((t: any) => (
                                  <option key={t._id} value={t._id}>{t.name} ({t.phoneNumber})</option>
                                ))}
                              </select>
                            </div>

                            {allocateDidError && (
                              <p className="text-red-500 text-[10px] font-bold">{allocateDidError}</p>
                            )}

                            <button
                              type="submit"
                              disabled={isAllocatingDid}
                              className="w-full bg-[#f97316] text-black font-black py-2 rounded-lg text-xs hover:bg-orange-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                            >
                              {isAllocatingDid ? (
                                <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                              ) : (
                                "Save DID Mapping"
                              )}
                            </button>
                          </form>
                        ) : companyDetails.did ? (
                          <div className="space-y-3 text-xs animate-in fade-in duration-200">
                            <div className="bg-[#090e14] p-3 rounded-lg border border-white/5 flex items-center justify-between">
                              <span className="text-zinc-500">Allocated DID:</span>
                              <span className="text-white font-mono font-black text-sm tracking-wider select-all">
                                {companyDetails.did.didNumber}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-zinc-500">Subscription Start:</span>
                              <span className="text-zinc-300 font-semibold font-mono">
                                {new Date(companyDetails.did.subscriptionStartDate).toLocaleDateString()}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-zinc-500">DID Assigned Tradie:</span>
                              <span className="text-zinc-300 font-bold">
                                {companyDetails.tradies.find((t: any) => t._id === companyDetails.did.assignedTradieId)?.name || "Unassigned"}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 bg-orange-500/5 border border-[#f97316]/10 rounded-xl text-center animate-in fade-in duration-200">
                            <Phone className="mx-auto text-[#f97316]/30 mb-2" size={24} />
                            <p className="text-xs text-zinc-500 italic">No direct inbound line allocated for this company.</p>
                          </div>
                        )}
                      </div>

                      {/* Subscription details */}
                      <div className="space-y-3 bg-[#090e14] border border-white/5 p-4 rounded-xl">
                        <h5 className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                          <CreditCard size={12} />
                          Billing & Subscription
                        </h5>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-400">Trial Period Balance:</span>
                          <span className={`px-2 py-0.5 rounded font-black text-xs ${companyDetails.daysRemaining > 0
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-red-500/10 text-red-400'
                            }`}>
                            {companyDetails.daysRemaining} Days Left
                          </span>
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* Staff Directory (Tradies) */}
                  <div className="bg-[#12181e] border border-white/5 rounded-xl p-5 space-y-4">
                    <h4 className="text-xs font-bold text-[#f97316] uppercase tracking-wider flex items-center justify-between pb-2 border-b border-white/5">
                      <span className="flex items-center gap-2"><Users size={14} /> Registered Tradies Directory</span>
                      {!showAddTradieForm && (
                        <button
                          onClick={() => {
                            setShowAddTradieForm(true);
                            setAddTradieError(null);
                          }}
                          className="text-[10px] font-bold text-zinc-400 hover:text-[#f97316] transition-all flex items-center gap-1"
                        >
                          <Plus size={10} /> Add Tradie
                        </button>
                      )}
                    </h4>

                    {/* Add Tradie Inline Form */}
                    {showAddTradieForm && (
                      <form onSubmit={handleAddTradie} className="space-y-3 bg-[#090e14] p-4 rounded-xl border border-white/5 animate-in slide-in-from-top-2 duration-200">
                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                          <span className="text-[10px] font-bold text-[#f97316] uppercase tracking-wider">New Tradie Details</span>
                          <button
                            type="button"
                            onClick={() => { setShowAddTradieForm(false); setAddTradieError(null); }}
                            className="text-zinc-500 hover:text-white transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider block">Full Name</label>
                            <input
                              type="text"
                              required
                              value={tradieName}
                              onChange={(e) => setTradieName(e.target.value)}
                              placeholder="John Smith"
                              className="w-full bg-[#12181e] border border-white/5 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-orange-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider block">Phone Number</label>
                            <input
                              type="text"
                              required
                              value={tradiePhone}
                              onChange={(e) => setTradiePhone(e.target.value)}
                              placeholder="+61412345678"
                              className="w-full bg-[#12181e] border border-white/5 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-orange-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider block">Email Address</label>
                            <input
                              type="email"
                              required
                              value={tradieEmail}
                              onChange={(e) => setTradieEmail(e.target.value)}
                              placeholder="john@example.com"
                              className="w-full bg-[#12181e] border border-white/5 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-orange-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider block">Notification Preference</label>
                            <select
                              value={tradieNotifPref}
                              onChange={(e) => setTradieNotifPref(e.target.value)}
                              className="w-full bg-[#12181e] border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                            >
                              <option value="both">Both (SMS + Email)</option>
                              <option value="sms">SMS Only</option>
                              <option value="email">Email Only</option>
                            </select>
                          </div>

                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-[10px] text-zinc-500 uppercase tracking-wider block">Call Mode</label>
                            <div className="flex gap-2">
                              {['geo', 'ussd'].map((mode) => (
                                <button
                                  key={mode}
                                  type="button"
                                  onClick={() => setTradieCallMode(mode)}
                                  className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${tradieCallMode === mode
                                    ? 'bg-[#f97316] text-black'
                                    : 'bg-[#12181e] border border-white/5 text-zinc-400 hover:text-white'
                                    }`}
                                >
                                  {mode}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {addTradieError && (
                          <p className="text-red-500 text-[10px] font-bold">{addTradieError}</p>
                        )}

                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => { setShowAddTradieForm(false); setAddTradieError(null); }}
                            className="flex-1 border border-white/10 hover:bg-white/5 text-zinc-300 py-2 rounded-lg text-xs font-bold transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isAddingTradie}
                            className="flex-1 bg-[#f97316] text-black font-black py-2 rounded-lg text-xs hover:bg-orange-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                          >
                            {isAddingTradie ? (
                              <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            ) : (
                              "Add Tradie"
                            )}
                          </button>
                        </div>
                      </form>
                    )}

                    {mapTradieError && (
                      <div className="text-red-500 text-[10px] font-bold mb-2">{mapTradieError}</div>
                    )}
                    <div className="space-y-3">
                      {companyDetails.tradies.map((tradie: any) => {
                        const isTradieMapped = tradie.isMapped || companyDetails?.did?.assignedTradieId === tradie._id;
                        return (
                          <div
                            key={tradie._id}
                            className="bg-[#090e14] p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div>
                              <p className="font-bold text-sm text-white flex items-center gap-2">
                                {tradie.name}
                                {isTradieMapped && (
                                  <span className="text-[9px] font-extrabold bg-[#f97316]/10 text-[#f97316] px-1.5 py-0.5 rounded uppercase tracking-wider">
                                    Mapped
                                  </span>
                                )}
                              </p>
                            <p className="text-xs text-zinc-500 mt-1">
                              Call Mode: <span className="text-zinc-300 font-semibold uppercase">{tradie.callMode}</span>
                              <span className="mx-2 text-zinc-700">|</span>
                              Notif: <span className="text-zinc-300 font-semibold uppercase">{tradie.notificationPreference}</span>
                            </p>
                          </div>

                          <div className="sm:text-right text-xs">
                            <p className="font-mono text-zinc-300 flex items-center sm:justify-end gap-1.5">
                              <Mail size={12} className="text-zinc-600" />
                              {tradie.email}
                            </p>
                            <p className="font-mono text-zinc-500 mt-1 flex items-center sm:justify-end gap-1.5">
                              <Smartphone size={12} className="text-zinc-600" />
                              {tradie.phoneNumber}
                            </p>
                            {!isTradieMapped && companyDetails?.did?.didNumber && (
                              <button
                                type="button"
                                onClick={() => handleMapTradie(tradie._id)}
                                disabled={isMappingTradie}
                                className="mt-3 inline-flex items-center justify-center gap-2 border border-[#f97316]/20 text-[#f97316] hover:bg-white/5 px-3 py-2 rounded-xl text-[10px] font-bold transition-all disabled:opacity-50"
                              >
                                {isMappingTradie && mappingTradieId === tradie._id ? (
                                  <span className="w-3.5 h-3.5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  "Map to DID"
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                        )}
                      )}

                      {companyDetails.tradies.length === 0 && !showAddTradieForm && (
                        <div className="p-8 text-center bg-white/[0.01] rounded-xl border border-dashed border-white/5">
                          <Users className="mx-auto text-zinc-800 mb-2" size={24} />
                          <p className="text-xs text-zinc-500 italic">No registered staff directory records found.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : null}

            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-white/5 bg-[#05090e]">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDeleteCompany}
                  disabled={isDeletingCompany}
                  className="px-5 py-2 border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-xl text-xs transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isDeletingCompany ? (
                    <span className="w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Delete Company"
                  )}
                </button>
                {deleteCompanyError && (
                  <span className="text-red-500 text-[10px] font-bold ml-2">{deleteCompanyError}</span>
                )}
              </div>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-5 py-2 border border-white/10 hover:bg-white/5 text-white font-bold rounded-xl text-xs transition-all"
              >
                Close Portal
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
