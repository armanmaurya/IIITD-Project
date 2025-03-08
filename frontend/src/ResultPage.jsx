import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const results = location.state?.results || [];
  // 96;

  const [searchParams] = useSearchParams();
  const [data, setData] = useState([]);

  // Function to handle exporting to Excel
  const exportToExcel = () => {
    // Creating a table string that Excel can open
    let tableHTML = "<table>";

    // Add header row
    tableHTML += "<tr>";
    tableHTML += "<th>Student Name</th>";
    tableHTML += "<th>ID</th>";
    tableHTML += "<th>Class</th>";
    tableHTML += "<th>Issue Date</th>";
    tableHTML += "<th>Book Name</th>";
    tableHTML += "<th>Author</th>";
    tableHTML += "<th>Status</th>";
    tableHTML += "</tr>";

    // Add data rows
    results.forEach((item) => {
      tableHTML += "<tr>";
      tableHTML += `<td>${item.FirstName || "-"}</td>`;
      tableHTML += `<td>${item.StudentId || "-"}</td>`;
      tableHTML += `<td>${item.Class || "-"}</td>`;
      tableHTML += `<td>${item.IssueDate || "-"}</td>`;
      tableHTML += `<td>${item.BookTitle || "-"}</td>`;
      tableHTML += `<td>${item.Author || "-"}</td>`;
      tableHTML += `<td>${item.Status || "-"}</td>`;
      tableHTML += "</tr>";
    });

    tableHTML += "</table>";

    // Create a Blob with the data and create a download link
    const blob = new Blob([tableHTML], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "search_results.xls";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  /// Function to fetch results using GET request
  const handleFetch = async () => {
    // setLoading(true);
    try {
      const queryString = searchParams.toString();
      const response = await fetch(
        `http://localhost:8000/api/student/?${queryString}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to fetch results.");
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

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
                <h2 className="mb-0">Query Results</h2>
              </div>
              <div className="card-body p-4">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead style={{ backgroundColor: "#f8f9fa" }}>
                      <tr>
                        <th>Student Name</th>
                        <th>ID</th>
                        <th>Class</th>
                        <th>Issue Date</th>
                        <th>Book Name</th>
                        <th>Author</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {JSON.stringify(data)}
                      {/* {results.map((item, index) => (
                          <tr
                            key={index}
                            style={{
                              backgroundColor:
                                index % 2 === 0 ? "#fff" : "#f8f9fa",
                            }}
                          >
                            <td>{item.FirstName || "-"}</td>
                            <td>{item.StudentId || "-"}</td>
                            <td>{item.Class || "-"}</td>
                            <td>{item.IssueDate || "-"}</td>
                            <td>{item.BookTitle || "-"}</td>
                            <td>{item.Author || "-"}</td>
                            <td>{item.Status || "-"}</td>
                          </tr>
                        ))} */}
                    </tbody>
                  </table>
                </div>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
