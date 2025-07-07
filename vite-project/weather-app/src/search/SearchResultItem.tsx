import { SearchResultItemType } from "../models/SearchResultItemType";

/**
 * 검색 결과의 단일 항목을 표시하는 React 컴포넌트입니다.
 *
 * @param {object} props - 컴포넌트에 전달되는 속성입니다.
 * @param {SearchResultItemType} props.item - 표시할 검색 결과 항목 데이터입니다.
 * @returns {JSX.Element}
 */
export const SearchResultItem = ({
  item,
}: // onItemClick,
{
  item: SearchResultItemType;
  // onItemClick: (item: SearchResultItemType) => void;
}) => {
  return (
    // 각 검색 결과 항목을 나타내는 리스트 아이템입니다.
    // 주석 처리된 onClick 핸들러는 항목 클릭 시 특정 동작을 수행하는 데 사용될 수 있습니다.
    <li className="search-result" /* onClick={() => onItemClick(item)} */>
      {/* 도시 이름을 표시합니다. */}
      <span className="city">{item.city}</span>
      {/* 주 이름을 표시합니다. */}
      <span className="state">{item.state}</span>
      {/* 국가 이름을 표시합니다. */}
      <span className="country">{item.country}</span>
    </li>
  );
};