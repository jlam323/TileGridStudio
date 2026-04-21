import { LucideIcon } from "lucide-react";

export interface Mode {
  id: number;
  name: string;
  iconName: string;
  color: string;
  stroke?: string;
  textColor: string;
}

export interface Offset {
  x: number;
  y: number;
}

export interface LabelInput {
  name: string;
  id: string;
  color: string;
}
