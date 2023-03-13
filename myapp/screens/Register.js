import React, { useState } from "react";
import {
  SafeAreaView,
  Button,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getDatabase, ref, set, onValue } from "firebase/database";
const styles = StyleSheet.create({
  Logo: {
    height: 100,
    width: 100,
    alignSelf: "center",
  },
  mtxt: {
    alignSelf: "center",
    fontFamily: "Inter-ExtraBold",
    fontSize: 30,
    color: "black",
    marginTop: "3%",
  },
  btn: {
    backgroundColor: "#7950F2",
    height: 40,
    width: 160,
    paddingVertical: 7,
    borderRadius: 7,
    alignSelf: "center",
  },
  btxt: {
    color: "white",
    fontFamily: "Inter-Bold",
    alignSelf: "center",
    textAlignVertical: "center",
    fontSize: 17,
  },
  inp: {
    borderColor: "rgba(217,217,217,0.5)",
    borderWidth: 1,
    padding: 10,
    width: 300,
    alignSelf: "center",
    marginBottom: "10%",

    backgroundColor: "rgba(217,217,217,0.5)",
    borderRadius: 7,
  },
  mainbx: {
    marginTop: "28%",
  },
});

function Register() {
  const navigation = useNavigation();
  const [name, setname] = useState("");
  const [phone, setphone] = useState(0);
  const [altphone, setalt] = useState(0);
  const writeFirebase = () => {
    const db = getDatabase();
    set(ref(db, "Users/"), {
      name: name,
      phone: phone,
      altph: altphone,
    });
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView>
          <View style={styles.mainbx}>
            <Image style={styles.Logo} source={require("./mylogo.png")} />
            <Text style={styles.mtxt}>SecureIt</Text>
            <View style={{ marginTop: "8%" }}>
              <TextInput
                style={styles.inp}
                placeholder="Name"
                onChangeText={setname}
              />
              <TextInput
                style={styles.inp}
                placeholder="Phone Number"
                onChangeText={setphone}
              />
              <TextInput
                style={styles.inp}
                placeholder="Alternative Phone Number"
                onChangeText={setalt}
              />
            </View>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                writeFirebase();
                navigation.navigate("Track");
              }}
            >
              <Text style={styles.btxt}>Register</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default Register;
