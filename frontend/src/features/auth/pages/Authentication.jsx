import { useState, useEffect, useContext } from "react";
import { setToken } from "../../../service/localStorageService";
import { ShopContext } from "../../../context/ShopContext";
import axios from "axios";


export default function Authentication() {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const { navigate, backendurl, userDetails, getUserDetails } = useContext(ShopContext);

  useEffect(() => {
    console.log(window.location.href)
    const authTokenRegex = /code=([^&]+)/;
    // Regular expression(bieu thuc chinh quy): access_token= : tìm đúng chuỗi "access_token=" trong URL.
    //  ([^&]+) : lấy tất cả các ký tự sau dấu = cho đến khi gặp dấu & hoặc hết chuỗi.

    const isMatch = window.location.href.match(authTokenRegex);
    //window.location.href là toàn bộ URL hiện tại trên trình duyệt.
    // .match(regex) sẽ kiểm tra xem URL có khớp với regex accessTokenRegex hay không.

    if (isMatch) {
      const accessCode = isMatch[1];
      //Lấy phần tử thứ 1 trong mảng isMatch.
      //isMatch[0] = chuỗi đầy đủ "access_token=abc123xyz"
      //isMatch[1] = chỉ lấy token "abc123xyz"

      axios.post(
        backendurl + `/identity/auth/outbound/authentication?code=${accessCode}`
      ).then(async response => {
        const accessToken = response.data.result?.token;
        setToken(accessToken);
           const user = await getUserDetails(accessToken);
        if (user?.noPassword)
          navigate("/create-password");
        else {
          setIsLoggedin(true);
          navigate("/");
        }
      });
    }
  }, [backendurl, navigate]);

  useEffect(() => {
    if (isLoggedin) {
      navigate("/");
    }
  }, [isLoggedin, navigate]);

  return (
    <>
      <p>Authentication...</p>
    </>
  );
}