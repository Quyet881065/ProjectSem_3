import { useContext, useEffect, useState } from "react"
import { ShopContext } from "../../context/ShopContext";
import { getMyInfo } from "../../service/userService";
import { isAuthenticated } from "../../service/authenticationService";

export default function ProfileUser() {
    const [userDetails, setUserDetails] = useState({});
    const {navigate} = useContext(ShopContext);
    
    const getUserDetails = async()=>{
        const response = await getMyInfo();
        const data = response.data;
        setUserDetails(data.results);
        console.log("User Details:", data);
    }

    useEffect(()=>{
        if(!isAuthenticated){
            navigate("/login");
        }else{
            getUserDetails();
        }
    },[navigate])

    return (
        <div>
            {userDetails && (
                <div className="flex flex-col justify-center items-center my-20 ">
                    <div className="mb-10">
                        <h3 className="font-bold text-3xl">User Profile</h3>
                    </div>
                    <div className="border p-20 flex flex-col items-center gap-5 shadow-lg rounded-lg">
                        <img className="w-[120px] rounded-full" src={userDetails.avatar}/>
                        <p>{userDetails.username}</p>
                        <p>{userDetails.firstname}</p>
                    </div>
                </div>
            )}
        </div>
    )
}