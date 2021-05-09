import React from "react";
import Center from "./center";

function CenterViewContainer(props) {
  const { sessions = [] } = props;
  return (
    <ol>
      {sessions.map((session) => (
        <Center center={session} key={session.center_id} />
      ))}
    </ol>
  );
}

export default CenterViewContainer;
