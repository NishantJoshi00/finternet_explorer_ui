import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem,
  Badge
} from 'reactstrap';

const SupportTokenDetails = ({data}) => {

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <h3 className="mb-0">Driver Details</h3>
      </CardHeader>
      <CardBody>
        <ListGroup flush>
          {data.map((driver, index) => (
            <ListGroupItem key={index} className="border-0">
              <div className="d-flex align-items-center">
                <i className="fas fa-circle text-primary mr-3" style={{ fontSize: '8px' }}></i>
                <div>
                  <div className="mb-1">
                    <span className="mr-2">Driver Name:</span>
                    <Badge color="info" className="px-3">
                      {driver.name}
                    </Badge>
                  </div>
                  <div>
                    <span className="mr-2">Version:</span>
                    <Badge color="success" className="px-3">
                      v{driver.version}
                    </Badge>
                  </div>
                </div>
              </div>
            </ListGroupItem>
          ))}
        </ListGroup>
      </CardBody>
    </Card>
  );
};

export default SupportTokenDetails;