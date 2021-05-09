import "./App.less";
import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import InputContainer from "./input";
import CenterViewContainer from "./center-view-container";
import moment from "moment";
import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAeDDR4XWb1jcArq9bhwbqJeTSwdwF_5l8",
  authDomain: "vaccination-center-finder.firebaseapp.com",
  projectId: "vaccination-center-finder",
  storageBucket: "vaccination-center-finder.appspot.com",
  messagingSenderId: "593770746431",
  appId: "1:593770746431:web:4424e2a84360b1b307de8a",
  measurementId: "G-HYHZS42YJD"
};

if (process.env.NODE_ENV !== "development") {
  firebase.initializeApp(firebaseConfig);
}

function App() {
  const [query, updateQuery] = useState({
    pincode: "",
    date: ""
  });
  const [data, updateData] = useState({});
  const [error, updateError] = useState({});
  const triggeredOnce = useRef();
  const timer = useRef();
  const [isLoading, toggleLoading] = useState(false);
  const notify = useCallback(() => {
    Notification.requestPermission((result) => {
      if (result === "granted") {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification("Vaccination Centers are now avaiable");
        });
      }
    });
  }, []);

  const makeRequest = async function (pincode, date) {
    clearTimeout(timer.current);

    if (!query.pincode || !query.date) {
      toggleLoading(false);
      return false;
    }
    triggeredOnce.current = true;
    const url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${
      query.pincode
    }&date=${moment(query.date).format("DD-MM-YYYY")}`;
    try {
      const response = await axios(url, {
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json"
        }
      });
      timer.current = setTimeout(trigger, 60000);
      return updateData(response.data);
    } catch (err) {
      alert(err);
      clearTimeout(timer.current);
      updateError(err.message);
    } finally {
      toggleLoading(false);
    }
  };

  const sessions = useMemo(() => {
    if (data && data.sessions) {
      if (Array.isArray(data.sessions)) {
        return data.sessions;
      }
    } else {
      return [];
    }
  }, [data]);

  useEffect(() => {
    if (sessions && sessions.length) {
      notify();
    }
  }, [sessions, notify]);

  const trigger = () => {
    clearTimeout(timer.current);
    updateError(null);
    toggleLoading(true);
    makeRequest();
  };

  return (
    <div className="ui container">
      <div className="text-center" style={{ marginTop: 40 }}>
        <h4>Quick Check</h4>
        <h5>Enter pincode and check vaccination centers are available or not</h5>
        <p>(It will keep refreshing the data in every 1 min)</p>
        <InputContainer
          updateQuery={updateQuery}
          query={query}
          isLoading={isLoading}
          search={trigger}
        />
      </div>
      {sessions && sessions.length ? (
        <CenterViewContainer sessions={sessions} isLoading={isLoading} />
      ) : (
        <div>
          {triggeredOnce.current ? (
            <>
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <div>
                  {error
                    ? `Error: ${error}`
                    : "Currenlty no centers avaiable in this pincode. Once centers are available it will notify."}{" "}
                </div>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
