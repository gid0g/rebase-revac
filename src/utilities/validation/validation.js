const isEmailValid = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };
  
  const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^A-Za-z0-9]).{8,}$/;
    return passwordRegex.test(password);
  };
  
  export const validateForm = (formData, validationRules) => {
    const errors = {};
  
    for (const fieldName in validationRules) {
      if (validationRules.hasOwnProperty(fieldName)) {
        const rules = validationRules[fieldName];
        const value = formData[fieldName];
  
        for (const rule of rules) {
          if (rule.required) {
            if (!value || value.trim() === "") {
              errors[fieldName] = rule.message || `${fieldName} is required`;
              break;
            }
          }
  
          if (rule.validate && !rule.validate(value)) {
            errors[fieldName] = rule.message || `Invalid ${fieldName}`;
            break;
          }
  
          if (rule.email && !isEmailValid(value)) {
            errors[fieldName] = rule.message || `Invalid email address`;
            break;
          }
  
          if (rule.password && !isPasswordValid(value)) {
            errors[fieldName] = rule.message || `Password must be 8+ characters with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.`;
            break;
          }
  
          if (rule.minLength && value.length < rule.minLength) {
            errors[fieldName] = rule.message || `${fieldName} must be at least ${rule.minLength} characters`;
            break;
          }
        }
      }
    }
  
    return errors;
  };
  