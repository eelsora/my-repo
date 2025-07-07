/**
 * API로부터 받는 원격 검색 결과 항목의 인터페이스입니다.
 */
export interface RemoteSearchResultItem {
  /**
   * 도시의 이름입니다.
   * @type {string}
   */
  name: string;

  /**
   * 주의 이름입니다.
   * @type {string}
   */
  state: string;

  /**
   * 국가 코드입니다. (예: "US", "GB")
   * @type {string}
   */
  country: string;

  /**
   * 경도 좌표입니다.
   * @type {number}
   */
  lon: number;

  /**
   * 위도 좌표입니다.
   * @type {number}
   */
  lat: number;

  /**
   * 다양한 언어로 된 지역 이름의 맵입니다. (선택 사항)
   * @type {{ [key: string]: string; }}
   */
  local_names?: {
    [key: string]: string;
  };
}