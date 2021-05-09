import React from "react";

function Center(props) {
  const { center } = props;
  return (
    <li>
      <h3 className="margin-vertical-ten">Center Name: {center.name}</h3>
      <h4 className="margin-vertical-ten">Date: {center.date}</h4>
      <h4 className="margin-vertical-ten">Starting From: {center.from}</h4>
      <ol className="margin-vertical-ten">
        {center.slots && center.slots.map((slot) => <li key={slot}>{slot}</li>)}
      </ol>
    </li>
  );
}

export default Center;
