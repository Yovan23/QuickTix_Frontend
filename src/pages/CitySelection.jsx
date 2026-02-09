import { useState } from 'react';
import { MapPin, Search, ArrowRight, Building2 } from 'lucide-react';

// Static city list — cityId matches the cityId in your theatre API response
const CITIES = [
    { cityId: 1, name: 'Mumbai', state: 'Maharashtra' },
    { cityId: 2, name: 'Pune', state: 'Maharashtra' },
    { cityId: 3, name: 'Bangalore', state: 'Karnataka' },
    { cityId: 4, name: 'Delhi', state: 'Delhi' },
    { cityId: 5, name: 'Chennai', state: 'Tamil Nadu' },
    { cityId: 6, name: 'Hyderabad', state: 'Telangana' },
    { cityId: 7, name: 'Kolkata', state: 'West Bengal' },
    { cityId: 8, name: 'Ahmedabad', state: 'Gujarat' },
];

export function CitySelection({ onCitySelected }) {
    const [search, setSearch] = useState('');
    const [hoveredCity, setHoveredCity] = useState(null);

    const filtered = CITIES.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.state.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (city) => {
        localStorage.setItem('selectedCityId', String(city.cityId));
        localStorage.setItem('selectedCityName', city.name);
        onCitySelected(city);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0f0f14',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            fontFamily: "'Sora', sans-serif",
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Ambient blobs */}
            <div style={{
                position: 'absolute', top: '-120px', left: '-120px',
                width: '360px', height: '360px',
                borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', bottom: '-100px', right: '-100px',
                width: '300px', height: '300px',
                borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            <div style={{ width: '100%', maxWidth: '560px', position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
                        borderRadius: '50px', padding: '6px 16px', marginBottom: '20px',
                    }}>
                        <MapPin size={14} color="#818cf8" />
                        <span style={{ color: '#818cf8', fontSize: '13px', fontWeight: 600, letterSpacing: '0.5px' }}>
                            PICK YOUR CITY
                        </span>
                    </div>
                    <h1 style={{
                        color: '#f1f5f9', fontSize: '28px', fontWeight: 700,
                        margin: 0, lineHeight: 1.3,
                    }}>
                        Where do you want to<br />
                        <span style={{
                            background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        }}>watch a movie?</span>
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '14px', marginTop: '10px', marginBottom: 0 }}>
                        Select a city to see nearby theatres and showtimes
                    </p>
                </div>

                {/* Search Box */}
                <div style={{
                    position: 'relative', marginBottom: '24px',
                }}>
                    <Search size={18} color="#64748b" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="text"
                        placeholder="Search city..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '14px 16px 14px 44px',
                            background: 'rgba(30,30,40,0.8)',
                            border: '1px solid rgba(99,102,241,0.2)',
                            borderRadius: '12px',
                            color: '#f1f5f9',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box',
                            transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.2)'}
                    />
                </div>

                {/* City Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '10px',
                }}>
                    {filtered.map((city) => {
                        const isHovered = hoveredCity === city.cityId;
                        return (
                            <button
                                key={city.cityId}
                                onClick={() => handleSelect(city)}
                                onMouseEnter={() => setHoveredCity(city.cityId)}
                                onMouseLeave={() => setHoveredCity(null)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '14px 16px',
                                    background: isHovered ? 'rgba(99,102,241,0.12)' : 'rgba(30,30,40,0.6)',
                                    border: isHovered ? '1px solid rgba(99,102,241,0.45)' : '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    textAlign: 'left',
                                    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                                    boxShadow: isHovered ? '0 6px 20px rgba(99,102,241,0.2)' : 'none',
                                }}
                            >
                                {/* Icon */}
                                <div style={{
                                    width: '38px', height: '38px', borderRadius: '10px',
                                    background: isHovered ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.08)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'background 0.2s',
                                    flexShrink: 0,
                                }}>
                                    <Building2 size={18} color={isHovered ? '#818cf8' : '#6366f1'} />
                                </div>

                                {/* Text */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        color: isHovered ? '#c7d2fe' : '#e2e8f0',
                                        fontSize: '14px', fontWeight: 600,
                                        transition: 'color 0.2s',
                                    }}>
                                        {city.name}
                                    </div>
                                    <div style={{ color: '#64748b', fontSize: '12px' }}>
                                        {city.state}
                                    </div>
                                </div>

                                {/* Arrow on hover */}
                                <ArrowRight
                                    size={16}
                                    color="#818cf8"
                                    style={{
                                        opacity: isHovered ? 1 : 0,
                                        transform: isHovered ? 'translateX(0)' : 'translateX(-4px)',
                                        transition: 'all 0.2s ease',
                                    }}
                                />
                            </button>
                        );
                    })}
                </div>

                {/* Empty search result */}
                {filtered.length === 0 && (
                    <div style={{
                        textAlign: 'center', padding: '40px 20px',
                        border: '1px dashed rgba(99,102,241,0.2)', borderRadius: '12px',
                    }}>
                        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                            No city found matching "<span style={{ color: '#818cf8' }}>{search}</span>"
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}