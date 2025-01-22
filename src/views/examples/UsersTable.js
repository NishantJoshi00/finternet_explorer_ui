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
    <Card className="shadow">
      <CardHeader className="border-0">
        <h3 className="mb-0">Account Information</h3>
      </CardHeader>
      <CardBody>
        <Table responsive hover className="align-items-center">
          <thead>
            <tr>
              <th>Path</th>
              <th>Driver Name</th>
              <th>Version</th>
              <th>Account Info</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <React.Fragment key={item.path}>
                <tr>
                  <td>
                    <span className="text-primary">{item.path}</span>
                  </td>
                  <td>
                    <Badge color="info" className="badge-lg">
                      {item.driverName}
                    </Badge>
                  </td>
                  <td>
                    <Badge color="success" className="badge-lg">
                      v{item.driverVersion}
                    </Badge>
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
                      <div className="bg-light p-3">
                        <h6 className="mb-3">Detailed Account Information:</h6>
                        <pre className="mb-0">
                          {JSON.stringify(parseAccountInfo(item.accountInfo), null, 2)}
                        </pre>
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

export default AccountInfoTable;