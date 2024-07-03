import React, { useState, useEffect } from "react";

const USERS_URL = "https://example.com/api/users";

export default function Table() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData(currentPage);
  }, []);

  const fetchData = async (page) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${USERS_URL}?page=${page}`);
      const json = await response.json();
      setData(json.results);
      setTotalPages(Math.ceil(json.count / 10));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const goToFirstPage = () => {
    if (currentPage !== 0 && !isLoading) {
      fetchData(0);
      setCurrentPage(0);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage !== 0 && !isLoading) {
      fetchData(currentPage - 1);
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage !== totalPages - 1 && !isLoading) {
      fetchData(currentPage + 1);
      setCurrentPage(currentPage + 1);
    }
  };

  const goToLastPage = () => {
    if (currentPage !== totalPages - 1 && !isLoading) {
      fetchData(totalPages - 1);
      setCurrentPage(totalPages - 1);
    }
  };

  return (
    <div>
      {data.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <section className="pagination">
        <button
          className="first-page-btn"
          onClick={goToFirstPage}
          disabled={currentPage === 0 || isLoading}
        >
          first
        </button>
        <button
          className="previous-page-btn"
          onClick={goToPreviousPage}
          disabled={currentPage === 0 || isLoading}
        >
          previous
        </button>
        <button
          className="next-page-btn"
          onClick={goToNextPage}
          disabled={currentPage === totalPages - 1 || isLoading}
        >
          next
        </button>
        <button
          className="last-page-btn"
          onClick={goToLastPage}
          disabled={currentPage === totalPages - 1 || isLoading}
        >
          last
        </button>
      </section>
    </div>
  );
}
