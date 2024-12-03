import React, { useState, useEffect } from 'react';
import { 
    BookOpen, 
    Factory, 
    Database, 
    Cloud, 
    Flame, 
    Droplet,
    Search,
    X,
    Info
} from 'lucide-react';

// Enhanced Card Component
const DictionaryCard = ({ title, description, icon: Icon, className = "" }) => {
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
                        <Icon className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-500" />
                    </div>
                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-500">
                        {title}
                    </h3>
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

// Enhanced Search Input Component
const SearchInput = ({ value, onChange }) => (
    <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition duration-300" />
        <div className="relative flex items-center">
            <input
                type="text"
                placeholder="Buscar términos..."
                value={value}
                onChange={onChange}
                className="w-full px-12 py-4 bg-gradient-to-br from-gray-900 to-black rounded-xl 
                          border border-gray-800/50 text-gray-300 placeholder-gray-500
                          focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                          transition-all duration-300"
            />
            <div className="absolute left-4 text-gray-500">
                <Search className="w-5 h-5" />
            </div>
        </div>
    </div>
);

// Navigation Button Component
const NavButton = ({ active, onClick, icon: Icon, label, gradient }) => (
    <button
        onClick={onClick}
        className={`
            relative group flex items-center gap-3 px-6 py-3 rounded-xl
            transition-all duration-500 ease-in-out whitespace-nowrap
            ${active 
                ? `bg-gradient-to-r ${gradient} scale-105 shadow-lg`
                : 'bg-gradient-to-br from-gray-900 to-black hover:from-gray-800 hover:to-gray-900'
            }
        `}
    >
        <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400 group-hover:text-white'} transition-colors duration-300`} />
        <span className={`font-medium ${active ? 'text-white' : 'text-gray-400 group-hover:text-white'} transition-colors duration-300`}>
            {label}
        </span>
        {active && (
            <div className="absolute inset-0 bg-white/10 rounded-xl animate-pulse-slow" />
        )}
    </button>
);
// Configuración de secciones mejorada
const sections = {
    general: {
        icon: BookOpen,
        title: "Conceptos Generales",
        gradient: "from-emerald-600 to-green-800",
        hoverGradient: "group-hover:from-emerald-800/60 group-hover:to-green-800/60",
        bgGlow: "from-emerald-500/10 to-green-500/10",
        textGradient: "from-emerald-400 to-green-300",
        items: [
            {
                title: "Carbon Majors Database",
                description: "Base de datos integral que monitorea y rastrea las emisiones globales de gases de efecto invernadero desde 1854, vinculándolas directamente con las empresas responsables de su producción.",
                icon: Database,
                color: "emerald"
            },
            {
                title: "Gases de Efecto Invernadero",
                description: "Conjunto de gases atmosféricos que retienen el calor y son los principales responsables del cambio climático. Incluyen dióxido de carbono (CO2), metano (CH4), óxido nitroso (N2O) y otros.",
                icon: Cloud,
                color: "emerald"
            },
            {
                title: "MtCO2e",
                description: "Medida estandarizada que representa Millones de toneladas de CO2 equivalente. Permite comparar el impacto de diferentes gases de efecto invernadero en una única escala.",
                icon: Database,
                color: "emerald"
            }
        ]
    },
    empresas: {
        icon: Factory,
        title: "Tipos de Empresas",
        gradient: "from-blue-600 to-indigo-800",
        hoverGradient: "group-hover:from-blue-800/60 group-hover:to-indigo-800/60",
        bgGlow: "from-blue-500/10 to-indigo-500/10",
        textGradient: "from-blue-400 to-indigo-300",
        items: [
            {
                title: "Empresas Privadas",
                description: "Corporaciones de propiedad privada que participan en la extracción, producción y distribución de combustibles fósiles. Su principal objetivo es maximizar el retorno para los accionistas.",
                icon: Factory,
                color: "blue"
            },
            {
                title: "Empresas Estatales",
                description: "Compañías donde el estado mantiene una participación mayoritaria (>50%). Estas entidades suelen tener objetivos tanto comerciales como de política pública nacional.",
                icon: Factory,
                color: "blue"
            },
            {
                title: "Productores Nacionales",
                description: "Entidades directamente controladas por gobiernos nacionales, especialmente comunes en el sector del carbón. Operan bajo directrices estatales específicas.",
                icon: Factory,
                color: "blue"
            }
        ]
    },
    datos: {
        icon: Database,
        title: "Fuentes de Datos",
        gradient: "from-purple-600 to-pink-700",
        hoverGradient: "group-hover:from-purple-800/60 group-hover:to-pink-800/60",
        bgGlow: "from-purple-500/10 to-pink-500/10",
        textGradient: "from-purple-400 to-pink-300",
        items: [
            {
                title: "Datos Autorreportados",
                description: "Información directamente proporcionada por las empresas a través de sus informes anuales, informes de sostenibilidad y documentación oficial corporativa.",
                icon: Database,
                color: "purple"
            },
            {
                title: "Fuentes Externas",
                description: "Datos obtenidos de agencias especializadas como la EIA, Oil & Gas Journal, y otras fuentes confiables cuando no hay datos directos disponibles.",
                icon: Info,
                color: "purple"
            },
            {
                title: "Verificación y Validación",
                description: "Proceso riguroso de validación que combina múltiples fuentes y metodologías estandarizadas para asegurar la precisión y confiabilidad de los datos.",
                icon: Database,
                color: "purple"
            }
        ]
    },
    emisiones: {
        icon: Flame,
        title: "Tipos de Emisiones",
        gradient: "from-red-600 to-orange-700",
        hoverGradient: "group-hover:from-red-800/60 group-hover:to-orange-800/60",
        bgGlow: "from-red-500/10 to-orange-500/10",
        textGradient: "from-red-400 to-orange-300",
        items: [
            {
                title: "Emisiones Directas (Scope 1)",
                description: "Emisiones generadas directamente por las operaciones y actividades controladas por la empresa, incluyendo la producción, procesamiento y transporte.",
                icon: Flame,
                color: "red"
            },
            {
                title: "Emisiones Indirectas (Scope 3)",
                description: "Emisiones resultantes del uso final de los productos vendidos por la empresa, representando a menudo la mayor parte del impacto climático total.",
                icon: Cloud,
                color: "red"
            },
            {
                title: "Emisiones Fugitivas",
                description: "Liberaciones no intencionales de gases durante los procesos de extracción, procesamiento y transporte, incluyendo fugas y venteos.",
                icon: Cloud,
                color: "red"
            }
        ]
    },
    combustibles: {
        icon: Droplet,
        title: "Combustibles",
        gradient: "from-amber-600 to-orange-700",
        hoverGradient: "group-hover:from-amber-800/60 group-hover:to-orange-800/60",
        bgGlow: "from-amber-500/10 to-orange-500/10",
        textGradient: "from-amber-400 to-orange-300",
        items: [
            {
                title: "Petróleo y GNL",
                description: "Medido en barriles. Incluye petróleo crudo y líquidos de gas natural. Principal fuente de combustible para el transporte global.",
                icon: Droplet,
                color: "amber"
            },
            {
                title: "Gas Natural",
                description: "Medido en pies cúbicos. Fuente crucial para la generación eléctrica y calefacción industrial. Considerado más limpio que otros combustibles fósiles.",
                icon: Flame,
                color: "amber"
            },
            {
                title: "Carbón",
                description: "Medido en toneladas. Incluye carbón térmico y metalúrgico. Sigue siendo una fuente significativa de energía en muchos países en desarrollo.",
                icon: Factory,
                color: "amber"
            }
        ]
    }
};

// Función de filtrado mejorada
const filterSections = (sections, searchTerm) => {
    return Object.entries(sections).reduce((acc, [key, section]) => {
        const filteredItems = section.items.filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        if (filteredItems.length > 0) {
            acc[key] = {
                ...section,
                items: filteredItems,
                matchCount: filteredItems.length
            };
        }
        return acc;
    }, {});
};
// Header Component
const DictionaryHeader = ({ searchTerm, onSearchChange, onClose }) => (
    <div className="relative p-6 bg-gradient-to-br from-gray-900 to-black border-b border-gray-800/50">
        <div className="absolute inset-0 bg-blue-500/5 animate-pulse-slow" />
        
        {/* Title Section */}
        <div className="relative flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl backdrop-blur-sm">
                    <BookOpen className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        Diccionario de Carbono
                    </h2>
                    <p className="text-gray-400 mt-1">
                        Guía completa de términos y conceptos
                    </p>
                </div>
            </div>
            
            <button
                onClick={onClose}
                className="p-3 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:from-red-900/50 hover:to-red-800/50 transition-all duration-300 group"
            >
                <X className="w-6 h-6 text-gray-400 group-hover:text-red-300 transition-colors duration-300" />
            </button>
        </div>

        {/* Search Bar */}
        <SearchInput 
            value={searchTerm}
            onChange={onSearchChange}
        />
    </div>
);

// Navigation Bar Component
const NavigationBar = ({ activeSection, setActiveSection, sections }) => (
    <div className="overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-800">
        <div className="flex gap-2 p-4 bg-black/50">
            {Object.entries(sections).map(([key, section]) => (
                <NavButton
                    key={key}
                    active={activeSection === key}
                    onClick={() => setActiveSection(key)}
                    icon={section.icon}
                    label={section.title}
                    gradient={section.gradient}
                />
            ))}
        </div>
    </div>
);

// Content Section Component
const ContentSection = ({ section, animateCards }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {section.items.map((item, index) => (
            <DictionaryCard
                key={`${item.title}-${index}`}
                title={item.title}
                description={item.description}
                icon={item.icon}
                className={`
                    transform transition-all duration-500
                    ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                    border-${item.color}-500/20 hover:border-${item.color}-500/30
                `}
                style={{
                    transitionDelay: `${index * 100}ms`
                }}
            />
        ))}
    </div>
);

// Footer Component
const DictionaryFooter = () => (
    <div className="p-4 bg-gradient-to-br from-gray-900 to-black border-t border-gray-800/50">
        <div className="flex items-center justify-between text-sm text-gray-400">
            <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Actualizado 2024
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Carbon Majors Database
            </span>
        </div>
    </div>
);

// Empty State Component
const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-64 text-center p-6">
        <Database className="w-16 h-16 text-gray-600 mb-4" />
        <h3 className="text-xl font-bold text-gray-400 mb-2">
            No se encontraron resultados
        </h3>
        <p className="text-gray-500 max-w-md">
            Intenta buscar con otros términos o navega por las categorías disponibles
        </p>
    </div>
);

// Loading State Component
const LoadingState = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[...Array(6)].map((_, i) => (
            <div 
                key={i}
                className="h-48 rounded-xl bg-gradient-to-br from-gray-900/90 to-black
                         border border-gray-800/50 animate-pulse"
            />
        ))}
    </div>
);
// Main Component
const CarbonDictionary = ({ isVisible, onClose }) => {
    const [activeSection, setActiveSection] = useState('general');
    const [searchTerm, setSearchTerm] = useState('');
    const [animateCards, setAnimateCards] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setAnimateCards(true);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isVisible]);

    if (!isVisible) return null;

    const filteredSections = filterSections(sections, searchTerm);
    const currentSection = searchTerm ? filteredSections[activeSection] : sections[activeSection];

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50">
            <div className="h-full overflow-hidden">
                <div className="container mx-auto p-4">
                    <div className="w-full max-w-7xl mx-auto bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800/50">
                        {/* Header Section */}
                        <DictionaryHeader
                            searchTerm={searchTerm}
                            onSearchChange={(e) => setSearchTerm(e.target.value)}
                            onClose={onClose}
                        />

                        {/* Navigation */}
                        <NavigationBar
                            activeSection={activeSection}
                            setActiveSection={setActiveSection}
                            sections={sections}
                        />

                        {/* Main Content */}
                        <div className="overflow-y-auto max-h-[calc(90vh-300px)] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-800">
                            {currentSection ? (
                                <ContentSection
                                    section={currentSection}
                                    animateCards={animateCards}
                                />
                            ) : searchTerm ? (
                                <EmptyState />
                            ) : (
                                <LoadingState />
                            )}
                        </div>

                        {/* Footer */}
                        <DictionaryFooter />
                    </div>
                </div>
            </div>

            {/* Global Styles */}
            <style>
                {`
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
                `}
            </style>
        </div>
    );
};

export default CarbonDictionary;