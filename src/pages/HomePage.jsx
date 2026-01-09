const HomePage = () => {
    return (
        <div style={{ padding: '40px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
                    Bienvenido a RentExpress
                </h1>
                <p style={{ fontSize: '1.3rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
                    Tu solución de alquiler de vehículos de confianza
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginTop: '40px' }}>
                <div style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🚗</div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>
                        Amplio Catálogo
                    </h3>
                    <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                        Encuentra el vehículo perfecto para tus necesidades
                    </p>
                </div>

                <div style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '16px' }}>⚡</div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>
                        Proceso Rápido
                    </h3>
                    <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                        Reserva y alquila en pocos minutos
                    </p>
                </div>

                <div style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🏆</div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>
                        Mejor Servicio
                    </h3>
                    <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                        Atención al cliente 24/7 para tu tranquilidad
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;