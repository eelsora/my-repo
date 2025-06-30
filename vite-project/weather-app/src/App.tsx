import { useState } from "react";
import "./App.css";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_TEST_KEY;

interface City {
  city: string;
  name: string;
  country: string;
}

function App() {
  const [query, setQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<City[]>([]);

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
        console.log("reader ==>", cities);
        setSearchResults(
          cities.map(({ city, name, country }: City) => {
            return {
              city: city,
              name: name,
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
            {searchResults.map((item, index) => (
              <li className="search-result" key={`search-result-${index}`}>
                <span className="city">{item.city}</span>
                <span className="name">{item.name}</span>
                <span className="country">{item.country}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
