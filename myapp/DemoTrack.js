import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  StatusBar,
} from "react-native";
import { getDatabase, ref, set, onValue } from "firebase/database";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import "./firebase";
import { TouchableOpacity } from "react-native-gesture-handler";
const LOCATION_TASK_NAME = "LOCATION_TASK_NAME";
let foregroundSubscription = null;

// Define the background task for location tracking
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    // Extract location coordinates from data
    const { locations } = data;
    const location = locations[0];
    if (location) {
      console.log("Location in background", location.coords);
    }
  }
});
export default function DemoTrack() {
  const [msg, setmsg] = useState("Intrusion Detected");
  const [doorVal, setdoorVal] = useState(true);
  const [human, sethuman] = useState(false);
  const [position, setPosition] = useState(null);
  const [ESPLat, setLat] = useState("");
  const [ESPLong, setLong] = useState("");
  const [d, setD] = useState(0);
  const [lat, setlat] = useState(0);
  const [long, setlong] = useState(0);

  const readESP = () => {
    const db = getDatabase();
    const DataRef = ref(db, "ESPData/");
    onValue(DataRef, (snapshot) => {
      const data = snapshot.val();
      setLat(data.lat.toFixed(5));
      setLong(data.long.toFixed(5));
      setdoorVal(data.door);
      sethuman(data.pir);
    });
  };

  const Dist = () => {
    let lon1 = (long * Math.PI) / 180;
    let lon2 = (ESPLong * Math.PI) / 180;
    let lat1 = (lat * Math.PI) / 180;
    let lat2 = (ESPLat * Math.PI) / 180;

    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a =
      Math.pow(Math.sin(dlat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956
    // for miles
    let r = 6371;

    // calculate the result
    setD(r * c * 1000); // Distance in km
  };

  // Request permissions right after starting the app

  useEffect(() => {
    const requestPermissions = async () => {
      const foreground = await Location.requestForegroundPermissionsAsync();
      if (foreground.granted)
        await Location.requestBackgroundPermissionsAsync();
    };
    requestPermissions();
    startForegroundUpdate();
    startBackgroundUpdate();
  }, []);

  useEffect(() => {
    readESP();
    Dist();
    // const interval = setInterval(() => {
    //   readESP();
    // }, 2000);
    // return () => clearInterval(interval);
  }, [ESPLat, ESPLong, doorVal, human, lat, long]);

  // Start location tracking in foreground
  const startForegroundUpdate = async () => {
    // Check if foreground permission is granted
    const { granted } = await Location.getForegroundPermissionsAsync();
    if (!granted) {
      console.log("location tracking denied");
      return;
    }

    // Make sure that foreground location tracking is not running
    foregroundSubscription?.remove();

    // Start watching position in real-time
    foregroundSubscription = await Location.watchPositionAsync(
      {
        // For better logs, we set the accuracy to the most sensitive option
        accuracy: Location.Accuracy.BestForNavigation,
      },
      (location) => {
        // setPosition(location.coords);

        setlat(location.coords.latitude.toFixed(5));
        setlong(location.coords.longitude.toFixed(5));
      }
    );
  };

  // Stop location tracking in foreground
  const stopForegroundUpdate = () => {
    foregroundSubscription?.remove();
    setPosition(null);
  };

  // Start location tracking in background
  const startBackgroundUpdate = async () => {
    // Don't track position if permission is not granted
    const { granted } = await Location.getBackgroundPermissionsAsync();
    if (!granted) {
      console.log("location tracking denied");
      return;
    }

    // Make sure the task is defined otherwise do not start tracking
    const isTaskDefined = await TaskManager.isTaskDefined(LOCATION_TASK_NAME);
    if (!isTaskDefined) {
      console.log("Task is not defined");
      return;
    }

    // Don't track if it is already running in background
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME
    );
    if (hasStarted) {
      console.log("Already started");
      return;
    }

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      // For better logs, we set the accuracy to the most sensitive option
      accuracy: Location.Accuracy.BestForNavigation,
      // Make sure to enable this notification if you want to consistently track in the background
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "Location",
        notificationBody: "Location tracking in background",
        notificationColor: "#fff",
      },
    });
  };

  // Stop location tracking in background
  const stopBackgroundUpdate = async () => {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME
    );
    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      console.log("Location tacking stopped");
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          alignSelf: "center",
          flex: 1,
          marginTop: "2%",
          position: "relative",
        }}
      >
        <View style={styles.upperbox}>
          {/* <LinearGradient
            colors={["rgb(121, 80, 242)", "rgb(22,10,57)"]}
            
            style={styles.upperbox}
          /> */}
        </View>
        <View style={styles.outcircle}></View>

        <View
          style={[
            styles.incircle,
            {
              backgroundColor:
                d < 25
                  ? "#2cb452"
                  : doorVal
                  ? "#2cb452"
                  : human
                  ? "#E2453B"
                  : "#E2453B",
            },
          ]}
        >
          <Image
            source={require("./assets/home.png")}
            style={{
              alignSelf: "center",
              width: 60,
              height: 60,
              marginTop: "25%",
            }}
          />
        </View>

        <Text style={styles.msg}>
          {d < 25
            ? "All Safe"
            : doorVal
            ? "All Safe, Outside Home"
            : human
            ? "Intrusion Detected"
            : "Your Door is open"}
        </Text>
        {/* <Text>{lat}</Text>
        <Text>{long}</Text>
        <Text>{d}</Text> */}
        {/* <Text>{ESPLat}</Text>
        <Text>{ESPLong}</Text>  */}
        <View
          style={[
            styles.signal1,
            {
              backgroundColor:
                d < 25 ? "#8a898a" : doorVal ? "#8a898a" : "#E2453B",
            },
          ]}
        >
          <Image
            source={require("./assets/door.png")}
            style={{
              alignSelf: "center",
              width: 50,
              height: 50,
              marginTop: "18%",
            }}
          />
        </View>
        <View
          style={[
            styles.signal2,
            {
              backgroundColor:
                d < 25 ? "#8a898a" : !human ? "#8a898a" : "#E2453B",
            },
          ]}
        >
          <Image
            source={require("./assets/body.png")}
            style={{
              alignSelf: "center",
              width: 50,
              height: 50,
              marginTop: "18%",
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  upperbox: {
    backgroundColor: "#9070EE",
    width: 331,
    height: 275,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  outcircle: {
    borderRadius: 100,
    backgroundColor: "white",
    width: 160,
    height: 160,
    position: "absolute",
    alignSelf: "center",
    top: "25%",
  },
  incircle: {
    borderRadius: 100,
    backgroundColor: "#E2453B",
    width: 120,
    height: 120,
    position: "absolute",
    alignSelf: "center",
    top: "28%",
  },
  msg: {
    fontFamily: "sans-serif",
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center",
    marginTop: "20%",
  },
  signal1: {
    width: 70,
    height: 70,

    borderRadius: 10,
    alignSelf: "center",
    marginTop: "15%",
  },
  signal2: {
    width: 70,
    height: 70,

    borderRadius: 10,
    alignSelf: "center",
    marginTop: "18%",
  },
});
//#E2453B
