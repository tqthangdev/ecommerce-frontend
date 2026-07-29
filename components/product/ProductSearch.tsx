"use client";

import {
    useRouter,
    useSearchParams,
} from "next/navigation";

import { useState } from "react";


export default function ProductSearch() {

    const router = useRouter();

    const searchParams = useSearchParams();


    const [keyword, setKeyword] = useState(
        searchParams.get("keyword") ?? ""
    );


    function searchProduct() {

        const params =
            new URLSearchParams(
                searchParams.toString()
            );


        if (keyword) {
            params.set(
                "keyword",
                keyword
            );
        } else {
            params.delete("keyword");
        }


        params.set(
            "page",
            "1"
        );


        router.push(
            `/products?${params.toString()}`
        );

    }



    return (

        <div className="flex gap-2">


            <input
                value={keyword}
                onChange={(e) =>
                    setKeyword(
                        e.target.value
                    )
                }
                onKeyDown={(e) => {

                    if (e.key === "Enter") {
                        searchProduct();
                    }

                }}
                placeholder="Search products..."
                className="
          rounded
          border
          px-4
          py-2
        "
            />


            <button
                onClick={searchProduct}
                className="
          rounded
          bg-black
          px-4
          py-2
          text-white
        "
            >
                Search
            </button>


        </div>

    );
}