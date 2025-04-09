import { useState, useEffect } from "react";
import "./DogBreed.css";
import dogBreedsData from "./dogBreeds.json";

interface DogBreedProps {
  dogBreed: string;
  setDogBreed: (breed: string) => void;
}

const DogBreed = ({ dogBreed, setDogBreed }: DogBreedProps) => {
  const [inputValue, setInputValue] = useState(dogBreed); //Track input
  const [showSuggestions, setShowSuggestions] = useState(true);
  const dogBreeds = dogBreedsData as string[];

  const filteredBreeds = dogBreeds.filter((breed) =>
    breed.toLowerCase().startsWith(inputValue.toLowerCase())
  );

  // Only show suggestions/dropdown ui if there are matches
  const shouldShowSuggestions =
    showSuggestions && inputValue && filteredBreeds.length > 0 && !dogBreed;

  const handleBreedClick = (breed: string) => {
    setDogBreed(breed); //Only set breed once selected from drop down
    setInputValue(breed);
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };

  // If input is cleared, reset dogBreed to empty string
  useEffect(() => {
    if (inputValue === "") {
      setDogBreed("");
    }
  }, [inputValue, setDogBreed]);

  return (
    <div className="dog-breed-container">
      <input
        type="text"
        value={inputValue} // Bind the input to inputValue
        onChange={handleInputChange}
        placeholder="Start typing a dog breed..."
        className="dog-breed-input"
        required
      />
      {shouldShowSuggestions && (
        <ul className="breed-suggestions">
          {filteredBreeds.map((filteredBreed) => (
            <li
              key={filteredBreed}
              onClick={() => handleBreedClick(filteredBreed)}
              className="breed-suggestion-item"
            >
              {filteredBreed}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DogBreed;
