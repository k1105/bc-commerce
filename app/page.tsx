// app/page.tsx
import {ProductProvider} from "components/product/product-context";
import {getProducts} from "../lib/shopify";
import type {Product} from "../lib/shopify/types";
// 商品詳細ページや商品一覧内
import {AddToCart} from "components/cart/add-to-cart";

export default async function HomePage() {
  const products: Product[] = await getProducts({});

  return (
    <ProductProvider>
      <div>
        <h1>商品一覧</h1>
        <ul>
          {products.map((product, index) => (
            <div key={index}>
              <ProductItem product={product} />
            </div>
          ))}
        </ul>
      </div>
    </ProductProvider>
  );
}

function ProductItem({product}: {product: Product}) {
  return (
    <div>
      {/* 商品情報の表示 */}
      <h2>{product.title}</h2>
      {/* 他の商品の詳細情報 */}
      <AddToCart product={product} />
    </div>
  );
}
