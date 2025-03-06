import { useState } from "react";
import paws from "../assets/paws.png";
import cam from "../assets/cam_plus.png";
import check from "../assets/check.png";
import { useNavigate } from "react-router-dom";
import "./Register.css";

import { LoginService } from "../services/LoginService";
import { Profile } from "@shared/Profile";

const Register = () => {
  const [step, setStep] = useState(1); // Track registration step

  // User info state
  const [ownerFirstName, setOwnerFirstName] = useState("");
  const [ownerLastName, setOwnerLastName] = useState("");
  const [dogName, setDogName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dogBreed, setDogBreed] = useState("");
  const [dogTraits, setDogTraits] = useState<string[]>([]);
  const [newTrait, setNewTrait] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dogPhoto, setDogPhoto] = useState<string | null>("fakePhotoURL");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const service = new LoginService();
      const newProfile = new Profile(
        email,
        dogName,
        dogBreed,
        dogTraits.join(", "),
        email,
        `${ownerFirstName} ${ownerLastName}`,
        dogPhoto || ""
      );

      await service.register(newProfile);

      navigate("/home");

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      // reader.onloadend = () => {
      //   setDogPhoto(reader.result as string); // Convert file to base64 URL
      // };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="register-page">
      <div className="content">
        <h1>{step < 6 ? "Let's Get You Started!" : "Complete!"}</h1>
        <h2>
          {step === 1
            ? "Enter Your Email & Password"
            : step === 2
            ? "Enter You & Your Dog's Name"
            : step === 3
            ? "Select Your Dog's Breed"
            : step === 4
            ? "Add Your Dog’s Personality Traits"
            : step === 5
            ? "Upload Your Dog’s Profile Picture"
            : ""}
        </h2>
        <h2 className="tagline">{step < 6 ? "Creating your account" : ""}</h2>

        <div className="register-features">
          <form onSubmit={(e) => e.preventDefault()}>
            {/* Step 1: Email & Password */}
            {step === 1 && (
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
            {/* Step 2: Name Input */}
            {step === 2 && (
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
            {/* Step 3: Dog Breed */}
            {step === 3 && (
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

            {/* Step 4: Dog Personality */}
            {step === 4 && (
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

            {/* Step 5: Dog Profile Picture */}
            {step === 5 && (
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

            {/* Step 6: registration complete */}
            {step === 6 && (
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
                  if (step === 6) {
                    handleRegister(); // Call the register service on step 6
                  } else {
                    handleContinue(); // Handle continue for other steps
                  }
                }}
                disabled={
                  step === 1
                    ? !email || !password
                    : step === 2
                    ? !ownerFirstName || !ownerLastName || !dogName
                    : step === 3
                    ? !dogBreed
                    : step === 4
                    ? dogTraits.length === 0
                    : step === 5
                    ? !dogPhoto
                    : false
                }
              >
                Continue
              </button>

              {/* Back Button */}
              {step >= 2 && step <= 6 && (
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
