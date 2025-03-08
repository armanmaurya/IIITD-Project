import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const ResultPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [expandedStudents, setExpandedStudents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch results using GET request
  const handleFetch = async () => {
    setLoading(true);
    try {
      const queryString = searchParams.toString();
      const response = await fetch(
        `http://localhost:8000/api/student/?${queryString}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      const jsonData = await response.json();
      console.log("API Response:", jsonData);

      // For testing, you can use the sample data directly:
      // const jsonData = [
      //   {...} // your sample data here
      // ];

      setData(jsonData);
      setError(null);
    } catch (error) {
      console.error("API Error:", error);
      setError("Failed to fetch results: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
  }, [searchParams]);

  // Toggle expanded state for a student row
  const toggleStudentExpand = (id) => {
    setExpandedStudents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Function to handle exporting to Excel
  const exportToExcel = () => {
    if (data.length === 0) {
      alert("No data to export");
      return;
    }

    let tableHTML = "<table border='1'>";

    // Add header row for students
    tableHTML += `
      <tr>
        <th>Student Name</th>
        <th>ID</th>
        <th>Grade</th>
        <th>Gender</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Number of Books</th>
      </tr>
    `;

    // Add student data rows
    data.forEach((student) => {
      tableHTML += `
        <tr>
          <td>${student.name || "-"}</td>
          <td>${student.id || "-"}</td>
          <td>${student.grade || "-"}</td>
          <td>${student.gender || "-"}</td>
          <td>${student.email || "-"}</td>
          <td>${student.phone || "-"}</td>
          <td>${student.issued_books ? student.issued_books.length : 0}</td>
        </tr>
      `;

      // Add book details for each student
      if (student.issued_books && student.issued_books.length > 0) {
        tableHTML += `
          <tr>
            <td colspan="7">
              <table border='1' width='100%'>
                <tr style="background-color: #f0f0f0;">
                  <th>Book ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Genre</th>
                  <th>Available Copies</th>
                </tr>
        `;

        student.issued_books.forEach((book) => {
          tableHTML += `
            <tr>
              <td>${book.id || "-"}</td>
              <td>${book.title || "-"}</td>
              <td>${book.author || "-"}</td>
              <td>${book.genre || "-"}</td>
              <td>${
                book.available_copies !== undefined
                  ? book.available_copies
                  : "-"
              }</td>
            </tr>
          `;
        });

        tableHTML += `
              </table>
            </td>
          </tr>
        `;
      }
    });

    tableHTML += "</table>";

    // Create a Blob with the data and create a download link
    const blob = new Blob([tableHTML], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_library_records.xls";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="container py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-lg border-0 rounded-lg">
              <div
                className="card-header text-white text-center py-4 rounded-top"
                style={{ backgroundColor: "#212529" }}
              >
                <h2 className="mb-0">Student Library Records</h2>
              </div>
              <div className="card-body p-4">
                {loading ? (
                  <div className="text-center p-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading data...</p>
                  </div>
                ) : error ? (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead style={{ backgroundColor: "#f8f9fa" }}>
                        <tr>
                          <th></th>
                          <th>Student Name</th>
                          <th>ID</th>
                          <th>Grade</th>
                          <th>Gender</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Books</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.length > 0 ? (
                          data.map((student, index) => (
                            <>
                              <tr
                                key={student.id}
                                style={{
                                  backgroundColor:
                                    index % 2 === 0 ? "#fff" : "#f8f9fa",
                                  cursor: "pointer",
                                }}
                                onClick={() => toggleStudentExpand(student.id)}
                              >
                                <td>
                                  <i
                                    className={`bi ${
                                      expandedStudents[student.id]
                                        ? "bi-chevron-down"
                                        : "bi-chevron-right"
                                    }`}
                                  ></i>
                                </td>
                                <td>{student.name || "-"}</td>
                                <td>{student.id || "-"}</td>
                                <td>{student.grade || "-"}</td>
                                <td>{student.gender || "-"}</td>
                                <td>{student.email || "-"}</td>
                                <td>{student.phone || "-"}</td>
                                <td>
                                  <span
                                    className="badge rounded-pill"
                                    style={{
                                      backgroundColor: "black",
                                      color: "white",
                                    }}
                                  >
                                    {student.issued_books
                                      ? student.issued_books.length
                                      : 0}
                                  </span>
                                </td>
                              </tr>
                              {expandedStudents[student.id] &&
                                student.issued_books &&
                                student.issued_books.length > 0 && (
                                  <tr>
                                    <td colSpan="8" className="p-0">
                                      <div className="bg-light p-3">
                                        <h6 className="mb-2">Issued Books:</h6>
                                        <table className="table table-sm table-bordered mb-0">
                                          <thead className="table-secondary">
                                            <tr>
                                              <th>Book ID</th>
                                              <th>Title</th>
                                              <th>Author</th>
                                              <th>Genre</th>
                                              <th>Available Copies</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {student.issued_books.map(
                                              (book) => (
                                                <tr key={book.id}>
                                                  <td>{book.id}</td>
                                                  <td>{book.title}</td>
                                                  <td>{book.author}</td>
                                                  <td>{book.genre}</td>
                                                  <td>
                                                    {book.available_copies}
                                                  </td>
                                                </tr>
                                              )
                                            )}
                                          </tbody>
                                        </table>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                            </>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="8" className="text-center">
                              No students found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div
                className="card-footer d-flex justify-content-between p-4 rounded-bottom"
                style={{ backgroundColor: "#f8f9fa" }}
              >
                <button
                  className="btn text-white px-4 shadow-sm"
                  onClick={() => navigate("/")}
                  style={{ backgroundColor: "#212529", borderRadius: "4px" }}
                >
                  <i className="bi bi-arrow-left me-2"></i>Go Back
                </button>
                <div>
                  {/* <button
                    className="btn btn-link"
                    onClick={handleFetch}
                    disabled={loading}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i> Refresh
                  </button> */}
                  <button
                    className="btn btn-dark px-4 shadow-sm"
                    onClick={exportToExcel}
                    disabled={loading || data.length === 0}
                  >
                    <i className="bi bi-file-earmark-excel me-1"></i> Export to
                    Excel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
