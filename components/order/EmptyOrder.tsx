import EmptyState from "@/components/ui/EmptyState";

export default function EmptyOrder() {
  return (
    <EmptyState
      title="No orders yet"
      description="You haven't placed any orders."
      actionLabel="Start Shopping"
      actionHref="/products"
    />
  );
}
