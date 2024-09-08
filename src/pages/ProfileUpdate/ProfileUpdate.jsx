import React, { useContext, useEffect, useState } from 'react';
import '../ProfileUpdate/ProfileUpdate.css';
import assets from '../../assets/assets';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import upload from '../../lib/upload';
import { AppContext } from '../../context/AppContext';

const ProfileUpdate = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const {setUserData} = useContext(AppContext)

  // Function to handle profile update
  const profileUpdate = async (event) => {
    event.preventDefault();
    
    try {
      if (!prevImage && !image) {
        toast.error("Upload Profile picture");
        return;
      }

      const docRef = doc(db, 'users', uid);
      let imgUrl = prevImage;

      if (image) {
        imgUrl = await upload(image); 
        setPrevImage(imgUrl);
      }

      
      await updateDoc(docRef, {
        avatar: imgUrl,
        bio: bio,
        name: name
      });
      const snap = await getDoc(docRef);
      setUserData(snap.data());
      navigate('/chat');
      toast.success("Profile updated successfully!");

      


    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  }

  // Fetching user data when component mounts
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setName(userData.name || "");
          setBio(userData.bio || "");
          setPrevImage(userData.avatar || assets.avatar_icon);
        } else {
          toast.error("No user data found!");
        }
      } else {
        navigate('/');
      }
    });
  }, [navigate]);

  return (
    <div className='profile'>
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile details</h3>
          <label htmlFor="avatar">
            <input 
              onChange={(e) => setImage(e.target.files[0])} 
              type="file" 
              id='avatar' 
              accept='.png, .jpg, .jpeg' 
              hidden 
            />
            <img 
              src={image ? URL.createObjectURL(image) : prevImage} 
              alt="Profile" 
            />
            Upload profile image
          </label>
          <input 
            onChange={(e) => setName(e.target.value)} 
            value={name} 
            type="text" 
            placeholder='Your name' 
            required 
          />
          <textarea 
            onChange={(e) => setBio(e.target.value)} 
            value={bio} 
            placeholder='Write profile bio' 
            required 
          />
          <button type="submit">Save</button>
        </form>
        <img className='profile-pic' src={image? URL.createObjectURL(image) : prevImage ? prevImage : assets.logo_icon} alt="" />
      </div>
    </div>
  );
}

export default ProfileUpdate;
