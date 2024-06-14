import React, { useId, ForwardedRef } from "react";

interface InputProps {
  label?: string;
  type?: string;
  className?: string;
  placeholder?: string;
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
  accept?: string;
}
//sending the value to parent
const Input = function Input(
  {
    label,
    type = "text",
    className = "",
    placeholder,
    onInput,
    accept,
  }: InputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  const id = useId();
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="inline-block mb-1 pl-1 ">
          {label}
        </label>
      )}
      <input
        className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50, duration-200, border broder-gray-200 w-full ${className}`}
        type={type}
        ref={ref}
        placeholder={placeholder}
        onInput={onInput}
        accept={accept}
        id={id}
      />
    </div>
  );
};

export default React.forwardRef(Input);
