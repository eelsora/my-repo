import { useState } from "react";
import "./App.css";
import { SearchResultItem } from "./search/SearchResultItem";
import type { SearchResultItemType } from "./models/SearchResultItemType";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_TEST_KEY;

function App() {
  const [query, setQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResultItemType[]>(
    []
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchCities();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const fetchCities = async () => {
    await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
    )
      .then((r) => r.json())
      .then((cities) => {
        setSearchResults(
          cities.map(({ city, state, country }: SearchResultItemType) => {
            return {
              city: city,
              state: state,
              country: country,
            };
          })
        );
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="app">
      <h1>Weather Application</h1>
      <div className="search-bar">
        <input
          type="text"
          data-testid="search-input"
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          placeholder="Enter city name (e.g. Melbourne, New York)"
        />
      </div>

      <div className="search-results-popup">
        <h1 style={{ margin: 0 }}>{searchResults.length}</h1>
        {searchResults.length > 0 && (
          <ul data-testid="search-results" className="search-results">
            {searchResults.map((city, index) => (
              <SearchResultItem key={index} item={city} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
