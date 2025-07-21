import React, { useEffect } from "react";
import toast from "react-hot-toast";
import Loader from "../Loader";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";
import MetaData from "../MetaData";
import AdminLayout from "../AdminLayout.jsx";
import { useDeleteUserMutation, useGetAdminUsersQuery } from "../../redux/api/userApi.js";


const ListUsers = () => {
  const { data, isLoading, error } = useGetAdminUsersQuery();

  const [deleteUser,{isLoading:isDeleteLoading,error:deleteError,isSuccess}] =useDeleteUserMutation();

  useEffect(() => {
    if (error) toast.error(error?.data?.message);

   if(deleteError) toast.error(deleteError?.data?.message);

    if(isSuccess) toast.success("Order Deleted");
  }, [error,isSuccess,deleteError]);

  const deleteUserHandler=(id)=>{
    deleteUser(id);
  }

  const setUsers = () => {
    const users = {
      columns: [
        { label: "ID", field: "id", sort: "asc" },
        { label: "Name", field: "name", sort: "asc" },
        { label: "Email", field: "email", sort: "asc" },
        { label: "Role", field: "role", sort: "asc" },
        { label: "Actions", field: "actions", sort: "asc" },
      ],
      rows: [],
    };

    data?.users?.forEach((user) => {
      users.rows.push({
        id: `${user?._id?.substring(0,10)}...`,
        name: user?.name,
        email: `${user?.email?.substring(0,10)}...`,
        role:user?.role,
        actions: (
          <>
            <Link to={`/admin/users/${user?._id}`} className="btn btn-outline-primary">
              <i className="fa fa-pencil"></i>
            </Link>
            <button className="btn btn-outline-danger ms-2" 
            disabled={isDeleteLoading}
            onClick={()=>deleteUserHandler(user?._id)}
            >
              <i className="fa fa-trash"></i>
            </button>
          </>
        ),
      });
    });

    return users;
  };

  if (isLoading) return <Loader />;

  return (
    
<AdminLayout>
      <MetaData title={"All Users"} />
      <div>
        <h1 className="my-5">{data?.users?.length} Users</h1>
        <MDBDataTable
          data={setUsers()}
          className="px-3"
          bordered
          striped
          hover
        />
      </div>
    </AdminLayout>

  );
};

export default ListUsers;
