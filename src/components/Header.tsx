import React from "react";
import { Upload, Download, Copy, Square } from "lucide-react";

interface HeaderProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: () => void;
  onDownload: () => void;
  isImageLoaded: boolean;
  filename: string;
  setFilename: (val: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onUpload, onExport, onDownload, isImageLoaded, filename, setFilename }) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-bottom border-[#E4E3E0]/20 bg-[#1A1A1A]">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#E4E3E0] text-[#141414] rounded-sm">
          <Square className="w-5 h-5 fill-current" />
        </div>
        <h1 className="text-sm font-mono uppercase tracking-widest font-bold">TileGrid Studio</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 mr-2">
          <span className="text-[10px] uppercase font-mono text-[#E4E3E0]/40">Filename:</span>
          <input 
            type="text" 
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="bg-[#141414] border border-[#E4E3E0]/10 px-2 py-1 text-xs font-mono focus:outline-none focus:border-[#E4E3E0]/30 w-40 text-white"
          />
        </div>
        <label className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono uppercase border border-[#E4E3E0]/20 hover:bg-[#E4E3E0] hover:text-[#141414] transition-colors cursor-pointer tracking-wider">
          <Upload className="w-4 h-4" />
          Load Image
          <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
        </label>
        <button 
          onClick={onExport}
          disabled={!isImageLoaded}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono uppercase border border-[#E4E3E0]/20 hover:bg-blue-500 hover:border-blue-500 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed tracking-wider"
        >
          <Copy className="w-4 h-4" />
          Copy JSON
        </button>
        <button 
          onClick={onDownload}
          disabled={!isImageLoaded}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono uppercase border border-[#E4E3E0]/20 hover:bg-green-500 hover:border-green-500 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed tracking-wider"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
    </header>
  );
};
