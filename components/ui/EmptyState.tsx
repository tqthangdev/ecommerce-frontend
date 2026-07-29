type Props = {
    title: string;
    description?: string;
};



export default function EmptyState({
    title,
    description,
}: Props) {


    return (

        <div
            className="
        py-20
        text-center
      "
        >

            <h2
                className="
          text-2xl
          font-bold
        "
            >
                {title}
            </h2>



            {description && (

                <p
                    className="
            mt-3
            text-gray-500
          "
                >
                    {description}
                </p>

            )}


        </div>

    );

}