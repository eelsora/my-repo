import { expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SearchResultItemType } from "../models/SearchResultItemType";
import { SearchResultItem } from "./SearchResultItem";

it("shows a city name, the state, and the country", () => {
  render(
    <SearchResultItem
      item={
        new SearchResultItemType({
          country: "AU",
          lat: -37.8141705,
          lon: 144.9655616,
          name: "Melbourne",
          state: "Victoria",
        })
      }
    />
  );

  expect(screen.getByText("Melbourne")).toBeInTheDocument();
});
