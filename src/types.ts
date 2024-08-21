export type RGBA = [number, number, number, number];

export type Mode = "pen" | "fill";

export type ToolbarProps = {
  readonly: boolean;
  setLineWidth: (width: number) => void;
  thickness: number;
  setColor: (color: string) => void;
  color: string;
  undo: () => void;
  clear: () => void;
  setMode: (mode: Mode) => void;
  mode: Mode;
};
