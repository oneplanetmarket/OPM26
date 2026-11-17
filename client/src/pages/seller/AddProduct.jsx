
import React, { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { categories } from "../../assets/assets";
import toast from "react-hot-toast";

const MAX_IMAGES = 4;
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;

const AddProduct = () => {
    const { axios } = useAppContext();

    const [files, setFiles] = useState([]);
    const [video, setVideo] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [offerPrice, setOfferPrice] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const imagePreviews = useMemo(
        () => files.map((file) => file ? URL.createObjectURL(file) : null),
        [files]
    );

    const videoPreview = useMemo(
        () => video ? URL.createObjectURL(video) : null,
        [video]
    );

    useEffect(() => {
        return () => {
            imagePreviews.forEach((url) => {
                if (url) URL.revokeObjectURL(url);
            });

            if (videoPreview) URL.revokeObjectURL(videoPreview);
        };
    }, [imagePreviews, videoPreview]);

    const discount = useMemo(() => {
        const original = Number(price);
        const offer = Number(offerPrice);

        if (original > 0 && offer >= 0 && offer < original) {
            return Math.round(((original - offer) / original) * 100);
        }

        return 0;
    }, [price, offerPrice]);

    const handleImageChange = (index, file) => {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image");
            return;
        }

        setFiles((previous) => {
            const updated = [...previous];
            updated[index] = file;
            return updated;
        });
    };

    const removeImage = (index) => {
        setFiles((previous) => previous.filter((_, i) => i !== index));
    };

    const handleVideoChange = (file) => {
        if (!file) return;

        const allowedTypes = [
            "video/mp4",
            "video/quicktime",
            "video/webm"
        ];

        if (!allowedTypes.includes(file.type)) {
            toast.error("Only MP4, MOV and WEBM videos are supported");
            return;
        }

        if (file.size > MAX_VIDEO_SIZE) {
            toast.error("Video must be smaller than 100 MB");
            return;
        }

        setVideo(file);
    };

    const resetForm = () => {
        setFiles([]);
        setVideo(null);
        setName("");
        setDescription("");
        setCategory("");
        setPrice("");
        setOfferPrice("");
        setUploadProgress(0);
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (isSubmitting) return;

        const selectedImages = files.filter(Boolean);

        if (!selectedImages.length) {
            toast.error("Please upload at least one product image");
            return;
        }

        if (!name.trim() || !category || !price || !offerPrice) {
            toast.error("Please complete all required product details");
            return;
        }

        if (Number(price) <= 0 || Number(offerPrice) <= 0) {
            toast.error("Prices must be greater than zero");
            return;
        }

        if (Number(offerPrice) > Number(price)) {
            toast.error("Offer price cannot be higher than original price");
            return;
        }

        try {
            setIsSubmitting(true);
            setUploadProgress(0);

            const productData = {
                name: name.trim(),
                description: description
                    .split("\n")
                    .map((item) => item.trim())
                    .filter(Boolean),
                category,
                price: Number(price),
                offerPrice: Number(offerPrice)
            };

            const formData = new FormData();

            formData.append("productData", JSON.stringify(productData));

            selectedImages.forEach((file) => {
                formData.append("images", file);
            });

            if (video) {
                formData.append("video", video);
            }

            const { data } = await axios.post(
                "/api/product/add",
                formData,
                {
                    withCredentials: true,
                    onUploadProgress: (event) => {
                        if (event.total) {
                            setUploadProgress(
                                Math.round((event.loaded * 100) / event.total)
                            );
                        }
                    }
                }
            );

            if (!data.success) {
                throw new Error(data.message || "Unable to add product");
            }

            toast.success(data.message || "Product added successfully");
            resetForm();

        } catch (error) {
            console.error("ADD PRODUCT ERROR:", error);

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Unable to add product"
            );

        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass =
        "w-full rounded-xl border border-[#e7e1d5] bg-[#fffefa] px-4 py-3.5 text-sm text-[#294331] outline-none transition placeholder:text-[#aaa697] focus:border-[#8a9b7b] focus:ring-4 focus:ring-[#294331]/5";

    const labelClass =
        "mb-2 block text-xs font-semibold uppercase tracking-[0.13em] text-[#596b56]";

    return (
        <main className="no-scrollbar h-[95vh] flex-1 overflow-y-auto bg-[#faf8f2]">
            <div className="mx-auto max-w-5xl space-y-7 p-4 sm:p-7 lg:p-10">

                {/* HEADER */}
                <div className="overflow-hidden rounded-2xl bg-[#294331] p-6 text-white shadow-sm sm:p-8">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div>
                            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#e8bd83]">
                                Sea Buckthorn · Seller Studio
                            </p>

                            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                Add a New Product
                            </h1>

                            <p className="mt-2 max-w-lg text-sm leading-6 text-[#d5dfd3]">
                                Bring your product to life with beautiful
                                photography and a product video.
                            </p>
                        </div>

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-2xl">
                            ✦
                        </div>
                    </div>
                </div>

                <form onSubmit={onSubmitHandler} className="space-y-6">

                    {/* PRODUCT MEDIA */}
                    <section className="rounded-2xl border border-[#e9e2d5] bg-white p-5 shadow-[0_5px_25px_rgba(56,49,32,0.035)] sm:p-7">
                        <div className="mb-6">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b27640]">
                                Step 01 · Visuals
                            </p>

                            <h2 className="mt-1 text-lg font-semibold text-[#294331]">
                                Product Photography
                            </h2>

                            <p className="mt-1 text-xs leading-5 text-[#929084]">
                                Upload up to four images. The first image will
                                be used as the main product image.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {Array.from({ length: MAX_IMAGES }).map((_, index) => (
                                <div key={index} className="relative">
                                    <label
                                        htmlFor={`product-image-${index}`}
                                        className={`group flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition ${
                                            imagePreviews[index]
                                                ? "border-[#d8dfd1] bg-[#fafbf7]"
                                                : "border-[#e5dfd3] bg-[#faf8f2] hover:border-[#8b9d7b] hover:bg-[#f4f6f0]"
                                        }`}
                                    >
                                        {imagePreviews[index] ? (
                                            <img
                                                src={imagePreviews[index]}
                                                alt={`Product preview ${index + 1}`}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <>
                                                <span className="mb-2 text-3xl text-[#829477]">
                                                    +
                                                </span>
                                                <span className="text-xs font-semibold text-[#536b53]">
                                                    Add Photo
                                                </span>
                                                <span className="mt-1 text-[10px] text-[#a19d90]">
                                                    Image {index + 1}
                                                </span>
                                            </>
                                        )}
                                    </label>

                                    <input
                                        id={`product-image-${index}`}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(event) => {
                                            handleImageChange(
                                                index,
                                                event.target.files?.[0]
                                            );
                                            event.target.value = "";
                                        }}
                                    />

                                    {imagePreviews[index] && (
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#294331] text-sm text-white shadow-md transition hover:bg-red-600"
                                            aria-label="Remove image"
                                        >
                                            ×
                                        </button>
                                    )}

                                    {index === 0 && (
                                        <span className="mt-2 block text-center text-[9px] font-bold uppercase tracking-wider text-[#b27640]">
                                            Main Image
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* VIDEO UPLOAD */}
                        <div className="mt-8 border-t border-[#eee9df] pt-7">
                            <div className="mb-4">
                                <p className="text-sm font-semibold text-[#294331]">
                                    Product Video
                                    <span className="ml-2 text-[10px] font-medium text-[#a19d90]">
                                        Optional
                                    </span>
                                </p>

                                <p className="mt-1 text-xs text-[#929084]">
                                    MP4, MOV or WEBM · Maximum 100 MB
                                </p>
                            </div>

                            {videoPreview ? (
                                <div className="relative max-w-xl overflow-hidden rounded-xl border border-[#e9e2d5] bg-black">
                                    <video
                                        src={videoPreview}
                                        controls
                                        playsInline
                                        className="max-h-80 w-full object-contain"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setVideo(null)}
                                        className="absolute right-3 top-3 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-red-600 shadow"
                                    >
                                        Remove video
                                    </button>
                                </div>
                            ) : (
                                <label
                                    htmlFor="product-video"
                                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#e5dfd3] bg-[#faf8f2] px-5 py-9 text-center transition hover:border-[#8b9d7b] hover:bg-[#f4f6f0]"
                                >
                                    <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#e9efe4] text-xl text-[#456345]">
                                        ▶
                                    </span>

                                    <span className="text-sm font-semibold text-[#354b38]">
                                        Upload product video
                                    </span>

                                    <span className="mt-1 text-xs text-[#929084]">
                                        Select a video from your device
                                    </span>
                                </label>
                            )}

                            <input
                                id="product-video"
                                type="file"
                                accept="video/mp4,video/quicktime,video/webm"
                                className="hidden"
                                onChange={(event) => {
                                    handleVideoChange(event.target.files?.[0]);
                                    event.target.value = "";
                                }}
                            />
                        </div>
                    </section>

                    {/* PRODUCT INFORMATION */}
                    <section className="rounded-2xl border border-[#e9e2d5] bg-white p-5 shadow-[0_5px_25px_rgba(56,49,32,0.035)] sm:p-7">
                        <div className="mb-6">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b27640]">
                                Step 02 · Details
                            </p>

                            <h2 className="mt-1 text-lg font-semibold text-[#294331]">
                                Product Information
                            </h2>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className={labelClass} htmlFor="product-name">
                                    Product Name *
                                </label>

                                <input
                                    id="product-name"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    placeholder="Enter product name"
                                    className={inputClass}
                                    maxLength={120}
                                    required
                                />
                            </div>

                            <div>
                                <label className={labelClass} htmlFor="product-description">
                                    Product Description
                                </label>

                                <textarea
                                    id="product-description"
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                    rows={5}
                                    placeholder={"Describe your product...\nAdd each key point on a new line."}
                                    className={`${inputClass} resize-y`}
                                />

                                <p className="mt-1.5 text-right text-[10px] text-[#aaa697]">
                                    Each new line becomes a separate product detail
                                </p>
                            </div>

                            <div>
                                <label className={labelClass} htmlFor="product-category">
                                    Product Category *
                                </label>

                                <select
                                    id="product-category"
                                    value={category}
                                    onChange={(event) => setCategory(event.target.value)}
                                    className={inputClass}
                                    required
                                >
                                    <option value="">Select a category</option>

                                    {categories.map((item, index) => (
                                        <option key={index} value={item.path}>
                                            {item.path}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* PRICING */}
                    <section className="rounded-2xl border border-[#e9e2d5] bg-white p-5 shadow-[0_5px_25px_rgba(56,49,32,0.035)] sm:p-7">
                        <div className="mb-6">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b27640]">
                                Step 03 · Pricing
                            </p>

                            <h2 className="mt-1 text-lg font-semibold text-[#294331]">
                                Set Your Price
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className={labelClass} htmlFor="product-price">
                                    Original Price (₹) *
                                </label>

                                <input
                                    id="product-price"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={price}
                                    onChange={(event) => setPrice(event.target.value)}
                                    placeholder="0.00"
                                    className={inputClass}
                                    required
                                />
                            </div>

                            <div>
                                <label className={labelClass} htmlFor="product-offer-price">
                                    Selling Price (₹) *
                                </label>

                                <input
                                    id="product-offer-price"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={offerPrice}
                                    onChange={(event) => setOfferPrice(event.target.value)}
                                    placeholder="0.00"
                                    className={inputClass}
                                    required
                                />
                            </div>
                        </div>

                        {discount > 0 && (
                            <div className="mt-5 flex items-center justify-between rounded-xl border border-[#e3eadc] bg-[#f4f7f0] px-4 py-3">
                                <div>
                                    <p className="text-xs font-semibold text-[#456345]">
                                        Customer discount
                                    </p>
                                    <p className="mt-1 text-[10px] text-[#829078]">
                                        Calculated from your entered prices
                                    </p>
                                </div>

                                <span className="rounded-full bg-[#294331] px-4 py-2 text-sm font-bold text-white">
                                    {discount}% OFF
                                </span>
                            </div>
                        )}
                    </section>

                    {/* SUBMIT */}
                    <section className="rounded-2xl border border-[#e9e2d5] bg-white p-5 shadow-sm sm:p-7">
                        {isSubmitting && (
                            <div className="mb-5">
                                <div className="mb-2 flex justify-between text-xs text-[#536b53]">
                                    <span>Uploading product media...</span>
                                    <span>{uploadProgress}%</span>
                                </div>

                                <div className="h-2 overflow-hidden rounded-full bg-[#edf0e9]">
                                    <div
                                        className="h-full rounded-full bg-[#294331] transition-all"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <p className="text-sm font-semibold text-[#294331]">
                                    Ready to publish?
                                </p>
                                <p className="mt-1 text-xs text-[#929084]">
                                    Review your details before adding this product.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="rounded-full bg-[#294331] px-9 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#1d3425] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSubmitting ? "Uploading..." : "Publish Product →"}
                            </button>
                        </div>
                    </section>
                </form>
            </div>
        </main>
    );
};

export default AddProduct;
