import { Grab, MousePointer2, Ban, Droplets, Tag } from "lucide-react";
import { Mode } from "./types";

export const DEFAULT_TILE_SIZE = 16;

export const ICON_MAP = {
  Grab,
  MousePointer2,
  Ban,
  Droplets,
  Tag
};

export const DEFAULT_MODES: Mode[] = [
  { id: -1, name: "Pan", iconName: "Grab", color: "transparent", stroke: "transparent", textColor: "text-zinc-400" },
  { id: 0, name: "Walkable", iconName: "MousePointer2", color: "rgba(34, 197, 94, 0.2)", stroke: "rgba(34, 197, 94, 0.4)", textColor: "text-green-400" },
  { id: 1, name: "Blocked", iconName: "Ban", color: "rgba(255, 0, 0, 0.3)", stroke: "rgba(255, 0, 0, 0.7)", textColor: "text-red-500" },
  { id: 2, name: "Water", iconName: "Droplets", color: "rgba(0, 255, 255, 0.4)", stroke: "rgba(0, 255, 255, 0.9)", textColor: "text-cyan-400" },
];
