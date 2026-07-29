"use client";

import {
    useState,
} from "react";

import {
    useRouter,
} from "next/navigation";

import {
    useCartStore,
} from "@/stores/cart.store";



export default function CheckoutForm() {


    const router =
        useRouter();


    const clear =
        useCartStore(
            (state) => state.clear
        );



    const [form, setForm] =
        useState({

            fullName: "",

            email: "",

            phone: "",

            address: "",

        });



    function handleChange(
        e: React.ChangeEvent<HTMLInputElement>
    ) {

        setForm({

            ...form,

            [e.target.name]:
                e.target.value,

        });

    }



    function handleSubmit(
        e: React.FormEvent
    ) {

        e.preventDefault();


        clear();


        router.push(
            "/checkout/success"
        );

    }



    return (

        <form
            onSubmit={handleSubmit}
            className="
        space-y-5
        rounded-xl
        border
        p-6
      "
        >


            <h2
                className="
          text-xl
          font-bold
        "
            >
                Shipping Information
            </h2>



            <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Full name"
                required
                className="
          w-full
          rounded
          border
          p-3
        "
            />



            <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="
          w-full
          rounded
          border
          p-3
        "
            />



            <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone number"
                required
                className="
          w-full
          rounded
          border
          p-3
        "
            />



            <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address"
                required
                className="
          w-full
          rounded
          border
          p-3
        "
            />



            <button
                type="submit"
                className="
          w-full
          rounded-lg
          bg-black
          py-3
          font-semibold
          text-white
        "
            >
                Place Order
            </button>


        </form>

    );

}