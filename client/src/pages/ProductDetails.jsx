import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {
    const { products, navigate, currency, addToCart } = useAppContext();
    const { id } = useParams();

    const [relatedProducts, setRelatedProducts] = useState([]);
    const [selectedMedia, setSelectedMedia] = useState(null);

    const product = products.find((item) => item._id === id);

    // -----------------------------------------
    // RELATED PRODUCTS
    // -----------------------------------------

    useEffect(() => {
        if (!product || !products.length) {
            setRelatedProducts([]);
            return;
        }

        const productsCopy = products.filter(
            (item) =>
                item.category === product.category &&
                item._id !== product._id
        );

        setRelatedProducts(productsCopy.slice(0, 5));
    }, [products, product]);

    // -----------------------------------------
    // INITIAL PRODUCT MEDIA
    // -----------------------------------------

    useEffect(() => {
        if (!product) {
            setSelectedMedia(null);
            return;
        }

        if (product.image?.length > 0) {
            setSelectedMedia({
                type: "image",
                url: product.image[0],
            });
        } else if (product.video) {
            setSelectedMedia({
                type: "video",
                url: product.video,
            });
        } else {
            setSelectedMedia(null);
        }
    }, [product]);

    // -----------------------------------------
    // PRICE CALCULATIONS
    // -----------------------------------------

    const originalPrice = Number(product?.price || 0);
    const offerPrice = Number(product?.offerPrice || 0);

    const discount =
        originalPrice > offerPrice && originalPrice > 0
            ? Math.round(
                  ((originalPrice - offerPrice) / originalPrice) * 100
              )
            : 0;

    const descriptions = Array.isArray(product?.description)
        ? product.description
        : product?.description
          ? [product.description]
          : [];

    // -----------------------------------------
    // PRODUCT NOT FOUND
    // -----------------------------------------

    if (!product) {
        return (
            <main className="min-h-[75vh] bg-[#faf8f2] px-4 pt-32 pb-16">
                <div className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-[#e9e2d5] bg-white px-6 py-16 text-center">
                    <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#fff1df] text-3xl">
                        ✦
                    </div>

                    <h2 className="text-2xl font-semibold text-[#294331]">
                        Product not found
                    </h2>

                    <p className="mt-3 text-sm text-[#858276]">
                        This product may have been removed or is currently
                        unavailable.
                    </p>

                    <button
                        onClick={() => navigate("/products")}
                        className="mt-7 rounded-full bg-[#294331] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#1d3425]"
                    >
                        Explore Products
                    </button>
                </div>
            </main>
        );
    }

    // -----------------------------------------
    // MAIN PRODUCT DETAILS
    // -----------------------------------------

    return (
        <main className="min-h-screen bg-[#faf8f2] px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* BREADCRUMB */}

                <nav className="mb-7 flex flex-wrap items-center gap-2 text-[11px] font-medium text-[#918f82] sm:mb-10">
                    <Link to="/" className="transition hover:text-[#b96b2c]">
                        Home
                    </Link>

                    <span>/</span>

                    <Link
                        to="/products"
                        className="transition hover:text-[#b96b2c]"
                    >
                        Products
                    </Link>

                    <span>/</span>

                    <Link
                        to={`/products/${String(
                            product.category || ""
                        ).toLowerCase()}`}
                        className="transition hover:text-[#b96b2c]"
                    >
                        {product.category}
                    </Link>

                    <span>/</span>

                    <span className="max-w-[180px] truncate text-[#354b38]">
                        {product.name}
                    </span>
                </nav>

                {/* PRODUCT SECTION */}

                <section className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-14">

                    {/* LEFT: PRODUCT GALLERY */}

                    <div className="min-w-0">
                        <div className="flex flex-col-reverse gap-3 sm:flex-row">

                            {/* THUMBNAILS */}

                            <div className="flex gap-3 overflow-x-auto pb-1 sm:w-24 sm:shrink-0 sm:flex-col sm:overflow-visible">

                                {/* PRODUCT IMAGES */}

                                {product.image?.map((image, index) => (
                                    <button
                                        key={`image-${index}`}
                                        type="button"
                                        onClick={() =>
                                            setSelectedMedia({
                                                type: "image",
                                                url: image,
                                            })
                                        }
                                        aria-label={`View product image ${index + 1}`}
                                        aria-pressed={
                                            selectedMedia?.type === "image" &&
                                            selectedMedia?.url === image
                                        }
                                        className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition sm:h-24 sm:w-full ${
                                            selectedMedia?.type === "image" &&
                                            selectedMedia?.url === image
                                                ? "border-[#b96b2c] shadow-sm"
                                                : "border-[#e9e2d5] hover:border-[#a9b99e]"
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} view ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}

                                {/* PRODUCT VIDEO THUMBNAIL */}

                                {product.video && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedMedia({
                                                type: "video",
                                                url: product.video,
                                            })
                                        }
                                        aria-label="View product video"
                                        aria-pressed={
                                            selectedMedia?.type === "video"
                                        }
                                        className={`relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 bg-[#294331] text-white transition sm:h-24 sm:w-full ${
                                            selectedMedia?.type === "video"
                                                ? "border-[#d97732] shadow-sm"
                                                : "border-[#e9e2d5] hover:border-[#a9b99e]"
                                        }`}
                                    >
                                        <span className="text-2xl">▶</span>

                                        <span className="absolute bottom-1 text-[9px] font-bold uppercase tracking-wider">
                                            Video
                                        </span>
                                    </button>
                                )}
                            </div>

                            {/* MAIN MEDIA DISPLAY */}

                            <div className="group relative flex min-h-[340px] flex-1 items-center justify-center overflow-hidden rounded-2xl border border-[#e9e2d5] bg-white sm:min-h-[480px] lg:min-h-[550px]">

                                {discount > 0 && (
                                    <span className="absolute left-5 top-5 z-10 rounded-full bg-[#d97732] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                                        {discount}% OFF
                                    </span>
                                )}

                                <span className="absolute right-5 top-5 z-10 rounded-full border border-[#e8e1d5] bg-white/90 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#536b53]">
                                    Selected Product
                                </span>

                                {/* SELECTED IMAGE */}

                                {selectedMedia?.type === "image" && (
                                    <img
                                        src={selectedMedia.url}
                                        alt={product.name}
                                        className="h-full max-h-[550px] w-full object-contain p-6 transition duration-700 group-hover:scale-[1.04] sm:p-10"
                                    />
                                )}

                                {/* SELECTED VIDEO */}

                                {selectedMedia?.type === "video" && (
                                    <video
                                        key={selectedMedia.url}
                                        src={selectedMedia.url}
                                        controls
                                        playsInline
                                        preload="metadata"
                                        className="max-h-[550px] w-full object-contain"
                                    >
                                        Your browser does not support HTML video.
                                    </video>
                                )}

                                {/* NO MEDIA */}

                                {!selectedMedia && (
                                    <div className="text-sm text-[#918f82]">
                                        Product media unavailable
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* MEDIA CAPTION */}

                        <div className="mt-4 flex items-center justify-between gap-3">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9a8061]">
                                Discover the details
                            </p>

                            <p className="text-[10px] text-[#929084]">
                                {product.image?.length || 0} images
                                {product.video ? " · Video available" : ""}
                            </p>
                        </div>
                    </div>

                    {/* RIGHT: PRODUCT INFORMATION */}

                    <div className="min-w-0">
                        <div className="rounded-2xl border border-[#e9e2d5] bg-white p-5 shadow-[0_8px_35px_rgba(56,49,32,0.035)] sm:p-8 lg:p-9">

                            {/* CATEGORY */}

                            <div className="mb-5 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-[#d97732]" />

                                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#a56b39]">
                                    {product.category || "Our Collection"}
                                </p>
                            </div>

                            {/* PRODUCT TITLE */}

                            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-[#294331] sm:text-4xl lg:text-[42px]">
                                {product.name}
                            </h1>

                            <p className="mt-3 text-sm leading-7 text-[#858276]">
                                Discover the details of this carefully selected
                                product from our collection.
                            </p>

                            {/* RATING */}

                            <div className="mt-5 flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    {Array(5)
                                        .fill("")
                                        .map((_, index) => (
                                            <img
                                                key={index}
                                                src={
                                                    index < 4
                                                        ? assets.star_icon
                                                        : assets.star_dull_icon
                                                }
                                                alt=""
                                                className="h-4 w-4"
                                            />
                                        ))}
                                </div>

                                <span className="text-xs font-medium text-[#77766c]">
                                    4.0
                                </span>

                                <span className="text-xs text-[#aaa699]">
                                    (4)
                                </span>
                            </div>

                            <div className="my-7 border-t border-[#eee9df]" />

                            {/* PRICE */}

                            <div>
                                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#929084]">
                                    Product Price
                                </p>

                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-3xl font-bold tracking-tight text-[#294331]">
                                        {currency}
                                        {offerPrice.toFixed(2)}
                                    </span>

                                    {originalPrice > offerPrice && (
                                        <span className="text-base text-[#a4a092] line-through">
                                            {currency}
                                            {originalPrice.toFixed(2)}
                                        </span>
                                    )}

                                    {discount > 0 && (
                                        <span className="rounded-md bg-[#fff0df] px-3 py-1.5 text-[10px] font-bold text-[#bb6b28]">
                                            Save {discount}%
                                        </span>
                                    )}
                                </div>

                                <p className="mt-2 text-[11px] text-[#929084]">
                                    Inclusive of all applicable taxes
                                </p>
                            </div>

                            {/* WEIGHT */}

                            {product.weight && (
                                <div className="mt-6 flex items-center gap-3">
                                    <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#929084]">
                                        Weight / Size
                                    </span>

                                    <span className="rounded-lg border border-[#e9e2d5] bg-[#faf8f2] px-4 py-2 text-xs font-semibold text-[#354b38]">
                                        {product.weight}
                                    </span>
                                </div>
                            )}

                            <div className="my-7 border-t border-[#eee9df]" />

                            {/* ABOUT PRODUCT */}

                            <div>
                                <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-[#294331]">
                                    About This Product
                                </h2>

                                <div className="mt-4 space-y-3">
                                    {descriptions.length > 0 ? (
                                        descriptions.map((desc, index) => (
                                            <div
                                                key={index}
                                                className="flex items-start gap-3"
                                            >
                                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d97732]" />

                                                <p className="text-sm leading-7 text-[#77766c]">
                                                    {desc}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm leading-7 text-[#77766c]">
                                            Product information will be
                                            available soon.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* PRODUCT AVAILABILITY */}

                            <div className="mt-7 flex items-center gap-2 rounded-lg bg-[#f4f7f0] px-4 py-3">
                                <span
                                    className={`h-2 w-2 rounded-full ${
                                        product.inStock
                                            ? "bg-[#638b55]"
                                            : "bg-red-500"
                                    }`}
                                />

                                <p
                                    className={`text-xs font-semibold ${
                                        product.inStock
                                            ? "text-[#4c7045]"
                                            : "text-red-600"
                                    }`}
                                >
                                    {product.inStock
                                        ? "Available for purchase"
                                        : "Currently unavailable"}
                                </p>
                            </div>

                            {/* ACTION BUTTONS */}

                            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <button
                                    type="button"
                                    disabled={!product.inStock}
                                    onClick={() => addToCart(product._id)}
                                    className="rounded-full border border-[#294331] bg-white px-5 py-4 text-xs font-bold uppercase tracking-[0.13em] text-[#294331] transition duration-300 hover:bg-[#f1f5ed] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Add to Cart
                                </button>

                                <button
                                    type="button"
                                    disabled={!product.inStock}
                                    onClick={() => {
                                        addToCart(product._id);
                                        navigate("/cart");
                                        window.scrollTo({
                                            top: 0,
                                            behavior: "smooth",
                                        });
                                    }}
                                    className="rounded-full bg-[#294331] px-5 py-4 text-xs font-bold uppercase tracking-[0.13em] text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:bg-[#1d3425] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Buy Now <span className="ml-2">→</span>
                                </button>
                            </div>

                            {/* TRUST INFORMATION */}

                            <div className="mt-7 border-t border-[#eee9df] pt-5">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-[#65805f]">
                                            ✓
                                        </span>

                                        <span className="text-[10px] font-medium text-[#77766c]">
                                            Secure Shopping
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-[#65805f]">
                                            ✓
                                        </span>

                                        <span className="text-[10px] font-medium text-[#77766c]">
                                            Quality Collection
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* BRAND MESSAGE */}

                        <div className="mt-5 rounded-2xl border border-[#e9e2d5] bg-[#f3f0e7] px-5 py-5 text-center">
                            <p className="text-[10px] font-bold uppercase tracking-[0.23em] text-[#9b713f]">
                                Naturally Thoughtful
                            </p>

                            <p className="mt-2 text-xs leading-6 text-[#77766c]">
                                Thank you for exploring our collection.
                            </p>
                        </div>
                    </div>
                </section>

                {/* RELATED PRODUCTS */}

                {relatedProducts.filter((item) => item.inStock).length > 0 && (
                    <section className="mt-20 border-t border-[#e9e2d5] pt-14 sm:mt-24">
                        <div className="mb-9 flex flex-col items-center text-center">
                            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#a56b39]">
                                You may also like
                            </p>

                            <h2 className="text-3xl font-semibold tracking-tight text-[#294331] sm:text-4xl">
                                Explore Related Products
                            </h2>

                            <div className="mt-4 h-1 w-16 rounded-full bg-[#d97732]" />

                            <p className="mt-4 max-w-md text-sm leading-6 text-[#858276]">
                                Discover more products from the same
                                collection.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5">
                            {relatedProducts
                                .filter((item) => item.inStock)
                                .map((item) => (
                                    <ProductCard
                                        key={item._id}
                                        product={item}
                                    />
                                ))}
                        </div>

                        <div className="mt-12 flex justify-center">
                            <button
                                type="button"
                                onClick={() => {
                                    navigate("/products");
                                    window.scrollTo({
                                        top: 0,
                                        behavior: "smooth",
                                    });
                                }}
                                className="rounded-full border border-[#294331] px-10 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-[#294331] transition hover:bg-[#294331] hover:text-white"
                            >
                                Explore All Products →
                            </button>
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
};

export default ProductDetails;
