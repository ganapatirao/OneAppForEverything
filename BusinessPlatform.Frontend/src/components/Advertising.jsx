import { useState, useEffect } from 'react';
import { Plus, Filter, MapPin, MessageCircle, Phone, Search, Eye, Calendar, X, Star, ChevronLeft, ChevronRight, Briefcase, Car, Home, Smartphone, Heart, User, Shield, Zap, Tag } from 'lucide-react';
import { advertisingApi } from '../services/api';

const comprehensiveCategories = [
  { id: '1', name: 'Jobs', emoji: '💼', subcategories: ['IT/Software', 'Sales/Marketing', 'Accounting/Finance', 'Education/Teaching', 'Healthcare', 'Engineering', 'Hospitality', 'Customer Service', 'HR', 'Legal', 'Manufacturing', 'Other'] },
  { id: '2', name: 'Vehicles', emoji: '🚗', subcategories: ['Cars', 'Motorcycles', 'Scooters', 'Bicycles', 'Commercial Vehicles', 'Spare Parts', 'Boats', 'Other Vehicles'] },
  { id: '3', name: 'Real Estate', emoji: '🏠', subcategories: ['Houses', 'Apartments', 'Land/Plots', 'Commercial Property', 'PG/Hostels', 'Office Space', 'Shops', 'Other Properties'] },
  { id: '4', name: 'Mobiles', emoji: '📱', subcategories: ['Smartphones', 'Tablets', 'Accessories', 'Wearables', 'Repairs', 'Other Mobiles'] },
  { id: '5', name: 'Electronics', emoji: '🔌', subcategories: ['Laptops', 'Computers', 'TVs', 'Cameras', 'Gaming', 'Audio', 'Home Appliances', 'Other Electronics'] },
  { id: '6', name: 'Fashion', emoji: '👗', subcategories: ['Men', 'Women', 'Kids', 'Footwear', 'Jewelry', 'Watches', 'Bags', 'Other Fashion'] },
  { id: '7', name: 'Home & Living', emoji: '🏡', subcategories: ['Furniture', 'Home Decor', 'Kitchen', 'Garden', 'Pets', 'Other Home'] },
  { id: '8', name: 'Services', emoji: '🔧', subcategories: ['Education/Tutoring', 'Health & Fitness', 'Beauty/Wellness', 'Home Services', 'Event Services', 'Professional Services', 'Other Services'] },
  { id: '9', name: 'Pets', emoji: '🐕', subcategories: ['Dogs', 'Cats', 'Birds', 'Fish', 'Other Pets', 'Pet Accessories', 'Pet Services'] },
  { id: '10', name: 'Matrimonial', emoji: '💍', subcategories: ['Bride', 'Groom', 'Matrimonial Services'] },
  { id: '11', name: 'Community', emoji: '👥', subcategories: ['Events', 'Activities', 'Lost & Found', 'Classes', 'Volunteers', 'Other Community'] },
  { id: '12', name: 'Business', emoji: '💼', subcategories: ['Business for Sale', 'Franchise', 'Industrial Machinery', 'Office Equipment', 'Other Business'] }
];

export default function Advertising() {
  const [ads, setAds] = useState([]);
  const [categories, setCategories] = useState(comprehensiveCategories);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [showPostAd, setShowPostAd] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [showAdDetail, setShowAdDetail] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatPhone, setChatPhone] = useState('');
  const [chatEmail, setChatEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [conditionFilter, setConditionFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [showUrgentOnly, setShowUrgentOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [newAd, setNewAd] = useState({
    title: '',
    description: '',
    price: '',
    categoryName: '',
    subcategory: '',
    location: '',
    city: '',
    condition: '',
    imageUrl: '',
    imageUrls: '',
    phone: '',
    email: '',
    negotiable: false,
    isFeatured: false,
    isUrgent: false
  });

  useEffect(() => {
    loadAds();
    loadCategories();
  }, []);

  const loadAds = async () => {
    try {
      const response = await advertisingApi.getAds();
      setAds(response.data.filter(a => a.status === 'Active').map(ad => ({
        ...ad,
        views: ad.views || Math.floor(Math.random() * 500) + 10,
        postedDate: ad.postedDate || new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      })));
    } catch (error) {
      console.error('Error loading ads:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await advertisingApi.getAdCategories();
      if (response.data && response.data.length > 0) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handlePostAd = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      const userName = localStorage.getItem('userName');
      const userEmail = localStorage.getItem('userEmail');
      const adData = {
        ...newAd,
        price: parseFloat(newAd.price),
        sellerId: userId,
        sellerName: userName || 'Anonymous',
        sellerEmail: userEmail || '',
        sellerPhone: newAd.phone,
        imageUrls: newAd.imageUrls ? newAd.imageUrls.split(',').map(url => url.trim()) : [newAd.imageUrl],
        views: 0,
        postedDate: new Date().toISOString()
      };
      await advertisingApi.createAd(adData);
      loadAds();
      setNewAd({
        title: '',
        description: '',
        price: '',
        categoryName: '',
        subcategory: '',
        location: '',
        city: '',
        condition: '',
        imageUrl: '',
        imageUrls: '',
        phone: '',
        email: '',
        negotiable: false,
        isFeatured: false,
        isUrgent: false
      });
      setShowPostAd(false);
      alert('Ad posted successfully!');
    } catch (error) {
      console.error('Error posting ad:', error);
      alert('Error posting ad. Please try again.');
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory('All');
  };

  const handleSubcategoryChange = (subcategory) => {
    setSelectedSubcategory(subcategory);
  };

  const handleViewAd = (ad) => {
    setSelectedAd(ad);
    setCurrentImageIndex(0);
    setShowAdDetail(true);
  };

  const handleNextImage = () => {
    if (selectedAd && selectedAd.imageUrls) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedAd.imageUrls.length);
    }
  };

  const handlePrevImage = () => {
    if (selectedAd && selectedAd.imageUrls) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedAd.imageUrls.length) % selectedAd.imageUrls.length);
    }
  };

  const maskPhoneNumber = (phone, status) => {
    if (status === 'Hidden' && phone) {
      const digits = phone.replace(/\D/g, '');
      if (digits.length >= 4) {
        const lastFour = digits.slice(-4);
        const maskedCount = digits.length - 4;
        return 'x'.repeat(maskedCount) + lastFour;
      }
      return phone;
    }
    return phone;
  };

  const handleRespond = (ad) => {
    setSelectedAd(ad);
    setShowAdDetail(false);
    setShowChatModal(true);
    setChatPhone('');
    setChatEmail('');
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    try {
      const userId = localStorage.getItem('userId');
      const userName = localStorage.getItem('userName');

      if (!userId) {
        alert('Please login to send a message');
        return;
      }

      await advertisingApi.createAdResponse({
        adId: selectedAd.id,
        responderId: userId,
        responderName: userName || 'Anonymous',
        responderEmail: chatEmail || '',
        responderPhone: chatPhone || '',
        message: chatMessage,
        isRead: false,
        status: 'Pending'
      });

      alert('Message sent to seller!');
      setChatMessage('');
      setChatPhone('');
      setChatEmail('');
      setShowChatModal(false);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message. Please try again.');
    }
  };

  const handleCallSeller = (phone) => {
    if (phone) {
      window.open(`tel:${phone}`, '_self');
    } else {
      alert('Seller phone number not available');
    }
  };

  const filteredAds = ads.filter(ad => {
    const matchCategory = selectedCategory === 'All' || ad.categoryName === selectedCategory;
    const matchSubcategory = selectedSubcategory === 'All' || ad.subcategory === selectedSubcategory;
    const matchSearch = ad.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        ad.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLocation = !locationFilter || ad.location?.toLowerCase().includes(locationFilter.toLowerCase());
    const matchCity = !cityFilter || ad.city?.toLowerCase().includes(cityFilter.toLowerCase());
    const matchPrice = (!priceRange.min || ad.price >= parseFloat(priceRange.min)) &&
                       (!priceRange.max || ad.price <= parseFloat(priceRange.max));
    const matchCondition = conditionFilter === 'All' || ad.condition === conditionFilter;
    const matchFeatured = !showFeaturedOnly || ad.isFeatured;
    const matchUrgent = !showUrgentOnly || ad.isUrgent;
    return matchCategory && matchSubcategory && matchSearch && matchLocation && matchCity && matchPrice && matchCondition && matchFeatured && matchUrgent;
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.postedDate) - new Date(a.postedDate);
    if (sortBy === 'oldest') return new Date(a.postedDate) - new Date(b.postedDate);
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'popular') return b.views - a.views;
    return 0;
  });

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-IN');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">India Classifieds</h1>
            <p className="text-gray-600 mt-1">Buy & sell everything from jobs to real estate in your local area</p>
          </div>
          <button
            onClick={() => setShowPostAd(true)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all flex items-center shadow-lg"
          >
            <Plus size={20} className="mr-2" />
            Post Free Ad
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search for anything..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-md"
              >
                <Filter size={20} />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
          </div>
          {showFilters && (
            <div className="border-t bg-gray-50 p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Location"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">All Cities</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                    <option value="Kolkata">Kolkata</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min Price (₹)"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max Price (₹)"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <select
                  value={conditionFilter}
                  onChange={(e) => setConditionFilter(e.target.value)}
                  className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="All">All Conditions</option>
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
                <label className="flex items-center cursor-pointer bg-white px-4 py-3 border border-gray-300 rounded-lg">
                  <input
                    type="checkbox"
                    checked={showFeaturedOnly}
                    onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                    className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured Only</span>
                </label>
                <label className="flex items-center cursor-pointer bg-white px-4 py-3 border border-gray-300 rounded-lg">
                  <input
                    type="checkbox"
                    checked={showUrgentOnly}
                    onChange={(e) => setShowUrgentOnly(e.target.checked)}
                    className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Urgent Only</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 overflow-x-auto pb-2">
            <button
              onClick={() => handleCategoryChange('All')}
              className={`px-5 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                selectedCategory === 'All'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.name)}
                className={`px-5 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category.name
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category.emoji} {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Subcategory Filter */}
        {selectedCategory !== 'All' && (
          <div className="mb-6">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              <button
                onClick={() => handleSubcategoryChange('All')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  selectedSubcategory === 'All'
                    ? 'bg-orange-100 text-orange-700 border border-orange-300'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                All Subcategories
              </button>
              {categories.find(c => c.name === selectedCategory)?.subcategories?.map((sub) => (
                <button
                  key={sub}
                  onClick={() => handleSubcategoryChange(sub)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    selectedSubcategory === sub
                      ? 'bg-orange-100 text-orange-700 border border-orange-300'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 flex justify-between items-center">
          <div className="text-gray-600">
            <span className="font-semibold">{filteredAds.length}</span> ads found
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                showFeaturedOnly ? 'bg-yellow-500 text-white' : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              <Star size={14} className="inline mr-1" /> Featured
            </button>
            <button
              onClick={() => setShowUrgentOnly(!showUrgentOnly)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                showUrgentOnly ? 'bg-red-500 text-white' : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              <Zap size={14} className="inline mr-1" /> Urgent
            </button>
          </div>
        </div>

        {/* Ads Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAds.map((ad) => {
            const adImages = ad.imageUrls && ad.imageUrls.length > 0 ? ad.imageUrls : [ad.imageUrl];
            return (
              <div
                key={ad.id}
                onClick={() => handleViewAd(ad)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden group border border-gray-100"
              >
                <div className="relative">
                  <img
                    src={adImages[0]}
                    alt={ad.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {adImages.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {adImages.length} photos
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-semibold shadow-sm">
                    {ad.condition}
                  </div>
                  {ad.isFeatured && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center shadow-sm">
                      <Star size={10} className="mr-1 fill-current" /> Featured
                    </div>
                  )}
                  {ad.isUrgent && !ad.isFeatured && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center shadow-sm">
                      <Zap size={10} className="mr-1" /> Urgent
                    </div>
                  )}
                  {ad.negotiable && (
                    <div className="absolute bottom-2 left-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-sm">
                      Negotiable
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">{ad.title}</h3>
                  <div className="flex items-center mb-2 text-sm text-gray-500">
                    <MapPin size={14} className="mr-1" />
                    <span className="truncate">{ad.location}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xl font-bold text-gray-900">{formatPrice(ad.price)}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Eye size={12} className="mr-1" />
                      {ad.views}
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <Calendar size={12} className="mr-1" />
                    {formatDate(ad.postedDate)}
                  </div>
                  <span className="text-orange-600 font-medium text-sm">View Details →</span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAds.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No ads found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Post Ad Modal */}
        {showPostAd && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Post Your Ad</h2>
                <button onClick={() => setShowPostAd(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handlePostAd} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ad Title *</label>
                  <input
                    type="text"
                    value={newAd.title}
                    onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="What are you selling?"
                    required
                    maxLength="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={newAd.description}
                    onChange={(e) => setNewAd({ ...newAd, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows="4"
                    placeholder="Describe your item in detail..."
                    required
                    maxLength="2000"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                    <input
                      type="number"
                      step="1"
                      value={newAd.price}
                      onChange={(e) => setNewAd({ ...newAd, price: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter price"
                      required
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      value={newAd.categoryName}
                      onChange={(e) => setNewAd({ ...newAd, categoryName: e.target.value, subcategory: '' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>{category.emoji} {category.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {newAd.categoryName && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                    <select
                      value={newAd.subcategory}
                      onChange={(e) => setNewAd({ ...newAd, subcategory: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select Subcategory</option>
                      {categories.find(c => c.name === newAd.categoryName)?.subcategories?.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                    <input
                      type="text"
                      value={newAd.location}
                      onChange={(e) => setNewAd({ ...newAd, location: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Area, Street"
                      required
                      maxLength="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <select
                      value={newAd.city}
                      onChange={(e) => setNewAd({ ...newAd, city: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select City</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Pune">Pune</option>
                      <option value="Kolkata">Kolkata</option>
                      <option value="Ahmedabad">Ahmedabad</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
                  <select
                    value={newAd.condition}
                    onChange={(e) => setNewAd({ ...newAd, condition: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Condition</option>
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={newAd.phone}
                      onChange={(e) => setNewAd({ ...newAd, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="+91 XXXXX XXXXX"
                      pattern="[0-9+\-\s]+"
                      maxLength="15"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={newAd.email}
                      onChange={(e) => setNewAd({ ...newAd, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="your@email.com"
                      maxLength="100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Image URL *</label>
                  <input
                    type="url"
                    value={newAd.imageUrl}
                    onChange={(e) => setNewAd({ ...newAd, imageUrl: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                    required
                    pattern="https?://.+"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Image URLs (comma separated)</label>
                  <textarea
                    value={newAd.imageUrls}
                    onChange={(e) => setNewAd({ ...newAd, imageUrls: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows="2"
                    placeholder="https://example.com/image2.jpg, https://example.com/image3.jpg"
                    maxLength="1000"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="negotiable"
                      checked={newAd.negotiable}
                      onChange={(e) => setNewAd({ ...newAd, negotiable: e.target.checked })}
                      className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Price is negotiable</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={newAd.isFeatured}
                      onChange={(e) => setNewAd({ ...newAd, isFeatured: e.target.checked })}
                      className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured Ad (₹99)</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="urgent"
                      checked={newAd.isUrgent}
                      onChange={(e) => setNewAd({ ...newAd, isUrgent: e.target.checked })}
                      className="w-5 h-5 text-red-500 rounded focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Urgent Sale (₹49)</span>
                  </label>
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all"
                  >
                    Post Ad Now
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPostAd(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Ad Detail Modal */}
        {showAdDetail && selectedAd && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Ad Details</h2>
                <button onClick={() => setShowAdDetail(false)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-all">
                  <X size={24} />
                </button>
              </div>
              <div className="p-6">
                {/* Image Gallery with Navigation */}
                <div className="relative mb-6 rounded-xl overflow-hidden">
                  <img
                    src={selectedAd.imageUrls && selectedAd.imageUrls.length > 0 ? selectedAd.imageUrls[currentImageIndex] : selectedAd.imageUrl}
                    alt={selectedAd.title}
                    className="w-full h-80 object-cover"
                  />
                  {selectedAd.imageUrls && selectedAd.imageUrls.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10"
                      >
                        <ChevronRight size={20} />
                      </button>
                      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium z-10">
                        {currentImageIndex + 1} / {selectedAd.imageUrls.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Ad Info */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    {selectedAd.isFeatured && (
                      <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">Featured</span>
                    )}
                    {selectedAd.isUrgent && (
                      <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">Urgent</span>
                    )}
                    {selectedAd.negotiable && (
                      <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">Negotiable</span>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">{selectedAd.title}</h1>
                  <p className="text-3xl font-bold text-orange-600 mb-4">{formatPrice(selectedAd.price)}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center"><MapPin size={14} className="mr-1" /> {selectedAd.location}</span>
                    <span className="flex items-center"><Calendar size={14} className="mr-1" /> {formatDate(selectedAd.postedDate)}</span>
                    <span className="flex items-center"><Eye size={14} className="mr-1" /> {selectedAd.views}</span>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                    <p className="text-gray-600 whitespace-pre-wrap text-sm leading-relaxed">{selectedAd.description}</p>
                  </div>
                </div>

                {/* Seller Info & Actions */}
                <div className="border-t border-gray-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-gradient-to-br from-orange-100 to-orange-200 w-12 h-12 rounded-full flex items-center justify-center mr-3">
                        <User size={20} className="text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{selectedAd.sellerName || 'Anonymous'}</p>
                        <p className="text-xs text-gray-500">{selectedAd.categoryName}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleRespond(selectedAd)}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all flex items-center justify-center shadow-md"
                    >
                      <MessageCircle size={18} className="mr-2" />
                      Message
                    </button>
                    {selectedAd.sellerPhone && (
                      <button
                        onClick={() => handleCallSeller(selectedAd.sellerPhone)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center shadow-md"
                      >
                        <Phone size={18} className="mr-2" />
                        {maskPhoneNumber(selectedAd.sellerPhone, selectedAd.phoneDisplayStatus)}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Modal */}
        {showChatModal && selectedAd && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full mx-4 shadow-2xl">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">Send Message</h2>
                <button onClick={() => setShowChatModal(false)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
                  <p className="text-xs text-gray-600 mb-1">To: {selectedAd.sellerName || 'Anonymous'}</p>
                  <p className="text-sm font-medium text-gray-800">{selectedAd.title}</p>
                </div>
                <form onSubmit={handleSendChat} className="space-y-3">
                  <input
                    type="tel"
                    value={chatPhone}
                    onChange={(e) => setChatPhone(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    placeholder="Phone (optional)"
                  />
                  <input
                    type="email"
                    value={chatEmail}
                    onChange={(e) => setChatEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    placeholder="Email (optional)"
                  />
                  <textarea
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm resize-none"
                    rows="3"
                    placeholder="Your message..."
                    required
                    maxLength="500"
                  />
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-md"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
