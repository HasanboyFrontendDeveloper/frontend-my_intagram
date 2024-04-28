import { useState } from "react";

const useForm = (initialState) => {
  const [value, setValue] = useState(initialState);

  const changeHandler = (e) => {
    if (e?.target?.id) {
      setValue((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    } else {
      setValue(e);
    }
  };
  return [value, changeHandler];
};

export default useForm;
