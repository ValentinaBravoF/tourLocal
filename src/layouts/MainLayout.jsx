import HeaderBar from "../components/HeaderBar/HeaderBar";

export default function MainLayout({ children, title = "TourLocal" }) {
  return (
    <>
      <HeaderBar title={title} />
      <main>{children}</main>
    </>
  );
}
