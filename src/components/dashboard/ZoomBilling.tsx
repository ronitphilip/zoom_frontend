import React from 'react'

const ZoomBilling = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-purple-800 mb-2">ZoomPhone Billing</h3>
      
      {/* Phone Number Inventory */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-2.5 bg-gradient-to-r from-purple-50 to-white border-b">
          <h4 className="text-sm font-medium text-purple-800">Phone Number Inventory</h4>
        </div>
        <div className="p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Direct Numbers</span>
            <span className="text-base font-semibold">42</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Toll-Free</span>
            <span className="text-base font-semibold">3</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">International</span>
            <span className="text-base font-semibold">5</span>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Monthly Cost</span>
              <span className="text-base font-bold text-purple-700">$245.00</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Calling Costs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-2.5 bg-gradient-to-r from-purple-50 to-white border-b">
          <h4 className="text-sm font-medium text-purple-800">Calling Costs</h4>
        </div>
        <div className="p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Domestic</span>
            <span className="text-base font-semibold">$128.45</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">International</span>
            <span className="text-base font-semibold">$76.32</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Toll-Free</span>
            <span className="text-base font-semibold">$42.18</span>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Total</span>
              <span className="text-base font-bold text-purple-700">$246.95</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* License Utilization */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-2.5 bg-gradient-to-r from-purple-50 to-white border-b">
          <h4 className="text-sm font-medium text-purple-800">License Utilization</h4>
        </div>
        <div className="p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Pro Licenses</span>
            <div className="flex items-center">
              <span className="text-base font-semibold mr-1">32/35</span>
              <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full">91%</span>
            </div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Power Pack Add-ons</span>
            <div className="flex items-center">
              <span className="text-base font-semibold mr-1">12/15</span>
              <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full">80%</span>
            </div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Common Area Phones</span>
            <div className="flex items-center">
              <span className="text-base font-semibold mr-1">8/10</span>
              <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full">80%</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Monthly Cost</span>
              <span className="text-base font-bold text-purple-700">$1,240.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ZoomBilling