import type { Meta, StoryObj } from "@storybook/react";

import DaftarNaghashi from "./DaftarNaghashi";

const meta = {
  title: "DaftarNaghashi",
  component: DaftarNaghashi,
} satisfies Meta<typeof DaftarNaghashi>;

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
