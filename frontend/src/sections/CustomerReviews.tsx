import ReviewCard from "@/components/ReviewCard"
import { reviews } from "@/constants"

const CustomerReviews = () =>   {

    return (
        <section className="max-container pt-12">
            <h3 className="font-palanquin text-center text-4xl font-bold"> <span className="text-coral-red">Customer</span> reviews</h3>
            <p className="info-text m-auto mt-4 max-w-lg text-center">Hear genuine stories from our customers</p>

            <div className="mt-24 flex flex-1 justify-evenly items-center max-lg:flex-col gap-14">
                {reviews.map((review) => (
                    <ReviewCard key={review.customerName} imgurl={review.imgURL} rating={review.rating} feedback={review.feedback} customerName={review.customerName} />
                ))}
            </div>
        </section>
    )
}

export default CustomerReviews