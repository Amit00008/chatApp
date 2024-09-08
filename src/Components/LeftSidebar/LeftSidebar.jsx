import React, { useContext, useState } from "react";
import "../LeftSidebar/LeftSidebar.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { logout } from '../../config/firebase'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { AppContext } from "../../context/AppContext";
import { arrayUnion } from "firebase/firestore";
import { toast } from "react-toastify";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { userData, chatData, chatUser,setChatUser,setMessagesId, messagesId, chatVisible, setChatVisible} = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);
  
        // Check if the user exists and is not the current user
        if (!querySnap.empty && querySnap.docs[0].id !== userData.id) {
          const queriedUser = querySnap.docs[0].data();
  
          // Check if the user is already in chatData to avoid duplicates
          const userExist = chatData.some((chat) => chat.rId === queriedUser.id);
  
          // If the user doesn't already exist in chatData, set the user
          if (!userExist) {
            setUser(queriedUser);
          } else {
            setUser(null); // Clear the search if the user already exists in chat
          }
        } else {
          setUser(null); // No user found or user is the current user
        }
      } else {
        setShowSearch(false); // Hide search if input is cleared
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  const addChat = async () => {
    const messagesRef = collection(db, "messages");
    const chatRef = collection(db, "chats");

    try {
      // Create a new message document
      const newMessageRef = doc(messagesRef);
      await setDoc(newMessageRef, {
        createAt: serverTimestamp(),
        messages: [],
      });

      // Check if the chat document for the clicked user exists
      const userChatDoc = doc(chatRef, user.id);
      const userChatSnap = await getDoc(userChatDoc);

      if (userChatSnap.exists()) {
        // Update the existing document
        await updateDoc(userChatDoc, {
          chatData: arrayUnion({
            messageId: newMessageRef.id,
            lastMessage: "",
            rId: userData.id,
            updatedAt: Date.now(),
            messageSeen: true,
          }),
        });
      } else {
        // Create the document if it doesn't exist
        await setDoc(userChatDoc, {
          chatData: arrayUnion({
            messageId: newMessageRef.id,
            lastMessage: "",
            rId: userData.id,
            updatedAt: Date.now(),
            messageSeen: true,
          }),
        });
      }

      // Check if the chat document for the current user exists
      const currentUserChatDoc = doc(chatRef, userData.id);
      const currentUserChatSnap = await getDoc(currentUserChatDoc);

      if (currentUserChatSnap.exists()) {
        // Update the existing document
        await updateDoc(currentUserChatDoc, {
          chatData: arrayUnion({
            messageId: newMessageRef.id,
            lastMessage: "",
            rId: user.id,
            updatedAt: Date.now(),
            messageSeen: true,
          }),
        });
      } else {
        // Create the document if it doesn't exist
        await setDoc(currentUserChatDoc, {
          chatData: arrayUnion({
            messageId: newMessageRef.id,
            lastMessage: "",
            rId: user.id,
            updatedAt: Date.now(),
            messageSeen: true,
          }),
        });
      }
    } catch (error) {
      console.log("Error updating chat data:", error);
    }
    
  

  };


// to show the user messages on chat box

const setChat = async (item) => {

   
    try {
      setMessagesId(item.messageId);
      setChatUser(item)
  
      setChatVisible(true);
  
    } catch (error) {
      toast.error(error.message);
    }

}



  return (
    <div className={`ls ${chatVisible}? "hiddden" : ""`}>
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} className="logo" alt="" />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className="sub-menu">
              <p onClick={() => navigate("/profile")}>edit profile</p>
              <hr />
              <p onClick={logout}>Logout</p>
            </div>
          </div>
          <div className="ls-search">
            <img src={assets.search_icon} alt="" />
            <input
              onChange={inputHandler}
              type="text"
              placeholder="Search here"
            />
          </div>
        </div>
      </div>
      <div className="ls-list">
  {showSearch && user ? (
    <div onClick={addChat} className="freinds add-user">
      <img src={user.avatar} alt="" />
      <p>{user.name}</p>
    </div>
  ) : (
    chatData && chatData.length > 0 ? (
      chatData.map((item, index) => (
        <div onClick={()=>setChat(item)} key={index} className="freinds">
          <img src={item.userData.avatar} alt="" />
          <div>
            <p>{item.userData.name}</p>
            <span>{item.userData.bio}</span>
          </div>
        </div>
      ))
    ) : (
      <p>No chats available</p>
    )
  )}
</div>
      </div>
    
  );
};

export default LeftSidebar;
