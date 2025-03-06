import { useState } from "react";
import paws from "../assets/paws.png";
import cam from "../assets/cam_plus.png";
import check from "../assets/check.png";
import { useNavigate } from "react-router-dom";
import "./Register.css";

import { LoginService } from "../services/LoginService";

const Register = () => {
  const [step, setStep] = useState(1); // Track registration step

  // User info state
  const [ownerFirstName, setOwnerFirstName] = useState("");
  const [ownerLastName, setOwnerLastName] = useState("");
  const [dogName, setDogName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ownersBirthday, setOwnersBirthday] = useState("");
  const [dogsBirthday, setDogsBirthday] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [dogBreed, setDogBreed] = useState("");
  const [dogTraits, setDogTraits] = useState<string[]>([]);
  const [newTrait, setNewTrait] = useState("");
  const [dogPhoto, setDogPhoto] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const service = new LoginService();

      await service.register();

      navigate("/home");
    } catch (error: unknown) {
      alert("Register failed. Invalid information");
    }
  };

  const handleContinue = () => {
    if (step < 8) setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep((prevStep) => prevStep - 1);
  };

  const addTrait = () => {
    if (newTrait.trim() !== "") {
      setDogTraits([...dogTraits, newTrait]);
      setNewTrait(""); // Clear input field
    }
  };

  const removeTrait = (index: number) => {
    setDogTraits(dogTraits.filter((_, i) => i !== index)); // Remove trait by index
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Use a reverse geocoding API to fetch the address
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          if (data.address) {
            setStreet(data.address.road || "");
            setCity(
              data.address.city ||
                data.address.town ||
                data.address.village ||
                ""
            );
            setZipCode(data.address.postcode || "");
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Failed to retrieve location. Please enter your address manually."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDogPhoto(reader.result as string); // Convert file to base64 URL
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="register-page">
      <div className="content">
        <h1>{step < 8 ? "Let's Get You Started!" : "Complete!"}</h1>
        <h2>
          {step === 1
            ? "Enter You & Your Furry Friend's Name"
            : step === 2
            ? "Enter Your Email & Password"
            : step === 3
            ? "Enter You & Your Furry Friend's Date of Birth"
            : step === 4
            ? "Enter Your Address"
            : step === 5
            ? "What is your dog's breed?"
            : step === 6
            ? "Add Your Dog’s Personality Traits"
            : step === 7
            ? "Upload Your Dog’s Profile Picture"
            : ""}
        </h2>
        <h2 className="tagline">{step < 8 ? "Creating your account" : ""}</h2>

        <div className="register-features">
          <form onSubmit={(e) => e.preventDefault()}>
            {/* Step 1: Name Input */}
            {step === 1 && (
              <>
                <input
                  type="text"
                  value={ownerFirstName}
                  onChange={(e) => setOwnerFirstName(e.target.value)}
                  placeholder="Enter your first name"
                />
                <input
                  type="text"
                  value={ownerLastName}
                  onChange={(e) => setOwnerLastName(e.target.value)}
                  placeholder="Enter your last name"
                />
                <input
                  type="text"
                  value={dogName}
                  onChange={(e) => setDogName(e.target.value)}
                  placeholder="Enter your dog's name"
                />
              </>
            )}

            {/* Step 2: Email & Password */}
            {step === 2 && (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </>
            )}

            {/* Step 3: Date of Birth */}
            {step === 3 && (
              <>
                <input
                  type="text"
                  value={ownersBirthday}
                  onChange={(e) => setOwnersBirthday(e.target.value)}
                  placeholder="Enter your birthday DD/MM/YYYY"
                />
                <input
                  type="text"
                  value={dogsBirthday}
                  onChange={(e) => setDogsBirthday(e.target.value)}
                  placeholder="Enter dog's birthday DD/MM/YYYY"
                />
              </>
            )}
            {/* Step 4: Address */}
            {step === 4 && (
              <>
                <button
                  type="button"
                  className="register-submit curr_loc_button"
                  onClick={handleUseCurrentLocation}
                >
                  Use Current Location
                </button>
                <div className="solid-divider">
                  <div className="line"></div>
                  <span>Or Enter Manually</span>
                </div>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Enter Your Street Address"
                />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter Your City"
                />
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="Enter Your ZIP Code"
                />
              </>
            )}
            {/* Step 5: Dog Breed */}
            {step === 5 && (
              <select
                value={dogBreed}
                onChange={(e) => setDogBreed(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select dog breed
                </option>
                <option value="Labrador">Labrador Retriever</option>
                <option value="French Bulldog">French Bulldog</option>
                <option value="Golden Retriever">Golden Retriever</option>
                <option value="Poodle">Poodle</option>
                <option value="Bulldog">Bulldog</option>
                <option value="German Shepherd">German Shepherd</option>
              </select>
            )}

            {/* Step 6: Dog Personality */}
            {step === 6 && (
              <>
                <div className="trait-input-container">
                  <input
                    type="text"
                    value={newTrait}
                    onChange={(e) => setNewTrait(e.target.value)}
                    placeholder="Enter a trait (e.g., Playful)"
                  />
                  <button
                    type="button"
                    className="add-trait"
                    onClick={addTrait}
                    disabled={!newTrait.trim()}
                  >
                    + Add Trait
                  </button>
                </div>

                <ul className="trait-list">
                  {dogTraits.map((trait, index) => (
                    <li key={index} className="trait-item">
                      {trait}
                      <button
                        type="button"
                        className="remove-trait"
                        onClick={() => removeTrait(index)}
                      >
                        ✖
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Step 7: Dog Profile Picture */}
            {step === 7 && (
              <>
                <label htmlFor="file-input" className="file-input-label">
                  <img src={cam} alt="Camera Icon" className="camera-icon" />
                </label>
                <input
                  type="file"
                  id="file-input"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                {dogPhoto && (
                  <img
                    src={dogPhoto}
                    alt="Dog Profile Preview"
                    className="profile-preview"
                  />
                )}
              </>
            )}

            {/* Step 8: registration complete */}
            {step === 8 && (
              <div className="registration-complete-container">
                <img src={check} alt="Check Icon" className="check-icon" />
                <h1>Thank you for signing up.</h1>
              </div>
            )}

            <div className="form-navigation">
              {/* Continue Button */}
              <button
                type="button"
                className="register-submit reg_button"
                onClick={() => {
                  if (step === 8) {
                    handleRegister(); // Call the register service on step 8
                  } else {
                    handleContinue(); // Handle continue for other steps
                  }
                }}
                disabled={
                  step === 1
                    ? !ownerFirstName || !ownerLastName || !dogName
                    : step === 2
                    ? !email || !password
                    : step === 3
                    ? !ownersBirthday || !dogsBirthday
                    : step === 4
                    ? !street || !city || !zipCode
                    : step === 5
                    ? !dogBreed
                    : step === 6
                    ? dogTraits.length === 0
                    : step === 7
                    ? !dogPhoto
                    : false
                }
              >
                Continue
              </button>

              {/* Back Button */}
              {step >= 2 && step <= 7 && (
                <button
                  type="button"
                  className="register-submit back_button"
                  onClick={handleBack}
                >
                  Back
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="background-images">
        <img src={paws} alt="Paw print background" className="paws" />
      </div>

      <button className="secondary-option" onClick={() => navigate("/login")}>
        Already a member? <span className="join-now-text">Sign In</span>
      </button>
    </div>
  );
};

export default Register;
