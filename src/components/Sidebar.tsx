import React from "react";
import { 
  Plus, X, Tag, Trash2, Wand2, FileSearch, 
  Grid as GridIcon, ZoomIn, ZoomOut, RotateCcw 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Mode, LabelInput } from "../types";
import { ICON_MAP, TILE_SIZE } from "../constants";

interface SidebarProps {
  modes: Mode[];
  currentMode: number;
  setMode: (id: number) => void;
  isAddingLabel: boolean;
  setIsAddingLabel: (val: boolean) => void;
  newLabel: LabelInput;
  setNewLabel: (val: LabelInput) => void;
  onAddLabel: () => void;
  onRemoveLabel: (id: number) => void;
  isImageLoaded: boolean;
  onAutoDetect: () => void;
  onImportJson: () => void;
  jsonInputRef: React.RefObject<HTMLInputElement | null>;
  showGrid: boolean;
  setShowGrid: (val: boolean) => void;
  zoom: number;
  setZoom: (val: (prev: number) => number) => void;
  onResetZoom: () => void;
  gridSize: { cols: number; rows: number } | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  modes,
  currentMode,
  setMode,
  isAddingLabel,
  setIsAddingLabel,
  newLabel,
  setNewLabel,
  onAddLabel,
  onRemoveLabel,
  isImageLoaded,
  onAutoDetect,
  onImportJson,
  jsonInputRef,
  showGrid,
  setShowGrid,
  zoom,
  setZoom,
  onResetZoom,
  gridSize
}) => {
  return (
    <aside className="w-64 border-r border-[#E4E3E0]/10 bg-[#1A1A1A] p-6 flex flex-col gap-8 overflow-y-auto">
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#E4E3E0]/40 italic">Mode Selection</h2>
          <button 
            onClick={() => setIsAddingLabel(true)}
            className="p-1 hover:bg-[#E4E3E0]/10 rounded-sm text-[#E4E3E0]/40 hover:text-[#E4E3E0] transition-colors"
            title="Add Custom Label"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        <AnimatePresence>
          {isAddingLabel && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="p-3 bg-[#141414] border border-[#E4E3E0]/10 rounded-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-[#E4E3E0]/60">New Label</span>
                  <button onClick={() => setIsAddingLabel(false)} className="text-[#E4E3E0]/40 hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <input 
                  type="text" 
                  placeholder="Name (e.g. Door)" 
                  value={newLabel.name}
                  onChange={e => setNewLabel({...newLabel, name: e.target.value})}
                  className="bg-transparent border border-[#E4E3E0]/10 px-2 py-1 text-[11px] font-mono focus:outline-none focus:border-[#E4E3E0]/30 w-full text-white"
                />
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="ID" 
                    value={newLabel.id}
                    onChange={e => setNewLabel({...newLabel, id: e.target.value.replace(/\D/g, '')})}
                    className="bg-transparent border border-[#E4E3E0]/10 px-2 py-1 text-[11px] font-mono focus:outline-none focus:border-[#E4E3E0]/30 w-16 text-white"
                  />
                  <input 
                    type="color" 
                    value={newLabel.color}
                    onChange={e => setNewLabel({...newLabel, color: e.target.value})}
                    className="bg-[#1A1A1A] border border-[#E4E3E0]/10 w-full h-7 rounded-sm cursor-pointer"
                  />
                </div>
                <button 
                  onClick={onAddLabel}
                  className="w-full py-1.5 bg-[#E4E3E0] text-[#141414] text-[9px] uppercase font-bold tracking-widest hover:bg-white transition-colors"
                >
                  Create Label
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-2">
          {modes.map((m) => {
            const Icon = ICON_MAP[m.iconName as keyof typeof ICON_MAP] || Tag;
            const isActive = currentMode === m.id;
            const isCustom = m.id > 2;

            return (
              <div key={m.id} className="relative group">
                <button
                  onClick={() => setMode(m.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-xs font-mono border transition-all ${
                    isActive 
                      ? "bg-[#E4E3E0] text-[#141414] border-[#E4E3E0]" 
                      : "text-[#E4E3E0]/60 border-[#E4E3E0]/10 hover:border-[#E4E3E0]/30 hover:text-[#E4E3E0]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${!isActive && m.textColor ? m.textColor : ""}`} />
                    <span>{m.name}</span>
                  </div>
                  {m.id !== -1 && <span className="opacity-40 text-[10px]">{m.id}</span>}
                </button>
                {isCustom && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onRemoveLabel(m.id); }}
                    className="absolute -right-2 top-1/2 -translate-y-1/2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 scale-75"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#E4E3E0]/40 mb-4 italic">Analysis Tools</h2>
        <div className="flex flex-col gap-2">
          <button
            onClick={onAutoDetect}
            disabled={!isImageLoaded}
            className="flex items-center gap-3 px-4 py-3 text-xs font-mono border border-[#E4E3E0]/10 hover:border-[#E4E3E0]/30 hover:bg-[#E4E3E0]/5 transition-all text-[#E4E3E0]/80 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Wand2 className="w-4 h-4 text-purple-400" />
            <span>Auto Detect Grid</span>
          </button>
          
          <button
            onClick={onImportJson}
            disabled={!isImageLoaded}
            className="flex items-center gap-3 px-4 py-3 text-xs font-mono border border-[#E4E3E0]/10 hover:border-[#E4E3E0]/30 hover:bg-[#E4E3E0]/5 transition-all text-[#E4E3E0]/80 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <FileSearch className="w-4 h-4 text-amber-400" />
            <span>Import JSON Grid</span>
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#E4E3E0]/40 mb-4 italic">Display Settings</h2>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-mono border transition-all ${
              showGrid ? "bg-[#E4E3E0]/10 border-[#E4E3E0]/20" : "border-[#E4E3E0]/5 opacity-40"
            }`}
          >
            <GridIcon className="w-4 h-4" />
            <span>Show Grid Lines</span>
          </button>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setZoom(prev => Math.min(prev + 0.5, 4))}
              className="flex-1 px-4 py-2 text-xs font-mono border border-[#E4E3E0]/10 hover:bg-[#E4E3E0]/10"
            >
              <ZoomIn className="w-4 h-4 mx-auto" />
            </button>
            <button 
              onClick={() => setZoom(prev => Math.max(prev - 0.5, 0.5))}
              className="flex-1 px-4 py-2 text-xs font-mono border border-[#E4E3E0]/10 hover:bg-[#E4E3E0]/10"
            >
              <ZoomOut className="w-4 h-4 mx-auto" />
            </button>
            <button 
              onClick={onResetZoom}
              className="flex-1 px-4 py-2 text-xs font-mono border border-[#E4E3E0]/10 hover:bg-[#E4E3E0]/10"
            >
              <RotateCcw className="w-4 h-4 mx-auto" />
            </button>
          </div>
        </div>
      </section>

      <section className="mt-auto">
         <div className="p-4 bg-[#141414] border border-[#E4E3E0]/5 rounded-sm">
            <h3 className="text-[10px] text-[#E4E3E0]/40 uppercase mb-2 font-mono">Status</h3>
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span>Zoom</span>
              <span className="text-blue-400">{Math.round(zoom * 100)}%</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono mt-1">
              <span>Size</span>
              <span className="text-blue-400">{gridSize ? `${gridSize.cols}x${gridSize.rows}` : "—"}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono mt-1">
              <span>Tile Size</span>
              <span className="text-blue-400">{TILE_SIZE}px</span>
            </div>
         </div>
      </section>
    </aside>
  );
};
