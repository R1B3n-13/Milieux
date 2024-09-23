"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useStoreContext } from "@/contexts/StoreContext";
import { useShoppingCart } from "@/contexts/ShoppingCartContext"; // Import the context hook
import ReviewCard from "@/components/ReviewCard";
import dotenv from "dotenv";
import ShoppingCartContainer from "@/components/ShoppingCartContainer";
import { useRouter } from "next/navigation"; // Import useRouter
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@headlessui/react";
import { ScrollArea } from "@/components/ui/scroll-area";

dotenv.config();

interface Product {
	id: number;
	imgurl: string;
	name: string;
	price: number; // Ensure price is a number
	description: string;
}

interface ProductPageProps {
	params: {
		id: string;
	};
}

const ProductPage: React.FC<ProductPageProps> = ({ params }) => {
	const { id } = params;

	const { storeInfo, loggedUserInfo, authToken } = useStoreContext();
	const { addToCart } = useShoppingCart(); // Access the context
	const router = useRouter(); // Initialize router

	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [reviews, setReviews] = useState<any[]>([]);

	const PORT = process.env.ECOMM_BACKEND_URL || "http://localhost:8082/api";

	const [rating, setRating] = useState(4);
	const [open, setOpen] = useState(false);
	const [reviewText, setReviewText] = useState("");


	useEffect(() => {
		if (storeInfo) {
			// console.log("Store Info: ", storeInfo);
			
		   fetchProduct();
		   fetchReviews();

		   console.log("reviews: ", reviews);
		   
		}
	 }, [storeInfo]);
	 
	const fetchProduct = async () => {
		try {
			const res = await fetch(PORT + `/product/find/${id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authToken}`,
				},
			});
			if (!res.ok) {
				throw new Error("Product not found");
			}

			const data: Product = await res.json();
			setProduct(data);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};
	const fetchReviews = async () => {
		try {
			const res = await fetch(`${PORT}/reviews/product/${id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authToken}`,
				},
			});
			if (!res.ok) {
				throw new Error("Failed to fetch reviews");
			}
			const data = await res.json();
			setReviews(data);
		} catch (err) {
			console.error("Error fetching reviews:", err);
		}
	};

	const generateReviewId = () => {
		return Math.floor(Math.random() * 1000);
	};

	const handleSubmitReview = async () => {
		const reviewData = {
			id: generateReviewId(),
			product_id: product?.id,
			user_id: loggedUserInfo.id,
			user_name: loggedUserInfo.name,
			user_image: loggedUserInfo.dp,
			rating: rating,
			review: reviewText,
		};

		try {
			const response = await fetch(`${PORT}/reviews/create`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authToken}`,
				},
				body: JSON.stringify(reviewData),
			});

			if (response.ok) {
				console.log("Review submitted successfully");
				setReviews((prevReviews) => [...prevReviews, reviewData]);
				setOpen(false);
			} else {
				console.error("Failed to submit review");
			}
		} catch (error) {
			console.error("Error submitting review:", error);
		}
	};

	if (loading) {
		return <p>Loading...</p>;
	}

	if (error || !product) {
		return <p>{error || "Product not found"}</p>;
	}

	const handleAddToCart = () => {
		if (product) {
			const productToAdd = {
				id: product.id,
				name: product.name,
				price: product.price,
				quantity: 1, // Default quantity when adding to cart
				imageSrc: product.imgurl,
				imageAlt: product.name,
			};
			addToCart(productToAdd);
		}
	};

	const handleBuyNow = () => {
		if (product) {
			const productToAdd = {
				id: product.id,
				name: product.name,
				price: product.price,
				quantity: 1, // Default quantity when adding to cart
				imageSrc: product.imgurl,
				imageAlt: product.name,
			};
			addToCart(productToAdd);
			router.push("/orders"); // Navigate to orders page after adding to cart
		}
	};

	return (
		<>
			<ShoppingCartContainer />
			<div className="flex flex-col h-full">
				<div className="flex flex-row items-start justify-center w-full gap-12 py-[100px] min-h-[100%]">
					<Image
						src={product.imgurl}
						alt={product.name}
						height={500}
						width={500}
					/>

					<div className="flex flex-col gap-2 font-montserrat w-[650px] min-h-[100%]">
						<div className="min-h-[50%]">
							<p
								className="text-4xl font-semibold"
								style={{ color: storeInfo.ui_accent_color }}
							>
								{product.name}
							</p>
							<p className="font-bold text-xl">{product.price.toFixed(2)}</p>
							<p>{product.description}</p>
							<div className="flex gap-2 w-full">
								<Button
									variant="outline"
									className={`text-white font-bold my-4 w-1/5 ${storeInfo.ui_accent_color ? "" : "bg-blue-800"
										} hover:bg-blue-700 hover:text-white`}
									style={{
										backgroundColor: storeInfo.ui_accent_color || undefined,
									}}
									onClick={handleBuyNow} // Handle Buy Now
								>
									Buy Now!
								</Button>
								<Button
									variant="ghost"
									className="bg-gray-200 text-black font-bold my-4 w-1/5 hover:bg-gray-300"
									onClick={handleAddToCart} // Handle Add to Cart
								>
									Add to cart
								</Button>
							</div>
						</div>

						<div className="relative gap-2 w-full items-start ">
							<h3 className="font-semibold text-2xl">Reviews</h3>
							<div className="flex py-2">
								<Dialog open={open} onOpenChange={setOpen}>
									<DialogTrigger asChild>
										<Button
											variant="ghost"
											className="bg-blue-800 text-white font-bold py-2 hover:bg-blue-700 hover:text-white"
										>
											Write a Review
										</Button>
									</DialogTrigger>

									<DialogContent className="sm:max-w-[425px]">
										<DialogHeader>
											<DialogTitle>Write a review</DialogTitle>
											<DialogDescription>
												Click confirm to upload your review.
											</DialogDescription>
										</DialogHeader>

										<div className="flex flex-col gap-4 py-4 w-full">
											<div className="flex flex-col gap-4">
												<div className="flex justify-between items-center gap-4 mx-2">
													<Label htmlFor="rating" className="text-right">
														Rating
													</Label>
													<div className="relative w-[70%]">
														<div className="absolute top-[-25px] left-0 right-0 flex justify-between text-sm text-gray-500">
															<span>1</span>
															<span>2</span>
															<span>3</span>
															<span>4</span>
															<span>5</span>
														</div>
														<Slider
															id="rating"
															defaultValue={[rating]}
															max={5}
															step={1}
															className="relative z-10 h-2"
															onValueChange={(value) => setRating(value[0])}
														/>
													</div>
												</div>

												<div className="flex flex-col gap-2 items-start">
													<Label htmlFor="review" className="text-right">
														Review
													</Label>
													<Textarea
														id="review"
														placeholder="Write your review here"
														value={reviewText}
														onChange={(e) => setReviewText(e.target.value)}
														className="w-full h-24 border-[1.5px] border-gray-200"
													/>
												</div>
											</div>

											<DialogFooter>
												<Button type="submit" onClick={handleSubmitReview}>
													Submit
												</Button>
											</DialogFooter>
										</div>
									</DialogContent>
								</Dialog>
							</div>
							<ScrollArea className="h-[470px] w-full">
								<div className="flex flex-col gap-2 p-4">
									{reviews.length === 0 ? (
										<p className="pt-2">This Product has no reviews</p>
									) : (
										reviews.map((review) => (
											<ReviewCard key={review.id} review={review} />
										))
									)}
								</div>
							</ScrollArea>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ProductPage;
