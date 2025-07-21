import React, { useEffect, useState } from "react";
import { useGetProductDetailsQuery } from "../../redux/api/productsApi.js";
import StarRatings from "react-star-ratings";
import Loader from "../Loader";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCartItem } from "../../redux/features/cartSlice.js";
import NewReview from "../reviews/NewReview.jsx";
import MetaData from "../MetaData.jsx";
import ListReviews from "../reviews/ListReviews.jsx";
const ProductDetails = () => {
  const [activeImg, setActiveImg] = useState("");
  const [quantity, setQuantity] = useState(1);

  const params = useParams();
  const dispatch = useDispatch();
  const { data, isLoading, error,isError } = useGetProductDetailsQuery(
    params?.id
  );
  const product = data?.product;
  const {isAuthenticated}=useSelector((state)=>state.auth);

  useEffect(() => {
    setActiveImg(
      product?.images[0]
        ? product?.images[0]?.url
        : "/images/default_product.png"
    );
  }, [product]);

  useEffect(() => {
    if (isError) {
      const errorMessage = error?.data?.message;
      toast.error(errorMessage);
    }
  }, [isError,error]);

  const increaseQty = () => {
    if (quantity >= product.stock) return;
    setQuantity((prevQty) => prevQty + 1);
  };

  const decreaseQty = () => {
    if (quantity <= 1) return;
    setQuantity((prevQty) => prevQty - 1);
  };

  const setItemToCart = () => {
    const cartItem = {
      product: product?._id,
      name: product?.name,
      price: product?.price,
      image: product?.images[0]?.url,
      stock: product?.stock,
      quantity,
    };

    dispatch(setCartItem(cartItem));
    toast.success("Items Added Succesfully");
  };

  if (isLoading) return <Loader />;

  return (
    <>
    <MetaData title={"Product Details"}/>
    <div className="row d-flex justify-content-around">
      <div className="col-12 col-lg-5 img-fluid" id="product_image">
        <div className="p-3">
          <img
            className="d-block w-100"
            src={activeImg}
            alt={product?.name}
            width="340"
            height="390"
          />
        </div>
        <div className="row justify-content-start mt-5">
          {product?.images?.map((img) => (
            <div className="col-2 ms-4 mt-2">
              <a role="button">
                <img
                  className={`d-block border rounded p-3 cursor-pointer ${
                    img.url === activeImg ? "border-warning" : ""
                  }`}
                  height="100"
                  width="100"
                  src={img?.url}
                  alt={img?.url}
                  onClick={() => setActiveImg(img.url)}
                />
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="col-12 col-lg-5 mt-5">
        <h3>{product?.name}</h3>
        <p id="product_id">Product #{`${product?._id}`}</p>

        <hr />

        <div className="d-flex">
          <div className="star-ratings">
            <StarRatings
              rating={product?.ratings}
              starRatedColor="#ffb829"
              numberOfStars={5}
              name="rating"
              starDimension="24px"
            />
          </div>
          <span id="no-of-reviews" className="pt-1 ps-2">
            {" "}
            ({`${product?.numOfReviews}`}){" "}
          </span>
        </div>
        <hr />

        <p id="product_price">{product?.price}</p>
        <div className="stockCounter d-inline">
          <span className="btn btn-danger minus" onClick={decreaseQty}>
            -
          </span>
          <input
            type="number"
            className="form-control count d-inline"
            value={quantity}
            readOnly
          />
          <span className="btn btn-primary plus" onClick={increaseQty}>
            +
          </span>
        </div>
        <button
          type="button"
          id="cart_btn"
          className="btn btn-primary d-inline ms-4"
          disabled={product.stock <= 0}
          onClick={setItemToCart}
        >
          Add to Cart
        </button>

        <hr />

        <p>
          Status:{" "}
          <span
            id="stock_status"
            className={product?.stock > 0 ? "greenColor" : "redColor"}
          >
            {product?.stock > 0 ? "In Stock" : "Out of stock"}
          </span>
        </p>

        <hr />

        <h4 className="mt-2">Description:</h4>
        <p>{product?.description}</p>
        <hr />
        <p id="product_seller mb-3">
          .Sold by: <strong>{product?.seller}</strong>
        </p>
        {isAuthenticated ?
        <NewReview productId={product?._id}/>:(
          <div className="alert alert-danger my-5" type="alert">
          Login to post your review.
        </div>
        )
      }
        
      </div>
    </div>
    {product?.reviews?.length>0 && <ListReviews reviews={product?.reviews}/>}
    </>
  );
};

export default ProductDetails;
