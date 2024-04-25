import React, { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";


const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "black",
};

const Loader = () => {
  const [color, setColor] = useState("#00000");
  const [loading, setLoading] = useState(false);
  
  return (
    <ClipLoader
      color={color}
      loading={loading}
      cssOverride={override}
      size={100}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
};

export default Loader;
