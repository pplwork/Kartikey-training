import React from "react";
import { render } from "@testing-library/react";
import App from "./App";
import "@testing-library/jest-dom/extend-expect";

test("App", () => {
  const component = render(<App />);
  const app = component.container.getElementsByClassName("App")[0];
  expect(app).toBeInTheDocument();
});
