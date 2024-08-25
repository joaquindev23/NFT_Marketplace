import ScrollToTop from '@/hocs/components/ScrollToTop';

export default function Layout({ children }) {
  return (
    <>
      <ScrollToTop />
      {children}
    </>
  );
}
