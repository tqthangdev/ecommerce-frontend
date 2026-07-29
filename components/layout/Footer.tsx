import Link from "next/link";


export default function Footer() {

    return (

        <footer className="border-t bg-gray-950 text-gray-300">


            <div
                className="
          mx-auto
          grid
          max-w-7xl
          grid-cols-1
          gap-10
          px-6
          py-12
          md:grid-cols-4
        "
            >


                {/* Brand */}

                <div>

                    <h2 className="
            mb-4
            text-2xl
            font-bold
            text-white
          ">
                        Ecommerce
                    </h2>


                    <p className="
            text-sm
            leading-6
            text-gray-400
          ">
                        Nền tảng mua sắm trực tuyến.
                        Cung cấp sản phẩm chất lượng,
                        trải nghiệm nhanh chóng và tiện lợi.
                    </p>


                </div>




                {/* Shop */}

                <div>

                    <h3 className="
            mb-4
            font-semibold
            text-white
          ">
                        Shop
                    </h3>


                    <ul className="space-y-3 text-sm">


                        <li>
                            <Link
                                href="/products"
                                className="
                  transition
                  hover:text-white
                "
                            >
                                Products
                            </Link>
                        </li>


                        <li>
                            <Link
                                href="/cart"
                                className="
                  transition
                  hover:text-white
                "
                            >
                                Cart
                            </Link>
                        </li>


                        <li>
                            <Link
                                href="/checkout"
                                className="
                  transition
                  hover:text-white
                "
                            >
                                Checkout
                            </Link>
                        </li>


                    </ul>


                </div>





                {/* Account */}

                <div>


                    <h3 className="
            mb-4
            font-semibold
            text-white
          ">
                        Account
                    </h3>



                    <ul className="space-y-3 text-sm">


                        <li>

                            <Link
                                href="/login"
                                className="
                  transition
                  hover:text-white
                "
                            >
                                Login
                            </Link>

                        </li>



                        <li>

                            <Link
                                href="/register"
                                className="
                  transition
                  hover:text-white
                "
                            >
                                Register
                            </Link>

                        </li>



                    </ul>


                </div>





                {/* Contact */}

                <div>


                    <h3 className="
            mb-4
            font-semibold
            text-white
          ">
                        Contact
                    </h3>



                    <ul className="
            space-y-3
            text-sm
            text-gray-400
          ">


                        <li>
                            Email:
                            support@ecommerce.com
                        </li>


                        <li>
                            Phone:
                            0123 456 789
                        </li>


                        <li>
                            Ho Chi Minh City, Vietnam
                        </li>


                    </ul>


                </div>



            </div>





            <div
                className="
          border-t
          border-gray-800
          py-5
          text-center
          text-sm
          text-gray-500
        "
            >

                © {new Date().getFullYear()}
                Ecommerce.
                All rights reserved.

            </div>


        </footer>

    );

}