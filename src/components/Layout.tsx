import Header from './Header.tsx';

const Layout = ({children}:any) => {
  return (
    <>
      <Header />
      <div className='mt-12 container'>
        {children}
      </div>
    </>
  );
};

export default Layout;