import { Link } from 'react-router-dom';

const tagColors = {
  Trending: { bg: '#FFF3CD', color: '#B45309', border: '#F6C84B' },
  Popular:  { bg: '#D1FAE5', color: '#065F46', border: '#34D399' },
  New:      { bg: '#DBEAFE', color: '#1E3A8A', border: '#60A5FA' },
  Luxury:   { bg: '#F3E8FF', color: '#6B21A8', border: '#C084FC' },
};

export default function DestinationCard({ destination }) {
  const { id, name, category, rating, price, image, tag } = destination;
  const ts = tagColors[tag] || tagColors['New'];
  return (
    <div className="card" style={{ cursor: 'pointer' }}>
      <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        <img src={image || `https://source.unsplash.com/400x300/?${name}`} alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {tag && (
          <span style={{
            position: 'absolute', top: 12, left: 12,
            background: ts.bg, color: ts.color, border: `1px solid ${ts.border}`,
            borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700,
          }}>{tag}</span>
        )}
        <span style={{
          position: 'absolute', top: 12, right: 12,
          background: 'rgba(0,0,0,0.45)', color: '#fff',
          borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600,
        }}>⭐ {rating}</span>
      </div>
      <div style={{ padding: '16px 18px 18px' }}>
        <div style={{ color: '#0E7C5B', fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{category}</div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0D1B2A', margin: '0 0 12px' }}>{name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#0E7C5B' }}>{price}</span>
            <span style={{ color: '#9CA3AF', fontSize: 12, marginLeft: 4 }}>/person</span>
          </div>
          <Link to={`/destinations/${id}`} style={{
            background: 'linear-gradient(135deg,#0E7C5B,#1FBF85)',
            color: '#fff', padding: '8px 18px', borderRadius: 20,
            fontSize: 13, fontWeight: 600,
          }}>Book Now</Link>
        </div>
      </div>
    </div>
  );
}
