import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Profile from "./../index";
import { useStore } from "../../../store";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock useStore hook to provide user information
jest.mock("../../../store", () => ({
  useStore: jest.fn(),
}));

// Mock fetch API
global.fetch = jest.fn();

describe("Profile actions validation", () => {
  beforeEach(() => {
    // Mock store to include user information
    useStore.mockReturnValue({
      userStore: {
        userInfo: {
          id: 1,
          name: "Leanne Graham",
          username: "Bret",
          email: "Sincere@april.biz",
          address: {
            street: "Kulas Light",
            suite: "Apt. 556",
            city: "Gwenborough",
            zipcode: "92998-3874",
            geo: { lat: "-37.3159", lng: "81.1496" },
          },
          phone: "1-770-736-8031 x56442",
          website: "hildegard.org",
          company: {
            name: "Romaguera-Crona",
            catchPhrase: "Multi-layered client-server neural-net",
            bs: "harness real-time e-markets",
          },
        },
      },
    });
  });

  test("should fetch the logged in user's profile username", async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await waitFor(() => {
      const username = screen.getByPlaceholderText("Your username");
      expect(username.value).toBe("Bret");
    });
  });

  it("should show validation error for invalid email", async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: "invalidemail" } });
    fireEvent.click(screen.getByRole("button", { name: /update/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Please enter a valid email address./i)
      ).toBeInTheDocument();
    });
  });

  it("should show validation error for invalid name", async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText(/username/i);
    fireEvent.change(usernameInput, { target: { value: "1dfs" } });
    fireEvent.click(screen.getByRole("button", { name: /update/i }));

    await waitFor(() => {
      expect(
        screen.getByText(
          /Please only contain letters and numbers, but don't start with a number./i
        )
      ).toBeInTheDocument();
    });
  });

  it("should show validation error for invalid phone", async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    const phoneInput = screen.getByLabelText(/phone number/i);
    fireEvent.change(phoneInput, { target: { value: "1dfs" } });
    fireEvent.click(screen.getByRole("button", { name: /update/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Please enter a valid phone number./i)
      ).toBeInTheDocument();
    });
  });

  it("should show validation error for invalid zipcode", async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    const zipcodeInput = screen.getByLabelText(/ZIP Code/i);
    fireEvent.change(zipcodeInput, { target: { value: "1dfs" } });
    fireEvent.click(screen.getByRole("button", { name: /update/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Please enter a valid ZIP Code./i)
      ).toBeInTheDocument();
    });
  });

  it("should show validation error for password length", async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    const passwordInput = screen.getByPlaceholderText("Your password");
    const passwordConfirmInput = screen.getByPlaceholderText(
      "Your password confirmation"
    );

    fireEvent.change(passwordInput, { target: { value: "111" } });
    fireEvent.change(passwordConfirmInput, {
      target: { value: "111" },
    });
    fireEvent.click(screen.getByRole("button", { name: /update/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Password must be at least 6 characters long./i)
      ).toBeInTheDocument();
    });
  });

  it("should show validation error for mismatched passwords", async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    const passwordInput = screen.getByPlaceholderText("Your password");
    const passwordConfirmInput = screen.getByPlaceholderText(
      "Your password confirmation"
    );

    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(passwordConfirmInput, {
      target: { value: "differentPassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /update/i }));

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match./i)).toBeInTheDocument();
    });
  });

  it("submits the form successfully with valid data", async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: "newemail@example.com" } });

    const displayInput = screen.getByLabelText(/Display Name/i);
    fireEvent.change(displayInput, { target: { value: "display name" } });

    const passwordInput = screen.getByPlaceholderText("Your password");
    const passwordConfirmInput = screen.getByPlaceholderText(
      "Your password confirmation"
    );

    fireEvent.change(passwordInput, { target: { value: "123456" } });
    fireEvent.change(passwordConfirmInput, {
      target: { value: "123456" },
    });

    const zipcodeInput = screen.getByLabelText(/ZIP Code/i);
    fireEvent.change(zipcodeInput, { target: { value: "12345" } });

    // Mock fetch response for form submission
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    fireEvent.click(screen.getByRole("button", { name: /update/i }));

    await waitFor(() => {
      expect(screen.getByText(/Update Successfully./i)).toBeInTheDocument();
    });
  });
});
