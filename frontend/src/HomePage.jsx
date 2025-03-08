import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const [queryCondition, setQueryCondition] = useState({
    FirstName: { condition: "=", value: "" },
    Class: { condition: "=", value: "" },
    StudentId: { condition: "=", value: "" },
  });

  const [query, setQuery] = useState("");
  const handleInputChange = (field, key, newValue) => {
    setQueryCondition((prev) => ({
      ...prev,
      [field]: { ...prev[field], [key]: newValue },
    }));
  };

  const handleSearch = () => {
    navigate(`/results?q=${encodeURIComponent(query)}`, {
      state: { queryCondition },
    });
  };

  return (
    <div className="container mt-5">
      <h1
        className="mb-4"
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      >
        Home Page
      </h1>
      <input
        type="text"
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      />
      <button className="btn btn-primary" onClick={handleSearch}>
        Go to Results
      </button>
    </div>
  );
};

export default HomePage;
