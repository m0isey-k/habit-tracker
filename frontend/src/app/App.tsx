import Router from "./Router"
import Layout from "../components/Layout"
import ThemeInitializer from "./ThemeInitializer"

export default function App() {
  return (
    <>
      <ThemeInitializer />
      <Layout>
        <Router />
      </Layout>
    </>
  )
}
