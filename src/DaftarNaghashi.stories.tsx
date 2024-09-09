import type { Meta, StoryObj } from "@storybook/react";

import DaftarNaghashiComponent from ".";
import {useState} from "react";
import DaftarNaghashi from "./DaftarNaghashi";

const meta = {
  title: "DaftarNaghashi",
  component: DaftarNaghashiComponent,
} satisfies Meta<typeof DaftarNaghashiComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {};

Simple.args = {
  onDrawing: () => console.log("onDrawing"),
  onStartDrawing: (c) => {
    console.log("onStartDrawing");
    console.log(c?.toDataURL());
    console.log("-----");
  },
  onStopDrawing: () => console.log("onStopDrawing"),
};

export const viewMode: Story = {};

viewMode.args = {
  onDrawing: () => console.log("onDrawing"),
  onStartDrawing: (c) => {
    console.log("onStartDrawing");
    console.log(c?.toDataURL());
    console.log("-----");
  },
  viewMode: true,
  onStopDrawing: () => console.log("onStopDrawing"),
  value:
    "data:image/png;base64,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gtYNAQIECBAoKSDQS+pqmwABAgQIVBIQ6JWgdUOAAAECBEoKCPSSutomQIAAAQKVBAR6JWjdECBAgACBkgICvaSutgkQIECAQCUBgV4JWjcECBAgQKCkgEAvqattAgQIECBQSUCgV4LWDQECBAgQKCkg0EvqapsAAQIECFQSEOiVoHVDgAABAgRKCgj0krraJkCAAAEClQQEeiVo3RAgQIAAgZICAr2krrYJECBAgEAlAYFeCVo3BAgQIECgpIBAL6mrbQIECBAgUElAoFeC1g0BAgQIECgpINBL6mqbAAECBAhUEhDolaB1Q4AAAQIESgoI9JK62iZAgAABApUEBHolaN0QIECAAIGSAgK9pK62CRAgQIBAJQGBXglaNwQIECBAoKSAQC+pq20CBAgQIFBJQKBXgtYNAQIECBAoKSDQS+pqmwABAgQIVBIQ6JWgdUOAAAECBEoKCPSSutomQIAAAQKVBAR6JWjdECBAgACBkgICvaSutgkQIECAQCUBgV4JWjcECBAgQKCkgEAvqattAgQIECBQSUCgV4LWDQECBAgQKCkg0EvqapsAAQIECFQSEOiVoHVDgAABAgRKCgj0krraJkCAAAEClQQEeiVo3RAgQIAAgZICAr2krrYJECBAgEAlAYFeCVo3BAgQIECgpIBAL6mrbQIECBAgUElAoFeC1g0BAgQIECgpINBL6mqbAAECBAhUEhDolaB1Q4AAAQIESgoI9JK62iZAgAABApUEBHolaN0QIECAAIGSAgK9pK62CRAgQIBAJQGBXglaNwQIECBAoKSAQC+pq20CBAgQIFBJ4P8DoisvXicFpf4AAAAASUVORK5CYII=",
};

export const CustomToolbar: Story = {};

CustomToolbar.args = {
  onDrawing: () => console.log("onDrawing"),
  onStartDrawing: (c) => {
    console.log("onStartDrawing");
    console.log(c?.toDataURL());
    console.log("-----");
  },
  onStopDrawing: () => console.log("onStopDrawing"),
  renderToolbar: ({
    setThickness,
    thickness,
    setColor,
    color,
    undo,
    clear,
    setMode,
    mode,
  }) => {
    const colors = ["red", "green", "yellow", "black", "blue"];
    const thicknesses = [20, 30, 40, 50];
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Lalezar&display=swap');
          * {
            font-family: 'Lalezar', sans-serif;
            font-weight: 200;
          }
          .toolbar {
            padding: 5px;
          }
          .toolbar, .thickness, .colors {
              display: flex;
              align-items: center;
          }
          .toolbar {
              gap: 10px;
          }
          .thickness, .colors {
              gap: 2px;
          }
          
          button {
            border: none;
            outline: none;
            border-radius: 1000px;
          }
          
          .color {
            width: 20px;
            height: 20px;
            text-align: center;
          }
          
          .col {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          
              `}</style>
        <div className="toolbar">
          <div className="col">
            <button onClick={undo}>پاک کردن قبلی</button>
            <button onClick={clear}>پاک کردن کامل</button>
          </div>
          <div className="col">
            <button onClick={() => setMode("fill")}>
              حالت رنگ کردن{mode === "fill" ? "✅" : ""}
            </button>
            <button onClick={() => setMode("pen")}>
              حالت نقاشی{mode === "pen" ? "✅" : ""}
            </button>
          </div>
          <div className="colors">
            {colors.map((c) => (
              <button
                className="color"
                style={{ background: c, color: "white" }}
                onClick={() => setColor(c)}
              >
                {c === color ? "✅" : ""}
              </button>
            ))}
          </div>
          <div className="thickness">
            {thicknesses.map((t) => (
              <button
                style={{ height: t, width: t }}
                onClick={() => setThickness(t)}
              >
                {t === thickness ? "✅" : ""}
              </button>
            ))}
          </div>
        </div>
      </>
    );
  },
};

export const PlayingTemplate = () => {
  const [drawing, setDrawing] = useState<string>();
  return (
      <div style={{ display: "flex", gap: 50 }}>
        <div>
          <h3>👀 WATCHER</h3>
          <DaftarNaghashi key={drawing} height={200} width={200} viewMode value={drawing} />
        </div>
        <div>
          <h3>✍️ DRAWER</h3>
          <DaftarNaghashi height={200} width={200} onDrawing={(c) => setDrawing(c?.toDataURL())} />
        </div>
      </div>
  )
};

export const Multiplayer = PlayingTemplate.bind({});
