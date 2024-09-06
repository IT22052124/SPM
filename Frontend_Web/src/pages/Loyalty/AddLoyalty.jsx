import { useState, useEffect } from "react";
import { Input, Option, Button } from "@material-tailwind/react";
import Select from "react-tailwindcss-select";
import { FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddLoyalty = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [fullNameError, setFullNameError] = useState(""); // For full name validation
  const [addressError, setAddressError] = useState(""); // For address validation
  const [dobError, setDobError] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loyalty, setLoyalty] = useState([]);

  const navigate = useNavigate();

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Phone number validation
  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;

    // Remove any non-digit characters
    const numericValue = value.replace(/\D/g, '');

    if (numericValue.length <= 10) {
      setPhoneNumber(numericValue);

      // Check if the phone number already exists
      const phoneExists = loyalty.some((customer) => customer.Phone.toString().padStart(10, '0') === numericValue);
      if (phoneExists) {
        setPhoneError("Phone number already exists.");
      } else {
        setPhoneError("");
      }
    }
  };

  const handlePhoneNumberBlur = () => {
    if (phoneNumber.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits.");
    }
  };

  // Full Name validation
  const handleFullNameBlur = () => {
    if (!fullName.trim()) {
      setFullNameError("Full name is required.");
    } else {
      setFullNameError("");
    }
  };

  // Address validation
  const handleAddressBlur = () => {
    if (!address.trim()) {
      setAddressError("Address is required.");
    } else {
      setAddressError("");
    }
  };

  // Email validation on blur
  const handleEmailBlur = () => {
    if (!email.trim()) {
      setEmailError("Email is required.");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError("Invalid email format.");
      } else {
        setEmailError("");
      }
    }
  };

  // Email validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value)) {
      setEmailError("");
    } else {
      setEmailError("Invalid email format.");
    }
  };

  const handleGenderChange = (selectedOption) => {
    if (selectedOption) {
      setGender(selectedOption.value);
    }
  };
  
  const handleDobChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    
    if (selectedDate > today) {
      setDobError("Date of birth cannot be in the future.");
    } else {
      setDobError("");
      setDob(e.target.value); // Set dob only if the date is valid
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    // Get today's date
    const today = new Date();
    const selectedDate = new Date(dob);

    // Check if DOB is greater than today
    if (selectedDate > today) {
      setDobError("Date of birth cannot be in the future.");
      return;
    } else {
      setDobError(""); // Clear error if date is valid
    }
    
    // Validate all fields before submission
    if (!phoneNumber || phoneError || phoneNumber.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits.");
      return;
    }

    if (phoneError || emailError || fullNameError || addressError || dobError) {
      return; // Prevent submission if any field has an error
    }

    if (!fullName.trim()) {
      setFullNameError("Full name is required.");
      return;
    }

    if (!email || emailError) {
      setEmailError("Invalid email format.");
      return;
    }

    if (!address.trim()) {
      setAddressError("Address is required.");
      return;
    }

    if (!gender) {
      alert("Please select a gender.");
      return;
    }

    if (!dob) {
      alert("Please select a date of birth.");
      return;
    }

    setLoading(true);

    const formData = {
      phoneNumber,
      email,
      fullName,
      address,
      gender,
      dob,
    };

    axios
      .post("http://localhost:5000/loyalty/loyalty-customers", formData)
      .then((res) => {
        setLoading(false);
        alert("Loyalty customer added successfully!");
        // Optionally clear the form or navigate away
        navigate('/success'); // Replace with the actual path if needed
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/loyalty/loyalty-customers")
      .then((res) => {
        setLoyalty(res.data);
        setLoading(false);
        console.log("Loyalty data:", res.data);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    console.log("Loyalty data updated:", loyalty);
  }, [loyalty]);

  return (
    <div className="h-dvh">
      <div className="relative w-full mx-36 mt-5 flex left-28">
        <div className="w-4/6 mr-2">
          <div className="relative flex flex-col flex-auto min-w-0 p-4 mx-6 text-left break-words bg-white border-0 dark:bg-slate-850 dark:shadow-dark-xl shadow-3xl rounded-2xl bg-clip-border">
            <div className="flex flex-wrap -mx-3">
              <div className="flex-none w-auto max-w-full px-3 my-auto">
                <div className="h-full">
                  <h5 className="mb-8 ml-32 text-black font-semibold text-3xl text-center">
                    Add New Loyalty Customers
                  </h5>
                </div>
              </div>
            </div>

            {/* Phone Number */}
            <span className="block text-base font-medium text-gray-700 ml-3">Phone Number:</span>
            <Input
              type="text"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              onBlur={handlePhoneNumberBlur} // Add onBlur event handler
              style={{ width: "97%" }}
              maxLength={10} // Limit input length to 10
              className="!border !border-gray-300 mx-3 mt-1 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:ring-gray-900/10"
              labelProps={{
                className: "hidden",
              }}
              containerProps={{ className: "min-w-[100px]" }}
            />
            {phoneError && (
              <p className="text-red-500 text-sm ml-3 mt-1">{phoneError}</p>
            )}

            {/* Full Name */}
            <span className="block text-base font-medium text-gray-700 ml-3 mt-5">Full Name:</span>
            <Input
              type="text"
              placeholder="Enter customer full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{ width: "97%" }}
              onBlur={handleFullNameBlur} // Add onBlur handler for full name
              className="!border !border-gray-300 mx-3 mt-1 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:ring-gray-900/10"
              labelProps={{
                className: "hidden",
              }}
              containerProps={{ className: "min-w-[100px]" }}
            />
            {fullNameError && <p className="text-red-500 text-sm ml-3 mt-1">{fullNameError}</p>}

            {/* Email */}
            <span className="block text-base font-medium text-gray-700 ml-3 mt-5">Email:</span>
            <Input
              type="email"
              placeholder="Enter customer email address"
              value={email}
              onChange={handleEmailChange}
              style={{ width: "97%" }}
              onBlur={handleEmailBlur} // Add onBlur handler for email
              className="!border !border-gray-300 mx-3 mt-1 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:ring-gray-900/10"
              labelProps={{
                className: "hidden",
              }}
              containerProps={{ className: "min-w-[100px]" }}
            />
            {emailError && <p className="text-red-500 text-sm ml-3 mt-1">{emailError}</p>}

            {/* Address */}
            <span className="block text-base font-medium text-gray-700 ml-3 mt-5">Address:</span>
            <Input
              type="text"
              placeholder="Enter customer home address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ width: "97%" }}
              onBlur={handleAddressBlur} // Add onBlur handler for address
              className="!border !border-gray-300 mx-3 mt-1 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:ring-gray-900/10"
              labelProps={{
                className: "hidden",
              }}
              containerProps={{ className: "min-w-[100px]" }}
            />
            {addressError && <p className="text-red-500 text-sm ml-3 mt-1">{addressError}</p>}

            <div className="flex items-center">
              <div className="flex-1 text-left">
                <span className="block text-sm font-medium text-gray-700 ml-3 mt-5">Gender:</span>
                <div style={{ width: "250px" }} className="ml-3">
                  <Select
                    isSearchable
                    value={gender ? { value: gender, label: gender } : null}// Ensure the selected value is shown
                    onChange={handleGenderChange}
                    primaryColor={"blue"}
                    placeholder="Select..."
                    options={[
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                    ]}
                  />
                </div>
              </div>

              <div className="mr-16">
                {/* Date of Birth with Calendar Icon */}
                <span className="block text-base font-medium text-gray-700 ml-3 mt-5">DOB:</span>
                  <div className="relative">
                    <Input
                      type="date"
                      value={dob}
                      onChange={handleDobChange}
                      max={getCurrentDate()} // Prevent user from selecting future dates
                      style={{ width: "200px" }}
                      className="!border !border-gray-300 mx-3 mt-1 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:ring-gray-900/10 !px-3 !py-2 box-border"
                      labelProps={{
                        className: "hidden",
                      }}
                      containerProps={{ className: "min-w-[100px]" }}
                    />
                    {dobError && <p className="text-red-500 text-sm ml-3 mt-1">{dobError}</p>}
                    <FaCalendarAlt className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
              </div>
            </div>

            <div className="mt-10 ml-72">
            <Button 
              color="blue" 
              onClick={submitHandler} 
              disabled={loading || phoneError || emailError || fullNameError || addressError || dobError}
            >
              {loading ? "Creating..." : "Create"}
            </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLoyalty;
