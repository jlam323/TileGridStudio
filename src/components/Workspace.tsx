import React from "react";
import { Upload } from "lucide-react";
import { Offset } from "../types";

interface WorkspaceProps {
  image: HTMLImageElement | null;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  zoom: number;
  offset: Offset;
  mode: number;
  isInteracting: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tileSize: number;
  hoveredCell: { x: number, y: number } | null;
  setHoveredCell: (cell: { x: number, y: number } | null) => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  image,
  canvasRef,
  zoom,
  offset,
  mode,
  isInteracting,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onUpload,
  tileSize,
  hoveredCell,
  setHoveredCell
}) => {
  return (
    <section className="relative flex-1 bg-[#141414] overflow-auto flex items-center justify-center p-12">
      {!image && (
        <div className="flex flex-col items-center gap-6 text-center max-w-sm">
          <div className="w-16 h-16 border border-dashed border-[#E4E3E0]/20 rounded-full flex items-center justify-center text-[#E4E3E0]/20">
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-mono uppercase tracking-widest mb-2 font-bold">Awaiting Input</h3>
            <p className="text-xs text-[#E4E3E0]/40 font-mono leading-relaxed">
              Upload an image asset to begin grid mapping. 
              Recommended tile size is {tileSize}px.
            </p>
          </div>
          <label className="px-6 py-3 bg-[#E4E3E0] text-[#141414] text-xs font-bold font-mono uppercase tracking-[0.2em] cursor-pointer hover:bg-white transition-colors">
            Select Metadata Asset
            <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
          </label>
        </div>
      )}

      {image && (
        <div 
          style={{ 
            transform: `scale(${zoom}) translate(${offset.x}px, ${offset.y}px)`, 
            transformOrigin: "center center" 
          }}
          onMouseLeave={() => setHoveredCell(null)}
          className="relative transition-transform duration-200 ease-out"
        >
          <canvas
            ref={canvasRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={(e) => {
              onMouseUp();
              setHoveredCell(null);
            }}
            className={`image-render-pixelated border border-white/5 shadow-2xl ${
              mode === -1 
                ? (isInteracting ? "cursor-grabbing" : "cursor-grab") 
                : "cursor-crosshair"
            }`}
            style={{ imageRendering: 'pixelated' }}
          />

          {hoveredCell && (
            <div 
              style={{
                position: 'absolute',
                left: hoveredCell.x * tileSize,
                top: hoveredCell.y * tileSize,
                width: tileSize,
                height: tileSize,
                pointerEvents: 'none',
                zIndex: 10
              }}
              className="border border-white/20 bg-white/5"
            />
          )}
        </div>
      )}

      {hoveredCell && (
        <div className="absolute bottom-6 left-6 bg-[#1A1A1A]/90 backdrop-blur-md border border-white/10 px-4 py-2 pointer-events-none z-50 flex flex-col gap-0.5">
          <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#E4E3E0]/30 italic">Cell Coordinate</span>
          <div className="flex gap-4">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[10px] font-mono text-[#E4E3E0]/40 uppercase">X</span>
              <span className="text-xs font-mono text-white leading-none">{hoveredCell.x}</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[10px] font-mono text-[#E4E3E0]/40 uppercase">Y</span>
              <span className="text-xs font-mono text-white leading-none">{hoveredCell.y}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
