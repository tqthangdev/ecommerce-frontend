import Link from "next/link";

const menus = [
  {
    name: "Dashboard",
    href: "/admin",
  },
  {
    name: "Products",
    href: "/admin/products",
  },
  {
    name: "Categories",
    href: "/admin/categories",
  },
  {
    name: "Brands",
    href: "/admin/brands",
  },
  {
    name: "Orders",
    href: "/admin/orders",
  },
  {
    name: "Users",
    href: "/admin/users",
  },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 border-r bg-white p-5">

      <h1 className="mb-8 text-xl font-bold">
        E-Shop Admin
      </h1>

      <nav className="space-y-2">
        {menus.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="
              block rounded-lg px-4 py-2
              hover:bg-gray-100
            "
          >
            {item.name}
          </Link>
        ))}
      </nav>

    </aside>
  );
}