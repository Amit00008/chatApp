
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, setDoc, doc, collection, query, where, getDocs, QueryDocumentSnapshot } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
    apiKey: "AIzaSyCY3vaKIRz86tzxkPfu9p8erx6v-UaQzjY",
    authDomain: "chatdrip-6d6d8.firebaseapp.com",
    projectId: "chatdrip-6d6d8",
    storageBucket: "chatdrip-6d6d8.appspot.com",
    messagingSenderId: "437083308972",
    appId: "1:437083308972:web:0f0aa89b7ee2c0871ef009"
  };

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);


const signup = async (username,email,password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth,email,password);
        const user = res.user;
        await setDoc(doc(db, "users", user.uid), {
            id:user.uid,
            username:username.toLowerCase(),
            email,
            name:"",
            avatar:"",
            bio:"hey there im using this app!",
            lastSeen: Date.now()
        });
        await setDoc(doc(db,"chats",user.uid),{
            chatData:[]
        });
    } catch (error) {
        console.error(error);
        toast.error(error.code.split("/")[1].split("-").join(" "));
    }
};

const Login = async (email,password) => {

    try {
        await signInWithEmailAndPassword(auth,email,password)
        
    } catch (error) {
      console.error(error);
      toast.error(error.code.split("/")[1].split("-").join(" "));  
    } 
}

const logout = async () => {
    try {

        await signOut(auth)
    } catch (error) {
        console.error(error);
      toast.error(error.code.split("/")[1].split("-").join(" ")); 
        
    }
    


}


const resetPass = async (email) => {
    if (!email) {
        toast.error("Please enter an email");
        return null;

    }
    try {
        const userRef = collection(db, 'users');
        const q = query(userRef,where("email","==",email));
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
            await sendPasswordResetEmail(auth,email);
            toast.success("Password reset email sent! check your inbox");
            
        }
        else {
            toast.error("No user found with this email");
        }
    } catch (error) {
        console.error(error);
        toast.error(error.message)
    }
}

export {signup,Login,logout,auth,db,resetPass}
