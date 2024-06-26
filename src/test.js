import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Alert,
  LogBox,
} from "react-native";
import { theme } from "../../../core/theme";
import { useDispatch, useSelector } from "react-redux";
import api from "../../../api";
import { Divider, Searchbar } from "react-native-paper";
import Toast from "react-native-root-toast";
import { FlatGrid } from "react-native-super-grid";
import { AlertMessage } from "../../../components/AlertMessage";
import { userConstant } from "../../../redux/constants";
import { Icon, FAB, ButtonGroup, Button, Input } from "react-native-elements";
import TextInput from "../../../components/TextInput1";
import DropDownPicker from "react-native-dropdown-picker";
import Spinner from "react-native-loading-spinner-overlay";
import DatePicker, { getFormatedDate } from "react-native-modern-datepicker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RadioGroup from "react-native-radio-buttons-group";
import SelectList from "react-native-dropdown-select-list";

//A simple SHA-512, SHA-384, SHA-512/224, SHA-512/256 hash functions for JavaScript supports UTF-8 encoding.
var sha512 = require("js-sha512");
let STATE = "XXSG";
let CLIENT_ID = "865394717067076";
let KEY = "PH5UVZG993ND6BMADS65";


const IndividualScreen = ({ navigation }) => {
  const state = useSelector((state) => state);
  let user = state.authReducer.user;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [payerID, setPayerID] = useState({ value: "", error: "" });
  const [gender, genderData] = useState([]);
  const [title, titleData] = useState([]);
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedMaritalStatus, setSelectedMaritalStatus] = useState("");
  const maritalStatus = [
    { key: "M", value: "Married" },
    { key: "S", value: "Single" },
  ];

  const [firstName, setFirstName] = useState({ value: "", error: "" });
  const [middleName, setMiddleName] = useState({ value: "", error: "" });
  const [lastName, setLastName] = useState({ value: "", error: "" });
  const [phoneNumber, setPhoneNumber] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [nin, setNIN] = useState({ value: "", error: "" });
  const [bvn, setBVN] = useState({ value: "", error: "" });
  const [address, setAddress] = useState({ value: "", error: "" });
  const [DOB, setDOB] = useState("");
  const [individualPID, setIndividualPID] = useState("");
  const [userPID, setUserPID] = useState("");
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [idenification, setIdentification] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [dateOfBirth1, setDateOfBirth1] = useState("");

  const radioButtonsData = [
    {
      id: "1", // acts as primary key, should be unique and non-empty string
      label: "BVN",
      value: "bvn",
    },
    {
      id: "2",
      label: "NIN",
      value: "nin",
    },
    {
      id: "3",
      label: "NONE",
      value: "none",
    },
  ];

  const [radioButtons, setRadioButtons] = useState(radioButtonsData);
  function onPressRadioButton(radioButtonsArray) {
    setIdentification(
      radioButtonsArray.filter((item) => item.selected === true)[0].value
    );
    setRadioButtons(radioButtonsArray);
  }

  //fetch list of genders
  const getGender = async () => {
    await api
      .get("/enumeration/getlistofgenders")
      .then((response) => {
        if (response.status === 200) {
          // Store Values in Temporary Array
          let newArray = response.data.genders.map((item) => {
            return { key: item.genderCode, value: item.genderName };
          });
          genderData(newArray);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //fetch list of titles
  const getTitle = async () => {
    await api
      .get("/enumeration/getlistoftitles")
      .then((response) => {
        if (response.status === 200) {
          // Store Values in Temporary Array
          let newArray = response.data.titles.map((item) => {
            return { key: item.titleCode, value: item.titleName };
          });
          titleData(newArray);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //Pid Verification Request
  function validatePID() {
    const url = "http://xxsg.ebs-rcm.com/Interface/VerifyPid";
    const myHash = `${KEY}N-${payerID.value}${STATE}`;
    const SHA512HASH = sha512(myHash);
    const finalHash = SHA512HASH.toUpperCase(); //convert to upper case

    let data = {
      pid: `N-${payerID.value}`,
      state: STATE,
      clientid: CLIENT_ID,
      hash: finalHash,
    };

    let fetchData = {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
      }),
    };

    setLoading(true);
    fetch(url, fetchData)
      .then((response) => response.json())
      .then((data) => getPIDData(data));
    setLoading(false);
  }

  //retrieve data from API call and assign values
  function getPIDData(data) {
    if (data.ResponseCode === "SUCCESS") {
      Alert.alert(
        //title
        `Payer ID Validation Succesfull`,
        //body
        data.Fullname,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Continue to Property Enumeration",
            onPress: () =>
              navigation.push("PropertyScreen", {
                thisPID: payerID.value,
                thisName: data.Fullname,
              }),
          },
        ]
      );
    } else if (data.ResponseCode === "FAILED") {
      AlertMessage("Error", "PID not found.");
    } else {
      AlertMessage("Info", "PID not found.");
    }
  }

  useEffect(() => {
    console.log(selectedDate);
    //console.log(formatted)
    const [day, month, year] = selectedDate.split("/");
    const result = [year, month, day].join("-");
    setDateOfBirth(result);
    getTitle();
    getGender();
  }, []);

  //validates if all input fields have values
  const validateInput = ({
    firstName,
    lastName,
    phoneNumber,
    email,
    address,
    selectedTitle,
    selectedGender,
    selectedMaritalStatus,
    idenification,
    userPID,
  }) => {
    if (
      !firstName.value.trim() ||
      !lastName.value.trim() ||
      !phoneNumber.value.trim() ||
      !email.value.trim() ||
      !address.value.trim() ||
      selectedTitle == "" ||
      selectedGender == "" ||
      selectedMaritalStatus == "" ||
      idenification == "" ||
      userPID == ""
    ) {
      AlertMessage("Error", "Please fill out all the input fields");
      return false;
    } else {
      return true;
    }
  };

  //validates if pid is supplied
  const validatePIDInput = ({ payerID }) => {
    if (!payerID.value.trim()) {
      AlertMessage("Error", "Please fill out all the input fields");
      return false;
    } else {
      return true;
    }
  };

  const validateIdentification = ({ idenification }) => {
    if (idenification == "bvn" && !bvn.value.trim()) {
      AlertMessage("Error", "Enter your BVN");
      return false;
    } else if (idenification == "nin" && !nin.value.trim()) {
      AlertMessage("Error", "Enter your NIN");
      return false;
    } else {
      return true;
    }
  };

  const validatePhoneNumber = ({ phoneNumber }) => {
    if (phoneNumber.value.length < 11) {
      AlertMessage("Error", "Your phone number must be 11 digits");
      return false;
    } else {
      return true;
    }
  };

  const validateEmail = ({ email }) => {
    var emailRegex =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email.value.match(emailRegex)) {
      AlertMessage("Error", "Invalid email address");
      return false;
    } else {
      return true;
    }
  };

  //if the user has an existing payer id
  if (selectedIndex == "0") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Spinner
            visible={loading}
            overlayColor={"rgba(233,236,239,0.61)"}
            textStyle={styles.spinnerTextStyle}
          />
        </View>

        <View>
          <View>
            <ButtonGroup
              buttons={["I HAVE PAYER ID", `I DON'T HAVE PAYER ID`]}
              selectedIndex={selectedIndex}
              onPress={(value) => {
                setSelectedIndex(value);
              }}
              containerStyle={{ marginBottom: 20 }}
            />
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              label="Payer ID"
              returnKeyType="done"
              value={payerID.value}
              onChangeText={(text) => setPayerID({ value: text, error: "" })}
              error={!!payerID.error}
              errorText={payerID.error}
              style={styles.input}
              keyboardType="number-pad"
            />
          </View>

          <Button
            title="Submit"
            buttonStyle={{
              borderColor: "rgba(78, 116, 289, 1)",
            }}
            type="solid"
            titleStyle={{ color: "rgba(78, 116, 289, 1)" }}
            containerStyle={{
              width: 372,
              marginHorizontal: 20,
              marginTop: 25,
            }}
            titleStyle={{ color: "white" }}
            onPress={() =>
              validatePIDInput({
                payerID,
              }) && validatePID()
            }
          />
        </View>
      </SafeAreaView>
    );
  }

  //if the user doesn't have an existing payer id
  if (selectedIndex == "1") {
    return (
      <KeyboardAwareScrollView style={styles.container}>
        <Spinner
          visible={loading}
          overlayColor={"rgba(233,236,239,0.61)"}
          textStyle={styles.spinnerTextStyle}
        />
        <View>
          <View>
            <ButtonGroup
              buttons={["I HAVE PAYER ID", `I DON'T HAVE PAYER ID`]}
              selectedIndex={selectedIndex}
              onPress={(value) => {
                setSelectedIndex(value);
              }}
              containerStyle={{ marginBottom: 20 }}
            />
          </View>

          <View>
            <Text style={styles.subHeader}>Customer Information</Text>
          </View>

          <View style={styles.passwordContainer}>
            <View>
              <Text
                style={{
                  fontSize: 17,
                  marginBottom: 10,
                  color: "#6c757d",
                  fontSize: 15,
                }}
              >
                Select your means of idenification:
              </Text>
              <RadioGroup
                radioButtons={radioButtons}
                onPress={onPressRadioButton}
                layout="row"
                containerStyle={{ marginBottom: 20 }}
                descriptionStyle={{ color: "#078cd1" }}
              />

              {idenification === "nin" ? (
                <TextInput
                  label="Enter your NIN"
                  returnKeyType="done"
                  value={nin.value}
                  onChangeText={(text) => setNIN({ value: text, error: "" })}
                  error={!!nin.error}
                  errorText={nin.error}
                  keyboardType="number-pad"
                  style={styles.input1}
                  //maxLength={11}
                />
              ) : idenification === "bvn" ? (
                <TextInput
                  label="Enter your BVN"
                  returnKeyType="done"
                  value={bvn.value}
                  onChangeText={(text) => setBVN({ value: text, error: "" })}
                  error={!!bvn.error}
                  errorText={bvn.error}
                  keyboardType="number-pad"
                  style={styles.input1}
                  maxLength={11}
                />
              ) : null}
            </View>

            <SelectList
              setSelected={setSelectedTitle}
              data={title}
              search={false}
              placeholder={"Select your title"}
              boxStyles={styles.dropdown}
              dropdownStyles={{ marginBottom: 25 }}
              //onSelect={() => alert(selectedTitle)}
            />
            <SelectList
              setSelected={setSelectedGender}
              data={gender}
              search={false}
              placeholder={"Select your gender"}
              boxStyles={styles.dropdown}
              dropdownStyles={{ marginBottom: 25 }}
              //onSelect={() => alert(selectedGender)}
            />
            <SelectList
              setSelected={setSelectedMaritalStatus}
              data={maritalStatus}
              search={false}
              placeholder={"Select your marital status"}
              boxStyles={styles.dropdown}
              dropdownStyles={{ marginBottom: 25 }}
            />

            <TextInput
              label="First Name"
              returnKeyType="done"
              value={firstName.value}
              onChangeText={(text) => setFirstName({ value: text, error: "" })}
              error={!!firstName.error}
              errorText={firstName.error}
              keyboardType="default"
              style={styles.input}
            />
            <TextInput
              label="Middle Name"
              returnKeyType="done"
              value={middleName.value}
              onChangeText={(text) => setMiddleName({ value: text, error: "" })}
              error={!!middleName.error}
              errorText={middleName.error}
              keyboardType="default"
              style={styles.input}
            />
            <TextInput
              label="Last Name"
              returnKeyType="done"
              value={lastName.value}
              onChangeText={(text) => setLastName({ value: text, error: "" })}
              error={!!lastName.error}
              errorText={lastName.error}
              keyboardType="default"
              style={styles.input}
            />

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: "#6c757d",
                  fontSize: 15,
                  marginTop: 13,
                  marginBottom: 10,
                  marginLeft: 12,
                }}
              >
                Date Of Birth:{" "}
              </Text>
            </View>

            <DatePicker
              options={{
                backgroundColor: "#f8f9fa",
              }}
              mode="calendar"
              style={{ borderRadius: 10 }}
              onSelectedChange={(date) =>
                setSelectedDate(getFormatedDate(date, "DD-MMMM-YYYY"))
              }
              current="1960-01-01"
            />
            <TextInput
              label="Phone Number"
              returnKeyType="done"
              value={phoneNumber.value}
              onChangeText={(text) =>
                setPhoneNumber({ value: text, error: "" })
              }
              error={!!phoneNumber.error}
              errorText={phoneNumber.error}
              keyboardType="number-pad"
              maxLength={11}
              style={styles.input}
            />
            <TextInput
              label="E-mail"
              returnKeyType="done"
              value={email.value}
              onChangeText={(text) => setEmail({ value: text, error: "" })}
              error={!!email.error}
              errorText={email.error}
              keyboardType="email-address"
              autoComplete="off"
              autoCorrect={false}
              style={styles.input}
            />
            <TextInput
              label="Address"
              returnKeyType="done"
              value={address.value}
              onChangeText={(text) => setAddress({ value: text, error: "" })}
              error={!!address.error}
              errorText={address.error}
              keyboardType="default"
              style={styles.input}
            />
            <TextInput
              label="User Payer ID"
              returnKeyType="done"
              value={userPID.value}
              onChangeText={(text) => setUserPID({ value: text, error: "" })}
              error={!!userPID.error}
              errorText={userPID.error}
              keyboardType="number-pad"
              style={styles.input}
            />
            <Button
              title="Preview Customer Information"
              buttonStyle={{
                borderColor: "rgba(78, 116, 289, 1)",
              }}
              type="solid"
              titleStyle={{ color: "rgba(78, 116, 289, 1)" }}
              containerStyle={{
                width: 372,
                marginTop: 25,
                marginBottom: 50,
              }}
              titleStyle={{ color: "white" }}
              onPress={() =>
                validateInput({
                  firstName,
                  lastName,
                  middleName,
                  phoneNumber,
                  email,
                  address,
                  selectedTitle,
                  selectedGender,
                  selectedMaritalStatus,
                  idenification,
                  userPID,
                }) &&
                validateIdentification({ idenification }) &&
                validatePhoneNumber({ phoneNumber }) &&
                validateEmail({ email }) &&
                navigation.push("PreviewIndivdualPID", {
                  thisPID: individualPID,
                  firstName: firstName.value,
                  lastName: lastName.value,
                  middleName: middleName.value,
                  idenification: idenification,
                  email: email.value,
                  address: address.value,
                  phoneNumber: phoneNumber.value,
                  title: selectedTitle,
                  gender: selectedGender,
                  maritalStatus: selectedMaritalStatus,
                  dateOfBirth: selectedDate,
                  bvn: bvn.value,
                  nin: nin.value,
                  userPID: userPID.value,
                })
              }
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loading}>
        <Spinner
          visible={loading}
          overlayColor={"rgba(233,236,239,0.61)"}
          textStyle={styles.spinnerTextStyle}
        />
      </View>

      <View>
        <View>
          <ButtonGroup
            buttons={["I HAVE PAYER ID", `I DON'T HAVE PAYER ID`]}
            selectedIndex={selectedIndex}
            onPress={(value) => {
              setSelectedIndex(value);
            }}
            containerStyle={{ marginBottom: 20 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  passwordContainer: {
    marginLeft: "4.5%",
    width: "90%",
  },
  header: {
    fontSize: 25,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  subHeader: {
    backgroundColor: "#2089dc",
    color: "white",
    textAlign: "center",
    paddingVertical: 5,
    marginBottom: 20,
    fontSize: 21,
    width: "90%",
    marginLeft: "4.5%",
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderColor: "transparent",
  },
  input1: {
    backgroundColor: "#f8f9fa",
    borderColor: "transparent",
    marginTop: -10,
    marginBottom: 8,
  },
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  spinnerTextStyle: {
    color: "#FFFFFF",
  },
  dropdown: {
    borderRadius: 0,
    marginBottom: 20,
    borderColor: "#6c757d",
  },
});

export default IndividualScreen;




  <Disclosure as="nav" className="">
    {({ open }) => (
      <>
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button*/}
              <Disclosure.Button className="inline-flex items-center justify-end rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="sr-only">Open main menu</span>
                {open ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </Disclosure.Button>
            </div>
            <div className="flex flex-1 justify-end sm:items-stretch sm:justify-between ">
              <div className="flex flex-shrink-0 items-center">
                <img
                  className="block h-8 w-auto lg:hidden"
                  src={logo}
                  alt="RevAc"
                />
                <img
                  className="hidden h-8 w-auto lg:block"
                  src={logo}
                  alt="RevAc"
                />
              </div>
              <div className=" sm:flex hidden sm:ml-6 sm:block">
                <div className=" flex space-x-4">
                  {navigation.map((item) => (
                    <Link
                      to={item.link}
                      key={item.name}
                      href={item.href}
                      className="text-black no-underline hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className=" sm:flex hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  <Link
                    to="/register"
                    className="menu-link px-4 py-1 bg-white text-dark text-decoration-none border-2 rounded border-dark"
                  >
                    Onboarding
                  </Link>
                  <Link
                    to="/login"
                    className="text-dark hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 mx-3 px-4 border-0 text-decoration-none rounded bg-light py-1"
                  >
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Disclosure.Panel className="sm:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                to={item.link}
                key={item.name}
                href={item.href}
                className="text-black no-underline hover:text-white block rounded-md px-3 py-2 text-base font-medium"
              >
                {item.name}
              </Link>
            ))}

            <Link
              to="/register"
              className="text-black no-underline bg-light hover:text-white block rounded-md px-3 py-2 text-base font-medium"
            >
              Onboarding
            </Link>
            <Link
              to="/login"
              className="text-black no-underline bg-light hover:text-white block rounded-md px-3 py-2 text-base font-medium"
            >
              Login
            </Link>
          </div>
        </Disclosure.Panel>
      </>
    )}
  </Disclosure>;