import React, { useEffect, useState } from "react";
import { FiXCircle } from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  productDetails,
  updateProduct,
} from "../../redux/slices/adminProductSlice";
import Loading from "../Common/Loading";
import axios from "axios";
import { toast } from "sonner";
import { fetchShopManager, updateShopManager } from "../../redux/slices/shopManagerSlice";

const ShopManager = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { shopManager, loading } = useSelector((state) => state.shopManager);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    categories: [],
    contact: {
      meta: "",
      instagram: "",
      x: "",
      tiktok: "",
    },
    heroImage: "",
    slogan: "",
    announcement: "",
  });

  useEffect(() => {
    dispatch(fetchShopManager());
  }, [dispatch]);

  useEffect(() => {
    if (shopManager) {
      setFormData({
        name: shopManager.name || "",
        categories: shopManager.categories || [],
        contact: shopManager.contact || {},
        slogan: shopManager.slogan || "",
        announcement: shopManager.announcement,
        heroImage: shopManager.heroImage || "",
      });
    }
  }, [shopManager]);

  const handleFormChange = (e, index = null, field = null) => {
    const { name, value } = e.target;

    if (index !== null && field === "categories") {
      const updatedCategories = [...formData.categories];
      updatedCategories[index] = value;
      setFormData({ ...formData, categories: updatedCategories });
    } else if (field === "contact") {
      setFormData({
        ...formData,
        contact: { ...formData.contact, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    console.log(formData)
  };

  const handleAddCategory = () => {
    setFormData((prevData) => ({
      ...prevData,
      categories: [...prevData.categories, ""],
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formData.categories.length === 0) {
      return toast.error("Phải có ít nhất một danh mục!");
    }
    if (uploading) {
      return toast.error("Đang tải lên ảnh, chưa thể lưu!");
    }
    dispatch(updateShopManager(formData));
  };

  const handleDeleteCategory = (index) => {
    const updatedCategories = formData.categories.filter((_, i) => i !== index);
    setFormData({ ...formData, categories: updatedCategories });
  };

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      const imagesData = new FormData();
      imagesData.append("image", file);
      setUploading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        imagesData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      console.log(data);
      setFormData((prevData) => ({
        ...prevData,
        heroImage: data.imageUrl,
      }));
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }
  return shopManager ? (
    <div className="flex flex-col h-full relative">
      <h1 className="text-3xl font-bold mb-6">Sửa thông tin cửa hàng</h1>
      <form
        className={`w-full p-3 rounded-lg shadow-lg font-semibold`}
        onSubmit={handleFormSubmit}
      >
        <div className="mb-4 w-full">
          <label className="text-lg text-gray-600 block mb-1">
            Tên cửa hàng
          </label>
          <input
            name="name"
            onChange={handleFormChange}
            value={formData.name}
            className="border-gray-600 border w-full p-2 rounded-lg"
            type="text"
            required
          />
        </div>
        <div className="mb-4 w-full">
          <label className="text-lg text-gray-600 block mb-1">Slogan</label>
          <textarea
            name="slogan"
            onChange={handleFormChange}
            value={formData.slogan}
            className="border-gray-600 border w-full p-2 rounded-lg"
            rows={2}
            required
          ></textarea>
        </div>
        <div className="mb-4 w-full">
          <label className="text-lg text-gray-600 block mb-1">Thông báo</label>
          <textarea
            name="announcement"
            onChange={handleFormChange}
            value={formData.announcement}
            className="border-gray-600 border w-full p-2 rounded-lg"
            rows={2}
            
          ></textarea>
        </div>
        <div className="mb-4 w-full">
          <label className="text-lg text-gray-600 block mb-1">Danh mục</label>
          {formData.categories.map((category, index) => (
            <div className="flex gap-2 py-2" key={index}>
              <div className="w-full">
                <label className="text-sm">Tên danh mục</label>
                <div className="flex gap-2">
                  <input
                    name="categories"
                    onChange={(e) => handleFormChange(e, index, "categories")}
                    value={category}
                    className="border-gray-600 border w-full p-2 rounded-lg"
                    type="text"
                    required
                  />
                  <button
                    onClick={() => handleDeleteCategory(index)}
                    type="button"
                    className="bg-gray-700 cursor-pointer text-white px-2 py-1 rounded-lg"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddCategory}
            className="bg-gray-700 cursor-pointer text-white px-2 py-1 rounded-lg mt-2"
          >
            Thêm danh mục
          </button>
        </div>
        <div className="mb-4 w-full">
          <label className="text-lg text-gray-600 block mb-1">Liên lạc</label>
          <div className="flex flex-col gap-2 py-2">
            <div className="w-full">
              <label className="text-sm" htmlFor="">
                Facebook
              </label>
              <div className="flex gap-2">
                <input
                  name="meta"
                    onChange={(e) => handleFormChange(e, null, "contact")}
                  value={formData.contact.meta}
                  className="border-gray-600 border w-full p-2 rounded-lg"
                  type="text"
                  
                />
              </div>
            </div>
            <div className="w-full">
              <label className="text-sm" htmlFor="">
                Instagram
              </label>
              <div className="flex gap-2">
                <input
                  name="instagram"
                    onChange={(e) => handleFormChange(e, null, "contact")}
                  value={formData.contact.instagram}
                  className="border-gray-600 border w-full p-2 rounded-lg"
                  type="text"
                  
                />
              </div>
            </div>
            <div className="w-full">
              <label className="text-sm" htmlFor="">
                Tiktok
              </label>
              <div className="flex gap-2">
                <input
                  name="tiktok"
                    onChange={(e) => handleFormChange(e, null, "contact")}
                  value={formData.contact.tiktok}
                  className="border-gray-600 border w-full p-2 rounded-lg"
                  type="text"
                  
                />
              </div>
            </div>
            <div className="w-full">
              <label className="text-sm" htmlFor="">
                X
              </label>
              <div className="flex gap-2">
                <input
                  name="x"
                    onChange={(e) => handleFormChange(e, null, "contact")}
                  value={formData.contact.x}
                  className="border-gray-600 border w-full p-2 rounded-lg"
                  type="text"
                  
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label className="text-sm text-gray-600 block mb-1">Ảnh Hero</label>
          <div className="w-fit flex gap-2 items-center">
            {uploading ? (
              <Loading />
            ) : (
              <label
                htmlFor="imageUpload"
                className="hover:bg-gray-500 transition-all duration-300 cursor-pointer text-sm text-white bg-gray-700 px-4 py-2 rounded-lg block mb-1"
              >
                Chọn ảnh
              </label>
            )}
          </div>
          <input
            hidden
            id="imageUpload"
            type="file"
            onChange={handleImageUpload}
          />
        </div>
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 w-full">
            <div className="w-30 aspect-square overflow-hidden relative">
              <img
                src={formData.heroImage}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>

          <input
            hidden
            id="imageUpload"
            type="file"
            onChange={handleImageUpload}
          />
        </div>

        <div className="mb-4 w-full flex gap-2">
          <button className="bg-blue-600 hover:bg-blue-500 transition-all duration-300 rounded-lg w-full py-2 text-white cursor-pointer">
            Lưu
          </button>
          <Link
            className="hover:border-black border-gray-400 transition-all duration-300 rounded-lg w-full py-2 border flex justify-center items-center"
            to="/admin/products"
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  ) : null;
};

export default ShopManager;
