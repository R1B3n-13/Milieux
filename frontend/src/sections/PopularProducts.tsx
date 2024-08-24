
import ProductCard from "@/components/ProductCard"
import { products } from "@/constants"

const PopularProducts = () => {

    return (
        <div>
            {/* <h1 className="text-8xl">Popular Products</h1> */}
            <section id="products" className="max-container max-sm:mt-12">
                <div className="flex flex-col justify-start gap-5">
                    <h2 className="text-4xl font-palanquin font-bold text-slate-gray">Our <span className="text-coral-red">Popular</span> Products</h2>
                    <p className="lg:max-w-lg mt-2 font-montserrat text-slate-gray">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat placeat sint ullam, distinctio explicabo facilis mollitia cumque ratione accusamus nemo magnam eligendi et officiis consequuntur? Error ex eveniet dolore obcaecati?</p>
                </div>

                <div className="mt-16 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-14">
                    {
                        products.map((product)=>(
                            <ProductCard key={product.name} {...product} />
                        ))
                    }

                </div>
            </section>
        </div>
    )
}

export default PopularProducts