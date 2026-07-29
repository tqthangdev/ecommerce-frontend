type Props = {
  title:string;
  value:string;
};

export default function DashboardCard({
  title,
  value,
}:Props){

  return (
    <div className="
      rounded-xl
      border
      bg-white
      p-6
    ">
      <p className="text-gray-500">
        {title}
      </p>

      <h2 className="
        mt-3
        text-3xl
        font-bold
      ">
        {value}
      </h2>
    </div>
  );
}