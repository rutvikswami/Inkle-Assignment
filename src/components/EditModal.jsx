import React, { useState, useEffect, useRef } from 'react';
import './EditModal.css';

const EditModal = ({ isOpen, onClose, onSave, data, countries, onCountriesUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    countryId: "",
  });
  const [isEditingCountry, setIsEditingCountry] = useState(false);
  const [newCountryName, setNewCountryName] = useState("");
  const [editingCountryId, setEditingCountryId] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (data) {
      const matchingCountry = countries.find(
        (country) => country.name === data.country
      );

      setFormData((prev) => ({
        ...prev,
        name: data.name || "",
        country: matchingCountry ? matchingCountry.name : "",
        countryId: matchingCountry ? matchingCountry.id : "",
      }));
    }
  }, [data]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "countryId") {
      const selectedCountry = countries.find((c) => c.id === value);
      setFormData((prev) => ({
        ...prev,
        country: selectedCountry ? selectedCountry.name : "",
        countryId: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Name is required");
      return;
    }

    if (!formData.countryId) {
      alert("Country is required");
      return;
    }

    const updatedData = {
      ...data,
      name: formData.name.trim(),
      country: formData.country,
      countryId: formData.countryId,
    };

    onSave(updatedData);
  };

  const handleCountryEditStart = (country) => {
    setIsEditingCountry(true);
    setNewCountryName(country.name);
    setEditingCountryId(country.id);
  };

  const handleCountrySave = async () => {
    if (!newCountryName.trim()) {
      alert("Country name is required");
      return;
    }

    if (!editingCountryId) {
      alert("No country selected for editing");
      return;
    }

    try {
      const response = await fetch(
        `https://685013d7e7c42cfd17974a33.mockapi.io/countries/${editingCountryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newCountryName.trim(),
          }),
        }
      );

      if (response.ok) {
        const updatedCountry = await response.json();

        // Update the countries list
        const updatedCountries = countries.map((country) =>
          country.id === editingCountryId
            ? { ...country, name: updatedCountry.name }
            : country
        );

        if (onCountriesUpdate) {
          onCountriesUpdate(updatedCountries);
        }

        if (formData.countryId === editingCountryId) {
          setFormData((prev) => ({
            ...prev,
            country: updatedCountry.name,
          }));
        }

        setIsEditingCountry(false);
        setNewCountryName("");
        setEditingCountryId(null);
      } else {
        alert("Failed to update country");
      }
    } catch (error) {
      console.error("Error updating country:", error);
      alert("Failed to update country");
    }
  };

  const handleCountryCancel = () => {
    setIsEditingCountry(false);
    setNewCountryName("");
    setEditingCountryId(null);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h2>Edit Customer</h2>
          <button className="close-btn" onClick={onClose} type="button">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder=""
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="countryId">Country</label>
            {isEditingCountry ? (
              <div className="country-edit-container">
                <input
                  type="text"
                  value={newCountryName}
                  onChange={(e) => setNewCountryName(e.target.value)}
                  placeholder="Edit country name"
                  className="country-input"
                />
                <div className="country-edit-actions">
                  <button
                    type="button"
                    className="country-save-btn"
                    onClick={handleCountrySave}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="country-cancel-btn"
                    onClick={handleCountryCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="country-field-container" ref={dropdownRef}>
                <div className="country-input-wrapper">
                  <input
                    type="text"
                    value={formData.country}
                    readOnly
                    placeholder="Select a country"
                    className="country-display-input"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  />
                  <button
                    type="button"
                    className="country-field-edit-btn"
                    onClick={() => {
                      const selectedCountry = countries.find(c => c.id === formData.countryId);
                      if (selectedCountry) {
                        handleCountryEditStart(selectedCountry);
                      }
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M11.333 2.667a1.333 1.333 0 011.886 0l.447.447a1.333 1.333 0 010 1.886L6 12.667l-2.667.666L4 10.667L11.333 2.667z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="dropdown-arrow-btn"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <svg className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`} width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                {isDropdownOpen && (
                  <div className="country-dropdown-list">
                    {countries.map((country) => (
                      <div 
                        key={country.id} 
                        className={`country-option ${formData.countryId === country.id ? 'selected' : ''}`}
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            countryId: country.id,
                            country: country.name
                          }));
                          setIsDropdownOpen(false);
                        }}
                      >
                        <span className="country-name">{country.name}</span>
                        <button
                          type="button"
                          className="country-edit-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCountryEditStart(country);
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M11.333 2.667a1.333 1.333 0 011.886 0l.447.447a1.333 1.333 0 010 1.886L6 12.667l-2.667.666L4 10.667L11.333 2.667z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;