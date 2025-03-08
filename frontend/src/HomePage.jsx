import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const [queryCondition, setQueryCondition] = useState({
    FirstName: { condition: "=", value: "" },
    Class: { condition: "=", value: "" },
    StudentId: { condition: "=", value: "" },
    ContactNumber: { condition: "=", value: "" },
    BookTitle: { condition: "=", value: "" },
    Author: { condition: "=", value: "" },
    IssueDate: { condition: "=", value: "" },
    ReturnDate: { condition: "=", value: "" },
    Status: { condition: "=", value: "" },
  });

  const handleInputChange = (field, key, newValue) => {
    setQueryCondition((prev) => ({
      ...prev,
      [field]: { ...prev[field], [key]: newValue },
    }));
  };

  const handleSearch = async () => {
    try {
      const response = await fetch("http://localhost:5000/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(queryCondition),
      });

      const data = await response.json();
      navigate("/results", { state: { results: data } });
    } catch (error) {
      console.error("API Error:", error);
      alert("Unable to retrieve data");
    }
  };

  return (
    <div class="d-flex justify-content-center align-items-center vh-100">
    <div className="container py-5" style={{ backgroundColor: "##808080" }}>
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-header text-white text-center py-4 rounded-top" 
                 style={{ backgroundColor: "#212529" }}>
              <h2 className="mb-0">Integrated Student & Library Search</h2>
            </div>
            <div className="card-body p-4">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead style={{ backgroundColor: "#f8f9fa" }}>
                    <tr>
                      <th className="rounded-start" style={{ width: "20%" }}>Field Name</th>
                      <th style={{ width: "25%" }}>Condition</th>
                      <th className="rounded-end" style={{ width: "55%" }}>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(queryCondition).map((field, index) => (
                      <tr key={field} style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f8f9fa" }}>
                        <td className="align-middle fw-medium" style={{ color: "#212529" }}>{field}</td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={queryCondition[field].condition}
                            onChange={(e) =>
                              handleInputChange(field, "condition", e.target.value)
                            }
                            style={{ borderColor: "#212529", color: "#212529" }}
                          >
                            <option value="=">=</option>
                            <option value=">">{">"}</option>
                            <option value="<">{"<"}</option>
                            <option value="LIKE">LIKE</option>
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder={`Enter ${field}`}
                            value={queryCondition[field].value}
                            onChange={(e) =>
                              handleInputChange(field, "value", e.target.value)
                            }
                            style={{ borderColor: "#dee2e6" }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer text-center p-4 rounded-bottom" 
                 style={{ backgroundColor: "#f8f9fa" }}>
              <button 
                className="btn text-white px-5 shadow-sm" 
                onClick={handleSearch}
                style={{ backgroundColor: "#212529", borderRadius: "4px" }}
              >
                <i className="bi bi-search me-2"></i>Search
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
  );
};

export default HomePage;