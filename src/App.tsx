/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Workspace } from "./components/Workspace";
import { Notification } from "./components/Notification";
import { Mode, Offset, LabelInput } from "./types";
import { DEFAULT_TILE_SIZE, DEFAULT_MODES } from "./constants";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);
  
  const [modes, setModes] = useState<Mode[]>(() => {
    try {
      const saved = localStorage.getItem('tilegrid-modes');
      return saved ? JSON.parse(saved) : DEFAULT_MODES;
    } catch (e) {
      return DEFAULT_MODES;
    }
  });

  const [tileSize, setTileSize] = useState(DEFAULT_TILE_SIZE);
  const [exportFilename, setExportFilename] = useState("tile_grid.json");
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [grid, setGrid] = useState<number[][]>([]);
  const [mode, setMode] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);
  const [lastMousePos, setLastMousePos] = useState<Offset>({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);

  const [isAddingLabel, setIsAddingLabel] = useState(false);
  const [newLabel, setNewLabel] = useState<LabelInput>({ name: '', id: '', color: '#ffffff' });

  useEffect(() => {
    localStorage.setItem('tilegrid-modes', JSON.stringify(modes));
  }, [modes]);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      setImage(img);
      const cols = Math.floor(img.width / tileSize);
      const rows = Math.floor(img.height / tileSize);
      const newGrid = Array.from({ length: rows }, () =>
        Array(cols).fill(0)
      );
      setGrid(newGrid);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      notify("Image loaded successfully");
    };
    img.src = URL.createObjectURL(file);
  };

  const draw = useCallback(() => {
    if (!image || grid.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (canvas.width !== image.width) canvas.width = image.width;
    if (canvas.height !== image.height) canvas.height = image.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);

    const rows = grid.length;
    const cols = grid[0]?.length || 0;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cell = grid[y][x];
        const modeInfo = modes.find(m => m.id === cell);
        
        if (cell !== 0 && modeInfo && modeInfo.id !== -1) {
          ctx.fillStyle = modeInfo.color;
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
          ctx.strokeStyle = modeInfo.stroke || modeInfo.color;
          ctx.lineWidth = 1;
          ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }

        if (showGrid) {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
      }
    }
  }, [image, grid, showGrid, modes, tileSize]);

  useEffect(() => {
    draw();
  }, [draw]);

  const paintAt = (clientX: number, clientY: number) => {
    if (!canvasRef.current || grid.length === 0) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor(((clientX - rect.left) / zoom) / tileSize);
    const y = Math.floor(((clientY - rect.top) / zoom) / tileSize);

    if (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length) {
      if (grid[y][x] !== mode) {
        setGrid((prev) => {
          const copy = prev.map((row) => [...row]);
          copy[y][x] = mode;
          return copy;
        });
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsInteracting(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
    
    if (mode !== -1) {
      paintAt(e.clientX, e.clientY);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isInteracting) return;

    if (mode === -1) {
      const dx = (e.clientX - lastMousePos.x) / zoom;
      const dy = (e.clientY - lastMousePos.y) / zoom;
      setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setLastMousePos({ x: e.clientX, y: e.clientY });
    } else {
      paintAt(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    setIsInteracting(false);
  };

  const handleAddLabel = () => {
    const id = parseInt(newLabel.id);
    if (isNaN(id)) {
      notify("Error: ID must be a number");
      return;
    }
    if (modes.find(m => m.id === id)) {
      notify(`Error: ID ${id} already exists`);
      return;
    }
    if (!newLabel.name) {
      notify("Error: Name is required");
      return;
    }

    const r = parseInt(newLabel.color.slice(1, 3), 16);
    const g = parseInt(newLabel.color.slice(3, 5), 16);
    const b = parseInt(newLabel.color.slice(5, 7), 16);
    
    const modeObj: Mode = {
      id,
      name: newLabel.name,
      iconName: "Tag",
      color: `rgba(${r}, ${g}, ${b}, 0.4)`,
      stroke: `rgba(${r}, ${g}, ${b}, 0.8)`,
      textColor: "text-white"
    };

    setModes([...modes, modeObj]);
    setNewLabel({ name: '', id: '', color: '#ffffff' });
    setIsAddingLabel(false);
    notify(`Label "${newLabel.name}" added`);
  };

  const removeLabel = (id: number) => {
    if (id <= 2 && id >= -1) {
      notify("Error: Cannot remove default modes");
      return;
    }
    setModes(modes.filter(m => m.id !== id));
    if (mode === id) setMode(0);
    notify("Label removed");
  };

  const autoDetect = () => {
    if (!image) return;
    
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = image.width;
    offscreenCanvas.height = image.height;
    const ctx = offscreenCanvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    
    ctx.drawImage(image, 0, 0);

    const cols = Math.floor(image.width / tileSize);
    const rows = Math.floor(image.height / tileSize);
    const newGrid: number[][] = [];
    
    const fullData = ctx.getImageData(0, 0, image.width, image.height).data;

    for (let y = 0; y < rows; y++) {
      const row: number[] = [];
      for (let x = 0; x < cols; x++) {
        let r = 0, g = 0, b = 0;
        let samples = 0;
        
        const samplePadding = Math.max(1, Math.floor(tileSize / 4));
        for (let i = samplePadding; i < tileSize - samplePadding; i += Math.max(1, Math.floor(tileSize / 8))) {
          for (let j = samplePadding; j < tileSize - samplePadding; j += Math.max(1, Math.floor(tileSize / 8))) {
            const pixelIndex = ((y * tileSize + i) * image.width + (x * tileSize + j)) * 4;
            r += fullData[pixelIndex];
            g += fullData[pixelIndex + 1];
            b += fullData[pixelIndex + 2];
            samples++;
          }
        }
        
        const avgR = r / samples;
        const avgG = g / samples;
        const avgB = b / samples;
        const brightness = (avgR + avgG + avgB) / 3;

        if (avgB > avgR * 1.15 && avgB > avgG * 1.1) {
          row.push(2); // Water
        } else if (brightness < 100) {
          row.push(1); // Blocked
        } else {
          row.push(0); // Walkable
        }
      }
      newGrid.push(row);
    }
    
    setGrid(newGrid);
    notify("Auto-detection complete");
  };

  const handleLoadGrid = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && Array.isArray(parsed[0])) {
          setGrid(parsed);
          notify("Grid configuration loaded");
        } else {
          throw new Error("Invalid format");
        }
      } catch (err) {
        notify("Error: Invalid JSON grid file");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const exportGrid = () => {
    const text = JSON.stringify(grid);
    navigator.clipboard.writeText(text);
    notify("Grid configuration copied to clipboard!");
  };

  const downloadGrid = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(grid));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    const filename = exportFilename.endsWith('.json') ? exportFilename : `${exportFilename}.json`;
    downloadAnchorNode.setAttribute("download", filename);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    notify(`Grid configuration exported as ${filename}`);
  };

  const updateTileSize = (newSize: number) => {
    if (newSize < 0.01) return;
    setTileSize(newSize);
    if (image) {
      const cols = Math.floor(image.width / newSize);
      const rows = Math.floor(image.height / newSize);
      const newGrid = Array.from({ length: rows }, () =>
        Array(cols).fill(0)
      );
      setGrid(newGrid);
      notify(`Grid recalibrated to ${newSize}px tiles`);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#141414] text-[#E4E3E0] font-sans selection:bg-[#E4E3E0] selection:text-[#141414]">
      <Header 
        onUpload={handleUpload} 
        onExport={exportGrid} 
        onDownload={downloadGrid} 
        isImageLoaded={!!image}
        filename={exportFilename}
        setFilename={setExportFilename}
      />

      <main className="flex flex-1 overflow-hidden">
        <Sidebar 
          modes={modes}
          currentMode={mode}
          setMode={setMode}
          isAddingLabel={isAddingLabel}
          setIsAddingLabel={setIsAddingLabel}
          newLabel={newLabel}
          setNewLabel={setNewLabel}
          onAddLabel={handleAddLabel}
          onRemoveLabel={removeLabel}
          isImageLoaded={!!image}
          onAutoDetect={autoDetect}
          onImportJson={() => jsonInputRef.current?.click()}
          jsonInputRef={jsonInputRef}
          showGrid={showGrid}
          setShowGrid={setShowGrid}
          zoom={zoom}
          setZoom={setZoom}
          onResetZoom={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }}
          gridSize={grid.length > 0 ? { cols: grid[0].length, rows: grid.length } : null}
          tileSize={tileSize}
          setTileSize={updateTileSize}
        />

        <Workspace 
          image={image}
          canvasRef={canvasRef}
          zoom={zoom}
          offset={offset}
          mode={mode}
          isInteracting={isInteracting}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onUpload={handleUpload}
          tileSize={tileSize}
        />

        <input
          type="file"
          accept="application/json"
          ref={jsonInputRef}
          className="hidden"
          onChange={handleLoadGrid}
        />
      </main>

      <Notification message={notification} />

      <style dangerouslySetInnerHTML={{ __html: `
        .image-render-pixelated {
          image-rendering: -moz-crisp-edges;
          image-rendering: -webkit-crisp-edges;
          image-rendering: pixelated;
          image-rendering: crisp-edges;
        }
      `}} />
    </div>
  );
}

