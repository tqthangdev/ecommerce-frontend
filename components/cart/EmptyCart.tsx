import EmptyState from "@/components/ui/EmptyState";

export default function EmptyCart() {
    return (
        <EmptyState
            title="Your cart is empty"
            description="Add some products to your cart."
            actionLabel="Continue Shopping"
            actionHref="/products"
        />
    );
}