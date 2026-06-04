import { useState, useEffect } from 'react';
import { CreditCard, MapPin, User, Phone, Mail, CheckCircle, ArrowRight, ArrowLeft, ShoppingBag, Truck, CreditCard as PaymentIcon } from 'lucide-react';
import { shoppingApi } from '../services/api';

const steps = ['shipping', 'billing', 'payment', 'review', 'confirm'];

const ShippingStep = ({ shippingInfo, setShippingInfo, errors, setErrors, states, districts, loadDistricts }) => {
  const handleBlur = (field) => {
    const newErrors = { ...errors };
    const value = shippingInfo[field];

    switch (field) {
      case 'fullName':
        if (!value.trim()) newErrors.fullName = 'Full name is required';
        else if (value.trim().length < 2) newErrors.fullName = 'Full name must be at least 2 characters';
        else if (value.trim().length > 100) newErrors.fullName = 'Full name must not exceed 100 characters';
        else delete newErrors.fullName;
        break;
      case 'email':
        if (!value.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(value)) newErrors.email = 'Invalid email format';
        else delete newErrors.email;
        break;
      case 'phone':
        if (!value.trim()) newErrors.phone = 'Phone is required';
        else if (!/^[6-9]\d{9}$/.test(value.replace(/\D/g, ''))) newErrors.phone = 'Invalid Indian phone number (must start with 6, 7, 8, or 9)';
        else delete newErrors.phone;
        break;
      case 'address':
        if (!value.trim()) newErrors.address = 'Address is required';
        else if (value.trim().length < 10) newErrors.address = 'Address must be at least 10 characters';
        else if (value.trim().length > 200) newErrors.address = 'Address must not exceed 200 characters';
        else delete newErrors.address;
        break;
      case 'state':
        if (!value.trim()) newErrors.state = 'State is required';
        else delete newErrors.state;
        break;
      case 'city':
        if (!value.trim()) newErrors.city = 'District is required';
        else delete newErrors.city;
        break;
      case 'zipCode':
        if (!value.trim()) newErrors.zipCode = 'PIN code is required';
        else if (!/^\d{6}$/.test(value)) newErrors.zipCode = 'Invalid Indian PIN code (must be 6 digits)';
        else delete newErrors.zipCode;
        break;
    }
    setErrors(newErrors);
  };

  return (
    <div className="space-y-6 mt-4">
      <h3 className="text-xl font-semibold text-gray-800 flex items-center">
        <MapPin size={24} className="mr-2 text-blue-600" />
        Shipping Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              name="fullName"
              value={shippingInfo.fullName}
              onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
              onBlur={() => handleBlur('fullName')}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
          </div>
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              name="email"
              value={shippingInfo.email}
              onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
              onBlur={() => handleBlur('email')}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
          </div>
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="tel"
              name="phone"
              value={shippingInfo.phone}
              onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
              onBlur={() => handleBlur('phone')}
              inputMode="numeric"
              pattern="[0-9]{10}"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
          </div>
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <input
            type="text"
            name="address"
            value={shippingInfo.address}
            onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
            onBlur={() => handleBlur('address')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
          <select
            value={shippingInfo.state}
            onChange={(e) => {
              setShippingInfo({ ...shippingInfo, state: e.target.value, city: '' });
              loadDistricts(e.target.value);
            }}
            onBlur={() => handleBlur('state')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
            required
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.id} value={state.code}>{state.name}</option>
            ))}
          </select>
          {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
          <select
            value={shippingInfo.city}
            onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
            onBlur={() => handleBlur('city')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
            required
          >
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district.id} value={district.name}>{district.name}</option>
            ))}
          </select>
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code</label>
          <input
            type="text"
            name="zipCode"
            value={shippingInfo.zipCode}
            onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
            onBlur={() => handleBlur('zipCode')}
            inputMode="numeric"
            pattern="[0-9]{6}"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
        </div>
      </div>
    </div>
  );
};

const BillingStep = ({ billingInfo, setBillingInfo, errors, setErrors, states, districts, loadDistricts, shippingInfo }) => {
  const handleBlur = (field) => {
    if (billingInfo.sameAsShipping) return;
    const newErrors = { ...errors };
    const value = billingInfo[field];

    switch (field) {
      case 'fullName':
        if (!value.trim()) newErrors.billingFullName = 'Full name is required';
        else if (value.trim().length < 2) newErrors.billingFullName = 'Full name must be at least 2 characters';
        else if (value.trim().length > 100) newErrors.billingFullName = 'Full name must not exceed 100 characters';
        else delete newErrors.billingFullName;
        break;
      case 'email':
        if (!value.trim()) newErrors.billingEmail = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(value)) newErrors.billingEmail = 'Invalid email format';
        else delete newErrors.billingEmail;
        break;
      case 'phone':
        if (!value.trim()) newErrors.billingPhone = 'Phone is required';
        else if (!/^[6-9]\d{9}$/.test(value.replace(/\D/g, ''))) newErrors.billingPhone = 'Invalid Indian phone number (must start with 6, 7, 8, or 9)';
        else delete newErrors.billingPhone;
        break;
      case 'address':
        if (!value.trim()) newErrors.billingAddress = 'Address is required';
        else if (value.trim().length < 10) newErrors.billingAddress = 'Address must be at least 10 characters';
        else if (value.trim().length > 200) newErrors.billingAddress = 'Address must not exceed 200 characters';
        else delete newErrors.billingAddress;
        break;
      case 'state':
        if (!value.trim()) newErrors.billingState = 'State is required';
        else delete newErrors.billingState;
        break;
      case 'city':
        if (!value.trim()) newErrors.billingCity = 'District is required';
        else delete newErrors.billingCity;
        break;
      case 'zipCode':
        if (!value.trim()) newErrors.billingZipCode = 'PIN code is required';
        else if (!/^\d{6}$/.test(value)) newErrors.billingZipCode = 'Invalid Indian PIN code (must be 6 digits)';
        else delete newErrors.billingZipCode;
        break;
    }
    setErrors(newErrors);
  };

  return (
    <div className="space-y-6 mt-4">
      <h3 className="text-xl font-semibold text-gray-800 flex items-center">
        <CreditCard size={24} className="mr-2 text-blue-600" />
        Billing Information
      </h3>
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="sameAsShipping"
          checked={billingInfo.sameAsShipping}
          onChange={(e) => {
            setBillingInfo({ ...billingInfo, sameAsShipping: e.target.checked });
            if (e.target.checked) {
              setBillingInfo({
                ...billingInfo,
                fullName: shippingInfo.fullName,
                address: shippingInfo.address,
                city: shippingInfo.city,
                state: shippingInfo.state,
                zipCode: shippingInfo.zipCode,
                sameAsShipping: true
              });
            }
          }}
          className="mr-2"
        />
        <label htmlFor="sameAsShipping" className="text-sm text-gray-700">Same as shipping address</label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={billingInfo.fullName}
            onChange={(e) => setBillingInfo({ ...billingInfo, fullName: e.target.value })}
            onBlur={() => handleBlur('fullName')}
            disabled={billingInfo.sameAsShipping}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.billingFullName ? 'border-red-500' : 'border-gray-300'} ${billingInfo.sameAsShipping ? 'bg-gray-100' : ''}`}
            required
          />
          {errors.billingFullName && <p className="text-red-500 text-sm mt-1">{errors.billingFullName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              value={billingInfo.email}
              onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
              onBlur={() => handleBlur('email')}
              disabled={billingInfo.sameAsShipping}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.billingEmail ? 'border-red-500' : 'border-gray-300'} ${billingInfo.sameAsShipping ? 'bg-gray-100' : ''}`}
              required
            />
          </div>
          {errors.billingEmail && <p className="text-red-500 text-sm mt-1">{errors.billingEmail}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="tel"
              value={billingInfo.phone}
              onChange={(e) => setBillingInfo({ ...billingInfo, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
              onBlur={() => handleBlur('phone')}
              disabled={billingInfo.sameAsShipping}
              inputMode="numeric"
              pattern="[0-9]{10}"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.billingPhone ? 'border-red-500' : 'border-gray-300'} ${billingInfo.sameAsShipping ? 'bg-gray-100' : ''}`}
              required
            />
          </div>
          {errors.billingPhone && <p className="text-red-500 text-sm mt-1">{errors.billingPhone}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <input
            type="text"
            value={billingInfo.address}
            onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
            onBlur={() => handleBlur('address')}
            disabled={billingInfo.sameAsShipping}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.billingAddress ? 'border-red-500' : 'border-gray-300'} ${billingInfo.sameAsShipping ? 'bg-gray-100' : ''}`}
            required
          />
          {errors.billingAddress && <p className="text-red-500 text-sm mt-1">{errors.billingAddress}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
          <select
            value={billingInfo.state}
            onChange={(e) => {
              setBillingInfo({ ...billingInfo, state: e.target.value, city: '' });
              loadDistricts(e.target.value);
            }}
            onBlur={() => handleBlur('state')}
            disabled={billingInfo.sameAsShipping}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.billingState ? 'border-red-500' : 'border-gray-300'} ${billingInfo.sameAsShipping ? 'bg-gray-100' : ''}`}
            required
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.id} value={state.code}>{state.name}</option>
            ))}
          </select>
          {errors.billingState && <p className="text-red-500 text-sm mt-1">{errors.billingState}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
          <select
            value={billingInfo.city}
            onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
            onBlur={() => handleBlur('city')}
            disabled={billingInfo.sameAsShipping}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.billingCity ? 'border-red-500' : 'border-gray-300'} ${billingInfo.sameAsShipping ? 'bg-gray-100' : ''}`}
            required
          >
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district.id} value={district.name}>{district.name}</option>
            ))}
          </select>
          {errors.billingCity && <p className="text-red-500 text-sm mt-1">{errors.billingCity}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code</label>
          <input
            type="text"
            value={billingInfo.zipCode}
            onChange={(e) => setBillingInfo({ ...billingInfo, zipCode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
            onBlur={() => handleBlur('zipCode')}
            disabled={billingInfo.sameAsShipping}
            inputMode="numeric"
            pattern="[0-9]{6}"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.billingZipCode ? 'border-red-500' : 'border-gray-300'} ${billingInfo.sameAsShipping ? 'bg-gray-100' : ''}`}
            required
          />
          {errors.billingZipCode && <p className="text-red-500 text-sm mt-1">{errors.billingZipCode}</p>}
        </div>
      </div>
    </div>
  );
};

const PaymentStep = ({ paymentInfo, setPaymentInfo, errors, setErrors }) => {
  const detectCardType = (cardNumber) => {
    const cleanedNumber = cardNumber.replace(/\D/g, '');
    if (/^4/.test(cleanedNumber)) return 'visa';
    if (/^5[1-5]/.test(cleanedNumber) || /^2[2-7]/.test(cleanedNumber)) return 'mastercard';
    if (/^3[47]/.test(cleanedNumber)) return 'amex';
    if (/^6(?:011|5)/.test(cleanedNumber)) return 'discover';
    return 'unknown';
  };

  const formatCardNumber = (value) => {
    const cleanedValue = value.replace(/\D/g, '').slice(0, 16);
    const formattedValue = cleanedValue.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formattedValue;
  };

  const formatExpiryDate = (value) => {
    const cleanedValue = value.replace(/\D/g, '').slice(0, 4);
    if (cleanedValue.length >= 2) {
      return cleanedValue.slice(0, 2) + '/' + cleanedValue.slice(2);
    }
    return cleanedValue;
  };

  const handleBlur = (field) => {
    const newErrors = { ...errors };
    const value = paymentInfo[field];

    switch (field) {
      case 'cardNumber':
        if (!value.trim()) newErrors.cardNumber = 'Card number is required';
        else if (!/^\d{16}$/.test(value.replace(/\D/g, ''))) newErrors.cardNumber = 'Invalid card number (must be 16 digits)';
        else delete newErrors.cardNumber;
        break;
      case 'cardName':
        if (!value.trim()) newErrors.cardName = 'Cardholder name is required';
        else if (value.trim().length < 2) newErrors.cardName = 'Cardholder name must be at least 2 characters';
        else if (value.trim().length > 50) newErrors.cardName = 'Cardholder name must not exceed 50 characters';
        else delete newErrors.cardName;
        break;
      case 'expiryDate':
        if (!value.trim()) newErrors.expiryDate = 'Expiry date is required';
        else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) newErrors.expiryDate = 'Invalid expiry date (MM/YY)';
        else delete newErrors.expiryDate;
        break;
      case 'cvv':
        if (!value.trim()) newErrors.cvv = 'CVV is required';
        else if (!/^\d{3,4}$/.test(value)) newErrors.cvv = 'Invalid CVV (must be 3 or 4 digits)';
        else delete newErrors.cvv;
        break;
    }
    setErrors(newErrors);
  };

  return (
    <div className="space-y-6 mt-4">
      <h3 className="text-xl font-semibold text-gray-800 flex items-center">
        <PaymentIcon size={24} className="mr-2 text-blue-600" />
        Payment Information
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="credit-card"
                checked={paymentInfo.paymentMethod === 'credit-card'}
                onChange={(e) => setPaymentInfo({ ...paymentInfo, paymentMethod: e.target.value })}
                className="mr-2"
              />
              <span>Credit Card</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="paypal"
                checked={paymentInfo.paymentMethod === 'paypal'}
                onChange={(e) => setPaymentInfo({ ...paymentInfo, paymentMethod: e.target.value })}
                className="mr-2"
              />
              <span>PayPal</span>
            </label>
          </div>
        </div>

        {paymentInfo.paymentMethod === 'credit-card' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  value={paymentInfo.cardNumber}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: formatCardNumber(e.target.value) })}
                  onBlur={() => handleBlur('cardNumber')}
                  placeholder="1234 5678 9012 3456"
                  inputMode="numeric"
                  maxLength="19"
                  className={`w-full px-4 py-3 pr-20 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {detectCardType(paymentInfo.cardNumber) === 'visa' && <span className="text-blue-600 font-bold text-sm">VISA</span>}
                  {detectCardType(paymentInfo.cardNumber) === 'mastercard' && <span className="text-red-600 font-bold text-sm">MC</span>}
                  {detectCardType(paymentInfo.cardNumber) === 'amex' && <span className="text-blue-500 font-bold text-sm">AMEX</span>}
                  {detectCardType(paymentInfo.cardNumber) === 'discover' && <span className="text-orange-600 font-bold text-sm">DISC</span>}
                </div>
              </div>
              {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
              <input
                type="text"
                value={paymentInfo.cardName}
                onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value.toUpperCase() })}
                onBlur={() => handleBlur('cardName')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.cardName ? 'border-red-500' : 'border-gray-300'}`}
                required
              />
              {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                <input
                  type="text"
                  value={paymentInfo.expiryDate}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: formatExpiryDate(e.target.value) })}
                  onBlur={() => handleBlur('expiryDate')}
                  placeholder="MM/YY"
                  inputMode="numeric"
                  maxLength="5"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                <input
                  type="text"
                  value={paymentInfo.cvv}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                  onBlur={() => handleBlur('cvv')}
                  placeholder="123"
                  inputMode="numeric"
                  maxLength="4"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ReviewStep = ({ shippingInfo, billingInfo, paymentInfo, cartItems, subtotal, shipping, tax, total, termsAccepted, setTermsAccepted, errors }) => (
  <div className="space-y-6 mt-4">
    <h3 className="text-xl font-semibold text-gray-800 flex items-center">
      <ShoppingBag size={24} className="mr-2 text-blue-600" />
      Review Your Order
    </h3>
    
    <div className="bg-gray-50 rounded-lg p-6">
      <h4 className="font-semibold text-gray-800 mb-4">Shipping Address</h4>
      <p className="text-gray-600">
        {shippingInfo.fullName}<br />
        {shippingInfo.address}<br />
        {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}<br />
        {shippingInfo.email}<br />
        {shippingInfo.phone}
      </p>
    </div>

    <div className="bg-gray-50 rounded-lg p-6">
      <h4 className="font-semibold text-gray-800 mb-4">Billing Address</h4>
      <p className="text-gray-600">
        {billingInfo.fullName}<br />
        {billingInfo.address}<br />
        {billingInfo.city}, {billingInfo.state} {billingInfo.zipCode}
      </p>
    </div>

    <div className="bg-gray-50 rounded-lg p-6">
      <h4 className="font-semibold text-gray-800 mb-4">Payment Method</h4>
      <p className="text-gray-600 capitalize">{paymentInfo.paymentMethod === 'credit-card' ? 'Credit Card' : 'PayPal'}</p>
    </div>

    <div className="bg-gray-50 rounded-lg p-6">
      <h4 className="font-semibold text-gray-800 mb-4">Order Items</h4>
      <div className="space-y-3">
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-800">{item.product?.name}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold text-gray-800">${item.totalPrice.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-blue-50 rounded-lg p-6">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax (8%)</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span className="text-blue-600">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white border rounded-lg p-4">
      <label className="flex items-start space-x-3">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="mt-1"
        />
        <span className="text-sm text-gray-700">
          I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
        </span>
      </label>
      {errors.terms && <p className="text-red-500 text-sm mt-2">{errors.terms}</p>}
    </div>
  </div>
);

const ConfirmStep = ({ orderId, onClose, onOrderSuccess }) => (
  <div className="text-center py-12">
    <CheckCircle size={80} className="mx-auto text-green-500 mb-6" />
    <h2 className="text-3xl font-bold text-gray-800 mb-4">Order Confirmed!</h2>
    <p className="text-gray-600 mb-2">Thank you for your purchase.</p>
    <p className="text-gray-600 mb-8">Order ID: {orderId}</p>
    <button
      onClick={() => {
        onClose();
        onOrderSuccess();
      }}
      className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
    >
      Continue Shopping
    </button>
  </div>
);

export default function Checkout({ onClose, onOrderSuccess }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [billingInfo, setBillingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    sameAsShipping: true
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    paymentMethod: 'credit-card'
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState({});
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    loadCart();
    loadProducts();
    loadStates();
  }, []);

  useEffect(() => {
    if (billingInfo.sameAsShipping) {
      setBillingInfo({
        ...billingInfo,
        fullName: shippingInfo.fullName,
        email: shippingInfo.email,
        phone: shippingInfo.phone,
        address: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        zipCode: shippingInfo.zipCode
      });
    }
  }, [shippingInfo, billingInfo.sameAsShipping]);

  const loadCart = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const response = await shoppingApi.getCart(userId);
        setCart(response.data);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
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

  const loadStates = async () => {
    try {
      const response = await shoppingApi.getStates();
      setStates(response.data);
    } catch (error) {
      console.error('Error loading states:', error);
    }
  };

  const loadDistricts = async (stateCode) => {
    try {
      const response = await shoppingApi.getDistricts(stateCode);
      setDistricts(response.data);
    } catch (error) {
      console.error('Error loading districts:', error);
    }
  };

  const cartItems = cart.map((item) => {
    const product = products.find(p => p.id === item.productId);
    return {
      ...item,
      product,
      totalPrice: (product?.price || 0) * item.quantity
    };
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const shipping = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const validateShipping = () => {
    const newErrors = {};
    if (!shippingInfo.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!shippingInfo.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) newErrors.email = 'Invalid email format';
    if (!shippingInfo.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(shippingInfo.phone.replace(/\D/g, ''))) newErrors.phone = 'Invalid Indian phone number (must start with 6, 7, 8, or 9)';
    if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
    if (!shippingInfo.city.trim()) newErrors.city = 'District is required';
    if (!shippingInfo.state.trim()) newErrors.state = 'State is required';
    if (!shippingInfo.zipCode.trim()) newErrors.zipCode = 'PIN code is required';
    else if (!/^\d{6}$/.test(shippingInfo.zipCode)) newErrors.zipCode = 'Invalid Indian PIN code (must be 6 digits)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateBilling = () => {
    if (billingInfo.sameAsShipping) return true;
    const newErrors = {};
    if (!billingInfo.fullName.trim()) newErrors.billingFullName = 'Full name is required';
    if (!billingInfo.address.trim()) newErrors.billingAddress = 'Address is required';
    if (!billingInfo.city.trim()) newErrors.billingCity = 'District is required';
    if (!billingInfo.state.trim()) newErrors.billingState = 'State is required';
    if (!billingInfo.zipCode.trim()) newErrors.billingZipCode = 'PIN code is required';
    else if (!/^\d{6}$/.test(billingInfo.zipCode)) newErrors.billingZipCode = 'Invalid Indian PIN code (must be 6 digits)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    if (paymentInfo.paymentMethod === 'paypal') return true;
    const newErrors = {};
    if (!paymentInfo.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
    else if (!/^\d{16}$/.test(paymentInfo.cardNumber.replace(/\D/g, ''))) newErrors.cardNumber = 'Invalid card number';
    if (!paymentInfo.cardName.trim()) newErrors.cardName = 'Cardholder name is required';
    if (!paymentInfo.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
    else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentInfo.expiryDate)) newErrors.expiryDate = 'Invalid expiry date (MM/YY)';
    if (!paymentInfo.cvv.trim()) newErrors.cvv = 'CVV is required';
    else if (!/^\d{3,4}$/.test(paymentInfo.cvv)) newErrors.cvv = 'Invalid CVV';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = true;
    if (currentStep === 0) isValid = validateShipping();
    if (currentStep === 1) isValid = validateBilling();
    if (currentStep === 2) isValid = validatePayment();

    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitOrder = async () => {
    if (!termsAccepted) {
      setErrors({ terms: 'You must accept the terms and conditions' });
      return;
    }

    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      const userName = localStorage.getItem('userName');

      const orderData = {
        userId,
        userName: userName || shippingInfo.fullName,
        items: cartItems.map(item => ({
          productId: item.productId,
          productName: item.product?.name || 'Product',
          quantity: item.quantity,
          price: item.product?.price || 0
        })),
        total,
        status: 'Confirmed',
        shippingAddress: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}`,
        billingAddress: `${billingInfo.address}, ${billingInfo.city}, ${billingInfo.state} ${billingInfo.zipCode}`,
        paymentMethod: paymentInfo.paymentMethod === 'credit-card' ? 'Credit Card' : 'PayPal'
      };

      const response = await shoppingApi.createOrder(orderData);
      setOrderId(response.data.order?.id || response.data.id);
      setOrderPlaced(true);
      setCurrentStep(steps.length - 1);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error creating order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center flex-1">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          } font-semibold`}>
            {index < currentStep ? <CheckCircle size={20} /> : index + 1}
          </div>
          <span className={`ml-2 text-sm font-medium ${
            index <= currentStep ? 'text-blue-600' : 'text-gray-400'
          } capitalize hidden sm:block`}>
            {step}
          </span>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-1 mx-4 ${
              index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Checkout</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          <StepIndicator />
        </div>

        <div className="p-6">
          {currentStep === 0 && <ShippingStep shippingInfo={shippingInfo} setShippingInfo={setShippingInfo} errors={errors} setErrors={setErrors} states={states} districts={districts} loadDistricts={loadDistricts} />}
          {currentStep === 1 && <BillingStep billingInfo={billingInfo} setBillingInfo={setBillingInfo} errors={errors} setErrors={setErrors} states={states} districts={districts} loadDistricts={loadDistricts} shippingInfo={shippingInfo} />}
          {currentStep === 2 && <PaymentStep paymentInfo={paymentInfo} setPaymentInfo={setPaymentInfo} errors={errors} setErrors={setErrors} />}
          {currentStep === 3 && <ReviewStep shippingInfo={shippingInfo} billingInfo={billingInfo} paymentInfo={paymentInfo} cartItems={cartItems} subtotal={subtotal} shipping={shipping} tax={tax} total={total} termsAccepted={termsAccepted} setTermsAccepted={setTermsAccepted} errors={errors} />}
          {currentStep === 4 && <ConfirmStep orderId={orderId} onClose={onClose} onOrderSuccess={onOrderSuccess} />}
        </div>

        {!orderPlaced && (
          <div className="p-6 border-t flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={20} />
              Back
            </button>
            {currentStep === steps.length - 2 ? (
              <button
                onClick={handleSubmitOrder}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            ) : currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Next
                <ArrowRight size={20} />
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
