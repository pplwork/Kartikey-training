import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import User from "../User";

let btn, component;
beforeEach(() => {
  component = render(<User />);
  btn = component.getByText("Fetch Users");
});

test("Check if fetch users button exists", () => {
  expect(btn).toBeTruthy();
});

test("Clicking on button fetches users", async () => {
  const ul = component.getByRole("list");
  expect(ul.children.length).toBe(0);
  fireEvent.click(btn);
  await waitFor(() => expect(ul.children.length).toBeTruthy());
  expect(ul.children.length).toBe(6);
});
