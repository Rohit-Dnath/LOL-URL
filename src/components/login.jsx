import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { BeatLoader } from "react-spinners";
import Error from "./error";
import { IconPassword } from "@tabler/icons-react";
import * as Yup from "yup";


const Login = () => {
    


    const [errors, setErrors] = useState([]);

    const [FormData, setFormData] = useState({

        email: "",
        password: "",
        
    })


    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }


    const handleLogin = async (e) => {
        setErrors([]);
        try {
            const schema = Yup.object().shape({
                email: Yup.string().email("Invalid Email").required("Email is required"),
                password: Yup.string().min(6,"Password must be at least 6 character ").required("Password is required"),
            
            })
            await schema.validate(FormData, {abortEarly: false});

            
        } catch (e) {}
    }
    
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>to your account if you already have one</CardDescription>
      </CardHeader>
      <Error message={"error"} />
      <CardContent className="space-y-2">
        <div className="space-y-2 ">

           {/* <Input name="email" type="emial" placeholder="Enter your Email" /> */}
           <Input className="rounded" name="email" type="emial" placeholder="Enter your Email" onChange={handleInputChange}/>
           <Error message={"error"} />

        </div>
        <div className="space-y-2 ">

           {/* <Input name="email" type="emial" placeholder="Enter your Email" /> */}
           <Input className="rounded" name="password" type="password" placeholder="Enter your Password" onChange={handleInputChange}/>
           <Error message={"error"} />

        </div>
      </CardContent>
      <CardFooter>
        <Button className="rounded ">
            {true? <BeatLoader color="#36d7b7" size={8} /> : "Login"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Login
