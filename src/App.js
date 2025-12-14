import React, { useState, useEffect } from 'react';
import './App.css';

class Ic {
  constructor() {
    this.negeri = 0;
    this.gender = '';
    this.age = 0;
    this.dash = '';
  }

  getNegeri() { return this.negeri; }
  getGender() { return this.gender; }
  getAge() { return this.age; }
  getDash() { return this.dash; }

  setNegeri(negeri) { this.negeri = negeri; }
  setGender(gender) { this.gender = gender; }
  setAge(age) { this.age = age; }
  setDash(useDash) {
    this.dash = useDash ? '-' : '';
  }

  generateIc(currentYear) {
    let yearStr;

    if (this.age > 0) {
      const birthYear = currentYear - this.age;
      yearStr = String(birthYear % 100).padStart(2, '0');
    } else {
      const maxYear = currentYear - 1;
      const minYear = 1940;
      const effectiveMaxYear = Math.max(minYear, maxYear);

      const randomYear = Math.floor(Math.random() * (effectiveMaxYear - minYear + 1)) + minYear;
      yearStr = String(randomYear % 100).padStart(2, '0');
    }

    const month = Math.floor(Math.random() * 12) + 1;
    const monthStr = String(month).padStart(2, '0');
    const day = Math.floor(Math.random() * 28) + 1;
    const dayStr = String(day).padStart(2, '0');

    let stateCode = this.negeri;
    if (stateCode < 1 || stateCode > 16) {
      stateCode = Math.floor(Math.random() * 16) + 1;
    }
    const stateStr = String(stateCode).padStart(2, '0');

    const effectiveGender = this.gender.toLowerCase() === 'male' || this.gender.toLowerCase() === 'female'
      ? this.gender.toLowerCase()
      : (Math.random() < 0.5 ? 'male' : 'female');

    const isMale = effectiveGender === 'male';

    let randomNum = Math.floor(Math.random() * 10000);

    const lastDigit = randomNum % 10;
    const isLastDigitOdd = lastDigit % 2 !== 0;

    if (isMale && !isLastDigitOdd) {
      randomNum = (lastDigit === 9) ? randomNum - 1 : randomNum + 1;
    } else if (!isMale && isLastDigitOdd) {
      randomNum = randomNum - 1;
    }

    const randomStr = String(Math.max(0, randomNum)).padStart(4, '0');

    return `${yearStr}${monthStr}${dayStr}${this.dash}${stateStr}${this.dash}${randomStr}`;
  }
}

class Validator {
  validateIcLength(ic) {
    const negeri = ic.getNegeri();
    if (negeri !== 0 && (negeri < 1 || negeri > 16)) {
      return { valid: false, message: 'Invalid state code! Must be between 01-16' };
    }

    const age = ic.getAge();
    if (age !== 0 && (age < 1 || age > 120)) {
      return { valid: false, message: 'Invalid age! Must be between 1-120' };
    }

    const gender = ic.getGender().toLowerCase();
    if (gender && gender !== 'male' && gender !== 'female') {
      return { valid: false, message: 'Invalid gender! Must be Male or Female' };
    }

    return { valid: true };
  }
}

function App() {
  const [formData, setFormData] = useState({
    negeri: '',
    gender: '',
    age: ''
  });

  const [generatedIC, setGeneratedIC] = useState('');
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const currentYear = new Date().getFullYear();
  const [useDash, setUseDash] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // const [isOn, setIsOn] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const myIc = new Ic();

    const negeriInput = parseInt(formData.negeri);
    const effectiveNegeri = isNaN(negeriInput) ? 0 : negeriInput;
    const ageInput = parseInt(formData.age);
    const effectiveAge = !isNaN(ageInput) ? ageInput : 0;
    const effectiveGender = formData.gender;

    myIc.setNegeri(effectiveNegeri);
    myIc.setGender(effectiveGender);
    myIc.setAge(effectiveAge);
    myIc.setDash(useDash);

    const validator = new Validator();
    const validation = validator.validateIcLength(myIc);

    if (validation.valid) {
      const ic = myIc.generateIc(currentYear);
      setGeneratedIC(ic);
    } else {
      setError(validation.message);
    }
  };

  const resetForm = () => {
    setFormData({ negeri: '', gender: '', age: '' });
    setGeneratedIC('');
    setUseDash(false);
    setError('');
  };

  const getLastDigit = (ic) => ic ? ic.slice(-1) : '';
  const isRandom = generatedIC && !formData.negeri && !formData.gender && !formData.age;
  const getStateCode = (ic, useDash) => {

    if (useDash) {
      return ic.substring(7, 9);
    } else {
      return ic.substring(6, 8);
    }
  };


  return (
    <div className="App">
      <div className="container">
        <button className="theme-toggle" onClick={toggleTheme}>
          <span className="theme-icon">{isDarkMode ? '☀️' : '🌙'}</span>
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <div className="header">
          <div className="icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="2" y="4" width="20" height="16" rx="2" strokeWidth="2" />
              <circle cx="7" cy="9" r="0.5" fill="currentColor" />
              <circle cx="7" cy="12" r="0.5" fill="currentColor" />
              <circle cx="7" cy="15" r="0.5" fill="currentColor" />
              <line x1="11" y1="9" x2="17" y2="9" strokeWidth="2" />
              <line x1="11" y1="12" x2="17" y2="12" strokeWidth="2" />
              <line x1="11" y1="15" x2="17" y2="15" strokeWidth="2" />
            </svg>
          </div>
          <h1>IC Generator</h1>
          <p className="subtitle">Generate Malaysian Identity Card Numbers For Testing Purpose only</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="negeri">Negeri (State) <small>(Optional)</small></label>
              <select
                id="negeri"
                name="negeri"
                value={formData.negeri}
                onChange={handleInputChange}
              >
                <option value="">Select a state (Random)</option>
                <option value="1">01 - Johor</option>
                <option value="2">02 - Kedah</option>
                <option value="3">03 - Kelantan</option>
                <option value="4">04 - Melaka</option>
                <option value="5">05 - Negeri Sembilan</option>
                <option value="6">06 - Pahang</option>
                <option value="7">07 - Penang</option>
                <option value="8">08 - Perak</option>
                <option value="9">09 - Perlis</option>
                <option value="10">10 - Selangor</option>
                <option value="11">11 - Terengganu</option>
                <option value="12">12 - Sabah</option>
                <option value="13">13 - Sarawak</option>
                <option value="14">14 - Kuala Lumpur</option>
                <option value="15">15 - Labuan</option>
                <option value="16">16 - Putrajaya</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender <small>(Optional)</small></label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="">Select gender (Random)</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="form-group fade-in">
              <label htmlFor="age">Age <small>(Optional)</small></label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                min="1"
                max="120"
                placeholder={`Enter age (Calculated from ${currentYear})`}
              />
            </div>
            <div className="form-group">
              <div className="toggle-container">
                <label className="toggle-wrapper">
                  <span className="toggle-label">Include Dashes (-)</span>
                  <div
                    className={`toggle ${useDash ? "on" : ""}`}
                    onClick={() => setUseDash(!useDash)}>
                    <div className="knob" />
                  </div>
                </label>
              </div>
            </div>

            <div className="button-group">
              <button type="submit" className="btn btn-primary">
                Generate IC
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Reset
              </button>
            </div>
          </form>

          {error && (
            <div className="result show error">
              <h3>❌ Validation Error</h3>
              <p>{error}</p>
              <p>Please fix the invalid input above, or clear the field to generate a random value.</p>
            </div>
          )}

          {generatedIC && (
            <div className="result show">
              <div className="ic-number">{generatedIC}</div>
              <button
                onClick={() => navigator.clipboard.writeText(generatedIC)}>Copy</button>
              <div className="details">
                <div className="detail-item">
                  <span className="detail-label">State Code:</span>
                  <span>{getStateCode(generatedIC, useDash)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Gender:</span>
                  <span>{getLastDigit(generatedIC) % 2 !== 0 ? 'Male' : 'Female'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Birth Year:</span>
                  <span>{generatedIC.substring(0, 2)}XX</span>
                </div>
                <div className="detail-item detail-gender-check">
                  <span className="detail-label">Gender Check (Last Digit):</span>
                  <span className={getLastDigit(generatedIC) % 2 !== 0 ? 'male-digit' : 'female-digit'}>
                    {getLastDigit(generatedIC)} ({getLastDigit(generatedIC) % 2 !== 0 ? 'Odd - Male' : 'Even - Female'})
                  </span>
                </div>
              </div>
              <p className="note">
                {isRandom
                  ? 'Note: All values were randomly generated as no input was provided.'
                  : `Note: Generated based on your selected criteria (Current Year: ${currentYear}).`
                }
              </p>
            </div>
          )}
        </div>

        <p className="footer">
          <br />
          <small>Disclaimer: This generator is for testing purposes only and does not produce valid, registered Malaysian IC numbers.</small>
        </p>
      </div>
    </div>
  );
}
export default App;