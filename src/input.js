import React from "react";
import { Button } from "semantic-ui-react";

const InputContainer = (props) => {
  const { query, updateQuery, isLoading, search } = props;

  const setData = ({ target }) => {
    updateQuery((prev) => ({
      ...prev,
      [target.name]: target.value
    }));
  };

  return (
    <div className="ui form">
      <div className="two fields">
        <div className="field">
          <label className="text-left">Enter pincode</label>
          <input
            name="pincode"
            value={query.pincode}
            placeholder="Enter pincode"
            onChange={setData}
            disabled={isLoading}
          />
        </div>
        <div className="field">
          <label className="text-left">Select Date</label>
          <input
            name="date"
            type="date"
            value={query.date}
            onChange={setData}
            disabled={isLoading}
            placeholder={"Select Date"}
          />
        </div>
      </div>
      <div className="field">
        <Button type="submit" disabled={isLoading} onClick={search}>
          Search
        </Button>
      </div>
    </div>
  );
};

export default InputContainer;
