import React, { useState, useEffect } from 'react';
import MagneticButton from './MagneticButton';

export function AdminDashboard({ currentUser, authToken, setRoute }) {
  const [activeTab, setActiveTab] = useState('analytics'); // analytics, registry, approvals, logs, adjustment
  const [stats, setStats] = useState({
    totalCups: 0,
    activeRentals: 0,
    returnRequestsCount: 0,
    registeredUsers: 0,
    totalPayoutAmount: 0
  });

  // Cups Registry states
  const [cups, setCups] = useState([]);
  const [newCupId, setNewCupId] = useState('');
  const [registryLoading, setRegistryLoading] = useState(false);

  // Return Approvals states
  const [pendingRequests, setPendingRequests] = useState([]);
  const [remarksMap, setRemarksMap] = useState({}); // recordId -> remarks text
  const [approvalsLoading, setApprovalsLoading] = useState(false);

  // Borrow Logs states
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Cashback Adjustment states
  const [adjEmail, setAdjEmail] = useState('');
  const [adjAmount, setAdjAmount] = useState('');
  const [adjRemarks, setAdjRemarks] = useState('');
  const [adjLoading, setAdjLoading] = useState(false);
  const [adjSuccess, setAdjSuccess] = useState('');

  // Main fetch functions
  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/analytics', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  const fetchCups = async () => {
    try {
      const res = await fetch('/api/cups');
      const data = await res.json();
      if (data.success) {
        setCups(data.cups);
      }
    } catch (err) {
      console.error('Error fetching cups:', err);
    }
  };

  const fetchPendingReturns = async () => {
    try {
      const res = await fetch('/api/admin/pending-returns', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setPendingRequests(data.pendingRequests);
      }
    } catch (err) {
      console.error('Error fetching pending returns:', err);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/admin/borrow-records', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
  };

  // Run on tab switch
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin' || !authToken) return;

    if (activeTab === 'analytics') {
      fetchAnalytics();
    } else if (activeTab === 'registry') {
      fetchCups();
    } else if (activeTab === 'approvals') {
      fetchPendingReturns();
    } else if (activeTab === 'logs') {
      fetchLogs();
    }
  }, [activeTab, currentUser, authToken]);

  // Handle Add Cup
  const handleAddCup = async (e) => {
    e.preventDefault();
    if (!newCupId.trim()) return;

    setRegistryLoading(true);
    try {
      const res = await fetch('/api/cups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ cupId: newCupId })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('Cup successfully registered in network!');
        setNewCupId('');
        fetchCups();
      } else {
        alert(data.message || 'Failed to register cup.');
      }
    } catch (err) {
      console.error('Error adding cup:', err);
      alert('Network error registering cup.');
    } finally {
      setRegistryLoading(false);
    }
  };

  // Handle Delete Cup
  const handleDeleteCup = async (cupId) => {
    if (!confirm(`Are you sure you want to remove ${cupId} from the registry?`)) return;

    try {
      const res = await fetch(`/api/cups/${cupId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('Cup removed successfully.');
        fetchCups();
      } else {
        alert(data.message || 'Failed to delete cup.');
      }
    } catch (err) {
      console.error('Error deleting cup:', err);
    }
  };

  // Handle Verify Return
  const handleVerifyReturn = async (recordId) => {
    const remarks = remarksMap[recordId] || '';
    setApprovalsLoading(true);
    try {
      const res = await fetch('/api/admin/verify-return', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ recordId, remarks })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('Vessel return verified. Wallet balance refunded (+₹50.00).');
        // Clear remarks input
        setRemarksMap(prev => {
          const updated = { ...prev };
          delete updated[recordId];
          return updated;
        });
        fetchPendingReturns();
      } else {
        alert(data.message || 'Verification failed.');
      }
    } catch (err) {
      console.error('Error verifying return:', err);
    } finally {
      setApprovalsLoading(false);
    }
  };

  // Handle Reject Return
  const handleRejectReturn = async (recordId) => {
    const remarks = remarksMap[recordId] || '';
    if (!remarks.trim()) {
      alert('Please provide a brief rejection remark describing the failure state.');
      return;
    }

    setApprovalsLoading(true);
    try {
      const res = await fetch('/api/admin/reject-return', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ recordId, remarks })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('Return request rejected. Vessel lease restored to active.');
        setRemarksMap(prev => {
          const updated = { ...prev };
          delete updated[recordId];
          return updated;
        });
        fetchPendingReturns();
      } else {
        alert(data.message || 'Rejection failed.');
      }
    } catch (err) {
      console.error('Error rejecting return:', err);
    } finally {
      setApprovalsLoading(false);
    }
  };

  // Handle Manual Cashback Adjustment
  const handleCashbackAdjustment = async (e) => {
    e.preventDefault();
    if (!adjEmail.trim() || !adjAmount) return;

    setAdjLoading(true);
    setAdjSuccess('');
    try {
      const res = await fetch('/api/admin/adjust-cashback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          email: adjEmail,
          amount: parseFloat(adjAmount),
          remarks: adjRemarks
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdjSuccess(`Balance adjusted by ₹${parseFloat(adjAmount).toFixed(2)} successfully.`);
        setAdjEmail('');
        setAdjAmount('');
        setAdjRemarks('');
      } else {
        alert(data.message || 'Adjustment failed.');
      }
    } catch (err) {
      console.error('Error adjusting balance:', err);
      alert('Network error adjusting wallet.');
    } finally {
      setAdjLoading(false);
    }
  };

  // Access Guard
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <section className="min-h-screen w-full bg-[#0B0F12] text-light-cream pt-28 pb-16 flex items-center justify-center">
        <div className="max-w-md w-full mx-5 p-8 rounded-2xl bg-[#121613] border border-red-500/20 text-center flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 font-bold text-2xl">
            🔒
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="display-header text-2xl font-bold uppercase text-red-400">Access Denied</h2>
            <p className="interface-text text-sm text-white/60">
              This terminal is locked. Operator credentials with admin-level roles are required to view this dashboard.
            </p>
          </div>
          <button 
            onClick={() => setRoute('/')}
            className="px-6 py-2.5 bg-mint hover:bg-mint/90 text-deep-ink font-bold rounded-lg text-xs uppercase tracking-wider cursor-pointer border-none spring-transition"
          >
            Go Back
          </button>
        </div>
      </section>
    );
  }

  // Filter logs based on search
  const filteredLogs = logs.filter(log => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      log.cupId.toLowerCase().includes(query) ||
      log.userName.toLowerCase().includes(query) ||
      log.status.toLowerCase().includes(query)
    );
  });

  return (
    <section className="min-h-screen w-full bg-[#0B0F12] text-light-cream pt-28 pb-16 flex items-center justify-center">
      <div className="max-w-[1440px] mx-auto w-full px-5 lg:px-20 flex flex-col gap-8">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono text-mint uppercase tracking-wider">// SYSTEM CONTROL CONSOLE</span>
            <h1 className="display-header text-3xl md:text-4xl font-black text-light-cream leading-none uppercase">
              Admin Control Panel
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono bg-white/5 border border-white/10 px-3 py-1 rounded text-white/50">
              OPERATOR: {currentUser.name}
            </span>
            <span className="text-[10px] font-mono bg-mint/10 border border-mint/20 px-3 py-1 rounded text-mint">
              STATUS: ONLINE
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto border-b border-white/5 pb-2 text-xs font-mono gap-1 select-none whitespace-nowrap">
          {[
            { id: 'analytics', label: 'ANALYTICS SUMMARY' },
            { id: 'registry', label: 'CUP REGISTRY' },
            { id: 'approvals', label: `PENDING APPROVALS (${stats.returnRequestsCount || pendingRequests.length})` },
            { id: 'logs', label: 'BORROW HISTORY LOGS' },
            { id: 'adjustment', label: 'MANUAL WALLET ADJ' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-lg border-none cursor-pointer spring-transition ${
                activeTab === tab.id 
                  ? 'bg-mint text-deep-ink font-bold font-mono' 
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="min-h-[400px]">
          
          {/* TAB 1: ANALYTICS SUMMARY */}
          {activeTab === 'analytics' && (
            <div className="flex flex-col gap-8">
              {/* Analytics metrics grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
                  <span className="text-[10px] font-mono text-white/40 uppercase">Total Vessels Registered</span>
                  <span className="text-3xl font-black font-mono text-mint mt-1">{stats.totalCups}</span>
                  <span className="text-[9px] font-mono text-white/30 uppercase">In-network assets</span>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
                  <span className="text-[10px] font-mono text-white/40 uppercase">Active Borrow Leases</span>
                  <span className="text-3xl font-black font-mono text-[#F5B973] mt-1">{stats.activeRentals}</span>
                  <span className="text-[9px] font-mono text-white/30 uppercase">Circulating in loop</span>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
                  <span className="text-[10px] font-mono text-white/40 uppercase">Pending Return Audits</span>
                  <span className="text-3xl font-black font-mono text-blue-400 mt-1">{stats.returnRequestsCount}</span>
                  <span className="text-[9px] font-mono text-white/30 uppercase">Needs counter verification</span>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
                  <span className="text-[10px] font-mono text-white/40 uppercase">Total Active Members</span>
                  <span className="text-3xl font-black font-mono text-light-cream mt-1">{stats.registeredUsers}</span>
                  <span className="text-[9px] font-mono text-white/30 uppercase">Registered user roles</span>
                </div>
                <div className="p-5 rounded-2xl bg-[#1c221e] border border-mint/20 flex flex-col gap-2">
                  <span className="text-[10px] font-mono text-mint/60 uppercase">Total Escrow Refunds</span>
                  <span className="text-3xl font-black font-mono text-mint mt-1">₹{stats.totalPayoutAmount.toFixed(2)}</span>
                  <span className="text-[9px] font-mono text-mint/40 uppercase">Returned to users</span>
                </div>
              </div>

              {/* Graphic/Context Info card */}
              <div className="p-6 rounded-2xl bg-[#121613] border border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-col gap-2 text-left max-w-2xl">
                  <h3 className="display-header text-lg font-bold text-light-cream">Network Integrity Audit</h3>
                  <p className="interface-text text-xs text-white/60 leading-relaxed">
                    Takeback operates on a zero-waste, deposit-escrow framework. When users borrow cups, their ₹50 deposit resides in a secure ledger. Café operators are authorized to confirm vessel hand-backs, instantly releasing balances back to user accounts.
                  </p>
                </div>
                <button 
                  onClick={() => setActiveTab('approvals')}
                  className="px-6 py-3 bg-mint hover:bg-mint/90 text-deep-ink font-bold rounded-lg text-xs tracking-wider uppercase font-sans border-none cursor-pointer spring-transition whitespace-nowrap"
                >
                  Verify Returns ({stats.returnRequestsCount})
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CUP REGISTRY */}
          {activeTab === 'registry' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Register New Cup Pane */}
              <div className="col-span-1 lg:col-span-4 p-6 rounded-2xl bg-[#121613] border border-white/10 flex flex-col gap-5 text-left">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-mint uppercase tracking-wider">// CORE PROVISION</span>
                  <h3 className="display-header text-lg font-bold text-light-cream">Register Smart Vessel</h3>
                </div>

                <form onSubmit={handleAddCup} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono text-white/45 uppercase">Unique Alphanumeric ID:</label>
                    <input
                      type="text"
                      required
                      value={newCupId}
                      onChange={(e) => setNewCupId(e.target.value)}
                      placeholder="e.g. CUP-105"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-light-cream placeholder:text-white/20 focus:ring-1 focus:ring-mint focus:outline-none"
                    />
                  </div>
                  <p className="interface-text text-[10px] text-white/45 leading-relaxed">
                    Cup IDs should be unique. Upon registration, the system automatically builds an encrypted QR code containing the deep link: `/cup/{'{cupId}'}`.
                  </p>
                  <MagneticButton 
                    type="submit"
                    disabled={registryLoading}
                    className="w-full py-3 bg-mint hover:bg-mint/90 text-deep-ink font-bold rounded-xl text-xs uppercase tracking-wider font-sans border-none cursor-pointer"
                  >
                    {registryLoading ? 'Provisioning Cup...' : 'Register Vessel'}
                  </MagneticButton>
                </form>
              </div>

              {/* Cups Registry List */}
              <div className="col-span-1 lg:col-span-8 flex flex-col gap-4">
                <span className="text-[10px] font-mono text-white/45 uppercase tracking-wider font-bold">
                  // REGISTERED NETWORK VESSELS ({cups.length})
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
                  {cups.map(cup => (
                    <div 
                      key={cup._id}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-between gap-4 text-center relative"
                    >
                      <div className="w-32 h-32 bg-white rounded-lg p-2 flex items-center justify-center">
                        <img 
                          src={cup.qrCodeUrl} 
                          alt={`QR Code for ${cup.cupId}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="w-full">
                        <div className="flex justify-between items-center mt-2 text-xs">
                          <span className="font-bold font-mono text-light-cream">{cup.cupId}</span>
                          <span className={`px-2 py-0.5 rounded-[4px] font-mono text-[8px] uppercase ${
                            cup.status === 'Available' ? 'bg-mint/10 border border-mint/20 text-mint' :
                            cup.status === 'Return Requested' ? 'bg-blue-400/10 border border-blue-400/20 text-blue-400 animate-pulse' :
                            'bg-amber-500/10 border border-amber-500/20 text-amber-500'
                          }`}>
                            {cup.status}
                          </span>
                        </div>
                      </div>

                      <div className="w-full flex gap-2 justify-between border-t border-white/5 pt-2">
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = cup.qrCodeUrl;
                            link.target = '_blank';
                            link.download = `QR-${cup.cupId}.png`;
                            link.click();
                          }}
                          className="text-[9px] font-mono text-white/50 hover:text-white bg-transparent border-none cursor-pointer"
                        >
                          [ PRINT QR ]
                        </button>
                        <button
                          onClick={() => handleDeleteCup(cup.cupId)}
                          className="text-[9px] font-mono text-red-400/70 hover:text-red-400 bg-transparent border-none cursor-pointer"
                        >
                          [ REMOVE ]
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PENDING APPROVALS */}
          {activeTab === 'approvals' && (
            <div className="flex flex-col gap-4 text-left">
              <span className="text-[10px] font-mono text-white/45 uppercase tracking-wider font-bold">
                // ACTIVE REFUND CLAIMS WAITING FOR AUDIT ({pendingRequests.length})
              </span>

              {pendingRequests.length === 0 ? (
                <div className="p-8 rounded-xl bg-white/5 border border-white/5 text-center text-white/40 interface-text text-sm">
                  There are currently no return requests waiting for counter verification.
                </div>
              ) : (
                <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2">
                  {pendingRequests.map(record => (
                    <div 
                      key={record._id}
                      className="p-5 rounded-2xl bg-[#121613] border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                    >
                      <div className="flex-1 flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                          <span className="text-base font-bold font-mono text-light-cream uppercase">
                            {record.cupId}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded uppercase">
                            Return Pending
                          </span>
                        </div>
                        <p className="interface-text text-xs text-white/60 mt-1">
                          Borrowed by: <span className="font-semibold text-light-cream">{record.userName}</span>
                        </p>
                        <span className="text-[10px] font-mono text-white/40">
                          Checkout Date: {new Date(record.borrowedAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 w-full md:w-auto">
                        <div className="flex flex-col gap-1 w-full sm:w-48">
                          <label className="text-[9px] font-mono text-white/40 uppercase">Verification Remarks:</label>
                          <input 
                            type="text"
                            placeholder="e.g. Scanned cup clean, no chips"
                            value={remarksMap[record._id] || ''}
                            onChange={(e) => setRemarksMap(prev => ({ ...prev, [record._id]: e.target.value }))}
                            className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-light-cream focus:ring-1 focus:ring-mint focus:outline-none"
                          />
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => handleVerifyReturn(record._id)}
                            disabled={approvalsLoading}
                            className="flex-1 sm:flex-none px-4 py-2 bg-mint hover:bg-mint/95 text-deep-ink font-bold rounded-lg text-xs uppercase tracking-wider cursor-pointer border-none spring-transition"
                          >
                            Approve Refund
                          </button>
                          <button
                            onClick={() => handleRejectReturn(record._id)}
                            disabled={approvalsLoading}
                            className="flex-1 sm:flex-none px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded-lg text-xs uppercase tracking-wider cursor-pointer border border-red-500/20 spring-transition"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: BORROW HISTORY LOGS */}
          {activeTab === 'logs' && (
            <div className="flex flex-col gap-4 text-left">
              {/* Search filter input */}
              <div className="max-w-md w-full">
                <input
                  type="text"
                  placeholder="Filter logs by Cup ID, Username, or status..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs text-light-cream placeholder:text-white/20 focus:ring-1 focus:ring-mint focus:outline-none transition-all"
                />
              </div>

              {/* logs list layout */}
              <div className="overflow-x-auto border border-white/10 rounded-2xl bg-[#121613]">
                <table className="w-full border-collapse text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 text-[9px] uppercase font-bold tracking-wider">
                      <th className="p-4">Vessel ID</th>
                      <th className="p-4">Borrower</th>
                      <th className="p-4">Borrowed At</th>
                      <th className="p-4">Returned At</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-white/30 interface-text">
                          No matching borrowing records found.
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map(log => (
                        <tr key={log._id} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200">
                          <td className="p-4 font-bold text-light-cream">{log.cupId}</td>
                          <td className="p-4">{log.userName}</td>
                          <td className="p-4">{new Date(log.borrowedAt).toLocaleString()}</td>
                          <td className="p-4">
                            {log.returnedAt ? new Date(log.returnedAt).toLocaleString() : '—'}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-[4px] font-mono text-[8px] uppercase font-bold ${
                              log.status === 'Returned' ? 'bg-mint/10 border border-mint/20 text-mint' :
                              log.status === 'Return Requested' ? 'bg-blue-400/10 border border-blue-400/20 text-blue-400 animate-pulse' :
                              'bg-amber-500/10 border border-amber-500/20 text-amber-500'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="p-4 text-white/55 font-sans italic">{log.adminRemarks || '—'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: MANUAL WALLET ADJ */}
          {activeTab === 'adjustment' && (
            <div className="max-w-xl p-6 rounded-2xl bg-[#121613] border border-white/10 flex flex-col gap-6 text-left mx-auto">
              <div className="flex flex-col gap-1 border-b border-white/5 pb-4">
                <span className="text-[10px] font-mono text-gold-amber uppercase tracking-wider">// LEDGER OVERWRITE</span>
                <h3 className="display-header text-lg font-bold text-light-cream">Manual Balance Adjustments</h3>
              </div>

              {adjSuccess && (
                <div className="p-4 rounded-xl bg-mint/10 border border-mint/30 text-mint text-xs font-mono">
                  {adjSuccess}
                </div>
              )}

              <form onSubmit={handleCashbackAdjustment} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-white/45 uppercase">User Email Address:</label>
                  <input
                    type="email"
                    required
                    value={adjEmail}
                    onChange={(e) => setAdjEmail(e.target.value)}
                    placeholder="e.g. member@takeback.com"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-light-cream placeholder:text-white/20 focus:ring-1 focus:ring-mint focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-white/45 uppercase">Adjustment Amount (₹):</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={adjAmount}
                    onChange={(e) => setAdjAmount(e.target.value)}
                    placeholder="e.g. 50.00 (credit) or -50.00 (debit)"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-light-cream placeholder:text-white/20 focus:ring-1 focus:ring-mint focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-white/45 uppercase">Transaction Remarks / Rationale:</label>
                  <input
                    type="text"
                    required
                    value={adjRemarks}
                    onChange={(e) => setAdjRemarks(e.target.value)}
                    placeholder="e.g. Manual rebate for defective scanner checkout"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-light-cream placeholder:text-white/20 focus:ring-1 focus:ring-mint focus:outline-none"
                  />
                </div>

                <p className="interface-text text-[10px] text-white/45 leading-relaxed pt-1">
                  Re-authorizing manual balances updates user wallet databases in real-time. History cards will log this adjustment.
                </p>

                <MagneticButton 
                  type="submit"
                  disabled={adjLoading}
                  className="w-full py-3 bg-[#E5A93B] hover:bg-[#E5A93B]/90 text-deep-ink font-bold rounded-xl text-xs uppercase tracking-wider font-sans border-none cursor-pointer mt-2"
                >
                  {adjLoading ? 'Adjusting Database Balances...' : 'Apply Balance Override'}
                </MagneticButton>
              </form>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}

export default AdminDashboard;
