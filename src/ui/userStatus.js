import React from "react";
import classNames from "classnames";

const UserStatus = ({ isActive }) => {

  const pending = isActive && isActive == 1;
  const approved = isActive && isActive == 2;

  // Apply appropriate classes based on user status
  const statusClasses = classNames(
    "inline-block",
    "px-2",
    "py-1",
    "border",
    "rounded-lg",
    {
      "text-green-900": approved,
      "text-red-600": pending,
    },
    {
      "border-green-900": approved,
      "border-red-600": pending,
    }
  );

  return (
    <div>
      <p className={statusClasses}>
        {pending && <><b>&#183;</b>Pending</>}
        {approved && <><b>&#183;</b>Approved</>}
      </p>
    </div>
  );
};

export default UserStatus;
