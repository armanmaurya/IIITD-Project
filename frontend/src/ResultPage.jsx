import { useLocation, useNavigate } from "react-router-dom";

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryCondition = location.state?.queryCondition || {};

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Query Results</h1>
      {results.length === 0 ? (
        <p className="text-center">No results found.</p>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Field Name</th>
              <th>Condition</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(queryCondition).map((field) => (
              <tr key={field}>
                <td>{field}</td>
                <td>{queryCondition[field].condition}</td>
                <td>{queryCondition[field].value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="text-center">
        <button className="btn btn-danger mt-3" onClick={() => navigate("/")}>
          🔙 Go Back
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
