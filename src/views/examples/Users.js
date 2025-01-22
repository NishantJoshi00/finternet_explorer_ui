import {getResolverList} from '../../grpcClient'
import { useEffect, useState } from "react";
import AccountInfoTable from './UsersTable'

const Users = () => {
  const [userList, setUserList] = useState([])
  const fetchUsers = async () => {
    try {
      const usersList = await getResolverList()
      console.log(usersList)
      const {pathMappingList} = usersList
      setUserList(pathMappingList)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <>
      <h1 style={{background: "white", textAlign: "center"}}>Users</h1>
      {Array.isArray(userList) && userList.length && <AccountInfoTable data={userList}/>}
    </>
  );
};

export default Users;
