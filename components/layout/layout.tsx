import MessageBanner from "./messageBanner";
import Footer from "./footer";
import Header from "./header";

const Layout = ({ children }: any) => {
  return (
    <>
      <Header />
      <main className="px-5 min-h-screen pt-16 max-w-[1000px] mx-auto">{children}</main>
      <MessageBanner />
      <Footer />
    </>
  )
}

export default Layout;