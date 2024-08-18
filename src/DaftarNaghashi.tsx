import { MouseEvent, useEffect, useReducer, useRef } from "react";
import { floodFill, getPixelColor, hexToRgba } from "./utils.ts";
import { Mode } from "./types.ts";
import drawingReducer from "./reducer.ts";

type Props = {
  height?: number;
  width?: number;
  onStartDrawing?: (c: HTMLCanvasElement | null) => void;
  onDrawing?: (c: HTMLCanvasElement | null) => void;
  onStopDrawing?: (c: HTMLCanvasElement | null) => void;
};

const DrawingComponent = ({
  onStartDrawing,
  onDrawing,
  onStopDrawing,
  height = 500,
  width = 500,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // Initialize reducer state and dispatch function
  const [{ isDrawing, strokeColor, lineWidth, history, mode }, dispatch] =
    useReducer(drawingReducer, {
      isDrawing: false,
      strokeColor: "#000000",
      lineWidth: 5,
      history: [],
      mode: Mode.PEN,
    });

  const initCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineCap = "round";
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctxRef.current = ctx;
      }
    }
  };

  useEffect(() => {
    initCanvas();
  }, []);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = strokeColor;
      ctxRef.current.lineWidth = lineWidth;
    }
  }, [strokeColor, lineWidth]);

  const startDrawing = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!ctxRef.current) return;
    const { offsetX, offsetY } = e.nativeEvent;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    dispatch({ type: "START_DRAWING" });
    onStartDrawing?.(canvasRef.current);
  };

  const draw = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctxRef.current) return;

    const { offsetX, offsetY } = e.nativeEvent;
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();
    onDrawing?.(canvasRef.current);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      ctxRef.current?.closePath();
      dispatch({ type: "STOP_DRAWING" });
      saveHistory();
      onStopDrawing?.(canvasRef.current);
    }
  };

  const saveHistory = () => {
    if (canvasRef.current) {
      dispatch({
        type: "SAVE_HISTORY",
        payload: canvasRef.current.toDataURL(),
      });
    }
  };

  const undo = () => {
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
          canvasRef.current!.height,
        );
        ctxRef.current!.drawImage(img, 0, 0);
      };
    }
  };

  const clearCanvas = () => {
    if (ctxRef.current && canvasRef.current) {
      ctxRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );
      dispatch({ type: "CLEAR_CANVAS" });
    }
  };

  const handleModeChange = () => {
    dispatch({
      type: "SET_MODE",
      payload: mode === Mode.PEN ? Mode.FILL : Mode.PEN,
    });
  };

  const handleCanvasClick = (e: MouseEvent<HTMLCanvasElement>) => {
    if (mode === Mode.FILL && canvasRef.current && ctxRef.current) {
      const { offsetX, offsetY } = e.nativeEvent;
      const imageData = ctxRef.current.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );
      const targetColor = getPixelColor(imageData, offsetX, offsetY);
      floodFill(
        imageData,
        offsetX,
        offsetY,
        targetColor,
        hexToRgba(strokeColor),
      );
      ctxRef.current.putImageData(imageData, 0, 0);
      saveHistory();
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <label>
          Color:
          <input
            type="color"
            value={strokeColor}
            onChange={(e) =>
              dispatch({ type: "SET_COLOR", payload: e.target.value })
            }
          />
        </label>
        <label>
          Thickness:
          <input
            type="number"
            value={lineWidth}
            min="1"
            max="100"
            onChange={(e) =>
              dispatch({
                type: "SET_LINE_WIDTH",
                payload: parseInt(e.target.value),
              })
            }
          />
        </label>
        <button onClick={undo}>Undo</button>
        <button onClick={clearCanvas}>Clear</button>
        <button onClick={handleModeChange}>
          Switch to {mode === Mode.PEN ? "Fill" : "Pen"} Mode
        </button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={mode === Mode.PEN ? startDrawing : undefined}
        onMouseMove={mode === Mode.PEN ? draw : undefined}
        onMouseUp={mode === Mode.PEN ? stopDrawing : undefined}
        onMouseLeave={mode === Mode.PEN ? stopDrawing : undefined}
        onClick={mode === Mode.FILL ? handleCanvasClick : undefined}
        style={{
          border: "1px solid black",
          cursor: mode === Mode.PEN ? "crosshair" : "pointer",
        }}
      />
    </div>
  );
};

export default DrawingComponent;
