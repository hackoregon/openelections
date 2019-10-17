/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
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

const Action = ({ action, data }) => (
  <WithAdminPermissions>
    <Button
      onClick={event => action.onClick(event, data)}
      buttonType={action.buttonType}
    >
      {action.name}
    </Button>
  </WithAdminPermissions>
);

const ManagePortalPage = ({
  isUserListLoading,
  userList,
  showModal,
  history,
}) => {
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
                  onClick={() => showModal({ component: 'AddUser' })}
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
                    history.push({
                      pathname: '/settings/manage-user',
                      state: rowData,
                    });
                  },
                },
              ]}
              components={{
                Action,
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

ManagePortalPage.propTypes = {
  isUserListLoading: PropTypes.bool,
  userList: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  history: PropTypes.oneOfType([PropTypes.object]),
  showModal: PropTypes.func,
};

Action.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array]),
  action: PropTypes.oneOfType([PropTypes.object]),
};
