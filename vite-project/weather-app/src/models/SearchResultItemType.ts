import type { RemoteSearchResultItem } from "./RemoteSearchResultItem";

/**
 * 국가 코드를 전체 이름으로 매핑하는 맵입니다.
 * @type {Record<string, string>}
 */
const countryMap = {
  AU: "Australia",
  US: "United States",
  GB: "United Kingdom",
};

/**
 * 단일 검색 결과 항목을 나타냅니다.
 * 도시의 이름, 주, 국가 및 지리적 좌표를 포함한 데이터를 캡슐화합니다.
 */
class SearchResultItemType {
  private readonly _city: string;
  private readonly _state: string;
  private readonly _country: string;
  private readonly _lat: number;
  private readonly _long: number;

  /**
   * SearchResultItemType의 인스턴스를 생성합니다.
   * @param {RemoteSearchResultItem} item - API의 원격 검색 결과 항목입니다.
   */
  constructor(item: RemoteSearchResultItem) {
    this._city = item.name;
    this._state = item.state;
    this._country = item.country;
    this._lat = item.lat;
    this._long = item.lon;
  }

  /**
   * 도시의 이름을 가져옵니다.
   * @returns {string} 도시 이름.
   */
  get city() {
    return this._city;
  }

  /**
   * 주의 이름을 가져옵니다.
   * @returns {string} 주 이름.
   */
  get state() {
    return this._state;
  }

  /**
   * 국가의 전체 이름을 가져옵니다.
   * 국가 코드가 `countryMap`에 있으면 전체 이름을 반환하고, 그렇지 않으면 국가 코드 자체를 반환합니다.
   * @returns {string} 전체 국가 이름 또는 국가 코드.
   */
  get country() {
    return (
      countryMap[this._country as keyof typeof countryMap] || this._country
    );
  }

  /**
   * 위치의 위도를 가져옵니다.
   * @returns {number} 위도.
   */
  get latitude() {
    return this._lat;
  }

  /**
   * 위치의 경도를 가져옵니다.
   * @returns {number} 경도.
   */
  get longitude() {
    return this._long;
  }
}

export { SearchResultItemType };
