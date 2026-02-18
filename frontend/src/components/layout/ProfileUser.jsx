import { useContext, useEffect, useState } from "react"
import { ShopContext } from "../../context/ShopContext";
//import { getMyInfo } from "../../service/userService";
import { isAuthenticated } from "../../features/auth/service/authenticationService.js";

export default function ProfileUser() {
   // const [userDetails, setUserDetails] = useState({});
    const { navigate, userProfile } = useContext(ShopContext);

    // const getUserDetails = async () => {
    //     const response = await getMyInfo();
    //     const data = response.data;
    //     setUserDetails(data.results);
    //     console.log("User Details:", data);
    // }

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        } else {
            //getUserDetails();
        }
    }, [navigate])
    console.log("User Profile in Component:", userProfile);

    return (
        <div>
            {userProfile && (
                <div className="flex flex-col justify-center items-center my-20 ">
                    <div className="mb-10">
                        <h3 className="font-bold text-3xl">User Profile</h3>
                    </div>
                    <div className="border p-20 flex flex-col items-center gap-5 shadow-lg rounded-lg">
                        <img
                            className="w-[120px] rounded-full"
                            src={userProfile.avatar ? userProfile.avatar : `https://ui-avatars.com/api/?name=${userProfile.username}&background=random`}
                            alt="User Avatar"
                        />
                        <p className="text-xl font-medium">User name : {userProfile.userName}</p>
                        <p className="text-xl font-medium">Full name : {userProfile.fullName}</p>
                        <p className="text-xl font-medium">Email : {userProfile.email}</p>
                    </div>
                </div>
            )}
        </div>
    )
}