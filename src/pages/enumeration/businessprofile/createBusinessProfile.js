import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../axios/custom";
import { AppSettings } from "../../../config/app-settings";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { Spinner } from "react-activity";
import "react-activity/dist/library.css";
import { Context } from "../enumerationContext";

const AddBusinessProfile = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("myToken");
  const [count, setCount] = useState(1);
  const appSettings = useContext(AppSettings);
  const { fields, setFields, setEnumerateFields, convertedField } =
    useContext(Context);
  const userData = appSettings.userData;
  const [businessType, setBusinessType] = useState([]);
  const [businessSize, setBusinessSize] = useState([]);
  const [typeSelected, setTypeSelected] = useState({});
  const [sizeSelected, setSizeSelected] = useState({});
  const [allSelected, setallSelected] = useState(false);
  const [revenueType, setRevenueType] = useState({
    0: {
      types: [],
    },
  });

  const organisationId = sessionStorage.getItem("organisationId");
  const [isValid, setIsValid] = useState(false);
  const [checkedRevenues, setCheckedRevenues] = useState([]);
  const [isRevenueTypeVisible, setIsRevenueTypeVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckedRevenueChange = (revenueId) => {
    if (revenueId) {
      setCheckedRevenues((prevCheckedRevenues) => {
        if (prevCheckedRevenues.includes(revenueId)) {
          const filteredCheckedCategories = prevCheckedRevenues.filter(
            (id) => id !== revenueId
          );
          return filteredCheckedCategories;
        } else {
          return [...prevCheckedRevenues, revenueId];
        }
      });
    }

    console.log("Checked Revenues:", checkedRevenues);
  };
  useEffect(() => {
    const allTypeSelected = Object.values(typeSelected).every((value) => value);
    const allSizeSelected = Object.values(sizeSelected).every((value) => value);
    console.log(
      "Check this out----------->",
      allTypeSelected,
      allSizeSelected,
      isValid,
      fields.every((field) => field.businessTypeId && field.businessSizeId)
    );
    setallSelected(
      allTypeSelected &&
        allSizeSelected &&
        isValid &&
        fields.every((field) => field.businessTypeId && field.businessSizeId)
    );
  }, [typeSelected, sizeSelected, isValid]);
  useEffect(() => {
    console.log("allSelected ", allSelected);
  }, [allSelected]);

  async function handleTypeChange(index, event) {
    const { name, value } = event.target;
    const selectedIndex = event.target.selectedIndex;
    const selectedOption = {
      id: value,
      name: event.target[selectedIndex].text,
    };

    setFields((prevFields) => {
      const updatedFields = [...prevFields];
      updatedFields[index] = {
        ...updatedFields[index],
        businessTypeId: parseInt(selectedOption.id),
        createdBy: userData[0]?.email,
        billRevenues: [],
      };
      return updatedFields;
    });

    setTypeSelected((prevTypeSelected) => ({
      ...prevTypeSelected,
      [index]: event.target.value !== "",
    }));

    setIsRevenueTypeVisible(true);

    const types = await api
      .get(`revenue/${organisationId}/business-type/${selectedOption.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    setRevenueType((prevRevenueType) => ({
      ...prevRevenueType,
      [index]: {
        types: types,
      },
    }));
  }
  function handleSizeChange(index, event) {
    const { name, value } = event.target;
    const selectedIndex = event.target.selectedIndex;
    const selectedOption = {
      id: value,
      name: event.target[selectedIndex].text,
    };
    setSizeSelected((prevSizeSelected) => ({
      ...prevSizeSelected,
      [index]: event.target.value !== "",
    }));

    const updatedFields = [...fields];

    updatedFields[index] = {
      ...updatedFields[index],
      businessSizeId: parseInt(selectedOption.id),
    };
    setFields(updatedFields);

    updatedFields[index].createdBy = userData[0]?.email;
    console.log("Updated Type Fields:", updatedFields);
  }

  const removeDuplicates = (arr) => {
    const uniqueMap = new Map();

    arr.forEach((item) => {
      uniqueMap.set(item.id, item);
    });

    return Array.from(uniqueMap.values());
  };

  function handleCheckboxChange(index, event) {
    const { value, checked } = event.target;
    const selectedOptions = fields[index].billRevenues || [];

    if (checked) {
      selectedOptions.push({
        id: value,
        name: event.target.nextSibling.textContent,
      });
      console.log("Selected Option:", selectedOptions);
    } else {
      const selectedIndex = selectedOptions.findIndex(
        (option) => option.id === value
      );
      if (selectedIndex !== -1) {
        selectedOptions.splice(selectedIndex, 1);
      }
    }

    const updatedFields = [...fields];
    updatedFields[index] = {
      ...updatedFields[index],
      billRevenues: removeDuplicates(selectedOptions),
      createdBy: userData[0]?.email,
    };

    console.log("Updated Fields:", updatedFields);
    setFields(updatedFields);
    return updatedFields[index].billRevenues;
  }

  function handleAdd() {
    const values = [...fields];
    setRevenueType({
      ...revenueType,
      [values.length]: {
        types: [],
      },
    });
    values.push({
      dateCreated: new Date().toISOString(),
      createdBy: userData[0]?.email,
    });
    setFields(values);
    setCount(count + 1);
    setTypeSelected({});
    setSizeSelected({});
  }

  function handleDelete(idx) {
    const values = [...fields];
    values.splice(idx, 1);
    setFields(values);
    setCount(count - 1);
  }

  useEffect(() => {
    api
      .get(`enumeration/${organisationId}/business-sizes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setBusinessSize(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    api
      .get(`enumeration/${organisationId}/business-types`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setBusinessType(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [1]);

  const redirectToBilling = (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setEnumerateFields(convertedField);
      toast.info("Redirecting...", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setTimeout(() => {
        navigate("/home/enumeration/billing");
      }, 1000);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  ////////////////////////////////////////
 const businesssizeopt= businessSize
    ? businessSize.map((busSize) => ({
        label: busSize.businessSizeName,
        value: busSize.id,
      }))
    : [];
    const businesstyeopt = businessType
    ? businessType.map((busType) => ({
        value: busType.id,
        label: busType.businessTypeName,
      }))
    : [];
  ///////////////////////////////////////

  return (
    <>
      <div className=" ">
        <h3 className=" mb-0">Add Business Profile</h3>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/home/Dashboard">Home</Link>
          </li>
          <li className="breadcrumb-item">Enumeration</li>
          <li className="breadcrumb-item active"> Business Profile </li>
        </ol>
      </div>

      <ToastContainer />
      <div className="mt-5">
        <form onSubmit={redirectToBilling}>
          {fields.map((field, idx) => {
            return (
              <div key={idx} className="border p-2 mb-4">
                <fieldset>
                  <div className=" gx-5">
                    <div className="row">
          <div className="col-3">
            <label className="form-label" style={{ marginTop: "7px" }}>
              <p>Select Revenue Item</p>
            </label>
          </div>
             <div className="col-6">
                          <div className="mb-3">
                            <Select
                              className="basic-single"
                              classNamePrefix="select"
                              defaultValue="Select Revenue Item"
                              isSearchable={true}
                              name="businessTypeId"
                              options={businesstyeopt}
                          onChange={(event) => handleTypeChange(idx, event)}
                            />
                            </div>
                          </div>
                          </div>
                          <div className="row">
          <div className="col-3">
            <label className="form-label" style={{ marginTop: "7px" }}>
              <p>Select Business Size</p>
            </label>
          </div>
                   <div className="col-6">
                          <div className="mb-3">
                            <Select
                              className="basic-single"
                              classNamePrefix="select"
                              defaultValue="Select Business Size"
                              isSearchable={true}
                              name="businessSizeId"
                              options={businesssizeopt}
                                        onChange={(event) => handleSizeChange(idx, event)}
                            />
                            </div>
                          </div>
                          </div>
                  </div>
                  {isRevenueTypeVisible && (
                    <div className="mb-3">
                      <label
                        title="Multiple Revenue type/code can be selected"
                        className="form-label"
                        htmlFor="exampleInputEmail1"
                      >
                        Revenue Type/Code{" "}
                        <pre className="text-xs">
                          (Multiple Revenue type/code can be selected)
                        </pre>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {revenueType[idx]?.types?.map((revenue) => {
                          return (
                            <div
                              key={revenue.revenueId}
                              className="form-check form-check-inline"
                            >
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name={`revenueId${idx}`}
                                value={revenue.revenueId}
                                onChange={(event) => {
                                  const formFields = handleCheckboxChange(
                                    idx,
                                    event
                                  );
                                  if (formFields?.length > 0) {
                                    setIsValid(true);
                                  } else {
                                    setIsValid(false);
                                  }
                                  handleCheckedRevenueChange(revenue.revenueId);
                                }}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`revenueId${idx}`}
                              >
                                {revenue.revenueName}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </fieldset>
                {!idx == 0 && (
                  <div className=" mb-4">
                    <div className="">
                      <button
                        type="button"
                        onClick={() => handleDelete(idx)}
                        className="btn btn-danger"
                      >
                        Delete Field
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <div className="d-flex mb-4">
            <div className="mr-2">
              <button
                type="button"
                disabled={!allSelected}
                onClick={() => handleAdd()}
                className="btn btn-default"
              >
                Add More
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center gap-2 w-full">
            <button
              className="btn shadow-md bg-blue-900 text-white"
              type="button"
              onClick={() => window.history.back()}
            >
              Back
            </button>

            <button
              type="submit"
              className={`btn ${
                !allSelected ? "!bg-sky-300" : "!bg-blue-900"
              } text-white me-5px`}
              disabled={!allSelected}
            >
              {!allSelected ? (
                "Disabled, Please Fill Necessary Details"
              ) : isLoading ? (
                <Spinner />
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddBusinessProfile;
