import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Calendar, CheckCircle, ShieldCheck } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../utils/api";

const STEPS = ["Details", "Payment", "Confirm"];

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const type = new URLSearchParams(location.search).get("type") || "tours";

  const [data, setData] = useState(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ checkIn: "", checkOut: "", guests: 1, promoCode: "", cardName: "", cardNumber: "", expiry: "", cvv: "" });
  const [loading, setLoading] = useState(true);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/destinations/${type}/${id}/`)
      .then(res => setData(res.data))
      .catch(err => toast.error("Failed to load booking details"))
      .finally(() => setLoading(false));
  }, [id, type]);

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--accent)', borderTopColor: 'transparent' }} /></div>;
  if (!data) return null;

  const price = data.base_price || data.price_per_night || data.hourly_rate || 0;
  const itemName = data.name || data.guide_name;
  const nights = form.checkIn && form.checkOut && type === 'hotels' ? Math.max(1, Math.ceil((new Date(form.checkOut) - new Date(form.checkIn)) / (86400000))) : (data.duration_days || 1);
  const subtotal = price * form.guests * nights;
  const discount = subtotal * (discountPercent / 100);
  const total = subtotal - discount;

  const inputClass = { width: "100%", padding: "14px 16px", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "12px", fontSize: "15px", fontFamily: "inherit", background: "var(--bg-secondary)", transition: "all 0.2s" };
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleApplyPromo = async () => {
    if (!form.promoCode) return;
    try {
      const res = await api.post('/bookings/validate-promo/', { code: form.promoCode });
      if (res.data.valid) {
        setDiscountPercent(res.data.discount);
        toast.success(`${res.data.discount}% discount applied!`);
      } else {
        setDiscountPercent(0);
        toast.error("Invalid promo code");
      }
    } catch (err) {
      setDiscountPercent(0);
      toast.error("Invalid promo code");
    }
  };

  const handleNext = async () => {
    if (step < 2) {
      setStep(s => s + 1);
      return;
    }

    try {
      setIsSubmitting(true);
      const bookingData = {
        booking_type: type.slice(0, -1), // tours -> tour
        check_in: form.checkIn,
        check_out: form.checkOut,
        guests: form.guests,
        total_price: total,
        promo_code: form.promoCode,
        discount_amount: discount
      };

      if (type === 'tours') bookingData.tour = id;
      else if (type === 'hotels') bookingData.hotel = id;
      else if (type === 'guides') bookingData.guide_service = id;

      await api.post('/bookings/', bookingData);
      toast.success("Booking confirmed! 🎉");
      navigate("/my-bookings");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Booking failed. Please check your dates.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-secondary)", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div className="container" style={{ paddingTop: 100, paddingBottom: 80, flex: 1 }}>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ maxWidth: 1000, margin: "0 auto" }}>

          <h1 className="title-lg" style={{ marginBottom: 40 }}>Complete Your Booking</h1>

          {/* Progress Bar */}
          <div style={{ display: "flex", gap: 12, marginBottom: 40 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: i <= step ? "var(--accent)" : "rgba(0,0,0,0.05)", color: i <= step ? "#fff" : "var(--text-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600 }}>
                  {i < step ? <CheckCircle size={16} /> : i + 1}
                </div>
                <span className="title-md" style={{ fontSize: 16, color: i <= step ? "var(--text-primary)" : "var(--text-secondary)" }}>{s}</span>
                {i < STEPS.length - 1 && <div style={{ width: 40, height: 2, background: i < step ? "var(--accent)" : "rgba(0,0,0,0.05)" }} />}
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 40 }}>

            {/* Form Area */}
            <div className="glass" style={{ background: "var(--bg-color)", borderRadius: "var(--radius-xl)", padding: 40, boxShadow: "var(--shadow-card)" }}>
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} transition={{ duration: 0.3 }}>

                  {step === 0 && (
                    <div>
                      <h2 className="title-md" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}><Calendar size={24} color="var(--accent)" /> Reservation Details</h2>
                      <div style={{ display: "grid", gap: 20 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                          <div><label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>Check In</label><input type="date" value={form.checkIn} onChange={set("checkIn")} style={inputClass} /></div>
                          <div><label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>Check Out</label><input type="date" value={form.checkOut} onChange={set("checkOut")} style={inputClass} /></div>
                        </div>
                        <div>
                          <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>Guests</label>
                          <select value={form.guests} onChange={set("guests")} style={inputClass}>{[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? "s" : ""}</option>)}</select>
                        </div>
                        <div>
                          <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>Promo Code</label>
                          <div style={{ display: "flex", gap: 12 }}>
                            <input value={form.promoCode} onChange={set("promoCode")} placeholder="Enter code" style={{ ...inputClass, flex: 1 }} />
                            <button onClick={handleApplyPromo} className="btn-outline" style={{ padding: "0 24px", borderRadius: 12 }}>Apply</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div>
                      <h2 className="title-md" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}><CreditCard size={24} color="var(--accent)" /> Payment Secure</h2>
                      <div style={{ display: "grid", gap: 20 }}>
                        <div><label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>Name on Card</label><input value={form.cardName} onChange={set("cardName")} placeholder="John Appleseed" style={inputClass} /></div>
                        <div><label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>Card Number</label><input value={form.cardNumber} onChange={set("cardNumber")} placeholder="0000 0000 0000 0000" style={inputClass} maxLength={19} /></div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                          <div><label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>Expiry</label><input value={form.expiry} onChange={set("expiry")} placeholder="MM/YY" style={inputClass} maxLength={5} /></div>
                          <div><label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>CVV</label><input value={form.cvv} onChange={set("cvv")} placeholder="123" style={inputClass} maxLength={3} type="password" /></div>
                        </div>
                        <div style={{ display: "flex", gap: 12, alignItems: "center", background: "rgba(0,113,227,0.05)", padding: 16, borderRadius: 12 }}>
                          <ShieldCheck size={20} color="var(--accent)" />
                          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Payments are 256-bit encrypted and secure.</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <h2 className="title-md" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle size={24} color="var(--accent)" /> Final Confirmation</h2>
                      <div style={{ background: "var(--bg-secondary)", borderRadius: 16, padding: 24, marginBottom: 24 }}>
                        <h3 className="title-md" style={{ marginBottom: 16 }}>{itemName}</h3>
                        {[["Service Type", type], ["Check In", form.checkIn || "—"], ["Check Out", form.checkOut || "—"], ["Guests", form.guests]].map(([k, v]) => (
                          <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 12 }}>
                            <span style={{ color: "var(--text-secondary)" }}>{k}</span><span style={{ fontWeight: 500, color: "var(--text-primary)" }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 16, marginTop: 40 }}>
                    {step > 0 && <button onClick={() => setStep(s => s - 1)} disabled={isSubmitting} className="btn-outline" style={{ flex: 1, padding: "16px", borderRadius: 16 }}>Back</button>}
                    <button onClick={handleNext} disabled={isSubmitting} className="btn-primary" style={{ flex: 2, padding: "16px", borderRadius: 16, fontSize: 16 }}>
                      {isSubmitting ? "Processing..." : step === 2 ? `Pay ₹${total.toFixed(0)}` : "Continue to Next Step"}
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Receipt Summary Card */}
            <div style={{ background: "var(--bg-color)", borderRadius: "var(--radius-xl)", padding: 32, boxShadow: "var(--shadow-card)", height: "fit-content", position: "sticky", top: 100 }}>
              {data.main_image ? (
                <img src={data.main_image} alt={itemName} style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 16, marginBottom: 20 }} />
              ) : (
                <div style={{ width: '100%', height: 180, background: '#e5e5ea', borderRadius: 16, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#86868b' }}>No image</div>
              )}
              <h3 className="title-md" style={{ marginBottom: 8, fontSize: 20 }}>{itemName}</h3>
              <p className="text-body" style={{ fontSize: 13, marginBottom: 24 }}>{data.location}</p>

              <div style={{ borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: 20, display: 'grid', gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <span style={{ color: "var(--text-secondary)" }}>Base Price</span><span style={{ fontWeight: 500 }}>₹{price}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <span style={{ color: "var(--text-secondary)" }}>{type === 'hotels' ? "Nights" : "Duration"} × Guests</span><span style={{ fontWeight: 500 }}>{nights} × {form.guests}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#1FBF85" }}>
                    <span>Discount (TOUR20)</span><span style={{ fontWeight: 600 }}>-₹{discount.toFixed(0)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 700, color: "var(--text-primary)", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: 16, marginTop: 8 }}>
                  <span>Total</span><span>₹{total.toFixed(0)}</span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
