import DashboardCard from "@/components/admin/DashboardCard";

export default function AdminDashboard(){

  return (
    <div>

      <h1 className="
        mb-8
        text-3xl
        font-bold
      ">
        Dashboard
      </h1>


      <div className="
        grid
        gap-6
        md:grid-cols-2
        xl:grid-cols-4
      ">

        <DashboardCard
          title="Products"
          value="120"
        />


        <DashboardCard
          title="Orders"
          value="356"
        />


        <DashboardCard
          title="Users"
          value="1,250"
        />


        <DashboardCard
          title="Revenue"
          value="250.000.000 ₫"
        />

      </div>


      <section className="
        mt-10
        rounded-xl
        border
        bg-white
        p-6
      ">

        <h2 className="
          text-xl
          font-bold
        ">
          Recent Orders
        </h2>


        <p className="mt-4 text-gray-500">
          No orders yet
        </p>


      </section>


    </div>
  );
}