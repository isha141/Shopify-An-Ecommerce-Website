import React, { useState } from 'react'
import './AddProduct.css';
import uploadArea from '../../assets/upload_area.svg';
// import upload from '../../../../Ecommerce_Admin_Panel_Assets/Admin Panel Assets/upload_cloud_icon.svg';

const AddProduct = () => {
  const [image,setImage]=useState(false); 
  const [ProductDetails,SetProductDetails]=useState({
    name:"",
    category:"women",
    image:"",
    new_price:0,
    old_price:0, 
  });
  const imageHandler=(e)=>{ 
     setImage(e.target.files[0]);
  }
  const ProductHandler=(e)=>{ 
     SetProductDetails({...ProductDetails,[e.target.name]:e.target.value})
  } 
  const Add_Product=async()=>{ 
      //  console.log(ProductDetails); 
      // data is sent to the backened and when we get any message we will get the image url by using upload end point  
      // and get the data to store on the eeb page  
      let responseData;
      let product=ProductDetails;

      let formData=new FormData();
      formData.append('product',image);

      await fetch('http://localhost:4000/upload',{
        method:'POST',
        headers:{
          Accept:'application/json',
        },
        body:formData,
      }).then((response)=>response.json()).then((data)=>{responseData=data})    

      if(responseData.success){
         product.image=responseData.image_url;
         console.log(product);   
         await fetch('http://localhost:4000/addproduct',{
           method:'POST',
           headers:{
             Accept:'application/json',
             'Content-Type':'application/json',
          }, 
          body:JSON.stringify(product) , 
         }).then((response)=>response.json()).then((data)=>{
            data.success?alert("Product Added"):alert("Failed");
         })
      }  
  }
  return (
    <div className='add-product'>
       <div className="add-product-items-feilds">
         <p>Product Title</p>
         <input value={ProductDetails.name} onChange={ProductHandler} type="text" name="name" placeholder='Type here ' />
       </div> 
       <div className="add-product-price">
          <div className="add-product-items-feilds">
           <p>Price</p>
            <input value={ProductDetails.old_price} onChange={ProductHandler} type="text" name="old_price"  placeholder='Type Here'/>
          </div>
          <div className="add-product-items-feilds">
           <p>Offer Price</p>
            <input  value={ProductDetails.new_price} onChange={ProductHandler} type="text" name="new_price"  placeholder='Type Here'/>
          </div>
       </div> 
      <div className="add-product-items-feilds">
           <p>Product Category</p> 
           <select category={ProductDetails.category} onChange={ProductHandler}  name="category" className='addProduct-Selector'>
            <option value="kid">Kids</option>
            <option value="Women">Women</option>
            <option value="men">Men</option>
            <option value="men">Beauty</option>
           </select> 
      </div>
      <div className="addProduct-item-Feild">
          <label htmlFor="fileInput"> 
          <img src={image?URL.createObjectURL(image):uploadArea} className='addproduct_thumbnail_image' alt="" srcset="" />
          </label>
          <input onChange={imageHandler} type="file" name="image" id="fileInput" hidden/>
      </div>
      <button className='AddProductButton' onClick={Add_Product}> ADD</button>
    </div>
  )
}

export default AddProduct
