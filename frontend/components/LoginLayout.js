import Head from "next/head";

export default function LoginLayout({ children, title = "Toko Baju" }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Aplikasi Penjualan Baju" />
      </Head>
      <main className="min-h-screen bg-gray-100">{children}</main>
    </>
  );
}
