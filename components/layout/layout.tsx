import Footer from "./footer/footer";
import Header from "./header/header";

const Layout = ({ children }: any) => {
  return (
    <>
      <Header />
      <main className="px-5 min-h-screen pt-16">{children}</main>
      <Footer />
    </>
  )
}

export default Layout;