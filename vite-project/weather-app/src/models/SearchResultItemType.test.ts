import "@testing-library/jest-dom";
import { SearchResultItemType } from "./SearchResultItemType";
import { describe, expect, it } from "vitest";

// SearchResultItemType 클래스의 동작을 테스트하는 테스트 스위트입니다.
describe("SearchResultItemType", () => {
  // 원격 API 응답 타입을 로컬에서 사용하는 타입으로 올바르게 변환하는지 테스트합니다.
  it("convert the remote type to local", () => {
    // 테스트를 위한 원격 API 응답 객체 예시입니다.
    const remote = {
      country: "US",
      lat: 28.106471,
      local_names: {
        en: "Melbourne",
        ja: "メルボーン",
        ru: "Мельбурн",
        uk: "Мелборн",
      },
      lon: -80.6371513,
      name: "Melbourne",
      state: "Florida",
    };

    // SearchResultItemType 클래스의 인스턴스를 생성합니다.
    const model = new SearchResultItemType(remote);

    // 변환된 모델의 각 속성이 예상과 일치하는지 확인합니다.
    expect(model.city).toEqual("Melbourne");
    expect(model.state).toEqual("Florida");
    expect(model.country).toEqual("United States");
  });
});