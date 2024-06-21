import Select from "react-select";

const styles = {
  control: (styles) => ({
    backgroundColor: "var(--app-component-bg)",
    color: "var(--app-component-color)",
    border: "1px solid var(--app-component-border-color)",
    borderRadius: "4px",
    display: "flex",
  }),
  indicatorSeparator: (styles) => ({
    backgroundColor: "transparent",
  }),
  input: (styles) => ({
    color: "var(--app-component-color)",
    fontWeight: "600",
    gridArea: "1/1/2/3",
    flex: "1 1 auto",
    display: "inline-grid",
    margin: "2px",
    gridTemplateColumns: "0 min-content",
    boxSizing: "content-box",
    paddingTop: "2px",
    paddingBottom: "2px",
    visibility: "visible",
  }),
  singleValue: (styles) => ({
    color: "var(--app-component-color)",
    gridArea: "1/1/2/3",
    marginLeft: "2px",
    marginRight: "2px",
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    boxSizing: "border-box",
  }),
  placeholder: (styles) => ({
    color: "rgba(var(--app-component-color-rgb), .5)",
    fontWeight: "600",
    gridArea: "1/1/2/3",
  }),
  menu: (styles) => ({
    backgroundColor: "var(--app-component-dropdown-bg)",
    position: "absolute",
    top: "100%",
    borderRadius: "4px",
    margin: "8px 0",
    zIndex: "1",
    boxSizing: "border-box",
    width: "100%",
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      backgroundColor: isFocused
        ? "var(--app-component-dropdown-hover-bg)"
        : "",
      color: "var(--app-component-color)",
      cursor: isDisabled ? "not-allowed" : "default",
      padding: "8px 12px",
    };
  },
};

const SelectField = <Select styles={styles} />;

export default SelectField;
