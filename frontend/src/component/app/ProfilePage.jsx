import { useEffect, useState } from "react"
import api from "../services/api";

const ProfilePage = () => {
    const[profile, setProfile] = useState(null);

    useEffect(()=> {
        api.get("/auth/admin/dashboard")
        .then((res) => {
            console.log("Login Successful", res.data)
            setProfile(res.data);
    })
    .catch((err) => console.error("Error fetching profile:", err));
    }, []);

    if(!profile)
        return <p>Loading....</p>

    return(
        <div>
            <h2>User Profile</h2>
            <p><b>Name: </b> {profile.name} </p>
            <p><b>Email: </b>{profile.email}</p>
        </div>
    );
};
export default ProfilePage;