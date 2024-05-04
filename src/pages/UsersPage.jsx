import PageHeader from '../components/PageHeader';

const UsersPage = () => {
  return (
    <>
      <PageHeader
        title="USERS"
        hasGenerateReport={() => {
          console.log('Generate Report of users');
        }}
        hasCreate={() => {
          console.log('Create user');
        }}
      />
    </>
  );
};
export default UsersPage;
