import React, { useEffect, useState } from 'react'
import MetaData from '../MetaData'
import { useNavigate, useParams } from 'react-router-dom';
import { useGetUserDetailsQuery, useUpdateUserMutation } from '../../redux/api/userApi';

import toast from 'react-hot-toast';

const UpdateUser = () => {
    const [name, setName] = useState("");
      const [email, setEmail] = useState("");
      const [role, setRole] = useState("");
    
      const navigate = useNavigate();
      const params=useParams();

    const {data}=  useGetUserDetailsQuery(params?.id);

   

    const [updateUser,{error,isSuccess}]=useUpdateUserMutation();
    
      useEffect(() => {
        if (data?.user) {
          setName(data?.user.name);
          setEmail(data?.user.email);
          setRole(data?.user?.role);
        }
    
        if (error) {
          toast.error(error?.data?.message);
        }
        if (isSuccess) {
          toast.success("User Updated");
          navigate("/admin/users");
        }
      }, [data, error, isSuccess, navigate]);
    
      const submitHandler = (e) => {
        e.preventDefault();
    
        const userData = {
          email,
          name,
          role,
        };
        updateUser({id:params?.id,body :userData});
      };
  return (
    <>
    <MetaData title={"Update User"}/>
    <div className="row wrapper">
      <div className="col-10 col-lg-8">
        <form className="shadow-lg"
        onSubmit={submitHandler}>
          <h2 className="mb-4">Update User</h2>

          <div className="mb-3">
            <label htmlFor="name_field" className="form-label">Name</label>
            <input
              type="name"
              id="name_field"
              className="form-control"
              name="name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email_field" className="form-label">Email</label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              name="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="role_field" className="form-label">Role</label>
            <select id="role_field" className="form-select" name="role" value={role}
            onChange={(e)=>setRole(e.target.value)}>
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>

          <button type="submit" className="btn update-btn w-100 py-2">
            Update
          </button>
        </form>
      </div>
    </div>
    </>
  )
}

export default UpdateUser