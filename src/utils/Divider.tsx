import React from "react";

export interface IDivider extends React.ComponentPropsWithoutRef<"div"> {
  vertical?: boolean;
}

const Divider: React.FC<IDivider> = ({ vertical, ...divProps }) => {
  return (
    <div {...divProps}>
      {vertical ? (
        <div
          style={{
            height: "100%",
            width: "1px",
            backgroundColor: "gray",
          }}
        ></div>
      ) : (
        <div
          style={{
            height: "1px",
            width: "100%",
            backgroundColor: "gray",
          }}
        ></div>
      )}
    </div>
  );
};

export default Divider;
