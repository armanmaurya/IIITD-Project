import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [authors, setAuthors] = useState([]);
  const [studentNames, setStudentNames] = useState([]);
  const [loading, setLoading] = useState({
    books: false,
    names: false,
  });
  const [error, setError] = useState({
    books: null,
    names: null,
  });

  const [queryValues, setQueryValues] = useState({
    Name: "",
    grade: "",
    studentId: "",
    book: "",
    status: "", // Will be populated based on checkbox selection
  });

  const [statusFilter, setStatusFilter] = useState({
    returned: false,
    notReturned: false,
  });

  const fetchAuthors = async () => {
    setLoading((prev) => ({ ...prev, books: true }));
    setError((prev) => ({ ...prev, books: null }));
    try {
      const response = await fetch("http://192.168.162.25:8000/api/books/");
      if (!response.ok) {
        throw new Error(`Failed to fetch books: ${response.status}`);
      }
      const data = await response.json();
      console.log("Books data:", data); // Debug log
      setAuthors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching books:", error);
      setError((prev) => ({ ...prev, books: error.message }));
    } finally {
      setLoading((prev) => ({ ...prev, books: false }));
    }
  };

  const fetchStudentNames = async () => {
    setLoading((prev) => ({ ...prev, names: true }));
    setError((prev) => ({ ...prev, names: null }));
    try {
      const response = await fetch("http://192.168.162.25:8000/api/names/");
      if (!response.ok) {
        throw new Error(`Failed to fetch student names: ${response.status}`);
      }
      const data = await response.json();
      console.log("Student names data:", data); // Debug log
      setStudentNames(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching student names:", error);
      setError((prev) => ({ ...prev, names: error.message }));
    } finally {
      setLoading((prev) => ({ ...prev, names: false }));
    }
  };

  // Fetch data from the APIs when component mounts
  useEffect(() => {
    fetchAuthors();
    fetchStudentNames();
  }, []);

  const handleInputChange = (field, newValue) => {
    setQueryValues((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  const handleStatusChange = (status) => {
    const newStatusFilter = { ...statusFilter };

    if (status === "returned") {
      newStatusFilter.returned = !newStatusFilter.returned;
      newStatusFilter.notReturned = false; // Uncheck the other option
    } else {
      newStatusFilter.notReturned = !newStatusFilter.notReturned;
      newStatusFilter.returned = false; // Uncheck the other option
    }

    setStatusFilter(newStatusFilter);

    // Update the Status value in queryValues based on selection
    let statusValue = "";
    if (newStatusFilter.returned) statusValue = "Returned";
    if (newStatusFilter.notReturned) statusValue = "Not Returned";

    setQueryValues((prev) => ({
      ...prev,
      Status: statusValue,
    }));
  };

  const handleSearch = async () => {
    const params = new URLSearchParams();

    Object.keys(queryValues).forEach((key) => {
      if (queryValues[key]) {
        params.append(key.toLowerCase(), queryValues[key]); // Convert key to lowercase for consistency
      }
    });
    const queryString = params.toString(); // Generate query string like "firstname=John&class=10"

    // Navigate to results page with both the results and the query conditions
    navigate(`/results?${queryString}`);
  };

  // Fields to render as normal text inputs (excluding Name, Status and Book)
  const textInputFields = ["Grade", "StudentId"];

  // CSS styles for custom black checkboxes and dropdown
  const customStyles = `
    .custom-black-checkbox .form-check-input {
      border-color: #212529;
    }
    .custom-black-checkbox .form-check-input:checked {
      background-color: #212529;
      border-color: #212529;
    }
    .custom-black-checkbox .form-check-input:focus {
      box-shadow: 0 0 0 0.25rem rgba(33, 37, 41, 0.25);
      border-color: #212529;
    }
    .custom-select {
      border-color: #dee2e6;
      border-radius: 0.375rem;
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
      line-height: 1.5;
      color: #212529;
    }
    .custom-select:focus {
      border-color: #212529;
      box-shadow: 0 0 0 0.25rem rgba(33, 37, 41, 0.25);
    }
    .custom-select option {
      color: #212529;
    }
  `;

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <style>{customStyles}</style>
      <div className="container py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-lg border-0 rounded-lg">
              <div
                className="card-header text-white text-center py-4 rounded-top"
                style={{ backgroundColor: "#212529" }}
              >
                <h2 className="mb-0">Integrated Student & Library Search</h2>
              </div>
              <div className="card-body p-4">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead style={{ backgroundColor: "#f8f9fa" }}>
                      <tr>
                        <th className="rounded-start" style={{ width: "30%" }}>
                          Field Name
                        </th>
                        <th className="rounded-end" style={{ width: "70%" }}>
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Name dropdown field */}
                      <tr style={{ backgroundColor: "#fff" }}>
                        <td
                          className="align-middle fw-medium"
                          style={{ color: "#212529" }}
                        >
                          Name
                        </td>
                        <td>
                          <select
                            className="form-select form-select-sm custom-select"
                            value={queryValues.Name}
                            onChange={(e) =>
                              handleInputChange("Name", e.target.value)
                            }
                            disabled={loading.names}
                            style={{ color: "#212529" }}
                          >
                            <option value="">Select Student Name</option>
                            {studentNames && studentNames.length > 0 ? (
                              studentNames.map((student, index) => (
                                <option
                                  key={index}
                                  value={
                                    typeof student === "object"
                                      ? student.name || ""
                                      : student
                                  }
                                  style={{ color: "#212529" }}
                                >
                                  {typeof student === "object"
                                    ? student.name || "Unknown"
                                    : student}
                                </option>
                              ))
                            ) : (
                              <option disabled value="">
                                No student names available
                              </option>
                            )}
                          </select>
                          {loading.names && (
                            <div className="mt-1 text-muted small">
                              <span
                                className="spinner-border spinner-border-sm me-1"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Loading names...
                            </div>
                          )}
                          {error.names && (
                            <div className="mt-1 small text-danger">
                              Error loading names: {error.names}
                            </div>
                          )}
                        </td>
                      </tr>

                      {textInputFields.map((field, index) => (
                        <tr
                          key={field}
                          style={{
                            backgroundColor:
                              index % 2 === 0 ? "#f8f9fa" : "#fff",
                          }}
                        >
                          <td
                            className="align-middle fw-medium"
                            style={{ color: "#212529" }}
                          >
                            {field}
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder={`Enter ${field}`}
                              value={queryValues[field]}
                              onChange={(e) =>
                                handleInputChange(field, e.target.value)
                              }
                              style={{ borderColor: "#dee2e6" }}
                            />
                          </td>
                        </tr>
                      ))}

                      {/* Book dropdown field */}
                      <tr
                        style={{
                          backgroundColor:
                            textInputFields.length % 2 === 0
                              ? "#fff"
                              : "#f8f9fa",
                        }}
                      >
                        <td
                          className="align-middle fw-medium"
                          style={{ color: "#212529" }}
                        >
                          Book
                        </td>
                        <td>
                          <select
                            className="form-select form-select-sm custom-select"
                            value={queryValues.book}
                            onChange={(e) =>
                              handleInputChange("book", e.target.value)
                            }
                            disabled={loading.books}
                            style={{ color: "#212529" }}
                          >
                            <option value="">Select Book</option>
                            {authors && authors.length > 0 ? (
                              authors.map((author, index) => (
                                <option
                                  key={index}
                                  value={
                                    typeof author === "object"
                                      ? author.name || ""
                                      : author
                                  }
                                  style={{ color: "#212529" }}
                                >
                                  {typeof author === "object"
                                    ? author.name || "Unknown"
                                    : author}
                                </option>
                              ))
                            ) : (
                              <option disabled value="">
                                No books available
                              </option>
                            )}
                          </select>
                          {loading.books && (
                            <div className="mt-1 text-muted small">
                              <span
                                className="spinner-border spinner-border-sm me-1"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Loading books...
                            </div>
                          )}
                          {error.books && (
                            <div className="mt-1 small text-danger">
                              Error loading books: {error.books}
                            </div>
                          )}
                        </td>
                      </tr>

                      {/* Status field with black checkboxes */}
                      <tr
                        style={{
                          backgroundColor:
                            (textInputFields.length + 2) % 2 === 0
                              ? "#fff"
                              : "#f8f9fa",
                        }}
                      >
                        <td
                          className="align-middle fw-medium"
                          style={{ color: "#212529" }}
                        >
                          Status
                        </td>
                        <td>
                          <div className="d-flex gap-4">
                            <div className="form-check custom-black-checkbox">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="returnedCheckbox"
                                checked={statusFilter.returned}
                                onChange={() => handleStatusChange("returned")}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="returnedCheckbox"
                              >
                                Returned
                              </label>
                            </div>
                            <div className="form-check custom-black-checkbox">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="notReturnedCheckbox"
                                checked={statusFilter.notReturned}
                                onChange={() =>
                                  handleStatusChange("notReturned")
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="notReturnedCheckbox"
                              >
                                Not Returned
                              </label>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div
                className="card-footer text-center p-4 rounded-bottom"
                style={{ backgroundColor: "#f8f9fa" }}
              >
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
