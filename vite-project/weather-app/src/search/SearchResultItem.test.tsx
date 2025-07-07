import { expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SearchResultItemType } from "../models/SearchResultItemType";
import { SearchResultItem } from "./SearchResultItem";

// SearchResultItem 컴포넌트가 도시, 주, 국가 이름을 올바르게 렌더링하는지 테스트합니다.
it("shows a city name, the state, and the country", () => {
  // SearchResultItem 컴포넌트를 렌더링합니다.
  // 테스트를 위해 SearchResultItemType의 인스턴스를 생성하여 전달합니다.
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

  // 화면에 도시, 국가, 주 이름이 올바르게 표시되는지 확인합니다.
  expect(screen.getByText("Melbourne")).toBeInTheDocument();
  expect(screen.getByText("Australia")).toBeInTheDocument();
  expect(screen.getByText("Victoria")).toBeInTheDocument();
});
