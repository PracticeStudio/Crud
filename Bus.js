import { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db } from './firebase';
import './App.css';

function App() {
  
  const [buses, setBuses] = useState([]);
  const [formData, setFormData] = useState({
    busNumber: '',
    route: '',
    capacity: '',
    driver: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  
  const fetchBuses = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'buses'));
      const busesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBuses(busesData);
    } catch (error) {
      console.error("Error fetching buses: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  
  useEffect(() => {
    fetchBuses();
  }, []);

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingId) {
        
        await updateDoc(doc(db, 'buses', editingId), formData);
      } else {
        
        await addDoc(collection(db, 'buses'), formData);
      }

     
      setFormData({ busNumber: '', route: '', capacity: '', driver: '' });
      setEditingId(null);
      await fetchBuses();
    } catch (error) {
      console.error("Error saving bus: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  
  const handleEdit = (bus) => {
    setFormData({
      busNumber: bus.busNumber,
      route: bus.route,
      capacity: bus.capacity,
      driver: bus.driver
    });
    setEditingId(bus.id);
  };

 
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      setIsLoading(true);
      try {
        await deleteDoc(doc(db, 'buses', id));
        await fetchBuses();
      } catch (error) {
        console.error("Error deleting bus: ", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="container">
      <h1>Bus Management System</h1>
      
      {}
      <div className="form-container">
        <h2>{editingId ? 'Edit Bus' : 'Add New Bus'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Bus Number</label>
            <input
              type="text"
              name="busNumber"
              value={formData.busNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Route</label>
            <input
              type="text"
              name="route"
              value={formData.route}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Capacity</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Driver</label>
            <input
              type="text"
              name="driver"
              value={formData.driver}
              onChange={handleInputChange}
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (editingId ? 'Update Bus' : 'Add Bus')}
          </button>
          {editingId && (
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => {
                setFormData({ busNumber: '', route: '', capacity: '', driver: '' });
                setEditingId(null);
              }}
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {}
      <div className="list-container">
        <h2>Bus List</h2>
        {isLoading && buses.length === 0 ? (
          <p>Loading buses...</p>
        ) : buses.length === 0 ? (
          <p>No buses found. Add your first bus!</p>
        ) : (
          <table className="bus-table">
            <thead>
              <tr>
                <th>Bus Number</th>
                <th>Route</th>
                <th>Capacity</th>
                <th>Driver</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {buses.map(bus => (
                <tr key={bus.id}>
                  <td>{bus.busNumber}</td>
                  <td>{bus.route}</td>
                  <td>{bus.capacity}</td>
                  <td>{bus.driver}</td>
                  <td>
                    <button 
                      onClick={() => handleEdit(bus)}
                      className="btn btn-sm btn-warning"
                      disabled={isLoading}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(bus.id)}
                      className="btn btn-sm btn-danger"
                      disabled={isLoading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
