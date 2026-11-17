
import React, { useEffect, useMemo, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ORDER_STATUSES = [
    'Order Placed',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled'
]

const FILTERS = [
    { label: 'All Orders', value: 'All' },
    { label: 'Pending', value: 'Order Placed' },
    { label: 'Processing', value: 'Processing' },
    { label: 'Shipped', value: 'Shipped' },
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Cancelled', value: 'Cancelled' }
]

const statusStyles = {
    'Order Placed': 'bg-amber-50 text-amber-700 border-amber-200',
    Processing: 'bg-blue-50 text-blue-700 border-blue-200',
    Shipped: 'bg-violet-50 text-violet-700 border-violet-200',
    Delivered: 'bg-green-50 text-green-700 border-green-200',
    Cancelled: 'bg-red-50 text-red-700 border-red-200'
}

const Orders = () => {
    const { currency, axios } = useAppContext()

    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [updatingOrder, setUpdatingOrder] = useState(null)
    const [search, setSearch] = useState('')
    const [activeFilter, setActiveFilter] = useState('All')

    const fetchOrders = async () => {
        try {
            setLoading(true)

            const { data } = await axios.get('/api/order/seller')

            if (data.success) {
                setOrders(data.orders || [])
            } else {
                toast.error(data.message || 'Unable to fetch orders')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const updateStatus = async (orderId, status) => {
        try {
            setUpdatingOrder(orderId)

            const { data } = await axios.patch('/api/order/status', {
                orderId,
                status
            })

            if (data.success) {
                setOrders(previous =>
                    previous.map(order =>
                        order._id === orderId
                            ? { ...order, status: data.order?.status || status }
                            : order
                    )
                )

                toast.success(data.message || 'Order status updated')
            } else {
                toast.error(data.message || 'Unable to update order')
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                error.message ||
                'Unable to update order status'
            )
        } finally {
            setUpdatingOrder(null)
        }
    }

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const address = order.address || {}

            const customerName =
                `${address.firstName || ''} ${address.lastName || ''}`.toLowerCase()

            const phone = String(address.phone || '').toLowerCase()
            const orderId = String(order._id || '').toLowerCase()
            const query = search.trim().toLowerCase()

            const matchesSearch =
                !query ||
                customerName.includes(query) ||
                phone.includes(query) ||
                orderId.includes(query)

            const matchesFilter =
                activeFilter === 'All' ||
                (order.status || 'Order Placed') === activeFilter

            return matchesSearch && matchesFilter
        })
    }, [orders, search, activeFilter])

    const pendingCount = orders.filter(
        order => (order.status || 'Order Placed') === 'Order Placed'
    ).length

    const processingCount = orders.filter(
        order => ['Processing', 'Shipped'].includes(order.status)
    ).length

    const deliveredCount = orders.filter(
        order => order.status === 'Delivered'
    ).length

    const formatDate = date => {
        if (!date) return 'Date unavailable'

        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    }

    const getCustomerName = address => {
        if (!address) return 'Customer'

        return `${address.firstName || ''} ${address.lastName || ''}`.trim() || 'Customer'
    }

    return (
        <div className="flex-1 h-[95vh] overflow-y-auto bg-[#faf8f2]">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10">

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b66b35] mb-2">
                            Seller Dashboard
                        </p>

                        <h1 className="text-2xl sm:text-3xl font-semibold text-[#294331] tracking-tight">
                            Order Management
                        </h1>

                        <p className="text-sm text-gray-500 mt-2">
                            Track, manage and update your customer orders.
                        </p>
                    </div>

                    <button
                        onClick={fetchOrders}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#294331] hover:bg-[#1d3324] text-white text-sm font-medium transition disabled:opacity-60"
                    >
                        <span className={loading ? 'animate-spin' : ''}>↻</span>
                        Refresh Orders
                    </button>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-7">

                    <div className="bg-white rounded-2xl border border-[#e9e5da] p-4 sm:p-5 shadow-sm">
                        <p className="text-xs sm:text-sm text-gray-500">Total Orders</p>
                        <h2 className="text-2xl sm:text-3xl font-semibold text-[#294331] mt-3">
                            {orders.length}
                        </h2>
                        <p className="text-xs text-gray-400 mt-2">All received orders</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#e9e5da] p-4 sm:p-5 shadow-sm">
                        <p className="text-xs sm:text-sm text-gray-500">Pending Orders</p>
                        <h2 className="text-2xl sm:text-3xl font-semibold text-amber-600 mt-3">
                            {pendingCount}
                        </h2>
                        <p className="text-xs text-gray-400 mt-2">Awaiting processing</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#e9e5da] p-4 sm:p-5 shadow-sm">
                        <p className="text-xs sm:text-sm text-gray-500">In Progress</p>
                        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-700 mt-3">
                            {processingCount}
                        </h2>
                        <p className="text-xs text-gray-400 mt-2">Processing and shipped</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#e9e5da] p-4 sm:p-5 shadow-sm">
                        <p className="text-xs sm:text-sm text-gray-500">Delivered</p>
                        <h2 className="text-2xl sm:text-3xl font-semibold text-green-700 mt-3">
                            {deliveredCount}
                        </h2>
                        <p className="text-xs text-gray-400 mt-2">Successfully completed</p>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-2xl border border-[#e9e5da] shadow-sm p-4 sm:p-5 mb-6">

                    <div className="relative mb-5">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                            ⌕
                        </span>

                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by customer name, phone or order ID..."
                            className="w-full bg-[#faf9f5] border border-[#e9e5da] rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-[#294331] focus:ring-2 focus:ring-[#294331]/10 transition"
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                        {FILTERS.map(filter => {
                            const count = filter.value === 'All'
                                ? orders.length
                                : orders.filter(order =>
                                    (order.status || 'Order Placed') === filter.value
                                ).length

                            return (
                                <button
                                    key={filter.value}
                                    onClick={() => setActiveFilter(filter.value)}
                                    className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium border transition ${
                                        activeFilter === filter.value
                                            ? 'bg-[#294331] text-white border-[#294331]'
                                            : 'bg-white text-gray-600 border-[#e9e5da] hover:border-[#294331] hover:text-[#294331]'
                                    }`}
                                >
                                    {filter.label}
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                        activeFilter === filter.value
                                            ? 'bg-white/20 text-white'
                                            : 'bg-[#f2f0e9] text-gray-500'
                                    }`}>
                                        {count}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Orders List */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold text-[#294331]">
                            Orders
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">
                            Showing {filteredOrders.length} of {orders.length} orders
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="bg-white rounded-2xl border border-[#e9e5da] p-12 text-center">
                        <div className="w-8 h-8 border-4 border-[#294331]/20 border-t-[#294331] rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-sm text-gray-500">Loading orders...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-[#e9e5da] p-12 text-center">
                        <div className="text-4xl mb-3">📦</div>
                        <h3 className="font-semibold text-[#294331]">
                            No orders found
                        </h3>
                        <p className="text-sm text-gray-400 mt-2">
                            Try changing your search or status filter.
                        </p>
                        {(search || activeFilter !== 'All') && (
                            <button
                                onClick={() => {
                                    setSearch('')
                                    setActiveFilter('All')
                                }}
                                className="mt-5 text-sm font-semibold text-[#b66b35] hover:underline"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-5">
                        {filteredOrders.map(order => {
                            const address = order.address || {}
                            const status = order.status || 'Order Placed'
                            const items = order.items || []
                            const isUpdating = updatingOrder === order._id

                            return (
                                <div
                                    key={order._id}
                                    className="bg-white rounded-2xl border border-[#e9e5da] shadow-sm overflow-hidden"
                                >
                                    {/* Order Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 sm:px-6 py-4 bg-[#fcfbf7] border-b border-[#eeeae1]">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-sm font-semibold text-[#294331]">
                                                    Order #{String(order._id).slice(-8).toUpperCase()}
                                                </span>

                                                <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full border ${statusStyles[status] || statusStyles['Order Placed']}`}>
                                                    {status === 'Order Placed' ? 'Pending' : status}
                                                </span>
                                            </div>

                                            <p className="text-xs text-gray-400 mt-1.5">
                                                Placed on {formatDate(order.createdAt)}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-3">
                                            <div className="text-right">
                                                <p className="text-[10px] uppercase tracking-wider text-gray-400">
                                                    Order Total
                                                </p>
                                                <p className="text-lg font-semibold text-[#294331]">
                                                    {currency}{Number(order.amount || 0).toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Body */}
                                    <div className="p-5 sm:p-6">
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                                            {/* Products */}
                                            <div className="lg:col-span-1">
                                                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
                                                    Order Items ({items.length})
                                                </h3>

                                                <div className="space-y-4">
                                                    {items.map((item, index) => {
                                                        const product = item.product || {}

                                                        return (
                                                            <div key={item._id || index} className="flex items-center gap-3">
                                                                <div className="w-14 h-14 rounded-xl bg-[#faf9f5] border border-[#eeeae1] p-2 shrink-0">
                                                                    {product.image?.[0] ? (
                                                                        <img
                                                                            src={product.image[0]}
                                                                            alt={product.name || 'Product'}
                                                                            className="w-full h-full object-contain"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-xl">
                                                                            📦
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="min-w-0">
                                                                    <p className="text-sm font-semibold text-[#294331] line-clamp-2">
                                                                        {product.name || 'Product unavailable'}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        Quantity: {item.quantity}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                            {/* Customer Details */}
                                            <div>
                                                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
                                                    Delivery Details
                                                </h3>

                                                <p className="font-semibold text-sm text-[#294331]">
                                                    {getCustomerName(address)}
                                                </p>

                                                <p className="text-xs text-gray-500 mt-2 leading-6">
                                                    {address.street || 'Address unavailable'}
                                                    {address.city ? `, ${address.city}` : ''}
                                                    {address.state ? `, ${address.state}` : ''}
                                                    {address.zipcode ? ` - ${address.zipcode}` : ''}
                                                    {address.country ? `, ${address.country}` : ''}
                                                </p>

                                                <p className="text-xs text-gray-500 mt-2">
                                                    Phone: {address.phone || 'Not provided'}
                                                </p>
                                            </div>

                                            {/* Payment Details */}
                                            <div>
                                                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
                                                    Payment Details
                                                </h3>

                                                <div className="space-y-3">
                                                    <div className="flex justify-between gap-3 text-sm">
                                                        <span className="text-gray-500">Method</span>
                                                        <span className="font-medium text-[#294331]">
                                                            {order.paymentType || 'N/A'}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between gap-3 text-sm">
                                                        <span className="text-gray-500">Payment</span>
                                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                                            order.isPaid
                                                                ? 'bg-green-50 text-green-700'
                                                                : 'bg-amber-50 text-amber-700'
                                                        }`}>
                                                            {order.isPaid ? 'Paid' : 'Pending'}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between gap-3 text-sm">
                                                        <span className="text-gray-500">Date</span>
                                                        <span className="font-medium text-[#294331]">
                                                            {formatDate(order.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {order.paymentType === 'Online' && !order.isPaid && (
                                                    <p className="mt-4 text-xs leading-5 text-amber-700 bg-amber-50 border border-amber-100 rounded-xl p-3">
                                                        Online payment is not confirmed. This order cannot be processed until payment succeeds.
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Status Update */}
                                        <div className="mt-6 pt-5 border-t border-[#eeeae1] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-semibold text-[#294331]">
                                                    Update Order Status
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Changes are saved to your order record.
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <select
                                                    value={status}
                                                    disabled={isUpdating}
                                                    onChange={e => updateStatus(order._id, e.target.value)}
                                                    className="w-full sm:w-52 bg-[#faf9f5] border border-[#e5e1d7] rounded-xl px-4 py-3 text-sm font-medium text-[#294331] outline-none focus:border-[#294331] disabled:opacity-60"
                                                >
                                                    {ORDER_STATUSES.map(option => {
                                                        const blocked =
                                                            order.paymentType === 'Online' &&
                                                            !order.isPaid &&
                                                            ['Processing', 'Shipped', 'Delivered'].includes(option)

                                                        return (
                                                            <option
                                                                key={option}
                                                                value={option}
                                                                disabled={blocked}
                                                            >
                                                                {option === 'Order Placed' ? 'Pending' : option}
                                                            </option>
                                                        )
                                                    })}
                                                </select>

                                                {isUpdating && (
                                                    <div className="w-5 h-5 border-2 border-[#294331]/20 border-t-[#294331] rounded-full animate-spin shrink-0" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

            </div>
        </div>
    )
}

export default Orders
