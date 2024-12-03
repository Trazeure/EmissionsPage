import React, { useState, useEffect } from 'react';
import {
    Globe2,
    Flame,
    Wind,
    AlertTriangle,
    Activity,
    X,
    Leaf,
    Cloud
} from 'lucide-react';

// Enhanced Card Component
const Card = ({ title, description, icon: Icon, className = "" }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`
                relative overflow-hidden p-6 rounded-xl
                bg-gradient-to-br from-gray-900/90 to-black
                border border-gray-800/50 backdrop-blur-lg
                transform transition-all duration-500 ease-in-out
                hover:scale-102 hover:shadow-xl hover:shadow-blue-900/20
                group
                ${className}
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 group-hover:from-blue-900/20 group-hover:to-purple-900/20 transition-all duration-500">
                        <Icon className="w-7 h-7 text-blue-400 group-hover:text-blue-300 transition-colors duration-500" />
                    </div>
                    <h4 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-500">
                        {title}
                    </h4>
                </div>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-500">
                    {description}
                </p>
            </div>
            {isHovered && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl animate-pulse-slow" />
            )}
        </div>
    );
};

// Enhanced Action Item Component
const AnimatedActionItem = ({ title, description, icon: Icon }) => (
    <div className="group p-4 bg-gradient-to-br from-black/40 to-gray-900/40 rounded-xl border border-gray-800/50 hover:border-blue-500/30 hover:from-blue-900/10 hover:to-purple-900/10 transition-all duration-500">
        <div className="flex items-center gap-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 group-hover:from-blue-900/30 group-hover:to-purple-900/30 transition-all duration-500">
                <Icon className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-500" />
            </div>
            <div>
                <h5 className="font-semibold text-blue-300 group-hover:text-blue-200 transition-colors duration-500">{title}</h5>
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-500">{description}</p>
            </div>
        </div>
    </div>
);

// Enhanced Demand Card Component
const DemandCard = ({ title, icon: Icon, demands }) => (
    <div className="p-6 bg-gradient-to-br from-purple-900/10 to-blue-900/10 hover:from-purple-900/20 hover:to-blue-900/20 rounded-xl border border-purple-500/20 hover:border-purple-500/30 transition-all duration-500 group">
        <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 group-hover:from-purple-900/30 group-hover:to-blue-900/30 transition-all duration-500">
                <Icon className="w-7 h-7 text-purple-400 group-hover:text-purple-300 transition-colors duration-500" />
            </div>
            <h4 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 group-hover:from-purple-300 group-hover:to-blue-300 transition-all duration-500">
                {title}
            </h4>
        </div>
        <ul className="space-y-4">
            {demands.map((demand, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-300 group-hover:text-gray-200 transition-colors duration-500">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-500" />
                    {demand}
                </li>
            ))}
        </ul>
    </div>
);
// Enhanced Custom Icons with Animations
const CustomIcons = {
    Earth: () => (
        <div className="relative w-8 h-8 group">
            <Globe2
                className="w-8 h-8 text-emerald-400 group-hover:text-emerald-300 transition-colors duration-500 animate-pulse"
                strokeWidth={1.5}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-full blur-xl animate-pulse-slow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
    ),
    Crisis: () => (
        <div className="relative w-8 h-8 group">
            <Flame
                className="w-8 h-8 text-red-400 group-hover:text-red-300 transition-colors duration-500"
                strokeWidth={1.5}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-xl animate-pulse-slow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
    ),
    Action: () => (
        <div className="relative w-8 h-8 group">
            <Activity
                className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors duration-500"
                strokeWidth={1.5}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-xl animate-pulse-slow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
    ),
    Warning: () => (
        <div className="relative w-8 h-8 group">
            <AlertTriangle
                className="w-8 h-8 text-purple-400 group-hover:text-purple-300 transition-colors duration-500"
                strokeWidth={1.5}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse-slow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
    ),
    Wind: () => (
        <div className="relative w-8 h-8 group">
            <Wind
                className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-500"
                strokeWidth={1.5}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse-slow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
    ),
    Leaf: () => (
        <div className="relative w-8 h-8 group">
            <Leaf
                className="w-8 h-8 text-green-400 group-hover:text-green-300 transition-colors duration-500"
                strokeWidth={1.5}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-xl animate-pulse-slow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
    ),
    Cloud: () => (
        <div className="relative w-8 h-8 group">
            <Cloud
                className="w-8 h-8 text-sky-400 group-hover:text-sky-300 transition-colors duration-500"
                strokeWidth={1.5}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse-slow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
    )
};

// Enhanced Section Configuration
const sections = [
    {
        id: 'purpose',
        icon: CustomIcons.Earth,
        label: 'Misión Global',
        color: 'from-emerald-600 to-green-800',
        gradient: 'from-emerald-900/50 to-green-900/50',
        hoverGradient: 'group-hover:from-emerald-800/60 group-hover:to-green-800/60',
        bgGlow: 'from-emerald-500/10 to-green-500/10',
        textGradient: 'from-emerald-400 to-green-300'
    },
    {
        id: 'crisis',
        icon: CustomIcons.Crisis,
        label: 'Crisis Climática',
        color: 'from-red-600 to-orange-700',
        gradient: 'from-red-900/50 to-orange-900/50',
        hoverGradient: 'group-hover:from-red-800/60 group-hover:to-orange-800/60',
        bgGlow: 'from-red-500/10 to-orange-500/10',
        textGradient: 'from-red-400 to-orange-300'
    },
    {
        id: 'action',
        icon: CustomIcons.Action,
        label: 'Acción Ciudadana',
        color: 'from-blue-600 to-indigo-800',
        gradient: 'from-blue-900/50 to-indigo-900/50',
        hoverGradient: 'group-hover:from-blue-800/60 group-hover:to-indigo-800/60',
        bgGlow: 'from-blue-500/10 to-indigo-500/10',
        textGradient: 'from-blue-400 to-indigo-300'
    },
    {
        id: 'demands',
        icon: CustomIcons.Warning,
        label: 'Exigencias',
        color: 'from-purple-600 to-pink-700',
        gradient: 'from-purple-900/50 to-pink-900/50',
        hoverGradient: 'group-hover:from-purple-800/60 group-hover:to-pink-800/60',
        bgGlow: 'from-purple-500/10 to-pink-500/10',
        textGradient: 'from-purple-400 to-pink-300'
    }
];

// Enhanced Navigation Button Component
const NavButton = ({ section, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`
            relative group flex items-center gap-3 px-6 py-3 rounded-xl
            transition-all duration-500 ease-in-out
            ${isActive
                ? `bg-gradient-to-r ${section.color} scale-105 shadow-lg shadow-${section.color}/20`
                : 'bg-gradient-to-r from-gray-800/50 to-gray-900/50 hover:from-gray-800/70 hover:to-gray-900/70'
            }
        `}
    >
        <section.icon />
        <span className={`
            font-medium whitespace-nowrap
            ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}
            transition-colors duration-500
        `}>
            {section.label}
        </span>
        {isActive && (
            <div className={`
                absolute inset-0 bg-gradient-to-r ${section.bgGlow}
                rounded-xl blur-xl animate-pulse-slow
            `} />
        )}
    </button>
);

// Enhanced Close Button Component
const CloseButton = ({ onClick }) => (
    <button
        onClick={onClick}
        className="p-3 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:from-red-900/50 hover:to-red-800/50 transition-all duration-500 group"
    >
        <X className="w-6 h-6 text-gray-400 group-hover:text-red-300 transition-colors duration-500" />
    </button>
);
// Purpose Section Component
const PurposeSection = () => (
    <div className="space-y-8 animate-fadeIn">
        <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300 leading-tight sm:text-5xl">
            Nuestra Misión por el Planeta
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
                title="Visualización de Impacto"
                description="Análisis en tiempo real de las emisiones globales y visualización de datos climáticos para crear conciencia sobre la crisis ambiental actual."
                icon={CustomIcons.Earth}
                className="border-emerald-500/20 hover:border-emerald-500/30"
            />
            <Card
                title="Educación Ambiental"
                description="Información actualizada y accesible sobre el cambio climático, sus efectos en ecosistemas y comunidades, y soluciones prácticas."
                icon={CustomIcons.Cloud}
                className="border-emerald-500/20 hover:border-emerald-500/30"
            />
            <Card
                title="Movilización Global"
                description="Red global de activistas y organizaciones unidas por la justicia climática, facilitando la colaboración y el impacto colectivo."
                icon={CustomIcons.Action}
                className="border-emerald-500/20 hover:border-emerald-500/30"
            />
            <Card
                title="Soluciones Climáticas"
                description="Propuestas innovadoras para la reducción de emisiones y transición energética, adaptadas a diferentes contextos y necesidades."
                icon={CustomIcons.Leaf}
                className="border-emerald-500/20 hover:border-emerald-500/30"
            />
        </div>
    </div>
);

// Crisis Section Component
const CrisisSection = () => (
    <div className="space-y-8 animate-fadeIn">
        <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-300 leading-tight sm:text-5xl">
            Crisis Climática: Tiempo de Actuar
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-black/60 to-red-950/30 p-8 rounded-xl border border-red-500/30 space-y-6 hover:from-black/70 hover:to-red-950/40 transition-all duration-500">
                    <div className="flex items-center gap-4">
                        <CustomIcons.Crisis />
                        <h4 className="text-3xl font-bold text-red-400">Punto Crítico Global</h4>
                    </div>
                    <div className="relative overflow-hidden rounded-xl aspect-video bg-gradient-to-br from-gray-900/80 to-black">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center space-y-4">
                                <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                                    1.5°C
                                </div>
                                <div className="text-xl text-gray-400">
                                    Límite crítico de calentamiento global
                                </div>
                                <div className="mt-4 max-w-lg mx-auto text-gray-300">
                                    Estamos al borde de un punto sin retorno. Las emisiones actuales
                                    nos dirigen hacia un calentamiento catastrófico si no actuamos de inmediato.
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                <Card
                    title="Impacto Global"
                    description="Los efectos son ya evidentes: eventos climáticos extremos, pérdida acelerada de biodiversidad y riesgos crecientes para millones de personas."
                    icon={CustomIcons.Earth}
                    className="border-red-500/20 hover:border-red-500/30"
                />
                <Card
                    title="Urgencia Inmediata"
                    description="La comunidad científica advierte que la próxima década es crucial para implementar cambios sistémicos y evitar daños irreversibles."
                    icon={CustomIcons.Warning}
                    className="border-red-500/20 hover:border-red-500/30"
                />
            </div>
        </div>
    </div>
);

// Action Section Component
const ActionSection = () => (
    <div className="space-y-8 animate-fadeIn">
        <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 leading-tight sm:text-5xl">
            Acción Climática: El Poder del Cambio
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-black/60 to-blue-950/30 p-8 rounded-xl border border-blue-500/30 hover:from-black/70 hover:to-blue-950/40 transition-all duration-500">
                <div className="flex items-center gap-4 mb-8">
                    <CustomIcons.Wind />
                    <h4 className="text-2xl font-bold text-blue-400">Acciones Individuales</h4>
                </div>
                <div className="space-y-4">
                    <AnimatedActionItem
                        title="Huella de Carbono"
                        description="Monitorea y reduce tu impacto ambiental personal mediante cambios conscientes."
                        icon={CustomIcons.Leaf}
                    />
                    <AnimatedActionItem
                        title="Movilidad Sostenible"
                        description="Prioriza opciones de transporte eco-amigables y reduce emisiones en tus desplazamientos."
                        icon={CustomIcons.Wind}
                    />
                    <AnimatedActionItem
                        title="Consumo Responsable"
                        description="Adopta hábitos de consumo consciente y apoya productos y servicios sostenibles."
                        icon={CustomIcons.Earth}
                    />
                </div>
            </div>

            <div className="bg-gradient-to-br from-black/60 to-indigo-950/30 p-8 rounded-xl border border-indigo-500/30 hover:from-black/70 hover:to-indigo-950/40 transition-all duration-500">
                <div className="flex items-center gap-4 mb-8">
                    <CustomIcons.Action />
                    <h4 className="text-2xl font-bold text-indigo-400">Acción Comunitaria</h4>
                </div>
                <div className="space-y-4">
                    <AnimatedActionItem
                        title="Activismo Climático"
                        description="Únete a movimientos locales y globales que luchan por la justicia climática."
                        icon={CustomIcons.Crisis}
                    />
                    <AnimatedActionItem
                        title="Educación y Conciencia"
                        description="Comparte conocimiento y motiva a otros a unirse a la causa ambiental."
                        icon={CustomIcons.Cloud}
                    />
                    <AnimatedActionItem
                        title="Iniciativas Locales"
                        description="Participa en proyectos comunitarios de sostenibilidad y regeneración ambiental."
                        icon={CustomIcons.Earth}
                    />
                </div>
            </div>
        </div>

        <div className="relative mt-8 p-8 bg-gradient-to-br from-black/60 to-blue-950/30 rounded-xl border border-blue-500/30 hover:from-black/70 hover:to-blue-950/40 transition-all duration-500">
            <div className="flex items-center gap-4 mb-6">
                <CustomIcons.Action />
                <h4 className="text-2xl font-bold text-blue-400">Impacto Global del Movimiento</h4>
            </div>
            <div className="aspect-video bg-gradient-to-br from-gray-900/80 to-black rounded-xl overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse">
                            2.1M+
                        </div>
                        <div className="text-xl text-gray-400">
                            Activistas Unidos por el Clima
                        </div>
                    </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>
        </div>
    </div>
);
// Demands Section Component
const DemandsSection = () => (
    <div className="space-y-8 animate-fadeIn">
        <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 leading-tight sm:text-5xl">
            Exigencias para el Cambio
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DemandCard
                title="Para Gobiernos"
                icon={CustomIcons.Warning}
                demands={[
                    "Declaración inmediata de emergencia climática global",
                    "Transición completa a energías renovables para 2035",
                    "Eliminación de subsidios a combustibles fósiles",
                    "Implementación de leyes estrictas de protección ambiental",
                    "Inversión en infraestructura verde y resiliente"
                ]}
            />

            <DemandCard
                title="Para Empresas"
                icon={CustomIcons.Crisis}
                demands={[
                    "Compromiso de neutralidad de carbono para 2030",
                    "Transparencia total en emisiones y impacto ambiental",
                    "Inversión significativa en tecnologías limpias",
                    "Transformación hacia cadenas de suministro sostenibles",
                    "Priorización de la economía circular"
                ]}
            />

            <DemandCard
                title="Para Instituciones"
                icon={CustomIcons.Leaf}
                demands={[
                    "Desinversión completa de combustibles fósiles",
                    "Integración de educación climática en programas",
                    "Impulso a la investigación en soluciones verdes",
                    "Adopción de políticas de cero residuos",
                    "Promoción de prácticas sostenibles"
                ]}
            />
        </div>

        <div className="mt-8 p-8 bg-gradient-to-br from-black/60 to-purple-950/30 rounded-xl border border-purple-500/30 hover:from-black/70 hover:to-purple-950/40 transition-all duration-500">
            <div className="text-center space-y-6">
                <div className="flex justify-center mb-4">
                    <CustomIcons.Earth />
                </div>
                <h4 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
                    El Momento de Actuar es Ahora
                </h4>
                <p className="text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed">
                    Cada voz cuenta, cada acción suma en la lucha contra el cambio climático.
                    Unidos podemos crear el cambio que nuestro planeta necesita para las
                    generaciones presentes y futuras.
                </p>
            </div>
        </div>
    </div>
);

// Main Dashboard Component
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

    const renderSection = () => {
        switch (activeSection) {
            case 'purpose':
                return <PurposeSection />;
            case 'crisis':
                return <CrisisSection />;
            case 'action':
                return <ActionSection />;
            case 'demands':
                return <DemandsSection />;
            default:
                return <PurposeSection />;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50">
            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-800">
                <div className="container mx-auto p-4">
                    <div className="w-full max-w-7xl mx-auto bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800/50">
                        {/* Header Sticky */}
                        <div className="sticky top-0 z-20 bg-gradient-to-br from-gray-900 to-black border-b border-gray-800/50">
                            <div className="relative p-6 md:p-8 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 animate-pulse-slow"></div>
                                <div className="relative z-10 flex justify-between items-center">
                                    <div className="flex items-center gap-6">
                                        <CustomIcons.Earth />
                                        <div>
                                            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                                                Acción por el Clima
                                            </h2>
                                            <p className="text-gray-400 mt-2">Unidos por un futuro sostenible</p>
                                        </div>
                                    </div>
                                    <CloseButton onClick={onClose} />
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="flex gap-3 p-4 bg-black/50 overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-800">
                                {sections.map(section => (
                                    <NavButton
                                        key={section.id}
                                        section={section}
                                        isActive={activeSection === section.id}
                                        onClick={() => setActiveSection(section.id)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 md:p-8">
                            {renderSection()}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
    .scrollbar-thin::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }

    .scrollbar-thin::-webkit-scrollbar-track {
        background: transparent;
    }

    .scrollbar-thin::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
    }

    .scrollbar-thin::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.2);
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