import React, { useEffect, useRef, useState } from 'react';
import AdminLayout from '../AdminLayout';
import MetaData from '../MetaData';
import { useParams, useNavigate } from 'react-router-dom';
import { useDeleteProductImagesMutation, useGetProductDetailsQuery, useUpdateProductImagesMutation } from '../../redux/api/productsApi';
import toast from 'react-hot-toast';

const UploadImages = () => {
const params = useParams();
const navigate = useNavigate();

  const [uploadProductImages, { isLoading, error, isSuccess }] = useUpdateProductImagesMutation(params?.id);
  const { data } = useGetProductDetailsQuery(params?.id);

 const [deleteProductImages,{isLoading:isDeleteLoading,error:deleteError}]= useDeleteProductImagesMutation();

  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [uploadImages, setUploadImages] = useState([]);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (data?.product) {
      setUploadImages(data.product.images);
    }
    if (error) toast.error(error?.data?.message);
    if (isSuccess) {
      toast.success("Images Uploaded");
      navigate("/admin/products");
    }
    if(deleteError)
    {
      toast.error(deleteError?.data?.message);
    }
  }, [data, navigate, error, isSuccess,deleteError]);

  const onChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagesPreview(previews);
  };

  const handleImagePreviewDelete = (image) => {
    const filteredPreviews = imagesPreview.filter((img) => img !== image);
    const filteredFiles = images.filter((file) => URL.createObjectURL(file) !== image);

    setImagesPreview(filteredPreviews);
    setImages(filteredFiles);
  };

  const handleResetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });

    uploadProductImages({ id: params?.id, body: formData });
  };
  
  const deleteImage=(imgId)=>{
    deleteProductImages({id:params?.id,body:{imgId}})
  }

  return (
    <>
      <AdminLayout>
        <MetaData title={"Upload Images"} />
        <div className="row wrapper">
          <div className="col-10 col-lg-8 mt-5 mt-lg-0">
            <form
              className="shadow rounded bg-body"
              encType="multipart/form-data"
              onSubmit={submitHandler}
            >
              <h2 className="mb-4">Upload Product Images</h2>

              <div className="mb-3">
                <label htmlFor="customFile" className="form-label">Choose Images</label>
                <div className="custom-file">
                  <input
                    ref={fileInputRef}
                    type="file"
                    name="product_images"
                    className="form-control"
                    id="customFile"
                    multiple
                    onChange={onChange}
                    onClick={handleResetFileInput}
                  />
                </div>

                {imagesPreview.length > 0 && (
                  <div className="new-images my-4">
                    <p className="text-warning">New Images:</p>
                    <div className="row mt-4">
                      {imagesPreview.map((img, index) => (
                        <div className="col-md-3 mt-2" key={index}>
                          <div className="card">
                            <img
                              src={img}
                              alt="Preview"
                              className="card-img-top p-2"
                              style={{ width: "100%", height: "80px" }}
                            />
                            <button
                              style={{ backgroundColor: "#dc3545", borderColor: "#dc3545" }}
                              type="button"
                              className="btn btn-block btn-danger cross-button mt-1 py-0"
                              onClick={() => handleImagePreviewDelete(img)}
                            >
                              <i className="fa fa-times"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="uploaded-images my-4">
                  <p className="text-success">Product Uploaded Images:</p>
                  <div className="row mt-1">
                    {uploadImages.map((img, index) => (
                      <div className="col-md-3 mt-2" key={index}>
                        <div className="card">
                          <img
                            src={img?.url}
                            alt="Uploaded"
                            className="card-img-top p-2"
                            style={{ width: "100%", height: "80px" }}
                          />
                          <button
                            style={{ backgroundColor: "#dc3545", borderColor: "#dc3545" }}
                            className="btn btn-block btn-danger cross-button mt-1 py-0"
                            disabled={isLoading||isDeleteLoading}
                            type="button"
                            onClick={()=>deleteImage(img?.public_id)}
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                id="register_button"
                type="submit"
                className="btn w-100 py-2"
                disabled={isLoading||isDeleteLoading}
              >
                {isLoading ? "Uploading..." : "Upload"}
              </button>
            </form>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default UploadImages;
