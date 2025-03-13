import {CartProvider} from "components/cart/cart-context";
import CartModal from "components/cart/modal";
import {GeistSans} from "geist/font/sans";
import {getCart} from "lib/shopify";
import {baseUrl} from "lib/utils";
import {ReactNode} from "react";
import "./globals.css";

const {SITE_NAME} = process.env;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
};

export default async function RootLayout({children}: {children: ReactNode}) {
  // カートの状態を取得するPromiseを作成
  const cartPromise = getCart();

  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        <CartProvider cartPromise={cartPromise}>
          <CartModal />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
