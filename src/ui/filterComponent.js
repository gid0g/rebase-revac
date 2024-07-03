import { Disclosure } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

const DateRangePickerComponent = ({ dateRange, handleSelect }) => {
  return (
    <div>
      <DateRange ranges={dateRange} onChange={handleSelect} />
    </div>
  );
};

const FilteringComponent = ({ filterGroups, onFilter }) => {
  //store values selected
  const [filterValues, setFilterValues] = useState({});

  //handle radio button changes
  const handleRadioButtonChange = (event, name) => {
    const { value } = event.target;
    setFilterValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  //capture dateRange value
  const [dateRange, setDateRange] = useState([
    {
      startDate: "",
      endDate: "",
      key: "selection",
    },
  ]);

  //handle DateRange Changes
  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]);
  };

  //Apply Filter Values
  const handleFilterSubmit = (event) => {
    event.preventDefault();
    onFilter(filterValues, dateRange);
  };

  return (
    <form onSubmit={handleFilterSubmit}>
      {filterGroups?.map((section, idx) => (
        <Disclosure
          as="div"
          key={idx}
          className="border-b  border-gray-200 px-4 py-6"
        >
          {({ open }) => (
            <>
              <h6 className=" -mx-2 -my-5 flow-root">
                <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">
                    {section.name}
                  </span>
                  <span className="ml-6 flex items-center">
                    {open ? (
                      <MinusIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <PlusIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </span>
                </Disclosure.Button>
              </h6>
              <Disclosure.Panel className="pt-6">
                <div className="space-y-6 max-h-20 overflow-y-auto">
                  {section.filters.map((option, optionIdx) => (
                    <div key={option.value} className="flex  items-center">
                      <input
                        id={`filter-mobile-${optionIdx}`}
                        name={`${option.name}`}
                        defaultValue={option.label}
                        type="radio"
                        // defaultChecked={option.label}
                        onChange={(e) =>
                          handleRadioButtonChange(e, section.name)
                        }
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label
                        // htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                        className="ml-3 min-w-0 flex-1 text-dark"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}
      <Disclosure as="div" className="border-b border-gray-200 px-4 py-6">
        {({ open }) => (
          <>
            <h6 className="-mx-2 -my-5 flow-root">
              <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                <span className="font-medium text-dark">Select Date Range</span>
                <span className="ml-6 flex items-center">
                  {open ? (
                    <MinusIcon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <PlusIcon className="h-5 w-5" aria-hidden="true" />
                  )}
                </span>
              </Disclosure.Button>
            </h6>
            <Disclosure.Panel className="pt-6">
              <div className="space-y-6">
                <DateRangePickerComponent
                  dateRange={dateRange}
                  handleSelect={handleSelect}
                />
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <div className="flex justify-center">
        <button
          type="submit"
          className="mt-2 mb-2 bg-primary w-full px-2 py-2 text-sm font-medium text-white w-50 rounded-md hover:bg-blue-900"
        >
          Apply Filter
        </button>
      </div>
    </form>
  );
};

export default FilteringComponent;
