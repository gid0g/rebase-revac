export const updateField = (field, value) => ({
  type: "UPDATE_FIELD",
  payload: { field, value },
});

export const setErrors = (errors) => ({
  type: "SET_ERRORS",
  payload: errors,
});

export const submitForm = () => ({
  type: "SUBMIT_FORM",
});
