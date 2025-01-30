import React, { useState } from 'react';
import {
  Table,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Button,
  Collapse
} from 'reactstrap';

const AccountInfoTable = ({ data }) => {
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (path) => {
    setExpandedRows(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const parseAccountInfo = (info) => {
    try {
      return JSON.parse(info);
    } catch (e) {
      return { error: 'Invalid JSON' };
    }
  };

  return (
    <Card className="shadow users">
      <CardHeader className="border-0">
        <h3 className="mb-0">Users</h3>
        <Button className='navigateToBindCTA' color="primary" type="submit" block  onClick={() => window.location.href = '/admin/users/bind'}>
          Bind
        </Button>
      </CardHeader>
      <CardBody>
        <Table responsive hover className="align-items-center">
          <thead>
            <tr>
              <th>Units ID</th>
              <th>User Name</th>
              <th>Account Info</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const paths = item.path.split("/")

              const unitData = paths[paths.length - 1] + "@units";
              console.log(JSON.parse(item.accountInfo).amount)
              return (
                <React.Fragment key={item.path}>
                  <tr>
                    <td>
                      <span className="text-primary">{unitData}</span>
                    </td>
                    <td>
                      {parseAccountInfo(item.accountInfo).name}
                    </td>
                    <td>
                      <Button
                        color="primary"
                        size="sm"
                        onClick={() => toggleRow(item.path)}
                      >
                        {expandedRows[item.path] ? 'Hide Details' : 'Show Details'}
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="5" className="p-0">
                      <Collapse isOpen={expandedRows[item.path]}>
                        <div className='sub-table-container'>
                          <Table responsive hover className="align-items-center sub-table">
                            <thead>
                              <tr>
                                <th>Driver Name</th>
                                <th>Version</th>
                                <th>Path</th>
                                <th>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  <Badge color="info" className="badge-lg">
                                    {item.driverName}
                                  </Badge>
                                </td>
                                <td>
                                  <Badge color="success" className="badge-lg">
                                    {item.driverVersion}
                                  </Badge>
                                </td>
                                <td>
                                  <span className="text-primary">{item.path}</span>
                                </td>
                                <td>
                                  <span className="text-primary">{parseAccountInfo(item.accountInfo).amount}</span>
                                </td>
                              </tr>
                            </tbody>
                          </ Table>
                        </div>
                      </Collapse>
                    </td>
                  </tr>
                </React.Fragment>
              )
            })}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default AccountInfoTable;