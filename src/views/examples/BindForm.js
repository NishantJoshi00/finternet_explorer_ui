"use client";

import { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    Spinner,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Textarea
} from "reactstrap";
import { getDriverList, bindUser } from '../../grpcClient'
// import { JsonPrettifier } from "./JsonPrettify";

const BindForm = ({ drivers }) => {
    const [driverName, setDriverName] = useState("");
    const [driverVersion, setDriverVersion] = useState("");
    const [path, setPath] = useState("");
    const [accountInfo, setAccountInfo] = useState("");
    const [loading, setLoading] = useState(false);
    const [output, setOutput] = useState(null);
    const [driverList, setDriverList] = useState(["No Token Handler"]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await bindUser(driverName, driverVersion, path, accountInfo);
            console.log(res)
            window.location.href = '/admin/users'
        } catch (error) {
            setOutput("An error occurred while binding the driver.");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setOutput(null);
        setDriverName("");
        setDriverVersion("");
        setPath("");
        setAccountInfo("");
    };

    const fetchDrivers = async () => {
        try {
          const driverList = await getDriverList()
          const { driverDataList } = driverList
          console.log(driverDataList)
          // setTokenList([...driverDataList, {
          //   name: "mono2",
          //   version: "0.1.0"
          // },{
          //   name: "mono3",
          //   version: "0.1.0"
          // }
          // ])
          setDriverList(driverDataList.map(driver => driver.name))
        } catch (error) {
          console.log(error)
        }
        
      }
    
      useEffect(() => {
        fetchDrivers()
      }, [])

    return (
        <Card className="shadow">
            <CardHeader>
                <h3>User Onboarding</h3>
            </CardHeader>
            <CardBody>
                {loading ? (
                    <div className="text-center my-4">
                        <Spinner style={{ width: "3rem", height: "3rem" }} />
                    </div>
                ) : output ? (
                    <div>
                        {/* <JsonPrettifier output={output} /> */}
                        <Button color="primary" onClick={resetForm} className="mt-3">
                            Add Asset Account
                        </Button>
                    </div>
                ) : (
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="driverName">Token Type</Label>
                            <Dropdown className="driverSelectForm" isOpen={dropdownOpen} toggle={toggleDropdown}>
                                <DropdownToggle caret>
                                    {driverName || "Select Type"}
                                </DropdownToggle>
                                <DropdownMenu>
                                    {driverList.map((driver) => (
                                        <DropdownItem key={driver} onClick={() => setDriverName(driver)}>
                                            {driver}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        </FormGroup>

                        <FormGroup>
                            <Label for="version">Driver Version</Label>
                            <Input
                                id="version"
                                value={driverVersion}
                                onChange={(e) => setDriverVersion(e.target.value)}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="path">Token Path</Label>
                            <Input
                                id="path"
                                value={path}
                                onChange={(e) => setPath(e.target.value)}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="accountInfo">Account Info</Label>
                            <Input
                                type="textarea"
                                id="accountInfo"
                                value={accountInfo}
                                onChange={(e) => setAccountInfo(e.target.value)}
                                required
                            />
                            <small className="text-muted">
                                The input is passed to the WebAssembly module as a JSON.
                            </small>
                        </FormGroup>

                        <Button type="submit" color="primary">
                            Onboard
                        </Button>
                    </Form>
                )}
            </CardBody>
        </Card>
    );
}

export default BindForm;