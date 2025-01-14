import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Login from "../index";
import Nav from "../../../components/Nav";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

global.fetch = jest.fn();

describe("Authentication validation", () => {
  beforeEach(() => {
    fetch.mockImplementation((url) => {
      if (url === "https://jsonplaceholder.typicode.com/users") {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { username: "Bret", address: { street: "Kulas Light" } },
            ]),
        });
      }
      return Promise.reject(new Error("Unknown URL"));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should log in a previously registered user", async () => {
    const setItemMock = jest.spyOn(Storage.prototype, "setItem");

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("your username"), {
      target: { value: "Bret" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••"), {
      target: { value: "Kulas Light" },
    });

    fireEvent.click(screen.getByText("Sign IN", { selector: "button" }));

    await waitFor(() => {
      console.log(localStorage);
      expect(localStorage.getItem("user")).not.toBeNull();
    });

    // 清除 mock
    setItemMock.mockRestore();
  });

  it("should not log in an invalid user", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("your username"), {
      target: { value: "Bret" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••"), {
      target: { value: "wrong" },
    });

    fireEvent.click(screen.getByText("Sign IN"), { selector: "button" });
  });

  it("should log out a user", () => {
    localStorage.setItem("user", "userInfo");

    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Log out/i }));

    expect(localStorage.getItem("user")).toBeNull();
  });
});
