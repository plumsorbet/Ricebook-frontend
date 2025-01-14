import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "./../index";
import { useStore } from "../../../store";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock useStore hook to provide user information
jest.mock("../../../store", () => ({
  useStore: jest.fn(),
}));

// Mock fetch API
global.fetch = jest.fn();

describe("Article actions validation", () => {
  beforeEach(() => {
    // Mock store to include user information
    useStore.mockReturnValue({
      userStore: {
        userInfo: { id: 1, website: "www.as.com" },
        setUserStatus: jest.fn(),
      },
    });

    fetch.mockImplementation((url) => {
      if (url === "https://jsonplaceholder.typicode.com/posts") {
        return Promise.resolve({
          json: () =>
            Promise.resolve([
              { userId: 1, id: 1, title: "Post 1", body: "Body 1" },
              { userId: 2, id: 2, title: "Post 2", body: "Body 2" },
              { userId: 1, id: 3, title: "Post 3", body: "Body 3" },
              { userId: 5, id: 4, title: "Post 4", body: "Body 4" },
            ]),
        });
      }

      if (url === "https://jsonplaceholder.typicode.com/users") {
        return Promise.resolve({
          json: () =>
            Promise.resolve([
              { id: 1, name: "User 1" },
              { id: 2, name: "User 2" },
              { id: 5, name: "User 5" },
            ]),
        });
      }

      return Promise.reject(new Error("Unknown API"));
    });
  });

  test("should fetch all articles for current logged in user", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      const posts = screen.getAllByRole("article");
      expect(posts).toHaveLength(3); // userId = 1, follow 2, 3, 4 --> 3 posts
    });
  });

  test("should fetch subset of articles for current logged in user given search keyword", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Simulate entering a search keyword and triggering the search.
    const searchInput = screen.getByPlaceholderText("Search...");
    fireEvent.change(searchInput, { target: { value: "Post 3" } });

    await waitFor(() => {
      const articles = screen.getAllByRole("article");
      expect(articles).toHaveLength(1);
    });
  });

  test("should add articles when adding a follower", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("user ID"), {
      target: { value: "5" },
    });

    const addFollowerButton = screen.getByText("Add Follower");
    fireEvent.click(addFollowerButton);

    await waitFor(() => {
      const articles = screen.getAllByRole("article");
      expect(articles).toHaveLength(4); // After adding follower(userId=5), the number of articles increased
    });
  });

  test("should remove articles when removing a follower", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("Unfollow", {
          selector: "button",
        })
      ).toBeInTheDocument();
    });
    // Retrieve all "Unfollow" buttons and click the first one
    const removeFollowerButtons = screen.getByText("Unfollow", {
      selector: "button",
    });
    fireEvent.click(removeFollowerButtons);

    await waitFor(() => {
      const articles = screen.getAllByRole("article");
      expect(articles).toHaveLength(3);
    });
  });

  test("should update new status element", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("your status"), {
      target: { value: "newest status" },
    });

    const updateButton = screen.getByText("Update");
    fireEvent.click(updateButton);

    await waitFor(() => {
      const statusDisplay = screen.getByText("newest status");
      expect(statusDisplay).toBeInTheDocument();
    });
  });

  // new post
  test("should show new post in post list", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: "this is a new test post" },
    });

    const postButton = screen.getByText("Post");
    fireEvent.click(postButton);

    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: "" },
    });

    fireEvent.click(postButton);

    await waitFor(() => {
      const articles = screen.getAllByRole("article");
      expect(articles).toHaveLength(3);
    });
  });

  test("should remind user that already added following", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("user ID"), {
      target: { value: "2" },
    });

    const addFollowerButton = screen.getByText("Add Follower");
    fireEvent.click(addFollowerButton);

    await waitFor(() => {
      expect(screen.getByText("Already followed.")).toBeInTheDocument();
    });
  });

  test("should remind user that adding an invalid user", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("user ID"), {
      target: { value: "67" },
    });

    const addFollowerButton = screen.getByText("Add Follower");
    fireEvent.click(addFollowerButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid user.")).toBeInTheDocument();
    });
  });

  test("should remind user that adding an invalid user", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("user ID"), {
      target: { value: "1" },
    });

    const addFollowerButton = screen.getByText("Add Follower");
    fireEvent.click(addFollowerButton);

    await waitFor(() => {
      expect(screen.getByText("Can't follow yourself.")).toBeInTheDocument();
    });
  });

  // comment space
  test("should remind user that adding an invalid user", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const commentButton = await screen.findAllByText("Comment");
    fireEvent.click(commentButton[0]);

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });
  });

  test("should handle file input correctly", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Get the file input element by its label text
    const fileInput = screen.getByLabelText(/Upload images/i);
    const file = new File(["image content"], "example.jpg", {
      type: "image/jpeg",
    });

    // Simulate file selection
    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    // Check if the file name appears in the UI
    expect(screen.getByText("example.jpg")).toBeInTheDocument();
  });
});
