import { useEffect, useState } from "react";
import { getDriverList } from "../grpcClient";
import SupportTokenDetails from "./SupportTokenDetails";

const SupportTokens = () => {
  const [tokenList, setTokenList] = useState([])
  const fetchDriverList = async () => {
    try {
      const driverList = await getDriverList()
      const {driverDataList} = driverList
      console.log(driverDataList)
      // setTokenList([...driverDataList, {
      //   name: "mono2",
      //   version: "0.1.0"
      // },{
      //   name: "mono3",
      //   version: "0.1.0"
      // }
      // ])
      setTokenList(driverDataList)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchDriverList()
  }, [])

  return (
    <>
      <h1 style={{ background: "white", textAlign: "center" }}>Supported Tokens</h1>
     {Array.isArray(tokenList) && tokenList.length && <SupportTokenDetails data={tokenList}/>}
    </>)
};

export default SupportTokens;