import React from "react";
import TextField from "../../ui/textfield";
import { FiSearch, FiX } from "react-icons/fi";
import { InputContainer, IconWrapper } from "../../ui/textfield";

const FilterComponent = ({ filterText, onFilter, onClear, placeholder }) => {
  const handleClear = () => {
    onClear();
  };

  return (
    <InputContainer>
      <TextField
        id="search"
        type="text"
        placeholder={placeholder}
        aria-label="Search Input"
        value={filterText}
        onChange={onFilter}
      />
      <IconWrapper onClick={handleClear}>
        {filterText ? <FiX /> : <FiSearch />}
      </IconWrapper>
    </InputContainer>
  );
};

export default FilterComponent;
