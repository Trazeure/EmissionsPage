import React, { useState, useEffect } from 'react';

const CarbonDictionary = ({ isVisible, onClose }) => {
    const [activeSection, setActiveSection] = useState('general');
    const [searchTerm, setSearchTerm] = useState('');
    const [animateCards, setAnimateCards] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setAnimateCards(true);
        }
    }, [isVisible, activeSection]);

    if (!isVisible) return null;

    // SVG Icons personalizados y animados
    const Icons = {
        Book: () => (
            <svg viewBox="0 0 24 24" className="w-6 h-6">
                <path 
                    d="M2 6s1.5-2 5-2 5 2 5 2v14s-1.5-1-5-1-5 1-5 1V6zm10 0s1.5-2 5-2 5 2 5 2v14s-1.5-1-5-1-5 1-5 1V6z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                >
                    <animate
                        attributeName="stroke-dasharray"
                        from="0 100"
                        to="100 100"
                        dur="1.5s"
                        begin="0s"
                        fill="freeze"
                    />
                </path>
            </svg>
        ),
        Factory: () => (
            <svg viewBox="0 0 24 24" className="w-6 h-6">
                <path 
                    d="M12 16V4l-6 6v6m12 0V8l-6 4v4M2 20h20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                >
                    <animate
                        attributeName="stroke-dasharray"
                        from="0 100"
                        to="100 100"
                        dur="1.5s"
                        begin="0s"
                        fill="freeze"
                    />
                </path>
            </svg>
        ),
        Data: () => (
            <svg viewBox="0 0 24 24" className="w-6 h-6">
                <g fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="8">
                        <animate
                            attributeName="r"
                            values="8;7;8"
                            dur="2s"
                            repeatCount="indefinite"
                        />
                    </circle>
                    <path d="M12 4v16M4 12h16">
                        <animate
                            attributeName="stroke-dasharray"
                            from="0 100"
                            to="100 100"
                            dur="1.5s"
                            begin="0s"
                            fill="freeze"
                        />
                    </path>
                </g>
            </svg>
        ),
        Emission: () => (
            <svg viewBox="0 0 24 24" className="w-6 h-6">
                <path
                    d="M12 4c-3 0-6 2-6 6 0 4 6 10 6 10s6-6 6-10c0-4-3-6-6-6z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <animate
                        attributeName="stroke-dasharray"
                        from="0 100"
                        to="100 100"
                        dur="1.5s"
                        begin="0s"
                        fill="freeze"
                    />
                </path>
            </svg>
        ),
        Fuel: () => (
            <svg viewBox="0 0 24 24" className="w-6 h-6">
                <path
                    d="M12 2l-6 12h12L12 2zm0 20l-3-6h6l-3 6z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <animate
                        attributeName="stroke-dasharray"
                        from="0 100"
                        to="100 100"
                        dur="1.5s"
                        begin="0s"
                        fill="freeze"
                    />
                </path>
            </svg>
        ),
        Search: () => (
            <svg viewBox="0 0 24 24" className="w-5 h-5">
                <circle
                    cx="11"
                    cy="11"
                    r="7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <animate
                        attributeName="r"
                        values="7;6.5;7"
                        dur="2s"
                        repeatCount="indefinite"
                    />
                </circle>
                <path
                    d="M21 21l-4.35-4.35"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                >
                    <animate
                        attributeName="stroke-dasharray"
                        from="0 20"
                        to="20 20"
                        dur="1s"
                        begin="0s"
                        fill="freeze"
                    />
                </path>
            </svg>
        )
    };

    const sections = {
        general: {
            icon: Icons.Book,
            title: "Conceptos Generales",
            bgGradient: "from-emerald-500 to-teal-700",
            items: [
                {
                    title: "Carbon Majors Database",
                    description: "Base de datos que rastrea las emisiones de gases de efecto invernadero desde 1854 hasta la actualidad, vinculándolas directamente con las empresas productoras.",
                    icon: Icons.Data
                },
                {
                    title: "Gases de Efecto Invernadero",
                    description: "Gases atmosféricos que retienen el calor y contribuyen al cambio climático. Los principales son CO2, metano y óxido nitroso.",
                    icon: Icons.Emission
                },
                {
                    title: "MtCO2e",
                    description: "Millones de toneladas de CO2 equivalente. Unidad estándar para medir las emisiones de gases de efecto invernadero.",
                    icon: Icons.Data
                }
            ]
        },
        empresas: {
            icon: Icons.Factory,
            title: "Tipos de Empresas",
            bgGradient: "from-blue-500 to-indigo-700",
            items: [
                {
                    title: "Empresas Privadas",
                    description: "Compañías de propiedad de inversores privados que producen combustibles fósiles.",
                    icon: Icons.Factory
                },
                {
                    title: "Empresas Estatales",
                    description: "Compañías controladas en más del 50% por gobiernos nacionales.",
                    icon: Icons.Factory
                },
                {
                    title: "Productores Nacionales",
                    description: "Producción directamente controlada por estados, común en el sector del carbón.",
                    icon: Icons.Factory
                }
            ]
        },
        datos: {
            icon: Icons.Data,
            title: "Fuentes de Datos",
            bgGradient: "from-purple-500 to-pink-700",
            items: [
                {
                    title: "Datos Autorreportados",
                    description: "Información proporcionada directamente por las empresas en informes anuales y documentos oficiales.",
                    icon: Icons.Data
                },
                {
                    title: "Fuentes Externas",
                    description: "Datos de agencias como EIA, Oil & Gas Journal y otros cuando no hay datos directos disponibles.",
                    icon: Icons.Data
                },
                {
                    title: "Verificación",
                    description: "Proceso de validación de datos usando múltiples fuentes y metodologías estandarizadas.",
                    icon: Icons.Data
                }
            ]
        },
        emisiones: {
            icon: Icons.Emission,
            title: "Tipos de Emisiones",
            bgGradient: "from-orange-500 to-red-700",
            items: [
                {
                    title: "Emisiones Directas (Scope 1)",
                    description: "Emisiones generadas directamente por las operaciones de la empresa.",
                    icon: Icons.Emission
                },
                {
                    title: "Emisiones Indirectas (Scope 3)",
                    description: "Emisiones producidas por el uso final de los productos vendidos por la empresa.",
                    icon: Icons.Emission
                },
                {
                    title: "Emisiones Fugitivas",
                    description: "Escapes no intencionales de gases durante la producción y transporte.",
                    icon: Icons.Emission
                }
            ]
        },
        combustibles: {
            icon: Icons.Fuel,
            title: "Combustibles",
            bgGradient: "from-yellow-500 to-orange-700",
            items: [
                {
                    title: "Petróleo y GNL",
                    description: "Medido en barriles. Incluye petróleo crudo y líquidos de gas natural.",
                    icon: Icons.Fuel
                },
                {
                    title: "Gas Natural",
                    description: "Medido en pies cúbicos. Principal fuente de energía para generación eléctrica.",
                    icon: Icons.Fuel
                },
                {
                    title: "Carbón",
                    description: "Medido en toneladas. Incluye diferentes tipos como térmico y metalúrgico.",
                    icon: Icons.Fuel
                }
            ]
        }
    };

    const filteredSections = Object.entries(sections).reduce((acc, [key, section]) => {
        const filteredItems = section.items.filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filteredItems.length > 0) {
            acc[key] = { ...section, items: filteredItems };
        }
        return acc;
    }, {});

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 shadow-2xl transform transition-all duration-500 scale-100">
                {/* Header con glassmorphism */}
                <div className="relative p-6 backdrop-blur-sm bg-white/80 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl shadow-lg text-white">
                                <Icons.Book />
                            </div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-800 bg-clip-text text-transparent">
                                Diccionario de Carbono
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-slate-200/50 transition-all duration-300"
                        >
                            <svg viewBox="0 0 24 24" className="w-6 h-6 text-slate-600">
                                <path
                                    d="M18 6L6 18M6 6l12 12"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Barra de búsqueda con animación */}
                    <div className="mt-6 relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300" />
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                placeholder="Buscar conceptos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-12 py-3 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                            />
                            <div className="absolute left-4 text-slate-400">
                                <Icons.Search />
                            </div>
                        </div>
                    </div>

                    {/* Navegación */}
                    <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
                        {Object.entries(sections).map(([key, section]) => {
                            const Icon = section.icon;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setActiveSection(key)}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-lg
                                        transition-all duration-300 whitespace-nowrap
                                        ${activeSection === key
                                            ? `bg-gradient-to-r ${section.bgGradient} text-white shadow-lg`
                                            : 'bg-white hover:bg-slate-50 text-slate-700'
                                        }
                                    `}
                                >
                                    <Icon />
                                    {section.title}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Contenido principal con cards animadas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
                    {(searchTerm ? filteredSections[activeSection]?.items : sections[activeSection].items).map((item, index) => (
                        <div
                            key={index}
                            className={`
                                relative group p-6 bg-white rounded-xl shadow-lg
                                hover:shadow-2xl transition-all duration-500 transform
                                ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                            `}
                            style={{
                                transitionDelay: `${index * 100}ms`
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-2 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-lg">
                                        <item.icon />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-800">
                                        {item.title}
                                    </h3>
                                </div>
                                <p className="text-slate-600 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer con gradiente y animación */}
                <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-t border-slate-200">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                        <span className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2">
                                    <animate
                                        attributeName="r"
                                        values="10;9;10"
                                        dur="3s"
                                        repeatCount="indefinite"
                                    />
                                </circle>
                            </svg>
                            Actualizado 2024
                        </span>
                        <span>Carbon Majors Database</span>
                    </div>
                </div>
            </div>

            <style jsx>{`
                ::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                
                ::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                ::-webkit-scrollbar-thumb {
                    background: rgba(100, 116, 139, 0.5);
                    border-radius: 4px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: rgba(100, 116, 139, 0.7);
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default CarbonDictionary;
                            