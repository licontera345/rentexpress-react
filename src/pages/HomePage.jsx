const HomePage = () => {
    return (
        <div className="home-container">
            <div className="home-hero">
                <h1>Bienvenido a RentExpress</h1>
                <p>Tu solución de alquiler de vehículos de confianza</p>
            </div>

            <div className="home-features">
                <div className="feature-card">
                    <div className="feature-icon">🚗</div>
                    <h3>Amplio Catálogo</h3>
                    <p>Encuentra el vehículo perfecto para tus necesidades</p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon">⚡</div>
                    <h3>Proceso Rápido</h3>
                    <p>Reserva y alquila en pocos minutos</p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon">🏆</div>
                    <h3>Mejor Servicio</h3>
                    <p>Atención al cliente 24/7 para tu tranquilidad</p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;