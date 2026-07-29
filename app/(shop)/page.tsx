import Link from "next/link";


export default function Home() {


    return (

        <main>


            <section
                className="
bg-gradient-to-br
from-gray-900
to-gray-700
text-white
"
            >


                <div
                    className="
max-w-7xl
mx-auto
px-6
py-32
"
                >


                    <h1
                        className="
text-6xl
font-black
max-w-3xl
"
                    >

                        Build Your
                        Modern Lifestyle

                    </h1>


                    <p
                        className="
mt-6
text-xl
text-gray-300
max-w-xl
"
                    >

                        Premium smartphones,
                        laptops and accessories.

                    </p>



                    <Link

                        href="/products"

                        className="
inline-block
mt-10
bg-white
text-black
px-8
py-4
rounded-full
font-bold
hover:scale-105
transition
"

                    >

                        Shop Now

                    </Link>


                </div>


            </section>


        </main>

    );

}