import { Planned } from '@/components/planned';

export const metadata = { title: 'Cart' };

export default function CartPage() {
  return (
    <Planned
      title="Cart"
      description="CubeCom Pro does not host a cart. It emits an identity your cart can accept."
      ships={false}
      contract="On valid resolve, pass sku or variantReference plus cartPayloadJson into your commerce add-to-cart. CubeCom Pro will not create line items, hold sessions, or take payment. A hosted cart helper is not on the current API."
      related={[
        { href: '/guides/add-to-cart', label: 'Add-to-cart' },
        { href: '/platform/commerce', label: 'Commerce resolution' },
      ]}
    />
  );
}
