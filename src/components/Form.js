import React, { useState } from "react";

import FormCheckboxQuestion from "./FormCheckboxQuestion";
import FormRadioButtonQuestion from "./FormRadioButtonQuestion";
import FormDropDownQuestion from "./FormDropDownQuestion";

const fieldComponents = {
  checkbox: FormCheckboxQuestion,
  radio: FormRadioButtonQuestion,
  dropdown: FormDropDownQuestion
};

const Form = ({ data = [], onSubmit = () => {} }) => {
  const [current, setCurrent] = useState(0);
  const [surveyResult, setSurveyResult] = useState({});

  const onChange = (id, value) => {
    setSurveyResult({
      ...surveyResult,
      [id]: value
    });
    onNext();
  };

  const onNext = () => setCurrent(current + 1);
  const onPrevious = () => setCurrent(current - 1);
  return (
    <div className="dynamic-form">
      {data.map((q, index) =>
        index === current
          ? React.createElement(fieldComponents[q.type], {
              ...q,
              key: q.id,
              value: surveyResult[q.id] || null,
              onChange
            })
          : null
      )}
      <div className="dynamic-form-buttons">
        {current !== 0 && <button onClick={onPrevious}>Previous</button>}
        {current !== data.length - 1 && surveyResult[data[current]?.id] && (
          <button onClick={onNext}>Next</button>
        )}
        {current === data.length - 1 && surveyResult[data[current]?.id] && (
          <button onClick={() => onSubmit(surveyResult)}>Submit</button>
        )}
      </div>
    </div>
  );
};

export default Form;
