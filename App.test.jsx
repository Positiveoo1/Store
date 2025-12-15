import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import App from "./src/App";

beforeEach(() => {
  localStorage.clear();
  vi.spyOn(window, "alert").mockImplementation(() => {});
  vi.spyOn(window, "confirm").mockReturnValue(true);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Store App", () => {
  test("renders header and key metrics", () => {
    render(<App />);
    expect(screen.getByText("Store")).toBeInTheDocument();
    expect(screen.getByText("Sales")).toBeInTheDocument();
    expect(screen.getByText("Cost")).toBeInTheDocument();
    expect(screen.getByText("Profit")).toBeInTheDocument();
  });

  test("adds a product and shows it in Sales tab", async () => {
    render(<App />);

    await userEvent.type(screen.getByPlaceholderText("Product name"), "iPhone");
    await userEvent.type(screen.getByPlaceholderText("Quantity"), "2");
    await userEvent.type(screen.getByPlaceholderText("Buy price (UZS)"), "500");
    await userEvent.type(screen.getByPlaceholderText("Sell price (UZS)"), "800");

    const addSaleForm = screen.getByRole("form", { name: /add sale/i }); // matches the <h3>Add sale</h3>
    const addButton = within(addSaleForm).getByRole("button", { name: /add/i });

    await userEvent.click(addButton);

    await userEvent.click(screen.getByRole("button", { name: "Sales" }));

    expect(await screen.findByText("iPhone")).toBeInTheDocument();
  });

  test("prevents adding product without name or price", async () => {
    render(<App />);

    const addSaleForm = screen.getByRole("form", { name: /add sale/i });
    const addButton = within(addSaleForm).getByRole("button", { name: /add/i });

    await userEvent.click(addButton);

    expect(window.alert).toHaveBeenCalledWith("Please fill all required fields");
  });
});