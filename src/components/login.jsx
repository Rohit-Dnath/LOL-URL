import React, { useEffect, useState } from "react";
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
import useFetch from "@/hooks/use-fetch";
import { login } from "@/db/apiAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UrlState } from "@/context";
import supabase from "@/db/supabase";

const Login = () => {
    const [errors, setErrors] = useState([]);

    const [FormData, setFormData] = useState({

        email: "",
        password: "",
        
    })

    const navigate = useNavigate();
    let [SearchParams] =useSearchParams();
    const longLink = SearchParams.get( "createNew");


    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }

    const{data, error, loading, fn:fnlogin} =useFetch(login, FormData);
    const {fetchUser} =UrlState();


    useEffect(() => {

        console.log(data)

        if(error==null && data){

            navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
            fetchUser();


        }
    
    }, [data, error, ]); 
    


    const handleLogin = async (e) => {
        setErrors([]);
        try {
            const schema = Yup.object().shape({
                email: Yup.string().email("Invalid Email").required("Email is required"),
                password: Yup.string().min(6,"Password must be at least 6 character ").required("Password is required"),
            
            })
            await schema.validate(FormData, {abortEarly: false});

            //api calllll
            await fnlogin();





        } catch (e) {
            const newErrors = {};
            e?.inner?.forEach((err)=> {
                newErrors [err. path] = err.message;
            });
            setErrors(newErrors);
        }
    }
    
     const handleGoogleLogin = async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/callback`,
        }
      });
      

      if (error) {
        console.error("Google login error:", error.message);
      }
    };  

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription className="m-0">to your account if you already have one</CardDescription>
      </CardHeader>
      {error && <Error message={error.message} />}
      <CardContent className="space-y-2">
        <div className="space-y-2 ">

           {/* <Input name="email" type="emial" placeholder="Enter your Email" /> */}
           <Input className="rounded" name="email" type="emial" placeholder="Enter Email" onChange={handleInputChange}/>
           {errors.email && <Error message={errors.email} />}

        </div>
        <div className="space-y-2 ">

           {/* <Input name="email" type="emial" placeholder="Enter your Email" /> */}
           <Input className="rounded" name="password" type="password" placeholder="Enter Password" onChange={handleInputChange}/>
           {errors.password && <Error message={errors.password} />}

        </div>
      </CardContent>
      <CardFooter>
        <Button className="rounded" onClick={handleLogin}  >
            {loading? <BeatLoader color="#8884d8" size={8} /> : "Login"}

            {/* <BeatLoader color="#8884d8" size={8} /> : "Login"} */}
            </Button>
              <div className="w-full flex items-center justify-center gap-2">
                     <span className="text-sm text-muted-foreground">or</span>
              </div>

              <Button variant="outline" className="rounded w-full" onClick={handleGoogleLogin}>
                Continue with Google
              </Button>
      </CardFooter>
    </Card>
  );
};

export default Login
