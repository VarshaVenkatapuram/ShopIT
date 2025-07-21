import React, { useEffect } from 'react';
import MetaData from './MetaData.jsx';
import {useGetProductsQuery} from '../redux/api/productsApi.js';
import Loader from './Loader.jsx';
import ProductItem from './product/ProductItem.jsx';
import toast from 'react-hot-toast';
import CustomPagination from './CustomPagination.jsx';
import {  useSearchParams } from 'react-router-dom';
import Filters from './Filters.jsx';

const Home = () => {
  let [searchParams]=useSearchParams();
   

    const page=Number(searchParams.get("page"))||1;
    const keyword=searchParams.get("keyword")||"";
    const min=searchParams.get("min");
    const max=searchParams.get("max");
    const category=searchParams.get("category");
    const ratings=searchParams.get("rattings");

    
    const params={page,keyword};

    min!==null && (params.min=min);
    max!==null && (params.max=max);
    category!==null &&(params.category=category);
    ratings!==null && (params.ratings=ratings);

   const {data,isLoading,error,isError}=useGetProductsQuery(params);
   console.log(data);
   console.log("resPerPage:", data?.resPerPage);
console.log("filteredProductsCount:", data?.filteredProducts);

   
useEffect(() => {
  if (isError) {
    const errorMessage = error?.data?.message;
    toast.error(errorMessage);
  }
}, [isError, error?.data?.message]);

const columnSize=keyword?4:3

  if(isLoading) return <Loader/>
  
  return (
    <>
    <MetaData title="Buy best Products Online"/>
    <div className="row">
      {keyword && (
        <div className="col-6 col-md-3 mt-5">
          <Filters/>
          </div>
      )}
        <div className={keyword?"col-6 col-md-9":"col-6 col-md-12"}>

          <h1 id="products_heading" className="text-secondary">
            {keyword?
            `${data?.products?.length} Products found with keyword : ${keyword}`:"Latest Products"}
          </h1>

          <section id="products" className="mt-5">
            <div className="row">
              {data?.products?.map((product)=>(
                <ProductItem product={product}
                columnSize={columnSize}/>
              ))}
              
            </div>
          </section>

          <CustomPagination
          resPerPage={data?.resPerPage}
          filteredProductsCount={data?.filteredProducts}/>
        </div>
      </div>
      </>
  )
}

export default Home