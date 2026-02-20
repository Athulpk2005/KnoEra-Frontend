import React, { memo } from 'react';

const Tabs = memo(({ tabs, activeTab, setActiveTab }) => {
    return (
        <div className="flex items-center gap-1 p-1 bg-slate-100/80 backdrop-blur-sm rounded-2xl border border-slate-200 w-fit overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.name;
                return (
                    <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        className={`
              relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap
              ${isActive
                                ? 'text-white shadow-lg shadow-emerald-500/20 scale-[1.02]'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                            }
            `}
                    >
                        {/* Background for active tab */}
                        {isActive && (
                            <div className="absolute inset-0 bg-primary rounded-xl -z-10 animate-in fade-in zoom-in duration-300" />
                        )}

                        <span className="relative z-10">{tab.label}</span>

                        {/* Optional count badge if provided in tab object */}
                        {tab.count !== undefined && (
                            <span className={`
                relative z-10 flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-[10px] font-black
                ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'}
              `}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
});

Tabs.displayName = 'Tabs';

export default Tabs;
