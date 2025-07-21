import React, { useState, useEffect } from 'react';
import AdminLayout from '../AdminLayout';
import MetaData from '../MetaData';
import toast from "react-hot-toast";
import Loader from "../Loader";
import { MDBDataTable } from "mdbreact";
import { useLazyGetProductReviewsQuery } from '../../redux/api/productsApi';

const ProductReviews = () => {
  const [productId, setProductId] = useState("");
  const [reviewsData, setReviewsData] = useState([]);

  const [getProductReviews, { isLoading, error, data }] = useLazyGetProductReviewsQuery();

  useEffect(() => {
    if (error) toast.error(error?.data?.message);
    if (data?.reviews) {
      console.log("Fetched reviews:", data.reviews);
      setReviewsData(data.reviews);
    }
  }, [error, data]);

  const setReviews = () => {
    const reviews = {
      columns: [
        { label: "Review ID", field: "id", sort: "asc" },
        { label: "Rating", field: "rating", sort: "asc" },
        { label: "Comment", field: "comment", sort: "asc" },
        { label: "User", field: "user", sort: "asc" },
        { label: "Actions", field: "actions", sort: "asc" },
      ],
      rows: [],
    };

    reviewsData.forEach((review) => {
      reviews.rows.push({
        id: `${review?._id?.substring(0, 10)}...`,
        rating: review?.rating,
        comment: review?.comment,
        user: review?.user,
        actions: (
          <button className="btn btn-outline-danger ms-2">
            <i className="fa fa-trash"></i>
          </button>
        ),
      });
    });

    return reviews;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!productId.trim()) {
      toast.error("Please enter a product ID");
      return;
    }
    getProductReviews(productId);
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <AdminLayout>
        <MetaData title={"Product Reviews"} />
        <div className="row justify-content-center my-5">
          <div className="col-6">
            <form onSubmit={submitHandler}>
              <div className="mb-3">
                <label htmlFor="productId_field" className="form-label">
                  Enter Product ID
                </label>
                <input
                  type="text"
                  id="productId_field"
                  className="form-control"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                />
              </div>

              <button
            id="search_button"
            type="submit"
            className="btn btn-primary w-100 py-2"
          >
            SEARCH
          </button>
            </form>
          </div>
        </div>

        {reviewsData.length > 0 ? (
          <>
            <h5 className="mt-3 text-center">
              Product ID: <b>{productId}</b>
            </h5>
            <MDBDataTable
              data={setReviews()}
              className="px-3"
              bordered
              striped
              hover
            />
          </>
        ):(
           <center><b>No Product Reviews </b></center> 
        )}
      </AdminLayout>
    </>
  );
};

export default ProductReviews;
