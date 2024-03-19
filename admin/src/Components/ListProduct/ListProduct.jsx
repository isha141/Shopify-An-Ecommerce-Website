import React, { useState,useEffect } from 'react'
import './ListProduct.css'; 
import cross_icon from '../../assets/cart_cross_icon.png';
const ListProduct = () => { 
  
  const [allProducts,SetAllProducts]=useState([]);
  
  const fetchInfo=async()=>{
       await fetch('http://localhost:4000/allproducts')
       .then((res)=>res.json())
       .then((data)=>{SetAllProducts(data)}); 
       console.log(allProducts);
  }
  const removeProduct=async(id)=>{
       await fetch('http://localhost:4000/removeproduct',{
           method:'POST',
           headers:{
             Accept:'application/json',
             'Content-Type':'application/json',
           },
           body:JSON.stringify({id:id})
       })
       await fetchInfo();
  }
  useEffect(()=>{
      fetchInfo();
  },[]);
  return (
    <div className="listProduct">
        <h1>All Products List</h1> 
        <div className="list-product-main">
         <p>Product</p>
         <p>Title</p>
         <p>Old Price</p>
         <p>New Price</p>
         <p>Category </p>
         <p>Remove</p>
        </div> 
        <div className="list-product-all_product">
          <hr className="underline" />
           {allProducts && allProducts.map((product,index)=>{
                return <><div key={index} className="list-product-main   list-product-format">
                    <img src={product.image} alt="" className="list-product-product-icon" />
                    <p>{product.name}</p> 
                    <p>Rs. {product.old_price}</p>
                    <p>Rs.{product.new_price}</p>
                    <p>{product.category}</p>
                    <img src={cross_icon} onClick={()=>{removeProduct(product.id)}} className='cross_icon' alt="" srcset="" />
                </div> 
                <hr />
                </>
           })}
        </div>
    </div>
  )
}

export default ListProduct
