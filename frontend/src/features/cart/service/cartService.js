
import axios from "axios";
import { getToken } from "../../../service/localStorageService";

const getAuthHeaders = () => {
  const token = getToken();
  return { headers: { token } };
};

// Cập nhật số lượng sản phẩm
export const updateCartItem = async (backendurl, itemId, newQuantity) => {
  return axios.put(
    `${backendurl}/api/Carts`,
    [{ cartId: itemId, quantity: newQuantity }],
    getAuthHeaders()
  );
};

// Xóa sản phẩm khỏi giỏ
export const deleteCartItem = async (backendurl, itemId) => {
  return axios.delete(`${backendurl}/api/Carts/${itemId}`, getAuthHeaders());
};
