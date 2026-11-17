
import React from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ProductList = () => {
    const { products, currency, axios, fetchProducts } = useAppContext()

    const toggleStock = async (id, inStock) => {
        try {
            const { data } = await axios.post('/api/product/stock', { id, inStock })

            if (data.success) {
                fetchProducts()
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const inStockCount = products.filter(product => product.inStock).length
    const outOfStockCount = products.length - inStockCount

    return (
        <div className="flex-1 h-[95vh] overflow-y-auto overflow-x-hidden bg-[#faf8f2]">
            <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-10">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b66b35] mb-2">
                            Seller Dashboard
                        </p>
                        <h1 className="text-2xl sm:text-3xl font-semibold text-[#294331] tracking-tight">
                            Product Inventory
                        </h1>
                        <p className="text-sm text-gray-500 mt-2">
                            Manage your products and monitor their availability.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 bg-white border border-[#e9e5da] rounded-xl px-4 py-3 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-[#d97732]" />
                        <span className="text-sm text-gray-600">
                            Inventory Overview
                        </span>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
                    <div className="bg-white rounded-2xl border border-[#e9e5da] p-5 shadow-sm">
                        <p className="text-sm text-gray-500">Total Products</p>
                        <div className="flex items-end justify-between mt-3">
                            <h2 className="text-3xl font-semibold text-[#294331]">
                                {products.length}
                            </h2>
                            <div className="w-10 h-10 rounded-xl bg-[#edf2eb] flex items-center justify-center text-[#294331] text-lg">
                                📦
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#e9e5da] p-5 shadow-sm">
                        <p className="text-sm text-gray-500">Available Products</p>
                        <div className="flex items-end justify-between mt-3">
                            <h2 className="text-3xl font-semibold text-[#294331]">
                                {inStockCount}
                            </h2>
                            <div className="w-10 h-10 rounded-xl bg-[#edf2eb] flex items-center justify-center text-[#294331]">
                                ✓
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#e9e5da] p-5 shadow-sm">
                        <p className="text-sm text-gray-500">Out of Stock</p>
                        <div className="flex items-end justify-between mt-3">
                            <h2 className="text-3xl font-semibold text-[#bd7139]">
                                {outOfStockCount}
                            </h2>
                            <div className="w-10 h-10 rounded-xl bg-[#fbf0e7] flex items-center justify-center text-[#bd7139]">
                                !
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Table */}
                <div className="bg-white rounded-2xl border border-[#e9e5da] shadow-sm overflow-hidden">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-5 sm:px-6 py-5 border-b border-[#eeeae1]">
                        <div>
                            <h2 className="text-lg font-semibold text-[#294331]">
                                All Products
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">
                                Your complete product catalogue
                            </p>
                        </div>

                        <span className="text-xs font-medium text-[#294331] bg-[#edf2eb] px-3 py-2 rounded-full w-fit">
                            {products.length} Products Listed
                        </span>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-[700px] text-left">
                            <thead className="bg-[#f8f7f1] text-xs uppercase tracking-wider text-gray-500">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Product</th>
                                    <th className="px-6 py-4 font-semibold">Category</th>
                                    <th className="px-6 py-4 font-semibold">Selling Price</th>
                                    <th className="px-6 py-4 font-semibold">Availability</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#f0ede5]">
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <tr
                                            key={product._id}
                                            className="hover:bg-[#fcfbf7] transition-colors duration-200"
                                        >
                                            {/* Product */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-xl border border-[#eeeae1] bg-[#faf9f5] p-2 flex items-center justify-center shrink-0">
                                                        <img
                                                            src={product.image?.[0]}
                                                            alt={product.name}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-sm text-[#294331] truncate max-w-[220px]">
                                                            {product.name}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            ID: {product._id.slice(-8)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Category */}
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#f3f2eb] text-[#52634e] text-xs font-medium">
                                                    {product.category}
                                                </span>
                                            </td>

                                            {/* Price */}
                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-[#294331] text-sm">
                                                    {currency}{product.offerPrice}
                                                </span>
                                            </td>

                                            {/* Stock Toggle */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={!!product.inStock}
                                                            onChange={() => toggleStock(
                                                                product._id,
                                                                !product.inStock
                                                            )}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 rounded-full bg-gray-300 peer-checked:bg-[#294331] transition-colors duration-200" />
                                                        <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 peer-checked:translate-x-5" />
                                                    </label>

                                                    <span className={`text-xs font-semibold ${
                                                        product.inStock
                                                            ? 'text-[#356b43]'
                                                            : 'text-[#bd7139]'
                                                    }`}>
                                                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-16 text-center">
                                            <div className="text-4xl mb-3">📦</div>
                                            <h3 className="text-[#294331] font-semibold">
                                                No products found
                                            </h3>
                                            <p className="text-sm text-gray-400 mt-1">
                                                Your added products will appear here.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="px-5 sm:px-6 py-4 bg-[#fcfbf7] border-t border-[#eeeae1]">
                        <p className="text-xs text-gray-400">
                            Product inventory · Manage stock availability using the toggle
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ProductList
