import type { Meta, StoryObj } from "@storybook/react";

import DaftarNaghashiComponent from ".";

const meta = {
  title: "DaftarNaghashi",
  component: DaftarNaghashiComponent,
} satisfies Meta<typeof DaftarNaghashiComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

Default.args = {
  onDrawing: () => console.log("onDrawing"),
  onStartDrawing: (c) => {
    console.log("onStartDrawing");
    console.log(c?.toDataURL());
    console.log("-----");
  },
  onStopDrawing: () => console.log("onStopDrawing"),
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
    setLineWidth,
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
                onClick={() => setLineWidth(t)}
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
