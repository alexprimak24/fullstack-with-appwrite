import React, { useId, ForwardedRef } from "react";

interface SelectProps {
  options: str;
  label: string;
  className: string;
}

function Select(
  { options, label, className, ...props }: SelectProps,
  ref: ForwardedRef<HTMLSelectElement>
) {
  const id = useId();
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="inline-block mb-1 pl-1 ">
          {label}
        </label>
      )}
      <select {...props} id={id} ref={ref}>
        {}
      </select>
    </div>
  );
}

export default React.forwardRef(Select);
