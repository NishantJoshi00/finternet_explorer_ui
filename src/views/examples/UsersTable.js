import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Button,
  Collapse
} from 'reactstrap';

const UsersTable = ({ data }) => {
  const [expandedRows, setExpandedRows] = useState({});
  const [users, setUsers] = useState([]);
  const [groupedData, setGroupedData] = useState({});

  useEffect(() => {
    // Load users from localStorage
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  useEffect(() => {
    // Group the data by username and match drivers with user suffixes
    const grouped = {};
    
    // First, organize localStorage users
    users.forEach(user => {
      grouped[user.username] = {
        username: user.username,
        bindings: user.bindings || [],
        id: user.id
      };
    });

    // Then, process gRPC data and match by suffix
    data.forEach(item => {
    console.log(item);
      const accountInfo = parseAccountInfo(item.accountInfo);
      const path_fragments = item.path.split("/");
      const username = path_fragments[2];

      
      // Find matching user by suffix
      const matchingUser = Object.values(grouped).find(user => 
        item.driverName.toLowerCase().endsWith(user.username.toLowerCase())
      );

      if (matchingUser) {
        // Add to existing user's bindings
        grouped[matchingUser.username].bindings.push({
          ...item,
          accountInfo: accountInfo
        });
      } else if (!grouped[username]) {
        // Create new user entry if no match found
        grouped[username] = {
          username: username,
          bindings: [{
            ...item,
            accountInfo: accountInfo
          }]
        };
      } else {
        // Add to existing user's bindings
        grouped[username].bindings.push({
          ...item,
          accountInfo: accountInfo
        });
      }
    });

    setGroupedData(grouped);
  }, [data, users]);

  const toggleRow = (username) => {
    setExpandedRows(prev => ({
      ...prev,
      [username]: !prev[username]
    }));
  };

  const parseAccountInfo = (info) => {
    try {
      return JSON.parse(info);
    } catch (e) {
      return { error: 'Invalid JSON', name: 'Unknown', amount: 0 };
    }
  };

  const getUnitId = (username) => {
    return username ? `${username}@myunits` : 'N/A';
  };

  const navigateToBindForm = (username) => {
    localStorage.setItem('selectedUser', username);
    window.location.href = '/admin/users/bind';
  };

  return (
    <Card className="shadow users mx-auto" style={{ maxWidth: '90%', minWidth: '800px' }}>
      <CardHeader className="border-0">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Users</h3>
          <Button 
            className='navigateToBindCTA' 
            color="primary" 
            onClick={() => window.location.href = '/admin/users/add'}
          >
            Add User
          </Button>
        </div>
      </CardHeader>
      <CardBody>
        <Table responsive hover className="align-items-center">
          <thead>
            <tr>
              <th>Units ID</th>
              <th>User Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedData).map(([username, userData]) => (
              <React.Fragment key={username}>
                <tr>
                  <td>
                    <span className="text-primary">
                      {getUnitId(username)}
                    </span>
                  </td>
                  <td>{username}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        color="primary"
                        size="sm"
                        onClick={() => navigateToBindForm(username)}
                      >
                        Link Account
                      </Button>
                      <Button
                        color="info"
                        size="sm"
                        onClick={() => toggleRow(username)}
                      >
                        {expandedRows[username] ? 'Hide Accounts' : 'Show Accounts'}
                      </Button>
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => {
                          const updatedUsers = users.filter(user => user.username !== username);
                          localStorage.setItem('users', JSON.stringify(updatedUsers));
                          setUsers(updatedUsers);
                        }}
                      >
                        Delete User
                      </Button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colSpan="5" className="p-0">
                    <Collapse isOpen={expandedRows[username]}>
                      <div className='sub-table-container'>
                        <Table responsive hover className="align-items-center sub-table">
                          <thead>
                            <tr>
                              <th>Token Driver Name</th>
                              <th>Version</th>
                              <th>Path</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userData.bindings.map((binding, index) => (
                              <tr key={binding.path || index}>
                                <td>
                                  <Badge color="info" className="badge-lg">
                                    {binding.driverName}
                                  </Badge>
                                </td>
                                <td>
                                  <Badge color="success" className="badge-lg">
                                    {binding.driverVersion}
                                  </Badge>
                                </td>
                                <td>
                                  <span className="text-primary">{binding.path || 'Not set'}</span>
                                </td>
                              </tr>
                            ))}
                            {userData.bindings.length === 0 && (
                              <tr>
                                <td colSpan="4" className="text-center">
                                  No bindings available
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>
                    </Collapse>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default UsersTable;
