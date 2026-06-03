import { useState, useEffect } from 'react';
import { Users, ShoppingBag, Briefcase, Calendar, Film, Package, DollarSign, TrendingUp, Plus, Trash2, Edit, Power, PowerOff, X } from 'lucide-react';
import { adminApi, shoppingApi, advertisingApi, recruitmentApi, bookingApi } from '../services/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboard, setDashboard] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [ads, setAds] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [transports, setTransports] = useState([]);
  const [packages, setPackages] = useState([]);
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState([]);

  // Modal states
  const [editModal, setEditModal] = useState({ isOpen: false, type: null, data: null });
  const [addModal, setAddModal] = useState({ isOpen: false, type: null });
  const [customCategory, setCustomCategory] = useState('');
  const [customCategoryUrl, setCustomCategoryUrl] = useState('');
  const [customCategoryDescription, setCustomCategoryDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadDashboard();
    loadAllOrders();
    loadUsers();
    loadProducts();
    loadAds();
    loadJobs();
    loadTransports();
    loadPackages();
    loadMovies();
    loadCategories();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await adminApi.getDashboard();
      setDashboard(response.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const loadAllOrders = async () => {
    try {
      const response = await adminApi.getAllOrders();
      setAllOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await adminApi.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await shoppingApi.getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadAds = async () => {
    try {
      const response = await advertisingApi.getAds();
      setAds(response.data);
    } catch (error) {
      console.error('Error loading ads:', error);
    }
  };

  const loadJobs = async () => {
    try {
      const response = await recruitmentApi.getJobs();
      setJobs(response.data);
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
  };

  const loadTransports = async () => {
    try {
      const response = await bookingApi.getTransports();
      setTransports(response.data);
    } catch (error) {
      console.error('Error loading transports:', error);
    }
  };

  const loadPackages = async () => {
    try {
      const response = await bookingApi.getPackages();
      setPackages(response.data);
    } catch (error) {
      console.error('Error loading packages:', error);
    }
  };

  const loadMovies = async () => {
    try {
      const response = await bookingApi.getMovies();
      setMovies(response.data);
    } catch (error) {
      console.error('Error loading movies:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await shoppingApi.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await adminApi.deleteUser(userId);
        loadUsers();
        alert('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await shoppingApi.updateOrderStatus(orderId, { status });
      loadAllOrders();
      alert('Order status updated!');
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Product handlers
  const handleDeleteProduct = async (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await adminApi.deleteProduct(productId);
        loadProducts();
        alert('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleUpdateProductStatus = async (productId, status) => {
    try {
      await adminApi.updateProductStatus(productId, status);
      loadProducts();
      alert('Product status updated!');
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  const handleEditProduct = (product) => {
    setEditModal({ isOpen: true, type: 'product', data: product });
  };

  const handleSaveProduct = async (productData) => {
    try {
      // If it's a new category, create it first
      if (selectedCategory === 'other' && customCategory) {
        await shoppingApi.createCategory({
          name: customCategory,
          imageUrl: customCategoryUrl,
          description: customCategoryDescription
        });
        // Reload categories to get the new one
        await loadCategories();
      }

      if (editModal.data?.id) {
        await adminApi.updateProduct(editModal.data.id, productData);
        alert('Product updated successfully!');
      } else {
        await adminApi.createProduct(productData);
        alert('Product created successfully!');
      }
      setEditModal({ isOpen: false, type: null, data: null });
      setCustomCategory('');
      setCustomCategoryUrl('');
      setCustomCategoryDescription('');
      setSelectedCategory('');
      loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  // Ad handlers
  const handleDeleteAd = async (adId) => {
    if (confirm('Are you sure you want to delete this ad?')) {
      try {
        await adminApi.deleteAd(adId);
        loadAds();
        alert('Ad deleted successfully!');
      } catch (error) {
        console.error('Error deleting ad:', error);
      }
    }
  };

  const handleUpdateAdStatus = async (adId, status) => {
    try {
      await adminApi.updateAdStatus(adId, status);
      loadAds();
      alert('Ad status updated!');
    } catch (error) {
      console.error('Error updating ad status:', error);
    }
  };

  const handleEditAd = (ad) => {
    setEditModal({ isOpen: true, type: 'ad', data: ad });
  };

  const handleSaveAd = async (adData) => {
    try {
      if (editModal.data?.id) {
        await adminApi.updateAd(editModal.data.id, adData);
        alert('Ad updated successfully!');
      } else {
        await adminApi.createAd(adData);
        alert('Ad created successfully!');
      }
      setEditModal({ isOpen: false, type: null, data: null });
      loadAds();
    } catch (error) {
      console.error('Error saving ad:', error);
    }
  };

  // Job handlers
  const handleDeleteJob = async (jobId) => {
    if (confirm('Are you sure you want to delete this job?')) {
      try {
        await adminApi.deleteJob(jobId);
        loadJobs();
        alert('Job deleted successfully!');
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  const handleUpdateJobStatus = async (jobId, status) => {
    try {
      await adminApi.updateJobStatus(jobId, status);
      loadJobs();
      alert('Job status updated!');
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  };

  const handleEditJob = (job) => {
    setEditModal({ isOpen: true, type: 'job', data: job });
  };

  const handleSaveJob = async (jobData) => {
    try {
      if (editModal.data?.id) {
        await adminApi.updateJob(editModal.data.id, jobData);
        alert('Job updated successfully!');
      } else {
        await adminApi.createJob(jobData);
        alert('Job created successfully!');
      }
      setEditModal({ isOpen: false, type: null, data: null });
      loadJobs();
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  // Transport handlers
  const handleDeleteTransport = async (transportId) => {
    if (confirm('Are you sure you want to delete this transport?')) {
      try {
        await adminApi.deleteTransport(transportId);
        loadTransports();
        alert('Transport deleted successfully!');
      } catch (error) {
        console.error('Error deleting transport:', error);
      }
    }
  };

  const handleUpdateTransportStatus = async (transportId, status) => {
    try {
      await adminApi.updateTransportStatus(transportId, status);
      loadTransports();
      alert('Transport status updated!');
    } catch (error) {
      console.error('Error updating transport status:', error);
    }
  };

  const handleEditTransport = (transport) => {
    setEditModal({ isOpen: true, type: 'transport', data: transport });
  };

  const handleSaveTransport = async (transportData) => {
    try {
      if (editModal.data?.id) {
        await adminApi.updateTransport(editModal.data.id, transportData);
        alert('Transport updated successfully!');
      } else {
        await adminApi.createTransport(transportData);
        alert('Transport created successfully!');
      }
      setEditModal({ isOpen: false, type: null, data: null });
      loadTransports();
    } catch (error) {
      console.error('Error saving transport:', error);
    }
  };

  // Package handlers
  const handleDeletePackage = async (packageId) => {
    if (confirm('Are you sure you want to delete this package?')) {
      try {
        await adminApi.deletePackage(packageId);
        loadPackages();
        alert('Package deleted successfully!');
      } catch (error) {
        console.error('Error deleting package:', error);
      }
    }
  };

  const handleUpdatePackageStatus = async (packageId, status) => {
    try {
      await adminApi.updatePackageStatus(packageId, status);
      loadPackages();
      alert('Package status updated!');
    } catch (error) {
      console.error('Error updating package status:', error);
    }
  };

  const handleEditPackage = (pkg) => {
    setEditModal({ isOpen: true, type: 'package', data: pkg });
  };

  const handleSavePackage = async (packageData) => {
    try {
      if (editModal.data?.id) {
        await adminApi.updatePackage(editModal.data.id, packageData);
        alert('Package updated successfully!');
      } else {
        await adminApi.createPackage(packageData);
        alert('Package created successfully!');
      }
      setEditModal({ isOpen: false, type: null, data: null });
      loadPackages();
    } catch (error) {
      console.error('Error saving package:', error);
    }
  };

  // Movie handlers
  const handleDeleteMovie = async (movieId) => {
    if (confirm('Are you sure you want to delete this movie?')) {
      try {
        await adminApi.deleteMovie(movieId);
        loadMovies();
        alert('Movie deleted successfully!');
      } catch (error) {
        console.error('Error deleting movie:', error);
      }
    }
  };

  const handleUpdateMovieStatus = async (movieId, status) => {
    try {
      await adminApi.updateMovieStatus(movieId, status);
      loadMovies();
      alert('Movie status updated!');
    } catch (error) {
      console.error('Error updating movie status:', error);
    }
  };

  const handleEditMovie = (movie) => {
    setEditModal({ isOpen: true, type: 'movie', data: movie });
  };

  const handleSaveMovie = async (movieData) => {
    try {
      if (editModal.data?.id) {
        await adminApi.updateMovie(editModal.data.id, movieData);
        alert('Movie updated successfully!');
      } else {
        await adminApi.createMovie(movieData);
        alert('Movie created successfully!');
      }
      setEditModal({ isOpen: false, type: null, data: null });
      loadMovies();
    } catch (error) {
      console.error('Error saving movie:', error);
    }
  };

  // User status handler
  const handleUpdateUserStatus = async (userId, isActive) => {
    try {
      await adminApi.updateUserStatus(userId, isActive);
      loadUsers();
      alert('User status updated!');
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleEditUser = (user) => {
    setEditModal({ isOpen: true, type: 'user', data: user });
  };

  const handleSaveUser = async (userData) => {
    try {
      if (editModal.data?.id) {
        await adminApi.updateUser(editModal.data.id, userData);
        alert('User updated successfully!');
      }
      setEditModal({ isOpen: false, type: null, data: null });
      loadUsers();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b overflow-x-auto">
          {['overview', 'products', 'ads', 'jobs', 'transport', 'packages', 'movies', 'orders', 'users'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-800">{dashboard.totalUsers}</p>
                </div>
                <Users size={32} className="text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-3xl font-bold text-gray-800">{dashboard.totalProducts}</p>
                </div>
                <ShoppingBag size={32} className="text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-800">{dashboard.totalOrders}</p>
                </div>
                <TrendingUp size={32} className="text-purple-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-800">${dashboard.totalRevenue.toFixed(2)}</p>
                </div>
                <DollarSign size={32} className="text-yellow-600" />
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Products ({products.length})</h2>
              <button
                onClick={() => setEditModal({ isOpen: true, type: 'product', data: null })}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus size={16} />
                Add Product
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Seller</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Stock</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800">{product.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{product.categoryName}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{product.seller}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">${product.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{product.stock}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleUpdateProductStatus(product.id, product.status === 'Active' ? 'Inactive' : 'Active')}
                          className={product.status === 'Active' ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'}
                          title={product.status === 'Active' ? 'Deactivate' : 'Activate'}
                        >
                          {product.status === 'Active' ? <PowerOff size={16} /> : <Power size={16} />}
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Ads Tab */}
        {activeTab === 'ads' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Advertisements ({ads.length})</h2>
              <button
                onClick={() => setEditModal({ isOpen: true, type: 'ad', data: null })}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus size={16} />
                Add Ad
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Title</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Seller</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Location</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ads.map((ad) => (
                    <tr key={ad.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800">{ad.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{ad.categoryName}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{ad.sellerName}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">${ad.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{ad.location}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ad.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {ad.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => handleEditAd(ad)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleUpdateAdStatus(ad.id, ad.status === 'Active' ? 'Inactive' : 'Active')}
                          className={ad.status === 'Active' ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'}
                          title={ad.status === 'Active' ? 'Deactivate' : 'Activate'}
                        >
                          {ad.status === 'Active' ? <PowerOff size={16} /> : <Power size={16} />}
                        </button>
                        <button
                          onClick={() => handleDeleteAd(ad.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Jobs ({jobs.length})</h2>
              <button
                onClick={() => setEditModal({ isOpen: true, type: 'job', data: null })}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus size={16} />
                Add Job
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Title</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Company</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Location</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800">{job.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{job.company}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{job.location}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          job.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => handleEditJob(job)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleUpdateJobStatus(job.id, job.status === 'Active' ? 'Inactive' : 'Active')}
                          className={job.status === 'Active' ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'}
                          title={job.status === 'Active' ? 'Deactivate' : 'Activate'}
                        >
                          {job.status === 'Active' ? <PowerOff size={16} /> : <Power size={16} />}
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Transport Tab */}
        {activeTab === 'transport' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Transports ({transports.length})</h2>
              <button
                onClick={() => setEditModal({ isOpen: true, type: 'transport', data: null })}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus size={16} />
                Add Transport
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Route</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transports.map((transport) => (
                    <tr key={transport.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800">{transport.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{transport.type}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{transport.source} → {transport.destination}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transport.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {transport.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => handleEditTransport(transport)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleUpdateTransportStatus(transport.id, transport.status === 'Active' ? 'Inactive' : 'Active')}
                          className={transport.status === 'Active' ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'}
                          title={transport.status === 'Active' ? 'Deactivate' : 'Activate'}
                        >
                          {transport.status === 'Active' ? <PowerOff size={16} /> : <Power size={16} />}
                        </button>
                        <button
                          onClick={() => handleDeleteTransport(transport.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Packages Tab */}
        {activeTab === 'packages' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Travel Packages ({packages.length})</h2>
              <button
                onClick={() => setEditModal({ isOpen: true, type: 'package', data: null })}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus size={16} />
                Add Package
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Duration</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800">{pkg.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{pkg.duration}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">${pkg.price.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          pkg.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {pkg.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => handleEditPackage(pkg)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleUpdatePackageStatus(pkg.id, pkg.status === 'Active' ? 'Inactive' : 'Active')}
                          className={pkg.status === 'Active' ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'}
                          title={pkg.status === 'Active' ? 'Deactivate' : 'Activate'}
                        >
                          {pkg.status === 'Active' ? <PowerOff size={16} /> : <Power size={16} />}
                        </button>
                        <button
                          onClick={() => handleDeletePackage(pkg.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Movies Tab */}
        {activeTab === 'movies' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Movies ({movies.length})</h2>
              <button
                onClick={() => setEditModal({ isOpen: true, type: 'movie', data: null })}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus size={16} />
                Add Movie
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Title</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Genre</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Rating</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {movies.map((movie) => (
                    <tr key={movie.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800">{movie.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{movie.genre}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{movie.rating}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          movie.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {movie.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => handleEditMovie(movie)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleUpdateMovieStatus(movie.id, movie.status === 'Active' ? 'Inactive' : 'Active')}
                          className={movie.status === 'Active' ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'}
                          title={movie.status === 'Active' ? 'Deactivate' : 'Activate'}
                        >
                          {movie.status === 'Active' ? <PowerOff size={16} /> : <Power size={16} />}
                        </button>
                        <button
                          onClick={() => handleDeleteMovie(movie.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">All Orders ({allOrders.length})</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Order ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">User</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800">{order.id.substring(0, 8)}...</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{order.userName}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">${order.total.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Shipped' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Users ({users.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800">{user.fullName}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleUpdateUserStatus(user.id, !user.isActive)}
                          className={user.isActive ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'}
                          title={user.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {user.isActive ? <PowerOff size={16} /> : <Power size={16} />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {editModal.data ? `Edit ${editModal.type.charAt(0).toUpperCase() + editModal.type.slice(1)}` : `Add ${editModal.type.charAt(0).toUpperCase() + editModal.type.slice(1)}`}
                </h3>
                <button
                  onClick={() => setEditModal({ isOpen: false, type: null, data: null })}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              {editModal.type === 'product' && (
                <form onSubmit={(e) => { 
                  e.preventDefault(); 
                  const categoryName = selectedCategory === 'other' 
                    ? customCategory 
                    : selectedCategory;
                  handleSaveProduct({ 
                    name: e.target.name.value, 
                    description: e.target.description.value, 
                    price: parseFloat(e.target.price.value), 
                    stock: parseInt(e.target.stock.value), 
                    seller: e.target.seller.value, 
                    imageUrl: e.target.imageUrl.value, 
                    status: e.target.status.value, 
                    categoryName: categoryName 
                  });
                  setCustomCategory('');
                  setSelectedCategory('');
                }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input name="name" defaultValue={editModal.data?.name} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea name="description" defaultValue={editModal.data?.description} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows="3" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                        <input name="price" type="number" step="0.01" defaultValue={editModal.data?.price} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                        <input name="stock" type="number" defaultValue={editModal.data?.stock} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Seller</label>
                      <input name="seller" defaultValue={editModal.data?.seller} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                      <input name="imageUrl" defaultValue={editModal.data?.imageUrl} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select 
                        name="categorySelect" 
                        value={selectedCategory || editModal.data?.categoryName || ''} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        onChange={(e) => {
                          setSelectedCategory(e.target.value);
                          if (e.target.value === 'other') {
                            setCustomCategory('');
                          }
                        }}
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.name}>{category.name}</option>
                        ))}
                        <option value="other">Other (Add New)</option>
                      </select>
                    </div>
                    {selectedCategory === 'other' && (
                      <div id="customCategoryField" className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">New Category Name</label>
                          <input 
                            name="customCategory" 
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category Image URL</label>
                          <input 
                            name="customCategoryUrl" 
                            value={customCategoryUrl}
                            onChange={(e) => setCustomCategoryUrl(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category Description</label>
                          <textarea 
                            name="customCategoryDescription" 
                            value={customCategoryDescription}
                            onChange={(e) => setCustomCategoryDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
                            rows="2"
                          />
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select name="status" defaultValue={editModal.data?.status || 'Active'} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                      Save
                    </button>
                  </div>
                </form>
              )}

              {editModal.type === 'ad' && (
                <form onSubmit={(e) => { e.preventDefault(); handleSaveAd({ title: e.target.title.value, description: e.target.description.value, price: parseFloat(e.target.price.value), location: e.target.location.value, condition: e.target.condition.value, sellerName: e.target.sellerName.value, imageUrl: e.target.imageUrl.value, status: e.target.status.value, categoryName: e.target.categoryName.value }); }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input name="title" defaultValue={editModal.data?.title} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea name="description" defaultValue={editModal.data?.description} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows="3" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                        <input name="price" type="number" step="0.01" defaultValue={editModal.data?.price} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input name="location" defaultValue={editModal.data?.location} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                      <input name="condition" defaultValue={editModal.data?.condition} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Seller Name</label>
                      <input name="sellerName" defaultValue={editModal.data?.sellerName} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                      <input name="imageUrl" defaultValue={editModal.data?.imageUrl} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                      <input name="categoryName" defaultValue={editModal.data?.categoryName} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select name="status" defaultValue={editModal.data?.status || 'Active'} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                      Save
                    </button>
                  </div>
                </form>
              )}

              {editModal.type === 'job' && (
                <form onSubmit={(e) => { e.preventDefault(); handleSaveJob({ title: e.target.title.value, company: e.target.company.value, location: e.target.location.value, salary: e.target.salary.value, type: e.target.type.value, description: e.target.description.value, skills: e.target.skills.value.split(',').map(s => s.trim()), status: e.target.status.value }); }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input name="title" defaultValue={editModal.data?.title} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                      <input name="company" defaultValue={editModal.data?.company} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input name="location" defaultValue={editModal.data?.location} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                        <input name="salary" defaultValue={editModal.data?.salary} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <input name="type" defaultValue={editModal.data?.type} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea name="description" defaultValue={editModal.data?.description} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows="3" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                      <input name="skills" defaultValue={editModal.data?.skills?.join(', ')} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select name="status" defaultValue={editModal.data?.status || 'Active'} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                      Save
                    </button>
                  </div>
                </form>
              )}

              {editModal.type === 'transport' && (
                <form onSubmit={(e) => { e.preventDefault(); handleSaveTransport({ type: e.target.type.value, name: e.target.name.value, source: e.target.source.value, destination: e.target.destination.value, price: parseFloat(e.target.price.value), duration: e.target.duration.value, operator: e.target.operator.value, status: e.target.status.value }); }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <input name="type" defaultValue={editModal.data?.type} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input name="name" defaultValue={editModal.data?.name} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                        <input name="source" defaultValue={editModal.data?.source} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                        <input name="destination" defaultValue={editModal.data?.destination} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                        <input name="price" type="number" step="0.01" defaultValue={editModal.data?.price} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <input name="duration" defaultValue={editModal.data?.duration} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Operator</label>
                      <input name="operator" defaultValue={editModal.data?.operator} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select name="status" defaultValue={editModal.data?.status || 'Active'} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                      Save
                    </button>
                  </div>
                </form>
              )}

              {editModal.type === 'package' && (
                <form onSubmit={(e) => { e.preventDefault(); handleSavePackage({ name: e.target.name.value, description: e.target.description.value, duration: e.target.duration.value, price: parseFloat(e.target.price.value), destinations: e.target.destinations.value.split(',').map(d => d.trim()), imageUrl: e.target.imageUrl.value, status: e.target.status.value }); }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input name="name" defaultValue={editModal.data?.name} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea name="description" defaultValue={editModal.data?.description} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows="3" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <input name="duration" defaultValue={editModal.data?.duration} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                        <input name="price" type="number" step="0.01" defaultValue={editModal.data?.price} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Destinations (comma separated)</label>
                      <input name="destinations" defaultValue={editModal.data?.destinations?.join(', ')} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                      <input name="imageUrl" defaultValue={editModal.data?.imageUrl} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select name="status" defaultValue={editModal.data?.status || 'Active'} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                      Save
                    </button>
                  </div>
                </form>
              )}

              {editModal.type === 'movie' && (
                <form onSubmit={(e) => { e.preventDefault(); handleSaveMovie({ title: e.target.title.value, genre: e.target.genre.value, language: e.target.language.value, duration: parseInt(e.target.duration.value), rating: parseFloat(e.target.rating.value), imageUrl: e.target.imageUrl.value, status: e.target.status.value }); }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input name="title" defaultValue={editModal.data?.title} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                        <input name="genre" defaultValue={editModal.data?.genre} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                        <input name="language" defaultValue={editModal.data?.language} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                        <input name="duration" type="number" defaultValue={editModal.data?.duration} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                        <input name="rating" type="number" step="0.1" defaultValue={editModal.data?.rating} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                      <input name="imageUrl" defaultValue={editModal.data?.imageUrl} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select name="status" defaultValue={editModal.data?.status || 'Active'} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                      Save
                    </button>
                  </div>
                </form>
              )}

              {editModal.type === 'user' && (
                <form onSubmit={(e) => { e.preventDefault(); handleSaveUser({ username: e.target.username.value, fullName: e.target.fullName.value, email: e.target.email.value, phone: e.target.phone.value, role: e.target.role.value, isActive: e.target.isActive.value === 'true' }); }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                      <input name="username" defaultValue={editModal.data?.username} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input name="fullName" defaultValue={editModal.data?.fullName} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input name="email" type="email" defaultValue={editModal.data?.email} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input name="phone" defaultValue={editModal.data?.phone} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <select name="role" defaultValue={editModal.data?.role || 'User'} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select name="isActive" defaultValue={editModal.data?.isActive ? 'true' : 'false'} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                      Save
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
