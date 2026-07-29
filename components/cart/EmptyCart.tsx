import Link from "next/link";


export default function EmptyCart() {

    return (

        <div
            className="
        py-20
        text-center
      "
        >

            <h2
                className="
          text-3xl
          font-bold
        "
            >
                Your cart is empty
            </h2>


            <p
                className="
          mt-3
          text-gray-500
        "
            >
                Add some products to your cart.
            </p>



            <Link
                href="/products"
                className="
          mt-6
          inline-block
          rounded-lg
          bg-black
          px-6
          py-3
          text-white
        "
            >
                Continue Shopping
            </Link>


        </div>

    );

}