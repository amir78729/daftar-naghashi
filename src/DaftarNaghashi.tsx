import React, { MouseEvent, useEffect, useReducer, useRef, TouchEvent } from "react";
import { floodFill, getPixelColor, hexToRgba } from "./utils.ts";
import { Mode, ToolbarProps } from "./types.ts";
import drawingReducer from "./reducer.ts";
import { useHotkeys } from "react-hotkeys-hook";

type Props = {
  height?: number;
  width?: number;
  viewMode?: boolean;
  onStartDrawing?: (c: HTMLCanvasElement | null) => void;
  onDrawing?: (c: HTMLCanvasElement | null) => void;
  onStopDrawing?: (c: HTMLCanvasElement | null) => void;
  renderToolbar?: (props: ToolbarProps) => React.ReactNode;
  value?: string;
};

const renderDefaultToolbar = ({
  setThickness,
  thickness,
  setColor,
  color,
  undo,
  clear,
  setMode,
  viewMode,
}: ToolbarProps) => (
  <div style={{ marginBottom: "10px" }}>
    <label>
      Color:
      <input
        disabled={viewMode}
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
    </label>
    <label>
      Thickness:
      <input
        disabled={viewMode}
        type="number"
        value={thickness}
        min="1"
        max="100"
        onChange={(e) => setThickness(parseInt(e.target.value, 10))}
      />
    </label>
    <button title="shortcut: u" disabled={viewMode} onClick={undo}>
      Undo
    </button>
    <button title="shortcut: c" disabled={viewMode} onClick={clear}>
      Clear
    </button>
    <button
      title="shortcut: p or b"
      disabled={viewMode}
      onClick={() => setMode("pen")}
    >
      Switch to Pen Mode
    </button>
    <button
      title="shortcut: f"
      disabled={viewMode}
      onClick={() => setMode("fill")}
    >
      Switch to Fill Mode
    </button>
  </div>
);

const DrawingComponent = ({
  onStartDrawing,
  onDrawing,
  onStopDrawing,
  height = 500,
  width = 500,
  viewMode = false,
  renderToolbar = renderDefaultToolbar,
  value,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [{ isDrawing, color, thickness, history, mode }, dispatch] = useReducer(
      drawingReducer,
      {
        isDrawing: false,
        color: "#000000",
        thickness: 5,
        history: [],
        mode: "pen",
      }
  );

  const initCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineCap = "round";
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctxRef.current = ctx;
        if (value) {
          const img = new Image();
          img.src = value;
          img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            dispatch({ type: "SAVE_HISTORY", payload: value });
          };
        }
      }
    }
  };

  useEffect(() => {
    initCanvas();
  }, []);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = color;
      ctxRef.current.lineWidth = thickness;
    }
  }, [color, thickness]);

  const getTouchPos = (e: TouchEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const touch = e.touches[0];
    return {
      offsetX: touch.clientX - rect.left,
      offsetY: touch.clientY - rect.top,
    };
  };

  const startDrawing = (e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
    if (!ctxRef.current || viewMode) return;

    if (e.type === "touchstart") {
      e.preventDefault();
    }

    const { offsetX, offsetY } =
        e.type === "mousedown" ? (e as MouseEvent).nativeEvent : getTouchPos(e as TouchEvent<HTMLCanvasElement>);

    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    dispatch({ type: "START_DRAWING" });
    onStartDrawing?.(canvasRef.current);
  };

  const draw = (e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctxRef.current || viewMode) return;

    if (e.type === "touchmove") {
      e.preventDefault();
    }

    const { offsetX, offsetY } =
        e.type === "mousemove" ? (e as MouseEvent).nativeEvent : getTouchPos(e as TouchEvent<HTMLCanvasElement>);

    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();
    onDrawing?.(canvasRef.current);
  };

  const stopDrawing = (e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
    if (viewMode) return;

    if (isDrawing) {
      if (e.type === "touchend") {
        e.preventDefault();
      }
      ctxRef.current?.closePath();
      dispatch({ type: "STOP_DRAWING" });
      saveHistory();
      onStopDrawing?.(canvasRef.current);
    }
  };

  const saveHistory = () => {
    if (viewMode) return;
    if (canvasRef.current) {
      dispatch({
        type: "SAVE_HISTORY",
        payload: canvasRef.current.toDataURL(),
      });
    }
  };

  const undo = () => {
    if (viewMode) return;
    dispatch({ type: "UNDO" });
    if (ctxRef.current && canvasRef.current && history.length > 1) {
      const previousState = history[history.length - 2];
      const img = new Image();
      img.src = previousState;
      img.onload = () => {
        ctxRef.current!.clearRect(
            0,
            0,
            canvasRef.current!.width,
            canvasRef.current!.height
        );
        ctxRef.current!.drawImage(img, 0, 0);
      };
    }
    onDrawing?.(canvasRef.current);
  };
  useHotkeys("u", undo);

  const clear = () => {
    if (viewMode) return;
    if (ctxRef.current && canvasRef.current) {
      ctxRef.current.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
      );
      dispatch({ type: "CLEAR_CANVAS" });
      onDrawing?.(canvasRef.current);
    }
  };
  useHotkeys("c", clear);

  const setMode = (m: Mode) => {
    if (viewMode) return;
    dispatch({
      type: "SET_MODE",
      payload: m,
    });
  };
  useHotkeys("b", () => setMode("pen"));
  useHotkeys("p", () => setMode("pen"));
  useHotkeys("f", () => setMode("fill"));

  const handleCanvasClick = (e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
    if (viewMode) return;
    if (mode === "fill" && canvasRef.current && ctxRef.current) {
      const { offsetX, offsetY } =
        e.type === "click" ? (e as MouseEvent).nativeEvent : getTouchPos(e as TouchEvent<HTMLCanvasElement>);
      const imageData = ctxRef.current.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      const targetColor = getPixelColor(imageData, offsetX, offsetY);
      floodFill(imageData, offsetX, offsetY, targetColor, hexToRgba(color));
      ctxRef.current.putImageData(imageData, 0, 0);
      saveHistory();
    }
    onDrawing?.(canvasRef.current);
  };

  const setThickness = (value: number) => {
    if (viewMode) return;
    dispatch({
      type: "SET_THICKNESS",
      payload: value,
    });
  };

  const setColor = (value: string) => {
    if (viewMode) return;
    dispatch({
      type: "SET_COLOR",
      payload: value,
    });
  };

  return (
    <div key={value}>
      <canvas
        ref={canvasRef}
        onMouseDown={mode === "pen" ? startDrawing : undefined}
        onMouseMove={mode === "pen" ? draw : undefined}
        onMouseUp={mode === "pen" ? stopDrawing : undefined}
        onMouseLeave={mode === "pen" ? stopDrawing : undefined}
        onTouchStart={mode === "pen" ? startDrawing : undefined}
        onTouchMove={mode === "pen" ? draw : undefined}
        onTouchEnd={mode === "pen" ? stopDrawing : handleCanvasClick}
        onClick={mode === "fill" ? handleCanvasClick : undefined}
        style={{
          border: "1px solid black",
          cursor: viewMode ? 'not-allowed' : (mode === "pen" ? "crosshair" : "pointer"),
          outline: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
      />
      {!viewMode &&
        renderToolbar({
          viewMode,
          setThickness,
          thickness: thickness,
          setColor,
          color,
          undo,
          clear,
          setMode,
          mode,
        })}
    </div>
  );
};

export default DrawingComponent;
