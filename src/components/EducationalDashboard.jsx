import React, { useState, useEffect } from 'react';

// Componente Card con estado propio
const Card = ({ title, description, icon: Icon, className = "" }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className={`
                relative overflow-hidden p-6 rounded-xl
                bg-gradient-to-br from-gray-900/80 to-black
                border border-gray-800 backdrop-blur-sm
                transform transition-all duration-500
                hover:scale-105 hover:shadow-2xl
                ${className}
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 rounded-lg bg-gray-800/50">
                        <Icon />
                    </div>
                    <h4 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                        {title}
                    </h4>
                </div>
                <p className="text-gray-400 leading-relaxed">
                    {description}
                </p>
            </div>
            {isHovered && (
                <div className="absolute inset-0 bg-white/5 rounded-xl animate-pulse-slow" />
            )}
        </div>
    );
};

// Componente de Acción Animada
const AnimatedActionItem = ({ title, description, icon: Icon }) => (
    <div className="group p-4 bg-black/20 rounded-lg border border-gray-800 hover:border-blue-500/30 transition-all duration-300">
        <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-900/30 group-hover:bg-blue-900/50 transition-all">
                <Icon />
            </div>
            <div>
                <h5 className="font-semibold text-blue-300">{title}</h5>
                <p className="text-gray-400 text-sm">{description}</p>
            </div>
        </div>
    </div>
);

// Componente de Tarjeta de Demandas
const DemandCard = ({ title, icon: Icon, demands }) => (
    <div className="p-6 bg-gradient-to-br from-purple-600/20 to-purple-900/20 rounded-xl border border-purple-500/30">
        <div className="flex items-center gap-4 mb-4">
            <div className="p-2 rounded-lg bg-black/20">
                <Icon />
            </div>
            <h4 className="text-xl font-bold text-purple-400">{title}</h4>
        </div>
        <ul className="space-y-3">
            {demands.map((demand, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    {demand}
                </li>
            ))}
        </ul>
    </div>
);

// Componentes de Iconos SVG Animados
const CustomIcons = {
    Earth: () => (
        <svg viewBox="0 0 24 24" className="w-8 h-8">
            <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="animate-pulse-slow"
            >
                <animate
                    attributeName="r"
                    values="10;9;10"
                    dur="3s"
                    repeatCount="indefinite"
                />
            </circle>
            <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                fill="currentColor"
                className="text-emerald-500"
            >
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 12 12"
                    to="360 12 12"
                    dur="20s"
                    repeatCount="indefinite"
                />
            </path>
        </svg>
    ),
    Protest: () => (
        <svg viewBox="0 0 24 24" className="w-8 h-8">
            <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-blue-500"
            >
                <animate
                    attributeName="stroke-dasharray"
                    values="1,150;150,1"
                    dur="2s"
                    repeatCount="indefinite"
                />
            </path>
        </svg>
    ),
    Warning: () => (
        <svg viewBox="0 0 24 24" className="w-8 h-8">
            <path
                d="M12 2L2 22h20L12 2z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-red-500"
            >
                <animate
                    attributeName="stroke-dasharray"
                    values="0,100;100,0"
                    dur="2s"
                    repeatCount="indefinite"
                />
            </path>
            <line
                x1="12"
                y1="9"
                x2="12"
                y2="15"
                stroke="currentColor"
                strokeWidth="2"
            >
                <animate
                    attributeName="strokeOpacity"
                    values="0;1;1;0"
                    dur="1.5s"
                    repeatCount="indefinite"
                />
            </line>
        </svg>
    ),
    Fire: () => (
        <svg viewBox="0 0 24 24" className="w-8 h-8">
            <path
                d="M12 2c0 0-3 4-3 6c0 1.5 1 2 1 2s-1.5-0.5-1.5 1c0 1.5 1 2 1 2s-1.5-0.5-1.5 1c0 1.5 3 2 3 2s-1.5-0.5-1.5 1c0 1.5 1.5 2 1.5 2s-1.5-0.5-1.5 1c0 1.5 3 2 3 2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-orange-500"
            >
                <animate
                    attributeName="d"
                    values="M12 2c0 0-3 4-3 6c0 1.5 1 2 1 2s-1.5-0.5-1.5 1c0 1.5 1 2 1 2s-1.5-0.5-1.5 1c0 1.5 3 2 3 2s-1.5-0.5-1.5 1c0 1.5 1.5 2 1.5 2s-1.5-0.5-1.5 1c0 1.5 3 2 3 2;M12 2c0 0-2 4-2 6c0 1.5 1.5 2 1.5 2s-1-0.5-1 1c0 1.5 1.5 2 1.5 2s-1-0.5-1 1c0 1.5 2 2 2 2s-1-0.5-1 1c0 1.5 1.5 2 1.5 2s-1-0.5-1 1c0 1.5 2 2 2 2"
                    dur="0.5s"
                    repeatCount="indefinite"
                />
            </path>
        </svg>
    ),
    Wave: () => (
        <svg viewBox="0 0 24 24" className="w-8 h-8">
            <path
                d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-blue-400"
            >
                <animate
                    attributeName="d"
                    values="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z;M2 12s4-4 10-4 10 4 10 4-4 4-10 4-10-4-10-4z;M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z"
                    dur="3s"
                    repeatCount="indefinite"
                />
            </path>
        </svg>
    )
};
// Configuración de secciones
const sections = [
    {
        id: 'purpose',
        icon: CustomIcons.Earth,
        label: 'Misión Global',
        color: 'from-emerald-600 to-green-800',
        gradient: 'from-emerald-900/50 to-green-900/50'
    },
    {
        id: 'crisis',
        icon: CustomIcons.Fire,
        label: 'Crisis Climática',
        color: 'from-red-600 to-orange-700',
        gradient: 'from-red-900/50 to-orange-900/50'
    },
    {
        id: 'action',
        icon: CustomIcons.Protest,
        label: 'Acción Ciudadana',
        color: 'from-blue-600 to-indigo-800',
        gradient: 'from-blue-900/50 to-indigo-900/50'
    },
    {
        id: 'demands',
        icon: CustomIcons.Warning,
        label: 'Exigencias',
        color: 'from-purple-600 to-pink-700',
        gradient: 'from-purple-900/50 to-pink-900/50'
    }
];

const ClimateActionDashboard = ({ isVisible, onClose }) => {
    const [activeSection, setActiveSection] = useState('purpose');
    const [animateElements, setAnimateElements] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setAnimateElements(true);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50">
            <div className="h-full overflow-y-auto">
                <div className="container mx-auto p-4">
                    <div className="w-full max-w-7xl mx-auto bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                        {/* Header con posición sticky */}
                        <div className="sticky top-0 z-20 bg-gradient-to-br from-gray-900 to-black">
                            <div className="relative p-8 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 animate-pulse-slow"></div>
                                <div className="relative z-10 flex justify-between items-center">
                                    <div className="flex items-center gap-6">
                                        <CustomIcons.Earth />
                                        <div>
                                            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-300">
                                                Acción por el Clima
                                            </h2>
                                            <p className="text-gray-400 mt-2">Unidos por un futuro sostenible</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            document.body.style.overflow = 'unset';
                                            onClose();
                                        }}
                                        className="p-3 rounded-xl hover:bg-gray-800/50 transition-all duration-300 group"
                                    >
                                        <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-400 group-hover:text-red-400">
                                            <path
                                                d="M18 6L6 18M6 6l12 12"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Navegación pegajosa */}
                            <nav className="flex gap-3 p-4 bg-black/50 overflow-x-auto">
                                {sections.map(section => (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`
                                            relative group flex items-center gap-3 px-6 py-3 rounded-xl
                                            transition-all duration-500 whitespace-nowrap
                                            ${activeSection === section.id
                                                ? `bg-gradient-to-r ${section.color} shadow-lg scale-105`
                                                : 'bg-gray-800/50 hover:bg-gray-700/50'
                                            }
                                        `}
                                    >
                                        <section.icon />
                                        <span className="font-medium">{section.label}</span>
                                        {activeSection === section.id && (
                                            <div className="absolute inset-0 bg-white/10 rounded-xl animate-pulse-slow"></div>
                                        )}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Contenido con scroll */}
                        <div className="p-6">
                            {activeSection === 'purpose' && (
                                <div className="space-y-6 animate-fadeIn">
                                    <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">
                                        Nuestra Misión por el Planeta
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Card
                                            title="Visualización de Impacto"
                                            description="Creamos consciencia sobre la crisis climática a través de datos visuales impactantes y análisis en tiempo real de las emisiones globales."
                                            icon={CustomIcons.Earth}
                                            className="border-emerald-500/20"
                                        />
                                        <Card
                                            title="Educación Ambiental"
                                            description="Proporcionamos información clara y actualizada sobre el cambio climático y sus efectos en nuestro planeta y sociedades."
                                            icon={CustomIcons.Wave}
                                            className="border-emerald-500/20"
                                        />
                                        <Card
                                            title="Movilización Global"
                                            description="Conectamos activistas y organizaciones para crear un movimiento global unificado por la justicia climática."
                                            icon={CustomIcons.Protest}
                                            className="border-emerald-500/20"
                                        />
                                        <Card
                                            title="Soluciones Climáticas"
                                            description="Proponemos y promovemos soluciones concretas para la reducción de emisiones y la transición hacia energías renovables."
                                            icon={CustomIcons.Fire}
                                            className="border-emerald-500/20"
                                        />
                                    </div>
                                </div>
                            )}
                            {activeSection === 'crisis' && (
                                <div className="space-y-6 animate-fadeIn">
                                    <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-300">
                                        Crisis Climática: La Cuenta Regresiva
                                    </h3>
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div className="lg:col-span-2">
                                            <div className="bg-black/40 p-6 rounded-xl border border-red-500/30 space-y-4">
                                                <h4 className="text-2xl font-bold text-red-400">Punto de No Retorno</h4>
                                                <div className="relative overflow-hidden rounded-lg h-48 bg-gray-900/50">
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="text-center">
                                                            <div className="text-4xl font-bold text-red-500">1.5°C</div>
                                                            <div className="text-gray-400">Límite crítico de calentamiento</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-gray-300">
                                                    Estamos peligrosamente cerca del punto de no retorno. Las emisiones actuales
                                                    nos llevan a un calentamiento catastrófico si no actuamos ahora.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <Card
                                                title="Impacto Global"
                                                description="Los efectos del cambio climático ya son evidentes: eventos extremos, pérdida de biodiversidad y riesgo para millones."
                                                icon={CustomIcons.Warning}
                                                className="border-red-500/20"
                                            />
                                            <Card
                                                title="Tiempo Limitado"
                                                description="Científicos advierten que tenemos menos de una década para realizar cambios drásticos y evitar daños irreversibles."
                                                icon={CustomIcons.Fire}
                                                className="border-red-500/20"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'action' && (
                                <div className="space-y-6 animate-fadeIn">
                                    <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                                        Acción Climática: El Momento es Ahora
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="bg-black/40 p-6 rounded-xl border border-blue-500/30">
                                            <div className="flex items-center gap-4 mb-6">
                                                <CustomIcons.Wave />
                                                <h4 className="text-2xl font-bold text-blue-400">Acciones Individuales</h4>
                                            </div>
                                            <div className="space-y-4">
                                                <AnimatedActionItem
                                                    title="Reduce tu Huella de Carbono"
                                                    description="Calcula y reduce tu impacto personal en el planeta."
                                                    icon={CustomIcons.Earth}
                                                />
                                                <AnimatedActionItem
                                                    title="Transporte Sostenible"
                                                    description="Utiliza bicicleta, transporte público o vehículos eléctricos."
                                                    icon={CustomIcons.Wave}
                                                />
                                                <AnimatedActionItem
                                                    title="Consumo Consciente"
                                                    description="Elige productos locales y reduce el desperdicio."
                                                    icon={CustomIcons.Fire}
                                                />
                                                <button className="w-full py-3 mt-4 bg-blue-600/20 hover:bg-blue-600/40 rounded-lg border border-blue-500/30 transition-all duration-300">
                                                    Calcula tu Impacto →
                                                </button>
                                            </div>
                                        </div>

                                        <div className="bg-black/40 p-6 rounded-xl border border-indigo-500/30">
                                            <div className="flex items-center gap-4 mb-6">
                                                <CustomIcons.Protest />
                                                <h4 className="text-2xl font-bold text-indigo-400">Acción Comunitaria</h4>
                                            </div>
                                            <div className="space-y-4">
                                                <AnimatedActionItem
                                                    title="Únete a Movimientos"
                                                    description="Participa en organizaciones locales y globales por el clima."
                                                    icon={CustomIcons.Protest}
                                                />
                                                <AnimatedActionItem
                                                    title="Educa e Inspira"
                                                    description="Comparte conocimiento y motiva a otros a actuar."
                                                    icon={CustomIcons.Wave}
                                                />
                                                <AnimatedActionItem
                                                    title="Proyectos Locales"
                                                    description="Inicia o únete a proyectos de sostenibilidad en tu comunidad."
                                                    icon={CustomIcons.Earth}
                                                />
                                                <button className="w-full py-3 mt-4 bg-indigo-600/20 hover:bg-indigo-600/40 rounded-lg border border-indigo-500/30 transition-all duration-300">
                                                    Encuentra Grupos Locales →
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative mt-8 p-6 bg-black/40 rounded-xl border border-blue-500/30">
                                        <h4 className="text-2xl font-bold text-blue-400 mb-4">Impacto Global de la Acción Climática</h4>
                                        <div className="aspect-video bg-gray-900/50 rounded-lg overflow-hidden relative">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="text-center">
                                                    <div className="text-4xl font-bold text-blue-500">2.1M+</div>
                                                    <div className="text-gray-400">Activistas Unidos Globalmente</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'demands' && (
                                <div className="space-y-6 animate-fadeIn">
                                    <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
                                        Exigencias para el Cambio
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <DemandCard
                                            title="Para Gobiernos"
                                            icon={CustomIcons.Warning}
                                            demands={[
                                                "Declaración de emergencia climática",
                                                "100% energías renovables para 2035",
                                                "Fin de subsidios a combustibles fósiles",
                                                "Leyes estrictas de protección ambiental"
                                            ]}
                                        />
                                        
                                        <DemandCard
                                            title="Para Empresas"
                                            icon={CustomIcons.Fire}
                                            demands={[
                                                "Neutralidad de carbono para 2030",
                                                "Transparencia en emisiones",
                                                "Inversión en tecnologías limpias",
                                                "Cadenas de suministro sostenibles"
                                            ]}
                                        />
                                        
                                        <DemandCard
                                            title="Para Instituciones"
                                            icon={CustomIcons.Earth}
                                            demands={[
                                                "Desinversión de combustibles fósiles",
                                                "Educación climática obligatoria",
                                                "Investigación en soluciones verdes",
                                                "Políticas de cero residuos"
                                            ]}
                                        />
                                    </div>

                                    <div className="mt-8 p-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-500/30">
                                        <div className="text-center space-y-4">
                                            <h4 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
                                                ¡Únete al Movimiento!
                                            </h4>
                                            <p className="text-gray-300 max-w-2xl mx-auto">
                                                El tiempo de actuar es ahora. Cada voz cuenta, cada acción suma. 
                                                Juntos podemos crear el cambio que nuestro planeta necesita.
                                            </p>
                                            <div className="flex justify-center mt-6">
                                                <button className="px-6 py-3 bg-pink-600 hover:bg-pink-500 rounded-lg transition-all duration-300">
                                                    Comparte el Mensaje
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                ::-webkit-scrollbar {
                    width: 8px;
                }

                ::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.1);
                }

                ::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 4px;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.3);
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes pulse-slow {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }

                .animate-pulse-slow {
                    animation: pulse-slow 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default ClimateActionDashboard;