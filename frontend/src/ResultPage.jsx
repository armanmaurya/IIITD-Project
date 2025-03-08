import { useLocation, useNavigate } from "react-router-dom";

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryCondition = location.state?.queryCondition || {};

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Results Page</h1>
      <pre>{JSON.stringify(queryCondition, null, 2)}</pre>
      <button className="btn btn-danger mt-3" onClick={() => navigate("/")}>
        Go Back
      </button>
    </div>
  );
};

export default ResultPage;
