import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import axios from 'axios';
import EditModal from './EditModal';
import './DataTable.css';

const DataTable = () => {
  const [data, setData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState([]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [genderFilter, setGenderFilter] = useState([]);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const dropdownRef = useRef(null);
  const genderDropdownRef = useRef(null);
  const dateDropdownRef = useRef(null);

  const handleCountriesUpdate = (updatedCountries) => {
    setCountries(updatedCountries);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
      if (genderDropdownRef.current && !genderDropdownRef.current.contains(event.target)) {
        setShowGenderDropdown(false);
      }
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target)) {
        setShowDateFilter(false);
      }
    };

    if (showCountryDropdown || showGenderDropdown || showDateFilter) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showCountryDropdown, showGenderDropdown, showDateFilter]);

  const handleCountryDropdownToggle = () => {
    setShowCountryDropdown(!showCountryDropdown);
  };

  const handleGenderDropdownToggle = () => {
    setShowGenderDropdown(!showGenderDropdown);
  };

  const handleDateFilterToggle = () => {
    setShowDateFilter(!showDateFilter);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [taxesResponse, countriesResponse] = await Promise.all([
          axios.get('https://685013d7e7c42cfd17974a33.mockapi.io/taxes'),
          axios.get('https://685013d7e7c42cfd17974a33.mockapi.io/countries')
        ]);
        
        setData(taxesResponse.data);
        setCountries(countriesResponse.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (row) => {
    setSelectedRow(row.original);
    setIsEditModalOpen(true);
  };

  const handleSave = async (updatedData) => {
    try {
      const response = await axios.put(
        `https://685013d7e7c42cfd17974a33.mockapi.io/taxes/${updatedData.id}`,
        updatedData
      );
      
      setData(prevData =>
        prevData.map(item =>
          item.id === updatedData.id ? response.data : item
        )
      );
      
      setIsEditModalOpen(false);
      setSelectedRow(null);
    } catch (err) {
      console.error('Error updating data:', err);
      alert('Failed to update data');
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Entity',
        cell: (info) => (
          <span className="entity-name">
            {info.row.original.name || info.row.original.entity || info.getValue()}
          </span>
        ),
        enableGlobalFilter: true,
      },
      {
        accessorKey: 'gender',
        header: ({ table }) => (
          <div className="gender-header-dropdown" ref={genderDropdownRef}>
            <button 
              className="gender-header-button"
              onClick={handleGenderDropdownToggle}
            >
              <span>Gender</span>
              <svg className="filter-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18l-7 7v6l-4 2v-8L3 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {showGenderDropdown && (
              <div className="gender-multiselect-dropdown">
                <div className="multiselect-options">
                  {['Male', 'Female'].map((gender) => (
                    <label key={gender} className="multiselect-option">
                      <input
                        type="checkbox"
                        checked={genderFilter.includes(gender)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setGenderFilter(prev => [...prev, gender]);
                          } else {
                            setGenderFilter(prev => prev.filter(g => g !== gender));
                          }
                        }}
                      />
                      <span className="checkmark"></span>
                      <span className="option-text">{gender}</span>
                    </label>
                  ))}
                </div>
                <div className="multiselect-actions">
                  <button 
                    className="clear-all-btn"
                    onClick={() => setGenderFilter([])}
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </div>
        ),
        cell: (info) => {
          const gender = info.getValue();
          const genderText = gender ? gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase() : '';
          return (
            <span className={`gender-text ${genderText.toLowerCase()}`}>
              {genderText}
            </span>
          );
        },
        enableSorting: false,
        enableGlobalFilter: true,
      },
      {
        accessorKey: 'requestDate',
        header: ({ table }) => (
          <div className="date-header-dropdown" ref={dateDropdownRef}>
            <button 
              className="date-header-button"
              onClick={handleDateFilterToggle}
            >
              <span>Request date</span>
              <svg className="filter-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18l-7 7v6l-4 2v-8L3 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {showDateFilter && (
              <div className="date-filter-dropdown">
                <div className="date-filter-inputs">
                  <div className="date-input-group">
                    <label>From:</label>
                    <input
                      type="date"
                      value={dateFromFilter}
                      onChange={(e) => setDateFromFilter(e.target.value)}
                      className="date-input"
                    />
                  </div>
                  <div className="date-input-group">
                    <label>To:</label>
                    <input
                      type="date"
                      value={dateToFilter}
                      onChange={(e) => setDateToFilter(e.target.value)}
                      className="date-input"
                    />
                  </div>
                </div>
                <div className="date-filter-actions">
                  <button 
                    className="clear-all-btn"
                    onClick={() => {
                      setDateFromFilter('');
                      setDateToFilter('');
                    }}
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </div>
        ),
        cell: (info) => {
          const dateValue = info.getValue();
          if (!dateValue) return 'Invalid Date';
          
          const date = new Date(dateValue);
          if (isNaN(date.getTime())) return 'Invalid Date';
          
          return date.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
          });
        },
        enableSorting: false,
        enableGlobalFilter: true,
      },
      {
        accessorKey: 'country',
        header: ({ table }) => (
          <div className="country-header-dropdown" ref={dropdownRef}>
            <button 
              className="country-header-button"
              onClick={handleCountryDropdownToggle}
            >
              <span>Country</span>
              <svg className="filter-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18l-7 7v6l-4 2v-8L3 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {showCountryDropdown && (
              <div className="country-multiselect-dropdown">
                <div className="multiselect-options">
                  {countries.map((country) => (
                    <label key={country.id} className="multiselect-option">
                      <input
                        type="checkbox"
                        checked={countryFilter.includes(country.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCountryFilter(prev => [...prev, country.name]);
                          } else {
                            setCountryFilter(prev => prev.filter(c => c !== country.name));
                          }
                        }}
                      />
                      <span className="checkmark"></span>
                      <span className="option-text">{country.name}</span>
                    </label>
                  ))}
                </div>
                <div className="multiselect-actions">
                  <button 
                    className="clear-all-btn"
                    onClick={() => setCountryFilter([])}
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </div>
        ),
        enableSorting: false,
        enableGlobalFilter: true,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <button
            className="edit-btn"
            onClick={() => handleEdit(row)}
            title="Edit"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M11.333 2.667a1.333 1.333 0 011.886 0l.447.447a1.333 1.333 0 010 1.886L6 12.667l-2.667.666L4 10.667L11.333 2.667z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ),
      },
    ],
    [countryFilter, showCountryDropdown, genderFilter, showGenderDropdown, dateFromFilter, dateToFilter, showDateFilter]
  );

  const filteredData = useMemo(() => {
    let filtered = data;
    
    if (countryFilter.length > 0) {
      filtered = filtered.filter(item => countryFilter.includes(item.country));
    }
    
    if (genderFilter.length > 0) {
      filtered = filtered.filter(item => {
        const itemGender = item.gender ? item.gender.charAt(0).toUpperCase() + item.gender.slice(1).toLowerCase() : '';
        return genderFilter.includes(itemGender);
      });
    }
    
    if (dateFromFilter || dateToFilter) {
      filtered = filtered.filter(item => {
        if (!item.requestDate) return false;
        
        const itemDate = new Date(item.requestDate);
        if (isNaN(itemDate.getTime())) return false;
        
        const fromDate = dateFromFilter ? new Date(dateFromFilter) : null;
        const toDate = dateToFilter ? new Date(dateToFilter) : null;
        
        if (fromDate && itemDate < fromDate) return false;
        if (toDate && itemDate > toDate) return false;
        
        return true;
      });
    }
    
    return filtered;
  }, [data, countryFilter, genderFilter, dateFromFilter, dateToFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'includesString',
    enableGlobalFilter: true,
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="data-table-container">
      <div className="table-wrapper">
        <div className="table-header">
          <h1 className="table-title">Inkle Assignment</h1>
          <div className="filter-container">
            <svg className="filter-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon>
            </svg>
            <input
              type="text"
              placeholder="Search all columns..."
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="filter-input"
            />
          </div>
        </div>
        <table className="data-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                    className={header.column.getCanSort() ? 'sortable' : ''}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {header.column.getIsSorted() && (
                      <span className="sort-indicator">
                        {header.column.getIsSorted() === 'desc' ? ' ↓' : ' ↑'}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && !loading && (
        <div className="no-data">
          <p>No data available</p>
        </div>
      )}

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRow(null);
        }}
        onSave={handleSave}
        data={selectedRow}
        countries={countries}
        onCountriesUpdate={handleCountriesUpdate}
      />
    </div>
  );
};

export default DataTable;