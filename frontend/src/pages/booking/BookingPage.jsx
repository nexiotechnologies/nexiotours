import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import toast from 'react-hot-toast';

const STEPS = ['Details', 'Travelers', 'Payment', 'Confirm'];

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    checkIn: '', checkOut: '', guests: 1, roomType: 'standard',
    firstName: '', lastName: '', email: '', phone: '',
    promoCode: '', cardNumber: '', expiry: '', cvv: '', cardName: '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep(s => Math.max(s - 1, 0));

  const handleConfirm = async () => {
    toast.success('Booking confirmed! Check your email for details.');
    navigate('/my-bookings');
  };

  const dest = { name: 'Bali, Indonesia', price: 899, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80' };
  const total = dest.price * form.guests;

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAF9' }}>
      <Navbar />
      <div style={{ maxWidth:960, margin:'0 auto', padding:'100px 24px 60px' }}>
        <h1 style={{ fontSize:28, fontWeight:800, marginBottom:8 }}>Complete Your Booking</h1>
        <p style={{ color:'#9CA3AF', marginBottom:36, fontSize:14 }}>{dest.name}</p>

        {/* Step indicators */}
        <div style={{ display:'flex', gap:0, marginBottom:40 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display:'flex', alignItems:'center', flex: i < STEPS.length-1 ? 1 : 'none' }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                <div style={{ width:34, height:34, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:13, background: i <= step ? '#0E7C5B' : '#E5E7EB', color: i <= step ? '#fff' : '#9CA3AF', transition:'all 0.3s' }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{ fontSize:11, fontWeight:600, color: i <= step ? '#0E7C5B' : '#9CA3AF', whiteSpace:'nowrap' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ flex:1, height:2, background: i < step ? '#0E7C5B' : '#E5E7EB', margin:'0 8px', marginBottom:20, transition:'background 0.3s' }} />}
            </div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:28 }}>
          <div style={{ background:'#fff', borderRadius:20, padding:32, boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
            {step === 0 && (
              <>
                <h2 style={{ fontSize:18, fontWeight:700, marginBottom:22 }}>Trip Details</h2>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                  <div className="form-group">
                    <label className="form-label">Check-In Date</label>
                    <input className="form-input" type="date" value={form.checkIn} onChange={e => set('checkIn', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Check-Out Date</label>
                    <input className="form-input" type="date" value={form.checkOut} onChange={e => set('checkOut', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Number of Guests</label>
                  <input className="form-input" type="number" min={1} max={20} value={form.guests} onChange={e => set('guests', parseInt(e.target.value))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Room / Package Type</label>
                  <select className="form-input" value={form.roomType} onChange={e => set('roomType', e.target.value)}>
                    <option value="standard">Standard Package</option>
                    <option value="deluxe">Deluxe Package (+₹200)</option>
                    <option value="luxury">Luxury Package (+₹500)</option>
                  </select>
                </div>
              </>
            )}
            {step === 1 && (
              <>
                <h2 style={{ fontSize:18, fontWeight:700, marginBottom:22 }}>Traveler Information</h2>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input className="form-input" value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="John" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input className="form-input" value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Doe" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="john@example.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 234 567 8900" />
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <h2 style={{ fontSize:18, fontWeight:700, marginBottom:22 }}>Payment Details</h2>
                <div className="form-group">
                  <label className="form-label">Promo Code</label>
                  <div style={{ display:'flex', gap:10 }}>
                    <input className="form-input" value={form.promoCode} onChange={e => set('promoCode', e.target.value)} placeholder="Enter promo code" style={{ flex:1 }} />
                    <button style={{ padding:'10px 20px', background:'#F0FDF4', border:'2px solid #0E7C5B', color:'#0E7C5B', borderRadius:8, fontWeight:600, fontSize:13, cursor:'pointer' }}>Apply</button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Cardholder Name</label>
                  <input className="form-input" value={form.cardName} onChange={e => set('cardName', e.target.value)} placeholder="John Doe" />
                </div>
                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input className="form-input" value={form.cardNumber} onChange={e => set('cardNumber', e.target.value)} placeholder="1234 5678 9012 3456" maxLength={19} />
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                  <div className="form-group">
                    <label className="form-label">Expiry</label>
                    <input className="form-input" value={form.expiry} onChange={e => set('expiry', e.target.value)} placeholder="MM/YY" maxLength={5} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input className="form-input" value={form.cvv} onChange={e => set('cvv', e.target.value)} placeholder="123" maxLength={3} />
                  </div>
                </div>
              </>
            )}
            {step === 3 && (
              <div style={{ textAlign:'center', padding:'20px 0' }}>
                <div style={{ fontSize:60, marginBottom:16 }}>🎉</div>
                <h2 style={{ fontSize:22, fontWeight:800, marginBottom:10 }}>Confirm Your Booking</h2>
                <p style={{ color:'#4A4A6A', marginBottom:28, fontSize:14 }}>Please review your booking details before confirming.</p>
                <div style={{ background:'#F9FAFB', borderRadius:14, padding:20, textAlign:'left', marginBottom:24 }}>
                  {[['Destination', dest.name],['Check-In', form.checkIn || 'Not set'],['Check-Out', form.checkOut || 'Not set'],['Guests', form.guests],['Package', form.roomType],['Total', `₹${total}`]].map(([k,v]) => (
                    <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #E5E7EB', fontSize:14 }}>
                      <span style={{ color:'#9CA3AF' }}>{k}</span>
                      <span style={{ fontWeight:600, color:'#0D1B2A' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display:'flex', justifyContent:'space-between', marginTop:24 }}>
              {step > 0 && <button onClick={back} style={{ padding:'12px 28px', border:'2px solid #E5E7EB', borderRadius:12, background:'#fff', color:'#4A4A6A', fontWeight:600, fontSize:14, cursor:'pointer' }}>← Back</button>}
              {step < STEPS.length - 1 ? (
                <button onClick={next} style={{ marginLeft:'auto', padding:'12px 32px', background:'linear-gradient(135deg,#0E7C5B,#1FBF85)', border:'none', color:'#fff', borderRadius:12, fontWeight:700, fontSize:14, cursor:'pointer', boxShadow:'0 4px 14px rgba(14,124,91,0.3)' }}>Continue →</button>
              ) : (
                <button onClick={handleConfirm} style={{ marginLeft:'auto', padding:'12px 32px', background:'linear-gradient(135deg,#0E7C5B,#1FBF85)', border:'none', color:'#fff', borderRadius:12, fontWeight:700, fontSize:14, cursor:'pointer', boxShadow:'0 4px 14px rgba(14,124,91,0.3)' }}>Confirm Booking ✓</button>
              )}
            </div>
          </div>

          {/* Summary */}
          <div style={{ background:'#fff', borderRadius:20, padding:24, boxShadow:'0 2px 12px rgba(0,0,0,0.06)', alignSelf:'start', position:'sticky', top:84 }}>
            <img src={dest.image} alt={dest.name} style={{ width:'100%', height:140, objectFit:'cover', borderRadius:12, marginBottom:16 }} />
            <h3 style={{ fontSize:16, fontWeight:700, marginBottom:4 }}>{dest.name}</h3>
            <div style={{ color:'#9CA3AF', fontSize:13, marginBottom:18 }}>7 Days / 6 Nights</div>
            <div style={{ borderTop:'1px solid #F3F4F6', paddingTop:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#9CA3AF', marginBottom:8 }}>
                <span>₹{dest.price} × {form.guests} guests</span><span>₹{dest.price * form.guests}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#9CA3AF', marginBottom:14 }}>
                <span>Taxes & fees</span><span>₹0</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:16, fontWeight:800, color:'#0D1B2A' }}>
                <span>Total</span><span style={{ color:'#0E7C5B' }}>₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
