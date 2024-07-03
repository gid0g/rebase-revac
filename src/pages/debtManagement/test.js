const fetchData = (page) => {
    api
      .get(`/billing/debt-filter-report/${organisationId}?PayerId=${payerId}&PayerTypeId=${payerTypeId}&AreaOffice=${areaOfficeId}&Revenue=${revenue}&stateId=${stateId}&LcdaId=${LcdaId}&LgaId=${LgaId}&StartDate=${startDate}&EndDate=${endDate}?pagenumber=${page}&PageSize=${perPage}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("response", response);
        setPending(false);
        setData(response.data);
        var paginationData = response.headers["x-pagination"];
        const parsedPaginationData = JSON.parse(paginationData);
        setTotalRows(parsedPaginationData.TotalCount);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
  };

  // Revenues, Categories, Business Size