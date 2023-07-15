import React = require("react");


export interface IDivider extends React.ComponentPropsWithoutRef<'div'> {
  vertical?: boolean;
}

const Divider: React.FC<IDivider> = ({ vertical, ...divProps }) => {
  return (
    <div {...divProps}>
      {vertical ? (
        <div className="h-full w-px bg-gray-300"></div>
      ) : (
        <div className="h-px w-full bg-gray-300"></div>
      )}
    </div>
  );
};

export default Divider;
