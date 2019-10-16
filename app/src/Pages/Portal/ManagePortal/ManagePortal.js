import React from 'react';
import PageHoc from '../../../components/PageHoc/PageHoc';
import Button from '../../../components/Button/Button';
import Table from '../../../components/Table';
import WithAdminPermissions from '../../../components/WithAdminPermissions';

const columnInfo = [
  {
    title: 'First Name',
    field: 'firstName',
  },
  {
    title: 'Last Name',
    field: 'lastName',
  },
  {
    title: 'Title',
    field: 'title',
  },
  {
    title: 'Email',
    field: 'email',
  },
  {
    title: 'Role',
    field: 'role',
  },
  {
    title: 'Status',
    field: 'userStatus',
  },
];

const ManagePortalPage = ({ isUserListLoading, userList, ...props }) => {
  const isLoading = isUserListLoading && !Array.isArray(userList);
  return (
    <PageHoc>
      <h1>Settings</h1>
      <div className="manage-portal-container">
        <div className="manage-users-container">
          <div className="manage-users-table">
            <Table
              isLoading={isLoading}
              title={`Users (${isLoading ? 'Loading' : userList.length})`}
              columns={columnInfo}
              data={isLoading ? [{}] : userList}
              localization={{
                body: {
                  emptyDataSourceMessage: 'No Users',
                },
              }}
              options={{
                search: false,
                actionsCellStyle: {
                  color: 'blue',
                },
                actionsColumnIndex: -1,
                pageSize: 10,
              }}
              toolbarAction={
                <Button
                  buttonType="primary"
                  onClick={() => props.showModal({ component: 'AddUser' })}
                >
                  Add New User
                </Button>
              }
              actions={[
                {
                  icon: 'none', // icon is needed here or it will error.
                  name: 'Manage',
                  buttonType: 'manage',
                  onClick: (event, rowData) => {
                    props.history.push({
                      pathname: '/settings/manage-user',
                      state: rowData,
                    });
                  },
                },
              ]}
              components={{
                Action: props => (
                  <WithAdminPermissions>
                    <Button
                      onClick={event => props.action.onClick(event, props.data)}
                      buttonType={props.action.buttonType}
                    >
                      {props.action.name}
                    </Button>
                  </WithAdminPermissions>
                ),
              }}
            />
          </div>
        </div>
        <div className="manage-labels" />
      </div>
    </PageHoc>
  );
};
export default ManagePortalPage;
