import CheckoutForm from "@/components/checkout/CheckoutForm";


export default function CheckoutPage() {


    return (

        <main
            className="
        mx-auto
        max-w-3xl
        px-4
        py-10
      "
        >

            <h1
                className="
          mb-8
          text-3xl
          font-bold
        "
            >
                Checkout
            </h1>



            <CheckoutForm />

        </main>

    );

}