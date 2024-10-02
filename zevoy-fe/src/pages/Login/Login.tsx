import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { Button, InputField, Logo } from "@components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin, useToast } from "@hooks";

export const loginSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const login = useLogin();

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      await login.mutateAsync(data);
      toast({
        title: "Success",
        description: "You have successfully logged in",
      });
      navigate("/app");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast({
            title: "Error",
            description: "Invalid email or password",
            variant: "destructive",
          });
          return;
        }
      }
      toast({
        title: "Error",
        description: "An error occurred. Please try again later",
        variant: "destructive",
      });
    }
  };

  const disabled = login.isPending || isSubmitting;

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex justify-center">
          <Logo width="80px" height="80px" />
        </div>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-white px-4 py-4 rounded-xl">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <InputField
            label="Email address"
            inputProps={{
              type: "email",
              ...register("email"),
              disabled,
            }}
            error={errors.email?.message}
          />
          <InputField
            label="Password"
            inputProps={{
              type: "password",
              ...register("password"),
              disabled,
            }}
            error={errors.password?.message}
          />

          <div className="text-center">
            <Button
              intent="fill"
              colorStyle="primary"
              type="submit"
              disabled={disabled}
            >
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
