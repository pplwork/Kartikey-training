import React from "react";
import Counter from "../Counter";
import { render, fireEvent, cleanup } from "@testing-library/react";

let component;
beforeEach(() => {
  component = render(<Counter />);
});

afterEach(() => {
  // runs by default, just mentioning here for syntax
  cleanup();
});

test("Header Renders with correct text", () => {
  const header = component.getByTestId("header");
  expect(header.textContent).toBe("My Counter");
});

test("Counter initially starts with 0", () => {
  const counter = component.getByTestId("counter");
  expect(counter.textContent).toBe("0");
});

test("Input starts initially with 1", () => {
  const input = component.getByTestId("input");
  expect(input.value).toBe("1");
});

test("Add Button Renders with + ", () => {
  const add = component.getByTestId("add-btn");
  expect(add.textContent).toBe("+");
});

test("Subtract Button Renders with - ", () => {
  const sub = component.getByTestId("sub-btn");
  expect(sub.textContent).toBe("-");
});

test("Changing Value of input works", () => {
  const input = component.getByTestId("input");
  expect(input.value).toBe("1");
  fireEvent.change(input, {
    target: {
      value: "5",
    },
  });
  expect(input.value).toBe("5");
});

test("Clicking on + button adds 1 to counter", () => {
  const btn = component.getByTestId("add-btn");
  const counter = component.getByTestId("counter");
  fireEvent.click(btn);
  expect(counter.textContent).toBe("1");
});

test("Clicking on - button subtracts 1 to counter", () => {
  const btn = component.getByTestId("sub-btn");
  const counter = component.getByTestId("counter");
  fireEvent.click(btn);
  expect(counter.textContent).toBe("-1");
});

test("Changing input value then clicking on add btn works correctly", () => {
  const btn = component.getByTestId("add-btn");
  const counter = component.getByTestId("counter");
  const input = component.getByTestId("input");
  expect(counter.textContent).toBe("0");
  expect(input.value).toBe("1");
  fireEvent.change(input, {
    target: {
      value: "10",
    },
  });
  expect(input.value).toBe("10");
  fireEvent.click(btn);
  expect(counter.textContent).toBe("10");
});

test("Changing input value then clicking on sub btn works correctly", () => {
  const btn = component.getByTestId("sub-btn");
  const counter = component.getByTestId("counter");
  const input = component.getByTestId("input");
  expect(counter.textContent).toBe("0");
  expect(input.value).toBe("1");
  fireEvent.change(input, {
    target: {
      value: "10",
    },
  });
  expect(input.value).toBe("10");
  fireEvent.click(btn);
  expect(counter.textContent).toBe("-10");
});

test("adding and then subtracting gets correct result", () => {
  const addBTN = component.getByTestId("add-btn");
  const subBTN = component.getByTestId("sub-btn");
  const counter = component.getByTestId("counter");
  const input = component.getByTestId("input");
  fireEvent.change(input, {
    target: {
      value: "8",
    },
  });
  fireEvent.click(addBTN);
  fireEvent.click(addBTN);
  fireEvent.click(addBTN);
  fireEvent.click(addBTN);
  fireEvent.click(subBTN);
  fireEvent.click(subBTN);
  expect(counter.textContent).toBe("16");
  fireEvent.click(subBTN);
  fireEvent.change(input, {
    target: {
      value: "11",
    },
  });
  fireEvent.click(subBTN);
  expect(counter.textContent).toBe("-3");
});

test("counter contains correct classname", () => {
  const addBTN = component.getByTestId("add-btn");
  const subBTN = component.getByTestId("sub-btn");
  const counter = component.getByTestId("counter");
  const input = component.getByTestId("input");

  expect(counter.className).toBe("");

  fireEvent.change(input, {
    target: {
      value: "50",
    },
  });
  fireEvent.click(addBTN);
  expect(counter.className).toBe("");
  fireEvent.click(addBTN);
  expect(counter.className).toBe("green");
  fireEvent.click(addBTN);
  expect(counter.className).toBe("green");
  fireEvent.click(subBTN);
  fireEvent.click(subBTN);
  expect(counter.className).toBe("");
  fireEvent.click(subBTN);
  fireEvent.click(subBTN);
  fireEvent.click(subBTN);
  expect(counter.className).toBe("red");
});
