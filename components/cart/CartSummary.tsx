"use client";


import Link from "next/link";


import {
    useCartStore,
} from "@/stores/cart.store";



export default function CartSummary() {


    const items =
        useCartStore(
            (state) => state.items
        );



    const total =
        items.reduce(
            (sum, item) =>
                sum +
                (item.variant?.price ?? item.product.effectivePrice) *
                item.quantity,

            0
        );



    return (

        <div
            className="
        rounded-xl
        border
        p-6
      "
        >


            <h2
                className="
          mb-5
          text-xl
          font-bold
        "
            >
                Order Summary
            </h2>



            <div
                className="
          flex
          justify-between
          text-lg
        "
            >

                <span>
                    Total
                </span>


                <span
                    className="
            font-bold
            text-red-600
          "
                >
                    {total.toLocaleString("vi-VN")} ₫
                </span>


            </div>




            <Link
                href="/checkout"
                className="
          mt-6
          block
          rounded-lg
          bg-black
          py-3
          text-center
          text-white
        "
            >
                Checkout
            </Link>


        </div>

    );

}