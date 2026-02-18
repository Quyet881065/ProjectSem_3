import { useContext, useState } from "react"
import { ShopContext } from "../../../context/ShopContext"
import { getToken } from "../../../service/localStorageService"
import axios from "axios"


const CreatePassword = () => {
    const [password, setPassword] = useState("")
    const { backendurl, getUserDetails,navigate } = useContext(ShopContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = getToken();
             const trimmedPassword = password.trim();
            const response = await axios.post(backendurl + "/identity/users/create-password", { password: trimmedPassword }  // JSON object
                , {
                    headers: { Authorization: `Bearer ${token}` },  
                });
            if (response.data.code == 0) {
               await getUserDetails(token);
                navigate("/");
                console.log("Password created successfully");
            }
        } catch (error) {
            if (error.response?.data?.message) {    
                alert(error.response.data.message);
            } else {
                console.log("Error creating password: ", error);
            }
        }
    }

    return (
        <div className="my-[70px]">
            <form className="flex flex-col items-center border max-w-xl m-auto p-40 bg-slate-50 shadow-xl " onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6 w-full">
                    <h2>Create Passwork</h2>
                    <input type="password" value={password} placeholder="Password"
                        className="p-2 w-full border focus:outline-none" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="bg-blue-500 text-white mt-10 px-[60px] py-3">Create Password</button>
            </form>
        </div>
    )
}

export default CreatePassword