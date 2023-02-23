import Footer from "./footer/footer";
import Header from "./header/header";

const Layout = ({ children }: any) => {
  return (
    <body className="text-lg">
      <Header />
      <main className="px-5 min-h-screen pt-16">{children}</main>
      <Footer />
    </body>
  )
}

export default Layout;