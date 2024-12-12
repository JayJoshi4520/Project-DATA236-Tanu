const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const SidebarContainer = styled.div`
  width: 250px;
  background: #1A1A1A;
  border-right: 1px solid #303030;
`;

const MainContent = styled.div`
  flex: 1;
  background: #141414;
  padding: 24px;
`;

const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>
      <MainContent>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout; 