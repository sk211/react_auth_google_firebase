import './App.css';
import initialieAuthentication from './firebase/firebase.init'
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail,FacebookAuthProvider , updateProfile } from "firebase/auth";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button'
import { useState } from 'react';

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

initialieAuthentication()
function App() {
  const auth = getAuth();
  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then(result => {
        const user = result.user;
        console.log(user);
      })
  }
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLogin, setIsLogin] = useState(false)
  const handleEmailChage = e => {
    if (e.target.value) {
      setEmail(e.target.value)


    }
  }
  const handleRegester = (e) => {
    e.preventDefault()
    if (password.length < 6) {
      setError("password maust be at least 6 character long")

      return;
    }
    // if(! /(?:\d{3}|\(\d{3}\))([-\/\.])\d{3}\1\d{4}/.test(password)){
    //   setError("Password Must contain  2 uppercqase")
    //   return;

    // }
    const regesterUser = (email, password) => {
      createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          console.log(user);
          setError('')
          veryfyEmail()
          setName()
        })
        .catch(error => {
          setError(error.message)
        })
      console.log(email, password);
    }

    isLogin ? logingUser(email, password) : regesterUser(email, password)


  }

  const logingUser = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user
        console.log(user);
      })
      .catch(error => {
        setError(error.message)
      })
  }



  const handlePasswordCHange = e => {
    setPassword(e.target.value)
  }

  const toggleLogin = e => {
    setIsLogin(e.target.checked);
  }

  const veryfyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(result => {
        console.log(result);
      })
  }
  const heanldResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {

      })
  }
  const handleNameChange =e =>{
    setUserName(e.target.value)
    
  }
  
  const setUserName = () =>{
    updateProfile(auth.currentUser, {
      displayName: name
    }).then(result => {})

  }

  const handleFacebookSignIn = () =>{
    signInWithPopup(auth, facebookProvider)
    .then(result =>{
      const {displayName, photoURL, email} = result.user;
      console.log(result.user)
      const loggedInuser ={
        name:displayName,
        email:email,
        photo: photoURL
      }
    })
  }
  return (
    <div className="App offset-3 col-lg-4 mx-auto align-items -center">
      <h2>Plese {isLogin ? "Login" : "Regester"}</h2>
      <Form onSubmit={handleRegester}>
        {!isLogin && <Form.Group className="mb-3" controlId="formGroupEmail">
          <Form.Label>Email Name</Form.Label>
          <Form.Control type="name" placeholder="Enter your name" onBlur={handleNameChange}/>
        </Form.Group>}
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" required onBlur={handleEmailChage} placeholder="Enter email" />

        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" required placeholder="Password" onBlur={handlePasswordCHange} />
          <Form.Text className="text-warning">
            {error}
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="All Ready Register" onClick={toggleLogin} />
        </Form.Group>
        <Button variant="primary" type="submit">
          {isLogin ? "Login" : "Regester"}
        </Button>
      </Form>


      <Button variant="primary" type="submit" onClick={heanldResetPassword}>
        Reset Password
      </Button>
      <Button variant="primary" type="submit" onClick={handleGoogleSignIn}>
        Google login
      </Button>
      <Button variant="primary" type="submit" onClick={handleFacebookSignIn}>
        Facebook SingIn
      </Button>
    </div>
  );
}

export default App;
