import type { Meta, StoryObj } from "@storybook/react";

import DaftarNaghashiComponent from ".";

const meta = {
  title: "DaftarNaghashi",
  component: DaftarNaghashiComponent,
} satisfies Meta<typeof DaftarNaghashiComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DaftarNaghashi: Story = {};

DaftarNaghashi.args = {
  onDrawing: () => console.log("onDrawing"),
  onStartDrawing: (c) => {
    console.log("onStartDrawing");
    console.log(c?.toDataURL());
    console.log("-----");
  },
  onStopDrawing: () => console.log("onStopDrawing"),
};
