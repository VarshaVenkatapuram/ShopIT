import React, { useEffect } from "react";
import { useMyOrdersQuery } from "../../redux/api/orderApi";
import toast from "react-hot-toast";
import Loader from "../Loader";
import {MDBDataTable} from "mdbreact";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import MetaData from "../MetaData";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/features/cartSlice";
const MyOrders = () => {
  const { data, isLoading, error } = useMyOrdersQuery();
  const dispatch=useDispatch();
  const [searchParams]=useSearchParams();
  const navigate=useNavigate();

  const orderSuccess=searchParams.get("order_success");

  useEffect(() => {
    if (error) toast.error(error?.data?.message);

    if(orderSuccess)
    {
        dispatch(clearCart());
        navigate("/me/orders")
    }
  }, [error,orderSuccess,dispatch,navigate]);

  const setOrders = () => {
  const tableData = {
    columns: [
      { label: "ID", field: "id", sort: "asc" },
      { label: "Amount", field: "amount", sort: "asc" },
      { label: "Payment Status", field: "status", sort: "asc" },
      { label: "Order Status", field: "orderStatus", sort: "asc" },
      { label: "Actions", field: "actions", sort: "asc" },
    ],
    rows: [],
  };

  data?.orders?.forEach((order) => {
    tableData.rows.push({
      id: order?._id,
      amount: order?.totalAmount,
      status: order?.paymentInfo?.status?.toUpperCase(),
      orderStatus: order?.orderStatus,
      actions: (
        <>
          <Link to={`/me/order/${order?._id}`} className="btn btn-primary">
            <i className="fa fa-eye"></i>
          </Link>
          <Link to={`/me/invoice/order/${order?._id}`} className="btn btn-success ms-2">
            <i className="fa fa-print"></i>
          </Link>
        </>
      ),
    });
  });

  return tableData;
};


  if (isLoading) return <Loader />;
  return (
    <>
    <MetaData title={"My Order"}/>
        <div>
      <h1 className="my-5">{data?.orders?.length} Orders</h1>
      <MDBDataTable 
      data={setOrders()}
      className="px-3"
      bordered
      striped
      hover
      />
    </div>
    </>
  );
};

export default MyOrders;
