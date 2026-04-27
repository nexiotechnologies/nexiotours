import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, Calendar, Users,
  TrendingUp, Plus, Search, Filter,
  MoreHorizontal, Edit3, Trash2, ExternalLink,
  DollarSign, BarChart2, Star, MessageSquare,
  Settings, CreditCard, ChevronRight
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import api from "../utils/api";
import toast from "react-hot-toast";

const TABS = [
  { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'listings', label: 'My Listings', icon: <Package size={20} /> },
  { id: 'bookings', label: 'Bookings', icon: <Calendar size={20} /> },
  { id: 'customers', label: 'Customers', icon: <Users size={20} /> },
  { id: 'inquiries', label: 'Inquiries', icon: <MessageSquare size={20} /> },
  { id: 'payouts', label: 'Payouts', icon: <CreditCard size={20} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} /> }
];

export default function BusinessPortalPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [profile, setProfile] = useState({
    display_name: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchData(),
        fetchBookings(),
        fetchConversations(),
        fetchProfile()
      ]);
    } catch (err) {
      console.error("FetchAll Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/profile/');
      setProfile({
        display_name: res?.data?.display_name || "",
        email: res?.data?.email || "",
        phone: res?.data?.phone || ""
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await api.get('/chat/conversations/');
      setConversations(Array.isArray(res?.data?.results) ? res.data.results : Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setConversations([]);
    }
  };

  const fetchData = async () => {
    try {
      const [toursRes, hotelsRes, guidesRes] = await Promise.all([
        api.get('/destinations/tours/my-listings/').catch(() => ({ data: [] })),
        api.get('/destinations/hotels/my-listings/').catch(() => ({ data: [] })),
        api.get('/destinations/guides/my-listings/').catch(() => ({ data: [] }))
      ]);

      const getArr = (res) => Array.isArray(res?.data?.results) ? res.data.results : Array.isArray(res?.data) ? res.data : [];

      const tours = getArr(toursRes).map(t => ({ ...t, type: 'tours' }));
      const hotels = getArr(hotelsRes).map(h => ({ ...h, type: 'hotels' }));
      const guides = getArr(guidesRes).map(g => ({ ...g, type: 'guides' }));

      setListings([...tours, ...hotels, ...guides]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load your listings");
      setListings([]);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/vendor/');
      const data = Array.isArray(res?.data?.results) ? res.data.results : Array.isArray(res?.data) ? res.data : [];
      setBookings(data);
    } catch (err) {
      console.error(err);
      setBookings([]);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}/status/`, { status });
      toast.success(`Booking ${status}`);
      fetchBookings();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const deleteListing = async (id, type) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await api.delete(`/destinations/${type}/${id}/`);
      toast.success("Listing deleted");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete listing");
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await api.patch('/users/profile/', profile);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  const setActiveTab = (tab) => setSearchParams({ tab });

  // Chart Data Calculation
  const getRevenueData = () => {
    const months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        label: d.toLocaleString('default', { month: 'short' }),
        month: d.getMonth(),
        year: d.getFullYear(),
        total: 0
      });
    }

    bookings.filter(b => b.status === 'confirmed').forEach(b => {
      const bDate = new Date(b.created_at);
      const mIdx = months.findIndex(m => m.month === bDate.getMonth() && m.year === bDate.getFullYear());
      if (mIdx !== -1) {
        months[mIdx].total += parseFloat(b.total_price || 0);
      }
    });

    const maxTotal = Math.max(...months.map(m => m.total), 1);
    return months.map(m => ({ ...m, height: (m.total / maxTotal) * 100 }));
  };

  const revenueData = getRevenueData();

  // Filtering Logic
  const filteredListings = Array.isArray(listings) ? listings.filter(item =>
    (item.name || "").toLowerCase().includes((searchTerm || "").toLowerCase()) ||
    (item.location || "").toLowerCase().includes((searchTerm || "").toLowerCase())
  ) : [];

  const filteredBookings = Array.isArray(bookings) ? bookings.filter(b =>
    (b.booking_reference || "").toLowerCase().includes((searchTerm || "").toLowerCase()) ||
    (b.user_name || "").toLowerCase().includes((searchTerm || "").toLowerCase()) ||
    (b.tour_name || b.hotel_name || b.guide_name || "").toLowerCase().includes((searchTerm || "").toLowerCase())
  ) : [];

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Background Gradients */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(0, 122, 255, 0.08) 0%, transparent 70%)', filter: 'blur(120px)' }} />
      </div>

      <div style={{ flex: 1, display: 'flex', paddingTop: 80, position: 'relative', zIndex: 1 }}>
        {/* Sidebar */}
        <aside style={{
          width: 280,
          borderRight: '1px solid rgba(255,255,255,0.06)',
          padding: '40px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          position: 'sticky',
          top: 80,
          height: 'calc(100vh - 80px)'
        }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 20px',
                borderRadius: 16,
                border: 'none',
                background: activeTab === tab.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.5)',
                fontSize: 15,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                textAlign: 'left'
              }}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="activeDot" style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#007AFF' }} />
              )}
            </button>
          ))}

          <div style={{ marginTop: 'auto', padding: '20px' }}>
            <div className="glass-card" style={{ padding: 20, borderRadius: 20, background: 'rgba(0,122,255,0.1)', border: '1px solid rgba(0,122,255,0.2)' }}>
              <p style={{ fontSize: 13, color: '#007AFF', fontWeight: 600, marginBottom: 8 }}>Pro Status</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>Your account is verified. Enjoy premium listing perks.</p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main style={{ flex: 1, padding: '48px 64px', overflowY: 'auto' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48 }}>
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}
              >
                {TABS.find(t => t.id === activeTab)?.label}
              </motion.h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>Manage your business performance and inventory.</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/business/add')}
              className="btn-primary"
              style={{ padding: '14px 28px', borderRadius: 18, fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <Plus size={20} /> Add New Listing
            </motion.button>
          </header>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* KPI Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 48 }}>
                  {[
                    {
                      label: 'Total Revenue',
                      value: `₹${bookings.filter(b => b.status === 'confirmed').reduce((acc, curr) => acc + parseFloat(curr.total_price || 0), 0).toLocaleString()}`,
                      trend: '+12.5%', icon: <DollarSign />, color: '#1FBF85'
                    },
                    {
                      label: 'Projected',
                      value: `₹${bookings.filter(b => b.status !== 'cancelled').reduce((acc, curr) => acc + parseFloat(curr.total_price || 0), 0).toLocaleString()}`,
                      trend: 'Forecast', icon: <TrendingUp />, color: '#AF52DE'
                    },
                    {
                      label: 'Pending Approval',
                      value: bookings.filter(b => b.status === 'pending').length,
                      trend: 'Action Required', icon: <Calendar />, color: '#FF9500'
                    },
                    {
                      label: 'Avg. Rating',
                      value: listings.length > 0 ? (listings.reduce((acc, curr) => acc + (curr.rating || 4.5), 0) / listings.length).toFixed(1) : "4.8",
                      trend: 'Excellent', icon: <Star />, color: '#007AFF'
                    }
                  ].map((kpi, i) => (
                    <div key={kpi.label} className="glass-card" style={{ padding: 24, borderRadius: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${kpi.color}15`, color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {kpi.icon}
                        </div>
                        <span style={{ color: kpi.color, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{kpi.trend}</span>
                      </div>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{kpi.label}</p>
                      <h2 style={{ fontSize: 24, fontWeight: 700 }}>{kpi.value}</h2>
                    </div>
                  ))}
                </div>

                {/* Growth Chart Section */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: 24 }}>
                  <div className="glass-card" style={{ padding: 32, borderRadius: 28, height: 400, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32 }}>
                      <div>
                        <h3 style={{ fontSize: 18, fontWeight: 600 }}>Revenue Performance</h3>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Annual earnings and growth trajectory</p>
                      </div>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BarChart2 size={20} style={{ color: 'rgba(255,255,255,0.3)' }} />
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 14, paddingBottom: 20 }}>
                      {revenueData.map((m, i) => (
                        <div key={i} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 8 }}>
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.max(m.height, 4)}%` }}
                            style={{
                              width: '100%',
                              background: i === 11 ? 'var(--gradient-aurora)' : 'rgba(255,255,255,0.05)',
                              borderRadius: 8,
                              position: 'relative',
                              boxShadow: i === 11 ? '0 10px 20px rgba(0,122,255,0.2)' : 'none'
                            }}
                          >
                            {m.total > 0 && (
                              <div style={{ position: 'absolute', top: -25, left: '50%', transform: 'translateX(-50%)', fontSize: 10, fontWeight: 700, color: i === 11 ? '#007AFF' : 'rgba(255,255,255,0.3)' }}>
                                ₹{(m.total / 1000).toFixed(1)}k
                              </div>
                            )}
                          </motion.div>
                          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textAlign: 'center', fontWeight: 600 }}>{m.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card" style={{ padding: 32, borderRadius: 28, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 600 }}>Recent Activity</h3>
                      <TrendingUp size={18} style={{ color: 'rgba(255,255,255,0.2)' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                      {bookings.slice(0, 4).map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: 16 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 12, background: item.status === 'pending' ? 'rgba(255,149,0,0.1)' : 'rgba(0,122,255,0.1)', color: item.status === 'pending' ? '#FF9500' : '#007AFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {item.status === 'pending' ? <Calendar size={18} /> : <DollarSign size={18} />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 2 }}>
                              {item.user_name || 'A customer'} {item.status === 'pending' ? 'requested a booking' : 'confirmed their trip'}
                            </p>
                            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                              {item.tour_name || item.hotel_name || 'Listing'} • {item.created_at?.split('T')[0] || 'Recently'}
                            </p>
                          </div>
                        </div>
                      ))}
                      {bookings.length === 0 && (
                        <div style={{ textAlign: 'center', padding: 40 }}>
                          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>No recent activity to show.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'listings' && (
              <motion.div
                key="listings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                    <input
                      placeholder="Search your listings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '14px 14px 14px 48px', color: '#fff' }}
                    />
                  </div>
                  <button style={{ padding: '0 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Filter size={18} /> Filters
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {loading ? (
                    <div style={{ padding: 80, textAlign: 'center' }}>Loading listings...</div>
                  ) : filteredListings.length === 0 ? (
                    <div style={{ padding: 100, textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No listings found matching "{searchTerm}"</div>
                  ) : filteredListings.map(item => (
                    <div key={item.id} className="glass-card" style={{ padding: '20px 32px', borderRadius: 24, background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', gap: 24 }}>
                      <div style={{ width: 64, height: 64, borderRadius: 16, background: '#1a1a1a', overflow: 'hidden' }}>
                        {item.main_image && <img src={item.main_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{item.name}</h4>
                        <div style={{ display: 'flex', gap: 16, color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                          <span>{item.location}</span>
                          <span>•</span>
                          <span>₹{item.base_price || item.price_per_night || item.hourly_rate}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => navigate(`/${item.type}/${item.id}`)} title="View on Site" style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(0,122,255,0.1)', color: '#007AFF', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ExternalLink size={18} /></button>
                        <button onClick={() => navigate(`/business/edit/${item.id}?type=${item.type}`)} title="Edit" style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Edit3 size={18} /></button>
                        <button onClick={() => deleteListing(item.id, item.type)} title="Delete" style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,59,48,0.1)', color: '#FF3B30', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'bookings' && (
              <motion.div
                key="bookings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                    <input
                      placeholder="Search bookings by ref or name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '14px 14px 14px 48px', color: '#fff' }}
                    />
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.01)', borderRadius: 28, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
                        {['Reference', 'Customer', 'Service', 'Date', 'Status', 'Actions'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '20px 24px', fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.length === 0 ? (
                        <tr><td colSpan={6} style={{ padding: 80, textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>No booking records found.</td></tr>
                      ) : filteredBookings.map(b => (
                        <tr key={b.id} className="hover-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'all 0.2s' }}>
                          <td style={{ padding: '20px 24px', fontFamily: 'monospace', color: 'var(--accent-blue)', fontSize: 13, fontWeight: 600 }}>#{b.booking_reference}</td>
                          <td style={{ padding: '20px 24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--gradient-aurora)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{b.user_name?.[0] || 'U'}</div>
                              <div>
                                <p style={{ fontSize: 14, fontWeight: 600 }}>{b.user_name || 'Guest User'}</p>
                                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>New Customer</p>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '20px 24px' }}>
                            <p style={{ fontSize: 14, fontWeight: 600 }}>{b.tour_name || b.hotel_name || b.guide_name || 'Service'}</p>
                            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>{b.tour ? 'Tour' : b.hotel ? 'Hotel' : 'Guide'}</p>
                          </td>
                          <td style={{ padding: '20px 24px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{b.check_in}</td>
                          <td style={{ padding: '20px 24px' }}>
                            <span style={{
                              padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 800,
                              background: b.status === 'confirmed' ? 'rgba(31,191,133,0.1)' : b.status === 'pending' ? 'rgba(255,149,0,0.1)' : 'rgba(255,69,58,0.1)',
                              color: b.status === 'confirmed' ? '#1FBF85' : b.status === 'pending' ? '#FF9500' : '#FF453A',
                              border: `1px solid ${b.status === 'confirmed' ? 'rgba(31,191,133,0.2)' : b.status === 'pending' ? 'rgba(255,149,0,0.2)' : 'rgba(255,69,58,0.2)'}`
                            }}>
                              {b.status.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: '20px 24px' }}>
                            <div style={{ display: 'flex', gap: 8 }}>
                              {b.status === 'pending' ? (
                                <>
                                  <button onClick={() => updateStatus(b.id, 'confirmed')} className="btn-primary" style={{ padding: '8px 16px', borderRadius: 10, fontSize: 12 }}>Accept</button>
                                  <button onClick={() => updateStatus(b.id, 'cancelled')} style={{ padding: '8px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#FF453A', cursor: 'pointer', fontSize: 12 }}>Reject</button>
                                </>
                              ) : (
                                <button style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 12 }}>Details</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'customers' && (
              <motion.div
                key="customers"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
                  {Array.from(new Set(bookings.map(b => b.user_id))).map(userId => {
                    const booking = bookings.find(b => b.user_id === userId);
                    const userBookings = bookings.filter(b => b.user_id === userId);
                    return (
                      <div key={userId} className="glass-card" style={{ padding: 28, borderRadius: 28, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
                          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(45deg, #007AFF, #AF52DE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700 }}>
                            {booking?.user_name?.[0] || 'U'}
                          </div>
                          <div>
                            <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{booking?.user_name || 'Nexio Guest'}</h4>
                            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Explorer since 2024</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                          <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>TOTAL SPENT</p>
                            <p style={{ fontSize: 16, fontWeight: 600, color: '#1FBF85' }}>₹{userBookings.reduce((a, c) => a + parseFloat(c.total_price || 0), 0).toLocaleString()}</p>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>TRIPS</p>
                            <p style={{ fontSize: 16, fontWeight: 600 }}>{userBookings.length}</p>
                          </div>
                          <button style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ChevronRight size={20} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                  {bookings.length === 0 && (
                    <div style={{ gridColumn: '1/-1', padding: 100, textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No customers yet.</div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'inquiries' && (
              <motion.div
                key="inquiries"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {conversations.length === 0 ? (
                    <div style={{ padding: 100, textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No inquiries yet.</div>
                  ) : conversations.map(c => (
                    <div key={c.id} className="glass-card" onClick={() => navigate('/chat')} style={{ padding: 24, borderRadius: 24, background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', gap: 20, cursor: 'pointer' }}>
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(0,122,255,0.1)', color: '#007AFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MessageSquare size={20} /></div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Inquiry from {c.other_participant_name || 'Guest'}</h4>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Last message: {c.last_message_preview || 'No messages yet'}</p>
                      </div>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>{c.updated_at}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'payouts' && (
              <motion.div
                key="payouts"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 28, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                        {['Transaction ID', 'Amount', 'Method', 'Date', 'Status'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '20px 24px', fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.filter(b => b.status === 'confirmed').length === 0 ? (
                        <tr><td colSpan={5} style={{ padding: 60, textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No payment history available.</td></tr>
                      ) : bookings.filter(b => b.status === 'confirmed').map(b => (
                        <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '20px 24px', fontFamily: 'monospace', fontSize: 12 }}>TRX-{b.booking_reference}</td>
                          <td style={{ padding: '20px 24px', fontWeight: 600, color: '#1FBF85' }}>+₹{b.total_price || '0.00'}</td>
                          <td style={{ padding: '20px 24px', color: 'rgba(255,255,255,0.5)' }}>Direct Deposit</td>
                          <td style={{ padding: '20px 24px', color: 'rgba(255,255,255,0.5)' }}>{b.created_at?.split('T')[0] || 'Recently'}</td>
                          <td style={{ padding: '20px 24px' }}><span style={{ color: '#1FBF85', fontSize: 12, fontWeight: 600 }}>PROCESSED</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="glass-card" style={{ maxWidth: 600, padding: 40, borderRadius: 32, background: 'rgba(255,255,255,0.02)' }}>
                  <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 32 }}>Business Profile</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div className="input-group">
                      <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>BUSINESS NAME</label>
                      <input
                        type="text"
                        value={profile.display_name}
                        onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                        placeholder="Your Luxury Brand"
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, color: '#fff' }}
                      />
                    </div>
                    <div className="input-group">
                      <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>SUPPORT EMAIL</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        placeholder="hello@brand.com"
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, color: '#fff' }}
                      />
                    </div>
                    <div className="input-group">
                      <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>PHONE NUMBER</label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, color: '#fff' }}
                      />
                    </div>
                    <button
                      onClick={handleUpdateProfile}
                      className="btn-primary"
                      style={{ padding: 18, borderRadius: 16, marginTop: 16, fontWeight: 600 }}
                    >
                      Update Profile
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
